import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);

    return { message: err.message };
  },
});
  
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "32MB" } })
  
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("metadata", metadata);
      console.log("file url", file.url);
      return { metadata, file };
    }),

  textUploader: f({ 
    "application/pdf": { maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "16MB" },
    "text/plain": { maxFileSize: "16MB" },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("metadata", metadata);
      console.log("file url", file.url);
      return { metadata, file, fileType: "text" };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;