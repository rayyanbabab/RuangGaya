import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RuangGaya — Photobooth Digital Praktis & Modern',
  description:
    'Abadikan momen seru bersama teman dengan photobooth digital RuangGaya: template keren, mudah dipakai, filter AR, dan instan langsung dari browser!',
  keywords: [
    'photobooth',
    'digital photobooth',
    'ruanggaya',
    'foto booth online',
    'photobooth indonesia',
    'template photobooth',
    'photo strip',
    'wedding photobooth',
  ],
  openGraph: {
    title: 'RuangGaya — Photobooth Digital Praktis & Modern',
    description: 'Abadikan momen seru bersama teman dengan photobooth digital yang keren, praktis, dan modern.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=chillax@300,400,500,600,700&display=swap"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
