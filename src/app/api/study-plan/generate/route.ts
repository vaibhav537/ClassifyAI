import { extractJSON } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { syllabus, examDate } = body;

    if (!syllabus || !syllabus.trim()) {
      return NextResponse.json(
        { success: false, error: "Syllabus is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OPENROUTER_API_KEY is missing" },
        { status: 500 }
      );
    }

    const prompt = `
You are an intelligent academic AI assistant helping an engineering student prepare for exams.

Create:
1. Study Roadmap weekly breakdown
2. Important Topics
3. Important Questions
4. Personalized Daily Study Plan

Syllabus:
${syllabus}

${examDate ? `Exam Date: ${examDate}` : ""}

Return ONLY valid JSON.
No markdown.
No explanation.
No code block.

JSON format:
{
  "roadmap": ["Week 1: ...", "Week 2: ..."],
  "importantTopics": ["...", "..."],
  "importantQuestions": ["...", "..."],
  "studyPlan": {
    "Day 1": "...",
    "Day 2": "..."
  }
}
`;

    const aiResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        "X-Title": "Classify AI",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content:
              "You generate strict valid JSON only. Never return markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    const result = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("❌ AI API Error:", result);

      const message =
        result?.error?.message ||
        result?.message ||
        `AI provider failed with status ${aiResponse.status}`;

      return NextResponse.json(
        {
          success: false,
          error: message,
          status: aiResponse.status,
        },
        { status: aiResponse.status }
      );
    }

    const rawText = result?.choices?.[0]?.message?.content;

    if (!rawText) {
      console.error("❌ Empty AI Response:", result);

      return NextResponse.json(
        {
          success: false,
          error: "AI returned empty response",
        },
        { status: 502 }
      );
    }

    let data;

    try {
      data = extractJSON(rawText);
    } catch (error) {
      console.error("❌ Failed to parse AI JSON:", rawText);

      return NextResponse.json(
        {
          success: false,
          error: "AI response did not contain valid JSON",
          rawText,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        provider: "openrouter",
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Study Plan Generation Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}