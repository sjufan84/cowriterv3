'use client';
import { io } from 'socket.io-client';
import { Howl } from 'howler';

export async function listenForStreamingAudio() {
  const socket = io('http://localhost:3001');
  socket.on('audio', (audioStream) => {
    const sound = new Howl({
      src: [audioStream],
      format: ['mp3'],
      onend: () => {
        sound.unload();
      }
    });
    sound.play();
  })
}