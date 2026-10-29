import React, { useState, useMemo } from "react";
import { AnalysisResult } from "../types";
import { VerdictBadge } from "@/components/ui/StatusBadge";
import { TraceHash } from "@/components/ui/TrustSignal";
import {
  Search, Download, Eye, Trash2, SlidersHorizontal, X,
  Database,
} from "lucide-react";

interface HistoryProps {
  history: AnalysisResult[];
  onSelectScan: (id: string) => void;
  onClearHistory?: () => void;
}

function generateTraceHash(scanId: string): string {
  return scanId.split("").reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
  }, 0).toString(16).padStart(8, "0").toUpperCase().slice(0, 16);
}

export function History({ history, onSelectScan, onClearHistory }: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<"All" | "Threat" | "Warning" | "Safe">("All");
  const [sortBy, setSortBy] = useState<"timestamp" | "confidence">("timestamp");

  const filteredHistory = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase().trim();
    const filtered = history.filter((item) => {
      const matchesSearch =
        !lowerQuery ||
        item.url.toLowerCase().includes(lowerQuery) ||
        item.id.toLowerCase().includes(lowerQuery);
      const matchesVerdict = verdictFilter === "All" || item.verdict === verdictFilter;
      return matchesSearch && matchesVerdict;
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === "confidence") return b.confidence - a.confidence;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [history, searchQuery, verdictFilter, sortBy]);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishguard-threat-intelligence-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5" id="history-view">
      {/* Header banner */ }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#3b82f6]" />
            Audit Database & Records
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Browse and query the history of URL inspections triggered in PhishGuard AI environment.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onClearHistory && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 hover:border-red-400 text-red-400 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Records
            </button>
          )}
          <button
            onClick={handleExportJson}
            disabled={history.length === 0}
            className="px-3 py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] text-[#d1d5db] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[#3b82f6]" />
            Export Intel
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card-bento">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute inset-y-0 left-0 w-4 h-4 ml-3 text-slate-500" />
            <input
              type="text"
              placeholder="Query with Target URL or Trace ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0b0e14] border border-[#374151] rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value as "All" | "Threat" | "Warning" | "Safe")}
              aria-label="Filter by verdict"
              className="w-full bg-[#0b0e14] border border-[#374151] px-3 py-2 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all"
            >
              <option value="All">All Verdicts</option>
              <option value="Threat">Phishing (Threat)</option>
              <option value="Warning">Suspicious (Warning)</option>
              <option value="Safe">Verified (Safe)</option>
            </select>
          </div>

          <div className="relative">
            <SlidersHorizontal className="absolute inset-y-0 left-0 w-4 h-4 ml-3 text-slate-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "timestamp" | "confidence")}
              aria-label="Sort records"
              className="w-full pl-10 pr-3 py-2 bg-[#0b0e14] border border-[#374151] rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all"
            >
              <option value="timestamp">Newest First</option>
              <option value="confidence">Risk: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="card-bento">
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-grid text-left font-mono text-[11px]">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#1f2937] text-[#6b7280] uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3 w-20">Trace ID</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3 w-24 text-center">Verdict</th>
                  <th className="py-2.5 px-3 w-20 text-center">Score</th>
                  <th className="py-2.5 px-3 w-36">Registrar</th>
                  <th className="py-2.5 px-3 w-36 text-center">Timestamp</th>
                  <th className="py-2.5 px-3 text-right w-24">Actions</th>
                </tr>
              </thead>


              <tbody className="divide-y divide-[#1f2937]/50 text-[#d1d5db]">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1a202e] transition-colors group">
                    <td className="py-2 px-3 text-[#4b5563] font-bold select-all">{item.id}</td>
                    <td className="py-2 px-3 text-[#d1d5db] select-all font-mono break-all font-medium">{item.url}</td>
                    <td className="py-2 px-3 text-center">
                      <VerdictBadge verdict={item.verdict} />
                    </td>
                    <td className="py-2 px-3 text-center text-white font-bold">{item.confidence}%</td>
                    <td className="py-2 px-3 text-slate-400 font-mono text-[11px] truncate max-w-[125px]">
                      {item.lexicalInfo.registrar.split(",")[0]}
                    </td>
                    <td className="py-2 px-3 text-center text-[#6b7280] font-mono text-[10px]">{item.timestamp}</td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onSelectScan(item.id)}
                          className="px-2.5 py-1 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] rounded-md text-[#d1d5db] hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer transition-all"
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
            <SlidersHorizontal className="w-8 h-8 mx-auto text-slate-500" />
            <h3 className="text-sm font-semibold text-white">No database entries found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No inspections match your filter queries. Consider resetting your searches or inspecting a new resource in the Dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
