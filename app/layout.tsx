import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nest & Frame Studio | 3D Interior & Exterior Design SaaS',
  description: 'A professional visual design workspace for interior and exterior projects.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
