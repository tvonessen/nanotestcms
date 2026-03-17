import { Button } from '@heroui/react';
import { AtIcon, MapPinIcon, PhoneIcon } from '@phosphor-icons/react/ssr';
import type { DistroPartner } from '@/payload-types';
import RichTextWrapper from '../content/richtext-wrapper';

export default function DistroPartnerContact({ contact }: { contact: DistroPartner }) {
  return (
    <div className="flex flex-col p-2 md:p-4 bg-secondary/10 rounded-lg grow">
      <h3 className="font-semibold text-lg leading-none">{contact.contactperson.name}</h3>
      <h4 className="font-semibold text-secondary-700 dark:text-secondary-400">{contact.name}</h4>
      <div className="flex flex-row gap-2">
        {contact.contactperson.email && (
          <a className="mt-3" href={`mailto:${contact.contactperson.email}`}>
            <Button isIconOnly={false} size="sm" radius="md" variant="solid">
              <AtIcon className="size-5" /> Mail
            </Button>
          </a>
        )}
        {contact.contactperson.phone && (
          <a className="mt-3" href={`tel:${contact.contactperson.phone}`}>
            <Button isIconOnly={false} size="sm" radius="md" variant="solid">
              <PhoneIcon className="size-5" /> Phone
            </Button>
          </a>
        )}
      </div>
      {contact.address && (
        <div className="mt-2 rounded-lg bg-default px-3 flex flex-row gap-2">
          <MapPinIcon className="mt-3 size-5" />
          <RichTextWrapper text={contact.address} />
        </div>
      )}
    </div>
  );
}
