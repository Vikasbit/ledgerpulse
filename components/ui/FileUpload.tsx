// components/ui/FileUpload.tsx
import React, { useState, useCallback, DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

type FileUploadProps = {
  accept?: string;
  maxSize?: number; // bytes
  onFileSelect: (file: File) => void;
  className?: string;
};

export const FileUpload = ({ accept = ".csv", maxSize = 5 * 1024 * 1024, onFileSelect, className }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
      const file = files[0];
      if (!file) return;
      if (accept && !file.name.endsWith(accept)) {
        setError(`Invalid file type. Expected ${accept}`);
        return;
      }
      if (maxSize && file.size > maxSize) {
        setError(`File exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)} MB`);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [accept, maxSize, onFileSelect]
  );

  const onDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-[var(--radius)] p-6 text-center cursor-pointer",
        dragActive ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5" : "border-gray-300",
        className
      )}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
      onClick={openFileDialog}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={accept}
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
      <Upload className="mx-auto mb-2 text-gray-500" size={48} />
      <p className="text-sm text-gray-600">Drag & drop a CSV file here, or click to browse</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};
