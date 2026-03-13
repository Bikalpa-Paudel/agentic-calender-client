import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  addYears,
  subYears,
  isSameDay,
  isSameMonth,
  format,
} from 'date-fns';
import { CalendarEvent, CalendarEventCreate, CalendarEventUpdate, ViewMode } from '@/types/calendar';
import { calendarService } from '@/services/calendar.service';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch events from API whenever the visible range changes ──
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Compute visible time window
      let rangeStart: Date;
      let rangeEnd: Date;
      if (viewMode === 'year') {
        rangeStart = new Date(currentDate.getFullYear(), 0, 1);
        rangeEnd = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
      } else if (viewMode === 'month') {
        rangeStart = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
        rangeEnd = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
      } else if (viewMode === 'week') {
        rangeStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        rangeEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      } else {
        rangeStart = new Date(currentDate);
        rangeStart.setHours(0, 0, 0, 0);
        rangeEnd = new Date(currentDate);
        rangeEnd.setHours(23, 59, 59, 999);
      }
      const data = await calendarService.getEvents(
        rangeStart.toISOString(),
        rangeEnd.toISOString()
      );
      setEvents(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load events';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [currentDate, viewMode]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const navigateNext = useCallback(() => {
    switch (viewMode) {
      case 'day':
        setCurrentDate((d) => addDays(d, 1));
        break;
      case 'week':
        setCurrentDate((d) => addWeeks(d, 1));
        break;
      case 'month':
        setCurrentDate((d) => addMonths(d, 1));
        break;
      case 'year':
        setCurrentDate((d) => addYears(d, 1));
        break;
    }
  }, [viewMode]);

  const navigatePrev = useCallback(() => {
    switch (viewMode) {
      case 'day':
        setCurrentDate((d) => subDays(d, 1));
        break;
      case 'week':
        setCurrentDate((d) => subWeeks(d, 1));
        break;
      case 'month':
        setCurrentDate((d) => subMonths(d, 1));
        break;
      case 'year':
        setCurrentDate((d) => subYears(d, 1));
        break;
    }
  }, [viewMode]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  const getEventsForDate = useCallback(
    (date: Date) => {
      return events.filter((event) => isSameDay(event.date, date));
    },
    [events]
  );

  const addEvent = useCallback(
    async (event: CalendarEventCreate) => {
      setError(null);
      try {
        const created = await calendarService.createEvent(event);
        setEvents((prev) => [...prev, created]);
        return created;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to create event';
        setError(msg);
        throw err;
      }
    },
    []
  );

  const updateEvent = useCallback(
    async (id: number, updates: CalendarEventUpdate) => {
      setError(null);
      try {
        const updated = await calendarService.updateEvent(id, updates);
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? updated : event))
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update event';
        setError(msg);
        throw err;
      }
    },
    []
  );

  const deleteEvent = useCallback(async (id: number) => {
    setError(null);
    try {
      await calendarService.deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete event';
      setError(msg);
      throw err;
    }
  }, []);

  const getHeaderText = useCallback(() => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return format(currentDate, 'MMMM yyyy');
      case 'month':
        return format(currentDate, 'MMMM, yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
    }
  }, [currentDate, viewMode]);

  return {
    currentDate,
    selectedDate,
    viewMode,
    events,
    loading,
    error,
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
    fetchEvents,
    getHeaderText,
    isSameMonth: (date: Date) => isSameMonth(date, currentDate),
    isToday: (date: Date) => isSameDay(date, new Date()),
    isSelected: (date: Date) => isSameDay(date, selectedDate),
  };
}
