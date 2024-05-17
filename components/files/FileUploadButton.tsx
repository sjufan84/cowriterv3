import React from 'react'
import { FiPaperclip } from "react-icons/fi";
import { acceptedFileTypes } from './helperFunctions/fileHelpers';

interface FileUploadButtonProps {
  currentFile? : File,
  onFileChange: (file : File) => void
}

const FileUploadButton = ({ currentFile, onFileChange } : FileUploadButtonProps) => {
  
  const [file, setFile] = React.useState<File | null>(currentFile as File | null);
  return (
    <div id="uploadFileButton" className="tooltip" data-tip="Upload File">
      <label className="flex items-center justify-center w-12 h-12 bg-transparent text-[#124E78] hover:text-[#54ad9c] rounded-full cursor-pointer">
        <FiPaperclip className="w-6 h-6 hover:text-[#54ad9c]" />
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