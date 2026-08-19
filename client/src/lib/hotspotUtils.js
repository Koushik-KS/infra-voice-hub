import { coordsForDistrict } from "@/lib/geo";

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
  const lat = h.lat ?? h.latitude ?? h.location?.latitude;
  const lng = h.lng ?? h.longitude ?? h.location?.longitude;
  if (typeof lat === "number" && typeof lng === "number") return [lat, lng];
  return coordsForDistrict(h.district);
}

export const HOTSPOT_LEVEL_COLOR = {
  Critical: "var(--destructive)",
  High: "var(--warning)",
  Medium: "var(--caution)",
  Low: "var(--success)",
};
