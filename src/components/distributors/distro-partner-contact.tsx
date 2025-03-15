import type { DistroPartner } from '@/payload-types';
import RichTextWrapper from '../content/richtext-wrapper';

export default function DistroPartnerContact({ contact }: { contact: DistroPartner }) {
  return (
    <div>
      <h3>{contact.name}</h3>
      {contact.address && <RichTextWrapper text={contact.address} />}
      <h4>{contact.contactperson.name}</h4>
      <p>{contact.contactperson.email}</p>
      <p>{contact.contactperson.phone}</p>
    </div>
  );
}
