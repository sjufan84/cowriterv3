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
  const THREAD_ID = input.get('threadId') as string;

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

  const threadMessages = await openai.beta.threads.messages.create(
    THREAD_ID,
    { 
      role: "user", 
      content: `I've just uploaded a file for you to take a look at.  This may be lyrics, notes, or some other text related to our co-writing session.
        Please look it over and then respond accordingly.`,
      attachments: [{ file_id: vectorFileId, tools: [{ type: 'file_search'}] }]
    }
  );

  console.log(`Uploaded file: ${file.id} to thread ${THREAD_ID} with purpose assistants from ${uploadedFile.name}.  Message: ${threadMessages.id} then added.`)


  return new Response (JSON.stringify({ fileId: vectorFileId, threadId: threadMessages.thread_id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}