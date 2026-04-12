# Fairbuild Contract Builder Studio — Architecture Design

## Reference: OpenClaw Patterns

The OpenClaw scaffold (`/mnt/studio/sprint/litter-app/openclaw`) provides reusable architectural patterns:

| OpenClaw Pattern | Fairbuild Studio Equivalent |
|---|---|
| Organization | OEM or Factory company |
| Document (SOC2 report) | ERS specification document |
| DocumentChunk (with embeddings) | Extracted acceptance criteria (with semantic search) |
| Questionnaire | Service contract / qualification project |
| Question | Acceptance criterion (e.g., "MTF at center ≥ 0.35") |
| Answer (AI-generated, human-reviewed) | Measurement mapping (AI-suggested, user-confirmed) |
| CanonicalQuestion | Canonical test parameter (from universal schema) |
| Account (human/agent) | OEM user / Factory user / AI agent |
| ProcessingStatus (PENDING→COMPLETED) | Contract status (DRAFT→SANDBOX→PRODUCTION) |

## Tech Stack (from OpenClaw)

- **Next.js 16** App Router
- **Prisma** + PostgreSQL
- **Vercel AI SDK** + Google Gemini for embeddings and extraction
- **Zod** for schema validation
- Server actions for mutations
- File upload handling

---

## Data Model

### Core Entities

```prisma
enum CompanyRole {
  OEM
  FACTORY
  BOTH
}

enum ContractStatus {
  DRAFT          // One side is configuring
  REVIEW         // Both sides reviewing
  SANDBOX        // Both agreed, testing with sample data
  PRODUCTION     // Live, real settlements
  PAUSED         // Temporarily suspended
  CLOSED         // Completed or terminated
}

enum ColumnRole {
  UNIT_ID        // Serial number, part identifier
  TIMESTAMP      // When the test was performed
  MEASUREMENT    // A value to check against criteria
  CONDITION      // Test condition (temperature, humidity)
  EQUIPMENT      // Test station, fixture ID
  OPERATOR       // Who performed the test
  METADATA       // Other information
  IGNORE         // Not used for qualification
}

enum CriteriaType {
  NUMERIC_GTE    // Greater than or equal (≥ lower limit)
  NUMERIC_LTE    // Less than or equal (≤ upper limit)
  NUMERIC_RANGE  // Within range (lower ≤ x ≤ upper)
  NUMERIC_TOLERANCE // Nominal ± tolerance
  CATEGORICAL    // Must match accepted values
  IMAGE_CLASS    // AI classification with confidence threshold
  WAVEFORM_MASK  // Signal within envelope
  COMPOSITE      // Weighted multi-parameter score
  STATISTICAL    // Cpk, AQL, sample-based
  CUSTOM         // User-defined expression
}

enum CriteriaSource {
  MANUAL         // User typed it directly
  AI_EXTRACTED   // Extracted from ERS by AI agent
  TEMPLATE       // From Fairbuild template library
}

model Company {
  id          String      @id @default(cuid())
  name        String
  role        CompanyRole
  slug        String      @unique
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  users       User[]
  contracts   ContractParty[]
  documents   ERSDocument[]
  logFormats  LogFormat[]
}

model User {
  id          String   @id @default(cuid())
  companyId   String
  email       String   @unique
  name        String
  role        String   // admin, engineer, quality, viewer
  createdAt   DateTime @default(now())
  company     Company  @relation(fields: [companyId], references: [id])
}
```

### Contract and Parties

```prisma
model Contract {
  id          String          @id @default(cuid())
  title       String          // "Camera Module EVT Q2 2026"
  status      ContractStatus  @default(DRAFT)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  lockedAt    DateTime?       // When both parties agreed
  parties     ContractParty[]
  criteria    AcceptanceCriterion[]
  logMappings LogMapping[]
  submissions Submission[]
  settlements Settlement[]
}

model ContractParty {
  contractId String
  companyId  String
  role       CompanyRole    // OEM or FACTORY for this contract
  agreedAt   DateTime?      // When this party approved
  contract   Contract       @relation(fields: [contractId], references: [id])
  company    Company        @relation(fields: [companyId], references: [id])

  @@id([contractId, companyId])
}
```

### ERS Documents (like OpenClaw's Document model)

```prisma
model ERSDocument {
  id               String           @id @default(cuid())
  companyId        String
  contractId       String?
  title            String           // "Camera_Module_ERS_v2.3.pdf"
  storageKey       String           // File path or S3 key
  mimeType         String           // application/pdf, text/plain, image/png
  processingStatus ProcessingStatus @default(PENDING)
  processingError  String?
  createdAt        DateTime         @default(now())
  company          Company          @relation(fields: [companyId], references: [id])
  chunks           ERSChunk[]
  extractedCriteria AcceptanceCriterion[] @relation("CriteriaSource")
}

model ERSChunk {
  id          String      @id @default(cuid())
  documentId  String
  content     String      // Text content of this chunk
  embedding   Json?       // Vector embedding for semantic search
  pageNumber  Int?        // Source page in the document
  sectionRef  String?     // "Section 3.2.1" — extracted section reference
  createdAt   DateTime    @default(now())
  document    ERSDocument @relation(fields: [documentId], references: [id])
}
```

### Acceptance Criteria (like OpenClaw's Question model)

```prisma
model AcceptanceCriterion {
  id              String         @id @default(cuid())
  contractId      String
  parameterName   String         // "MTF at center field"
  criteriaType    CriteriaType
  source          CriteriaSource
  sourceDocId     String?        // Which ERS document this came from
  sourceRef       String?        // "Section 3.2.1, page 4"
  unit            String?        // "cy/px", "°C", "MPa"
  nominal         Float?
  lowerLimit      Float?
  upperLimit      Float?
  tolerancePlus   Float?
  toleranceMinus  Float?
  acceptedValues  Json?          // For categorical: ["PASS", "GO"]
  expression      String?        // For custom: "0.4*mtf_center + 0.3*sfr_h + 0.3*sfr_v >= 0.35"
  conditionRules  Json?          // e.g., {"temp_c": {"min": 23, "max": 27}}
  aiConfidence    Float?         // How confident the AI was in extraction
  confirmedBy     String?        // User who confirmed this criterion
  confirmedAt     DateTime?
  createdAt       DateTime       @default(now())
  contract        Contract       @relation(fields: [contractId], references: [id])
  sourceDoc       ERSDocument?   @relation("CriteriaSource", fields: [sourceDocId], references: [id])
  columnLinks     ColumnCriteriaLink[]
}
```

### Production Log Format and Mapping

```prisma
model LogFormat {
  id          String       @id @default(cuid())
  companyId   String
  name        String       // "STN-04 CSV output"
  fileType    String       // csv, json, xml
  delimiter   String?      // "," or "\t" for CSV
  headerRow   Int?         // Which row has column names (0-indexed)
  sampleData  Json?        // First 10 rows for preview
  createdAt   DateTime     @default(now())
  company     Company      @relation(fields: [companyId], references: [id])
  columns     LogColumn[]
}

model LogColumn {
  id            String         @id @default(cuid())
  logFormatId   String
  columnIndex   Int            // Position in the file (0-indexed)
  originalName  String         // Raw column header from the file
  displayName   String?        // User-assigned name
  role          ColumnRole
  aiSuggestion  ColumnRole?    // What the AI suggested
  aiConfidence  Float?
  confirmedBy   String?        // User who confirmed the role
  createdAt     DateTime       @default(now())
  logFormat     LogFormat      @relation(fields: [logFormatId], references: [id])
  criteriaLinks ColumnCriteriaLink[]
}
```

### The Hypertext Link (Column ↔ Criterion)

```prisma
model ColumnCriteriaLink {
  id            String              @id @default(cuid())
  columnId      String
  criterionId   String
  contractId    String
  unitConversion String?            // e.g., "cy/px to lp/mm: multiply by 2"
  aiSuggested   Boolean @default(false)
  aiConfidence  Float?
  confirmedBy   String?
  confirmedAt   DateTime?
  createdAt     DateTime            @default(now())
  column        LogColumn           @relation(fields: [columnId], references: [id])
  criterion     AcceptanceCriterion @relation(fields: [criterionId], references: [id])

  @@unique([columnId, criterionId])
}

model LogMapping {
  id          String   @id @default(cuid())
  contractId  String
  logFormatId String
  createdAt   DateTime @default(now())
  contract    Contract @relation(fields: [contractId], references: [id])
}
```

### Submissions and Results (production mode)

```prisma
model Submission {
  id            String    @id @default(cuid())
  contractId    String
  storageKey    String    // Uploaded production log file
  fileName      String
  unitsTotal    Int
  unitsPassed   Int
  unitsFailed   Int
  submittedAt   DateTime  @default(now())
  verifiedAt    DateTime?
  reviewDeadline DateTime? // submittedAt + 72 hours
  status        String    // VERIFYING, VERIFIED, OBJECTED, SETTLED
  contract      Contract  @relation(fields: [contractId], references: [id])
  results       UnitResult[]
  settlement    Settlement?
}

model UnitResult {
  id           String     @id @default(cuid())
  submissionId String
  unitId       String     // Serial number from the log
  overallPass  Boolean
  resultsJson  Json       // Per-criterion pass/fail with values
  submission   Submission @relation(fields: [submissionId], references: [id])
}

model Settlement {
  id            String     @id @default(cuid())
  submissionId  String     @unique
  contractId    String
  amount        Float      // Settlement amount
  fairbuildFee  Float      // 0.25% per side
  settledAt     DateTime?
  status        String     // PENDING, RELEASED, DISPUTED
  submission    Submission @relation(fields: [submissionId], references: [id])
  contract      Contract   @relation(fields: [contractId], references: [id])
}
```

---

## Page Structure

```
/                           → Landing / marketing (fairb.com)
/studio                     → Dashboard (list contracts)
/studio/new                 → Create new contract
/studio/[contractId]        → Contract overview
/studio/[contractId]/ers    → Upload and review ERS documents
/studio/[contractId]/log    → Upload sample production log
/studio/[contractId]/link   → Hypertext view: link columns to criteria
/studio/[contractId]/sandbox → Run sample data against criteria
/studio/[contractId]/review → Both parties review and approve
/studio/[contractId]/production → Live submissions and settlements
/studio/[contractId]/history → Past submissions and results
```

---

## AI Agent Integration

### ERS Parser Agent (reuses OpenClaw's document-processor pattern)

```typescript
// Like OpenClaw's processDocument + answer-generator
async function parseERS(documentId: string) {
  // 1. Read uploaded file (PDF, Word, image)
  // 2. Chunk text (reuse OpenClaw's chunkText)
  // 3. Embed chunks (reuse OpenClaw's embedMany)
  // 4. Extract criteria via Gemini:
  //    "Extract all acceptance criteria from this ERS section.
  //     For each: parameter name, criteria type, limits, units,
  //     test conditions, section reference."
  // 5. Save as AcceptanceCriterion records with source=AI_EXTRACTED
  // 6. Mark aiConfidence per criterion
}
```

### Log Mapper Agent

```typescript
async function analyzeLogFormat(fileContent: string, fileType: string) {
  // 1. Parse the file (CSV/JSON/XML)
  // 2. Extract column names and sample values
  // 3. Ask Gemini to classify each column:
  //    "Given these column names and sample values, classify each as:
  //     UNIT_ID, TIMESTAMP, MEASUREMENT, CONDITION, EQUIPMENT, OPERATOR,
  //     METADATA, or IGNORE. For MEASUREMENT columns, suggest what
  //     parameter this might be measuring."
  // 4. Save as LogColumn records with aiSuggestion and aiConfidence
}
```

### Match Agent

```typescript
async function suggestLinks(contractId: string, logFormatId: string) {
  // 1. Load all AcceptanceCriteria for the contract
  // 2. Load all LogColumns for the log format (MEASUREMENT role only)
  // 3. Use embeddings to find semantic similarity:
  //    criterion "MTF at center field" ↔ column "mtf_center"
  // 4. Also check unit compatibility
  // 5. Save as ColumnCriteriaLink with aiSuggested=true, aiConfidence
}
```

---

## Sandbox → Production Transition

```
DRAFT
  ↓ OEM uploads ERS → AI extracts criteria → OEM reviews
  ↓ Factory uploads sample log → AI maps columns → Factory reviews
  ↓ Match agent suggests links → Both sides review

REVIEW
  ↓ Both parties review the hypertext view
  ↓ OEM clicks "Approve" → agreedAt set
  ↓ Factory clicks "Approve" → agreedAt set

SANDBOX (both agreed)
  ↓ Factory uploads sample production data
  ↓ Platform verifies against criteria
  ↓ Both sides see pass/fail results
  ↓ Iterate criteria/mappings if needed
  ↓ When satisfied: "Go Live"

PRODUCTION
  ↓ Same format, real submissions
  ↓ Automatic verification
  ↓ 72-hour review window
  ↓ Settlement at 0.25% per side
  ↓ Quality credentials issued on settlement
```

---

## Design Principles (from OpenClaw)

1. **Server actions for all mutations** — no client-side API calls for data changes
2. **Prisma for all data access** — type-safe, migration-tracked
3. **AI generates, human confirms** — every AI suggestion requires explicit user confirmation
4. **Processing status tracking** — every async operation has PENDING → PROCESSING → COMPLETED/FAILED states
5. **Document chunking + embedding** — reuse OpenClaw's proven pattern for ERS parsing
6. **Organization-scoped data** — companies only see their own contracts and data
7. **Progressive enhancement** — works without JavaScript for core data display
