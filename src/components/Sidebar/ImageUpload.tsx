import React, { useRef } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";

interface ImageUploadProps {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({
  uploadedImage,
  setUploadedImage,
  onUpload,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag and drop explicitly if needed, but the simple click is often enough.
  // For compactness on 13" screen, we'll keep the height moderate: h-40 instead of h-48?

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${
        uploadedImage
          ? "border-blue-500 bg-slate-50 dark:bg-slate-900"
          : "border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onUpload}
      />

      {uploadedImage ? (
        <div className="relative w-full h-full group/image">
          <Image
            src={uploadedImage}
            alt="Uploaded"
            fill
            className="object-contain p-2"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadedImage(null);
              }}
              className="p-2 bg-white rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors shadow-lg"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
            <Upload className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Upload Reference
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Drag & drop or click
          </p>
        </div>
      )}
    </div>
  );
}
