"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Mail, Smartphone, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return showToast("Please enter a valid email", "error");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Check your email for the magic link!", "success");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return showToast("Please enter a valid phone number", "error");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);

    if (error) {
      showToast(error.message, "error");
    } else {
      setOtpSent(true);
      showToast("OTP sent to your phone!", "success");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return showToast("Please enter the OTP", "error");

    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    setLoading(false);

    if (error) {
      showToast(error.message, "error");
    } else if (data.session) {
      showToast("Successfully verified!", "success");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">Sign in to InfluencerTrack.in</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-black/40 rounded-full p-1 mb-8 border border-white/5">
            <button
              onClick={() => { setAuthMode("email"); setOtpSent(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                authMode === "email" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => { setAuthMode("phone"); }}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                authMode === "phone" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Smartphone className="w-4 h-4" /> Phone
            </button>
          </div>

          {/* Forms */}
          {authMode === "email" ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Magic Link"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                />
              </div>
              
              {otpSent && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <label className="text-sm font-medium text-gray-300 ml-1">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all tracking-widest text-center text-lg"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : otpSent ? (
                  "Verify OTP"
                ) : (
                  "Send OTP"
                )}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              
              {otpSent && (
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-gray-500 hover:text-white transition-colors mt-4"
                >
                  Change phone number
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Custom Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50 ${
          toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
          toast.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" :
          "bg-blue-500/10 border-blue-500/20 text-blue-400"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
