import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCSV } from "@/lib/csv-parser";
import {
  runVerification,
  formatLimit,
  type LinkedColumn,
} from "@/lib/verification-engine";
import { DonutChart, CriterionMiniBar } from "./donut-chart";
import { generateInsights, InsightsPanel } from "./insights";
import { TableControls } from "./verification/table-controls";
import { WhatIf } from "./verification/what-if";
import { SandboxTransitionButton } from "./sandbox-button";
import { DataPreviewSection } from "./summary-data-preview";
import { ProgressSteps } from "./progress-steps";

/* ── Status descriptions (reused from old overview) ───────────────────── */

const STATUS_DESCRIPTIONS: Record<string, string> = {
  DRAFT: "Upload production data, define acceptance criteria, then link them together. Once linked, run a verification to see pass/fail results.",
  REVIEW: "Both parties are reviewing the contract terms and verification setup.",
  SANDBOX: "Sandbox mode is active. Both parties can test data submissions and verify results before going live.",
  PRODUCTION: "Live production mode. Data submissions are verified and settlements are processed automatically.",
  PAUSED: "This contract has been temporarily paused. No new submissions are being accepted.",
  CLOSED: "This contract has been closed and is no longer accepting submissions.",
};

/* ── Section header component ─────────────────────────────────────────── */

function SectionHeader({
  number,
  title,
  count,
  href,
  icon,
}: {
  number: number;
  title: string;
  count?: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 32,
            height: 32,
            backgroundColor: "var(--muted)",
            color: "var(--foreground)",
          }}
        >
          {icon}
        </div>
        <h2 className="text-base font-semibold text-[var(--foreground)] m-0">
          {number}. {title}
        </h2>
        {count && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {count}
          </span>
        )}
      </div>
      <Link
        href={href}
        className="text-xs font-medium text-gray-400 no-underline hover:text-[var(--accent)] transition-colors"
      >
        Edit
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          className="inline ml-0.5"
          style={{ verticalAlign: "-1px" }}
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────── */

const DataIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 1h5.586L13 4.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const CriteriaIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.333 4L6 11.333L2.667 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LinksIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M6.667 8.667a3.333 3.333 0 005.026.36l2-2a3.334 3.334 0 00-4.713-4.714L8.313 2.98"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.333 7.333a3.333 3.333 0 00-5.026-.36l-2 2a3.334 3.334 0 004.713 4.714l.667-.667"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VerificationIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M5.5 8l2 2 3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── CSV file resolution helper (shared logic) ───────────────────────── */

function resolveCSV(logFormatName: string): {
  content: string;
  fileName: string;
} | null {
  const formatNameLower = logFormatName.toLowerCase();
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  let foundInUploads = false;
  let csvContent = "";
  let csvFileName = logFormatName + ".csv";

  if (fs.existsSync(uploadsDir)) {
    const uploadFiles = fs
      .readdirSync(uploadsDir)
      .filter((f) => f.endsWith(".csv"));
    for (const f of uploadFiles) {
      if (
        f
          .toLowerCase()
          .includes(formatNameLower.replace(/\s+/g, "_").toLowerCase()) ||
        uploadFiles.length === 1
      ) {
        const fPath = path.join(uploadsDir, f);
        try {
          csvContent = fs.readFileSync(fPath, "utf-8");
          csvFileName = f.replace(/^\d+_/, "");
          foundInUploads = true;
        } catch {
          /* continue */
        }
      }
    }
    if (!foundInUploads && uploadFiles.length > 0) {
      const sorted = [...uploadFiles].sort().reverse();
      const fPath = path.join(uploadsDir, sorted[0]);
      try {
        csvContent = fs.readFileSync(fPath, "utf-8");
        csvFileName = sorted[0].replace(/^\d+_/, "");
        foundInUploads = true;
      } catch {
        /* continue */
      }
    }
  }

  if (!foundInUploads) {
    const sampleDataDir = path.resolve(
      process.cwd(),
      "../docs/research/virtual-world/sample-data",
    );
    try {
      const csvFiles = fs
        .readdirSync(sampleDataDir)
        .filter((f) => f.endsWith(".csv"));
      let matchedFile = csvFiles[0];
      for (const f of csvFiles) {
        const fLower = f.toLowerCase();
        if (formatNameLower.includes("camera") && fLower.includes("camera")) {
          matchedFile = f;
          break;
        }
        if (formatNameLower.includes("steel") && fLower.includes("steel")) {
          matchedFile = f;
          break;
        }
        if (formatNameLower.includes("tablet") && fLower.includes("tablet")) {
          matchedFile = f;
          break;
        }
      }
      if (matchedFile) {
        csvContent = fs.readFileSync(
          path.join(sampleDataDir, matchedFile),
          "utf-8",
        );
        csvFileName = matchedFile;
      }
    } catch {
      /* no sample data */
    }
  }

  if (!csvContent) return null;
  return { content: csvContent, fileName: csvFileName };
}

/* ── Main Page Component ──────────────────────────────────────────────── */

export default async function ContractOverview({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  // ── Single query: load everything ─────────────────────────────────────
  const [contract, logMapping, links, criteria] = await Promise.all([
    prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        parties: { include: { company: true } },
      },
    }),
    prisma.logMapping.findFirst({ where: { contractId } }),
    prisma.columnCriteriaLink.findMany({
      where: { contractId },
      include: { column: true, criterion: true },
    }),
    prisma.acceptanceCriterion.findMany({
      where: { contractId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!contract) notFound();

  const oem = contract.parties.find((p) => p.role === "OEM");
  const factory = contract.parties.find((p) => p.role === "FACTORY");

  // ── Resolve CSV & log format ──────────────────────────────────────────
  let logFormat: {
    name: string;
    columns: {
      id: string;
      originalName: string;
      role: string;
      columnIndex: number;
    }[];
  } | null = null;
  let csvData: { headers: string[]; rows: string[][] } | null = null;
  let csvFileName = "";

  if (logMapping) {
    const lf = await prisma.logFormat.findUnique({
      where: { id: logMapping.logFormatId },
      include: { columns: { orderBy: { columnIndex: "asc" } } },
    });
    if (lf) {
      logFormat = lf;
      const csv = resolveCSV(lf.name);
      if (csv) {
        csvData = parseCSV(csv.content);
        csvFileName = csv.fileName;
      }
    }
  }

  const hasData = logFormat !== null && csvData !== null;
  const hasCriteria = criteria.length > 0;
  const hasLinks = links.length > 0;
  const columnCount = logFormat?.columns.length ?? 0;

  // ── Verification (only if links + data exist) ─────────────────────────
  let verificationResult: ReturnType<typeof runVerification> | null = null;
  let linkedColumns: LinkedColumn[] = [];
  let orderedHeaders: string[] = [];
  let unitIdHeader = "";
  let headerIndexMap: Record<string, number> = {};
  let linkedInfo: Record<
    string,
    {
      columnName: string;
      criteriaType: string;
      lowerLimit: number | null;
      upperLimit: number | null;
      unit: string | null;
      sourceRef: string | null;
      parameterName: string;
    }
  > = {};
  let linkedColumnNames: string[] = [];

  if (hasLinks && csvData && logFormat) {
    const { headers, rows } = csvData;

    const unitIdCol = logFormat.columns.find((c) => c.role === "UNIT_ID");
    const unitIdColumnIndex = unitIdCol
      ? headers.indexOf(unitIdCol.originalName)
      : 0;
    unitIdHeader = unitIdCol?.originalName ?? headers[0];

    linkedColumns = links.map((link) => ({
      columnIndex: headers.indexOf(link.column.originalName),
      columnName: link.column.originalName,
      criterionId: link.criterion.id,
      parameterName: link.criterion.parameterName,
      criteriaType: link.criterion.criteriaType,
      lowerLimit: link.criterion.lowerLimit,
      upperLimit: link.criterion.upperLimit,
      unit: link.criterion.unit,
      sourceRef: link.criterion.sourceRef,
    }));

    verificationResult = runVerification(
      headers,
      rows,
      linkedColumns,
      unitIdColumnIndex,
    );

    const linkedNameSet = new Set(linkedColumns.map((lc) => lc.columnName));
    linkedColumnNames = Array.from(linkedNameSet);

    orderedHeaders = [unitIdHeader];
    for (const h of headers) {
      if (h !== unitIdHeader && linkedNameSet.has(h)) orderedHeaders.push(h);
    }
    for (const h of headers) {
      if (!orderedHeaders.includes(h)) orderedHeaders.push(h);
    }

    headers.forEach((h, i) => {
      headerIndexMap[h] = i;
    });

    for (const lc of linkedColumns) {
      linkedInfo[lc.columnName] = {
        columnName: lc.columnName,
        criteriaType: lc.criteriaType,
        lowerLimit: lc.lowerLimit,
        upperLimit: lc.upperLimit,
        unit: lc.unit,
        sourceRef: lc.sourceRef,
        parameterName: lc.parameterName,
      };
    }
  }

  const passRate = verificationResult?.passRate ?? 0;
  const passRateColor =
    passRate >= 95 ? "var(--pass)" : passRate >= 80 ? "#ca8a04" : "var(--fail)";

  // ── Render the one-page summary ───────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* ── Contract Header ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
              {oem && (
                <span className="font-medium text-gray-700">
                  {oem.company.name}
                </span>
              )}
              {oem && factory && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-gray-300"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {factory && (
                <span className="font-medium text-gray-700">
                  {factory.company.name}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed m-0">
              {STATUS_DESCRIPTIONS[contract.status] ?? ""}
            </p>
          </div>
          {contract.status === "DRAFT" && hasLinks && (
            <SandboxTransitionButton contractId={contractId} />
          )}
        </div>
      </div>

      {/* ── Setup Progress (shown when contract is not fully set up) ── */}
      {!verificationResult && (
        <div className="rounded-xl border border-[var(--border)] bg-white px-6 py-5">
          <div className="text-sm font-medium text-gray-500 mb-4">
            Upload a production log and define acceptance criteria to get started.
          </div>
          <div className="flex justify-center">
            <ProgressSteps
              hasData={hasData}
              hasCriteria={hasCriteria}
              hasLinks={hasLinks}
              hasVerification={false}
            />
          </div>
        </div>
      )}

      {/* ── SECTION 1: PRODUCTION DATA ───────────────────────────────── */}
      <section>
        <SectionHeader
          number={1}
          title="Production Data"
          count={
            hasData
              ? `${csvData!.rows.length} rows, ${csvData!.headers.length} cols`
              : undefined
          }
          href={`/${contractId}/data`}
          icon={DataIcon}
        />

        {hasData && csvData ? (
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm text-gray-600">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 1h5.586L13 4.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                {csvFileName}
              </div>
              <span className="text-sm text-gray-400">
                {csvData.rows.length} rows &middot; {csvData.headers.length}{" "}
                columns
              </span>
            </div>
            <DataPreviewSection
              headers={csvData.headers}
              rows={csvData.rows}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-[var(--muted)] p-8 text-center">
            <div className="text-sm text-gray-500 mb-3">
              No production data uploaded yet.
            </div>
            <Link
              href={`/${contractId}/data`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm hover:opacity-90"
            >
              Upload Data
            </Link>
          </div>
        )}
      </section>

      {/* ── SECTION 2: ACCEPTANCE CRITERIA ────────────────────────────── */}
      <section>
        <SectionHeader
          number={2}
          title="Acceptance Criteria"
          count={
            hasCriteria
              ? `${criteria.length} ${criteria.length === 1 ? "criterion" : "criteria"}`
              : undefined
          }
          href={`/${contractId}/criteria`}
          icon={CriteriaIcon}
        />

        {hasCriteria ? (
          <div className="rounded-xl border border-[var(--border)] bg-white">
            <div className="divide-y divide-[var(--border)]">
              {criteria.map((c) => {
                const limitStr = formatLimit(
                  c.criteriaType,
                  c.lowerLimit,
                  c.upperLimit,
                  c.unit,
                );
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {c.parameterName}
                      </span>
                      {c.sourceRef && (
                        <span className="text-xs text-gray-400">
                          {"\u00A7"}
                          {c.sourceRef.replace(/^Section\s*/i, "")}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-sm text-gray-600">
                      {limitStr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-[var(--muted)] p-8 text-center">
            <div className="text-sm text-gray-500 mb-3">
              No acceptance criteria defined yet.
            </div>
            <Link
              href={`/${contractId}/criteria`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm hover:opacity-90"
            >
              Define Criteria
            </Link>
          </div>
        )}
      </section>

      {/* ── SECTION 3: COLUMN LINKS ──────────────────────────────────── */}
      <section>
        <SectionHeader
          number={3}
          title="Column Links"
          count={
            hasLinks
              ? `${links.length} of ${criteria.length} linked`
              : undefined
          }
          href={`/${contractId}/links`}
          icon={LinksIcon}
        />

        {hasLinks ? (
          <div className="rounded-xl border border-[var(--border)] bg-white">
            <div className="divide-y divide-[var(--border)]">
              {links.map((link) => {
                const limitStr = formatLimit(
                  link.criterion.criteriaType,
                  link.criterion.lowerLimit,
                  link.criterion.upperLimit,
                  link.criterion.unit,
                );
                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[var(--foreground)]">
                        {link.column.originalName}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-gray-300"
                      >
                        <path
                          d="M4 8h8M9 5l3 3-3 3"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {link.criterion.parameterName}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-gray-400">
                      {limitStr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : hasCriteria && hasData ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-[var(--muted)] p-8 text-center">
            <div className="text-sm text-gray-500 mb-3">
              No columns linked to criteria yet. Match data columns to
              acceptance criteria.
            </div>
            <Link
              href={`/${contractId}/links`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm hover:opacity-90"
            >
              Match Columns
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-[var(--muted)] p-6 text-center">
            <div className="text-sm text-gray-400">
              {!hasData && !hasCriteria
                ? "Upload data and define criteria first."
                : !hasData
                  ? "Upload production data first."
                  : "Define acceptance criteria first."}
            </div>
          </div>
        )}
      </section>

      {/* ── SECTION 4: VERIFICATION ──────────────────────────────────── */}
      {hasLinks && verificationResult && csvData && (
        <section>
          <SectionHeader
            number={4}
            title="Verification"
            count={`${verificationResult.totalPassed}/${verificationResult.totalUnits} pass`}
            href={`/${contractId}/verification`}
            icon={VerificationIcon}
          />

          {/* Summary bar */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-8 mb-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-5">
                <DonutChart passRate={passRate} size={72} />
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Verification Result
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-mono text-4xl font-bold"
                      style={{ color: passRateColor }}
                    >
                      {verificationResult.totalPassed}/
                      {verificationResult.totalUnits}
                    </span>
                    <span className="text-base text-gray-400">units pass</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-gray-500">{csvFileName}</div>
                <a
                  href={`/${contractId}/report`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--foreground)] no-underline shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2v6h6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 18v-6M9 15l3 3 3-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download Report
                </a>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${passRate}%`,
                  backgroundColor: passRateColor,
                }}
              />
            </div>

            <div className="mt-2 text-sm text-gray-400">
              {linkedColumns.length}{" "}
              {linkedColumns.length === 1 ? "criterion" : "criteria"} checked
              across {verificationResult.totalUnits} units
            </div>

            {/* Per-criterion mini bars */}
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Per-criterion pass rate
              </div>
              {verificationResult.criterionSummaries.map((s) => (
                <CriterionMiniBar
                  key={s.columnName}
                  label={s.parameterName ?? s.columnName}
                  passRate={
                    verificationResult!.totalUnits > 0
                      ? ((verificationResult!.totalUnits - s.totalFailed) /
                          verificationResult!.totalUnits) *
                        100
                      : 100
                  }
                  failCount={s.totalFailed}
                />
              ))}
            </div>
          </div>

          {/* Full verification table */}
          <TableControls
            unitRows={verificationResult.unitResults.map((unit) => ({
              unitId: unit.unitId,
              rowIndex: unit.rowIndex,
              overallPass: unit.overallPass,
              cells: unit.cells,
              rawRow: csvData!.rows[unit.rowIndex] ?? [],
            }))}
            orderedHeaders={orderedHeaders}
            unitIdHeader={unitIdHeader}
            headerIndexMap={headerIndexMap}
            linkedInfo={linkedInfo}
            linkedColumnNames={linkedColumnNames}
          />

          {/* Insights */}
          <InsightsPanel
            insights={generateInsights(
              verificationResult,
              linkedColumns,
              csvData.headers,
              csvData.rows,
            )}
          />

          {/* What If */}
          <WhatIf
            linkedColumns={linkedColumns.map((lc) => ({
              columnName: lc.columnName,
              criteriaType: lc.criteriaType,
              lowerLimit: lc.lowerLimit,
              upperLimit: lc.upperLimit,
              unit: lc.unit,
              parameterName: lc.parameterName,
            }))}
            csvRows={csvData.rows}
            headerIndexMap={headerIndexMap}
          />

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--pass)" }}>{"\u2713"}</span>
              <span>Within acceptance limits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--fail)" }}>{"\u2717"}</span>
              <span>Outside acceptance limits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: "var(--fail-bg-subtle)" }}
              />
              <span>Row contains at least one failure</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
