'use client';

import React, { useRef, useState, useId } from 'react';
import { UploadCloud, X, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string, file?: File | null) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUploader({
  value,
  onChange,
  label,
  placeholder = "Paste image URL or upload file..."
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploaderId = useId();
  const fileInputId = `file-input-${uploaderId}`;
  const urlInputId = `url-input-${uploaderId}`;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    onChange(blobUrl, file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onChange('', null);
  };

  return (
    <div className="space-y-3 w-full">
      {label && (
        <label
          htmlFor={value ? urlInputId : fileInputId}
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
        >
          {label}
        </label>
      )}

      {value ? (
        // Preview state
        <div className="relative rounded-xl border border-border bg-card/20 overflow-hidden group transition-all duration-300">
          <div className="h-44 w-full flex items-center justify-center bg-black/40 relative">
            <img
              src={value}
              alt="Uploaded preview"
              className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const sibling = (e.target as HTMLImageElement).nextElementSibling;
                if (sibling) sibling.classList.remove('hidden');
              }}
            />
            <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
              <ImageIcon className="w-8 h-8 mb-2" />
              <span className="text-xs">Preview unavailable</span>
            </div>

            {/* Overlays on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={triggerFileBrowser}
                className="border-white/20 text-white hover:bg-white/10"
                aria-label="Replace image"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={clearImage}
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Remove
              </Button>
            </div>
          </div>

          {/* Quick Toggle URL Edit */}
          <div className="p-2 border-t flex items-center justify-between bg-muted/10 text-xs">
            <span className="truncate text-muted-foreground max-w-[80%] font-mono">
              {value.startsWith('blob:') ? 'Pending Upload (Client Preview)' : value}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="h-6 text-champagne-gold hover:text-champagne-gold/80 p-1"
              aria-label={showUrlInput ? 'Hide URL input' : 'Edit URL text'}
            >
              {showUrlInput ? 'Hide URL' : 'Edit URL'}
            </Button>
          </div>

          {showUrlInput && (
            <div className="p-3 border-t bg-muted/20 animate-in slide-in-from-top-1 duration-200">
              <Input
                id={urlInputId}
                value={value}
                onChange={(e) => onChange(e.target.value, null)}
                placeholder="https://..."
                className="text-xs font-mono"
                aria-label="Image URL source path"
              />
            </div>
          )}
        </div>
      ) : (
        // Upload/Drag-and-drop state
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileBrowser}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerFileBrowser();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={label ? `Upload image for ${label}` : "Upload image drag and drop area"}
          className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:border-champagne-gold focus-visible:ring-1 focus-visible:ring-champagne-gold/20 ${
            dragActive
              ? 'border-champagne-gold bg-champagne-gold/5'
              : 'border-champagne-gold/30 hover:border-champagne-gold/40 bg-card/20'
          }`}
        >
          <input
            type="file"
            id={fileInputId}
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-champagne-gold/10 border border-champagne-gold/20 flex items-center justify-center text-champagne-gold">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Drag & drop image, or <span className="text-champagne-gold">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPEG, PNG, WEBP, GIF (Max 10MB)
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              className="text-xs text-champagne-gold/80 hover:text-champagne-gold mt-2 underline flex items-center cursor-pointer"
              aria-label="Toggle direct URL address input field"
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              Or enter image URL instead
            </button>
          </div>
        </div>
      )}

      {!value && showUrlInput && (
        <div className="flex items-center space-x-2 animate-in slide-in-from-top-1 duration-200">
          <Input
            id={urlInputId}
            value={value}
            onChange={(e) => onChange(e.target.value, null)}
            placeholder={placeholder}
            className="text-xs"
            aria-label="Direct image URL input"
          />
        </div>
      )}
    </div>
  );
}
