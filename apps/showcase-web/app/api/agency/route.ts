import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { 
  runMakerCheckerLoop, 
  FunctionalScopeSchema,
  TechnicalSpecSchema,
  BrandIdentitySchema,
  MarketingPlanSchema,
  CopywritingSchema,
  loadProjectState,
  saveProjectState,
  ProjectState
} from "@craft/agency-core";

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

    let state: ProjectState = loadProjectState(projectId) || {
      status: "idle", scope: null, tech: null, brand: null, design: null, marketing: null, copy: null
    };

    // PHASE 1: Scoping
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

    // PHASE 2: Technical Architecture
    if (!state.tech) {
      console.log("-> Entering Phase 2: Technical Architecture");
      const taskPrompt = `CLIENT IDEA: ${prompt}\n\nAPPROVED SCOPE:\n${JSON.stringify(state.scope, null, 2)}\n\nDraft the technical specifications.`;
      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"), schema: TechnicalSpecSchema, makerSystem: getAgentBrain("03-cto.md"), checkerSystem: getAgentBrain("04-technical-reviewer.md"), taskPrompt, maxIterations: 3, throwOnMaxIterations: true,
      });

      state.tech = result.output;
      saveProjectState(projectId, state);
      return NextResponse.json({ success: true, message: "Technical Specs Approved.", data: state, trace: result.trace });
    }

    // PHASE 3: Brand Strategy
    if (!state.brand) {
      console.log("-> Entering Phase 3: Brand Identity");
      const taskPrompt = `CLIENT IDEA: ${prompt}\n\nAPPROVED SCOPE:\n${JSON.stringify(state.scope, null, 2)}\n\nDraft the brand identity.`;
      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"), schema: BrandIdentitySchema, makerSystem: getAgentBrain("05-brand-strategist.md"), checkerSystem: getAgentBrain("06-creative-director.md"), taskPrompt, maxIterations: 3, throwOnMaxIterations: true,
      });

      state.brand = result.output;
      state.status = "branding";
      saveProjectState(projectId, state);
      return NextResponse.json({ success: true, message: "Brand Identity Approved.", data: state, trace: result.trace });
    }

    // PHASE 4: Marketing Strategy
    if (!state.marketing) {
      console.log("-> Entering Phase 4: Marketing Strategy");
      const taskPrompt = `APPROVED SCOPE:\n${JSON.stringify(state.scope, null, 2)}\n\nBRAND IDENTITY:\n${JSON.stringify(state.brand, null, 2)}\n\nDraft the marketing plan.`;
      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"), schema: MarketingPlanSchema, makerSystem: getAgentBrain("07-marketing-director.md"), checkerSystem: getAgentBrain("08-marketing-reviewer.md"), taskPrompt, maxIterations: 3, throwOnMaxIterations: true,
      });

      state.marketing = result.output;
      state.status = "marketing";
      saveProjectState(projectId, state);
      return NextResponse.json({ success: true, message: "Marketing Plan Approved.", data: state, trace: result.trace });
    }

    // PHASE 5: Copywriting
    if (!state.copy) {
      console.log("-> Entering Phase 5: Copywriting");
      const taskPrompt = `SCOPE:\n${JSON.stringify(state.scope, null, 2)}\n\nBRAND IDENTITY:\n${JSON.stringify(state.brand, null, 2)}\n\nMARKETING PLAN:\n${JSON.stringify(state.marketing, null, 2)}\n\nDraft the copy adhering strictly to the brand tone and avoiding forbidden words.`;
      const result = await runMakerCheckerLoop({
        model: openai("gpt-4o"), schema: CopywritingSchema, makerSystem: getAgentBrain("09-copywriter.md"), checkerSystem: getAgentBrain("10-copy-editor.md"), taskPrompt, maxIterations: 3, throwOnMaxIterations: true,
      });

      state.copy = result.output;
      saveProjectState(projectId, state);
      return NextResponse.json({ success: true, message: "Copywriting Approved.", data: state, trace: result.trace });
    }

    return NextResponse.json({ success: true, data: state, message: "Project is fully up to date." });

  } catch (error: any) {
    console.error("Agency API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
