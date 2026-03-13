"use client";

import { useState, useRef } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";

export default function ImageUploader({ folder = "general", onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url && onUpload) {
        onUpload(data);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        dragOver ? "border-primary bg-primary/5" : "border-zinc-300 hover:border-primary/50 hover:bg-zinc-50"
      }`}
    >
      <HiOutlineCloudUpload size={32} className={`${uploading ? "animate-bounce" : ""} text-zinc-400`} />
      <div>
        <p className="text-sm font-medium text-zinc-700">
          {uploading ? "Uploading..." : "Click or drag images here"}
        </p>
        <p className="mt-1 text-xs text-zinc-400">PNG, JPG, WEBP up to 10MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
