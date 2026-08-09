import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Actual IELTS Questions — Real questions from real test takers",
  description:
    "A growing archive of real IELTS Listening, Reading, Writing, and Speaking questions collected directly from recent test takers around the world.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} antialiased`}>
        {children} <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
