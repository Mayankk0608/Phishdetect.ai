import React, { useState, useEffect } from "react";
import { AnalysisResult } from "./types";
import { Dashboard } from "./components/Dashboard";
import { History } from "./components/History";
import { AiInsights } from "./components/AiInsights";
import { SystemMonitor } from "./components/SystemMonitor";
import { AuditLog } from "./components/AuditLog";
import { Settings } from "./components/Settings";
import { OperatorBadge } from "@/components/ui/TrustSignal";
import {
  ShieldAlert,
  Database,
  Cpu,
  Fingerprint,
  Settings as SettingsIcon,
  LogOut,
  Loader2,
  Bell,
  ShieldCheck,
  Wifi,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "history"
  | "insights"
  | "monitor"
  | "audit"
  | "settings";

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "history", label: "Audit Database", icon: <Database className="w-4 h-4" /> },
  { id: "insights", label: "AI Insights", icon: <ShieldAlert className="w-4 h-4" /> },
  { id: "monitor", label: "System Monitor", icon: <Cpu className="w-4 h-4" /> },
  { id: "audit", label: "Security Audits", icon: <Fingerprint className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon className="w-4 h-4" /> },
];

const SESSION_DATA = {
  operatorName: "J. Doe",
  role: "responder" as const,
  sessionId: "sess_9f3a",
  privilegeLevel: "TIER_3",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/history");
        const payload = await res.json();
        if (payload.status === "success" && Array.isArray(payload.data)) {
          setHistory(payload.data);
          if (payload.data.length > 0) {
            setSelectedScanId(payload.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch initial telemetry logs database:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleAnalyzeUrl = async (url: string): Promise<AnalysisResult | null> => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setHistory((prev) => [json.data, ...prev]);
        setSelectedScanId(json.data.id);
        return json.data;
      }
    } catch (e) {
      console.error("Server API threat analysis execution failed:", e);
    }
    return null;
  };

  const handleSelectScan = (id: string) => {
    setSelectedScanId(id);
    setActiveTab("insights");
  };

  const clearHistoryRecords = () => {
    setHistory([]);
    setSelectedScanId(null);
  };
  const handleLogOut = () => {
    const opt = window.confirm(
      "Are you sure you want to reboot and wipe active threat intelligence caches?"
    );
    if (opt) {
      clearHistoryRecords();
      setActiveTab("dashboard");
      window.location.reload();
    }
  };

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#d1d5db] font-sans antialiased flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:border-r md:border-[#1f2937] bg-gradient-to-b md:from-[#111827] md:to-[#0d131f]">
          <div className="p-4 border-b border-[#1f2937] flex items-center gap-3">
            <div className="w-6 h-6 bg-[#3b82f6] rounded-sm flex items-center justify-center shrink-0 glow-blue">
              <div className="w-3 h-3 border-2 border-white transform rotate-45"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white uppercase">PhishGuard AI</h1>
              <span className="text-[10px] font-mono block text-[#6b7280]">v1.0.42</span>
            </div>
          </div>

          <nav className="flex-1 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-mono font-bold tracking-normal rounded-r-none rounded-l-sm transition-all duration-150 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-[#3b82f6]/10 text-white border-l-2 border-[#3b82f6]"
                    : "text-[#9ca3af] hover:text-white hover:bg-[#1a202e]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-[#1f2937] space-y-2.5">
            <div className="bg-[#0b0e14] border border-[#1f2937] rounded-md p-2 text-[10px] font-mono space-y-1">
              <span className="text-white font-bold block">Pipeline Node #04</span>
              <p className="text-[#6b7280] leading-tight">
                Ensemble voting weights and heuristics active.
              </p>
            </div>
            <button
              onClick={handleLogOut}
              className="w-full py-1 px-2.5 text-[#4b5563] hover:text-red-400 text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer font-mono font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>RESET CACHE</span>
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {/* Top telemetry header */}
          <header className="flex items-center justify-between px-4 h-12 border-b border-[#1f2937] bg-[#111827] select-none shrink-0">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2">
                PhishGuard AI{" "}
                <span className="text-[#6b7280] font-normal font-mono text-xs">
                  v1.0.42
                </span>
              </h1>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#064e3a]/30 border border-[#064e3a]">
                <Wifi className="w-2 h-2 text-[#22c55e] animate-pulse" />
                <span className="text-[9px] font-mono text-[#22c55e] font-bold uppercase">
                  System Online
                </span>
              </div>
              <span className="text-[#1f2937]">|</span>
              <span className="text-[10px] text-[#4b5563] font-mono hidden sm:inline">
                NODE_ID: PG-US-PROD-01
              </span>
            </div>

            {/* Operator privilege & session badges */}
            <div className="flex items-center gap-3">
              <OperatorBadge
                name={SESSION_DATA.operatorName}
                role={SESSION_DATA.role}
                status="active"
              />
              <span
                className="text-[9px] font-mono text-[#6b7280] bg-[#0b0e14] px-1.5 py-0.5 rounded border border-[#1f2937]"
                title={`Session: ${SESSION_DATA.sessionId} | Privilege Level: ${SESSION_DATA.privilegeLevel}`}
              >
                {SESSION_DATA.privilegeLevel}
              </span>
              <button
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 bg-[#0b0f19]">
            {isLoading ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6] mx-auto" />
                <p className="text-xs font-mono">Initializing SecOps telemetry db...</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto space-y-4 animate-fadeInUp">
                {activeTab === "dashboard" && (
                  <Dashboard
                    history={history}
                    onAnalyze={handleAnalyzeUrl}
                    onSelectScan={handleSelectScan}
                  />
                )}
                {activeTab === "history" && (
                  <History
                    history={history}
                    onSelectScan={handleSelectScan}
                    onClearHistory={clearHistoryRecords}
                  />
                )}
                {activeTab === "insights" && (
                  <AiInsights
                    selectedScanId={selectedScanId}
                    history={history}
                    onBackToDashboard={() => setActiveTab("dashboard")}
                  />
                )}
                {activeTab === "monitor" && <SystemMonitor />}
                {activeTab === "audit" && <AuditLog />}
                {activeTab === "settings" && <Settings />}
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="h-8 border-t border-[#1f2937] bg-[#111827] flex items-center px-4 justify-between text-[10px] font-mono text-[#4b5563] shrink-0">
            <div className="flex gap-4">
              <span>CONTAINERS: 5 ACTIVE</span>
              <span>UPTIME: 342:12:04</span>
              <span>HOST: pg-ops-cluster-v24</span>
            </div>
            <div className="text-[#6b7280] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
              <span>&copy; 2024 PHISHGUARD SECURE PIPELINE</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1f2937] z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[9px] font-mono transition-all ${
                activeTab === item.id
                  ? "text-[#3b82f6]"
                  : "text-[#6b7280] hover:text-white"
              }`}
            >
              {item.icon}
              {item.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
