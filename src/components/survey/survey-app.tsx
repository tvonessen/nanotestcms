'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { NavAction, type NavMode } from './controls';
import { fmt, type SurveyLang, surveyHtmlLang, surveyLangLabels, surveyLangs, tx } from './i18n';
import ParticleCanvas, { type ParticleCanvasRef } from './particles';
import {
  type Answers,
  type AnswerValue,
  buildResponseColumns,
  buildSequence,
  isGate,
  isQuestionScreen,
  isValid,
  type MultiAnswer,
  type OptionDef,
  QUESTIONS,
  type QuestionDef,
  type RankingAnswer,
  setRankingSpecify,
  singleCode,
} from './questions';
import { ScreenContent, type ScreenCtx } from './screens';
import {
  type AppState,
  clearDraft,
  type Draft,
  EMAIL_RE,
  hasAnyAnswer,
  initialLang,
  initialState,
  loadDraft,
  saveDraft,
  shuffleExceptLast,
} from './state';

const LANG_OUT: Record<SurveyLang, string> = { en: 'EN', zh: 'ZH', ja: 'JA' };
const NUM_KEYS: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  '0': 9,
};
const PART_KEY: Record<string, string> = {
  p1: 'part_p1',
  p2: 'part_p2',
  dist: 'part_dist',
  distT: 'part_distT',
  close: 'part_close',
};
const PART_SHORT: Record<string, string> = {
  p1: 'short_p1',
  p2: 'short_p2',
  dist: 'short_dist',
  distT: 'short_distT',
  close: 'short_close',
};

function nextOf(seq: string[], id: string): string {
  const i = seq.indexOf(id);
  return seq[Math.min(i + 1, seq.length - 1)] ?? 'final';
}

export default function SurveyApp({ siteLang }: { siteLang: string }) {
  const searchParams = useSearchParams();
  const src = searchParams.get('src') ?? '';
  const urlLang = searchParams.get('lang');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [state, setState] = React.useState<AppState>(() =>
    initialState(
      initialLang(urlLang, typeof navigator !== 'undefined' ? navigator.language : null),
    ),
  );
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const [started, setStarted] = React.useState(false);
  const [hasDraft, setHasDraft] = React.useState(false);
  const draftRef = React.useRef<Draft | null>(null);
  const [anim, setAnim] = React.useState<'fwd' | 'back'>('fwd');
  const [fadeKey, setFadeKey] = React.useState(0);
  const [readyPulse, setReadyPulse] = React.useState(false);
  const [skipFill, setSkipFill] = React.useState(0);
  const [skipHolding, setSkipHolding] = React.useState(false);
  const [skipHint, setSkipHint] = React.useState(false);
  const [invalidSignal, setInvalidSignal] = React.useState(0);
  const [submitState, setSubmitState] = React.useState<'idle' | 'sending' | 'error'>('idle');
  const [emailError, setEmailError] = React.useState(false);
  const [emailShakeSignal, setEmailShakeSignal] = React.useState(0);
  const [submitShakeSignal, setSubmitShakeSignal] = React.useState(0);
  const [submittedEmail, setSubmittedEmail] = React.useState('');
  const [scrolled, setScrolled] = React.useState(false);
  const [atEnd, setAtEnd] = React.useState(false);

  const skipRaf = React.useRef(0);
  const skipStart = React.useRef(0);
  const hintTimer = React.useRef<number | undefined>(undefined);
  const pulseTimer = React.useRef<number | undefined>(undefined);
  const prevSeqRef = React.useRef<string[]>([]);
  const prevValidRef = React.useRef(true);
  const nextButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const particlesRef = React.useRef<ParticleCanvasRef>(null);
  const onSubmitRef = React.useRef<() => Promise<void>>(async () => {});

  const seq = React.useMemo(() => buildSequence(state.answers), [state.answers]);
  const screen = state.screen;
  const q = QUESTIONS[screen];
  const idx = seq.indexOf(screen);
  const lang = state.lang;

  // --- draft: load once, save debounced, leave-warning ---------------------
  React.useEffect(() => {
    const d = loadDraft();
    if (d) {
      draftRef.current = d;
      setHasDraft(true);
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
      setAtEnd(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  React.useEffect(() => {
    if (!started || state.submitted) return;
    const t = window.setTimeout(() => saveDraft(stateRef.current), 300);
    return () => window.clearTimeout(t);
  }, [state, started]);

  React.useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      const s = stateRef.current;
      if (!s.submitted && hasAnyAnswer(s.answers)) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBefore);
    return () => window.removeEventListener('beforeunload', onBefore);
  }, []);

  // --- route changes: keep the current screen valid for the new sequence ----
  React.useEffect(() => {
    const s = stateRef.current;
    if (!seq.includes(s.screen)) {
      const oldIdx = prevSeqRef.current.indexOf(s.screen);
      const newIdx = Math.min(Math.max(oldIdx, 0), seq.length - 1);
      setState((st) => ({ ...st, screen: seq[newIdx] }));
    }
    prevSeqRef.current = seq;
  }, [seq]);

  // --- shuffle ranking options once per respondent ---------------------------
  React.useEffect(() => {
    const qq = QUESTIONS[state.screen];
    if (qq?.shuffle && !state.shuffles[qq.id]) {
      const codes = shuffleExceptLast((qq.options ?? []).map((o) => o.code));
      setState((s) => ({ ...s, shuffles: { ...s.shuffles, [qq.id]: codes } }));
    }
  }, [state.screen, state.shuffles]);

  // --- milestone burst when a gate screen opens ------------------------------
  React.useEffect(() => {
    if (!isGate(screen)) return;
    const t = window.setTimeout(() => {
      const badge = document.querySelector('.sv-done-badge');
      if (badge) {
        const r = badge.getBoundingClientRect();
        particlesRef.current?.burst('milestone', r.left + r.width / 2, r.top + r.height / 2);
      }
    }, 420);
    return () => window.clearTimeout(t);
  }, [screen]);

  const optionOrder = React.useCallback((qq: QuestionDef): OptionDef[] => {
    const opts = qq.options ?? [];
    const sh = stateRef.current.shuffles[qq.id];
    if (!sh) return opts;
    const byCode = new Map(opts.map((o) => [o.code, o]));
    return sh.map((c) => byCode.get(c)).filter((o): o is OptionDef => !!o);
  }, []);

  // --- navigation ------------------------------------------------------------
  const goTo = React.useCallback((target: string, dir: 'fwd' | 'back' = 'fwd') => {
    setAnim(dir);
    setState((s) => ({ ...s, screen: target }));
    window.scrollTo({ top: 0 });
  }, []);

  const goNext = React.useCallback(() => {
    const s = stateRef.current;
    goTo(nextOf(buildSequence(s.answers), s.screen));
  }, [goTo]);

  const goBack = React.useCallback(() => {
    const s = stateRef.current;
    if (s.screen === 'final' && s.exitAt) {
      const exit = s.exitAt;
      setState((st) => ({ ...st, exitAt: null }));
      goTo(exit, 'back');
      return;
    }
    const sq = buildSequence(s.answers);
    const i = sq.indexOf(s.screen);
    if (i > 0) goTo(sq[i - 1], 'back');
  }, [goTo]);

  const finishNow = React.useCallback(() => {
    const s = stateRef.current;
    if (!isQuestionScreen(s.screen) || isGate(s.screen)) return;
    setState((st) => ({ ...st, exitAt: st.screen }));
    goTo('final');
  }, [goTo]);

  // --- answers ---------------------------------------------------------------
  const setAnswer = React.useCallback((id: string, v: AnswerValue) => {
    setState((s) => ({
      ...s,
      answers: { ...s.answers, [id]: v },
      skipped: { ...s.skipped, [id]: false },
    }));
  }, []);

  const clearSkipped = React.useCallback((id: string) => {
    setState((s) => ({ ...s, skipped: { ...s.skipped, [id]: false } }));
  }, []);

  const toggleMulti = React.useCallback((qq: QuestionDef, code: string) => {
    setState((s) => {
      const cur = (s.answers[qq.id] as MultiAnswer) ?? {};
      const cell = cur[code] ?? { on: false };
      const opt = qq.options?.find((o) => o.code === code);
      let next: MultiAnswer;
      if (cell.on) {
        next = { ...cur, [code]: { ...cell, on: false } };
      } else if (opt?.exclusive) {
        next = { [code]: { on: true, txt: cell.txt } };
      } else {
        next = { ...cur };
        for (const [k, v] of Object.entries(cur)) {
          if (v.on && qq.options?.find((o) => o.code === k)?.exclusive) {
            next[k] = { ...v, on: false };
          }
        }
        next[code] = { on: true, txt: cell.txt };
      }
      return {
        ...s,
        answers: { ...s.answers, [qq.id]: next },
        skipped: { ...s.skipped, [qq.id]: false },
      };
    });
  }, []);

  const toggleRank = React.useCallback((qq: QuestionDef, code: string) => {
    setState((s) => {
      const r = { ...((s.answers[qq.id] as RankingAnswer) ?? {}) };
      if (r[code] != null) {
        const removed = r[code];
        delete r[code];
        for (const k of Object.keys(r)) if (r[k] > removed) r[k] -= 1;
      } else {
        if (Object.keys(r).length >= 5) return s;
        r[code] = Object.keys(r).length + 1;
      }
      return {
        ...s,
        answers: { ...s.answers, [qq.id]: r },
        skipped: { ...s.skipped, [qq.id]: false },
      };
    });
  }, []);

  const setSpecify = React.useCallback((qq: QuestionDef, code: string, txt: string) => {
    setState((s) => {
      if (qq.type === 'ranking') {
        const answers: Answers = { ...s.answers };
        setRankingSpecify(answers, qq.id, code, txt);
        return { ...s, answers };
      }
      const a = s.answers[qq.id];
      if (a && typeof a === 'object' && 'code' in a) {
        return { ...s, answers: { ...s.answers, [qq.id]: { ...a, txt } } };
      }
      const m = (a as MultiAnswer) ?? {};
      return {
        ...s,
        answers: { ...s.answers, [qq.id]: { ...m, [code]: { ...(m[code] ?? { on: true }), txt } } },
      };
    });
  }, []);

  const chooseGate = React.useCallback((qq: QuestionDef, code: string) => {
    const s = stateRef.current;
    const newAnswers = { ...s.answers, [qq.id]: { code } };
    const newSeq = buildSequence(newAnswers);
    const target = nextOf(newSeq, qq.id);
    setAnim('fwd');
    setState((st) => ({ ...st, answers: newAnswers, screen: target }));
    window.setTimeout(() => {
      const el = document.querySelector('.sv-gate-btns');
      if (el) {
        const r = el.getBoundingClientRect();
        particlesRef.current?.burst('gate', r.left + r.width / 2, r.top);
      }
    }, 50);
  }, []);

  // --- hold to skip (3.3a) ---------------------------------------------------
  const doSkip = React.useCallback(() => {
    const s = stateRef.current;
    const id = s.screen;
    const newAnswers = { ...s.answers };
    delete newAnswers[id];
    const newSkipped = { ...s.skipped, [id]: true };
    const newSeq = buildSequence(newAnswers);
    setAnim('fwd');
    setState((st) => ({
      ...st,
      answers: newAnswers,
      skipped: newSkipped,
      screen: nextOf(newSeq, id),
    }));
  }, []);

  const skipBegin = React.useCallback(() => {
    if (skipHolding) return;
    setSkipHolding(true);
    skipStart.current = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - skipStart.current) / 800);
      setSkipFill(p);
      if (p >= 1) {
        cancelAnimationFrame(skipRaf.current);
        setSkipHolding(false);
        setSkipFill(0);
        doSkip();
        return;
      }
      skipRaf.current = requestAnimationFrame(step);
    };
    skipRaf.current = requestAnimationFrame(step);
  }, [skipHolding, doSkip]);

  const skipEnd = React.useCallback(() => {
    const held = performance.now() - skipStart.current;
    cancelAnimationFrame(skipRaf.current);
    setSkipHolding(false);
    setSkipFill(0);
    if (held < 200) {
      setSkipHint(true);
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
      hintTimer.current = window.setTimeout(() => setSkipHint(false), 2600);
    }
  }, []);

  // --- valid / pulse ---------------------------------------------------------
  const valid = q ? isValid(q, state.answers) : true;
  React.useEffect(() => {
    if (valid && !prevValidRef.current) {
      setReadyPulse(true);
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
      pulseTimer.current = window.setTimeout(() => setReadyPulse(false), 320);
    }
    prevValidRef.current = valid;
  }, [valid]);

  // --- keyboard (3.4) ----------------------------------------------------------
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const s = stateRef.current;
      const qq = QUESTIONS[s.screen];
      if (e.key === 'Enter') {
        if (s.screen === 'final') {
          e.preventDefault();
          void onSubmitRef.current();
          return;
        }
        if (qq && isQuestionScreen(s.screen) && !isGate(s.screen) && isValid(qq, s.answers)) {
          e.preventDefault();
          goNext();
        }
        return;
      }
      if (!(e.key in NUM_KEYS)) return;
      const i = NUM_KEYS[e.key];
      if (s.screen === 'final') {
        const codes = ['1', '2', '3'];
        if (i < codes.length) {
          e.preventDefault();
          setState((st) => ({ ...st, g2: { ...st.g2, [codes[i]]: !st.g2[codes[i]] } }));
        }
        return;
      }
      if (!qq || !isQuestionScreen(s.screen) || isGate(s.screen)) return;
      const opts = optionOrder(qq);
      if (i >= opts.length) return;
      e.preventDefault();
      const code = opts[i].code;
      if (qq.type === 'single' || qq.type === 'scale') {
        setAnswer(qq.id, { code });
      } else if (qq.type === 'multi') {
        toggleMulti(qq, code);
      } else if (qq.type === 'ranking') {
        toggleRank(qq, code);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, optionOrder, setAnswer, toggleMulti, toggleRank]);

  // --- intro actions -----------------------------------------------------------
  const onStart = () => {
    setStarted(true);
    setHasDraft(false);
    setAnim('fwd');
    setState((s) => ({ ...s, startTime: Date.now(), screen: 'Q01' }));
    window.scrollTo({ top: 0 });
  };
  const onContinue = () => {
    const d = draftRef.current;
    if (!d) return;
    draftRef.current = null;
    setHasDraft(false);
    setStarted(true);
    setState({ ...d, submitted: false });
  };
  const onRestart = () => {
    clearDraft();
    draftRef.current = null;
    setHasDraft(false);
    setStarted(false);
    setState((s) => initialState(s.lang));
  };

  // --- language ----------------------------------------------------------------
  const switchLang = (l: SurveyLang) => {
    if (l === stateRef.current.lang) return;
    setFadeKey((k) => k + 1);
    setState((s) => ({ ...s, lang: l }));
  };

  // --- submit (5.3) --------------------------------------------------------------
  const onSubmit = React.useCallback(async () => {
    const s = stateRef.current;
    if (s.screen !== 'final' || submitState === 'sending') return;
    const anyG2 = Object.values(s.g2).some(Boolean);
    const email = s.contact.email.trim();
    if (anyG2 && !EMAIL_RE.test(email)) {
      setEmailError(true);
      setEmailShakeSignal((n) => n + 1);
      document.getElementById('sv-email')?.focus();
      return;
    }
    setEmailError(false);
    setSubmitState('sending');
    try {
      if (!executeRecaptcha) throw new Error('recaptcha not ready');
      const token = await executeRecaptcha('survey_submit');
      const sq = buildSequence(s.answers);
      const response: Record<string, string | number> = {
        SRC: src,
        RID: s.rid,
        LANG: LANG_OUT[s.lang],
        ...buildResponseColumns(s.answers, s.skipped, sq),
        TIME_S: s.startTime ? Math.round((Date.now() - s.startTime) / 1000) : 0,
        COMPLETE: s.exitAt ? 0 : 1,
        EXIT_AT: s.exitAt ?? '',
        G2_1: s.g2['1'] ? 1 : 0,
        G2_2: s.g2['2'] ? 1 : 0,
        G2_3: s.g2['3'] ? 1 : 0,
      };
      const body: Record<string, unknown> = { token, response };
      if (anyG2) {
        body.contact = {
          RID: s.rid,
          email,
          name: s.contact.name.trim(),
          company: s.contact.company.trim(),
          country: s.contact.country.trim(),
          wants_summary: s.g2['1'] ? 1 : 0,
          wants_interview: s.g2['2'] ? 1 : 0,
          wants_prototype: s.g2['3'] ? 1 : 0,
          consent_launch: s.contact.launch ? 1 : 0,
        };
      }
      const res = await fetch('/api/survey-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`submit failed: ${res.status}`);
      clearDraft();
      setSubmittedEmail(anyG2 ? email : '');
      setSubmitState('idle');
      setAnim('fwd');
      setState((st) => ({ ...st, submitted: true, screen: 'thanks' }));
      window.setTimeout(() => {
        const title = document.querySelector('.sv-thanks-title');
        if (title) {
          const r = title.getBoundingClientRect();
          particlesRef.current?.burst('thanks', r.left + 10, r.top + r.height / 2);
          particlesRef.current?.burst('thanks', r.right - 10, r.top + r.height / 2);
        }
      }, 300);
    } catch {
      setSubmitState('error');
      setSubmitShakeSignal((n) => n + 1);
    }
  }, [executeRecaptcha, src, submitState]);
  onSubmitRef.current = onSubmit;

  // --- derived nav state ---------------------------------------------------------
  const skippable = q?.skippable && !isGate(screen);
  let navMode: NavMode = 'next';
  if (isQuestionScreen(screen) && !isGate(screen) && !valid) {
    navMode = skippable ? 'skip' : 'invalid';
  }
  const showNav = screen !== 'intro' && screen !== 'thanks';
  const canBack = idx > 0;
  const showFinishNow = isQuestionScreen(screen) && !isGate(screen) && screen !== 'final';

  // --- progress (3.5) --------------------------------------------------------------
  const progress = React.useMemo(() => {
    if (screen === 'intro') return { pct: 0, full: '', short: '' };
    if (screen === 'thanks') return { pct: 100, full: '', short: '' };
    const qScreens = seq.filter(isQuestionScreen);
    const i = seq.indexOf(screen);
    const before = seq.slice(0, i).filter(isQuestionScreen).length;
    const pct = qScreens.length ? (before / qScreens.length) * 100 : 0;
    if (screen === 'G1' || screen === 'final') {
      return { pct, full: tx('part_close', lang), short: tx('short_close', lang) };
    }
    const part = q.part;
    const partKey = PART_KEY[part];
    const shortKey = PART_SHORT[part];
    if (!isQuestionScreen(screen)) {
      return { pct, full: tx(partKey, lang), short: tx(shortKey, lang) };
    }
    if (screen === 'Q01' && singleCode(state.answers, 'Q01') === '3') {
      return { pct, full: tx('q1', lang), short: tx('q1', lang) };
    }
    const partQs = qScreens.filter((id) => QUESTIONS[id].part === part);
    const n = partQs.indexOf(screen) + 1;
    const N = partQs.length;
    return {
      pct,
      full: `${tx(partKey, lang)} · ${fmt(tx('q_n_of', lang), { n, N })}`,
      short: `${tx(shortKey, lang)} · ${n}/${N}`,
    };
  }, [screen, seq, lang, state.answers, q]);

  const ctx: ScreenCtx = {
    lang,
    siteLang,
    q,
    seq,
    answers: state.answers,
    skipped: state.skipped,
    optionOrder,
    setAnswer,
    toggleMulti,
    toggleRank,
    setSpecify,
    chooseGate,
    clearSkipped,
    valid,
    skippable,
    navMode,
    readyPulse,
    skipFill,
    skipHolding,
    skipHint,
    invalidSignal,
    onNext: () => {
      if (!valid) return;
      const btn = nextButtonRef.current;
      if (btn) {
        const r = btn.getBoundingClientRect();
        particlesRef.current?.burst('next', r.left + r.width / 2, r.top + r.height / 2);
      }
      goNext();
    },
    onInvalidNext: () => setInvalidSignal((n) => n + 1),
    onSkip: doSkip,
    onSkipPointerDown: skipBegin,
    onSkipPointerUp: skipEnd,
    onSkipKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skipBegin();
      }
    },
    onSkipKeyUp: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skipEnd();
      }
    },
    nextButtonRef,
    resume: { hasDraft, onContinue, onRestart },
    onStart,
    started,
    g2: state.g2,
    setG2: (code, on) => setState((s) => ({ ...s, g2: { ...s.g2, [code]: on } })),
    contact: state.contact,
    setContact: (patch) => setState((s) => ({ ...s, contact: { ...s.contact, ...patch } })),
    emailError,
    emailShakeSignal,
    submitState,
    submittedEmail,
    burst: (kind, x, y) => particlesRef.current?.burst(kind, x, y),
  };

  return (
    <div
      className={`sv-root${scrolled ? ' sv-scrolled' : ''}${atEnd ? ' sv-at-end' : ''}`}
      lang={surveyHtmlLang[lang]}
    >
      <ParticleCanvas ref={particlesRef} />
      <header className="sv-header">
        <div className="sv-header-inner">
          <div className="sv-header-row">
            <div className="sv-langswitch" role="group" aria-label={tx('lang_label', lang)}>
              {surveyLangs.map((l) => (
                <button
                  key={l}
                  type="button"
                  lang={surveyHtmlLang[l]}
                  aria-pressed={l === lang}
                  className={`sv-langbtn${l === lang ? ' sv-active' : ''}`}
                  onClick={() => switchLang(l)}
                >
                  {surveyLangLabels[l]}
                </button>
              ))}
            </div>
          </div>
          {(progress.full || progress.short) && (
            <div className="sv-progress-label">
              <span className="sv-pl-full">{progress.full}</span>
              <span className="sv-pl-short">{progress.short}</span>
            </div>
          )}
          <div className="sv-progress-track">
            <div className="sv-progress-bar" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      </header>

      <main className="sv-main">
        <div className={`sv-card sv-screen sv-anim-${anim}`} key={screen}>
          <div className="sv-langfade" key={fadeKey}>
            <ScreenContent ctx={ctx} />
          </div>
          {showNav && (
            <div className="sv-navrow">
              <div className="sv-navrow-inner">
                {canBack ? (
                  <button type="button" className="sv-linkbtn" onClick={goBack}>
                    {tx('back', lang)}
                  </button>
                ) : (
                  <span />
                )}
                <div className="sv-navrow-right">
                  {showFinishNow && (
                    <button
                      type="button"
                      className="sv-linkbtn sv-finish"
                      title={tx('finish_title', lang)}
                      onClick={finishNow}
                    >
                      {tx('finish', lang)}
                    </button>
                  )}
                  {screen === 'final' ? (
                    <button
                      key={submitShakeSignal}
                      ref={nextButtonRef}
                      type="button"
                      className={`sv-btn sv-btn-primary sv-submit${
                        submitState === 'sending' ? ' sv-sending' : ''
                      }${submitState === 'error' ? ' sv-shake' : ''}`}
                      disabled={submitState === 'sending'}
                      onClick={() => void onSubmit()}
                    >
                      {submitState === 'sending' && <span className="sv-charge-fill sv-loop" />}
                      <span className="sv-btn-label">
                        {tx(submitState === 'sending' ? 'sending' : 'submit', lang)}
                      </span>
                    </button>
                  ) : isGate(screen) || screen === 'info' ? (
                    q.type === 'info' ? (
                      <button
                        ref={nextButtonRef}
                        type="button"
                        className="sv-btn sv-btn-primary"
                        onClick={goNext}
                      >
                        <span className="sv-btn-label">
                          {tx(q.info?.btnId ?? 'concept.btn', lang)}
                        </span>
                      </button>
                    ) : null
                  ) : (
                    <NavAction
                      lang={lang}
                      mode={navMode}
                      readyPulse={readyPulse}
                      skipFill={skipFill}
                      skipHolding={skipHolding}
                      skipHint={skipHint}
                      onNext={ctx.onNext}
                      onInvalidClick={ctx.onInvalidNext}
                      onSkipPointerDown={skipBegin}
                      onSkipPointerUp={skipEnd}
                      onSkipKeyDown={ctx.onSkipKeyDown}
                      onSkipKeyUp={ctx.onSkipKeyUp}
                      buttonRef={nextButtonRef}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
