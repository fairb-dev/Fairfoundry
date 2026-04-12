import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCSV } from "@/lib/csv-parser";

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

  if (!logMapping) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center text-gray-500">
        No data file linked to this contract yet.
      </div>
    );
  }

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

  // Read CSV from filesystem
  const sampleDataDir = path.resolve(
    process.cwd(),
    "../docs/research/virtual-world/sample-data"
  );

  // Find the CSV file matching the log format name
  const csvFiles = fs.readdirSync(sampleDataDir).filter((f) => f.endsWith(".csv"));

  // Match based on format name or company
  let csvFileName = csvFiles[0]; // fallback
  const formatNameLower = logFormat.name.toLowerCase();

  for (const f of csvFiles) {
    const fLower = f.toLowerCase();
    if (formatNameLower.includes("camera") && fLower.includes("camera")) {
      csvFileName = f;
      break;
    }
    if (formatNameLower.includes("steel") && fLower.includes("steel")) {
      csvFileName = f;
      break;
    }
    if (formatNameLower.includes("tablet") && fLower.includes("tablet")) {
      csvFileName = f;
      break;
    }
  }

  const csvPath = path.join(sampleDataDir, csvFileName);
  let csvContent = "";
  try {
    csvContent = fs.readFileSync(csvPath, "utf-8");
  } catch {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center text-gray-500">
        CSV file not found at expected path.
      </div>
    );
  }

  const { headers, rows } = parseCSV(csvContent);

  // Build column role map from database
  const columnRoleMap: Record<string, string> = {};
  for (const col of logFormat.columns) {
    columnRoleMap[col.originalName] = col.role;
  }

  return (
    <div>
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
