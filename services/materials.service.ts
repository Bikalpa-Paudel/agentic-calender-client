import { apiFetch } from "./api";
import type { EventMaterial, MaterialType } from "@/types/calendar";

export const materialsService = {
  async getMaterials(eventId: number): Promise<EventMaterial[]> {
    return apiFetch(`/materials/events/${eventId}`);
  },

  async generate(
    eventId: number,
    materialType: MaterialType
  ): Promise<EventMaterial> {
    return apiFetch("/materials/generate", {
      method: "POST",
      body: JSON.stringify({
        event_id: eventId,
        material_type: materialType,
      }),
    });
  },

  async deleteMaterial(id: number): Promise<void> {
    await apiFetch(`/materials/${id}`, { method: "DELETE" });
  },
};
