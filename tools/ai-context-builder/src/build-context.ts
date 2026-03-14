import { Project } from "ts-morph";
import fs from "fs";
import path from "path";

// 1. Define paths (relative to where this script lives in the monorepo)
const UI_SYSTEM_GLOB = path.resolve(__dirname, "../../../packages/ui-system/src/components/**/*.tsx");
const OUTPUT_PATH = path.resolve(__dirname, "../../../packages/gen-ui/src/system-prompt.md");

// 2. Initialize the TypeScript Project AST parser
const project = new Project();
project.addSourceFilesAtPaths(UI_SYSTEM_GLOB);

console.log("🧠 Compiling UI Context for LLM...");

// 3. Define the Markdown Base Prompt and Guardrails
let systemPrompt = `# Generative UI System Instructions

You are an expert Generative UI Assistant building interfaces for Modern Web Craft.
You MUST output strictly typed, accessible React code using ONLY the components provided below.

**CRITICAL RULES:**
* DO NOT use native HTML elements like \`<button>\`, \`<input>\`, or \`<h1>\`. Use our design system equivalents.
* Do not hallucinate props. If a prop is not listed below, it does not exist.
* Always import components from \`"@craft/ui-system"\`.
* Ensure high-contrast and accessibility standards.
* If an icon is needed, import from \`"lucide-react"\`.

---

## 📚 @CRAFT/UI-SYSTEM API REFERENCE

`;

// 4. Extract data from each component file
const sourceFiles = project.getSourceFiles();

sourceFiles.forEach((file) => {
  const fileName = file.getBaseNameWithoutExtension();
  
  // Look for the Props interface (e.g., ButtonProps)
  const propsInterface = file.getInterface(`${fileName}Props`);
  
  if (propsInterface) {
    // Markdown Heading 3 for the component name
    systemPrompt += `### \`<${fileName} />\`\n\n`;
    
    // Extract JSDoc description if it exists
    const docs = propsInterface.getJsDocs().map(doc => doc.getDescription().trim()).join("\n");
    if (docs) {
      // Markdown Blockquote for the component description
      systemPrompt += `> ${docs}\n\n`;
    }

    systemPrompt += `**Props:**\n\n`;

    // Loop through every prop in the interface
    propsInterface.getProperties().forEach((prop) => {
      const propName = prop.getName();
      const propType = prop.getType().getText();
      const isOptional = prop.hasQuestionToken() ? "Optional" : "Required";
      
      // Extract specific JSDoc for the prop
      const propDocs = prop.getJsDocs()[0]?.getDescription().trim() || "";

      // Markdown bullet list with inline code styles and bolding
      systemPrompt += `* \`${propName}\` (\`${propType}\`) [**${isOptional}**] ${propDocs ? `- ${propDocs}` : ""}\n`;
    });

    // Markdown divider between components
    systemPrompt += `\n---\n\n`; 
  }
});

// 5. Ensure the output directory exists before writing
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 6. Write the Markdown file to the gen-ui package
fs.writeFileSync(OUTPUT_PATH, systemPrompt, "utf-8");

console.log(`✅ System prompt generated successfully at: ${OUTPUT_PATH}`);
