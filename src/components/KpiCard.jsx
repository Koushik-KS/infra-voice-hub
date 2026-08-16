import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning",
  critical: "bg-destructive/12 text-destructive",
};

export function KpiCard({ label, value, description, icon: Icon, tone = "primary", trend }) {
  const positive = trend?.direction !== "down";
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="surface-card group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-eyebrow">{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105", TONES[tone])}>
          {Icon && <Icon className="size-4.5" />}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold",
              positive ? "text-success" : "text-destructive",
            )}
          >
            <TrendIcon className="size-3.5" />
            {trend.value}
          </span>
        )}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
