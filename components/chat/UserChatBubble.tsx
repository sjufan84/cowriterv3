import React from 'react'

interface UserChatBubbleProps {
  message: string
}
const UserChatBubble = ({ message }: UserChatBubbleProps) => {
  return (
    <div className="chat chat-start mt-2 text-zinc-50 bg-[#17123D] p-3 rounded-lg" id="userChatComponent">
      <p id="userChatText"><strong className="text-sm mr-2">You:</strong>{message}</p>
    </div>
      
  )
}

export default UserChatBubble