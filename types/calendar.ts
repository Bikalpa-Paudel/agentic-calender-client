export type EventColor = 'coral' | 'violet' | 'emerald' | 'amber' | 'sky' | 'rose';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color: EventColor;
  allDay?: boolean;
  source?: 'manual' | 'google' | 'ai';
}

export type ViewMode = 'day' | 'week' | 'month' | 'year';

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  viewMode: ViewMode;
  events: CalendarEvent[];
}

export type ToolType = 'google-calendar' | 'gmail' | 'slack' | 'jira';

export interface Tool {
  id: ToolType;
  name: string;
  icon: string;
  connected: boolean;
  enabled: boolean;
  status: 'active' | 'inactive' | 'error';
  lastSync?: Date;
}

export interface AIActivity {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'rescheduled';
  eventTitle: string;
  eventId?: string;
  timestamp: Date;
  description: string;
  source: ToolType;
  canRevert: boolean;
  originalData?: Partial<CalendarEvent>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  preview?: {
    type: 'time' | 'date' | 'event';
    data: {
      title?: string;
      date?: Date;
      startTime?: string;
      endTime?: string;
    };
  };
}
