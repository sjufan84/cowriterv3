'use client'

interface ChatInputProps {
  input: string,
  onInputChange: (input: string) => void,
}

export default function ChatInputComponent({ input, onInputChange }: ChatInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  }
  

  return (
    <div className="flex w-full h-12 bg-zinc-50" id="chatInputContainer">
      <input
        className="flex w-full px-2 mb-1 h-full bg-zinc-50 text-black focus:border-none focus:outline-none"
        value={input}
        placeholder="Let's rock..."
        onChange={handleInputChange}
        spellCheck={false}
      />
    </div>
  )
}