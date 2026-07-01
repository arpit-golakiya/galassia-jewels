export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-900 bg-[#060606]">
      <div className="container flex flex-col items-center justify-between gap-3 py-8 text-center text-xs uppercase tracking-[0.25em] text-neutral-400 md:flex-row md:text-left">
        <span>© {new Date().getFullYear()} Galassia Jewels Private Limited</span>
        <a
          href="mailto:contact@galassiajewels.com"
          className="normal-case tracking-normal text-gold transition-colors hover:text-gold-light"
        >
          contact@galassiajewels.com
        </a>
        <a
          href="/terms-and-conditions"
          className="transition-colors hover:text-gold"
        >
          Terms &amp; Conditions
        </a>
      </div>
    </footer>
  );
}
