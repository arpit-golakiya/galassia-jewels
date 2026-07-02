import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-L37RZTBJ10";

export const metadata = {
  title: "Galassia Jewels — Custom Diamond WHOOP Band",
  description:
    "Bespoke WHOOP band crafted with gold and diamonds. Choose your karat and diamond grade.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-[#060606] text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
