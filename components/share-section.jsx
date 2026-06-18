"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Mail } from "lucide-react";

const SHARE_TITLE = "Custom Diamond WHOOP Band — Galassia Jewels";
const SHARE_TEXT =
  "A bespoke WHOOP band in solid gold, set with diamonds. Made to order by Galassia Jewels.";

function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.711.227 1.359.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zM20.52 3.449C18.24 1.245 15.24.013 12.045 0 5.463 0 .104 5.36.101 11.945c0 2.105.549 4.16 1.595 5.971L0 24l6.235-1.637a11.882 11.882 0 005.71 1.455h.005c6.582 0 11.941-5.36 11.943-11.945a11.86 11.86 0 00-3.473-8.43z" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function ShareButton({ label, href, onClick, children }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      aria-label={`Share via ${label}`}
      className="group flex h-10 w-10 items-center justify-center border border-neutral-800 bg-[#0a0a0a] text-neutral-300 transition-all hover:border-gold hover:bg-gold hover:text-black"
    >
      {children}
    </Tag>
  );
}

export function ShareSection() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url || "");
  const encodedTitle = encodeURIComponent(SHARE_TITLE);
  const encodedText = encodeURIComponent(`${SHARE_TEXT} ${url}`);

  const whatsappHref = `https://wa.me/?text=${encodedText}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const mailHref = `mailto:?subject=${encodedTitle}&body=${encodedText}`;

  async function handleCopy(e) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-900 pt-5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
        Share
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <ShareButton label="WhatsApp" href={whatsappHref}>
          <IconWhatsApp className="h-4 w-4" />
        </ShareButton>
        <ShareButton label="X (Twitter)" href={xHref}>
          <IconX className="h-4 w-4" />
        </ShareButton>
        <ShareButton label="Facebook" href={facebookHref}>
          <IconFacebook className="h-4 w-4" />
        </ShareButton>
        <ShareButton label="Email" href={mailHref}>
          <Mail className="h-4 w-4" />
        </ShareButton>
        <ShareButton label="Copy Link" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </ShareButton>
        {copied ? (
          <span className="ml-1 text-[11px] uppercase tracking-[0.2em] text-gold">
            Link Copied
          </span>
        ) : null}
      </div>
    </div>
  );
}
