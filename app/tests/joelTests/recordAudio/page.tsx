'use client'

import React, { useState } from "react";
import { convertWebmToWavFile } from "../components/files/fileHelpers";
import { IoCloudUploadOutline } from "react-icons/io5";
import AudioRecorderComponent from "../../../../components/cloneVocals/audioRecorder/AudioRecorderComponent";
import AudioBlobPlayerComponent from "../components/AudioBlobPlayerComponent";
import NewAudioPlayerComponent from "../uploadFiles/components/NewAudioPlayerComponent";
import RecordFileComponent from "../components/files/RecordFileComponent";
import Image from 'next/image';
import Link from 'next/link';

export default function NewCloneRecordingComponent() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [clonedAudioURL, setClonedAudioURL] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCloning, setIsCloning] = useState<boolean>(false);

  const handleNewRecording = () => {
    setAudioBlob(null);
    setClonedAudioURL('');
    window.location.reload();
  }

  const handleVocalCloneSubmit = async (audioURL: string) => {
    setIsUploading(false);
    setIsCloning(true);
    try {
      console.log(`Sending audio URL to clone vocals: ${audioURL}`)
      const clonedAudio = await fetch('/api/cloneVocalsFromURL', {
        method: 'POST',
        body: JSON.stringify({ audioURL: audioURL, f0upKey: 0}),
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
    setIsCloning(false);
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setAudioBlob(audioBlob);
    const file = await convertWebmToWavFile(audioBlob);
    setAudioFile(file);
    console.log(`Audio file: ${file.name} created from audio blob`);
  }

  const createDownloadLink = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cloned_audio.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col items-center bg-zinc-50 px-2 text-black w-full" id="mainRecordingPage">
      <div className="flex flex-col w-full max-w-xl min-h-screen bg-zinc-50 px-6">
        <Image src="/artist_vault.png" alt="Artist Vault" width={300} height={300} className="mt-4 self-center mb-6" />
        <div className="flex flex-col w-full bg-zinc-50 items-center" id="mainRecordingContainer">
          {!audioBlob && !clonedAudioURL && (
            <AudioRecorderComponent onRecordingComplete={handleRecordingComplete} />
          )}
          {audioBlob && !clonedAudioURL && !isUploading && !isCloning && (
            <div id="clonedRecordingGroup" className="w-full flex flex-col items-center justify-center">
              <AudioBlobPlayerComponent audioBlob={audioBlob} />
              <RecordFileComponent onFileUploadComplete={handleVocalCloneSubmit} audioFile={audioFile as File} onIsUploading={setIsUploading} />
            </div>
          )}
          {isUploading && (
            <div className="flex flex-row items-center justify-center">
              <p>Preparing Vocals</p>
              <span className="loading loading-dots loading-md ml-2 mt-1" />
            </div>
          )}
          {isCloning && (
            <div className="flex flex-row items-center justify-center">
              <p>Cloning Vocals</p>
              <span className="loading loading-dots loading-md ml-2 mt-1" />
            </div>
          )}
          {clonedAudioURL && (
            <div id="clonedAudioPlayerContainer" className="w-full px-1">
              <AudioBlobPlayerComponent audioBlob={audioBlob as Blob} />
              <label className="form-control w-full flex flex-col items-center mt-4">
                <div className="label self-start ml-2">
                  <span className="text-md font-semibold text-[#17123D]">Cloned Audio</span>
                </div>
                <NewAudioPlayerComponent src={clonedAudioURL} />
              </label>
              <button className="btn mb-1 mt-6 w-full md:text-lg bg-[#17123D] text-[#fafafa]" onClick={() => createDownloadLink(clonedAudioURL)}>Download Cloned Audio</button>
            </div>
            )}
            <div className="flex flex-col items-center justify-center w-full px-1" id="recordingContainerBottomButtons">
              {audioBlob && !isUploading && !isCloning && (
                <button onClick={handleNewRecording} className="btn bg-[#17123D] text-[#fafafa] w-full mt-2 md:text-lg">Record New Audio</button>
              )}
            <Link href="/tests/joelTests/uploadFiles" className="w-full flex flex-row items-center justify-center fixed bottom-10">
              <button className="btn btn-lg btn-ghost text-2xl hover:bg-transparent text-[#17123D] w-full">
                Upload Files
                <IoCloudUploadOutline className="text-[#17123D] ml-3 mt-0.5" size={35} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}