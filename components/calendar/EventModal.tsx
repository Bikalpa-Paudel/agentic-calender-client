import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Trash2, Calendar, Clock, AlignLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CalendarEvent, EventColor } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  selectedDate: Date;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (id: string, event: Partial<Omit<CalendarEvent, 'id'>>) => void;
  onDelete: (id: string) => void;
}

const colorOptions: { value: EventColor; label: string; className: string }[] = [
  { value: 'coral', label: 'Coral', className: 'bg-event-coral' },
  { value: 'violet', label: 'Violet', className: 'bg-event-violet' },
  { value: 'emerald', label: 'Emerald', className: 'bg-event-emerald' },
  { value: 'amber', label: 'Amber', className: 'bg-event-amber' },
  { value: 'sky', label: 'Sky', className: 'bg-event-sky' },
  { value: 'rose', label: 'Rose', className: 'bg-event-rose' },
];

export function EventModal({
  open,
  onClose,
  event,
  selectedDate,
  onSave,
  onUpdate,
  onDelete,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState<EventColor>('sky');
  const [allDay, setAllDay] = useState(false);

  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '10:00');
      setColor(event.color);
      setAllDay(event.allDay || false);
    } else {
      setTitle('');
      setDescription('');
      setStartTime('09:00');
      setEndTime('10:00');
      setColor('sky');
      setAllDay(false);
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const eventData = {
      title: title.trim(),
      description: description.trim() || undefined,
      date: event?.date || selectedDate,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      color,
      allDay,
    };

    if (isEditing && event) {
      onUpdate(event.id, eventData);
    } else {
      onSave(eventData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? 'Edit Event' : 'New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <div className="space-y-2">
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(event?.date || selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="all-day"
                checked={allDay}
                onCheckedChange={setAllDay}
              />
              <Label htmlFor="all-day" className="text-sm">
                All day
              </Label>
            </div>
          </div>

          {!allDay && (
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-[120px]"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-[120px]"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AlignLeft className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Description</span>
            </div>
            <Textarea
              placeholder="Add description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Color</Label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={cn(
                    'h-8 w-8 rounded-full transition-all',
                    option.className,
                    color === option.value
                      ? 'ring-2 ring-offset-2 ring-foreground/20 scale-110'
                      : 'hover:scale-105'
                  )}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            {isEditing ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
