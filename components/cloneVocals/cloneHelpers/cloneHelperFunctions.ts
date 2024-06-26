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
    
    const response = await fetch('http://localhost:8000/clone_vocals', {
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

export async function testCloneVocalsStream(blob: Blob) {
    if (!blob) {
        alert('Please record audio first')
        return
    }
    let fileToSend: File;
    
    try {
        let newBlob = await convertWebmToWav(blob);
        fileToSend = new File([newBlob], 'audio.wav', { type: 'audio/wav' });
        console.log(`File type: ${fileToSend.type} of size ${fileToSend.size} and name ${fileToSend.name} created.`)
    } catch (error) {
        console.error('Error converting webm to wav:', error)
        return error;
    }
    const formData = new FormData();
    formData.append('audio_file', fileToSend);
    let returnedAudioBlob: Blob | null = null;

    const transcriptionResponse = await fetch('/api/getSpeechToText', {
      // Send the request as a POST request where the audio_file is the file
      method: 'POST',
      body: formData
    });
    let transcriptionData = await transcriptionResponse.json();
    console.log('Transcription:', transcriptionData)
    const transcriptionText = transcriptionData.transcription;
    let audioString = '';
    const response = await fetch('http://localhost:8000/clone_vocals', {
        // Send the request as a POST request where the audio_file is the file
        method: 'POST',
        body: formData
    }).then(response => response.blob())
    .then(blob => {
        returnedAudioBlob = blob;
        return blob.arrayBuffer();
    }).then(buffer => { 
        audioString = Buffer.from(buffer).toString('base64');
        console.log(`Cloned vocals received: ${audioString.slice(0, 100)}`)
        return 'data:audio/wav;base64,' + audioString;
    });
    
    return { audioString, transcriptionText };
}
