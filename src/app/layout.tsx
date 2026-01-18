import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import NewsletterPopup from '@/components/newsletter-popup';
import { PersonalizationProvider } from '@/components/personalization-provider';
import { AuthProvider } from '@/components/auth-provider';
import { ErrorHandler } from '@/components/error-handler';

export const metadata: Metadata = {
  title: 'Tax Code',
  description: "A public-interest platform advancing tax awareness, advocacy and strategic guidance by explaining how tax law actually works in practice",
  icons: {
    icon: [
      { url: "/new-logo.png", type: "image/png", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { url: "/new-logo.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: [
      { url: "/new-logo.png", type: "image/png" },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taxcode.ng',
    siteName: 'Tax Code',
    title: 'Tax Code - Understanding Tax Through Law, Process and Justice',
    description: 'A public-interest platform advancing tax awareness, advocacy and strategic guidance by explaining how tax law actually works in practice',
    images: [
      {
        url: 'https://taxcode.ng/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tax Code - Nigeria Tax Awareness Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tax Code - Understanding Tax Through Law, Process and Justice',
    description: 'A public-interest platform advancing tax awareness, advocacy and strategic guidance by explaining how tax law actually works in practice',
    images: ['https://taxcode.ng/og-image.png'],
    creator: '@taxcodeng',
    site: '@taxcodeng',
  },
  metadataBase: new URL('https://taxcode.ng'),
  alternates: {
    canonical: 'https://taxcode.ng',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/new-logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/new-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/new-logo.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased scroll-smooth overflow-x-hidden">
        <ErrorHandler />
        <AuthProvider>
          <PersonalizationProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <NewsletterPopup />
            <Toaster />
          </PersonalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
