"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseCSV } from "@/lib/csv-parser";
import { analyzeColumns } from "@/lib/log-mapper-agent";
import { ColumnRole } from "@prisma/client";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

/**
 * Handles CSV file upload: parses headers, creates LogFormat + LogColumns,
 * stores file on disk, creates LogMapping, then triggers AI analysis.
 */
export async function uploadCSV(contractId: string, formData: FormData) {
  const file = formData.get("csvFile") as File | null;
  if (!file || file.size === 0) {
    throw new Error("No file provided.");
  }

  // Read the file content
  const text = await file.text();
  const { headers, rows } = parseCSV(text);

  if (headers.length === 0) {
    throw new Error("CSV file has no columns.");
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Save file to disk with a unique name
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storedName = `${timestamp}_${safeName}`;
  const filePath = path.join(UPLOADS_DIR, storedName);
  fs.writeFileSync(filePath, text, "utf-8");

  // Get the factory company for this contract
  const factoryParty = await prisma.contractParty.findFirst({
    where: { contractId, role: "FACTORY" },
  });

  if (!factoryParty) {
    throw new Error("No factory party found on this contract.");
  }

  // Create LogFormat
  const logFormat = await prisma.logFormat.create({
    data: {
      companyId: factoryParty.companyId,
      name: file.name.replace(/\.csv$/i, ""),
      fileType: "csv",
      delimiter: ",",
      headerRow: 0,
      sampleData: rows.slice(0, 5) as unknown as any,
      columns: {
        create: headers.map((header, index) => ({
          columnIndex: index,
          originalName: header,
          displayName: header,
          role: "METADATA" as ColumnRole,
        })),
      },
    },
  });

  // Create LogMapping
  await prisma.logMapping.create({
    data: {
      contractId,
      logFormatId: logFormat.id,
    },
  });

  // Trigger AI analysis in background — don't block the upload response
  analyzeAndUpdateColumns(logFormat.id, headers, rows).catch((err) => {
    console.error("AI column analysis failed:", err);
  });

  revalidatePath(`/${contractId}/data`);
}

/**
 * Runs AI column analysis and updates LogColumn records with suggestions.
 */
async function analyzeAndUpdateColumns(
  logFormatId: string,
  headers: string[],
  rows: string[][]
) {
  const result = await analyzeColumns(headers, rows);

  for (const col of result.columns) {
    await prisma.logColumn.updateMany({
      where: {
        logFormatId,
        columnIndex: col.columnIndex,
      },
      data: {
        aiSuggestion: col.suggestedRole as ColumnRole,
        aiConfidence: col.confidence,
      },
    });
  }
}

/**
 * Confirms a single column's role (either accepting AI suggestion or overriding).
 */
export async function confirmColumnRole(
  columnId: string,
  role: ColumnRole,
  contractId: string
) {
  await prisma.logColumn.update({
    where: { id: columnId },
    data: {
      role,
      confirmedBy: "studio-user",
    },
  });

  revalidatePath(`/${contractId}/data`);
}

/**
 * Confirms all columns, applying AI suggestions where available.
 */
export async function confirmAllColumns(
  logFormatId: string,
  contractId: string
) {
  const columns = await prisma.logColumn.findMany({
    where: { logFormatId },
  });

  for (const col of columns) {
    if (col.aiSuggestion && !col.confirmedBy) {
      await prisma.logColumn.update({
        where: { id: col.id },
        data: {
          role: col.aiSuggestion,
          confirmedBy: "studio-user",
        },
      });
    }
  }

  revalidatePath(`/${contractId}/data`);
}
