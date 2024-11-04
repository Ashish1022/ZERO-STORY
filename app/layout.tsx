import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";
import { Analytics } from "@vercel/analytics/react"

const inter = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZERO | STORY",
  description: "Developed and Maintained by ZERO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body className={inter.className}>
            {children}
            <Analytics/>
          </body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
