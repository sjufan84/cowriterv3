interface AudioPlayerNewProps {
  src: string;
}
export default function NewAudioPlayerComponent({ src }: AudioPlayerNewProps) {
  return (
    <audio
      src={src}
      controls
      className="bg-transparent rounded-lg p-1 md:p-0 w-full"
    />
  );
}