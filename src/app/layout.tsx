import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Thirtee6 • Oversized Streetwear",
    template: "%s • Thirtee6"
  },
  description: "Thirtee6 – minimal monochrome streetwear in oversized, heavyweight fits."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

