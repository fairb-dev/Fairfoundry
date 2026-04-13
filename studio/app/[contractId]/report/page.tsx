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
import { generateInsights } from "../insights";
import { PrintButton } from "./print-button";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  // ── Load all data in parallel ──
  const [contract, logMapping, links] = await Promise.all([
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
  ]);

  if (!contract) notFound();

  const oem = contract.parties.find((p) => p.role === "OEM");
  const factory = contract.parties.find((p) => p.role === "FACTORY");

  if (!logMapping || links.length === 0) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#6b7280" }}>
        No verification data available for this contract.
      </div>
    );
  }

  const logFormat = await prisma.logFormat.findUnique({
    where: { id: logMapping.logFormatId },
    include: { columns: { orderBy: { columnIndex: "asc" } } },
  });

  if (!logFormat) notFound();

  // ── Read CSV ──
  let csvContent = "";
  let csvFileName = logFormat.name + ".csv";
  const formatNameLower = logFormat.name.toLowerCase();

  const uploadsDir = path.resolve(process.cwd(), "uploads");
  let foundInUploads = false;

  if (fs.existsSync(uploadsDir)) {
    const uploadFiles = fs.readdirSync(uploadsDir).filter((f) => f.endsWith(".csv"));
    for (const f of uploadFiles) {
      if (
        f.toLowerCase().includes(formatNameLower.replace(/\s+/g, "_").toLowerCase()) ||
        uploadFiles.length === 1
      ) {
        try {
          csvContent = fs.readFileSync(path.join(uploadsDir, f), "utf-8");
          csvFileName = f.replace(/^\d+_/, "");
          foundInUploads = true;
        } catch {
          /* continue */
        }
      }
    }
    if (!foundInUploads && uploadFiles.length > 0) {
      const sorted = [...uploadFiles].sort().reverse();
      try {
        csvContent = fs.readFileSync(path.join(uploadsDir, sorted[0]), "utf-8");
        csvFileName = sorted[0].replace(/^\d+_/, "");
        foundInUploads = true;
      } catch {
        /* continue */
      }
    }
  }

  if (!foundInUploads) {
    const sampleDataDir = path.resolve(process.cwd(), "../docs/research/virtual-world/sample-data");
    try {
      const csvFiles = fs.readdirSync(sampleDataDir).filter((f) => f.endsWith(".csv"));
      let matchedFile = csvFiles[0];
      for (const f of csvFiles) {
        const fLower = f.toLowerCase();
        if (formatNameLower.includes("camera") && fLower.includes("camera")) { matchedFile = f; break; }
        if (formatNameLower.includes("steel") && fLower.includes("steel")) { matchedFile = f; break; }
        if (formatNameLower.includes("tablet") && fLower.includes("tablet")) { matchedFile = f; break; }
      }
      if (matchedFile) {
        csvContent = fs.readFileSync(path.join(sampleDataDir, matchedFile), "utf-8");
        csvFileName = matchedFile;
      }
    } catch {
      /* no sample data */
    }
  }

  if (!csvContent) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#6b7280" }}>
        CSV data file not found.
      </div>
    );
  }

  const { headers, rows } = parseCSV(csvContent);

  // ── Build verification ──
  const unitIdCol = logFormat.columns.find((c) => c.role === "UNIT_ID");
  const unitIdColumnIndex = unitIdCol ? headers.indexOf(unitIdCol.originalName) : 0;
  const unitIdHeader = unitIdCol?.originalName ?? headers[0];

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

  const result = runVerification(headers, rows, linkedColumns, unitIdColumnIndex);
  const insights = generateInsights(result, linkedColumns, headers, rows);

  const linkedColumnNames = new Set(linkedColumns.map((lc) => lc.columnName));
  const linkedInfo: Record<string, LinkedColumn> = {};
  for (const lc of linkedColumns) {
    linkedInfo[lc.columnName] = lc;
  }

  // Build ordered headers: unit ID, linked, then others
  const orderedHeaders: string[] = [unitIdHeader];
  for (const h of headers) {
    if (h !== unitIdHeader && linkedColumnNames.has(h)) orderedHeaders.push(h);
  }
  for (const h of headers) {
    if (!orderedHeaders.includes(h)) orderedHeaders.push(h);
  }
  const headerIndexMap: Record<string, number> = {};
  headers.forEach((h, i) => { headerIndexMap[h] = i; });

  const passRate = result.passRate;
  const passRateColor =
    passRate >= 95 ? "#166534" : passRate >= 80 ? "#b45309" : "#991b1b";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Render ──
  return (
    <div className="report-page" style={{ fontFamily: "var(--font-sans)", color: "#0a2540" }}>
      {/* Print button — hidden during print */}
      <div className="report-no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <PrintButton />
      </div>

      {/* ── Header ── */}
      <div style={{ borderBottom: "2px solid #e3e8ee", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280", marginBottom: "0.5rem" }}>
          Quality Verification Report
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
          {contract.title}
        </h1>
        <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "1.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
          {oem && (
            <div>
              <span style={{ fontWeight: 600, color: "#374151" }}>OEM:</span>{" "}
              {oem.company.name}
            </div>
          )}
          {factory && (
            <div>
              <span style={{ fontWeight: 600, color: "#374151" }}>Factory:</span>{" "}
              {factory.company.name}
            </div>
          )}
          <div>
            <span style={{ fontWeight: 600, color: "#374151" }}>Date:</span>{" "}
            {dateStr}
          </div>
          <div>
            <span style={{ fontWeight: 600, color: "#374151" }}>Data:</span>{" "}
            {csvFileName}
          </div>
        </div>
      </div>

      {/* ── Summary ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "3rem",
              fontWeight: 700,
              color: passRateColor,
              lineHeight: 1,
            }}
          >
            {passRate.toFixed(1)}%
          </span>
          <span style={{ fontSize: "1rem", color: "#6b7280" }}>pass rate</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "0.875rem", color: "#6b7280" }}>
          <div>
            <span style={{ fontWeight: 600, color: "#374151" }}>{result.totalUnits}</span> units tested
          </div>
          <div>
            <span style={{ fontWeight: 600, color: "#166534" }}>{result.totalPassed}</span> passed
          </div>
          <div>
            <span style={{ fontWeight: 600, color: "#991b1b" }}>{result.totalFailed}</span> failed
          </div>
          <div>
            <span style={{ fontWeight: 600, color: "#374151" }}>{linkedColumns.length}</span>{" "}
            {linkedColumns.length === 1 ? "criterion" : "criteria"} checked
          </div>
        </div>
      </div>

      {/* ── Per-criterion pass rate table ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: "0.75rem" }}>
          Per-Criterion Pass Rate
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e3e8ee" }}>
              <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#374151" }}>
                Parameter
              </th>
              <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#374151" }}>
                Column
              </th>
              <th style={{ textAlign: "right", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#374151" }}>
                Pass Rate
              </th>
              <th style={{ textAlign: "right", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#374151" }}>
                Passed
              </th>
              <th style={{ textAlign: "right", padding: "0.5rem 0.75rem", fontWeight: 600, color: "#374151" }}>
                Failed
              </th>
            </tr>
          </thead>
          <tbody>
            {result.criterionSummaries.map((s) => {
              const cr = result.totalUnits > 0
                ? ((result.totalUnits - s.totalFailed) / result.totalUnits) * 100
                : 100;
              const crColor = cr >= 95 ? "#166534" : cr >= 80 ? "#b45309" : "#991b1b";
              return (
                <tr key={s.columnName} style={{ borderBottom: "1px solid #e3e8ee" }}>
                  <td style={{ padding: "0.5rem 0.75rem", fontWeight: 500 }}>
                    {s.parameterName}
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", fontFamily: "var(--font-mono)", color: "#6b7280", fontSize: "0.75rem" }}>
                    {s.columnName}
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: crColor }}>
                    {cr.toFixed(1)}%
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "#166534" }}>
                    {result.totalUnits - s.totalFailed}
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontFamily: "var(--font-mono)", color: s.totalFailed > 0 ? "#991b1b" : "#6b7280" }}>
                    {s.totalFailed}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Full verification data table ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: "0.75rem" }}>
          Verification Data
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
            <thead>
              <tr>
                {orderedHeaders.map((header) => {
                  const info = linkedInfo[header];
                  return (
                    <th
                      key={header}
                      style={{
                        textAlign: "left",
                        padding: "0.5rem 0.625rem",
                        fontWeight: 600,
                        fontSize: "0.6875rem",
                        color: "#374151",
                        borderBottom: "2px solid #e3e8ee",
                        whiteSpace: "nowrap",
                        background: "#f9fafb",
                      }}
                    >
                      <div>{header}</div>
                      {info && (
                        <div style={{ fontWeight: 500, color: "#2f6fed", fontFamily: "var(--font-mono)", fontSize: "0.625rem", marginTop: "2px" }}>
                          {formatLimit(info.criteriaType, info.lowerLimit, info.upperLimit, info.unit)}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {result.unitResults.map((unit) => (
                <tr
                  key={unit.rowIndex}
                  style={{
                    borderBottom: "1px solid #e3e8ee",
                    backgroundColor: unit.overallPass ? undefined : "#fff5f5",
                  }}
                >
                  {orderedHeaders.map((header) => {
                    const colIdx = headerIndexMap[header];
                    const rawValue = rows[unit.rowIndex]?.[colIdx] ?? "";
                    const cellResult = unit.cells[header];
                    const isUnitId = header === unitIdHeader;

                    let color = "#374151";
                    let prefix = "";
                    if (cellResult && !isUnitId) {
                      if (cellResult.pass) {
                        color = "#166534";
                        prefix = "\u2713 ";
                      } else {
                        color = "#991b1b";
                        prefix = "\u2717 ";
                      }
                    } else if (!isUnitId) {
                      color = "#9ca3af";
                    }

                    return (
                      <td
                        key={header}
                        style={{
                          padding: "0.375rem 0.625rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6875rem",
                          whiteSpace: "nowrap",
                          color,
                          fontWeight: isUnitId ? 500 : 400,
                        }}
                      >
                        {prefix}{rawValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Insights ── */}
      {insights.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: "0.75rem" }}>
            Insights
          </h2>
          {insights.map((insight, i) => (
            <div
              key={i}
              style={{
                padding: "0.625rem 0.875rem",
                marginBottom: "0.5rem",
                borderRadius: "6px",
                border: "1px solid",
                borderColor:
                  insight.type === "warning" ? "#fde68a" : insight.type === "success" ? "#bbf7d0" : "#bfdbfe",
                backgroundColor:
                  insight.type === "warning" ? "#fffbeb" : insight.type === "success" ? "#f0fdf4" : "#eff6ff",
              }}
            >
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: insight.type === "warning" ? "#92400e" : insight.type === "success" ? "#166534" : "#1e40af" }}>
                {insight.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.125rem" }}>
                {insight.detail}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        borderTop: "1px solid #e3e8ee",
        paddingTop: "1rem",
        marginTop: "2rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "#9ca3af",
      }}>
        Generated by Fairbuild Studio &mdash; fairb.com
      </div>
    </div>
  );
}
