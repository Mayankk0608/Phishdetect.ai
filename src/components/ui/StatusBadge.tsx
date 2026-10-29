import React from "react";
import { cn } from "@/lib/utils";

export type VerdictType = "Threat" | "Safe" | "Warning" | "Scanning";
export type SeverityLevel = "CRITICAL" | "WARNING" | "INFO" | "Safe" | "Critical" | "High" | "Medium" | "Low";

interface StatusBadgeProps {
  verdict: VerdictType;
  showGlow?: boolean;
}

const verdictConfig: Record<VerdictType, { label: string; className: string; glowClass: string }> = {
  Threat: {
    label: "PHISH",
    className: "bg-red-500/15 border-red-500/40 text-red-400",
    glowClass: "animate-pulse-glow-danger",
  },
  Safe: {
    label: "SAFE",
    className: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
    glowClass: "animate-pulse-glow-success",
  },
  Warning: {
    label: "WARNING",
    className: "bg-amber-500/15 border-amber-500/40 text-amber-400",
    glowClass: "animate-pulse-glow-warning",
  },
  Scanning: {
    label: "SCANNING",
    className: "bg-blue-500/15 border-blue-500/40 text-blue-400",
    glowClass: "animate-pulse-glow-blue",
  },
};

export function VerdictBadge({ verdict, showGlow = true }: StatusBadgeProps) {
  const config = verdictConfig[verdict] || verdictConfig.Safe;
  const glowClass = showGlow ? config.glowClass : "";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.75 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        config.className,
        glowClass
      )}
    >
      {showGlow && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            backgroundColor:
              verdict === "Threat"
                ? "#ef4444"
                : verdict === "Safe"
                ? "#22c55e"
                : verdict === "Warning"
                ? "#f59e0b"
                : "#3b82f6",
          }}
        />
      )}
      {config.label}
    </span>
  );
}

// Generic severity badge for audit log entries
interface SeverityBadgeProps {
  level: SeverityLevel;
  showGlow?: boolean;
}

const severityConfig: Record<string, { label: string; className: string; glowClass: string }> = {
  CRITICAL: {
    label: "CRITICAL",
    className: "bg-red-500/15 border-red-500/40 text-red-400",
    glowClass: "animate-pulse-glow-danger",
  },
  Critical: {
    label: "CRITICAL",
    className: "bg-red-500/15 border-red-500/40 text-red-400",
    glowClass: "animate-pulse-glow-danger",
  },
  WARNING: {
    label: "WARNING",
    className: "bg-amber-500/15 border-amber-500/40 text-amber-400",
    glowClass: "animate-pulse-glow-warning",
  },
  Warning: {
    label: "WARNING",
    className: "bg-amber-500/15 border-amber-500/40 text-amber-400",
    glowClass: "animate-pulse-glow-warning",
  },
  INFO: {
    label: "INFO",
    className: "bg-blue-500/15 border-blue-500/40 text-blue-400",
    glowClass: "animate-pulse-glow-blue",
  },
  Safe: {
    label: "SAFE",
    className: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
    glowClass: "animate-pulse-glow-success",
  },
  High: {
    label: "HIGH",
    className: "bg-orange-500/15 border-orange-500/40 text-orange-400",
    glowClass: "animate-pulse-glow-warning",
  },
  Medium: {
    label: "MEDIUM",
    className: "bg-amber-500/15 border-amber-500/40 text-amber-400",
    glowClass: "animate-pulse-glow-warning",
  },
  Low: {
    label: "LOW",
    className: "bg-blue-500/15 border-blue-500/40 text-blue-400",
    glowClass: "animate-pulse-glow-blue",
  },
};

export function SeverityBadge({ level, showGlow = true }: SeverityBadgeProps) {
  const config = severityConfig[level] || severityConfig.INFO;
  const glowClass = showGlow ? config.glowClass : "";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
        config.className,
        glowClass
      )}
    >
      <span
        className="w-1 h-1 rounded-full animate-pulse"
        style={{
          backgroundColor:
            level === "CRITICAL" || level === "Critical"
              ? "#ef4444"
              : level === "WARNING" || level === "High" || level === "Medium"
              ? "#f59e0b"
              : "#3b82f6",
        }}
      />
      {config.label}
    </span>
  );
}
