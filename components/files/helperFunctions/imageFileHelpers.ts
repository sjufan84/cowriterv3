// Create a function that takes in an image file and then returns it
// as a base64 string that can then be used in an img tag
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(url: string) {
  const imageFileResponse = await fetch('/api/uploadImageFile', {
    method: 'POST',
    body: JSON.stringify({
      imageURL: url,
    }),
  }).then((response) => response.json())
  const imageFileId = imageFileResponse.fileId;
  console.log(`Image file uploaded: ${imageFileId}... sending back to client...`)
  return imageFileId;
}


export async function createImageFileMessage(fileId: string, threadId: string) {
  let returnedThreadId = '';
  const imageMessage = await fetch('/api/addImageFileMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileId,
      threadId,
    }),
  }).then((response) => response.json())
  returnedThreadId = imageMessage.finalThreadId;
  console.log(`Returned thread id: ${returnedThreadId} from image file message`)
  return returnedThreadId;
}