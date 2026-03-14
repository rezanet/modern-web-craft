import { defineConfig } from "tsup";

export default defineConfig({
  // The entry point for the entire library
  entry: ["src/index.ts"], 
  
  // Output both CommonJS (Node) and ECMAScript Modules (Modern Bundlers)
  format: ["cjs", "esm"], 
  
  // Automatically generate TypeScript declaration files (.d.ts)
  dts: true, 
  
  // Enable code splitting for better tree-shaking in the consumer app
  splitting: true, 
  
  // Generate sourcemaps for easier debugging in the host application
  sourcemap: true, 
  
  // Clean the `dist` folder before every build
  clean: true, 
  
  // Minify the code for production performance
  minify: true, 
  
  // NEVER bundle React. The host application must provide it.
  external: ["react", "react-dom"], 
  
  // Advanced: Next.js App Router Compatibility
  esbuildOptions(options) {
    // UI components are inherently client-side because they use context, 
    // event listeners (onClick), or refs. This banner ensures the 
    // "use client" directive survives the bundling process.
    options.banner = {
      js: '"use client";',
    };
  },
});
