import "./globals.css";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Marianne's Idea Garden",
  description: "A public garden of free ideas, notes, and possible interfaces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={lexend.className}>{children}</body>
    </html>
  );
}