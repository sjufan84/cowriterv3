'use client';

import { useState } from 'react';
import Image from 'next/image';
import UploadFileComponent from '../components/files/UploadFileComponent';
import AudioPlayerComponent from '../components/AudioPlayerComponent';

export default function JoelTestsPage() {
  const [originalAudio, setOriginalAudio] = useState<Blob | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  const handleFileUpload = (file: File) => {
    // Create a blob from the file
    const audioBlob = new Blob([file], { type: file.type });
    setOriginalAudio(audioBlob);
  }
  return (
    <div className="flex flex-col items-center bg-zinc-50 px-2 text-black w-full" id="mainPage">
      <div className="flex flex-col w-full max-w-2xl min-h-screen bg-zinc-50 px-6">
        <Image src="/artist_vault.png" alt="Artist Vault" width={300} height={300} className="mt-4 self-center mb-6" />
        <div className="flex flex-col w-full bg-zinc-50 items-center" id="uploadFilesContainer">
          {!originalAudio ? ( 
          <div className="flex flex-col w-full items-center mt-4" id="uploadFilesButtonGroup">
            <h1 className="text-2x font-bold text-center">Upload Your Audio File:</h1>
            <UploadFileComponent onFileUpload={(file) => setCurrentFile(file)} />
            {currentFile && (
              <button className="btn md:btn-lg btn-ghost text-[#17123D] border-[#17123D] mt-4 w-1/2" onClick={() => handleFileUpload(currentFile)}>
                Upload File
              </button>
            )}
          </div>
          ) : (
          <div className="flex flex-col w-full justify-center mt-4" id="audioPlayerContainer">
            <label className="text-[#17123D] self-start text-sm ml-3 mb-2 font-semibold">Original Audio:</label>
            <AudioPlayerComponent audioBlob={originalAudio} />
            <div className="flex flex-col md:flex-row w-full mt-4" id="originalAudioButtonChoiceGroup">
              <button className="btn btn-ghost text-[#17123D] md:mr-4 border-[#17123D] mt-4 md:mt-0 w-full md:w-1/2" onClick={() => setOriginalAudio(null)}>
                Choose Another File
              </button>
              <button className="btn btn-ghost text-[#17123D] border-[#17123D] mt-4 md:mt-0 w-full md:w-1/2">
                Clone Vocals
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}