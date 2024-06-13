import React from 'react'
import { convertBlobToString } from './files/fileHelpers'

interface CloneVocalsSubmitButtonProps {
  audioBlob: Blob | null,
  onSubmit: (audioString: string) => void
}

const CloneVocalsSubmitButton = ({ audioBlob, onSubmit }: CloneVocalsSubmitButtonProps) => {
  return (
    <div id="cloneVocalsSubmitButton" className="w-full">
      <button className="btn btn-ghost text-[#17123D] border-[#17123D] mt-4 md:mt-0 w-full" onClick={async () => {
        if (audioBlob) {
          const audioString = await convertBlobToString(audioBlob)
          onSubmit(audioString)
        }
      }}>
        Clone Vocals
      </button>
    </div>
  )
}

export default CloneVocalsSubmitButton