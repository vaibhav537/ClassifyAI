import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is missing" },
        { status: 500 },
      );
    }
    const prompt = `
You are an academic communication assistant for a college app called Classify AI.

Your task is to rewrite the user's message into a better chat message.

Make the message:
- clearer
- more respectful
- more complete
- polite but still natural
- suitable for sending to a teacher, assistant, or classmate

Important rules:
- Keep the same meaning.
- Do not add fake details.
- Do not make it too long.
- If the message is in Hinglish, keep it in Hinglish.
- If the user is asking a teacher, make it sound respectful.
- Avoid robotic or overly formal language.
- Return only the improved message. No explanation. No quotes.

Examples:

Input:
sir q3 smj ni aya kya krna h

Output:
Sir, mujhe Question 3 samajhne me thodi difficulty ho rahi hai. Kya aap please bata sakte hain ki isme hume kya approach follow karni chahiye?

Input:
mam assignment kab submit krna h

Output:
Ma’am, assignment kab submit karna hai? Kya aap please deadline confirm kar sakti hain?

Input:
bhai notes bhej de

Output:
Bhai, notes bhej de please. Mujhe revision ke liye chahiye.

Original message:
${text}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Classify AI",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.4,
          max_tokens: 120,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter improve message error:", errorText);

      return NextResponse.json(
        { error: "Failed to improve message" },
        { status: 500 },
      );
    }

    const data = await response.json();

    const improved =
      data?.choices?.[0]?.message?.content?.trim() || text.trim();

    return NextResponse.json({
      improved,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
