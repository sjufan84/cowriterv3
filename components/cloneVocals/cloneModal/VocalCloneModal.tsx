import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import { CiMicrophoneOn } from "react-icons/ci";
import AudioRecorderComponent from '../audioRecorder/AudioRecorderComponent';
import AudioPlayerComponent from '../audioPlayerComponent/AudioPlayerComponent';
import { cloneVocals } from '../cloneHelpers/cloneHelperFunctions';

interface VocalCloneModalProps
{
  onCloneSuccess: (clonedVocals: string, transcriptionText: string) => void;
}

type ClonedVocalsResponse = {
  audioBase64: string;
  transcriptionText: string;
}

{/* Open the modal using document.getElementById('ID').showModal() method */}
export default function VocalCloneModal({ onCloneSuccess }: VocalCloneModalProps) {
  const [currentRecordedVocals, setCurrentRecordedVocals] = useState<Blob | null>(null);
  const [isCloning, setIsCloning] = useState<boolean>(false);
  
  const handleCloneVocals = async () => {
    if (!currentRecordedVocals) {
      alert('Please record audio first')
      return
    }
    setIsCloning(true);
    try {
      const clonedVocalsResponse = await cloneVocals(currentRecordedVocals) as ClonedVocalsResponse;
      const transcriptionText = clonedVocalsResponse.transcriptionText;
      const clonedVocals = clonedVocalsResponse.audioBase64;
      setIsCloning(false);
      onCloneSuccess(clonedVocals, transcriptionText);
      // Close the modal
      (document.getElementById('cloneVocalsModal') as HTMLDialogElement)?.close();

    } catch (error) {
      console.error('Error cloning vocals:', error)
      setIsCloning(false);
    }
  }
    

  return (
    <div id="vocalCloneModal" className="flex flex-col">
      <button className="btn btn-circle bg-transparent hover:bg-transparent border-none hover:border-none" onClick={() => (document.getElementById('cloneVocalsModal') as HTMLDialogElement)?.showModal()}>
        <CiMicrophoneOn className="btn btn-circle border-none hover:border-none w-8 h-8 hover:bg-transparent bg-transparent text-[#17123D] hover:text-red-800"/>
      </button>
      <dialog id="cloneVocalsModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle text-black bg-transparent hover:bg-transparent border-none hover:border-none fixed top-0 right-0" onClick={() => (document.getElementById('cloneVocalsModal') as HTMLDialogElement)?.close()}>
                <IoCloseSharp className="w-6 h-6" />
              </button>
            </form>
          </div>
          {!currentRecordedVocals ? (
            <div id="vocalCloneModalBody" className="flex flex-col items-center justify-center">
              <div className="p-4 flex flex-col items-center justify-center rounded-lg text-white bg-[#17123D]">
                <AudioRecorderComponent onRecordingComplete={(blob: Blob) => setCurrentRecordedVocals(blob)} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold mt-4">Your recorded vocals:</p>
              <AudioPlayerComponent audioBlob={currentRecordedVocals} />
              <div className="flex flex-col md:flex-row items-center justify-center w-full mt-4">
                {!isCloning ? (
                    <div id="vocalCloneOptionsGroup" className="flex flex-col items-center w-full mt-2">
                      <button 
                        className="btn btn-md mb-2 p-2 rounded-lg md:mr-4 text-slate-50 hover:bg-transparent hover:text-yellow-500 md:text-lg bg-[#17123D] w-full md:w-3/4"
                        onClick={handleCloneVocals}
                      >
                        Clone Vocals
                      </button>
                      <button 
                        className="btn btn-md p-2 rounded-lg md:ml-4 text-slate-50 md:text-lg hover:bg-transparent bg-[#17123D] hover:text-yellow-500 w-full mt-2 md:w-3/4 md:mt-0 md:mr-8" 
                        onClick={() => setCurrentRecordedVocals(null)}>Re-record
                      </button>
                    </div>
                ) : (
                  <div className="flex flex-row items-center justify-center text-[#17123D]">
                    <p className="font-bold">Cloning vocals.  This may take a minute</p>
                    <span className="loading loading-dots loading-md md:loading-lg"></span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  )
}
