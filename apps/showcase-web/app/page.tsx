import { Button } from "@craft/ui-system";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">Modern Web Craft</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          A production-grade monorepo showcasing advanced frontend architecture and generative UI.
        </p>
      </div>

      <div className="flex items-center gap-4 border p-8 rounded-xl shadow-sm bg-gray-50/50">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            @craft/ui-system
          </h2>
          <div className="flex gap-4">
            {/* Using our local package! */}
            <Button variant="default">Primary Action</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="ghost">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Magic
            </Button>
          </div>
        </div>
      </div>

    </main>
  );
}
