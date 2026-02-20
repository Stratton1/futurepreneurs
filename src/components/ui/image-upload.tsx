'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  error?: string;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  label,
  error,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setUploadError(null);

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setUploadError(`Maximum ${maxImages} images allowed`);
        return;
      }

      const newImages: string[] = [];
      const filesToProcess = Array.from(files).slice(0, remaining);

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) {
          setUploadError('Only image files (JPEG, PNG, WebP) are allowed');
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('Each image must be under 5MB');
          continue;
        }

        // For now, create object URLs for preview. In production these will be Supabase Storage URLs.
        const url = URL.createObjectURL(file);
        newImages.push(url);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
            isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50'
          )}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              {isDragging ? (
                <ImageIcon className="h-8 w-8 text-emerald-500" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
              <div>
                <span className="text-sm font-medium text-emerald-600">Click to upload</span>
                <span className="text-sm text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-400">
                JPEG, PNG or WebP. Max 5MB each. Up to {maxImages} images.
              </p>
            </div>
          </label>
        </div>
      )}

      {(error || uploadError) && (
        <p className="mt-1.5 text-sm text-red-600">{error || uploadError}</p>
      )}
    </div>
  );
}
