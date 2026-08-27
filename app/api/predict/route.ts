import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Requires OPENAI_API_KEY to be set in your environment (.env.local).
// Never hardcode API keys in source files.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

const SYSTEM_PROMPT = `You are a dermatology-assistant AI. You will be shown a photo of a patch of human skin.
Look closely and analyze it thoroughly, then respond ONLY with a strict JSON object (no markdown, no extra text) in this exact shape:
{
  "disease": string,          // one concise condition name, or "No Skin Disease Detected" if the skin looks healthy or the image is not a valid analyzable skin photo
  "confidence": number,       // your confidence in this specific assessment, 0-100
  "severity": string,         // one of: "None", "Mild", "Moderate", "Severe"
  "explanation": string,      // 4-6 detailed sentences written in clear, plain language for a non-medical reader. Describe: (1) the specific visual signs you observed (color, texture, shape, borders, distribution, size, any scaling/redness/bumps/discoloration etc.), (2) how those signs relate to the condition named, (3) how commonly this presentation shows up and any typical progression, and (4) anything notable about severity or extent. Be thorough and specific rather than generic — avoid vague filler sentences.
  "possibleCauses": string[], // 4-6 short, plain-language possible contributing factors (e.g. "dry skin", "sun exposure", "hormonal changes", "friction or irritation", "genetic predisposition"). Empty array if not applicable.
  "careTips": string[],       // 5-7 specific, practical, non-prescriptive self-care suggestions (e.g. "apply a fragrance-free moisturizer within a few minutes of bathing", "use lukewarm rather than hot water"). Be concrete and actionable, not generic. Never suggest specific drug names, dosages, or prescription treatments.
  "seekDoctorIf": string,     // 1-2 sentences listing concrete warning signs that warrant seeing a dermatologist or doctor promptly (e.g. rapid spreading, fever, oozing, severe pain, no improvement after a stated timeframe). Always include something reasonable here, even for mild/no findings.
  "disclaimer": string        // a short standard disclaimer that this is an AI-generated, non-clinical assessment, not a medical diagnosis
}
Do not include any text outside the JSON object. Never recommend specific medications, dosages, or prescription-only treatments — only general, safe self-care habits. Favor specific, detailed, well-reasoned observations over short generic statements. This is not a medical diagnosis; it is a preliminary, non-clinical visual assessment and should always be treated as such.`

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in to analyze an image" }, { status: 401 })
  }

  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY. Set it in your environment and restart the server." },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("image")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Uploaded file must be an image" }, { status: 400 })
    }

    // Convert the uploaded image to a base64 data URL server-side.
    // (FileReader is a browser-only API and does not exist in a server route.)
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this skin image thoroughly and respond with the detailed JSON object described." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 1200,
      temperature: 0.2,
      response_format: { type: "json_object" },
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Error from OpenAI API:", errorData)
      return NextResponse.json({ error: "Failed to analyze the image" }, { status: 502 })
    }

    const data = await response.json()
    const rawContent = data?.choices?.[0]?.message?.content

    if (!rawContent) {
      console.error("Unexpected OpenAI response shape:", data)
      return NextResponse.json({ error: "Model returned no result" }, { status: 502 })
    }

    let result: {
      disease: string
      confidence: number
      severity?: string
      explanation: string
      possibleCauses?: string[]
      careTips?: string[]
      seekDoctorIf?: string
      disclaimer?: string
    }
    try {
      result = JSON.parse(rawContent)
    } catch (parseError) {
      console.error("Failed to parse model output as JSON:", rawContent)
      return NextResponse.json({ error: "Model returned an unreadable result" }, { status: 502 })
    }

    return NextResponse.json({
      disease: result.disease ?? "Unknown",
      confidence: typeof result.confidence === "number" ? result.confidence : 0,
      severity: result.severity ?? "Unknown",
      explanation: result.explanation ?? "",
      possibleCauses: Array.isArray(result.possibleCauses) ? result.possibleCauses : [],
      careTips: Array.isArray(result.careTips) ? result.careTips : [],
      seekDoctorIf: result.seekDoctorIf ?? "if symptoms worsen, spread, or do not improve within a couple of weeks",
      disclaimer:
        result.disclaimer ??
        "This is an AI-generated, non-clinical assessment and is not a substitute for professional medical advice.",
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "An error occurred during prediction" }, { status: 500 })
  }
}