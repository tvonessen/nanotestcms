import { addDataAndFileToRequest, type PayloadRequest } from 'payload';
import validateCaptcha from './validate-captcha';

// POST /api/survey-submit — TIM QC survey (hidden URL, temporary feature).
// Body: { token, response: { SRC, RID, LANG, TIME_S, COMPLETE, EXIT_AT, ...columns }, contact?: {...} }
// The captcha token is verified exactly like the contact form (validateCaptcha),
// then the two records are created via the local API with overrideAccess.

const RID_RE = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
type SurveyLangCode = 'en' | 'zh' | 'ja';
const LANGS: readonly SurveyLangCode[] = ['en', 'zh', 'ja'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const KEY_RE = /^[A-Za-z0-9_]{1,20}$/;
const MAX_ANSWER_KEYS = 300;
const MAX_TEXT_LENGTH = 5000;

function getClientIP(req: PayloadRequest): string {
  return (
    req.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers?.get('x-real-ip') ||
    req.headers?.get('cf-connecting-ip') ||
    'unknown'
  );
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function toStr(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function toNum(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function toBool(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

function sanitizeAnswers(value: unknown): Record<string, string | number> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const out: Record<string, string | number> = {};
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > MAX_ANSWER_KEYS) return null;
  for (const [k, v] of entries) {
    if (!KEY_RE.test(k)) continue;
    if (typeof v === 'number' && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === 'string') {
      out[k] = v.slice(0, MAX_TEXT_LENGTH);
    }
  }
  return out;
}

export const surveySubmitEndpoint = async (req: PayloadRequest): Promise<Response> => {
  try {
    await addDataAndFileToRequest(req);
    const body = (await req.json?.()) as {
      token?: string;
      response?: Record<string, unknown>;
      contact?: Record<string, unknown>;
    };

    const token = body?.token;
    if (!token) {
      console.warn(`Blocked survey submit: missing captcha token. IP: ${getClientIP(req)}`);
      return json({ error: 'Captcha token missing' }, 400);
    }

    const captchaResponse = await validateCaptcha({
      ...req,
      data: { token },
    } as PayloadRequest);
    if (captchaResponse.status !== 200) {
      console.warn(`Blocked survey submit: captcha failed. IP: ${getClientIP(req)}`);
      return captchaResponse;
    }

    const response = body?.response;
    if (!response || typeof response !== 'object') {
      return json({ error: 'Missing response record' }, 400);
    }

    const rid = toStr(response.RID, 9);
    if (!RID_RE.test(rid)) {
      return json({ error: 'Invalid RID' }, 400);
    }
    const rawLang = toStr(response.LANG, 2);
    const lang: SurveyLangCode = (LANGS as readonly string[]).includes(rawLang)
      ? (rawLang as SurveyLangCode)
      : 'en';
    const answers = sanitizeAnswers(response.answers ?? {});
    if (!answers) {
      return json({ error: 'Invalid answers payload' }, 400);
    }

    await req.payload.create({
      collection: 'survey-responses',
      overrideAccess: true,
      data: {
        rid,
        src: toStr(response.SRC, 100),
        lang,
        timeS: toNum(response.TIME_S),
        complete: toBool(response.COMPLETE),
        exitAt: toStr(response.EXIT_AT, 20),
        answers,
      },
    });

    const contact = body?.contact;
    const wantsAny =
      contact &&
      (toBool(contact.wants_summary) ||
        toBool(contact.wants_interview) ||
        toBool(contact.wants_prototype));
    if (contact && wantsAny) {
      const email = toStr(contact.email, 254);
      if (!EMAIL_RE.test(email)) {
        return json({ error: 'Invalid contact email' }, 400);
      }
      await req.payload.create({
        collection: 'survey-contacts',
        overrideAccess: true,
        data: {
          rid,
          email,
          name: toStr(contact.name, 200),
          company: toStr(contact.company, 200),
          country: toStr(contact.country, 200),
          wantsSummary: toBool(contact.wants_summary),
          wantsInterview: toBool(contact.wants_interview),
          wantsPrototype: toBool(contact.wants_prototype),
          consentLaunch: toBool(contact.consent_launch),
        },
      });
    }

    return json({ ok: true, rid });
  } catch (error) {
    console.error('Failed to store survey submission:', error);
    return json({ error: 'Failed to store survey submission' }, 500);
  }
};
