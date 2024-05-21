import { OpenAI } from 'openai';
import { toFile } from 'openai';

export const dynamic = 'force-dynamic';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  timeout: 60000,
});

export async function POST(req: Request) {
  
  // Get the file from the request
  const input = await req.json();
  // Parse the request body
  const imageURL = input.imageURL;
  console.log(`Image file URL: ${imageURL}`)
  // Create a readable stream from the file
  const image = await fetch(imageURL);

  // Upload the file to OpenAI
  const file = await openai.files.create({
    // @ts-ignore
    purpose: 'vision',
    file: await toFile(image),
  });
  

  const fileId = file.id;

  console.log(`Image file uploaded: ${file.id} to OpenAI... sending back to client...`)

  return new Response (JSON.stringify({ fileId: fileId }), {
    headers: { 'Content-Type': 'application/json' },
  });
}