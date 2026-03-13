"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bot,
  Loader2,
  AlertCircle,
  RotateCcw,
  CalendarPlus,
  CalendarX,
  Pencil,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { agentService } from "@/services/agent.service";
import type { AgentAction, AgentStats } from "@/types/calendar";
import { cn } from "@/lib/utils";

const ACTION_ICONS: Record<string, typeof CalendarPlus> = {
  event_created: CalendarPlus,
  event_updated: Pencil,
  event_deleted: CalendarX,
  material_generated: FileText,
};

const STATUS_STYLES: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  completed: { icon: CheckCircle2, className: "text-emerald-600 bg-emerald-500/10" },
  failed: { icon: XCircle, className: "text-destructive bg-destructive/10" },
  reverted: { icon: Undo2, className: "text-amber-600 bg-amber-500/10" },
  pending: { icon: Clock, className: "text-blue-600 bg-blue-500/10" },
  processing: { icon: Loader2, className: "text-blue-600 bg-blue-500/10" },
};

function formatActionType(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActionsPage() {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revertingId, setRevertingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [actionsData, statsData] = await Promise.all([
        agentService.getActions(filter ?? undefined),
        agentService.getStats(),
      ]);
      setActions(actionsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load actions");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRevert = async (id: number) => {
    setRevertingId(id);
    try {
      await agentService.revertAction(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revert action");
    } finally {
      setRevertingId(null);
    }
  };

  const filters = [
    { label: "All", value: null },
    { label: "Created", value: "event_created" },
    { label: "Updated", value: "event_updated" },
    { label: "Deleted", value: "event_deleted" },
    { label: "Materials", value: "material_generated" },
  ];

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6 overflow-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          AI Agent Actions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Everything the AI has done on your behalf — fully trackable and revertible
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Actions</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold text-emerald-600">
              {stats.by_status?.completed ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold text-amber-600">
              {stats.by_status?.reverted ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Reverted</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold text-destructive">
              {stats.by_status?.failed ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <Button variant="ghost" size="sm" className="ml-auto text-destructive hover:text-destructive" onClick={fetchData}>
            Retry
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <Button
            key={f.label}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-lg text-sm",
              filter === f.value && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Actions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bot className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No actions yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Use the AI Assistant to manage your calendar and actions will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = ACTION_ICONS[action.action_type] || Bot;
            const statusDef = STATUS_STYLES[action.status] || STATUS_STYLES.pending;
            const StatusIcon = statusDef.icon;
            const isReverting = revertingId === action.id;

            return (
              <div
                key={action.id}
                className="flex items-start gap-4 rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{formatActionType(action.action_type)}</span>
                    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium", statusDef.className)}>
                      <StatusIcon className={cn("h-3 w-3", action.status === "processing" && "animate-spin")} />
                      {action.status}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">
                      {action.trigger_source}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{new Date(action.created_at).toLocaleString()}</span>
                    {action.reverted_at && (
                      <span className="text-amber-600">
                        Reverted {new Date(action.reverted_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {action.is_revertible && !action.reverted_at && action.status === "completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevert(action.id)}
                    disabled={isReverting}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                  >
                    {isReverting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-1" />
                    )}
                    Revert
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
