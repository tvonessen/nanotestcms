'use client';

import { Button, cn } from '@heroui/react';
import { Switch } from '@heroui/switch';
import { PayloadAdminBar, type PayloadMeUser } from '@payloadcms/admin-bar';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { SignOutIcon } from '@phosphor-icons/react/ssr';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? '';

type AdminBarProps = {
  preview?: boolean;
};

export function AdminBar({ preview: initialPreview }: AdminBarProps) {
  const router = useRouter();
  const [preview, setPreview] = useState(initialPreview);
  const [user, setUser] = useState<PayloadMeUser>(null);

  async function logout() {
    await fetch('/api/users/logout', { method: 'POST' });
    setUser(null);
    window.location.reload();
  }

  async function togglePreview(enable: boolean) {
    await fetch('/api/draft', { method: enable ? 'GET' : 'DELETE' });
    setPreview(enable);
    router.refresh();
  }

  return (
    <>
      <PayloadAdminBar
        cmsURL={serverURL}
        preview={preview}
        onAuthChange={(nextUser) => setUser(nextUser)}
        onPreviewExit={() => togglePreview(false)}
        style={{ display: 'none' }}
      />
      {user && (
        <div className="fixed left-2 bottom-2 right-2 z-99999">
          <div
            className={cn(
              'rounded-lg bg-background/50 p-2 backdrop-blur-sm',
              'flex flex-row gap-6 justify-between items-center flex-wrap',
              'border border-warning/50',
            )}
          >
            <span className="block text-md font-semibold ps-3">ADMIN BAR</span>
            <Switch
              size="sm"
              color="warning"
              className="ps-1"
              isSelected={preview}
              onValueChange={(val) => togglePreview(val)}
            >
              Show current draft
            </Switch>
            <div className="flex gap-2 flex-wrap">
              <Button onPress={() => router.replace('/admin')} color="warning" variant="flat">
                <ArrowRightIcon />
                Admin panel
              </Button>
              <Button onPress={logout} color="warning">
                <SignOutIcon /> Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
