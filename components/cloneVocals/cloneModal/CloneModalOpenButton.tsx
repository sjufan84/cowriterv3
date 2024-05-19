import React from 'react'
import VocalCloneModal from './VocalCloneModal';
import { CiMicrophoneOn } from "react-icons/ci";

interface VocalCloneModalOpenButtonProps {
  onCloneSuccess: (clonedVocals: string) => void;
}

{/* Open the modal using document.getElementById('ID').showModal() method */}
export default function VocalCloneModalOpenButton({ onCloneSuccess }: VocalCloneModalOpenButtonProps) {

  const handleCloneSuccess = (clonedVocals: string) => {
    onCloneSuccess(clonedVocals);
  }

  return (
    <div className="tooltip" data-tip="Clone Vocals">
      <button className="btn btn-circle bg-transparent hover:bg-transparent border-none hover:border-none" onClick={() => (document.getElementById('cloneVocalsModal') as HTMLDialogElement)?.showModal()}>
        <CiMicrophoneOn className="btn btn-circle border-none hover:border-none w-8 h-8 text-[#17123D] hover:text-red-800"/>
      </button>
      <dialog id="cloneVocalsModal" className="modal modal-bottom sm:modal-middle rounded-lg w-5/6 md:max-w-3xl">
        <VocalCloneModal onCloneSuccess={handleCloneSuccess} />
      </dialog>
    </div>
  )
}