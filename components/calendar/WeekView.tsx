import { format, isWeekend } from 'date-fns';
import { Plus } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { EventBadge } from './EventBadge';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  days: Date[];
  getEventsForDate: (date: Date) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({
  days,
  getEventsForDate,
  isToday,
  isSelected,
  onSelectDate,
  onEventClick,
  onAddEvent,
}: WeekViewProps) {
  return (
    <div className="animate-fade-in overflow-auto scrollbar-thin">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b sticky top-0 bg-card z-10">
          <div className="py-3" />
          {days.map((day) => {
            const today = isToday(day);
            const weekend = isWeekend(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'py-3 text-center border-l',
                  isSelected(day) && 'bg-calendar-selected'
                )}
                onClick={() => onSelectDate(day)}
              >
                <p
                  className={cn(
                    'text-sm',
                    weekend ? 'text-calendar-weekend' : 'text-muted-foreground'
                  )}
                >
                  {format(day, 'EEE')}
                </p>
                <p
                  className={cn(
                    'text-2xl font-semibold mt-1 mx-auto flex h-10 w-10 items-center justify-center rounded-full',
                    today && 'bg-calendar-today text-calendar-today-foreground'
                  )}
                >
                  {format(day, 'd')}
                </p>
              </div>
            );
          })}
        </div>

        {/* All-day events row */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
          <div className="py-2 pr-2 text-right text-xs text-muted-foreground">
            All day
          </div>
          {days.map((day) => {
            const allDayEvents = getEventsForDate(day).filter((e) => e.allDay);
            return (
              <div
                key={day.toISOString()}
                className="border-l p-1 min-h-[40px] group relative"
              >
                {allDayEvents.map((event) => (
                  <EventBadge
                    key={event.id}
                    event={event}
                    compact
                    onClick={() => onEventClick(event)}
                  />
                ))}
                <button
                  onClick={() => onAddEvent(day)}
                  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="h-12 pr-2 text-right text-xs text-muted-foreground -mt-2">
                {hour === 0 ? '' : format(new Date().setHours(hour, 0), 'h a')}
              </div>
              {days.map((day) => {
                const dayEvents = getEventsForDate(day).filter(
                  (e) => !e.allDay && e.startTime?.startsWith(String(hour).padStart(2, '0'))
                );
                return (
                  <div
                    key={day.toISOString() + hour}
                    className="h-12 border-l border-b relative group hover:bg-calendar-hover transition-colors"
                    onClick={() => {
                      onSelectDate(day);
                    }}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="absolute inset-x-1 top-1"
                      >
                        <EventBadge
                          event={event}
                          onClick={() => onEventClick(event)}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
