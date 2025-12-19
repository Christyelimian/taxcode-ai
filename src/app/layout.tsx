import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { PersonalizationProvider } from '@/components/personalization-provider';

export const metadata: Metadata = {
  title: 'TaxCode',
  description: "Nigeria's premier tax technology ecosystem for the 2026 Tax Reform Act",
  icons: {
    icon: [
      { url: "/taxcode logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/taxcode logo.png", type: "image/png" },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        {/* Puter SDK for OpenRouter integration */}
        <script src="https://js.puter.com/v2/"></script>
      </head>
      <body className="font-body antialiased scroll-smooth overflow-x-hidden">
        <PersonalizationProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <Toaster />
        </PersonalizationProvider>
      </body>
    </html>
  );
}
