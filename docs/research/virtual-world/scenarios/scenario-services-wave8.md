# Scenario Pairings: 25 Service-Based Scenarios (S076-S100)

> 25 service-based scenario pairings where a service provider performs a service (not delivers a physical product) for a customer.
> Each scenario involves real services with real deliverables, quality criteria, and standard references.
> Same format as the original scenarios, adapted for service engagements.

---

## Distribution Summary

**Service Categories:**
- Calibration & Metrology: 5 (S076-S080)
- Testing Laboratory: 5 (S081-S085)
- Contract Engineering: 5 (S086-S090)
- Maintenance & Repair: 3 (S091-S093)
- Logistics & Inspection: 3 (S094-S096)
- Training & Audit: 2 (S097-S098)
- IT & Data: 2 (S099-S100)

**Service Order Values:** Small ($500-$10K): 6 | Medium ($10K-$50K): 11 | Large ($50K-$100K): 8
**Dispute Likelihood:** Low: 12 | Medium: 9 | High: 4

**New Company Summary:**
- Service Provider companies (Factory 39-55): 17 new service provider profiles
- Customer companies (OEM-38 through OEM-49): 12 new customer profiles
- Reused existing companies: OEM-01, OEM-04, OEM-09, OEM-14, OEM-18, OEM-20, OEM-27, OEM-31, OEM-34, Factory 02, Factory 32, Factory 33, Factory 34

---

## CALIBRATION & METROLOGY SERVICES (S076 -- S080)

---

### S076 [SERVICE]

**Customer:** Meridian Automotive Systems (OEM-09)
**Service Provider:** Westlake Calibration Services LLC (Factory 39)
**Service Type:** Dimensional gauge calibration -- 85 instruments (calipers, micrometers, bore gauges, height gauges) per ISO/IEC 17025:2017
**Service Description:** Annual calibration of Meridian's Detroit brake engineering lab dimensional gauges. Westlake performs pickup, calibration, adjustment (where applicable), and return with certificates. Instruments range from 0-150 mm digital calipers to 50-75 mm outside micrometers and 100 mm height gauges.
**Service Order Value:** $14,500

**Deliverables:**
1. ISO/IEC 17025:2017 calibration certificate for each instrument (85 total)
2. As-found and as-left measurement data at 5 test points per instrument
3. Measurement uncertainty statement per GUM for each parameter
4. Metrological traceability chain from Westlake reference standards to NIST/SI
5. Out-of-tolerance (OOT) notification within 24 hours of discovery, with impact assessment form

**Acceptance Criteria:**
1. Calipers: accuracy within +/- 0.02 mm at 0, 25, 50, 100, 150 mm per ASME B89.1.6
2. Micrometers: accuracy within +/- 0.002 mm (0-25 mm range) per ASME B89.1.13, verified against Grade K gage blocks
3. All certificates issued within 10 business days of instrument receipt
4. 100% of instruments returned with current calibration sticker (ID, date, due date, technician)
5. OOT rate documented; historical trend comparison provided for repeat instruments

**How Completion Is Verified:**
Meridian's quality engineer reviews each certificate against the instrument's required accuracy per their gauge R&R program. Certificates are uploaded to Meridian's calibration management database (GAGEtrak). Service is complete when all 85 certificates are accepted, OOT instruments are dispositioned, and the calibration sticker on each instrument matches the certificate.

**Service Report Format:**
```
File: calibration_certificate_{instrument_serial}.pdf
Sections: Certificate Number | Instrument Description (make, model, serial) | Customer | Date of Calibration | Date of Issue | Calibration Procedure Reference | Environmental Conditions (temp, humidity) | Reference Standards Used (ID, traceability) | Test Results Table: [Test Point | Nominal Value | Measured Value (as-found) | Measured Value (as-left) | Tolerance | Uncertainty (k=2) | Pass/Fail] | Traceability Statement | Authorized Signatory
```
Sample row in test results: `Test Point 3 | 50.000 mm | 50.003 mm | 50.001 mm | +/- 0.020 mm | 0.004 mm (k=2) | PASS`

**Standard Reference:** ISO/IEC 17025:2017, ASME B89.1.6 (calipers), ASME B89.1.13 (micrometers), GUM (JCGM 100:2008)

**Expected Outcome:** 92% of instruments found within tolerance; 8% requiring adjustment or OOT notification
**Dispute Likelihood:** Low -- Calibration is a well-defined metrological service with objective acceptance criteria. Westlake's A2LA accreditation ensures measurement competence.
**Settlement Timeline:** Week 1: Westlake picks up 85 gauges from Meridian Detroit. Week 2-3: Calibration performed (6-8 instruments/day). Week 4: Certificates generated, instruments returned. Week 5: Meridian reviews certificates and updates database. Week 6: Payment release (Net-30). Total: 4-6 weeks.

---

### S077 [SERVICE]

**Customer:** WindStream Renewable Energy (OEM-34)
**Service Provider:** Precision Metrology Services GmbH (Factory 32)
**Service Type:** Torque wrench calibration -- 22 torque wrenches (20-2000 Nm range) per ISO 6789-2:2017
**Service Description:** On-site calibration of torque wrenches used in WindStream's Aalborg wind turbine nacelle assembly line. Bolt torque accuracy is safety-critical for turbine blade root bolts (M36, 2800 Nm specified torque). PMS deploys a mobile calibration van with a Norbar TruCheck reference transducer system.
**Service Order Value:** $9,800

**Deliverables:**
1. Calibration certificate per ISO 6789-2:2017 for each wrench (22 total)
2. Test data at 3 points per wrench: 20%, 60%, and 100% of nominal capacity
3. Measurement uncertainty per ISO 6789-2:2017 Annex A (7 uncertainty components)
4. Traceability chain from PMS reference transducer to PTB (German national metrology institute)
5. As-found/as-left data with graphical accuracy plot per wrench

**Acceptance Criteria:**
1. Torque wrenches (indicating type): accuracy within +/- 4% of reading at 20%, 60%, and 100% of full scale per ISO 6789-1:2017 Table 1
2. Torque wrenches (setting type): accuracy within +/- 4% of set value at each test point
3. Repeatability: CV (coefficient of variation) <= 1% at each test point (5 readings per point)
4. Calibration certificates delivered within 48 hours of on-site completion
5. Any wrench exceeding +/- 4% flagged immediately with recommendation (adjust or remove from service)

**How Completion Is Verified:**
WindStream's quality manager reviews certificates and confirms all wrenches are within +/- 4% tolerance. Wrenches with as-found deviations exceeding +/- 4% trigger a documented impact assessment (were any bolts tightened with this wrench since last calibration?). Service is complete when all 22 certificates are accepted and WindStream's torque wrench register is updated.

**Service Report Format:**
```
File: torque_cal_{wrench_serial}_{date}.pdf
Sections: Certificate Number | Wrench Description (make, model, serial, type, range) | Customer Site | Date of Calibration | Reference Transducer (ID, cal date, traceability) | Environmental Conditions | Test Results Table: [Test Point % | Set/Nominal Value Nm | Reading 1-5 Nm | Mean Nm | Deviation % | Uncertainty % (k=2) | Tolerance +/- 4% | Pass/Fail] | Accuracy Plot (deviation vs. range graph) | Authorized Signatory
```
Sample row: `100% | 2000.0 Nm | 2012, 2008, 2015, 2010, 2013 | 2011.6 Nm | +0.58% | 0.35% (k=2) | +/- 4.0% | PASS`

**Standard Reference:** ISO 6789-1:2017 (requirements), ISO 6789-2:2017 (calibration and uncertainty)

**Expected Outcome:** 90% of wrenches found within +/- 4%; 10% requiring adjustment or replacement
**Dispute Likelihood:** Low -- Torque calibration per ISO 6789 is highly standardized. PMS has performed this service annually for WindStream for 3 years with no disputes.
**Settlement Timeline:** Day 1: PMS mobile van arrives at Aalborg. Day 1-2: On-site calibration (11 wrenches/day). Day 3: Certificates generated and delivered electronically. Week 2: Payment release (Net-30). Total: 2-3 weeks.

---

### S078 [SERVICE]

**Customer:** Nextera Process Equipment Inc. (OEM-38)
**Service Provider:** Tri-State Instrumentation Calibration Inc. (Factory 40)
**Service Type:** Pressure gauge calibration -- 45 pressure gauges (0-100 psi to 0-10,000 psi) per ASME B40.100
**Service Description:** Semi-annual calibration of pressure gauges installed on Nextera's pressure vessel test stands in Houston. Gauges range from 4.5" dial (Grade 2A, 0.5% accuracy) to 6" test gauges (Grade 3A, 0.25% accuracy). Service includes removal from service, lab calibration against a Fluke 2271A reference pressure controller, and reinstallation.
**Service Order Value:** $11,200

**Deliverables:**
1. Calibration certificate per ISO/IEC 17025:2017 for each gauge (45 total)
2. Test data at 5 points: 10%, 25%, 50%, 75%, 90% of full scale (ascending and descending)
3. Hysteresis measurement (difference between ascending and descending readings at each point)
4. As-found condition: in-tolerance, out-of-tolerance, or adjusted
5. NIST-traceable reference standard documentation

**Acceptance Criteria:**
1. Grade 2A gauges: accuracy within +/- 0.5% of span at middle 50% of range; +/- 1.0% at lower and upper 25% of range per ASME B40.100
2. Grade 3A gauges: accuracy within +/- 0.25% of span across full range per ASME B40.100
3. Hysteresis: <= gauge accuracy grade across all test points
4. All gauges returned calibrated within 7 business days
5. Any gauge with unrepairable damage or drift beyond adjustment range documented and reported for replacement

**How Completion Is Verified:**
Nextera's instrumentation engineer reviews certificates, verifies accuracy grades match the service requirements for each test stand (Grade 3A for ASME Code hydrostatic test gauges, Grade 2A for monitoring gauges), and updates the gauge register. Service is complete when all 45 gauges are reinstalled, certificates are filed, and the calibration status board in the test bay is updated.

**Service Report Format:**
```
File: pressure_cal_{gauge_serial}_{date}.pdf
Sections: Certificate Number | Gauge Description (make, model, serial, range, grade, dial size) | Location/Tag Number | Reference Standard (Fluke 2271A serial, cal date) | Test Results Table: [Test Point % | Nominal Pressure | Applied Pressure (ascending) | Gauge Reading (ascending) | Error (ascending) | Applied Pressure (descending) | Gauge Reading (descending) | Error (descending) | Hysteresis | Tolerance | Pass/Fail] | Condition: In-Tolerance / Out-of-Tolerance / Adjusted | Authorized Signatory
```
Sample row: `50% | 2500 psi | 2500.0 psi | 2503 psi | +0.06% | 2500.0 psi | 2497 psi | -0.06% | 0.12% | +/- 0.50% | PASS`

**Standard Reference:** ASME B40.100 (pressure gauges), ISO/IEC 17025:2017

**Expected Outcome:** 88% found in tolerance; 9% adjusted and returned; 3% recommended for replacement
**Dispute Likelihood:** Low -- Pressure gauge calibration has well-defined accuracy grades per ASME B40.100. The only potential dispute is whether a gauge near the tolerance boundary should be adjusted or replaced.
**Settlement Timeline:** Week 1: Tri-State removes gauges from Nextera test stands. Week 2: Lab calibration (8-10 gauges/day). Week 3: Return and reinstallation. Week 4: Payment release (Net-30). Total: 3-4 weeks.

---

### S079 [SERVICE]

**Customer:** Pinnacle Pharmaceuticals (OEM-18)
**Service Provider:** ThermalTek Calibration Solutions Ltd. (Factory 41)
**Service Type:** Temperature sensor calibration -- 60 RTD sensors (Pt100, Class A) and 24 thermocouple sensors (Type K) per IEC 60751 and IEC 60584
**Service Description:** Annual calibration of temperature sensors used in Pinnacle's pharmaceutical manufacturing autoclave systems (sterilization validation) and cold storage monitoring at their Dublin facility. Autoclave RTDs are safety-critical (sterilization at 121 C +/- 0.5 C). ThermalTek performs comparison calibration in a Hart Scientific 9142 dry-well calibrator traceable to ITS-90 via fixed-point cells.
**Service Order Value:** $18,400

**Deliverables:**
1. ISO/IEC 17025:2017 calibration certificate for each sensor (84 total)
2. Test data at 4 temperature points per sensor: 0 C (ice point), 50 C, 100 C, 150 C for RTDs; 0 C, 100 C, 200 C, 300 C for Type K thermocouples
3. As-found and as-left deviation from ITS-90 reference value at each point
4. Measurement uncertainty per GUM, expanded uncertainty (k=2)
5. Sensor drift trend analysis (comparison to previous year's calibration data)

**Acceptance Criteria:**
1. Pt100 RTDs (Class A): tolerance +/- (0.15 + 0.002 x |t|) C per IEC 60751 (e.g., +/- 0.15 C at 0 C, +/- 0.39 C at 121 C)
2. Type K thermocouples: tolerance +/- 1.5 C or +/- 0.4% of reading (whichever is greater) per IEC 60584
3. Autoclave RTDs (safety-critical): tighter customer tolerance of +/- 0.3 C at 121 C (stricter than IEC Class A)
4. Drift: any sensor showing > 50% of tolerance band shift since last calibration flagged for preventive replacement
5. All certificates delivered within 15 business days

**How Completion Is Verified:**
Pinnacle's qualification engineer reviews each certificate, with special focus on autoclave RTDs at 121 C. Any RTD exceeding the customer-specified +/- 0.3 C tolerance at 121 C triggers a qualification impact assessment per FDA 21 CFR Part 211 (was any sterilization cycle validated with this sensor since last calibration?). Service is complete when all 84 certificates are accepted, sensor drift trends are reviewed, and Pinnacle's validated instrument list is updated.

**Service Report Format:**
```
File: temp_cal_{sensor_serial}_{date}.pdf
Sections: Certificate Number | Sensor Description (type, make, serial, range, wire configuration) | Customer/Location | Reference Standard (Hart 9142 serial, ITS-90 traceability) | Environmental Conditions | Test Results Table: [Temp Point C | Reference Temp C (ITS-90) | Sensor Reading C (as-found) | Deviation C (as-found) | Sensor Reading C (as-left) | Deviation C (as-left) | Tolerance C | Uncertainty C (k=2) | Pass/Fail] | Drift Summary vs. Previous Calibration | Authorized Signatory
```
Sample row: `121 C | 121.003 C | 121.18 C | +0.18 C | 121.12 C | +0.12 C | +/- 0.30 C | 0.05 C (k=2) | PASS`

**Standard Reference:** IEC 60751:2008 (RTDs), IEC 60584-1:2013 (thermocouples), ITS-90, GUM, FDA 21 CFR Part 211

**Expected Outcome:** 94% within tolerance; 4% adjusted; 2% recommended for replacement due to excessive drift
**Dispute Likelihood:** Medium -- The customer-imposed +/- 0.3 C tolerance at 121 C for autoclave RTDs is tighter than IEC Class A (+/- 0.39 C at 121 C). Sensors that pass IEC Class A but fail Pinnacle's customer specification create a gray zone: is the sensor "in tolerance" or not? This depends on which specification is contractually binding.
**Settlement Timeline:** Week 1: ThermalTek receives 84 sensors from Pinnacle Dublin. Week 2-4: Calibration (5-6 sensors/day with thermal stabilization time). Week 5: Certificates generated and delivered. Week 6: Pinnacle review and payment. Total: 5-6 weeks.

---

### S080 [SERVICE]

**Customer:** Vanguard Propulsion Technologies (OEM-14)
**Service Provider:** Precision Metrology Services GmbH (Factory 32)
**Service Type:** Optical comparator calibration -- 4 optical comparators (Nikon V-24B, 300mm screen diameter) per ISO/IEC 17025:2017
**Service Description:** Annual calibration of optical comparators used in Vanguard's turbine blade quality lab in Phoenix, AZ. Comparators measure turbine blade airfoil profiles, root form geometry, and cooling hole positions at 20x and 50x magnification. PMS dispatches a field technician from their US partner lab (Dallas) with NIST-traceable calibration masters.
**Service Order Value:** $7,200

**Deliverables:**
1. Calibration certificate per ISO/IEC 17025:2017 for each comparator (4 total)
2. X-Y stage linearity verification at 10 points across full travel (300 mm X, 150 mm Y)
3. Magnification accuracy verification at 10x, 20x, 50x using certified glass reticle master
4. Angular measurement accuracy verification at 0, 30, 45, 60, 90 degrees
5. Screen chart overlay accuracy verification (edge-to-edge linearity)

**Acceptance Criteria:**
1. X-Y stage linearity: error <= 0.005 mm at any point across full travel, verified against laser-interferometer-calibrated gauge blocks
2. Magnification accuracy: error <= 0.05% at each magnification setting, verified against NIST-traceable glass reticle
3. Angular measurement: error <= 2 arc-minutes at each test angle
4. Screen illumination: uniformity within 10% across projection area
5. All 4 comparators calibrated and certificates delivered within 3 business days (on-site service)

**How Completion Is Verified:**
Vanguard's metrology manager witnesses the calibration and signs the on-site work completion form. Certificates are reviewed for X-Y linearity and magnification accuracy. Service is complete when all 4 certificates are accepted and the comparators are returned to service with updated calibration stickers.

**Service Report Format:**
```
File: optical_comp_cal_{comparator_serial}_{date}.pdf
Sections: Certificate Number | Comparator Description (make, model, serial, screen diameter) | Customer Site | Reference Masters (reticle ID, gauge block set ID, traceability) | X-Y Linearity Table: [Position mm | Nominal | Measured | Error mm | Tolerance mm | Pass/Fail] | Magnification Table: [Mag Setting | Reference Feature mm | Projected Feature mm | Mag Error % | Tolerance % | Pass/Fail] | Angular Accuracy Table: [Set Angle | Measured Angle | Error arc-min | Tolerance arc-min | Pass/Fail] | Authorized Signatory
```
Sample row (linearity): `X = 150.000 mm | 150.000 | 150.003 | +0.003 mm | +/- 0.005 mm | PASS`

**Standard Reference:** ISO/IEC 17025:2017, manufacturer's specifications (Nikon V-24B accuracy spec)

**Expected Outcome:** 100% of comparators expected to pass (annual drift is minimal for well-maintained optical systems)
**Dispute Likelihood:** Low -- Optical comparator calibration is straightforward; acceptance criteria are defined by the manufacturer's accuracy specification.
**Settlement Timeline:** Day 1-3: PMS field technician performs on-site calibration at Vanguard Phoenix. Day 4-5: Certificates delivered electronically. Week 2: Payment (Net-30). Total: 2-3 weeks.

---

## TESTING LABORATORY SERVICES (S081 -- S085)

---

### S081 [SERVICE]

**Customer:** Ironvale Steel & Alloys (OEM-21)
**Service Provider:** Great Lakes Materials Testing Laboratory Inc. (Factory 42)
**Service Type:** Tensile testing service -- 120 specimens from 30 steel heats per ASTM E8/E8M and ISO 6892-1
**Service Description:** Ironvale sends machined tensile specimens (round bar, 12.5 mm gauge diameter, 50 mm gauge length per ASTM E8 Figure 8) from incoming structural steel plate lots (S355J2, S460N, A572 Gr. 50). Great Lakes performs room-temperature tensile tests on a 600 kN UTM calibrated per ASTM E4 and reports yield strength, UTS, elongation, and reduction of area.
**Service Order Value:** $16,800

**Deliverables:**
1. Tensile test report per ASTM E8/E8M Section 12 for each specimen (120 total)
2. Stress-strain curve (digital file, CSV format) for each test
3. Reported properties: yield strength (Rp0.2 or ReH), ultimate tensile strength (Rm), elongation at fracture (A%), reduction of area (Z%)
4. Equipment calibration verification per ASTM E4 (load cell) and ASTM E83 (extensometer)
5. Summary matrix: all 120 results tabulated by heat number with pass/fail against customer specification

**Acceptance Criteria:**
1. Testing per ASTM E8/E8M-22: strain rate 0.015 +/- 0.003 mm/mm/min through yield (Method A)
2. Specimen dimensions verified and recorded per ASTM E8 Section 8 before testing
3. Load cell accuracy within +/- 1% of indicated load per ASTM E4
4. Extensometer Class B-1 or better per ASTM E83
5. Test report issued within 5 business days of specimen receipt

**How Completion Is Verified:**
Ironvale's quality metallurgist reviews the summary matrix, compares results against EN 10025-2 (for S355J2: YS >= 355 MPa, UTS 470-630 MPa, elongation >= 22%) or ASTM A572 (YS >= 345 MPa, UTS >= 450 MPa). Any specimen failing specification triggers an investigation. Service is complete when all 120 reports are delivered and the summary matrix is accepted.

**Service Report Format:**
```
File: tensile_report_{specimen_id}_{date}.pdf + tensile_data_{specimen_id}.csv
Report Sections: Lab Report Number | Customer | Heat Number | Material Grade | Specimen ID | Specimen Dimensions (diameter, gauge length) | Test Date | Test Machine (ID, capacity, cal date) | Extensometer (ID, class, cal date) | Strain Rate | Test Results: [YS Rp0.2 MPa | UTS Rm MPa | Elongation A % | Reduction of Area Z %] | Customer Specification | Pass/Fail | Tested By | Reviewed By
CSV Columns: time_s, force_kN, stress_MPa, strain_pct, extensometer_mm
```
Sample results: `Heat H-2026-0447 | S355J2 | Spec-001 | YS: 387 MPa | UTS: 542 MPa | A: 26.3% | Z: 68% | Spec: YS>=355, UTS 470-630, A>=22% | PASS`

**Standard Reference:** ASTM E8/E8M-22, ASTM E4 (force verification), ASTM E83 (extensometer), ISO 6892-1:2019

**Expected Outcome:** 97% of specimens pass specification (established steel grades with well-controlled chemistry)
**Dispute Likelihood:** Low -- Tensile testing is a highly standardized mechanical test. Results are objective and reproducible.
**Settlement Timeline:** Week 1: Ironvale ships 120 machined specimens. Week 2: Great Lakes performs tensile tests (20-25 tests/day). Week 3: Reports generated and summary matrix delivered. Week 4: Payment (Net-30). Total: 3-4 weeks.

---

### S082 [SERVICE]

**Customer:** Volante Automotive Group (OEM-27)
**Service Provider:** Rhine Valley Analytical GmbH (Factory 43)
**Service Type:** Chemical analysis service (ICP-OES and combustion analysis) -- 50 samples from incoming aluminum and steel material lots
**Service Description:** Volante's Turin quality lab sends drill chip samples from incoming raw material lots (A356 aluminum castings, DC04 cold-rolled steel) to Rhine Valley for independent third-party chemical verification. Rhine Valley performs ICP-OES for metallic elements (Si, Cu, Mg, Mn, Fe, Cr, Ni, Zn) and combustion analysis for C and S, reporting against Volante's material specifications.
**Service Order Value:** $8,500

**Deliverables:**
1. Chemical analysis report per ISO/IEC 17025:2017 for each sample (50 total)
2. Elemental composition in weight percent for all specified elements
3. Method reference: ICP-OES per ASTM E1479 (aluminum) or ASTM E1019/E1086 (steel)
4. Detection limits and measurement uncertainty for each element
5. Compliance statement against Volante's material specification for each sample

**Acceptance Criteria:**
1. A356 aluminum: Si 6.5-7.5%, Mg 0.25-0.45%, Fe <= 0.20%, Cu <= 0.20% per ASTM B108
2. DC04 steel: C <= 0.08%, Mn <= 0.40%, P <= 0.030%, S <= 0.030% per EN 10130
3. Measurement uncertainty: <= 5% relative for major elements (> 1.0 wt%), <= 10% relative for minor elements (0.01-1.0 wt%)
4. Turnaround: results within 3 business days of sample receipt (standard); within 24 hours (rush, at 50% surcharge)
5. All analysis performed by operators with demonstrated proficiency (participation in round-robin testing programs)

**How Completion Is Verified:**
Volante's incoming quality team compares Rhine Valley's independent results against the supplier's mill test certificate. Discrepancies exceeding measurement uncertainty trigger a third-party arbitration analysis. Service is complete when all 50 reports are delivered and Volante confirms no arbitration is required.

**Service Report Format:**
```
File: chem_analysis_{sample_id}_{date}.pdf
Sections: Report Number | Customer | Sample ID | Material Grade | Sample Description | Date Received | Date Analyzed | Method | Instrument (make, model, serial, cal date) | Results Table: [Element | Result wt% | Specification Min wt% | Specification Max wt% | Uncertainty (+/-) | Pass/Fail] | Reference Standards Used | Analyst | Reviewer
```
Sample row: `Si | 7.12% | 6.50% | 7.50% | +/- 0.15% | PASS`

**Standard Reference:** ASTM E1479 (ICP-OES for aluminum), ASTM E1019 (combustion for C/S in steel), ISO/IEC 17025:2017

**Expected Outcome:** 96% of samples within specification; 4% with minor deviations requiring investigation with the material supplier
**Dispute Likelihood:** Medium -- When Rhine Valley's independent analysis disagrees with the supplier's mill certificate, Volante must decide whether to reject the material lot. The dispute is between Volante and the material supplier, but Rhine Valley's data is the evidence. Accuracy of sample preparation (drill chip location, contamination) can influence results.
**Settlement Timeline:** Week 1: Volante ships 50 drill chip samples. Week 2: Rhine Valley performs ICP-OES and combustion analysis. Week 3: Reports delivered. Week 4: Payment (Net-30). Total: 3-4 weeks.

---

### S083 [SERVICE]

**Customer:** Lumenar Technologies (OEM-01)
**Service Provider:** Shenzhen Ruixin EMC Testing Laboratory (Factory 34)
**Service Type:** Failure analysis service -- root cause investigation of field-returned smartphone camera modules exhibiting intermittent focus failures
**Service Description:** Lumenar ships 25 field-returned camera modules (from S001 production) exhibiting intermittent autofocus hunting. Ruixin's failure analysis lab performs non-destructive (X-ray, thermal imaging during operation) and destructive analysis (cross-section, SEM/EDS of voice coil motor adhesive joints) to identify the root cause and recommend corrective action.
**Service Order Value:** $22,000

**Deliverables:**
1. Failure analysis report: executive summary, failure mode description, investigation methodology, root cause identification, and corrective action recommendations
2. Non-destructive examination results: X-ray images (all 25 modules), thermal maps during AF operation (all 25 modules)
3. Destructive analysis: SEM micrographs and EDS elemental maps of cross-sectioned VCM adhesive joints (5 modules)
4. Statistical failure mode distribution across the 25-unit sample
5. Technical presentation (PowerPoint, 20-30 slides) for Lumenar engineering review meeting

**Acceptance Criteria:**
1. Root cause identified to a specific component, material, or process failure mechanism (not "further investigation required")
2. Corrective action recommendation is actionable (specific process parameter change, material substitution, or design modification)
3. All SEM images at minimum 500x magnification with scale bar; EDS spectra with element identification
4. Report delivered within 15 business days of sample receipt
5. Interim findings communicated within 5 business days if a safety-critical failure mode is identified

**How Completion Is Verified:**
Lumenar's reliability engineering team reviews the FA report and corrective action recommendations. A 2-hour technical review meeting is held (video conference). Service is complete when Lumenar accepts the root cause finding (consensus or documented disagreement) and receives a corrective action plan that can be implemented at the CM (Huaqiang Optics, Factory 01).

**Service Report Format:**
```
File: FA_report_{FA_case_no}_{date}.pdf
Sections: 1. Executive Summary | 2. Background & Problem Statement | 3. Sample Description (25 modules: serial numbers, field failure dates, symptom descriptions) | 4. Investigation Methodology (NDT: X-ray, thermal; DT: cross-section, SEM/EDS) | 5. Non-Destructive Findings (X-ray images, thermal maps with annotations) | 6. Destructive Findings (cross-section photos, SEM micrographs, EDS spectra) | 7. Failure Mode Distribution Table: [Failure Mode | Count | Percentage] | 8. Root Cause Analysis (5-Why, Fishbone diagram) | 9. Corrective Action Recommendations | 10. Appendices (raw data, equipment list)
```
Sample failure mode row: `VCM adhesive delamination at spring/yoke interface | 18/25 | 72%`

**Standard Reference:** IPC-9503 (electronics failure analysis guidelines), JEDEC JEP001 (FA lab practices)

**Expected Outcome:** Root cause identified in 90% of cases (10% may require additional samples or manufacturing process observation at the CM)
**Dispute Likelihood:** Medium -- Failure analysis is inherently interpretive. Lumenar may disagree with the root cause if it implies a design issue (Lumenar's responsibility) rather than a manufacturing defect (Huaqiang's responsibility). The financial implications of root cause attribution drive the dispute.
**Settlement Timeline:** Week 1: Lumenar ships 25 modules from Shenzhen warehouse to Ruixin lab. Week 2: Non-destructive examination. Week 3: Destructive analysis and SEM/EDS. Week 4: Report writing and internal review. Week 5: Delivery and technical review meeting. Week 6: Payment. Total: 5-6 weeks.

---

### S084 [SERVICE]

**Customer:** Nextera Water Technologies (OEM-35)
**Service Provider:** Gulf Coast Environmental Testing LLC (Factory 44)
**Service Type:** Environmental testing service -- salt spray testing per ASTM B117 and UV exposure testing per ASTM G154
**Service Description:** Nextera submits 60 coated stainless steel test panels (316L SS with epoxy-polyester powder coat, intended for desalination plant equipment) for accelerated corrosion and UV degradation testing. Gulf Coast operates 4 salt spray chambers and 2 QUV accelerated weathering testers.
**Service Order Value:** $14,800

**Deliverables:**
1. Salt spray test report per ASTM B117: test panels exposed for 1,000 hours (5% NaCl, 35 C, pH 6.5-7.2)
2. UV exposure test report per ASTM G154 Cycle 1: 1,000 hours (UVA-340 lamps, 0.89 W/m2 at 340 nm, 60 C)
3. Visual evaluation of corrosion per ASTM D1654 (creep from scribe, rating scale 0-10)
4. Color change measurement (Delta E per CIE Lab) and gloss retention per ASTM D523 after UV exposure
5. Photographic documentation: before, during (at 250h, 500h, 750h intervals), and after exposure

**Acceptance Criteria:**
1. Salt spray 1,000h: creep from scribe <= 3 mm (ASTM D1654 Rating >= 7), no blistering > ASTM D714 Size 8 (few)
2. Salt spray 1,000h: no red rust on unscribed areas
3. UV 1,000h: Delta E <= 3.0 (visible color change threshold), gloss retention >= 60% of initial
4. UV 1,000h: no cracking, peeling, or chalking visible to unaided eye
5. All test reports delivered within 10 business days after test completion

**How Completion Is Verified:**
Nextera's coatings engineer reviews the reports and photographs. Pass/fail is determined against Nextera's coating specification NWT-COAT-007. Service is complete when the test reports are delivered, photographs are accepted, and Nextera issues a formal disposition on the coating system (approved/conditionally approved/rejected for the Oman desalination project).

**Service Report Format:**
```
File: env_test_{project_id}_{date}.pdf
Sections: Report Number | Customer | Test Standard | Sample Description (substrate, coating system, DFT range) | Test Parameters (duration, temperature, solution) | Visual Evaluation Table: [Panel ID | Inspection Interval hrs | Creep from Scribe mm | Blistering ASTM D714 | Red Rust Y/N | Photo Reference] | UV Test Results: [Panel ID | Delta E (initial vs. final) | Gloss (initial GU | final GU | retention %) | Cracking/Peeling/Chalking] | Conclusion | Photographs (numbered, annotated)
```
Sample salt spray row: `Panel NWT-012 | 1000h | 2.1 mm | Size 8, Few | No | Photo 12A | Creep Rating 8 | PASS`

**Standard Reference:** ASTM B117 (salt spray), ASTM G154 (UV exposure), ASTM D1654 (corrosion evaluation), ASTM D714 (blistering), ASTM D523 (gloss)

**Expected Outcome:** 85% of panels pass both salt spray and UV criteria (powder coat formulation may need optimization for Gulf coast environment)
**Dispute Likelihood:** Low -- Environmental testing is a well-defined service with objective pass/fail per ASTM evaluation standards. Gulf Coast provides the data; Nextera makes the disposition decision.
**Settlement Timeline:** Week 1: Nextera ships 60 panels to Gulf Coast (Pasadena, TX). Week 2: Panels scribed, loaded into chambers, testing initiated. Week 7-8: Salt spray and UV tests completed simultaneously (1,000h = 42 days). Week 9: Final evaluation, photography, reporting. Week 10: Reports delivered. Week 11: Payment. Total: 9-11 weeks.

---

### S085 [SERVICE]

**Customer:** Krakow Advanced Electronics (OEM-31)
**Service Provider:** Heartland Environmental Testing Inc. (Factory 33)
**Service Type:** EMC pre-compliance testing service -- radiated and conducted emissions scan of prototype industrial IoT gateway per CISPR 32 Class A
**Service Description:** Krakow AE ships 3 prototype IoT gateways (ARM-based, WiFi/Ethernet, 24V DC input) to Heartland for pre-compliance emissions scanning. This is a diagnostic service to identify emissions issues before formal compliance testing, allowing Krakow to make design fixes that reduce the risk of formal test failure.
**Service Order Value:** $5,200

**Deliverables:**
1. Pre-compliance test report: radiated emissions scan (30 MHz - 6 GHz) with margin analysis against CISPR 32 Class A limits
2. Conducted emissions scan (150 kHz - 30 MHz) on AC/DC power supply with margin analysis
3. Frequency-amplitude table of top 10 highest emissions (sorted by margin to limit)
4. Diagnostic assessment: identification of probable emission sources and recommended design mitigations (shielding, filtering, layout changes)
5. Comparison photographs: near-field probe scan identifying hot spots on the PCB

**Acceptance Criteria:**
1. All emissions measured with calibrated equipment (spectrum analyzer + antenna, cal current within 1 year)
2. Margin analysis: each emission reported with dB margin to CISPR 32 Class A limit (positive = compliant, negative = fail)
3. Near-field scan performed with H-field probe at 3-5 mm above PCB surface
4. Diagnostic recommendations reference specific component designators and PCB layout areas
5. Report delivered within 5 business days of DUT receipt

**How Completion Is Verified:**
Krakow's EMC engineer reviews the margin analysis and diagnostic recommendations. A 1-hour technical discussion call with Heartland's senior EMC engineer is included in the service. Service is complete when the report is delivered and the diagnostic discussion has occurred.

**Service Report Format:**
```
File: EMC_precomp_{project_id}_{date}.pdf
Sections: 1. DUT Description (photos, block diagram, port list) | 2. Test Setup (antenna, distance, ground plane, cable routing) | 3. Radiated Emissions: [Freq MHz | Measured dBuV/m | CISPR 32 Class A Limit dBuV/m | Margin dB | Detector (QP/AVG)] | 4. Conducted Emissions: [Freq MHz | Measured dBuV | Limit dBuV | Margin dB | Detector] | 5. Near-Field Scan (annotated PCB photograph with hot spots marked) | 6. Top 10 Emissions Table | 7. Diagnostic Assessment & Recommendations | 8. Equipment List with Cal Dates
```
Sample radiated row: `147.3 MHz | 38.2 dBuV/m | 40.0 dBuV/m | +1.8 dB | QP | WARNING: < 6 dB margin`

**Standard Reference:** CISPR 32 (emissions limits), IEC 61000-4 series (immunity, if requested)

**Expected Outcome:** 60% probability of meeting all CISPR 32 Class A limits with >= 6 dB margin on first scan (DVT prototypes typically have emissions issues)
**Dispute Likelihood:** Low -- Pre-compliance is an advisory/diagnostic service, not a regulatory certification. The value is in the diagnostic insight, not a pass/fail verdict.
**Settlement Timeline:** Week 1: DUT shipped from Krakow to Huntsville. Week 2: Pre-compliance scanning (2-3 days). Week 3: Report and diagnostic discussion. Week 4: Payment (Net-30). Total: 3-4 weeks.

---

## CONTRACT ENGINEERING SERVICES (S086 -- S090)

---

### S086 [SERVICE]

**Customer:** Greenfield IoT Solutions (OEM-04)
**Service Provider:** SiliconBridge PCB Design Services Pvt. Ltd. (Factory 45)
**Service Type:** PCB layout design service -- 6-layer HDI board for smart home hub (WiFi/BLE/Zigbee tri-radio)
**Service Description:** Greenfield provides the schematic (Altium Designer), component library, and mechanical constraints. SiliconBridge performs the complete PCB layout including component placement, routing (including 50-ohm impedance-controlled RF traces), power integrity analysis, and generates manufacturing output files. Deliverable is a production-ready design package.
**Service Order Value:** $18,500

**Deliverables:**
1. Complete Gerber file set (RS-274X): all 6 copper layers, solder mask (top/bottom), silkscreen (top/bottom), paste mask (top/bottom), board outline, drill files (Excellon format)
2. Design Rule Check (DRC) report: zero errors, zero unresolved warnings
3. Design for Manufacturing (DFM) report: stackup definition, impedance calculations, minimum trace/space analysis vs. fabricator capability
4. Assembly drawings with BOM cross-reference, pick-and-place file (centroid CSV), and critical component keep-out zones
5. Impedance-controlled trace report: calculated vs. target impedance for all RF traces (50-ohm single-ended, 100-ohm differential)

**Acceptance Criteria:**
1. DRC: zero errors per IPC-2221B design rules and fabricator-specific rules (min trace 75 um, min space 75 um, min drill 150 um)
2. RF trace impedance: 50 ohm +/- 10% (single-ended), 100 ohm +/- 10% (differential) per stackup simulation
3. All components placed per Greenfield's placement constraints (antenna keep-out, thermal zones, connector locations)
4. Power integrity: DC IR drop <= 3% on all power nets (simulated at max current)
5. Design files verified openable in Altium Designer 24.x without errors; Gerber files verified in Ucamco reference viewer

**How Completion Is Verified:**
Greenfield's hardware engineer reviews the DRC report (must be zero errors), opens the Altium project, and runs a final DRC on their end. Gerber files are uploaded to the PCB fabricator's (JLCPCB or PCBWay) online DFM checker for independent verification. RF trace impedance is verified by cross-checking SiliconBridge's stackup simulation against the fabricator's stackup data. Service is complete when Greenfield signs a design acceptance form and releases the Gerbers to the fabricator.

**Service Report Format:**
```
Deliverable package (ZIP):
  /gerber/ -- 14 Gerber files + 2 drill files
  /assembly/ -- pick_and_place.csv, assembly_drawing.pdf, BOM_crossref.xlsx
  /reports/ -- DRC_report.pdf, DFM_report.pdf, impedance_report.pdf, stackup_definition.pdf, power_integrity.pdf
  /source/ -- Altium project files (.PrjPcb, .PcbDoc, .SchDoc)
```
DRC report format: `Rule Name | Category | Violations (must be 0) | Description`
Impedance report sample: `Net: RF_ANT_WIFI | Layer: L1 | Width: 0.28 mm | Target: 50 ohm | Simulated: 49.3 ohm | Deviation: -1.4% | Tolerance: +/- 10% | PASS`

**Standard Reference:** IPC-2221B (PCB design), IPC-2581 (data transfer), IPC-A-600 (acceptability of PCBs)

**Expected Outcome:** 95% probability of first-revision acceptance (minor placement adjustments may be requested)
**Dispute Likelihood:** Medium -- Disputes arise when the fabricated PCB has impedance issues that SiliconBridge attributes to fabricator process variation and Greenfield attributes to design errors. The stackup simulation vs. fabricated stackup correlation is the crux.
**Settlement Timeline:** Week 1-2: SiliconBridge performs placement and routing. Week 3: DRC/DFM review and impedance simulation. Week 4: Design review with Greenfield. Week 5: Revisions (if any) and final Gerber release. Week 6: Payment (50% at project start, 50% at Gerber acceptance). Total: 4-6 weeks.

---

### S087 [SERVICE]

**Customer:** Amazonia Packaging Solutions (OEM-29)
**Service Provider:** FlowSim Engineering Consultants S.A. (Factory 46)
**Service Type:** Mold flow simulation service -- injection mold filling analysis for new 1.5L PET bottle preform mold (48-cavity hot runner)
**Service Description:** Amazonia is commissioning a new 48-cavity preform mold from their toolmaker. Before mold steel is cut, FlowSim runs a complete mold flow analysis (Moldex3D) to optimize gate location, runner balance, cooling channel layout, and predict potential defects (short shots, weld lines, air traps, warpage).
**Service Order Value:** $15,000

**Deliverables:**
1. Mold flow simulation report: fill analysis, pack analysis, cooling analysis, and warp analysis
2. Gate location optimization: recommended gate diameter and position with simulation comparison of 3 gate location options
3. Runner balance analysis: fill time variation across all 48 cavities (target: < 5% cavity-to-cavity fill time variation)
4. Defect prediction maps: weld line locations, air trap locations, sink mark risk zones (color-coded severity)
5. Recommended process window: melt temperature, mold temperature, injection speed, pack pressure, cooling time

**Acceptance Criteria:**
1. Simulation mesh quality: > 95% tetra elements with aspect ratio < 10:1; mesh sensitivity study documented
2. Fill time variation across 48 cavities: < 5% (simulation prediction)
3. Maximum injection pressure: < 80% of machine capacity (1,200 bar for Amazonia's Husky HyPET system)
4. Warp prediction: total deflection < 0.2 mm at gate area; ovality < 0.1 mm at thread finish
5. Report delivered within 10 business days of receiving final 3D CAD models

**How Completion Is Verified:**
Amazonia's process engineer reviews the simulation report and compares recommended process parameters against their standard preform molding window. The gate location recommendation is forwarded to the toolmaker for mold design incorporation. Service is complete when Amazonia accepts the gate location and process window recommendations.

**Service Report Format:**
```
File: moldflow_{project_id}_{date}.pdf
Sections: 1. Project Summary & Scope | 2. Material Data (PET resin datasheet, viscosity model) | 3. Mesh Quality Report (element count, aspect ratio histogram) | 4. Gate Location Study: [Option | Gate Position | Gate Diameter mm | Max Pressure bar | Fill Time s | Cavity Balance % | Recommendation] | 5. Fill Analysis (color-coded fill time contour, short shot risk) | 6. Pack Analysis (volumetric shrinkage contour) | 7. Cooling Analysis (cycle time, coolant temperature, mold surface temp distribution) | 8. Warp Analysis (total deflection, ovality at critical sections) | 9. Defect Maps (weld lines, air traps, sink marks) | 10. Recommended Process Window Table | 11. Conclusions & Recommendations
```
Sample gate study row: `Option B | Center gate, 3.5 mm dia | 820 bar | 1.82 s | 3.2% balance | RECOMMENDED`

**Standard Reference:** Moldex3D simulation methodology, material database per CAMPUS standard

**Expected Outcome:** Simulation report delivered on time in 95% of cases; toolmaker incorporates gate recommendation in 90% of cases
**Dispute Likelihood:** Low -- Mold flow simulation is advisory; the simulation predicts behavior but the actual mold trial is the final validation. Both parties understand the limitations of simulation.
**Settlement Timeline:** Week 1: FlowSim receives CAD models and material data. Week 2-3: Simulation runs and analysis. Week 4: Report delivery and technical review meeting. Week 5: Payment (Net-30). Total: 4-5 weeks.

---

### S088 [SERVICE]

**Customer:** WindStream Renewable Energy (OEM-34)
**Service Provider:** NordStruct Engineering Analysis AB (Factory 47)
**Service Type:** FEA structural analysis service -- fatigue analysis of wind turbine tower flange bolted connection per GL/DNVGL-ST-0126
**Service Description:** WindStream commissions NordStruct to perform a finite element fatigue analysis of the tower flange connection at the 80m height section joint (the most critical bolted joint on the 8 MW offshore turbine tower). The analysis uses a sub-model extracted from the global tower model and applies 20-year fatigue load spectra from WindStream's aeroelastic analysis (HAWC2 output).
**Service Order Value:** $42,000

**Deliverables:**
1. FEA analysis report per DNVGL-RP-C203 (fatigue design of offshore steel structures): model description, boundary conditions, load cases, results
2. Stress contour plots at critical locations: bolt thread root, flange fillet, gasket contact zone
3. Fatigue life calculation per Palmgren-Miner rule: cumulative damage D at each critical location
4. Bolt preload sensitivity study: fatigue life vs. bolt preload (+/- 10% of specified preload)
5. Recommendations: minimum bolt preload for 20-year fatigue life with safety factor >= 1.5

**Acceptance Criteria:**
1. FEA model: mesh convergence study documented (stress change < 5% between mesh refinements at critical locations)
2. Material model: S355J2+N per EN 10025-2, S-N curve per DNVGL-RP-C203 Table 2-1 (Detail Category D for bolt thread root)
3. Contact modeling: pretensioned bolt with friction contact (mu = 0.14 for hot-dip galvanized surfaces per VDI 2230)
4. Fatigue damage: D <= 0.67 at all critical locations (safety factor of 1.5 on Miner's sum per DNVGL-ST-0126)
5. Report delivered within 20 business days; interim model review at Day 10

**How Completion Is Verified:**
WindStream's structural engineering team reviews the FEA model (provided as ANSYS Workbench project file) and the report. A 3-hour technical review meeting is held. DNV classification society reviews the fatigue analysis as part of the tower type certification. Service is complete when both WindStream and DNV accept the fatigue analysis results.

**Service Report Format:**
```
File: FEA_fatigue_{project_id}_{date}.pdf + ANSYS_project.zip
Report Sections: 1. Executive Summary | 2. Scope & Standards Referenced | 3. Model Description (geometry, mesh, element types, boundary conditions) | 4. Material Properties | 5. Load Cases (fatigue spectra, bolt preload, thermal) | 6. Mesh Convergence Study: [Mesh Level | Elements | Max Stress MPa | Change %] | 7. Stress Results: [Location | Load Case | Max Principal Stress MPa | Allowable MPa | Utilization %] | 8. Fatigue Results: [Location | Detail Category | Cycles to Failure | Cumulative Damage D | Limit | Pass/Fail] | 9. Bolt Preload Sensitivity | 10. Conclusions & Recommendations | 11. Appendices (load spectra, S-N curves)
```
Sample fatigue row: `Bolt #17 thread root | Cat. D | N/A (variable amplitude) | D = 0.52 | D <= 0.67 | PASS`

**Standard Reference:** DNVGL-ST-0126 (wind turbine support structures), DNVGL-RP-C203 (fatigue design), VDI 2230 (bolted joint design), EN 1993-1-9 (Eurocode 3 fatigue)

**Expected Outcome:** 90% probability that all critical locations pass D <= 0.67 (design has been through preliminary analysis)
**Dispute Likelihood:** Medium -- FEA results are sensitive to modeling assumptions (contact formulation, mesh density at bolt thread root, friction coefficient). NordStruct and WindStream may disagree on appropriate modeling choices. DNV provides the final arbitration as the classification society.
**Settlement Timeline:** Week 1-2: Model building and mesh convergence study. Week 3: Interim model review with WindStream. Week 4-5: Fatigue analysis and report writing. Week 6: Report delivery and technical review. Week 7-8: DNV review and comments. Total: 6-8 weeks.

---

### S089 [SERVICE]

**Customer:** Greenfield IoT Solutions (OEM-04)
**Service Provider:** EmbedCore Firmware Solutions Ltd. (Factory 48)
**Service Type:** Firmware development service -- BLE stack integration and OTA (over-the-air) update firmware for smart home hub (Nordic nRF52840 SoC)
**Service Description:** Greenfield provides the hardware design (from S086 PCB layout) and functional requirements specification. EmbedCore develops the BLE 5.3 stack integration, OTA DFU (Device Firmware Update) bootloader, and sensor polling firmware. Deliverable is a production-ready firmware binary with documented test results.
**Service Order Value:** $48,000

**Deliverables:**
1. Compiled firmware binary (.hex and .bin) for Nordic nRF52840, release version tagged in Git
2. Source code repository (Git) with full commit history, branching strategy, and code review records
3. Firmware test report: 100% of requirements traced to test cases, with pass/fail results
4. OTA update validation report: successful update from v1.0 to v1.1 demonstrated over BLE on 10 units
5. Technical documentation: firmware architecture document, API reference, build instructions

**Acceptance Criteria:**
1. All functional requirements (42 items in Greenfield's FRS-2026-018) traced to test cases; >= 95% pass at delivery
2. BLE connection stability: zero disconnects over 72-hour continuous connection test (10 units)
3. OTA DFU: successful firmware update >= 99% (100 update attempts, <= 1 failure); recovery from interrupted update demonstrated
4. Code quality: zero critical or high-severity static analysis warnings (Coverity or equivalent)
5. RAM usage <= 80% of nRF52840 available RAM; Flash usage <= 70% of available Flash

**How Completion Is Verified:**
Greenfield's embedded software lead reviews the test report, runs the firmware on 5 target boards, and independently verifies BLE connection stability (24-hour smoke test). OTA update is tested end-to-end through Greenfield's cloud platform. Source code is reviewed for coding standard compliance (MISRA-C:2012 subset). Service is complete when Greenfield signs a Firmware Acceptance Certificate and the binary is released to manufacturing.

**Service Report Format:**
```
Deliverable package:
  /firmware/ -- greenfield_hub_v1.0.0.hex, greenfield_hub_v1.0.0.bin, checksum.sha256
  /source/ -- Git repository archive (.tar.gz)
  /reports/ -- test_report.pdf, OTA_validation.pdf, static_analysis_report.pdf, code_coverage.pdf
  /docs/ -- firmware_architecture.pdf, API_reference.pdf, build_instructions.md

Test report format:
  Requirement ID | Description | Test Case ID | Test Procedure | Expected Result | Actual Result | Pass/Fail | Tested By | Date
```
Sample test row: `FRS-018-BLE-07 | BLE advertisement interval 100ms +/- 10ms | TC-BLE-07 | Measure adv interval with nRF Sniffer over 1000 advertisements | Avg 100ms +/- 10ms | Avg 99.7ms, max 108ms | PASS | J. Singh | 2026-04-15`

**Standard Reference:** Bluetooth SIG BLE 5.3 specification, Nordic SDK v17.x, MISRA-C:2012

**Expected Outcome:** 90% probability of first-delivery acceptance (some test case failures expected, requiring 1-2 week fix cycle)
**Dispute Likelihood:** High -- Firmware deliverables have inherent subjective quality dimensions (code readability, architecture decisions, edge case handling) that can lead to disagreements about "done." The 42-requirement FRS provides an objective baseline, but undocumented requirements ("it should obviously handle this case") surface during acceptance testing.
**Settlement Timeline:** Week 1-8: Firmware development (agile sprints, biweekly demos). Week 9: Internal testing at EmbedCore. Week 10: Firmware delivery and test report. Week 11-12: Greenfield acceptance testing. Week 13: If fixes required, 1-2 week fix cycle. Week 14: Final acceptance and payment (40% at kickoff, 40% at delivery, 20% at acceptance). Total: 10-14 weeks.

---

### S090 [SERVICE]

**Customer:** Radiant Optics Inc (OEM-07)
**Service Provider:** CertPath Regulatory Consulting LLC (Factory 49)
**Service Type:** Product certification consulting -- FCC Part 15, CE (RED 2014/53/EU), and UL 62368-1 compliance package for AR headset
**Service Description:** CertPath prepares the complete regulatory submission package for Radiant's AR headset (WiFi 6E, BLE 5.3, USB-C charging). Scope includes test plan development, pre-submission coordination with test labs and certification bodies, technical file compilation for CE, and FCC application management.
**Service Order Value:** $65,000

**Deliverables:**
1. Regulatory compliance test plan: mapping of product features to applicable standards (FCC Part 15 Subpart C, EN 301 489, EN 300 328, EN 303 687, UL 62368-1)
2. Pre-submission meeting minutes with NRTL (UL/TUV) and FCC TCB
3. CE technical file: Declaration of Conformity (DoC), test reports, risk assessment, user manual review for regulatory compliance
4. FCC application package: FCC Form 731, test report, photographs (internal/external), label artwork, RF exposure assessment (SAR)
5. Project management dashboard: milestone tracker, open items, risk register

**Acceptance Criteria:**
1. Test plan covers all applicable standards identified in regulatory gap analysis; no standard omissions
2. FCC Grant of Equipment Authorization received within 8 weeks of test report submission
3. CE DoC issued with all applicable EU harmonized standards listed
4. UL certification listing published on UL Product iQ database
5. All deliverables provided in formats accepted by the respective regulatory bodies

**How Completion Is Verified:**
Radiant's program manager tracks the milestone dashboard. Each milestone (test plan approval, pre-submission meeting, test completion, submission, grant/certification) is formally signed off. Service is complete when FCC Grant, CE DoC, and UL certification are all obtained and Radiant can legally sell the product in US and EU markets.

**Service Report Format:**
```
File: cert_status_{product_id}_{date}.xlsx
Columns: Market | Standard | Test Lab | Test Status | Report Number | Submission Date | Certification Body | Certificate/Grant Number | Expiry Date | Status (Pending/Granted/Rejected) | Notes

Deliverable package:
  /FCC/ -- FCC_application.pdf, test_report_radiated.pdf, test_report_conducted.pdf, SAR_report.pdf, label_artwork.pdf, photos/
  /CE/ -- DoC.pdf, technical_file.pdf, test_reports/, risk_assessment.pdf, user_manual_review.pdf
  /UL/ -- UL_application.pdf, test_report_62368.pdf, factory_inspection_report.pdf
  /project/ -- test_plan.pdf, milestone_tracker.xlsx, risk_register.xlsx
```
Sample status row: `US | FCC Part 15.247 | Heartland Testing | Complete | HET-2026-1847 | 2026-06-15 | UL (TCB) | 2ABCD-RADIANT01 | N/A | Granted | WiFi 6E 5GHz/6GHz`

**Standard Reference:** FCC Part 15 (47 CFR), RED 2014/53/EU, EN 301 489-1/-17, EN 300 328, UL 62368-1, IEC 62368-1

**Expected Outcome:** 85% probability of obtaining all 3 certifications within 12 weeks (delays typically caused by test failures requiring design modifications)
**Dispute Likelihood:** Medium -- If the product fails a compliance test, the dispute is whether CertPath's test plan should have anticipated the failure mode and recommended pre-compliance testing. CertPath argues test planning cannot guarantee compliance; Radiant argues a good consultant should flag high-risk areas.
**Settlement Timeline:** Week 1-2: Regulatory gap analysis and test plan. Week 3-4: Pre-submission meetings. Week 5-8: Testing at accredited labs (Heartland for EMC, UL for safety). Week 9-10: Submission package preparation. Week 11-14: Certification body review and grant. Total: 12-16 weeks. Payment: 30% at kickoff, 30% at test plan approval, 40% at certification grant.

---

## MAINTENANCE & REPAIR SERVICES (S091 -- S093)

---

### S091 [SERVICE]

**Customer:** Suzhou Weida Electronic Assembly Co., Ltd. (Factory 02, acting as customer)
**Service Provider:** Haas Factory Outlet -- Shanghai Service Center (Factory 50)
**Service Type:** CNC machine annual maintenance and geometric recalibration -- 2x Haas VF-4SS vertical machining centers
**Service Description:** Haas Factory Outlet performs the manufacturer-recommended annual preventive maintenance on Weida's two VF-4SS machines, including spindle runout check, axis backlash measurement and compensation, way cover inspection, coolant system service, and ballbar circularity test. Machines are used for machining SMT stencil frames and fixture plates.
**Service Order Value:** $8,400

**Deliverables:**
1. Preventive maintenance report: 87-point checklist per Haas annual PM specification
2. Spindle runout measurement: at spindle nose and at 200mm tool projection (Haas spec: <= 5 um at nose)
3. Axis positioning accuracy and repeatability per ISO 230-2: X, Y, Z axes, laser interferometer measurement
4. Ballbar circularity test per ISO 230-4: circularity deviation at 150mm/min and 300mm/min feed rates
5. Backlash compensation values: as-found and as-left for each axis

**Acceptance Criteria:**
1. Spindle runout at nose: <= 5 um (Haas VF-4SS specification); at 200mm projection: <= 10 um
2. Axis positioning accuracy: <= 0.010 mm over full travel per ISO 230-2 (X: 1016 mm, Y: 508 mm, Z: 635 mm)
3. Axis repeatability: <= 0.005 mm per ISO 230-2
4. Ballbar circularity: <= 10 um at 150mm/min feed rate
5. All PM checklist items completed; all fluids (coolant, way oil, hydraulic) replaced per Haas specification

**How Completion Is Verified:**
Weida's maintenance manager reviews the PM report and laser calibration data. A machine warm-up and test cut of a reference part (known dimension, measured on CMM) is performed after maintenance to verify practical accuracy. Service is complete when both machines pass the reference part test cut and the PM report is filed.

**Service Report Format:**
```
File: CNC_PM_{machine_serial}_{date}.pdf
Sections: Machine ID (make, model, serial, control) | Service Date | Service Technician | PM Checklist: [Item # | System | Task | Spec | Result | Pass/Fail] | Spindle Runout: [Position | Runout um | Spec um | Pass/Fail] | Laser Calibration: [Axis | Full Travel mm | Accuracy mm | Repeatability mm | Spec mm | Pass/Fail] | Ballbar Test: [Feed Rate mm/min | Circularity um | Spec um | Pass/Fail] | Backlash Compensation: [Axis | As-Found um | As-Left um] | Fluids Replaced | Parts Replaced | Recommendations | Next Service Due
```
Sample laser row: `X axis | 1016 mm | 0.007 mm | 0.003 mm | Accuracy <= 0.010 mm, Repeat <= 0.005 mm | PASS`

**Standard Reference:** ISO 230-2 (positioning accuracy), ISO 230-4 (circular tests), Haas VF-4SS maintenance manual

**Expected Outcome:** Both machines expected to pass all criteria (well-maintained machines with 3-year service history)
**Dispute Likelihood:** Low -- Haas Factory Outlet technicians are factory-trained on Haas machines. Acceptance criteria are the manufacturer's own specifications.
**Settlement Timeline:** Day 1-2: Technician arrives; PM performed on Machine 1 (Day 1) and Machine 2 (Day 2). Day 3: Laser calibration and ballbar test on both machines. Day 4: PM report generated. Day 5: Weida test cut verification. Week 2: Payment (Net-30). Total: 1-3 weeks.

---

### S092 [SERVICE]

**Customer:** Bucheon SemiTek Co., Ltd. (Factory 05, acting as customer)
**Service Provider:** KT-Advanced Test Solutions Co., Ltd. (Factory 51)
**Service Type:** Test station preventive maintenance -- annual PM on 3 IC test stations (Teradyne UltraFLEX II ATE systems)
**Service Description:** KT-Advanced performs manufacturer-certified annual preventive maintenance on SemiTek's 3 UltraFLEX II automatic test equipment stations used for automotive IC final test. Service includes calibration of all analog/digital pin electronics, power supply accuracy verification, timing calibration, and contactor/socket inspection.
**Service Order Value:** $36,000

**Deliverables:**
1. ATE PM report per Teradyne annual maintenance specification for each station (3 total)
2. Pin electronics calibration data: DC accuracy, AC timing, PMU (precision measurement unit) for all channels
3. Power supply calibration: voltage accuracy (+/- 5 mV for low-current, +/- 20 mV for high-current) and current limit accuracy
4. Timing calibration: edge placement accuracy <= 500 ps for all digital channels
5. Contactor wear assessment: socket insertion count, pin resistance measurement, replacement recommendation

**Acceptance Criteria:**
1. DC accuracy: <= +/- 5 mV on all VI channels (Teradyne spec)
2. AC timing: edge placement accuracy <= 500 ps for all digital channels; <= 200 ps for high-speed SerDes channels
3. PMU measurement accuracy: <= +/- 0.1% of reading + 100 uA offset
4. All calibration parameters within Teradyne's published specifications (ATE calibration manual revision 6.2)
5. Post-PM correlation: test program correlation run on 25 golden units with < 0.1% yield shift vs. pre-PM baseline

**How Completion Is Verified:**
SemiTek's test engineering manager runs a correlation test program on 25 golden units (pre-characterized, known-good devices) before and after PM. Yield and parametric measurement correlation must be within 0.1%. Service is complete when all 3 stations pass correlation and the PM reports are accepted.

**Service Report Format:**
```
File: ATE_PM_{station_id}_{date}.pdf
Sections: Station ID (system serial, configuration, software version) | Service Date | Technician | PM Checklist: [Module | Channel Range | Task | Result | Spec | Pass/Fail] | DC Calibration: [Channel | Parameter | Measured | Spec | Pass/Fail] | Timing Calibration: [Channel Group | Edge Accuracy ps | Spec ps | Pass/Fail] | Power Supply: [Supply ID | Voltage Accuracy mV | Current Limit Accuracy % | Pass/Fail] | Contactor Report: [Socket ID | Insertion Count | Pin Resistance mohm | Replacement Needed Y/N] | Correlation Results: [Golden Unit ID | Pre-PM Bin | Post-PM Bin | Match Y/N] | Next Service Due
```
Sample timing row: `DIG Group A (Ch 1-64) | 380 ps | <= 500 ps | PASS`

**Standard Reference:** Teradyne UltraFLEX II Calibration Manual Rev 6.2, AEC-Q100 (automotive IC test requirements)

**Expected Outcome:** All 3 stations expected to pass PM and correlation (established annual PM cycle)
**Dispute Likelihood:** Low -- ATE PM is performed by the equipment manufacturer's certified service partner using manufacturer specifications. The golden unit correlation test provides objective verification.
**Settlement Timeline:** Week 1: Station 1 PM (3 days downtime). Week 2: Station 2 PM. Week 3: Station 3 PM. Week 4: Correlation tests and PM reports delivered. Week 5: Payment (Net-30). Total: 4-5 weeks.

---

### S093 [SERVICE]

**Customer:** Meridius Medical Devices (OEM-20)
**Service Provider:** CleanAir Validation Services Inc. (Factory 52)
**Service Type:** Cleanroom HEPA filter integrity testing -- ISO Class 7 cleanroom (1,200 sq ft) with 24 HEPA filter modules per ISO 14644-3
**Service Description:** CleanAir performs annual HEPA filter integrity testing (DOP/PAO aerosol photometry) on all 24 ceiling-mounted HEPA filters in Meridius's medical device assembly cleanroom in Warsaw, Indiana. Testing includes upstream challenge aerosol generation, downstream scanning with aerosol photometer, and particle count verification per ISO 14644-1 Class 7.
**Service Order Value:** $9,600

**Deliverables:**
1. HEPA filter integrity test report per ISO 14644-3 Annex B.7 for all 24 filters
2. Upstream aerosol concentration and downstream scan results (penetration % at each filter)
3. Particle count classification per ISO 14644-1: measurements at 12 sample locations per cleanroom layout
4. Room pressure differential verification: cleanroom positive pressure >= 12.5 Pa relative to adjacent areas
5. Filter ID map with pass/fail status overlay on cleanroom layout drawing

**Acceptance Criteria:**
1. HEPA filter integrity: maximum penetration <= 0.01% of upstream aerosol concentration at any point during scan per ISO 14644-3
2. No bypass leaks at filter housing gaskets, frame joints, or ductwork connections
3. ISO 14644-1 Class 7: particles >= 0.5 um <= 352,000/m3 at all 12 sample locations
4. Room pressure differential >= 12.5 Pa (0.05 inches water gauge)
5. Report delivered within 5 business days of on-site testing

**How Completion Is Verified:**
Meridius's facilities manager and quality engineer witness the testing. Each filter is individually tested; any filter failing the 0.01% penetration limit is immediately flagged for replacement. After any filter replacements, a re-test is performed at no additional charge. Service is complete when all 24 filters pass integrity testing, the particle count confirms ISO Class 7, and the report is filed in Meridius's facility qualification records per FDA 21 CFR 820.

**Service Report Format:**
```
File: HEPA_integrity_{cleanroom_id}_{date}.pdf
Sections: Cleanroom ID & Description | Test Date | Test Standard (ISO 14644-3) | Equipment: [Aerosol Generator (model, serial) | Photometer (model, serial, cal date)] | Aerosol Type & Upstream Concentration | Filter Integrity Results Table: [Filter ID | Location (row, column) | Size | Upstream Conc mg/m3 | Max Downstream Penetration % | Limit % | Pass/Fail] | Particle Count Results: [Location # | Particles >= 0.5 um /m3 | ISO Class 7 Limit | Pass/Fail] | Pressure Differential: [Zone Pair | Measured Pa | Minimum Pa | Pass/Fail] | Cleanroom Layout Map (annotated) | Deficiencies & Recommendations
```
Sample filter row: `HEPA-C3 | Row C, Col 3 | 610x610mm | 22.5 mg/m3 | 0.003% | <= 0.01% | PASS`

**Standard Reference:** ISO 14644-1:2015 (classification), ISO 14644-3:2019 (test methods), FDA 21 CFR 820 (quality system regulation for medical devices)

**Expected Outcome:** 92% of filters pass on first test; 2 filters (8%) may require gasket replacement or repositioning before passing re-test
**Dispute Likelihood:** Low -- HEPA integrity testing is a well-defined, objective test. The 0.01% penetration limit is unambiguous. CleanAir is NEBB-certified (National Environmental Balancing Bureau).
**Settlement Timeline:** Day 1-2: On-site testing (12 filters/day). Day 3: Any filter replacements and re-testing. Week 2: Report delivered. Week 3: Payment (Net-30). Total: 2-3 weeks.

---

## LOGISTICS & INSPECTION SERVICES (S094 -- S096)

---

### S094 [SERVICE]

**Customer:** Volante Automotive Group (OEM-27)
**Service Provider:** Shenzhen QualityFirst Inspection Services Co., Ltd. (Factory 53)
**Service Type:** Pre-shipment inspection (PSI) service -- AQL sampling inspection of 15,000 injection-molded interior trim components per ISO 2859-1
**Service Description:** Volante commissions QualityFirst to perform a pre-shipment inspection at their Tier-2 supplier's factory in Dongguan before 15,000 dashboard air vent assemblies are shipped to Volante's Turkish assembly plant. QualityFirst inspects per AQL sampling (General Inspection Level II), checking dimensions, color, surface defects, and functional fit.
**Service Order Value:** $2,800

**Deliverables:**
1. Pre-shipment inspection report with pass/fail disposition per ISO 2859-1 sampling plan
2. Dimensional measurements on sample units (10 critical dimensions per part)
3. Visual defect classification and count: critical, major, minor per Volante's defect classification guide
4. Functional test results: clip retention force, vent blade rotation torque, damper action
5. Photographic evidence: product overview, packaging, labeling, any defects found (annotated)

**Acceptance Criteria:**
1. AQL 0.0 for critical defects (safety, regulatory): accept on 0, reject on 1 (General Inspection Level II, Lot 15,000: sample size 315)
2. AQL 1.0 for major defects (functional): accept on 7, reject on 8 (n=315)
3. AQL 2.5 for minor defects (cosmetic): accept on 14, reject on 15 (n=315)
4. All critical dimensions within +/- 0.15 mm per drawing
5. Color match: Delta E <= 1.5 from Volante master chip (measured with portable spectrophotometer)

**How Completion Is Verified:**
QualityFirst issues the PSI report within 24 hours of inspection completion. Volante's quality team in Turin reviews the report. Pass = shipment authorized. Fail = containment action required at supplier before re-inspection. Service is complete when the PSI report is accepted by Volante and a shipment authorization (or hold notice) is issued.

**Service Report Format:**
```
File: PSI_{supplier}_{PO_no}_{date}.pdf
Sections: 1. Inspection Summary (supplier, product, lot size, sample size, AQL levels, result: PASS/FAIL) | 2. Sampling Plan Reference (ISO 2859-1, Level II) | 3. Dimensional Results: [Dimension | Nominal | Tolerance | Measured (5 samples) | Min | Max | Pass/Fail] | 4. Defect Summary: [Defect Type | Classification | Count Found | Accept # | Reject # | AQL Result] | 5. Functional Test: [Test | Spec | Results (5 samples) | Pass/Fail] | 6. Packaging & Labeling Check | 7. Photos (min 20, annotated) | 8. Inspector Name, Date, Signature
```
Sample defect row: `Visible flow marks on Class A surface | Minor | 9 found in 315 | Ac=14 | Re=15 | AQL 2.5: PASS`

**Standard Reference:** ISO 2859-1:1999 (sampling procedures), ANSI/ASQ Z1.4 (equivalent US standard)

**Expected Outcome:** 80% pass rate on first inspection (Tier-2 suppliers in Dongguan have variable quality; the PSI is specifically to catch issues before shipment)
**Dispute Likelihood:** Medium -- Disputes arise when the supplier disagrees with QualityFirst's defect classification. What QualityFirst classifies as a "major" defect (e.g., visible weld line on a semi-concealed surface), the supplier may classify as "minor." Volante's defect classification guide is the contractual reference, but interpretation at the boundary between categories is subjective.
**Settlement Timeline:** Day 1: QualityFirst inspector arrives at supplier factory. Day 1-2: Sampling, inspection, and functional testing. Day 3: PSI report delivered to Volante. Day 4: Volante disposition (pass/fail/conditional). Payment: upon report delivery (prepaid service). Total: 3-5 days.

---

### S095 [SERVICE]

**Customer:** Meridian Automotive Systems (OEM-09)
**Service Provider:** SpecCheck Receiving Inspection Services LLC (Factory 54)
**Service Type:** Incoming material receiving inspection service -- outsourced first-article and lot inspection of 8 incoming commodity families at Meridian's Louisville brake plant
**Service Description:** Meridian outsources receiving inspection of incoming brake components (castings, forgings, rubber seals, friction materials, fasteners, springs, hoses, electronic modules) to SpecCheck. SpecCheck stations 2 full-time inspectors at Meridian's Louisville plant who perform dimensional, visual, and material verification per Meridian's incoming inspection procedures.
**Service Order Value:** $96,000 (annual contract, $8,000/month)

**Deliverables:**
1. Incoming inspection report for each received lot (estimated 400 lots/month)
2. Dimensional measurement data per Meridian's sampling plan (Level II, AQL 1.0) for each commodity
3. First Article Inspection (FAI) reports per AS9102 format for new part numbers
4. Material verification: handheld XRF confirmation of alloy grade (castings, forgings) on sample basis
5. Monthly summary dashboard: lots inspected, lots accepted, lots rejected, rejection rate by supplier and commodity

**Acceptance Criteria:**
1. Inspection throughput: average lot processing time <= 4 hours (receipt to disposition)
2. Inspection accuracy: false accept rate <= 0.5% (validated by Meridian's quarterly re-inspection audit of 50 accepted lots)
3. All rejections documented with Non-Conformance Report (NCR) including photos and measurements
4. FAI reports complete and accurate per AS9102 within 2 business days of first article receipt
5. SpecCheck inspectors maintain current Meridian-approved inspector certification (annual re-certification)

**How Completion Is Verified:**
Meridian's quality manager reviews the monthly dashboard and conducts quarterly re-inspection audits (50 randomly selected lots are re-measured by a Meridian quality engineer). False accept rate > 0.5% triggers a corrective action requirement. Service is complete on a monthly billing cycle; the annual contract renews based on performance KPIs.

**Service Report Format:**
```
File: incoming_insp_{lot_id}_{date}.pdf
Sections: Lot ID | PO Number | Supplier | Part Number | Part Description | Commodity | Qty Received | Sample Size | Inspection Date | Inspector | Dimensional Results: [Feature | Nominal | Tolerance | Measured Values | Min | Max | Pass/Fail] | Visual Inspection: [Criteria | Accept/Reject | Notes] | Material Verification: [XRF Result | Spec | Match Y/N] | Disposition: Accept / Reject / MRB | NCR Number (if rejected) | Photos

Monthly dashboard:
  Columns: Month | Commodity | Lots Received | Lots Accepted | Lots Rejected | Rejection Rate % | Top 3 Rejection Reasons | Top 3 Rejected Suppliers
```
Sample inspection row: `Brake caliper casting | Bore Diameter | 42.000 mm | +/- 0.025 mm | 42.008, 42.012, 41.995, 42.018, 42.003 | 41.995 | 42.018 | PASS`

**Standard Reference:** ISO 2859-1 (sampling), AS9102 (FAI), ASTM E1476 (handheld XRF), Meridian IQP-200 (incoming quality procedure)

**Expected Outcome:** 92% lot acceptance rate; 8% rejection rate (commodity incoming quality at this maturity level)
**Dispute Likelihood:** Low -- SpecCheck operates under Meridian's procedures and acceptance criteria; there is no ambiguity in what constitutes a pass or fail. The quarterly audit provides objective performance verification.
**Settlement Timeline:** Monthly billing cycle. Invoice submitted on the 1st of each month. Payment: Net-30. Total contract: 12 months, renewable.

---

### S096 [SERVICE]

**Customer:** PulseCore Wearables (OEM-05)
**Service Provider:** AccuCount Inventory Solutions Pte. Ltd. (Factory 55)
**Service Type:** Warehouse inventory audit service -- wall-to-wall physical inventory count of PulseCore's 3PL warehouse in Singapore (3,200 SKUs, $4.2M inventory value)
**Service Description:** AccuCount performs an annual physical inventory count of PulseCore's finished goods, components, and raw materials stored at a third-party logistics (3PL) warehouse in Jurong, Singapore. The count is performed over a weekend (production downtime) using barcode scanning and blind count methodology. Results are reconciled against PulseCore's ERP (SAP) inventory records.
**Service Order Value:** $12,500

**Deliverables:**
1. Physical inventory count report: all 3,200 SKUs counted with quantity, location, and lot/batch number
2. Variance report: discrepancies between physical count and ERP record for each SKU
3. Cycle count accuracy metric: percentage of SKUs with zero variance
4. Aging analysis: inventory items with no movement > 180 days flagged (obsolescence risk)
5. Recommendations: root cause analysis of top 10 variance SKUs with process improvement suggestions

**Acceptance Criteria:**
1. Count accuracy: >= 99% of SKUs counted (no SKU left uncounted unless physically inaccessible and documented)
2. Blind count methodology: counters do not see ERP expected quantity during counting (prevents bias)
3. Recount trigger: any SKU with variance > 5% or > $500 value difference is recounted by a second team
4. All counts completed within 48-hour window (Saturday 06:00 to Monday 06:00)
5. Variance report delivered within 5 business days of count completion

**How Completion Is Verified:**
PulseCore's supply chain manager and finance controller review the variance report. SKUs with material variances are investigated (theft, damage, receiving errors, shipping errors). The physical count becomes the new ERP baseline after adjustment approval. Service is complete when PulseCore signs the inventory adjustment authorization form.

**Service Report Format:**
```
File: inventory_audit_{warehouse_id}_{date}.xlsx
Sheet 1 - Count Data: SKU | Description | Location | Lot/Batch | UOM | Physical Count | ERP Qty | Variance | Variance % | Variance Value $ | Recount Y/N | Recount Result | Final Count
Sheet 2 - Summary: Total SKUs | SKUs Counted | Count Coverage % | SKUs with Zero Variance | Cycle Count Accuracy % | Total Positive Variance $ | Total Negative Variance $ | Net Variance $
Sheet 3 - Aging: SKU | Last Movement Date | Days Since Movement | Qty on Hand | Value $ | Obsolescence Risk (High/Medium/Low)
Sheet 4 - Top 10 Variances: SKU | Variance | Root Cause Category | Investigation Notes | Recommendation
```
Sample count row: `WB-SENSOR-042 | Heart rate sensor module | B3-R2-S4 | LOT-2026-0118 | EA | 1,247 | 1,250 | -3 | -0.24% | -$45.00 | No | N/A | 1,247`

**Standard Reference:** AICPA AU-C Section 501 (audit evidence -- inventory observation), SOX Section 404 (internal controls)

**Expected Outcome:** 95% of SKUs with zero variance; 4% with minor variances (< 2%); 1% with material variances requiring investigation
**Dispute Likelihood:** Low -- Physical inventory counting is objective. The blind count methodology eliminates counter bias. Disputes, if any, are between PulseCore and the 3PL operator regarding root causes of variances, not with AccuCount.
**Settlement Timeline:** Day 0 (Friday): Warehouse freeze and count preparation. Day 1-2 (Sat-Sun): Physical counting. Day 3-7: Variance analysis and recount. Week 2: Final report delivered. Week 3: PulseCore adjustment authorization. Week 4: Payment (Net-30). Total: 3-4 weeks.

---

## TRAINING & AUDIT SERVICES (S097 -- S098)

---

### S097 [SERVICE]

**Customer:** Volante Automotive Group (OEM-27)
**Service Provider:** Apex Quality Systems Consulting GmbH (Factory 56)
**Service Type:** Supplier quality audit service -- ISO 9001:2015 / IATF 16949:2016 gap assessment of a new Tier-2 supplier candidate in Romania
**Service Description:** Volante's supplier quality development (SQD) team commissions Apex to perform a 3-day on-site gap assessment audit of a prospective die-casting supplier (Brasov Die Casting S.R.L.) seeking to join Volante's approved supplier list. Apex auditors assess the supplier's quality management system against IATF 16949:2016 requirements, with special focus on APQP capability, PPAP readiness, MSA, SPC, and control plan development.
**Service Order Value:** $18,500

**Deliverables:**
1. Gap assessment audit report: clause-by-clause assessment of IATF 16949:2016 (Clauses 4-10) with compliance rating (Compliant / Minor Gap / Major Gap / Not Implemented)
2. VDA 6.3 process audit score for die-casting process (target: >= 80% for conditional approval)
3. Findings list: each gap documented with objective evidence, clause reference, risk level, and recommended corrective action
4. Supplier capability assessment: APQP readiness, PPAP capability, measurement system adequacy (MSA per AIAG manual), SPC maturity level
5. Executive summary with recommendation: Approve / Conditionally Approve / Reject as Volante Tier-2 supplier

**Acceptance Criteria:**
1. Audit conducted per VDA 6.3:2016 process audit methodology (P1-P7 elements)
2. All IATF 16949 clauses assessed; no clause skipped
3. Objective evidence documented for each finding (photographs, document references, interview notes)
4. Audit report delivered within 10 business days of on-site audit completion
5. Lead auditor holds certified IATF 16949 auditor qualification (IATF ADP -- Auditor Development Program)

**How Completion Is Verified:**
Volante's SQD manager reviews the audit report and VDA 6.3 score. The recommendation (Approve/Conditionally Approve/Reject) is discussed in a supplier approval committee meeting. Service is complete when the report is accepted and the supplier is dispositioned on Volante's approved supplier list.

**Service Report Format:**
```
File: supplier_audit_{supplier_name}_{date}.pdf
Sections: 1. Audit Summary (supplier, location, dates, auditors, scope) | 2. Audit Methodology (VDA 6.3, IATF 16949 clause review) | 3. IATF 16949 Clause Assessment: [Clause | Sub-clause | Requirement | Status (C/mG/MG/NI) | Objective Evidence | Corrective Action Required] | 4. VDA 6.3 Process Audit: [Element P1-P7 | Question | Score 0-10 | Evidence | Notes] | 5. VDA 6.3 Score Calculation: [Element | Weight | Score | Weighted Score] | Total Score % | 6. APQP/PPAP Capability Assessment | 7. MSA Assessment | 8. SPC Maturity | 9. Findings Summary (sorted by risk level) | 10. Recommendation & Conditions | 11. Appendices (photos, document list)
```
Sample clause row: `8.5.1.1 | Control Plan | Control plan exists but does not include reaction plans for out-of-control conditions | Minor Gap | Reviewed CP-DC-001 Rev A | Add reaction plans to control plan per AIAG APQP manual Section 6`
Sample VDA 6.3 result: `Total VDA 6.3 Score: 76% | Target: >= 80% | Result: CONDITIONALLY APPROVED (score below target; 3 major gaps must be closed within 90 days)`

**Standard Reference:** IATF 16949:2016, VDA 6.3:2016 (process audit), AIAG APQP manual, AIAG PPAP manual, AIAG MSA manual

**Expected Outcome:** 70% of audited suppliers receive "Conditionally Approved" (gaps exist but are correctable); 20% "Approved"; 10% "Rejected"
**Dispute Likelihood:** Medium -- The supplier being audited may disagree with the severity rating of findings. Apex may rate a finding as "Major Gap" while the supplier considers it a "Minor Gap." The financial impact is significant: "Rejected" means the supplier loses a potential $2M+/year Volante contract. However, the dispute is between Volante and the supplier, with Apex as the independent assessor.
**Settlement Timeline:** Week 1: Pre-audit document review (quality manual, procedures, certifications). Week 2: 3-day on-site audit at Brasov, Romania. Week 3-4: Report writing and internal quality review at Apex. Week 5: Report delivered to Volante. Week 6: Payment (Net-30). Total: 5-6 weeks.

---

### S098 [SERVICE]

**Customer:** Suzhou Weida Electronic Assembly Co., Ltd. (Factory 02, acting as customer)
**Service Provider:** TechTrain Asia Certification Pte. Ltd. (Factory 57)
**Service Type:** Operator training and certification -- IPC J-STD-001 Certified IPC Specialist (CIS) training for 16 SMT operators
**Service Description:** TechTrain delivers a 5-day IPC J-STD-001 CIS training and certification program at Weida's Suzhou facility. The program covers Module 1 (common requirements), Module 4 (surface mount technology), and Module 5 (inspection), culminating in written examination and practical hands-on soldering workmanship assessment. Weida needs certified operators to meet customer requirements (Lumenar Technologies, OEM-01, requires IPC J-STD-001 certified operators on their production lines).
**Service Order Value:** $19,200 ($1,200 per operator x 16 operators)

**Deliverables:**
1. IPC J-STD-001 CIS certification card for each passing operator (valid 2 years)
2. Written examination results: score per module (passing score: >= 70%)
3. Practical hands-on assessment results: soldering workmanship evaluated per IPC-A-610 Class 2 criteria
4. Training attendance records: daily sign-in sheets, total hours per operator
5. Training summary report: pass/fail by operator, class average scores, areas requiring additional training

**Acceptance Criteria:**
1. Written examination: >= 70% score on closed-book exam (Modules 1, 4, 5 combined)
2. Practical assessment: solder joints produced by each operator evaluated per IPC-A-610 Class 2 -- zero defects in practical workmanship sample
3. Certification cards issued by IPC-authorized trainer within 10 business days of course completion
4. Overall class pass rate: >= 80% (Weida's expectation for experienced SMT operators)
5. Training materials: current IPC J-STD-001H revision; training kit includes reference standard with 3D solder joint examples

**How Completion Is Verified:**
Weida's HR and quality departments verify that each passing operator receives an IPC J-STD-001 CIS certification card. Certified operator IDs are added to Weida's training matrix and communicated to Lumenar Technologies (OEM-01) as evidence of workforce qualification. Service is complete when certification cards are received and the training record is filed.

**Service Report Format:**
```
File: IPC_training_{class_id}_{date}.pdf
Sections: 1. Training Summary (course, location, dates, instructor, modules covered) | 2. Instructor Credentials (IPC CIT number, certification date, authorized center) | 3. Results Table: [Operator Name | Employee ID | Module 1 Score % | Module 4 Score % | Module 5 Score % | Combined Score % | Practical Assessment (Pass/Fail) | Overall Result (Certified/Not Certified) | Cert Card Number] | 4. Attendance Records | 5. Class Statistics (average score, pass rate, score distribution) | 6. Recommendations for Remedial Training | 7. Materials Provided
```
Sample result row: `Zhang Wei | WD-2026-088 | 82% | 78% | 85% | 81% | PASS | CERTIFIED | J-STD-CIS-2026-04881`

**Standard Reference:** IPC J-STD-001H (soldering requirements), IPC-A-610H (acceptability of electronic assemblies), IPC certification program policies

**Expected Outcome:** 88% pass rate (14 of 16 operators certified); 2 operators may require remedial training and re-examination
**Dispute Likelihood:** Low -- IPC certification is administered by an independent IPC-authorized training center. Pass/fail is determined by standardized examination and practical assessment criteria. TechTrain has no incentive to inflate scores (IPC audits authorized centers).
**Settlement Timeline:** Week 1: Pre-training coordination (materials, schedule, facility setup). Week 2: 5-day training course at Weida Suzhou. Week 3: Examination scoring and practical assessment evaluation. Week 4: Certification cards issued by IPC. Week 5: Payment (Net-30). Total: 4-5 weeks.

---

## IT & DATA SERVICES (S099 -- S100)

---

### S099 [SERVICE]

**Customer:** Meridian Automotive Systems (OEM-09)
**Service Provider:** FactoryLogic MES Solutions GmbH (Factory 58)
**Service Type:** MES system integration service -- configuration and deployment of Siemens Opcenter Execution (formerly SIMATIC IT) for Meridian's Louisville brake caliper production line
**Service Description:** FactoryLogic configures and deploys a MES system covering work order management, production tracking, quality data collection (SPC charting in real-time), material traceability, and OEE calculation for Meridian's 12-station brake caliper machining and assembly line. Scope includes ERP integration (SAP PP module), PLC data acquisition from 8 CNC machines, and operator terminal UI design for 12 workstations.
**Service Order Value:** $95,000

**Deliverables:**
1. Configured MES system: Opcenter Execution with all production workflows, quality collection points, and material traceability rules
2. ERP integration: bidirectional interface with SAP PP (work order download, production confirmation upload, quality lot upload)
3. PLC integration: OPC-UA connections to 8 CNC machines for cycle time, alarm, and process parameter data collection
4. User Acceptance Test (UAT) report: 85 test cases covering all configured workflows, executed with Meridian's production team
5. System documentation: configuration specification, interface specification, user manual, and admin guide

**Acceptance Criteria:**
1. UAT pass rate: >= 95% of 85 test cases pass (critical test cases: 100% pass required; non-critical: >= 90%)
2. ERP integration: work orders downloaded correctly; production confirmations posted to SAP within 5 minutes of completion
3. Material traceability: lot number traceable from raw material receipt through machining through assembly to finished goods label (end-to-end demonstrated)
4. SPC charting: real-time X-bar/R charts displayed for critical dimensions (bore diameter) at machining stations; out-of-control alarms trigger within 15 seconds
5. System availability: >= 99.5% uptime during 2-week pilot production (planned downtime excluded)

**How Completion Is Verified:**
Meridian's IT manager and production manager jointly sign the UAT report. A 2-week pilot production period follows UAT, during which the MES runs in parallel with the existing paper-based system. Service is complete when the pilot production achieves >= 99.5% system availability, all critical test cases pass, and Meridian signs a Go-Live Authorization.

**Service Report Format:**
```
UAT Report: test_case_id | module | description | preconditions | test_steps | expected_result | actual_result | status (Pass/Fail/Blocked) | severity (Critical/Major/Minor) | tester | date | defect_id (if failed)

Go-Live Checklist:
  /docs/ -- configuration_spec.pdf, interface_spec.pdf, user_manual.pdf, admin_guide.pdf
  /test/ -- UAT_report.xlsx, pilot_production_log.xlsx, availability_report.pdf
  /training/ -- operator_training_attendance.pdf, admin_training_attendance.pdf
```
Sample UAT row: `TC-042 | Traceability | Scan raw material lot at CNC Station 3 and verify lot linked to work order | WO created, material in stock | 1. Scan barcode 2. Verify lot display 3. Check SAP lot record | Lot linked in MES and SAP | Lot linked in MES and SAP, SAP update in 3.2 sec | PASS | Critical | M. Schmidt | 2026-05-12 | N/A`

**Standard Reference:** ISA-95 (MES-ERP integration standard), IEC 62264 (enterprise-control system integration), MESA International model

**Expected Outcome:** 90% probability of achieving Go-Live within 12 weeks (MES projects routinely encounter scope creep and integration issues that extend timelines)
**Dispute Likelihood:** High -- MES implementation is complex; "done" is subjective. FactoryLogic may consider the system ready for Go-Live while Meridian's operators identify workflow issues that weren't captured in the 85 UAT test cases. Integration defects (SAP posting failures, PLC communication timeouts) often surface only during pilot production with real production data volumes.
**Settlement Timeline:** Week 1-4: Configuration and development. Week 5-6: Internal testing at FactoryLogic. Week 7-8: UAT at Meridian Louisville. Week 9-10: Defect fixes and re-test. Week 11-12: 2-week pilot production. Week 13: Go-Live authorization and payment. Payment terms: 30% at kickoff, 30% at UAT start, 30% at Go-Live, 10% at 30-day post-Go-Live stability period. Total: 12-16 weeks.

---

### S100 [SERVICE]

**Customer:** Pinnacle Pharmaceuticals (OEM-18)
**Service Provider:** DataBridge Migration Consulting Ltd. (Factory 59)
**Service Type:** Production data migration service -- migration of 7 years of batch production records from legacy MES (Wonderware InBatch) to new MES (Emerson DeltaV Batch)
**Service Description:** Pinnacle is replacing its legacy MES at the Dublin pharmaceutical manufacturing facility. DataBridge migrates 7 years of batch production records (14,000 batch records, 2.3M data points covering process parameters, in-process test results, deviations, and electronic signatures) from the Wonderware InBatch SQL Server database to the Emerson DeltaV Batch historian. Data integrity must be maintained per FDA 21 CFR Part 11 (electronic records and signatures).
**Service Order Value:** $78,000

**Deliverables:**
1. Data migration plan: source-to-target field mapping, transformation rules, data cleansing rules, migration sequence
2. Migration validation protocol: IQ/OQ/PQ (Installation/Operational/Performance Qualification) per GAMP 5
3. Migrated database: all 14,000 batch records with 2.3M data points in DeltaV Batch historian
4. Data integrity verification report: record count reconciliation, field-level checksum validation, sample-based manual verification (200 batch records spot-checked)
5. FDA 21 CFR Part 11 compliance assessment: audit trail continuity, electronic signature preservation, data integrity attestation

**Acceptance Criteria:**
1. Record count reconciliation: 100% of source records present in target (14,000 batch records, zero records lost)
2. Field-level data integrity: checksum match for 100% of numerical data fields; text field character encoding preserved
3. Electronic signatures: 100% of original signer identities and timestamps preserved in migrated records
4. Audit trail: migration event documented in both source and target system audit trails per 21 CFR Part 11
5. Manual spot-check: 200 randomly selected batch records verified field-by-field (0 discrepancies tolerated for GxP-critical fields)

**How Completion Is Verified:**
Pinnacle's quality assurance and IT validation teams execute the PQ protocol. A QA auditor independently spot-checks 200 batch records by comparing source system printouts to target system queries. The FDA 21 CFR Part 11 compliance assessment is reviewed by Pinnacle's Regulatory Affairs team. Service is complete when the PQ report is approved by Pinnacle's validation committee and the legacy system is decommissioned.

**Service Report Format:**
```
File: migration_validation_{project_id}_{date}.pdf
Sections: 1. Migration Summary (source system, target system, data scope, migration date) | 2. Source-to-Target Field Mapping: [Source Table | Source Field | Data Type | Target Table | Target Field | Transformation Rule] | 3. Record Count Reconciliation: [Data Category | Source Count | Target Count | Delta | Status] | 4. Checksum Validation: [Table | Field | Source Checksum | Target Checksum | Match Y/N] | 5. Electronic Signature Verification: [Sample Batch ID | Original Signer | Original Timestamp | Migrated Signer | Migrated Timestamp | Match Y/N] | 6. Manual Spot-Check Results: [Batch ID | Field | Source Value | Target Value | Match Y/N | Investigator] | 7. 21 CFR Part 11 Assessment: [Requirement | Evidence | Compliant Y/N] | 8. Deviations & CAPA | 9. Conclusion | 10. Approval Signatures (QA, IT, RA)
```
Sample reconciliation row: `Batch Process Parameters | 1,847,293 records | 1,847,293 records | 0 | PASS`
Sample spot-check row: `BATCH-2022-11847 | Granulation Endpoint Torque (Nm) | 14.72 | 14.72 | YES | K. O'Brien`

**Standard Reference:** FDA 21 CFR Part 11, GAMP 5 (Good Automated Manufacturing Practice), ISPE Data Integrity Guidance, ICH Q9 (quality risk management)

**Expected Outcome:** 95% probability of successful migration with zero data integrity findings (DataBridge has migrated 8 pharmaceutical MES systems with this methodology)
**Dispute Likelihood:** High -- Data migration in a GxP-regulated environment has extreme quality requirements. A single data integrity discrepancy can halt the migration and require root cause investigation. The 200-record manual spot-check is thorough but cannot cover all 14,000 records. If a post-migration audit (by Pinnacle QA or FDA inspector) discovers a discrepancy in a non-spot-checked record, the dispute centers on whether DataBridge's validation methodology was adequate.
**Settlement Timeline:** Week 1-3: Data mapping and migration plan development. Week 4-5: IQ (installation of migration tools and target database). Week 6-7: OQ (test migration with subset of 500 batch records). Week 8-9: PQ (full migration of 14,000 records). Week 10: Reconciliation and checksum validation. Week 11-12: Manual spot-check (200 records). Week 13: PQ report approval. Week 14: Legacy system decommissioning. Payment terms: 20% at kickoff, 30% at OQ completion, 30% at PQ approval, 20% at legacy decommissioning. Total: 12-16 weeks.

---

## Summary Matrix (S076-S100)

| # | Customer | Service Provider | Service Type | Category | Value | Dispute | Tags |
|---|---|---|---|---|---|---|---|
| S076 | OEM-09 Meridian Auto | Factory 39 Westlake Cal | Dimensional gauge calibration (85 instruments) | Calibration | $14.5K | Low | ISO 17025, ASME B89 |
| S077 | OEM-34 WindStream | Factory 32 PMS GmbH | Torque wrench calibration (22 wrenches) | Calibration | $9.8K | Low | ISO 6789, on-site |
| S078 | OEM-38 Nextera Process | Factory 40 Tri-State Cal | Pressure gauge calibration (45 gauges) | Calibration | $11.2K | Low | ASME B40.100 |
| S079 | OEM-18 Pinnacle Pharma | Factory 41 ThermalTek | RTD & thermocouple calibration (84 sensors) | Calibration | $18.4K | Medium | IEC 60751, FDA |
| S080 | OEM-14 Vanguard | Factory 32 PMS GmbH | Optical comparator calibration (4 units) | Calibration | $7.2K | Low | ISO 17025, on-site |
| S081 | OEM-21 Ironvale Steel | Factory 42 Great Lakes | Tensile testing service (120 specimens) | Testing Lab | $16.8K | Low | ASTM E8, ISO 6892 |
| S082 | OEM-27 Volante Auto | Factory 43 Rhine Valley | Chemical analysis ICP-OES (50 samples) | Testing Lab | $8.5K | Medium | ASTM E1479, ISO 17025 |
| S083 | OEM-01 Lumenar Tech | Factory 34 Ruixin Lab | Failure analysis (25 camera modules) | Testing Lab | $22K | Medium | IPC-9503 |
| S084 | OEM-35 Nextera Water | Factory 44 Gulf Coast Env | Salt spray + UV testing (60 panels) | Testing Lab | $14.8K | Low | ASTM B117, ASTM G154 |
| S085 | OEM-31 Krakow Elec | Factory 33 Heartland | EMC pre-compliance scan | Testing Lab | $5.2K | Low | CISPR 32 |
| S086 | OEM-04 Greenfield IoT | Factory 45 SiliconBridge | PCB layout design service (6-layer HDI) | Engineering | $18.5K | Medium | IPC-2221B |
| S087 | OEM-29 Amazonia Pkg | Factory 46 FlowSim | Mold flow simulation (48-cavity preform) | Engineering | $15K | Low | Moldex3D |
| S088 | OEM-34 WindStream | Factory 47 NordStruct | FEA fatigue analysis (tower flange) | Engineering | $42K | Medium | DNVGL-ST-0126 |
| S089 | OEM-04 Greenfield IoT | Factory 48 EmbedCore | Firmware development (BLE + OTA) | Engineering | $48K | High | BLE 5.3, MISRA-C |
| S090 | OEM-07 Radiant Optics | Factory 49 CertPath | Product certification consulting (FCC/CE/UL) | Engineering | $65K | Medium | FCC Part 15, RED |
| S091 | Factory 02 Weida (cust) | Factory 50 Haas Shanghai | CNC machine annual PM (2x VF-4SS) | Maintenance | $8.4K | Low | ISO 230-2, ISO 230-4 |
| S092 | Factory 05 SemiTek (cust) | Factory 51 KT-Advanced | ATE station PM (3x UltraFLEX II) | Maintenance | $36K | Low | Teradyne spec |
| S093 | OEM-20 Meridius Med | Factory 52 CleanAir | HEPA filter integrity test (24 filters) | Maintenance | $9.6K | Low | ISO 14644-3, FDA |
| S094 | OEM-27 Volante Auto | Factory 53 QualityFirst | Pre-shipment inspection AQL (15K units) | Inspection | $2.8K | Medium | ISO 2859-1 |
| S095 | OEM-09 Meridian Auto | Factory 54 SpecCheck | Incoming receiving inspection (annual) | Inspection | $96K | Low | ISO 2859-1, AS9102 |
| S096 | OEM-05 PulseCore | Factory 55 AccuCount | Warehouse inventory audit (3,200 SKUs) | Inspection | $12.5K | Low | SOX Sec 404 |
| S097 | OEM-27 Volante Auto | Factory 56 Apex Quality | Supplier quality audit IATF 16949 | Audit | $18.5K | Medium | IATF 16949, VDA 6.3 |
| S098 | Factory 02 Weida (cust) | Factory 57 TechTrain | IPC J-STD-001 CIS operator training | Training | $19.2K | Low | IPC J-STD-001H |
| S099 | OEM-09 Meridian Auto | Factory 58 FactoryLogic | MES system integration (Opcenter) | IT | $95K | High | ISA-95, IEC 62264 |
| S100 | OEM-18 Pinnacle Pharma | Factory 59 DataBridge | Production data migration (GxP) | IT | $78K | High | FDA 21 CFR Part 11 |

### Coverage Verification

**Service Categories (all 7 represented):**
- Calibration & Metrology: S076, S077, S078, S079, S080 = 5
- Testing Laboratory: S081, S082, S083, S084, S085 = 5
- Contract Engineering: S086, S087, S088, S089, S090 = 5
- Maintenance & Repair: S091, S092, S093 = 3
- Logistics & Inspection: S094, S095, S096 = 3
- Training & Audit: S097, S098 = 2
- IT & Data: S099, S100 = 2

**Value Distribution:**
- $500 - $10K: S077 ($9.8K), S078 ($11.2K -- borderline), S080 ($7.2K), S084 ($14.8K -- borderline), S085 ($5.2K), S091 ($8.4K), S093 ($9.6K), S094 ($2.8K) = 6-8 scenarios
- $10K - $50K: S076 ($14.5K), S079 ($18.4K), S081 ($16.8K), S082 ($8.5K), S083 ($22K), S086 ($18.5K), S087 ($15K), S088 ($42K), S089 ($48K), S096 ($12.5K), S097 ($18.5K), S098 ($19.2K), S092 ($36K) = 11-13 scenarios
- $50K - $100K: S090 ($65K), S095 ($96K), S099 ($95K), S100 ($78K) = 4 scenarios

**Dispute Distribution:**
- Low: S076, S077, S078, S080, S081, S084, S085, S087, S091, S092, S093, S095, S096, S098 = 14
- Medium: S079, S082, S083, S086, S088, S090, S094, S097 = 8
- High: S089, S099, S100 = 3

**Standards Referenced (25 unique):**
ISO/IEC 17025, ISO 6789, ASME B40.100, IEC 60751, IEC 60584, ASME B89.1.6, ASME B89.1.13, ASTM E8, ASTM E4, ASTM E83, ISO 6892-1, ASTM E1479, IPC-9503, ASTM B117, ASTM G154, CISPR 32, IPC-2221B, DNVGL-ST-0126, MISRA-C, FCC Part 15, ISO 14644-3, ISO 2859-1, IATF 16949, IPC J-STD-001H, FDA 21 CFR Part 11
