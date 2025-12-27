import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S-Image - Generate Stunning Images from Text",
  description:
    "Create beautiful images from text prompts using AI-powered image generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/diamond.png" type="image/png" />
        <link rel="shortcut icon" href="/diamond.png" type="image/png" />
        <link
          rel="icon"
          href="/icon-192.png"
          sizes="192x192"
          type="image/png"
        />
        <link
          rel="icon"
          href="/icon-512.png"
          sizes="512x512"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={cn(
          inter.className,
          "antialiased bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
        )}
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
