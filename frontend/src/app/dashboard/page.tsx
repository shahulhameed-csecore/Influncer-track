"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Campaign, CampaignStatus } from "@/types/campaign";
import { Megaphone, CheckCircle, Upload, ArrowRight, Video, Camera, AlertCircle, CalendarDays } from "lucide-react";
import { ProofUploadModal } from "@/components/ProofUploadModal";

export default function DashboardPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCampaigns(data || []);
    } catch (err: any) {
      console.error("Error fetching campaigns:", err);
      showToast(err.message, "info");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case "Posted":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Overdue":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Issue":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const PlatformIcon = ({ platform }: { platform: string }) => {
    if (platform === "Instagram") return <Camera className="w-4 h-4 text-pink-500 inline mr-1" />;
    if (platform === "YouTube") return <Video className="w-4 h-4 text-red-500 inline mr-1" />;
    return <AlertCircle className="w-4 h-4 text-blue-500 inline mr-1" />;
  };

  const activeCampaignsCount = campaigns.filter(c => c.status === 'Pending' || c.status === 'Issue').length;
  const totalSpend = campaigns.reduce((acc, c) => acc + (c.cost || 0), 0);
  
  const todayStr = new Date().toISOString().split("T")[0];
  const overdueCount = campaigns.filter(c => 
    c.status === 'Overdue' || 
    (c.status !== 'Posted' && c.deadline && c.deadline < todayStr)
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">
          Good Morning, Admin
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Here's what's happening today.
        </p>
      </div>

      {/* Quick Metrics */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        <div className="min-w-[140px] flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
            <Megaphone className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Active</p>
            <p className="text-2xl font-bold text-white">{activeCampaignsCount}</p>
          </div>
        </div>
        <div className="min-w-[140px] flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <span className="text-emerald-400 font-bold text-lg">₹</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Spend</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalSpend)}</p>
          </div>
        </div>
        <div className="min-w-[140px] flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <CalendarDays className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Overdue</p>
            <p className="text-2xl font-bold text-white">{overdueCount}</p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Campaign Ledger</h2>
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {/* Skeleton table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="h-6 bg-white/10 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded"></div>
              ))}
            </div>
          </div>
          {/* Skeleton mobile */}
          <div className="md:hidden space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-40"></div>
            ))}
          </div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/5 border border-white/10 rounded-2xl text-center px-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No campaigns tracked yet.</h3>
          <p className="text-gray-400 mb-6 max-w-sm">Start your first campaign by ingesting a screenshot or pasting conversation text.</p>
          <Link href="/dashboard/campaigns" className="bg-white text-black font-semibold rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98]">
            <Upload className="w-4 h-4" /> Ingest First Campaign
          </Link>
        </div>
      ) : (
        <>
          {/* Responsive Ledger */}
          {/* Mobile View (< md) */}
          <div className="md:hidden space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={campaign.avatar_url || `https://i.pravatar.cc/150?u=${campaign.influencer_handle?.replace('@', '')}`}
                      alt={campaign.influencer_handle}
                      className="w-10 h-10 rounded-full border border-white/20 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white leading-tight">{campaign.influencer_handle}</h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <PlatformIcon platform={campaign.platform} />
                        <span className="truncate max-w-[160px] inline-block align-bottom">{campaign.agreed_deliverables}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 mb-5 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Due Date</p>
                    <p className={`text-sm font-medium ${campaign.status === 'Overdue' || (campaign.status !== 'Posted' && campaign.deadline && campaign.deadline < todayStr) ? 'text-red-400' : 'text-gray-200'}`}>
                      {campaign.deadline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Amount</p>
                    <p className="text-sm font-bold text-blue-400">
                      {formatCurrency(campaign.cost || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => showToast(`Marked ${campaign.influencer_handle} as posted!`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark as Posted
                  </button>
                  <button
                    onClick={() => setSelectedCampaignId(campaign.id)}
                    className="w-11 h-11 flex items-center justify-center border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all active:scale-[0.95]"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (>= md) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-black/40 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wide">Influencer</th>
                  <th className="px-6 py-4 font-medium tracking-wide">Deliverables</th>
                  <th className="px-6 py-4 font-medium tracking-wide">Status</th>
                  <th className="px-6 py-4 font-medium tracking-wide">Due Date</th>
                  <th className="px-6 py-4 font-medium tracking-wide">Amount</th>
                  <th className="px-6 py-4 font-medium tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={campaign.avatar_url || `https://i.pravatar.cc/150?u=${campaign.influencer_handle?.replace('@', '')}`}
                          alt={campaign.influencer_handle}
                          className="w-8 h-8 rounded-full border border-white/20 object-cover"
                        />
                        <span className="font-medium text-white">{campaign.influencer_handle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 flex items-center max-w-[250px] truncate">
                      <PlatformIcon platform={campaign.platform} />
                      <span className="truncate ml-1">{campaign.agreed_deliverables}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${campaign.status === 'Overdue' || (campaign.status !== 'Posted' && campaign.deadline && campaign.deadline < todayStr) ? 'text-red-400 font-medium' : 'text-gray-300'}`}>
                      {campaign.deadline}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-400">
                      {formatCurrency(campaign.cost || 0)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => showToast(`Marked ${campaign.influencer_handle} as posted!`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 active:scale-[0.95]"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Posted
                        </button>
                        <button
                          onClick={() => setSelectedCampaignId(campaign.id)}
                          className="p-1.5 border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all active:scale-[0.95]"
                          title="Upload Proof"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed bottom-20 md:bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[60] ${
          toast.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" :
          "bg-blue-500/10 border-blue-500/20 text-blue-400"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Proof Upload Modal */}
      <ProofUploadModal
        isOpen={selectedCampaignId !== null}
        onClose={() => setSelectedCampaignId(null)}
        campaignId={selectedCampaignId || ""}
        onSuccess={() => {
          setSelectedCampaignId(null);
          showToast("Proof secured! Campaign marked as Posted.", "success");
          fetchCampaigns();
        }}
      />
    </div>
  );
}
