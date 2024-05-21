export async function generateAudio(text: string) {
  let url = '';
  console.log(`Generating audio for text: ${text}`)
  const response = await fetch('api/generateAudio', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
      })
  const data = await response.json();
  url = data.speech;
  console.log(`Generated audio for text: ${text} at URL: ${url}`)

  return `data:audio/mp3;base64,${url}`;
}