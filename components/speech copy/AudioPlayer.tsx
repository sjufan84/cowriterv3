import { useEffect, useRef } from 'react';

function AudioPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/api/tts');
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  return null;
}

export default AudioPlayer;