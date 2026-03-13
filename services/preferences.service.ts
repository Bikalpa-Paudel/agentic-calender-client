import { apiFetch } from "./api";
import type { UserPreferences, UserPreferencesUpdate } from "@/types/calendar";

export const preferencesService = {
  async get(): Promise<UserPreferences> {
    return apiFetch("/preferences/");
  },

  async update(data: UserPreferencesUpdate): Promise<UserPreferences> {
    return apiFetch("/preferences/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
