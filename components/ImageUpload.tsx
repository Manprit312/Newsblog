'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Check if response is OK
      if (!response.ok) {
        // Try to parse as JSON, but handle HTML error pages
        let errorMessage = 'Upload failed';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            // If it's not JSON (HTML error page), get status text
            errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
        alert(errorMessage);
        return;
      }

      // Parse JSON response - ensure it's valid JSON
      let data;
      try {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text.substring(0, 200));
          alert('Upload failed: Server returned invalid response format');
          return;
        }
        
        const text = await response.text();
        if (!text || text.trim().length === 0) {
          console.error('Empty response from server');
          alert('Upload failed: Empty response from server');
          return;
        }
        
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        alert('Upload failed: Invalid JSON response from server. Please try again.');
        return;
      }

      if (data.success) {
        setPreview(data.url);
        onChange(data.url);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.message || 'Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-secondary-blue">
        Featured Image
      </label>
      {preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange('');
            }}
            className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-block bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </label>
        </div>
      )}
    </div>
  );
}












