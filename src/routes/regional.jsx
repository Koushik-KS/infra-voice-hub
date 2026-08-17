import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, FileText, Gauge, Users, Wallet, MessagesSquare, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { SectionCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Label, Select } from "@/components/ui/Field";
import { DemoNotice, LoadingState } from "@/components/ui/States";
import { ScoreMethodologyModal } from "@/components/ScoreMethodologyModal";
import {
  COUNTRIES,
  DISTRICTS_BY_STATE,
  SCORE_FACTORS,
  STATES_BY_COUNTRY,
  priorityFromScore,
} from "@/lib/constants";
import { DEMO_RECOMMENDATIONS, DEMO_REQUESTS } from "@/lib/demoData";
import { getRecommendations, getRequests } from "@/lib/api";
import { useApiResource } from "@/hooks/useApiResource";

export const Route = createFileRoute("/regional")({
  head: () => ({
    meta: [
      { title: "Regional Intelligence — CivilIntel" },
      {
        name: "description",
        content:
          "District-level development intelligence: population, infrastructure index, investment and citizen demand distribution.",
      },
      { property: "og:title", content: "Regional Intelligence — CivilIntel" },
      {
        property: "og:description",
        content: "Deep-dive regional profiles combining citizen demand with development indicators.",
      },
    ],
  }),
  component: RegionalPage,
});

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
];

const tooltipProps = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.5rem",
    fontSize: 12,
    color: "var(--card-foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11 },
};

function Stat({ label, value, icon: Icon, tone = "primary" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning",
    critical: "bg-destructive/12 text-destructive",
    success: "bg-success/12 text-success",
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
      <span className={`flex size-8 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function RegionalPage() {
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Karnataka");
  const [district, setDistrict] = useState("Chikkamagaluru");

  const recs = useApiResource(() => getRecommendations({ country, state, district }), {
    fallback: DEMO_RECOMMENDATIONS,
    deps: [country, state, district],
  });
  const requests = useApiResource(() => getRequests({ country, state, district }), {
    fallback: DEMO_REQUESTS,
    deps: [country, state, district],
  });

  const states = STATES_BY_COUNTRY[country] ?? [];
  const districts = DISTRICTS_BY_STATE[state] ?? [];
  const isDemo = recs.isDemo || requests.isDemo;
  const loading = recs.loading || requests.loading;

  const profile = useMemo(() => {
    const match = recs.data.find((r) => r.district === district) ?? recs.data[0];
    const ctx = match?.regionalContext ?? {};
    return {
      district: match?.district ?? district,
      state: match?.state ?? state,
      population: ctx.population ?? 0,
      infrastructureIndex: ctx.infrastructureIndex ?? 0,
      publicInvestment: ctx.publicInvestment ?? 0,
      totalRequests: ctx.totalRequests ?? match?.citizenDemand ?? 0,
      criticalRequests: ctx.criticalRequests ?? 0,
      breakdown: match?.priority?.breakdown ?? {},
      score: Math.min(100, Math.round(match?.priority?.totalScore ?? 0)),
      category: match?.category ?? "Water",
      project: match?.recommendedProject,
    };
  }, [recs.data, district, state]);

  const gap = Math.max(0, 100 - profile.infrastructureIndex);

  const donutData = useMemo(() => {
    const rows = requests.data.filter((r) => !district || r.location?.district === district);
    const source = rows.length > 0 ? rows : requests.data;
    const map = new Map();
    source.forEach((r) => map.set(r.category ?? "Other", (map.get(r.category ?? "Other") ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [requests.data, district]);

  const factorData = SCORE_FACTORS.map((f) => ({
    factor: f.label,
    points: profile.breakdown[f.key] ?? 0,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Regional Intelligence"
        subtitle="Combine citizen demand with demographic, infrastructure and investment indicators for any region."
        actions={<ScoreMethodologyModal />}
      />

      <SectionCard title="Select a region" icon={BarChart3}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="r-country">Country</Label>
            <Select
              id="r-country"
              value={country}
              onChange={(e) => {
                const value = e.target.value;
                setCountry(value);
                const next = STATES_BY_COUNTRY[value] ?? [];
                setState(next[0] ?? "");
                setDistrict((DISTRICTS_BY_STATE[next[0]] ?? [])[0] ?? "");
              }}
              options={COUNTRIES}
            />
          </div>
          <div>
            <Label htmlFor="r-state">State</Label>
            <Select
              id="r-state"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict((DISTRICTS_BY_STATE[e.target.value] ?? [])[0] ?? "");
              }}
              options={states}
            />
          </div>
          <div>
            <Label htmlFor="r-district">District</Label>
            <Select id="r-district" value={district} onChange={(e) => setDistrict(e.target.value)} options={districts} />
          </div>
        </div>
      </SectionCard>

      {isDemo && !loading && <DemoNotice />}

      {loading ? (
        <SectionCard>
          <LoadingState label="Compiling regional profile…" />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-3">
            <SectionCard
              title="Regional Profile"
              subtitle={`${profile.district}, ${profile.state}`}
              className="xl:col-span-2"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Stat label="Population" value={profile.population.toLocaleString()} icon={Users} />
                <Stat label="Public Investment" value={`₹${profile.publicInvestment} Cr`} icon={Wallet} tone="success" />
                <Stat label="Total Citizen Requests" value={profile.totalRequests} icon={MessagesSquare} />
                <Stat label="Critical Requests" value={profile.criticalRequests} icon={AlertTriangle} tone="critical" />
                <Stat label="Infrastructure Index" value={`${profile.infrastructureIndex}/100`} icon={Gauge} tone="warning" />
                <Stat label="Infrastructure Gap" value={`${gap} points`} icon={Gauge} tone="critical" />
              </div>
            </SectionCard>

            <SectionCard title="Infrastructure Index" subtitle="Regional service performance" icon={Gauge}>
              <div className="relative h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    data={[{ name: "index", value: profile.infrastructureIndex, fill: "var(--chart-1)" }]}
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={220}
                    endAngle={-40}
                  >
                    <YAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                    <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "var(--muted)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold tabular-nums">{profile.infrastructureIndex}</p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                  <Badge tone={gap > 50 ? "critical" : gap > 35 ? "warning" : "success"} className="mt-2">
                    {gap > 50 ? "Severe gap" : gap > 35 ? "Moderate gap" : "Adequate"}
                  </Badge>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <SectionCard title="Demand Distribution" subtitle="Citizen requests by category">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3}>
                      {donutData.map((entry, i) => (
                        <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="var(--card)" />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip {...tooltipProps} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Priority Factors" subtitle="Points contributed to the regional priority score">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorData} layout="vertical" margin={{ left: 24, right: 16, top: 8, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="factor"
                      width={110}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip cursor={{ fill: "var(--accent)", opacity: 0.4 }} {...tooltipProps} />
                    <Bar dataKey="points" fill="var(--chart-2)" radius={[0, 6, 6, 0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Development Intelligence Summary" icon={FileText}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{profile.district}</span> serves a population of{" "}
              {profile.population.toLocaleString()} with an infrastructure index of{" "}
              {profile.infrastructureIndex}/100, leaving a gap of {gap} points against the national benchmark.
              Citizens have submitted {profile.totalRequests} development requests, of which{" "}
              {profile.criticalRequests} are classified as critical. Public investment currently stands at ₹
              {profile.publicInvestment} crore. Demand is concentrated in{" "}
              {donutData.sort((a, b) => b.value - a.value)[0]?.name?.toLowerCase() ?? profile.category.toLowerCase()}{" "}
              services, and the transparent priority model scores this region{" "}
              <span className="font-semibold text-foreground">{profile.score}/100</span> (
              {priorityFromScore(profile.score)}).{" "}
              {profile.project
                ? `Recommended action: ${profile.project.toLowerCase().replace("prioritize", "prioritise")}.`
                : ""}
            </p>
          </SectionCard>
        </>
      )}
    </div>
  );
}
