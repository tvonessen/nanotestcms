import Link from 'next/link';
import { Navbar } from '@/components/navigation/navbar';
import Footer from '@/components/footer/footer';

import '@/styles/globals.css';
import { fontSans } from '@/config/fonts';

export default function NotFound() {
  return (
    <div className={`min-h-screen bg-background font-sans antialiased ${fontSans.className}`}>
      <Navbar />
      <div
        style={{
          minHeight: 'calc(100dvh - 30rem)',
          marginInline: 'auto',
          marginBlock: '6rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 className="text-2xl text-center">404 - Page Not Found</h1>
        <Link className="btn btn-primary btn-lg mt-12" href="/">
          Return home
        </Link>
      </div>
      <Footer />
    </div>
  );
}
