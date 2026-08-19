import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { PRIORITY_LEVELS, SCORE_FACTORS } from "@/lib/constants";
import { PriorityBadge } from "@/components/ui/Badge";

export function ScoreMethodologyModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <HelpCircle className="size-3.5" />
        How is this score calculated?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="surface-card max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-b-none sm:rounded-b-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold">Transparent priority scoring</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Every recommendation is explainable. The final score is capped at 100.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-5 px-5 py-4">
              <div>
                <p className="text-eyebrow">Scoring factors</p>
                <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border">
                  {SCORE_FACTORS.map((f) => (
                    <li key={f.key} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>{f.label}</span>
                      <span className="text-xs font-semibold text-muted-foreground">max {f.max} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-eyebrow">Priority levels</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PRIORITY_LEVELS.map((p) => (
                    <div key={p.level} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <PriorityBadge level={p.level} />
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">{p.range}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                Citizen demand is weighted highest so that lived experience drives investment,
                while infrastructure and investment gaps identify structurally underserved regions.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
