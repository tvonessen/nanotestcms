'use client';

import type React from 'react';
import { fmt, type SurveyLang, tx } from './i18n';
import { formatEur, type OptionDef, type PriceAnswer, type QuestionDef } from './questions';

// ---------------------------------------------------------------------------
// Navigation action button: normal Next, charging Next (9.7), dimmed invalid
// Next (Q01/Q03) or "Hold to skip" (3.3a).
// ---------------------------------------------------------------------------

export type NavMode = 'next' | 'charging' | 'invalid' | 'skip';

interface NavActionProps {
  lang: SurveyLang;
  mode: NavMode;
  chargeDuration: number;
  chargeKey: number;
  charging: boolean;
  readyPulse: boolean;
  skipFill: number;
  skipHolding: boolean;
  skipHint: boolean;
  onNext: () => void;
  onInvalidClick: () => void;
  onSkipPointerDown: () => void;
  onSkipPointerUp: () => void;
  onSkipKeyDown: (e: React.KeyboardEvent) => void;
  onSkipKeyUp: (e: React.KeyboardEvent) => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function NavAction(props: NavActionProps) {
  const {
    lang,
    mode,
    chargeDuration,
    chargeKey,
    readyPulse,
    skipFill,
    skipHolding,
    skipHint,
    onNext,
    onInvalidClick,
    onSkipPointerDown,
    onSkipPointerUp,
    onSkipKeyDown,
    onSkipKeyUp,
    buttonRef,
  } = props;

  if (mode === 'skip') {
    return (
      <div className="sv-skipwrap">
        <button
          type="button"
          ref={buttonRef}
          className={`sv-btn sv-btn-skip${skipHolding ? ' sv-holding' : ''}${skipHint ? ' sv-shake' : ''}`}
          aria-label={tx('skip_aria', lang)}
          onPointerDown={onSkipPointerDown}
          onPointerUp={onSkipPointerUp}
          onPointerLeave={onSkipPointerUp}
          onPointerCancel={onSkipPointerUp}
          onKeyDown={onSkipKeyDown}
          onKeyUp={onSkipKeyUp}
        >
          <span
            className="sv-skip-fill"
            style={{
              width: `${skipFill * 100}%`,
              transitionDuration: skipHolding ? '0ms' : '250ms',
            }}
          />
          <span className="sv-btn-label">
            {tx(skipHolding ? 'keep_holding' : 'hold_skip', lang)}
          </span>
        </button>
        {skipHint && <div className="sv-skip-hint">{tx('skip_hint', lang)}</div>}
      </div>
    );
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      className={`sv-btn sv-btn-primary${mode === 'charging' ? ' sv-charging' : ''}${mode === 'invalid' ? ' sv-dimmed' : ''}${readyPulse ? ' sv-ready' : ''}`}
      onClick={mode === 'invalid' ? onInvalidClick : onNext}
      aria-disabled={mode === 'invalid'}
    >
      {mode === 'charging' && (
        <span
          key={chargeKey}
          className="sv-charge-fill"
          style={{ animationDuration: `${chargeDuration}ms` }}
        />
      )}
      <span className="sv-btn-label">{tx('next', lang)}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Option card (single / multi / ranking)
// ---------------------------------------------------------------------------

interface OptionCardProps {
  lang: SurveyLang;
  option: OptionDef;
  keyNumber: number; // 1-based, 0 = none
  mode: 'radio' | 'checkbox' | 'rank';
  selected: boolean;
  disabled: boolean;
  rank?: number;
  specifyValue?: string;
  onSelect: () => void;
  onSpecifyChange?: (v: string) => void;
}

export function OptionCard(props: OptionCardProps) {
  const {
    lang,
    option,
    keyNumber,
    mode,
    selected,
    disabled,
    rank,
    specifyValue,
    onSelect,
    onSpecifyChange,
  } = props;
  const role = mode === 'radio' ? 'radio' : 'checkbox';
  return (
    <div className={`sv-option${selected ? ' sv-selected' : ''}${disabled ? ' sv-disabled' : ''}`}>
      <button
        type="button"
        role={role}
        aria-checked={selected}
        aria-disabled={disabled || undefined}
        className="sv-option-btn"
        disabled={disabled}
        onClick={onSelect}
        data-option
      >
        {keyNumber > 0 && <span className="sv-keychip">{keyNumber === 10 ? 0 : keyNumber}</span>}
        {mode === 'rank' ? (
          <span className={`sv-rankbadge${rank ? ' sv-ranked' : ''}`}>{rank ?? ''}</span>
        ) : mode === 'radio' ? (
          <span className="sv-radio" />
        ) : (
          <span className="sv-checkbox" />
        )}
        <span className="sv-option-label">{tx(option.textId, lang)}</span>
      </button>
      {option.specify && selected && (
        <div className="sv-specify sv-reveal">
          <input
            type="text"
            className="sv-input sv-specify-input"
            placeholder={tx(option.specifyPhId ?? 'specify', lang)}
            aria-label={tx(option.specifyPhId ?? 'specify', lang)}
            value={specifyValue ?? ''}
            autoFocus
            onChange={(e) => onSpecifyChange?.(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scale 1–5 (Q11)
// ---------------------------------------------------------------------------

export function ScaleRow(props: {
  lang: SurveyLang;
  value: string | undefined;
  onSelect: (v: string) => void;
}) {
  const { lang, value, onSelect } = props;
  return (
    <div>
      <div className="sv-scale" role="radiogroup" aria-label={tx('Q11.t', lang)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === String(n)}
            className={`sv-scale-btn${value === String(n) ? ' sv-selected' : ''}`}
            onClick={() => onSelect(String(n))}
            data-option
          >
            {n}
          </button>
        ))}
      </div>
      <div className="sv-scale-ends">
        <span>{tx('Q11.end.1', lang)}</span>
        <span>{tx('Q11.end.2', lang)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ranking (Q10, R03): slots row + option list
// ---------------------------------------------------------------------------

export function RankingSlots(props: { lang: SurveyLang; max: number; min: number; count: number }) {
  const { lang, max, min, count } = props;
  return (
    <div className="sv-slots-wrap">
      <div className="sv-slots">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`sv-slot${i < count ? ' sv-filled' : ''}${i < min ? ' sv-req' : ''}`}
          >
            {i < count ? i + 1 : i + 1}
          </span>
        ))}
      </div>
      <div className="sv-counter">{fmt(tx('counter_rank', lang), { n: count, max, min })}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rating grid (D10, RT8)
// ---------------------------------------------------------------------------

export function RatingGrid(props: {
  lang: SurveyLang;
  q: QuestionDef;
  value: Record<string, string>;
  onSelect: (row: string, col: string) => void;
  shakeSignal: number;
}) {
  const { lang, q, value, onSelect, shakeSignal } = props;
  return (
    <div className="sv-grid" key={shakeSignal}>
      {(q.gridRows ?? []).map((row) => (
        <div className="sv-grid-row" key={row.code}>
          <div className="sv-grid-label">{tx(row.textId, lang)}</div>
          <div className="sv-grid-btns" role="radiogroup" aria-label={tx(row.textId, lang)}>
            {(q.gridCols ?? []).map((col) => (
              <button
                key={col.code}
                type="button"
                role="radio"
                aria-checked={value[row.code] === col.code}
                className={`sv-grid-btn${value[row.code] === col.code ? ' sv-selected' : ''}`}
                onClick={() => onSelect(row.code, col.code)}
              >
                {tx(col.textId, lang)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Price field (Q12, Q13, R06, R07)
// ---------------------------------------------------------------------------

export function PriceField(props: {
  lang: SurveyLang;
  value: PriceAnswer | undefined;
  onChange: (v: PriceAnswer) => void;
  error: string | null; // price_low with amount, or price_none
  shakeSignal: number;
  onEnter: () => void;
}) {
  const { lang, value, onChange, error, shakeSignal, onEnter } = props;
  const amount = value?.amount ?? null;
  const dontKnow = value?.dontKnow ?? false;

  const onInput = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '').slice(0, 12);
    onChange({ amount: digits ? Number(digits) : null, dontKnow: false });
  };

  return (
    <div className="sv-price-wrap">
      <div className={`sv-price${error ? ' sv-shake' : ''}`} key={shakeSignal}>
        <span className="sv-price-eur">€</span>
        <input
          type="text"
          inputMode="numeric"
          className="sv-price-input"
          placeholder={tx('amount_ph', lang)}
          aria-label={tx('amount_aria', lang)}
          disabled={dontKnow}
          value={amount != null ? amount.toLocaleString('en-US') : ''}
          autoFocus
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEnter();
          }}
        />
      </div>
      <label className="sv-check">
        <input
          type="checkbox"
          checked={dontKnow}
          onChange={(e) =>
            onChange({ amount: e.target.checked ? null : amount, dontKnow: e.target.checked })
          }
        />
        <span>{tx('Q08.o99', lang)}</span>
      </label>
      {error && (
        <div className="sv-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export function priceErrorText(lang: SurveyLang, amount: number): string {
  return fmt(tx('price_low', lang), { amount: formatEur(amount) });
}

export const priceNoneText = (lang: SurveyLang): string => tx('price_none', lang);
