"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface ImageCaptureProps {
  onCapture: (imageDataUrl: string) => void
}

export default function ImageCapture({ onCapture }: ImageCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isMobile = useMobile()

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile ? "environment" : "user",
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        setCapturedImage(null)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check your browser permissions.")
    }
  }, [isMobile])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }, [])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
      }

      // Convert canvas to a data URL and store it
      const imageDataUrl = canvas.toDataURL("image/png")
      setCapturedImage(imageDataUrl)
      onCapture(imageDataUrl)

      // Stop the camera
      stopCamera()
    }
  }, [onCapture, stopCamera])

  const resetCapture = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
        {!isCameraActive && !capturedImage && (
          <Button onClick={startCamera} className="absolute z-10">
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}

        {capturedImage ? (
          <div className="relative w-full h-full">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-contain" />
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4 justify-center">
        {isCameraActive && (
          <Button
            onClick={captureImage}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
          >
            <Camera className="mr-2 h-4 w-4" />
            Capture
          </Button>
        )}

        {capturedImage && (
          <Button variant="outline" onClick={resetCapture}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake
          </Button>
        )}
      </div>
    </div>
  )
}
