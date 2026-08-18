import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import { HOTSPOT_LEVEL_COLOR as LEVEL_COLOR, hotspotCoords, hotspotLevel } from "@/lib/hotspotUtils";

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
