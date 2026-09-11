"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MessageSquare,
  Check,
  X,
  Send,
  CheckCheck,
  Clock,
  AlertCircle,
  Search,
  User,
  Phone,
  ShieldAlert,
  Archive,
  RefreshCw,
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Ban,
  RotateCcw,
  Sparkle,
  Calendar
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import type { Conversation, ChatMessage } from "@/context/chat-context";

const QUICK_REPLIES = [
  "Hello! How can I assist you with your health today?",
  "Please share your latest medical/test reports if available.",
  "Your consultation schedule has been confirmed.",
  "Please visit the chamber for an in-person clinical examination.",
  "Take the prescribed medicines on time and keep me updated."
];

function formatTime(isoString?: string) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatDate(isoString?: string) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function getDateGroupLabel(isoString?: string) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today";
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
  } catch {
    return "";
  }
}

export function AdminMessagesPanel({
  onViewPatient
}: {
  onViewPatient?: (phone: string) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<"requests" | "active" | "archived">("active");
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [patientTyping, setPatientTyping] = useState(false);
  const [onlinePatients, setOnlinePatients] = useState<Set<string>>(new Set());
  const [enablePatientChat, setEnablePatientChat] = useState<boolean>(true);
  const [togglingChat, setTogglingChat] = useState(false);
  const [toggleFeedback, setToggleFeedback] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedConvIdRef = useRef<string | null>(null);
  selectedConvIdRef.current = selectedConv?._id || null;

  // Load chat feature setting
  useEffect(() => {
    fetch("/api/chat/settings")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.enablePatientChat === "boolean") {
          setEnablePatientChat(data.enablePatientChat);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleChat = async () => {
    const nextValue = !enablePatientChat;
    try {
      setTogglingChat(true);
      const res = await fetch("/api/chat/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enablePatientChat: nextValue })
      });
      const data = await res.json();
      if (res.ok) {
        setEnablePatientChat(data.enablePatientChat);
        setToggleFeedback(
          data.enablePatientChat
            ? "Patient Chat is now active and visible on the website."
            : "Patient Chat is now turned OFF and hidden from the website. All message histories remain preserved."
        );
        setTimeout(() => setToggleFeedback(null), 5000);
      }
    } catch (err) {
      console.error("Failed to toggle chat:", err);
    } finally {
      setTogglingChat(false);
    }
  };

  // 1. Fetch Conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoadingConv(true);
      const res = await fetch("/api/chat/conversations");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        // If no conv selected, pick first active
        if (!selectedConvIdRef.current && data.conversations.length > 0) {
          const firstActive = data.conversations.find((c: Conversation) => c.status === "active");
          if (firstActive) {
            setSelectedConv(firstActive);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load conversations:", e);
    } finally {
      setLoadingConv(false);
    }
  }, []);

  // 2. Fetch Messages for selected conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
      if (data.conversation) {
        setSelectedConv(data.conversation);
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // 3. Socket Connection for Doctor
  useEffect(() => {
    const s = io({
      path: "/api/socket/io",
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      transports: ["websocket", "polling"]
    });

    s.on("connect", () => {
      s.emit("user:join", { role: "doctor", name: "Dr. Md. Rashedul Alam" });
    });

    s.on("conversation:request", (data: { conversation: Conversation }) => {
      setConversations((prev) => [data.conversation, ...prev.filter((c) => c._id !== data.conversation._id)]);
      if (typeof window !== "undefined") {
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbqWEyM2DC4O20ZDYxZ8fn8rtkOTRsyev1wms7NWzL7ffGbTo2bc3w+M1wOzdtz/P5znI9OG/Q8/rReD86ctH0/NN8QD100vX+1YBBPnbU9v/Xg0I/d9X3/9mFRUF41/j/24dH");
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch {}
      }
    });

    s.on("message:new", (data: { conversationId: string; message: ChatMessage }) => {
      const incomingConvId = String(data.conversationId);
      const currentSelectedId = selectedConvIdRef.current ? String(selectedConvIdRef.current) : null;

      if (incomingConvId === currentSelectedId) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(data.message._id))) return prev;
          return [...prev, data.message];
        });

        // Mark as read
        s.emit("message:read", {
          conversationId: incomingConvId,
          readBy: "doctor",
          messageIds: [String(data.message._id)]
        });
      }

      setConversations((prev) => {
        const exists = prev.some((c) => String(c._id) === incomingConvId);
        if (!exists) {
          loadConversations();
          return prev;
        }
        return prev.map((c) =>
          String(c._id) === incomingConvId
            ? {
                ...c,
                lastMessage: data.message.message,
                lastMessageAt: data.message.createdAt,
                lastSenderType: data.message.senderType,
                unreadCountDoctor:
                  data.message.senderType === "patient" && incomingConvId !== currentSelectedId
                    ? (c.unreadCountDoctor || 0) + 1
                    : 0
              }
            : c
        );
      });
    });

    s.on("typing:start", (data: { conversationId: string; senderType: string }) => {
      if (String(data.conversationId) === String(selectedConvIdRef.current) && data.senderType === "patient") {
        setPatientTyping(true);
      }
    });

    s.on("typing:stop", (data: { conversationId: string; senderType: string }) => {
      if (String(data.conversationId) === String(selectedConvIdRef.current) && data.senderType === "patient") {
        setPatientTyping(false);
      }
    });

    s.on("message:read", (data: { conversationId: string; readBy: string }) => {
      if (String(data.conversationId) === String(selectedConvIdRef.current)) {
        setMessages((prev) =>
          prev.map((m) => (m.senderType !== data.readBy ? { ...m, status: "read" as const } : m))
        );
      }
    });

    s.on("user:online", (data: { userKey: string; role: string }) => {
      if (data.role === "patient") {
        setOnlinePatients((prev) => new Set(prev).add(data.userKey));
      }
    });

    s.on("user:offline", (data: { userKey: string }) => {
      setOnlinePatients((prev) => {
        const next = new Set(prev);
        next.delete(data.userKey);
        return next;
      });
    });

    socketRef.current = s;

    return () => {
      s.disconnect();
    };
  }, []);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages on selected conversation change
  useEffect(() => {
    if (selectedConv?._id) {
      if (socketRef.current) {
        socketRef.current.emit("conversation:join", selectedConv._id);
      }
      loadMessages(selectedConv._id);

      // Reset unread count for this conversation
      setConversations((prev) =>
        prev.map((c) => (c._id === selectedConv._id ? { ...c, unreadCountDoctor: 0 } : c))
      );

      return () => {
        if (socketRef.current) {
          socketRef.current.emit("conversation:leave", selectedConv._id);
        }
      };
    }
  }, [selectedConv?._id, loadMessages]);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, patientTyping]);

  // Actions
  const handleApprove = async (conversationId: string) => {
    try {
      setActionLoading(conversationId);
      const res = await fetch("/api/chat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, action: "approve" })
      });
      const data = await res.json();
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c._id === conversationId ? { ...c, status: "active" as const } : c))
        );
        setActiveTab("active");
        setSelectedConv(data.conversation);
        setShowMobileChat(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (conversationId: string) => {
    if (!confirm("Are you sure you want to decline this patient message request?")) return;
    try {
      setActionLoading(conversationId);
      const res = await fetch("/api/chat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, action: "reject" })
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c._id === conversationId ? { ...c, status: "rejected" as const } : c))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseOrBlock = async (conversationId: string, action: "close" | "block" | "reopen") => {
    const confirmMsg =
      action === "block"
        ? "Block this patient from messaging?"
        : action === "close"
        ? "Close and archive this active conversation?"
        : "Reopen this conversation?";
    if (!confirm(confirmMsg)) return;

    try {
      setActionLoading(conversationId);
      const res = await fetch("/api/chat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, action })
      });
      const data = await res.json();
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c._id === conversationId ? { ...c, status: data.conversation.status } : c))
        );
        if (selectedConv?._id === conversationId) {
          setSelectedConv(data.conversation);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedConv?._id || !replyText.trim() || sendingReply) return;

    const text = replyText.trim();
    setReplyText("");

    if (socketRef.current) {
      socketRef.current.emit("typing:stop", {
        conversationId: selectedConv._id,
        senderType: "doctor"
      });
    }

    try {
      setSendingReply(true);
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConv._id,
          message: text
        })
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(data.message._id))) return prev;
          return [...prev, data.message];
        });
        setConversations((prev) =>
          prev.map((c) =>
            String(c._id) === String(selectedConv._id)
              ? {
                  ...c,
                  lastMessage: data.message.message,
                  lastMessageAt: data.message.createdAt,
                  lastSenderType: "doctor" as const
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
      setReplyText(text);
    } finally {
      setSendingReply(false);
    }
  };

  const pendingRequests = conversations.filter((c) => c.status === "pending");
  const activeChats = conversations.filter((c) => c.status === "active");
  const archivedChats = conversations.filter(
    (c) => c.status === "closed" || c.status === "blocked" || c.status === "rejected"
  );

  const filteredActive = activeChats.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.patientName.toLowerCase().includes(q) || c.patientPhone.includes(q);
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header Card with Toggle Switch & Navigation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  Patient Messaging Center
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time WhatsApp-style communication with doctor approval gatekeeping
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Patient Chat ON/OFF Switch */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 shadow-inner">
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-300">
                  Patient Chat Feature
                </span>
                <span
                  className={`flex items-center justify-end gap-1.5 text-[10px] font-bold ${
                    enablePatientChat ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      enablePatientChat ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  {enablePatientChat ? "Active on Website" : "Turned OFF (Hidden)"}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enablePatientChat}
                onClick={handleToggleChat}
                disabled={togglingChat}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                  enablePatientChat ? "bg-emerald-500" : "bg-slate-700"
                } ${togglingChat ? "opacity-60 cursor-not-allowed" : ""}`}
                title={enablePatientChat ? "Click to turn OFF patient chat" : "Click to turn ON patient chat"}
              >
                <span className="sr-only">Toggle patient chat</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    enablePatientChat ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadConversations}
              disabled={loadingConv}
              className="grid size-10 place-items-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 active:scale-95 cursor-pointer"
              title="Refresh messages"
            >
              <RefreshCw className={`size-4 ${loadingConv ? "animate-spin text-teal-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Feedback Alert if changed */}
        {toggleFeedback && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{toggleFeedback}</span>
          </div>
        )}

        {/* Chat Disabled Info Banner */}
        {!enablePatientChat && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300/90 animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold text-amber-200">Patient Chat is currently turned OFF</p>
              <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                The “Chat with Doctor” button and floating chat widget are hidden from patients across the website. Patients cannot start new chats. All your past conversations, message logs, and records remain fully preserved and accessible below.
              </p>
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => {
              setActiveTab("requests");
              setShowMobileChat(false);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "requests"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <Clock className="size-3.5" />
            <span>Message Requests</span>
            {pendingRequests.length > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-amber-500 text-[10px] font-black text-slate-950 animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("active");
              setShowMobileChat(false);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="size-3.5" />
            <span>Active Chats</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              {activeChats.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("archived");
              setShowMobileChat(false);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "archived"
                ? "bg-slate-800 text-slate-200 border border-slate-700 shadow-sm"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <Archive className="size-3.5" />
            <span>Archived</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              {archivedChats.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. TAB: MESSAGE REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300">
              <span>Pending Doctor Approval</span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-300">
                {pendingRequests.length} Requests
              </span>
            </h3>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-slate-800 text-teal-400">
                <CheckCircle2 className="size-7" />
              </div>
              <h4 className="text-base font-bold text-slate-200">No Pending Message Requests</h4>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
                All patient conversation inquiries have been reviewed and approved or archived.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl transition-all hover:border-amber-500/50"
                >
                  <div>
                    {/* Patient Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-full border border-teal-500/30 bg-gradient-to-tr from-teal-950 to-slate-800 font-bold text-teal-400 shadow-inner">
                          {req.patientName ? req.patientName.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">{req.patientName}</h4>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                            <Phone className="size-3 text-teal-400" />
                            <span>{req.patientPhone}</span>
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                        {formatDate(req.createdAt)}
                      </span>
                    </div>

                    {/* First Message Preview */}
                    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3.5 shadow-inner">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Initial Medical Inquiry
                      </p>
                      <p className="text-xs italic leading-relaxed text-slate-300">
                        &ldquo;{req.firstMessage || req.lastMessage}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Actions: Approve & Reject */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-slate-800/80 pt-3">
                    <button
                      type="button"
                      disabled={actionLoading === req._id}
                      onClick={() => handleReject(req._id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-900/50 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <X className="size-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading === req._id}
                      onClick={() => handleApprove(req._id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-900/30 transition hover:from-teal-500 hover:to-emerald-500 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading === req._id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Check className="size-3.5 stroke-[3]" />
                      )}
                      <span>Approve & Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. TAB: ACTIVE CHATS (WHATSAPP-STYLE TWO-PANE LAYOUT) */}
      {activeTab === "active" && (
        <div className="flex h-[720px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          {/* ================= LEFT COLUMN: CONVERSATION LIST ================= */}
          <div
            className={`flex w-full flex-col border-r border-slate-800 bg-slate-900/70 md:w-80 lg:w-96 shrink-0 ${
              showMobileChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search Header */}
            <div className="border-b border-slate-800/80 p-3.5">
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 size-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search patient name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-8 text-xs text-slate-200 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversation List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {filteredActive.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  {searchQuery ? "No matching conversations found" : "No active conversations yet"}
                </div>
              ) : (
                filteredActive.map((conv) => {
                  const isSelected = selectedConv?._id === conv._id;
                  const isOnline = onlinePatients.has(conv.patientPhone);
                  return (
                    <button
                      key={conv._id}
                      type="button"
                      onClick={() => {
                        setSelectedConv(conv);
                        setShowMobileChat(true);
                      }}
                      className={`w-full text-left p-3.5 flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-teal-500/15 border-l-4 border-teal-500 shadow-inner"
                          : "hover:bg-slate-800/50"
                      }`}
                    >
                      {/* Avatar with Online indicator */}
                      <div className="relative grid size-11 shrink-0 place-items-center rounded-full border border-teal-500/30 bg-gradient-to-tr from-teal-950 to-slate-800 font-bold text-teal-400">
                        {conv.patientName ? conv.patientName.charAt(0).toUpperCase() : "P"}
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 ring-2 ring-slate-900 shadow-sm" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-teal-300" : "text-slate-200"
                            }`}
                          >
                            {conv.patientName || "Patient"}
                          </h4>
                          <span className="shrink-0 text-[10px] text-slate-500">
                            {formatTime(conv.lastMessageAt) || formatDate(conv.updatedAt)}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="text-[11px] text-slate-400 truncate">
                            {conv.lastSenderType === "doctor" && (
                              <span className="font-semibold text-teal-400">You: </span>
                            )}
                            {conv.lastMessage || "No messages yet"}
                          </p>

                          {conv.unreadCountDoctor > 0 && (
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-500 text-[10px] font-black text-slate-950 shadow-sm">
                              {conv.unreadCountDoctor}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CHAT WINDOW ================= */}
          {selectedConv ? (
            <div
              className={`flex flex-1 flex-col bg-[#0b131b] ${
                showMobileChat ? "flex" : "hidden md:flex"
              }`}
            >
              {/* Chat Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 sm:px-6 shadow-sm z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="grid size-9 place-items-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 md:hidden"
                  >
                    <ArrowLeft className="size-4" />
                  </button>

                  <div className="relative grid size-10 shrink-0 place-items-center rounded-full border border-teal-500/40 bg-gradient-to-tr from-teal-950 to-slate-800 font-bold text-teal-300 shadow-md">
                    {selectedConv.patientName ? selectedConv.patientName.charAt(0).toUpperCase() : "P"}
                    {onlinePatients.has(selectedConv.patientPhone) && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      {selectedConv.patientName || "Patient"}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="size-3 text-teal-400" />
                        <span>{selectedConv.patientPhone}</span>
                      </span>
                      <span>&bull;</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          onlinePatients.has(selectedConv.patientPhone)
                            ? "text-emerald-400"
                            : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            onlinePatients.has(selectedConv.patientPhone)
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-slate-500"
                          }`}
                        />
                        {onlinePatients.has(selectedConv.patientPhone) ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  {onViewPatient && (
                    <button
                      type="button"
                      onClick={() => onViewPatient(selectedConv.patientPhone)}
                      className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                    >
                      <User className="size-3.5 text-teal-400" />
                      <span>Patient Records</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCloseOrBlock(selectedConv._id, "close")}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                  >
                    <Archive className="size-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Close Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCloseOrBlock(selectedConv._id, "block")}
                    className="grid size-8 place-items-center rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 transition"
                    title="Block Patient"
                  >
                    <Ban className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
                style={{
                  backgroundImage: `radial-gradient(circle at 12px 12px, rgba(255,255,255,0.035) 1.5px, transparent 0)`,
                  backgroundSize: "28px 28px"
                }}
              >
                {loadingMessages ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="size-7 animate-spin text-teal-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                    <MessageSquare className="size-10 text-slate-700 mb-2" />
                    <p className="text-xs text-slate-400">No messages yet. Send a medical reply to begin.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isDoctor = msg.senderType === "doctor";
                    const showDateHeader =
                      index === 0 ||
                      getDateGroupLabel(msg.createdAt) !== getDateGroupLabel(messages[index - 1].createdAt);

                    return (
                      <React.Fragment key={msg._id}>
                        {showDateHeader && (
                          <div className="flex justify-center my-3">
                            <span className="rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1 text-[11px] font-bold text-slate-400 shadow-sm">
                              {getDateGroupLabel(msg.createdAt)}
                            </span>
                          </div>
                        )}

                        <div className={`flex flex-col ${isDoctor ? "items-end" : "items-start"}`}>
                          <div
                            className={`relative max-w-[85%] sm:max-w-[72%] px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-lg ${
                              isDoctor
                                ? "bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-tr-xs"
                                : "bg-slate-900/95 text-slate-100 border border-slate-700/70 rounded-tl-xs"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                            <div
                              className={`mt-1.5 flex items-center justify-end gap-1.5 text-[10px] ${
                                isDoctor ? "text-teal-100/80" : "text-slate-400"
                              }`}
                            >
                              <span>{formatTime(msg.createdAt)}</span>
                              {isDoctor && (
                                <>
                                  {msg.status === "read" ? (
                                    <CheckCheck className="size-3.5 text-cyan-200 stroke-[2.5]" />
                                  ) : msg.status === "delivered" ? (
                                    <CheckCheck className="size-3.5 text-slate-200 stroke-[2]" />
                                  ) : (
                                    <Check className="size-3.5 text-slate-200 stroke-[2]" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}

                {patientTyping && (
                  <div className="flex items-start animate-in fade-in">
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-slate-700/60 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 shadow-sm">
                      <span className="text-teal-400 font-semibold">Patient is typing</span>
                      <span className="size-1.5 rounded-full bg-teal-400 animate-bounce" />
                      <span className="size-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="size-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies Bar */}
              <div className="border-t border-slate-800 bg-slate-900/90 px-4 py-2.5">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Sparkles className="size-3.5 text-teal-400" /> Quick:
                  </span>
                  {QUICK_REPLIES.map((text, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReplyText(text)}
                      className="shrink-0 rounded-full border border-slate-700/80 bg-slate-800/90 px-3 py-1 text-[11.5px] text-slate-300 transition-all hover:border-teal-500/50 hover:bg-teal-950/60 hover:text-teal-300 active:scale-95 cursor-pointer"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer Input Form */}
              <form
                onSubmit={handleSendReply}
                className="flex items-end gap-2.5 border-t border-slate-800 bg-slate-900/95 p-3.5 sm:p-4"
              >
                <textarea
                  rows={1}
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    if (socketRef.current && selectedConv) {
                      socketRef.current.emit("typing:start", {
                        conversationId: selectedConv._id,
                        senderType: "doctor"
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder="Type a clinical reply or prescription advice (Enter to send)..."
                  className="flex-1 max-h-32 min-h-[46px] rounded-2xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim() || sendingReply}
                  className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/40 transition hover:from-teal-500 hover:to-emerald-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Send message"
                >
                  {sendingReply ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Send className="size-5 ml-0.5" />
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden flex-1 flex-col items-center justify-center p-10 text-center text-slate-500 md:flex bg-[#0b131b]">
              <div className="mb-4 grid size-16 place-items-center rounded-2xl border border-slate-800 bg-slate-900 text-teal-400 shadow-lg">
                <MessageSquare className="size-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200">Select a Conversation</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-400">
                Choose a patient from the active conversations list on the left to start live consultation messaging.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: ARCHIVED CHATS */}
      {activeTab === "archived" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Closed & Blocked Conversations ({archivedChats.length})
          </h3>

          {archivedChats.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-xs text-slate-500">
              No archived conversations
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {archivedChats.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{c.patientName}</h4>
                    <p className="mt-0.5 text-xs text-slate-400">{c.patientPhone}</p>
                    <span
                      className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        c.status === "rejected"
                          ? "border-rose-800 bg-rose-950/60 text-rose-300"
                          : c.status === "blocked"
                          ? "border-red-800 bg-red-950/60 text-red-300"
                          : "border-slate-700 bg-slate-800 text-slate-400"
                      }`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCloseOrBlock(c._id, "reopen")}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-teal-300 transition hover:bg-slate-700"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reopen</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
