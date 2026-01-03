import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShortFormFactory Hub",
  description: "Managed short-form editing with strict QA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
