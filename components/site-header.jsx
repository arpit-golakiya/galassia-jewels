"use client";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-neutral-900 bg-[#060606]">
      <div className="mx-auto flex w-full items-center justify-center px-2 py-2 sm:px-6 md:py-6 lg:max-w-[1280px]">
        <a href="/" aria-label="Galassia Jewels" className="block w-full sm:w-auto">
          <img
            src="/new_logo.png"
            alt="Galassia Jewels"
            className="mx-auto h-auto w-full max-h-[140px] object-contain sm:h-20 sm:w-auto sm:max-h-none"
            onError={(e) => {
              e.currentTarget.outerHTML =
                '<div style="font-family: \'Cormorant Garamond\', serif; font-size: 2rem; letter-spacing: 0.25em; color: #c9a063; text-align: center;">GALASSIA<div style="font-size:0.75rem;letter-spacing:0.5em;margin-top:4px;">— JEWELS —</div></div>';
            }}
          />
        </a>
      </div>
    </header>
  );
}
