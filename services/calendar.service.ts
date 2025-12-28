import { API_BASE_URL } from "@/lib/utils";

export class CalendarService {
    async getCalendars(access_token: string): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/integrations/calendar/`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch calendars");
        }
        const data = await response.json();
        return data.items;
    }
}