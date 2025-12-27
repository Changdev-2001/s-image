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
