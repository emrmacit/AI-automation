import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enqivo — Customer requests, made manageable",
  description: "A simple customer assistant for independent businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
