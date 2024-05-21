'use client';

import { useState, useRef, useEffect } from 'react';
import { useActions, useUIState, useAIState } from 'ai/rsc';
import { LiaGuitarSolid } from "react-icons/lia";
import { nanoid } from 'nanoid';
import { ClientMessage } from './actions';
import { createThreadId } from '../components/files/helperFunctions/fileHelpers';
import { uploadImageFile, createImageFileMessage } from '../components/files/helperFunctions/imageFileHelpers';
import ImageFileUploadButton from '../components/files/imageFiles/ImageFileUploadButton';
import UserChatBubble from '../components/chat/UserChatBubble';
import ChatInputComponent from '../components/chat/ChatInputComponent';
import FileUploadButton from '../components/files/UploadFileButton';
import AudioToText from '../components/speech/SpeechToTextComponent';
import WelcomeScreen from '../components/ui/WelcomeScreen';
// import VocalCloneModalOpenButton from '../../components/cloneVocals/cloneModal/CloneModalOpenButton';
import VocalCloneModal from '../components/cloneVocals/cloneModal/VocalCloneModal';
import Image from 'next/image';

export default function Chat() {
  const [currentAssistantId, setCurrentAssistantId] = useState<string>('asst_UifyY02rKAgHGYxHfAPpmiRf');
  const [currentThreadId, setCurrentThreadId] = useState<string>('');
  const [currentClonedVocals, setCurrentClonedVocals] = useState<string>('');
  const [currentImageURL, setCurrentImageURL] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [systemMessages, setSystemMessages] = useAIState();
  const [messages, setMessages] = useUIState();
  const [input, setInput] = useState('');
  const { getAnswer, getClonedVocalsResponse, getFileResponse } = useActions();
  

  const createClonedAudioElement = async (clonedVocals: string) => {
    console.log(`Creating audio element for cloned vocals: ${clonedVocals.slice(0, 100)}`)
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: nanoid(),
        content: <div className="flex flex-col items-start w-full mt-3" id="playClonedVocalsGroup">
                    <p className="text-sm text-white ml-2 mb-1">Cloned Vocals:</p>
                    <audio controls className="w-full p-1 md:p-0" id="clonedAudioPlayer">
                      <source src={clonedVocals} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>,
                  </div>,
        role: 'assistant',
        threadId: currentThreadId,
      },
    ]);
  }
  
  const handleClonedVocalsSuccess = async (clonedVocals: string, transcriptionText: string) => {
    setCurrentClonedVocals(clonedVocals);
    try {
      const newThreadId = currentThreadId ? currentThreadId : await createThreadId();
      console.log(`Getting cloned vocals response with threadId: ${newThreadId} and assistantId: ${currentAssistantId} and transcriptionText: ${transcriptionText}`)
      const clonedVocalsResponse = await getClonedVocalsResponse(newThreadId, currentAssistantId, transcriptionText);
      setMessages((messages: ClientMessage[]) => [
        ...messages,
        clonedVocalsResponse,
      ]);
    } catch (error) {
      console.error(`Error getting cloned vocals response:`, error);
    }
    await createClonedAudioElement(clonedVocals);
  }

  const handleSTTInput = async (transcriptionText: string) => {
    let newThreadId = currentThreadId;
    if (!currentThreadId) {
      newThreadId = await createThreadId();
      setCurrentThreadId(newThreadId);
    }
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: nanoid(),
        content: transcriptionText,
        role: 'user',
        threadId: newThreadId,
      },
    ]);
    console.log(`Calling getAnswer with transcription: ${transcriptionText}, threadId: ${newThreadId}, and assistantId: ${currentAssistantId}`)
    const response = await getAnswer(transcriptionText, newThreadId, currentAssistantId);

    setMessages((messages: ClientMessage[]) => [
      ...messages,
      response,
    ]);

    setInput('');
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

  const handleImageFileChange = async (url: string) => {
    setIsUploading(true);
    setCurrentImageURL(url);
    // If the file is an image, convert it to base64 and set the current image URL
    let newThreadId = currentThreadId ? currentThreadId : await createThreadId();
    console.log(`Handling file change with threadId: ${newThreadId}`)
    let fileId = '';
    try {
      fileId = await uploadImageFile(url);
      console.log(`Image file uploaded: ${fileId}`)
      if (fileId) {
        try {
          const returnedThreadId = await createImageFileMessage(fileId, newThreadId);
          if (returnedThreadId !== newThreadId) {
            console.error(`Error creating file message: threadId mismatch.  Expected ${newThreadId}, received ${returnedThreadId}`);
          }
          console.log(`Returned thread id: ${returnedThreadId}.  Calling getFileResponse)`);
          const response = await getFileResponse(newThreadId, currentAssistantId);
          setMessages((messages: ClientMessage[]) => [
            ...messages,
            response,
          ]);
          setCurrentThreadId(returnedThreadId);
          setIsUploading(false);
        } catch (error) {
          console.error(`Error getting file response: ${error}`);
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error(`Error handling file change: ${error}`);
      setIsUploading(false);
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      let newThreadId = currentThreadId;
      if (!currentThreadId) {
        newThreadId = await createThreadId();
        setCurrentThreadId(newThreadId);
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('threadId', newThreadId);
      const fileId = await fetch('/api/uploadTextFile', {
        method: 'POST',
        body: formData,
      }).then((res) => res.json()).then((data) => console.log('File uploaded and message added'))
      console.log(`Calling getFileResponse with threadId: ${newThreadId}, assistantId: ${currentAssistantId}`)
      const response = await getFileResponse(newThreadId, currentAssistantId, fileId);
      setMessages((messages: ClientMessage[]) => [
        ...messages,
        response,
      ]);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
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
      <div className="flex flex-col items-center justify-center w-full max-w-4xl min-h-screen bg-zinc-50 px-6">
        <Image src="/artist_vault.png" alt="Artist Vault" width={300} height={300} className="mt-4" />
        {!messages?.length && !currentImageURL && (
          <WelcomeScreen />
        )}
        {currentImageURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImageURL} 
            alt="Uploaded image" 
            width={200} 
            height={200} 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg mb-4 place-self-center"
          />
        )}
        {isUploading && (
          <div className="flex flex-row justify-center items-center">
          <p className="text-[#124E78] font-bold text-md md:text-lg">Looking things over</p>
          <span className="ml-2 mt-2 loading loading-dots loading-md md:loading-lg text-[#124E78] text-md" />
        </div>
        )}
        <div className="w-full overflow-y-auto bg-zinc-50" style={{ height: 'calc(100vh - 200px)' }}>
          {messages?.map((message: ClientMessage) => (
            <div key={message.id}>{message.role === 'user' ? (
              <UserChatBubble message={message.content as string} />
            ) : (
              message.content
            )}
            </div>
          ))}
          {audioElement && (
            <div className="flex flex-col items-start w-full mt-3" id="playClonedVocalsGroup">
              <p className="text-sm text-white ml-2 mb-1">Cloned Vocals:</p>
              <audio controls className="w-full p-1 md:p-0" id="clonedAudioPlayer">
                <source src={audioElement.src} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
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
          <div className="flex flex-row md:ml-2 items-center justify-center mt-2 md:mt-0 bg-zinc-50 w-full md:w-min" id="chatMenuButtons">
            <div id="uploadFileButton">
              {isUploading ? 
                <span className="loading loading-spinner loading-md text-yellow-500"></span>
              : (
                <div id="fileUploadButtons" className="flex flex-row items-center">
                    <FileUploadButton onFileChange={handleFileUpload} />
                  <div id="imageFileUploadButton" hidden={isUploading}>
                    <ImageFileUploadButton onImageFileSuccess={handleImageFileChange} />
                  </div>
                </div>
              )}
            </div>
              <VocalCloneModal onCloneSuccess={handleClonedVocalsSuccess} />
              <AudioToText onRecordingEnd={handleSTTInput} />
          </div>
        </div>
      </div>
    </div>
  );
}