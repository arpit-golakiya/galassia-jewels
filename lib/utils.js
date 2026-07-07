import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// USD pricing for non-India visitors: flat add-on + INR converted at 1 USD = 100 INR.
export const USD_TO_INR_RATE = 100;
export const USD_FLAT_ADDON = 1000;

export function inrToUsd(inrAmount) {
  return USD_FLAT_ADDON + inrAmount / USD_TO_INR_RATE;
}

export function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Returns the numeric + formatted price for the currency the visitor was shown.
export function buildPriceForCurrency(inrAmount, currency) {
  if (currency === "USD") {
    const usd = inrToUsd(inrAmount);
    return { number: usd, display: formatUSD(usd), currency: "USD" };
  }
  return { number: inrAmount, display: formatINR(inrAmount), currency: "INR" };
}

// Heuristic: treat visitors in an India timezone as domestic (INR), everyone else as USD.
// Runs client-side only; defaults to India on the server to avoid a hydration flash.
export function isIndianVisitor() {
  if (typeof window === "undefined") return true;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return /Kolkata|Calcutta/i.test(tz);
  } catch {
    return true;
  }
}
