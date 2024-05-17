import { uploadImageFile } from "@/components/files/helperFunctions/imageHelpers/imageFunctions";
import { uploadTextFile } from '@/components/files/helperFunctions/textHelpers/textFileHelpers'

// Create an accepted file types array to check if the file type is valid
// Accepted types are png, jpeg, gif, webp, docx, text and pdf
export const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'txt/plain', 'application/pdf', 'text/plain'];

export async function fileHandler(file: File, threadId: string) {
  let finalThreadId = '';
  // Check if the file type is valid
  if (!acceptedFileTypes.includes(file.type)) {
    return new Response('Invalid file type', { status: 400 });
  }
  // Check if the file is an image file
  if (file.type.includes('image')) {
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    const imageFileResponse = await fetch('/api/uploadImageFile', {
      method: 'POST',
      body: imageFormData,
    }).then((response) => response.json())
    const fileId = imageFileResponse.fileId;
  
    const response = await fetch('/api/addImageFileMessage', {
      method: 'POST',
      body: JSON.stringify({ fileId, threadId }),
    }).then((response) => response.json())

    console.log(`Response from addImageFileMessage: ${response.finalThreadId}`)

    finalThreadId = response.finalThreadId

  } else {
    // Check if the file is a text file
    const formData = new FormData();
    formData.append('file', file);
    const fileResponse = await fetch('/api/uploadTextFile', {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
    const fileId = fileResponse.fileId;

    const response = await fetch('/api/addTextFileMessage', {
      method: 'POST',
      body: JSON.stringify({ fileId, threadId }),
    }).then((response) => response.json())

    console.log(`Response from addTextFileMessage: ${response.finalThreadId}`)

    finalThreadId = response.finalThreadId
  }

  console.log(`Final thread id: ${finalThreadId} generated from file: ${file.name}`);
  return finalThreadId;
}

export async function createThread() {
  const response = await fetch('/api/createThreadId', {
    method: 'POST',
  })


  const threadId = await response.json()

  console.log(`Returned thread id: ${threadId.threadId}`)

  return threadId.threadId
}