// Screen model for the TIM QC survey. Texts live in i18n.ts (generated from the
// spec appendices); this file defines structure, routing, validation and the
// export coding of the submitted record (spec sections 2, 4 and 7).

export type ScreenType =
  | 'intro'
  | 'single'
  | 'multi'
  | 'ranking'
  | 'grid'
  | 'scale'
  | 'price'
  | 'open'
  | 'info'
  | 'gate'
  | 'final'
  | 'thanks';

export type Part = 'p1' | 'p2' | 'dist' | 'distT' | 'close';

export interface OptionDef {
  code: string;
  textId: string;
  exclusive?: boolean;
  specify?: boolean;
  specifyPhId?: string;
}

export interface QuestionDef {
  id: string;
  type: ScreenType;
  part: Part;
  titleId: string;
  options?: OptionDef[];
  multiMax?: number;
  gridRows?: { code: string; textId: string }[];
  gridCols?: { code: string; textId: string }[];
  pricePrevId?: string;
  shuffle?: boolean;
  skippable: boolean;
  info?: { titleId: string; bodyId: string; btnId: string };
  gateBadgeId?: string;
}

const opt = (code: string, textId: string, extra?: Partial<OptionDef>): OptionDef => ({
  code,
  textId,
  ...extra,
});

const specify = { specify: true };
const specifyPh = { specify: true, specifyPhId: 'Q10.ph' };

// Shared option lists (labels are shared across questions per spec appendix A)
const q02Options = (): OptionDef[] =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map((n) => opt(String(n), `Q02.o${n}`))
    .concat([opt('11', 'Q01.o4', specify)]);

const q08Options = (): OptionDef[] =>
  [1, 2, 3, 4, 5]
    .map((n) => opt(String(n), `Q08.o${n}`))
    .concat([opt('98', 'Q08.o98', specify), opt('99', 'Q08.o99')]);

const q09Options = (): OptionDef[] =>
  [1, 2, 3, 4, 5]
    .map((n) => opt(String(n), `Q09.o${n}`))
    .concat([opt('98', 'Q08.o98', specify), opt('99', 'Q08.o99')]);

const d02Options = (): OptionDef[] =>
  [1, 2, 3, 4, 5, 6, 7]
    .map((n) => opt(String(n), `D02.o${n}`))
    .concat([opt('8', 'Q01.o4', specify)]);

const d06Options = (): OptionDef[] =>
  [1, 2, 3, 4, 5]
    .map((n) => opt(String(n), `D06.o${n}`))
    .concat([opt('6', 'D06.o6', specify), opt('99', 'Q08.o99')]);

const d08Options = (): OptionDef[] =>
  [1, 2, 3, 4]
    .map((n) => opt(String(n), `D08.o${n}`))
    .concat([opt('5', 'D08.o5', specify), opt('99', 'Q08.o99')]);

const d09Options = (): OptionDef[] => [
  opt('1', 'D09.o1'),
  opt('2', 'D09.o2'),
  opt('3', 'D09.o3'),
  opt('4', 'Q03.o4'),
  opt('5', 'D09.o5'),
  opt('6', 'D09.o6'),
];

const s1Options = (): OptionDef[] =>
  [1, 2, 3, 4].map((n) => opt(String(n), `S1.o${n}`)).concat([opt('99', 'Q08.o99')]);

const rankingOptions = (): OptionDef[] =>
  ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08']
    .map((c) => opt(c, `Q10.o${c}`))
    .concat([opt('P09', 'Q10.oP09', specifyPh)]);

const gridRows = (): { code: string; textId: string }[] =>
  [1, 2, 3, 4, 5].map((n) => ({ code: String(n), textId: `D10.row.${n}` }));

const gridCols = (): { code: string; textId: string }[] => [
  { code: '1', textId: 'D10.col.1' },
  { code: '2', textId: 'D10.col.2' },
  { code: '3', textId: 'D10.col.3' },
  { code: '99', textId: 'D10.col.4' },
];

export const QUESTIONS: Record<string, QuestionDef> = {
  intro: { id: 'intro', type: 'intro', part: 'p1', titleId: 'intro_title', skippable: false },
  Q01: {
    id: 'Q01',
    type: 'single',
    part: 'p1',
    titleId: 'Q01.t',
    options: [
      opt('1', 'Q01.o1'),
      opt('2', 'Q01.o2'),
      opt('3', 'Q01.o3'),
      opt('4', 'Q01.o4', specify),
    ],
    skippable: false,
  },
  Q02: {
    id: 'Q02',
    type: 'single',
    part: 'p1',
    titleId: 'Q02.t',
    options: q02Options(),
    skippable: true,
  },
  Q03: {
    id: 'Q03',
    type: 'single',
    part: 'p1',
    titleId: 'Q03.t',
    options: [1, 2, 3, 4, 5, 6, 7]
      .map((n) => opt(String(n), `Q03.o${n}`))
      .concat([opt('8', 'Q01.o4', specify)]),
    skippable: false,
  },
  Q04: {
    id: 'Q04',
    type: 'single',
    part: 'p1',
    titleId: 'Q04.t',
    options: [opt('1', 'Q04.o1'), opt('2', 'Q04.o2'), opt('3', 'Q04.o3')],
    skippable: true,
  },
  Q05: {
    id: 'Q05',
    type: 'multi',
    part: 'p1',
    titleId: 'Q05.t',
    options: [1, 2, 3, 4, 5]
      .map((n) => opt(String(n), `Q05.o${n}`))
      .concat([opt('6', 'Q05.o6', { exclusive: true }), opt('7', 'Q01.o4', specify)]),
    skippable: true,
  },
  Q06: {
    id: 'Q06',
    type: 'multi',
    part: 'p1',
    titleId: 'Q06.t',
    multiMax: 3,
    options: [1, 2, 3, 4, 5, 6, 7, 8]
      .map((n) => opt(String(n), `Q06.o${n}`))
      .concat([opt('9', 'Q06.o9', { exclusive: true }), opt('10', 'Q01.o4', specify)]),
    skippable: true,
  },
  Q07: {
    id: 'Q07',
    type: 'multi',
    part: 'p1',
    titleId: 'Q07.t',
    options: [1, 2, 3, 4, 5, 6]
      .map((n) => opt(String(n), `Q07.o${n}`))
      .concat([opt('7', 'Q01.o4', specify)]),
    skippable: true,
  },
  Q08: {
    id: 'Q08',
    type: 'single',
    part: 'p1',
    titleId: 'Q08.t',
    options: q08Options(),
    skippable: true,
  },
  Q09: {
    id: 'Q09',
    type: 'single',
    part: 'p1',
    titleId: 'Q09.t',
    options: q09Options(),
    skippable: true,
  },
  Q10: {
    id: 'Q10',
    type: 'ranking',
    part: 'p1',
    titleId: 'Q10.t',
    options: rankingOptions(),
    shuffle: true,
    skippable: true,
  },
  concept: {
    id: 'concept',
    type: 'info',
    part: 'p1',
    titleId: 'concept.t',
    skippable: false,
    info: { titleId: 'concept.t', bodyId: 'concept.body', btnId: 'concept.btn' },
  },
  Q11: { id: 'Q11', type: 'scale', part: 'p1', titleId: 'Q11.t', skippable: true },
  Q12: { id: 'Q12', type: 'price', part: 'p1', titleId: 'Q12.t', skippable: true },
  Q13: {
    id: 'Q13',
    type: 'price',
    part: 'p1',
    titleId: 'Q13.t',
    pricePrevId: 'Q12',
    skippable: true,
  },
  gate: {
    id: 'gate',
    type: 'gate',
    part: 'p1',
    titleId: 'gate.t',
    options: [opt('1', 'gate.o1'), opt('2', 'gate.o2')],
    gateBadgeId: 'p1done',
    skippable: false,
  },
  p2intro: {
    id: 'p2intro',
    type: 'info',
    part: 'p2',
    titleId: 'p2intro.t',
    skippable: false,
    info: { titleId: 'p2intro.t', bodyId: 'p2intro.body', btnId: 'p2intro.btn' },
  },
  D01: {
    id: 'D01',
    type: 'single',
    part: 'p2',
    titleId: 'D01.t',
    options: [1, 2, 3, 4, 5].map((n) => opt(String(n), `D01.o${n}`)).concat([opt('99', 'Q08.o99')]),
    skippable: true,
  },
  D02: {
    id: 'D02',
    type: 'multi',
    part: 'p2',
    titleId: 'D02.t',
    options: d02Options(),
    skippable: true,
  },
  D03: {
    id: 'D03',
    type: 'multi',
    part: 'p2',
    titleId: 'D03.t',
    options: [1, 2, 3, 4, 5]
      .map((n) => opt(String(n), `D03.o${n}`))
      .concat([opt('99', 'Q08.o99', { exclusive: true })]),
    skippable: true,
  },
  D04: {
    id: 'D04',
    type: 'single',
    part: 'p2',
    titleId: 'D04.t',
    options: [1, 2, 3]
      .map((n) => opt(String(n), `D04.o${n}`))
      .concat([opt('4', 'D04.o4', specify), opt('99', 'D04.o99')]),
    skippable: true,
  },
  D05: {
    id: 'D05',
    type: 'single',
    part: 'p2',
    titleId: 'D05.t',
    options: [1, 2, 3, 4, 5]
      .map((n) => opt(String(n), `D05.o${n}`))
      .concat([opt('98', 'D05.o98', specify), opt('99', 'Q08.o99')]),
    skippable: true,
  },
  D06: {
    id: 'D06',
    type: 'single',
    part: 'p2',
    titleId: 'D06.t',
    options: d06Options(),
    skippable: true,
  },
  D07: {
    id: 'D07',
    type: 'multi',
    part: 'p2',
    titleId: 'D07.t',
    multiMax: 3,
    options: [1, 2, 3, 4, 5, 6]
      .map((n) => opt(String(n), `D07.o${n}`))
      .concat([opt('7', 'D07.o7', { exclusive: true }), opt('8', 'Q01.o4', specify)]),
    skippable: true,
  },
  D08: {
    id: 'D08',
    type: 'single',
    part: 'p2',
    titleId: 'D08.t',
    options: d08Options(),
    skippable: true,
  },
  D09: {
    id: 'D09',
    type: 'single',
    part: 'p2',
    titleId: 'D09.t',
    options: d09Options(),
    skippable: true,
  },
  D10: {
    id: 'D10',
    type: 'grid',
    part: 'p2',
    titleId: 'D10.t',
    gridRows: gridRows(),
    gridCols: gridCols(),
    skippable: true,
  },
  S1: {
    id: 'S1',
    type: 'single',
    part: 'p2',
    titleId: 'S1.t',
    options: s1Options(),
    skippable: true,
  },
  S2: {
    id: 'S2',
    type: 'single',
    part: 'p2',
    titleId: 'S2.t',
    options: [1, 2, 3, 4, 5].map((n) => opt(String(n), `S2.o${n}`)).concat([opt('99', 'Q08.o99')]),
    skippable: true,
  },
  S3: {
    id: 'S3',
    type: 'multi',
    part: 'p2',
    titleId: 'S3.t',
    options: [1, 2, 3, 4, 5]
      .map((n) => opt(String(n), `S3.o${n}`))
      .concat([opt('6', 'S3.o6', { exclusive: true }), opt('99', 'Q08.o99', { exclusive: true })]),
    skippable: true,
  },
  S4: {
    id: 'S4',
    type: 'multi',
    part: 'p2',
    titleId: 'S4.t',
    multiMax: 2,
    options: [1, 2, 3, 4, 5]
      .map((n) => opt(String(n), `S4.o${n}`))
      .concat([opt('6', 'Q01.o4', specify)]),
    skippable: true,
  },
  S5: {
    id: 'S5',
    type: 'single',
    part: 'p2',
    titleId: 'S5.t',
    options: [opt('1', 'S5.o1'), opt('2', 'S5.o2'), opt('99', 'Q08.o99')],
    skippable: true,
  },
  S5b: {
    id: 'S5b',
    type: 'multi',
    part: 'p2',
    titleId: 'S5b.t',
    options: [1, 2, 3]
      .map((n) => opt(String(n), `S5b.o${n}`))
      .concat([
        opt('4', 'S5b.o4', specify),
        opt('5', 'Q01.o4', specify),
        opt('99', 'Q08.o99', { exclusive: true }),
      ]),
    skippable: true,
  },
  D11: {
    id: 'D11',
    type: 'single',
    part: 'p2',
    titleId: 'D11.t',
    options: [1, 2, 3, 4].map((n) => opt(String(n), `D11.o${n}`)).concat([opt('99', 'Q08.o99')]),
    skippable: true,
  },
  R01: {
    id: 'R01',
    type: 'single',
    part: 'dist',
    titleId: 'R01.t',
    options: [1, 2, 3, 4, 5, 6, 7, 8]
      .map((n) => opt(String(n), `R01.o${n}`))
      .concat([opt('99', 'Q08.o99')]),
    skippable: true,
  },
  R02: {
    id: 'R02',
    type: 'multi',
    part: 'dist',
    titleId: 'R02.t',
    multiMax: 3,
    options: q02Options(),
    skippable: true,
  },
  conceptD: {
    id: 'conceptD',
    type: 'info',
    part: 'dist',
    titleId: 'concept.t',
    skippable: false,
    info: { titleId: 'concept.t', bodyId: 'conceptD.body', btnId: 'concept.btn' },
  },
  R03: {
    id: 'R03',
    type: 'ranking',
    part: 'dist',
    titleId: 'R03.t',
    options: rankingOptions(),
    shuffle: true,
    skippable: true,
  },
  R04: {
    id: 'R04',
    type: 'multi',
    part: 'dist',
    titleId: 'R04.t',
    multiMax: 3,
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => opt(String(n), `R04.o${n}`))
      .concat([opt('10', 'Q01.o4', specify), opt('11', 'R04.o11', { exclusive: true })]),
    skippable: true,
  },
  R05: {
    id: 'R05',
    type: 'multi',
    part: 'dist',
    titleId: 'R05.t',
    options: [1, 2, 3, 4, 5, 6]
      .map((n) => opt(String(n), `R05.o${n}`))
      .concat([opt('7', 'Q01.o4', specify), opt('8', 'R05.o8', { exclusive: true })]),
    skippable: true,
  },
  R06: { id: 'R06', type: 'price', part: 'dist', titleId: 'R06.t', skippable: true },
  R07: {
    id: 'R07',
    type: 'price',
    part: 'dist',
    titleId: 'R07.t',
    pricePrevId: 'R06',
    skippable: true,
  },
  R08: {
    id: 'R08',
    type: 'multi',
    part: 'dist',
    titleId: 'R08.t',
    options: [1, 2, 3, 4, 5, 6, 7]
      .map((n) => opt(String(n), `R08.o${n}`))
      .concat([opt('8', 'Q01.o4', specify)]),
    skippable: true,
  },
  R09: {
    id: 'R09',
    type: 'single',
    part: 'dist',
    titleId: 'R09.t',
    options: [opt('1', 'R09.o1')].concat(
      [2, 3, 4, 5, 6, 7, 8].map((n) => opt(String(n), `R01.o${n}`)),
      [opt('99', 'Q08.o99')],
    ),
    skippable: true,
  },
  dgate: {
    id: 'dgate',
    type: 'gate',
    part: 'dist',
    titleId: 'dgate.t',
    options: [opt('1', 'dgate.o1'), opt('2', 'gate.o2')],
    gateBadgeId: 'dgate.done',
    skippable: false,
  },
  RT1: {
    id: 'RT1',
    type: 'single',
    part: 'distT',
    titleId: 'RT1.t',
    options: q08Options(),
    skippable: true,
  },
  RT2: {
    id: 'RT2',
    type: 'single',
    part: 'distT',
    titleId: 'RT2.t',
    options: q09Options(),
    skippable: true,
  },
  RT3: {
    id: 'RT3',
    type: 'single',
    part: 'distT',
    titleId: 'RT3.t',
    options: [1, 2, 3]
      .map((n) => opt(String(n), `RT3.o${n}`))
      .concat([opt('4', 'RT3.o4', specify), opt('99', 'D04.o99')]),
    skippable: true,
  },
  RT4: {
    id: 'RT4',
    type: 'single',
    part: 'distT',
    titleId: 'RT4.t',
    options: d06Options(),
    skippable: true,
  },
  RT5: {
    id: 'RT5',
    type: 'multi',
    part: 'distT',
    titleId: 'RT5.t',
    options: d02Options(),
    skippable: true,
  },
  RT6: {
    id: 'RT6',
    type: 'single',
    part: 'distT',
    titleId: 'RT6.t',
    options: d08Options(),
    skippable: true,
  },
  RT7: {
    id: 'RT7',
    type: 'single',
    part: 'distT',
    titleId: 'RT7.t',
    options: d09Options(),
    skippable: true,
  },
  RT8: {
    id: 'RT8',
    type: 'grid',
    part: 'distT',
    titleId: 'RT8.t',
    gridRows: gridRows(),
    gridCols: gridCols(),
    skippable: true,
  },
  RT9: {
    id: 'RT9',
    type: 'single',
    part: 'distT',
    titleId: 'RT9.t',
    options: s1Options(),
    skippable: true,
  },
  RT10: {
    id: 'RT10',
    type: 'multi',
    part: 'distT',
    titleId: 'RT10.t',
    multiMax: 2,
    options: [
      opt('1', 'S4.o1'),
      opt('2', 'RT10.o2'),
      opt('3', 'RT10.o3'),
      opt('4', 'RT10.o4'),
      opt('5', 'RT10.o5'),
      opt('7', 'RT10.o7'),
      opt('6', 'Q01.o4', specify),
    ],
    skippable: true,
  },
  RT11: {
    id: 'RT11',
    type: 'multi',
    part: 'distT',
    titleId: 'RT11.t',
    options: [1, 2, 3, 4, 5, 6]
      .map((n) => opt(String(n), `RT11.o${n}`))
      .concat([opt('7', 'R05.o8', { exclusive: true }), opt('8', 'Q01.o4', specify)]),
    skippable: true,
  },
  RT12: { id: 'RT12', type: 'open', part: 'distT', titleId: 'RT12.t', skippable: true },
  G1: { id: 'G1', type: 'open', part: 'close', titleId: 'G1.t', skippable: false },
  final: { id: 'final', type: 'final', part: 'close', titleId: 'final_title', skippable: false },
  thanks: {
    id: 'thanks',
    type: 'thanks',
    part: 'close',
    titleId: 'thanks_title',
    skippable: false,
  },
};

export const QUESTION_TYPES: ScreenType[] = [
  'single',
  'multi',
  'ranking',
  'grid',
  'scale',
  'price',
  'open',
];

export function isQuestionScreen(id: string): boolean {
  const q = QUESTIONS[id];
  return !!q && (QUESTION_TYPES as string[]).includes(q.type);
}

export function isGate(id: string): boolean {
  return QUESTIONS[id]?.type === 'gate';
}

// Answer shapes (internal state)
export interface SingleAnswer {
  code: string;
  txt?: string;
}
export type MultiAnswer = Record<string, { on: boolean; txt?: string }>;
export type RankingAnswer = Record<string, number>;
export type GridAnswer = Record<string, string>;
export interface PriceAnswer {
  amount: number | null;
  dontKnow: boolean;
}
export type AnswerValue =
  | SingleAnswer
  | MultiAnswer
  | RankingAnswer
  | GridAnswer
  | PriceAnswer
  | string
  | undefined;

export type Answers = Record<string, AnswerValue>;

export function singleCode(answers: Answers, id: string): string | undefined {
  const a = answers[id];
  if (a && typeof a === 'object' && 'code' in a) return (a as SingleAnswer).code;
  return undefined;
}

// Spec 2.2 — the screen sequence is recalculated from the current answers.
export function buildSequence(answers: Answers): string[] {
  const seq = ['intro', 'Q01'];
  if (singleCode(answers, 'Q01') === '3') {
    seq.push('R01', 'R02', 'conceptD', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09', 'dgate');
    if (singleCode(answers, 'dgate') === '1') {
      seq.push(
        'RT1',
        'RT2',
        'RT3',
        'RT4',
        'RT5',
        'RT6',
        'RT7',
        'RT8',
        'RT9',
        'RT10',
        'RT11',
        'RT12',
      );
    }
  } else {
    const nonTechnical = ['6', '7'].includes(singleCode(answers, 'Q03') ?? '');
    seq.push('Q02', 'Q03', 'Q04', 'Q05', 'Q06', 'Q07');
    if (!nonTechnical) seq.push('Q08', 'Q09');
    seq.push('Q10', 'concept', 'Q11', 'Q12', 'Q13', 'gate');
    if (singleCode(answers, 'gate') === '1') {
      seq.push('p2intro', 'D01', 'D02');
      if (!nonTechnical) seq.push('D03', 'D04', 'D05', 'D06', 'D07');
      seq.push('D08', 'D09', 'D10', 'S1', 'S2', 'S3', 'S4', 'S5');
      if (singleCode(answers, 'S5') === '1') seq.push('S5b');
      seq.push('D11');
    }
  }
  seq.push('G1', 'final', 'thanks');
  return seq;
}

export function getHint(q: QuestionDef): { id: string; params?: Record<string, string | number> } {
  switch (q.type) {
    case 'single':
      return { id: 'choose_one' };
    case 'multi':
      return q.multiMax ? { id: 'choose_upto', params: { n: q.multiMax } } : { id: 'choose_all' };
    case 'ranking':
      return { id: 'Q10.h' };
    case 'scale':
      return { id: 'scale_hint' }; // {a}/{b} filled by the renderer from Q11.end.*
    case 'price':
      return { id: 'Q12.h' };
    case 'grid':
      return { id: 'D10.h' };
    case 'open':
      return { id: 'RT12.h' };
    default:
      return { id: 'choose_one' };
  }
}

export function priceError(q: QuestionDef, answers: Answers): { amount: number } | null {
  if (!q.pricePrevId) return null;
  const cur = answers[q.id] as PriceAnswer | undefined;
  const prev = answers[q.pricePrevId] as PriceAnswer | undefined;
  if (!cur || cur.dontKnow || cur.amount == null) return null;
  if (!prev || prev.dontKnow || prev.amount == null) return null;
  if (cur.amount < prev.amount) return { amount: prev.amount };
  return null;
}

export function isValid(q: QuestionDef, answers: Answers): boolean {
  const a = answers[q.id];
  switch (q.type) {
    case 'single':
    case 'scale':
      return !!a && typeof a === 'object' && 'code' in a && !!(a as SingleAnswer).code;
    case 'multi': {
      if (!a || typeof a !== 'object') return false;
      return Object.values(a as MultiAnswer).some((v) => v.on);
    }
    case 'ranking': {
      if (!a || typeof a !== 'object') return false;
      const n = Object.keys(a as RankingAnswer).length;
      return n >= 3 && n <= 5;
    }
    case 'grid': {
      if (!a || typeof a !== 'object' || !q.gridRows) return false;
      return q.gridRows.every((r) => !!(a as GridAnswer)[r.code]);
    }
    case 'price': {
      const p = a as PriceAnswer | undefined;
      if (!p) return false;
      if (p.dontKnow) return true;
      if (p.amount == null) return false;
      return !priceError(q, answers);
    }
    case 'open':
      return true;
    default:
      return true;
  }
}

// Spec 7.2 — flat column coding of the response record.
export function buildResponseColumns(
  answers: Answers,
  skipped: Record<string, boolean>,
  seq: string[],
): Record<string, string | number> {
  const cols: Record<string, string | number> = {};
  const num = (code: string): string | number => (/^\d+$/.test(code) ? Number(code) : code);
  for (const id of seq) {
    const q = QUESTIONS[id];
    if (!q) continue;
    if (q.type === 'gate') {
      const code = singleCode(answers, id);
      cols[id.toUpperCase()] = code ? Number(code) : '';
      continue;
    }
    if (!isQuestionScreen(id)) continue;
    const a = answers[id];
    const wasSkipped = !!skipped[id];
    switch (q.type) {
      case 'single': {
        if (wasSkipped) {
          cols[id] = -1;
          break;
        }
        const s = a as SingleAnswer | undefined;
        if (!s?.code) {
          cols[id] = '';
          break;
        }
        cols[id] = num(s.code);
        const o = q.options?.find((x) => x.code === s.code);
        if (o?.specify && s.txt) cols[`${id}_${s.code}_txt`] = s.txt;
        break;
      }
      case 'scale': {
        if (wasSkipped) {
          cols[id] = -1;
          break;
        }
        const s = a as SingleAnswer | undefined;
        cols[id] = s?.code ? Number(s.code) : '';
        break;
      }
      case 'price': {
        if (wasSkipped) {
          cols[id] = -1;
          break;
        }
        const p = a as PriceAnswer | undefined;
        if (!p || (p.amount == null && !p.dontKnow)) {
          cols[id] = '';
          break;
        }
        cols[id] = p.dontKnow ? 99 : (p.amount as number);
        break;
      }
      case 'multi': {
        for (const o of q.options ?? []) {
          if (wasSkipped) {
            cols[`${id}_${o.code}`] = -1;
            continue;
          }
          const m = a as MultiAnswer | undefined;
          const cell = m?.[o.code];
          cols[`${id}_${o.code}`] = cell?.on ? 1 : cell ? 0 : '';
          if (o.specify && cell?.on && cell.txt) cols[`${id}_${o.code}_txt`] = cell.txt;
        }
        break;
      }
      case 'ranking': {
        for (const o of q.options ?? []) {
          if (wasSkipped) {
            cols[`${id}_${o.code}`] = -1;
            continue;
          }
          const r = a as RankingAnswer | undefined;
          cols[`${id}_${o.code}`] = r?.[o.code] ?? '';
          if (o.specify && r?.[o.code] != null) {
            const txt = getRankingSpecify(answers, id, o.code);
            if (txt) cols[`${id}_${o.code}_txt`] = txt;
          }
        }
        break;
      }
      case 'grid': {
        for (const row of q.gridRows ?? []) {
          if (wasSkipped) {
            cols[`${id}_${row.code}`] = -1;
            continue;
          }
          const g = a as GridAnswer | undefined;
          cols[`${id}_${row.code}`] = g?.[row.code] ? Number(g[row.code]) : '';
        }
        break;
      }
      case 'open': {
        if (wasSkipped) {
          cols[id] = -1;
          break;
        }
        cols[id] = typeof a === 'string' ? a : '';
        break;
      }
      default:
        break;
    }
  }
  return cols;
}

// Ranking "please specify" text is stored alongside the answer record.
export function setRankingSpecify(answers: Answers, id: string, code: string, txt: string): void {
  (answers as Record<string, unknown>)[`${id}_${code}_txt`] = txt;
}

export function getRankingSpecify(answers: Answers, id: string, code: string): string {
  return ((answers as Record<string, unknown>)[`${id}_${code}_txt`] as string) ?? '';
}

export function formatEur(amount: number): string {
  return `€${amount.toLocaleString('en-US')}`;
}
