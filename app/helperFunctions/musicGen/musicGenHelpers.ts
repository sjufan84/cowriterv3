
interface MusicGenProps {
  inputs: string;
}
export async function createMusic(inputs: MusicGenProps) {

  const response = await fetch('http://127.0.0.1:8000/get_musicgen', {
        // Send the request as a POST request where the inputs are the inputs
        method: 'POST',
        body: JSON.stringify(inputs)
    });
    let data = await response.json();
    const audioString = data.music

    console.log(`Music generated: ${audioString.slice(0, 100)}`)
    
    const audioBase64 = 'data:audio/wav;base64,' + audioString;
    
    return { audioBase64 };
}

export async function createMusicTest(inputs: MusicGenProps) {
  return (console.log(`Calling musicGen API with inputs: ${inputs}`));
}