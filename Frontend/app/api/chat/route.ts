export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    console.log("[v0] Sending message to backend:", message)

    const backendUrl = "https://Macmacmacmacmacmac-mental-health-chatbot-backend.hf.space"

    const formData = new FormData()
    formData.append("query", message)
    formData.append("user_lang", "en")

    console.log("[v0] Making request to:", `${backendUrl}/chat_text`)

    const response = await fetch(`${backendUrl}/chat_text`, {
      method: "POST",
      body: formData,
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Backend response data:", data)

    return Response.json({
      message: data.response || data.answer || "I'm here to help you with your mental wellness journey.",
    })
  } catch (error) {
    console.error("[v0] Backend connection error:", error)
    return Response.json(
      {
        error: "I'm sorry, I'm having trouble connecting right now. Please check your API configuration and try again.",
      },
      { status: 500 },
    )
  }
}
