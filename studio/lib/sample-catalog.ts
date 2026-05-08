import path from "node:path";
import fs from "node:fs/promises";

export interface SampleCatalogEntry {
  slug: string;
  ersId: string;
  title: string;
  product: string;
  industry: string;
  oem: string;
  factory: string;
  csvFile: string;
  ersFile: string;
  estimatedMinutes: number;
  tagline: string;
  highlights: string[];
}

export const SAMPLE_CATALOG: SampleCatalogEntry[] = [
  {
    slug: "camera-module-mtf",
    ersId: "ERS-001",
    title: "Camera Module MTF / SFR Test",
    product: "12MP Camera Module CM-120",
    industry: "Optoelectronics, mobile imaging",
    oem: "Lumenar Technologies",
    factory: "ShenzhenVision Optoelectronics",
    csvFile: "camera_module_mtf_test.csv",
    ersFile: "camera_module_mtf_ers.json",
    estimatedMinutes: 12,
    tagline:
      "Active alignment line, MTF/illumination/tilt gates with critical and engineering-review tiers.",
    highlights: [
      "8 acceptance criteria across MTF, illumination, optical center, AA tilt",
      "Critical gates C001-C004, engineering review for C005-C008",
      "100% sampling with per-unit traceability",
    ],
  },
  {
    slug: "pcb-aoi",
    ersId: "ERS-002",
    title: "PCB Automated Optical Inspection",
    product: "Main Board PCB Assembly MB-400",
    industry: "Electronics manufacturing services",
    oem: "NexGen Electronics",
    factory: "GuangzhouPCB Manufacturing Co.",
    csvFile: "pcb_aoi_inspection.csv",
    ersFile: "pcb_aoi_ers.json",
    estimatedMinutes: 9,
    tagline:
      "Defect-count log with zero-tolerance gates; classic 'count-must-be-zero' acceptance pattern.",
    highlights: [
      "7 zero-tolerance numeric_lte gates",
      "Aggregate total_defects gate must reconcile with per-defect counts",
      "All defects treated as critical per disposition rules",
    ],
  },
  {
    slug: "steel-plate-mtc",
    ersId: "ERS-007",
    title: "Structural Steel Plate Mill Test Certificate",
    product: "A36 Structural Steel Plate 12mm",
    industry: "Metals, ASTM A36 mill product",
    oem: "Pacific Structural Steel",
    factory: "Baosteel Hot Rolling Mill",
    csvFile: "steel_plate_mtc.csv",
    ersFile: "steel_plate_ers.json",
    estimatedMinutes: 14,
    tagline:
      "Mill test certificate with mixed range, GTE, and LTE gates per ASTM A36; per-heat sampling.",
    highlights: [
      "10 acceptance criteria spanning chemistry and mechanicals",
      "Mixed criteria types: NUMERIC_RANGE, NUMERIC_GTE, NUMERIC_LTE",
      "Per-heat sampling with retest provision per ASTM A6 §14",
    ],
  },
];

export function getSample(slug: string): SampleCatalogEntry | undefined {
  return SAMPLE_CATALOG.find((s) => s.slug === slug);
}

const SAMPLE_DATA_DIR = "sample-data";
const SAMPLE_ERS_DIR = "sample-ers";

export async function readSampleCsv(entry: SampleCatalogEntry): Promise<string> {
  const filePath = path.resolve(process.cwd(), SAMPLE_DATA_DIR, entry.csvFile);
  return fs.readFile(filePath, "utf8");
}

export interface ErsCriterion {
  criterion_id: string;
  parameter: string;
  maps_to_column: string;
  type: string;
  lower_limit?: number;
  upper_limit?: number;
  unit?: string;
  section_ref?: string;
  notes?: string;
}

export interface ErsDocument {
  ers_id: string;
  title: string;
  revision: string;
  product: string;
  stage: string;
  issued_by: string;
  factory: string;
  effective_date: string;
  test_conditions?: Record<string, unknown>;
  acceptance_criteria: ErsCriterion[];
  sampling?: { method?: string; aql?: number | null; notes?: string };
  disposition_rules?: { pass?: string; conditional?: string; fail?: string };
}

export async function readSampleErs(entry: SampleCatalogEntry): Promise<ErsDocument> {
  const filePath = path.resolve(process.cwd(), SAMPLE_ERS_DIR, entry.ersFile);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as ErsDocument;
}
