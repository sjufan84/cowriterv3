import React from 'react'

interface AudioBlobPlayerComponentProps {
  audioBlob: Blob
}


const AudioBlobPlayerComponent = ({ audioBlob }: AudioBlobPlayerComponentProps) => {
  const [currentAudioBlob, setCurrentAudioBlob] = React.useState(audioBlob)

  return (
    <div id="audioBlobPlayerContainer" className="flex flex-col w-full items-center text-black">
      <label className="text-[#17123D] self-start ml-3 mb-2 w-full font-semibold">Recorded Vocals</label>
      {currentAudioBlob && (
        <audio
          controls
          src={URL.createObjectURL(currentAudioBlob)}
          className="bg-transparent rounded-lg p-1 md:p-0 w-full"
        />
      )}
    </div>
  )
}

export default AudioBlobPlayerComponent