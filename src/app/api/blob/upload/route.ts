import { BlobUploadService } from "@/lib/blob-upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Blob upload API called");
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading file:", file.name, file.size);
    const service = new BlobUploadService(process.env.BLOB_READ_WRITE_TOKEN!);
    const result = await service.uploadFile(file);
    console.log("Upload result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}