import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "ol/ol.css";


import '../styles/globals.css';

import { StoreProvider } from './StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GPSD Admin Dashboard',
  description: 'Generated by the GPSD Admins',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}