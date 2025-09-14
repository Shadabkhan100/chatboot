import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { initialMessage } from "@/lib/data";
import { Message } from "ai"; // Optional, if using TS and Message type


const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export const runtime = "edge";

const generateId = () => Math.random().toString(36).slice(2, 15);

const buildGoogleGenAIPrompt = (messages: Message[]): Message[] => {
  return [
    {
      id: generateId(),
      role: "user",
      content: initialMessage.content,
    },
    ...messages.map((message) => ({
      id: message.id || generateId(),
      role: message.role,
      content: message.content,
    })),
  ];
};

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    messages: buildGoogleGenAIPrompt(messages),
    temperature: 0.7,
  });

  return result.toAIStreamResponse(); // Or result.toDataStreamResponse() depending on SDK
}
