import type { PayloadRequest } from 'payload';
import { QUESTIONS } from '@/components/survey/questions';

// GET /api/survey-export          → CSV of all survey-responses (answers flattened into columns)
// GET /api/survey-export?type=contacts → CSV of all survey-contacts
// GET /api/survey-export?sep=;    → use semicolon as separator (German Excel locale)
//
// Requires an authenticated admin session (payload-token cookie), same as the
// collections themselves. Open the URL directly in the browser while logged in
// to the admin panel to download the file.

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(columns: string[], rows: Record<string, unknown>[], sep: string): string {
  const lines = [columns.map(csvCell).join(sep)];
  for (const row of rows) {
    lines.push(columns.map((c) => csvCell(row[c])).join(sep));
  }
  return `${lines.join('\r\n')}\r\n`;
}

// Sort answer columns in survey order (Q01 … Q13, GATE, D01 …, S1 …, R01 …),
// unknown columns (e.g. G2_*) go last, alphabetically within their group.
const QUESTION_ORDER = Object.keys(QUESTIONS).map((k) => k.toLowerCase());

export function answerColumnOrder(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const ai = QUESTION_ORDER.indexOf(a.split('_')[0].toLowerCase());
    const bi = QUESTION_ORDER.indexOf(b.split('_')[0].toLowerCase());
    const ra = ai === -1 ? 999 : ai;
    const rb = bi === -1 ? 999 : bi;
    return ra - rb || a.localeCompare(b);
  });
}

const RESPONSE_META_COLUMNS = ['rid', 'src', 'lang', 'timeS', 'complete', 'exitAt', 'createdAt'];
const CONTACT_COLUMNS = [
  'rid',
  'email',
  'name',
  'company',
  'country',
  'wantsSummary',
  'wantsInterview',
  'wantsPrototype',
  'consentLaunch',
  'createdAt',
];

export const surveyExportEndpoint = async (req: PayloadRequest): Promise<Response> => {
  if (!req.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const url = new URL(req.url ?? '', 'http://localhost');
    const type = url.searchParams.get('type') === 'contacts' ? 'contacts' : 'responses';
    const sep = url.searchParams.get('sep') === ';' ? ';' : ',';

    if (type === 'contacts') {
      const result = await req.payload.find({
        collection: 'survey-contacts',
        overrideAccess: true,
        pagination: false,
        limit: 10000,
        depth: 0,
        sort: '-createdAt',
      });
      const rows = result.docs.map((d) => ({
        rid: d.rid,
        email: d.email,
        name: d.name,
        company: d.company,
        country: d.country,
        wantsSummary: d.wantsSummary ? 1 : 0,
        wantsInterview: d.wantsInterview ? 1 : 0,
        wantsPrototype: d.wantsPrototype ? 1 : 0,
        consentLaunch: d.consentLaunch ? 1 : 0,
        createdAt: d.createdAt,
      }));
      return csvDownload(toCsv(CONTACT_COLUMNS, rows, sep), `tim-survey-contacts`, sep);
    }

    const result = await req.payload.find({
      collection: 'survey-responses',
      overrideAccess: true,
      pagination: false,
      limit: 10000,
      depth: 0,
      sort: '-createdAt',
    });

    const answerKeys = new Set<string>();
    for (const doc of result.docs) {
      const a = doc.answers;
      if (a && typeof a === 'object' && !Array.isArray(a)) {
        for (const k of Object.keys(a as Record<string, unknown>)) answerKeys.add(k);
      }
    }
    const columns = [...RESPONSE_META_COLUMNS, ...answerColumnOrder([...answerKeys])];

    const rows = result.docs.map((d) => ({
      rid: d.rid,
      src: d.src,
      lang: d.lang,
      timeS: d.timeS,
      complete: d.complete ? 1 : 0,
      exitAt: d.exitAt,
      createdAt: d.createdAt,
      ...((d.answers && typeof d.answers === 'object' ? d.answers : {}) as Record<string, unknown>),
    }));

    return csvDownload(toCsv(columns, rows, sep), 'tim-survey-responses', sep);
  } catch (error) {
    console.error('Survey CSV export failed:', error);
    return json({ error: 'Export failed' }, 500);
  }
};

function csvDownload(csv: string, baseName: string, _sep: string): Response {
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  return new Response(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${baseName}-${stamp}.csv"`,
    },
  });
}
