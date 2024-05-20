import { OpenAI } from 'openai';
import { toFile } from 'openai';


export const dynamic = 'force-dynamic';


// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  timeout: 60000,
});

export async function POST(req: Request) {
  const input = await req.json();
  const threadId = input.threadId;


  const threadMessages = await openai.beta.threads.messages.create(
    threadId,
    { role: "user", content: `I've just submitted some vocals that you've sang back to me in your voice.  You could respond with something like,
    'How does that sound?  Let me know what you think! -- That's just an example, adapt according to the context of our conversation.'`
    }
  );

  console.log(`Submitted clone vocals message to thread: ${threadId} with message: ${threadMessages.id}`);

  return new Response (JSON.stringify({ threadMessagesId: threadMessages.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}