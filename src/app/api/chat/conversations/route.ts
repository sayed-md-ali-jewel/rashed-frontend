import { NextResponse, type NextRequest } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { ConversationModel, DoctorModel, MessageModel, PatientModel, WebsiteSettingModel } from "@/lib/models";
import { emitToDoctor, emitToPatient } from "@/lib/socket-server";

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
    return NextResponse.json({ conversations: [], requests: [] });
  }

  await connectMongo();

  const isDocAdmin = isAdmin(request);
  const patient = getPatientFromCookie(request);
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  if (!isDocAdmin && !patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query: any = {};

    if (isDocAdmin) {
      if (statusFilter && statusFilter !== "all") {
        query.status = statusFilter;
      }
    } else if (patient) {
      query.patientPhone = patient.mobileNumber;
      if (statusFilter && statusFilter !== "all") {
        query.status = statusFilter;
      }
    }

    const conversations = await ConversationModel.find(query)
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    // If doctor/admin, also return pending requests separately for quick summary
    const pendingCount = await ConversationModel.countDocuments({ status: "pending" });
    const activeCount = await ConversationModel.countDocuments({ status: "active" });

    return NextResponse.json({
      conversations,
      stats: {
        pending: pendingCount,
        active: activeCount,
        total: conversations.length
      }
    });
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  await connectMongo();

  try {
    // Check if patient chat feature is enabled by the doctor
    const setting = await WebsiteSettingModel.findOne().lean<any>();
    if (setting && setting.enablePatientChat === false) {
      return NextResponse.json(
        { error: "Doctor-patient chat is currently disabled by the doctor." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { patientName, patientPhone, message, doctorId } = body;

    const cookiePatient = getPatientFromCookie(request);
    const finalPhone = cookiePatient?.mobileNumber || patientPhone;
    const finalName = cookiePatient?.fullName || patientName || "Patient";

    if (!finalPhone || !message?.trim()) {
      return NextResponse.json(
        { error: "Mobile number and initial message are required" },
        { status: 400 }
      );
    }

    // 1. Get or create patient record
    let patientRecord = await PatientModel.findOne({ mobileNumber: finalPhone });
    if (!patientRecord) {
      patientRecord = await PatientModel.create({
        fullName: finalName,
        mobileNumber: finalPhone
      });
    }

    // 2. Get doctor details
    let doctor = doctorId ? await DoctorModel.findById(doctorId) : await DoctorModel.findOne();
    if (!doctor) {
      doctor = {
        _id: undefined,
        name: "Dr. Md. Rashedul Alam",
        image: ""
      };
    }

    // 3. Check for existing conversation (prevent duplicate conversations!)
    let conversation = await ConversationModel.findOne({
      $or: [
        { patientPhone: finalPhone },
        { patientId: patientRecord._id }
      ]
    });

    if (conversation) {
      // If conversation already exists:
      // If active -> add new message
      // If pending -> update first message / note
      // If rejected / closed -> return existing conversation state
      if (conversation.status === "active") {
        const newMessage = await MessageModel.create({
          conversationId: conversation._id,
          senderId: String(patientRecord._id),
          senderType: "patient",
          senderName: finalName,
          message: message.trim(),
          status: "sent"
        });

        conversation.lastMessage = message.trim();
        conversation.lastMessageAt = new Date();
        conversation.lastSenderType = "patient";
        conversation.unreadCountDoctor = (conversation.unreadCountDoctor || 0) + 1;
        await conversation.save();

        const messageObj = {
          _id: String(newMessage._id),
          conversationId: String(conversation._id),
          senderId: String(patientRecord._id),
          senderType: "patient" as const,
          senderName: finalName,
          message: newMessage.message,
          attachments: [],
          status: "sent" as const,
          createdAt: newMessage.createdAt ? new Date(newMessage.createdAt).toISOString() : new Date().toISOString()
        };

        emitToDoctor("message:new", {
          conversationId: String(conversation._id),
          message: messageObj
        });

        const res = NextResponse.json({ conversation, message: messageObj });
        if (!cookiePatient) {
          res.cookies.set(
            "patient_session",
            Buffer.from(JSON.stringify({ fullName: finalName, mobileNumber: finalPhone })).toString("base64url"),
            {
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              path: "/",
              maxAge: 60 * 60 * 24 * 30
            }
          );
        }
        return res;
      }

      const res = NextResponse.json({
        conversation,
        message: "Existing conversation found",
        isExisting: true
      });
      if (!cookiePatient) {
        res.cookies.set(
          "patient_session",
          Buffer.from(JSON.stringify({ fullName: finalName, mobileNumber: finalPhone })).toString("base64url"),
          {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30
          }
        );
      }
      return res;
    }

    // 4. Create new conversation with status 'pending' (first message requires doctor approval)
    conversation = await ConversationModel.create({
      patientId: patientRecord._id,
      doctorId: doctor._id,
      status: "pending",
      patientName: finalName,
      patientPhone: finalPhone,
      patientAvatar: "",
      doctorName: doctor.name || "Dr. Md. Rashedul Alam",
      doctorAvatar: doctor.image || "",
      firstMessage: message.trim(),
      lastMessage: message.trim(),
      lastMessageAt: new Date(),
      lastSenderType: "patient",
      unreadCountDoctor: 1,
      unreadCountPatient: 0
    });

    // 5. Create initial Message record
    const initialMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderId: String(patientRecord._id),
      senderType: "patient",
      senderName: finalName,
      message: message.trim(),
      status: "sent"
    });

    const initialMessageObj = {
      _id: String(initialMessage._id),
      conversationId: String(conversation._id),
      senderId: String(patientRecord._id),
      senderType: "patient" as const,
      senderName: finalName,
      message: initialMessage.message,
      attachments: [],
      status: "sent" as const,
      createdAt: initialMessage.createdAt ? new Date(initialMessage.createdAt).toISOString() : new Date().toISOString()
    };

    // 6. Broadcast real-time event to Doctor/Admin
    emitToDoctor("conversation:request", {
      conversation,
      message: initialMessageObj
    });

    // Also set patient session cookie if not set
    const response = NextResponse.json({ conversation, message: initialMessageObj }, { status: 201 });
    if (!cookiePatient) {
      response.cookies.set(
        "patient_session",
        Buffer.from(JSON.stringify({ fullName: finalName, mobileNumber: finalPhone })).toString("base64url"),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30
        }
      );
    }

    return response;
  } catch (error: any) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: error.message || "Failed to create conversation" }, { status: 500 });
  }
}
