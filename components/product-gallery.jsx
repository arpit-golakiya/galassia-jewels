"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGES = [
  "/product/1.jpeg",
  "/product/2.jpeg",
  "/product/3.JPEG",
  "/product/4.JPEG",
  "/product/5.jpg",
];

const FALLBACKS = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1400",
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1400",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1400",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1400",
];

const VIDEO_ITEMS = [
  {
    type: "video",
    src: "/videos/manufacturing_process.mp4",
    poster: "/product/5.jpg",
    label: "Craft Video",
    muted: true,
  },
  {
    type: "video",
    src: "/videos/REEL_1.mp4",
    poster: "/product/4.JPEG",
    label: "Styled Video",
    muted: false,
  },
];

export function ProductGallery() {
  const [active, setActive] = useState(0);

  const imageItems = PLACEHOLDER_IMAGES.map((src, i) => ({
    type: "image",
    primary: src,
    fallback: FALLBACKS[i],
    label: `Image ${i + 1}`,
  }));
  const sources = [...imageItems, ...VIDEO_ITEMS];
  const activeItem = sources[active];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden bg-[#0a0a0a] border border-neutral-900">
        {activeItem.type === "video" ? (
          <video
            key={activeItem.src}
            className="h-full w-full animate-fade-in object-cover"
            controls
            muted={activeItem.muted}
            playsInline
            poster={activeItem.poster}
            preload="none"
          >
            <source src={activeItem.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            key={activeItem.primary}
            src={activeItem.primary}
            onError={(e) => {
              if (e.currentTarget.src !== activeItem.fallback) {
                e.currentTarget.src = activeItem.fallback;
              }
            }}
            alt="Custom diamond WHOOP band"
            className="h-full w-full animate-fade-in object-cover"
          />
        )}
        {activeItem.type === "image" ? (
          <div className="pointer-events-none absolute left-4 top-4 border border-gold/40 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur">
            Made to Order
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {sources.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 overflow-hidden border bg-[#0a0a0a] transition-all md:h-24 md:w-24",
              active === idx
                ? "border-gold ring-1 ring-gold"
                : "border-neutral-800 hover:border-gold/60"
            )}
            aria-label={`View ${item.label.toLowerCase()}`}
          >
            <img
              src={item.type === "video" ? item.poster : item.primary}
              onError={(e) => {
                if (item.type === "image" && e.currentTarget.src !== item.fallback) {
                  e.currentTarget.src = item.fallback;
                }
              }}
              alt=""
              className="h-full w-full object-cover"
            />
            {item.type === "video" ? (
              <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-black/70 text-gold backdrop-blur-sm">
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
