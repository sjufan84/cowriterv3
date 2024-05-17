import { OpenAI } from 'openai';
import { toFile } from 'openai';


export const dynamic = 'force-dynamic';


// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  timeout: 60000,
});

export async function POST(req: Request) {
  const input = await req.formData();
  const uploadedFile = input.get('file') as File;

  // Create a blob from the file
  const blob = await new Blob([uploadedFile], { type: uploadedFile.type[0] });

  console.log(`Uploading file: ${uploadedFile.name} with type ${uploadedFile.type}`)

  // Upload the file to OpenAI
  const file = await openai.files.create({
    purpose: 'assistants',
    file: await toFile(blob, uploadedFile.name), 
  });

  console.log(`Uploaded file: ${file.id} with purpose assistants from ${uploadedFile.name}`)

  const vectorFileId = await openai.beta.vectorStores.files.createAndPoll(
    "vs_o4ST10Be0rwiCr6Zx0f7wzHS",
    { file_id: file.id }
  ).then((file) => file.id);

  console.log(`Uploaded file: ${file.id} to vector store ${vectorFileId}`)

  return new Response (JSON.stringify({ fileId: vectorFileId }), {
    headers: { 'Content-Type': 'application/json' },
  });
}