import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  headerText: string;
  viewMode: ViewMode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: ViewMode) => void;
  onNewEvent?: () => void;
}

const viewOptions: { value: ViewMode; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export function CalendarHeader({
  headerText,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onNewEvent,
}: CalendarHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
      <div className="flex items-center gap-4">
        {onNewEvent && (
          <Button onClick={onNewEvent} size="sm" className="gap-2 rounded-lg">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        )}

        <div className="flex items-center rounded-lg border bg-card p-0.5">
          {viewOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-3 text-sm font-medium transition-all rounded-md',
                viewMode === option.value &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
              )}
              onClick={() => onViewChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight ml-2">{headerText}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-9 w-[200px] rounded-lg bg-muted/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex items-center rounded-lg border bg-card p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="h-8 px-3 font-medium text-sm"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
