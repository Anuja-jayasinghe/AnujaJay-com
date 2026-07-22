import type { Metadata, Viewport } from "next";
import { Turret_Road, Numans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoToTopButton from "@/components/ui/GoToTopButton";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://anujajay.com");

const turretRoad = Turret_Road({
  weight: ["400", "500", "700", "800"],
  variable: "--font-turret-road",
  subsets: ["latin"],
});

const numans = Numans({
  weight: "400",
  variable: "--font-numans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portfolio | Anuja Jayasinghe",
    template: "%s | Anuja Jayasinghe",
  },
  description: "Personal portfolio of Anuja Jayasinghe, a software engineer focused on building impactful digital experiences.",
  applicationName: "Anuja Jayasinghe Portfolio",
  keywords: [
    "Anuja Jayasinghe",
    "Software Engineer",
    "Portfolio",
    "Web Development",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Anuja Jayasinghe" }],
  creator: "Anuja Jayasinghe",
  publisher: "Anuja Jayasinghe",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Portfolio | Anuja Jayasinghe",
    description: "Personal portfolio of Anuja Jayasinghe, a software engineer focused on building impactful digital experiences.",
    siteName: "Anuja Jayasinghe Portfolio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Anuja Jayasinghe portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Anuja Jayasinghe",
    description: "Personal portfolio of Anuja Jayasinghe, a software engineer focused on building impactful digital experiences.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon" }],
    other: [
      {
        rel: "mask-icon",
        url: "/logo-black.svg",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${numans.variable} ${turretRoad.variable} font-sans antialiased bg-white text-black min-h-screen flex flex-col`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <GoToTopButton />
      </body>
    </html>
  );
}
