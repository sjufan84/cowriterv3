import React from 'react'
import ImageUploadthingModal from "./ImageUploadModal"
import { MdCamera } from "react-icons/md";

interface ImageFileUploadButtonProps {
  onImageFileSuccess: (url: string) => void;
}

{/* Open the modal using document.getElementById('ID').showModal() method */}
export default function ImageFileUploadButton({ onImageFileSuccess }: ImageFileUploadButtonProps) {

  const handleImageSuccess = (url: string) => {
    onImageFileSuccess(url);
  }

  return (
    <div className="tooltip" data-tip="Upload Image">
      <button className="btn btn-circle bg-transparent hover:bg-transparent border-none hover:border-none" onClick={() => (document.getElementById('imageFileUploadModal') as HTMLDialogElement)?.showModal()}>
        <MdCamera className="w-7 h-7 hover:text-red-900" />
      </button>
      <dialog id="imageFileUploadModal" className="modal modal-bottom sm:modal-middle">
        <ImageUploadthingModal onImageFileSuccess={handleImageSuccess} />
      </dialog>
    </div>
  )
}