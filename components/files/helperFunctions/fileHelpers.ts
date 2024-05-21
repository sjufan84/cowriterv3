export async function uploadTextFile(file: File): Promise<string> {
  console.log(`Uploading file: ${file.name} with type ${file.type}`)
  const formData = new FormData();
  formData.append('file', file);
  const fileResponse = await fetch('/api/uploadTextFile', {
    method: 'POST',
    body: formData,
  });
  const data = await fileResponse.json();
  const fileId = data.fileId;
  console.log(`Uploaded file: ${fileId} with purpose assistants to vector store from ${file.name}`)
  return fileId;
}

export const acceptedFileTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'txt/plain', 'application/pdf', 'text/plain'];

export async function createThreadId(): Promise<string> {
  const response = await fetch('/api/createThreadId', {
    method: 'POST',
  });
  const data = await response.json();
  return data.threadId;
}