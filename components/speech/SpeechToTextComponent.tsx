import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { CiMicrophoneOn } from "react-icons/ci";

interface AudioToTextProps {
  onRecordingEnd: (transcript: string) => void;
}


const AudioToText = ({ onRecordingEnd }: AudioToTextProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState({} as any)
  const {
    transcript,
    resetTranscript,
    // browserSupportsSpeechRecognition,
    listening,
    // interimTranscript,
    
  } = useSpeechRecognition();


  useEffect(() => {
    if (!listening && isRecording) {
      setIsRecording(false);
      console.log(`Stopped listening.  Final transcript: ${transcript}`)
      onRecordingEnd(transcript);
      console.log('Recording ended')
      resetTranscript();
    }
  }, [listening, isRecording]);

  /*if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }*/

  const startRecording = async () => {
    await SpeechRecognition.startListening();
    setIsRecording(true);
    console.log('Started listening');
  };

  /*const stopRecording = async () => {
    setIsRecording(false);
    await SpeechRecognition.stopListening();
    console.log(`Stopped listening.  Final transcript: ${transcript}`)
    onRecordingEnd(transcript);
  };*/

  return (
    <div id="recordingComponent" className="tooltip flex flex-row items center" data-tip="Talk to BakeBot">
      <button onClick={startRecording} disabled={isRecording}>
        <CiMicrophoneOn size={30} color={isRecording ? '#bd081c' : '#124E78'} />
      </button>
      {isRecording && (
        <span className="loading loading-ring mt-1 md:loading-md loading-sm" hidden={!isRecording}></span>
      )}
      <p>{transcript}</p>
    </div>
  );
};

export default AudioToText;