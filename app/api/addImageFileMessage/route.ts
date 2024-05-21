import { OpenAI } from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  timeout: 60000,
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Get the file from the request
  const input = await req.json();

  const fileId = input.fileId;
  const threadId = input.threadId;

  const threadMessages = await openai.beta.threads.messages.create(
    threadId,
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Can you look at this image?  Please respond according to the context of the image.  For example, if the
            image is of a chocolate chip cookie recipe, you could say, "Wow!  These cookies look amazing! What questions can I answer for you about this recipe? -- 
            This is just an example.  Please adjust your response as needed for the context.`
          },
          {
            type: "image_file",
            image_file: {
              file_id: fileId,
              detail: "auto"
            }
          }
        ]
      }
    );

  console.log(`Created message from image file: ${threadMessages.id} with file id ${fileId} in thread ${threadId}`);

  return new Response(JSON.stringify({ finalThreadId: threadMessages.thread_id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}