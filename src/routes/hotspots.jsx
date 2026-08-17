import { Suspense, lazy, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { MapPinned, Flame, Layers, Building2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { SectionCard } from "@/components/ui/Card";
import { Badge, CategoryBadge, PriorityBadge } from "@/components/ui/Badge";
import { DemoNotice, LoadingState, Skeleton } from "@/components/ui/States";
import { DEMO_HOTSPOTS } from "@/lib/demoData";
import { getHotspots } from "@/lib/api";
import { useApiResource } from "@/hooks/useApiResource";
import { hotspotLevel } from "@/components/HotspotMap";

const HotspotMap = lazy(() => import("@/components/HotspotMap"));

export const Route = createFileRoute("/hotspots")({
  head: () => ({
    meta: [
      { title: "Demand Hotspots — CivilIntel Geographic Intelligence" },
      {
        name: "description",
        content:
          "Interactive map of districts with concentrated citizen demand, ranked by request volume and criticality.",
      },
      { property: "og:title", content: "Demand Hotspots — CivilIntel" },
      {
        property: "og:description",
        content: "See where citizen development demand is concentrated across regions.",
      },
    ],
  }),
  component: HotspotsPage,
});

function HotspotsPage() {
  const { data, loading, isDemo } = useApiResource(() => getHotspots(), { fallback: DEMO_HOTSPOTS });
  const [levelFilter, setLevelFilter] = useState("");

  const enriched = useMemo(
    () =>
      [...data]
        .map((h) => ({ ...h, level: hotspotLevel(h) }))
        .sort((a, b) => (b.requestCount ?? 0) - (a.requestCount ?? 0)),
    [data],
  );

  const visible = levelFilter ? enriched.filter((h) => h.level === levelFilter) : enriched;

  const summary = useMemo(() => {
    const byCategory = new Map();
    enriched.forEach((h) => byCategory.set(h.category, (byCategory.get(h.category) ?? 0) + (h.requestCount ?? 0)));
    const topCategory = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      total: enriched.length,
      critical: enriched.filter((h) => h.level === "Critical").length,
      topCategory: topCategory?.[0] ?? "—",
      topDistrict: enriched[0]?.district ?? "—",
    };
  }, [enriched]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Demand Hotspots"
        subtitle="Regions with concentrated citizen demand requiring attention."
      />

      {isDemo && !loading && <DemoNotice />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Hotspots" value={summary.total} description="districts tracked" icon={MapPinned} />
        <KpiCard label="Critical Hotspots" value={summary.critical} description="need urgent action" icon={Flame} tone="critical" />
        <KpiCard label="Most Requested Category" value={summary.topCategory} description="by request volume" icon={Layers} tone="warning" />
        <KpiCard label="Most Affected District" value={summary.topDistrict} description="highest demand" icon={Building2} tone="success" />
      </div>

      <SectionCard
        title="Geographic demand intelligence"
        subtitle="Marker size reflects request volume; colour reflects hotspot severity"
        icon={MapPinned}
        bodyClassName="px-0 py-0"
        action={
          <div className="flex flex-wrap items-center gap-1.5">
            {["", "Critical", "High", "Medium", "Low"].map((level) => (
              <button
                key={level || "all"}
                onClick={() => setLevelFilter(level)}
                className={
                  "rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors " +
                  (levelFilter === level
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent")
                }
              >
                {level || "All"}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-[26rem] w-full overflow-hidden px-5 pb-5">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ClientOnly fallback={<Skeleton className="h-full w-full" />}>
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <HotspotMap hotspots={visible} />
              </Suspense>
            </ClientOnly>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Ranked hotspots" subtitle="Ordered by citizen request volume" bodyClassName="px-0 py-0">
        {loading ? (
          <LoadingState label="Locating demand clusters…" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Rank", "District", "State", "Category", "Requests", "Critical", "High", "Severity"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((h, i) => (
                  <tr key={`${h.district}-${h.category}`} className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-4 py-3 font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3 font-semibold">{h.district}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{h.state}</td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={h.category} />
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold">{h.requestCount ?? 0}</td>
                    <td className="px-4 py-3 tabular-nums text-destructive">{h.criticalCount ?? 0}</td>
                    <td className="px-4 py-3 tabular-nums text-warning">{h.highCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <PriorityBadge level={h.level} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-eyebrow">Legend</span>
        <Badge tone="critical">Critical</Badge>
        <Badge tone="warning">High</Badge>
        <Badge tone="caution">Medium</Badge>
        <Badge tone="success">Low</Badge>
      </div>
    </div>
  );
}
