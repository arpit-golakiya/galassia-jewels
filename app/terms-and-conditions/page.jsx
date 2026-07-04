import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    title: "Made-To-Order Products",
    body: "Each Galassia Jewels piece is crafted to order according to the selected gold karat, diamond type, diamond quality, size, and finish. Minor handmade variations may occur while maintaining the confirmed design and quality standard.",
  },
  {
    title: "Pricing And Payment",
    body: "Prices shown or shared are based on the selected configuration and prevailing material costs. Final order confirmation may require advance payment. Any taxes, duties, shipping, or handling charges will be communicated before order confirmation.",
  },
  {
    title: "Order Confirmation",
    body: "An order is considered confirmed only after Galassia Jewels receives the required customer details and payment confirmation. Production timelines begin after confirmation and may vary based on customization, material availability, and finishing requirements.",
  },
  {
    title: "Certification And Materials",
    body: "Gold purity and diamond specifications are provided according to the selected configuration. Where applicable, product certification or quality details will be shared with the customer at delivery.",
  },
  {
    title: "Cancellation And Refunds",
    body: "Because our pieces are made to order, cancellations or refunds may be limited after production begins. Refund eligibility, if any, will be reviewed based on the order stage, customization, and product condition.",
  },
  {
    title: "Shipping And Delivery",
    body: "Delivery timelines are estimates and may be affected by production, quality checks, shipping partners, customs, or customer availability. The customer is responsible for providing accurate shipping and contact details.",
  },
  {
    title: "Product Care",
    body: "Customers should avoid harsh chemicals, impact, and improper handling. Galassia Jewels is not responsible for damage caused by misuse, accidental impact, unauthorized repair, or normal wear and tear.",
  },
  {
    title: "Contact",
    body: "For questions about an order, customization, or refund eligibility, contact us at contact@galassiajewels.com.",
  },
];

export const metadata = {
  title: "Terms & Conditions — Galassia Jewels",
  description:
    "Terms and conditions for made-to-order Galassia Jewels products, payments, refunds, shipping, and product care.",
};

export default function TermsAndConditions() {
  return (
    <>
      <SiteHeader />

      <main className="container py-12 md:py-16">
        <section className="mx-auto max-w-4xl">
          <a
            href="/"
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold transition-colors hover:text-gold-light"
          >
            Back to Home
          </a>
          <div className="mt-8 border-b border-neutral-900 pb-8">
            <span className="gold-divider text-xs font-bold uppercase tracking-[0.3em]">
              Galassia Jewels
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Terms &amp; Conditions
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-400">
              Please read these terms before placing a custom order with
              Galassia Jewels. By confirming an order, you agree to the terms
              listed below.
            </p>
          </div>

          <div className="grid gap-7 py-10">
            {sections.map((section) => (
              <section
                key={section.title}
                className="border-b border-neutral-900 pb-7 last:border-b-0"
              >
                <h2 className="font-serif text-2xl text-foreground">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
