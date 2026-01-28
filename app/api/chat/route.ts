// app/api/ai-model/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: messages.map((m: any) => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: err.message || "Gemini API failed" },
      { status: 500 }
    );
  }
}
