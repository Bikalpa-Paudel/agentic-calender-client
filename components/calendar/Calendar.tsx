"use client";
import { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { YearView } from './YearView';
import { EventModal } from './EventModal';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEvent } from '@/types/calendar';

export function Calendar() {
  const {
    currentDate,
    selectedDate,
    viewMode,
    monthDays,
    weekDays,
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
    setViewMode('month');
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
      />

      <div className="bg-card rounded-xl border shadow-calendar overflow-hidden">
        {viewMode === 'month' && (
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

        {viewMode === 'week' && (
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

        {viewMode === 'day' && (
          <DayView
            currentDate={currentDate}
            getEventsForDate={getEventsForDate}
            isToday={isToday}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        )}

        {viewMode === 'year' && (
          <YearView
            currentDate={currentDate}
            getEventsForDate={getEventsForDate}
            isToday={isToday}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setCurrentDate(date);
              setViewMode('day');
            }}
            onMonthClick={handleMonthClick}
          />
        )}
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editingEvent}
        selectedDate={modalDate}
        onSave={addEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}
