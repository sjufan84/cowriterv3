import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import './styles/styles.css' // import css file

interface AudioRecorderComponentProps {
  onRecordingComplete: (blob: Blob) => void
}

const AudioRecorderComponent = ( { onRecordingComplete }: AudioRecorderComponentProps ) => {
  const recorderControls = useAudioRecorder()

  const addAudioElement = (blob: Blob) => {
    onRecordingComplete(blob)
    console.log(`Audio blob: ${blob} sent to onRecordingComplete function`)
  };


  return (
    <div className="flex" id="audioRecorderContainer">
      <AudioRecorder 
        onRecordingComplete={(blob: Blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        showVisualizer={true}
      />
      {!recorderControls.isRecording && (
      <button onClick={recorderControls.startRecording}>Start recording</button>
      )}
    </div>
  )
}

export default AudioRecorderComponent