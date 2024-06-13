import { FFmpeg } from '@ffmpeg/ffmpeg';

export async function convertBlobToString(blob: Blob): Promise<string> {
  // Convert audio blob to base64 encoded string
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const audioString = base64data.split(',')[1];
      resolve(audioString);
    }
  });
}

export async function convertStringToBlob(audioString: string): Promise<Blob> {
  const binaryString = atob(audioString);
  const arrayBuffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    arrayBuffer[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
  return blob;
}

export async function convertWavToOGG(audioBlob: Blob): Promise<Blob> {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const inputName = 'input.wav';
  const outputName = 'output.ogg';

  const data = await audioBlob.arrayBuffer();

  ffmpeg.writeFile(inputName, new Uint8Array(data));

  await ffmpeg.exec(['-i', inputName, outputName]);

  const outputData = await ffmpeg.readFile(outputName);
  const outputBlob = new Blob([outputData], { type: 'audio/ogg' });

  return outputBlob;
}