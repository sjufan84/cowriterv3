import React from 'react'
import { UploadButton } from "../../../utils/uploadThing";
import { IoCloseSharp } from "react-icons/io5";

interface UploadThingModalProps {
  onImageFileSuccess: (url: string) => void;
}
const ImageUploadthingModal = ({ onImageFileSuccess }: UploadThingModalProps) => {

  return (
    <div>
      <div className="modal-box">
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-circle text-black bg-transparent hover:bg-transparent border-none hover:border-none fixed top-0 right-0">
              <IoCloseSharp className="w-6 h-6" />
            </button>
          </form>
        </div>
        <p className="font-semibold mb-2">Upload an image of handwritten lyrics, an inspirational photo, music sheets, etc. to chat with Cowriter about.</p>
        <UploadButton
          /**
           * @see https://docs.uploadthing.com/api-reference/react#uploadbutton
           */
          className='place-self-end'
          appearance={{button: {color: 'white', backgroundColor: '#17123D', border: '#124E78'}}}
          endpoint="imageUploader"
          onClientUploadComplete={(res: any[]) => {
            console.log(`onClientUploadComplete`, res);
            onImageFileSuccess(res.filter((file: { type: string | string[]; }) => file.type.includes('image'))[0].url);
          }}
          content={
            {allowedContent() {
              return 'jpeg, jpg, png, gif, webp'
            }}
          }
          onUploadBegin={() => {
            console.log("upload begin");
          }}
          config={{ appendOnPaste: true, mode: "manual" }}
        />
      </div>
    </div>
  )
}

export default ImageUploadthingModal