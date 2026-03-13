"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  MessageSquare,
  Loader2,
  Plus,
  Trash2,
  ChevronLeft,
  CalendarPlus,
  CalendarCheck,
  CalendarX,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/chat.service";
import type { ChatConversation, ChatMessage } from "@/types/calendar";

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  onEventsChanged?: () => void;
}

export function ChatPanel({ open, onClose, onEventsChanged }: ChatPanelProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingConvs, setLoadingConvs] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Load conversation list ──
  const loadConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch {
      // silent
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadConversations();
      inputRef.current?.focus();
    }
  }, [open, loadConversations]);

  // ── Load messages when conversation selected ──
  const selectConversation = useCallback(async (id: number) => {
    setActiveConvId(id);
    setError(null);
    try {
      const detail = await chatService.getConversation(id);
      setMessages(detail.messages);
    } catch {
      setError("Failed to load conversation");
    }
  }, []);

  // ── New conversation ──
  const startNew = useCallback(() => {
    setActiveConvId(null);
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  }, []);

  // ── Send message ──
  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);
    setError(null);

    // Optimistic user message
    const tempMsg: ChatMessage = {
      id: Date.now(),
      conversation_id: activeConvId ?? 0,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const reply = await chatService.sendMessage(text, activeConvId ?? undefined);

      // If this was a new conversation, set the active ID
      if (!activeConvId && reply.conversation_id) {
        setActiveConvId(reply.conversation_id);
      }

      setMessages((prev) => [...prev, reply]);
      loadConversations(); // refresh sidebar list
      onEventsChanged?.(); // calendar may have changed
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      setError(msg);
    } finally {
      setSending(false);
    }
  }, [input, sending, activeConvId, loadConversations, onEventsChanged]);

  // ── Delete conversation ──
  const deleteConv = useCallback(
    async (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await chatService.deleteConversation(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeConvId === id) {
          startNew();
        }
      } catch {
        // silent
      }
    },
    [activeConvId, startNew]
  );

  // ── Auto scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Keyboard shortcuts ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-[420px] bg-card border-l shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
        <div className="flex items-center gap-2.5">
          {activeConvId && (
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-1" onClick={startNew}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-base">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={startNew}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conversation list (collapsible) */}
      {conversations.length > 0 && !activeConvId && messages.length === 0 && (
        <div className="border-b max-h-[200px] overflow-y-auto scrollbar-thin">
          {loadingConvs && (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
            </div>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className="flex items-center justify-between w-full px-5 py-3 text-left text-sm hover:bg-muted transition-colors group"
            >
              <span className="truncate text-foreground">
                {conv.title || "New conversation"}
              </span>
              <button
                onClick={(e) => deleteConv(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && !sending && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground font-medium">
              Ask me to manage your calendar
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-[260px]">
              &quot;Schedule a meeting tomorrow at 2pm&quot; or &quot;What&apos;s on my calendar this week?&quot;
            </p>
            <div className="flex flex-wrap gap-2 mt-6 max-w-[320px] justify-center">
              {[
                { icon: CalendarPlus, text: "Schedule a meeting" },
                { icon: CalendarCheck, text: "What's on today?" },
                { icon: CalendarX, text: "Find free slots" },
              ].map((s) => (
                <button
                  key={s.text}
                  onClick={() => { setInput(s.text); inputRef.current?.focus(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                  <s.icon className="h-3 w-3" />
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === "assistant" && msg.action_triggered && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-foreground/10 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>Action executed</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-destructive text-center bg-destructive/10 rounded-lg py-2 px-3">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your calendar..."
            rows={1}
            className="flex-1 resize-none rounded-xl border bg-muted/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 max-h-[100px] scrollbar-thin"
          />
          <Button
            size="icon"
            className="h-10 w-10 rounded-xl shrink-0"
            onClick={send}
            disabled={!input.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
