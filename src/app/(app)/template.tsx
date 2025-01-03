import type React from 'react';
import { Suspense } from 'react';

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
      <div className="min-h-[calc(100dvh_-_10rem)]">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
      <Footer />
    </Providers>
  );
};

export default Template;
