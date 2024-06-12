import React from 'react'

interface AudioPlayerComponentProps {
  audioBlob: Blob
}

const AudioPlayerComponent = ({ audioBlob }: AudioPlayerComponentProps) => {

  return (
    <div id="audioPlayerContainer" className="flex flex-col w-full items-center">
      <audio
        controls
        src={URL.createObjectURL(audioBlob)}
        className="bg-transparent rounded-lg p-1 md:p-0 w-full"
      />
    </div>
  )
}

export default AudioPlayerComponent