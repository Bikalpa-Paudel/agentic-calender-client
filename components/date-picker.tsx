"use client";

import { Calendar } from "@/components/ui/calendar";

export function DatePicker() {
  return (
    <div className="px-0">
      <Calendar className="[&_[role=gridcell].bg-accent]:bg-primary [&_[role=gridcell].bg-accent]:text-primary-foreground [&_[role=gridcell]]:w-[33px]" />
    </div>
  );
}
