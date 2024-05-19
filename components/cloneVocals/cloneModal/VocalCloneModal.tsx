import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import AudioRecorderComponent from '../audioRecorder/AudioRecorderComponent';
import AudioPlayerComponent from '../audioPlayerComponent/AudioPlayerComponent';

interface VocalCloneModalProps
{
  onCloneSuccess: (clonedVocals: string) => void;
}

{/* Open the modal using document.getElementById('ID').showModal() method */}
export default function VocalCloneModal({ onCloneSuccess }: VocalCloneModalProps) {
  const [currentRecordedVocals, setCurrentRecordedVocals] = useState<Blob | null>(null);
  const [isCloning, setIsCloning] = useState<boolean>(false);
  
  const handleCloneVocals = async () => {
    setIsCloning(true);
    // Call the API to clone the vocals
    // onCloneSuccess(clonedVocals);
    setIsCloning(false);
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
          <AudioRecorderComponent onRecordingComplete={(blob: Blob) => setCurrentRecordedVocals(blob)} />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <p className="font-semibold mt-4">Your recorded vocals:</p>
          <AudioPlayerComponent audioBlob={currentRecordedVocals} />
          <div className="flex flex-col md:flex-row items-center justify-center w-full mt-4">
            <button className="btn btn-md p-2 rounded-lg md:mr-4 text-white bg-[#17123D] w-full md:w-3/4" onClick={handleCloneVocals} disabled={isCloning}>Clone Vocals</button>
            <button className="btn btn-md p-2 rounded-lg md:ml-4 text-white bg-[#17123D] w-full mt-2 md:w-3/4 md:mt-0" onClick={() => setCurrentRecordedVocals(null)}>Re-record</button>
          </div>
        </div>
      )}
    </div>
  )
}
