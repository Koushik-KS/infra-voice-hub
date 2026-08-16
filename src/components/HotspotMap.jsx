import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import { DISTRICT_COORDS } from "@/lib/demoData";

const LEVEL_COLOR = {
  Critical: "var(--destructive)",
  High: "var(--warning)",
  Medium: "var(--caution)",
  Low: "var(--success)",
};

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

export default function HotspotMap({ hotspots = [] }) {
  const points = hotspots
    .map((h) => ({ ...h, coords: hotspotCoords(h), level: hotspotLevel(h) }))
    .filter((h) => h.coords);

  const max = Math.max(1, ...points.map((p) => p.requestCount ?? 0));

  return (
    <MapContainer
      center={[15.3173, 76.7139]}
      zoom={6}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => {
        const color = LEVEL_COLOR[p.level];
        const radius = 10 + Math.round(((p.requestCount ?? 0) / max) * 20);
        return (
          <CircleMarker
            key={`${p.district}-${p.category}`}
            center={p.coords}
            radius={radius}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.35, weight: 2 }}
          >
            <Tooltip direction="top">
              {p.district} · {p.requestCount} requests
            </Tooltip>
            <Popup>
              <div className="min-w-48 space-y-1.5 text-xs">
                <p className="text-sm font-bold">{p.district}</p>
                <p className="text-muted-foreground">{p.state}</p>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-semibold">{p.category}</dd>
                  <dt className="text-muted-foreground">Requests</dt>
                  <dd className="font-semibold tabular-nums">{p.requestCount}</dd>
                  <dt className="text-muted-foreground">Critical</dt>
                  <dd className="font-semibold tabular-nums">{p.criticalCount ?? 0}</dd>
                  <dt className="text-muted-foreground">High priority</dt>
                  <dd className="font-semibold tabular-nums">{p.highCount ?? 0}</dd>
                </dl>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
