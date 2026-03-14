import { GenerativeUIRenderer } from "@craft/gen-ui";

export default function GenerativeUIPage() {
  return (
    <main className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Generative UI Sandbox
          </h1>
          <p className="text-lg text-gray-500">
            Ask the AI to build a component. It will strictly use the <code className="bg-gray-100 px-1 rounded">@craft/ui-system</code> definitions compiled in the AST context builder.
          </p>
        </div>

        {/* Drop in our pre-built magic component */}
        <GenerativeUIRenderer />

      </div>
    </main>
  );
}
