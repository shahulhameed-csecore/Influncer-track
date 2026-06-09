"use client";

import { useState, useRef } from "react";
import { ImagePlus, Type, Loader2, ArrowRight, X, FileImage } from "lucide-react";

export function IngestCard({ onExtractSuccess }: { onExtractSuccess: (data: any) => void }) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "upload" && !file) return showToast("Please select a screenshot first.", "error");
    if (activeTab === "paste" && !text.trim()) return showToast("Please paste conversation text.", "error");

    setLoading(true);
    const formData = new FormData();
    if (activeTab === "upload" && file) {
      formData.append("file", file);
    } else if (activeTab === "paste" && text) {
      formData.append("text", text);
    }

    try {
      const response = await fetch("http://localhost:8000/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw JSON response:", data);
      showToast("Extraction successful! Let's review the details.", "success");
      
      // Pass data up to parent
      onExtractSuccess(data);
    } catch (error) {
      console.error("Extraction error:", error);
      showToast("Extraction failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Add Campaign</h2>
            <p className="text-gray-400 text-sm">Upload a screenshot or paste conversation text to auto-extract details.</p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-black/50 rounded-xl p-1 mb-6 border border-white/5">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "upload" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <ImagePlus className="w-4 h-4" /> Upload Screenshot
            </button>
            <button
              onClick={() => setActiveTab("paste")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "paste" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Type className="w-4 h-4" /> Paste Conversation
            </button>
          </div>

          {/* Ingestion Areas */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "upload" ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {!file ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5 hover:scale-[1.02] group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-white font-medium mb-1">Click to browse or drag and drop</p>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="border border-white/10 rounded-2xl p-6 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <FileImage className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                        <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste WhatsApp/DM text here..."
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (activeTab === "upload" && !file) || (activeTab === "paste" && !text)}
              className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Extracting...
                </>
              ) : (
                <>
                  Extract Campaign Details <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Custom Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[100] ${
          toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
          "bg-green-500/10 border-green-500/20 text-green-400"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
