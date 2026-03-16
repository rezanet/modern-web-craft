import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { runMakerCheckerLoop, FunctionalScopeSchema } from "@craft/agency-core";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log("🚀 Starting Agency Pipeline for prompt:", prompt);

    // 1. Load the Agent Brains (System Prompts)
    // Next.js runs with process.cwd() at apps/showcase-web, so we go up two levels to the root
    const baPath = path.resolve(process.cwd(), "../../skills/agents/01-business-analyst.md");
    const poPath = path.resolve(process.cwd(), "../../skills/agents/02-product-owner.md");

    const baSystem = fs.readFileSync(baPath, "utf-8");
    const poSystem = fs.readFileSync(poPath, "utf-8");

    // 2. Run the Maker/Checker Loop
    const result = await runMakerCheckerLoop({
      model: openai("gpt-4o"), // Uses your OPENAI_API_KEY from .env.local
      schema: FunctionalScopeSchema,
      makerSystem: baSystem,
      checkerSystem: poSystem,
      taskPrompt: prompt,
      maxIterations: 3, // Prevents infinite loops and saves API costs
    });

    console.log("🏁 Pipeline Complete. Outputting finalized scope.");

    // 3. Return the validated JSON to the frontend
    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error("Agency API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
