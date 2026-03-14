import { askAIForComponent } from "@craft/gen-ui";

// Next.js App Router POST handler
export async function POST(req: Request) {
  try {
    // Extract the messages array from the client request
    const { messages } = await req.json();
    
    // Grab the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // Call our abstracted Gen-UI server logic
    const stream = await askAIForComponent(latestMessage);
    
    // Return the readable stream to the client
    return stream;
    
  } catch (error) {
    console.error("Generative UI Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate UI" }), { 
      status: 500 
    });
  }
}
