'use client';

import { useState } from 'react';
import { cloneAudioFromURL } from '../components/files/fileHelpers';
import Image from 'next/image';
import UploadFileComponent from '../components/files/UploadFileComponent';
import NewAudioPlayerComponent from './components/NewAudioPlayerComponent';

export default function JoelTestsUploadFiles() {
  // const [originalAudio, setOriginalAudio] = useState<Blob | null>(null);
  // const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isCloneVocalsLoading, setIsCloneVocalsLoading] = useState<boolean>(false);
  const [currentAudioURL, setCurrentAudioURL] = useState<string | null>(null);
  const [clonedAudioURL, setClonedAudioURL] = useState<string | null>(null);

  // Create a function to create a download link for the audio url
  const createDownloadLink = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cloned_audio.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleVocalCloneSubmit = async () => {
    setIsCloneVocalsLoading(true);
    try {
      console.log(`Cloning vocals from URL: ${currentAudioURL}`)
      const clonedAudio = await fetch('/api/cloneVocalsFromURL', {
        method: 'POST',
        body: JSON.stringify({ audioURL: currentAudioURL, f0upKey: 0}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await clonedAudio.json();
      console.log(`Received cloned audio URL: ${data.returnedURL}`);
      const url = data.returnedURL;
      setClonedAudioURL(url);
    } catch (error) {
      console.error(`Error cloning vocals: ${error}`);
    }
    setIsCloneVocalsLoading(false);
  }

  return (
    <div className="flex flex-col items-center bg-zinc-50 px-2 text-black w-full" id="mainPage">
      <div className="flex flex-col w-full max-w-2xl min-h-screen bg-zinc-50 px-6">
        <Image src="/artist_vault.png" alt="Artist Vault" width={300} height={300} className="mt-4 self-center mb-6" />
        <div className="flex flex-col w-full bg-zinc-50 items-center" id="uploadFilesContainer">
          {!currentAudioURL && !clonedAudioURL && (
          <div className="flex flex-col w-full items-center mt-4" id="uploadFilesButtonGroup">
            <h1 className="text-xl font-semibold text-center">Upload Your Audio File:</h1>
            <UploadFileComponent onAudioFileUpload={setCurrentAudioURL} />
          </div>
          )}
          {currentAudioURL && !clonedAudioURL && (
            <div className="flex flex-col w-full mt-4" id="audioPlayerContainer">
              <label className="form-control w-full flex flex-col items-center">
                <div className="label">
                  <span className="label-text font-semibold text-black mb-2 text-lg">Original Audio</span>
                </div>
                <NewAudioPlayerComponent src={currentAudioURL} />
              </label>
                {!isCloneVocalsLoading ? (
                  <div id="cloneVocalsButtonSelectGroup" hidden={isCloneVocalsLoading} className="flex flex-col w-full md:flex-row mt-4 justify-between">
                    <button 
                      className="btn btn-ghost text-[#17123D] border-[#17123D] mt-4 md:mt-0 w-full md:w-2/5" 
                      onClick={handleVocalCloneSubmit}
                    >
                      Clone Vocals
                    </button>
                    <button className="btn btn-ghost text-[#17123D] border-[#17123D] mt-4 md:mt-0 w-full md:w-2/5" onClick={async () => {
                      setCurrentAudioURL(null);
                      setClonedAudioURL(null);
                    }}>
                      Upload New Audio
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row w-full items-center mt-4" id="cloneVocalsLoadingSpinner" hidden={!isCloneVocalsLoading}>
                    <p className="text-[#17123D] font-semibold mt-2">Cloning Vocals.  This may take a minute...</p>
                    <span className="loading loading-dots loading-md md:loading-lg mt-4 md:mt-1 md:ml-2"></span>
                  </div>
                )}
            </div>
          )}
          {currentAudioURL && clonedAudioURL && (
            <div className="flex flex-col w-full mt-4" id="clonedAudioPlayerContainer">
              <label className="form-control w-full flex flex-col items-center mb-4">
                <div className="label">
                  <span className="label-text font-semibold text-[#17123D] mb-2 text-lg">Original Audio</span>
                </div>
                <NewAudioPlayerComponent src={currentAudioURL} />
              </label>
              <label className="form-control w-full flex flex-col items-center">
                <div className="label">
                  <span className="label-text font-semibold text-[#17123D] mb-2 text-lg">Cloned Audio</span>
                </div>
                <NewAudioPlayerComponent src={clonedAudioURL} />
              </label>
              <button className="btn btn-ghost bg-[#17123D] text-[#fafafa] mt-4 w-full" onClick={() => createDownloadLink(clonedAudioURL)}>
                Download Cloned Audio
              </button>
              <button className="btn btn-ghost bg-[#17123D] text-[#fafafa] mt-4 w-full" onClick={async () => {
                setCurrentAudioURL(null);
                setClonedAudioURL(null);
              }}>
                Upload New Audio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}