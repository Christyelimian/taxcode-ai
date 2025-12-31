'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, AlertCircle } from 'lucide-react';

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface ImageUploadProps {
  onUpload: (result: UploadResult) => void;
  onRemove?: () => void;
  currentImage?: string;
  maxSize?: number; // in bytes, default 5MB
  accept?: string; // file types, default images
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/*'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/blob/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const result: UploadResult = await response.json();
      onUpload(result);
    } catch (err) {
      console.error('Upload error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to upload image. Please check your internet connection and try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemove = () => {
    setError(null);
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            Dismiss
          </Button>
        </div>
      )}

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              console.error('Image failed to load:', currentImage);
              setError('Failed to load image. The file may have been deleted.');
            }}
          />
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              Drag and drop an image here, or click to select a file
            </div>
            <div className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="image-upload-input"
        />
        <Button
          variant="outline"
          disabled={isUploading}
          className="w-full"
          onClick={() => {
            if (!isUploading) {
              const input = document.getElementById('image-upload-input') as HTMLInputElement;
              if (input) {
                input.click();
              }
            }
          }}
        >
          {isUploading ? 'Uploading...' : 'Choose Image'}
        </Button>
      </div>

      {isUploading && (
        <Progress value={uploadProgress} className="w-full" />
      )}
    </div>
  );
}