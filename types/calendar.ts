// ── Event colors ──
export type EventColor = 'coral' | 'violet' | 'emerald' | 'amber' | 'sky' | 'rose';

// ── Calendar Events (maps to backend CalendarEventCache / Google events) ──
export interface CalendarEvent {
  id: number;
  external_event_id: string;
  title: string;
  description?: string;
  date: Date;
  start_time: string;      // ISO datetime from backend
  end_time: string;
  startTime?: string;       // HH:mm local display
  endTime?: string;
  color: EventColor;
  is_all_day: boolean;
  location?: string;
  status?: string;
  organizer_email?: string;
  meeting_link?: string;
  attendees?: string;
}

export type ViewMode = 'day' | 'week' | 'month' | 'year';

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  viewMode: ViewMode;
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

// ── API request/response types ──
export interface CalendarEventCreate {
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day?: boolean;
  attendees?: string[];
  reminder_minutes?: number;
}

export interface CalendarEventUpdate {
  title?: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  attendees?: string[];
}

export interface FreeSlotsRequest {
  start_date: string;
  end_date: string;
  duration_minutes?: number;
}

export interface FreeSlot {
  start: string;
  end: string;
}

// ── Chat ──
export interface ChatConversation {
  id: number;
  title: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  action_triggered?: number | null;
  created_at: string;
}

export interface ChatConversationDetail {
  id: number;
  title: string | null;
  is_active: boolean;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// ── Agent Actions ──
export type AgentActionType = 'event_created' | 'event_updated' | 'event_deleted' | 'material_generated' | 'email_sent' | 'message_sent' | 'reminder_sent';
export type AgentActionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'reverted';

export interface AgentAction {
  id: number;
  action_type: string;
  status: string;
  trigger_source: string;
  description: string;
  target_resource_type?: string;
  target_resource_id?: string;
  executed_at?: string;
  completed_at?: string;
  is_revertible: boolean;
  reverted_at?: string;
  created_at: string;
}

export interface AgentStats {
  total: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
}

// ── Integrations ──
export interface Integration {
  id: number;
  provider: string;
  tool_type: string;
  tool_name: string;
  tool_identifier?: string;
  is_active: boolean;
  is_primary: boolean;
  sync_enabled: boolean;
  last_sync_at?: string;
  created_at: string;
}

// ── Materials ──
export type MaterialType = 'briefing' | 'summary' | 'agenda' | 'talking_points';

export interface EventMaterial {
  id: number;
  event_id: number;
  material_type: string;
  content: string;
  sources?: string;
  generated_at: string;
  delivered_at?: string;
  delivery_method?: string;
}

// ── Preferences ──
export interface UserPreferences {
  working_hours_start: string;
  working_hours_end: string;
  working_days: string;
  default_meeting_duration: number;
  buffer_time_between_meetings: number;
  auto_generate_materials: boolean;
  material_generation_minutes_before: number;
  auto_sync_calendars: boolean;
  sync_frequency_minutes: number;
  notification_email: boolean;
  notification_slack: boolean;
  ai_agent_personality: string;
}

export type UserPreferencesUpdate = Partial<UserPreferences>;
