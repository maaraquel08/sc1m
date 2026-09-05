import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { BrandFavicon } from "@/components/site/brand-favicon";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "sc1m — a multi-brand design system",
    template: "%s · sc1m",
  },
  description: "Design system built on Base UI, Tailwind v4, and Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* flex + min-h-screen are required by fumadocs-ui's layouts */}
      <body className="flex min-h-screen flex-col">
        {/* RootProvider supplies next-themes (.dark on <html>) and the
            docs search dialog. It wraps everything so the gallery's theme
            toggle and the docs' toggle read the same state. */}
        <RootProvider>
          {/* Repaints the tab icon in the active brand colour. Renders
              nothing; must sit inside RootProvider so it mounts on every
              route, landing page included. */}
          <BrandFavicon />
          {/* Base UI: .root creates the stacking context portals escape from */}
          <div className="root flex min-h-dvh flex-col">{children}</div>
        </RootProvider>
      </body>
    </html>
  );
}
