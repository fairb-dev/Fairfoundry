import type { ErsCriterion, ErsDocument } from "./sample-catalog";
import type { ColumnProfile, LogProfile } from "./log-profiler";

export type GateSeverity = "critical" | "major" | "minor";
export type GateStatus = "matched" | "fuzzy" | "missing";

export interface QualityGate {
  criterionId: string;
  parameter: string;
  criteriaType: ErsCriterion["type"];
  unit: string | null;
  lowerLimit: number | null;
  upperLimit: number | null;
  sectionRef: string | null;
  notes: string | null;
  expectedColumn: string;
  matchedColumn: string | null;
  matchedColumnIndex: number | null;
  matchConfidence: number;
  matchStatus: GateStatus;
  severity: GateSeverity;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array<number>(n + 1);
  const cur = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = cur[j];
  }
  return prev[n];
}

function fuzzyMatchColumn(
  expected: string,
  columns: ColumnProfile[]
): { column: ColumnProfile | null; confidence: number; status: GateStatus } {
  const expectedNorm = normalize(expected);
  let exact: ColumnProfile | null = null;
  let bestFuzzy: { col: ColumnProfile; score: number } | null = null;

  for (const col of columns) {
    const colNorm = normalize(col.name);
    if (colNorm === expectedNorm) {
      exact = col;
      break;
    }
    const distance = levenshtein(expectedNorm, colNorm);
    const longest = Math.max(expectedNorm.length, colNorm.length);
    const score = longest === 0 ? 0 : 1 - distance / longest;
    if (!bestFuzzy || score > bestFuzzy.score) {
      bestFuzzy = { col, score };
    }
  }

  if (exact) {
    return { column: exact, confidence: 1, status: "matched" };
  }
  if (bestFuzzy && bestFuzzy.score >= 0.7) {
    return {
      column: bestFuzzy.col,
      confidence: Number(bestFuzzy.score.toFixed(2)),
      status: "fuzzy",
    };
  }
  return { column: null, confidence: 0, status: "missing" };
}

function inferSeverity(
  criterion: ErsCriterion,
  ers: ErsDocument
): GateSeverity {
  const failRule = ers.disposition_rules?.fail ?? "";
  const condRule = ers.disposition_rules?.conditional ?? "";

  const cidUpper = criterion.criterion_id.toUpperCase();
  const failsCriticallyById = (ruleText: string): boolean => {
    const matches = ruleText.match(/C\d{2,3}/g);
    if (matches && matches.length > 0) {
      const explicit = matches.includes(cidUpper);
      const range = ruleText.match(/C\d{2,3}\s*[-–]\s*C\d{2,3}/g);
      if (range) {
        for (const r of range) {
          const [a, b] = r.replace(/\s/g, "").split(/[-–]/);
          const aNum = Number.parseInt(a.replace(/^C/, ""));
          const bNum = Number.parseInt(b.replace(/^C/, ""));
          const cNum = Number.parseInt(cidUpper.replace(/^C/, ""));
          if (cNum >= aNum && cNum <= bNum) return true;
        }
      }
      return explicit;
    }
    return false;
  };

  if (failsCriticallyById(failRule)) return "critical";
  if (failsCriticallyById(condRule)) return "minor";

  if (/any\b.*(criterion|defect|gate)/i.test(failRule) ||
      /zero\s+(tolerance|defect)/i.test(criterion.notes ?? "")) {
    return "critical";
  }

  return "major";
}

export interface GateSuggestionResult {
  gates: QualityGate[];
  matchedCount: number;
  fuzzyCount: number;
  missingCount: number;
  averageConfidence: number;
}

export function suggestGates(
  ers: ErsDocument,
  profile: LogProfile
): GateSuggestionResult {
  const gates: QualityGate[] = ers.acceptance_criteria.map((c) => {
    const { column, confidence, status } = fuzzyMatchColumn(
      c.maps_to_column,
      profile.columns
    );
    return {
      criterionId: c.criterion_id,
      parameter: c.parameter,
      criteriaType: c.type,
      unit: c.unit ?? null,
      lowerLimit: c.lower_limit ?? null,
      upperLimit: c.upper_limit ?? null,
      sectionRef: c.section_ref ?? null,
      notes: c.notes ?? null,
      expectedColumn: c.maps_to_column,
      matchedColumn: column?.name ?? null,
      matchedColumnIndex: column?.index ?? null,
      matchConfidence: confidence,
      matchStatus: status,
      severity: inferSeverity(c, ers),
    };
  });

  const matchedCount = gates.filter((g) => g.matchStatus === "matched").length;
  const fuzzyCount = gates.filter((g) => g.matchStatus === "fuzzy").length;
  const missingCount = gates.filter((g) => g.matchStatus === "missing").length;
  const averageConfidence =
    gates.length === 0
      ? 0
      : gates.reduce((s, g) => s + g.matchConfidence, 0) / gates.length;

  return { gates, matchedCount, fuzzyCount, missingCount, averageConfidence };
}
