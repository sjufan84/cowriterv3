// import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  const input = await req.formData();
  const file = input.get("audio_file") as File;
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
  });

  console.log(transcription.text);

  return new Response(JSON.stringify({ transcription: transcription.text }), {
    headers: { "Content-Type": "application/json" },
  });
}