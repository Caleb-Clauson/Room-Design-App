import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nest and Frame Studio',
  description: 'Production-ready interior and exterior 3D design workspace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
