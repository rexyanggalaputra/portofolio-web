import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rexy Anggala Putra - Business Intelligence Specialist",
  description: "Portfolio of Rexy Anggala Putra, a business intelligence and data analytics specialist.",
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
