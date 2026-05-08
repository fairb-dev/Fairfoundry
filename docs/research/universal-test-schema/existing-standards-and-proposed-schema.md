# Comprehensive Analysis: Universal Schema for Manufacturing Test Logs and Quality Control Data

> Research conducted April 2026. This document surveys existing manufacturing test data standards,
> identifies common elements and non-numeric acceptance criteria patterns, examines how industry
> platforms handle heterogeneous test data ingestion, and proposes a universal JSON-based schema
> that can represent any manufacturing test type.

---

## Table of Contents

1. [Existing Standards for Manufacturing Test Data](#1-existing-standards-for-manufacturing-test-data)
2. [Common Elements Across ALL Manufacturing Test Logs](#2-common-elements-across-all-manufacturing-test-logs)
3. [Non-Numeric Acceptance Criteria Patterns](#3-non-numeric-acceptance-criteria-patterns)
4. [How Companies Handle Test Data Ingestion from Diverse Factories](#4-how-companies-handle-test-data-ingestion-from-diverse-factories)
5. [Proposed Universal Schema Structure](#5-proposed-universal-schema-structure)
6. [How the Schema Covers Each Test Type](#how-this-schema-covers-each-requested-test-type)
7. [Key Design Decisions and Rationale](#key-design-decisions-and-rationale)
8. [Implementation Recommendations](#implementation-recommendations)
9. [Sources and References](#sources-and-references)

---

## 1. Existing Standards for Manufacturing Test Data

### SEMI E10 / E142 (Semiconductor Equipment Performance)

SEMI E10 (first published 1986) defines six mutually exclusive equipment states and metrics for Reliability, Availability, and Maintainability (RAM). It provides a common language between equipment suppliers and users for equipment utilization measurement. SEMI E142 defines substrate mapping via XML schema (E142.1) and SECS-II protocol (E142.2), representing two-dimensional data arrays corresponding to physical substrates (wafers, strips, trays). E10 links with E116 for automated equipment state tracking.

### QIF (Quality Information Framework) -- ISO 23952:2020

QIF is a suite of XML-based data models maintained by DMSC (Digital Metrology Standards Consortium). It became an ANSI standard in 2018 and ISO 23952:2020. Its architecture includes five application schemas:

- **QIF Plans** -- measurement specifications, features to inspect, tolerances, equipment requirements
- **QIF Results** -- actual measurement data from CMMs and other devices
- **QIF Statistics** -- trend analysis and quality metrics
- **QIF MBD** -- Model-Based Definition for CAD-traceable data
- **QIF Rules and Resources** -- measurement rules and device capabilities

XML elements include `<FeatureNominal>` for nominal geometry and `<MeasurementResults>` for deviations. QIF links measurement data with part geometry, PMI, and quality elements for end-to-end traceability.

### AQDEF (Advanced Quality Data Exchange Format)

AQDEF uses a K-field system in ASCII format organized into hierarchical tiers:

- **K0xxx** (Measurement values): K0001 = measured value, K0004 = measurement date
- **K1xxx** (Part data): K1001 = part number, K1002 = part description
- **K2xxx** (Characteristic data): K2001 = characteristic code, K2002 = name, K2110 = LSL, K2111 = USL, K2142 = unit of measurement
- **K5xxx** (Structure information)
- **K8xxx** (QCC data)

Data types: A (alphanumeric), D (date), F (floating-point), I3/I5/I10 (integer), S (special/structured). DFQ files are text-based and hierarchical: parts contain characteristics, which contain values.

### SPC (Statistical Process Control) Data

SPC does not define a single wire-level format but centers on control chart data (center line, UCL/LCL at +/-3 sigma), capability indices (Cp, Cpk), and run rules. The MESA-developed KPI Markup Language (KPIML) provides XML-based implementation for ISO 22400 KPIs. Modern SPC platforms increasingly support real-time data exchange via networked sensors and cloud-based analysis.

### STDF (Standard Test Data Format) -- Semiconductor Testing

STDF V4 is a binary format (originally by Teradyne, 1985) with record-type pairs (REC_TYP, REC_SUB). Key record types:

- **FAR** (0/10) -- File Attributes Record (mandatory first record, CPU type, STDF version)
- **MIR** (1/10) -- Master Information Record (lot-level setup, test program info)
- **MRR** (1/20) -- Master Results Record (aggregate lot statistics)
- **PIR** (5/10) -- Part Information Record (pre-test part data)
- **PRR** (5/20) -- Part Results Record (cumulative pass/fail, bin assignments)
- **PTR** (15/10) -- Parametric Test Record (single numeric measurement with limits, units, scaling)
- **MPR** (15/15) -- Multiple-Result Parametric Record
- **FTR** (15/20) -- Functional Test Record (pass/fail per functional test)
- **TSR** -- Test Synopsis Record (execution and failure counts)

Data types: U\*1-4, I\*1-4, R\*4/R\*8, C\*n (variable-length strings). Can be converted to ATDF (ASCII) or tab-delimited text.

### MTConnect (Machine Tool Data)

An ANSI standard (ANSI/MTC1.4-2018) providing an open-source, royalty-free XML+HTTP protocol for real-time shop-floor data. Architecture: adapter (raw data to pipe-delimited strings) -> agent (parses into XML structure) -> client. Provides a common semantic vocabulary with universal definitions regardless of manufacturer. Extensible XML schema for custom data.

### OPC UA (Industrial Automation)

OPC UA provides vendor-neutral, SOA-based communication with semantic information modeling. It supports hierarchical object structures, timestamped data collection, and bridges automation layers from sensor to cloud. Companion specifications provide industry-specific data models. Directly relevant to quality traceability: automated capture of process parameters per manufactured unit.

### ISO 22400 (Manufacturing Operations Management KPIs)

Defines 34 KPIs in a multi-part standard (ISO 22400-1 through 22400-10). Implemented via KPIML (KPI Markup Language), an XML format developed by MESA International. Covers production control, monitoring, and operations management metrics.

### IPC-2591 CFX (Connected Factory Exchange)

Uses AMQP v1.0 protocol with JSON encoding for electronics assembly manufacturing. The `CFX.Production.TestAndInspection` namespace includes:

- **UnitsTested** -- transactionId, testMethod, tester info, samplingInformation, testedUnits array (each with unitIdentifier, overallResult, tests array with measurements/conditions/symptoms/defects)
- **UnitsInspected** -- similar structure with inspections array, defectsFound (defectCode, defectCategory, description), componentOfInterest, regionOfInterest (coordinates), defectImages (mimeType, base64 imageData), confidence levels

Supports AOI, SPI (solder paste inspection), component offset inspection, and lean inspection formats. Current version: 2.0.

### OASIS

Two distinct contexts: (1) Online Aerospace Supplier Information System (IAQG) for AS9100 series certification data; (2) OASIS Open's OSLC Quality Management v2.1 -- a RESTful web services interface for quality artifact management.

---

## 2. Common Elements Across ALL Manufacturing Test Logs

Based on analysis of STDF, QIF, AQDEF, IPC-CFX, NI TestStand schemas, and Sciemetric QualityWorX, these elements appear universally:

| Element | STDF | QIF | AQDEF | IPC-CFX | TestStand |
|---------|------|-----|-------|---------|-----------|
| Test identification | Test number + name (TSR) | Inspection plan ID | K2001 characteristic code | InspectionName / UniqueIdentifier | Step name |
| DUT identification | Part ID in PIR/PRR | Part reference | K1001 part number | UnitIdentifier | SERIAL_NUM |
| Test conditions | MIR (temperature, etc.) | QIF Resources | K-fields for conditions | Environmental conditions object | Custom properties |
| Equipment ID | MIR (tester type/serial) | MeasurementResources | K-fields | Endpoint/ResourceIdentifier | Station info |
| Calibration status | Not explicit | QIF Resources | Not explicit | Not explicit | Custom properties |
| Measurements | PTR DATA field | MeasurementResults | K0001 measured value | Measurements array | MEAS_NUMERICLIMIT.DATA |
| Pass/fail | PRR part disposition | QIF Results | Derived from limits | OverallResult (Passed/Failed) | STATUS |
| Limits (hi/lo) | PTR limits fields | Tolerance specs | K2110 LSL, K2111 USL | Acceptable range | MEAS_NUMERICLIMIT.LOW/HIGH |
| Units | PTR units field | QIF metadata | K2142 unit | Measurement units | Custom |
| Timestamps | MIR start/end times | QIF metadata | K0004 measurement date | TransactionTimestamp | Execution time |
| Operator/system | MIR operator name | QIF metadata | K-fields | Tester/Inspector object | Operator field |
| Traceability chain | Lot/wafer/site hierarchy | Part-to-design chain | Part-characteristic-value tree | Serial + recipe + transaction | UUT->STEP->MEAS hierarchy |

---

## 3. Non-Numeric Acceptance Criteria Patterns

### Visual Inspection (Cosmetic Defects)

- **Data representation**: Defect classification codes (scratch, dent, discoloration) mapped to severity levels (critical, major, minor)
- **Acceptance model**: Defect checklist with pass/fail per criteria; limit samples define "acceptable boundary"
- **Schema pattern**: `{defect_code, defect_category, severity, location, description, accept_reject}`

### Image-Based Classification (ML Model Pass/Fail)

- **Data representation**: Model prediction class, confidence score (0.0-1.0), bounding box or segmentation mask coordinates, reference image URI
- **Acceptance model**: Minimum confidence threshold + predicted class must match "acceptable"; adjustable detection sensitivity
- **Schema pattern**: `{model_id, model_version, prediction_class, confidence, threshold, region_of_interest, image_reference, result}`

### Pattern Matching (Waveform/Frequency Response)

- **Data representation**: Arrays of (x,y) data points (time-domain or frequency-domain), correlation coefficient against golden reference
- **Acceptance model**: Cross-correlation score above threshold; envelope/mask testing (signal must stay within upper/lower bounds); DTW (Dynamic Time Warping) distance
- **Schema pattern**: `{signal_type, data_points[], reference_id, correlation_method, correlation_score, threshold, mask_upper[], mask_lower[], result}`

### Categorical Results (Go/No-Go Gauging)

- **Data representation**: Enumerated outcome from fixed set (GO, NO_GO, CONDITIONAL)
- **Acceptance model**: Direct categorical match
- **Schema pattern**: `{gauge_type, outcome_enum, accepted_values[], result}`

### Comparative Results (Golden Sample Matching)

- **Data representation**: Deviation metrics from golden reference (scalar distance, vector of feature deltas)
- **Acceptance model**: Deviation within tolerance band per parameter; overall composite deviation below threshold
- **Schema pattern**: `{reference_sample_id, comparison_method, deviations[], tolerance_bands[], composite_score, threshold, result}`

### Multi-Parameter Composite Scores

- **Data representation**: Weighted sum of normalized individual parameter scores
- **Acceptance model**: SAW (Simple Additive Weighting) with per-parameter weights; minimum per-parameter thresholds plus overall composite threshold
- **Schema pattern**: `{parameters[{name, value, weight, normalized_score, min_threshold}], composite_score, composite_threshold, result}`

### Statistical Acceptance (Cpk, AQL Sampling)

- **Data representation**: Sample statistics (mean, stddev, Cp, Cpk), lot size, sample size, accept/reject numbers
- **Acceptance model**: Cpk above threshold (e.g., 1.33 or 1.67); AQL plan per ISO 2859 with inspection level, sample size code, acceptance number
- **Schema pattern**: `{lot_size, sample_size, inspection_level, aql_value, defects_found, accept_number, reject_number, cpk, cpk_threshold, result}`

---

## 4. How Companies Handle Test Data Ingestion from Diverse Factories

### Instrumental

- **Ingestion methods**: CSV drag-and-drop import, REST API push from test stations, server-based file parsing (files placed on secure servers are auto-parsed)
- **Data types**: Functional test data, images/video, AI-generated measurements, return/failure data
- **Normalization**: Unified engineering dataset linked by serial number across sub-assembly, final assembly, and returns stages; 100% traceability via real-time manufacturing data record
- **Integration**: Two-way MES integration (pulls functional tests for root cause analysis, pushes visual test results for unit routing)
- **Flexibility**: Accepts images-only or data-only uploads per facility

### Eigen Innovations

- **Approach**: End-to-end AI vision platform for designing, deploying, monitoring, and managing industrial inspection applications
- **Data capture**: Images and data from inline inspection (including thermal imaging for hidden defects like short-shots, flash, internal voids)
- **Normalization**: OneView software creates standardized digital inspection records for every product produced; factory teams analyze data to determine defect root causes
- **Key differentiator**: No specialized expertise required; AI models trained from unlabeled image data

### Landing AI (LandingLens)

- **Approach**: Domain-specific Large Vision Models (LVMs) created from unlabeled image data (millions/billions of images)
- **Defect handling**: Automatic defect classification with accept/reject criteria; auto-reject or flag non-conforming products
- **Classification**: Binary accept/reject plus multi-class deficiency identification (irreparable vs. reworkable)
- **Impact**: 80% labor cost reduction for one semiconductor/MEMS manufacturer

### Sciemetric QualityWorX

- **Ingestion**: Gateway parsing engine ingests .txt, .csv, .ini, .xml, .JSON, .HTML, and binary files via FTP, WebService, MQTT, API, network shares
- **Equipment connectors**: Atlas Copco, Bosch, Cognex, Keyence, Promess, Zeiss, Mitutoyo, National Instruments, ABB, plus generic OPC/OPC UA, Modbus TCP, PROFINET, Serial
- **Data model**: SQL Server database organized by serial number in a tree structure mimicking the production line; stores process signatures, scalar values, spec limits, images, defect/repair data
- **APIs**: SQL Views, Data API, REST Data API for downstream consumption
- **Key insight**: "Complete birth history for every part, by serial number" -- full replay of each process in the plant

### Common Patterns Across All Platforms

1. **Serial-number-centric data organization** -- everything links to a unique unit identifier
2. **Flexible ingestion** -- support for many file formats and protocols, not a single mandated format
3. **Normalization layer** -- vendor-specific formats converted to internal canonical model
4. **Hierarchical structure** -- lot/batch -> unit -> station/test -> measurement
5. **Image + scalar fusion** -- visual inspection data and numeric test data in the same record
6. **MES integration** -- bidirectional data flow with manufacturing execution systems

---

## 5. Proposed Universal Schema Structure

Based on all research, this schema uses a JSON-based universal structure with the following design principles:

- **Envelope + payload pattern**: Common metadata envelope wrapping test-type-specific payloads
- **Polymorphic result types**: Support numeric, categorical, image-based, waveform, composite, and statistical acceptance criteria
- **Extensibility**: Custom fields via `extensions` objects at every level
- **Traceability-first**: Every entity carries identity, provenance, and lineage information

### Top-Level Document Structure

```json
{
  "schema_version": "1.0.0",
  "document_id": "uuid",
  "created_at": "ISO-8601 timestamp",
  "source_system": {
    "system_id": "string",
    "system_type": "enum: ATE|AOI|CMM|ENVIRONMENTAL_CHAMBER|ACOUSTIC|CUSTOM",
    "software_version": "string",
    "site_id": "string",
    "line_id": "string",
    "station_id": "string"
  },

  "lot": {
    "lot_id": "string",
    "product_id": "string",
    "product_revision": "string",
    "work_order": "string",
    "batch_size": "integer | null",
    "extensions": {}
  },

  "test_program": {
    "program_id": "string",
    "program_name": "string",
    "program_revision": "string",
    "recipe_name": "string | null",
    "recipe_revision": "string | null",
    "extensions": {}
  },

  "test_equipment": {
    "equipment_id": "string",
    "equipment_type": "string",
    "manufacturer": "string",
    "model": "string",
    "serial_number": "string",
    "firmware_version": "string | null",
    "calibration": {
      "calibration_id": "string",
      "calibrated_date": "ISO-8601 date",
      "calibration_due_date": "ISO-8601 date",
      "certificate_number": "string",
      "calibration_authority": "string",
      "traceable_to": "string (e.g., NIST, PTB, NPL)"
    },
    "extensions": {}
  },

  "environment": {
    "temperature_c": "number | null",
    "humidity_pct": "number | null",
    "pressure_hpa": "number | null",
    "fixture_id": "string | null",
    "fixture_position": "string | null",
    "custom_conditions": [
      {"name": "string", "value": "any", "unit": "string | null"}
    ]
  },

  "operator": {
    "operator_id": "string | null",
    "operator_name": "string | null",
    "badge_number": "string | null",
    "role": "string | null",
    "automated": "boolean"
  },

  "units_tested": [
    "...see Unit Result structure below..."
  ],

  "sampling": {
    "method": "enum: HUNDRED_PERCENT|AQL|RANDOM|FIRST_ARTICLE|SKIP_LOT|CUSTOM",
    "aql_plan": {
      "inspection_level": "string (e.g., GII)",
      "aql_value": "number",
      "sample_size_code": "string",
      "sample_size": "integer",
      "accept_number": "integer",
      "reject_number": "integer"
    }
  },

  "extensions": {}
}
```

### Unit Result Structure

```json
{
  "unit_id": "string (serial number, barcode, etc.)",
  "unit_position": "string | null (slot, site, panel position)",
  "parent_unit_id": "string | null (assembly traceability)",
  "start_time": "ISO-8601 timestamp",
  "end_time": "ISO-8601 timestamp",
  "overall_result": "enum: PASS|FAIL|INCONCLUSIVE|ABORT|SKIP",
  "disposition": "string | null (bin name, routing decision)",
  "disposition_code": "string | null (hard bin, soft bin)",

  "test_results": [
    "...see Test Result structure below..."
  ],

  "unit_metadata": {
    "component_lot_ids": ["string"],
    "sub_assembly_ids": ["string"],
    "custom_fields": {}
  },

  "extensions": {}
}
```

### Test Result Structure (Polymorphic)

```json
{
  "test_id": "string (unique within program)",
  "test_name": "string",
  "test_description": "string | null",
  "test_group": "string | null (grouping/category)",
  "sequence_number": "integer",
  "start_time": "ISO-8601 timestamp",
  "end_time": "ISO-8601 timestamp",
  "duration_ms": "number",
  "result": "enum: PASS|FAIL|INCONCLUSIVE|ABORT|SKIP|NOT_TESTED",

  "result_type": "enum: NUMERIC_LIMIT|MULTI_NUMERIC|STRING_MATCH|CATEGORICAL|
                         IMAGE_CLASSIFICATION|WAVEFORM_MATCH|COMPOSITE_SCORE|
                         STATISTICAL|CUSTOM",

  "result_data": {
    "...polymorphic based on result_type, see below..."
  },

  "attachments": [
    {
      "attachment_id": "string",
      "type": "enum: IMAGE|WAVEFORM|LOG|REPORT|VIDEO|RAW_DATA",
      "mime_type": "string",
      "uri": "string (URL, file path, or inline base64)",
      "description": "string | null",
      "hash": "string | null (SHA-256 for integrity)"
    }
  ],

  "annotations": [
    {
      "author": "string",
      "timestamp": "ISO-8601",
      "text": "string",
      "type": "enum: NOTE|WAIVER|DEVIATION|REWORK"
    }
  ],

  "extensions": {}
}
```

### Result Data Variants by `result_type`

#### NUMERIC_LIMIT

Covers electrical testing, dimensional inspection, MTF/SFR, impedance, etc.

```json
{
  "measured_value": "number",
  "unit": "string (SI or domain-specific)",
  "nominal": "number | null",
  "lower_limit": "number | null",
  "upper_limit": "number | null",
  "comparison_type": "enum: GE|GT|LE|LT|EQ|GELE|GELT|GTLE|GTLT|NE",
  "measurement_uncertainty": "number | null",
  "uncertainty_coverage_factor": "number | null (k-factor)"
}
```

#### MULTI_NUMERIC

Multiple measurements per step -- e.g., CMM multi-feature, SFR at multiple field positions.

```json
{
  "measurements": [
    {
      "parameter_name": "string",
      "measured_value": "number",
      "unit": "string",
      "nominal": "number | null",
      "lower_limit": "number | null",
      "upper_limit": "number | null",
      "comparison_type": "string",
      "result": "PASS|FAIL"
    }
  ]
}
```

#### CATEGORICAL

Go/no-go, visual pass/fail, enumerated outcomes.

```json
{
  "observed_value": "string",
  "accepted_values": ["string"],
  "rejected_values": ["string"],
  "category_definition": "string | null (reference to defect catalog)"
}
```

#### IMAGE_CLASSIFICATION

AOI, AI visual inspection, X-ray defect detection.

```json
{
  "model_id": "string",
  "model_version": "string",
  "predicted_class": "string",
  "confidence": "number (0.0-1.0)",
  "confidence_threshold": "number",
  "defects_found": [
    {
      "defect_code": "string",
      "defect_category": "string",
      "severity": "enum: CRITICAL|MAJOR|MINOR|COSMETIC",
      "description": "string",
      "location": {
        "x": "number", "y": "number",
        "width": "number | null", "height": "number | null",
        "reference_designator": "string | null",
        "zone": "string | null"
      },
      "confidence": "number"
    }
  ],
  "image_reference": "string (URI to source image)",
  "annotated_image_reference": "string | null"
}
```

#### WAVEFORM_MATCH

Acoustic frequency response, impedance curves, signal integrity.

```json
{
  "signal_type": "string (e.g., frequency_response, impedance, TDR)",
  "x_axis": {"label": "string", "unit": "string"},
  "y_axis": {"label": "string", "unit": "string"},
  "data_points": [{"x": "number", "y": "number"}],
  "reference_id": "string (golden sample or mask ID)",
  "comparison_method": "enum: CORRELATION|ENVELOPE_MASK|DTW|CUSTOM",
  "score": "number",
  "score_threshold": "number",
  "mask_upper": [{"x": "number", "y": "number"}],
  "mask_lower": [{"x": "number", "y": "number"}],
  "scalar_features": [
    {"name": "string", "value": "number", "unit": "string",
     "lower_limit": "number | null", "upper_limit": "number | null",
     "result": "PASS|FAIL"}
  ]
}
```

#### COMPOSITE_SCORE

Multi-parameter weighted scoring.

```json
{
  "scoring_method": "string (e.g., SAW, TOPSIS, custom)",
  "parameters": [
    {
      "name": "string",
      "raw_value": "number",
      "normalized_value": "number (0.0-1.0)",
      "weight": "number (0.0-1.0)",
      "weighted_score": "number",
      "min_threshold": "number | null",
      "parameter_result": "PASS|FAIL"
    }
  ],
  "composite_score": "number",
  "composite_threshold": "number"
}
```

#### STATISTICAL

Cpk, process capability, AQL lot acceptance.

```json
{
  "statistic_type": "enum: CAPABILITY|AQL_LOT|CONTROL_CHART",
  "sample_size": "integer",
  "mean": "number | null",
  "std_dev": "number | null",
  "cp": "number | null",
  "cpk": "number | null",
  "cpk_threshold": "number | null",
  "pp": "number | null",
  "ppk": "number | null",
  "usl": "number | null",
  "lsl": "number | null",
  "defects_found": "integer | null",
  "accept_number": "integer | null",
  "reject_number": "integer | null"
}
```

#### CUSTOM

Any customer-defined test type.

```json
{
  "custom_type_name": "string",
  "custom_type_version": "string",
  "data": {},
  "result_logic": "string | null (description or expression for how result was derived)"
}
```

---

## How This Schema Covers Each Requested Test Type

| Test Type | result_type(s) Used | Key Fields |
|-----------|-------------------|------------|
| Camera module MTF/SFR | MULTI_NUMERIC + WAVEFORM_MATCH | MTF values at field positions; SFR curves with mask limits |
| PCB AOI | IMAGE_CLASSIFICATION | defects_found with coordinates, reference designators, confidence |
| PCB X-ray | IMAGE_CLASSIFICATION + NUMERIC_LIMIT | Void percentage measurements + image-based defect detection |
| CMM dimensional | MULTI_NUMERIC | Per-feature measured/nominal/tolerance with GD&T references |
| Environmental testing | NUMERIC_LIMIT + attachments | Temperature/humidity profiles as waveform attachments; pass/fail per parameter |
| Electrical continuity/impedance | NUMERIC_LIMIT or MULTI_NUMERIC | Resistance, isolation, impedance values with IPC-class limits |
| Acoustic testing | WAVEFORM_MATCH + MULTI_NUMERIC | Frequency response curves with mask; scalar features (THD, SPL, Rub&Buzz) |
| Custom tests | CUSTOM or any combination | Extensible data payload with described result logic |

---

## Key Design Decisions and Rationale

1. **JSON over XML**: While QIF and MTConnect use XML, JSON is the modern standard for APIs and data interchange (IPC-CFX chose JSON; Sciemetric/Instrumental use JSON APIs). JSON Schema provides validation. XML round-tripping is straightforward.

2. **Polymorphic result_type**: Inspired by STDF's PTR/FTR/MPR pattern and IPC-CFX's measurement type system. A single test step can produce a NUMERIC_LIMIT result, an IMAGE_CLASSIFICATION result, or a WAVEFORM_MATCH result, each with appropriate fields.

3. **Serial-number-centric hierarchy**: Consistent with Sciemetric QualityWorX, Instrumental, and NI TestStand patterns. The traceability chain is: document -> lot -> unit -> test_result -> measurement.

4. **Calibration as first-class data**: ISO 17025 and NIST traceability require calibration certificate numbers, dates, and authority references to travel with the test data.

5. **Attachments model**: Image references (not inline base64 by default) allow large files to be stored in object storage while keeping the JSON document manageable. Hashes provide integrity verification.

6. **Extensions at every level**: Following OPC UA and MTConnect extensibility patterns, `extensions` objects allow domain-specific or customer-specific data without breaking the core schema.

7. **Sampling metadata**: AQL plans (ISO 2859) and sampling methods are first-class citizens, enabling lot-level acceptance decisions alongside unit-level results.

8. **Separation of result from disposition**: `result` (PASS/FAIL) is the raw test outcome; `disposition` is the downstream routing decision (which may incorporate waivers, re-test policies, or engineering overrides).

---

## Implementation Recommendations

1. **Publish as JSON Schema (draft 2020-12)** with strict validation for required fields and flexible validation for extensions.

2. **Provide format adapters** for existing standards: STDF-to-universal, AQDEF-to-universal, QIF-to-universal, IPC-CFX-to-universal converters.

3. **Use content-addressable storage** for attachments (images, waveforms, raw data files) with URIs in the schema document.

4. **Version the schema** using semver; include `schema_version` in every document for backward compatibility.

5. **Support both streaming and batch modes**: Individual unit results can be emitted as NDJSON (newline-delimited JSON) for real-time streaming, or batched into a single document per lot.

---

## Sources and References

### Standards Bodies and Specifications

- [SEMI E10 Specification](https://www.semi.org/en/Standards/CTR_031244)
- [SEMI Standards Overview - Kontron AIS](https://kontron-ais.com/en/resources/semi-standards)
- [QIF Standards - DMSC](https://qifstandards.org/)
- [QIF Revolutionizing Data Exchange - CMM Quarterly](https://cmm-quarterly.squarespace.com/articles/the-quality-information-framework-qif-revolutionizing-data-exchange-in-metrology)
- [ISO 23952:2020 QIF Standard](https://www.iso.org/standard/77461.html)
- [NIST QIF Technology Survey (NISTIR 8127)](https://nvlpubs.nist.gov/nistpubs/ir/2016/NIST.IR.8127.pdf)
- [AQDEF Working Group](https://www.aqdef.com/)
- [AQDEF K-Field Lists](https://www.aqdef.com/k-filed-lists/)
- [AQDEF Tools - GitHub](https://github.com/diribet/aqdef-tools/blob/master/UserGuide.md)
- [STDF V4 Specification](http://www.kanwoda.com/wp-content/uploads/2015/05/std-spec.pdf)
- [STDF - Wikipedia](https://en.wikipedia.org/wiki/Standard_Test_Data_Format)
- [STDF Significance - yieldWerx](https://yieldwerx.com/blog/understanding-the-significance-of-stdf-data-in-semiconductor-testing/)
- [MTConnect Getting Started](https://www.mtconnect.org/getting-started)
- [MTConnect - Wikipedia](https://en.wikipedia.org/wiki/MTConnect)
- [OPC UA Protocol - eInnoSys](https://www.einnosys.com/opc-ua-protocol/)
- [ISO 22400-2:2014](https://www.iso.org/standard/54497.html)
- [ISO 22400 KPI Implementation - MDPI](https://www.mdpi.com/2075-1702/6/3/39)
- [IPC-2591 CFX](https://www.electronics.org/ipc-2591-connected-factory-exchange-cfx)
- [IPC-CFX SDK - UnitsTested](http://www.connectedfactoryexchange.com/CFXDemo/sdk/html/T_CFX_Production_TestAndInspection_UnitsTested.htm)
- [IPC-CFX SDK - UnitsInspected](https://www.connectedfactoryexchange.com/cfxdemo/sdk/html/T_CFX_Production_TestAndInspection_UnitsInspected.htm)
- [IPC-CFX GitHub](https://github.com/IPCConnectedFactoryExchange/CFX)
- [OASIS - IAQG](https://iaqg.org/tools/oasis/)
- [OSLC Quality Management - OASIS Open](https://www.oasis-open.org/standard/oslc-quality-management-version-2-1/)

### Industry Platforms and Tools

- [Instrumental Product Platform](https://instrumental.com/product/)
- [Eigen Innovations](https://eigen.io/)
- [Landing AI Manufacturing](https://landing.ai/industries/manufacturing)
- [Sciemetric QualityWorX](https://www.sciemetric.com/data-intelligence/qualityworx-data-collection)
- [NI TestStand Database Schema](https://www.ni.com/en/support/documentation/supplemental/07/creating-a-teststand-database-schema-from-scratch.html)
- [NI TestStand UUT_RESULT Table](https://www.ni.com/docs/en-US/bundle/teststand/page/uut-result-table-schema.html)

### Additional References

- [Data Modeling Standards Comparison - HiveMQ](https://www.hivemq.com/blog/comparative-analysis-of-data-modeling-standards-for-smart-manufacturing/)
- [ISO 2859-1:2026 AQL Sampling](https://blog.ansi.org/ansi/iso-2859-1-2026-aql-sampling/)
- [IPC-9252 Electrical Testing](https://pcbsync.com/ipc-9252/)
- [KLIPPEL QC System](https://www.klippel.de/products/qc-system.html)
- [Imatest SFR Instructions](https://www.imatest.com/docs/sfr_instructions/)
- [Apache Iceberg for Industrial Data - STX Next](https://www.stxnext.com/blog/apache-iceberg-lakehouse-for-industrial-data-platforms)
