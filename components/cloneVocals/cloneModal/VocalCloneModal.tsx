import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import AudioRecorderComponent from '../audioRecorder/AudioRecorderComponent';
import AudioPlayerComponent from '../audioPlayerComponent/AudioPlayerComponent';
import CloneVocalsSubmitButton from './CloneVocalsSubmitButton';

interface VocalCloneModalProps
{
  onCloneSuccess: (clonedVocals: string) => void;
}

{/* Open the modal using document.getElementById('ID').showModal() method */}
export default function VocalCloneModal({ onCloneSuccess }: VocalCloneModalProps) {
  const [currentRecordedVocals, setCurrentRecordedVocals] = useState<Blob | null>(null);
  const [isCloning, setIsCloning] = useState<boolean>(false);
  
  const handleCloneSuccess = (clonedVocals: string) => {
    console.log(`Cloned vocals received: ${clonedVocals.slice(0, 100)}`);
    // Close the modal
    onCloneSuccess(clonedVocals);
  }

  return (
    <div className="modal-box p-4 rounded-2xl w-full flex-grow">
      <div className="flex modal-action justify-end">
        <form method="dialog" className="justify-end">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-circle text-black bg-transparent hover:bg-transparent border-none hover:border-none place-self-end">
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </form>
      </div>
      {!currentRecordedVocals ? (
        <div id="vocalCloneModalBody" className="flex justify-center">
          <div className="btn btn-large p-4 rounded-lg text-white bg-[#17123D]">
            <AudioRecorderComponent onRecordingComplete={(blob: Blob) => setCurrentRecordedVocals(blob)} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <p className="font-semibold mt-4">Your recorded vocals:</p>
          <AudioPlayerComponent audioBlob={currentRecordedVocals} />
          <div className="flex flex-col md:flex-row items-center justify-center w-full mt-4">
            {!isCloning ? (
              <div id="vocalCloneOptionsGroup" className="flex flex-col md:flex-row items-center w-full mt-2">
                <CloneVocalsSubmitButton recordedVocals={currentRecordedVocals} onIsCloning={(isCloning: boolean) => setIsCloning(isCloning)} onCloneSuccess={handleCloneSuccess} />
                <button className="btn btn-md p-2 rounded-lg md:ml-4 text-white bg-[#17123D] w-full mt-2 md:w-3/4 md:mt-0 md:mr-8" onClick={() => setCurrentRecordedVocals(null)}>Re-record</button>
              </div>
            ) : (
              <div id="vocalCloneLoader" className="btn btn-lg p-4 text-zinc-50 flex flex-row items-center w-full">
                <p className="font-semibold mt-4">Cloning vocals</p>
                <span className="loading loading-dots loading-md ml-4 mt-1"></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
