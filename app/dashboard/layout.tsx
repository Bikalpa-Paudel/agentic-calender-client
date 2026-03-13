"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useState, useCallback } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar onOpenChat={() => setChatOpen(true)} onSynced={triggerRefresh} />
      <main className="flex-1 overflow-auto" key={refreshKey}>
        {children}
      </main>
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onEventsChanged={triggerRefresh}
      />
    </div>
  );
}