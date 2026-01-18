import type { Document } from '@/payload-types';
import type { IconProps } from '@phosphor-icons/react';
import {
  BlueprintIcon,
  BookOpenTextIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  PaperPlaneTiltIcon,
  PresentationChartIcon,
  ScrollIcon,
} from '@phosphor-icons/react/dist/ssr';
import { getPayload } from 'payload';
import config from '@payload-config';

interface DownloadsProps {
  docs: (Document | string)[];
}

export default async function Downloads({ docs }: DownloadsProps) {
  if (!docs || docs.length === 0) {
    return null;
  }

  const payload = await getPayload({ config });
  const documents = await Promise.all(
    docs.map(async (doc) => {
      // If doc is an object, return it
      if (typeof doc === 'object') return doc;
      // If doc is a string (id), fetch it from the database
      const document = await payload.find({
        collection: 'documents',
        where: { id: { equals: doc } },
        overrideAccess: false,
      });
      return document.docs[0];
    }),
  );

  function formatFilesize(size: number | null | undefined) {
    if (size === null || size === undefined) {
      return '??? kB';
    }
    return size > 1000000
      ? `${(size / 1000000).toFixed(1)} MB`
      : size > 1000
        ? `${Math.round(size / 1000)} kB`
        : `${size} B`;
  }

  return (
    <section className="container mx-auto col-span-full">
      <h2 className="px-5 py-2 bg-secondary text-background text-2xl font-semibold my-2 rounded-md">
        Downloads
      </h2>
      <ul className="w-full">
        {documents.map((doc) => (
          <li
            className="w-full max-w-none grid grid-cols-[48px_4fr_6fr_8ch_48px] gap-x-2 items-center bg-black bg-opacity-10 my-2 p-2 rounded-md"
            key={doc.id}
          >
            <DocumentIcon className="text-secondary" type={doc.type} size={28} weight="bold" />
            {doc.description ? (
              <>
                <b>{doc.filename_alt ?? doc.filename}</b>
                <p className="text-small">{doc.description}</p>
              </>
            ) : (
              <b className="col-span-2">{doc.filename_alt ?? doc.filename}</b>
            )}

            <p>{formatFilesize(doc.filesize)}</p>
            <a
              className="px-2 py-1 rounded-md bg-primary text-background flex items-center justify-center hover:bg-secondary transition-colors"
              href={doc.url as string}
              download={doc.filename_alt ?? doc.filename}
              aria-label="Download"
              title="Download"
            >
              <DownloadSimpleIcon size={24} weight="bold" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface DocumentIconProps extends IconProps {
  type: Document['type'];
}

function DocumentIcon({ type, ...props }: DocumentIconProps) {
  switch (type) {
    case 'datasheet':
      return <BlueprintIcon {...props} />;
    case 'flyer':
      return <PaperPlaneTiltIcon {...props} />;
    case 'presentation':
      return <PresentationChartIcon {...props} />;
    case 'whitepaper':
      return <ScrollIcon {...props} />;
    case 'manual':
      return <BookOpenTextIcon {...props} />;
    default:
      return <FileTextIcon {...props} />;
  }
}
