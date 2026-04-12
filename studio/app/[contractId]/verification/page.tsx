import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCSV } from "@/lib/csv-parser";
import {
  runVerification,
  formatLimit,
  type LinkedColumn,
} from "@/lib/verification-engine";

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  // ── Load all data in parallel ──────────────────────────────────────────

  const [contract, logMapping, links] = await Promise.all([
    prisma.contract.findUnique({ where: { id: contractId } }),
    prisma.logMapping.findFirst({ where: { contractId } }),
    prisma.columnCriteriaLink.findMany({
      where: { contractId },
      include: {
        column: true,
        criterion: true,
      },
    }),
  ]);

  if (!contract) notFound();

  if (!logMapping || links.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center text-gray-500">
        Verification requires linked data columns and acceptance criteria.
        Set up links first.
      </div>
    );
  }

  const logFormat = await prisma.logFormat.findUnique({
    where: { id: logMapping.logFormatId },
    include: {
      columns: { orderBy: { columnIndex: "asc" } },
    },
  });

  if (!logFormat) notFound();

  // ── Read the CSV ───────────────────────────────────────────────────────

  const sampleDataDir = path.resolve(
    process.cwd(),
    "../docs/research/virtual-world/sample-data"
  );

  const csvFiles = fs.readdirSync(sampleDataDir).filter((f) => f.endsWith(".csv"));
  const formatNameLower = logFormat.name.toLowerCase();

  let csvFileName = csvFiles[0];
  for (const f of csvFiles) {
    const fLower = f.toLowerCase();
    if (formatNameLower.includes("camera") && fLower.includes("camera")) { csvFileName = f; break; }
    if (formatNameLower.includes("steel") && fLower.includes("steel")) { csvFileName = f; break; }
    if (formatNameLower.includes("tablet") && fLower.includes("tablet")) { csvFileName = f; break; }
  }

  let csvContent: string;
  try {
    csvContent = fs.readFileSync(path.join(sampleDataDir, csvFileName), "utf-8");
  } catch {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center text-gray-500">
        CSV file not found.
      </div>
    );
  }

  const { headers, rows } = parseCSV(csvContent);

  // ── Build column maps ──────────────────────────────────────────────────

  // Map from DB column data
  const dbColumnsByName: Record<string, (typeof logFormat.columns)[0]> = {};
  for (const col of logFormat.columns) {
    dbColumnsByName[col.originalName] = col;
  }

  // Find UNIT_ID column
  const unitIdCol = logFormat.columns.find((c) => c.role === "UNIT_ID");
  const unitIdColumnIndex = unitIdCol
    ? headers.indexOf(unitIdCol.originalName)
    : 0;

  // Build LinkedColumn array for the engine
  const linkedColumns: LinkedColumn[] = links.map((link) => ({
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

  // ── Run the verification engine ────────────────────────────────────────

  const result = runVerification(headers, rows, linkedColumns, unitIdColumnIndex);

  // ── Build the header info for each column ──────────────────────────────

  // For each CSV header, determine if it's linked (has criteria overlay)
  const linkedColumnNames = new Set(linkedColumns.map((lc) => lc.columnName));

  // Map column name to linked column info
  const linkedInfo: Record<string, LinkedColumn> = {};
  for (const lc of linkedColumns) {
    linkedInfo[lc.columnName] = lc;
  }

  // Determine which columns to show: UNIT_ID first, then linked, then others
  const unitIdHeader = unitIdCol?.originalName ?? headers[0];

  // Build ordered column list
  const orderedHeaders: string[] = [unitIdHeader];
  // Add linked columns in their original order
  for (const h of headers) {
    if (h !== unitIdHeader && linkedColumnNames.has(h)) {
      orderedHeaders.push(h);
    }
  }
  // Add remaining columns
  for (const h of headers) {
    if (!orderedHeaders.includes(h)) {
      orderedHeaders.push(h);
    }
  }

  // Header index mapping
  const headerIndexMap: Record<string, number> = {};
  headers.forEach((h, i) => { headerIndexMap[h] = i; });

  // ── Compute pass rate color ────────────────────────────────────────────

  const passRate = result.passRate;
  const passRateColor =
    passRate >= 95 ? "var(--pass)" : passRate >= 80 ? "#ca8a04" : "var(--fail)";

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Summary Bar ─────────────────────────────────────────────── */}
      <div className="mb-6 rounded-xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Verification Result
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold"
                style={{ color: passRateColor }}
              >
                {result.totalPassed}/{result.totalUnits}
              </span>
              <span className="text-lg text-gray-400">
                units pass
              </span>
              <span
                className="font-mono text-lg font-semibold"
                style={{ color: passRateColor }}
              >
                ({passRate.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            {csvFileName}
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

        {/* Per-criterion failure summary */}
        {result.criterionSummaries.some((s) => s.totalFailed > 0) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {result.criterionSummaries
              .filter((s) => s.totalFailed > 0)
              .map((s) => (
                <div
                  key={s.columnName}
                  className="flex items-center gap-2 rounded-lg bg-[var(--fail-bg)] px-3 py-1.5 text-xs"
                >
                  <span className="font-mono font-semibold text-[var(--fail)]">
                    {s.totalFailed}
                  </span>
                  <span className="text-gray-600">
                    failed on{" "}
                    <span className="font-mono font-medium">{s.columnName}</span>
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── Hypertext Verification Table ────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-sm">
        <table className="verification-table">
          <thead>
            <tr>
              {orderedHeaders.map((header) => {
                const info = linkedInfo[header];
                const isUnitId = header === unitIdHeader;

                if (info) {
                  // Linked column: three-line header
                  const limitStr = formatLimit(
                    info.criteriaType,
                    info.lowerLimit,
                    info.upperLimit,
                    info.unit
                  );
                  return (
                    <th key={header}>
                      <div className="col-header-name">{header}</div>
                      <div className="col-header-limit">{limitStr}</div>
                      {info.sourceRef && (
                        <div className="col-header-ref">
                          {"\u00A7"}
                          {info.sourceRef.replace(/^Section\s*/i, "")}
                        </div>
                      )}
                    </th>
                  );
                }

                // Non-linked column
                return (
                  <th key={header}>
                    <div className="col-header-name">{header}</div>
                    {isUnitId && (
                      <div className="mt-0.5">
                        <span className="role-badge bg-green-50 text-green-700">
                          Unit ID
                        </span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {result.unitResults.map((unit) => {
              return (
                <tr
                  key={unit.rowIndex}
                  style={{
                    backgroundColor: unit.overallPass
                      ? undefined
                      : "var(--fail-bg-subtle)",
                  }}
                >
                  {orderedHeaders.map((header) => {
                    const colIdx = headerIndexMap[header];
                    const rawValue = rows[unit.rowIndex]?.[colIdx] ?? "";
                    const isUnitId = header === unitIdHeader;
                    const cellResult = unit.cells[header];

                    if (isUnitId) {
                      // Unit ID column: no pass/fail, just the ID
                      return (
                        <td
                          key={header}
                          className="font-mono text-sm font-medium"
                        >
                          {rawValue}
                        </td>
                      );
                    }

                    if (cellResult) {
                      // Linked column: show pass/fail indicator + value
                      return (
                        <td key={header}>
                          <span
                            className="inline-flex items-center gap-1"
                            style={{
                              color: cellResult.pass
                                ? "var(--pass)"
                                : "var(--fail)",
                            }}
                          >
                            <span className="text-xs">
                              {cellResult.pass ? "\u2713" : "\u2717"}
                            </span>
                            <span>{rawValue}</span>
                          </span>
                        </td>
                      );
                    }

                    // Non-linked column: just the value
                    return (
                      <td key={header} className="text-gray-500">
                        {rawValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span style={{ color: "var(--pass)" }}>{"\u2713"}</span>
          <span>Meets acceptance criterion</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ color: "var(--fail)" }}>{"\u2717"}</span>
          <span>Below acceptance criterion</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: "var(--fail-bg-subtle)" }}
          />
          <span>Row contains at least one failure</span>
        </div>
      </div>
    </div>
  );
}
