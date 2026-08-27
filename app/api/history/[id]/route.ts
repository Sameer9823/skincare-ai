import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to delete a record" }, { status: 401 })
  }

  try {
    const { id } = await params

    // Only delete if the record belongs to this user, so one account
    // can't delete another's history by guessing ids.
    const result = await prisma.diagnosisRecord.deleteMany({
      where: { id, userId: session.user.id },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete record:", error)
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 })
  }
}
