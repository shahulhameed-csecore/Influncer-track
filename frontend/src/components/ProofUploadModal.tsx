"use client";

import React, { useState, useRef } from "react";
import { Loader2, UploadCloud, X, FileImage } from "lucide-react";
import { uploadCampaignProof } from "@/lib/supabaseClient";

interface ProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  onSuccess: () => void;
}

export function ProofUploadModal({ isOpen, onClose, campaignId, onSuccess }: ProofUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please select a valid image file (PNG, JPG, WebP).");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await uploadCampaignProof(campaignId, file);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to upload proof.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          disabled={isUploading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Upload Proof</h2>
          <p className="text-sm text-gray-400">
            Securely upload a screenshot to verify deliverables and mark this campaign as posted.
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-400 hover:bg-gray-800/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          {file ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <FileImage className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white max-w-[200px] truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300"
              }`}>
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or WebP (max. 10MB)</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload & Mark as Posted"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
