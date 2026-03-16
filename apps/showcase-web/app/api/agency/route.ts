import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { 
  runMakerCheckerLoop, 
  FunctionalScopeSchema,
  TechnicalSpecSchema,
  BrandIdentitySchema,
  loadProjectState,
  saveProjectState,
  ProjectState
} from "@craft/agency-core";

// Helper to easily grab the markdown brains
function getAgentBrain(filename: string) {
  const filePath = path.resolve(process.cwd(), `../../skills/agents/${filename}`);
  return fs.readFileSync(filePath, "utf-8");
}

export async function POST(req: Request) {
  try {
    const { projectId, prompt } = await req.json();

    if (!projectId || !prompt) {
      return NextResponse.json({ error: "Project ID and prompt are required" }, { status: 400 });
    }

    console.log(`\n🚀 AGENCY PIPELINE ACTIVATED FOR: ${projectId}`);

    // Load state from memory
    let state: ProjectState = loadProjectState(projectId) || {
      status: "idle", scope: null, tech: null, brand: null, design: null, marketing: null,
    };

    // ==========================================
    // PHASE 1: BUSINESS SCOPING (BA & PO)
    // ==========================================
    if (!state.scope) {
      console.log("-> Entering Phase 1: Scoping");
      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"),
        schema: FunctionalScopeSchema,
        makerSystem: getAgentBrain("01-business-analyst.md"),
        checkerSystem: getAgentBrain("02-product-owner.md"),
        taskPrompt: prompt,
        maxIterations: 3,
        throwOnMaxIterations: true,
      });

      state.scope = result.output;
      state.status = "scoping";
      saveProjectState(projectId, state);
      return NextResponse.json({ success: true, message: "Functional Scope Approved.", data: state, trace: result.trace });
    }

    // ==========================================
    // PHASE 2: TECHNICAL ARCHITECTURE (CTO & VPE)
    // ==========================================
    if (!state.tech) {
      console.log("-> Entering Phase 2: Technical Architecture");
      // Notice how we feed the APPROVED scope into the CTO's prompt!
      const taskPrompt = `CLIENT IDEA: ${prompt}\n\nAPPROVED FUNCTIONAL SCOPE:\n${JSON.stringify(state.scope, null, 2)}\n\nDraft the technical specifications to support this scope.`;

      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"),
        schema: TechnicalSpecSchema,
        makerSystem: getAgentBrain("03-cto.md"),
        checkerSystem: getAgentBrain("04-technical-reviewer.md"),
        taskPrompt,
        maxIterations: 3,
        throwOnMaxIterations: true,
      });

      state.tech = result.output;
      saveProjectState(projectId, state);
      return NextResponse.json({ success: true, message: "Technical Specs Approved.", data: state, trace: result.trace });
    }

    // ==========================================
    // PHASE 3: BRAND STRATEGY (Strategist & CD)
    // ==========================================
    if (!state.brand) {
      console.log("-> Entering Phase 3: Brand Identity");
      const taskPrompt = `CLIENT IDEA: ${prompt}\n\nAPPROVED FUNCTIONAL SCOPE:\n${JSON.stringify(state.scope, null, 2)}\n\nDraft the psychological brand identity for this audience.`;

      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"),
        schema: BrandIdentitySchema,
        makerSystem: getAgentBrain("05-brand-strategist.md"),
        checkerSystem: getAgentBrain("06-creative-director.md"),
        taskPrompt,
        maxIterations: 3,
        throwOnMaxIterations: true,
      });

      state.brand = result.output;
      state.status = "branding"; // Move to branding phase
      saveProjectState(projectId, state);
      return NextResponse.json({ success: true, message: "Brand Identity Approved.", data: state, trace: result.trace });
    }

    // Pipeline caught up
    return NextResponse.json({ success: true, data: state, message: "Project is fully up to date." });

  } catch (error: any) {
    console.error("Agency API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
