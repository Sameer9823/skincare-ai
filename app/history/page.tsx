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
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load history from local storage
    const storedHistory = localStorage.getItem("diagnosisHistory")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
    setIsLoading(false)
  }, [])

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
    const csvHeader = "Disease,Confidence,Timestamp\n"
    const csvRows = history.map(
      (item) => `${item.disease},${item.confidence}%,${new Date(item.timestamp).toLocaleString()}`,
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
    const img = new Image()
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

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your diagnosis history?")) {
      localStorage.removeItem("diagnosisHistory")
      setHistory([])
      toast({
        title: "History cleared",
        description: "Your diagnosis history has been deleted",
        variant: "default",
      })
    }
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Diagnosis History</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage your previous skin condition diagnoses</p>
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
        <Card>
          <CardContent className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <DownloadCloud className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium">No diagnosis history</h3>
            <p className="text-gray-500 mt-2">Your previous diagnoses will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
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
                              <Info className="ml-2 h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">{getDiseaseDescription(item.disease)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-emerald-600 dark:bg-emerald-500 h-2.5 rounded-full"
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

// Helper function to get disease descriptions
function getDiseaseDescription(disease: string): string {
  const descriptions: Record<string, string> = {
    Psoriasis:
      "A chronic skin condition causing rapid skin cell buildup, resulting in thick, red, scaly patches on the skin.",
    Eczema:
      "A common inflammatory skin condition characterized by dry, itchy, and red skin, often appearing in patches.",
    "Acne Vulgaris":
      "A skin condition that occurs when hair follicles become clogged with oil and dead skin cells, leading to pimples.",
    Melanoma: "A serious form of skin cancer that develops from pigment-producing cells known as melanocytes.",
    Rosacea:
      "A common skin condition causing redness and visible blood vessels in your face, sometimes with small, red, pus-filled bumps.",
  }

  return descriptions[disease] || "No description available for this condition."
}
