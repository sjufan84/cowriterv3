import React from 'react'

interface UploadFileComponentProps {
  onFileUpload: (file: File) => void
}

const UploadFileComponent = ({ onFileUpload }: UploadFileComponentProps) => {

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="flex flex-col w-full items-center mt-4">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">*.wav Files for Best Results</span>
        </div>
        <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileUpload} accept=".wav" />
      </label>
    </div>
  )
}

export default UploadFileComponent