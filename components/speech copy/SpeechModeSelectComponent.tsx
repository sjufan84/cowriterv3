import React from 'react'
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { MdOutlineVoiceOverOff } from "react-icons/md";


interface TextToSpeechSelectComponentProps {
  chatMode: string,
  onModeChange: (currentMode: string) => void
}
const TextToSpeechSelectComponent = ({ chatMode, onModeChange }: TextToSpeechSelectComponentProps) => {
  const [currentMode, setCurrentMode] = React.useState(chatMode)
  
  const handleModeChange = (mode: string) => {
    setCurrentMode(mode)
    onModeChange(mode)
  }
  return (
    <div id="tts-select" className="tooltip ml-2" data-tip="BakeBot Audio">
      {currentMode === ('voiceChat') && (
        <button className="btn btn-ghost btn-circle text-[#124E78] hover:bg-transparent" id="ttsOff" onClick={() => handleModeChange('textChat')}>
          <MdOutlineRecordVoiceOver className="h-8 w-8 text-[#124E78] hover:text-[#54ad9c]" />
        </button>
      )}
      {currentMode === ('textChat') && (
        <button className="btn btn-ghost btn-circle text-[#124E78] hover:bg-transparent" id="ttsOn" onClick={() => handleModeChange('voiceChat')}>
          <MdOutlineVoiceOverOff className="h-8 w-8 text-[#124E78] hover:text-[#54ad9c]" />
        </button>
      )}
    </div>
  )
}

export default TextToSpeechSelectComponent