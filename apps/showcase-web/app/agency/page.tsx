"use client";

import React, { useState } from "react";
import { Button, Card, TextInput } from "@craft/ui-system";

export default function AgencyPortalPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/agency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Agency Client Portal (War Room)
          </h1>
          <p className="text-lg text-gray-500">
            Phase 1: Product Scoping. Describe your business idea below. The Business Analyst and Product Owner agents will debate the requirements until they achieve a flawless Functional Scope.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <TextInput 
              className="flex-1"
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              placeholder="e.g., I want to build a platform that connects freelance chefs with local restaurants..." 
              disabled={isLoading}
            />
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? "Agents Working..." : "Start Scoping"}
            </Button>
          </form>
        </Card>

        {result && result.data && (
          <Card className="bg-gray-900 text-gray-100 overflow-hidden border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Final Approved Scope</h3>
              <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">Passed QA Review</span>
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
