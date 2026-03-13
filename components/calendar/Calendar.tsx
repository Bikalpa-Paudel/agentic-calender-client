"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { CalendarHeader } from "./CalendarHeader";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { YearView } from "./YearView";
import { EventModal } from "./EventModal";
import { useCalendar } from "@/hooks/useCalendar";
import { CalendarEvent, CalendarEventCreate, CalendarEventUpdate } from "@/types/calendar";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  onEventsChanged?: () => void;
}

export function Calendar({ onEventsChanged }: CalendarProps) {
  const {
    currentDate,
    selectedDate,
    viewMode,
    monthDays,
    weekDays,
    loading,
    error,
    setCurrentDate,
    setSelectedDate,
    setViewMode,
    navigateNext,
    navigatePrev,
    goToToday,
    getEventsForDate,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    getHeaderText,
    isSameMonth,
    isToday,
    isSelected,
  } = useCalendar();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [modalDate, setModalDate] = useState<Date>(new Date());

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalDate(event.date);
    setModalOpen(true);
  };

  const handleAddEvent = (date: Date) => {
    setEditingEvent(null);
    setModalDate(date);
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleMonthClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode("month");
  };

  const handleSave = async (event: CalendarEventCreate) => {
    try {
      await addEvent(event);
      onEventsChanged?.();
      setModalOpen(false);
    } catch {
      // error is shown via hook
    }
  };

  const handleUpdate = async (id: number, updates: CalendarEventUpdate) => {
    try {
      await updateEvent(id, updates);
      onEventsChanged?.();
      setModalOpen(false);
    } catch {
      // handled
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      onEventsChanged?.();
      setModalOpen(false);
    } catch {
      // handled
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto">
      <CalendarHeader
        headerText={getHeaderText()}
        viewMode={viewMode}
        onPrev={navigatePrev}
        onNext={navigateNext}
        onToday={goToToday}
        onViewChange={setViewMode}
        onNewEvent={() => handleAddEvent(selectedDate)}
      />

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-destructive hover:text-destructive"
            onClick={fetchEvents}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading overlay */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {viewMode === "month" && (
            <MonthView
              days={monthDays}
              currentDate={currentDate}
              getEventsForDate={getEventsForDate}
              isToday={isToday}
              isSelected={isSelected}
              isSameMonth={isSameMonth}
              onSelectDate={setSelectedDate}
              onEventClick={handleEventClick}
              onAddEvent={handleAddEvent}
            />
          )}

          {viewMode === "week" && (
            <WeekView
              days={weekDays}
              getEventsForDate={getEventsForDate}
              isToday={isToday}
              isSelected={isSelected}
              onSelectDate={setSelectedDate}
              onEventClick={handleEventClick}
              onAddEvent={handleAddEvent}
            />
          )}

          {viewMode === "day" && (
            <DayView
              currentDate={currentDate}
              getEventsForDate={getEventsForDate}
              isToday={isToday}
              onEventClick={handleEventClick}
              onAddEvent={handleAddEvent}
            />
          )}

          {viewMode === "year" && (
            <YearView
              currentDate={currentDate}
              getEventsForDate={getEventsForDate}
              isToday={isToday}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setCurrentDate(date);
                setViewMode("day");
              }}
              onMonthClick={handleMonthClick}
            />
          )}
        </div>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editingEvent}
        selectedDate={modalDate}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
