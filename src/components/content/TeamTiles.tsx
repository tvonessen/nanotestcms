import { getPayload } from 'payload';
import config from '@payload-config';

export default async function TeamTiles() {
  const payload = await getPayload({ config });
  const teamMembers = await payload.find({
    collection: 'team-members',
    where: { 'meta.published': { equals: true } },
  });
}
