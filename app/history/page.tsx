"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileDown, Trash2, Info, DownloadCloud } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DiagnosisHistoryItem {
 id: string
 disease: string
 confidence: number
 imageUrl: string
 timestamp: string
 severity?: string
 explanation?: string
 possibleCauses?: string[]
 careTips?: string[]
 seekDoctorIf?: string
}

const severityStyles: Record<string, string> = {
 None: "bg-secondary text-secondary-foreground",
 Mild: "bg-amber-100 text-amber-800",
 Moderate: "bg-orange-100 text-orange-800",
 Severe: "bg-rose-100 text-rose-800",
}

export default function HistoryPage() {
 const [history, setHistory] = useState<DiagnosisHistoryItem[]>([])
 const [isLoading, setIsLoading] = useState(true)
 const { toast } = useToast()

 useEffect(() => {
 fetchHistory()
 }, [])

 const fetchHistory = async () => {
 setIsLoading(true)
 try {
 const res = await fetch("/api/history")
 if (!res.ok) throw new Error("Failed to load history")
 const data = await res.json()
 const records = (data.history ?? []).map((r: any) => ({
 ...r,
 timestamp: r.createdAt,
 }))
 setHistory(records)
 } catch (error) {
 console.error("Failed to load history:", error)
 toast({
 title: "Couldn't load history",
 description: "There was a problem loading your diagnosis history",
 variant: "destructive",
 })
 } finally {
 setIsLoading(false)
 }
 }

 const formatDate = (dateString: string) => {
 return new Date(dateString).toLocaleString()
 }

 const downloadCSV = () => {
 if (history.length === 0) {
 toast({
 title: "No data to download",
 description: "Your diagnosis history is empty",
 variant: "destructive",
 })
 return
 }

 // Create CSV content
 const csvHeader = "Disease,Severity,Confidence,Timestamp\n"
 const csvRows = history.map(
 (item) =>
 `${item.disease},${item.severity ?? ""},${item.confidence}%,${new Date(item.timestamp).toLocaleString()}`,
 )
 const csvContent = csvHeader + csvRows.join("\n")

 // Create and download file
 const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
 const url = URL.createObjectURL(blob)
 const link = document.createElement("a")
 link.setAttribute("href", url)
 link.setAttribute("download", "diagnosis-history.csv")
 document.body.appendChild(link)
 link.click()
 document.body.removeChild(link)

 toast({
 title: "History downloaded",
 description: "Your diagnosis history has been downloaded as CSV",
 variant: "default",
 })
 }

 const downloadImage = (imageUrl: string, disease: string, confidence: number) => {
 // Create a canvas element to draw the image with text
 const canvas = document.createElement("canvas")
 const img = new window.Image()
 img.crossOrigin = "anonymous" // Prevent CORS issues

 img.onload = () => {
 // Set canvas dimensions to match image
 canvas.width = img.width
 canvas.height = img.height + 80 // Extra space for text

 const ctx = canvas.getContext("2d")
 if (!ctx) return

 // Draw white background for the text area
 ctx.fillStyle = "#FFFFFF"
 ctx.fillRect(0, 0, canvas.width, canvas.height)

 // Draw the image
 ctx.drawImage(img, 0, 0)

 // Add semi-transparent overlay at the bottom for better text visibility
 ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
 ctx.fillRect(0, img.height - 40, canvas.width, 40)

 // Draw the disease name and confidence
 ctx.fillStyle = "#FFFFFF"
 ctx.font = "bold 20px Arial"
 ctx.fillText(`${disease}`, 20, img.height - 15)

 ctx.fillStyle = "#4ADE80" // Green color for confidence
 ctx.font = "bold 20px Arial"
 ctx.fillText(`${confidence}% Confidence`, canvas.width - 180, img.height - 15)

 // Add SkinCare Hospital AI watermark
 ctx.fillStyle = "#000000"
 ctx.font = "16px Arial"
 ctx.fillText("SkinCare Hospital AI", 20, img.height + 30)

 // Add timestamp
 const date = new Date().toLocaleString()
 ctx.fillStyle = "#666666"
 ctx.font = "14px Arial"
 ctx.fillText(date, canvas.width - 240, img.height + 30)

 // Convert canvas to data URL and download
 const dataUrl = canvas.toDataURL("image/png")
 const link = document.createElement("a")
 link.href = dataUrl
 link.download = `${disease.toLowerCase().replace(/\s+/g, "-")}-${new Date().getTime()}.png`
 document.body.appendChild(link)
 link.click()
 document.body.removeChild(link)

 toast({
 title: "Image downloaded",
 description: "Your analysis image with results has been downloaded successfully",
 variant: "default",
 })
 }

 img.src = imageUrl
 }

 const clearHistory = async () => {
 if (!confirm("Are you sure you want to clear your diagnosis history?")) return

 try {
 const res = await fetch("/api/history", { method: "DELETE" })
 if (!res.ok) throw new Error("Failed to clear history")
 setHistory([])
 toast({
 title: "History cleared",
 description: "Your diagnosis history has been deleted",
 variant: "default",
 })
 } catch (error) {
 console.error("Failed to clear history:", error)
 toast({
 title: "Couldn't clear history",
 description: "There was a problem deleting your history",
 variant: "destructive",
 })
 }
 }

 const deleteRecord = async (id: string) => {
 try {
 const res = await fetch(`/api/history/${id}`, { method: "DELETE" })
 if (!res.ok) throw new Error("Failed to delete record")
 setHistory((prev) => prev.filter((item) => item.id !== id))
 toast({
 title: "Record deleted",
 description: "The diagnosis record has been removed",
 variant: "default",
 })
 } catch (error) {
 console.error("Failed to delete record:", error)
 toast({
 title: "Couldn't delete record",
 description: "There was a problem deleting this record",
 variant: "destructive",
 })
 }
 }

 return (
 <div className="container py-8 px-4 min-h-screen surface-teal">
 <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="icon-badge icon-badge-teal h-11 w-11 rounded-full hidden sm:flex">
 <DownloadCloud className="h-5 w-5" />
 </div>
 <div>
 <h1 className="text-3xl font-display font-semibold text-foreground mb-1">Diagnosis History</h1>
 <p className="text-muted-foreground">View and manage your previous skin condition diagnoses</p>
 </div>
 </div>
 <div className="flex gap-3 mt-4 md:mt-0">
 <Button variant="outline" onClick={downloadCSV} disabled={history.length === 0}>
 <FileDown className="mr-2 h-4 w-4" />
 Download CSV
 </Button>
 <Button variant="destructive" onClick={clearHistory} disabled={history.length === 0}>
 <Trash2 className="mr-2 h-4 w-4" />
 Clear History
 </Button>
 </div>
 </div>

 {isLoading ? (
 <Card className="shadow-md">
 <CardContent className="p-10 flex justify-center">
 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
 </CardContent>
 </Card>
 ) : history.length === 0 ? (
 <Card className="shadow-md">
 <CardContent className="p-10 text-center">
 <div className="icon-badge icon-badge-teal h-16 w-16 rounded-full mx-auto mb-4 opacity-90">
 <DownloadCloud className="h-8 w-8" />
 </div>
 <h3 className="text-xl font-medium">No diagnosis history</h3>
 <p className="text-muted-foreground mt-2">Your previous diagnoses will appear here</p>
 </CardContent>
 </Card>
 ) : (
 <Card className="shadow-md">
 <CardHeader>
 <CardTitle>Recent diagnoses</CardTitle>
 <CardDescription>You have {history.length} diagnosis records</CardDescription>
 </CardHeader>
 <CardContent>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Image</TableHead>
 <TableHead>Disease</TableHead>
 <TableHead>Severity</TableHead>
 <TableHead>Confidence</TableHead>
 <TableHead>Date</TableHead>
 <TableHead className="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {history.map((item) => (
 <TableRow key={item.id}>
 <TableCell>
 <div className="relative w-16 h-16 rounded-md overflow-hidden">
 <img
 src={item.imageUrl || "/placeholder.svg"}
 alt={item.disease}
 className="w-full h-full object-cover"
 />
 </div>
 </TableCell>
 <TableCell className="font-medium">
 <div className="flex items-center">
 {item.disease}
 <TooltipProvider>
 <Tooltip>
 <TooltipTrigger asChild>
 <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
 </TooltipTrigger>
 <TooltipContent>
 <p className="w-60">{item.explanation || "No description available for this condition."}</p>
 </TooltipContent>
 </Tooltip>
 </TooltipProvider>
 </div>
 </TableCell>
 <TableCell>
 {item.severity ? (
 <span
 className={`text-xs font-semibold px-2 py-1 rounded-full ${
 severityStyles[item.severity] || severityStyles.None
 }`}
 >
 {item.severity}
 </span>
 ) : (
 <span className="text-xs text-muted-foreground">—</span>
 )}
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2">
 <div className="w-24 bg-muted rounded-full h-2.5 overflow-hidden">
 <div
 className="h-2.5 rounded-full bg-gradient-to-r from-[hsl(var(--brand-teal))] to-[hsl(var(--brand-blue))]"
 style={{ width: `${item.confidence}%` }}
 ></div>
 </div>
 <span className="text-sm font-medium">{item.confidence}%</span>
 </div>
 </TableCell>
 <TableCell>{formatDate(item.timestamp)}</TableCell>
 <TableCell className="text-right">
 <Button
 variant="ghost"
 size="sm"
 onClick={() => downloadImage(item.imageUrl, item.disease, item.confidence)}
 >
 <Download className="h-4 w-4" />
 </Button>
 <Button variant="ghost" size="sm" onClick={() => deleteRecord(item.id)}>
 <Trash2 className="h-4 w-4 text-red-500" />
 </Button>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </CardContent>
 </Card>
 )}
 </div>
 )
}
