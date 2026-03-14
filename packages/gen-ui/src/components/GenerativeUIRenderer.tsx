"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { LiveProvider, LiveError, LivePreview } from "react-live";

// 1. Import OUR exact design system components
import { Button } from "@craft/ui-system";
// TODO: import { Card, Badge, TextInput } from "@craft/ui-system";
import { Loader2 } from "lucide-react";

// 2. Define the exact sandbox scope the AI is allowed to use
const uiScope = {
  React,
  Button,
  // Card,
  // Badge,
  // TextInput,
};

export function GenerativeUIRenderer() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/generate-ui", // This calls our server action above
  });

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto p-8">
      
      {/* 3. The Chat UI */}
      <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Replaced TextInput with a standard HTML input for now */}
        <input 
          className="flex-1 border rounded-md px-3 py-2"
          value={input} 
          onChange={handleInputChange} 
          placeholder="e.g., Build me a pricing card with a solid primary button..." 
        />
        <Button type="submit" isLoading={isLoading}>Generate UI</Button>
      </form>

      {/* 4. The Live Rendering Engine */}
      <div className="border border-gray-200 rounded-xl p-8 bg-gray-50">
        {messages.map((message) => (
          message.role === "assistant" && (
            <div key={message.id} className="mt-4">
              
              {/* Here is the magic. We pass the AI's string into the LiveProvider */}
              <LiveProvider code={message.content} scope={uiScope}>
                
                {/* LivePreview renders the actual components visually! */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <LivePreview />
                </div>

                {/* If the AI hallucinates a prop, it safely catches the error here */}
                <div className="text-red-500 text-sm mt-2 font-mono">
                  <LiveError />
                </div>

              </LiveProvider>

            </div>
          )
        ))}
        {isLoading && <Loader2 className="animate-spin text-gray-400 mx-auto" />}
      </div>
    </div>
  );
}
