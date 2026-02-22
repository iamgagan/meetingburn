import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetingBurn — See What Your Meetings Really Cost",
  description:
    "A real-time meeting cost calculator that shows exactly how much your meetings cost in dollars. Track, analyze, and reduce meeting waste.",
  metadataBase: new URL("https://meetingburn-tau.vercel.app"),
  openGraph: {
    title: "MeetingBurn — See What Your Meetings Really Cost",
    description:
      "Watch the dollars tick up in real-time. Finally quantify 'this could have been an email.'",
    url: "https://meetingburn-tau.vercel.app",
    siteName: "MeetingBurn",
    type: "website",
    images: [
      {
        url: "/landing_page_KashMoney.png",
        width: 1512,
        height: 900,
        alt: "MeetingBurn — Real-time meeting cost calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetingBurn — See What Your Meetings Really Cost",
    description:
      "Watch the dollars tick up in real-time. Finally quantify 'this could have been an email.'",
    images: ["/landing_page_KashMoney.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
