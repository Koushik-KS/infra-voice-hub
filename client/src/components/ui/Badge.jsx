import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-secondary text-secondary-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/25",
  success: "bg-success/12 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/35",
  caution: "bg-caution/20 text-caution-foreground border-caution/45",
  critical: "bg-destructive/12 text-destructive border-destructive/30",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONES[tone] ?? TONES.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

const PRIORITY_TONE = {
  Critical: "critical",
  High: "warning",
  Medium: "caution",
  Low: "success",
};

export function PriorityBadge({ level, className }) {
  return (
    <Badge tone={PRIORITY_TONE[level] ?? "neutral"} className={className}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {level ?? "Unrated"}
    </Badge>
  );
}

const CATEGORY_TONE = {
  Water: "primary",
  Road: "neutral",
  Healthcare: "critical",
  Agriculture: "success",
  Education: "primary",
  Electricity: "caution",
  Sanitation: "warning",
};

export function CategoryBadge({ category, className }) {
  return (
    <Badge tone={CATEGORY_TONE[category] ?? "neutral"} className={className}>
      {category ?? "Other"}
    </Badge>
  );
}

export function StatusBadge({ status }) {
  const tone =
    status === "Analyzed" || status === "Completed" || status === "Submitted Successfully"
      ? "success"
      : status === "Under Review"
        ? "warning"
        : "neutral";
  return <Badge tone={tone}>{status ?? "Received"}</Badge>;
}
