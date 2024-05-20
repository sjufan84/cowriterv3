
interface MusicGenProps {
  inputs: string;
}
export async function createMusic(inputs: MusicGenProps) {
  const huggingfaceToken = process.env.HUGGINGFACE_TOKEN;
  const data = {
    inputs: inputs.inputs,
  };
  console.log(`Calling musicGen API with inputs: ${inputs}`)
  
  let response;
  do {
    response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-medium",
      {
        headers: { Authorization: `Bearer ${huggingfaceToken}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  } while (response.status === 503);
  
  return response.json();
}