'use client'

import { useState, useEffect, useRef } from 'react'

interface ChatInputProps {
  input: string,
  onInputChange: (input: string) => void,
}

export default function ChatInputComponent({ input, onInputChange }: ChatInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  }
  

  return (
    <div className="flex w-full h-full bg-white" id="chatInputContainer">
      <input
        className="flex w-full px-2 mb-1 h-full bg-white"
        value={input}
        placeholder="How can I help you today?"
        onChange={handleInputChange}
        spellCheck={false}
      />
    </div>
  )
}