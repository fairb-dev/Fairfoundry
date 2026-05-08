import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSample, readSampleCsv, readSampleErs } from "@/lib/sample-catalog";
import { simulateSandbox } from "@/lib/sandbox-simulator";
import type { GradeLabel } from "@/lib/grade-engine";
import { ParameterExtractionTable, type ExtractionColumnRow } from "./ParameterExtractionTable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}): Promise<Metadata> {
  const { sessionId } = await params;
  const sample = getSample(sessionId);
  return {
    title: sample ? `${sample.title} Sandbox` : "Sandbox",
    description:
      "Fairbuild sandbox workspace for production log profiling, quality gates, grading, review, and settlement-instruction preview.",
  };
}

const workflowSteps = [
  ["Intake", "native log loaded", "#main-content"],
  ["Extract", "columns classified", "#extract"],
  ["Gate", "ERS limits matched", "#gate"],
  ["Grade", "quality tiers assigned", "#grade"],
  ["Review", "48-hour window modeled", "#commercial-workflow"],
  ["Report", "evidence package ready", "#readiness-report"],
];

const gradeOrder: GradeLabel[] = [
  "Grade A",
  "Grade B",
  "Rework",
  "Review",
  "Reject",
];

const gradeClass: Record<GradeLabel, string> = {
  "Grade A": "grade-a",
  "Grade B": "grade-b",
  Rework: "grade-rework",
  Review: "grade-review",
  Reject: "grade-reject",
};

function pct(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatLimit(gate: {
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
}): string {
  const unit = gate.unit ? ` ${gate.unit}` : "";
  if (gate.criteriaType === "NUMERIC_GTE") return `>= ${gate.lowerLimit}${unit}`;
  if (gate.criteriaType === "NUMERIC_LTE") return `<= ${gate.upperLimit}${unit}`;
  if (gate.criteriaType === "NUMERIC_RANGE") {
    return `${gate.lowerLimit} to ${gate.upperLimit}${unit}`;
  }
  return "configured in ERS";
}

function formatSampleValues(values: string[]): string {
  if (values.length <= 3) return values.join(", ");
  return `${values.slice(0, 3).join(", ")} +${values.length - 3} more`;
}

function outcomeFor(distribution: Record<GradeLabel, number>, totalUnits: number) {
  const accepted = distribution["Grade A"] + distribution["Grade B"];
  const hold = distribution.Rework + distribution.Review + distribution.Reject;

  if (hold === 0) {
    return {
      tone: "green",
      label: "Ready for 48-hour review",
      summary: `${accepted} accepted units can enter the customer review window before settlement instructions proceed.`,
    };
  }

  return {
    tone: distribution.Reject > 0 ? "red" : "amber",
    label: "Review required",
    summary: `${accepted} of ${totalUnits} units are accepted. ${hold} unit${hold === 1 ? "" : "s"} require disposition before settlement instructions proceed.`,
  };
}

export default async function SandboxSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const sample = getSample(sessionId);
  if (!sample) notFound();

  const [csvText, ers] = await Promise.all([
    readSampleCsv(sample),
    readSampleErs(sample),
  ]);
  const simulation = simulateSandbox(sample, csvText, ers);
  const totalUnits = simulation.gradeSummary.units.length;
  const distribution = simulation.gradeSummary.distribution;
  const acceptedUnits = distribution["Grade A"] + distribution["Grade B"];
  const heldUnits = distribution.Rework + distribution.Review + distribution.Reject;
  const outcome = outcomeFor(distribution, totalUnits);
  const gradeRows = gradeOrder.map((grade) => [grade, distribution[grade]] as const);
  const heldUnitRows = simulation.gradeSummary.units.filter(
    (unit) => unit.grade !== "Grade A" && unit.grade !== "Grade B"
  );
  const matrixUnits =
    heldUnitRows.length > 0 ? heldUnitRows : simulation.gradeSummary.units;
  const displayedColumns = simulation.profile.columns.slice(0, 16);
  const extractionRows: ExtractionColumnRow[] = displayedColumns.map((column) => ({
    name: column.name,
    role: column.inferredRole,
    dataType: column.dataType,
    statsText: column.numericStats
      ? `${column.numericStats.min} / ${column.numericStats.p50} / ${column.numericStats.max}`
      : formatSampleValues(column.sampleValues),
    statsTitle: column.numericStats ? null : column.sampleValues.join(", "),
    confidenceText: formatPercent(column.roleConfidence),
    confidenceValue: column.roleConfidence,
  }));
  const measurementNote =
    simulation.roleCoverage.measurementCount === 0
      ? "defect-count log: conditional integers, not continuous measurements"
      : "numeric measurement columns";
  const generatedAt = new Date().toISOString();
  const reportHref = `/sandbox/${sessionId}/report`;

  return (
    <div className="sandbox-dashboard min-h-screen">
      <aside className="sandbox-rail report-no-print">
        <div className="sandbox-rail-brand">
          <Link href="/" className="sandbox-wordmark">
            Fairbuild
          </Link>
          <span>Studio sandbox · 20-minute total path</span>
        </div>

        <div className="sandbox-rail-section">
          <p className="sandbox-label">Sections</p>
          <ol className="sandbox-step-list">
            {workflowSteps.map(([label, state, href]) => (
              <li key={label}>
                <a className="sandbox-step" href={href}>
                  <span>
                    <strong>{label}</strong>
                    <small>{state}</small>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="sandbox-rail-section">
          <p className="sandbox-label">Source package</p>
          <h2>{ers.title}</h2>
          <dl className="sandbox-definition-list">
            <div>
              <dt>OEM</dt>
              <dd>{sample.oem}</dd>
            </div>
            <div>
              <dt>Factory</dt>
              <dd>{sample.factory}</dd>
            </div>
            <div>
              <dt>ERS revision</dt>
              <dd>
                {ers.revision} / {ers.effective_date}
              </dd>
            </div>
          </dl>
        </div>

        <div className={`sandbox-rail-section ${simulation.reviewFlags.length === 0 ? "compact" : ""}`}>
          <div className="sandbox-rail-section-header">
            <p className="sandbox-label">Review flags</p>
            {simulation.reviewFlags.length === 0 && (
              <span className="sandbox-chip neutral">0 review flags</span>
            )}
          </div>
          {simulation.reviewFlags.length === 0 ? (
            null
          ) : (
            <ul className="sandbox-flag-list">
              {simulation.reviewFlags.slice(0, 5).map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="sandbox-rail-actions">
          <Link href="/sandbox" className="sandbox-button secondary">
            Change sample
          </Link>
        </div>
      </aside>

      <main id="main-content" className="sandbox-main report-page">
        <div className="sandbox-topbar report-no-print">
          <div className="sandbox-breadcrumb">
            <Link href="/">Fairbuild</Link>
            <span>/</span>
            <Link href="/sandbox">Sandbox</Link>
            <span>/</span>
            <strong>{sample.title}</strong>
          </div>
          <div className="sandbox-topbar-actions">
            <a
              href="https://www.fairb.com/contact"
              className="sandbox-button primary"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Talk to sales, opens in a new tab"
            >
              Talk to sales <span className="external-indicator" aria-hidden="true">↗</span>
            </a>
            <a download={`${sessionId}-readiness-report.json`} href={reportHref} className="sandbox-button secondary">
              Download report
            </a>
          </div>
        </div>

        <section className={`sandbox-verdict-banner ${outcome.tone}`}>
          <div>
            <span>{outcome.label}</span>
            <strong>ERS mapping {simulation.evidenceCompleteness}%</strong>
            <p>
              {outcome.summary} Mapping coverage means the log has evidence for every ERS gate,
              not that every unit passed.
            </p>
          </div>
          <a href="#commercial-workflow" className="sandbox-button secondary">
            Jump to commercial terms
          </a>
        </section>

        <section className="sandbox-hero">
          <div>
            <p className="sandbox-label">Sample sandbox record</p>
            <h1>{sample.product}</h1>
            <p>{sample.tagline}</p>
          </div>
        </section>

        <section className="sandbox-metric-strip" aria-label="Sandbox run metrics">
          <div>
            <span>Rows</span>
            <strong>{simulation.profile.rowCount}</strong>
          </div>
          <div>
            <span>Columns</span>
            <strong>{simulation.profile.columnCount}</strong>
          </div>
          <div aria-label={`Measurements: ${simulation.roleCoverage.measurementCount}. ${measurementNote}`}>
            <span>Measurements</span>
            <strong aria-describedby="measurement-note">
              {simulation.roleCoverage.measurementCount}
            </strong>
            <small id="measurement-note">{measurementNote}</small>
          </div>
          <div>
            <span>Matched gates</span>
            <strong>
              {simulation.gateSuggestions.matchedCount}/{simulation.gateSuggestions.gates.length}
            </strong>
          </div>
          <div>
            <span>Accepted units</span>
            <strong>
              {acceptedUnits}/{totalUnits}
            </strong>
          </div>
        </section>

        <section className="sandbox-panel" id="extract">
          <div className="sandbox-panel-heading">
            <div>
              <p className="sandbox-label">Extract</p>
              <h2>Parameter extraction table</h2>
            </div>
            <span className="sandbox-chip success">roles preselected for review</span>
          </div>
          <ParameterExtractionTable rows={extractionRows} />
          <p className="sandbox-method-note">
            Confidence is computed from column names, data type, uniqueness, and sample-value distribution.
          </p>
        </section>

        <section className="sandbox-panel" id="gate">
          <div className="sandbox-panel-heading">
            <div>
              <p className="sandbox-label">Gate</p>
              <h2>Quality gate ledger</h2>
            </div>
            <span className="sandbox-chip neutral">
              evidence completeness {simulation.evidenceCompleteness}%
            </span>
          </div>
          <div className="sandbox-table-wrap">
            <table className="sandbox-table" aria-label="Quality gate ledger">
              <thead>
                <tr>
                  <th>Gate</th>
                  <th>Limit</th>
                  <th>Evidence column</th>
                  <th>Severity</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {simulation.gateSuggestions.gates.map((gate) => (
                  <tr key={gate.criterionId}>
                    <td>
                      <strong>{gate.criterionId}</strong>
                      <small>{gate.parameter}</small>
                    </td>
                    <td className="sandbox-mono">{formatLimit(gate)}</td>
                    <td aria-label={`${gate.matchedColumn ?? "unmatched"} evidence ${gate.matchStatus}`}>
                      <span className="sandbox-mono">{gate.matchedColumn ?? "unmatched"}</span>
                      <span className={`sandbox-chip gate-${gate.matchStatus}`}>
                        {gate.matchStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`sandbox-chip severity-${gate.severity}`}>
                        {gate.severity}
                      </span>
                    </td>
                    <td>{gate.sectionRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="sandbox-two-column" id="grade">
          <div className="sandbox-panel">
            <div className="sandbox-panel-heading">
              <div>
                <p className="sandbox-label">Grade</p>
                <h2>Grade distribution</h2>
              </div>
            </div>
            <div className="sandbox-grade-list">
              {gradeRows.map(([grade, count]) => (
                <div key={grade} className="sandbox-grade-row">
                  <div>
                    <span className={`sandbox-grade-pill ${gradeClass[grade]}`} aria-label={`Grade: ${grade}`}>
                      {grade}
                    </span>
                    <span className="sandbox-mono">
                      {count} / {totalUnits}
                    </span>
                  </div>
                  <div className="sandbox-grade-track">
                    <span
                      className={`sandbox-grade-bar ${gradeClass[grade]}`}
                      style={{ width: `${pct(count, totalUnits)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {sample.slug === "pcb-aoi" && (
              <p className="sandbox-method-note">
                This sample is a zero-tolerance defect log, so mid-tier grades are intentionally empty.
                The camera and steel samples show continuous-measurement grading.
              </p>
            )}
          </div>

          <div className="sandbox-panel">
            <div className="sandbox-panel-heading">
              <div>
                <p className="sandbox-label">Review preview</p>
                <h2>Gate failure matrix</h2>
              </div>
              <span className="sandbox-chip neutral">
                held units shown: {matrixUnits.length} of {totalUnits}
              </span>
            </div>
            <div className="sandbox-filter-row" aria-label="Grade summary filters">
              {gradeRows.map(([grade, count]) => (
                <span key={grade}>
                  {grade}: <strong>{count}</strong>
                </span>
              ))}
            </div>
            <div className="sandbox-table-wrap compact">
              <table className="sandbox-table" aria-label="Gate failure matrix">
                <thead>
                  <tr>
                    <th>Unit</th>
                    <th>Grade</th>
                    <th>Failed gates</th>
                    <th>Review triggers</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixUnits.map((unit) => (
                    <tr key={unit.unitId}>
                      <td className="sandbox-mono">{unit.unitId}</td>
                      <td>
                        <span className={`sandbox-grade-pill ${gradeClass[unit.grade]}`} aria-label={`Grade: ${unit.grade}`}>
                          {unit.grade}
                        </span>
                      </td>
                      <td>{unit.failedGateIds.length > 0 ? unit.failedGateIds.join(", ") : "none"}</td>
                      <td>
                        {unit.reviewFlags.length > 0
                          ? unit.reviewFlags.join("; ")
                          : unit.failedGateIds.length > 0
                            ? `Settlement held by ${unit.failedGateIds.join(", ")}`
                            : "none"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sandbox-method-note">
              The matrix defaults to units that hold settlement instructions. The downloaded report includes all {totalUnits} units.
            </p>
          </div>
        </section>

        <section className="sandbox-panel" id="commercial-workflow">
          <div className="sandbox-panel-heading">
            <div>
              <p className="sandbox-label">Commercial workflow</p>
              <h2>Review and settlement instruction path</h2>
            </div>
          </div>
          <div className="sandbox-workflow-grid">
            <article>
              <span>1</span>
              <h3>Funding boundary confirmed</h3>
              <p>{simulation.settlementPreview.partnerFundingState}</p>
            </article>
            <article>
              <span>2</span>
              <h3>Customer review window</h3>
              <p>{simulation.settlementPreview.reviewWindow}</p>
            </article>
            <article>
              <span>3</span>
              <h3>Dispute path if initiated</h3>
              <p>{simulation.settlementPreview.interventionPath}</p>
            </article>
            <article>
              <span>4</span>
              <h3>Settlement consequence</h3>
              <p>{simulation.settlementPreview.settlementInstruction}</p>
            </article>
          </div>
          <p className="sandbox-custody-note">{simulation.settlementPreview.custodyBoundary}</p>
        </section>

        <section className="sandbox-panel" id="readiness-report">
          <div className="sandbox-panel-heading">
            <div>
              <p className="sandbox-label">Report</p>
              <h2>Readiness report</h2>
            </div>
          </div>
          <div className="sandbox-report-grid">
            <div>
              <span>Report ID</span>
              <strong>FB-SBX-{sample.ersId}</strong>
            </div>
            <div>
              <span>Generated</span>
              <strong>{generatedAt}</strong>
            </div>
            <div>
              <span>ERS version</span>
              <strong>
                {ers.ers_id} {ers.revision}
              </strong>
            </div>
            <div>
              <span>Mapping profile</span>
              <strong>
                {simulation.profile.columnCount} columns, {simulation.roleCoverage.measurementCount} measurements
              </strong>
            </div>
            <div>
              <span>Contract controls</span>
              <strong>
                {simulation.gateSuggestions.gates.length} gates, {simulation.evidenceCompleteness}% evidence
              </strong>
            </div>
            <div>
              <span>Disposition</span>
              <strong>
                {acceptedUnits} accepted, {heldUnits} held
              </strong>
            </div>
          </div>
          <div className="sandbox-signature-row">
            <span>OEM reviewer</span>
            <span>Factory quality</span>
            <span>Fairbuild workflow reviewer</span>
          </div>
          <p className="sandbox-custody-note">
            Sandbox only. Fairbuild does not provide production custody, escrow, or payment services here.
            Settlement output is an instruction preview.
          </p>
        </section>
      </main>
    </div>
  );
}
