'use client';

import { useState, useRef, useEffect } from 'react';
import { useActions, useUIState, useAIState } from 'ai/rsc';
import { LiaGuitarSolid } from "react-icons/lia";
import { nanoid } from 'nanoid';
import { ClientMessage } from '../actions';
import { uploadTextFile, createThreadId } from '../../components/files/helperFunctions/fileHelpers';
import UserChatBubble from '../../components/chat/UserChatBubble';
import ChatInputComponent from '../../components/chat/ChatInputComponent';
import FileUploadButton from '../../components/files/UploadFileButton';
import VocalCloneModalOpenButton from '../../components/cloneVocals/cloneModal/CloneModalOpenButton';
export default function Chat() {
  const [currentAssistantId, setCurrentAssistantId] = useState<string>('asst_UifyY02rKAgHGYxHfAPpmiRf');
  const [currentThreadId, setCurrentThreadId] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [systemMessages, setSystemMessages] = useAIState();
  const [messages, setMessages] = useUIState();
  const [input, setInput] = useState('');
  const { getAnswer } = useActions();

  const handleClonedVocalsSuccess = (clonedVocals: string) => {
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: nanoid(),
        content: `Cloned vocals: ${clonedVocals}`,
        role: 'system',
      },
    ]);
  }

  const handleUserSubmission = async () => {
    let newThreadId = currentThreadId;
    if (!currentThreadId) {
      newThreadId = await createThreadId();
      setCurrentThreadId(newThreadId);
    }
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: nanoid(),
        content: input,
        role: 'user',
        threadId: newThreadId,
      },
    ]);
    console.log(`Calling getAnswer with input: ${input}, threadId: ${newThreadId}, and assistantId: ${currentAssistantId}`)
    const response = await getAnswer(input, currentThreadId, currentAssistantId);
    
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      response,
    ]);
    setInput('');
  }

  const handleFileUpload = async (file: File) => {
    console.log(`Uploading file: ${file.name} with type ${file.type}`)
    setIsUploading(true);
    try {
      const fileId = await uploadTextFile(file);
      console.log(`Uploaded file: ${fileId} with purpose assistants to vector store from ${file.name}`)
      alert(`File ${file.name} uploaded successfully!`);
      setIsUploading(false);
    } catch (error) {
      console.error(`Error uploading file: ${file.name} with type ${file.type}`, error);
      alert(`Error uploading file: ${file.name} with type ${file.type}.  Please try again.`);
      setIsUploading(false);
    }
  }

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center bg-zinc-50 px-2 text-black" id="mainPage">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl min-h-screen bg-zinc-50">
        <div className="w-full overflow-y-auto bg-zinc-50" style={{ height: 'calc(100vh - 200px)' }}>
          {messages?.map((message: ClientMessage) => (
            <div key={message.id}>{message.role === 'user' ? (
              <UserChatBubble message={message.content as string} />
            ) : (
              message.content
            )}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center px-4 justify-center w-full max-w-4xl fixed bottom-0 bg-zinc-50" id="chatInputContainer">
          <div className="flex flex-row items-center w-full border-2 shadow-xl rounded-lg border-[#17123D] px-4" id="chatInputGroup">
            <div className="flex join-item w-full bg-zinc-50" id="chatInput">
              <ChatInputComponent onInputChange={setInput} input={input} />
            </div>
            <button className="btn btn-ghost join-item hover:bg-transparent" onClick={handleUserSubmission}>
              <LiaGuitarSolid className="text-[#17123D] hover:text-red-800 hover:bg-transparent h-8 w-8"/>
            </button>
          </div>
          <div className="flex flex-row items-center justify-center mt-2 md:mt-0 bg-zinc-50 w-full md:w-min" id="chatMenuButtons">
            <div id="uploadFileButton" className="tooltip" data-tip="Upload File">
              {isUploading ? 
                <span className="loading loading-spinner loading-md text-yellow-500"></span>
              : (
                <FileUploadButton onFileChange={handleFileUpload} />
              )}
            </div>
            <div id="cloneVocalsButton" className="tooltip mt-1" data-tip="Clone Vocals">
              <VocalCloneModalOpenButton onCloneSuccess={handleClonedVocalsSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}