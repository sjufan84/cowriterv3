import React from 'react'

interface UserChatBubbleProps {
  message: string
}
const UserChatBubble = ({ message }: UserChatBubbleProps) => {
  return (
    <div className="chat chat-start mt-2 bg-[#17123D] text-zinc-50 p-3 rounded-lg" id="userChatComponent">
      <strong className="text-sm">You:</strong>
      <div className="chat-bubble text-sm">{message}</div>
    </div>
  )
}

export default UserChatBubble