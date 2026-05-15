import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import { ATLANTA_STORES, ATL_NEIGHBORHOOD_COORDS, type AtlantaStore } from "@/lib/journey-data";
import { NEIGHBORHOOD_ACCESS } from "@/lib/profile";

const CENTER: [number, number] = [33.762, -84.39];

function colorForAccess(score: number) {
  if (score < 30) return "#e5484d";
  if (score < 50) return "#f5a524";
  if (score < 70) return "#3b82f6";
  return "#10b981";
}

export default function StoreMapInner({
  onSelect,
}: {
  onSelect: (s: AtlantaStore) => void;
}) {
  return (
    <MapContainer
      center={CENTER}
      zoom={11}
      scrollWheelZoom
      style={{ height: 520, width: "100%", background: "#1a1f2e" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {Object.entries(NEIGHBORHOOD_ACCESS).map(([name, info]) => {
        const c = ATL_NEIGHBORHOOD_COORDS[name];
        if (!c) return null;
        return (
          <CircleMarker
            key={name}
            center={[c.lat, c.lng]}
            radius={22}
            pathOptions={{
              color: colorForAccess(info.access),
              fillColor: colorForAccess(info.access),
              fillOpacity: 0.18,
              weight: 1,
              opacity: 0.7,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div style={{ fontSize: 11 }}>
                <strong>{name}</strong>
                <br />
                Access score: {info.access}/100
                <br />
                <span style={{ opacity: 0.7 }}>{info.note}</span>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}

      {ATLANTA_STORES.map((s) => (
        <CircleMarker
          key={s.name}
          center={[s.lat, s.lng]}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#10b981",
            fillOpacity: 0.95,
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelect(s) }}
        >
          <Popup>
            <div style={{ minWidth: 180, fontSize: 12 }}>
              <strong>{s.name}</strong>
              <br />
              {s.type} · {s.neighborhood}
              <br />
              {s.snap && <span style={{ color: "#10b981" }}>✓ Accepts SNAP</span>}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
