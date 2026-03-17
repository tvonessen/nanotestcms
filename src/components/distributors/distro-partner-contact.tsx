import { Button } from '@heroui/react';
import {
  AtIcon,
  GlobeSimpleIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
} from '@phosphor-icons/react/ssr';
import type { DistroPartner } from '@/payload-types';
import RichTextWrapper from '../content/richtext-wrapper';

export default function DistroPartnerContact({ contact }: { contact: DistroPartner }) {
  return (
    <div className="flex flex-col p-2 md:p-4 bg-secondary/10 rounded-lg grow-2">
      <h3 className="font-semibold text-lg leading-none">{contact.contactperson.name}</h3>
      <h4 className="font-semibold text-secondary-700 dark:text-secondary-400">{contact.name}</h4>
      <div className="flex flex-row gap-2 flex-wrap">
        {contact.website && (
          <a className="mt-3" href={contact.website} target="_blank" rel="noopener noreferrer">
            <Button isIconOnly={false} size="sm" radius="md" variant="solid">
              <GlobeSimpleIcon className="size-5" />
              {contact.website.replace('http://', '').replace('https://', '')}
            </Button>
          </a>
        )}
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
          <MapPinIcon className="mt-3 size-5" weight="fill" />
          <RichTextWrapper text={contact.address} />
        </div>
      )}
      {contact.description && (
        <div className="italic mt-2 rounded-lg bg-secondary/20 px-3 flex flex-row gap-2">
          <InfoIcon className="mt-3 size-5" />
          <RichTextWrapper text={contact.description} />
        </div>
      )}
    </div>
  );
}
