'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';

interface MultipleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
}

export default function MultipleImageUpload({ 
  value = [], 
  onChange, 
  maxImages = 10,
  label = "Photos"
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetIndex = index !== undefined ? index : value.length;
    setUploading(true);
    setUploadingIndex(targetIndex);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
        alert(errorMessage);
        return;
      }

      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        alert('Upload failed: Invalid server response');
        return;
      }

      if (data.success) {
        const newUrls = [...value];
        if (index !== undefined) {
          newUrls[index] = data.url;
        } else {
          newUrls.push(data.url);
        }
        onChange(newUrls);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.message || 'Please try again.'));
    } finally {
      setUploading(false);
      setUploadingIndex(null);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-secondary-blue">
        {label} {value.length > 0 && `(${value.length}/${maxImages})`}
      </label>
      
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                <Image
                  src={url}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
                {uploadingIndex === index && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white">Uploading...</div>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  disabled={uploading}
                  className="hidden"
                  id={`photo-replace-${index}`}
                />
                <label
                  htmlFor={`photo-replace-${index}`}
                  className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer underline"
                >
                  Replace
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="inline-flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-secondary-blue transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {uploading ? 'Uploading...' : `Add Photo (${value.length}/${maxImages})`}
            </span>
          </label>
        </div>
      )}

      {!canAddMore && (
        <p className="text-sm text-gray-500">
          Maximum {maxImages} photos allowed. Remove a photo to add more.
        </p>
      )}
    </div>
  );
}



