import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FuturePath AI",
  description:
    "AI-powered assessment, career recommendations, and learning roadmaps for children.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}