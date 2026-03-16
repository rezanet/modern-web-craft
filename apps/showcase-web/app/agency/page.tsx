"use client";

import React, { useState } from "react";
import { Button, Card, TextInput } from "@craft/ui-system";

export default function AgencyPortalPage() {
  const [projectId, setProjectId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !prompt) {
      alert("Please provide both a Project ID and a Brief.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/agency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, prompt }),
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Agents Working (Check Terminal Logs)...";
    if (result && result.data) {
      if (!result.data.scope) return "1. Run Business Scoping";
      if (!result.data.tech) return "2. Run Technical Architecture";
      if (!result.data.brand) return "3. Run Brand Strategy";
      return "Pipeline Complete (For Now)";
    }
    return "Start Agency Pipeline";
  };

  return (
    <main className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Agency Client Portal (War Room)
          </h1>
          <p className="text-lg text-gray-500">
            The agency works in phases. Hitting the button below will trigger the next missing phase in the project state.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                <TextInput 
                  value={projectId} 
                  onChange={(e) => setProjectId(e.target.value.toLowerCase().replace(/\s+/g, '-'))} 
                  placeholder="e.g., project-alpha" 
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Brief</label>
                <TextInput 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)} 
                  placeholder="e.g., I want to build a platform for freelance chefs..." 
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button type="submit" isLoading={isLoading} className="w-full">
              {getButtonText()}
            </Button>

            {result?.message && (
              <p className="text-sm text-center text-green-600 font-medium">{result.message}</p>
            )}
          </form>
        </Card>

        {result && result.data && (
          <Card className="bg-gray-900 text-gray-100 overflow-hidden border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Project State: <span className="text-blue-400">{projectId}</span>
              </h3>
            </div>
            <pre className="text-sm p-4 overflow-x-auto text-green-400 font-mono">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </Card>
        )}

      </div>
    </main>
  );
}
