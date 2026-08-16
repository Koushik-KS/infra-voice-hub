import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquarePlus,
  ListFilter,
  MapPinned,
  Lightbulb,
  BarChart3,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/submit", label: "Submit Request", icon: MessageSquarePlus },
  { to: "/requests", label: "Requests", icon: ListFilter },
  { to: "/hotspots", label: "Demand Hotspots", icon: MapPinned },
  { to: "/recommendations", label: "Project Recommendations", icon: Lightbulb },
  { to: "/regional", label: "Regional Intelligence", icon: BarChart3 },
];

function SidebarContent({ onNavigate }) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary-foreground ring-1 ring-sidebar-border">
          <Landmark className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-sidebar-accent-foreground">CivilIntel</p>
          <p className="truncate text-[11px] text-sidebar-foreground/70">
            Development Intelligence Platform
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-2 pb-2 text-[11px] font-semibold tracking-[0.12em] text-sidebar-foreground/50 uppercase">
          Intelligence
        </p>
        {NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="truncate">{item.label}</span>
              {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground">
          <Settings className="size-4" />
          Settings
        </button>
        <button
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <p className="px-3 pt-3 text-[11px] leading-relaxed text-sidebar-foreground/50">
          Turning citizen voices into data-driven development decisions.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Landmark className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold leading-tight">CivilIntel</p>
            <p className="text-[10px] text-muted-foreground">Development Intelligence Platform</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg border border-border p-2 transition-colors hover:bg-accent"
        >
          <Menu className="size-4" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-[var(--shadow-elevated)]">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-3 z-10 rounded-lg p-1.5 text-sidebar-foreground/80 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        <footer className="border-t border-border px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            CivilIntel — A Digital Public Good for Smarter Development Decisions
          </p>
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
