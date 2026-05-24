'use client';

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation.js';
import type React from 'react';
import { publicServerURL } from '@/utils/public-url';

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter();

  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={publicServerURL} />;
};
