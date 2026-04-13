import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCSV } from "@/lib/csv-parser";
import { CSVUpload } from "./csv-upload";
import { ColumnEditor } from "./column-editor";

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  MEASUREMENT: { bg: "bg-blue-50", text: "text-blue-700", label: "Measurement" },
  CONDITION: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Condition" },
  UNIT_ID: { bg: "bg-green-50", text: "text-green-700", label: "Unit ID" },
  TIMESTAMP: { bg: "bg-purple-50", text: "text-purple-700", label: "Timestamp" },
  EQUIPMENT: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Equipment" },
  OPERATOR: { bg: "bg-pink-50", text: "text-pink-700", label: "Operator" },
  METADATA: { bg: "bg-gray-100", text: "text-gray-600", label: "Metadata" },
  IGNORE: { bg: "bg-gray-50", text: "text-gray-400", label: "Ignore" },
};

export default async function DataPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  // Get the log mapping to find the CSV file
  const logMapping = await prisma.logMapping.findFirst({
    where: { contractId },
  });

  // ── No data yet: show upload form ──
  if (!logMapping) {
    return (
      <div>
        <div className="empty-state mb-8">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="empty-state-icon"
          >
            <path
              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 18v-6M9 15l3-3 3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="empty-state-title">Upload a Production Log</div>
          <div className="empty-state-description">
            Upload a CSV file to get started. Each column will be automatically classified as a measurement, identifier, or metadata.
          </div>
        </div>
        <CSVUpload contractId={contractId} />
        <div className="mt-6 text-center">
          <a
            href={`/${contractId}/criteria`}
            className="text-sm text-gray-400 no-underline hover:text-[var(--accent)] transition-colors"
          >
            Skip for now &mdash; define criteria first &rarr;
          </a>
        </div>
      </div>
    );
  }

  // ── Data exists: show column editor + data preview ──
  const logFormat = await prisma.logFormat.findUnique({
    where: { id: logMapping.logFormatId },
    include: {
      columns: {
        orderBy: { columnIndex: "asc" },
      },
      company: true,
    },
  });

  if (!logFormat) {
    notFound();
  }

  // Try reading the uploaded CSV from the uploads directory first,
  // then fall back to the legacy sample-data path
  let csvContent = "";
  let csvFileName = logFormat.name + ".csv";

  const uploadsDir = path.resolve(process.cwd(), "uploads");
  let foundInUploads = false;

  if (fs.existsSync(uploadsDir)) {
    const uploadFiles = fs.readdirSync(uploadsDir).filter((f) => f.endsWith(".csv"));
    // Find the most recent file whose name contains the format name
    const formatNameLower = logFormat.name.toLowerCase();
    for (const f of uploadFiles) {
      if (f.toLowerCase().includes(formatNameLower.replace(/\s+/g, "_").toLowerCase()) || uploadFiles.length === 1) {
        // Read the last matching uploaded file (files are timestamped)
        const fPath = path.join(uploadsDir, f);
        try {
          csvContent = fs.readFileSync(fPath, "utf-8");
          csvFileName = f.replace(/^\d+_/, ""); // strip timestamp prefix
          foundInUploads = true;
        } catch {
          // continue to fallback
        }
      }
    }

    if (!foundInUploads && uploadFiles.length > 0) {
      // Take the latest file by name (timestamp prefix sorts correctly)
      const sorted = [...uploadFiles].sort().reverse();
      const fPath = path.join(uploadsDir, sorted[0]);
      try {
        csvContent = fs.readFileSync(fPath, "utf-8");
        csvFileName = sorted[0].replace(/^\d+_/, "");
        foundInUploads = true;
      } catch {
        // continue to fallback
      }
    }
  }

  // Fallback: read from legacy sample-data directory
  if (!foundInUploads) {
    const sampleDataDir = path.resolve(
      process.cwd(),
      "../docs/research/virtual-world/sample-data"
    );

    try {
      const csvFiles = fs.readdirSync(sampleDataDir).filter((f) => f.endsWith(".csv"));
      const formatNameLower = logFormat.name.toLowerCase();

      let matchedFile = csvFiles[0]; // fallback
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
        csvContent = fs.readFileSync(path.join(sampleDataDir, matchedFile), "utf-8");
        csvFileName = matchedFile;
      }
    } catch {
      // No sample data available
    }
  }

  if (!csvContent) {
    return (
      <div className="empty-state">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="empty-state-icon"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <div className="empty-state-title">CSV File Not Found</div>
        <div className="empty-state-description">
          The uploaded file may have been moved or deleted. Try uploading again.
        </div>
      </div>
    );
  }

  const { headers, rows } = parseCSV(csvContent);

  // Build column role map from database
  const columnRoleMap: Record<string, string> = {};
  for (const col of logFormat.columns) {
    columnRoleMap[col.originalName] = col.role;
  }

  // Check if any columns have AI suggestions (for showing the column editor)
  const hasUnconfirmed = logFormat.columns.some((c) => !c.confirmedBy);

  return (
    <div>
      {/* Column Role Editor */}
      {hasUnconfirmed && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Column Classification
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Review how each column was classified and confirm or change the assignment.
          </p>
          <ColumnEditor
            columns={logFormat.columns.map((c) => ({
              id: c.id,
              columnIndex: c.columnIndex,
              originalName: c.originalName,
              displayName: c.displayName,
              role: c.role,
              aiSuggestion: c.aiSuggestion,
              aiConfidence: c.aiConfidence,
              confirmedBy: c.confirmedBy,
            }))}
            logFormatId={logFormat.id}
            contractId={contractId}
          />
        </div>
      )}

      {/* File info */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm text-gray-600">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 1h5.586L13 4.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          {csvFileName}
        </div>
        <span className="text-sm text-gray-400">
          {rows.length} rows &middot; {headers.length} columns
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="verification-table">
          <thead>
            <tr>
              {headers.map((header) => {
                const role = columnRoleMap[header] ?? "METADATA";
                const style = ROLE_STYLES[role] ?? ROLE_STYLES.METADATA;
                return (
                  <th key={header}>
                    <div className="col-header-name">{header}</div>
                    <div className="mt-1">
                      <span
                        className={`role-badge ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => {
                  const role = columnRoleMap[headers[j]] ?? "METADATA";
                  const isMeasurement = role === "MEASUREMENT";
                  return (
                    <td
                      key={j}
                      className={isMeasurement ? "font-mono" : ""}
                      style={isMeasurement ? { minWidth: "120px" } : undefined}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
