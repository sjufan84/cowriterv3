import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS


interface AudioPlayerNewProps {
  src: string;
  onPlay?: (e: any) => void;
}
export default function NewAudioPlayerComponent({ src, onPlay }: AudioPlayerNewProps) {
  return (
    <AudioPlayer
      src={src}
      onPlay={onPlay}
      
    />
  );
}