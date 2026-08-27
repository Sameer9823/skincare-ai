import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to delete a prescription" }, { status: 401 })
  }

  try {
    const { id } = await params

    const prescription = await prisma.prescription.findUnique({
      where: { id },
    })

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    if (prescription.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.prescription.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete prescription:", error)
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 })
  }
}