"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Download, Trash2, Eye, Calendar, User, Building2, AlertTriangle, Loader2, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Prescription {
 id: string
 fileName: string
 fileUrl: string
 fileType: string
 fileSize: number
 doctorName: string | null
 clinicName: string | null
 uploadedAt: string
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function formatFileSize(bytes: number): string {
 if (bytes < 1024) return `${bytes} B`
 if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
 return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
 if (type === "application/pdf") return FileText
 if (type.startsWith("image/")) return FileText
 return FileText
}

export default function PrescriptionPage() {
 const router = useRouter()
 const { toast } = useToast()
 const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
 const [isLoading, setIsLoading] = useState(true)
 const [isUploading, setIsUploading] = useState(false)
 const [uploadProgress, setUploadProgress] = useState(0)
 const [doctorName, setDoctorName] = useState("")
 const [clinicName, setClinicName] = useState("")
 const [selectedFile, setSelectedFile] = useState<File | null>(null)
 const [dragActive, setDragActive] = useState(false)

 useEffect(() => {
 fetchPrescriptions()
 }, [])

 const fetchPrescriptions = async () => {
 setIsLoading(true)
 try {
 const res = await fetch("/api/prescriptions")
 if (!res.ok) throw new Error("Failed to load prescriptions")
 const data = await res.json()
 setPrescriptions(data.prescriptions || [])
 } catch (error) {
 console.error("Failed to load prescriptions:", error)
 toast({
 title: "Couldn't load prescriptions",
 description: "There was a problem loading your documents",
 variant: "destructive",
 })
 } finally {
 setIsLoading(false)
 }
 }

 const handleFileChange = (file: File | null) => {
 if (!file) return

 if (!ALLOWED_TYPES.includes(file.type)) {
 toast({
 title: "Invalid file type",
 description: "Please upload a PDF, JPG, or PNG file",
 variant: "destructive",
 })
 return
 }

 if (file.size > MAX_FILE_SIZE) {
 toast({
 title: "File too large",
 description: "Maximum file size is 10MB",
 variant: "destructive",
 })
 return
 }

 setSelectedFile(file)
 }

 const handleDragOver = (e: React.DragEvent) => {
 e.preventDefault()
 e.stopPropagation()
 setDragActive(true)
 }

 const handleDragLeave = (e: React.DragEvent) => {
 e.preventDefault()
 e.stopPropagation()
 setDragActive(false)
 }

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault()
 e.stopPropagation()
 setDragActive(false)

 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 handleFileChange(e.dataTransfer.files[0])
 }
 }

 const handleUpload = async () => {
 if (!selectedFile) {
 toast({
 title: "No file selected",
 description: "Please select a file to upload",
 variant: "destructive",
 })
 return
 }

 setIsUploading(true)
 setUploadProgress(0)

 try {
 const formData = new FormData()
 formData.append("file", selectedFile)
 if (doctorName) formData.append("doctorName", doctorName)
 if (clinicName) formData.append("clinicName", clinicName)

 const progressInterval = setInterval(() => {
 setUploadProgress((prev) => Math.min(prev + 10, 90))
 }, 100)

 const response = await fetch("/api/prescriptions", {
 method: "POST",
 body: formData,
 })

 clearInterval(progressInterval)
 setUploadProgress(100)

 const data = await response.json()

 if (!response.ok) {
 throw new Error(data?.error || "Failed to upload prescription")
 }

 toast({
 title: "Upload successful",
 description: "Your prescription has been uploaded",
 })

 setSelectedFile(null)
 setDoctorName("")
 setClinicName("")
 setUploadProgress(0)
 fetchPrescriptions()
 } catch (error) {
 console.error("Failed to upload prescription:", error)
 toast({
 title: "Upload failed",
 description: error instanceof Error ? error.message : "Something went wrong",
 variant: "destructive",
 })
 } finally {
 setIsUploading(false)
 setTimeout(() => setUploadProgress(0), 500)
 }
 }

 const handleDelete = async (id: string) => {
 try {
 const response = await fetch(`/api/prescriptions/${id}`, {
 method: "DELETE",
 })

 if (!response.ok) throw new Error("Failed to delete")

 toast({
 title: "Deleted",
 description: "Prescription has been removed",
 })

 fetchPrescriptions()
 } catch (error) {
 console.error("Failed to delete prescription:", error)
 toast({
 title: "Delete failed",
 description: "Could not remove the prescription",
 variant: "destructive",
 })
 }
 }

 const handleView = (fileUrl: string, fileType: string) => {
 window.open(fileUrl, "_blank")
 }

 const handleDownload = (fileUrl: string, fileName: string) => {
 const link = document.createElement("a")
 link.href = fileUrl
 link.download = fileName
 document.body.appendChild(link)
 link.click()
 document.body.removeChild(link)
 }

 if (isLoading) {
 return (
 <div className="container py-16 surface-violet min-h-screen">
 <div className="max-w-3xl mx-auto space-y-6">
 <div className="flex items-center gap-3">
 <div className="icon-badge icon-badge-violet h-10 w-10 rounded-full">
 <FileText className="h-5 w-5" />
 </div>
 <div>
 <h1 className="text-3xl font-display font-semibold text-foreground">Prescriptions</h1>
 <p className="text-muted-foreground">Manage your medical documents</p>
 </div>
 </div>
 <div className="space-y-4">
 {[1, 2, 3].map((i) => (
 <Card key={i} className="border-border/50 bg-background animate-pulse">
 <CardContent className="p-6">
 <div className="flex items-center gap-4">
 <div className="h-12 w-12 bg-muted rounded-lg" />
 <div className="flex-1 space-y-2">
 <div className="h-4 w-3/4 bg-muted rounded" />
 <div className="h-3 w-1/2 bg-muted rounded" />
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 </div>
 )
 }

 return (
 <div className="container py-10 md:py-16 max-w-4xl surface-violet min-h-screen">
 <div className="mb-10">
 <div className="flex items-center gap-3 mb-2">
 <div className="icon-badge icon-badge-violet h-10 w-10 rounded-full">
 <FileText className="h-5 w-5" />
 </div>
 <div>
 <h1 className="text-3xl font-display font-semibold text-foreground">Prescriptions & Medical Documents</h1>
 <p className="text-muted-foreground">Securely store and organize your prescription documents and medical records</p>
 </div>
 </div>
 </div>

 {/* Medical Disclaimer */}
 <div className="mb-8 p-4 bg-[hsl(var(--disclaimer-bg))] border border-[hsl(24_80%_88%)] rounded-xl">
 <div className="flex items-start gap-3">
 <AlertTriangle className="h-5 w-5 text-[hsl(var(--disclaimer-foreground))] mt-0.5 flex-shrink-0" />
 <div>
 <h4 className="font-medium text-[hsl(var(--disclaimer-foreground))] mb-1">Important Medical Disclaimer</h4>
 <p className="text-sm text-[hsl(15_60%_35%)]">
 This application does <strong>not</strong> generate medical prescriptions, dosages, or treatment plans.
 All prescriptions must come from qualified healthcare professionals. This feature is for
 document organization and reference only.
 </p>
 </div>
 </div>
 </div>

 {/* Upload Section */}
 <Card className="border-border/50 bg-background mb-8 shadow-md">
 <CardHeader className="pb-4">
 <CardTitle className="text-lg flex items-center gap-2">
 <Upload className="h-5 w-5" />
 Upload New Document
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-6">
 <div
 className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-colors ${
 dragActive
 ? "border-[hsl(var(--brand-violet))] bg-[hsl(var(--brand-violet-soft))]"
 : "border-border/50 bg-muted/30"
 }`}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 >
 <input
 type="file"
 id="file-upload"
 accept=".pdf,.jpg,.jpeg,.png"
 onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
 disabled={isUploading}
 />
 <label
 htmlFor="file-upload"
 className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
 >
 {selectedFile ? (
 <div className="flex items-center gap-4 w-full max-w-md">
 <div className="icon-badge icon-badge-violet h-16 w-16 rounded-lg flex-shrink-0">
 {(() => { const Icon = getFileIcon(selectedFile.type); return <Icon className="h-8 w-8" />; })()}
 </div>
 <div className="text-left flex-1 min-w-0">
 <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
 <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
 </div>
 <Button
 variant="ghost"
 size="icon"
 onClick={(e) => {
 e.preventDefault()
 e.stopPropagation()
 setSelectedFile(null)
 }}
 className="text-muted-foreground hover:text-red-500"
 >
 <X className="h-5 w-5" />
 </Button>
 </div>
 ) : (
 <div className="flex flex-col items-center gap-4">
 <Upload className="h-12 w-12 text-muted-foreground/50" />
 <div className="text-center">
 <p className="font-medium text-foreground">Drag & drop a file here, or click to browse</p>
 <p className="text-sm text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
 </div>
 </div>
 )}
 </label>
 </div>

 {selectedFile && (
 <>
 <div className="space-y-3">
 <div className="space-y-1.5">
 <Label htmlFor="doctor-name">Doctor Name (optional)</Label>
 <Input
 id="doctor-name"
 value={doctorName}
 onChange={(e) => setDoctorName(e.target.value)}
 placeholder="Dr. Sarah Mitchell"
 disabled={isUploading}
 />
 </div>
 <div className="space-y-1.5">
 <Label htmlFor="clinic-name">Clinic/Hospital (optional)</Label>
 <Input
 id="clinic-name"
 value={clinicName}
 onChange={(e) => setClinicName(e.target.value)}
 placeholder="City Dermatology Clinic"
 disabled={isUploading}
 />
 </div>
 </div>

 {isUploading && (
 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="text-muted-foreground">Uploading...</span>
 <span className="font-medium text-primary">{uploadProgress}%</span>
 </div>
 <Progress value={uploadProgress} className="h-2" />
 </div>
 )}

 <Button
 className="w-full btn-gradient"
 onClick={handleUpload}
 disabled={isUploading || !selectedFile}
 >
 {isUploading ? (
 <>
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 Uploading...
 </>
 ) : (
 "Upload Document"
 )}
 </Button>
 </>
 )}

 {!selectedFile && (
 <div className="space-y-2 text-xs text-muted-foreground">
 <div className="flex items-center gap-1.5">
 <FileText className="h-3.5 w-3.5" />
 <span>PDF documents</span>
 </div>
 <div className="flex items-center gap-1.5">
 <FileText className="h-3.5 w-3.5" />
 <span>JPG / PNG images</span>
 </div>
 <div className="flex items-center gap-1.5">
 <FileText className="h-3.5 w-3.5" />
 <span>Max 10MB per file</span>
 </div>
 </div>
 )}
 </CardContent>
 </Card>

 {/* Prescriptions List */}
 <div>
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-display font-semibold text-foreground">Your Documents</h2>
 <Badge variant="outline" className="text-xs">
 {prescriptions.length} document{prescriptions.length !== 1 ? "s" : ""}
 </Badge>
 </div>

 {prescriptions.length === 0 ? (
 <Card className="border-border/50 bg-background">
 <CardContent className="py-12 px-6 text-center">
 <div className="icon-badge icon-badge-violet h-16 w-16 rounded-full mx-auto mb-4 opacity-90">
 <FileText className="h-8 w-8" />
 </div>
 <h3 className="text-lg font-medium text-foreground mb-2">No prescriptions uploaded</h3>
 <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
 Upload a prescription to keep your medical documents organized and easily accessible.
 </p>
 <Button variant="outline" className="w-full sm:w-auto" onClick={() => document.getElementById("file-upload")?.click()}>
 <Upload className="mr-2 h-4 w-4" />
 Upload First Document
 </Button>
 </CardContent>
 </Card>
 ) : (
 <div className="space-y-4">
 {prescriptions.map((doc) => (
 <Card key={doc.id} className="border-border/50 bg-background hover:shadow-lg hover:-translate-y-0.5 transition-all">
 <CardContent className="p-4 space-y-4">
 <div className="flex items-start gap-4">
 <div className="icon-badge icon-badge-violet h-14 w-14 rounded-lg flex-shrink-0">
 {(() => { const Icon = getFileIcon(doc.fileType); return <Icon className="h-7 w-7" />; })()}
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-medium text-foreground truncate">{doc.fileName}</p>
 <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
 <span className="flex items-center gap-1">
 <Calendar className="h-3.5 w-3.5" />
 {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
 </span>
 {doc.doctorName && (
 <span className="flex items-center gap-1">
 <User className="h-3.5 w-3.5" />
 {doc.doctorName}
 </span>
 )}
 {doc.clinicName && (
 <span className="flex items-center gap-1">
 <Building2 className="h-3.5 w-3.5" />
 {doc.clinicName}
 </span>
 )}
 <Badge variant="secondary" className="text-[10px]">{formatFileSize(doc.fileSize)}</Badge>
 <Badge variant="outline" className="text-[10px]">{doc.fileType === "application/pdf" ? "PDF" : "Image"}</Badge>
 </div>
 </div>
 <div className="flex items-center gap-1">
 <TooltipProvider>
 <Tooltip>
 <TooltipTrigger asChild>
 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => handleView(doc.fileUrl, doc.fileType)}>
 <Eye className="h-4 w-4" />
 </Button>
 </TooltipTrigger>
 <TooltipContent>View document</TooltipContent>
 </Tooltip>
 </TooltipProvider>
 <TooltipProvider>
 <Tooltip>
 <TooltipTrigger asChild>
 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => handleDownload(doc.fileUrl, doc.fileName)}>
 <Download className="h-4 w-4" />
 </Button>
 </TooltipTrigger>
 <TooltipContent>Download</TooltipContent>
 </Tooltip>
 </TooltipProvider>
 <TooltipProvider>
 <Tooltip>
 <TooltipTrigger asChild>
 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" onClick={() => handleDelete(doc.id)}>
 <Trash2 className="h-4 w-4" />
 </Button>
 </TooltipTrigger>
 <TooltipContent>Delete</TooltipContent>
 </Tooltip>
 </TooltipProvider>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}
 </div>
 </div>
 )
}
