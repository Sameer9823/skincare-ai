import { NextResponse } from "next/server"

const DEMO_HOSPITALS = [
  {
    id: "india-1",
    name: "Apollo Hospitals - Greams Road",
    address: "21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006",
    phone: "+91 80690 49756",
    location: {
      lat: 13.0614,
      lng: 80.2523,
    },
    rating: 4.5,
    openNow: true,
    hours: "Mon-Sun: 24 Hours",
    isDemo: false,
    country: "India",
    city: "Chennai",
    specialty: "Dermatology",
  },
  {
    id: "india-2",
    name: "SIMS Hospital - Vadapalani",
    address:
      "No. 1, Jawaharlal Nehru Salai, Vadapalani, Chennai, Tamil Nadu 600026",
    phone: "+91 44 4921 0000",
    location: {
      lat: 13.0524,
      lng: 80.2121,
    },
    rating: 4.5,
    openNow: true,
    hours: "Mon-Sun: 24 Hours",
    isDemo: false,
    country: "India",
    city: "Chennai",
    specialty: "Dermatology",
  },
  {
    id: "india-3",
    name: "Gleneagles Global Health City",
    address:
      "439, Cheran Nagar, Perumbakkam, Chennai, Tamil Nadu 600100",
    phone: "+91 44 4477 7000",
    location: {
      lat: 12.9049,
      lng: 80.2047,
    },
    rating: 4.3,
    openNow: true,
    hours: "Mon-Sun: 24 Hours",
    isDemo: false,
    country: "India",
    city: "Chennai",
    specialty: "Dermatology",
  },
  {
    id: "india-4",
    name: "Venkataeswara Hospital",
    address:
      "36, 2nd Main Road, Raghavan Colony, Nandanam, Chennai, Tamil Nadu 600035",
    phone: "+91 44 4015 5555",
    location: {
      lat: 13.0317,
      lng: 80.2427,
    },
    rating: 4.8,
    openNow: true,
    hours: "Mon-Sat: 8AM-8PM",
    isDemo: false,
    country: "India",
    city: "Chennai",
    specialty: "Dermatology",
  },
];

interface HospitalResult {
  id: string
  name: string
  address: string
  phone: string
  location: { lat: number; lng: number }
  rating?: number
  openNow?: boolean
  hours?: string
  isDemo?: boolean
  distance?: string
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
}

async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("q", city)
    url.searchParams.set("format", "json")
    url.searchParams.set("limit", "1")
    url.searchParams.set("addressdetails", "1")

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "SkinCareAI/1.0 (https://skincare-ai.example.com)",
      },
    })
    const data = await response.json()

    if (data?.[0]?.lat && data?.[0]?.lon) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

async function fetchNearbyHospitals(lat: number, lng: number, radius = 10000): Promise<HospitalResult[]> {
  try {
    // Use Overpass API to find hospitals and clinics near the location
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        node["healthcare"="hospital"](around:${radius},${lat},${lng});
        node["healthcare"="clinic"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="clinic"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="clinic"](around:${radius},${lat},${lng});
      );
      out center tags;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "SkinCareAI/1.0 (https://skincare-ai.example.com)",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    })

    const data = await response.json()

    if (!data.elements || data.elements.length === 0) {
      return DEMO_HOSPITALS.map((h) => ({
        ...h,
        distance: calculateDistance(lat, lng, h.location.lat, h.location.lng),
      }))
    }

    const hospitals: HospitalResult[] = data.elements
      .filter((el: any) => el.tags && (el.tags.amenity === "hospital" || el.tags.amenity === "clinic" || el.tags.healthcare === "hospital" || el.tags.healthcare === "clinic"))
      .slice(0, 20)
      .map((el: any) => {
        const elementLat = el.lat || el.center?.lat
        const elementLng = el.lon || el.center?.lon
        const tags = el.tags || {}

        return {
          id: `osm-${el.type}-${el.id}`,
          name: tags.name || tags["name:en"] || "Medical Facility",
          address: [
            tags["addr:street"],
            tags["addr:housenumber"],
            tags["addr:city"],
            tags["addr:postcode"],
          ].filter(Boolean).join(", ") || "Address not available",
          phone: tags.phone || tags["contact:phone"] || "",
          location: { lat: elementLat, lng: elementLng },
          rating: undefined,
          openNow: tags.opening_hours ? true : undefined,
          hours: tags.opening_hours,
          isDemo: false,
          distance: calculateDistance(lat, lng, elementLat, elementLng),
        }
      })

    // Sort by distance
    hospitals.sort((a, b) => {
      const distA = parseFloat(a.distance?.replace("km", "").replace("m", "") || "999")
      const distB = parseFloat(b.distance?.replace("km", "").replace("m", "") || "999")
      const unitA = a.distance?.includes("m") ? 0.001 : 1
      const unitB = b.distance?.includes("m") ? 0.001 : 1
      return distA * unitA - distB * unitB
    })

    return hospitals.length > 0 ? hospitals : DEMO_HOSPITALS.map((h) => ({
      ...h,
      distance: calculateDistance(lat, lng, h.location.lat, h.location.lng),
    }))
  } catch (error) {
    console.error("Error fetching hospitals from Overpass:", error)
    return DEMO_HOSPITALS.map((h) => ({
      ...h,
      distance: calculateDistance(lat, lng, h.location.lat, h.location.lng),
    }))
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const city = searchParams.get("city")

  let latitude: number
  let longitude: number

  if (lat && lng) {
    latitude = parseFloat(lat)
    longitude = parseFloat(lng)
  } else if (city) {
    const geocoded = await geocodeCity(city)
    if (geocoded) {
      latitude = geocoded.lat
      longitude = geocoded.lng
    } else {
      latitude = 40.758
      longitude = -73.9855
    }
  } else {
    latitude = 40.758
    longitude = -73.9855
  }

  const hospitals = await fetchNearbyHospitals(latitude, longitude)

  return NextResponse.json({
    hospitals,
    userLocation: { lat: latitude, lng: longitude },
    isDemo: hospitals.some(h => h.isDemo),
  })
}
