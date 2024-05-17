import React from 'react'

interface AIChatBubbleProps {
  message: string
}
const AIChatBubble = ({ message }: AIChatBubbleProps) => {
  return (
      <div className="rounded-lg p-3 bg-slate-200 text-black text-sm mt-4 leading-relaxed">
          <strong>Joel:</strong>
        <div className="leading-relaxed">{message}</div>
      </div>
  )
}

export default AIChatBubble