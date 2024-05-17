'use client'

import { useState, useEffect, useRef } from 'react'

interface ChatInputProps {
  input: string,
  status: string,
  onInputChange: (input: string) => void,
}

export default function ChatInputComponent({ status, input, onInputChange }: ChatInputProps) {
  const [currentInput, setCurrentInput] = useState(input);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  }
  

  // When status changes to accepting messages, focus the input:
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
    }
  }, [status]);
  
  return (
    <div className="flex w-full h-full bg-white" id="chatInputContainer">
      <input
        ref={inputRef}
        disabled={status !== 'awaiting_message'}
        className="flex w-full px-2 mb-1 h-full bg-white"
        value={input}
        placeholder="How can I help you today?"
        onChange={handleInputChange}
      />
    </div>
  )
}