"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Camera, UploadCloud, Loader2, Download, FileText, AlertTriangle, Sparkles, Info, RotateCcw, Lightbulb, Stethoscope, ListChecks } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import ImageCapture from "@/components/image-capture"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"

const severityStyles: Record<string, string> = {
 None: "bg-secondary text-secondary-foreground",
 Mild: "bg-amber-100 text-amber-800",
 Moderate: "bg-orange-100 text-orange-800",
 Severe: "bg-rose-100 text-rose-800",
}

const severityDotStyles: Record<string, string> = {
 None: "bg-muted-foreground",
 Mild: "bg-amber-500",
 Moderate: "bg-orange-500",
 Severe: "bg-rose-500",
}

function fileToDataUrl(file: File): Promise<string> {
 return new Promise((resolve, reject) => {
 const reader = new FileReader()
 reader.onloadend = () => resolve(reader.result as string)
 reader.onerror = reject
 reader.readAsDataURL(file)
 })
}

export default function DiagnosisPage() {
 const [selectedImage, setSelectedImage] = useState<string | null>(null)
 const [file, setFile] = useState<File | null>(null)
 const [isPredicting, setIsPredicting] = useState(false)
 const [predictionResult, setPredictionResult] = useState<{
 disease: string
 confidence: number
 imageUrl: string
 severity?: string
 explanation?: string
 possibleCauses?: string[]
 careTips?: string[]
 seekDoctorIf?: string
 disclaimer?: string
 } | null>(null)
 const { toast } = useToast()
 const router = useRouter()

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files && e.target.files[0]) {
 const selectedFile = e.target.files[0]
 setFile(selectedFile)
 const imageUrl = URL.createObjectURL(selectedFile)
 setSelectedImage(imageUrl)
 setPredictionResult(null)
 }
 }

 const handleCapturedImage = (imageDataUrl: string) => {
 setSelectedImage(imageDataUrl)
 setPredictionResult(null)
 // Convert base64 to file object for API upload
 fetch(imageDataUrl)
 .then((res) => res.blob())
 .then((blob) => {
 const file = new File([blob], "webcam-capture.png", {
 type: "image/png",
 })
 setFile(file)
 })
 }

 const handlePredict = async () => {
 if (!selectedImage || !file) {
 toast({
 title: "No image selected",
 description: "Please upload or capture an image first",
 variant: "destructive",
 })
 return
 }

 setIsPredicting(true)

 try {
 const formData = new FormData()
 formData.append("image", file)

 const response = await fetch("/api/predict", {
 method: "POST",
 body: formData,
 })

 const data = await response.json()

 if (!response.ok) {
 throw new Error(data?.error || "Failed to analyze the image")
 }

 const { disease, confidence, severity, explanation, possibleCauses, careTips, seekDoctorIf, disclaimer } = data

 setPredictionResult({
 disease,
 confidence,
 severity,
 explanation,
 possibleCauses,
 careTips,
 seekDoctorIf,
 disclaimer,
 imageUrl: selectedImage,
 })

 // Persist a base64 copy of the image (selectedImage may be a blob: URL,
 // which only works in this tab) so history survives reloads/devices.
 const persistedImageUrl = await fileToDataUrl(file)

 const saveResponse = await fetch("/api/history", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 disease,
 confidence,
 severity,
 explanation,
 possibleCauses,
 careTips,
 seekDoctorIf,
 disclaimer,
 imageUrl: persistedImageUrl,
 }),
 })

 if (!saveResponse.ok) {
 console.error("Failed to save diagnosis to history")
 }

 toast({
 title: "Analysis complete",
 description: `Detected ${disease} with ${confidence}% confidence`,
 variant: "default",
 })
 } catch (error) {
 console.error("Error during prediction:", error)
 toast({
 title: "Prediction failed",
 description: error instanceof Error ? error.message : "An error occurred during image analysis",
 variant: "destructive",
 })
 } finally {
 setIsPredicting(false)
 }
 }

 const handleDownloadImage = () => {
 if (!predictionResult) return

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
 ctx.fillText(`${predictionResult.disease}`, 20, img.height - 15)

 ctx.fillStyle = "#4ADE80" // Green color for confidence
 ctx.font = "bold 20px Arial"
 ctx.fillText(`${predictionResult.confidence}% Confidence`, canvas.width - 180, img.height - 15)

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
 link.download = `skin-analysis-${predictionResult.disease.toLowerCase().replace(/\s+/g, "-")}-${new Date().getTime()}.png`
 document.body.appendChild(link)
 link.click()
 document.body.removeChild(link)

 toast({
 title: "Image downloaded",
 description: "Your analysis image with results has been downloaded successfully",
 variant: "default",
 })
 }

 img.src = predictionResult.imageUrl
 }

 const handleDownloadReport = () => {
 if (!predictionResult) return

 const doc = new jsPDF()
 const marginX = 15
 let y = 20

 doc.setFontSize(18)
 doc.setFont("helvetica", "bold")
 doc.text("Skin Analysis Report", marginX, y)
 y += 10

 doc.setFontSize(10)
 doc.setFont("helvetica", "normal")
 doc.setTextColor(120)
 doc.text(`Generated: ${new Date().toLocaleString()}`, marginX, y)
 doc.setTextColor(0)
 y += 10

 doc.setDrawColor(220)
 doc.line(marginX, y, 195, y)
 y += 10

 const addField = (label: string, value: string) => {
 doc.setFontSize(11)
 doc.setFont("helvetica", "bold")
 doc.text(label, marginX, y)
 y += 6
 doc.setFont("helvetica", "normal")
 const lines = doc.splitTextToSize(value, 180)
 doc.text(lines, marginX, y)
 y += lines.length * 6 + 4
 }

 const addListField = (label: string, items?: string[]) => {
 if (!items || items.length === 0) return
 doc.setFontSize(11)
 doc.setFont("helvetica", "bold")
 doc.text(label, marginX, y)
 y += 6
 doc.setFont("helvetica", "normal")
 items.forEach((item) => {
 const lines = doc.splitTextToSize(`\u2022 ${item}`, 178)
 doc.text(lines, marginX + 2, y)
 y += lines.length * 6
 })
 y += 4
 }

 addField("Detected Condition", predictionResult.disease)
 addField("Confidence", `${predictionResult.confidence}%`)
 if (predictionResult.severity) addField("Severity", predictionResult.severity)
 if (predictionResult.explanation) addField("Notes", predictionResult.explanation)
 addListField("Possible Contributing Factors", predictionResult.possibleCauses)
 addListField("General Care Suggestions", predictionResult.careTips)
 if (predictionResult.seekDoctorIf) {
 addField("See a Doctor If", predictionResult.seekDoctorIf)
 }

 y += 4
 doc.setDrawColor(220)
 doc.line(marginX, y, 195, y)
 y += 8

 doc.setFontSize(9)
 doc.setTextColor(120)
 const disclaimer =
 predictionResult.disclaimer ||
 "This is an AI-generated, non-clinical assessment and is not a substitute for professional medical advice."
 const disclaimerLines = doc.splitTextToSize(disclaimer, 180)
 doc.text(disclaimerLines, marginX, y)

 doc.save(`skin-analysis-report-${new Date().getTime()}.pdf`)

 toast({
 title: "Report downloaded",
 description: "Your PDF analysis report has been downloaded successfully",
 variant: "default",
 })
 }

 const handleViewHistory = () => {
 router.push("/history")
 }

 const handleReset = () => {
 setSelectedImage(null)
 setFile(null)
 setPredictionResult(null)
 }

 return (
 <div className="container max-w-4xl py-10 px-4 min-h-[calc(100vh-80px)] surface-teal">
 <div className="mb-8">
 <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-2">AI Skin Analysis</p>
 <h1 className="text-3xl font-display font-semibold text-foreground">Skin Disease Diagnosis</h1>
 <p className="text-sm text-muted-foreground mt-1">Upload a clear photo or use your webcam to get an AI-assisted assessment.</p>
 </div>

 <Tabs defaultValue="upload" className="w-full">
 <TabsList className="grid w-full grid-cols-2 mb-8 bg-[hsl(var(--brand-teal-soft))] p-1 rounded-xl">
 <TabsTrigger value="upload" className="text-base py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
 <UploadCloud className="mr-2 h-5 w-5" /> Upload Image
 </TabsTrigger>
 <TabsTrigger value="webcam" className="text-base py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
 <Camera className="mr-2 h-5 w-5" /> Use Webcam
 </TabsTrigger>
 </TabsList>

 <TabsContent value="upload">
 <Card>
 <CardHeader>
 <CardTitle>Upload a skin image</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 <div className="grid w-full items-center gap-1.5">
 <Label htmlFor="image-upload">Select image</Label>
 <div className="flex items-center gap-4">
 <Button
 variant="outline"
 onClick={() => document.getElementById("image-upload")?.click()}
 className="w-full h-32 border-dashed border-2"
 >
 <UploadCloud className="h-8 w-8 mr-2" />
 Click to select a file
 </Button>
 <input
 id="image-upload"
 type="file"
 accept="image/*"
 className="hidden"
 onChange={handleFileChange}
 />
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="webcam">
 <Card>
 <CardHeader>
 <CardTitle>Capture an image with your webcam</CardTitle>
 </CardHeader>
 <CardContent>
 <ImageCapture onCapture={handleCapturedImage} />
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>

 {selectedImage && !predictionResult && (
 <div className="mt-8">
 <Card>
 <CardHeader>
 <CardTitle>Image Preview</CardTitle>
 </CardHeader>
 <CardContent className="flex flex-col items-center">
 <div className="relative w-full max-w-md mb-4 rounded-md overflow-hidden">
 <Image
 src={selectedImage || "/placeholder.svg"}
 alt="Selected skin image"
 width={500}
 height={400}
 className="w-full h-auto object-contain max-h-[400px] rounded-md"
 />
 </div>
 <Button
 onClick={handlePredict}
 className="mt-4 btn-gradient"
 disabled={isPredicting}
 >
 {isPredicting ? (
 <>
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 Analyzing...
 </>
 ) : (
 "Analyze Image"
 )}
 </Button>
 </CardContent>
 </Card>
 </div>
 )}

 {predictionResult && (
 <div className="mt-10">
 <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
 <div className="flex items-center gap-2.5">
 <span className="icon-badge icon-badge-teal h-9 w-9 rounded-xl">
 <Sparkles className="h-[18px] w-[18px]" />
 </span>
 <div>
 <h2 className="text-xl font-display font-semibold text-foreground leading-tight">Your Results</h2>
 <p className="text-xs text-muted-foreground">AI-generated, non-clinical assessment</p>
 </div>
 </div>
 <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-muted-foreground hover:text-foreground">
 <RotateCcw className="h-3.5 w-3.5" />
 New Analysis
 </Button>
 </div>

 <Card className="overflow-hidden border-border/60 shadow-lg">
 <div className="flex flex-col">
 {/* Image */}
 <div className="relative bg-muted/40">
 <div className="relative w-full h-64 sm:h-80 md:h-96">
 <Image
 src={predictionResult.imageUrl || "/placeholder.svg"}
 alt="Analyzed skin image"
 fill
 className="object-cover"
 />
 </div>
 {predictionResult.severity && (
 <div className="absolute top-4 left-4">
 <span
 className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur ${
 severityStyles[predictionResult.severity] || severityStyles.None
 }`}
 >
 <span className={`h-1.5 w-1.5 rounded-full ${severityDotStyles[predictionResult.severity] || severityDotStyles.None}`} />
 {predictionResult.severity} severity
 </span>
 </div>
 )}
 </div>

 {/* Details */}
 <div className="p-6 md:p-8 space-y-7">
 {/* Headline */}
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-border/60">
 <div>
 <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-1.5">
 Detected Condition
 </p>
 <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">
 {predictionResult.disease}
 </p>
 </div>
 <div className="shrink-0">
 <div className="flex items-baseline gap-1.5">
 <span className="text-3xl font-bold text-foreground">{predictionResult.confidence}%</span>
 <span className="text-xs text-muted-foreground">confidence</span>
 </div>
 <div className="w-full sm:w-40 bg-muted rounded-full h-2 overflow-hidden mt-1.5">
 <div
 className="h-2 rounded-full bg-gradient-to-r from-[hsl(var(--brand-teal))] to-[hsl(var(--brand-blue))] transition-all duration-700"
 style={{ width: `${predictionResult.confidence}%` }}
 ></div>
 </div>
 </div>
 </div>

 {/* Notes */}
 {predictionResult.explanation && (
 <div className="flex gap-3">
 <span className="icon-badge icon-badge-blue h-8 w-8 rounded-lg shrink-0">
 <Info className="h-4 w-4" />
 </span>
 <div className="space-y-1">
 <h3 className="text-sm font-semibold text-foreground">Notes</h3>
 <p className="text-sm text-muted-foreground leading-relaxed">{predictionResult.explanation}</p>
 </div>
 </div>
 )}

 {/* Causes + Care tips */}
 {((predictionResult.possibleCauses && predictionResult.possibleCauses.length > 0) ||
 (predictionResult.careTips && predictionResult.careTips.length > 0)) && (
 <div className="grid sm:grid-cols-2 gap-5">
 {predictionResult.possibleCauses && predictionResult.possibleCauses.length > 0 && (
 <div className="rounded-xl bg-muted/40 p-4 space-y-2.5">
 <div className="flex items-center gap-2">
 <ListChecks className="h-4 w-4 text-[hsl(var(--brand-blue))]" />
 <h3 className="text-sm font-semibold text-foreground">Possible Contributing Factors</h3>
 </div>
 <ul className="space-y-1.5">
 {predictionResult.possibleCauses.map((cause, i) => (
 <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-[hsl(var(--brand-blue))]">
 {cause}
 </li>
 ))}
 </ul>
 </div>
 )}
 {predictionResult.careTips && predictionResult.careTips.length > 0 && (
 <div className="rounded-xl bg-muted/40 p-4 space-y-2.5">
 <div className="flex items-center gap-2">
 <Lightbulb className="h-4 w-4 text-[hsl(var(--brand-teal))]" />
 <h3 className="text-sm font-semibold text-foreground">General Care Suggestions</h3>
 </div>
 <ul className="space-y-1.5">
 {predictionResult.careTips.map((tip, i) => (
 <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-[hsl(var(--brand-teal))]">
 {tip}
 </li>
 ))}
 </ul>
 </div>
 )}
 </div>
 )}

 {/* Seek doctor */}
 {predictionResult.seekDoctorIf && (
 <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
 <Stethoscope className="h-4 w-4" />
 </span>
 <p className="text-sm text-amber-900 leading-relaxed">
 <span className="font-semibold">See a doctor </span>
 {predictionResult.seekDoctorIf}
 </p>
 </div>
 )}

 {/* Disclaimer */}
 <div className="flex items-start gap-2 pt-1">
 <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
 <p className="text-xs text-muted-foreground leading-relaxed">
 {predictionResult.disclaimer ||
 "This is an AI-generated, non-clinical assessment and is not a substitute for professional medical advice."}
 </p>
 </div>

 {/* Actions */}
 <div className="flex flex-wrap gap-3 pt-2">
 <Button variant="outline" onClick={handleDownloadImage} className="flex-1 min-w-[150px]">
 <Download className="mr-2 h-4 w-4" />
 Download Image
 </Button>
 <Button variant="outline" onClick={handleDownloadReport} className="flex-1 min-w-[150px]">
 <FileText className="mr-2 h-4 w-4" />
 Download PDF Report
 </Button>
 <Button
 variant="default"
 className="flex-1 min-w-[150px] btn-gradient"
 onClick={handleViewHistory}
 >
 View History
 </Button>
 </div>
 </div>
 </div>
 </Card>
 </div>
 )}
 </div>
 )
}