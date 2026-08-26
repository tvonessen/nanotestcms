import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';

export function generateSEODescription(doc: any) {
  if (!doc) {
    return '';
  }

  const plainText = String(
    doc?.description ??
      doc?.abstract ??
      (doc?.content?.abstract && convertLexicalToPlaintext({ data: doc.content.abstract })) ??
      doc?.subtitle ??
      '',
  );

  if (plainText.length > 150) {
    return plainText.substring(0, 147) + '...';
  }

  return plainText;
}
