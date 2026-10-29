import React from "react";
import { Shield, Hash, CheckCircle2, Key, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface TraceHashProps {
  hash: string;
  label?: string;
  className?: string;
}

/** Immutable trace hash display with copy indicator */
export function TraceHash({ hash, label = "Trace Hash", className }: TraceHashProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[10px] font-mono",
        className
      )}
    >
      <Hash className="w-3 h-3 text-[#6b7280]" />
      <span className="text-[#6b7280] uppercase tracking-wider">{label}:</span>
      <code className="text-[#3b82f6] font-bold tracking-wider select-all bg-[#0b0e14] px-1.5 py-0.5 rounded border border-[#1f2937]">
        {hash}
      </code>
      <Shield
        className="w-3 h-3 text-emerald-400"
        title="Immutable cryptographic trace"
      />
    </div>
  );
}

interface AuditTrailProps {
  status?: "verified" | "pending" | "warning";
  label?: string;
  className?: string;
}

/** Cryptographic audit log indicator */
export function AuditTrailIndicator({ status = "verified", label = "Auditable", className }: AuditTrailProps) {
  const statusConfig = {
    verified: {
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      text: "Verified",
      className: "text-emerald-400",
    },
    pending: {
      icon: <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
      text: "Pending",
      className: "text-amber-400",
    },
    warning: {
      icon: <Shield className="w-3.5 h-3.5 text-orange-400" />,
      text: "Review",
      className: "text-orange-400",
    },
  };

  const cfg = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 bg-[#0b0e14] border border-[#1f2937] rounded-md",
        className
      )}
      title={`${label}: ${cfg.text} audit trail`}
    >
      {cfg.icon}
      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
        {label}:
      </span>
      <span className={cn("text-[9px] font-bold", cfg.className)}>
        {cfg.text}
      </span>
    </div>
  );
}

interface OperatorBadgeProps {
  name: string;
  role: "analyst" | "responder" | "admin";
  status?: "active" | "idle";
}

/** Operator privilege/session badge */
export function OperatorBadge({ name, role, status = "active" }: OperatorBadgeProps) {
  const roleConfig = {
    analyst: {
      color: "text-[#3b82f6]",
      bg: "bg-[#3b82f6]/10",
      border: "border-[#3b82f6]/30",
      label: "Analyst",
    },
    responder: {
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      label: "Threat Responder",
    },
    admin: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      label: "Administrator",
    },
  };

  const cfg = roleConfig[role];
  const dotColor = status === "active" ? "#22c55e" : "#6b7280";

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all",
        cfg.bg,
        cfg.border
      )}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: dotColor }}
      />
      <span className={cn("text-xs font-mono font-bold", cfg.color)}>
        {cfg.label}
      </span>
      <span className="text-xs font-mono text-[#6b7280]">
        {name}
      </span>
      <Key className="w-3 h-3 text-[#374151]" />
    </div>
  );
}
