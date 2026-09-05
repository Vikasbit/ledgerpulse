import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LedgerPulseLogoProps {
  variant?: "dark" | "light" | "auto";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  href?: string;
}

export function LedgerPulseLogo({
  variant = "auto",
  size = "md",
  showText = true,
  showBadge = false,
  badgeText = "Finance OS",
  className,
  href,
}: LedgerPulseLogoProps) {
  // Dimensions based on size preset
  const dimensions = {
    sm: { icon: 28, text: "text-sm", tracking: "tracking-[0.14em]", badge: "text-[9px]" },
    md: { icon: 36, text: "text-base sm:text-lg", tracking: "tracking-[0.16em]", badge: "text-[10px]" },
    lg: { icon: 44, text: "text-xl", tracking: "tracking-[0.18em]", badge: "text-[11px]" },
    xl: { icon: 54, text: "text-2xl", tracking: "tracking-[0.2em]", badge: "text-xs" },
  }[size];

  const textColor =
    variant === "dark"
      ? "text-white"
      : variant === "light"
      ? "text-slate-900"
      : "text-slate-900 dark:text-white";

  const content = (
    <div className={cn("inline-flex items-center space-x-3 select-none group", className)}>
      {/* Wave Pulse Emblem Badge */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-full bg-[#0B0F17] border border-white/10 shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-105"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle dark inner glow/depth */}
          <circle cx="50" cy="50" r="44" fill="#0B0F17" />
          
          {/* Undulating Rhythmic Wave Currents (Neon Chartreuse/Lime #D4F82D) */}
          {/* Top subtle wave */}
          <path
            d="M26 28 C 36 24, 44 32, 54 28 C 64 24, 70 30, 74 28"
            stroke="#D4F82D"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Upper-mid wave */}
          <path
            d="M20 40 C 30 35, 40 45, 52 40 C 64 35, 72 43, 80 39"
            stroke="#D4F82D"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Center resonant pulse wave */}
          <path
            d="M17 52 C 28 46, 38 58, 50 52 C 62 46, 72 56, 83 50"
            stroke="#D4F82D"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Lower-mid wave */}
          <path
            d="M21 64 C 31 59, 41 69, 52 64 C 63 59, 71 67, 79 63"
            stroke="#D4F82D"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Bottom subtle wave */}
          <path
            d="M27 75 C 37 72, 45 78, 55 74 C 65 70, 69 76, 73 74"
            stroke="#D4F82D"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex items-center space-x-2.5">
          <span
            className={cn(
              "font-extrabold uppercase font-sans",
              dimensions.text,
              dimensions.tracking,
              textColor
            )}
          >
            LedgerPulse
          </span>
          {showBadge && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#D4F82D]/15 text-[#D4F82D] border border-[#D4F82D]/30",
                dimensions.badge
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
