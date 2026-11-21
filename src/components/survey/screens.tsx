'use client';

import React from 'react';
import {
  type NavMode,
  OptionCard,
  PriceField,
  priceErrorText,
  RankingSlots,
  RatingGrid,
  ScaleRow,
} from './controls';
import { fmt, type SurveyLang, tx } from './i18n';
import type { ParticleKind } from './particles';
import {
  type Answers,
  type AnswerValue,
  getHint,
  getRankingSpecify,
  type MultiAnswer,
  type OptionDef,
  type PriceAnswer,
  priceError,
  type QuestionDef,
  type RankingAnswer,
} from './questions';
import type { ContactState } from './state';

export interface ResumeInfo {
  hasDraft: boolean;
  onContinue: () => void;
  onRestart: () => void;
}

export type SubmitState = 'idle' | 'sending' | 'error';

export interface ScreenCtx {
  lang: SurveyLang;
  siteLang: string;
  q: QuestionDef;
  seq: string[];
  answers: Answers;
  skipped: Record<string, boolean>;
  optionOrder: (q: QuestionDef) => OptionDef[];
  setAnswer: (id: string, v: AnswerValue) => void;
  toggleMulti: (q: QuestionDef, code: string) => void;
  toggleRank: (q: QuestionDef, code: string) => void;
  setSpecify: (q: QuestionDef, code: string, txt: string) => void;
  chooseGate: (q: QuestionDef, code: string) => void;
  clearSkipped: (id: string) => void;
  valid: boolean;
  skippable: boolean;
  navMode: NavMode;
  charging: boolean;
  chargeDuration: number;
  chargeKey: number;
  readyPulse: boolean;
  skipFill: number;
  skipHolding: boolean;
  skipHint: boolean;
  invalidSignal: number;
  onNext: () => void;
  onInvalidNext: () => void;
  onSelectAuto: () => void;
  onSkip: () => void;
  onSkipPointerDown: () => void;
  onSkipPointerUp: () => void;
  onSkipKeyDown: (e: React.KeyboardEvent) => void;
  onSkipKeyUp: (e: React.KeyboardEvent) => void;
  nextButtonRef: React.RefObject<HTMLButtonElement | null>;
  resume: ResumeInfo | null;
  onStart: () => void;
  started: boolean;
  g2: Record<string, boolean>;
  setG2: (code: string, on: boolean) => void;
  contact: ContactState;
  setContact: (patch: Partial<ContactState>) => void;
  emailError: boolean;
  emailShakeSignal: number;
  submitState: SubmitState;
  submittedEmail: string;
  burst: (kind: ParticleKind, x: number, y: number) => void;
}

export function ScreenContent({ ctx }: { ctx: ScreenCtx }) {
  const { q } = ctx;
  switch (q.type) {
    case 'intro':
      return <IntroScreen ctx={ctx} />;
    case 'info':
      return <InfoScreen ctx={ctx} />;
    case 'gate':
      return <GateScreen ctx={ctx} />;
    case 'final':
      return <FinalScreen ctx={ctx} />;
    case 'thanks':
      return <ThanksScreen ctx={ctx} />;
    default:
      return <QuestionScreen ctx={ctx} />;
  }
}

function hintText(ctx: ScreenCtx): string {
  const { q, lang } = ctx;
  const hint = getHint(q);
  if (q.type === 'scale') {
    return fmt(tx(hint.id, lang), { a: tx('Q11.end.1', lang), b: tx('Q11.end.2', lang) });
  }
  return fmt(tx(hint.id, lang), hint.params ?? {});
}

function IntroScreen({ ctx }: { ctx: ScreenCtx }) {
  const { lang, resume, onStart, started } = ctx;
  return (
    <div className="sv-intro">
      <h1>{tx('intro_title', lang)}</h1>
      <p>{tx('intro_p1', lang)}</p>
      <p>{tx('intro_p2', lang)}</p>
      <p>{tx('intro_p3', lang)}</p>
      {resume?.hasDraft && !started ? (
        <div className="sv-resume sv-reveal">
          <p>
            <strong>{tx('resume_text', lang)}</strong>
          </p>
          <div className="sv-resume-btns">
            <button type="button" className="sv-btn sv-btn-primary" onClick={resume.onContinue}>
              {tx('resume_continue', lang)}
            </button>
            <button type="button" className="sv-btn sv-btn-secondary" onClick={resume.onRestart}>
              {tx('resume_over', lang)}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="sv-kbtip">{tx('kbtip', lang)}</p>
          <button type="button" className="sv-btn sv-btn-primary sv-btn-lg" onClick={onStart}>
            {tx('start', lang)}
          </button>
        </>
      )}
    </div>
  );
}

function InfoScreen({ ctx }: { ctx: ScreenCtx }) {
  const { q, lang } = ctx;
  return (
    <div className="sv-info">
      <h2>{tx(q.info?.titleId ?? q.titleId, lang)}</h2>
      <div
        className="sv-info-body"
        dangerouslySetInnerHTML={{ __html: tx(q.info?.bodyId ?? '', lang) }}
      />
    </div>
  );
}

function GateScreen({ ctx }: { ctx: ScreenCtx }) {
  const { q, lang, answers, chooseGate } = ctx;
  const a = answers[q.id];
  const code = a && typeof a === 'object' && 'code' in a ? (a as { code: string }).code : undefined;
  return (
    <div className="sv-gate">
      <div className="sv-done-badge">
        <svg viewBox="0 0 26 26" className="sv-check-icon" aria-hidden="true">
          <circle cx="13" cy="13" r="11.5" className="sv-check-circle" />
          <path d="M8 13.5l3.2 3.2L18.5 9.5" className="sv-check-tick" />
        </svg>
        <span>{tx(q.gateBadgeId ?? 'p1done', lang)}</span>
      </div>
      <h2>{tx(q.titleId, lang)}</h2>
      <div className="sv-gate-btns">
        {(q.options ?? []).map((o, i) => (
          <button
            key={o.code}
            type="button"
            className={`sv-btn sv-btn-gate${i === 0 ? ' sv-btn-primary' : ' sv-btn-secondary'}`}
            aria-pressed={code === o.code}
            onClick={() => chooseGate(q, o.code)}
          >
            {tx(o.textId, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuestionScreen({ ctx }: { ctx: ScreenCtx }) {
  const { q, lang } = ctx;
  return (
    <div className="sv-question" aria-live="polite">
      <h2>{tx(q.titleId, lang)}</h2>
      <p className="sv-hint">{hintText(ctx)}</p>
      <AnswerArea ctx={ctx} />
      <CounterLine ctx={ctx} />
    </div>
  );
}

function AnswerArea({ ctx }: { ctx: ScreenCtx }) {
  const {
    q,
    lang,
    answers,
    optionOrder,
    setAnswer,
    toggleMulti,
    toggleRank,
    setSpecify,
    onSelectAuto,
    invalidSignal,
  } = ctx;
  const a = answers[q.id];
  switch (q.type) {
    case 'single': {
      const sel =
        a && typeof a === 'object' && 'code' in a
          ? (a as { code: string; txt?: string })
          : undefined;
      return (
        <div
          className={`sv-options${invalidSignal > 0 ? ' sv-shake' : ''}`}
          role="radiogroup"
          aria-label={tx(q.titleId, lang)}
          key={`shake-${invalidSignal}`}
        >
          {optionOrder(q).map((o, i) => (
            <OptionCard
              key={o.code}
              lang={lang}
              option={o}
              keyNumber={i + 1}
              mode="radio"
              selected={sel?.code === o.code}
              disabled={false}
              specifyValue={sel?.code === o.code ? sel.txt : undefined}
              onSelect={() => {
                setAnswer(q.id, { code: o.code, txt: sel?.code === o.code ? sel.txt : undefined });
                if (!o.specify) onSelectAuto();
              }}
              onSpecifyChange={(v) => setSpecify(q, o.code, v)}
            />
          ))}
        </div>
      );
    }
    case 'multi': {
      const m = (a as MultiAnswer) ?? {};
      const max = q.multiMax;
      const count = Object.values(m).filter((v) => v.on).length;
      return (
        <div
          className={`sv-options${invalidSignal > 0 ? ' sv-shake' : ''}`}
          role="group"
          aria-label={tx(q.titleId, lang)}
          key={`shake-${invalidSignal}`}
        >
          {optionOrder(q).map((o, i) => {
            const cell = m[o.code];
            const disabled = !!max && !cell?.on && count >= max;
            return (
              <OptionCard
                key={o.code}
                lang={lang}
                option={o}
                keyNumber={i + 1}
                mode="checkbox"
                selected={!!cell?.on}
                disabled={disabled}
                specifyValue={cell?.on ? cell.txt : undefined}
                onSelect={() => toggleMulti(q, o.code)}
                onSpecifyChange={(v) => setSpecify(q, o.code, v)}
              />
            );
          })}
        </div>
      );
    }
    case 'ranking': {
      const r = (a as RankingAnswer) ?? {};
      const count = Object.keys(r).length;
      const ordered = optionOrder(q);
      return (
        <div>
          <div className="sv-rank-sticky">
            <RankingSlots lang={lang} max={5} min={3} count={count} />
          </div>
          <div
            className={`sv-options${invalidSignal > 0 ? ' sv-shake' : ''}`}
            key={`shake-${invalidSignal}`}
          >
            {ordered.map((o, i) => (
              <OptionCard
                key={o.code}
                lang={lang}
                option={o}
                keyNumber={i + 1}
                mode="rank"
                selected={r[o.code] != null}
                rank={r[o.code]}
                disabled={count >= 5 && r[o.code] == null}
                specifyValue={
                  r[o.code] != null ? getRankingSpecify(ctx.answers, q.id, o.code) : undefined
                }
                onSelect={() => toggleRank(q, o.code)}
                onSpecifyChange={(v) => setSpecify(q, o.code, v)}
              />
            ))}
          </div>
        </div>
      );
    }
    case 'grid': {
      const g = (a as Record<string, string>) ?? {};
      return (
        <RatingGrid
          lang={lang}
          q={q}
          value={g}
          shakeSignal={invalidSignal}
          onSelect={(row, col) => setAnswer(q.id, { ...g, [row]: col })}
        />
      );
    }
    case 'scale': {
      const sel =
        a && typeof a === 'object' && 'code' in a ? (a as { code: string }).code : undefined;
      return (
        <div className={invalidSignal > 0 ? 'sv-shake' : ''} key={`shake-${invalidSignal}`}>
          <ScaleRow
            lang={lang}
            value={sel}
            onSelect={(v) => {
              setAnswer(q.id, { code: v });
              onSelectAuto();
            }}
          />
        </div>
      );
    }
    case 'price': {
      const p = a as PriceAnswer | undefined;
      const perr = priceError(q, answers);
      const showNone = !ctx.valid && ctx.invalidSignal > 0 && !perr;
      return (
        <PriceField
          lang={lang}
          value={p}
          onChange={(v) => setAnswer(q.id, v)}
          error={
            perr ? priceErrorText(lang, perr.amount) : showNone ? tx('price_none', lang) : null
          }
          shakeSignal={invalidSignal}
          onEnter={() => ctx.valid && ctx.onNext()}
        />
      );
    }
    case 'open': {
      const v = typeof a === 'string' ? a : '';
      return (
        <div className="sv-open">
          <label className="sv-label" htmlFor={`sv-open-${q.id}`}>
            {tx('your_answer', lang)}
          </label>
          <textarea
            id={`sv-open-${q.id}`}
            className="sv-input sv-textarea"
            value={v}
            onChange={(e) => setAnswer(q.id, e.target.value)}
          />
        </div>
      );
    }
    default:
      return null;
  }
}

function CounterLine({ ctx }: { ctx: ScreenCtx }) {
  const { q, lang, answers, valid } = ctx;
  if (q.type === 'multi' && q.multiMax) {
    const m = (answers[q.id] as MultiAnswer) ?? {};
    const n = Object.values(m).filter((v) => v.on).length;
    return (
      <div className={`sv-counter${valid ? ' sv-valid' : ''}`}>
        {fmt(tx('counter_sel', lang), { n, max: q.multiMax })}
      </div>
    );
  }
  return null;
}

// "privacy notice" link label per language; the note text itself comes from i18n.
const PRIVACY_LINK_LABEL: Record<SurveyLang, string> = {
  en: 'privacy notice',
  zh: '隐私声明',
  ja: 'プライバシーポリシー',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function FinalScreen({ ctx }: { ctx: ScreenCtx }) {
  const {
    lang,
    siteLang,
    g2,
    setG2,
    contact,
    setContact,
    emailError,
    emailShakeSignal,
    submitState,
  } = ctx;
  const anyG2 = Object.values(g2).some(Boolean);
  const g2Options: { code: string; textId: string }[] = [
    { code: '1', textId: 'G2.o1' },
    { code: '2', textId: 'G2.o2' },
    { code: '3', textId: 'G2.o3' },
  ];
  // Strip the trailing meta parenthetical ("(link in the live survey)" etc.)
  const note = tx('privacy_note', lang).replace(/[（(][^）)]*[）)]\s*$/, '');
  const linkLabel = PRIVACY_LINK_LABEL[lang];
  const noteParts = note.split(linkLabel);
  return (
    <div className="sv-final">
      <h2>{tx('final_title', lang)}</h2>
      <p className="sv-hint">{tx('final_hint', lang)}</p>
      <fieldset className="sv-g2">
        <legend className="sv-label">{tx('final_aria', lang)}</legend>
        {g2Options.map((o, i) => (
          <OptionCard
            key={o.code}
            lang={lang}
            option={{ code: o.code, textId: o.textId }}
            keyNumber={i + 1}
            mode="checkbox"
            selected={!!g2[o.code]}
            disabled={false}
            onSelect={() => setG2(o.code, !g2[o.code])}
          />
        ))}
      </fieldset>
      {anyG2 && (
        <div className="sv-contact sv-reveal">
          <label className="sv-label" htmlFor="sv-email">
            {tx('email_label', lang)}
          </label>
          <div
            key={emailShakeSignal}
            className={emailShakeSignal > 0 && emailError ? 'sv-shake' : ''}
          >
            <input
              id="sv-email"
              type="email"
              className="sv-input"
              value={contact.email}
              onChange={(e) => setContact({ email: e.target.value })}
            />
          </div>
          {(['name', 'company', 'country'] as const).map((f) => (
            <React.Fragment key={f}>
              <label className="sv-label" htmlFor={`sv-${f}`}>
                {tx(`${f}_label`, lang)}
              </label>
              <input
                id={`sv-${f}`}
                type="text"
                className="sv-input"
                value={contact[f]}
                onChange={(e) => setContact({ [f]: e.target.value })}
              />
            </React.Fragment>
          ))}
          <label className="sv-check">
            <input
              type="checkbox"
              checked={contact.launch}
              onChange={(e) => setContact({ launch: e.target.checked })}
            />
            <span>{tx('launch', lang)}</span>
          </label>
          <p className="sv-note">
            {noteParts[0]}
            <a href={`/${siteLang}/about/privacy`} target="_blank" rel="noreferrer">
              {linkLabel}
            </a>
            {noteParts[1] ?? ''}
          </p>
        </div>
      )}
      {emailError && (
        <div className="sv-error" role="alert">
          {tx('err_email', lang)}
        </div>
      )}
      {submitState === 'error' && (
        <div className="sv-error" role="alert">
          {tx('err_send', lang)}
        </div>
      )}
    </div>
  );
}

function ThanksScreen({ ctx }: { ctx: ScreenCtx }) {
  const { lang, submittedEmail } = ctx;
  const hasContact = !!submittedEmail;
  return (
    <div className="sv-thanks">
      <div className="sv-done-badge sv-done-lg">
        <svg viewBox="0 0 26 26" className="sv-check-icon" aria-hidden="true">
          <circle cx="13" cy="13" r="11.5" className="sv-check-circle" />
          <path d="M8 13.5l3.2 3.2L18.5 9.5" className="sv-check-tick" />
        </svg>
        <span>{tx('thanks_badge', lang)}</span>
      </div>
      <h1 className="sv-thanks-title">{tx('thanks_title', lang)}</h1>
      <p>{tx('thanks_p1', lang)}</p>
      <p>
        {hasContact ? (
          <span
            dangerouslySetInnerHTML={{
              __html: fmt(tx('thanks_contact', lang), { email: escapeHtml(submittedEmail) }),
            }}
          />
        ) : (
          tx('thanks_anon', lang)
        )}
      </p>
      <p className="sv-hint">{tx('thanks_close', lang)}</p>
    </div>
  );
}
