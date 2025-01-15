import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wildsave - Wildfire Safety & Emergency Alerts",
  description: "Real-time wildfire alerts, evacuation routes, and emergency preparedness resources to keep you and your loved ones safe during wildfire emergencies.",
  keywords: "wildfire safety, emergency alerts, evacuation routes, fire preparedness, emergency contacts, wildfire updates",
  authors: [{ name: "Wildsave Team" }],
  creator: "Wildsave",
  publisher: "Wildsave",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  metadataBase: new URL('https://wildsave.vercel.app/'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wildsave.vercel.app/',
    title: 'Wildsave - Your Wildfire Safety Companion',
    description: 'Get real-time wildfire alerts and emergency preparedness resources',
    siteName: 'Wildsave',
    images: [
      {
        url: '/og-image.jpg', // Add your OG image path
        width: 1200,
        height: 630,
        alt: 'Wildsave - Wildfire Safety Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wildsave - Wildfire Safety & Alerts',
    description: 'Real-time wildfire alerts and safety resources',
    images: ['/twitter-image.jpg'], // Add your Twitter card image path
    creator: '@wildsave',
    site: '@wildsave',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  category: 'Safety & Emergency',
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
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
        {children}
      </body>
    </html>
  );
}
