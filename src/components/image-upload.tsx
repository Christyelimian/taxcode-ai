'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X } from 'lucide-react';
import { blobUploadService, UploadResult } from '@/lib/blob-upload';

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
      const result = await blobUploadService.uploadFile(file);
      onUpload(result);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border"
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
        <label htmlFor="image-upload-input">
          <Button
            variant="outline"
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Choose Image'}
          </Button>
        </label>
      </div>

      {isUploading && (
        <Progress value={uploadProgress} className="w-full" />
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}