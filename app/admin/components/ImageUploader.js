"use client";

import { useState, useRef } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024; // 4MB (Vercel Hobby limit)

function compressImage(file, maxSizeMB = 3.8, minSizeMB = 1.2) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Only scale down if image is extremely large
      const maxDimension = 4500;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const maxBytes = maxSizeMB * 1024 * 1024;
      const minBytes = minSizeMB * 1024 * 1024;
      let quality = 0.92;

      const tryCompress = () => {
        canvas.toBlob(
          (result) => {
            // Stop if under max OR if we'd go below minimum quality threshold
            if (result.size <= maxBytes || quality <= 0.6 || result.size <= minBytes) {
              const compressed = new File([result], file.name, {
                type: "image/jpeg",
                lastModified: file.lastModified,
              });
              resolve(compressed);
            } else {
              quality -= 0.05;
              tryCompress();
            }
          },
          "image/jpeg",
          quality
        );
      };

      tryCompress();
    };

    img.src = url;
  });
}

export default function ImageUploader({ folder = "general", onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      setStatus(`Processing ${i + 1}/${files.length}...`);

      // Compress if over 4MB
      if (file.size > MAX_UPLOAD_SIZE) {
        setStatus(`Compressing ${file.name}...`);
        file = await compressImage(file);
      }

      setStatus(`Uploading ${i + 1}/${files.length}...`);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (data.url && onUpload) {
          onUpload(data);
        } else if (data.error) {
          alert(`Upload failed: ${data.error}`);
        }
      } catch {
        alert(`Failed to upload "${file.name}". Please try again.`);
      }
    }

    setStatus("");
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
          {uploading ? status || "Uploading..." : "Click or drag images here"}
        </p>
        <p className="mt-1 text-xs text-zinc-400">PNG, JPG, WEBP — auto-compressed for fast upload</p>
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
