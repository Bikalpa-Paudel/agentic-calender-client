"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Bot,
  Settings,
  Search,
  MessageSquare,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/date-picker";
import { calendarService } from "@/services/calendar.service";

const navItems = [
  { name: "Calendar", href: "/dashboard", icon: CalendarDays },
  { name: "AI Actions", href: "/dashboard/actions", icon: Bot },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const calendarCategories = [
  { name: "Important", color: "bg-red-400" },
  { name: "Meeting", color: "bg-blue-400" },
  { name: "Event", color: "bg-violet-400" },
  { name: "Work", color: "bg-amber-400" },
  { name: "Others", color: "bg-emerald-400" },
];

interface SidebarProps {
  onOpenChat?: () => void;
  onSynced?: () => void;
}

export default function Sidebar({ onOpenChat, onSynced }: SidebarProps) {
  const pathname = usePathname();
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const result = await calendarService.syncCalendar();
      setSyncMsg(`Synced ${result.events_synced} events`);
      onSynced?.();
      setTimeout(() => setSyncMsg(null), 3000);
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : "Sync failed");
      setTimeout(() => setSyncMsg(null), 4000);
    } finally {
      setSyncing(false);
    }
  }, [onSynced]);

  return (
    <aside className="flex flex-col h-screen sticky top-0 w-[240px] border-r bg-card px-4 py-5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
          W
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full h-9 rounded-lg bg-muted/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Nav */}
      <nav className="space-y-1 mb-6">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sync with Google Calendar */}
      <div className="mb-6">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full disabled:opacity-50"
        >
          {syncing ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <RefreshCw className="h-[18px] w-[18px]" />
          )}
          <span>{syncing ? "Syncing..." : "Sync Google Calendar"}</span>
        </button>
        {syncMsg && (
          <p className="px-3 mt-1 text-xs text-muted-foreground">{syncMsg}</p>
        )}
      </div>

      {/* Calendar categories */}
      <div className="mb-6">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          My Calendar
        </p>
        <div className="space-y-1">
          {calendarCategories.map((cat) => (
            <button
              key={cat.name}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left"
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", cat.color)} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mini calendar */}
      <div className="border-t pt-4 mb-4">
        <DatePicker />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* AI Chat button */}
      {onOpenChat && (
        <button
          onClick={onOpenChat}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors w-full"
        >
          <MessageSquare className="h-[18px] w-[18px]" />
          <span>AI Assistant</span>
        </button>
      )}
    </aside>
  );
}