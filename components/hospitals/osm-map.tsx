"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export interface MapHospital {
  id: string
  name: string
  address: string
  location: { lat: number; lng: number }
}

interface OsmMapProps {
  center: { lat: number; lng: number }
  hospitals: MapHospital[]
  className?: string
}

// Divicon-based markers so we don't need to ship/host marker image assets —
// keeps this fully self-contained and free (no Google Maps API key, no
// third-party marker CDN dependency beyond the public OSM tile servers).
function pinIcon(color: string, label?: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
        width: 30px; height: 30px; border-radius: 50% 50% 50% 0;
        background:${color}; transform: rotate(-45deg);
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        display:flex; align-items:center; justify-content:center;
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg); color:white; font-size:11px; font-weight:700;
          font-family: sans-serif;
        ">${label ?? ""}</span>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  })
}

function FitBounds({ center, hospitals }: { center: { lat: number; lng: number }; hospitals: MapHospital[] }) {
  const map = useMap()

  useEffect(() => {
    const points: [number, number][] = [
      [center.lat, center.lng],
      ...hospitals.map((h): [number, number] => [h.location.lat, h.location.lng]),
    ]
    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 15 })
    } else {
      map.setView([center.lat, center.lng], 13)
    }
  }, [map, center, hospitals])

  return null
}

export function OsmMap({ center, hospitals, className }: OsmMapProps) {
  const userIcon = useMemo(() => pinIcon("hsl(165, 55%, 22%)", "•"), [])

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Free OpenStreetMap raster tiles — no API key required. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <FitBounds center={center} hospitals={hospitals} />

      <Marker position={[center.lat, center.lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {hospitals.map((hospital, index) => (
        <Marker
          key={hospital.id}
          position={[hospital.location.lat, hospital.location.lng]}
          icon={pinIcon("hsl(8, 71%, 55%)", String(index + 1))}
        >
          <Popup>
            <strong>{hospital.name}</strong>
            <br />
            {hospital.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
