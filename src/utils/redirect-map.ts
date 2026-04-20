import type { PayloadHandler } from 'payload';
import type { Page, Redirect, Solution } from '@/payload-types';

export type RedirectMapEntry = {
  target: string;
  external: boolean;
  permanent: boolean;
};

export type RedirectMap = Record<string, RedirectMapEntry>;

const redirectMapHandler: PayloadHandler = async (req) => {
  const { payload } = req;

  const result = await payload.find({
    collection: 'redirects',
    where: { enabled: { equals: true } },
    pagination: false,
    depth: 1,
  });

  const map: RedirectMap = {};

  for (const doc of result.docs as Redirect[]) {
    const from = doc.from;
    const permanent = Boolean(doc.permanent);

    if (doc.toType === 'solution' && doc.toSolution) {
      const solution = doc.toSolution as Solution;
      if (solution?.slug) {
        map[from] = { target: `/nt/${solution.slug}`, external: false, permanent };
      }
    } else if (doc.toType === 'page' && doc.toPage) {
      const page = doc.toPage as Page;
      if (page?.url) {
        map[from] = { target: page.url, external: false, permanent };
      }
    } else if (doc.toType === 'external' && doc.toExternal) {
      map[from] = { target: doc.toExternal, external: true, permanent };
    }
  }

  return Response.json(map);
};

export default redirectMapHandler;
