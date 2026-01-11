import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  setMonth,
} from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface YearViewProps {
  currentDate: Date;
  getEventsForDate: (date: Date) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onMonthClick: (date: Date) => void;
}

const months = Array.from({ length: 12 }, (_, i) => i);

export function YearView({
  currentDate,
  getEventsForDate,
  isToday,
  onSelectDate,
  onMonthClick,
}: YearViewProps) {
  const year = currentDate.getFullYear();

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {months.map((monthIndex) => {
          const monthDate = setMonth(new Date(year, 0, 1), monthIndex);
          const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
          const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
          const days = eachDayOfInterval({ start, end });

          return (
            <div
              key={monthIndex}
              className="p-4 rounded-xl border bg-card hover:shadow-calendar-hover transition-all cursor-pointer group"
              onClick={() => onMonthClick(monthDate)}
            >
              <h3 className="font-semibold mb-3 group-hover:text-primary transition-colors">
                {format(monthDate, 'MMMM')}
              </h3>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div
                    key={i}
                    className="text-[10px] text-muted-foreground font-medium pb-1"
                  >
                    {d}
                  </div>
                ))}
                {days.map((day, idx) => {
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const today = isToday(day);
                  const hasEvents = getEventsForDate(day).length > 0;

                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(day);
                      }}
                      className={cn(
                        'text-[11px] h-5 w-5 flex items-center justify-center rounded-full mx-auto relative cursor-pointer transition-colors',
                        !isCurrentMonth && 'text-muted-foreground/40',
                        isCurrentMonth && 'hover:bg-calendar-hover',
                        today && 'bg-calendar-today text-calendar-today-foreground font-bold'
                      )}
                    >
                      {format(day, 'd')}
                      {hasEvents && isCurrentMonth && !today && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
