import { SiteHeader } from "@/components/site-header";
import { ProductGallery } from "@/components/product-gallery";
import { Configurator } from "@/components/configurator";
import { ShareSection } from "@/components/share-section";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="container py-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Gallery + credits */}
          <div className="flex flex-col gap-6">
            <ProductGallery />

            <div className="flex flex-col gap-1 border-t border-neutral-100 pt-5">
              <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">
                Brand
              </span>
              <span className="font-serif text-2xl text-neutral-900">WHOOP</span>
              <span className="mt-3 text-[11px] uppercase tracking-[0.3em] text-neutral-400">
                Designed By
              </span>
              <span className="font-serif text-xl italic text-neutral-900">
                Urvik Sutariya
              </span>
            </div>

            <ShareSection />
          </div>

          {/* Right — Configurator */}
          <div className="lg:sticky lg:top-10 lg:self-start">
            <Configurator />
          </div>
        </div>

        {/* Bottom narrative — like menofplatinum description blocks */}
        <section className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-10 border-t border-neutral-100 pt-12 md:grid-cols-3 md:gap-14">
          <div>
            <span className="gold-text text-[11px] font-bold uppercase tracking-[0.3em]">
              01 — Craft
            </span>
            <h3 className="mt-3 font-serif text-2xl text-neutral-900">
              Hand-Set Stones
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Each baguette and round-cut diamond is hand-set into a sculpted
              gold buckle, polished to a mirror finish.
            </p>
          </div>
          <div>
            <span className="gold-text text-[11px] font-bold uppercase tracking-[0.3em]">
              02 — Material
            </span>
            <h3 className="mt-3 font-serif text-2xl text-neutral-900">
              Solid Gold Hardware
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Choose between 10kt, 14kt, or 18kt yellow gold — each option
              certified for purity and finish.
            </p>
          </div>
          <div>
            <span className="gold-text text-[11px] font-bold uppercase tracking-[0.3em]">
              03 — Fit
            </span>
            <h3 className="mt-3 font-serif text-2xl text-neutral-900">
              WHOOP Compatible
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Engineered around the WHOOP 4.0 strap so the sensor sits flush
              against the wrist — no compromise on accuracy.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-100 bg-white">
        <div className="container flex flex-col items-center justify-between gap-3 py-8 text-center text-xs uppercase tracking-[0.25em] text-neutral-400 md:flex-row md:text-left">
          <span>© {new Date().getFullYear()} Galassia Jewels</span>
          <span>Made to Order · India</span>
        </div>
      </footer>
    </>
  );
}
