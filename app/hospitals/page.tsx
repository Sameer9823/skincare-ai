"use client"

import { useState, useEffect, useCallback } from "react"
import { MapPin, Navigation, Phone, Clock, Star, MapPin as MapPinIcon, Loader2, Search, MapPin as LocationIcon, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MapPanel } from "@/components/hospitals/map-panel"

interface Hospital {
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

interface HospitalResponse {
 hospitals: Hospital[]
 userLocation: { lat: number; lng: number }
 isDemo: boolean
}

export default function HospitalsPage() {
 const { toast } = useToast()
 const [hospitals, setHospitals] = useState<Hospital[]>([])
 const [isLoading, setIsLoading] = useState(true)
 const [searchQuery, setSearchQuery] = useState("")
 const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
 const [isDemo, setIsDemo] = useState(false)
 const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt")

 const fetchHospitals = useCallback(async (lat?: number, lng?: number, city?: string) => {
 setIsLoading(true)
 try {
 const params = new URLSearchParams()
 if (lat && lng) {
 params.set("lat", lat.toString())
 params.set("lng", lng.toString())
 } else if (city) {
 params.set("city", city)
 }

 const res = await fetch(`/api/hospitals?${params.toString()}`)
 if (!res.ok) throw new Error("Failed to fetch hospitals")
 const data: HospitalResponse = await res.json()
 setHospitals(data.hospitals)
 setUserLocation(data.userLocation)
 setIsDemo(data.isDemo)
 } catch (error) {
 console.error("Failed to fetch hospitals:", error)
 toast({
 title: "Couldn't load hospitals",
 description: "There was a problem loading nearby facilities",
 variant: "destructive",
 })
 } finally {
 setIsLoading(false)
 }
 }, [toast])

 const handleGeolocation = () => {
 if (!navigator.geolocation) {
 toast({
 title: "Geolocation not supported",
 description: "Your browser doesn't support location services. Please search by city instead.",
 variant: "destructive",
 })
 return
 }

 setIsLoading(true)
 navigator.geolocation.getCurrentPosition(
 (position) => {
 setLocationPermission("granted")
 fetchHospitals(position.coords.latitude, position.coords.longitude)
 },
 (error) => {
 setLocationPermission("denied")
 setIsLoading(false)
 if (error.code === error.PERMISSION_DENIED) {
 toast({
 title: "Location permission denied",
 description: "Please search by city or enable location access in your browser settings.",
 variant: "destructive",
 })
 } else {
 toast({
 title: "Unable to get location",
 description: "Please try searching by city instead.",
 variant: "destructive",
 })
 }
 }
 )
 }

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault()
 if (searchQuery.trim()) {
 fetchHospitals(undefined, undefined, searchQuery.trim())
 }
 }

 useEffect(() => {
 // Load with default location on first visit
 fetchHospitals()
 }, [])

 return (
 <div className="container py-10 md:py-16 surface-teal min-h-screen">
 <div className="mb-10">
 <div className="flex items-center gap-3 mb-2">
 <div className="icon-badge icon-badge-blue h-10 w-10 rounded-full">
 <MapPin className="h-5 w-5" />
 </div>
 <div>
 <h1 className="text-3xl font-display font-semibold text-foreground">Find Nearby Hospitals & Clinics</h1>
 <p className="text-muted-foreground">Locate dermatology specialists and healthcare facilities near you</p>
 </div>
 </div>
 </div>

 {/* Search/Location Controls */}
 <Card className="border-border/50 bg-background mb-8 shadow-md">
 <CardContent className="p-6">
 <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
 <div className="relative flex-1">
 <label htmlFor="location-search" className="sr-only">Search location</label>
 <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
 <Input
 id="location-search"
 placeholder="Search by city, neighborhood, or address..."
 className="pl-10"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 disabled={isLoading}
 />
 </div>
 <Button type="submit" className="w-full md:w-auto gap-2 btn-gradient" disabled={isLoading || !searchQuery.trim()}>
 <Search className="h-4 w-4" />
 Search
 </Button>
 <Button
 variant="outline"
 className="w-full md:w-auto gap-2"
 onClick={handleGeolocation}
 disabled={isLoading}
 >
 <LocationIcon className="h-4 w-4" />
 Use My Location
 </Button>
 </form>
 <p className="text-xs text-muted-foreground mt-3 text-center">
 Location access is only used with your permission. Data is not stored.
 </p>
 </CardContent>
 </Card>

 {/* Demo Notice */}
 {isDemo && (
 <div className="mb-6 p-3 bg-[hsl(var(--brand-blue-soft))] border border-[hsl(214_70%_88%)] rounded-lg">
 <div className="flex items-center gap-2 text-sm text-[hsl(214_70%_35%)]">
 <Info className="h-4 w-4" />
 <span>
 <strong>Demo Mode:</strong> Showing sample hospital data. Live results use OpenStreetMap (Nominatim &amp; Overpass) — no API key required.
 </span>
 </div>
 </div>
 )}

 {/* Results */}
 <div className="grid lg:grid-cols-3 gap-8 items-start">
 {/* Map Panel */}
 <div className="lg:col-span-2 space-y-6">
 <Card className="border-border/50 bg-background shadow-md">
 <CardHeader className="pb-4">
 <CardTitle className="text-lg flex items-center gap-2">
 <MapPin className="h-5 w-5 text-[hsl(var(--brand-blue))]" />
 Interactive Map
 </CardTitle>
 </CardHeader>
 <CardContent className="p-0">
 <div className="relative aspect-[16/9] bg-muted/50 rounded-xl overflow-hidden">
 {isLoading ? (
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="text-center">
 <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
 <p className="text-muted-foreground">Loading map...</p>
 </div>
 </div>
 ) : userLocation ? (
 <MapPanel
 center={userLocation}
 hospitals={hospitals.map((h) => ({ id: h.id, name: h.name, address: h.address, location: h.location }))}
 className="h-full w-full"
 />
 ) : null}
 </div>
 </CardContent>
 </Card>

 {/* Legend */}
 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl">
 <div className="flex items-center gap-2">
 <div className="icon-badge icon-badge-blue h-8 w-8 rounded-full text-xs font-medium">1</div>
 <span>Hospital markers</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="icon-badge icon-badge-teal h-8 w-8 rounded-full text-xs font-medium animate-pulse">You</div>
 <span>Your location</span>
 </div>
 {isDemo && (
 <Badge variant="secondary" className="ml-auto">Demo Data</Badge>
 )}
 </div>
 </div>

 {/* Hospital List Panel */}
 <div className="lg:col-span-1 lg:sticky lg:top-24">
 <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 -mr-2 scroll-smooth">
 {isLoading ? (
 <div className="space-y-4">
 {[1, 2, 3].map((i) => (
 <Card key={i} className="border-border/50 bg-background animate-pulse shadow-sm">
 <CardContent className="p-4">
 <div className="flex items-start gap-4">
 <div className="h-12 w-12 bg-muted rounded-lg" />
 <div className="flex-1 space-y-2">
 <div className="h-4 w-3/4 bg-muted rounded" />
 <div className="h-3 w-1/2 bg-muted rounded" />
 <div className="h-3 w-1/3 bg-muted rounded" />
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 ) : hospitals.length === 0 ? (
 <Card className="border-border/50 bg-background shadow-md">
 <CardContent className="py-12 px-6 text-center">
 <div className="icon-badge icon-badge-blue h-16 w-16 rounded-full mx-auto mb-4 opacity-90">
 <MapPin className="h-8 w-8" />
 </div>
 <h3 className="text-lg font-medium text-foreground mb-2">No hospitals found</h3>
 <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
 Try searching for a different city or enable location access to find nearby facilities.
 </p>
 <Button variant="outline" onClick={handleGeolocation}>
 <LocationIcon className="mr-2 h-4 w-4" />
 Use My Location
 </Button>
 </CardContent>
 </Card>
 ) : (
 hospitals.map((hospital) => (
 <Card key={hospital.id} className="border-border/50 bg-background hover:shadow-lg hover:-translate-y-0.5 transition-all">
 <CardContent className="p-4 space-y-3">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h4 className="font-medium text-foreground">{hospital.name}</h4>
 {hospital.isDemo && (
 <Badge variant="secondary" className="text-[10px]">Demo</Badge>
 )}
 </div>
 <p className="text-sm text-muted-foreground flex items-center gap-1">
 <MapPinIcon className="h-3.5 w-3.5" />
 {hospital.address}
 </p>
 <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
 <Phone className="h-3.5 w-3.5" />
 {hospital.phone}
 </p>
 </div>
 <div className="flex flex-col items-end gap-1">
 <Badge className={hospital.openNow ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}>
 {hospital.openNow ? "Open Now" : "Closed"}
 </Badge>
 {hospital.distance && (
 <span className="text-xs text-muted-foreground flex items-center gap-1">
 <MapPin className="h-3 w-3" />
 {hospital.distance}
 </span>
 )}
 </div>
 </div>

 <div className="flex items-center gap-3 text-sm text-muted-foreground">
 {hospital.rating && (
 <span className="flex items-center gap-1">
 <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
 {hospital.rating}
 </span>
 )}
 {hospital.hours && (
 <span className="flex items-center gap-1">
 <Clock className="h-3.5 w-3.5" />
 {hospital.hours}
 </span>
 )}
 </div>

 <div className="flex gap-2 pt-2">
 <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
 <a
 href={
 userLocation
 ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.location.lat},${hospital.location.lng}`
 : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`
 }
 target="_blank"
 rel="noopener noreferrer"
 >
 <Navigation className="h-3.5 w-3.5" />
 Directions
 </a>
 </Button>
 <Button variant="ghost" size="sm" className="gap-1" asChild>
 <a href={`tel:${hospital.phone.replace(/\D/g, "")}`}>
 <Phone className="h-3.5 w-3.5" />
 Call
 </a>
 </Button>
 </div>
 </CardContent>
 </Card>
 ))
 )}
 </div>
 </div>
 </div>
 </div>
 )
}