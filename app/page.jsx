import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductGallery } from "@/components/product-gallery";
import { Configurator } from "@/components/configurator";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="container py-10 md:py-16">
        {/* Designed-by — sits top-right on every viewport */}
        <div className="mb-6 flex flex-col items-end gap-1 md:mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Designed By
          </span>
          <span className="font-serif text-xl italic text-foreground md:text-2xl">
            URVIK SUTARIA
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Gallery */}
          <div className="flex flex-col gap-6">
            <ProductGallery />
          </div>

          {/* Right — Configurator */}
          <div className="lg:sticky lg:top-10 lg:self-start">
            <Configurator />
          </div>
        </div>

        {/* Bottom narrative — like menofplatinum description blocks */}
        <section className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-10 border-t border-neutral-900 pt-12 md:grid-cols-3 md:gap-14">
          <div>
            <span className="gold-text text-[11px] font-bold uppercase tracking-[0.3em]">
              01 — Craft
            </span>
            <h3 className="mt-3 font-serif text-2xl text-foreground">
              Hand-Set Stones
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Each baguette and round-cut diamond is hand-set into a sculpted
              gold buckle, polished to a mirror finish.
            </p>
          </div>
          <div>
            <span className="gold-text text-[11px] font-bold uppercase tracking-[0.3em]">
              02 — Material
            </span>
            <h3 className="mt-3 font-serif text-2xl text-foreground">
              Solid Gold Hardware
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Choose between 10kt, 14kt, or 18kt gold — each option finished to
              order in yellow, rose, or white.
            </p>
          </div>
          <div>
            <span className="gold-text text-[11px] font-bold uppercase tracking-[0.3em]">
              03 — Fit
            </span>
            <h3 className="mt-3 font-serif text-2xl text-foreground">
              WHOOP Compatible
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Engineered around the WHOOP 5.0 strap so the sensor sits flush
              against the wrist — no compromise on accuracy.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
