import React from 'react'

interface AudioStringPlayerComponentProps {
  audioString: string
}

const AudioStringPlayerComponent = ({ audioString }: AudioStringPlayerComponentProps) => {
  const [currentAudioString, setCurrentAudioString] = React.useState<string>(audioString)

  return (
    <div id="audioPlayerContainer" className="flex flex-col w-full items-center">
      {audioString && (
      <audio controls className="w-full p-1 md:p-0" id="clonedAudioPlayer">
        <source src={`data:audio/wav;base64,${audioString}`} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      )}
    </div>
  )
}

export default AudioStringPlayerComponent