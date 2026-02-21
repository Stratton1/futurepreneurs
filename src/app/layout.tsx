import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/features/navbar";
import { Footer } from "@/components/features/footer";
import { getCurrentUser } from "@/lib/supabase/auth-helpers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Futurepreneurs — Crowdfunding for Young Entrepreneurs",
  description:
    "The safe, supported crowdfunding platform for under-18s to raise money and start their business ideas. Backed by teachers, supported by parents, funded by the public.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error('Root layout: getCurrentUser failed', err);
  }

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
      >
        <Navbar user={user ? { role: user.role } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
