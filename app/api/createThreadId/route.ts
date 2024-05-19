import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  timeout: 60000,
});

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  // Parse the request body
  console.log(`Received request ${req} with method ${req.method}`);

  const emptyThread = await openai.beta.threads.create({
    tool_resources: {
      file_search: {
        vector_store_ids: ["vs_o4ST10Be0rwiCr6Zx0f7wzHS"]
      },
    },
  });

  console.log(emptyThread);

  return new Response(JSON.stringify({ threadId: emptyThread.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
