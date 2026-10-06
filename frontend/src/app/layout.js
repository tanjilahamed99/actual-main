import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// ── Fonts ─────────────────────────────────────────────────────────────
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// ── Site config (edit once, reuse everywhere) ────────────────────────
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://actualieltsquestions.com";
const SITE_NAME = "Actual IELTS Questions";
const SITE_TAGLINE = "Real questions from real test takers";

// ── Metadata ─────────────────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL(SITE_URL),

  // %s is replaced by a page's own title, e.g. "Reading Tests · Actual IELTS Questions"
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },

  description:
    "A growing archive of real IELTS Listening, Reading, Writing, and Speaking questions collected directly from recent test takers around the world.",

  applicationName: SITE_NAME,
  keywords: [
    "IELTS",
    "IELTS questions",
    "IELTS reading",
    "IELTS listening",
    "IELTS writing",
    "IELTS speaking",
    "real IELTS test",
    "IELTS practice",
    "IELTS past papers",
    "band 9 IELTS",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // Canonical + alternates
  alternates: {
    canonical: "/",
  },

  // OpenGraph (Facebook, LinkedIn, WhatsApp, Slack previews)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Practice with real IELTS questions from actual recent test takers. Reading, Listening, Writing, and Speaking — updated weekly.",
    images: [
      {
        url: "/og-image.png", // put a 1200×630 image at public/og-image.png
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },

  // Twitter / X previews
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Practice with real IELTS questions from actual recent test takers. Updated weekly.",
    images: ["/og-image.png"],
    // creator: "@yourhandle", // uncomment when you have one
  },

  // Robots — allow indexing of public routes; keep admin/dashboard out
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Favicons / app icons — put matching files in public/
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },

  // PWA-ish manifest
  manifest: "/manifest.webmanifest",

  // Categorisation
  category: "education",

  // Prevent iOS from auto-linking phone numbers etc.
  formatDetection: {
    telephone: false,
  },
};

// ── Viewport (separate export in Next 14+ App Router) ───────────────
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" }, // paper
    { media: "(prefers-color-scheme: dark)", color: "#161d34" },  // indigo-deep
  ],
};

// ── Root layout ──────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}