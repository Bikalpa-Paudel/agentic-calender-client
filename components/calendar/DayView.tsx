import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { EventBadge } from './EventBadge';
import { cn } from '@/lib/utils';

interface DayViewProps {
  currentDate: Date;
  getEventsForDate: (date: Date) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export function DayView({
  currentDate,
  getEventsForDate,
  isToday,
  onEventClick,
  onAddEvent,
}: DayViewProps) {
  const events = getEventsForDate(currentDate);
  const allDayEvents = events.filter((e) => e.allDay);
  const today = isToday(currentDate);

  return (
    <div className="animate-fade-in overflow-auto scrollbar-thin max-h-[calc(100vh-240px)]">
      {/* Header */}
      <div className="sticky top-0 bg-card z-10 border-b pb-4 mb-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex flex-col items-center justify-center h-16 w-16 rounded-xl',
              today ? 'bg-calendar-today text-calendar-today-foreground' : 'bg-muted'
            )}
          >
            <span className="text-sm font-medium uppercase">
              {format(currentDate, 'EEE')}
            </span>
            <span className="text-2xl font-bold">{format(currentDate, 'd')}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
            {today && <p className="text-sm text-primary font-medium">Today</p>}
          </div>
          <button
            onClick={() => onAddEvent(currentDate)}
            className="ml-auto h-10 w-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* All day events */}
        {allDayEvents.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-sm text-muted-foreground">All day</span>
            <div className="space-y-1">
              {allDayEvents.map((event) => (
                <EventBadge
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time grid */}
      <div className="space-y-0">
        {hours.map((hour) => {
          const hourEvents = events.filter(
            (e) => !e.allDay && e.startTime?.startsWith(String(hour).padStart(2, '0'))
          );
          return (
            <div key={hour} className="flex gap-4 group">
              <div className="w-16 text-right text-sm text-muted-foreground py-2 shrink-0">
                {format(new Date().setHours(hour, 0), 'h a')}
              </div>
              <div className="flex-1 border-t py-2 min-h-[60px] hover:bg-calendar-hover transition-colors rounded-r-lg relative">
                {hourEvents.map((event) => (
                  <div key={event.id} className="mb-1">
                    <EventBadge event={event} onClick={() => onEventClick(event)} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
