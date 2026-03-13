import { CalendarEvent, EventColor } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventBadgeProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
}

const colorClasses: Record<EventColor, string> = {
  coral: 'event-coral',
  violet: 'event-violet',
  emerald: 'event-emerald',
  amber: 'event-amber',
  sky: 'event-sky',
  rose: 'event-rose',
};

export function EventBadge({ event, compact = false, onClick }: EventBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-md px-2 py-1 text-xs font-medium transition-all hover:shadow-event',
        colorClasses[event.color],
        compact ? 'truncate' : 'line-clamp-2'
      )}
    >
      {!event.is_all_day && event.startTime && (
        <span className="opacity-75 mr-1">{event.startTime}</span>
      )}
      {event.title}
    </button>
  );
}
