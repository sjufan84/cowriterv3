import React from 'react'
import showdown from 'showdown'
import MarkdownView from 'react-showdown'

interface AIChatBubbleProps {
  message: string
}
const AIChatBubble = ({ message }: AIChatBubbleProps) => {
  return (
      <div className="rounded-lg p-3 bg-slate-200 text-black text-sm mt-4 leading-relaxed">
          <strong>BakeBot:</strong>
        <MarkdownView options={{ tables: true, emoji: true }} className="leading-relaxed" markdown={message} />
      </div>
  )
}

export default AIChatBubble