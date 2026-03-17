import { Button } from '@heroui/react';
import { AtIcon, PhoneIcon } from '@phosphor-icons/react/dist/ssr';
import type { TeamMember } from '@/payload-types';

export default function TeamMemberContact({ contact }: { contact: TeamMember }) {
  return (
    <div className="flex flex-col p-2 md:p-4 bg-primary/10 rounded-lg grow">
      <h3 className="font-semibold text-lg leading-none">{contact.name}</h3>
      <h4 className="text-sm text-primary-600 dark:text-primary-400">
        {contact.position} at NANOTEST
      </h4>
      <div className="flex flex-row gap-2">
        {contact.email && (
          <a className="mt-3" href={`mailto:${contact.email}`}>
            <Button isIconOnly={false} size="sm" radius="md" color="default" variant="solid">
              <AtIcon className="size-5" /> Mail
            </Button>
          </a>
        )}
        {contact.phone && (
          <a className="mt-3" href={`tel:${contact.phone}`}>
            <Button isIconOnly={false} size="sm" radius="md" color="default" variant="solid">
              <PhoneIcon className="size-5" /> Phone
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
