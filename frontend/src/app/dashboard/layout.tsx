"use client";
import { Search, Bell, LayoutDashboard, Megaphone, ReceiptText, Settings, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Campaigns", icon: Megaphone, href: "/dashboard/campaigns" },
    { name: "Ledger", icon: ReceiptText, href: "/dashboard/ledger" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Top Navigation (Mobile & Desktop) */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 md:hidden">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-xl tracking-tight">
          <Activity className="w-6 h-6" />
          <span>InfluencerTrack.in</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <Search className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <div className="relative cursor-pointer hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#0a0a0a]">
              2
            </span>
          </div>
        </div>
      </header>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0a0a0a]/50 p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-xl tracking-tight mb-12">
          <Activity className="w-6 h-6" />
          <span>InfluencerTrack.in</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Desktop Top Nav elements (Search/Bell) that aren't in sidebar can go here if needed, 
            but for the mockup, they were at the top. We'll add them to the top of the main area for desktop. */}
        <div className="hidden md:flex items-center justify-end px-8 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30">
           <div className="flex items-center gap-6 text-gray-400">
              <Search className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <div className="relative cursor-pointer hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#0a0a0a]">
                  2
                </span>
              </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 pb-safe pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-2 ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? "text-blue-500" : ""}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
