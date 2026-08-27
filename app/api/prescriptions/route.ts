import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to view prescriptions" }, { status: 401 })
  }

  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { userId: session.user.id },
      orderBy: { uploadedAt: "desc" },
    })
    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error("Failed to fetch prescriptions:", error)
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to upload a prescription" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const doctorName = formData.get("doctorName") as string | null
    const clinicName = formData.get("clinicName") as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, JPEG, PNG, PDF" },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Convert file to base64 for storage (in production, use cloud storage like S3)
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Generate safe filename
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${timestamp}-${safeName}`

    const prescription = await prisma.prescription.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: dataUrl,
        fileType: file.type,
        fileSize: file.size,
        doctorName: doctorName || null,
        clinicName: clinicName || null,
      },
    })

    return NextResponse.json({ prescription }, { status: 201 })
  } catch (error) {
    console.error("Failed to upload prescription:", error)
    return NextResponse.json({ error: "Failed to upload prescription" }, { status: 500 })
  }
}