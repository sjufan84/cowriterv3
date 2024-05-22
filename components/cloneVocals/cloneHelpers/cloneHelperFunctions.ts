import { FFmpeg } from '@ffmpeg/ffmpeg';

async function convertWebmToWav(webmBlob: Blob): Promise<Blob> {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const inputName = 'input.webm';
  const outputName = 'output.wav';

  const data = await webmBlob.arrayBuffer();

  ffmpeg.writeFile(inputName, new Uint8Array(data));

  await ffmpeg.exec(['-i', inputName, outputName]);

  const outputData = await ffmpeg.readFile(outputName);
  const outputBlob = new Blob([outputData], { type: 'audio/wav' });

  return outputBlob;
}

async function convertStringToBlob(base64String: string, type: string): Promise<Blob> {
  const byteCharacters = Buffer.from(base64String, 'base64').toString('binary');
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  console.log(`Byte array length: ${byteArray.length}`)
  return new Blob([byteArray], { type: type });
}


export async function cloneVocals(blob: Blob) {
    if (!blob) {
        alert('Please record audio first')
        return
    }
    console.log(`Blob type: ${blob.type}`)

    let file;
    
    try {
        let newBlob = await convertWebmToWav(blob);
        file = new File([newBlob], 'audio.wav', { type: 'audio/wav' });
        console.log(`File type: ${file.type} of size ${file.size} and name ${file.name} created.`)
    } catch (error) {
        console.error('Error converting webm to wav:', error)
        return error;
    }

    const formData = new FormData();
    formData.append('audio_file', file);
    // formData.append('artist', artist);
    // formData.append('f0_adjustment', f0Adjustment.toString());
    // console.log(`Calling clone vocals API with artist: ${artist} and f0_adjustment: ${f0Adjustment} and audio file: ${file} of size ${file.size} and type ${file.type} and name ${file.name}`)
    console.log(`Calling clone vocals API with audio file: ${file} of size ${file.size} and type ${file.type} and name ${file.name}`)

    const transcriptionResponse = await fetch('/api/getSpeechToText', {
        // Send the request as a POST request where the audio_file is the file
        method: 'POST',
        body: formData
    });
    let transcriptionData = await transcriptionResponse.json();
    console.log('Transcription:', transcriptionData)
    const transcriptionText = transcriptionData.transcription;
    
    const response = await fetch('https://linercuda-7x7kgyhzra-uc.a.run.app/clone_vocals', {
        // Send the request as a POST request where the audio_file is the file
        method: 'POST',
        body: formData
    });

    let data = await response.json();
    const audioString = data.cloned_vocals;

    console.log(`Cloned vocals received: ${audioString.slice(0, 100)}`)
    
    const audioBase64 = 'data:audio/wav;base64,' + audioString;
    
    return { audioBase64, transcriptionText };
}

export async function cloneVocalsFromFile(file: File, artist: string, f0Adjustment: number) {
    if (!file) {
        alert('Please record audio first')
        return
    }
    console.log(`File type: ${file.type} of size ${file.size} and name ${file.name}`)

    const formData = new FormData();
    formData.append('audio_file', file);
    formData.append('artist', artist);
    formData.append('f0_adjustment', f0Adjustment.toString());
    console.log(`Calling clone vocals API with artist: ${artist} and f0_adjustment: ${f0Adjustment} and audio file: ${file} of size ${file.size} and type ${file.type} and name ${file.name}`)

    const response = await fetch('https://linercuda-7x7kgyhzra-uc.a.run.app/clone_vocals', {
        // Send the request as a POST request where the audio_file is the file
        method: 'POST',
        body: formData
    });

    let data = await response.json();
    console.log('Response:', data)
    const audioString = data.cloned_vocals;

    console.log(`Cloned vocals received: ${audioString.slice(0, 100)}`)
    return audioString;
}

export async function convertAudioFileToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result as string);
        }
        reader.onerror = reject;
    });
}