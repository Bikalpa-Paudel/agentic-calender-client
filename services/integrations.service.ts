import { apiFetch } from "./api";
import type { Integration } from "@/types/calendar";

export const integrationService = {
  async getAll(toolType?: string): Promise<Integration[]> {
    const qs = toolType ? `?tool_type=${toolType}` : "";
    return apiFetch(`/integrations/${qs}`);
  },

  async toggle(id: number): Promise<{ is_active: boolean }> {
    return apiFetch(`/integrations/${id}/toggle`, { method: "PATCH" });
  },

  async remove(id: number): Promise<void> {
    await apiFetch(`/integrations/${id}`, { method: "DELETE" });
  },
};
