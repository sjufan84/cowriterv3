// Clone vocals route
import { SageMakerRuntime, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

const sagemakerRuntime = new SageMakerRuntime(
  { region: "us-east-1" });
  
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const input = await req.json();
  const f0upKey: number = input.f0upKey ? input.f0upKey : 0;  // F0up key
  const audioURL = input.audioURL;  // Base64 encoded audio string
  
  console.log(`Received f0up key: ${f0upKey} and audio string: ${audioURL.slice(0, 10)}`);

  // Prepare the payload for the SageMaker endpoint
  const payload = JSON.stringify({
    f0up_key: f0upKey,
    audio_url: audioURL
  });

  console.log(`Prepared payload: ${payload.slice(0, 10)} to send to SageMaker endpoint`);

  const params = {
    Body: payload,
    EndpointName: 'JoelEndpointLatest',
    ContentType: 'application/json',
  };
  
  const command = new InvokeEndpointCommand(params);

  const response = await sagemakerRuntime.send(command);

  // Concatenate the response data
  const responseBody = await Buffer.from(response.Body).toString();

  const responseData = JSON.parse(responseBody);
  console.log(`Received response data: ${responseData}`);

  const returnedURL = responseData[0]['url'];

  // Decode the base64 audio to binary
  // const audioBytes = Buffer.from(audioData, 'base64');

  // Convert the binary data to an array of 16-bit integers
  // const audioArray = new Int16Array(audioBytes.buffer);

  // Create a new .wav file
  // const wav = new WaveFile();
  // wav.fromScratch(1, sampleRate, '16', audioArray);

  // Write the .wav file
  // await writeFile('output.wav', wav.toBuffer());

  // Convert the .wav file to a base64 string
  // const audioBlob = fs.readFileSync('output.wav');
  // const audioBase64 = audioBlob.toString('base64');

  console.log(`Returning URL: ${returnedURL}`);
  
  return new Response(JSON.stringify({ returnedURL: returnedURL }), {
    headers: { 'Content-Type': 'application/json' },
  });
}