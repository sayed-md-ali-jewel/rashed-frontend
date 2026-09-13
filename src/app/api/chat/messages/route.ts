import { NextResponse, type NextRequest } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { ConversationModel, MessageModel, WebsiteSettingModel } from "@/lib/models";
import { emitToConversation, emitToDoctor, emitToPatient } from "@/lib/socket-server";

function getPatientFromCookie(request: NextRequest): { fullName: string; mobileNumber: string } | null {
  const cookie = request.cookies.get("patient_session")?.value;
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function isAdmin(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "active";
}

export async function GET(request: NextRequest) {
  if (!hasMongoUri()) {
    return NextResponse.json({ messages: [], conversation: null });
  }

  await connectMongo();

  const isDocAdmin = isAdmin(request);
  const patient = getPatientFromCookie(request);
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  const requestedViewer = searchParams.get("viewer"); // "doctor" | "patient"

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  if (!isDocAdmin && !patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Security check: patient can only view their own conversation
    if (!isDocAdmin && patient && conversation.patientPhone !== patient.mobileNumber) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await MessageModel.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read by recipient
    let viewerType: "doctor" | "patient";
    if (requestedViewer === "doctor" && isDocAdmin) {
      viewerType = "doctor";
    } else if (requestedViewer === "patient") {
      viewerType = "patient";
    } else {
      viewerType = isDocAdmin ? "doctor" : "patient";
    }

    const unreadMessages = messages.filter(
      (m: any) => m.senderType !== viewerType && m.status !== "read"
    );

    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map((m: any) => m._id);
      await MessageModel.updateMany(
        { _id: { $in: unreadIds } },
        { $set: { status: "read", readAt: new Date() } }
      );

      // Reset unread count on conversation
      if (viewerType === "doctor") {
        conversation.unreadCountDoctor = 0;
      } else {
        conversation.unreadCountPatient = 0;
      }
      await conversation.save();

      // Broadcast read receipt
      emitToConversation(conversationId, "message:read", {
        conversationId,
        readBy: viewerType,
        messageIds: unreadIds,
        readAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ conversation, messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  await connectMongo();

  const isDocAdmin = isAdmin(request);
  const patient = getPatientFromCookie(request);

  if (!isDocAdmin && !patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { conversationId, message, attachments, senderType: reqSenderType, senderName: reqSenderName } = body;

    if (!conversationId || (!message?.trim() && (!attachments || attachments.length === 0))) {
      return NextResponse.json(
        { error: "conversationId and message content are required" },
        { status: 400 }
      );
    }

    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Security check
    if (!isDocAdmin && patient && conversation.patientPhone !== patient.mobileNumber) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Determine sender type
    let senderType: "doctor" | "patient";
    if (reqSenderType === "doctor") {
      if (!isDocAdmin) {
        return NextResponse.json({ error: "Unauthorized to send as doctor" }, { status: 403 });
      }
      senderType = "doctor";
    } else if (reqSenderType === "patient") {
      senderType = "patient";
    } else {
      senderType = isDocAdmin ? "doctor" : "patient";
    }

    // Check if patient messaging is disabled
    if (senderType === "patient") {
      const setting = await WebsiteSettingModel.findOne().lean<any>();
      if (setting && setting.enablePatientChat === false) {
        return NextResponse.json(
          { error: "Doctor-patient chat is currently disabled by the doctor." },
          { status: 403 }
        );
      }
    }

    // STRICT BACKEND STATUS ENFORCEMENT
    if (conversation.status === "pending") {
      return NextResponse.json(
        {
          error: "Conversation is pending doctor approval. Normal messaging is locked until approved.",
          status: "pending"
        },
        { status: 403 }
      );
    }

    if (conversation.status === "closed" || conversation.status === "blocked" || conversation.status === "rejected") {
      return NextResponse.json(
        {
          error: `This conversation has been ${conversation.status}. New messages cannot be sent.`,
          status: conversation.status
        },
        { status: 403 }
      );
    }

    // Conversation is ACTIVE -> proceed
    const senderName = senderType === "doctor"
      ? (conversation.doctorName || "Dr. Md. Rashedul Alam")
      : (reqSenderName || conversation.patientName || "Patient");
    const senderId = senderType === "doctor"
      ? "doctor_admin"
      : (conversation.patientPhone || patient?.mobileNumber || "patient");

    const newMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderId,
      senderType,
      senderName,
      message: message ? message.trim() : "",
      attachments: attachments || [],
      status: "delivered",
      deliveredAt: new Date()
    });

    // Update conversation meta
    conversation.lastMessage = message?.trim() || "Sent an attachment";
    conversation.lastMessageAt = new Date();
    conversation.lastSenderType = senderType;

    if (senderType === "patient") {
      conversation.unreadCountDoctor = (conversation.unreadCountDoctor || 0) + 1;
    } else {
      conversation.unreadCountPatient = (conversation.unreadCountPatient || 0) + 1;
    }
    await conversation.save();

    // Format message object for socket and JSON response
    const messageObj = {
      _id: String(newMessage._id),
      conversationId: String(conversation._id),
      senderId,
      senderType,
      senderName,
      message: newMessage.message,
      attachments: newMessage.attachments || [],
      status: newMessage.status,
      deliveredAt: newMessage.deliveredAt ? new Date(newMessage.deliveredAt).toISOString() : new Date().toISOString(),
      createdAt: newMessage.createdAt ? new Date(newMessage.createdAt).toISOString() : new Date().toISOString()
    };

    // Broadcast real-time message event to conversation room and recipient
    const messageData = {
      conversationId: String(conversation._id),
      message: messageObj
    };

    emitToConversation(String(conversation._id), "message:new", messageData);

    if (senderType === "patient") {
      emitToDoctor("message:new", messageData);
    } else {
      emitToPatient(conversation.patientPhone, "message:new", messageData);
    }

    return NextResponse.json({ message: messageObj, conversation }, { status: 201 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
