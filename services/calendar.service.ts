import { apiFetch } from "./api";
import type {
  CalendarEvent,
  CalendarEventCreate,
  CalendarEventUpdate,
  FreeSlot,
  EventColor,
} from "@/types/calendar";

// ── helpers to map backend → frontend event shape ──

const COLORS: EventColor[] = ["coral", "violet", "emerald", "amber", "sky", "rose"];
let colorIdx = 0;
const eventColorMap = new Map<number, EventColor>();

function colorFor(id: number): EventColor {
  if (eventColorMap.has(id)) return eventColorMap.get(id)!;
  const c = COLORS[colorIdx % COLORS.length];
  colorIdx++;
  eventColorMap.set(id, c);
  return c;
}

function toLocal(ev: Record<string, unknown>): CalendarEvent {
  const start = ev.start_time as string | undefined;
  const end = ev.end_time as string | undefined;
  const startDate = start ? new Date(start) : new Date();
  const isAllDay = (ev.is_all_day as boolean) ?? false;
  const id = ev.id as number;
  return {
    id,
    external_event_id: (ev.external_event_id as string) ?? "",
    title: (ev.title as string) ?? "Untitled",
    description: ev.description as string | undefined,
    date: startDate,
    start_time: start ?? "",
    end_time: end ?? "",
    startTime: start ? startDate.toTimeString().slice(0, 5) : undefined,
    endTime: end ? new Date(end).toTimeString().slice(0, 5) : undefined,
    color: colorFor(id),
    is_all_day: isAllDay,
    location: ev.location as string | undefined,
    status: ev.status as string | undefined,
    organizer_email: ev.organizer_email as string | undefined,
    meeting_link: ev.meeting_link as string | undefined,
    attendees: ev.attendees as string | undefined,
  };
}

// ── Calendar Service ──

export const calendarService = {
  async getEvents(startDate?: string, endDate?: string, search?: string): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    if (search) params.set("search", search);
    const qs = params.toString();
    const data = await apiFetch<Record<string, unknown>[]>(
      `/calendar/events${qs ? `?${qs}` : ""}`
    );
    return data.map(toLocal);
  },

  async getUpcomingEvents(days?: number): Promise<CalendarEvent[]> {
    const qs = days ? `?days=${days}` : "";
    const data = await apiFetch<Record<string, unknown>[]>(
      `/calendar/events/upcoming${qs}`
    );
    return data.map(toLocal);
  },

  async getTodayEvents(): Promise<CalendarEvent[]> {
    const data = await apiFetch<Record<string, unknown>[]>(
      "/calendar/events/today"
    );
    return data.map(toLocal);
  },

  async createEvent(payload: CalendarEventCreate): Promise<CalendarEvent> {
    const data = await apiFetch<Record<string, unknown>>("/calendar/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return toLocal(data);
  },

  async updateEvent(
    eventId: number,
    payload: CalendarEventUpdate
  ): Promise<CalendarEvent> {
    const data = await apiFetch<Record<string, unknown>>(
      `/calendar/events/${eventId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    return toLocal(data);
  },

  async deleteEvent(eventId: number): Promise<void> {
    await apiFetch(`/calendar/events/${eventId}`, {
      method: "DELETE",
    });
  },

  async findFreeSlots(
    startDate: string,
    endDate: string,
    durationMinutes?: number
  ): Promise<FreeSlot[]> {
    return apiFetch<FreeSlot[]>("/calendar/events/free-slots", {
      method: "POST",
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        duration_minutes: durationMinutes ?? 30,
      }),
    });
  },

  async syncCalendar(): Promise<{ message: string; events_synced: number }> {
    return apiFetch("/calendar/sync", { method: "POST" });
  },
};