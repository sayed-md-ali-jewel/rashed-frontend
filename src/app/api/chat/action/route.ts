import { NextResponse, type NextRequest } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { ConversationModel, MessageModel } from "@/lib/models";
import { emitToConversation, emitToDoctor, emitToPatient } from "@/lib/socket-server";

function isAdmin(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "active";
}

export async function POST(request: NextRequest) {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  // Doctor/Admin authorization is strictly required for approval/rejection/status actions
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized: Doctor/Admin access required" }, { status: 401 });
  }

  await connectMongo();

  try {
    const body = await request.json();
    const { conversationId, action, reason } = body;

    if (!conversationId || !action) {
      return NextResponse.json({ error: "conversationId and action are required" }, { status: 400 });
    }

    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const now = new Date();

    if (action === "approve") {
      conversation.status = "active";
      conversation.approvedAt = now;
      await conversation.save();

      // Automatically add an approval notification message
      const systemMsg = await MessageModel.create({
        conversationId: conversation._id,
        senderId: "system",
        senderType: "doctor",
        senderName: conversation.doctorName || "Dr. Md. Rashedul Alam",
        message: "Hello! Your request has been approved. How can I help you today?",
        status: "delivered",
        deliveredAt: now
      });

      conversation.lastMessage = systemMsg.message;
      conversation.lastMessageAt = now;
      conversation.unreadCountPatient = (conversation.unreadCountPatient || 0) + 1;
      await conversation.save();

      const systemMsgObj = {
        _id: String(systemMsg._id),
        conversationId: String(conversation._id),
        senderId: "system",
        senderType: "doctor" as const,
        senderName: conversation.doctorName || "Dr. Md. Rashedul Alam",
        message: systemMsg.message,
        attachments: [],
        status: "delivered" as const,
        deliveredAt: now.toISOString(),
        createdAt: now.toISOString()
      };

      // Broadcast real-time approval event to patient and doctor
      const payload = {
        conversation,
        systemMessage: systemMsgObj,
        status: "active"
      };

      emitToConversation(String(conversation._id), "conversation:approved", payload);
      emitToPatient(conversation.patientPhone, "conversation:approved", payload);
      emitToDoctor("conversation:updated", payload);

      return NextResponse.json({ ok: true, conversation, message: systemMsgObj });
    }

    if (action === "reject") {
      conversation.status = "rejected";
      conversation.rejectedAt = now;
      await conversation.save();

      const payload = {
        conversation,
        status: "rejected",
        reason: reason || "Request declined by doctor"
      };

      emitToConversation(String(conversation._id), "conversation:rejected", payload);
      emitToPatient(conversation.patientPhone, "conversation:rejected", payload);
      emitToDoctor("conversation:updated", payload);

      return NextResponse.json({ ok: true, conversation });
    }

    if (action === "close") {
      conversation.status = "closed";
      conversation.closedAt = now;
      await conversation.save();

      const payload = { conversation, status: "closed" };
      emitToConversation(String(conversation._id), "conversation:closed", payload);
      emitToPatient(conversation.patientPhone, "conversation:closed", payload);
      emitToDoctor("conversation:updated", payload);

      return NextResponse.json({ ok: true, conversation });
    }

    if (action === "block") {
      conversation.status = "blocked";
      conversation.blockedAt = now;
      await conversation.save();

      const payload = { conversation, status: "blocked" };
      emitToConversation(String(conversation._id), "conversation:blocked", payload);
      emitToPatient(conversation.patientPhone, "conversation:blocked", payload);
      emitToDoctor("conversation:updated", payload);

      return NextResponse.json({ ok: true, conversation });
    }

    if (action === "reopen") {
      conversation.status = "active";
      await conversation.save();

      const payload = { conversation, status: "active" };
      emitToConversation(String(conversation._id), "conversation:approved", payload);
      emitToPatient(conversation.patientPhone, "conversation:approved", payload);
      emitToDoctor("conversation:updated", payload);

      return NextResponse.json({ ok: true, conversation });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error executing conversation action:", error);
    return NextResponse.json({ error: error.message || "Failed to update conversation" }, { status: 500 });
  }
}
