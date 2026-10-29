import React, { useState, useEffect } from "react";
import {
  Cpu, HardDrive, Activity, Server, GitBranch, HelpCircle, Layers,
} from "lucide-react";

export function SystemMonitor() {
  const [cpuUsage, setCpuUsage] = useState(44);
  const [ramUsage, setRamUsage] = useState(62);
  const [latency, setLatency] = useState(240);
  const [requestRate, setRequestRate] = useState(482);
  const [livePoints, setLivePoints] = useState<number[]>([40, 42, 45, 48, 43, 40, 52, 58, 62, 55, 48, 52, 61, 65]);

  useEffect(() => {
    const streamTimer = setInterval(() => {
      setCpuUsage((prev) => Math.max(10, Math.min(95, prev + Math.floor(Math.random() * 8) - 4)));
      setRamUsage((prev) => Math.max(45, Math.min(90, prev + Math.floor(Math.random() * 6) - 3)));
      setLatency((prev) => Math.max(180, Math.min(450, prev + Math.floor(Math.random() * 30) - 15)));
      setRequestRate((prev) => Math.max(300, Math.min(800, prev + Math.floor(Math.random() * 40) - 20)));
      setLivePoints((prev) => [...prev.slice(1), Math.max(20, Math.min(95, prev[prev.length - 1] + Math.floor(Math.random() * 16) - 8))]);
    }, 2500);
    return () => clearInterval(streamTimer);
  }, []);

  const dockerContainerList = [
    { name: "phishguard-fastapi-app", status: "Healthy", image: "fastapi:alpine-3.19", port: "8000/tcp", node: "us-east-1a", replica: "2/2" },
    { name: "phishguard-gemini-orchestrator", status: "Healthy", image: "node:18-slim", port: "3000/tcp", node: "us-east-1b", replica: "3/3" },
    { name: "phishguard-frontend-nginx", status: "Healthy", image: "nginx:stable-alpine", port: "443/tcp", node: "us-east-1a", replica: "2/2" },
    { name: "phishguard-postgres-db", status: "Healthy", image: "postgres:16-alpine", port: "5432/tcp", node: "us-east-1c", replica: "1/1" },
  ];

  const pipelineSteps = [
    { name: "AWS VPC & Subnet Provisioning", tool: "Terraform Cloud", status: "PASSED", stamp: "18:22:10" },
    { name: "VPC Transit Gateway Hardening", tool: "Security Groups", status: "PASSED", stamp: "18:23:44" },
    { name: "Host VM Configuration Rules", tool: "Ansible Playbook", status: "PASSED", stamp: "18:25:02" },
    { name: "SELinux Policy Compilation", tool: "Auditd Kernel", status: "PASSED", stamp: "18:27:36" },
    { name: "GitLab CI Static Pipeline Check", tool: "Snyk Scanner", status: "PASSED", stamp: "18:31:19" },
  ];

  // Live sparkline path
  const graphWidth = 500;
  const graphHeight = 120;
  const maxVal = 100;
  const pathData = livePoints
    .map((p, idx) => {
      const x = (idx / (livePoints.length - 1)) * graphWidth;
      const y = graphHeight - (p / maxVal) * graphHeight;
      return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaData = `${pathData} L${graphWidth},${graphHeight} L0,${graphHeight} Z`;

  return (
    <div className="space-y-5" id="monitor-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2937] pb-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#3b82f6]" />
            DevSecOps Infrastructure Monitor
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Real-time status of PhishGuard AI sandboxes, hardening automation, and container replication fleets.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] border border-[#1f2937] px-3 py-1.5 rounded-lg text-xs font-mono shrink-0">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>Uptime: <strong className="text-white">342h 12m</strong></span>
        </div>
      </div>

      {/* Metric widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-bento space-y-2">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>CPU Cluster Load</span>
            <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{cpuUsage}%</span>
            <span className="text-[9px] text-emerald-400 font-mono tracking-widest font-bold">NORMAL</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-full overflow-hidden border border-[#1f2937]">
            <div className="bg-[#3b82f6] h-full transition-all duration-1000 rounded-full" style={{ width: `${cpuUsage}%` }} />
          </div>
        </div>

        <div className="card-bento space-y-2">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>RAM Allocation</span>
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{ramUsage}%</span>
            <span className="text-[9px] text-purple-300 font-mono">62.4 GB ACTIVE</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-full overflow-hidden border border-[#1f2937]">
            <div className="bg-purple-500 h-full transition-all duration-1000 rounded-full" style={{ width: `${ramUsage}%` }} />
          </div>
        </div>

        <div className="card-bento space-y-2">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>Model Latency</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{latency}ms</span>
            <span className="text-[9px] text-amber-400 font-mono tracking-widest font-bold">CONSENSUS</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-full overflow-hidden border border-[#1f2937]">
            <div className="bg-amber-500 h-full transition-all duration-1000 rounded-full" style={{ width: `${(latency / 500) * 100}%` }} />
          </div>
        </div>

        <div className="card-bento space-y-2">
          <div className="flex items-center justify-between text-[#6b7280] text-[10px] font-bold font-mono uppercase tracking-wider">
            <span>Request Ingress</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{requestRate}/M</span>
            <span className="text-[9px] text-emerald-400 font-mono tracking-widest font-bold">STABLE</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-full overflow-hidden border border-[#1f2937]">
            <div className="bg-emerald-500 h-full transition-all duration-1000 rounded-full" style={{ width: `${(requestRate / 800) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Live telemetry graph + CI pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="card-bento lg:col-span-3">
          <div className="flex items-center justify-between border-b border-[#1f2937] pb-2 mb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#3b82f6]" />
              Live Inference Telemetry Stream
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              STREAMING
            </span>
          </div>
          <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-32" role="img" aria-label="Live inference request telemetry">
            <defs>
              <linearGradient id="telemetryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaData} fill="url(#telemetryFill)" />
            <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>

        <div className="card-bento lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1f2937] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-purple-400" />
              GitLab CI/CD Automation
            </h2>
            <span className="text-[9px] font-mono bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full font-bold">
              VERIFIED
            </span>
          </div>
          <div className="space-y-2 font-mono text-[11px]">
            {pipelineSteps.map((step) => (
              <div key={step.name} className="flex items-center justify-between gap-2 bg-[#0b0e14] border border-[#1f2937] rounded-lg px-2.5 py-1.5">
                <div className="min-w-0">
                  <span className="text-[#d1d5db] truncate font-bold text-[10px] uppercase block">{step.name}</span>
                  <span className="text-[#4b5563] text-[8px] block uppercase font-bold">Engine: {step.tool}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-emerald-400 text-[9px] font-bold block">PASS</span>
                  <span className="text-[#4b5563] text-[8px]">{step.stamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Container fleet */}
      <div className="card-bento">
        <div className="flex items-center justify-between border-b border-[#1f2937] pb-2 mb-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#3b82f6]" />
            Sandbox Container Replication Clusters
          </h2>
          <span className="text-[10px] font-mono text-[#9ca3af] bg-[#0b0e14] px-2.5 py-0.5 rounded-lg border border-[#1f2937]">
            Nodes: <strong className="text-[#3b82f6]">{dockerContainerList.length}</strong>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-grid text-left font-mono text-[11px]">
            <thead>
              <tr className="bg-[#0b0e14] border-b border-[#1f2937] text-[#6b7280] uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Node Container Name</th>
                <th className="py-2.5 px-3 text-center">Active Replicas</th>
                <th className="py-2.5 px-3 text-center">Deployment Tag</th>
                <th className="py-2.5 px-3 text-center">Target Port</th>
                <th className="py-2.5 px-3 text-right">AWS AZ Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]/50 text-[#9ca3af]">
              {dockerContainerList.map((container) => (
                <tr key={container.name} className="hover:bg-[#1a202e] transition-colors">
                  <td className="py-2 px-3 text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {container.name}
                  </td>
                  <td className="py-2 px-3 text-center text-emerald-400 font-bold">{container.replica}</td>
                  <td className="py-2 px-3 text-center text-slate-400">{container.image}</td>
                  <td className="py-2 px-3 text-center text-slate-400">{container.port}</td>
                  <td className="py-2 px-3 text-right text-slate-400 uppercase font-bold">{container.node}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

