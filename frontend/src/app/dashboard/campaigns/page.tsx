"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IngestCard } from "@/components/IngestCard";
import { CampaignReviewForm } from "@/components/CampaignReviewForm";
import { Campaign } from "@/types/campaign";
import { supabase } from "@/lib/supabaseClient";

export default function CampaignsPage() {
  const [extractedData, setExtractedData] = useState<Partial<Campaign> | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: "success" | "error") => {
    // Basic toast alert for the page level
    const toastEl = document.createElement("div");
    toastEl.className = `fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[100] ${
      type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
      "bg-green-500/10 border-green-500/20 text-green-400"
    }`;
    toastEl.innerText = message;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 4000);
  };

  const getOrCreateBrandId = async (userId: string) => {
    const { data: brands, error: fetchError } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    if (fetchError) throw fetchError;

    if (brands && brands.length > 0) {
      return brands[0].id;
    }

    // Failsafe: Create a new brand
    const { data: newBrand, error: insertError } = await supabase
      .from("brands")
      .insert([{ user_id: userId, name: "My Brand" }])
      .select("id")
      .single();

    if (insertError) throw insertError;
    return newBrand.id;
  };

  const saveCampaignToDatabase = async (finalData: Partial<Campaign>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Authentication required.");

      const brandId = await getOrCreateBrandId(user.id);

      const { error: insertError } = await supabase
        .from("campaigns")
        .insert([{
          brand_id: brandId,
          influencer_handle: finalData.influencer_handle,
          platform: finalData.platform,
          agreed_deliverables: finalData.agreed_deliverables,
          deadline: finalData.deadline,
          cost: finalData.cost,
          status: "Pending"
        }]);

      if (insertError) throw insertError;

      showToast("Campaign successfully added to ledger!", "success");
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Save Error:", error);
      showToast(error.message || "Failed to save campaign.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">
          Data Ingestion
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Automatically extract deliverables, deadlines, and costs from unstructured text or screenshots.
        </p>
      </div>

      <div className="pt-4">
        {!extractedData ? (
          <IngestCard onExtractSuccess={setExtractedData} />
        ) : (
          <CampaignReviewForm
            initialData={extractedData}
            onDiscard={() => setExtractedData(null)}
            onConfirm={saveCampaignToDatabase}
          />
        )}
      </div>
    </div>
  );
}
