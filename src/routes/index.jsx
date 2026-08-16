import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MessagesSquare,
  MapPinned,
  AlertTriangle,
  Lightbulb,
  BrainCircuit,
  ArrowRight,
  Globe2,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { SectionCard } from "@/components/ui/Card";
import { PriorityBadge, CategoryBadge } from "@/components/ui/Badge";
import { DemoNotice, LoadingState } from "@/components/ui/States";
import { Select } from "@/components/ui/Field";
import { COUNTRIES, CATEGORIES, priorityFromScore } from "@/lib/constants";
import {
  DEMAND_BY_CATEGORY,
  DEMAND_TREND,
  DEMO_HOTSPOTS,
  DEMO_KPIS,
  DEMO_REQUESTS,
  TOP_REGIONS,
} from "@/lib/demoData";
import { getHotspots, getRequests } from "@/lib/api";
import { useApiResource } from "@/hooks/useApiResource";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivilIntel Overview — Citizen Development Intelligence" },
      {
        name: "description",
        content:
          "Real-time policymaker dashboard of citizen development requests, demand hotspots and infrastructure priorities.",
      },
      { property: "og:title", content: "CivilIntel Overview — Development Intelligence" },
      {
        property: "og:description",
        content: "Turning citizen voices into data-driven development decisions.",
      },
    ],
  }),
  component: Overview,
});

const chartTooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.5rem",
    fontSize: 12,
    color: "var(--card-foreground)",
    boxShadow: "var(--shadow-card)",
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11 },
};

function Overview() {
  const [country, setCountry] = useState("India");

  const requests = useApiResource(() => getRequests({ country }), {
    fallback: DEMO_REQUESTS,
    deps: [country],
  });
  const hotspots = useApiResource(() => getHotspots({ country }), {
    fallback: DEMO_HOTSPOTS,
    deps: [country],
  });

  const isDemo = requests.isDemo || hotspots.isDemo;

  const kpis = useMemo(() => {
    if (requests.isDemo) return DEMO_KPIS;
    const rows = requests.data;
    return {
      totalRequests: rows.length,
      hotspots: hotspots.data.length,
      criticalIssues: rows.filter((r) => r.priority === "Critical").length,
      highPriorityProjects: hotspots.data.filter((h) => (h.criticalCount ?? 0) > 0).length,
    };
  }, [requests.data, requests.isDemo, hotspots.data]);

  const categoryData = useMemo(() => {
    if (requests.isDemo) return DEMAND_BY_CATEGORY;
    return CATEGORIES.filter((c) => c !== "Other").map((category) => ({
      category,
      requests: requests.data.filter((r) => r.category === category).length,
    }));
  }, [requests.data, requests.isDemo]);

  const trendData = useMemo(() => {
    if (requests.isDemo) return DEMAND_TREND;
    const buckets = new Map();
    requests.data.forEach((r) => {
      const d = new Date(r.createdAt ?? Date.now());
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    return [...buckets.entries()].map(([month, count]) => ({ month, requests: count }));
  }, [requests.data, requests.isDemo]);

  const topRegions = useMemo(() => {
    if (hotspots.isDemo) return TOP_REGIONS;
    return [...hotspots.data]
      .sort((a, b) => (b.requestCount ?? 0) - (a.requestCount ?? 0))
      .slice(0, 6)
      .map((h) => ({
        district: h.district,
        state: h.state,
        category: h.category,
        requestCount: h.requestCount ?? 0,
        score: Math.min(100, Math.round((h.requestCount ?? 0) / 3 + (h.criticalCount ?? 0))),
      }));
  }, [hotspots.data, hotspots.isDemo]);

  const loading = requests.loading || hotspots.loading;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Good Morning, Policymaker"
        subtitle="Real-time intelligence from citizen development requests and regional infrastructure data."
        actions={
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-xs">
            <Globe2 className="size-4 text-primary" />
            <label htmlFor="country" className="sr-only">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {isDemo && !loading && (
        <DemoNotice>
          Showing labelled sample data — connect the CivilIntel API at http://localhost:5000 to view
          live intelligence.
        </DemoNotice>
      )}

      {loading ? (
        <LoadingState label="Aggregating citizen demand signals…" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Total Citizen Requests"
              value={kpis.totalRequests.toLocaleString()}
              description="across all channels"
              icon={MessagesSquare}
              tone="primary"
              trend={{ value: "+12.4%", direction: "up" }}
            />
            <KpiCard
              label="Active Demand Hotspots"
              value={kpis.hotspots.toLocaleString()}
              description="districts under watch"
              icon={MapPinned}
              tone="warning"
              trend={{ value: "+3", direction: "up" }}
            />
            <KpiCard
              label="Critical Issues"
              value={kpis.criticalIssues.toLocaleString()}
              description="require urgent review"
              icon={AlertTriangle}
              tone="critical"
              trend={{ value: "+18", direction: "up" }}
            />
            <KpiCard
              label="High Priority Projects"
              value={kpis.highPriorityProjects.toLocaleString()}
              description="recommended for funding"
              icon={Lightbulb}
              tone="success"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-5">
            <SectionCard
              title="Demand by Category"
              subtitle="Citizen requests grouped by AI-detected development category"
              className="xl:col-span-3"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip cursor={{ fill: "var(--accent)", opacity: 0.4 }} {...chartTooltipStyle} />
                    <Bar dataKey="requests" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard
              title="Citizen Demand Trend"
              subtitle="Requests received over time"
              className="xl:col-span-2"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip {...chartTooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="var(--chart-2)"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "var(--chart-2)", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-5">
            <SectionCard
              title="Top Priority Regions"
              subtitle="Ranked by citizen demand and priority score"
              className="xl:col-span-3"
              bodyClassName="px-0 py-0"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      {["Rank", "District", "Category", "Requests", "Score", "Priority"].map((h) => (
                        <th key={h} className="px-5 py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topRegions.map((r, i) => (
                      <tr key={`${r.district}-${r.category}`} className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/40">
                        <td className="px-5 py-3 font-semibold tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-semibold">{r.district}</p>
                          <p className="text-xs text-muted-foreground">{r.state}</p>
                        </td>
                        <td className="px-5 py-3">
                          <CategoryBadge category={r.category} />
                        </td>
                        <td className="px-5 py-3 tabular-nums">{r.requestCount}</td>
                        <td className="px-5 py-3 tabular-nums font-semibold">{r.score}/100</td>
                        <td className="px-5 py-3">
                          <PriorityBadge level={priorityFromScore(r.score)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <div className="xl:col-span-2">
              <div className="surface-card h-full overflow-hidden bg-navy text-navy-foreground">
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/25">
                    <BrainCircuit className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">CivilIntel AI Insight</p>
                    <p className="text-[11px] text-navy-foreground/60">Generated from live demand + regional indices</p>
                  </div>
                </div>
                <div className="space-y-4 px-5 py-5">
                  <p className="text-[15px] leading-relaxed text-navy-foreground/90">
                    “{topRegions[0]?.district ?? "Chikkamagaluru"} shows a significant{" "}
                    {(topRegions[0]?.category ?? "Water").toLowerCase()} infrastructure gap. High citizen
                    demand, low infrastructure performance, and insufficient investment indicate that this
                    region should be prioritized.”
                  </p>
                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                      <dt className="text-navy-foreground/60">Demand signal</dt>
                      <dd className="mt-0.5 text-base font-bold tabular-nums">
                        {topRegions[0]?.requestCount ?? 247}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                      <dt className="text-navy-foreground/60">Priority score</dt>
                      <dd className="mt-0.5 text-base font-bold tabular-nums">
                        {topRegions[0]?.score ?? 87}/100
                      </dd>
                    </div>
                  </dl>
                  <Link
                    to="/recommendations"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View recommendations
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
