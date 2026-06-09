"use client";

import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { AtSign, IndianRupee, Save, RefreshCcw, Loader2 } from "lucide-react";

interface CampaignReviewFormProps {
  initialData: Partial<Campaign>;
  onDiscard: () => void;
  onConfirm: (data: Partial<Campaign>) => Promise<void> | void;
}

export function CampaignReviewForm({ initialData, onDiscard, onConfirm }: CampaignReviewFormProps) {
  const [formData, setFormData] = useState<Partial<Campaign>>({
    influencer_handle: initialData.influencer_handle?.replace(/^@/, "") || "",
    platform: initialData.platform || "Instagram",
    agreed_deliverables: initialData.agreed_deliverables || "",
    deadline: initialData.deadline || "",
    cost: initialData.cost || 0,
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.influencer_handle || !formData.agreed_deliverables) {
      showToast("Please fill in the required fields.", "error");
      return;
    }
    
    // Add the @ symbol back for the handle if it was stripped
    const finalData = {
      ...formData,
      influencer_handle: `@${formData.influencer_handle}`,
    };
    
    setIsSaving(true);
    try {
      await onConfirm(finalData);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Review Extracted Data</h2>
            <p className="text-gray-400 text-sm">Please verify the details extracted by our AI before saving to the ledger.</p>
          </div>

          <div className="space-y-5">
            {/* Influencer Handle & Platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Influencer Handle</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={formData.influencer_handle}
                    onChange={(e) => setFormData({ ...formData, influencer_handle: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="influencer_name"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                  disabled={isSaving}
                >
                  <option value="Instagram" className="bg-gray-900">Instagram</option>
                  <option value="YouTube" className="bg-gray-900">YouTube</option>
                  <option value="X" className="bg-gray-900">X (Twitter)</option>
                  <option value="Other" className="bg-gray-900">Other</option>
                </select>
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Agreed Deliverables</label>
              <textarea
                value={formData.agreed_deliverables}
                onChange={(e) => setFormData({ ...formData, agreed_deliverables: e.target.value })}
                className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                placeholder="e.g. 1 Reel, 2 Stories with link in bio..."
                disabled={isSaving}
              />
            </div>

            {/* Deadline & Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Deadline</label>
                {/* Forcing color-scheme dark ensures the native date picker looks correct */}
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Total Cost</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IndianRupee className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="25000"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving}
                className="flex-1 px-4 py-3.5 rounded-xl font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                <RefreshCcw className="w-4 h-4" /> Discard & Restart
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-3.5 rounded-xl font-medium text-black bg-white hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:active:scale-100"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving Campaign...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Confirm & Save Campaign
                  </>
                )}
              </button>
            </div>
          </div>
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
