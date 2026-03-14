// packages/gen-ui/src/server/generate-ui.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import fs from "fs";
import path from "path";

export async function askAIForComponent(userPrompt: string) {
  // 1. Read our auto-generated Markdown context
  const systemPromptPath = path.resolve(process.cwd(), "packages/gen-ui/src/system-prompt.md");
  const systemContext = fs.readFileSync(systemPromptPath, "utf-8");

  // 2. Call the LLM with strict instructions
  const result = await streamText({
    model: openai("gpt-4o"), // or claude-3-5-sonnet
    system: systemContext,
    prompt: userPrompt,
  });

  // 3. Stream the raw React code string back to the client
  return result.toDataStreamResponse();
}
