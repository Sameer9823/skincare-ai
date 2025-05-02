import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-5xl mx-auto text-center">
        <div className="space-y-6">
          <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">SkinCare  AI</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-powered Precision in Skin Disease Detection
          </p>

          <div className="pt-8">
            <Link href="/diagnosis">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
              >
                Start Diagnosis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12" y2="16" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Accurate Detection</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI model delivers consistent and reliable skin disease predictions.
                </p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Upload or Capture</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload an image or use your webcam to capture skin conditions.
                </p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                    <path d="M2 12h4" />
                    <path d="M12 2v10" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Track History</h3>
                <p className="text-gray-600 dark:text-gray-300">View and download your previous diagnosis results.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
