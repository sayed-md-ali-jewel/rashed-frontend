"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  ShieldCheck,
  Paperclip,
  Sparkles,
  Phone,
  User,
  Loader2,
  ChevronDown
} from "lucide-react";
import { useChat } from "@/context/chat-context";
import { useLanguage } from "@/context/language-context";
import { usePathname } from "next/navigation";

export function PatientChatWidget({ doctor }: { doctor?: { name?: string; image?: string; title?: string } }) {
  const pathname = usePathname();
  const {
    isOpen,
    setIsOpen,
    enablePatientChat,
    isPatientLoggedIn,
    activeConversation,
    messages,
    loadingMessages,
    isDoctorOnline,
    doctorTyping,
    sendMessage,
    sendInitialRequest,
    sendTyping,
    fetchConversations
  } = useChat();

  const { t, translate, language } = useLanguage();

  const [inputMessage, setInputMessage] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [initialMsg, setInitialMsg] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [formError, setFormError] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const doctorName = doctor?.name || activeConversation?.doctorName || "Dr. Md. Rashedul Alam";
  const doctorAvatar = doctor?.image || activeConversation?.doctorAvatar || "/placeholder.svg";

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, doctorTyping]);

  // Load patient conversation on mount and when opened
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, fetchConversations]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || sendingMsg) return;

    const textToSend = inputMessage;
    setInputMessage("");
    sendTyping(false, "patient");

    try {
      setSendingMsg(true);
      await sendMessage(textToSend);
    } catch (err: any) {
      console.error(err);
      setInputMessage(textToSend);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!patientName.trim()) {
      setFormError(language === "bn" ? "অনুগ্রহ করে আপনার পুরো নাম লিখুন" : "Please enter your full name");
      return;
    }

    const phoneClean = patientPhone.replace(/\s+/g, "");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phoneClean)) {
      setFormError(
        language === "bn"
          ? "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01700000000)"
          : "Please enter a valid 11-digit mobile number (e.g. 01700000000)"
      );
      return;
    }

    if (!initialMsg.trim()) {
      setFormError(language === "bn" ? "ডাক্তারকে আপনার প্রাথমিক বার্তাটি লিখুন" : "Please write your initial message");
      return;
    }

    try {
      setSubmittingRequest(true);
      await sendInitialRequest({
        name: patientName.trim(),
        phone: phoneClean,
        message: initialMsg.trim()
      });
      setInitialMsg("");
    } catch (err: any) {
      setFormError(err.message || "Failed to send request");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    sendTyping(true, "patient");
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/patient/login") ||
    enablePatientChat === false ||
    !isPatientLoggedIn ||
    !isOpen
  ) {
    return null;
  }

  return (
    <>
      {/* WhatsApp-Style Chat Window Modal/Drawer */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative flex flex-col w-full sm:w-[420px] h-[92vh] sm:h-[620px] max-h-[100vh] bg-[#efeae2] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-300/80 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            {/* 1. WhatsApp Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#075E54] text-white shadow-md z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-full overflow-hidden border-2 border-white/40 bg-white shrink-0">
                  <img
                    src={doctorAvatar}
                    alt={doctorName}
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  {isDoctorOnline && (
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900" />
                  )}
                </div>

                <div className="leading-tight">
                  <div className="flex items-center gap-1.5 font-bold text-[15px] text-white">
                    <span>{translate(doctorName)}</span>
                    <ShieldCheck className="size-4 text-emerald-300 shrink-0" />
                  </div>
                  <p className="text-[11px] text-emerald-100 font-medium">
                    {doctorTyping ? (
                      <span className="flex items-center gap-1 text-emerald-200 animate-pulse font-semibold">
                        <span>{language === "bn" ? "টাইপ করছেন..." : "typing..."}</span>
                      </span>
                    ) : isDoctorOnline ? (
                      language === "bn" ? "অনলাইন" : "Online"
                    ) : (
                      language === "bn" ? "অফলাইন" : "Offline"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid size-8 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition"
                  aria-label="Close chat"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* 2. Chat Content Area */}
            {!activeConversation ? (
              /* First Contact Form */
              <div className="flex-1 overflow-y-auto p-5 bg-white">
                <div className="text-center mb-5">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 mb-3">
                    <Sparkles className="size-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-ink">
                    {language === "bn" ? "ডাক্তারকে বার্তার অনুরোধ পাঠান" : "Direct Doctor Consultation"}
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {language === "bn"
                      ? "ডাক্তার প্রথম অনুরোধটি অনুমোদন করার পর আপনি সরাসরি ও আনলিমিটেড রিয়েল-টাইম চ্যাট করতে পারবেন।"
                      : "Send your inquiry. Once the doctor approves your request, unlimited real-time chat is unlocked."}
                  </p>
                </div>

                <form onSubmit={handleInitialSubmit} className="space-y-4">
                  {formError && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
                      <AlertCircle className="size-4 shrink-0 text-rose-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">
                      {language === "bn" ? "আপনার নাম" : "Your Full Name"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 size-4 text-muted" />
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder={language === "bn" ? "যেমন: মোহাম্মদ করিম" : "e.g. John Doe"}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-line bg-panel text-ink focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">
                      {language === "bn" ? "মোবাইল নম্বর" : "Mobile Number"}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 size-4 text-muted" />
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="01700000000"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-line bg-panel text-ink focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">
                      {language === "bn" ? "আপনার প্রাথমিক সমস্যা / বার্তা" : "Initial Message / Health Query"}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={initialMsg}
                      onChange={(e) => setInitialMsg(e.target.value)}
                      placeholder={
                        language === "bn"
                          ? "ডাক্তার সাহেবকে আপনার সমস্যা বা জিজ্ঞাসা সংক্ষেপে লিখুন..."
                          : "Briefly explain your symptoms or question for the doctor..."
                      }
                      className="w-full p-3 text-sm rounded-xl border border-line bg-panel text-ink focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingRequest}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#075E54] hover:bg-[#128C7E] text-white font-bold py-3.5 text-sm shadow-md transition disabled:opacity-70 active:scale-98 cursor-pointer"
                  >
                    {submittingRequest ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>{language === "bn" ? "অনুরোধ পাঠানো হচ্ছে..." : "Sending Request..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        <span>{language === "bn" ? "অনুরোধ পাঠান" : "Send Message Request"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Active Conversation & Messages Area */
              <>
                {/* Status Bar Notification */}
                {activeConversation.status === "pending" && (
                  <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-900 shadow-sm shrink-0">
                    <Clock className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {language === "bn" ? "অনুমোদনের অপেক্ষায় রয়েছে" : "Waiting for Doctor's Approval"}
                      </p>
                      <p className="text-[11px] text-amber-700 leading-snug mt-0.5">
                        {language === "bn"
                          ? "ডাক্তার অনুমোদন করলেই সরাসরি রিয়েল-টাইম চ্যাট চালু হবে।"
                          : "Your initial request is under review. Two-way messaging will unlock once approved."}
                      </p>
                    </div>
                  </div>
                )}

                {activeConversation.status === "rejected" && (
                  <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center gap-2 text-xs text-rose-800 shrink-0">
                    <AlertCircle className="size-4 text-rose-600 shrink-0" />
                    <span>
                      {language === "bn"
                        ? "ডাক্তার এই বার্তার অনুরোধটি প্রত্যাখ্যান করেছেন।"
                        : "This message request was declined by the doctor."}
                    </span>
                  </div>
                )}

                {activeConversation.status === "closed" && (
                  <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 text-center text-xs text-slate-600 shrink-0">
                    {language === "bn" ? "এই কথোপকথনটি সমাপ্ত করা হয়েছে।" : "This conversation is closed."}
                  </div>
                )}

                {/* Messages List Container (WhatsApp Styled) */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{
                    backgroundImage: `radial-gradient(circle at 10px 10px, rgba(0,0,0,0.03) 2px, transparent 0)`,
                    backgroundSize: "24px 24px"
                  }}
                >
                  {/* Encrypted Notice Pill */}
                  <div className="flex justify-center my-1">
                    <span className="rounded-full bg-[#ffeecd] px-3.5 py-1 text-[11px] font-medium text-[#7a643d] shadow-sm flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-amber-700" />
                      {language === "bn"
                        ? "বার্তা এবং কল সুরক্ষিত ও গোপনীয়"
                        : "Messages are end-to-end encrypted & private"}
                    </span>
                  </div>

                  {loadingMessages ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="size-6 animate-spin text-emerald-600" />
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderType === "patient";
                      return (
                        <div
                          key={msg._id}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`relative max-w-[82%] px-3.5 py-2 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                              isMe
                                ? "bg-[#d9fdd3] text-slate-900 rounded-tr-none"
                                : "bg-white text-slate-900 rounded-tl-none border border-slate-200/60"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.message}</p>

                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500 font-medium">
                              <span>{formatTime(msg.createdAt)}</span>
                              {isMe && (
                                <>
                                  {msg.status === "read" ? (
                                    <CheckCheck className="size-3.5 text-blue-500 stroke-[2.5]" />
                                  ) : msg.status === "delivered" ? (
                                    <CheckCheck className="size-3.5 text-slate-400 stroke-[2]" />
                                  ) : (
                                    <Check className="size-3.5 text-slate-400 stroke-[2]" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing Bubble */}
                  {doctorTyping && (
                    <div className="flex items-start">
                      <div className="bg-white border border-slate-200/70 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-slate-400 animate-bounce"></span>
                        <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 3. Composer / Input Area */}
                {activeConversation.status === "active" ? (
                  <form
                    onSubmit={handleSend}
                    className="p-3 bg-[#f0f2f5] border-t border-slate-300 flex items-center gap-2 shrink-0"
                  >
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder={language === "bn" ? "একটি বার্তা লিখুন..." : "Type a message..."}
                      className="flex-1 max-h-28 min-h-[42px] px-4 py-2.5 text-sm bg-white text-ink rounded-2xl border border-slate-300 focus:outline-none focus:border-emerald-600 resize-none shadow-inner"
                    />

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || sendingMsg}
                      className="grid size-11 place-items-center rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-md transition disabled:opacity-50 disabled:hover:bg-[#00a884] active:scale-95 shrink-0 cursor-pointer"
                      aria-label="Send message"
                    >
                      {sendingMsg ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Send className="size-5 ml-0.5" />
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
                    {activeConversation.status === "pending"
                      ? language === "bn"
                        ? "ডাক্তার অনুমোদন দিলে মেসেজিং চালু হবে।"
                        : "Messaging is locked until the doctor approves your request."
                      : language === "bn"
                      ? "এই কথোপকথনে বার্তা পাঠানো সম্ভব নয়।"
                      : "New messages cannot be sent in this conversation."}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
    </>
  );
}
