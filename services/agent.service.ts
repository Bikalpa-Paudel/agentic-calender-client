import { apiFetch } from "./api";
import type { AgentAction, AgentStats } from "@/types/calendar";

export const agentService = {
  async getActions(
    actionType?: string,
    status?: string
  ): Promise<AgentAction[]> {
    const params = new URLSearchParams();
    if (actionType) params.set("action_type", actionType);
    if (status) params.set("status", status);
    const qs = params.toString();
    return apiFetch(`/agent/actions${qs ? `?${qs}` : ""}`);
  },

  async revertAction(id: number): Promise<AgentAction> {
    return apiFetch(`/agent/actions/${id}/revert`, { method: "POST" });
  },

  async getStats(): Promise<AgentStats> {
    return apiFetch("/agent/stats");
  },
};
