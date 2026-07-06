"use client";

import { useMemo, useState } from "react";
import { Lock, Check, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { cn, formatINR } from "@/lib/utils";
import {
  DIAMOND_TYPES,
  KARATS,
  getPrice,
  qualitiesFor,
} from "@/lib/pricing";

const GOLD_COLORS = [
  {
    name: "Yellow",
    swatch: "#d4af37",
  },
  {
    name: "Rose",
    swatch: "#c58a72",
  },
  {
    name: "White",
    swatch: "#d9d9d9",
  },
];

const BAND_COLORS = [
  {
    name: "Dune",
    swatch: "#d0c2ad",
  },
  {
    name: "Obsidian",
    swatch: "#111719",
  },
  {
    name: "MidNight",
    swatch: "#17202a",
  },
  {
    name: "Graphite",
    swatch: "#555b5c",
  },
];

function OptionTile({ active, onClick, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-1 border px-4 py-3 text-left transition-all",
        active
          ? "border-gold bg-gold/10 text-gold-light"
          : "border-neutral-800 bg-[#0a0a0a] text-foreground hover:border-gold/60"
      )}
    >
      <span className="text-sm font-medium tracking-wide">{title}</span>
      {sub ? (
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.15em]",
            active ? "text-gold/80" : "text-neutral-500"
          )}
        >
          {sub}
        </span>
      ) : null}
      {active ? (
        <Check className="absolute right-2 top-2 h-3.5 w-3.5" />
      ) : null}
    </button>
  );
}

function materialLabel(value) {
  return `${value.toUpperCase()} Gold`;
}

function materialTitle(value) {
  return `${value.toUpperCase()} Gold`;
}

function GoldColorSwatch({ active, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Select ${color.name} gold`}
      aria-pressed={active}
      className={cn(
        "relative flex h-9 w-16 items-center justify-center rounded-full border-2 transition-all",
        active
          ? "scale-105 border-gold shadow-[0_0_0_3px_rgba(201,160,99,0.35)]"
          : "border-neutral-700 hover:border-gold/70"
      )}
      style={{ background: color.swatch }}
    >
      {active ? (
        <Check className="h-4 w-4 rounded-full bg-black/55 p-0.5 text-white" />
      ) : null}
    </button>
  );
}

function BandColorSwatch({ active, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Select ${color.name} SuperKnit band colour`}
      aria-pressed={active}
      title={color.name}
      className={cn(
        "relative h-11 w-11 rounded-full border transition-all",
        active
          ? "scale-105 border-foreground shadow-[0_0_0_3px_rgba(201,160,99,0.5)]"
          : "border-neutral-700 hover:border-gold/70"
      )}
      style={{ background: color.swatch }}
    >
      {active ? (
        <span className="absolute inset-1 rounded-full border border-black/70" />
      ) : null}
    </button>
  );
}

export function Configurator() {
  const [diamondType, setDiamondType] = useState("natural");
  const [quality, setQuality] = useState("EF VVS-VS");
  const [karat, setKarat] = useState("18kt");
  const [goldColor, setGoldColor] = useState("Yellow");
  const [bandColor, setBandColor] = useState("Dune");

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [unlocked, setUnlocked] = useState(false);
  const [isRevealingPrice, setIsRevealingPrice] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderSent, setOrderSent] = useState(false);
  const [errors, setErrors] = useState({});

  const qualities = useMemo(() => qualitiesFor(diamondType), [diamondType]);

  const price = getPrice({ diamondType, quality, karat });

  function handleDiamondType(value) {
    setDiamondType(value);
    const qs = qualitiesFor(value);
    if (!qs.includes(quality)) setQuality(qs[0]);
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) next.phone = "Required";
    else if (digits.length < 8) next.phone = "Enter a valid phone";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function orderPayload() {
    return {
      ...form,
      diamondType,
      quality,
      karat,
      goldColor,
      bandColor,
    };
  }

  async function handleReveal(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError("");
    setIsRevealingPrice(true);

    try {
      const response = await fetch("/api/reveal-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderPayload(),
          pageUrl: window.location.href,
          userAgent: window.navigator.userAgent,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to reveal price right now.");
      }

      setUnlocked(true);
    } catch (error) {
      setSubmitError(
        error.message || "Unable to reveal price right now. Please try again."
      );
    } finally {
      setIsRevealingPrice(false);
    }
  }

  async function handlePlaceOrderRequest() {
    setIsSubmittingOrder(true);
    setSubmitError("");
    setOrderSent(false);

    try {
      const response = await fetch("/api/place-order-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload()),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to send order request.");
      }

      setOrderSent(true);
    } catch (error) {
      setSubmitError(
        error.message || "Unable to send order request. Please try again."
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Title block */}
      <div className="flex flex-col gap-3">
        <span className="gold-divider text-xs font-bold uppercase tracking-[0.3em]">
          Bespoke Edition
        </span>
        <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
          Custom Diamond <span className="italic text-gold">Whoop</span> Band
        </h1>
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
          Available in Gold &amp; Diamond
        </p>
        <p className="max-w-prose text-[15px] leading-relaxed text-neutral-400">
          A reimagined WHOOP band in solid gold, set with hand-selected baguette
          and round-cut diamonds. Crafted to order — choose your karat, gold
          color, and diamond grade to make it yours.
        </p>
      </div>

      {/* Diamond Type */}
      <section className="flex flex-col gap-3">
        <Label>Diamond Type</Label>
        <div className="grid grid-cols-2 gap-3">
          {DIAMOND_TYPES.map((dt) => (
            <OptionTile
              key={dt.value}
              active={diamondType === dt.value}
              onClick={() => handleDiamondType(dt.value)}
              title={dt.label}
              sub={dt.value === "natural" ? "Earth-mined" : "Sustainable"}
            />
          ))}
        </div>
      </section>

      {/* Diamond Quality */}
      <section className="flex flex-col gap-3">
        <Label>Diamond Quality</Label>
        <div className="grid grid-cols-2 gap-3">
          {qualities.map((q) => (
            <OptionTile
              key={q}
              active={quality === q}
              onClick={() => setQuality(q)}
              title={q}
              sub={q.startsWith("EF") ? "Premium" : "Classic"}
            />
          ))}
        </div>
      </section>

      {/* Material */}
      <section className="flex flex-col gap-3">
        <Label>Gold Karat</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {KARATS.map((k) => (
            <OptionTile
              key={k}
              active={karat === k}
              onClick={() => setKarat(k)}
              title={materialTitle(k)}
              sub={
                k === "18kt" ? "Finest" : k === "14kt" ? "Balanced" : "Light"
              }
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="text-sm font-medium text-foreground">
          Color Type : <span className="text-gold-light">{goldColor}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {GOLD_COLORS.map((color) => (
            <GoldColorSwatch
              key={color.name}
              active={goldColor === color.name}
              color={color}
              onClick={() => setGoldColor(color.name)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="text-sm font-medium text-foreground">
          SuperKnit Band Colour :{" "}
          <span className="text-gold-light">{bandColor}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {BAND_COLORS.map((color) => (
            <BandColorSwatch
              key={color.name}
              active={bandColor === color.name}
              color={color}
              onClick={() => setBandColor(color.name)}
            />
          ))}
        </div>
      </section>

      {/* Price / Reveal Form */}
      <section className="border border-neutral-800 bg-[#0a0a0a] p-6 md:p-8">
        {unlocked ? (
          <div className="animate-fade-in flex flex-col gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
              Your Selection
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-300">
                <span>{materialLabel(karat)}</span>
                <span className="text-neutral-700">/</span>
                <span>{goldColor} Gold</span>
                <span className="text-neutral-700">/</span>
                <span>{bandColor} SuperKnit Band</span>
                <span className="text-neutral-700">/</span>
                <span>{quality}</span>
                <span className="text-neutral-700">/</span>
                <span className="capitalize">{diamondType.replace("-", " ")}</span>
              </div>
              <div className="mt-2">
                <span className="font-serif text-4xl text-gold-light md:text-5xl">
                  {formatINR(price)}
                </span>
              </div>
            </div>
            {submitError ? (
              <p className="pt-1 text-center text-sm text-red-500">
                {submitError}
              </p>
            ) : null}
            <div className="pt-2">
              <Button
                className="w-full"
                onClick={handlePlaceOrderRequest}
                disabled={isSubmittingOrder || orderSent}
              >
                {isSubmittingOrder
                  ? "Sending Request..."
                  : orderSent
                    ? "Request Sent"
                    : "Place Order Request"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReveal} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-gold">
              <Lock className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">
                Reveal Price
              </span>
            </div>
            <p className="-mt-2 text-sm text-neutral-400">
              Share a few quick details and we&apos;ll show your custom price.
            </p>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span className="text-xs text-red-600">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                value={form.phone}
                onChange={(phone) => setForm({ ...form, phone })}
                invalid={!!errors.phone}
              />
              {errors.phone && (
                <span className="text-xs text-red-500">{errors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email <span className="normal-case text-neutral-500">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="text-xs text-red-600">{errors.email}</span>
              )}
            </div>

            {submitError ? (
              <p className="-mt-1 text-center text-sm text-red-500">
                {submitError}
              </p>
            ) : null}
            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full"
              disabled={isRevealingPrice}
            >
              {isRevealingPrice ? "Saving..." : "Reveal Price"}
            </Button>
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              We respect your privacy
            </p>
            <a
              href="https://www.instagram.com/urviksutaria?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto inline-flex items-center gap-2 text-center text-[12px] tracking-wide text-neutral-300 transition-colors hover:text-gold"
            >
              <Instagram className="h-4 w-4 text-gold transition-transform group-hover:scale-110" />
              <span>
                For custom orders, DM us on{" "}
                <span className="font-semibold text-gold group-hover:text-gold-light">
                  Instagram
                </span>
              </span>
            </a>
          </form>
        )}
      </section>

      {orderSent ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
        >
          <div className="relative w-full max-w-lg overflow-hidden border border-gold/30 bg-[#080808] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.75)] md:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gold" />
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-green-500/10 blur-3xl" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-400/40 bg-green-500/15 text-green-400 shadow-[0_0_32px_rgba(34,197,94,0.24)]">
              <Check className="h-10 w-10" />
            </div>
            <h2
              id="order-success-title"
              className="relative mt-6 font-serif text-4xl leading-tight text-foreground md:text-5xl"
            >
              Request Sent Successfully
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
              Thank you, {form.name.trim() || "there"}. Your place order
              request has been received and our team will contact you shortly
              with the next steps.
            </p>

            <div className="relative mt-7 border border-neutral-800 bg-black/30 p-5 text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                Requested Selection
              </span>
              <div className="mt-4 space-y-2 text-sm text-neutral-300">
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">Gold Karat</span>
                  <span className="text-right text-foreground">
                    {materialLabel(karat)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">Color</span>
                  <span className="text-right text-foreground">
                    {goldColor} Gold
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">SuperKnit Band Colour</span>
                  <span className="text-right text-foreground">
                    {bandColor}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">Diamond</span>
                  <span className="text-right text-foreground">
                    {quality} / {diamondType.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-900 pt-3">
                  <span className="text-neutral-500">Price</span>
                  <span className="font-serif text-xl text-gold-light">
                    {formatINR(price)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="relative mt-7 w-full"
              onClick={() => setOrderSent(false)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
