"use client";

import { useState, useRef } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";

export default function ImageUploader({ folder = "general", onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef(null);

  const uploadToCloudinary = async (file, folder) => {
    // Step 1: Get signature from our server (tiny JSON request)
    const sigRes = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });

    if (!sigRes.ok) {
      const errData = await sigRes.json().catch(() => ({}));
      throw new Error(errData.error || `Server error ${sigRes.status}`);
    }

    const { signature, timestamp, folder: cloudFolder, apiKey, cloudName } = await sigRes.json();

    if (!signature) throw new Error("Failed to get upload signature");

    // Step 2: Upload directly to Cloudinary (no size limit)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("folder", cloudFolder);
    formData.append("api_key", apiKey);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await uploadRes.json();

    if (result.error) throw new Error(result.error.message);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      width: result.width,
      height: result.height,
    };
  };

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 10 * 1024 * 1024) {
        alert(`"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`);
        continue;
      }

      setStatus(`Uploading ${i + 1}/${files.length}...`);

      try {
        const data = await uploadToCloudinary(file, folder);

        if (data.url && onUpload) {
          onUpload(data);
        }
      } catch (err) {
        alert(`Upload failed for "${file.name}": ${err.message}`);
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
        <p className="mt-1 text-xs text-zinc-400">PNG, JPG, WEBP up to 10MB — full resolution</p>
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
