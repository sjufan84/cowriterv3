import React from 'react'
import { cloneVocals } from '../cloneHelpers/cloneHelperFunctions';

interface CloneVocalsSubmitButtonProps {
  recordedVocals: Blob | null,
  onIsCloning: (isCloning: boolean) => void,
  onCloneSuccess: (clonedVocals: string) => void;
}

export default function CloneVocalsSubmitButton({ recordedVocals, onIsCloning, onCloneSuccess }: CloneVocalsSubmitButtonProps) {

  const handleCloneVocals = async () => {
    if (!recordedVocals) {
      alert('Please record audio first')
      return
    }
    onIsCloning(true);
    let clonedVocals = '';
    console.log(`Sending recorded vocals to cloneVocals function from CloneVocalsSubmitButton`)
    try {
      clonedVocals = await cloneVocals(recordedVocals);
      console.log(`Cloned vocals received: ${clonedVocals.slice(0, 100)}`)
      onCloneSuccess(clonedVocals);
      onIsCloning(false);
    } catch (error) {
      console.error('Error cloning vocals:', error)
      onIsCloning(false);
    }
  }

  return (
    <div id="vocalCloneSubmitButton" className="flex flex-col items-center w-full">
      <button 
        className="btn btn-md p-2 rounded-lg md:mr-4 text-white bg-[#17123D] w-full md:w-3/4"
        onClick={handleCloneVocals}
      >
        Clone Vocals
      </button>
    </div>
  )
}