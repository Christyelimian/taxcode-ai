import { put, getDownloadURL, deleteObject } from '@vercel/blob';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export class BlobUploadService {
  private readonly token: string;

  constructor() {
    this.token = process.env.BLOB_READ_WRITE_TOKEN || '';
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

  async deleteFile(filename: string): Promise<void> {
    try {
      await deleteObject(filename, {
        token: this.token,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getDownloadUrl(filename: string): Promise<string> {
    try {
      const url = await getDownloadURL(filename, {
        token: this.token,
      });
      return url;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error('Failed to get download URL');
    }
  }
}

export const blobUploadService = new BlobUploadService();