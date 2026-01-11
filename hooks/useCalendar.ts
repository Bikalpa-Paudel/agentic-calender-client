import { useState, useCallback, useMemo } from 'react';
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
import { CalendarEvent, ViewMode, EventColor } from '@/types/calendar';

const generateId = () => Math.random().toString(36).substring(2, 11);

// Sample events for demo
const initialEvents: CalendarEvent[] = [
  {
    id: generateId(),
    title: 'Team Standup',
    description: 'Daily team sync meeting',
    date: new Date(),
    startTime: '09:00',
    endTime: '09:30',
    color: 'sky',
  },
  {
    id: generateId(),
    title: 'Project Review',
    description: 'Quarterly project review with stakeholders',
    date: new Date(),
    startTime: '14:00',
    endTime: '15:30',
    color: 'violet',
  },
  {
    id: generateId(),
    title: 'Lunch with Client',
    date: addDays(new Date(), 2),
    startTime: '12:00',
    endTime: '13:30',
    color: 'coral',
  },
  {
    id: generateId(),
    title: 'Workshop',
    description: 'Design thinking workshop',
    date: addDays(new Date(), 5),
    allDay: true,
    color: 'emerald',
  },
];

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

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
    (event: Omit<CalendarEvent, 'id'>) => {
      const newEvent: CalendarEvent = {
        ...event,
        id: generateId(),
      };
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    },
    []
  );

  const updateEvent = useCallback(
    (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updates } : event
        )
      );
    },
    []
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const getHeaderText = useCallback(() => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return format(currentDate, 'MMMM yyyy');
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
    }
  }, [currentDate, viewMode]);

  return {
    currentDate,
    selectedDate,
    viewMode,
    events,
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
    isSameMonth: (date: Date) => isSameMonth(date, currentDate),
    isToday: (date: Date) => isSameDay(date, new Date()),
    isSelected: (date: Date) => isSameDay(date, selectedDate),
  };
}
