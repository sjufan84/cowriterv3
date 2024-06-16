// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function 
import { useUploadThing } from "../../../../../utils/uploadThing";
 
interface RecordFileComponentProps {
  audioFile: File,
  onFileUploadComplete: (fileURL: string) => void,
  onIsUploading: (isUploading: boolean) => void,
}

export default function RecordFileComponent({onFileUploadComplete, audioFile, onIsUploading} : RecordFileComponentProps) {

 
  const { startUpload } = useUploadThing(
    "audioUploader",
    {
      onClientUploadComplete: (res : any) => {
        console.log(`onClientUploadComplete`, res);
        onFileUploadComplete(res.filter((file: any) => file.type.includes('audio'))[0].url);
        console.log(`Url of the uploaded file: ${res.filter((file: any) => file.type.includes('audio'))[0].url}`)
      },
      onUploadError: () => {
        alert("error occurred while uploading");
      },
      onUploadBegin: () => {
        onIsUploading(true);
      },
    },
  );
 
  const fileTypes = ["audio/x-wav"];
 
  return (
    <div className="w-full px-1 mt-4">
      <button className="btn bg-[#17123D] text-[#fafafa] w-full md:text-lg" onClick={() => startUpload([audioFile])}>
        Clone Vocals
      </button>
    </div>
  );
}