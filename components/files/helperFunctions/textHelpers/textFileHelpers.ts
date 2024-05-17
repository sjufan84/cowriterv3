export async function uploadTextFile(textFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', textFile);
  const response = await fetch('/api/uploadTextFile', {
    method: 'POST',
    body: formData,
  });
  const file = await response.json();
  return file.fileId;
}