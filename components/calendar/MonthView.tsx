import { format, isWeekend } from 'date-fns';
import { Plus } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { EventBadge } from './EventBadge';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  days: Date[];
  currentDate: Date;
  getEventsForDate: (date: Date) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isSameMonth: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({
  days,
  getEventsForDate,
  isToday,
  isSelected,
  isSameMonth,
  onSelectDate,
  onEventClick,
  onAddEvent,
}: MonthViewProps) {
  return (
    <div className="animate-fade-in">
      <div className="calendar-grid border-b">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              'py-3 text-center text-sm font-medium',
              i === 0 || i === 6 ? 'text-calendar-weekend' : 'text-muted-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const events = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day);
          const todayClass = isToday(day);
          const selectedClass = isSelected(day);
          const weekend = isWeekend(day);

          return (
            <div
              key={index}
              className={cn(
                'group relative min-h-[120px] border-b border-r p-2 transition-colors hover:bg-calendar-hover cursor-pointer',
                !isCurrentMonth && 'bg-muted/30',
                selectedClass && 'bg-calendar-selected'
              )}
              onClick={() => onSelectDate(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors',
                    todayClass && 'bg-calendar-today text-calendar-today-foreground',
                    !todayClass && !isCurrentMonth && 'text-calendar-other-month',
                    !todayClass && isCurrentMonth && weekend && 'text-calendar-weekend',
                    !todayClass && isCurrentMonth && !weekend && 'text-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent(day);
                  }}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1 overflow-hidden">
                {events.slice(0, 3).map((event) => (
                  <EventBadge
                    key={event.id}
                    event={event}
                    compact
                    onClick={() => onEventClick(event)}
                  />
                ))}
                {events.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2">
                    +{events.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
