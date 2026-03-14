import { Project, Symbol, Type } from "ts-morph";
import fs from "fs";
import path from "path";

// 1. Define paths
const UI_SYSTEM_GLOB = path.resolve(__dirname, "../../../packages/ui-system/src/components/**/*.tsx");
const OUTPUT_PATH = path.resolve(__dirname, "../../../packages/gen-ui/src/system-prompt.txt");

// 2. Initialize the TypeScript Project AST parser
const project = new Project();
project.addSourceFilesAtPaths(UI_SYSTEM_GLOB);

console.log("🧠 Compiling UI Context for LLM...");

// 3. Define the strict Base Prompt
let systemPrompt = `You are an expert Generative UI Assistant building interfaces for Modern Web Craft.
You MUST output strictly typed, accessible React code using ONLY the components provided below.
DO NOT use native HTML elements like <button>, <input>, or <h1>. Use our design system equivalents.
Do not hallucinate props. If a prop is not listed below, it does not exist.

=== @CRAFT/UI-SYSTEM API REFERENCE ===\n\n`;

// 4. Extract data from each component file
const sourceFiles = project.getSourceFiles();

sourceFiles.forEach((file) => {
  const fileName = file.getBaseNameWithoutExtension();
  
  // Look for the Props interface (e.g., ButtonProps)
  const propsInterface = file.getInterface(`${fileName}Props`);
  
  if (propsInterface) {
    systemPrompt += `Component: <${fileName} />\n`;
    
    // Extract JSDoc description if it exists
    const docs = propsInterface.getJsDocs().map(doc => doc.getDescription().trim()).join("\n");
    if (docs) systemPrompt += `Description: ${docs}\n`;

    systemPrompt += `Props:\n`;

    // Loop through every prop in the interface
    propsInterface.getProperties().forEach((prop) => {
      const propName = prop.getName();
      const propType = prop.getType().getText();
      const isOptional = prop.hasQuestionToken() ? "Optional" : "Required";
      
      // Extract specific JSDoc for the prop
      const propDocs = prop.getJsDocs()[0]?.getDescription().trim() || "";

      systemPrompt += `  - ${propName} (${propType}) [${isOptional}] ${propDocs ? `- ${propDocs}` : ""}\n`;
    });

    systemPrompt += `\n`; // Add spacing between components
  }
});

// 5. Add strict behavioral guardrails
systemPrompt += `=== END API REFERENCE ===

Rules for Generation:
1. Always import components from "@craft/ui-system".
2. Ensure high-contrast and accessibility standards.
3. If an icon is needed, import from "lucide-react".
4. Output ONLY valid React code. Do not wrap the code in markdown blocks like \`\`\`jsx.`;

// 6. Write the file to the gen-ui package
fs.writeFileSync(OUTPUT_PATH, systemPrompt, "utf-8");

console.log(`✅ System prompt generated successfully at: ${OUTPUT_PATH}`);
