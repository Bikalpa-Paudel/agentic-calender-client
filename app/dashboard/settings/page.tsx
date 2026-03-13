"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Calendar,
  Bot,
  Bell,
  RefreshCw,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { preferencesService } from "@/services/preferences.service";
import { integrationService } from "@/services/integrations.service";
import type { UserPreferences, Integration } from "@/types/calendar";

const PERSONALITY_OPTIONS = [
  { value: "professional", label: "Professional", desc: "Formal and structured responses" },
  { value: "casual", label: "Casual", desc: "Friendly and conversational" },
  { value: "concise", label: "Concise", desc: "Short and to the point" },
];

const DAY_LABELS = [
  { value: "1", label: "Mon" },
  { value: "2", label: "Tue" },
  { value: "3", label: "Wed" },
  { value: "4", label: "Thu" },
  { value: "5", label: "Fri" },
  { value: "6", label: "Sat" },
  { value: "7", label: "Sun" },
];

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, i] = await Promise.all([
        preferencesService.get(),
        integrationService.getAll(),
      ]);
      setPrefs(p);
      setIntegrations(i);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!prefs) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await preferencesService.update(prefs);
      setPrefs(updated);
      setSuccess("Settings saved");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleIntegration = async (id: number) => {
    try {
      const result = await integrationService.toggle(id);
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_active: result.is_active } : i))
      );
    } catch {
      // silent
    }
  };

  const updatePref = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPrefs((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const toggleWorkingDay = (day: string) => {
    if (!prefs) return;
    const days = prefs.working_days.split(",").filter(Boolean);
    const newDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day].sort();
    updatePref("working_days", newDays.join(","));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!prefs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load preferences</p>
          <Button variant="ghost" onClick={fetchData} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  const workingDays = prefs.working_days.split(",").filter(Boolean);

  return (
    <div className="flex-1 p-6 max-w-3xl mx-auto space-y-8 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your calendar preferences and AI assistant behavior
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Working Hours */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Working Hours</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={prefs.working_hours_start}
              onChange={(e) => updatePref("working_hours_start", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input
              type="time"
              value={prefs.working_hours_end}
              onChange={(e) => updatePref("working_hours_end", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Working Days</Label>
          <div className="flex gap-2">
            {DAY_LABELS.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleWorkingDay(day.value)}
                className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                  workingDays.includes(day.value)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Preferences */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Meeting Preferences</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Duration (min)</Label>
            <Input
              type="number"
              min={5}
              max={480}
              value={prefs.default_meeting_duration}
              onChange={(e) => updatePref("default_meeting_duration", parseInt(e.target.value) || 30)}
            />
          </div>
          <div className="space-y-2">
            <Label>Buffer Between Meetings (min)</Label>
            <Input
              type="number"
              min={0}
              max={60}
              value={prefs.buffer_time_between_meetings}
              onChange={(e) => updatePref("buffer_time_between_meetings", parseInt(e.target.value) || 5)}
            />
          </div>
        </div>
      </section>

      {/* AI Agent Settings */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="space-y-2">
          <Label>Personality</Label>
          <div className="grid grid-cols-3 gap-3">
            {PERSONALITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updatePref("ai_agent_personality", opt.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  prefs.ai_agent_personality === opt.value
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
              >
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-Generate Meeting Materials</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI generates briefings before meetings
            </p>
          </div>
          <Switch
            checked={prefs.auto_generate_materials}
            onCheckedChange={(v) => updatePref("auto_generate_materials", v)}
          />
        </div>
        {prefs.auto_generate_materials && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <Label>Generate Materials (minutes before)</Label>
            <Input
              type="number"
              min={5}
              max={120}
              value={prefs.material_generation_minutes_before}
              onChange={(e) =>
                updatePref("material_generation_minutes_before", parseInt(e.target.value) || 15)
              }
              className="w-[120px]"
            />
          </div>
        )}
      </section>

      {/* Sync Settings */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Calendar Sync</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-Sync Calendars</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically sync with Google Calendar
            </p>
          </div>
          <Switch
            checked={prefs.auto_sync_calendars}
            onCheckedChange={(v) => updatePref("auto_sync_calendars", v)}
          />
        </div>
        {prefs.auto_sync_calendars && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <Label>Sync Frequency (minutes)</Label>
            <Input
              type="number"
              min={5}
              max={120}
              value={prefs.sync_frequency_minutes}
              onChange={(e) =>
                updatePref("sync_frequency_minutes", parseInt(e.target.value) || 15)
              }
              className="w-[120px]"
            />
          </div>
        )}
      </section>

      {/* Notifications */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receive email notifications for reminders
            </p>
          </div>
          <Switch
            checked={prefs.notification_email}
            onCheckedChange={(v) => updatePref("notification_email", v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Slack Notifications</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send notifications via Slack
            </p>
          </div>
          <Switch
            checked={prefs.notification_slack}
            onCheckedChange={(v) => updatePref("notification_slack", v)}
          />
        </div>
      </section>

      {/* Connected Integrations */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Connected Integrations</h2>
        </div>
        {integrations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No integrations connected. Sign in with Google to connect your calendar.
          </p>
        ) : (
          <div className="space-y-3">
            {integrations.map((intg) => (
              <div
                key={intg.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="text-sm font-medium">{intg.tool_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {intg.provider} &middot; {intg.tool_type}
                    {intg.last_sync_at && (
                      <> &middot; Last synced {new Date(intg.last_sync_at).toLocaleString()}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {intg.is_primary && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Primary
                    </span>
                  )}
                  <Switch
                    checked={intg.is_active}
                    onCheckedChange={() => handleToggleIntegration(intg.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
