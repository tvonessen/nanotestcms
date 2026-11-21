import type { SurveyLang } from './i18n';
import type { Answers } from './questions';

export const DRAFT_KEY = 'nanotest-tim-survey-draft-v1';

export interface ContactState {
  email: string;
  name: string;
  company: string;
  country: string;
  launch: boolean;
}

export interface AppState {
  screen: string;
  answers: Answers;
  skipped: Record<string, boolean>;
  shuffles: Record<string, string[]>;
  lang: SurveyLang;
  rid: string;
  startTime: number;
  exitAt: string | null;
  g2: Record<string, boolean>;
  contact: ContactState;
  submitted: boolean;
}

export interface Draft extends AppState {
  version: 1;
}

const RID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function genRid(): string {
  let s = '';
  const buf = new Uint32Array(8);
  crypto.getRandomValues(buf);
  for (let i = 0; i < 8; i++) s += RID_CHARS[buf[i] % RID_CHARS.length];
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export function shuffleExceptLast<T>(items: T[]): T[] {
  const head = items.slice(0, -1);
  const buf = new Uint32Array(head.length);
  crypto.getRandomValues(buf);
  for (let i = head.length - 1; i > 0; i--) {
    const j = buf[i] % (i + 1);
    [head[i], head[j]] = [head[j], head[i]];
  }
  return [...head, items[items.length - 1]];
}

export function initialLang(urlLang: string | null, navLang: string | null): SurveyLang {
  if (urlLang === 'zh' || urlLang === 'ja' || urlLang === 'en') return urlLang;
  const nav = (navLang ?? '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('ja')) return 'ja';
  return 'en';
}

export function emptyContact(): ContactState {
  return { email: '', name: '', company: '', country: '', launch: false };
}

export function initialState(lang: SurveyLang): AppState {
  return {
    screen: 'intro',
    answers: {},
    skipped: {},
    shuffles: {},
    lang,
    rid: genRid(),
    startTime: 0,
    exitAt: null,
    g2: { '1': false, '2': false, '3': false },
    contact: emptyContact(),
    submitted: false,
  };
}

export function saveDraft(state: AppState): void {
  try {
    if (state.submitted) return;
    if (Object.keys(state.answers).length === 0 && state.screen === 'intro') return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, ...state } satisfies Draft));
  } catch {
    // storage may be blocked — fail silently (spec 5.5)
  }
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (d?.version !== 1 || typeof d !== 'object' || !d.answers || !d.rid) return null;
    return d;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function hasAnyAnswer(answers: Answers): boolean {
  return Object.keys(answers).length > 0;
}
