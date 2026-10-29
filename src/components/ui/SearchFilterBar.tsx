import React from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFilterBarProps {
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    value: string;
    active: boolean;
    onClick: () => void;
  }>;
  onClear?: () => void;
}

export function SearchFilterBar({
  placeholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  onClear,
}: SearchFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Search input row */}
      <div className="relative">
        <Search className="absolute inset-y-0 left-0 w-4 h-4 ml-3 text-slate-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#0b0e14] border border-[#374151] rounded-lg text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all"
        />
        {searchValue && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={f.onClick}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all",
                f.active
                  ? "bg-[#3b82f6]/20 border border-[#3b82f6] text-white"
                  : "bg-[#0b0e14]/50 border border-[#374151] text-slate-400 hover:text-white hover:border-[#3b82f6]/50"
              )}
            >
              <Filter className="w-3 h-3 mr-1 inline" />
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
