"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Camera, UploadCloud, Loader2, Download } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import ImageCapture from "@/components/image-capture"
import { useRouter } from "next/navigation"

export default function DiagnosisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictionResult, setPredictionResult] = useState<{
    disease: string
    confidence: number
    imageUrl: string
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
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload or capture an image first",
        variant: "destructive",
      })
      return
    }

    setIsPredicting(true)

    try {
      // In a real implementation, this would be an API call to your Flask backend
      // const formData = new FormData();
      // formData.append("image", file!);
      // const response = await fetch("/api/predict", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();

      
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const mockDiseases = ["Psoriasis", "Eczema", "Acne Vulgaris", "Melanoma", "Rosacea", "No Skin Disease Detected"]
      const randomConfidence = Math.floor(Math.random() * 100);
      const randomDisease = randomConfidence < 50 ? "No Skin Disease Detected" : mockDiseases[Math.floor(Math.random() * (mockDiseases.length - 1))];

      setPredictionResult({
        disease: randomDisease,
        confidence: randomConfidence,
        imageUrl: selectedImage,
      })

      const historyItem = {
        id: Date.now().toString(),
        disease: randomDisease,
        confidence: randomConfidence,
        imageUrl: selectedImage,
        timestamp: new Date().toISOString(),
      }

      // Save to local storage for history
      const existingHistory = JSON.parse(localStorage.getItem("diagnosisHistory") || "[]")
      localStorage.setItem("diagnosisHistory", JSON.stringify([historyItem, ...existingHistory]))

      toast({
        title: "Analysis complete",
        description: `Detected ${randomDisease} with ${randomConfidence}% confidence`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error during prediction:", error)
      toast({
        title: "Prediction failed",
        description: "An error occurred during image analysis",
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

  const handleViewHistory = () => {
    router.push("/history")
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Skin Disease Diagnosis</h1>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload" className="text-base py-3">
            <UploadCloud className="mr-2 h-5 w-5" /> Upload Image
          </TabsTrigger>
          <TabsTrigger value="webcam" className="text-base py-3">
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
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
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
        <div className="mt-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle>Diagnosis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="relative w-full lg:w-1/2 rounded-md overflow-hidden">
                  <Image
                    src={predictionResult.imageUrl || "/placeholder.svg"}
                    alt="Analyzed skin image"
                    width={500}
                    height={400}
                    className="w-full h-auto object-contain max-h-[400px] rounded-md"
                  />
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Detected Condition</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{predictionResult.disease}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Confidence</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                        <div
                          className="bg-emerald-600 dark:bg-emerald-500 h-6 rounded-full"
                          style={{ width: `${predictionResult.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {predictionResult.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button variant="outline" onClick={handleDownloadImage} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      onClick={handleViewHistory}
                    >
                      View History
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
