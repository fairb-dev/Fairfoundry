# Buyer-Factory Document Taxonomy: Complete Document Flow in Manufacturing Relationships

**Research Date:** April 2026
**Scope:** Every document type that flows between a buyer (OEM/customer) and a factory (manufacturer/supplier) across the full lifecycle of their business relationship, with real templates, sample data, and Fairbuild replacement assessment.

---

## Table of Contents

1. [Pre-Contract Phase](#1-pre-contract-phase)
2. [Contract Phase](#2-contract-phase)
3. [Production Phase](#3-production-phase)
4. [Quality Phase](#4-quality-phase)
5. [Delivery Phase](#5-delivery-phase)
6. [Post-Delivery Phase](#6-post-delivery-phase)
7. [Ongoing Relationship](#7-ongoing-relationship)
8. [Fairbuild Replacement Assessment Summary](#8-fairbuild-replacement-assessment-summary)
9. [Real Production Data Formats in the Wild](#9-real-production-data-formats-in-the-wild)
10. [Sources and References](#10-sources-and-references)

---

## 1. Pre-Contract Phase

### 1.1 Request for Quotation (RFQ)

**Purpose:** Buyer solicits pricing and lead time from potential factories for a defined scope of manufactured goods or services.

**Who Creates:** Buyer (OEM)
**Who Receives:** Factory (Supplier)
**Typical Format:** Excel, Word, PDF, or procurement platform form
**EDI Equivalent:** EDI 840 (Request for Quotation)

**Key Fields:**

| Field | Data Type | Example Value |
|-------|-----------|---------------|
| RFQ Number | String | RFQ-2026-0847 |
| RFQ Date | Date | 2026-04-10 |
| Response Deadline | Date | 2026-04-24 |
| Buyer Company Name | String | Acme Electronics Inc. |
| Buyer Contact | String | Sarah Chen, Sr. Procurement Manager |
| Buyer Address | String | 1200 Technology Dr, San Jose, CA 95134 |
| Product Description | Text | 13MP Camera Module Assembly, 1/3.06" sensor |
| Part Number | String | ACM-CAM-13MP-R3 |
| Drawing/Spec Reference | String | DWG-2026-0412 Rev C |
| Quantity (Annual Volume) | Integer | 500,000 units/year |
| Quantity (Initial Order) | Integer | 5,000 units (EVT) |
| Target Unit Price | Currency | $4.25 USD |
| Required Certifications | List | ISO 9001, ISO 14001, IATF 16949 |
| Delivery Incoterms | String | FOB Shenzhen |
| Target Lead Time | String | 6 weeks ARO |
| Material Requirements | Text | RoHS compliant, halogen-free PCB |
| Quality Requirements | Text | AQL 0.65 Major, 2.5 Minor; Cpk >= 1.33 |
| Packaging Requirements | Text | ESD bags, moisture barrier per J-STD-033 |
| NDA Required | Boolean | Yes |
| Response Format Required | String | Use attached pricing template (Excel) |

**Manufacturing-Specific RFQ Fields (EMS/Contract Manufacturing):**

| Field | Example |
|-------|---------|
| Product Width/Length/Height | 8.5mm x 8.5mm x 5.2mm |
| Weight per Unit | 1.8g |
| Material Specifications | Sony IMX258 sensor, 6P lens, VCM actuator |
| Surface Mount Components Count | 47 SMT, 3 through-hole |
| Test Requirements | Focus calibration, OTP programming, MTF test |
| Tooling/NRE Costs (requested) | Separate line items |
| Prototype Quantity | 50 pcs (2 weeks) |
| Production Ramp Schedule | EVT 5K -> DVT 10K -> PVT 50K -> MP 500K/yr |

**Real Template Sources:**
- [Smartsheet RFQ Templates](https://www.smartsheet.com/content/request-for-quote-rfq-templates) -- Word, Excel, Google Sheets
- [VentureOutsource EMS RFQ Template](https://ventureoutsource.com/contract-manufacturing/rfq-template-ems-manufacturers-prepare-oem-quote) -- Electronics-specific
- [Asana RFQ Template](https://asana.com/resources/rfq-template) -- Project-integrated
- [Importivity Manufacturing RFQ](https://importivity.com/resources/rfq-template/) -- Import/sourcing focused
- [SiftHub RFQ Document Guide](https://www.sifthub.io/blog/rfq-document) -- Key sections and format

**Fairbuild Replacement:** PARTIAL
- The hypertext contract captures the technical specifications, acceptance criteria, and pricing that would appear in the RFQ response.
- The solicitation/bidding process itself (sending RFQs to multiple suppliers, collecting responses, comparing quotes) is outside Fairbuild's scope.
- Fairbuild could interface by importing the winning RFQ response into a contract draft.

---

### 1.2 Request for Proposal (RFP)

**Purpose:** More comprehensive than RFQ; used when the buyer needs the factory to propose a solution, not just price a defined part. Common for new product introductions, complex assemblies, or manufacturing process development.

**Who Creates:** Buyer (OEM)
**Who Receives:** Factory (Supplier candidates)
**Typical Format:** Word/PDF document, 10-50 pages
**EDI Equivalent:** None standard

**Key Sections:**

| Section | Content |
|---------|---------|
| Executive Summary | Project overview, business context, timeline |
| Company Background | Buyer description, products, market |
| Scope of Work | What the factory will be responsible for |
| Technical Requirements | Specifications, drawings, material requirements |
| Quality Requirements | Certifications, Cpk targets, defect rate limits |
| Delivery Requirements | Volumes, ramp schedule, Incoterms |
| Proposal Format | Required response structure |
| Evaluation Criteria | Weighting (e.g., 30% price, 25% quality, 20% capability, 15% delivery, 10% innovation) |
| Timeline | RFP issue date, Q&A deadline, proposal due date, decision date |
| Terms and Conditions | Boilerplate legal terms, NDA reference |
| Appendices | Drawings, specs, sample data files |

**Sample Evaluation Criteria Weighting:**

```
Price/Cost:           30% (unit price, tooling, NRE, landed cost)
Quality Capability:   25% (certifications, Cpk history, defect PPM)
Technical Capability: 20% (equipment list, process expertise, DFM feedback)
Delivery/Lead Time:   15% (capacity, ramp capability, geographic proximity)
Innovation/Value-Add: 10% (DFM suggestions, cost reduction ideas, technology roadmap)
```

**Real Template Sources:**
- [ClickUp Manufacturers RFP Template](https://clickup.com/templates/rfp/manufacturers)
- [E-BI Contract Manufacturer RFP Template](https://e-bi.com/free-rfp-template-for-choosing-a-contract-manufacturer/)
- [VentureOutsource OEM RFP Best Practices](https://ventureoutsource.com/contract-manufacturing/oem-rfp-best-practices-contract-electronic-manufacturing/)

**Fairbuild Replacement:** NO
- RFPs are pre-relationship documents. Fairbuild enters the picture after the supplier is selected.
- Fairbuild could provide a "supplier capability profile" (based on SVT history and quality credentials) that helps inform RFP evaluation.

---

### 1.3 Supplier Qualification Questionnaire

**Purpose:** Structured assessment of a factory's capabilities, systems, and capacity before awarding business.

**Who Creates:** Buyer (OEM procurement/quality team)
**Who Receives/Completes:** Factory (Supplier)
**Typical Format:** Excel, Word, or online form (50-200 questions)

**Key Sections and Sample Questions:**

| Section | Sample Questions |
|---------|-----------------|
| **Company Information** | Legal name, address, year established, ownership structure, annual revenue, number of employees |
| **Quality Management System** | ISO 9001 certified? Certificate number? Audit date? QMS manual available? |
| **Manufacturing Capabilities** | Equipment list? Production capacity (units/month)? Clean room class? SMT lines? |
| **Process Controls** | SPC implemented? Control plans for critical processes? Cpk targets? |
| **Measurement Systems** | MSA/GR&R studies performed? Calibration program? Lab certifications (ISO 17025)? |
| **Material Management** | Approved supplier list? Incoming inspection process? FIFO/lot traceability? |
| **Environmental/Safety** | ISO 14001? OHSAS 18001? RoHS/REACH compliance? Conflict minerals policy? |
| **Business Continuity** | BCP documented? Backup manufacturing site? Insurance coverage? |
| **Financial Stability** | Dun & Bradstreet rating? Bank references? Audited financials available? |
| **References** | Three current OEM customers with contact details |
| **IT Systems** | ERP system? MES? CAD/CAM? EDI capability? Data backup/security? |
| **Workforce** | Engineer count? Quality staff count? Training program? Turnover rate? |

**Sample Data Values:**

```
Company: Precision Optics Manufacturing Co., Ltd.
Founded: 2008
Employees: 1,200 (850 production, 120 engineering, 80 quality)
Annual Revenue: $180M USD
ISO 9001: Yes, Certificate CN-2024-08812, expires 2027-03-15
ISO 14001: Yes
IATF 16949: In progress (target Q3 2026)
Production Capacity: 2.5M camera modules/month
Clean Room: Class 10,000 (ISO 7), 2,400 sq meters
SMT Lines: 8 Fuji NXT III lines
Cpk Target: >= 1.67 for critical, >= 1.33 for major
GR&R: Performed quarterly, <10% for all critical gages
ERP: SAP S/4HANA
MES: Aegis FactoryLogix
```

**Real Template Sources:**
- [ABB Supplier Qualification Questionnaire](https://library.e.abb.com/public/f4e59b6901b6947bc1257b130057d8d9/9AKK102951%20ABB%20Supplier%20Qualification%20Questionnaire.xls) -- Excel download
- [Creation Technologies Supplier Questionnaire](https://www.creationtech.com/wp-content/uploads/2020/09/C-0002603-Supplier-Questionaire.pdf) -- PDF
- [PCC Aerostructures Supplier Quality System Questionnaire](https://www.pccaero.com/quality/aqs1001.docx) -- Word download
- [Procurement Tactics Supplier Questionnaire](https://procurementtactics.com/wp-content/uploads/2023/09/PT-Supplier-Questionnaire.pdf) -- PDF

**Fairbuild Replacement:** PARTIAL
- On-chain SVT credentials and quality history could replace many questions (quality track record, certifications, capability evidence).
- The administrative/financial sections (insurance, bank references, ownership) remain outside the platform.
- Fairbuild could generate a "supplier passport" from accumulated on-chain data.

---

### 1.4 Non-Disclosure Agreement (NDA)

**Purpose:** Protects proprietary information (designs, specifications, pricing, processes) shared between buyer and factory during evaluation and partnership.

**Who Creates:** Buyer (typically); can be mutual
**Who Receives/Signs:** Both parties
**Typical Format:** Word/PDF, 3-8 pages
**Legal Standing:** Binding contract

**Key Terms:**

| Clause | Description | Typical Value |
|--------|-------------|---------------|
| Definition of Confidential Information | What is protected | Designs, specifications, pricing, processes, customer lists, business plans |
| Exclusions | What is NOT confidential | Publicly known, independently developed, received from third party |
| Obligations | How information must be handled | Restrict access to need-to-know employees, no reverse engineering |
| Term | How long the NDA lasts | 2-5 years from disclosure date |
| Survival | How long obligations persist after termination | 2-3 years after expiry |
| Return/Destruction | What happens to materials when NDA ends | Return or certify destruction within 30 days |
| Permitted Disclosures | Exceptions | Court order, regulatory requirement (with notice) |
| Remedies | What happens on breach | Injunctive relief, monetary damages |
| Governing Law | Jurisdiction | State of California / Laws of Hong Kong SAR |

**Sample NDA Preamble:**

```
This Non-Disclosure Agreement ("Agreement") is entered into as of April 10, 2026
("Effective Date") by and between:

DISCLOSING PARTY: Acme Electronics Inc., a Delaware corporation
("Buyer")

RECEIVING PARTY: Precision Optics Manufacturing Co., Ltd., a company
organized under the laws of the People's Republic of China ("Supplier")

WHEREAS, the parties wish to explore a potential business relationship
involving the manufacture of camera module assemblies, and in connection
therewith, Buyer may disclose certain confidential and proprietary
information to Supplier...
```

**Real Template Sources:**
- [Sanmina Supplier NDA Form](https://www.sanmina.com/wp-content/uploads/2016/04/nda.pdf) -- Real manufacturer NDA
- [Emerson/TopWorx Supplier NDA](https://www.emerson.com/documents/automation/topworx-nda-supplier-en-4982184.pdf) -- Industrial OEM
- [LEADRP Manufacturing NDA Template](https://leadrp.net/non-disclosure-agreement-template/) -- Prototyping/manufacturing
- [Ignitec Product Development NDA](https://www.ignitec.com/insights/free-non-disclosure-agreement-template-to-keep-your-next-product-idea-safe/)

**Fairbuild Replacement:** NO
- NDAs are legal documents that must be enforceable in courts of law. Smart contracts cannot replace this function.
- Fairbuild contracts could reference NDA terms (e.g., "NDA executed on [date], ref [document hash]") for auditability.
- An NDA hash could be committed on-chain as proof of existence/timing.

---

### 1.5 Capability Assessment / Factory Audit Checklist

**Purpose:** On-site evaluation of a factory's manufacturing capability, quality systems, and operational readiness before awarding a contract.

**Who Creates:** Buyer (OEM quality/SQE team) or third-party auditor
**Who Receives:** Factory (subject of audit)
**Typical Format:** Checklist (PDF/Excel), 50-200 items, scored
**Standards Referenced:** ISO 9001:2015, IATF 16949, ISO 13485 (medical), AS9100 (aerospace)

**Key Audit Sections (ISO 9001:2015 Clause Structure):**

| Clause | Section | Items | Weight |
|--------|---------|-------|--------|
| 4 | Context of the Organization | 8 | 5% |
| 5 | Leadership | 10 | 10% |
| 6 | Planning | 12 | 10% |
| 7 | Support (Resources, Competence, Infrastructure) | 25 | 15% |
| 8 | Operation (Production, Quality Control) | 45 | 35% |
| 9 | Performance Evaluation (Monitoring, Internal Audit) | 15 | 15% |
| 10 | Improvement (NC, CAPA, Continual Improvement) | 10 | 10% |

**Scoring System (typical):**

```
5 = Fully conforming, evidence-based, best practice
4 = Conforming with minor observations
3 = Partially conforming, improvement needed
2 = Major non-conformance, corrective action required
1 = Critical non-conformance, immediate risk
0 = Not implemented / not applicable
N/A = Not assessed

Pass threshold: Average score >= 3.5, no individual score of 1
```

**Sample Checklist Items (Clause 8 - Operation):**

```
8.1  Does the factory have documented production procedures? [Score: ___]
8.2  Are work instructions available at each workstation? [Score: ___]
8.3  Is SPC implemented on critical process parameters? [Score: ___]
8.4  Are control plans in place for all production lines? [Score: ___]
8.5  Is incoming material inspection performed per written procedure? [Score: ___]
8.6  Are measurement instruments calibrated with valid certificates? [Score: ___]
8.7  Is product traceability maintained from raw material to finished goods? [Score: ___]
8.8  Are non-conforming products segregated and controlled? [Score: ___]
8.9  Is FIFO (First In First Out) observed in material handling? [Score: ___]
8.10 Are ESD controls in place and verified? [Score: ___]
```

**Real Template Sources:**
- [GoAudits Factory Audit Checklists](https://goaudits.com/library/manufacturing/) -- Digital checklists
- [SafetyCulture Factory Audit Checklists](https://safetyculture.com/checklists/factory-audit/) -- Free PDF templates
- [SimpleQuE ISO 9001 Manufacturing Audit Checklist](https://www.simpleque.com/downloads-checklists/free-iso-9001-sample-manufacturing-process-audit-checklist/)
- [eAuditor ISO 9001:2015 Supplier Audit Checklist](https://eauditor.app/2024/10/18/iso-90012015-supplier-audit/)
- [Advisera ISO 9001 Internal Audit Checklist for Manufacturing](https://info.advisera.com/9001academy/free-download/iso-9001-internal-audit-checklist-for-manufacturing-companies)

**Fairbuild Replacement:** PARTIAL
- SVT credentials and on-chain quality history could reduce the need for capability audits (proven track record replaces "trust but verify").
- Physical facility audits (clean room verification, equipment inspection, ESD controls) require on-site presence and cannot be replaced by a platform.
- Fairbuild could maintain a "digital audit trail" that supplements physical audits.

---

## 2. Contract Phase

### 2.1 Master Service Agreement (MSA)

**Purpose:** Umbrella contract governing the overall buyer-factory relationship. Individual purchase orders and SOWs reference the MSA for terms.

**Who Creates:** Buyer (OEM legal team), negotiated with Factory
**Who Signs:** Both parties (authorized signatories)
**Typical Format:** Word/PDF, 15-40 pages
**Legal Standing:** Binding contract, typically 2-5 year term

**Key Clauses:**

| Clause | Description | Sample Language |
|--------|-------------|-----------------|
| **Scope of Services** | What the factory will manufacture | "Supplier shall manufacture Products as specified in each Purchase Order issued under this Agreement" |
| **Term and Renewal** | Duration | "Initial term of 3 years, auto-renewing for successive 1-year periods unless terminated with 90 days' notice" |
| **Pricing and Payment** | Commercial terms | "Prices as set forth in Exhibit A. Payment net-45 from date of invoice. 2% discount for payment within 10 days" |
| **Quality Requirements** | Standards and metrics | "Supplier shall maintain ISO 9001:2015 certification. Defect rate shall not exceed 500 PPM" |
| **Intellectual Property** | Ownership of designs, tooling | "All designs, drawings, and specifications provided by Buyer remain Buyer's exclusive property" |
| **Confidentiality** | Information protection | "Incorporates NDA dated [date] by reference" |
| **Warranty** | Product guarantees | "Supplier warrants Products shall conform to Specifications for 18 months from delivery" |
| **Indemnification** | Liability protection | "Supplier shall indemnify Buyer against claims arising from defective Products" |
| **Limitation of Liability** | Damage caps | "Neither party's aggregate liability shall exceed fees paid in the preceding 12 months" |
| **Termination** | Exit provisions | "Either party may terminate for material breach with 30 days' written notice and cure period" |
| **Force Majeure** | Uncontrollable events | "Neither party liable for delays caused by acts of God, war, pandemic, government action" |
| **Dispute Resolution** | Conflict handling | "Disputes resolved by binding arbitration under ICC Rules, seat of arbitration: Singapore" |
| **Change Management** | How modifications work | "Changes to specifications require written ECN approved by both parties" |
| **Insurance** | Coverage requirements | "Supplier shall maintain product liability insurance of not less than $5M per occurrence" |
| **Audit Rights** | Buyer inspection rights | "Buyer may audit Supplier's facilities and records with 15 business days' written notice" |
| **Compliance** | Regulatory adherence | "Supplier shall comply with all applicable laws including RoHS, REACH, conflict minerals" |

**Real Template Sources:**
- [Juro MSA Template](https://juro.com/contract-templates/msa-master-services-agreement)
- [PandaDoc MSA Template](https://www.pandadoc.com/master-service-agreement-template/)
- [Zoho Contracts MSA Template](https://www.zoho.com/contracts/contract-templates/msa-master-service-agreement.html)

**Fairbuild Replacement:** PARTIAL
- The Fairbuild hypertext contract replaces the quality requirements, pricing/payment, and change management clauses with on-chain equivalents.
- Escrow replaces payment terms (net-45 becomes instant settlement on SVT mint).
- ERS versioning on-chain replaces change management procedures.
- Legal clauses (IP, indemnification, force majeure, governing law) must remain in a traditional legal document.
- The MSA would reference the Fairbuild contract: "Quality verification and payment settlement shall be governed by the Fairbuild Hypertext Contract ID [contract_hash]."

---

### 2.2 Purchase Order (PO)

**Purpose:** Specific, legally binding order for goods or services, issued under the MSA.

**Who Creates:** Buyer (OEM procurement)
**Who Receives/Acknowledges:** Factory (Supplier)
**Typical Format:** ERP-generated PDF, Excel
**EDI Equivalent:** EDI 850 (Purchase Order)

**Standard Fields:**

| Field | Data Type | Example Value |
|-------|-----------|---------------|
| PO Number | String | PO-2026-04-0312 |
| PO Date | Date | 2026-04-10 |
| Buyer Name/Address | String | Acme Electronics Inc., 1200 Technology Dr, San Jose CA |
| Supplier Name/Address | String | Precision Optics Mfg., Bao'an District, Shenzhen |
| Ship-To Address | String | Acme Receiving Dock C, 1200 Technology Dr |
| Bill-To Address | String | Acme AP Dept, PO Box 4500, San Jose CA |
| Payment Terms | String | Net 45, 2/10 |
| Incoterms | String | FOB Shenzhen |
| Currency | String | USD |
| **Line Items:** | | |
| Line # | Integer | 1 |
| Part Number | String | ACM-CAM-13MP-R3 |
| Description | String | 13MP Camera Module Assembly |
| Quantity | Integer | 10,000 |
| Unit of Measure | String | EA (Each) |
| Unit Price | Currency | $4.18 |
| Extended Price | Currency | $41,800.00 |
| Required Delivery Date | Date | 2026-06-15 |
| Drawing/Spec Rev | String | DWG-2026-0412 Rev C |
| ERS Version | String | ERS-CAM13-v2.3 |
| **Totals:** | | |
| Subtotal | Currency | $41,800.00 |
| Tooling/NRE | Currency | $0.00 (amortized) |
| Shipping Estimate | Currency | $850.00 |
| Tax | Currency | $0.00 (export) |
| **PO Total** | Currency | $42,650.00 |
| Special Instructions | Text | Pack in moisture barrier bags per J-STD-033B. Include CoC per lot. Ship via DHL Express. |

**Real Template Sources:**
- [Smartsheet PO Templates](https://www.smartsheet.com/purchase-order-templates)
- [Vertex42 Excel PO Template](https://www.vertex42.com/ExcelTemplates/excel-purchase-order.html)
- [Cin7 Free PO Template](https://www.cin7.com/blog/5-free-purchase-order-templates-for-google-sheets-excel-and-pdf/)

**Fairbuild Replacement:** YES
- The Fairbuild service order (`create_service_order`) replaces the PO entirely.
- Order ID, quantity, price, ERS version, acceptance criteria, and required artifacts are all encoded on-chain.
- Escrow deposit replaces the promise-to-pay of a traditional PO.
- The PO acknowledgment is replaced by `accept_service_order`.
- Key advantage: funds are locked at order creation, eliminating payment risk for the factory.

---

### 2.3 Statement of Work (SOW)

**Purpose:** Detailed description of the work to be performed, deliverables, timeline, and acceptance criteria for a specific project or phase.

**Who Creates:** Buyer (OEM engineering/program management), sometimes jointly
**Who Receives:** Factory (Supplier)
**Typical Format:** Word/PDF, 5-20 pages

**Key Sections:**

| Section | Content | Example |
|---------|---------|---------|
| Project Overview | Summary and objectives | "Factory shall develop and qualify the manufacturing process for the 13MP Camera Module per ERS-CAM13-v2.3" |
| Scope of Work | Detailed task list | "1. Process development, 2. Tooling design/build, 3. First article production, 4. Process validation (PVT), 5. Production ramp" |
| Deliverables | Tangible outputs | "FAIR report, control plan, SPC data for 5 critical parameters, 500 qualified units" |
| Timeline/Milestones | Schedule | "EVT complete: Week 8, DVT complete: Week 16, PVT complete: Week 24" |
| Acceptance Criteria | How deliverables are evaluated | "All critical dimensions within tolerance, Cpk >= 1.33, first-pass yield >= 95%" |
| Resources | Buyer-furnished items | "Buyer shall provide: golden samples (10 pcs), test fixtures (2 sets), ERS document" |
| Assumptions/Constraints | Boundary conditions | "SOW assumes 5-day work week, single shift. Design changes require formal ECN" |
| Pricing | Cost breakdown | "Fixed price: $125,000 for process development. Unit price: per PO" |
| Change Control | How scope changes are handled | "Changes require written agreement. Price impact assessed within 5 business days" |

**Real Template Sources:**
- [DocuSign SOW Template](https://www.docusign.com/templates/statement-of-work-sow)
- [ProjectManager SOW Template](https://www.projectmanager.com/templates/statement-of-work-template)
- [PandaDoc SOW Template](https://www.pandadoc.com/statement-of-work-template/)

**Fairbuild Replacement:** PARTIAL
- The service order's `ServiceRequest` struct (description, stage, quantity, ERS version, acceptance criteria, required artifacts) captures the core of a SOW.
- Complex multi-phase SOWs with narrative descriptions, assumptions, and buyer-furnished items extend beyond what a service order encodes.
- A SOW could reference Fairbuild: "Deliverable acceptance and payment shall be per Fairbuild Service Order [order_id]."

---

### 2.4 Engineering Requirements Specification (ERS)

**Purpose:** Definitive technical document specifying what the manufactured product must achieve. The single source of truth for acceptance criteria.

**Who Creates:** Buyer (OEM engineering)
**Who Receives:** Factory (Supplier manufacturing/quality)
**Typical Format:** PDF, Word, 20-200 pages
**Revision Controlled:** Yes, versioned (v1.0, v2.3, etc.)

**Key Sections:**

| Section | Content | Example |
|---------|---------|---------|
| Document Control | Version, date, approval signatures | "ERS-CAM13-v2.3, April 2026, Approved: J. Park (Optical), M. Liu (Quality)" |
| Scope | What product/assembly the ERS covers | "This ERS defines requirements for the 13MP camera module assembly, P/N ACM-CAM-13MP-R3" |
| Referenced Standards | Industry standards cited | "ISO 12233, IEC 62471, J-STD-020" |
| **Optical Performance** | Resolution, MTF, distortion | "MTF at center >= 0.35 cy/px at Nyquist, corner (0.7 field) >= 0.25 cy/px" |
| **Electrical Performance** | Power, signal, noise | "Dark current <= 16 e-/s at 60C, SNR >= 36 dB at 100 lux" |
| **Mechanical Requirements** | Dimensions, tolerances, materials | "Module height: 5.20 +/- 0.05mm, lens tilt: <= 0.3 degrees" |
| **Environmental Requirements** | Temperature, humidity, shock | "Operating: -20C to +70C, storage: -40C to +85C, 1m drop test on 6 faces" |
| **Reliability Requirements** | Lifetime, accelerated aging | "1000 hrs 85C/85%RH, < 5% MTF degradation" |
| **Cosmetic Requirements** | Visual defect criteria | "No scratches visible under 10x magnification, no particles > 50um on sensor" |
| **Test Conditions** | How measurements must be taken | "All optical tests at 25C +/- 2C, 500 lux D65 illuminant" |
| **Acceptance Criteria Summary** | Pass/fail table | Tabular summary of all limits with AQL levels |
| **Appendices** | Drawings, test setup diagrams | CAD drawings, test fixture specifications |

**Sample Acceptance Criteria Table:**

```
| Parameter          | Unit   | LSL    | USL    | Cpk Target | AQL  | Test Method     |
|--------------------|--------|--------|--------|------------|------|-----------------|
| MTF Center         | cy/px  | 0.35   | --     | 1.33       | 0.65 | ISO 12233       |
| MTF Corner (0.7H)  | cy/px  | 0.25   | --     | 1.33       | 0.65 | ISO 12233       |
| SFR Horizontal     | lp/px  | 0.30   | --     | 1.33       | 0.65 | ISO 12233       |
| SFR Vertical       | lp/px  | 0.30   | --     | 1.33       | 0.65 | ISO 12233       |
| Module Height      | mm     | 5.15   | 5.25   | 1.67       | 0.65 | CMM             |
| Focus Position     | um     | -15    | +15    | 1.33       | 1.0  | Through-focus   |
| Dark Current       | e-/s   | --     | 16     | 1.33       | 0.65 | Dark frame      |
| Power Consumption  | mW     | --     | 320    | 1.33       | 1.0  | Bench test      |
| Lens Tilt          | deg    | --     | 0.30   | 1.33       | 0.65 | Autocollimator  |
```

**Fairbuild Replacement:** YES (this is the core)
- The ERS is precisely what the Fairbuild hypertext contract encodes. The ERS Parser Agent extracts acceptance criteria from the document, and the hypertext links them to production log columns.
- ERS versioning is handled on-chain via `propose_ers` with governance timelock.
- The `AcceptanceCriterion` model captures: parameter name, criteria type, limits, units, conditions, source reference.
- Key advantage: the ERS becomes machine-readable and automatically enforceable, rather than a static PDF that requires human interpretation.

---

### 2.5 Quality Agreement

**Purpose:** Separate document (recommended by FDA) defining quality-related roles, responsibilities, and expectations between buyer and factory.

**Who Creates:** Buyer (OEM quality team), negotiated
**Who Signs:** Both parties (quality leadership)
**Typical Format:** Word/PDF, 10-25 pages

**Key Sections:**

| Section | Content |
|---------|---------|
| Purpose and Scope | Products covered, relationship to MSA |
| Quality Management System | Supplier must maintain ISO 9001/13485/IATF 16949 |
| Change Notification | Supplier must notify buyer 90 days before any process/material/location change |
| Audit Rights | Buyer may audit supplier with 15 business days' notice; additional audits for quality issues |
| Non-Conforming Product | Handling, segregation, notification within 24 hours |
| Corrective/Preventive Action | SCAR response within 14 days; root cause within 30 days |
| Document Retention | Quality records retained for minimum 7 years |
| Subcontractor Control | No subcontracting without prior written approval |
| Calibration | All measurement equipment calibrated to NIST-traceable standards |
| Training | Supplier maintains documented training program for production and quality personnel |
| Statistical Methods | SPC on critical parameters; Cpk data provided monthly |
| Traceability | Lot/batch traceability from raw material to finished goods |
| Environmental Controls | Temperature, humidity, ESD controls documented and monitored |
| Complaint Handling | Customer complaints investigated within 48 hours |
| Recall/Field Action | Supplier supports buyer's recall activities at supplier's expense if root cause is supplier |
| Performance Metrics | Monthly quality scorecard: PPM, OTD, SCAR closure rate |

**Real Template Sources:**
- [Sanmina Supplier Quality Agreement](https://www.sanmina.com/pdf/partners/qaf-0082-c.pdf) -- Electronics manufacturer
- [CC Integration Supplier Quality Agreement](https://www.ccintegration.com/wp-content/uploads/2020/11/Doc-1054-Supplier-Quality-Agreement-Rev-A-1.pdf)
- [NCI Frederick Quality Agreement Template](https://frederick.cancer.gov/sites/default/files/2022-04/Qty_Agreement_Template.pdf) -- Government/pharma
- [Zimmer Biomet Supplier Quality Agreement](https://www.zimmerbiomet.com/content/dam/zimmer-biomet/sourcing/emea/ZBV-AQF-FOR-022-09%20CF06028%20Rev%203%20SUPPLIER%20QUALITY%20AGREEMENT.pdf) -- Medical device
- [IPEC Quality Agreement Guide and Template](https://www.gmp-compliance.org/files/guidemgr/2024-ipec-qa-guide-and-template-f-1721635446.pdf)
- [Rx-360 Best Practices Quality Agreement Guide](https://rx-360.org/wp-content/uploads/2018/09/Rx-360-Best-Practices-Quality-Agreement-Guide-Version-2.0.pdf)

**Fairbuild Replacement:** PARTIAL
- Performance metrics (PPM, defect rate) are automatically computed from on-chain lot/service data.
- Change notification is handled by ERS governance (`propose_ers` with timelock).
- Corrective action tracking (SCAR) remains outside the platform but could interface.
- Audit rights, document retention, and regulatory clauses require a legal document.
- The Fairbuild contract effectively enforces what the quality agreement describes: acceptance criteria, inspection, and dispute resolution.

---

### 2.6 Pricing Schedule / Rate Card

**Purpose:** Detailed breakdown of unit prices, volume tiers, tooling costs, and NRE charges.

**Who Creates:** Negotiated jointly; factory proposes, buyer approves
**Who Receives:** Both parties
**Typical Format:** Excel (attached to MSA or PO)

**Sample Pricing Schedule:**

```
Product: 13MP Camera Module Assembly (ACM-CAM-13MP-R3)
Effective Date: 2026-04-15
Currency: USD
Incoterms: FOB Shenzhen

UNIT PRICING (volume tiers):
| Annual Volume (units) | Unit Price | Discount |
|-----------------------|------------|----------|
| 1 - 49,999            | $4.50      | --       |
| 50,000 - 199,999      | $4.25      | 5.6%     |
| 200,000 - 499,999     | $4.10      | 8.9%     |
| 500,000 - 999,999     | $3.95      | 12.2%    |
| 1,000,000+            | $3.80      | 15.6%    |

COST BREAKDOWN:
| Component              | Cost    | % of Total |
|------------------------|---------|------------|
| Image Sensor (Sony)    | $1.45   | 34.1%      |
| Lens Assembly (6P)     | $0.65   | 15.3%      |
| VCM Actuator           | $0.40   | 9.4%       |
| FPC + Connector        | $0.25   | 5.9%       |
| IR Filter              | $0.12   | 2.8%       |
| PCB + SMT Components   | $0.35   | 8.2%       |
| Housing/Barrel         | $0.18   | 4.2%       |
| Assembly Labor         | $0.30   | 7.1%       |
| Test/Calibration       | $0.25   | 5.9%       |
| Packaging              | $0.08   | 1.9%       |
| Overhead + Margin      | $0.22   | 5.2%       |
| TOTAL                  | $4.25   | 100%       |

TOOLING / NRE (one-time):
| Item                   | Cost      | Amortized Over |
|------------------------|-----------|----------------|
| Assembly Fixture (x4)  | $12,000   | First 100K pcs |
| Test Fixture (x2)      | $18,000   | First 100K pcs |
| Calibration Jig        | $8,500    | First 100K pcs |
| Process Validation     | $15,000   | N/A            |
| TOTAL NRE              | $53,500   |                |
```

**Fairbuild Replacement:** YES
- The `Pricing` struct in the smart contract encodes: `price_per_unit`, `defect_penalty_bps`, and `tiers` (volume discount breakdowns).
- Tier-based pricing is computed automatically by `compute_price_for_lot`.
- Defect penalties are applied algorithmically based on ERS thresholds.
- NRE/tooling could be handled as separate service orders.

---

### 2.7 Payment Terms Document

**Purpose:** Defines how and when the factory gets paid.

**Who Creates:** Buyer (AP/finance), negotiated
**Typical Format:** Clause in MSA or separate addendum

**Common Payment Terms in Manufacturing:**

| Term | Meaning | Cash Impact |
|------|---------|-------------|
| Net 30 | Payment due 30 days after invoice date | Standard for domestic |
| Net 45 | Payment due 45 days | Most common in manufacturing (38% of companies) |
| Net 60 | Payment due 60 days | Large OEMs to smaller suppliers |
| Net 90 | Payment due 90 days | Aggressive; strains supplier cash flow |
| 2/10 Net 30 | 2% discount if paid within 10 days, otherwise net 30 | Early payment incentive |
| CIA | Cash in Advance (before shipment) | Used for new/unproven suppliers |
| COD | Cash on Delivery | Used for small orders |
| LC | Letter of Credit (bank guarantee) | International trade, high-value orders |
| T/T | Telegraphic Transfer (wire) | Most common international payment method |
| 30% advance, 70% on shipment | Split payment | Common for tooling + production |

**Fairbuild Replacement:** YES
- The entire payment terms concept is replaced by escrowed settlement.
- OEM deposits escrow upfront. Factory receives payment immediately upon SVT mint (oracle attestation).
- No net-30, no net-45, no cash flow gap. Settlement in hours, not months.
- This is one of Fairbuild's strongest value propositions.

---

## 3. Production Phase

### 3.1 Bill of Materials (BOM)

**Purpose:** Complete, structured list of all components, sub-assemblies, and raw materials needed to manufacture a product.

**Who Creates:** Buyer (OEM engineering), refined with Factory
**Who Receives:** Factory (manufacturing engineering)
**Typical Format:** Excel, ERP export (CSV), or PLM system

**BOM Structure Types:**
- **Single-Level BOM:** Flat list -- all components at one level
- **Multi-Level (Indented) BOM:** Hierarchical parent-child relationships showing sub-assemblies
- **Engineering BOM (eBOM):** As designed
- **Manufacturing BOM (mBOM):** As built (includes process materials like solder, adhesive)

**Sample Multi-Level BOM (Camera Module):**

```
Level | Item Number      | Description                | Qty | UOM | Make/Buy | Supplier        | Lead Time
------|------------------|----------------------------|-----|-----|----------|-----------------|----------
0     | ACM-CAM-13MP-R3  | 13MP Camera Module Assy    | 1   | EA  | Make     | --              | --
1     |   SNY-IMX258-001 | Image Sensor, 13MP CMOS    | 1   | EA  | Buy      | Sony Semi       | 12 wks
1     |   LNS-6P-F2.2    | Lens Assembly, 6P f/2.2    | 1   | EA  | Buy      | Largan Precision| 8 wks
1     |   VCM-AF-8x8     | Voice Coil Motor, AF       | 1   | EA  | Buy      | TDK             | 6 wks
1     |   FPC-CAM-R3     | Flex PCB Assembly          | 1   | EA  | Make     | --              | --
2     |     FPC-BARE-R3  | Bare Flex PCB, 2-layer     | 1   | EA  | Buy      | Flexium         | 4 wks
2     |     CON-BTB-24P  | Board-to-Board Connector   | 1   | EA  | Buy      | Molex           | 4 wks
2     |     CAP-100NF    | Capacitor, 100nF 0201      | 4   | EA  | Buy      | Murata          | 2 wks
2     |     RES-10K-0201 | Resistor, 10K 0201         | 2   | EA  | Buy      | Yageo           | 2 wks
2     |     IC-EEPROM    | EEPROM, 2Kbit I2C          | 1   | EA  | Buy      | STMicro         | 4 wks
1     |   FLT-IR-650     | IR Cut Filter, 650nm       | 1   | EA  | Buy      | Hoya            | 6 wks
1     |   HSG-CAM-R3     | Housing/Barrel, LCP        | 1   | EA  | Buy      | Injection Mold  | 4 wks
1     |   ADH-UV-001     | UV Cure Adhesive           | 0.01| mL  | Buy      | Dymax           | 2 wks
1     |   SLD-SAC305     | Solder Paste, SAC305       | 0.5 | g   | Buy      | Indium Corp     | 2 wks
```

**Real Template Sources:**
- [Smartsheet BOM Templates](https://www.smartsheet.com/free-bill-of-materials-templates) -- Excel/Google Sheets
- [Katana MRP BOM Guide](https://katanamrp.com/blog/bill-of-materials/) -- With template
- [Titoma BOM Template](https://titoma.com/blog/bill-of-materials-bom-template/) -- Electronics-focused
- [OpenBOM](https://www.openbom.com/blog/bill-of-materials-types-formats-and-examples) -- Cloud BOM management

**Fairbuild Replacement:** NO
- BOMs are engineering/procurement documents that predate and extend beyond the quality verification scope.
- However, the BOM revision could be referenced in the ERS version on-chain (e.g., "ERS v2.3 references BOM Rev C").
- Material traceability (lot numbers of components used) could be committed as artifacts.

---

### 3.2 Work Order / Production Order

**Purpose:** Internal factory document authorizing and tracking a specific production run.

**Who Creates:** Factory (production planning)
**Who Receives:** Factory (shop floor, quality)
**Typical Format:** ERP-generated form, MES work order

**Key Fields:**

| Field | Example |
|-------|---------|
| Work Order Number | WO-2026-04-0089 |
| PO Reference | PO-2026-04-0312 |
| Part Number | ACM-CAM-13MP-R3 |
| Part Description | 13MP Camera Module Assembly |
| Order Quantity | 10,000 |
| Start Date | 2026-05-01 |
| Due Date | 2026-05-20 |
| Priority | Normal |
| BOM Rev | Rev C |
| Routing Rev | Route-CAM13-v4 |
| Production Line | Line 3, Building B |
| Shift | Day Shift (08:00-17:00) |
| Materials Issued | Yes/No per component |
| Status | Released / In Progress / Complete / Closed |
| Yield Target | 97.5% |
| Notes | Customer requires 100% MTF test. Ship via DHL Express. |

**Real Template Sources:**
- [MSI Data Manufacturing Work Order Template](https://www.msidata.com/manufacturing-work-order-template/) -- Free Excel
- [ProjectManager Manufacturing Work Order](https://www.projectmanager.com/blog/manufacturing-work-order)
- [PlatoForms Production Work Order Template](https://templates.platoforms.com/form/manufacturing-production-work-order-template)

**Fairbuild Replacement:** NO
- Work orders are internal factory planning documents. Fairbuild operates at the buyer-factory interface, not inside the factory's shop floor.
- The Fairbuild service order triggers the creation of work orders within the factory's MES/ERP, but does not replace them.

---

### 3.3 Process Routing / Traveler Sheet

**Purpose:** Defines the sequence of manufacturing operations and physically accompanies the product through the factory.

**Who Creates:** Factory (manufacturing engineering)
**Who Receives:** Factory (shop floor operators)
**Typical Format:** Paper form or MES tablet display

**Sample Routing (Camera Module Assembly):**

```
Product: ACM-CAM-13MP-R3 | WO: WO-2026-04-0089 | Qty: 10,000

Op# | Operation          | Station    | Std Time | Operator | Date/Time | Qty In | Qty Out | Yield  | Sign-Off
----|--------------------| -----------|----------|----------|-----------|--------|---------|--------|--------
010 | SMT - Solder Paste | SMT-Line3  | 0.8 min  | ________ | _________ | 10,000 | _______ | _____% | ________
020 | SMT - Place Parts  | SMT-Line3  | 1.2 min  | ________ | _________ | _______ | _______ | _____% | ________
030 | Reflow Solder      | Oven-R3    | 3.5 min  | ________ | _________ | _______ | _______ | _____% | ________
040 | AOI Inspection     | AOI-03     | 0.5 min  | ________ | _________ | _______ | _______ | _____% | ________
050 | Die Bond Sensor    | DB-STN-01  | 2.0 min  | ________ | _________ | _______ | _______ | _____% | ________
060 | Wire Bond          | WB-STN-02  | 1.5 min  | ________ | _________ | _______ | _______ | _____% | ________
070 | Lens Mount + UV    | LA-STN-04  | 3.0 min  | ________ | _________ | _______ | _______ | _____% | ________
080 | Active Alignment   | AA-STN-01  | 4.0 min  | ________ | _________ | _______ | _______ | _____% | ________
090 | OTP Programming    | OTP-STN-01 | 1.0 min  | ________ | _________ | _______ | _______ | _____% | ________
100 | Final Test (MTF)   | TST-STN-04 | 2.5 min  | ________ | _________ | _______ | _______ | _____% | ________
110 | Visual Inspection  | VI-STN-02  | 0.8 min  | ________ | _________ | _______ | _______ | _____% | ________
120 | Pack + Label       | PACK-01    | 0.5 min  | ________ | _________ | _______ | _______ | _____% | ________
```

**Real Template Sources:**
- [Metis Automation Manufacturing Traveller Guide](https://www.metisautomation.co.uk/create-manufacturing-traveler-guide/)
- [Tulip Manufacturing Travelers Guide](https://tulip.co/blog/manufacturing-travelers-steps-to-digitize-your-product-documentation/)

**Fairbuild Replacement:** NO
- Internal factory documents. The routing data could be submitted as artifacts if the buyer requires process traceability.

---

### 3.4 Inspection Plan / Control Plan

**Purpose:** Defines what to inspect, when, how, how many, and what to do when results are out of spec. Required by IATF 16949 (automotive) and APQP.

**Who Creates:** Factory (quality engineering), approved by Buyer
**Who Receives:** Both parties
**Typical Format:** Excel (AIAG format), PDF

**Sample Control Plan (abbreviated):**

```
Control Plan Number: CP-CAM13-R3-v2
Part Number: ACM-CAM-13MP-R3
Part Name: 13MP Camera Module
Date: 2026-04-10 | Rev: 2 | Phase: Production

Op# | Process      | Characteristic    | Class | Spec/Tol        | Gage       | Sample Size | Sample Freq | Control Method | Reaction Plan
----|-------------|-------------------|-------|-----------------|------------|-------------|-------------|----------------|---------------
040 | AOI         | Solder Joint Quality| Crit | IPC-A-610 Class 2| AOI-Koh Young| 100%       | Each unit   | Automated      | Segregate, rework
050 | Die Bond    | Die Position X/Y  | Major | +/- 25 um       | Vision Sys | 5 pcs       | First + hourly | SPC Chart   | Adjust, requalify
070 | Lens Mount  | Adhesive Volume   | Major | 0.8-1.2 uL      | Dispense Monitor| 100%   | Each unit   | Process monitor| Stop, adjust
080 | Active Align| Tilt Angle        | Crit  | <= 0.30 deg     | Autocollim | 100%        | Each unit   | Automated      | Reject
100 | Final Test  | MTF Center        | Crit  | >= 0.35 cy/px   | MTF Tester | 100%        | Each unit   | Automated      | Reject, analyze
100 | Final Test  | MTF Corner        | Crit  | >= 0.25 cy/px   | MTF Tester | 100%        | Each unit   | Automated      | Reject, analyze
100 | Final Test  | Dark Current      | Major | <= 16 e-/s      | Dark Frame | 100%        | Each unit   | Automated      | Reject
110 | Visual Insp | Cosmetic Defects  | Minor | No scratches >50um| 10x Microscope| AQL 2.5 | Per lot     | Sampling       | Sort 100%, contain
```

**Real Template Sources:**
- [AIAG Control Plan Manual (CP-1)](https://www.aiag.org/training-and-resources/manuals/details/CP-1)
- [NQA APQP Control Plan Guide](https://www.nqa.com/en-gb/resources/blog/september-2020/apqp-control-plan)
- [QI Macros Control Plan Template](https://www.qimacros.com/quality-tools/control-plan/)

**Fairbuild Replacement:** PARTIAL
- The acceptance criteria in the hypertext contract correspond to the "Spec/Tol" column of the control plan.
- The control plan also specifies internal factory process controls (sample frequency, gage used, reaction plan) that are outside the buyer-factory interface.
- The Fairbuild oracle validates the outcomes (final test results) but doesn't prescribe the internal controls.

---

### 3.5 First Article Inspection Report (FAIR)

**Purpose:** Comprehensive inspection of the first production unit(s) to verify that the manufacturing process produces parts conforming to all specifications. Required before full production begins.

**Who Creates:** Factory (quality)
**Who Receives/Approves:** Buyer (quality/engineering)
**Typical Format:** AS9102 Rev C forms (Excel/PDF), 3 forms
**Standard:** SAE AS9102 (aerospace), widely adopted in other industries

**AS9102 Three-Form Structure:**

**Form 1 -- Part Number Accountability:**

| Field | Example |
|-------|---------|
| Part Number | ACM-CAM-13MP-R3 |
| Part Name | 13MP Camera Module Assembly |
| Serial Number | FAI-001 |
| Drawing Number | DWG-2026-0412 |
| Drawing Revision | Rev C |
| FAI Report Number | FAIR-2026-0089 |
| Manufacturing Process Reference | Route-CAM13-v4 |
| Organization Name | Precision Optics Mfg. Co. |
| Additional Changes | N/A (initial production) |
| Signature / Date | Q. Zhang, 2026-05-05 |

**Form 2 -- Product Accountability (Materials and Processes):**

| Item | Requirement | Result | Status |
|------|------------|--------|--------|
| Sensor | Sony IMX258, lot #SY2026-04-881 | Verified | Pass |
| Lens | 6P f/2.2, Largan P/N LG-6P-221 | Verified | Pass |
| VCM | TDK AF-8x8, CoC attached | Verified | Pass |
| FPC | 2-layer flex, Flexium lot #FX-2604 | Verified | Pass |
| Solder | SAC305, Indium, exp 2027-01 | Verified | Pass |
| Adhesive | UV cure, Dymax 9-20801 | Verified | Pass |
| Reflow Profile | Peak 245C, TAL 60-90s | Profile attached | Pass |
| Active Alignment | AA completed per spec | Log attached | Pass |

**Form 3 -- Characteristic Accountability:**

| Char # | Characteristic | Requirement | Nominal | +Tol | -Tol | Actual | Status |
|--------|---------------|-------------|---------|------|------|--------|--------|
| 1 | Module Height | 5.15-5.25mm | 5.20 | +0.05 | -0.05 | 5.18 | Pass |
| 2 | Module Width | 8.45-8.55mm | 8.50 | +0.05 | -0.05 | 8.51 | Pass |
| 3 | Connector Pin Height | 0.95-1.05mm | 1.00 | +0.05 | -0.05 | 0.98 | Pass |
| 4 | MTF Center | >= 0.35 cy/px | -- | -- | -- | 0.43 | Pass |
| 5 | MTF Corner | >= 0.25 cy/px | -- | -- | -- | 0.32 | Pass |
| 6 | SFR Horizontal | >= 0.30 lp/px | -- | -- | -- | 0.38 | Pass |
| 7 | Dark Current | <= 16 e-/s @ 60C | -- | -- | -- | 11.2 | Pass |
| 8 | Power Consumption | <= 320 mW | -- | -- | -- | 285 | Pass |
| 9 | Lens Tilt | <= 0.30 deg | -- | -- | -- | 0.12 | Pass |
| 10 | Focus Position | +/- 15 um | 0 | +15 | -15 | +3 | Pass |

**Real Template Sources:**
- [InspectionXpert AS9102 FAIR Guide](https://www.inspectionxpert.com/fai/as9102) -- Software + templates
- [Astronautics AS9102 FAIR Form](https://www.astronautics.com/pdf/support/supplier_resources/QCOI011AFirstArticleInspectionForm.pdf) -- PDF
- [TryBulk AS9102 FAIR Template](https://www.trybulk.app/templates/first_article_inspection) -- Free Excel
- [Net-Inspect AS9102 Rev B vs Rev C](https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/) -- Comparison

**Fairbuild Replacement:** PARTIAL
- Form 3 (Characteristic Accountability) maps directly to the hypertext contract's acceptance criteria table. The first submission in sandbox mode is essentially a FAIR.
- Forms 1 and 2 (traceability, materials, processes) could be submitted as artifacts with Merkle root commitments.
- The Fairbuild sandbox phase serves the same purpose as FAIR: "prove you can make it right before we go to production."

---

### 3.6 In-Process Inspection Records

**Purpose:** Records of quality checks performed during manufacturing, at each operation.

**Who Creates:** Factory (quality/operators)
**Who Receives:** Stored at Factory; shared with Buyer on request
**Typical Format:** MES records, paper forms, Excel

**Sample In-Process Record (CSV format):**

```csv
timestamp,work_order,operation,station_id,operator,serial_number,parameter,value,unit,lsl,usl,result
2026-05-10T08:23:15,WO-2026-04-0089,050,DB-STN-01,L.Wang,SN-000001,die_position_x,12.3,um,-25,25,PASS
2026-05-10T08:23:15,WO-2026-04-0089,050,DB-STN-01,L.Wang,SN-000001,die_position_y,-8.7,um,-25,25,PASS
2026-05-10T08:23:42,WO-2026-04-0089,050,DB-STN-01,L.Wang,SN-000002,die_position_x,15.1,um,-25,25,PASS
2026-05-10T08:23:42,WO-2026-04-0089,050,DB-STN-01,L.Wang,SN-000002,die_position_y,-22.8,um,-25,25,PASS
2026-05-10T08:24:03,WO-2026-04-0089,050,DB-STN-01,L.Wang,SN-000003,die_position_x,28.4,um,-25,25,FAIL
2026-05-10T08:24:03,WO-2026-04-0089,050,DB-STN-01,L.Wang,SN-000003,die_position_y,5.2,um,-25,25,PASS
```

**Fairbuild Replacement:** PARTIAL
- These records can be submitted as production artifacts (Merkle root of the full dataset).
- The hypertext view can display and verify in-process data if the factory chooses to share it.
- Typically, only final test data flows to the buyer; in-process data stays with the factory unless contractually required.

---

### 3.7 Production Logs / Test Data Files

**Purpose:** Raw measurement data from automated test equipment (ATE), test stations, or MES systems. The primary data that flows through Fairbuild's hypertext contract.

**Who Creates:** Factory (test equipment, automated)
**Who Receives:** Buyer (via Fairbuild platform)
**Typical Format:** CSV, JSON, XML, binary (STDF)

**Sample Production Test Log (CSV) -- Camera Module Final Test:**

```csv
serial,timestamp,station_id,operator,firmware_ver,temp_c,humidity_pct,mtf_center,mtf_corner_07h,sfr_h,sfr_v,dark_current,power_mw,focus_pos_um,tilt_deg,overall_result
SN-000001,2026-05-10T14:23:15,TST-STN-04,J.Kim,FW-3.2.1,24.2,45,0.42,0.31,0.38,0.36,11.2,285,3,0.12,PASS
SN-000002,2026-05-10T14:24:01,TST-STN-04,J.Kim,FW-3.2.1,24.3,45,0.39,0.28,0.35,0.33,12.8,291,7,0.18,PASS
SN-000003,2026-05-10T14:24:48,TST-STN-04,J.Kim,FW-3.2.1,24.1,44,0.44,0.33,0.40,0.38,10.5,278,-2,0.09,PASS
SN-000004,2026-05-10T14:25:35,TST-STN-04,J.Kim,FW-3.2.1,24.4,45,0.36,0.22,0.32,0.30,13.1,302,11,0.28,FAIL
SN-000005,2026-05-10T14:26:22,TST-STN-04,J.Kim,FW-3.2.1,24.2,45,0.41,0.29,0.37,0.35,11.8,288,5,0.15,PASS
SN-000006,2026-05-10T14:27:09,TST-STN-04,J.Kim,FW-3.2.1,24.3,46,0.38,0.26,0.34,0.32,14.2,295,8,0.21,PASS
SN-000007,2026-05-10T14:27:56,TST-STN-04,J.Kim,FW-3.2.1,24.5,46,0.43,0.30,0.39,0.37,10.9,282,-4,0.11,PASS
SN-000008,2026-05-10T14:28:43,TST-STN-04,J.Kim,FW-3.2.1,24.1,45,0.37,0.24,0.33,0.31,15.3,310,13,0.25,FAIL
SN-000009,2026-05-10T14:29:30,TST-STN-04,J.Kim,FW-3.2.1,24.2,45,0.40,0.27,0.36,0.34,12.1,289,6,0.16,PASS
SN-000010,2026-05-10T14:30:17,TST-STN-04,J.Kim,FW-3.2.1,24.3,45,0.45,0.34,0.41,0.39,10.1,275,-1,0.08,PASS
```

**Fairbuild Replacement:** YES (this is the primary input)
- Production logs are uploaded to the Fairbuild platform. The AI Log Mapper Agent identifies columns and roles.
- The hypertext contract links each measurement column to its acceptance criterion.
- The Fairbuild oracle validates the data against criteria and mints SVT on passing.
- This is the core data flow that Fairbuild was designed to handle.

---

### 3.8 Material Certificates (Mill Certs / CoA)

**Purpose:** Certify that raw materials or components meet specified chemical, physical, or performance requirements. Required for traceability.

**Who Creates:** Material supplier (tier 2/3) or factory
**Who Receives:** Factory (incoming inspection) and/or Buyer
**Typical Format:** PDF, 1-2 pages per material lot

**Types:**
- **Mill Test Certificate (MTC/MTR):** For metals -- chemical composition, mechanical properties
- **Certificate of Analysis (CoA):** For chemicals, polymers, electronic components -- purity, performance data

**EN 10204 Certification Types:**

| Type | Description | Issuer |
|------|-------------|--------|
| 2.1 | Declaration of compliance | Manufacturer |
| 2.2 | Test report | Manufacturer |
| 3.1 | Inspection certificate | Manufacturer's authorized inspector |
| 3.2 | Inspection certificate | Independent third-party inspector |

**Sample Mill Test Certificate Fields:**

```
MATERIAL TEST REPORT

Manufacturer: Nippon Steel Corporation
Certificate No: NS-2026-04-8821
Date: 2026-04-02

Material: Stainless Steel 304
Standard: ASTM A240 / JIS G4304
Heat Number: H-88214
Lot Number: L-2604-003

CHEMICAL COMPOSITION (wt%):
| Element | Specification | Actual |
|---------|--------------|--------|
| C       | <= 0.08      | 0.042  |
| Si      | <= 0.75      | 0.48   |
| Mn      | <= 2.00      | 1.12   |
| P       | <= 0.045     | 0.028  |
| S       | <= 0.030     | 0.002  |
| Cr      | 18.0-20.0    | 18.32  |
| Ni      | 8.0-10.5     | 8.15   |

MECHANICAL PROPERTIES:
| Property          | Specification    | Actual |
|-------------------|-----------------|--------|
| Tensile Strength  | >= 520 MPa      | 585 MPa|
| Yield Strength    | >= 205 MPa      | 248 MPa|
| Elongation        | >= 40%          | 52%    |
| Hardness (HRB)    | <= 92           | 82     |

Certified by: T. Yamamoto, Quality Manager
```

**Real Template Sources:**
- [Contract Directory MTC Template](https://www.contractdirectory.net/template/mill-test-certificate-mtc/)
- [HQTS Material Test Certificate Guide](https://www.hqts.com/material-test-certificate/)

**Fairbuild Replacement:** PARTIAL
- Material certificates could be submitted as artifacts (PDF) with hashes committed on-chain.
- The Fairbuild oracle could potentially validate structured CoA data against incoming material specifications.
- Physical verification (is this really the material with this cert?) remains outside the platform.

---

## 4. Quality Phase

### 4.1 Incoming Quality Report (IQR)

**Purpose:** Buyer's inspection of received goods against the purchase order and specifications.

**Who Creates:** Buyer (incoming quality / receiving inspection)
**Who Receives:** Buyer internal (quality, procurement); shared with Factory if issues found
**Typical Format:** Excel, ERP form, inspection app

**Key Fields:**

| Field | Example |
|-------|---------|
| IQR Number | IQR-2026-05-0112 |
| Date Received | 2026-05-22 |
| PO Number | PO-2026-04-0312 |
| Supplier | Precision Optics Mfg. |
| Part Number | ACM-CAM-13MP-R3 |
| Lot/Batch Number | LOT-2605-001 |
| Quantity Received | 10,000 |
| Quantity Inspected | 200 (AQL 0.65, Level II) |
| Inspection Level | Normal, General Inspection Level II |
| Accept Number (Ac) | 3 |
| Reject Number (Re) | 4 |
| Defects Found (Major) | 1 (cracked lens on SN-004287) |
| Defects Found (Minor) | 2 (cosmetic scratch on SN-007651, SN-008103) |
| Disposition | ACCEPT |
| Inspector | R. Patel |
| CoC Received | Yes, CoC-2605-POM-001 |
| Notes | Lot accepted. Minor cosmetics noted for supplier feedback. |

**Real Template Sources:**
- [GoAudits Incoming Inspection Guide](https://goaudits.com/blog/incoming-inspections/)
- [SafetyCulture Incoming Inspection Checklist](https://safetyculture.com/checklists/incoming-inspection/)
- [Kladana Incoming Inspection Report Excel Template](https://www.kladana.com/blog/oms/incoming-inspection-report-excel-template/)

**Fairbuild Replacement:** PARTIAL
- The Fairbuild challenge/reinspection mechanism (`request_reinspect`) serves a similar purpose -- the buyer can verify the factory's reported quality.
- The automated oracle inspection replaces manual incoming inspection for test-data-verifiable parameters.
- Physical inspection (visual defects, cosmetic issues, packaging damage) still requires manual receiving.

---

### 4.2 Certificate of Conformance (CoC)

**Purpose:** Factory's formal declaration that the shipped products conform to all specified requirements.

**Who Creates:** Factory (quality department)
**Who Receives:** Buyer (incoming quality)
**Typical Format:** PDF, 1 page per lot/shipment

**Key Fields:**

| Field | Example |
|-------|---------|
| CoC Number | CoC-2605-POM-001 |
| Date | 2026-05-20 |
| Customer | Acme Electronics Inc. |
| Customer PO Number | PO-2026-04-0312 |
| Part Number | ACM-CAM-13MP-R3 |
| Part Description | 13MP Camera Module Assembly |
| Drawing/Spec Rev | DWG-2026-0412 Rev C |
| ERS Version | ERS-CAM13-v2.3 |
| Lot/Batch Number | LOT-2605-001 |
| Quantity | 10,000 units |
| Date of Manufacture | 2026-05-01 to 2026-05-18 |
| Test Summary | 10,000 tested, 9,847 passed (98.47% yield) |
| Conformity Statement | "We hereby certify that the above-referenced products have been manufactured, tested, and inspected in accordance with the applicable specifications and are found to be in conformance with all requirements." |
| Authorized Signature | Q. Zhang, Quality Manager |
| Applicable Standards | ISO 9001:2015, IPC-A-610 Class 2, ERS-CAM13-v2.3 |
| Traceability | Material lot numbers attached (Appendix A) |

**Real Template Sources:**
- [IAQG CofC Template 9163 Rev-B](https://iaqg.org/wp-content/uploads/2023/12/SCMH-5.2.4-CofC-Template-9163-Rev-B-Dated-9MAR23.docx) -- Aerospace industry standard
- [TemplateLab CoC Templates](https://templatelab.com/certificate-of-conformance/) -- 58 free templates
- [Certivo CoC Guide](https://www.certivo.com/blog-details/what-is-a-certificate-of-conformance-(coc)-complete-guide-for-manufacturers)

**Fairbuild Replacement:** YES
- The SVT (Service Validation Token) is the on-chain equivalent of a CoC. It certifies that the factory delivered, the oracle validated, and the work conforms.
- The SVT records: order ID, development stage, factory address, verifier identity, and timestamp.
- Key advantage: SVTs are tamper-proof, permanent, and portable. A traditional CoC is a PDF that can be forged or lost.

---

### 4.3 Certificate of Analysis (CoA)

**Purpose:** Detailed test results for a specific batch of material or product, showing actual values vs. specifications.

**Who Creates:** Factory (lab/quality) or material supplier
**Who Receives:** Buyer (quality/engineering)
**Typical Format:** PDF, 1-3 pages

**Key Fields (similar to CoC but with detailed test data):**

| Field | Example |
|-------|---------|
| CoA Number | CoA-2605-POM-001 |
| Product/Material | 13MP Camera Module, LOT-2605-001 |
| Sample Size | 200 units (AQL sampling) |
| Test Date | 2026-05-19 |
| **Test Results Table:** | |

```
| Test Parameter     | Method       | Spec         | n   | Mean  | Std Dev | Min   | Max   | Cpk  | Result |
|--------------------|-------------|--------------|-----|-------|---------|-------|-------|------|--------|
| MTF Center         | ISO 12233   | >= 0.35      | 200 | 0.412 | 0.024   | 0.352 | 0.468 | 1.72 | Pass   |
| MTF Corner (0.7H)  | ISO 12233   | >= 0.25      | 200 | 0.296 | 0.031   | 0.221 | 0.372 | 1.49 | Pass   |
| SFR Horizontal     | ISO 12233   | >= 0.30      | 200 | 0.365 | 0.022   | 0.308 | 0.418 | 2.05 | Pass   |
| Dark Current       | Dark Frame  | <= 16 e-/s   | 200 | 12.1  | 1.42    | 8.9   | 15.8  | 1.83 | Pass   |
| Power Consumption  | Bench Test  | <= 320 mW    | 200 | 289   | 9.8     | 265   | 318   | 2.18 | Pass   |
| Module Height      | CMM         | 5.15-5.25 mm | 30  | 5.198 | 0.012   | 5.168 | 5.232 | 1.78 | Pass   |
```

**Fairbuild Replacement:** YES
- The Fairbuild hypertext view generates this automatically from production log data.
- Every submission produces a per-unit and aggregate summary with statistics.
- The on-chain settlement record is more trustworthy than a manually prepared CoA.

---

### 4.4 Test Report

**Purpose:** Detailed report of specific tests performed, with raw data, methodology, and conclusions.

**Who Creates:** Factory (test engineering/lab)
**Who Receives:** Buyer (quality/engineering)
**Typical Format:** PDF with data tables, charts; raw data as CSV/Excel attachment

**Fairbuild Replacement:** YES
- The hypertext view is essentially an interactive test report. It shows per-unit results, pass/fail status, and links to acceptance criteria with source references.

---

### 4.5 Gauge R&R Study Report

**Purpose:** Validates that the measurement system is adequate -- that variation in measurements comes from the parts, not from the measurement equipment or operators.

**Who Creates:** Factory (quality engineering)
**Who Receives:** Buyer (SQE/quality)
**Typical Format:** Excel with calculations and charts

**Study Design (AIAG standard):**
- 10 parts representing the production range
- 3 operators
- 3 trials per operator per part
- 90 total measurements

**Sample GR&R Results:**

```
GAUGE R&R STUDY RESULTS
Gage: MTF Test Station TST-STN-04
Characteristic: MTF Center (cy/px)
Date: 2026-04-25

SOURCE OF VARIATION:
| Source              | VarComp   | %Contribution | %Study Var | %Tolerance |
|---------------------|-----------|---------------|------------|------------|
| Total Gage R&R      | 0.000045  | 3.2%          | 17.8%      | 8.4%       |
|   Repeatability     | 0.000032  | 2.3%          | 15.0%      | 7.1%       |
|   Reproducibility   | 0.000013  | 0.9%          | 9.5%       | 4.5%       |
|     Operator        | 0.000008  | 0.6%          | 7.5%       | 3.5%       |
|     Operator*Part   | 0.000005  | 0.4%          | 5.9%       | 2.8%       |
| Part-to-Part        | 0.001362  | 96.8%         | 98.4%      | --         |
| Total Variation     | 0.001407  | 100%          | 100%       | --         |

RESULT: %GR&R = 8.4% of tolerance --> ACCEPTABLE (< 10%)
Number of Distinct Categories (ndc): 7 --> ACCEPTABLE (>= 5)
```

**Acceptance Criteria:**
- %GR&R < 10%: Acceptable
- %GR&R 10-30%: Conditionally acceptable (may be acceptable depending on application)
- %GR&R > 30%: Unacceptable -- measurement system needs improvement

**Real Template Sources:**
- [QI Macros Gage R&R Templates](https://www.qimacros.com/gage-r-and-r-study/aiag-msa-gage-r-and-r/)
- [SigmaXL MSA Templates](https://www.sigmaxl.com/MSAtemplates.shtml)
- [ASQ GR&R Resource](https://asq.org/quality-resources/gage-repeatability)
- [1Factory GR&R Guide](https://www.1factory.com/quality-academy/guide-gage-r-and-r.html)

**Fairbuild Replacement:** NO
- GR&R is a measurement system validation activity internal to the factory. The results may be submitted as supporting evidence, but the study itself is not part of the buyer-factory data flow.
- However, Fairbuild could store GR&R results as qualification artifacts (hash on-chain) to build trust in measurement data integrity.

---

### 4.6 Process Capability Study (Cpk Report)

**Purpose:** Statistical analysis proving that a process can consistently produce within specification limits.

**Who Creates:** Factory (quality engineering)
**Who Receives:** Buyer (SQE/quality)
**Typical Format:** Excel/PDF with histogram, statistics, capability indices

**Sample Cpk Report:**

```
PROCESS CAPABILITY STUDY
Process: Final Test - MTF Center
Part: ACM-CAM-13MP-R3
Date: 2026-05-18
Data Points: 500 (consecutive production units)

SPECIFICATION:
  LSL = 0.35 cy/px (Lower Spec Limit)
  USL = None (one-sided)

STATISTICS:
  Mean (X-bar) = 0.4118
  Std Dev (sigma) = 0.0238
  Min = 0.3485
  Max = 0.4712

CAPABILITY INDICES:
  Cp  = N/A (one-sided spec)
  Cpk = (Mean - LSL) / (3 * sigma)
      = (0.4118 - 0.35) / (3 * 0.0238)
      = 0.0618 / 0.0714
      = 0.866  --> BELOW TARGET

  Estimated PPM below LSL = 4,723 (0.47%)

CONCLUSION: Process is NOT capable (Cpk < 1.33).
  Recommended action: Investigate active alignment process.
  Target: Cpk >= 1.33 requires sigma <= 0.0155 or mean >= 0.4097 with tighter distribution.
```

**Cpk Interpretation Guide:**

| Cpk Value | Interpretation | Estimated Defect Rate |
|-----------|---------------|----------------------|
| < 1.0 | Not capable | > 2,700 PPM (0.27%) |
| 1.0 - 1.33 | Barely capable | 66 - 2,700 PPM |
| 1.33 | Standard target | 66 PPM |
| 1.67 | OEM critical process target | 0.6 PPM |
| 2.0 | World-class | 0.002 PPM |

**Real Template Sources:**
- [QI Macros Cp/Cpk Templates](https://www.qimacros.com/process-capability-analysis/)
- [1Factory Process Capability Guide](https://www.1factory.com/quality-academy/guide-process-capability.html)
- [mgt-tools Cp/Cpk Excel Template](https://mgt-tools.com/en/cp-cpk-capability-excel-free-template/)

**Fairbuild Replacement:** PARTIAL
- Cpk could be computed automatically by the Fairbuild platform from production log data (the platform already has all measurement values and spec limits).
- The Drift Agent could monitor Cpk trends over time and alert both parties when capability degrades.
- The study methodology (minimum 30 data points, process stability check) would need to be encoded as a platform feature.

---

### 4.7 Statistical Process Control (SPC) Charts

**Purpose:** Ongoing monitoring of process stability using control charts (X-bar/R, X-bar/S, p-chart, etc.).

**Who Creates:** Factory (quality/production)
**Who Receives:** Buyer (SQE) -- typically monthly or on request
**Typical Format:** Excel charts, SPC software exports, PDF reports

**Sample SPC Data (X-bar and R chart for MTF Center):**

```csv
subgroup,sample_1,sample_2,sample_3,sample_4,sample_5,x_bar,range
1,0.42,0.39,0.44,0.41,0.40,0.412,0.05
2,0.38,0.41,0.39,0.43,0.40,0.402,0.05
3,0.43,0.42,0.40,0.38,0.41,0.408,0.05
4,0.40,0.39,0.41,0.42,0.44,0.412,0.05
5,0.41,0.43,0.39,0.40,0.38,0.402,0.05
6,0.39,0.40,0.42,0.41,0.43,0.410,0.04
7,0.44,0.41,0.39,0.40,0.42,0.412,0.05
8,0.40,0.38,0.41,0.43,0.39,0.402,0.05
9,0.42,0.40,0.41,0.39,0.43,0.410,0.04
10,0.41,0.42,0.40,0.38,0.41,0.404,0.04
...
```

**Control Chart Calculations:**

```
X-bar Chart:
  Center Line (CL) = Grand Mean = 0.4074
  UCL = CL + A2 * R-bar = 0.4074 + 0.577 * 0.046 = 0.434
  LCL = CL - A2 * R-bar = 0.4074 - 0.577 * 0.046 = 0.381

R Chart:
  Center Line = R-bar = 0.046
  UCL = D4 * R-bar = 2.114 * 0.046 = 0.097
  LCL = D3 * R-bar = 0 * 0.046 = 0 (for n=5)
```

**Real Template Sources:**
- [Vertex42 Control Chart Template](https://www.vertex42.com/ExcelTemplates/control-chart.html)
- [Indzara SPC Chart Excel Template](https://indzara.com/statistical-process-control-chart-excel-template/)
- [Elsmar SPC Spreadsheet](https://elsmar.com/pdf_files/SPC%20Spreadsheet.xls)

**Fairbuild Replacement:** PARTIAL
- SPC data can be computed from production logs already flowing through the platform.
- The Drift Agent monitors trends (distribution shifts, values approaching limits).
- Full SPC charting with Western Electric rules, Nelson rules, etc. would be a platform feature, not a contract feature.

---

## 5. Delivery Phase

### 5.1 Packing List

**Purpose:** Itemized list of the contents of a shipment, detailing what is in each box/pallet.

**Who Creates:** Factory (shipping/logistics)
**Who Receives:** Buyer (receiving), customs, carrier
**Typical Format:** PDF, Excel

**Key Fields:**

| Field | Example |
|-------|---------|
| Packing List Number | PL-2605-001 |
| Date | 2026-05-20 |
| Shipper | Precision Optics Mfg., Bao'an, Shenzhen |
| Consignee | Acme Electronics Inc., San Jose, CA |
| PO Reference | PO-2026-04-0312 |
| Carrier | DHL Express |
| Tracking/AWB Number | 1234567890 |
| **Packing Details:** | |
| Carton 1 of 10 | 1,000 pcs ACM-CAM-13MP-R3 |
| | Net Weight: 1.8 kg |
| | Gross Weight: 2.5 kg |
| | Dimensions: 30x25x15 cm |
| Carton 2 of 10 | 1,000 pcs ACM-CAM-13MP-R3 |
| ... | ... |
| **Totals:** | |
| Total Cartons | 10 |
| Total Quantity | 10,000 pcs |
| Total Net Weight | 18.0 kg |
| Total Gross Weight | 25.0 kg |

**Real Template Sources:**
- [FedEx Packing List Template](https://www.fedex.com/gtm/pdf/UPL.pdf) -- PDF
- [UPS Packing List Template](https://www.ups.com/media/en/packinglist.pdf) -- PDF
- [DHL Packing List Template](https://www.dhl.com/content/dam/dhl/local/gb/dhl-global-forwarding/documents/pdf/gb-dgf-exporting-packing-list.pdf)
- [IncoDocs Packing List Template](https://incodocs.com/template/packing_list)
- [Flexport Packing List Template](https://www.flexport.com/help/604-packing-list-template-blank/)

**Fairbuild Replacement:** NO
- Packing lists are physical logistics documents required by carriers and customs. They serve a different function than quality/payment verification.
- Packing list data could be referenced in service order artifacts for completeness.

---

### 5.2 Advance Shipping Notice (ASN)

**Purpose:** Electronic notification sent before goods arrive, enabling the buyer to plan receiving and update inventory systems.

**Who Creates:** Factory (shipping/logistics)
**Who Receives:** Buyer (receiving, procurement systems)
**Typical Format:** EDI 856, XML, or email with structured data

**EDI 856 Key Segments:**

| Segment | Content | Example |
|---------|---------|---------|
| BSN | Beginning Segment | Shipment #SHP-2605-001, Date 2026-05-20, Purpose "Original" |
| HL (Shipment) | Shipment level | Weight 25.0 kg, 10 cartons |
| HL (Order) | Order level | PO-2026-04-0312 |
| HL (Tare) | Pack level | Carton 1 of 10, SSCC barcode |
| HL (Item) | Item level | ACM-CAM-13MP-R3, Qty 1000, Lot LOT-2605-001 |
| TD5 | Carrier | DHL Express, SCAC "DHLX" |
| REF | References | BOL number, tracking number |
| DTM | Dates | Ship date 2026-05-20, ETA 2026-05-23 |

**Real Template Sources:**
- [SPS Commerce EDI 856 Guide](https://www.spscommerce.com/edi-document/edi-856-advance-shipping-notice/)
- [PackageX ASN & EDI 856 Guide](https://packagex.io/blog/asn-edi-856-guide)
- [Cardinal Health 856 Implementation Guide](https://www.cardinalhealth.com/content/dam/corp/web/documents/brochure/cardinal-health-856-4010-advanced-shipment-notice.pdf)

**Fairbuild Replacement:** NO
- ASNs are logistics documents. Fairbuild could receive ASN data as a trigger for the review window (shipment sent = start 72-hour clock).

---

### 5.3 Commercial Invoice

**Purpose:** Official document for customs, declaring the value of goods being exported/imported.

**Who Creates:** Factory (export department)
**Who Receives:** Buyer, customs authorities, freight forwarder
**Typical Format:** PDF, standardized form

**Key Fields:**

| Field | Example |
|-------|---------|
| Invoice Number | INV-2605-POM-001 |
| Invoice Date | 2026-05-20 |
| Exporter | Precision Optics Mfg., Shenzhen, China |
| Importer | Acme Electronics Inc., San Jose, CA, USA |
| Country of Origin | China |
| HS Code | 8525.80.40 (Television cameras, digital cameras) |
| Incoterms | FOB Shenzhen |
| Currency | USD |
| Item Description | Camera Module Assembly, 13MP |
| Quantity | 10,000 pcs |
| Unit Price | $4.18 |
| Total Value | $41,800.00 |
| Net Weight | 18.0 kg |
| Gross Weight | 25.0 kg |
| Payment Terms | Net 45 / T/T |
| Declaration | "I declare that the above is true and correct" |

**Real Template Sources:**
- [IncoDocs Commercial Invoice](https://incodocs.com/template/commercial_invoice)
- [DocuSign Commercial Invoice Template](https://www.docusign.com/templates/commercial-invoice)
- [eForms International Commercial Invoice](https://eforms.com/invoice-template/commercial/)

**Fairbuild Replacement:** NO
- Commercial invoices are legal documents required by customs authorities for international trade. They cannot be replaced by a smart contract.
- However, the invoice amount should match the settlement amount computed by the Fairbuild contract.

---

### 5.4 Customs Documentation

**Purpose:** Various documents required for international shipments to clear customs.

**Who Creates:** Factory (shipper), freight forwarder, customs broker
**Who Receives:** Customs authorities (both export and import)

**Documents Include:**

| Document | Purpose | Created By |
|----------|---------|------------|
| Bill of Lading (B/L) | Contract of carriage (sea) | Carrier |
| Air Waybill (AWB) | Contract of carriage (air) | Carrier |
| Certificate of Origin (CO) | Proves where goods were made | Chamber of Commerce |
| Export License | Permission to export controlled goods | Government |
| Import Declaration | Declaration of imported goods | Customs broker |
| Phytosanitary Certificate | For agricultural/organic materials | Government agency |
| AES/EEI Filing | US export electronic filing | Exporter/agent |

**Fairbuild Replacement:** NO
- Customs documents are regulatory requirements. Completely outside Fairbuild scope.

---

### 5.5 Delivery Receipt / Proof of Delivery (POD)

**Purpose:** Confirmation that goods were received at the destination.

**Who Creates:** Carrier (signed by receiver)
**Who Receives:** All parties
**Typical Format:** Carrier's form, electronic POD

**Key Fields:**

| Field | Example |
|-------|---------|
| Delivery Date/Time | 2026-05-23 14:32 |
| Recipient Name | R. Patel |
| Location | Acme Receiving Dock C |
| Number of Packages | 10 cartons |
| Condition | Good / Damaged (note) |
| Signature | [electronic signature] |
| Carrier Reference | DHL AWB 1234567890 |

**Fairbuild Replacement:** NO
- Physical delivery verification. The Fairbuild service order status could advance from "Delivered" when POD is confirmed, but the POD itself is a carrier document.

---

## 6. Post-Delivery Phase

### 6.1 Invoice (Supplier Invoice)

**Purpose:** Factory's formal request for payment for goods delivered.

**Who Creates:** Factory (accounts receivable)
**Who Receives:** Buyer (accounts payable)
**Typical Format:** PDF, ERP-generated
**EDI Equivalent:** EDI 810 (Invoice)

**Key Fields:**

| Field | Example |
|-------|---------|
| Invoice Number | INV-2605-POM-001 |
| Invoice Date | 2026-05-20 |
| PO Reference | PO-2026-04-0312 |
| Payment Terms | Net 45 |
| Due Date | 2026-07-04 |
| Bill To | Acme Electronics Inc. |
| Remit To | Precision Optics Mfg., Bank of China, Acct #XXXX |
| Line Items | ACM-CAM-13MP-R3, 10,000 pcs @ $4.18 = $41,800.00 |
| Subtotal | $41,800.00 |
| Shipping | $850.00 |
| Tax | $0.00 |
| Total Due | $42,650.00 |

**Fairbuild Replacement:** YES
- Invoices are eliminated entirely. Payment flows automatically from escrow upon oracle attestation and SVT mint.
- The settlement record on-chain serves as both invoice and receipt.
- Platform fees (0.75% cloud / 0.50% hosted) are deducted automatically -- no invoicing for platform fees either.

---

### 6.2 Goods Receipt / Receiving Report

**Purpose:** Buyer's formal record that goods were received and inspected.

**Who Creates:** Buyer (receiving/warehouse)
**Who Receives:** Buyer internal (AP triggers payment, quality triggers IQR)
**Typical Format:** ERP form, Excel, mobile app

**Key Fields:**

| Field | Example |
|-------|---------|
| GR Number | GR-2026-05-0089 |
| Date Received | 2026-05-23 |
| PO Number | PO-2026-04-0312 |
| Supplier | Precision Optics Mfg. |
| Carrier | DHL Express |
| AWB/Tracking | 1234567890 |
| Qty Ordered | 10,000 |
| Qty Received | 10,000 |
| Qty Accepted | 10,000 (pending IQR) |
| Qty Rejected | 0 |
| Packing Condition | Good |
| Documents Received | CoC, packing list, commercial invoice |
| Storage Location | WH-B, Rack 14, Shelf 3 |
| Inspector | R. Patel |
| Notes | All 10 cartons received in good condition |

**Real Template Sources:**
- [SafetyCulture Receiving Report Template](https://safetyculture.com/checklists/receiving-report)
- [Documentero Goods Received Note](https://documentero.com/templates/operations-logistics/document/goods-received-note/)
- [Lumiform Receiving Report Templates](https://lumiformapp.com/resources-checklists/receiving-report-checklist)

**Fairbuild Replacement:** PARTIAL
- The on-chain lot/service order status tracks delivery and acceptance.
- Physical receiving (counting cartons, checking for shipping damage) remains manual.

---

### 6.3 Return Material Authorization (RMA)

**Purpose:** Formal process for returning defective or non-conforming products to the factory.

**Who Creates:** Buyer (quality/procurement)
**Who Receives/Processes:** Factory (customer service/quality)
**Typical Format:** Form (Word/Excel/online)

**Key Fields:**

| Field | Example |
|-------|---------|
| RMA Number | RMA-2026-06-0015 |
| Date Issued | 2026-06-10 |
| Customer | Acme Electronics Inc. |
| Contact | R. Patel, Quality Engineer |
| PO Reference | PO-2026-04-0312 |
| Part Number | ACM-CAM-13MP-R3 |
| Lot Number | LOT-2605-001 |
| Quantity Returning | 153 units |
| Reason for Return | 148 units failed MTF corner spec at incoming inspection; 5 units with cracked lens |
| Failure Description | MTF corner (0.7H) measured 0.18-0.23 cy/px (spec >= 0.25). Suspect active alignment drift. |
| Desired Resolution | Replace defective units; root cause analysis within 14 days |
| Return Shipping | Factory to provide prepaid shipping label |
| Credit/Replace | Replace with conforming units |
| Authorization | Approved by: Q. Zhang (Supplier) |
| Ship To | Precision Optics Mfg., Returns Dept, Bao'an, Shenzhen |

**Real Template Sources:**
- [EW Manufacturing RMA Form Template](https://info.ewmfg.com/download-free-template-rma-form-excel-template)
- [Cisco RMA Request Form](https://www.cisco.com/c/dam/en_us/services/acquisitions/downloads/return-material-authorization-form.doc)
- [Sorbent Systems RMA Form](https://www.sorbentsystems.com/RMA.pdf)

**Fairbuild Replacement:** PARTIAL
- The challenge/reinspection mechanism handles the quality dispute aspect.
- Defect penalty (from ERS `defect_penalty_bps`) handles financial impact automatically.
- Physical return of goods requires logistics coordination outside the platform.
- A "SCAR service order" could be created on Fairbuild to track the resolution.

---

### 6.4 Supplier Corrective Action Report (SCAR)

**Purpose:** Formal request for the factory to investigate a quality issue, identify root cause, and implement corrective actions to prevent recurrence.

**Who Creates:** Buyer (quality/SQE)
**Who Receives/Completes:** Factory (quality team)
**Typical Format:** Excel/Word form, 2-5 pages

**Key Sections:**

| Section | Content | Example |
|---------|---------|---------|
| SCAR Number | Tracking ID | SCAR-2026-0023 |
| Date Issued | When buyer sends | 2026-06-12 |
| Severity | Critical / Major / Minor | Major |
| Part Number | Affected product | ACM-CAM-13MP-R3 |
| Lot/Date Code | Affected lots | LOT-2605-001 |
| Quantity Affected | How many | 153 of 10,000 (1.53%) |
| Problem Description | What happened | "148 units failed MTF corner specification at incoming inspection" |
| Containment Actions (D3) | Immediate actions | "Segregated remaining inventory from LOT-2605-001. 100% re-test of held stock." |
| Root Cause Analysis (D4) | Why it happened | "Active alignment station AA-STN-01 chuck vacuum degraded, causing lens tilt variation" |
| Root Cause Method | Analysis tool | 5-Why, Fishbone, Fault Tree |
| Corrective Actions (D5-D6) | Permanent fix | "Replace vacuum chuck (PM schedule added). Add tilt pre-check before alignment." |
| Verification (D7) | Proof the fix works | "50-unit validation run: 100% pass, Cpk MTF corner = 1.52" |
| Prevention (D7) | Systemic changes | "Added vacuum pressure check to daily PM checklist across all AA stations" |
| Response Deadline | Factory must respond by | 14 days from issuance |
| Closure | Buyer accepts resolution | "SCAR closed 2026-07-01. Verified corrective action effective." |

**Real Template Sources:**
- [Graco 8D SCAR Form](https://www.graco.com/content/dam/graco/suppliers/Graco%208D%20Form%20-%20SCAR.xls) -- Excel download
- [Creation Technologies 8D SCAR Training](https://www.creationtech.com/wp-content/uploads/2022/09/8D-Supplier-Training-9-22-22.pdf)
- [Keysight RCCA/SCAR Guideline](https://about.keysight.com/en/supplier/KeysightRCCA_Guideline.pdf)
- [SMA Supplier Corrective Action Procedure](https://files.sma.de/downloads/SMA-GSQ-004-Supplier-Corrective-Action-V2-Procedure-en.pdf)
- [ISO 9001 Help Supplier Corrective Action Procedure](https://www.iso9001help.co.uk/Examples/Supplier-corrective-action-procedure.pdf)

**Fairbuild Replacement:** NO (but interfaces strongly)
- SCARs involve narrative analysis, root cause investigation, and process changes that cannot be encoded in a smart contract.
- However, the Fairbuild data (lot quality results, challenge/reinspection records, historical defect trends) provides the evidence base for SCARs.
- SCAR closure could trigger an ERS update (`propose_ers`) if the corrective action changes acceptance criteria.
- A future Fairbuild feature could track SCAR lifecycle and link to affected service orders.

---

### 6.5 8D Problem Solving Report

**Purpose:** Structured problem-solving methodology (8 Disciplines) used to address quality issues. Often used as the response format for SCARs.

**Who Creates:** Factory (cross-functional team)
**Who Receives:** Buyer (quality/SQE)
**Typical Format:** Excel/Word form

**The 8 Disciplines:**

| Discipline | Content | Example |
|------------|---------|---------|
| D1: Team | Cross-functional team | "Q. Zhang (QE Lead), L. Wang (Mfg Eng), C. Liu (Process Eng), H. Chen (Maintenance)" |
| D2: Problem Description | IS/IS NOT analysis | "148/10,000 units (1.48%) failed MTF corner. Only AA-STN-01; STN-02 and STN-03 not affected. Only lots from May 8-15." |
| D3: Containment | Immediate actions | "100% re-sort of held inventory (2,400 units). 47 additional failures found and segregated." |
| D4: Root Cause | Analysis with evidence | "Vacuum chuck seal degraded (5mm crack), reducing holding force from 85 kPa to 62 kPa. Parts slipped during UV cure." |
| D5: Corrective Actions | Chosen permanent fixes | "1. Replace all vacuum chuck seals. 2. Add vacuum pressure interlock (alarm at <75 kPa). 3. Weekly seal inspection." |
| D6: Implementation | Action plan with dates | "Seal replacement: completed 2026-06-18. Interlock: installed 2026-06-20. Procedure update: 2026-06-22." |
| D7: Prevention | Systemic prevention | "PM schedule updated: vacuum chuck seal inspection every 500 hours. Added to FMEA with RPN recalculation." |
| D8: Closure | Congratulate team | "Effective. 10,000 units produced post-fix: 0 MTF corner failures. SCAR closed." |

**Fairbuild Replacement:** NO
- 8D is a problem-solving methodology document. Fairbuild provides the data that triggers and informs 8D investigations.

---

### 6.6 Warranty Claim

**Purpose:** Request for remedy (repair, replacement, or refund) for products that fail within the warranty period.

**Who Creates:** Buyer (quality/procurement)
**Who Receives:** Factory (quality/customer service)
**Typical Format:** Form (PDF/Excel/online portal)

**Key Fields:**

| Field | Example |
|-------|---------|
| Claim Number | WC-2026-0031 |
| Date Filed | 2026-09-15 |
| Part Number | ACM-CAM-13MP-R3 |
| Serial Numbers | SN-004287, SN-004301, SN-004455 |
| PO Reference | PO-2026-04-0312 |
| Date of Purchase | 2026-05-20 |
| Warranty Period | 18 months from delivery |
| Failure Description | Camera modules producing blurred images in field. MTF degraded to <0.20 after 3 months of use. |
| Failure Rate | 3 of 10,000 (0.03%) field returns in first 3 months |
| Root Cause (if known) | Suspected adhesive bond failure under thermal cycling |
| Requested Remedy | Replacement units + failure analysis report |
| Evidence Attached | Photos, customer complaint log, field test data |

**Fairbuild Replacement:** PARTIAL
- The SVT credential includes a timestamp, enabling warranty period verification.
- On-chain lot data provides traceability from field failure back to production batch.
- The financial claim itself (credit, replacement) could be a new service order on Fairbuild.

---

### 6.7 Credit / Debit Memo

**Purpose:** Financial adjustment document. Credit memo reduces amount owed (issued by factory for returns/defects). Debit memo increases amount owed (issued by buyer for quality failures, chargebacks).

**Who Creates:** Factory (credit memo) or Buyer (debit memo)
**Who Receives:** Counterparty's accounts dept
**Typical Format:** ERP-generated PDF

**Sample Credit Memo:**

```
CREDIT MEMO
Memo Number: CM-2026-0089
Date: 2026-07-01
From: Precision Optics Mfg.
To: Acme Electronics Inc.

Reference: PO-2026-04-0312, RMA-2026-06-0015

Reason: Defective units returned per SCAR-2026-0023

| Item              | Qty  | Unit Price | Amount     |
|-------------------|------|------------|------------|
| ACM-CAM-13MP-R3   | 153  | $4.18      | ($639.54)  |
| Return Shipping   | 1    | $125.00    | ($125.00)  |
|                   |      | TOTAL      | ($764.54)  |

This credit will be applied to your next invoice.
```

**Real Template Sources:**
- [Smartsheet Credit and Debit Note Templates](https://www.smartsheet.com/credit-debit-memos-notes)
- [InvoiceOwl Credit Memo Template](https://www.invoiceowl.com/credit-memo-template/)

**Fairbuild Replacement:** YES
- Defect penalties are computed automatically from ERS thresholds and deducted from settlement.
- The credit ledger in the service fabric handles credit accumulation and redemption.
- No manual credit/debit memos needed -- the smart contract computes and applies adjustments algorithmically.

---

## 7. Ongoing Relationship

### 7.1 Supplier Scorecard / Performance Review

**Purpose:** Periodic (monthly/quarterly) evaluation of factory performance across key metrics.

**Who Creates:** Buyer (procurement/quality)
**Who Receives:** Factory (management, quality)
**Typical Format:** Excel dashboard, PowerPoint

**Sample Scorecard:**

```
SUPPLIER PERFORMANCE SCORECARD
Supplier: Precision Optics Mfg.
Period: Q2 2026 (April - June)
Reviewer: S. Chen, Procurement Manager

CATEGORY          | WEIGHT | METRIC               | TARGET  | ACTUAL  | SCORE (1-5)
Quality           | 35%    | PPM (defect rate)    | <500    | 1,530   | 2
                  |        | SCAR response time   | <14 days| 12 days | 4
                  |        | SCAR closure rate    | >90%    | 85%     | 3
                  |        | Cpk (avg critical)   | >1.33   | 1.18    | 2
Delivery          | 25%    | On-Time Delivery     | >95%    | 97%     | 5
                  |        | Lead Time Compliance | >90%    | 92%     | 4
Cost              | 20%    | Price Competitiveness| Target  | +2%     | 3
                  |        | Cost Reduction Ideas | 2/qtr   | 1       | 2
Service           | 10%    | Communication        | --      | Good    | 4
                  |        | Technical Support    | --      | Good    | 4
Innovation        | 10%    | DFM Suggestions      | 1/qtr   | 2       | 5
                  |        | Technology Roadmap   | Shared  | Yes     | 5

WEIGHTED SCORE: 3.25 / 5.00 = 65% --> NEEDS IMPROVEMENT

RATING SCALE:
  5 (90-100%) = Preferred Supplier
  4 (75-89%)  = Approved Supplier
  3 (60-74%)  = Conditional / Improvement Required
  2 (40-59%)  = Probationary
  1 (<40%)    = Phase Out
```

**Real Template Sources:**
- [SourceDay Supplier Scorecard Template](https://sourceday.com/blog/supplier-scorecard/) -- Free Excel
- [Smartsheet QBR Templates](https://www.smartsheet.com/business-review-qbr-templates)
- [Ramp Supplier Scorecard Guide](https://ramp.com/blog/supplier-scorecard-metrics)
- [Kodiak Hub Supplier Scorecard Template](https://www.kodiakhub.com/templates/supplier-scorecard)

**Fairbuild Replacement:** PARTIAL
- Quality metrics (PPM, yield, defect rates) are automatically computable from on-chain data.
- Delivery metrics could be derived from service order timestamps.
- The SVT count and quality credential history serves as a tamper-proof scorecard.
- Subjective metrics (communication quality, innovation) remain outside the platform.

---

### 7.2 Annual Business Review (ABR) Deck

**Purpose:** Comprehensive annual review of the buyer-factory relationship covering performance, issues, strategy, and forward plans.

**Who Creates:** Both parties collaboratively
**Who Receives:** Senior management on both sides
**Typical Format:** PowerPoint, 20-40 slides

**Typical ABR Agenda:**

| Section | Content |
|---------|---------|
| Relationship Overview | History, volumes, revenue, key milestones |
| Quality Performance | Year-over-year trends: PPM, Cpk, SCAR history, field returns |
| Delivery Performance | OTD trends, lead time trends, capacity utilization |
| Cost Performance | Price trends, cost reduction achievements, VA/VE projects |
| New Product Introduction | NPI projects, timelines, status |
| Technology Roadmap | Factory's capability development plans |
| Issues & Risks | Open items, concerns, resource constraints |
| Continuous Improvement | Kaizen events, process improvements, investment plans |
| Business Forecast | Volume forecast, growth plans, new programs |
| Action Items | Agreed actions with owners and deadlines |

**Real Template Sources:**
- [Smartsheet ABR/QBR Templates](https://www.smartsheet.com/business-review-qbr-templates)
- [Template.net Annual Business Review](https://www.template.net/edit-online/421297/annual-business-review)

**Fairbuild Replacement:** NO
- ABRs are strategic business documents involving human judgment, relationship management, and forward planning.
- Fairbuild data could populate the quality and delivery sections automatically, saving preparation time.

---

### 7.3 Engineering Change Notice (ECN) / Engineering Change Order (ECO)

**Purpose:** Formal notification and management of changes to product design, specifications, materials, or processes.

**Who Creates:** Either party (whoever initiates the change)
**Who Receives/Approves:** Both parties
**Typical Format:** Form (Word/Excel/PLM system)

**Key Fields:**

| Field | Example |
|-------|---------|
| ECN Number | ECN-2026-0034 |
| ECN Date | 2026-07-15 |
| Change Type | Design / Process / Material / Specification |
| Urgency | Routine / Urgent / Emergency |
| Initiator | J. Park, Optical Engineer, Acme Electronics |
| Part Number Affected | ACM-CAM-13MP-R3 |
| Current Revision | Rev C |
| New Revision | Rev D |
| Description of Change | "Change IR filter from 650nm to 680nm cutoff to improve color rendering" |
| Reason for Change | "Customer feedback: color temperature too cool under fluorescent lighting" |
| Documents Affected | ERS-CAM13 (v2.3 -> v2.4), DWG-2026-0412 (Rev C -> Rev D) |
| Impact Analysis | Cost: +$0.02/unit (new filter). Schedule: 4-week qualification. Quality: new MTF baseline needed |
| Effectivity | "Effective lot LOT-2608-001 forward. No retrofit of existing inventory." |
| Approvals Required | OEM Engineering, OEM Quality, Factory Engineering, Factory Quality |
| Approval Signatures | [names, dates, signatures] |

**Real Template Sources:**
- [Sitemate ECN Template](https://sitemate.com/templates/commercial/forms/engineering-change-notice-template-ecn/)
- [PTC ECN Guide](https://www.ptc.com/en/blogs/plm/what-is-an-engineering-change-notification)
- [Arena Solutions ECN Guide](https://www.arenasolutions.com/resources/articles/engineering-change-notice/)
- [Amway Engineering Change Form](https://supplier.amway.com/wp-content/uploads/2019/09/SPECS-Engineering-Change-Form-E6407.pdf) -- Real OEM form
- [DOE Engineering Change Notice](https://www.osti.gov/servlets/purl/805643) -- Government template

**Fairbuild Replacement:** YES
- The `propose_ers` function with governance timelock is the on-chain equivalent of an ECN.
- Changes require quorum approval (2+ approvals) and a minimum delay (1 hour, configurable).
- ERS version is tracked on-chain with full history.
- Key advantage: changes are transparent, timestamped, and cannot be disputed retroactively.

---

### 7.4 Deviation / Waiver Request

**Purpose:** Formal request to accept product that does not meet one or more specification requirements, either as a planned departure (deviation) or after-the-fact discovery (waiver).

**Who Creates:** Factory (quality/engineering)
**Who Receives/Approves:** Buyer (quality/engineering)
**Typical Format:** Form (Word/Excel)

**Key Fields:**

| Field | Example |
|-------|---------|
| Request Number | DEV-2026-0012 |
| Type | Deviation (planned) / Waiver (after-the-fact) |
| Date | 2026-08-05 |
| Part Number | ACM-CAM-13MP-R3 |
| Specification Deviated From | ERS-CAM13-v2.4, Section 3.2.2: MTF Corner >= 0.25 |
| Proposed Deviation | "Accept MTF Corner >= 0.22 for lot LOT-2608-002 (3,000 units)" |
| Reason | "Lens supplier lot variation. New lens lot arrives Aug 15. Deviation prevents production line shutdown." |
| Quantity Affected | 3,000 units |
| Duration | One lot (LOT-2608-002 only) |
| Risk Assessment | "Analysis shows 0.22 MTF corner still produces acceptable image quality for customer's use case. No field reliability impact." |
| Supporting Data | Attached: comparative image quality analysis, customer impact assessment |
| Disposition | Approved / Rejected / Approved with conditions |
| Approver | S. Chen, Acme Quality Manager |
| Conditions | "Approved. Unit price reduced by $0.10 for deviated lot. SCAR required for lens supplier." |

**Real Template Sources:**
- [Collins Aerospace Deviation/Waiver Request Form](https://www.rtx.com/collinsaerospace/-/media/CA/suppliers/hutc/supplier-request-for-deviation-waiver-sis-oh-wv.doc)
- [Ocean Observatories Deviation/Waiver Form](https://oceanobservatories.org/wp-content/uploads/2011/03/3101-00071_Deviation__Waiver_Request-Form_2011-01-01_ver_1-00.pdf)
- [JELD-WEN Deviation Request Form](https://www.corporate.jeld-wen.com/~/media/Files/J/Jeld-Wen-Corp/working-with-suppliers/op05-f01-deviation-request-dr-rev-b.xlsx) -- Excel
- [SafetyCulture ISO 9001 Deviation Request](https://safetyculture.com/checklists/iso-9001-supplier-deviation-request)

**Fairbuild Replacement:** PARTIAL
- A deviation could be modeled as a temporary ERS modification (`propose_ers` with scoped applicability).
- The defect penalty mechanism handles the financial impact of accepting out-of-spec product.
- The narrative justification and risk assessment require human judgment and documentation outside the platform.

---

### 7.5 Continuous Improvement Report / Kaizen Report

**Purpose:** Documents incremental process improvements, their impact, and lessons learned.

**Who Creates:** Factory (quality/production)
**Who Receives:** Buyer (SQE, procurement)
**Typical Format:** A3 report (single page), Excel, PowerPoint

**Sample Kaizen Report:**

```
KAIZEN REPORT
Project: Reduce MTF Corner Rejection Rate
Part: ACM-CAM-13MP-R3
Period: Q2-Q3 2026
Team Lead: L. Wang, Manufacturing Engineering

CURRENT STATE (Before):
  MTF Corner rejection rate: 1.53% (153/10,000)
  Cpk: 1.18
  Cost of quality: $6,400/month (rework + scrap)

ROOT CAUSE:
  Active alignment vacuum chuck seal degradation
  + Inadequate PM frequency

IMPROVEMENTS IMPLEMENTED:
  1. PM frequency: 1000 hrs -> 500 hrs for chuck seals
  2. Vacuum pressure interlock alarm (<75 kPa)
  3. New chuck material (Viton -> Kalrez) for longer life
  4. Pre-alignment tilt check added

FUTURE STATE (After):
  MTF Corner rejection rate: 0.08% (8/10,000)
  Cpk: 1.67
  Cost of quality: $320/month

IMPROVEMENT: 95% reduction in rejections, $6,080/month savings
ANNUALIZED SAVINGS: $72,960
```

**Real Template Sources:**
- [SafetyCulture Kaizen Report Template](https://safetyculture.com/checklists/kaizen-tools)
- [CI Toolkit Kaizen Report Template](https://citoolkit.com/templates/kaizen-report-template/)
- [KaizenKit A3 Report](https://www.kaizenkit.io/a3-report/)

**Fairbuild Replacement:** NO
- Continuous improvement is a human-driven process. Fairbuild data (quality trends, Cpk history, rejection rates) provides the input for CI projects.
- The platform's Drift Agent could automatically identify CI opportunities by detecting negative trends.

---

### 7.6 Quarterly Quality Metrics Report

**Purpose:** Regular reporting of key quality indicators from factory to buyer.

**Who Creates:** Factory (quality)
**Who Receives:** Buyer (SQE, procurement)
**Typical Format:** Excel dashboard, PDF report

**Sample Metrics:**

```
QUARTERLY QUALITY METRICS
Supplier: Precision Optics Mfg.
Quarter: Q3 2026 (July - September)

| Metric                        | Target    | Jul    | Aug    | Sep    | Q3 Avg |
|-------------------------------|-----------|--------|--------|--------|--------|
| Overall Yield (%)             | >= 97.5   | 98.2   | 98.5   | 98.8   | 98.5   |
| PPM (defects per million)     | <= 500    | 180    | 150    | 120    | 150    |
| Cpk - MTF Center              | >= 1.33   | 1.45   | 1.52   | 1.58   | 1.52   |
| Cpk - MTF Corner              | >= 1.33   | 1.42   | 1.55   | 1.67   | 1.55   |
| Cpk - Module Height            | >= 1.67   | 1.78   | 1.82   | 1.85   | 1.82   |
| On-Time Delivery (%)          | >= 95     | 97     | 98     | 96     | 97     |
| SCAR Open                     | 0         | 1      | 0      | 0      | --     |
| Customer Complaints           | 0         | 0      | 0      | 0      | 0      |
| GR&R Compliance (%)           | 100       | 100    | 100    | 100    | 100    |
| Calibration Overdue (count)   | 0         | 0      | 1      | 0      | --     |

TREND: Improving. MTF Corner Cpk improved from 1.18 (Q2) to 1.55 (Q3) following
       SCAR-2026-0023 corrective actions.
```

**Fairbuild Replacement:** PARTIAL
- All of these metrics except GR&R and calibration can be computed automatically from on-chain production data.
- The platform could generate this report automatically from the hypertext contract data.

---

## 8. Fairbuild Replacement Assessment Summary

### Documents Fully Replaced by Fairbuild (YES)

| Document | How Fairbuild Replaces It |
|----------|--------------------------|
| Purchase Order (PO) | `create_service_order` with escrow deposit |
| Engineering Requirements Specification (ERS) | Hypertext contract with AI-extracted acceptance criteria |
| Pricing Schedule / Rate Card | `Pricing` struct with `price_per_unit`, tiers, penalties |
| Payment Terms | Escrowed settlement on SVT mint (hours, not months) |
| Certificate of Conformance (CoC) | SVT (Service Validation Token) -- tamper-proof on-chain |
| Certificate of Analysis (CoA) | Hypertext view with statistical summary from production data |
| Test Report | Hypertext view with per-unit pass/fail and aggregate stats |
| Invoice | Eliminated -- automatic settlement from escrow |
| Credit / Debit Memo | Defect penalties computed algorithmically |
| Engineering Change Notice (ECN) | `propose_ers` with governance timelock and quorum |

### Documents Partially Replaced (PARTIAL)

| Document | What Fairbuild Handles | What Remains Outside |
|----------|----------------------|---------------------|
| RFQ | Technical specs and pricing in contract | Solicitation/bidding process |
| Supplier Qualification Questionnaire | SVT history as capability proof | Financial, legal, facility details |
| Factory Audit Checklist | Digital quality trail | Physical facility inspection |
| MSA | Quality, pricing, payment, change management | IP, indemnification, force majeure, legal |
| SOW | Service request with criteria and artifacts | Narrative scope, assumptions, resources |
| Quality Agreement | Metrics, change notification, penalties | Audit rights, document retention, regulatory |
| FAIR (First Article Inspection) | Sandbox mode = digital FAIR | Material/process traceability forms |
| In-Process Inspection Records | Can be submitted as artifacts | Internal factory operations |
| Control Plan / Inspection Plan | Acceptance criteria (specs) | Internal factory controls (gages, frequency) |
| Material Certificates | Hash on-chain, potentially validate | Physical material verification |
| IQR (Incoming Quality Report) | Challenge/reinspection mechanism | Physical receiving inspection |
| Goods Receipt | Service order status tracking | Physical receiving |
| RMA | Quality dispute + financial adjustment | Physical return logistics |
| Warranty Claim | SVT traceability, lot history | Narrative claim, remedy negotiation |
| Deviation / Waiver Request | Temporary ERS modification | Risk assessment narrative |
| Supplier Scorecard | Auto-computed quality/delivery metrics | Subjective metrics |
| Quarterly Quality Metrics | Auto-computed from production data | GR&R, calibration compliance |
| Cpk Report | Computable from production log data | Study methodology validation |
| SPC Charts | Drift Agent monitors trends | Full Western Electric / Nelson rules |

### Documents NOT Replaced (NO)

| Document | Why | Interface with Fairbuild |
|----------|-----|-------------------------|
| RFP (Request for Proposal) | Pre-relationship, strategic | SVT credentials inform evaluation |
| NDA | Legal document, court-enforceable | Hash on-chain for existence proof |
| BOM (Bill of Materials) | Engineering/procurement document | BOM rev referenced in ERS version |
| Work Order / Production Order | Internal factory planning | Service order triggers WO creation |
| Process Routing / Traveler | Internal factory operations | Routing data as optional artifacts |
| Gauge R&R Study | Measurement system validation | Results stored as qualification artifact |
| Packing List | Physical logistics document | Referenced in delivery artifacts |
| ASN (Advance Shipping Notice) | Logistics notification | Could trigger review window |
| Commercial Invoice | Customs/legal requirement | Amount should match settlement |
| Customs Documentation | Regulatory requirement | Outside scope |
| Delivery Receipt / POD | Carrier document | Could trigger status update |
| SCAR / 8D Report | Narrative problem-solving | Fairbuild data informs investigation |
| ABR (Annual Business Review) | Strategic business document | Data populates quality sections |
| Continuous Improvement / Kaizen | Human-driven process improvement | Drift Agent identifies opportunities |

### Summary Counts

| Category | Count | Percentage |
|----------|-------|------------|
| **YES (Fully Replaced)** | 10 | 29% |
| **PARTIAL (Core Replaced)** | 17 | 50% |
| **NO (Not Replaced)** | 7 | 21% |
| **Total Documents** | 34 | 100% |

The 10 fully-replaced documents represent the **highest-friction, highest-cost** pain points in buyer-factory relationships: payment delays, quality disputes, specification ambiguity, and manual verification. This is where Fairbuild delivers the most value.

---

## 9. Real Production Data Formats in the Wild

### 9.1 Kaggle Datasets for Manufacturing Quality

**Dataset: Predicting Manufacturing Defects**
- **URL:** https://www.kaggle.com/datasets/rabieelkharoua/predicting-manufacturing-defects-dataset
- **Content:** Synthetic manufacturing data with 17 features for defect prediction
- **Format:** CSV
- **Columns:** ProductionVolume, ProductionCost, SupplierQuality, DeliveryDelay, DefectRate, QualityScore, MaintenanceHours, DowntimePercentage, InventoryTurnover, StockoutRate, WorkerProductivity, SafetyIncidents, EnergyConsumption, EnergyEfficiency, AdditiveProcessTime, DefectStatus (target)
- **Sample Values:** ProductionVolume=1245, SupplierQuality=87.3, DefectRate=0.023
- **Acceptance Criteria:** DefectRate < threshold, QualityScore > minimum

**Dataset: Manufacturing Defects - Industry Dataset**
- **URL:** https://www.kaggle.com/datasets/gabrielsantello/manufacturing-defects-industry-dataset
- **Content:** Real manufacturing defect data with process parameters
- **Format:** CSV

**Dataset: Bosch Production Line Performance**
- **URL:** https://www.kaggle.com/c/bosch-production-line-performance/data
- **Content:** Anonymized production line data with 4,265 features
- **Format:** CSV (compressed)
- **Columns:** Thousands of anonymized sensor readings (date, numeric, categorical features)
- **Relevance:** Real industrial data showing scale of production test data

**Dataset: Casting Product Image Data for Quality Inspection**
- **URL:** https://www.kaggle.com/datasets/ravirajsinh45/real-life-industrial-dataset-of-casting-product
- **Content:** Grayscale images of pump impeller castings -- defective vs. non-defective
- **Format:** Images (PNG/JPG)
- **Relevance:** Visual inspection data for Fairbuild's image classification criteria

**Dataset: Severstal Steel Defect Detection**
- **URL:** https://www.kaggle.com/c/severstal-steel-defect-detection
- **Content:** Steel surface images with defect annotations (4 defect classes)
- **Format:** Images + CSV annotations

**Dataset: Production Quality**
- **URL:** https://www.kaggle.com/datasets/podsyp/production-quality
- **Content:** Production quality measurements from a manufacturing process
- **Format:** CSV

### 9.2 GitHub Repositories with Industrial Data

**Repository: awesome-industrial-datasets**
- **URL:** https://github.com/jonathanwvd/awesome-industrial-datasets
- **Content:** Curated collection of public industrial datasets organized by category
- **Categories:** Production, Maintenance, Quality, Energy, Process Control

**Repository: industrial-ml-datasets**
- **URL:** https://github.com/nicolasj92/industrial-ml-datasets
- **Content:** Curated list for ML research in manufacturing
- **Notable Datasets:**
  - Multi-Stage Continuous Flow Process (process parameters + quality measurements)
  - PHM2008 (prognostics challenge, bearing degradation)
  - Tennessee Eastman Process (chemical process simulation)

**Repository: awesome-industrial-machine-datasets**
- **URL:** https://github.com/makinarocks/awesome-industrial-machine-datasets
- **Content:** Industrial machine datasets for predictive maintenance and quality

### 9.3 CMM Measurement Report Format

**Typical CMM Output (CSV-like):**

```csv
feature_id,feature_type,characteristic,nominal,tolerance_plus,tolerance_minus,actual,deviation,result
F001,Diameter,Module_OD,8.500,0.050,-0.050,8.512,+0.012,PASS
F002,Diameter,Sensor_Well_ID,6.200,0.025,-0.025,6.188,-0.012,PASS
F003,Height,Module_Height,5.200,0.050,-0.050,5.183,-0.017,PASS
F004,Position,Lens_Center_X,0.000,0.015,-0.015,0.008,+0.008,PASS
F005,Position,Lens_Center_Y,0.000,0.015,-0.015,-0.011,-0.011,PASS
F006,Flatness,Mounting_Surface,0.000,0.020,0.000,0.009,+0.009,PASS
F007,Perpendicularity,Optical_Axis,0.000,0.010,0.000,0.007,+0.007,PASS
F008,True_Position,Connector_Pin_1,0.000,0.100,0.000,0.045,+0.045,PASS
F009,True_Position,Connector_Pin_2,0.000,0.100,0.000,0.062,+0.062,PASS
F010,Roundness,Barrel_OD,0.000,0.015,0.000,0.008,+0.008,PASS
```

**Standards Referenced:** QIF (ISO 23952), DMIS, I++

### 9.4 AOI (Automated Optical Inspection) Output Format

**Typical AOI Results (CSV-like):**

```csv
timestamp,board_serial,panel_position,component_ref,component_value,package_type,inspection_type,result,defect_code,defect_description,confidence,image_path
2026-05-10T08:15:22,PCB-000001,1-1,C12,100nF,0201,PRESENCE,PASS,,,,
2026-05-10T08:15:22,PCB-000001,1-1,C13,100nF,0201,PRESENCE,PASS,,,,
2026-05-10T08:15:22,PCB-000001,1-1,R5,10K,0201,PRESENCE,PASS,,,,
2026-05-10T08:15:22,PCB-000001,1-1,U1,EEPROM,SOT-23,PRESENCE,PASS,,,,
2026-05-10T08:15:22,PCB-000001,1-1,U1,EEPROM,SOT-23,SOLDER,FAIL,SOL003,Insufficient solder joint pin 1,0.92,/img/PCB-000001_U1_sol.png
2026-05-10T08:15:22,PCB-000001,1-1,U1,EEPROM,SOT-23,POLARITY,PASS,,,,
2026-05-10T08:15:22,PCB-000001,1-1,J1,BTB-24P,BTB,PRESENCE,PASS,,,,
2026-05-10T08:15:22,PCB-000001,1-1,J1,BTB-24P,BTB,ALIGNMENT,PASS,,0.3deg offset,0.88,
```

**IPC-CFX JSON Format (UnitsTested):**

```json
{
  "TransactionId": "abc-123-def",
  "TestMethod": "AOI",
  "Tester": {
    "UniqueIdentifier": "AOI-03",
    "Name": "Koh Young Zenith",
    "Vendor": "Koh Young"
  },
  "TestedUnits": [
    {
      "UnitIdentifier": "PCB-000001",
      "OverallResult": "Failed",
      "Tests": [
        {
          "TestName": "U1_Solder_Pin1",
          "Result": "Failed",
          "Measurements": [
            {
              "Name": "SolderVolume",
              "MeasuredValue": { "Value": 0.42, "Unit": "nL" },
              "ExpectedValue": { "Value": 0.80, "Unit": "nL" },
              "TolerancePlus": 0.30,
              "ToleranceMinus": 0.30,
              "Result": "Failed"
            }
          ],
          "Defects": [
            {
              "DefectCode": "SOL003",
              "DefectCategory": "Insufficient Solder",
              "Description": "Solder volume below minimum on U1 pin 1",
              "ComponentOfInterest": { "ReferenceDesignator": "U1", "PartNumber": "EEPROM-2K" },
              "Images": [
                { "MimeType": "image/png", "ImageData": "base64..." }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 9.5 STDF (Standard Test Data Format) -- Semiconductor

**Binary format (Teradyne, 1985). Converted to text for readability:**

```
FAR: CPU_TYPE=2, STDF_VER=4
MIR: LOT_ID="LOT-2605-001", PART_TYP="ACM-CAM-13MP", NODE_NAM="TST-STN-04",
     TSTR_TYP="Advantest V93000", JOB_NAM="CAM13_FINAL_v3.2",
     SETUP_T=1715342400, START_T=1715342400

PIR: HEAD_NUM=1, SITE_NUM=1
PTR: TEST_NUM=1, TEST_TXT="MTF_CENTER", RESULT=0.42, LO_LIMIT=0.35, HI_LIMIT=0,
     UNITS="cy/px", TEST_FLG=0x00 (PASS)
PTR: TEST_NUM=2, TEST_TXT="MTF_CORNER", RESULT=0.31, LO_LIMIT=0.25, HI_LIMIT=0,
     UNITS="cy/px", TEST_FLG=0x00 (PASS)
PTR: TEST_NUM=3, TEST_TXT="DARK_CURRENT", RESULT=11.2, LO_LIMIT=0, HI_LIMIT=16,
     UNITS="e-/s", TEST_FLG=0x00 (PASS)
PRR: HEAD_NUM=1, SITE_NUM=1, PART_FLG=0x00, NUM_TEST=10, HARD_BIN=1, SOFT_BIN=1,
     PART_ID="SN-000001", PART_FIX=""

PIR: HEAD_NUM=1, SITE_NUM=1
PTR: TEST_NUM=1, TEST_TXT="MTF_CENTER", RESULT=0.36, LO_LIMIT=0.35, ...
...
```

**Key Record Types:**

| Record | Abbreviation | Content |
|--------|-------------|---------|
| File Attributes | FAR | CPU type, STDF version |
| Master Information | MIR | Lot info, tester, program, start time |
| Part Information | PIR | Pre-test per-unit header |
| Parametric Test | PTR | Single measurement: name, value, limits, units |
| Multiple Parametric | MPR | Multi-result measurement |
| Functional Test | FTR | Pass/fail per functional test |
| Part Results | PRR | Cumulative per-unit result: bin assignments |
| Master Results | MRR | Lot-level summary statistics |
| Test Synopsis | TSR | Execution counts and failure counts per test |

### 9.6 MTConnect (Machine Tool Data) -- XML

```xml
<MTConnectStreams>
  <DeviceStream name="CNC-Mill-01" uuid="d1">
    <ComponentStream component="Path" name="path1">
      <Samples>
        <Position dataItemId="Xact" timestamp="2026-05-10T08:23:15Z"
                  name="Xact" subType="ACTUAL">125.432</Position>
        <SpindleSpeed dataItemId="Sspeed" timestamp="2026-05-10T08:23:15Z"
                      name="Sspeed" subType="ACTUAL">12000</SpindleSpeed>
        <FeedRate dataItemId="Frt" timestamp="2026-05-10T08:23:15Z"
                  name="Frt">2500</FeedRate>
      </Samples>
      <Events>
        <Execution dataItemId="exec" timestamp="2026-05-10T08:23:15Z">ACTIVE</Execution>
        <PartCount dataItemId="pc" timestamp="2026-05-10T08:23:15Z">1247</PartCount>
      </Events>
      <Condition>
        <Normal dataItemId="Xload" timestamp="2026-05-10T08:23:15Z" type="LOAD"/>
      </Condition>
    </ComponentStream>
  </DeviceStream>
</MTConnectStreams>
```

### 9.7 Summary of Data Formats

| Format | Industry | Type | Structure | Fairbuild Ingestion |
|--------|----------|------|-----------|-------------------|
| CSV (custom) | All manufacturing | Text | Flat table, custom columns | Primary -- Log Mapper Agent |
| JSON (IPC-CFX) | Electronics assembly | Text | Nested, standardized | Supported -- structured ingestion |
| XML (QIF) | Dimensional metrology | Text | Hierarchical, ISO 23952 | Parseable -- XML to criteria mapping |
| XML (MTConnect) | CNC machining | Text | Streaming, timestamped | Parseable -- time-series extraction |
| STDF (binary) | Semiconductor test | Binary | Record-based, Teradyne | Requires converter (STDF -> CSV) |
| AQDEF (K-fields) | Automotive quality | Text | Key-value, hierarchical | Requires parser (K-field mapping) |
| Excel (.xlsx) | All industries | Binary | Tabular, multi-sheet | Supported -- common upload format |
| PDF (reports) | All industries | Binary | Unstructured | ERS Parser Agent (AI extraction) |
| Images (PNG/JPG) | Visual inspection | Binary | Pixel data | Image classification criteria |

---

## 10. Sources and References

### Pre-Contract Phase
- [Smartsheet RFQ Templates](https://www.smartsheet.com/content/request-for-quote-rfq-templates)
- [VentureOutsource EMS RFQ Template](https://ventureoutsource.com/contract-manufacturing/rfq-template-ems-manufacturers-prepare-oem-quote)
- [Asana RFQ Template](https://asana.com/resources/rfq-template)
- [SiftHub RFQ Document Guide](https://www.sifthub.io/blog/rfq-document)
- [ABB Supplier Qualification Questionnaire](https://library.e.abb.com/public/f4e59b6901b6947bc1257b130057d8d9/9AKK102951%20ABB%20Supplier%20Qualification%20Questionnaire.xls)
- [PCC Aerostructures Supplier Quality System Questionnaire](https://www.pccaero.com/quality/aqs1001.docx)
- [GoAudits Factory Audit Checklists](https://goaudits.com/library/manufacturing/)
- [SafetyCulture Factory Audit Checklists](https://safetyculture.com/checklists/factory-audit/)
- [Sanmina Supplier NDA](https://www.sanmina.com/wp-content/uploads/2016/04/nda.pdf)

### Contract Phase
- [Juro MSA Template](https://juro.com/contract-templates/msa-master-services-agreement)
- [PandaDoc MSA Template](https://www.pandadoc.com/master-service-agreement-template/)
- [Smartsheet PO Templates](https://www.smartsheet.com/purchase-order-templates)
- [Vertex42 Excel PO Template](https://www.vertex42.com/ExcelTemplates/excel-purchase-order.html)
- [DocuSign SOW Template](https://www.docusign.com/templates/statement-of-work-sow)
- [Sanmina Supplier Quality Agreement](https://www.sanmina.com/pdf/partners/qaf-0082-c.pdf)
- [Zimmer Biomet Supplier Quality Agreement](https://www.zimmerbiomet.com/content/dam/zimmer-biomet/sourcing/emea/ZBV-AQF-FOR-022-09%20CF06028%20Rev%203%20SUPPLIER%20QUALITY%20AGREEMENT.pdf)
- [IPEC Quality Agreement Guide](https://www.gmp-compliance.org/files/guidemgr/2024-ipec-qa-guide-and-template-f-1721635446.pdf)

### Production Phase
- [Smartsheet BOM Templates](https://www.smartsheet.com/free-bill-of-materials-templates)
- [MSI Data Work Order Template](https://www.msidata.com/manufacturing-work-order-template/)
- [Metis Automation Traveller Guide](https://www.metisautomation.co.uk/create-manufacturing-traveler-guide/)
- [AIAG Control Plan Manual](https://www.aiag.org/training-and-resources/manuals/details/CP-1)
- [InspectionXpert AS9102 FAIR Guide](https://www.inspectionxpert.com/fai/as9102)

### Quality Phase
- [GoAudits Incoming Inspection Guide](https://goaudits.com/blog/incoming-inspections/)
- [IAQG CofC Template 9163](https://iaqg.org/wp-content/uploads/2023/12/SCMH-5.2.4-CofC-Template-9163-Rev-B-Dated-9MAR23.docx)
- [1Factory Process Capability Guide](https://www.1factory.com/quality-academy/guide-process-capability.html)
- [QI Macros Gage R&R](https://www.qimacros.com/gage-r-and-r-study/aiag-msa-gage-r-and-r/)
- [ASQ GR&R Resource](https://asq.org/quality-resources/gage-repeatability)
- [Vertex42 Control Chart Template](https://www.vertex42.com/ExcelTemplates/control-chart.html)

### Delivery Phase
- [SPS Commerce EDI 856 Guide](https://www.spscommerce.com/edi-document/edi-856-advance-shipping-notice/)
- [FedEx Packing List Template](https://www.fedex.com/gtm/pdf/UPL.pdf)
- [IncoDocs Commercial Invoice](https://incodocs.com/template/commercial_invoice)

### Post-Delivery Phase
- [Graco 8D SCAR Form](https://www.graco.com/content/dam/graco/suppliers/Graco%208D%20Form%20-%20SCAR.xls)
- [Keysight RCCA/SCAR Guideline](https://about.keysight.com/en/supplier/KeysightRCCA_Guideline.pdf)
- [EW Manufacturing RMA Form](https://info.ewmfg.com/download-free-template-rma-form-excel-template)
- [Smartsheet Credit/Debit Memo Templates](https://www.smartsheet.com/credit-debit-memos-notes)

### Ongoing Relationship
- [SourceDay Supplier Scorecard](https://sourceday.com/blog/supplier-scorecard/)
- [Sitemate ECN Template](https://sitemate.com/templates/commercial/forms/engineering-change-notice-template-ecn/)
- [Collins Aerospace Deviation/Waiver Form](https://www.rtx.com/collinsaerospace/-/media/CA/suppliers/hutc/supplier-request-for-deviation-waiver-sis-oh-wv.doc)
- [SafetyCulture Kaizen Report Template](https://safetyculture.com/checklists/kaizen-tools)

### Data Formats and Datasets
- [Kaggle: Predicting Manufacturing Defects](https://www.kaggle.com/datasets/rabieelkharoua/predicting-manufacturing-defects-dataset)
- [Kaggle: Bosch Production Line Performance](https://www.kaggle.com/c/bosch-production-line-performance/data)
- [Kaggle: Casting Product Image Data](https://www.kaggle.com/datasets/ravirajsinh45/real-life-industrial-dataset-of-casting-product)
- [GitHub: awesome-industrial-datasets](https://github.com/jonathanwvd/awesome-industrial-datasets)
- [GitHub: industrial-ml-datasets](https://github.com/nicolasj92/industrial-ml-datasets)
- [GitHub: awesome-industrial-machine-datasets](https://github.com/makinarocks/awesome-industrial-machine-datasets)

### Industry Standards Referenced
- ISO 9001:2015 (Quality Management Systems)
- IATF 16949 (Automotive Quality)
- AS9100/AS9102 (Aerospace Quality / First Article Inspection)
- ISO 13485 (Medical Device Quality)
- ISO 12233 (Photography -- Resolution and SFR measurements)
- ISO 2859-1 / ANSI/ASQ Z1.4 (Sampling procedures for inspection by attributes)
- ISO 22400 (Manufacturing Operations Management KPIs)
- ISO 23952 / QIF (Quality Information Framework)
- IPC-A-610 (Acceptability of Electronic Assemblies)
- IPC-2591 / CFX (Connected Factory Exchange)
- J-STD-020 (Moisture/Reflow Sensitivity Classification)
- J-STD-033 (Moisture-Sensitive Devices Handling)
- EN 10204 (Metallic Products -- Types of Inspection Documents)
- SAE AS9102 (First Article Inspection Requirements)
- AIAG APQP/PPAP/MSA/SPC Core Tools
