import React from 'react'

const WelcomeScreen = () => {
  return (
    <div id="welcome-screen">
      <h1 className="text-3xl font-bold mb-8">Welcome to Cowriter! Here are a few tips to get you started:</h1>
      <ul className="list-disc">
        <li className="mb-6">
        Cowriter is set up to embody an artist named Joel engaging in a co-writing session with you.  It has been given various &quot;tools&quot; to simulate the experience as fluidly as possible.
        </li>
        <li className="mb-6">
          By clicking on the voice icon on the far right of the bottom bar, you can use the voice-to-text feature to generate your responses without having to type.
        </li>
        <li className="mb-6">
          By clicking the microphone icon, you can record vocals that will then be cloned by Joel&apos;s melodic voiceprint.  Cowriter will be &quot;told&quot; that you have sent vocals to be cloned and receive a transcription of the recording.Note that the first clone may be slow, but subsequent ones should be faster.
        </li>
        <li className="mb-6">
          You can upload documents via the paperclip icon that Cowriter can then use as context for the chat.  This could be lyrics, notes, journal entries, etc. that you want to talk about.  Cowriter will retain these documents for reference both for this and future interactions, up to 10,000 documents.
        </li>
        <li className="mb-6">
          You can click on the camera icon to upload images for Cowriter to look over.  This could be anything from a picture of a songwriting session, a piece of art, a photo of a place you are writing about, etc.
        </li>
        <li className="mb-6">
          Cowriter has been given a tool to generate text prompts for a music generation model.  While a truly fluid interaction with text to music requires a large amount of compute (which we will be gaining access to via Nvidia&apos;s Inception program), it is currently not viable to implement without considerable latency.  You will, however, be able to see the prompt that Cowriter generates based on your conversation, which is a fascinating window into the possibities moving forward.
        </li>
      </ul>
      <p className="text-md font-semibold">While still in its early stages, we believe that Cowriter provides the foundation for really exciting possibilities as this technology evolves, and we hope that you enjoy it as much as we do!</p>
    </div>
  )
}

export default WelcomeScreen

