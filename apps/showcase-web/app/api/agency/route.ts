import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { 
  runMakerCheckerLoop, 
  FunctionalScopeSchema,
  loadProjectState,
  saveProjectState,
  ProjectState
} from "@craft/agency-core";

export async function POST(req: Request) {
  try {
    const { projectId, prompt } = await req.json();

    if (!projectId || !prompt) {
      return NextResponse.json({ error: "Project ID and prompt are required" }, { status: 400 });
    }

    console.log(`🚀 Starting Agency Pipeline for project: ${projectId}`);

    // 1. Load the existing project state, or initialize a new one
    let state: ProjectState = loadProjectState(projectId) || {
      status: "idle",
      scope: null,
      tech: null,
      brand: null,
      design: null,
      marketing: null,
    };

    // 2. Load the Agent Brains (System Prompts)
    const baPath = path.resolve(process.cwd(), "../../skills/agents/01-business-analyst.md");
    const poPath = path.resolve(process.cwd(), "../../skills/agents/02-product-owner.md");

    const baSystem = fs.readFileSync(baPath, "utf-8");
    const poSystem = fs.readFileSync(poPath, "utf-8");

    // 3. Phase 1: Scoping
    // We only run the scoping agents if the project is brand new or actively being scoped
    if (state.status === "idle" || state.status === "scoping") {
      state.status = "scoping";
      saveProjectState(projectId, state); // Lock in the status change

      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"),
        schema: FunctionalScopeSchema,
        makerSystem: baSystem,
        checkerSystem: poSystem,
        taskPrompt: prompt,
        maxIterations: 3, 
      });

      // Update the state with the finalized, approved scope
      state.scope = result;
      state.status = "branding"; // Successfully move the project to the next department!
      saveProjectState(projectId, state);

      console.log(`🏁 Scoping Complete. Project [${projectId}] saved to memory.`);
      return NextResponse.json({ success: true, data: state });
    }

    // If the project is past the scoping phase, we return the state as-is for now
    return NextResponse.json({ 
      success: true, 
      data: state, 
      message: "Project is already past the scoping phase." 
    });

  } catch (error: any) {
    console.error("Agency API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
