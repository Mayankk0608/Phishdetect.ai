import React, { useState, useEffect } from "react";
import { AnalysisResult } from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  RefreshCw,
  Eye,
  Globe,
  Database,
  ArrowRight,
} from "lucide-react";
import { VerdictBadge } from "@/components/ui/StatusBadge";
import { TraceHash, AuditTrailIndicator } from "@/components/ui/TrustSignal";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";

interface DashboardProps {
  history: AnalysisResult[];
  onAnalyze: (url: string) => Promise<AnalysisResult | null>;
  onSelectScan: (id: string) => void;
}

function generateTraceHash(scanId: string): string {
  // Simple deterministic hash for display (not cryptographically secure, but visually representative)
  return scanId.split("").reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
  }, 0).toString(16).padStart(8, "0").toUpperCase().slice(0, 16);
}

export function Dashboard({ history, onAnalyze, onSelectScan }: DashboardProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [elapsedScanTime, setElapsedScanTime] = useState(0);
  const [activeScanIndex, setActiveScanIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [logSearch, setLogSearch] = useState("");

  const currentScan = history[activeScanIndex] || history[0];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isScanning) {
      timer = setInterval(() => {
        setElapsedScanTime((prev) => parseFloat((prev + 0.1).toFixed(1)));
        setScanProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + Math.floor(Math.random() * 12) + 4;
        });
      }, 100);
    } else {
      setElapsedScanTime(0);
      setScanProgress(0);
    }
    return () => clearInterval(timer);
  }, [isScanning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setErrorMessage("");
    setIsScanning(true);
    setScanProgress(5);

    try {
      const result = await onAnalyze(urlInput);
      if (result) {
        setUrlInput("");
        setActiveScanIndex(0);
      } else {
        setErrorMessage("Inference offline. Please check network routes.");
      }
    } catch {
      setErrorMessage("System failed to execute scan pipelines.");
    } finally {
      setTimeout(() => setIsScanning(false), 300);
    }
  };

  const getVerdictDescription = (verdict: string) => {
    switch (verdict) {
      case "Threat":
        return "CRITICAL SUSPICION. Multi-modal scoring signals high brand identity spoofing and adversarial structural behaviors. Immediate blacklisting suggested.";
      case "Warning":
        return "SUSPICIOUS ACTIVITY. Host exhibits high JavaScript obfuscation techniques or dynamic layout templates mismatching its domain history.";
      case "Safe":
      default:
        return "VERIFIED SECURE. Layout aligns perfectly with physical domain mapping, DNS telemetry, and secure cryptographic handshakes.";
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Threat": return "#ef4444";
      case "Warning": return "#f59e0b";
      case "Safe": return "#22c55e";
      default: return "#3b82f6";
    }
  };

  // Filter history for the table
  const filteredHistory = history.filter((scan) =>
    scan.url.toLowerCase().includes(logSearch.toLowerCase()) ||
    scan.id.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-5" id="dashboard-view">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3 mb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#3b82f6]" />
            Threat Detection Control
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Analyze zero-day visual phishing URLs using deep multi-modal lexical, HTML-DOM, and visual CNN alignment blocks.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] border border-[#1f2937] px-3 py-1.5 rounded-lg text-xs font-mono">
          <span className="flex h-2 w-2 rounded-full bg-[#22c55e] animate-pulse"></span>
          <span>FastAPI Inference Server: <strong className="text-[#22c55e]">ONLINE</strong></span>
        </div>
      </div>

      {/* Bento Grid: Scanner Pipeline + Confidence Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scanner Pipeline Card — spans 2 columns */}
        <div className="lg:col-span-2 card-bento">
          {" "}
          <div className="h-0.5 w-full bg-[#3b82f6]/30 mb-4"></div>
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#3b82f6]" />
            Threat Scanner Pipeline
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-4 h-4" />
              </span>
              <input
                id="phish-scan-input"
                type="url"
                placeholder="Enter targeted phishing URL (e.g., http://secure-login-update-paypal.com)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isScanning}
                className="w-full pl-10 pr-3 py-2.5 bg-[#0b0e14] border border-[#374151] rounded-lg text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 uppercase tracking-widest rounded-lg transition-all glow-blue cursor-pointer"
            >
              {isScanning ? "Scanning..." : "Analyze"}
            </button>
          </form>

          {/* Scanning progress bar */}
          {isScanning && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-[#9ca3af]">
                <span>Analyzing Lexical, HTML Elements & Visual Spoofing...</span>
                <span>{elapsedScanTime}s / {Math.min(100, scanProgress)}%</span>
              </div>
              <div className="w-full bg-[#0b0e14] h-2 rounded-full overflow-hidden border border-[#1f2937]">
                <div
                  className="bg-[#3b82f6] h-full transition-all duration-100 ease-out rounded-full"
                  style={{ width: `${Math.min(100, scanProgress)}%` }}
                ></div>
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-red-400 font-mono mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Confidence Gauge */}
        <div className="card-bento flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#3b82f6]/30"></div>
          <h2 className="text-[10px] font-mono font-bold tracking-wider text-[#6b7280] uppercase w-full text-left mb-4 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#3b82f6]" />
            Dynamic Risk Output
          </h2>

          {currentScan ? (
            <div className="flex-grow flex flex-col justify-center items-center py-2">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="#070a10"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={390}
                    strokeDashoffset={390 - (390 * currentScan.confidence) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <span className="text-3xl font-bold font-mono text-white tracking-tighter">
                    {currentScan.confidence}%
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#6b7280] mt-0.5">
                    Phish Index
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase">
                  {currentScan.verdict === "Threat"
                    ? "High Risk Detected"
                    : currentScan.verdict === "Warning"
                    ? "Mitigated Suspicions"
                    : "Verified Legit Domain"}
                </h4>
                {/* Trace Hash + Audit Trail */}
                <TraceHash hash={generateTraceHash(currentScan.id)} label="Trace" />
                <div className="flex justify-center">
                  <AuditTrailIndicator status="verified" label="Immutable" />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#4b5563] font-mono my-auto">
              Await submission for threat mapping...
            </p>
          )}
        </div>
      </div>

      {/* Verdict Detail Card */}
      {currentScan && (
        <div className="card-bento">
          <div className={`p-4 rounded-lg border-l-4 ${
            currentScan.verdict === "Threat"
              ? "border-red-500 bg-[#0b0e14]"
              : currentScan.verdict === "Warning"
              ? "border-amber-500 bg-[#0b0e14]"
              : "border-[#22c55e] bg-[#0b0e14]"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <VerdictBadge verdict={currentScan.verdict} />
              <h3 className="text-sm font-bold text-white">
                {currentScan.verdict === "Threat" ? "Phishing Detected" : "Threat Assessment"}
              </h3>
            </div>
            <p className="text-xs text-[#9ca3af] leading-relaxed mb-4">
              {getVerdictDescription(currentScan.verdict)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0b0e14] border border-[#1f2937] rounded-lg p-3 text-center">
                <span className="text-[9px] font-mono text-[#6b7280] uppercase block mb-1">Lexical Match</span>
                <strong className="text-sm font-mono text-white">{currentScan.composition.lexical}%</strong>
              </div>
              <div className="bg-[#0b0e14] border border-[#1f2937] rounded-lg p-3 text-center">
                <span className="text-[9px] font-mono text-[#6b7280] uppercase block mb-1">HTML DOM</span>
                <strong className="text-sm font-mono text-white">{currentScan.composition.html}%</strong>
              </div>
              <div className="bg-[#0b0e14] border border-[#1f2937] rounded-lg p-3 text-center">
                <span className="text-[9-xs] font-mono text-[#6b7280] uppercase block mb-1">Visual</span>
                <strong className="text-sm font-mono text-white">{currentScan.composition.visual}%</strong>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-[#4b5563] pt-3 border-t border-[#1f2937]/50 mt-3">
              <span>Trace Hash: {currentScan.id}</span>
              <button
                onClick={() => onSelectScan(currentScan.id)}
                className="text-[#3b82f6] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                Deep Diagnostic Metrics <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Inspection Logs */}
      <div className="card-bento">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2937] pb-3 mb-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#3b82f6]" />
            Recent Inspection Logs
          </h2>
          <span className="text-[10px] font-mono text-[#9ca3af] bg-[#0b0e14] px-2.5 py-0.5 rounded-lg border border-[#1f2937]">
            Seeded records: <strong className="text-[#3b82f6] font-bold">{history.length}</strong>
          </span>
        </div>

        {/* Search Filter Bar */}
        <div className="mb-4">
          <SearchFilterBar
            placeholder="Search by URL or Trace ID..."
            searchValue={logSearch}
            onSearchChange={setLogSearch}
            filters={[
              {
                key: "all",
                label: "All",
                value: "all",
                active: !logSearch,
                onClick: () => setLogSearch(""),
              },
            ]}
            onClear={() => setLogSearch("")}
          />
        </div>

        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-grid text-left font-mono text-[11px]">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#1f2937] text-[#6b7280] uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3 font-semibold">Target URL</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Verdict</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Confidence</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Brand Target</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Trace</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((scan, index) => (
                  <tr
                    key={scan.id}
                    className={`hover:bg-[#1a202e] transition-all duration-150 group ${
                      index === activeScanIndex ? "bg-[#0b0e14]/30" : "bg-[#111827]/30"
                    }`}
                  >
                    <td className="py-2.5 px-3 max-w-xs truncate text-[#d1d5db]">
                      <div className="flex flex-col">
                        <span className="text-[#4b5563] text-[9px] font-bold">{scan.id}</span>
                        <span className="truncate">{scan.url}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <VerdictBadge verdict={scan.verdict} />
                    </td>
                    <td className="py-2.5 px-3 text-center text-white font-bold">
                      {scan.confidence}%
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      {scan.lexicalInfo.brandSpoof === "None" ? (
                        <span className="text-[#4b5563] font-normal">-</span>
                      ) : (
                        <span className="text-[#3b82f6]">{scan.lexicalInfo.brandSpoof}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                          scan.verdict === "Threat"
                            ? "text-red-400 bg-red-950/20"
                            : scan.verdict === "Warning"
                            ? "text-amber-400 bg-amber-950/20"
                            : "text-[#22c55e] bg-emerald-950/20"
                        }`}
                      >
                        {generateTraceHash(scan.id)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setActiveScanIndex(index);
                            const dashboardEl = document.getElementById("dashboard-view");
                            if (dashboardEl) {
                              dashboardEl.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md bg-[#0b0e14] border border-[#1f2937]"
                          title="Display in Dashboard View"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectScan(scan.id)}
                          className="px-2.5 py-1 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] rounded-md text-[#d1d5db] hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer transition-colors"
                          title="Open AI Diagnostics"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Search className="w-8 h-8 mx-auto text-slate-500" />
            <h3 className="text-sm font-semibold text-white">No inspection logs found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No inspections match your search. Consider adjusting your search terms or inspecting a new URL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
