import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Trash2, Calendar, Clock, AlignLeft, MapPin, Loader2, FileText, Sparkles } from 'lucide-react';
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
import { CalendarEvent, CalendarEventCreate, CalendarEventUpdate, EventColor, EventMaterial, MaterialType } from '@/types/calendar';
import { materialsService } from '@/services/materials.service';
import { cn } from '@/lib/utils';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  selectedDate: Date;
  onSave: (event: CalendarEventCreate) => Promise<void> | void;
  onUpdate: (id: number, event: CalendarEventUpdate) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
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
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [tab, setTab] = useState<'details' | 'materials'>('details');
  const [materials, setMaterials] = useState<EventMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const isEditing = !!event;

  const loadMaterials = useCallback(async (eventId: number) => {
    setLoadingMaterials(true);
    try {
      const data = await materialsService.getMaterials(eventId);
      setMaterials(data);
    } catch {
      // silent
    } finally {
      setLoadingMaterials(false);
    }
  }, []);

  const generateMaterial = async (type: MaterialType) => {
    if (!event) return;
    setGeneratingType(type);
    try {
      const material = await materialsService.generate(event.id, type);
      setMaterials((prev) => [...prev, material]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to generate material');
    } finally {
      setGeneratingType(null);
    }
  };

  const deleteMaterial = async (id: number) => {
    try {
      await materialsService.deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '10:00');
      setColor(event.color);
      setAllDay(event.is_all_day || false);
      setLocation(event.location || '');
    } else {
      setTitle('');
      setDescription('');
      setStartTime('09:00');
      setEndTime('10:00');
      setColor('sky');
      setAllDay(false);
      setLocation('');
    }
    setFormError(null);
    setTab('details');
    setMaterials([]);
    if (event) {
      loadMaterials(event.id);
    }
  }, [event, open, loadMaterials]);

  const buildISODateTime = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return `${dateStr}T${time}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setFormError(null);

    const baseDate = event?.date || selectedDate;

    try {
      if (isEditing && event) {
        const updates: CalendarEventUpdate = {
          title: title.trim(),
          description: description.trim() || undefined,
          location: location.trim() || undefined,
        };
        if (!allDay) {
          updates.start_time = buildISODateTime(baseDate, startTime);
          updates.end_time = buildISODateTime(baseDate, endTime);
        }
        await onUpdate(event.id, updates);
      } else {
        const payload: CalendarEventCreate = {
          title: title.trim(),
          description: description.trim() || undefined,
          start_time: allDay
            ? format(baseDate, "yyyy-MM-dd'T'00:00:00")
            : buildISODateTime(baseDate, startTime),
          end_time: allDay
            ? format(baseDate, "yyyy-MM-dd'T'23:59:59")
            : buildISODateTime(baseDate, endTime),
          location: location.trim() || undefined,
          is_all_day: allDay,
        };
        await onSave(payload);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save event';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    setSaving(true);
    try {
      await onDelete(event.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete event';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn("p-0 overflow-hidden", isEditing ? "sm:max-w-[560px]" : "sm:max-w-[425px]")}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? 'Edit Event' : 'New Event'}
          </DialogTitle>
          {isEditing && (
            <div className="flex gap-1 mt-3">
              <button
                type="button"
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  tab === 'details' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                )}
                onClick={() => setTab('details')}
              >
                Details
              </button>
              <button
                type="button"
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5',
                  tab === 'materials' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                )}
                onClick={() => setTab('materials')}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Materials
                {materials.length > 0 && (
                  <span className="ml-1 text-xs bg-background/20 px-1.5 rounded-full">{materials.length}</span>
                )}
              </button>
            </div>
          )}
        </DialogHeader>

        {tab === 'details' ? (
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {formError && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}

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

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
          </div>

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
                disabled={saving}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
        ) : (
          <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Generate AI-powered materials for this event</p>
              <div className="grid grid-cols-2 gap-2">
                {(['briefing', 'summary', 'agenda', 'talking_points'] as MaterialType[]).map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    disabled={generatingType === type}
                    onClick={() => generateMaterial(type)}
                    className="justify-start gap-2 capitalize"
                  >
                    {generatingType === type ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {type.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {loadingMaterials ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading materials...
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No materials generated yet</p>
                <p className="text-xs mt-1">Click a type above to generate</p>
              </div>
            ) : (
              <div className="space-y-3">
                {materials.map((m) => (
                  <div key={m.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{m.material_type.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {m.generated_at ? format(new Date(m.generated_at), 'MMM d, h:mm a') : ''}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMaterial(m.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
