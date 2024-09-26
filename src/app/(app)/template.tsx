import React, { Suspense } from 'react';

import Footer from '@/components/footer/footer';
import { Navbar } from '@/components/navigation/navbar';

import Loading from './loading';
import { Providers } from './providers';

interface TemplateProps {
  children: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return (
    <Providers>
      <Navbar />
      <main className="min-h-[calc(100dvh_-_10rem)]">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
      <Footer />
    </Providers>
  );
};

export default Template;
