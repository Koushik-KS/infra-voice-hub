import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/AppShell";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Globe,
  Shield,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your CivilIntel platform preferences."
      />

      <div className="grid gap-5">
        {/* Platform Settings */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Settings className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Platform Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure your CivilIntel preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Options */}
        <div className="grid gap-5 md:grid-cols-2">

          {/* Appearance */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  {theme === "dark" ? (
                    <Sun className="size-5" />
                  ) : (
                    <Moon className="size-5" />
                  )}
                </div>

                <div>
                  <h3 className="font-medium">Appearance</h3>
                  <p className="text-sm text-muted-foreground">
                    Currently using {theme === "dark" ? "Dark" : "Light"} mode.
                  </p>
                </div>
              </div>

              <button
                onClick={toggle}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Bell className="size-5" />
              </div>

              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Manage platform notifications and alerts.
                </p>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Globe className="size-5" />
              </div>

              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your preferred platform language.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Shield className="size-5" />
              </div>

              <div>
                <h3 className="font-medium">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">
                  Manage data and security preferences.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}