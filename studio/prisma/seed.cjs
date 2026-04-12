const fs = require("node:fs");
const path = require("node:path");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/fairbuild_studio?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SAMPLE_DATA_DIR = path.resolve(
  __dirname,
  "../../docs/research/virtual-world/sample-data"
);
const SAMPLE_ERS_DIR = path.resolve(
  __dirname,
  "../../docs/research/virtual-world/sample-ers"
);

function readCSV(fileName) {
  const raw = fs.readFileSync(path.join(SAMPLE_DATA_DIR, fileName), "utf-8");
  const lines = raw.trim().split("\n");
  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = values[i]?.trim();
    });
    return row;
  });
  return { headers, rows };
}

function readERS(fileName) {
  const raw = fs.readFileSync(path.join(SAMPLE_ERS_DIR, fileName), "utf-8");
  return JSON.parse(raw);
}

/** Map ERS criterion type string to Prisma CriteriaType enum value. */
function mapCriteriaType(type) {
  const mapping = {
    NUMERIC_GTE: "NUMERIC_GTE",
    NUMERIC_LTE: "NUMERIC_LTE",
    NUMERIC_RANGE: "NUMERIC_RANGE",
    NUMERIC_TOLERANCE: "NUMERIC_TOLERANCE",
    CATEGORICAL: "CATEGORICAL",
    IMAGE_CLASS: "IMAGE_CLASS",
    WAVEFORM_MASK: "WAVEFORM_MASK",
    COMPOSITE: "COMPOSITE",
    STATISTICAL: "STATISTICAL",
    CUSTOM: "CUSTOM",
  };
  return mapping[type] || "CUSTOM";
}

/** Classify a CSV column based on its name. */
function classifyColumn(name) {
  const lower = name.toLowerCase();
  if (
    lower.includes("serial") ||
    lower.includes("batch") ||
    lower.includes("heat_no") ||
    lower.includes("plate_id") ||
    lower.includes("tablet_no")
  )
    return "UNIT_ID";
  if (lower.includes("timestamp") || lower.includes("test_date") || lower.includes("date"))
    return "TIMESTAMP";
  if (lower.includes("station") || lower.includes("equipment"))
    return "EQUIPMENT";
  if (lower.includes("operator")) return "OPERATOR";
  if (lower === "result" || lower === "fail_code") return "METADATA";
  // Everything else that looks numeric is a MEASUREMENT
  return "MEASUREMENT";
}

// ---------------------------------------------------------------------------
// Seed one contract
// ---------------------------------------------------------------------------

async function seedContract({
  title,
  oemName,
  oemSlug,
  oemIndustry,
  oemCity,
  factoryName,
  factorySlug,
  factoryProduct,
  factoryCity,
  csvFile,
  ersFile,
}) {
  // --- Companies ---
  const oem = await prisma.company.create({
    data: {
      name: oemName,
      role: "OEM",
      slug: oemSlug,
    },
  });

  const factory = await prisma.company.create({
    data: {
      name: factoryName,
      role: "FACTORY",
      slug: factorySlug,
    },
  });

  // --- Users ---
  await prisma.user.create({
    data: {
      companyId: oem.id,
      email: `admin@${oemSlug}.com`,
      name: `${oemName} Admin`,
      role: "admin",
    },
  });

  await prisma.user.create({
    data: {
      companyId: factory.id,
      email: `admin@${factorySlug}.com`,
      name: `${factoryName} Admin`,
      role: "admin",
    },
  });

  // --- Contract + Parties ---
  const contract = await prisma.contract.create({
    data: {
      title,
      status: "SANDBOX",
      parties: {
        create: [
          { companyId: oem.id, role: "OEM" },
          { companyId: factory.id, role: "FACTORY" },
        ],
      },
    },
  });

  // --- ERS Document ---
  const ers = readERS(ersFile);

  const ersDoc = await prisma.eRSDocument.create({
    data: {
      companyId: oem.id,
      contractId: contract.id,
      title: ers.title,
      storageKey: `uploads/${ersFile}`,
      mimeType: "application/json",
      processingStatus: "COMPLETED",
    },
  });

  // --- Acceptance Criteria (from ERS JSON) ---
  const criteriaMap = {}; // maps_to_column -> criterion record
  for (const c of ers.acceptance_criteria) {
    const criterion = await prisma.acceptanceCriterion.create({
      data: {
        contractId: contract.id,
        parameterName: c.parameter,
        criteriaType: mapCriteriaType(c.type),
        source: "AI_EXTRACTED",
        sourceDocId: ersDoc.id,
        sourceRef: c.section_ref,
        unit: c.unit,
        lowerLimit: c.lower_limit ?? null,
        upperLimit: c.upper_limit ?? null,
        aiConfidence: 0.95,
      },
    });
    if (c.maps_to_column) {
      criteriaMap[c.maps_to_column] = criterion;
    }
  }

  // --- Log Format + Columns (from CSV) ---
  const csv = readCSV(csvFile);

  // Build sample data: first 5 rows
  const sampleRows = csv.rows.slice(0, 5);

  const logFormat = await prisma.logFormat.create({
    data: {
      companyId: factory.id,
      name: `${factoryProduct} test log`,
      fileType: "csv",
      delimiter: ",",
      headerRow: 0,
      sampleData: sampleRows,
    },
  });

  // Create LogMapping
  await prisma.logMapping.create({
    data: {
      contractId: contract.id,
      logFormatId: logFormat.id,
    },
  });

  // Create LogColumn records and ColumnCriteriaLink where ERS maps_to_column matches
  for (let i = 0; i < csv.headers.length; i++) {
    const colName = csv.headers[i].trim();
    const role = classifyColumn(colName);

    const column = await prisma.logColumn.create({
      data: {
        logFormatId: logFormat.id,
        columnIndex: i,
        originalName: colName,
        role,
        aiSuggestion: role,
        aiConfidence: 0.9,
      },
    });

    // If this column maps to a criterion, create the link
    if (criteriaMap[colName]) {
      await prisma.columnCriteriaLink.create({
        data: {
          columnId: column.id,
          criterionId: criteriaMap[colName].id,
          contractId: contract.id,
          aiSuggested: true,
          aiConfidence: 0.92,
        },
      });
    }
  }

  console.log(
    `  Seeded: "${title}" — ${ers.acceptance_criteria.length} criteria, ${csv.headers.length} columns`
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Clearing existing data...");

  // Delete in dependency order
  await prisma.columnCriteriaLink.deleteMany();
  await prisma.logColumn.deleteMany();
  await prisma.logMapping.deleteMany();
  await prisma.logFormat.deleteMany();
  await prisma.unitResult.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.acceptanceCriterion.deleteMany();
  await prisma.eRSChunk.deleteMany();
  await prisma.eRSDocument.deleteMany();
  await prisma.contractParty.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log("Seeding contracts...\n");

  // Contract 1: Camera Module
  await seedContract({
    title: "Camera Module EVT Q2 2026",
    oemName: "Lumenar Technologies",
    oemSlug: "lumenar-technologies",
    oemIndustry: "electronics",
    oemCity: "San Jose",
    factoryName: "ShenzhenVision Optoelectronics",
    factorySlug: "shenzhenvision-optoelectronics",
    factoryProduct: "Camera module",
    factoryCity: "Shenzhen",
    csvFile: "camera_module_mtf_test.csv",
    ersFile: "camera_module_mtf_ers.json",
  });

  // Contract 2: Steel Plate
  await seedContract({
    title: "A36 Steel Plate MTC Q2 2026",
    oemName: "Ironvale Steel & Alloys",
    oemSlug: "ironvale-steel-alloys",
    oemIndustry: "steel",
    oemCity: "Pittsburgh",
    factoryName: "Shanghai Baoding Steel Products",
    factorySlug: "shanghai-baoding-steel",
    factoryProduct: "Steel plate",
    factoryCity: "Shanghai",
    csvFile: "steel_plate_mtc.csv",
    ersFile: "steel_plate_ers.json",
  });

  // Contract 3: Tablet Weight
  await seedContract({
    title: "Ibuprofen 400mg Weight Uniformity Q2 2026",
    oemName: "Pinnacle Pharmaceuticals",
    oemSlug: "pinnacle-pharmaceuticals",
    oemIndustry: "pharma",
    oemCity: "Basel",
    factoryName: "Jiangsu PharmaTech Manufacturing",
    factorySlug: "jiangsu-pharmatech",
    factoryProduct: "Tablet",
    factoryCity: "Hai Phong",
    csvFile: "tablet_weight_uniformity.csv",
    ersFile: "tablet_weight_ers.json",
  });

  console.log("\nDone. 3 contracts seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
