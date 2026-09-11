"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Route } from "next";
import { io, Socket } from "socket.io-client";

export type ConversationStatus = "pending" | "active" | "closed" | "blocked" | "rejected";

export type ChatMessage = {
  _id: string;
  conversationId: string;
  senderId: string;
  senderType: "patient" | "doctor";
  senderName: string;
  message: string;
  attachments?: Array<{ url: string; fileType?: string; fileName?: string; fileSize?: number }>;
  status: "sent" | "delivered" | "read";
  readAt?: string;
  deliveredAt?: string;
  createdAt: string;
};

export type Conversation = {
  _id: string;
  patientId: string;
  doctorId?: string;
  status: ConversationStatus;
  approvedAt?: string;
  rejectedAt?: string;
  closedAt?: string;
  patientName: string;
  patientPhone: string;
  patientAvatar?: string;
  doctorName: string;
  doctorAvatar?: string;
  firstMessage?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastSenderType?: "patient" | "doctor";
  unreadCountDoctor: number;
  unreadCountPatient: number;
  createdAt: string;
  updatedAt: string;
};

type ChatContextType = {
  socket: Socket | null;
  isConnected: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openChatWithDoctor: () => void;
  enablePatientChat: boolean;
  setEnablePatientChat: (enabled: boolean) => void;
  isPatientLoggedIn: boolean;
  userPhone?: string;
  userName?: string;
  setPatientSession: (session: { fullName?: string; mobileNumber?: string } | null) => void;
  logoutPatient: () => Promise<void>;
  checkPatientAuth: () => Promise<boolean>;
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  messages: ChatMessage[];
  loadingMessages: boolean;
  isDoctorOnline: boolean;
  isPatientOnline: boolean;
  doctorTyping: boolean;
  patientTyping: boolean;
  unreadCount: number;
  pendingRequestsCount: number;
  conversationsList: Conversation[];
  fetchConversations: (status?: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (text: string, attachments?: any[]) => Promise<ChatMessage | null>;
  sendInitialRequest: (data: { name: string; phone: string; message: string }) => Promise<{ conversation: Conversation; message: ChatMessage } | null>;
  approveRequest: (conversationId: string) => Promise<boolean>;
  rejectRequest: (conversationId: string, reason?: string) => Promise<boolean>;
  closeConversation: (conversationId: string) => Promise<boolean>;
  sendTyping: (isTyping: boolean, senderType: "patient" | "doctor") => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  userRole = "patient",
  userPhone,
  userName,
  initialEnablePatientChat = true
}: {
  children: React.ReactNode;
  userRole?: "patient" | "doctor";
  userPhone?: string;
  userName?: string;
  initialEnablePatientChat?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [enablePatientChat, setEnablePatientChat] = useState(initialEnablePatientChat);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isDoctorOnline, setIsDoctorOnline] = useState(true);
  const [isPatientOnline, setIsPatientOnline] = useState(false);
  const [doctorTyping, setDoctorTyping] = useState(false);
  const [patientTyping, setPatientTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [conversationsList, setConversationsList] = useState<Conversation[]>([]);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | undefined>(userPhone);
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(userName);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeConvIdRef = useRef<string | null>(null);
  activeConvIdRef.current = activeConversation?._id ? String(activeConversation._id) : null;

  // Sync prop changes to internal state
  useEffect(() => {
    setCurrentUserPhone(userPhone);
    setCurrentUserName(userName);
  }, [userPhone, userName]);

  // Check auth status against the server cookie on mount/route transition
  const checkPatientAuth = useCallback(async (): Promise<boolean> => {
    if (userRole !== "patient") return true;
    try {
      const res = await fetch("/api/auth/patient/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user?.mobileNumber) {
          setCurrentUserPhone(data.user.mobileNumber);
          setCurrentUserName(data.user.fullName);
          return true;
        }
      }
      // If unauthenticated or cookie missing, clean up patient state
      setCurrentUserPhone(undefined);
      setCurrentUserName(undefined);
      setActiveConversation(null);
      setMessages([]);
      setConversationsList([]);
      setIsOpen(false);
      return false;
    } catch {
      return false;
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === "patient") {
      checkPatientAuth();
    }
  }, [userRole, pathname, checkPatientAuth]);

  // Set or clear patient session dynamically (e.g. login, logout, profile update)
  const setPatientSession = useCallback(
    (session: { fullName?: string; mobileNumber?: string } | null) => {
      if (session && (session.mobileNumber || session.fullName)) {
        const phone = session.mobileNumber?.trim();
        const name = session.fullName?.trim();
        setCurrentUserPhone(phone);
        setCurrentUserName(name);
        if (socket && phone) {
          socket.emit("user:join", {
            role: "patient",
            phone,
            name
          });
        }
      } else {
        // Patient Logged Out
        setCurrentUserPhone(undefined);
        setCurrentUserName(undefined);
        setActiveConversation(null);
        setMessages([]);
        setConversationsList([]);
        setIsOpen(false);
        if (socket && activeConvIdRef.current) {
          socket.emit("conversation:leave", activeConvIdRef.current);
        }
      }
    },
    [socket]
  );

  const logoutPatient = useCallback(async () => {
    try {
      await fetch("/api/auth/patient/logout", { method: "POST" });
    } catch {}
    setPatientSession(null);
    router.push("/patient/login" as Route);
    router.refresh();
  }, [setPatientSession, router]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const s = io({
      path: "/api/socket/io",
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      autoConnect: true,
      transports: ["websocket", "polling"]
    });

    s.on("connect", () => {
      setIsConnected(true);
      s.emit("user:join", {
        role: userRole,
        phone: currentUserPhone,
        name: currentUserName
      });
      // If we already have an active conversation, re-join the room
      if (activeConvIdRef.current) {
        s.emit("conversation:join", activeConvIdRef.current);
      }
    });

    s.on("disconnect", () => {
      setIsConnected(false);
    });

    // Real-time events
    s.on("message:new", (data: { conversationId: string; message: ChatMessage }) => {
      const incomingConvId = String(data.conversationId);
      const currentConvId = activeConvIdRef.current ? String(activeConvIdRef.current) : null;

      if (incomingConvId === currentConvId || (userRole === "patient" && activeConversation?._id && String(activeConversation._id) === incomingConvId)) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(data.message._id))) return prev;
          return [...prev, data.message];
        });

        // Mark as read immediately if chat is open
        if (isOpen) {
          s.emit("message:read", {
            conversationId: incomingConvId,
            readBy: userRole,
            messageIds: [String(data.message._id)]
          });
        }
      }

      // Update conversation in list
      setConversationsList((prev) =>
        prev.map((c) =>
          String(c._id) === incomingConvId
            ? {
                ...c,
                lastMessage: data.message.message,
                lastMessageAt: data.message.createdAt,
                lastSenderType: data.message.senderType,
                unreadCountDoctor:
                  data.message.senderType === "patient" && userRole === "doctor"
                    ? (c.unreadCountDoctor || 0) + 1
                    : c.unreadCountDoctor,
                unreadCountPatient:
                  data.message.senderType === "doctor" && userRole === "patient"
                    ? (c.unreadCountPatient || 0) + 1
                    : c.unreadCountPatient
              }
            : c
        )
      );

      // Play subtle notification sound if message is incoming
      if (data.message.senderType !== userRole && typeof window !== "undefined") {
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbqWEyM2DC4O20ZDYxZ8fn8rtkOTRsyev1wms7NWzL7ffGbTo2bc3w+M1wOzdtz/P5znI9OG/Q8/rReD86ctH0/NN8QD100vX+1YBBPnbU9v/Xg0I/d9X3/9mFRUF41/j/24dH");
          audio.volume = 0.4;
          audio.play().catch(() => {});
        } catch {}
      }
    });

    s.on("message:read", (data: { conversationId: string; readBy: "patient" | "doctor" }) => {
      if (String(data.conversationId) === String(activeConvIdRef.current)) {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderType !== data.readBy ? { ...m, status: "read" as const } : m
          )
        );
      }
    });

    s.on("typing:start", (data: { conversationId: string; senderType: "patient" | "doctor" }) => {
      if (String(data.conversationId) === String(activeConvIdRef.current)) {
        if (data.senderType === "doctor") {
          setDoctorTyping(true);
        } else {
          setPatientTyping(true);
        }
      }
    });

    s.on("typing:stop", (data: { conversationId: string; senderType: "patient" | "doctor" }) => {
      if (String(data.conversationId) === String(activeConvIdRef.current)) {
        if (data.senderType === "doctor") {
          setDoctorTyping(false);
        } else {
          setPatientTyping(false);
        }
      }
    });

    s.on("conversation:request", (data: { conversation: Conversation; message: ChatMessage }) => {
      setConversationsList((prev) => [data.conversation, ...prev.filter((c) => String(c._id) !== String(data.conversation._id))]);
      setPendingRequestsCount((prev) => prev + 1);
    });

    s.on("conversation:approved", (data: { conversation: Conversation; systemMessage?: ChatMessage }) => {
      const approvedConvId = String(data.conversation._id);
      setActiveConversation((prev) =>
        prev && String(prev._id) === approvedConvId
          ? { ...prev, status: "active" }
          : userRole === "patient"
          ? { ...data.conversation, status: "active" }
          : prev
      );
      setConversationsList((prev) =>
        prev.map((c) => (String(c._id) === approvedConvId ? { ...c, status: "active" } : c))
      );
      setPendingRequestsCount((prev) => Math.max(0, prev - 1));

      if (data.systemMessage) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(data.systemMessage!._id))) return prev;
          return [...prev, data.systemMessage!];
        });
      }
    });

    s.on("conversation:rejected", (data: { conversation: Conversation }) => {
      const rejectedConvId = String(data.conversation._id);
      setActiveConversation((prev) => (prev && String(prev._id) === rejectedConvId ? { ...prev, status: "rejected" } : prev));
      setConversationsList((prev) =>
        prev.map((c) => (String(c._id) === rejectedConvId ? { ...c, status: "rejected" } : c))
      );
      setPendingRequestsCount((prev) => Math.max(0, prev - 1));
    });

    s.on("conversation:closed", (data: { conversation: Conversation }) => {
      const closedConvId = String(data.conversation._id);
      setActiveConversation((prev) => (prev && String(prev._id) === closedConvId ? { ...prev, status: "closed" } : prev));
      setConversationsList((prev) =>
        prev.map((c) => (String(c._id) === closedConvId ? { ...c, status: "closed" } : c))
      );
    });

    s.on("user:online", (data: { role: string }) => {
      if (data.role === "doctor") setIsDoctorOnline(true);
      if (data.role === "patient") setIsPatientOnline(true);
    });

    s.on("user:offline", (data: { role: string }) => {
      if (data.role === "doctor") setIsDoctorOnline(false);
      if (data.role === "patient") setIsPatientOnline(false);
    });

    s.on("chat:settings", (data: { enablePatientChat: boolean }) => {
      if (typeof data.enablePatientChat === "boolean") {
        setEnablePatientChat(data.enablePatientChat);
        if (!data.enablePatientChat) {
          setIsOpen(false);
        }
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [userRole, currentUserPhone, currentUserName]);

  // Join/Leave socket room on active conversation change
  useEffect(() => {
    if (socket && activeConversation?._id) {
      const convId = String(activeConversation._id);
      socket.emit("conversation:join", convId);

      // Also ensure patient room is joined
      if (userRole === "patient" && activeConversation.patientPhone) {
        socket.emit("user:join", {
          role: "patient",
          phone: activeConversation.patientPhone,
          name: activeConversation.patientName
        });
      }

      fetchMessages(convId);

      return () => {
        socket.emit("conversation:leave", convId);
      };
    }
  }, [socket, activeConversation?._id, userRole]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
      if (data.conversation) {
        setActiveConversation(data.conversation);
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const fetchConversations = useCallback(
    async (status?: string) => {
      try {
        const url = status ? `/api/chat/conversations?status=${status}` : "/api/chat/conversations";
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 401 && userRole === "patient") {
            // Patient is not logged in / session expired
            setCurrentUserPhone(undefined);
            setCurrentUserName(undefined);
            setActiveConversation(null);
            setConversationsList([]);
          }
          return;
        }

        const data = await res.json();
        if (data.conversations) {
          setConversationsList(data.conversations);
          if (data.stats) {
            setPendingRequestsCount(data.stats.pending || 0);
          }
          // For patient: only activate conversation if currentUserPhone is set
          if (userRole === "patient" && currentUserPhone && data.conversations.length > 0) {
            const latest = data.conversations[0];
            setActiveConversation((prev) => prev || latest);
            if (!activeConvIdRef.current) {
              fetchMessages(latest._id);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load conversations:", e);
      }
    },
    [userRole, currentUserPhone, fetchMessages]
  );

  // Background sync fallback when chat window is open
  useEffect(() => {
    if (!isOpen || !activeConversation?._id) return;
    const interval = setInterval(() => {
      if (activeConversation?._id) {
        fetch(`/api/chat/messages?conversationId=${activeConversation._id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.messages && Array.isArray(data.messages)) {
              setMessages((prev) => {
                if (data.messages.length !== prev.length || JSON.stringify(data.messages) !== JSON.stringify(prev)) {
                  return data.messages;
                }
                return prev;
              });
            }
          })
          .catch(() => {});
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, activeConversation?._id]);

  const sendMessage = useCallback(
    async (text: string, attachments?: any[]): Promise<ChatMessage | null> => {
      if (!activeConversation?._id) return null;
      if (!text.trim() && (!attachments || attachments.length === 0)) return null;

      try {
        const res = await fetch("/api/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: activeConversation._id,
            message: text.trim(),
            attachments
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to send message");
        }

        if (data.message) {
          setMessages((prev) => {
            if (prev.some((m) => String(m._id) === String(data.message._id))) return prev;
            return [...prev, data.message];
          });
          return data.message;
        }
        return null;
      } catch (err: any) {
        console.error("Send message error:", err);
        throw err;
      }
    },
    [activeConversation]
  );

  const sendInitialRequest = useCallback(
    async (data: { name: string; phone: string; message: string }) => {
      try {
        const res = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: data.name,
            patientPhone: data.phone,
            message: data.message
          })
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Failed to create conversation request");
        }

        if (result.conversation) {
          setActiveConversation(result.conversation);
          setCurrentUserPhone(data.phone);
          setCurrentUserName(data.name);

          if (socket) {
            socket.emit("user:join", {
              role: "patient",
              phone: data.phone,
              name: data.name
            });
            socket.emit("conversation:join", String(result.conversation._id));
          }

          if (result.message && typeof result.message === "object") {
            setMessages([result.message]);
          } else {
            fetchMessages(result.conversation._id);
          }
          return result;
        }
        return null;
      } catch (err: any) {
        console.error("Initial request error:", err);
        throw err;
      }
    },
    [socket, fetchMessages]
  );

  const approveRequest = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch("/api/chat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, action: "approve" })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveConversation((prev) => (prev && String(prev._id) === String(conversationId) ? { ...prev, status: "active" } : prev));
        setConversationsList((prev) =>
          prev.map((c) => (String(c._id) === String(conversationId) ? { ...c, status: "active" } : c))
        );
        setPendingRequestsCount((prev) => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const rejectRequest = useCallback(async (conversationId: string, reason?: string) => {
    try {
      const res = await fetch("/api/chat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, action: "reject", reason })
      });
      if (res.ok) {
        setActiveConversation((prev) => (prev && String(prev._id) === String(conversationId) ? { ...prev, status: "rejected" } : prev));
        setConversationsList((prev) =>
          prev.map((c) => (String(c._id) === String(conversationId) ? { ...c, status: "rejected" } : c))
        );
        setPendingRequestsCount((prev) => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const closeConversation = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch("/api/chat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, action: "close" })
      });
      if (res.ok) {
        setActiveConversation((prev) => (prev && String(prev._id) === String(conversationId) ? { ...prev, status: "closed" } : prev));
        setConversationsList((prev) =>
          prev.map((c) => (String(c._id) === String(conversationId) ? { ...c, status: "closed" } : c))
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const sendTyping = useCallback(
    (isTyping: boolean, senderType: "patient" | "doctor") => {
      if (!socket || !activeConversation?._id) return;
      const convId = String(activeConversation._id);

      if (isTyping) {
        socket.emit("typing:start", {
          conversationId: convId,
          senderType
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing:stop", {
            conversationId: convId,
            senderType
          });
        }, 2500);
      } else {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit("typing:stop", {
          conversationId: convId,
          senderType
        });
      }
    },
    [socket, activeConversation]
  );

  const openChatWithDoctor = useCallback(() => {
    if (!enablePatientChat) return;
    setIsOpen(true);
    // Fetch patient conversation
    fetchConversations();
  }, [enablePatientChat, fetchConversations]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        isConnected,
        isOpen,
        setIsOpen,
        openChatWithDoctor,
        enablePatientChat,
        setEnablePatientChat,
        isPatientLoggedIn: Boolean(currentUserPhone),
        userPhone: currentUserPhone,
        userName: currentUserName,
        setPatientSession,
        logoutPatient,
        checkPatientAuth,
        activeConversation,
        setActiveConversation,
        messages,
        loadingMessages,
        isDoctorOnline,
        isPatientOnline,
        doctorTyping,
        patientTyping,
        unreadCount,
        pendingRequestsCount,
        conversationsList,
        fetchConversations,
        fetchMessages,
        sendMessage,
        sendInitialRequest,
        approveRequest,
        rejectRequest,
        closeConversation,
        sendTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
