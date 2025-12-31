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
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are supported');
      }

      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;

      console.log('Uploading file:', filename, file.size, file.type);

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: 'public',
        token: this.token,
      });

      console.log('Upload successful:', blob.url);

      return {
        url: blob.url,
        filename: blob.pathname,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('No file provided')) {
          throw new Error('No file provided');
        }
        if (error.message.includes('File size')) {
          throw new Error('File size must be less than 10MB');
        }
        if (error.message.includes('image files')) {
          throw new Error('Only image files are supported');
        }
        if (error.message.includes('token')) {
          throw new Error('Invalid or missing BLOB_READ_WRITE_TOKEN');
        }
      }
      
      throw new Error('Failed to upload file. Please check your internet connection and try again.');
    }
  }

  // Note: Vercel Blob doesn't have deleteObject or getDownloadURL functions
  // The blob.url returned from put() is already the public URL
  // For deletion, you would need to use the REST API directly or a server action
}