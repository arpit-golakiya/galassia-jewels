import "./globals.css";

export const metadata = {
  title: "Galassia Jewels — Custom Diamond WHOOP Band",
  description:
    "Bespoke WHOOP band crafted with gold and diamonds. Choose your karat and diamond grade.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
