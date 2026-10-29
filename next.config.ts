import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Header-based CSP (no nonces) so the page stays statically rendered and
// CDN-cacheable. 'unsafe-inline' is needed for Next's inline bootstrap
// scripts and styled-jsx; the rest of the policy still blocks framing,
// plugins, base-tag injection and unexpected connection targets.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // next/image skips its optimizer for SVGs, so the devicon icons load straight
  // from jsDelivr; GitHub's OG images are the other allowed remote host.
  "img-src 'self' data: blob: https://cdn.jsdelivr.net https://opengraph.githubassets.com",
  "font-src 'self'",
  "media-src 'self'",
  // Web3Forms receives the contact form; Vercel Analytics/Speed Insights are same-origin.
  `connect-src 'self' https://api.web3forms.com${isDev ? " ws: wss:" : ""}`,
  // The resume page frames its own PDF.
  "frame-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // 'self' rather than 'none': /dir/Anuja_CV.pdf iframes /Anuja_CV.pdf.
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/cv",
        destination: "/Anuja_CV.pdf",
        permanent: true,
      },
      {
        source: "/resume",
        destination: "/Anuja_CV.pdf",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        // Not applied to the PDF itself: Chrome's PDF viewer inherits the
        // response CSP, and object-src 'none' renders the viewer blank.
        source: "/((?!Anuja_CV\\.pdf).*)",
        headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
      },
    ];
  },
};

export default nextConfig;
