import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";

declare global {
  // eslint-disable-next-line no-var
  var _socketIo: SocketIOServer | undefined;
  // eslint-disable-next-line no-var
  var _onlineUsers: Map<string, { role: "patient" | "doctor"; lastSeen: Date; socketId: string }> | undefined;
}

if (!globalThis._onlineUsers) {
  globalThis._onlineUsers = new Map();
}

export function getSocketServer(): SocketIOServer | undefined {
  return globalThis._socketIo;
}

export function initSocketServer(server: HTTPServer): SocketIOServer {
  if (globalThis._socketIo) {
    return globalThis._socketIo;
  }

  const io = new SocketIOServer(server, {
    path: "/api/socket/io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    pingTimeout: 20000,
    pingInterval: 10000
  });

  globalThis._socketIo = io;

  io.on("connection", (socket: Socket) => {
    // 1. User authentication / join presence
    socket.on("user:join", (data: { userId?: string; role: "patient" | "doctor"; phone?: string; name?: string }) => {
      if (!data) return;
      const userKey = data.role === "doctor" ? "doctor" : (data.phone || data.userId || socket.id);
      
      globalThis._onlineUsers?.set(userKey, {
        role: data.role,
        lastSeen: new Date(),
        socketId: socket.id
      });

      if (data.role === "doctor") {
        socket.join("room_doctor");
      } else {
        socket.join(`room_patient_${userKey}`);
        if (data.phone && String(data.phone) !== String(userKey)) {
          socket.join(`room_patient_${data.phone}`);
        }
      }

      // Broadcast online presence
      io.emit("user:online", { userKey, role: data.role, lastSeen: new Date().toISOString() });
    });

    // 2. Join specific conversation room
    socket.on("conversation:join", (conversationId: string) => {
      if (!conversationId) return;
      socket.join(`room_conv_${String(conversationId)}`);
    });

    // 3. Leave conversation room
    socket.on("conversation:leave", (conversationId: string) => {
      if (!conversationId) return;
      socket.leave(`room_conv_${String(conversationId)}`);
    });

    // 4. Typing indicator
    socket.on("typing:start", (data: { conversationId: string; senderType: "patient" | "doctor"; senderName?: string }) => {
      if (!data?.conversationId) return;
      const convId = String(data.conversationId);
      socket.to(`room_conv_${convId}`).emit("typing:start", data);
      if (data.senderType === "patient") {
        socket.to("room_doctor").emit("typing:start", data);
      }
    });

    socket.on("typing:stop", (data: { conversationId: string; senderType: "patient" | "doctor" }) => {
      if (!data?.conversationId) return;
      const convId = String(data.conversationId);
      socket.to(`room_conv_${convId}`).emit("typing:stop", data);
      if (data.senderType === "patient") {
        socket.to("room_doctor").emit("typing:stop", data);
      }
    });

    // 5. Message Read Receipt
    socket.on("message:read", (data: { conversationId: string; readBy: "patient" | "doctor"; messageIds?: string[] }) => {
      if (!data?.conversationId) return;
      io.to(`room_conv_${data.conversationId}`).emit("message:read", {
        ...data,
        readAt: new Date().toISOString()
      });
    });

    // 6. Disconnect
    socket.on("disconnect", () => {
      if (!globalThis._onlineUsers) return;
      for (const [key, val] of globalThis._onlineUsers.entries()) {
        if (val.socketId === socket.id) {
          const lastSeen = new Date();
          globalThis._onlineUsers.delete(key);
          io.emit("user:offline", { userKey: key, role: val.role, lastSeen: lastSeen.toISOString() });
          break;
        }
      }
    });
  });

  return io;
}

export function emitToConversation(conversationId: string, event: string, data: any) {
  const io = getSocketServer();
  if (io) {
    io.to(`room_conv_${conversationId}`).emit(event, data);
  }
}

export function emitToDoctor(event: string, data: any) {
  const io = getSocketServer();
  if (io) {
    io.to("room_doctor").emit(event, data);
  }
}

export function emitToPatient(patientPhoneOrId: string, event: string, data: any) {
  const io = getSocketServer();
  if (io) {
    io.to(`room_patient_${patientPhoneOrId}`).emit(event, data);
  }
}

export function broadcastSocketEvent(event: string, data: any) {
  const io = getSocketServer();
  if (io) {
    io.emit(event, data);
  }
}

export function isUserOnline(userKey: string): { isOnline: boolean; lastSeen?: string } {
  const user = globalThis._onlineUsers?.get(userKey);
  if (user) {
    return { isOnline: true, lastSeen: user.lastSeen.toISOString() };
  }
  return { isOnline: false };
}
