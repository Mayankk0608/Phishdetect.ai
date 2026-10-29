import React, { useState } from "react";
import { SecurityEvent } from "../types";
import { SeverityBadge } from "@/components/ui/StatusBadge";
import { Search, Download, Eye, Fingerprint, X } from "lucide-react";

export function AuditLog() {
  const [severityFilter, setSeverityFilter] = useState<"All" | "CRITICAL" | "WARNING" | "INFO">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEvent, setActiveEvent] = useState<SecurityEvent | null>(null);

  // Seeded OS-level firewall and daemon audit records
  const initialEvents: SecurityEvent[] = [
    {
      id: "EVT-8821",
      timestamp: "2026-05-25 19:35:01",
      actor: "firewalld",
      action: "BLOCK_PORTS_SCAN",
      severity: "WARNING",
      sourceIP: "142.250.190.46",
      details: "Anomalous ports probe identified on cloud host ports 22/23. Rate limiter triggers rule firewalls permanently drop request packets.",
    },
    {
      id: "EVT-8819",
      timestamp: "2026-05-25 19:32:01",
      actor: "phishguard-fastapi-app",
      action: "API_INFERENCE_TRIGGERED",
      severity: "INFO",
      sourceIP: "127.0.0.1",
      details: "Standard POST inbound threat query processed on url 'http://secure-login-update-paypal.com/auth'. Output verdict assigned: Threat (Conf: 98%).",
    },
    {
      id: "EVT-8791",
      timestamp: "2026-05-25 19:15:44",
      actor: "selinux",
      action: "AVC_DENIED_POST_WRITE",
      severity: "CRITICAL",
      sourceIP: "10.0.4.12",
      details: "SELinux security policy blocked attempt to write to /etc/nginx/nginx.conf from unauthorized container namespace. Context validation failure recorded by auditd kernel thread.",
    },
    {
      id: "EVT-8750",
      timestamp: "2026-05-25 18:45:30",
      actor: "gitlab-runner-02",
      action: "STATIC_CODE_SCAN_PASS",
      severity: "INFO",
      sourceIP: "10.0.4.15",
      details: "Snyk static dependency vulnerability checking completed. 0 vulnerability blocks triggered. Deployment pipeline cleared for code replication.",
    },
    {
      id: "EVT-8622",
      timestamp: "2026-05-24 16:22:10",
      actor: "vault-manager",
      action: "SECRETS_ROTATION_SUCCESS",
      severity: "INFO",
      sourceIP: "127.0.0.1",
      details: "Automatic 24h cron execution rotated private sandbox API tokens and telemetry keys. System variables cached in isolated key stores successfully.",
    },
    {
      id: "EVT-8601",
      timestamp: "2026-05-24 11:05:52",
      actor: "firewalld",
      action: "ANOMALOUS_HOST_QUARANTINE",
      severity: "CRITICAL",
      sourceIP: "185.220.101.34",
      details: "Subnet security daemon flags continuous 100+ failed credential sessions. IP block triggers quarantine; logs routed to Grafana-Cloud alarm boards.",
    },
  ];

  const filteredEvents = initialEvents.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.action.toLowerCase().includes(q) ||
      item.actor.toLowerCase().includes(q) ||
      item.sourceIP.includes(searchQuery);
    const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(initialEvents, null, 2));
    const dlLink = document.createElement("a");
    dlLink.setAttribute("href", dataStr);
    dlLink.setAttribute("download", "phishguard-firewall-audit.json");
    document.body.appendChild(dlLink);
    dlLink.click();
    dlLink.remove();
  };

  return (
    <div className="space-y-5" id="audit-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#3b82f6]" />
            OS & Security Audit Logs
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            SELinux denials, firewalld packet drops, kernel security logs, and container access traces — append-only and tamper-evident.
          </p>
        </div>
        <button
          onClick={handleExportLogs}
          className="px-3 py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] rounded-lg text-xs font-bold uppercase tracking-widest text-[#d1d5db] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-[#3b82f6]" />
          Export Audit Logs
        </button>
      </div>

      {/* Filter bar */}
      <div className="card-bento">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute inset-y-0 left-0 w-4 h-4 ml-3 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Query with Event Type, Actor, or IP Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-[#0b0e14] border border-[#374151] rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all"
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
          <div className="md:col-span-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as "All" | "CRITICAL" | "WARNING" | "INFO")}
              aria-label="Filter by severity"
              className="w-full bg-[#0b0e14] border border-[#374151] px-3 py-2 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all"
            >
              <option value="All">All Alarms</option>
              <option value="CRITICAL">Critical Alarms</option>
              <option value="WARNING">Warnings</option>
              <option value="INFO">Standard Logs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit table */}
      <div className="card-bento">
        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-grid text-left font-mono text-[11px]">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#1f2937] text-[#6b7280] uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3 w-24">Trace ID</th>
                  <th className="py-2.5 px-3 w-40">Timestamp</th>
                  <th className="py-2.5 px-3">Security Action</th>
                  <th className="py-2.5 px-3 text-center">Daemon Source</th>
                  <th className="py-2.5 px-3 text-center w-28">Severity</th>
                  <th className="py-2.5 px-3 text-center w-32">Origin IP</th>
                  <th className="py-2.5 px-3 text-right w-20">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]/50 text-[#d1d5db]">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#1a202e] transition-colors">
                    <td className="py-2 px-3 text-[#4b5563] font-bold select-all">{evt.id}</td>
                    <td className="py-2 px-3 text-[#6b7280] text-[10px]">{evt.timestamp}</td>
                    <td className="py-2 px-3 text-white font-bold">{evt.action}</td>
                    <td className="py-2 px-3 text-center text-slate-400">{evt.actor}</td>
                    <td className="py-2 px-3 text-center">
                      <SeverityBadge level={evt.severity} />
                    </td>
                    <td className="py-2 px-3 text-center text-slate-400 select-all">{evt.sourceIP}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => setActiveEvent(evt)}
                        className="p-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] hover:text-white rounded-md text-slate-400 cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold uppercase transition-all"
                        title="View audit trace details"
                      >
                        <Eye className="w-3 h-3 text-[#3b82f6]" />
                        Trace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Search className="w-8 h-8 mx-auto text-slate-500" />
            <h3 className="text-sm font-semibold text-white">No security alarms match filtration</h3>
            <p className="text-xs text-slate-400">Adjust your query terms or severity filter to view audit records.</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {activeEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Audit trace details"
          onClick={() => setActiveEvent(null)}
        >
          <div
            className="card-bento max-w-lg w-full relative space-y-4 animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-[#3b82f6]" />
                Trace Details: {activeEvent.id}
              </h3>
              <SeverityBadge level={activeEvent.severity} />
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-lg p-3">
                  <span className="text-[#6b7280] font-bold block text-[9px] uppercase">Daemon Target</span>
                  <span className="text-white font-semibold">{activeEvent.actor}</span>
                </div>
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-lg p-3">
                  <span className="text-[#6b7280] font-bold block text-[9px] uppercase">Origin IP</span>
                  <span className="text-white font-semibold select-all">{activeEvent.sourceIP}</span>
                </div>
              </div>
              <div className="bg-[#0b0e14] border border-[#1f2937] rounded-lg p-3">
                <span className="text-[#6b7280] font-bold block text-[9px] uppercase">Security Event</span>
                <span className="text-[#3b82f6] font-bold">{activeEvent.action}</span>
              </div>
              <div className="bg-[#0b0e14] border border-[#1f2937] rounded-lg p-3">
                <span className="text-[#6b7280] font-bold block text-[9px] uppercase mb-1">Trace Log Diagnostics</span>
                <p className="text-[#9ca3af] leading-relaxed">{activeEvent.details}</p>
              </div>
              <div className="text-[10px] text-[#4b5563]">Timestamp: {activeEvent.timestamp}</div>
            </div>
            <button
              onClick={() => setActiveEvent(null)}
              className="w-full py-2 bg-[#1f2937] hover:bg-[#374151] border border-[#374151] text-white text-xs font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
            >
              Close Audit Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
