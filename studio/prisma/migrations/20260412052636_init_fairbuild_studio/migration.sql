-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('OEM', 'FACTORY', 'BOTH');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'REVIEW', 'SANDBOX', 'PRODUCTION', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ColumnRole" AS ENUM ('UNIT_ID', 'TIMESTAMP', 'MEASUREMENT', 'CONDITION', 'EQUIPMENT', 'OPERATOR', 'METADATA', 'IGNORE');

-- CreateEnum
CREATE TYPE "CriteriaType" AS ENUM ('NUMERIC_GTE', 'NUMERIC_LTE', 'NUMERIC_RANGE', 'NUMERIC_TOLERANCE', 'CATEGORICAL', 'IMAGE_CLASS', 'WAVEFORM_MASK', 'COMPOSITE', 'STATISTICAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CriteriaSource" AS ENUM ('MANUAL', 'AI_EXTRACTED', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lockedAt" TIMESTAMP(3),

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractParty" (
    "contractId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL,
    "agreedAt" TIMESTAMP(3),

    CONSTRAINT "ContractParty_pkey" PRIMARY KEY ("contractId","companyId")
);

-- CreateTable
CREATE TABLE "ERSDocument" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contractId" TEXT,
    "title" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ERSDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ERSChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" JSONB,
    "pageNumber" INTEGER,
    "sectionRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ERSChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcceptanceCriterion" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "parameterName" TEXT NOT NULL,
    "criteriaType" "CriteriaType" NOT NULL,
    "source" "CriteriaSource" NOT NULL,
    "sourceDocId" TEXT,
    "sourceRef" TEXT,
    "unit" TEXT,
    "nominal" DOUBLE PRECISION,
    "lowerLimit" DOUBLE PRECISION,
    "upperLimit" DOUBLE PRECISION,
    "tolerancePlus" DOUBLE PRECISION,
    "toleranceMinus" DOUBLE PRECISION,
    "acceptedValues" JSONB,
    "expression" TEXT,
    "conditionRules" JSONB,
    "aiConfidence" DOUBLE PRECISION,
    "confirmedBy" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcceptanceCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogFormat" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "delimiter" TEXT,
    "headerRow" INTEGER,
    "sampleData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogColumn" (
    "id" TEXT NOT NULL,
    "logFormatId" TEXT NOT NULL,
    "columnIndex" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "displayName" TEXT,
    "role" "ColumnRole" NOT NULL,
    "aiSuggestion" "ColumnRole",
    "aiConfidence" DOUBLE PRECISION,
    "confirmedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColumnCriteriaLink" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "criterionId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "unitConversion" TEXT,
    "aiSuggested" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DOUBLE PRECISION,
    "confirmedBy" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ColumnCriteriaLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogMapping" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "logFormatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "unitsTotal" INTEGER NOT NULL,
    "unitsPassed" INTEGER NOT NULL,
    "unitsFailed" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "reviewDeadline" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitResult" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "overallPass" BOOLEAN NOT NULL,
    "resultsJson" JSONB NOT NULL,

    CONSTRAINT "UnitResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fairbuildFee" DOUBLE PRECISION NOT NULL,
    "settledAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ColumnCriteriaLink_columnId_criterionId_key" ON "ColumnCriteriaLink"("columnId", "criterionId");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_submissionId_key" ON "Settlement"("submissionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractParty" ADD CONSTRAINT "ContractParty_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractParty" ADD CONSTRAINT "ContractParty_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERSDocument" ADD CONSTRAINT "ERSDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERSChunk" ADD CONSTRAINT "ERSChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ERSDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptanceCriterion" ADD CONSTRAINT "AcceptanceCriterion_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptanceCriterion" ADD CONSTRAINT "AcceptanceCriterion_sourceDocId_fkey" FOREIGN KEY ("sourceDocId") REFERENCES "ERSDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogFormat" ADD CONSTRAINT "LogFormat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogColumn" ADD CONSTRAINT "LogColumn_logFormatId_fkey" FOREIGN KEY ("logFormatId") REFERENCES "LogFormat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnCriteriaLink" ADD CONSTRAINT "ColumnCriteriaLink_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "LogColumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnCriteriaLink" ADD CONSTRAINT "ColumnCriteriaLink_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "AcceptanceCriterion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogMapping" ADD CONSTRAINT "LogMapping_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitResult" ADD CONSTRAINT "UnitResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
