'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import UploadFileComponent from '../components/files/UploadFileComponent';
import AudioBlobPlayerComponent from '../components/AudioBlobPlayerComponent';
import CloneVocalsSubmitButton from '../components/CloneVocalsSubmitButton';

export default function JoelTestsUploadFiles() {
  const [originalAudio, setOriginalAudio] = useState<Blob | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isCloneVocalsLoading, setIsCloneVocalsLoading] = useState<boolean>(false);
  const [currentAudioURL, setCurrentAudioURL] = useState<string | null>(null);
  const [clonedAudioString, setClonedAudioString] = useState<string | null>(null);
  const [clonedAudioBlob, setClonedAudioBlob] = useState<Blob | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  const handleFileUpload = (file: File) => {
    // Create a blob from the file
    const audioBlob = new Blob([file], { type: file.type });
    setOriginalAudio(audioBlob);
  }

  const handleClonedVocals = (audioString: string) => {
    const audioElement = new Audio(`data:audio/wav;base64,${audioString}`);
    // Return the audio element
    return audioElement;
  }

  useEffect(() => {
    if (clonedAudioString) {
      // Create an audio element from the cloned vocals
      const audioElement = handleClonedVocals(clonedAudioString)
      setAudioElement(audioElement)
      console.log('Audio element created from cloned vocals:')
    }
  }
  , [clonedAudioString])

  const handleStartOver = () => {
    setOriginalAudio(null);
    setClonedAudioBlob(null);
    setClonedAudioString(null);
    setAudioElement(null);
  }


  const handleVocalCloneSubmit = async (audioString: string) => {
    setIsCloneVocalsLoading(true);
    console.log(`Submitting audio string: ${audioString.slice(0, 10)}`);
    let clonedAudioString = null;
    try {
      clonedAudioString = await fetch('/api/cloneVocals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioString: audioString })
      }).then(res => res.json());
      console.log(`Received cloned audio string ${clonedAudioString.audioData.slice(0, 10)} with sample rate ${clonedAudioString.sampleRate} and audio blob ${clonedAudioString.audioBlob}`);
      // Convert the cloned audio string to a blob
      setClonedAudioBlob(clonedAudioString.audioBlob);
      setClonedAudioString(clonedAudioString.audioData);

    } catch (error) {
      console.error(`Error converting audio string to blob: ${error}`);
    }
    setIsCloneVocalsLoading(false);
  }

  return (
    <div className="flex flex-col items-center bg-zinc-50 px-2 text-black w-full" id="mainPage">
      <div className="flex flex-col w-full max-w-2xl min-h-screen bg-zinc-50 px-6">
        <Image src="/artist_vault.png" alt="Artist Vault" width={300} height={300} className="mt-4 self-center mb-6" />
        <div className="flex flex-col w-full bg-zinc-50 items-center" id="uploadFilesContainer">
          {!originalAudio && !clonedAudioBlob && (
          <div className="flex flex-col w-full items-center mt-4" id="uploadFilesButtonGroup">
            <h1 className="text-xl font-semibold text-center">Upload Your Audio File:</h1>
            <UploadFileComponent onAudioFileUpload={setCurrentAudioURL} />
            {currentFile && (
              <button className="btn md:btn-lg btn-ghost text-[#17123D] border-[#17123D] mt-4 w-1/2" onClick={() => handleFileUpload(currentFile)}>
                Upload File
              </button>
            )}
          </div>
          )}
          {originalAudio && !clonedAudioBlob && (
            <div className="flex flex-col w-full justify-center mt-4" id="audioPlayerContainer">
              <label className="text-[#17123D] self-start text-sm ml-3 mb-2 font-semibold">Original Audio:</label>
              <AudioBlobPlayerComponent audioBlob={originalAudio as Blob} />
              <div className="flex flex-col md:flex-row w-full mt-4" id="originalAudioButtonChoiceGroup">
                <button className="btn btn-ghost text-[#17123D] md:mr-4 border-[#17123D] mt-4 md:mt-0 w-full md:w-1/2" onClick={() => setOriginalAudio(null)}>
                  Choose Another File
                </button>
                {!isCloneVocalsLoading ? (
                  <CloneVocalsSubmitButton audioBlob={originalAudio} onSubmit={handleVocalCloneSubmit} />
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-center mt-2" id="cloneVocalsLoading">
                    <p className="text-[#17123D] font-semibold">Cloning Vocals.  This may take a second.</p>
                    <span className="loading loading-dots loading-lg md:ml-2 mt-2 md:mt-0"></span>
                  </div>
                )}
              </div>
            </div>
            )}
              {audioElement && (
              <div className="flex flex-col w-full mt-4" id="clonedAudioPlayerContainer">
                <label className="text-[#17123D] self-start text-sm ml-3 mb-2 font-semibold">Cloned Audio:</label>
                <audio controls className="w-full p-1 md:p-0" id="clonedAudioPlayer">
                  <source src={audioElement.src} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <button className="btn btn-ghost text-[#17123D] border-[#17123D] mt-4 w-full" onClick={handleStartOver}>
                  Upload another file
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}