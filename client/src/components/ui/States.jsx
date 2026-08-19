import { AlertTriangle, Inbox, Loader2, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading intelligence…", className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground", className)}>
      <Loader2 className="size-5 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted", className)} />;
}

export function EmptyState({ title = "No data yet", description, icon: Icon = Inbox, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-12 text-center", className)}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-10 text-center", className)}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold">Could not reach the CivilIntel API</p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          {message || "Ensure the backend is running at http://localhost:5000."}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-accent"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function DemoNotice({ className, children }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-warning/35 bg-warning/10 px-3 py-2 text-xs text-warning",
        className,
      )}
    >
      <FlaskConical className="mt-0.5 size-3.5 shrink-0" />
      <p className="font-medium">
        {children || "Sample demonstration data — the live API returned no records yet."}
      </p>
    </div>
  );
}
