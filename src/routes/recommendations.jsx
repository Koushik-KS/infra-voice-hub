import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Target, Users, Gauge, Wallet, MessagesSquare, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { SectionCard } from "@/components/ui/Card";
import { PriorityBadge, CategoryBadge } from "@/components/ui/Badge";
import { DemoNotice, EmptyState, LoadingState } from "@/components/ui/States";
import { ScoreMethodologyModal } from "@/components/ScoreMethodologyModal";
import { SCORE_FACTORS, priorityFromScore } from "@/lib/constants";
import { DEMO_RECOMMENDATIONS } from "@/lib/demoData";
import { getRecommendations } from "@/lib/api";
import { useApiResource } from "@/hooks/useApiResource";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "AI-Powered Project Recommendations — CivilIntel" },
      {
        name: "description",
        content:
          "Transparent, explainable development project recommendations ranked by citizen demand and regional indicators.",
      },
      { property: "og:title", content: "AI-Powered Project Recommendations — CivilIntel" },
      {
        property: "og:description",
        content: "Know which development project to prioritise, and exactly why.",
      },
    ],
  }),
  component: RecommendationsPage,
});

const FACTOR_ICONS = {
  citizenDemand: MessagesSquare,
  urgency: Target,
  infrastructureGap: Gauge,
  populationImpact: Users,
  investmentGap: Wallet,
};

function scoreOf(r) {
  return Math.min(100, Math.round(r?.priority?.totalScore ?? 0));
}

function RecommendationCard({ rec, rank }) {
  const score = scoreOf(rec);
  const level = rec?.priority?.level ?? priorityFromScore(score);
  const breakdown = rec?.priority?.breakdown ?? {};
  const ctx = rec?.regionalContext ?? {};

  return (
    <article className="surface-card overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-bold text-navy-foreground">
            #{rank}
          </span>
          <div>
            <p className="text-eyebrow">Priority #{rank}</p>
            <h3 className="mt-0.5 text-base font-bold">
              {rec.district} — {rec.recommendedProject?.replace("Prioritize ", "") ?? rec.category}
            </h3>
            <div className="mt-1.5 flex items-center gap-2">
              <CategoryBadge category={rec.category} />
              <span className="text-xs text-muted-foreground">
                {rec.state}, {rec.country ?? "India"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums leading-none">
            {score}
            <span className="text-sm font-semibold text-muted-foreground"> / 100</span>
          </p>
          <div className="mt-1.5 flex justify-end">
            <PriorityBadge level={level} />
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={
              "h-full rounded-full transition-all duration-700 " +
              (level === "Critical"
                ? "bg-destructive"
                : level === "High"
                  ? "bg-warning"
                  : level === "Medium"
                    ? "bg-caution"
                    : "bg-success")
            }
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="grid gap-5 px-5 pb-5 lg:grid-cols-2">
        <div>
          <p className="text-eyebrow">Why this project?</p>
          <ul className="mt-2 space-y-2">
            {SCORE_FACTORS.map((f) => {
              const Icon = FACTOR_ICONS[f.key];
              const points = breakdown[f.key] ?? 0;
              return (
                <li key={f.key} className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex-1 text-xs font-medium">{f.label}</span>
                  <span className="w-24 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-1.5 rounded-full bg-primary"
                      style={{ width: `${Math.min(100, (points / f.max) * 100)}%` }}
                    />
                  </span>
                  <span className="w-14 text-right text-xs font-semibold tabular-nums">{points} pts</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-eyebrow">Regional context</p>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border px-3 py-2">
                <dt className="text-muted-foreground">Population</dt>
                <dd className="mt-0.5 font-bold tabular-nums">
                  {(ctx.population ?? 0).toLocaleString()}
                </dd>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <dt className="text-muted-foreground">Infrastructure index</dt>
                <dd className="mt-0.5 font-bold tabular-nums">{ctx.infrastructureIndex ?? "—"}/100</dd>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <dt className="text-muted-foreground">Public investment</dt>
                <dd className="mt-0.5 font-bold tabular-nums">₹{ctx.publicInvestment ?? "—"} Cr</dd>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <dt className="text-muted-foreground">Citizen requests</dt>
                <dd className="mt-0.5 font-bold tabular-nums">
                  {rec.citizenDemand ?? ctx.totalRequests ?? 0}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-primary">
              <BrainCircuit className="size-3.5" />
              AI explanation
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {rec.explanation ??
                `High citizen demand for ${rec.category?.toLowerCase()} services combined with regional infrastructure and investment gaps places this project among the top priorities for ${rec.district}.`}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-xs font-semibold text-success">
            <CheckCircle2 className="size-4 shrink-0" />
            {rec.recommendedProject ?? `Prioritize ${rec.category} project`}
          </div>
        </div>
      </div>
    </article>
  );
}

function RecommendationsPage() {
  const { data, loading, isDemo } = useApiResource(() => getRecommendations(), {
    fallback: DEMO_RECOMMENDATIONS,
  });

  const sorted = useMemo(() => [...data].sort((a, b) => scoreOf(b) - scoreOf(a)), [data]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="AI-Powered Project Recommendations"
        subtitle="Data-driven recommendations generated from citizen demand and regional development indicators."
        actions={<ScoreMethodologyModal />}
      />

      {isDemo && !loading && <DemoNotice />}

      {loading ? (
        <SectionCard>
          <LoadingState label="Scoring development priorities…" />
        </SectionCard>
      ) : sorted.length === 0 ? (
        <SectionCard>
          <EmptyState
            title="No recommendations yet"
            description="Recommendations appear once citizen requests have been analysed for a region."
          />
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {sorted.map((rec, i) => (
            <RecommendationCard key={`${rec.district}-${rec.category}`} rec={rec} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
