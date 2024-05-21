import React from 'react'
import { FiPaperclip } from "react-icons/fi";
import { acceptedFileTypes } from './helperFunctions/fileHelpers';

interface FileUploadButtonProps {
  onFileChange: (file : File) => void
}

const FileUploadButton = ({ onFileChange } : FileUploadButtonProps) => {
  return (
    <div id="uploadFileButton" className="tooltip" data-tip="Upload File">
      <label className="flex items-center justify-center w-12 h-12 bg-transparent text-[#17123D] rounded-full cursor-pointer">
        <FiPaperclip className="w-6 h-6 hover:text-red-800" />
        <input type="file" accept={acceptedFileTypes.join(',')} className="hidden" onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            onFileChange(file);
          }
        }} />
      </label>
    </div>
  )
}

export default FileUploadButton
