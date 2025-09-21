import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    console.log("[v0] Received message:", message)

    const BACKEND_URL = "https://Macmacmacmacmacmac-mental-health-chatbot-backend.hf.space"
    console.log("[v0] Connecting to backend:", `${BACKEND_URL}/chat_text`)

    const response = await fetch(`${BACKEND_URL}/chat_text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: message,
        user_lang: "auto",
      }),
    })

    console.log("[v0] Backend response status:", response.status)
    console.log("[v0] Backend response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend error response:", errorText)
      throw new Error(`Backend request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Backend response data:", data)

    const aiResponse =
      data.response || "I'm here to listen and support you. Could you tell me more about what's on your mind?"

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to connect to backend. Please check if the backend is running.",
      },
      { status: 500 },
    )
  }
}
