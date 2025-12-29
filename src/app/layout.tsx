import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
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
            <Toaster />
          </PersonalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
