"use client";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-neutral-900 bg-[#060606]">
      <div className="container flex items-center justify-center py-2 md:py-6">
        <a href="/" aria-label="Galassia Jewels" className="block">
          <img
            src="/logo.png"
            alt="Galassia Jewels"
            className="h-16 w-auto md:h-20"
            onError={(e) => {
              e.currentTarget.outerHTML =
                '<div style="font-family: \'Cormorant Garamond\', serif; font-size: 2rem; letter-spacing: 0.25em; color: #c9a063;">GALASSIA<div style="text-align:center;font-size:0.75rem;letter-spacing:0.5em;margin-top:4px;">— JEWELS —</div></div>';
            }}
          />
        </a>
      </div>
    </header>
  );
}
