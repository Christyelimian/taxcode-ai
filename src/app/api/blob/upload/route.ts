import { BlobUploadService } from "@/lib/blob-upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Blob upload API called");
    
    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not configured");
      return NextResponse.json({ error: "Server configuration error: BLOB_READ_WRITE_TOKEN is missing" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading file:", file.name, file.size, file.type);
    const service = new BlobUploadService(process.env.BLOB_READ_WRITE_TOKEN);
    const result = await service.uploadFile(file);
    console.log("Upload result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    
    // Provide more specific error responses
    if (error instanceof Error) {
      if (error.message.includes('No file provided')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes('File size')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes('image files')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: "Failed to upload file. Please check your internet connection and try again." }, { status: 500 });
  }
}