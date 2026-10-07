import React, { useState } from "react";
import { ApiKey, AlertConfig } from "../types";
import { KeyRound, ShieldAlert, BadgeInfo, Plus, Trash, ToggleLeft, ToggleRight, Check, Sparkles, Sliders, BellRing, User, ShieldCheck } from "lucide-react";

export function Settings() {
  const [activeSubTab, setActiveSubTab] = useState<"keys" | "alerts" | "user">("keys");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Seeded sandbox API keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: "key-01", name: "Inference-FastAPI-Production", token: "pg_live_7c8d9e2a1b0c3f4e5a6d7", created: "2026-05-18", lastUsed: "4m ago" },
    { id: "key-02", name: "Prometheus-Metrics-Scraping", token: "pg_live_1a2b3c4d5e6f7g8h9i0j1", created: "2026-05-19", lastUsed: "Just now" }
  ]);

  const [newKeyName, setNewKeyName] = useState("");

  // Alert settings config state
  const [alerts, setAlerts] = useState<AlertConfig>({
    cpuCrit: 85,
    cpuWarn: 70,
    memCrit: 90,
    diskWarn: 75,
    diskCrit: 90,
    apiErrorRate: 5.0,
    inferenceLatencyMax: 400,
    confidenceDrop: 15,
    emailAlertsEnabled: true,
    emailAddress: "phishguard-ops@dev.aws.internal",
    import.meta.env.VITE_SLACK_WEBHOOK_URL
    slackConnected: true,
    pagerDutyEnabled: false,
    pagerDutyKey: "",
    customWebhookEnabled: false,
    customWebhookUrl: "",
    alertGrouping: "source_actor",
    maintenanceMode: false
  });

  // Handle generation of keys
  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const newKey: ApiKey = {
      id: `key-0${apiKeys.length + 1}`,
      name: newKeyName.trim(),
      token: `pg_live_${randomHex}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never"
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
  };

  // Handle revoking of keys
  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const handleCopy = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="border-b border-[#1f2937] pb-3 mb-3">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3b82f6]">settings</span>
          System Configurations
        </h1>
        <p className="text-xs text-[#9ca3af] mt-0.5">
          Configure security credentials, model inference alert triggers, pager pipelines, and general deployment properties.
        </p>
      </div>

      {/* Internal Settings SubNavigation Headers */}
      <div className="flex border-b border-[#1f2937] gap-2 mb-3">
        <button
          onClick={() => setActiveSubTab("keys")}
          className={`px-3 py-1.5 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer uppercase ${
            activeSubTab === "keys" ? "text-[#3b82f6] border-[#3b82f6]" : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          API Integrations
        </button>
        <button
          onClick={() => setActiveSubTab("alerts")}
          className={`px-3 py-1.5 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer uppercase ${
            activeSubTab === "alerts" ? "text-[#3b82f6] border-[#3b82f6]" : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          Model & Alerting Sliders
        </button>
        <button
          onClick={() => setActiveSubTab("user")}
          className={`px-3 py-1.5 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer uppercase ${
            activeSubTab === "user" ? "text-[#3b82f6] border-[#3b82f6]" : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          SecOps Policy Details
        </button>
      </div>

      <div className="space-y-3">
        
        {/* API INTEGRATIONS KEYS SUBTAB */}
        {activeSubTab === "keys" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 animate-fadeIn">
            <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-sm p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1f2937] pb-2 font-sans">
                <KeyRound className="w-3.5 h-3.5 text-[#3b82f6]" />
                Active Inbound Endpoint API Keys
              </h3>

              <div className="space-y-2.5 font-mono text-xs">
                {apiKeys.map((key) => (
                  <div key={key.id} className="bg-[#0b0e14] border border-[#1f2937]/50 rounded-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-white font-bold font-sans text-xs">{key.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-mono font-bold select-all">{key.token}</span>
                        <button
                          onClick={() => handleCopy(key.id, key.token)}
                          className="text-[10px] text-[#3b82f6] hover:underline cursor-pointer font-bold"
                        >
                          {copiedKeyId === key.id ? "COPIED" : "COPY KEY"}
                        </button>
                      </div>
                      <div className="flex gap-4 text-[10px] text-slate-600 pt-0.5 font-sans">
                        <span>Created: {key.created}</span>
                        <span>Last Active: {key.lastUsed}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(key.id, key.token)}
                      className="px-2.5 py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6]/50 rounded-sm text-xs text-[#9ca3af] transition-colors cursor-pointer float-right"
                      title="Copy credentials"
                    >
                      Retrieve
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Key Box */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                Generate Sandbox Endpoint
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed font-sans">
                Deploy dynamic token pipelines allowing external FastAPIs, Prometheus daemons, or Terraform scripts to push telemetry updates securely.
              </p>

              <form onSubmit={handleGenerateKey} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#6b7280] uppercase block">Endpoint Title / Desc</label>
                  <input
                    type="text"
                    placeholder="e.g. Lambda-DynaThreat-Sync"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-[#1f2937] rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6] text-[#dae2fd] text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#3b82f6]" />
                  Generate New Token
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ALERTS SLIDERS SUBTAB */}
        {activeSubTab === "alerts" && (
          <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 animate-fadeIn">
            <h3 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2 mb-4 font-sans">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              DevOps alarm thresholds
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#1f2937]/50">
              
              {/* SLIDERS COLUMN 1 */}
              <div className="space-y-3">
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-bold uppercase text-[10px]">CPU Alarm Trigger (CRITICAL)</span>
                    <span className="text-red-400 font-bold">{alerts.cpuCrit}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="98"
                    value={alerts.cpuCrit}
                    onChange={(e) => setAlerts({...alerts, cpuCrit: parseInt(e.target.value)})}
                    className="w-full accent-[#3b82f6]"
                  />
                  <span className="text-[10px] text-slate-500 block">Drops secondary microservices if metrics exceed trigger.</span>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-bold uppercase text-[10px]">RAM Allocation Alarm</span>
                    <span className="text-red-400 font-bold">{alerts.memCrit}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="98"
                    value={alerts.memCrit}
                    onChange={(e) => setAlerts({...alerts, memCrit: parseInt(e.target.value)})}
                    className="w-full accent-purple-500"
                  />
                  <span className="text-[10px] text-slate-500 block">Triggers automatic container scale replication if memory leaks.</span>
                </div>
              </div>

              {/* SLIDERS COLUMN 2 */}
              <div className="space-y-3">
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-bold uppercase text-[10px]">Max acceptable Consensus Latency</span>
                    <span className="text-[#f59e0b] font-bold">{alerts.inferenceLatencyMax} ms</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    step="50"
                    value={alerts.inferenceLatencyMax}
                    onChange={(e) => setAlerts({...alerts, inferenceLatencyMax: parseInt(e.target.value)})}
                    className="w-full accent-yellow-500"
                  />
                  <span className="text-[10px] text-slate-500 block">Maximum latency before routing analysis queries directly.</span>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-bold uppercase text-[10px]">FastAPI API Error Critical Alert</span>
                    <span className="text-red-400 font-bold">{alerts.apiErrorRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={alerts.apiErrorRate}
                    onChange={(e) => setAlerts({...alerts, apiErrorRate: parseFloat(e.target.value)})}
                    className="w-full accent-red-500"
                  />
                  <span className="text-[10px] text-slate-500 block">Reboots main reverse proxies if errors exceed ratio.</span>
                </div>
              </div>

            </div>

            {/* INTEGRATIONS ALERTS PIPELINE TOGGLES */}
            <div className="mt-4 space-y-3">
              <h4 className="text-[10px] font-mono font-bold uppercase text-[#6b7280]">Dispatch Dispatchers Settings</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-white font-bold uppercase tracking-wide block">Slack Endpoint Integration</span>
                    <span className="text-[10px] text-slate-500 block">Publish alerts to #phishguard-alarms</span>
                  </div>
                  <button
                    onClick={() => setAlerts({...alerts, slackConnected: !alerts.slackConnected})}
                    className="text-[#3b82f6] cursor-pointer"
                  >
                    {alerts.slackConnected ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
                  </button>
                </div>

                <div className="bg-[#0b0e14] border border-[#1f2937] rounded-sm p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-white font-bold uppercase tracking-wide block">In-Memory SecOps Mailings</span>
                    <span className="text-[10px] text-slate-500 block">Send daily threats digest to inbox</span>
                  </div>
                  <button
                    onClick={() => setAlerts({...alerts, emailAlertsEnabled: !alerts.emailAlertsEnabled})}
                    className="text-[#3b82f6] cursor-pointer"
                  >
                    {alerts.emailAlertsEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* POLICY USER DETAILED DETAILS SUBTAB */}
        {activeSubTab === "user" && (
          <div className="bg-[#111827] border border-[#1f2937] rounded-sm p-4 animate-fadeIn space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-1.5 border-b border-[#1f2937] pb-2 font-sans">
              <User className="w-3.5 h-3.5 text-[#3b82f6]" />
              DevSecOps Verification Standards
            </h3>

            <div className="space-y-3 text-xs text-[#9ca3af] leading-relaxed font-sans">
              <p>
                PhishGuard AI aligns with enterprise policy standards to enforce high-availability detection constraints. 
                Any newly submitted target resource undergoing threat scanning automatically publishes its logs to 
                the <strong className="text-[#3b82f6] font-bold">PostgreSQL database tables</strong>.
              </p>

              <div className="border border-[#1f2937] bg-[#0b0e14] rounded-sm p-3.5 space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-[#3b82f6] font-bold uppercase text-[10px] tracking-widest mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ACTIVE KERNEL PROTECTION POLICIES</span>
                </div>
                <div className="text-[#9ca3af] space-y-1">
                  <div>• <strong className="text-white text-[10px] uppercase">SELinux Target:</strong> Targeted enforcing mode blocks dynamic shell injectors.</div>
                  <div>• <strong className="text-white text-[10px] uppercase">Firewalld Guard:</strong> Reject defaults on WAN interfaces; white-list port 3000 proxies exclusively.</div>
                  <div>• <strong className="text-white text-[10px] uppercase">Snyk Scanning:</strong> Active dependencies verify against NPM vulnerability advisories daily.</div>
                  <div>• <strong className="text-white text-[10px] uppercase">Consensus Multi-modal:</strong> Ensemble weights require 80%+ similarity classification to trigger Threat.</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
