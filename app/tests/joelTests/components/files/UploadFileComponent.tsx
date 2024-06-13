import React from 'react'
import { UploadButton } from "../../../../../utils/uploadThing";

interface UploadAudioFileComponentProps {
  onAudioFileUpload: (fileURL: string) => void
}

const UploadAudioFileComponent = ({ onAudioFileUpload }: UploadAudioFileComponentProps) => {

  return (
    <div className="flex flex-col w-full items-center mt-4">
      <label className="form-control w-full flex flex-col items-center">
        <div className="label">
          <span className="label-text font-semibold text-black">*.wav files</span>
        </div>
        <UploadButton
          /**
           * @see https://docs.uploadthing.com/api-reference/react#uploadbutton
           */
          className="mt-2 w-full"
          appearance={{button: {color: '#fafafa', backgroundColor: '#17123D', width: 230}}}
          endpoint="audioUploader"
          onClientUploadComplete={(res : any) => {
            console.log(`onClientUploadComplete`, res);
            onAudioFileUpload(res.filter((file: any) => file.type.includes('audio'))[0].url);
            console.log(`Url of the uploaded file: ${res.filter((file: any) => file.type.includes('audio'))[0].url}`)
          }}
          content={
            {allowedContent() {
              return 'wav';
            }}
          }
          onUploadBegin={() => {
            console.log("upload begin");
          }}
          config={{ appendOnPaste: true, mode: "manual" }}
        />
      </label>
    </div>
  )
}

export default UploadAudioFileComponent