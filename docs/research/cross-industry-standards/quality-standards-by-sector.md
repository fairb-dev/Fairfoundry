# Cross-Sector Quality Management & Test Data Standards Research

## Context

This research complements existing work on electronics-specific standards (STDF, QIF, AQDEF, IPC-CFX) for the FairFoundry Fabric platform, which uses an oracle to validate manufacturing artifacts against acceptance criteria. Understanding how quality/test data is structured across industries informs how the FairBuild oracle should parse and validate data from diverse manufacturing partners.

---

## 1. AUTOMOTIVE PARTS MANUFACTURING

### IATF 16949 Quality Management System

IATF 16949 is the global automotive quality management standard, built on ISO 9001 with automotive-specific additions. It mandates:
- **Measurement System Analysis (MSA)**: Every gauge/tool in the control plan must be evaluated for accuracy, precision, repeatability, and reproducibility (Gage R&R studies)
- **Statistical Process Control (SPC)**: Critical processes must demonstrate Cpk/Ppk capability indices
- **Calibration records**: Full traceability of all measuring equipment with calibration dates, results, and due dates
- **Control Plans**: Documents specifying measurement frequencies, sample sizes, and reaction plans

**Complexity**: High. Requires trained quality engineers, SPC software, and extensive documentation. A small factory would need consultants to implement from scratch.
**Format**: No mandated digital format -- historically paper/PDF, increasingly digitized through QMS platforms.
**Universality**: ~40% universally applicable (calibration, traceability, documented procedures). ~60% automotive-specific (customer-specific requirements from each OEM).

### PPAP (Production Part Approval Process)

PPAP is the AIAG standard for proving that a supplier can consistently produce parts meeting specifications. It has **18 elements** organized into 5 submission levels (Level 3 is default):

| Element | Data Content | Universal Applicability |
|---------|-------------|------------------------|
| 1. Design Records | Drawing/CAD with all dimensions/specs | High |
| 2. Engineering Change Documents | Change history, revision tracking | High |
| 3. Customer Engineering Approval | Evidence of customer sign-off | High |
| 4. Design FMEA | Risk analysis of design failure modes | Medium |
| 5. Process Flow Diagrams | Step-by-step manufacturing sequence | High |
| 6. Process FMEA | Risk analysis of process failure modes | Medium |
| 7. Control Plan | What to measure, how often, reaction plan | High |
| 8. MSA Studies | Gage R&R, bias, linearity, stability | Medium |
| 9. **Dimensional Results** | Every dimension measured, nominal vs actual, pass/fail | **Very High** |
| 10. **Material/Performance Test Results** | Chemical/mechanical/performance test data (DVP&R format) | **Very High** |
| 11. Initial Process Studies | Cpk/Ppk statistical capability | Medium |
| 12. Qualified Laboratory Documentation | Lab certifications (ISO 17025) | High |
| 13. Appearance Approval Report | Color, texture, gloss verification | Low (sector-specific) |
| 14. Sample Production Parts | Physical samples | N/A (physical) |
| 15. Master Sample | Reference standard retained | N/A (physical) |
| 16. Checking Aids | Custom gages/fixtures documentation | Low |
| 17. Customer-Specific Requirements | Varies by OEM | Low (proprietary) |
| 18. **Part Submission Warrant (PSW)** | Summary cover sheet with disposition | **Very High** |

**Key Data Pattern (Dimensional Results)**: Each row contains: characteristic number, characteristic description, specification (nominal +/- tolerance), measurement result, pass/fail status. Randomly selected from a production run of typically 30+ pieces.

**Key Data Pattern (Material/Performance Test Results)**: Test name, test method (ASTM/ISO reference), specification limits, actual results, quantity tested, pass/fail.

**Complexity**: Moderate-to-high for full Level 3 submission. However, the core data patterns (dimensional results, material tests, PSW) are simple tabular structures.
**Format**: Traditionally PDF/Excel. No standardized JSON or API format from AIAG. Digital platforms (e.g., Net-Inspect, InspectionXpert) exist but are proprietary.
**Small factory adoptability**: Difficult without training. The 18-element structure is well-documented but requires quality engineering knowledge.
**Universality**: ~50%. The dimensional results and material test formats are genuinely universal. The FMEA, SPC, and customer-specific elements are automotive overhead.

### APQP (Advanced Product Quality Planning)

APQP is the phased framework within which PPAP sits. Its 5 phases map directly to FairFoundry's `ServiceStage` enum:

| APQP Phase | FairFoundry Equivalent | Key Quality Data |
|-----------|----------------------|-----------------|
| Phase 1: Plan & Define | Pre-EVT | Voice of customer, targets, reliability goals |
| Phase 2: Product Design | EVT | DFMEA, DVP&R test plans, material specs |
| Phase 3: Process Design | DVT | PFMEA, process flow, control plan |
| Phase 4: Product & Process Validation | PVT | PPAP submission, capability studies, production trial run |
| Phase 5: Launch & Feedback | MP/Sustaining | Ongoing SPC, warranty data, continuous improvement |

**Format**: No digital interchange standard. Typically managed via Excel templates and project management tools.

### VDA Standards & QDX

German automotive OEMs (VW, BMW, Daimler, Bosch, Continental) use VDA standards alongside IATF 16949:
- **VDA 6.3**: Process audit standard (more prescriptive than generic ISO auditing)
- **VDA 2**: Production Process and Product Approval (German equivalent of PPAP)
- **VDA 7 / QDX**: **Quality Data Exchange** format -- an **XML schema** for exchanging quality documents between customers and suppliers

**QDX is the most relevant finding here.** It provides:
- XML Schema Definition (XSD) for quality data
- Standardized document types covering complaints, capability studies, status reports
- Two communication protocols: OFTP (legacy file transfer) and WebService (modern)
- Used by major German OEMs as the expected supplier data format

**Complexity**: High. Requires XML tooling and IT integration.
**Format**: XML (XSD-defined). Not JSON-native but could be mapped.
**Small factory adoptability**: Difficult. Requires IT infrastructure and understanding of XML schemas.
**Universality**: ~30%. Designed specifically for automotive complaint/approval workflows.

### AQDEF (Advanced Quality Data Exchange Format)

Originally "Automotive Quality Data Exchange Format," now renamed because non-automotive companies also use it. Founded by BMW, Bosch, Daimler, Ford, GM, VW, and others.

- Based on Q-DAS ASCII transfer format (key-value pairs with field codes called "K-fields")
- Covers: measurement values, parts data, characteristics data, structure information
- Used for exchanging SPC and inspection data between measurement systems and Q-DAS statistical software
- Designed to centralize measurement data from diverse equipment without conversion errors

**Complexity**: Moderate. The K-field structure is well-documented but proprietary to Q-DAS ecosystem.
**Format**: ASCII key-value (legacy). Not JSON/API-friendly.
**Small factory adoptability**: Requires Q-DAS software investment.
**Universality**: ~60%. The measurement data model (part -> characteristic -> measurement value) is universal, even though the format is automotive-rooted.

### CMM Inspection Report Format

Coordinate Measuring Machine reports follow a de facto standard layout:

```
Header:     Part number, revision, date, operator, machine ID, calibration status
Datum:      Reference frame setup (Datum A/B/C)
Results:    [Characteristic#] [Description] [Nominal] [Actual] [Deviation] [Tolerance] [Pass/Fail]
GD&T:       Position (diameter zone), flatness (range), perpendicularity, etc.
Footer:     Inspector signature, disposition
```

**This is arguably the most universal quality data structure in all of manufacturing.** Every sector that makes physical parts uses some variant of: Nominal | Actual | Tolerance | Pass/Fail.

---

## 2. STEEL AND METALS MANUFACTURING

### Mill Test Certificates (MTC/MTR)

Mill Test Reports are the fundamental quality document in metals. They follow EN 10204 certification types:

| Type | Name | Content | Third-Party? | Use Case |
|------|------|---------|-------------|----------|
| 2.1 | Declaration of Compliance | Statement only, no test data | No | Non-critical structural steel |
| 2.2 | Test Report | Non-specific (typical) values | No | General applications |
| 3.1 | Inspection Certificate | **Actual test results from the supplied lot** | Manufacturer QA only | Oil & gas, chemical, power generation (standard) |
| 3.2 | Inspection Certificate | Actual test results + independent third-party verification | Yes | Nuclear, high-criticality applications |

### MTR Data Structure

A typical Mill Test Report contains these fields:

**Identification Block:**
- Heat/melt number (unique lot identifier -- equivalent to batch ID)
- Material grade and specification (e.g., ASTM A516 Gr.70, EN 10025 S355J2)
- Product form (plate, pipe, bar, coil)
- Dimensions (thickness, width, length, diameter, wall thickness)
- Purchase order reference
- Customer name

**Chemical Composition (percentage by weight):**
- Carbon (C), Manganese (Mn), Phosphorus (P), Sulfur (S), Silicon (Si)
- Chromium (Cr), Nickel (Ni), Molybdenum (Mo), Vanadium (V), Copper (Cu)
- Each element has a specification maximum (from the grade standard) and the actual tested value

**Mechanical Properties:**
- Tensile Strength (MPa) -- spec range + actual
- Yield Strength (MPa) -- spec minimum + actual
- Elongation (%) -- spec minimum + actual
- Reduction of Area (%) -- spec minimum + actual
- Hardness (HB/HRC) -- spec range + actual
- Charpy Impact Test (Joules at specified temperature) -- spec minimum + actual values (typically 3 specimens)

**Additional Data (where applicable):**
- Heat treatment condition (normalized, quenched & tempered, etc.)
- Non-destructive test results (ultrasonic, radiography)
- Surface condition

**Compliance Statement:**
- Reference to applicable standards (ASTM A370, EN 10204)
- Authorized inspector signature
- Date of issue

### ASTM Testing Standards

ASTM A370 is the master standard for mechanical testing of steel products, covering:
- Tensile testing (specimen preparation, test procedure, data recording)
- Bend testing
- Hardness testing (Brinell, Rockwell, portable)
- Charpy impact testing

**Complexity**: Low-to-moderate. MTRs are simple tabular documents. Any mill or distributor can produce them.
**Format**: Almost exclusively PDF. No standardized digital format exists. Some digital platforms (GoSmarter.ai) are emerging to digitize MTR data.
**Small factory adoptability**: Very high. MTRs are one of the simplest quality documents in manufacturing. A small metals distributor deals with these daily.
**Universality**: ~70%. The pattern of "specification value vs actual value with pass/fail" is universal. The specific chemical elements and mechanical properties are metals-specific.

---

## 3. FOOD MANUFACTURING

### HACCP (Hazard Analysis Critical Control Points)

HACCP is the systematic preventive approach to food safety, mandated by FDA (21 CFR 120/123) and Codex Alimentarius. It is NOT a test data format but a management system that generates test records.

**HACCP Record Structure:**
- Critical Control Point (CCP) identification
- Critical Limit for each CCP (e.g., minimum cooking temperature 165 F)
- Monitoring procedure (what, how, when, who)
- Monitoring results (actual measured values)
- Corrective action records (when limits are exceeded)
- Verification records (proving the system works)

**Key Pattern**: CCP ID -> Critical Limit (spec) -> Actual Measurement -> Pass/Fail -> Corrective Action (if fail). This maps directly to the universal quality record pattern.

### Certificate of Analysis (COA) for Food

Food COAs have no single mandated format but typically include:

**Header:** Product name, lot/batch number, manufacturing date, expiry/best-by date, storage conditions
**Specification Reference:** Internal spec number or customer spec
**Test Results Table:**
- Test parameter (e.g., moisture, pH, water activity, fat content)
- Test method reference (e.g., AOAC 930.15)
- Specification limits (min/max or target +/- tolerance)
- Actual result
- Units
- Pass/Fail determination

**Microbiological Results:**
- Organism tested (Total Plate Count, E. coli, Salmonella, Listeria, Yeast & Mold)
- Method (e.g., AOAC 991.14, BAM Chapter 5)
- Specification limit (e.g., <10 CFU/g, Absent in 25g)
- Result
- Pass/Fail

**Allergen Declaration:** Present/absent for major allergens
**Approval:** Authorized reviewer signature, date, disposition (release/reject/hold)

### SQF (Safe Quality Food)

SQF is a GFSI-benchmarked certification scheme. It requires:
- Documented specifications for all materials including microbiological, chemical, and physical limits
- Validation testing to prove processes achieve safety outcomes
- Environmental monitoring programs
- Batch release testing protocols

**Complexity**: Moderate. HACCP principles are straightforward. The test data itself (temperature, pH, micro counts) is simple.
**Format**: No standardized digital format. Mostly paper/Excel/proprietary LIMS (Laboratory Information Management Systems). Some platforms like CIKLab offer digital COA generation.
**Small factory adoptability**: High for basic HACCP records. COAs are commonly produced by small food manufacturers. Microbiological testing typically outsourced to contract labs.
**Universality**: ~50%. The COA structure (parameter -> spec -> actual -> pass/fail) is universal. The specific parameters (allergens, micro organisms, water activity) are food-specific.

---

## 4. MEDICAL DEVICES

### FDA 21 CFR Part 820 -- Device History Record (DHR)

The DHR is legally mandated for every medical device manufactured in the US. Under 21 CFR 820.184, each DHR must include:

- Manufacturing dates
- Quantity manufactured
- Quantity released for distribution
- **Acceptance records** demonstrating device was manufactured per the Device Master Record (DMR)
- Primary identification label and labeling
- Unique Device Identifier (UDI) / control numbers

**Acceptance records** are the test data component. They must demonstrate that every inspection, test, and verification step defined in the DMR was performed and passed.

### IQ/OQ/PQ Validation

Medical device process validation follows a three-stage protocol:

| Stage | Question Answered | Typical Data |
|-------|------------------|-------------|
| **IQ** (Installation Qualification) | "Is equipment installed correctly?" | Utility verification, component checklist, calibration baseline |
| **OQ** (Operational Qualification) | "Does it operate within specs?" | Parameter testing at extremes (high/low/nominal), alarm verification |
| **PQ** (Performance Qualification) | "Does it produce good product consistently?" | Production runs with real materials, statistical analysis of output |

Each stage produces a protocol (test plan) and a report (results). The protocol defines: test ID, description, acceptance criteria, equipment used. The report records: actual results, pass/fail, deviations, investigator signature.

### ISO 10993 Biocompatibility Testing

Biocompatibility assessment follows a structured framework:
1. **Biological Evaluation Plan (BEP)**: Defines which tests are needed based on device contact type and duration
2. **Chemical Characterization**: Extractables and leachables testing
3. **Biocompatibility Tests**: Cytotoxicity, sensitization, irritation, systemic toxicity, etc.
4. **Biological Evaluation Report (BER)**: Summary of all findings with risk assessment

Test reports follow standard laboratory formats with method reference, specimen description, results, and conclusions.

**Complexity**: Very high. FDA-regulated environment with strict documentation requirements, audit trails, electronic records compliance (21 CFR Part 11).
**Format**: Increasingly electronic (eDHR systems). Proprietary platforms like Greenlight Guru, MasterControl, SimplerQMS. No open JSON standard.
**Small factory adoptability**: Very difficult. Requires regulatory expertise, validated software systems, and trained personnel.
**Universality**: ~30%. The acceptance record concept (test plan -> execute -> record results -> disposition) is universal, but the regulatory overhead is extreme.

---

## 5. AEROSPACE

### AS9100 Quality Management System

AS9100 builds on ISO 9001 with aerospace-specific requirements:
- **Configuration management**: Strict version control of designs and specifications
- **Risk management**: Formal risk identification at process and product level
- **Traceability**: Every component traceable to raw material source
- **Key characteristics**: Special designated dimensions/properties requiring enhanced control

### AS9102 First Article Inspection Report (FAIR)

This is the most structured and well-defined quality data format in any industry. It uses three standardized forms:

**Form 1 -- Part Number Accountability:**
- Part number, name, serial number
- Drawing number and revision
- Manufacturing process reference
- Organization name, CAGE code
- FAI status (Full/Partial/Delta)

**Form 2 -- Product Accountability (Raw Materials, Special Processes, Functional Testing):**
- Material specification and grade
- Material supplier and certification
- Special process specification (heat treat, plating, NDT)
- Special process source and NADCAP status
- Functional test requirements and results

**Form 3 -- Characteristic Accountability:**
Each row contains:
- Characteristic number (balloon number on drawing)
- Reference location (drawing zone)
- Characteristic designator (e.g., Key Characteristic flag)
- Requirement (nominal dimension with tolerance)
- Results (actual measured value)
- Designed tooling (Y/N)
- Non-conformance number (if applicable)

Complex parts may have 50-100+ rows in Form 3.

### Boeing Supplier Requirements (D6-82479)

Boeing mandates:
- FAIs submitted electronically via **Net-Inspect** platform
- AS9102 Forms 1-3 completed digitally
- Material certifications linked to specific lot/heat numbers
- NADCAP accreditation for special processes
- Quarterly check-in via BPN Supplier Portal

### NADCAP

NADCAP accreditation covers special processes: heat treating, non-destructive testing, welding, coatings, chemical processing, composites, etc. Requirements include:
- Documented inspection plans with statistical sampling basis
- Acceptance criteria tied to specifications
- Full traceability from inspection data to the build
- Build logs, material certs, inspection records, calibration records, training records

**Complexity**: Very high. AS9102 FAIR is the most rigorous quality data format in manufacturing.
**Format**: Historically paper/Excel. Boeing now mandates digital submission via Net-Inspect. AS9102 forms are well-defined but not in a modern open format (no official JSON schema).
**Small factory adoptability**: Difficult. The three-form structure is well-documented but requires aerospace quality engineering expertise.
**Universality**: ~50%. Form 3's structure (characteristic -> requirement -> result -> pass/fail) is universal. Form 2's special process tracking is aerospace-specific.

---

## 6. CROSS-INDUSTRY FLEXIBLE STANDARDS

### QIF (Quality Information Framework) -- ISO 23952:2020

**The most promising cross-industry standard for quality data exchange.**

- **Format**: XML-based (XSD schemas), CAD-agnostic
- **Scope**: Complete metrology lifecycle -- from design intent (GD&T) through inspection planning, execution, results, and statistical analysis
- **Key Feature**: Every characteristic gets a UUID, enabling unambiguous cross-system identification
- **Content**: Measurement plans, results, part geometry, product manufacturing information (PMI), measurement templates, resources, statistical analysis
- **Savings**: Claims up to 80% reduction in total hours for annotation, machining, and inspection processes
- **Governance**: DMSC (Digital Metrology Standards Consortium), harvested by ISO as ISO 23952:2020

**Complexity**: Moderate-to-high. XML-native, requires understanding of metrology data models.
**JSON/API**: Not natively JSON. Would need XML-to-JSON translation layer.
**Small factory**: Difficult without software that supports QIF natively.
**Universality**: ~70%. The inspection data model is applicable to any industry making physical parts.

### GS1 EPCIS 2.0

**The most modern and API-friendly standard in this research.**

- **Format**: **JSON-LD** (native JSON with linked data semantics)
- **API**: **REST API** for capture and query of event data
- **Event Types**: ObjectEvent, AggregationEvent, **TransformationEvent** (manufacturing-relevant: inputs -> outputs), AssociationEvent, TransactionEvent
- **Sensor Data**: EPCIS 2.0 added IoT sensor data support -- temperature, humidity, pressure readings can be attached to events
- **Traceability**: Full supply chain visibility from raw material to finished product
- **Open Source**: OpenEPCIS provides open-source reference implementation

**Complexity**: Low-to-moderate for basic event capture. The JSON-LD format is developer-friendly.
**JSON/API**: **Yes** -- native JSON-LD with REST API. This is the most API-friendly standard in the entire research.
**Small factory**: Moderate. The basic concepts (what, where, when, why) are intuitive. JSON/REST is accessible to any developer.
**Universality**: ~60%. The event model is universal. The specific business vocabulary is supply-chain/logistics focused rather than quality-inspection focused.

### ISO 8000 (Data Quality)

Defines requirements for **master data quality** -- how to ensure product data, supplier data, and asset data are accurate, complete, and consistent.

- Covers syntax, semantic encoding, and assessment indicators
- More about data governance than test data interchange
- Relevant as a framework for ensuring quality data is itself high-quality

**Complexity**: High (standards framework, not implementation guide).
**Universality**: ~80%. Data quality principles are universal.
**Practical use**: Theoretical foundation rather than practical interchange format.

### ISO 10303 STEP

Covers computer-interpretable representation of product data across the entire lifecycle. Very comprehensive (hundreds of sub-parts) but focused on **CAD/CAM/CAE/PDM** data interchange rather than quality/test data specifically.

**Complexity**: Extremely high. Full STEP implementation is a multi-year enterprise IT project.
**Relevance**: Important for product definition data that quality systems reference, but not for test result interchange.

### VDA QDX (Quality Data Exchange)

Already covered in automotive section. XML-based, automotive-focused but well-structured.

### IPC-CFX (Connected Factory Exchange)

Already known to the project team. Key facts:
- **JSON encoding** over AMQP messaging protocol
- Plug-and-play IoT communication
- Focused on electronics assembly but the message architecture is extensible
- Version 1.5 available as of late 2024

**The only standard in this research that is both JSON-native AND designed for factory floor data exchange.**

### OASIS OSLC Quality Management v2.1

- **REST API**-based (HTTP GET/POST/PUT/DELETE)
- Defines: Test Plan, Test Case, Test Script, Test Execution Record, Test Result
- **However**: Designed for **software** quality management, not manufacturing
- The resource model (plan -> case -> execution -> result) is abstractly applicable to manufacturing but would need significant adaptation

**Complexity**: Moderate. Well-documented REST API spec.
**Relevance**: Low for manufacturing. The concepts are right but the domain model is wrong.

### UN/CEFACT Conformity Data Exchange

A **new standard published July 2024** specifically for digital exchange of product conformity data:
- Basic machine-readable data elements for conformity certificates
- Verifiable connections to physical products
- Certificate status tracking
- Authority verification
- Designed to coexist with paper/PDF certificates during transition

**Complexity**: Low (intentionally minimal).
**Format**: Designed for machine-readability (specific format TBD in implementation).
**Universality**: ~80%. Designed to be cross-industry.
**Relevance**: **High** -- this is directly aligned with FairFoundry's oracle verification use case.

---

## 7. CROSS-SECTOR SYNTHESIS

### Universal Data Elements (Present in EVERY Quality Record)

Regardless of industry, every quality record contains these core fields:

| Field | Automotive (PPAP) | Metals (MTR) | Food (COA) | Medical (DHR) | Aerospace (FAIR) |
|-------|-------------------|-------------|-----------|--------------|-----------------|
| **Part/Product ID** | Part number | Material grade + heat number | Product name + lot | Device name + UDI | Part number + serial |
| **Lot/Batch ID** | Production run ID | Heat/melt number | Batch/lot number | Lot number | Serial/lot number |
| **Specification Reference** | Drawing + revision | ASTM/EN standard | Internal spec | DMR reference | Drawing + revision |
| **Test Parameter** | Dimension name | Chemical element / mechanical property | Moisture, pH, micro organism | Test procedure ID | Characteristic number |
| **Specification Limits** | Nominal +/- tolerance | Min/max per grade standard | Min/max or target | Acceptance criteria | Nominal +/- tolerance |
| **Actual Result** | Measured value | Tested percentage/value | Tested value | Recorded result | Measured value |
| **Pass/Fail** | Yes | Yes | Yes | Yes | Yes |
| **Test Date** | Yes | Yes | Yes | Yes | Yes |
| **Inspector/Tester** | Yes | Yes (authorized rep) | Yes (reviewer) | Yes (with Part 11 controls) | Yes |
| **Equipment/Method** | MSA reference | Test method (ASTM A370) | Test method (AOAC) | Procedure reference | Inspection method |
| **Disposition** | PSW approval | Certificate statement | Release/reject/hold | Accept/reject | FAI status |

### The Universal Quality Record

Based on this research, the simplest possible quality record that every sector could use:

```json
{
  "record_id": "uuid",
  "record_type": "inspection | test | certificate",
  "timestamp": "ISO-8601",
  
  "subject": {
    "product_id": "part number or product name",
    "lot_batch_id": "heat number, lot, batch, serial",
    "specification_ref": "drawing rev, standard, spec number",
    "quantity_inspected": 30,
    "quantity_accepted": 30
  },
  
  "results": [
    {
      "characteristic_id": "unique identifier (QIF UUID concept)",
      "characteristic_name": "OD at section A",
      "test_method": "ASTM E8 | AOAC 930.15 | visual",
      "specification": {
        "nominal": 25.400,
        "tolerance_plus": 0.050,
        "tolerance_minus": 0.050,
        "unit": "mm"
      },
      "actual_value": 25.415,
      "pass_fail": "PASS",
      "notes": ""
    }
  ],
  
  "disposition": {
    "status": "ACCEPTED | REJECTED | CONDITIONAL",
    "authorized_by": "inspector name or ID",
    "date": "ISO-8601"
  },
  
  "traceability": {
    "equipment_id": "CMM serial, test machine ID",
    "calibration_due": "ISO-8601",
    "raw_material_cert_ref": "MTR/MTC reference"
  }
}
```

This ~20-field structure captures **80-90% of what every industry needs** in a quality record. Industry-specific extensions would add:
- **Automotive**: SPC data (Cpk/Ppk), FMEA reference, customer-specific fields
- **Metals**: Full chemical composition array, heat treatment condition
- **Food**: Allergen declarations, microbiological panel, storage conditions, expiry date
- **Medical**: Electronic signature (Part 11), DHR linkage, UDI, sterilization lot
- **Aerospace**: Key characteristic flags, NADCAP reference, CAGE code, configuration status

### Acceptance Criteria Patterns

Three universal patterns emerge:

1. **Numeric tolerance**: Nominal +/- tolerance (dimensions, strength, composition percentages)
2. **Threshold**: Min or max limit only (tensile strength >= 515 MPa, moisture <= 12%)
3. **Attribute**: Present/absent, pass/fail, go/no-go (Salmonella: absent in 25g, visual: no cracks)

Every sector uses all three patterns. A universal acceptance criteria model needs only:

```json
{
  "type": "tolerance | min | max | range | attribute",
  "nominal": 25.4,        // for tolerance type
  "upper_limit": 25.45,   // for tolerance/max/range
  "lower_limit": 25.35,   // for tolerance/min/range
  "attribute_expected": "ABSENT",  // for attribute type
  "unit": "mm | MPa | % | CFU/g"
}
```

### Where Industries Diverge

| Dimension | Low Variation | High Variation |
|-----------|-------------|----------------|
| **Core data model** | Identical across all (spec vs actual vs pass/fail) | -- |
| **Regulatory burden** | Metals, automotive parts | Medical devices, aerospace, food (FDA/EASA) |
| **Digital maturity** | Electronics (IPC-CFX, STDF = native JSON/binary) | Metals, food (still PDF-dominant) |
| **Third-party verification** | Most sectors: self-certified | Metals 3.2: independent inspector; Aerospace: NADCAP; Medical: notified bodies |
| **Statistical requirements** | Basic (metals: 3 impact specimens) | Advanced (automotive: SPC/Cpk; medical: process validation) |
| **Traceability depth** | 1-2 levels (metals: heat number) | Full chain (aerospace: raw material to installed part; food: farm to fork) |

### Adoptability Ranking (Easiest to Hardest)

1. **GS1 EPCIS 2.0** -- JSON-LD, REST API, open source implementation, intuitive event model. Best for traceability but needs quality-inspection extensions.
2. **IPC-CFX** -- JSON over AMQP, plug-and-play, but electronics-focused.
3. **Mill Test Certificate / EN 10204** -- Conceptually the simplest quality document. A small factory already produces these.
4. **Food COA** -- Simple tabular format, widely understood, no digital standard but easy to digitize.
5. **AS9102 FAIR** -- Well-structured three-form system, but complex and aerospace-specific.
6. **PPAP** -- Comprehensive but heavyweight (18 elements).
7. **QIF** -- Powerful metrology data model but XML-heavy and requires software support.
8. **VDA QDX** -- XML-based, requires IT integration, automotive-specific workflows.
9. **AQDEF** -- Requires Q-DAS ecosystem investment.
10. **Medical DHR** -- Requires validated systems, electronic signatures, regulatory expertise.

### Recommendations for FairFoundry Oracle

Based on this research, the FairBuild oracle's data ingestion layer should:

1. **Adopt a JSON schema inspired by the universal quality record** pattern identified above. Every industry uses the same core: subject identification, characteristic/parameter specification, actual measurement, pass/fail disposition.

2. **Look at EPCIS 2.0's architecture** as a model for the event/messaging layer (JSON-LD, REST API, event types). Its TransformationEvent maps naturally to manufacturing service orders.

3. **Borrow QIF's UUID-per-characteristic concept** for unambiguous traceability of what was measured.

4. **Support the three acceptance criteria patterns** (tolerance, threshold, attribute) as a universal specification model.

5. **Keep the core schema minimal** (~20 fields) with industry-specific extension namespaces, similar to how EPCIS 2.0 uses extension points.

6. **Watch the UN/CEFACT conformity data standard** (published July 2024) -- it is directly aligned with the oracle's verification mission and designed for cross-border digital certificates.

7. **Do NOT adopt any single industry standard wholesale.** Each is either too complex (PPAP, AS9102, QIF), too industry-specific (STDF, AQDEF), or too legacy (PDF-based MTRs). Instead, define a new lean schema that any of these can map into.

---

Sources:
- [PPAP Production Part Approval Process - Quality-One](https://quality-one.com/ppap/)
- [PPAP 18 Documents Elements List](https://www.qualitybook.org/ppap-18-documents-elements-list/)
- [IATF 16949 MSA Requirements](https://advisera.com/16949academy/blog/2017/11/08/how-to-establish-measurement-system-analysis-according-to-iatf-16949/)
- [Mill Test Certificates EN 10204 - Projectmaterials](https://blog.projectmaterials.com/epc-projects/testing-inspection/mill-test-certificates-3-1-2/)
- [How to Read a Mill Test Report - Coastal Flange](https://www.coastalflange.com/blog/how-to-read-a-mill-test-report-mtr/)
- [Mill Test Report Wikipedia](https://en.wikipedia.org/wiki/Mill_test_report_(metals_industry))
- [EN 10204 3.1 vs 3.2 - Holland Applied Technologies](https://hollandapt.com/what-is-the-difference-between-en-10204-3-1-and-3-2-inspection-certificates/)
- [Certificate of Analysis for Food - Quality Essentials Suite](https://qualityessentialssuite.com/certificate-of-analysis/certificates-of-analysis-for-food/)
- [HACCP Principles & Application Guidelines - FDA](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines)
- [Food COA - CIKLab](https://www.ciklab.com/en/certificate-of-analysis-editing/)
- [Device History Record - SimplerQMS](https://simplerqms.com/device-history-record/)
- [FDA 21 CFR Part 820 Records](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-H/part-820/subpart-M)
- [IQ OQ PQ Process Validation - Greenlight Guru](https://www.greenlight.guru/blog/iq-oq-pq-process-validation)
- [ISO 10993 Biocompatibility - Wikipedia](https://en.wikipedia.org/wiki/ISO_10993)
- [AS9102 FAIR Forms - IAQG](https://iaqg.org/wp-content/uploads/2023/03/Draft-9102-Rev-C-Forms.pdf)
- [AS9102 Form 1 vs 2 vs 3 Explained - Mavlon](https://mavlon.co/post/as9102-form-1-vs-form-2-vs-form-3-explained)
- [AS9100 Wikipedia](https://en.wikipedia.org/wiki/AS9100)
- [Boeing D6-82479 Supplier Requirements](https://www.ptitechnologies.com/wp-content/uploads/2020/09/D6-82479-Rev-I-4-4-2019.pdf)
- [NADCAP Guide - MPC](https://mpofcinci.com/blog/complete-nadcap-guide/)
- [QIF Overview - QIF Standards](https://qifstandards.org/overview/)
- [QIF Definitive Guide - Capvidia](https://www.capvidia.com/blog/qif-quality-information-framework-definitive-guide)
- [GS1 EPCIS 2.0](https://www.gs1.org/standards/epcis)
- [EPCIS 2.0 In-Depth Guide - TrackVision](https://trackvision.ai/blog/what-is-gs1-epcis-2.0)
- [OpenEPCIS Reference Implementation](https://openepcis.io/docs/epcis/)
- [ISO 8000 - Wikipedia](https://en.wikipedia.org/wiki/ISO_8000)
- [ISO 10303 STEP - NIST](https://www.nist.gov/publications/introduction-iso-10303-step-standard-product-data-exchange-0)
- [VDA QDX Standard](https://vda-qmc.de/en/publikationen-und-apps/qdx/)
- [VDA QDX Data Exchange Requirements PDF](https://vda-qmc.de/wp-content/uploads/2023/01/VDA_QMC_Vol_7_-_QDX_Data_Exchange_Requirements_V2.0.pdf)
- [AQDEF Overview - Q-DAS](https://www.q-das.com/en/service/data-format-aqdef)
- [IPC-CFX FAQ](https://www.ipc.org/ipc-cfx-faq)
- [IPC-2591 CFX Standard](https://www.electronics.org/ipc-2591-connected-factory-exchange-cfx)
- [OASIS OSLC Quality Management v2.1](https://docs.oasis-open-projects.org/oslc-op/qm/v2.1/os/quality-management-spec.html)
- [UN/CEFACT Conformity Data Standard (July 2024)](https://iaf.news/2024/09/19/publication-of-new-un-cefact-standard-on-digital-exchange-of-conformity-data/)
- [ETIM xChange JSON Format](https://www.productsup.com/blog/etim-xchange-product-data-exchange-for-global-industrial-manufacturing/)
- [ASTM A370 Mechanical Testing - Instron](https://www.instron.com/en/testing-solutions/astm-standards/astm-a370-standard-for-testing-metal-elasticity-strength-elongation-reduction/)
- [CMM Inspection Report Guide - RivCut](https://www.rivcut.com/resources/cmm-report-guide)
- [CMM Inspection Report Checklist - GD Prototyping](https://www.gd-prototyping.com/cmm-inspection-report-checklist/)
- [STDF Wikipedia](https://en.wikipedia.org/wiki/Standard_Test_Data_Format)
- [SQF Food Safety Code](https://www.sqfi.com/the-sqf-code/choose-your-code/library-of-codes/food-manufacturing)