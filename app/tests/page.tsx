'use client';

import { useState, useRef, useEffect } from 'react';
import { useActions, useUIState, useAIState } from 'ai/rsc';
import { IoIosSend } from 'react-icons/io';
\import { FaRegQuestionCircle } from "react-icons/fa";
import { nanoid } from 'nanoid';
import { ClientMessage } from '../actions';
import UserChatBubble from '../../components/chat/UserChatBubble';
import ChatInputComponent from '../../components/chat/ChatInputComponent';

export default function Chat() {
  const [currentAssistantId, setCurrentAssistantId] = useState<string>('asst_TdPIfsaFWLSXldiRlCOuqim1');
  const [currentThreadId, setCurrentThreadId] = useState<string>('');
  const [systemMessages, setSystemMessages] = useAIState();
  const [messages, setMessages] = useUIState();
  const [input, setInput] = useState('');
  const { getAnswer } = useActions();

  const handleUserSubmission = async () => {
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: nanoid(),
        content: input,
        role: 'user',
        threadId: currentThreadId,
      },
    ]);
    console.log(`Calling getAnswer with input: ${input}, threadId: ${currentThreadId}, and assistantId: ${currentAssistantId}`)
    const response = await getAnswer(input, currentThreadId, currentAssistantId);
    
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      response,
    ]);
    setInput('');
  }
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center bg-white px-2 text-black" id="mainPage">
      <div className="w-full max-w-3xl flex flex-col min-h-screen items-center md:py-10 py-4 bg-white">
        <div className="flex-1 w-full overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
          {messages.map((message: ClientMessage) => (
            <div key={message.id}>{message.role === 'user' ? (
              <UserChatBubble message={message.content as string} />
            ) : (
              message.content
            )}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center w-full fixed bottom-0 bg-white" id="chatInputContainer">
          <div className="flex flex-row join items-center justify-center md:max-w-2xl px-8 md:px-2 w-full" id="inputRow">
            <div className="flex join-item w-full h-full" id="chatInput">
              <ChatInputComponent onInputChange={setInput} input={input} />
            </div>
            <button className="btn btn-ghost join-item hover:bg-transparent" onClick={handleUserSubmission}>
              <IoIosSend className="text-[#54ad9c] hover:text-[#124E78] hover:bg-transparent h-8 w-8"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}