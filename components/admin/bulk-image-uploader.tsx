'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface SelectedFile {
  url: string;
  file: File;
}

interface BulkImageUploaderProps {
  onFilesSelected: (files: SelectedFile[]) => void;
}

export function BulkImageUploader({ onFilesSelected }: BulkImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Only image files are allowed');
      return;
    }

    const selected: SelectedFile[] = fileArray.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    onFilesSelected(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
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
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileBrowser}
      className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 ${
        dragActive
          ? 'border-amber-500 bg-amber-500/5'
          : 'border-[#c4a484]/30 hover:border-amber-500/40 bg-card/20'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="flex flex-col items-center space-y-1.5">
        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <UploadCloud className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">
            Drag & drop multiple images here, or <span className="text-amber-500">browse</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Select or drop multiple product photos at once (Max 10MB per file)
          </p>
        </div>
      </div>
    </div>
  );
}
