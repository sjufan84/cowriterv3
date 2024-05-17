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

export async function uploadImageFile(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', imageFile);
  const response = await fetch('/api/uploadImageFile', {
    method: 'POST',
    body: formData,
  });
  const file = await response.json();
  return file.fileId;
}