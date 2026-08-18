import { DISTRICT_COORDS } from "@/lib/demoData";

export function hotspotLevel(h) {
  const critical = h.criticalCount ?? 0;
  const high = h.highCount ?? 0;
  const total = h.requestCount ?? 0;
  if (critical >= 30 || (total > 0 && critical / total > 0.22)) return "Critical";
  if (high >= 40 || (total > 0 && high / total > 0.35)) return "High";
  if (total >= 80) return "Medium";
  return "Low";
}

export function hotspotCoords(h) {
  if (typeof h.lat === "number" && typeof h.lng === "number") return [h.lat, h.lng];
  return DISTRICT_COORDS[h.district] ?? null;
}

export const HOTSPOT_LEVEL_COLOR = {
  Critical: "var(--destructive)",
  High: "var(--warning)",
  Medium: "var(--caution)",
  Low: "var(--success)",
};
