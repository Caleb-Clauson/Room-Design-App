import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nest & Frame Studio | 3D Interior & Exterior Design SaaS',
  description: 'Production-ready multi-page 3D interior design workspace and client catalog.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#05070b] text-slate-300 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}