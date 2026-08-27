"use client"

import { useEffect, useMemo, useState } from "react"
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from "@react-google-maps/api"

export interface MapHospital {
  id: string
  name: string
  address: string
  location: { lat: number; lng: number }
}

interface GoogleHospitalMapProps {
  center: { lat: number; lng: number }
  hospitals: MapHospital[]
  className?: string
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Keep marker icon creation lazy — `google` isn't defined until the JS API
// script has finished loading.
function useMarkerIcons(loaded: boolean) {
  return useMemo(() => {
    if (!loaded || typeof google === "undefined") return null

    const pin = (fill: string, label?: string) => ({
      path: "M15 0C7 0 0 7 0 15c0 11 15 30 15 30s15-19 15-30C30 7 23 0 15 0z",
      fillColor: fill,
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1,
      anchor: new google.maps.Point(15, 45),
      labelOrigin: new google.maps.Point(15, 15),
    })

    return {
      user: pin("hsl(165, 55%, 22%)"),
      hospital: pin("hsl(8, 71%, 55%)"),
    }
  }, [loaded])
}

export function GoogleHospitalMap({ center, hospitals, className }: GoogleHospitalMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
  })

  const icons = useMarkerIcons(isLoaded)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    if (!map || typeof google === "undefined") return
    const bounds = new google.maps.LatLngBounds()
    bounds.extend(center)
    hospitals.forEach((h) => bounds.extend(h.location))
    if (hospitals.length > 0) {
      map.fitBounds(bounds, 60)
    } else {
      map.setCenter(center)
      map.setZoom(13)
    }
  }, [map, center, hospitals])

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/40 text-sm text-muted-foreground text-center px-4">
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the map.
      </div>
    )
  }

  if (!isLoaded) {
    return <div className="flex h-full w-full items-center justify-center bg-muted/40" />
  }

  return (
    <GoogleMap
      onLoad={setMap}
      onUnmount={() => setMap(null)}
      center={center}
      zoom={13}
      mapContainerClassName={className}
      mapContainerStyle={{ height: "100%", width: "100%" }}
      options={{
        scrollwheel: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <MarkerF
        position={center}
        icon={icons?.user}
        onClick={() => setActiveMarker("user")}
      >
        {activeMarker === "user" && (
          <InfoWindowF position={center} onCloseClick={() => setActiveMarker(null)}>
            <span>You are here</span>
          </InfoWindowF>
        )}
      </MarkerF>

      {hospitals.map((hospital, index) => (
        <MarkerF
          key={hospital.id}
          position={hospital.location}
          icon={icons?.hospital}
          label={icons ? { text: String(index + 1), color: "#ffffff", fontSize: "11px", fontWeight: "700" } : undefined}
          onClick={() => setActiveMarker(hospital.id)}
        >
          {activeMarker === hospital.id && (
            <InfoWindowF position={hospital.location} onCloseClick={() => setActiveMarker(null)}>
              <div>
                <strong>{hospital.name}</strong>
                <br />
                {hospital.address}
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  )
}