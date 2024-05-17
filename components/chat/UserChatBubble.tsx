import React from 'react'

interface UserChatBubbleProps {
  message: string
}
const UserChatBubble = ({ message }: UserChatBubbleProps) => {
  return (
    <div className="chat chat-start mt-2" id="userChatComponent">
      <div className="chat-bubble text-sm text-white">{message}</div>
    </div>
  )
}

export default UserChatBubble