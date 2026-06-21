import { Button, Image } from '@heroui/react';
import { AtIcon, GlobeSimpleIcon, MapPinIcon, PhoneIcon } from '@phosphor-icons/react/ssr';
import type { DistroPartner, Media } from '@/payload-types';
import { resolveAssetURL } from '@/utils/public-url';
import RichTextWrapper from '../content/richtext-wrapper';

export default function DistroPartnerContact({ contact }: { contact: DistroPartner }) {
  const logo = contact.logo && typeof contact.logo === 'object' ? (contact.logo as Media) : null;
  const logoUrl = logo?.sizes?.small?.url ?? logo?.sizes?.medium?.url ?? logo?.url;

  return (
    <div className="flex flex-col p-2 md:p-4 bg-secondary/10 rounded-lg grow-2">
      <div className="flex flex-row gap-4 justify-between items-start">
        <div>
          <h3 className="ms-1 font-semibold text-lg leading-none">{contact.contactperson.name}</h3>
          <h4 className="ms-1 font-semibold text-secondary-700 dark:text-secondary-400">
            {contact.name}
          </h4>
          {contact.description && (
            <div className="ms-1 italic text-secondary-700 dark:text-secondary">
              <RichTextWrapper text={contact.description} />
            </div>
          )}
        </div>
        {logo && (
          <Image
            className="hidden md:block object-cover rounded-sm"
            style={{
              height: 'auto',
              maxHeight: '64px',
              width: `${(logo.width! * 64) / logo.height!}px`,
              maxWidth: '164px',
              aspectRatio: `${logo.width}/${logo.height}`,
              backgroundColor:
                logo.mimeType?.includes('svg') || logo.mimeType?.includes('png')
                  ? '#fff7'
                  : 'transparent',
              padding:
                logo.mimeType?.includes('svg') || logo.mimeType?.includes('png') ? '0.15rem' : '0',
            }}
            src={resolveAssetURL(logoUrl)}
            alt={logo.alt}
          />
        )}
      </div>
      <div className="flex flex-row gap-2 flex-wrap mt-3">
        {contact.website && (
          <a href={contact.website} target="_blank" rel="noopener noreferrer">
            <Button color="secondary" isIconOnly={false} size="sm" radius="md" variant="solid">
              <GlobeSimpleIcon className="size-5" />
              {contact.website.replace('http://', '').replace('https://', '')}
            </Button>
          </a>
        )}
        {contact.contactperson.email && (
          <a href={`mailto:${contact.contactperson.email}`}>
            <Button color="secondary" isIconOnly={false} size="sm" radius="md" variant="solid">
              <AtIcon className="size-5" /> Mail
            </Button>
          </a>
        )}
        {contact.contactperson.phone && (
          <a href={`tel:${contact.contactperson.phone}`}>
            <Button color="secondary" isIconOnly={false} size="sm" radius="md" variant="solid">
              <PhoneIcon className="size-5" /> Phone
            </Button>
          </a>
        )}
      </div>
      {contact.address && (
        <div className="mt-2 rounded-lg bg-white dark:bg-background px-3 flex flex-row gap-2">
          <MapPinIcon className="mt-3 size-5" weight="fill" />
          <RichTextWrapper text={contact.address} />
        </div>
      )}
    </div>
  );
}
