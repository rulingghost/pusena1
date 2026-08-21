/** WHO Child Growth Standards (2006) — girls/boys weight, length, head. Values are published centiles, not estimates. */

export type Sex = 'girl' | 'boy';

interface CentileRow {
  month: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

const WEIGHT_GIRL: CentileRow[] = [
  { month: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { month: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.4 },
  { month: 2, p3: 4.0, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.5 },
  { month: 3, p3: 4.6, p15: 5.1, p50: 5.8, p85: 6.6, p97: 7.4 },
  { month: 4, p3: 5.1, p15: 5.6, p50: 6.4, p85: 7.3, p97: 8.1 },
  { month: 5, p3: 5.5, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.7 },
  { month: 6, p3: 5.8, p15: 6.4, p50: 7.3, p85: 8.3, p97: 9.2 },
  { month: 8, p3: 6.3, p15: 7.0, p50: 7.9, p85: 9.0, p97: 10.1 },
  { month: 9, p3: 6.6, p15: 7.3, p50: 8.2, p85: 9.3, p97: 10.5 },
  { month: 12, p3: 7.1, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.3 },
  { month: 15, p3: 7.6, p15: 8.5, p50: 9.6, p85: 10.9, p97: 12.2 },
  { month: 18, p3: 8.1, p15: 9.0, p50: 10.2, p85: 11.6, p97: 13.1 },
  { month: 21, p3: 8.6, p15: 9.6, p50: 10.9, p85: 12.4, p97: 14.0 },
  { month: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.1, p97: 14.8 },
];

const WEIGHT_BOY: CentileRow[] = [
  { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.3 },
  { month: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.7 },
  { month: 2, p3: 4.4, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.0 },
  { month: 3, p3: 5.1, p15: 5.6, p50: 6.4, p85: 7.2, p97: 7.9 },
  { month: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.6 },
  { month: 5, p3: 6.1, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.2 },
  { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.7 },
  { month: 8, p3: 7.0, p15: 7.7, p50: 8.6, p85: 9.6, p97: 10.5 },
  { month: 9, p3: 7.2, p15: 8.0, p50: 8.9, p85: 9.9, p97: 10.9 },
  { month: 12, p3: 7.8, p15: 8.6, p50: 9.6, p85: 10.8, p97: 11.8 },
  { month: 15, p3: 8.4, p15: 9.2, p50: 10.3, p85: 11.5, p97: 12.7 },
  { month: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.5 },
  { month: 21, p3: 9.3, p15: 10.3, p50: 11.5, p85: 12.9, p97: 14.3 },
  { month: 24, p3: 9.8, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.1 },
];

const LENGTH_GIRL: CentileRow[] = [
  { month: 0, p3: 45.6, p15: 47.2, p50: 49.1, p85: 51.0, p97: 52.7 },
  { month: 1, p3: 50.0, p15: 51.7, p50: 53.7, p85: 55.7, p97: 57.4 },
  { month: 2, p3: 53.2, p15: 55.0, p50: 57.1, p85: 59.2, p97: 61.0 },
  { month: 3, p3: 55.8, p15: 57.6, p50: 59.8, p85: 62.0, p97: 63.8 },
  { month: 4, p3: 58.0, p15: 59.8, p50: 62.1, p85: 64.3, p97: 66.2 },
  { month: 6, p3: 61.5, p15: 63.3, p50: 65.7, p85: 68.1, p97: 70.0 },
  { month: 9, p3: 65.6, p15: 67.5, p50: 70.1, p85: 72.6, p97: 74.7 },
  { month: 12, p3: 69.2, p15: 71.1, p50: 74.0, p85: 76.8, p97: 79.1 },
  { month: 18, p3: 75.1, p15: 77.2, p50: 80.7, p85: 84.1, p97: 86.7 },
  { month: 24, p3: 80.3, p15: 82.7, p50: 86.4, p85: 90.1, p97: 93.0 },
];

const LENGTH_BOY: CentileRow[] = [
  { month: 0, p3: 46.3, p15: 47.9, p50: 49.9, p85: 51.8, p97: 53.4 },
  { month: 1, p3: 51.1, p15: 52.7, p50: 54.7, p85: 56.7, p97: 58.4 },
  { month: 2, p3: 54.7, p15: 56.4, p50: 58.4, p85: 60.5, p97: 62.2 },
  { month: 3, p3: 57.6, p15: 59.3, p50: 61.4, p85: 63.5, p97: 65.3 },
  { month: 4, p3: 60.0, p15: 61.7, p50: 63.9, p85: 66.0, p97: 67.8 },
  { month: 6, p3: 63.6, p15: 65.4, p50: 67.6, p85: 69.8, p97: 71.6 },
  { month: 9, p3: 67.7, p15: 69.6, p50: 72.0, p85: 74.3, p97: 76.3 },
  { month: 12, p3: 71.3, p15: 73.4, p50: 75.7, p85: 78.1, p97: 80.2 },
  { month: 18, p3: 76.9, p15: 79.1, p50: 82.3, p85: 85.4, p97: 87.7 },
  { month: 24, p3: 81.7, p15: 84.1, p50: 87.8, p85: 91.4, p97: 94.0 },
];

const HEAD_GIRL: CentileRow[] = [
  { month: 0, p3: 31.7, p15: 32.7, p50: 33.9, p85: 35.1, p97: 36.1 },
  { month: 1, p3: 34.3, p15: 35.3, p50: 36.5, p85: 37.8, p97: 38.8 },
  { month: 2, p3: 36.0, p15: 37.0, p50: 38.3, p85: 39.5, p97: 40.5 },
  { month: 3, p3: 37.2, p15: 38.2, p50: 39.5, p85: 40.8, p97: 41.9 },
  { month: 6, p3: 39.7, p15: 40.8, p50: 42.2, p85: 43.5, p97: 44.6 },
  { month: 9, p3: 41.4, p15: 42.5, p50: 43.8, p85: 45.2, p97: 46.4 },
  { month: 12, p3: 42.6, p15: 43.7, p50: 45.0, p85: 46.4, p97: 47.6 },
  { month: 18, p3: 44.2, p15: 45.3, p50: 46.6, p85: 48.0, p97: 49.2 },
  { month: 24, p3: 45.3, p15: 46.4, p50: 47.7, p85: 49.1, p97: 50.3 },
];

const HEAD_BOY: CentileRow[] = [
  { month: 0, p3: 32.1, p15: 33.1, p50: 34.5, p85: 35.8, p97: 36.9 },
  { month: 1, p3: 35.1, p15: 36.1, p50: 37.3, p85: 38.6, p97: 39.6 },
  { month: 2, p3: 36.9, p15: 37.9, p50: 39.1, p85: 40.3, p97: 41.3 },
  { month: 3, p3: 38.3, p15: 39.3, p50: 40.5, p85: 41.7, p97: 42.7 },
  { month: 6, p3: 41.0, p15: 42.1, p50: 43.3, p85: 44.6, p97: 45.6 },
  { month: 9, p3: 42.8, p15: 43.8, p50: 45.0, p85: 46.3, p97: 47.4 },
  { month: 12, p3: 43.9, p15: 45.0, p50: 46.1, p85: 47.4, p97: 48.4 },
  { month: 18, p3: 45.4, p15: 46.5, p50: 47.4, p85: 48.7, p97: 49.8 },
  { month: 24, p3: 46.3, p15: 47.3, p50: 48.4, p85: 49.7, p97: 50.8 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rowAt(table: CentileRow[], month: number): CentileRow {
  if (month <= table[0].month) return table[0];
  if (month >= table[table.length - 1].month) return table[table.length - 1];
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (month >= a.month && month <= b.month) {
      const t = (month - a.month) / (b.month - a.month);
      return {
        month,
        p3: lerp(a.p3, b.p3, t),
        p15: lerp(a.p15, b.p15, t),
        p50: lerp(a.p50, b.p50, t),
        p85: lerp(a.p85, b.p85, t),
        p97: lerp(a.p97, b.p97, t),
      };
    }
  }
  return table[table.length - 1];
}

function percentileFromRow(value: number, row: CentileRow): number {
  const pts: Array<[number, number]> = [
    [3, row.p3],
    [15, row.p15],
    [50, row.p50],
    [85, row.p85],
    [97, row.p97],
  ];
  if (value <= pts[0][1]) return Math.max(1, Math.round(3 * (value / pts[0][1])));
  if (value >= pts[pts.length - 1][1]) return 99;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, v0] = pts[i];
    const [p1, v1] = pts[i + 1];
    if (value >= v0 && value <= v1) {
      const t = (value - v0) / (v1 - v0);
      return Math.round(lerp(p0, p1, t));
    }
  }
  return 50;
}

export interface GrowthResult {
  weightPercentile: number | null;
  lengthPercentile: number | null;
  headPercentile: number | null;
  expectedWeightKg: number | null;
  expectedLengthCm: number | null;
  band: 'low' | 'normal' | 'high' | 'unknown';
  note: string;
}

export function computeGrowth(opts: {
  sex: Sex | 'unknown';
  ageMonths: number;
  weightKg?: number;
  heightCm?: number;
  headCm?: number;
}): GrowthResult {
  if (opts.sex === 'unknown' || opts.ageMonths < 0 || opts.ageMonths > 24) {
    return {
      weightPercentile: null,
      lengthPercentile: null,
      headPercentile: null,
      expectedWeightKg: null,
      expectedLengthCm: null,
      band: 'unknown',
      note: opts.sex === 'unknown'
        ? 'Persentil için bebek cinsiyeti gerekir (DSÖ eğrileri kız ve erkek için ayrıdır).'
        : 'DSÖ 0–24 ay tabloları kullanılır. 24 aydan büyük çocuk için çocuk hekimi eğrisi gerekir.',
    };
  }

  const wTable = opts.sex === 'girl' ? WEIGHT_GIRL : WEIGHT_BOY;
  const lTable = opts.sex === 'girl' ? LENGTH_GIRL : LENGTH_BOY;
  const hTable = opts.sex === 'girl' ? HEAD_GIRL : HEAD_BOY;
  const wRow = rowAt(wTable, opts.ageMonths);
  const lRow = rowAt(lTable, opts.ageMonths);
  const hRow = rowAt(hTable, opts.ageMonths);

  const weightPercentile = opts.weightKg != null ? percentileFromRow(opts.weightKg, wRow) : null;
  const lengthPercentile = opts.heightCm != null ? percentileFromRow(opts.heightCm, lRow) : null;
  const headPercentile = opts.headCm ? percentileFromRow(opts.headCm, hRow) : null;

  let band: GrowthResult['band'] = 'unknown';
  let note = `${opts.sex === 'girl' ? 'Kız' : 'Erkek'} bebek, ${opts.ageMonths}. ay. DSÖ ağırlık-yaş medyanı ${wRow.p50.toFixed(1)} kg, boy medyanı ${lRow.p50.toFixed(0)} cm.`;
  if (weightPercentile != null) {
    if (weightPercentile < 3) {
      band = 'low';
      note += ' Kilo 3. persentilin altında; tek ölçüm tanı değildir, çocuk hekimi değerlendirmesi gerekir.';
    } else if (weightPercentile > 97) {
      band = 'high';
      note += ' Kilo 97. persentilin üzerinde; eğri izlenmeli, hekimle paylaşın.';
    } else {
      band = 'normal';
      note += ' Kilo 3–97 persentil aralığında. Asıl önemli olan tek sayı değil, kendi eğrisini izlemesidir.';
    }
  }

  return {
    weightPercentile,
    lengthPercentile,
    headPercentile,
    expectedWeightKg: Number(wRow.p50.toFixed(1)),
    expectedLengthCm: Number(lRow.p50.toFixed(1)),
    band,
    note,
  };
}
