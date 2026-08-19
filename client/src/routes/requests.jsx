import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X, Filter, Inbox } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { SectionCard } from "@/components/ui/Card";

import {
  Badge,
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/ui/Badge";

import {
  Button,
  Select,
  TextInput,
} from "@/components/ui/Field";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/States";

import {
  CATEGORIES,
  DISTRICTS_BY_STATE,
  LANGUAGE_NAMES,
  PRIORITIES,
  SOURCES,
  STATES_BY_COUNTRY,
} from "@/lib/constants";

import { getRequests } from "@/lib/api";
import { useApiResource } from "@/hooks/useApiResource";


export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      {
        title: "Citizen Development Requests — CivilIntel",
      },
      {
        name: "description",
        content:
          "Search, filter and review every citizen development request with AI-detected category, language and priority.",
      },
      {
        property: "og:title",
        content: "Citizen Development Requests — CivilIntel",
      },
      {
        property: "og:description",
        content:
          "Every citizen voice, classified and prioritised for policymakers.",
      },
    ],
  }),

  component: RequestsPage,
});


const ALL_STATES = Object.values(
  STATES_BY_COUNTRY
).flat();


function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


function RequestsPage() {
  const {
    data,
    loading,
    error,
    reload,
  } = useApiResource(() => getRequests());

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [selected, setSelected] = useState(null);


  const districts = state
    ? DISTRICTS_BY_STATE[state] ?? []
    : [];


  // ==========================================
  // FILTER REQUESTS
  // ==========================================

  const filtered = useMemo(() => {
    return data.filter((r) => {

      // Search request text or citizen name
      if (search) {
        const searchText =
          `${r.requestText ?? ""} ${r.citizenName ?? ""}`
            .toLowerCase();

        if (
          !searchText.includes(
            search.toLowerCase()
          )
        ) {
          return false;
        }
      }


      // Category filter
      if (
        category &&
        r.category !== category
      ) {
        return false;
      }


      // Priority filter
      if (
        priority &&
        r.priority !== priority
      ) {
        return false;
      }


      // State filter
      if (
        state &&
        r.state !== state
      ) {
        return false;
      }


      // District filter
      if (
        district &&
        r.district !== district
      ) {
        return false;
      }


      // Source filter
      if (
        sourceFilter &&
        r.source !== sourceFilter
      ) {
        return false;
      }


      // Date filter
      if (
        fromDate &&
        new Date(r.createdAt ?? 0) <
          new Date(fromDate)
      ) {
        return false;
      }


      return true;
    });
  }, [
    data,
    search,
    category,
    priority,
    state,
    district,
    sourceFilter,
    fromDate,
  ]);


  const activeFilters = [
    category,
    priority,
    state,
    district,
    sourceFilter,
    fromDate,
    search,
  ].filter(Boolean).length;


  function clearFilters() {
    setSearch("");
    setCategory("");
    setPriority("");
    setState("");
    setDistrict("");
    setSourceFilter("");
    setFromDate("");
  }


  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* ================================= */}
      {/* PAGE HEADER */}
      {/* ================================= */}

      <PageHeader
        title="Citizen Development Requests"
        subtitle="Every request received through text, voice and messaging channels — classified by CivilIntel AI."
        actions={
          <Badge tone="primary">
            {filtered.length} of {data.length} requests
          </Badge>
        }
      />


      {/* ================================= */}
      {/* FILTERS */}
      {/* ================================= */}

      <SectionCard
        title="Filters"
        icon={Filter}
        bodyClassName="space-y-3"
      >

        {/* SEARCH */}

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <TextInput
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search request text or citizen name…"
            className="pl-9"
          />
        </div>


        {/* FILTER SELECTS */}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">

          <Select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            options={CATEGORIES}
            placeholder="All categories"
          />


          <Select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            options={PRIORITIES}
            placeholder="All priorities"
          />


          <Select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setDistrict("");
            }}
            options={ALL_STATES}
            placeholder="All states"
          />


          <Select
            value={district}
            onChange={(e) =>
              setDistrict(e.target.value)
            }
            options={districts}
            placeholder="All districts"
          />


          <Select
            value={sourceFilter}
            onChange={(e) =>
              setSourceFilter(e.target.value)
            }
            options={SOURCES}
            placeholder="All sources"
          />


          <TextInput
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
          />

        </div>


        {/* CLEAR FILTERS */}

        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            <X className="size-3.5" />

            Clear {activeFilters} filter
            {activeFilters > 1 ? "s" : ""}
          </Button>
        )}

      </SectionCard>


      {/* ================================= */}
      {/* REQUESTS TABLE */}
      {/* ================================= */}

      <SectionCard bodyClassName="px-0 py-0">

        {loading ? (

          <LoadingState
            label="Loading citizen requests…"
          />

        ) : error && data.length === 0 ? (

          <ErrorState
            message={error}
            onRetry={reload}
          />

        ) : filtered.length === 0 ? (

          <EmptyState
            icon={Inbox}
            title="No requests match your filters"
            description="Try widening the category, priority or date range."
          />

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-sm">

              <thead>
                <tr className="border-b border-border text-left">

                  {[
                    "Request",
                    "Category",
                    "Location",
                    "Language",
                    "Priority",
                    "Source",
                    "Status",
                    "Date",
                  ].map((heading) => (

                    <th
                      key={heading}
                      className="px-4 py-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
                    >
                      {heading}
                    </th>

                  ))}

                </tr>
              </thead>


              <tbody>

                {filtered.map((r) => (

                  <tr
                    key={
                      r._id ??
                      r.id ??
                      `${r.requestText}-${r.createdAt}`
                    }
                    onClick={() =>
                      setSelected(r)
                    }
                    className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-accent/40"
                  >

                    {/* REQUEST */}

                    <td className="max-w-xs px-4 py-3">

                      <p className="truncate font-medium">
                        {r.requestText ?? "—"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {r.citizenName ??
                          "Anonymous Citizen"}
                      </p>

                    </td>


                    {/* CATEGORY */}

                    <td className="px-4 py-3">

                      <CategoryBadge
                        category={r.category}
                      />

                    </td>


                    {/* LOCATION */}

                    <td className="px-4 py-3 text-xs">

                      <p className="font-medium">
                        {r.district ?? "—"}
                      </p>

                      <p className="text-muted-foreground">
                        {r.state ?? ""}
                      </p>

                    </td>


                    {/* LANGUAGE */}

                    <td className="px-4 py-3 text-xs">

                      {LANGUAGE_NAMES[r.language] ??
                        r.language ??
                        "—"}

                    </td>


                    {/* PRIORITY */}

                    <td className="px-4 py-3">

                      <PriorityBadge
                        level={r.priority}
                      />

                    </td>


                    {/* SOURCE */}

                    <td className="px-4 py-3 text-xs">

                      {r.source ?? "Web"}

                    </td>


                    {/* STATUS */}

                    <td className="px-4 py-3">

                      <StatusBadge
                        status={
                          r.status ?? "Received"
                        }
                      />

                    </td>


                    {/* DATE */}

                    <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-foreground">

                      {formatDate(r.createdAt)}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </SectionCard>


      {/* ================================= */}
      {/* REQUEST DETAIL PANEL */}
      {/* ================================= */}

      {selected && (

        <div
          className="fixed inset-0 z-50 flex justify-end bg-navy/50 backdrop-blur-sm"
          onClick={() =>
            setSelected(null)
          }
        >

          <aside
            className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-card shadow-[var(--shadow-elevated)]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">

              <div>

                <p className="text-eyebrow">
                  Request detail
                </p>

                <h3 className="mt-1 text-sm font-semibold">

                  {selected.district ?? "—"},{" "}
                  {selected.state ?? "—"}

                </h3>

              </div>


              <button
                onClick={() =>
                  setSelected(null)
                }
                aria-label="Close panel"
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent"
              >
                <X className="size-4" />
              </button>

            </div>


            {/* CONTENT */}

            <div className="space-y-5 px-5 py-5">


              {/* FULL REQUEST MESSAGE */}

              <p className="rounded-lg bg-muted px-3 py-3 text-sm leading-relaxed">

                {selected.requestText ?? "—"}

              </p>


              {/* DETAILS */}

              <dl className="grid grid-cols-2 gap-4 text-xs">


                {/* CITIZEN */}

                <div>

                  <dt className="text-eyebrow">
                    Citizen
                  </dt>

                  <dd className="mt-1 font-semibold">

                    {selected.citizenName ??
                      "Anonymous Citizen"}

                  </dd>

                </div>


                {/* LANGUAGE */}

                <div>

                  <dt className="text-eyebrow">
                    Language
                  </dt>

                  <dd className="mt-1 font-semibold">

                    {LANGUAGE_NAMES[
                      selected.language
                    ] ??
                      selected.language ??
                      "—"}

                  </dd>

                </div>


                {/* CATEGORY */}

                <div>

                  <dt className="text-eyebrow">
                    Category
                  </dt>

                  <dd className="mt-1.5">

                    <CategoryBadge
                      category={
                        selected.category
                      }
                    />

                  </dd>

                </div>


                {/* PRIORITY */}

                <div>

                  <dt className="text-eyebrow">
                    Priority
                  </dt>

                  <dd className="mt-1.5">

                    <PriorityBadge
                      level={
                        selected.priority
                      }
                    />

                  </dd>

                </div>


                {/* SOURCE */}

                <div>

                  <dt className="text-eyebrow">
                    Source
                  </dt>

                  <dd className="mt-1 font-semibold">

                    {selected.source ?? "Web"}

                  </dd>

                </div>


                {/* STATUS */}

                <div>

                  <dt className="text-eyebrow">
                    Status
                  </dt>

                  <dd className="mt-1.5">

                    <StatusBadge
                      status={
                        selected.status ??
                        "Received"
                      }
                    />

                  </dd>

                </div>


                {/* RECEIVED */}

                <div>

                  <dt className="text-eyebrow">
                    Received
                  </dt>

                  <dd className="mt-1 font-semibold">

                    {formatDate(
                      selected.createdAt
                    )}

                  </dd>

                </div>


                {/* COUNTRY */}

                <div>

                  <dt className="text-eyebrow">
                    Country
                  </dt>

                  <dd className="mt-1 font-semibold">

                    {selected.country ?? "—"}

                  </dd>

                </div>


                {/* STATE */}

                <div>

                  <dt className="text-eyebrow">
                    State
                  </dt>

                  <dd className="mt-1 font-semibold">

                    {selected.state ?? "—"}

                  </dd>

                </div>


                {/* DISTRICT */}

                <div>

                  <dt className="text-eyebrow">
                    District
                  </dt>

                  <dd className="mt-1 font-semibold">

                    {selected.district ?? "—"}

                  </dd>

                </div>

              </dl>


              {/* DEMAND MODEL INFO */}

              <p className="rounded-lg border border-border px-3 py-2.5 text-xs text-muted-foreground">

                This request contributes to the{" "}

                {selected.district ??
                  "selected region"}{" "}

                demand model and its{" "}

                {selected.category?.toLowerCase() ??
                  "development"}{" "}

                priority score.

              </p>

            </div>

          </aside>

        </div>

      )}

    </div>
  );
}