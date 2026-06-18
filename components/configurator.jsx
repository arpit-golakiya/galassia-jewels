"use client";

import { useMemo, useState } from "react";
import { Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatINR } from "@/lib/utils";
import {
  DIAMOND_TYPES,
  KARATS,
  getPrice,
  qualitiesFor,
} from "@/lib/pricing";

function OptionTile({ active, onClick, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-1 border px-4 py-3 text-left transition-all",
        active
          ? "border-black bg-black text-white"
          : "border-neutral-300 bg-white text-neutral-900 hover:border-black"
      )}
    >
      <span className="text-sm font-medium tracking-wide">{title}</span>
      {sub ? (
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.15em]",
            active ? "text-neutral-200" : "text-neutral-600"
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

export function Configurator() {
  const [diamondType, setDiamondType] = useState("natural");
  const [quality, setQuality] = useState("EF VVS-VS");
  const [karat, setKarat] = useState("18kt");

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [unlocked, setUnlocked] = useState(false);
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
    if (!form.phone.trim()) next.phone = "Required";
    else if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleReveal(e) {
    e.preventDefault();
    if (!validate()) return;
    setUnlocked(true);
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Title block */}
      <div className="flex flex-col gap-3">
        <span className="gold-divider text-xs font-bold uppercase tracking-[0.3em]">
          Bespoke Edition
        </span>
        <h1 className="font-serif text-4xl leading-tight text-neutral-900 md:text-5xl">
          Custom Diamond <span className="italic">Whoop</span> Band
        </h1>
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          Available in Gold &amp; Diamond
        </p>
        <p className="max-w-prose text-[15px] leading-relaxed text-neutral-600">
          A reimagined WHOOP band in solid gold, set with hand-selected baguette
          and round-cut diamonds. Crafted to order — choose your karat and
          diamond grade to make it yours.
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
        {diamondType === "lab-grown" && (
          <p className="text-xs italic text-neutral-500">
            Lab-grown collection is currently offered in EF VVS-VS grade only.
          </p>
        )}
      </section>

      {/* Karat */}
      <section className="flex flex-col gap-3">
        <Label>Gold Karat</Label>
        <div className="grid grid-cols-3 gap-3">
          {KARATS.map((k) => (
            <OptionTile
              key={k}
              active={karat === k}
              onClick={() => setKarat(k)}
              title={k.toUpperCase()}
              sub={k === "18kt" ? "Finest" : k === "14kt" ? "Balanced" : "Light"}
            />
          ))}
        </div>
      </section>

      {/* Price / Reveal Form */}
      <section className="border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
        {unlocked ? (
          <div className="animate-fade-in flex flex-col gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
              Your Selection
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-700">
                <span>{karat.toUpperCase()} Gold</span>
                <span className="text-neutral-300">/</span>
                <span>{quality}</span>
                <span className="text-neutral-300">/</span>
                <span className="capitalize">{diamondType.replace("-", " ")}</span>
              </div>
              <div className="mt-2">
                <span className="font-serif text-4xl text-neutral-900 md:text-5xl">
                  {formatINR(price)}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Button className="w-full">Enquire to Order</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReveal} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-neutral-700">
              <Lock className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-[0.3em]">
                Reveal Price
              </span>
            </div>
            <p className="-mt-2 text-sm text-neutral-600">
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
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 9XXXX XXXXX"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <span className="text-xs text-red-600">{errors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email <span className="normal-case text-neutral-400">(optional)</span>
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

            <Button type="submit" size="lg" className="mt-2 w-full">
              Reveal Price
            </Button>
            <p className="text-center text-[11px] uppercase tracking-[0.2em] text-neutral-400">
              We respect your privacy
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
