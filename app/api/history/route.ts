import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to view your history" }, { status: 401 })
  }

  try {
    const records = await prisma.diagnosisRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ history: records })
  } catch (error) {
    console.error("Failed to fetch history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to save a diagnosis" }, { status: 401 })
  }

  try {
    const body = await req.json()

    const { disease, confidence, severity, explanation, possibleCauses, careTips, seekDoctorIf, disclaimer, imageUrl } =
      body ?? {}

    if (!disease || typeof confidence !== "number" || !imageUrl) {
      return NextResponse.json(
        { error: "disease, confidence, and imageUrl are required" },
        { status: 400 }
      )
    }

    const record = await prisma.diagnosisRecord.create({
      data: {
        userId: session.user.id,
        disease,
        confidence: Math.round(confidence),
        severity: severity ?? null,
        explanation: explanation ?? null,
        possibleCauses: Array.isArray(possibleCauses) ? possibleCauses : [],
        careTips: Array.isArray(careTips) ? careTips : [],
        seekDoctorIf: seekDoctorIf ?? null,
        disclaimer: disclaimer ?? null,
        imageUrl,
      },
    })

    return NextResponse.json({ record }, { status: 201 })
  } catch (error) {
    console.error("Failed to save diagnosis record:", error)
    return NextResponse.json({ error: "Failed to save diagnosis record" }, { status: 500 })
  }
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to clear your history" }, { status: 401 })
  }

  try {
    await prisma.diagnosisRecord.deleteMany({ where: { userId: session.user.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to clear history:", error)
    return NextResponse.json({ error: "Failed to clear history" }, { status: 500 })
  }
}
