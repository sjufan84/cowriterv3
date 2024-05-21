import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdRecordVoiceOver } from "react-icons/md";

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
  }, [listening, isRecording, transcript, onRecordingEnd, resetTranscript]);

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
    <div id="recordingComponent" className="tooltip flex flex-row items center mb-1" data-tip="Talk to Joel">
      <button onClick={startRecording} disabled={isRecording} className="btn btn-circle bg-transparent hover:bg-transparent border-none hover:border-none">
        <MdRecordVoiceOver size={30} color={isRecording ? 'rgb(234 179 8)' : '#17123D'} />
      </button>
      {isRecording && (
        <span className="loading loading-ring mt-1 md:loading-md loading-sm" hidden={!isRecording}></span>
      )}
      <p>{transcript}</p>
    </div>
  );
};

export default AudioToText;