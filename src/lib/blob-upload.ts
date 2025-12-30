import { put } from '@vercel/blob';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export class BlobUploadService {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
    if (!this.token) {
      throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
    }
  }

  async uploadFile(file: File): Promise<UploadResult> {
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: 'public',
        token: this.token,
      });

      return {
        url: blob.url,
        filename: blob.pathname,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Note: Vercel Blob doesn't have deleteObject or getDownloadURL functions
  // The blob.url returned from put() is already the public URL
  // For deletion, you would need to use the REST API directly or a server action
}