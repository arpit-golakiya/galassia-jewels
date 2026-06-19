"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGES = [
  "/product/1.jpeg",
  "/product/2.jpeg",
  "/product/3.jpeg",
  "/product/4.jpeg",
  "/product/5.jpeg",
  "/product/6.jpeg",
];

const FALLBACKS = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1400",
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1400",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1400",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1400",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1400",
];

export function ProductGallery() {
  const [active, setActive] = useState(0);

  const sources = PLACEHOLDER_IMAGES.map((src, i) => ({ primary: src, fallback: FALLBACKS[i] }));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden bg-[#0a0a0a] border border-neutral-900">
        <img
          key={active}
          src={sources[active].primary}
          onError={(e) => {
            if (e.currentTarget.src !== sources[active].fallback) {
              e.currentTarget.src = sources[active].fallback;
            }
          }}
          alt="Custom diamond WHOOP band"
          className="h-full w-full animate-fade-in object-cover"
        />
        <div className="pointer-events-none absolute left-4 top-4 border border-gold/40 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur">
          Made to Order
        </div>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {sources.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 overflow-hidden border bg-[#0a0a0a] transition-all md:h-24 md:w-24",
              active === idx
                ? "border-gold ring-1 ring-gold"
                : "border-neutral-800 hover:border-gold/60"
            )}
            aria-label={`View image ${idx + 1}`}
          >
            <img
              src={src.primary}
              onError={(e) => {
                if (e.currentTarget.src !== src.fallback) e.currentTarget.src = src.fallback;
              }}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
