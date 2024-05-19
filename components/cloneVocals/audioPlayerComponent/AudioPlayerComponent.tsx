import React from 'react'

interface AudioPlayerComponentProps {
  audioBlob: Blob
}

const AudioPlayerComponent = ({ audioBlob }: AudioPlayerComponentProps) => {
  const [currentAudioBlob, setCurrentAudioBlob] = React.useState(audioBlob)

  return (
    <div id="audioPlayerContainer" className="flex flex-col w-full items-center">
      <label className="text-white self-start text-sm ml-2 mb-2">Recorded Vocals</label>
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

export default AudioPlayerComponent