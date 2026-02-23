"use client";

import { cn } from "@/lib/cn";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 z-30 h-12 flex items-center px-4 gap-4",
        className
      )}
      style={{
        background: "var(--bg-deep)",
        borderBottom: "1px solid var(--border-1)",
      }}
    >
      {/* Logo */}
      <div
        className="size-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
        style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
        aria-label="Gaia AI"
      >
        G
      </div>

      {/* Search — centered */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search location…"
          className="w-full max-w-xs h-8 rounded-md px-3 text-sm outline-none"
          style={{
            background: "var(--bg-raised)",
            color: "var(--text-1)",
            border: "1px solid var(--border-1)",
            fontFamily: "var(--font-ui)",
          }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs shrink-0" style={{ color: "var(--text-3)" }}>
        <span
          className="size-2 rounded-full"
          style={{ background: "var(--signal-bio)" }}
          aria-hidden="true"
        />
        Alpha
      </div>
    </div>
  );
}
