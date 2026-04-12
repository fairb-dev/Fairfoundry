# Scenario Pairings: 50 OEM-Factory Service Order Scenarios

> 50 specific scenario pairings between OEM buyers and factory suppliers for the Fairbuild Contract Builder Studio virtual world.
> Each pairing defines a realistic service order with acceptance criteria, expected outcomes, dispute likelihood, and settlement timeline.

---

## Distribution Summary

**Development Stages:** EVT: 10 | DVT: 10 | PVT: 10 | MP: 15 | Sustaining: 5
**Service Order Values:** Small ($5K-$50K): 14 | Medium ($50K-$500K): 22 | Large ($500K-$2M): 14
**Dispute Likelihood:** Low: 23 | Medium: 17 | High: 10
**Multi-Factory Programs:** 5 scenarios (marked with [MULTI-FACTORY])

**OEM Appearance Count:**
| OEM | Appearances | Scenarios |
|---|---|---|
| OEM-01 Lumenar Technologies | 3 | S001, S002, S003 |
| OEM-02 Veridian Display Corp | 2 | S004, S005 |
| OEM-03 Arcwave Semiconductor | 2 | S006, S007 |
| OEM-04 Greenfield IoT Solutions | 2 | S008, S009 |
| OEM-05 PulseCore Wearables | 2 | S010, S011 |
| OEM-06 Novacharge Energy Systems | 3 | S012, S013, S014 |
| OEM-07 Radiant Optics Inc | 2 | S015, S016 |
| OEM-08 Terralink Connectivity | 2 | S017, S018 |
| OEM-09 Meridian Automotive Systems | 2 | S019, S020 |
| OEM-10 Zephyr Electric Motors | 2 | S021, S022 |
| OEM-11 Safeline Vehicle Components | 2 | S023, S024 |
| OEM-12 Lumos Automotive Lighting | 2 | S025, S026 |
| OEM-13 Titanforge Chassis Group | 2 | S027, S028 |
| OEM-14 Vanguard Propulsion Technologies | 2 | S029, S030 |
| OEM-15 Celestial Aerostructures | 2 | S031, S032 |
| OEM-16 Sentinel Defense Electronics | 2 | S033, S034 |
| OEM-17 Altus Space Systems | 2 | S035, S036 |
| OEM-18 Pinnacle Pharmaceuticals | 2 | S037, S038 |
| OEM-19 VitaSource Nutrition | 2 | S039, S040 |
| OEM-20 Meridius Medical Devices | 2 | S041, S042 |
| OEM-21 Ironvale Steel & Alloys | 2 | S043, S044 |
| OEM-22 PetroForge Pipeline Solutions | 2 | S045, S046 |
| OEM-23 SolarEdge Power Systems | 2 | S047, S048 |
| OEM-24 Artisan Apparel Group | 2 | S049, S050 |
| OEM-25 Duraform Building Products | 2 | S043 (end-user via Ironvale), S046 (end-user via PetroForge supply chain) |

**Factory Appearance Count:**
| Factory | Appearances | Scenarios |
|---|---|---|
| Factory 01 Huaqiang Optics & Module | 2 | S001, S010 |
| Factory 02 Suzhou Weida Electronic Assembly | 3 | S002, S008, S034 |
| Factory 03 Dongguan Mingguang Display | 2 | S004, S011 |
| Factory 04 Shenzhen Longwei Battery | 3 | S003, S012, S013 |
| Factory 05 Bucheon SemiTek | 2 | S006, S007 |
| Factory 06 Gumi Advanced Electronics | 2 | S017, S018 |
| Factory 07 Hua Tai Precision Connector | 2 | S033, S035 |
| Factory 08 Taoyuan Photonics Industrial | 2 | S005, S026 |
| Factory 09 Monterrey Precision Castings | 2 | S019, S022 |
| Factory 10 Pune AutoStamp Industries | 2 | S020, S024 |
| Factory 11 Juarez Wiring Systems | 2 | S023, S025 |
| Factory 12 Stuttgart Prazisionsteile | 2 | S021, S028 |
| Factory 13 Chennai Precision Forgings | 2 | S027, S046 |
| Factory 14 Munich Aerospace Components | 2 | S029, S030 |
| Factory 15 Hsinchu BioMed Precision | 2 | S041, S042 |
| Factory 16 Nagoya Seimitsu Kogaku | 2 | S015, S036 |
| Factory 17 Ho Chi Minh Precision Machining | 2 | S031, S032 |
| Factory 18 Hanoi Nutri-Foods JSC | 2 | S039, S040 |
| Factory 19 Hai Phong PharmaChem | 2 | S037, S038 |
| Factory 20 Asan Chemical Materials | 2 | S009, S016 |
| Factory 21 Shanghai Hongda Steel | 2 | S043, S044 |
| Factory 22 Dongguan Yongxin Metal Products | 2 | S014, S048 |
| Factory 23 Detroit Alloy Processing | 2 | S045, S047 |
| Factory 24 Suzhou GreenTex Knitting | 2 | S049, S050 |
| Factory 25 San Antonio Solar Components | 2 | S047, S048 |

---

## ELECTRONICS SCENARIOS (S001 -- S012)

---

### S001

**OEM:** Lumenar Technologies (OEM-01)
**Factory:** Huaqiang Optics & Module Co., Ltd. (Factory 01)
**Product/Service:** 48 MP smartphone camera module assembly and SFR/MTF testing for Lumenar's flagship phone (Q4 2026 launch)
**Development Stage:** PVT
**Service Order Value:** $1,200,000
**Test Scenario Reference:** Scenario 1 -- Camera Module MTF/SFR Testing

**Key Acceptance Criteria:**
1. MTF at Nyquist/2 (center) >= 0.50 for 100% of units
2. MTF at Nyquist/4 (corner, worst) >= 0.50 for >= 97% of units
3. Relative illumination (corner/center) >= 40% for 100% of units
4. Optical center offset <= 15 pixels for 100% of units
5. Cpk >= 1.33 for MTF at Nyquist/2 (center) across production lot

**Expected Outcome:** 96% pass rate (corner MTF is typically the yield limiter for high-resolution modules)
**Dispute Likelihood:** Medium -- Lumenar's incoming inspection uses different Imatest chart calibrations than Huaqiang's production line. Historical data shows 1-2% discrepancy in corner MTF measurements between sites, which can flip borderline units from PASS to FAIL.
**Settlement Timeline:** Week 1: PVT production lot of 5,000 modules produced and tested. Week 2: Shipment and Lumenar incoming inspection. Week 3: Measurement correlation meeting if discrepancy exceeds 1%. Week 4-5: Disposition of borderline units (accept, rework, or reject). Week 6: Payment release for accepted units; dispute resolution for borderline lot if needed. Total: 4-6 weeks.

---

### S002

**OEM:** Lumenar Technologies (OEM-01)
**Factory:** Suzhou Weida Electronic Assembly Co., Ltd. (Factory 02)
**Product/Service:** 8-layer HDI mainboard PCB assembly for Lumenar's new smartwatch, including SMT, AOI, and ICT
**Development Stage:** DVT
**Service Order Value:** $185,000
**Test Scenario Reference:** Scenario 2 -- PCB Automated Optical Inspection (AOI)

**Key Acceptance Criteria:**
1. Zero solder bridge defects per IPC-A-610 Class 2 across all boards
2. Component offset defect rate <= 0.1% of total component placements
3. Zero tombstone defects (IPC-A-610 Class 2 mandatory reject)
4. All BOM components present on 100% of boards
5. ICT pass rate >= 99.5% at first pass

**Expected Outcome:** 98% first-pass yield (DVT boards have tighter layouts with 0201 components that challenge placement accuracy)
**Dispute Likelihood:** Low -- AOI criteria are binary per IPC-A-610 and well-understood by both parties. Weida's Koh Young systems are calibrated to IPC standards.
**Settlement Timeline:** Week 1: DVT lot of 500 boards assembled. Week 2: AOI and ICT data delivered with boards. Week 3: Lumenar engineering review of DVT test results. Week 4: Payment release. Total: 3-4 weeks.

---

### S003

**OEM:** Lumenar Technologies (OEM-01)
**Factory:** Shenzhen Longwei Battery Technology Co., Ltd. (Factory 04)
**Product/Service:** 4500 mAh Li-polymer battery cell for Lumenar's next-generation smartphone, including formation, grading, and 7-day K-value aging
**Development Stage:** MP
**Service Order Value:** $850,000
**Test Scenario Reference:** Scenario 11 -- Battery Cell Formation & Grading

**Key Acceptance Criteria:**
1. Discharge capacity 4365-4635 mAh (nominal 4500, +/- 3%) for >= 98% of cells
2. DCIR <= 35 mohm at 50% SOC for 100% of cells
3. K-value (OCV slope over 7 days) <= 5.0 uV/h for 100% of cells
4. Grade A yield >= 85% (capacity 4410-4590 mAh, DCIR <= 30 mohm, K-value <= 3.0 uV/h)
5. Post-formation thickness <= 4.50 mm for 100% of cells

**Expected Outcome:** 97% overall pass rate; 88% Grade A yield
**Dispute Likelihood:** High -- K-value data arrives 7 days after shipment. Lumenar's finance team withholds payment until K-value clears, but Longwei ships cells based on capacity/impedance data. Historical disagreements arise when Lumenar's incoming K-value measurement (14-day aging) yields different grades than Longwei's 7-day aging results.
**Settlement Timeline:** Week 1: Production of 100,000 cells; capacity and impedance testing. Week 2: Shipment triggered by capacity/impedance pass; 85% payment release. Week 3-4: 7-day K-value aging data generated at Longwei. Week 4: K-value data uploaded; 15% payment release for cells meeting K-value spec. Week 5-8: If Lumenar's 14-day incoming K-value disagrees, dispute resolution involving shared data review and re-measurement protocol. Total: 4-8 weeks.

---

### S004

**OEM:** Veridian Display Corp (OEM-02)
**Factory:** Dongguan Mingguang Display Technology Co., Ltd. (Factory 03)
**Product/Service:** 15.6" IPS LCD display modules targeting VESA DisplayHDR 400 for a laptop OEM customer of Veridian
**Development Stage:** MP
**Service Order Value:** $1,800,000
**Test Scenario Reference:** Scenario 4 -- Display Module Luminance & Color Testing

**Key Acceptance Criteria:**
1. Peak luminance (8% center patch) >= 400 cd/m2 for 100% of panels
2. Full-screen sustained luminance >= 250 cd/m2 for 100% of panels
3. BT.709 color gamut coverage >= 99% for >= 98% of panels
4. DCI-P3 color gamut coverage >= 90% for >= 95% of panels
5. Luminance uniformity (9-point) >= 85% for >= 97% of panels

**Expected Outcome:** 95% Grade A yield (panels meeting all five criteria)
**Dispute Likelihood:** High -- Display grading disputes are endemic. Veridian uses Instrument Systems CAS spectroradiometers calibrated to their internal reference; Mingguang uses Konica Minolta CA-410 color analyzers. Measurement methodology differences (9-point vs. 13-point grid, darkroom conditions) routinely cause 2-3% grade disagreement. Payment for entire shipments has historically been withheld over single-digit percentage grading discrepancies.
**Settlement Timeline:** Week 1-2: MP lot of 10,000 panels produced and tested. Week 3: Shipment with per-panel test data. Week 4: Veridian IQC re-grades 5% sample. Week 5: Grade correlation meeting. If discrepancy > 2%, proceed to dispute. Week 6-8: Disputed panels re-measured with agreed reference instrument. Week 8-10: Final disposition and payment. Total: 4-10 weeks (high variance due to grading disputes).

---

### S005

**OEM:** Veridian Display Corp (OEM-02)
**Factory:** Taoyuan Photonics Industrial Co., Ltd. (Factory 08)
**Product/Service:** LED backlight units (edge-lit, 3000K CCT, for 15.6" laptop displays) -- chromaticity-binned LED reels
**Development Stage:** MP
**Service Order Value:** $320,000
**Test Scenario Reference:** Scenario 9 -- LED Binning (Color Temperature & Luminous Flux)

**Key Acceptance Criteria:**
1. CCT within 2700-3200K (3-step MacAdam ellipse around 3000K nominal) for 100% of LEDs
2. CIE 1931 chromaticity x: 0.430-0.445, y: 0.388-0.405 for 100% of LEDs
3. Luminous flux within specified bin range (90-110 lm) for >= 99% of LEDs
4. CRI (Ra) >= 80 for 100% of LEDs
5. Bin distribution: >= 70% of shipment within primary target bin combination

**Expected Outcome:** 99% parametric pass rate; 75% primary bin yield
**Dispute Likelihood:** Medium -- Chromaticity bin drift between production lots is a known issue. Taoyuan calibrates integrating spheres quarterly; Veridian's incoming inspection uses different sphere with different calibration, causing 1-2 SDCM (Standard Deviation of Color Matching) difference. Bin allocation disputes arise when actual bin distribution does not match order requirements.
**Settlement Timeline:** Week 1-2: LED production and binning (500K reels). Week 3: Bin distribution report and shipment. Week 4: Veridian incoming inspection (2% sample). Week 5: Bin matching assessment for display production. Week 6: Payment release if bin distribution meets 70% primary target; negotiation on substitute bins if below. Total: 4-6 weeks.

---

### S006

**OEM:** Arcwave Semiconductor (OEM-03)
**Factory:** Bucheon SemiTek Co., Ltd. (Factory 05)
**Product/Service:** Automotive-grade MEMS accelerometer packaging and calibration (AEC-Q100 qualification lot)
**Development Stage:** EVT
**Service Order Value:** $95,000
**Test Scenario Reference:** Scenario 6 -- MEMS Accelerometer Calibration

**Key Acceptance Criteria:**
1. Sensitivity within 0.488 +/- 2% mg/LSB on all three axes for 100% of devices
2. Zero-g offset within +/- 40 mg on all three axes for >= 99% of devices
3. Cross-axis sensitivity <= 2% for 100% of devices
4. Nonlinearity <= 0.5% FS for 100% of devices
5. All parameters must pass across -40 to +125 deg C operating range

**Expected Outcome:** 92% yield (EVT stage; temperature corner performance at -40C and +125C is the primary yield limiter)
**Dispute Likelihood:** Medium -- Yield fallout at temperature corners is disputed because Arcwave re-tests at slightly different temperatures (+/-2 deg C) than SemiTek's test system. The narrow AEC-Q100 specification combined with measurement uncertainty at temperature extremes leads to borderline unit disagreements.
**Settlement Timeline:** Week 1-4: AEC-Q100 qualification lot assembly (1,000 units). Week 5-8: Temperature cycling, tumble-test calibration, and parametric testing. Week 9: Data package delivery to Arcwave. Week 10-12: Arcwave engineering review and incoming verification. Week 12-14: Qualification report and payment release (milestone-based: 50% at assembly complete, 50% at qualification pass). Total: 10-14 weeks.

---

### S007

**OEM:** Arcwave Semiconductor (OEM-03)
**Factory:** Bucheon SemiTek Co., Ltd. (Factory 05)
**Product/Service:** Industrial-grade MEMS gyroscope final test and packaging (production volume)
**Development Stage:** MP
**Service Order Value:** $450,000
**Test Scenario Reference:** Scenario 6 -- MEMS Accelerometer Calibration (adapted for gyroscope parameters)

**Key Acceptance Criteria:**
1. Rate sensitivity within +/- 1.5% of nominal on all three axes
2. Zero-rate offset <= 5 deg/s for 100% of devices
3. Cross-axis sensitivity <= 3% for 100% of devices
4. Noise density <= 0.01 deg/s/sqrt(Hz) for 100% of devices
5. Cpk >= 1.67 for sensitivity parameter across monthly production

**Expected Outcome:** 96% yield (industrial-grade has wider tolerances than automotive)
**Dispute Likelihood:** Low -- Industrial-grade specifications have more margin. SemiTek and Arcwave have an established production relationship with agreed test conditions documented in STDF format conversion tables.
**Settlement Timeline:** Week 1-2: Production lot of 50,000 units tested. Week 3: Data delivery and shipment. Week 4: Arcwave incoming inspection (1% sample). Week 5: Payment release. Total: 4-5 weeks.

---

### S008

**OEM:** Greenfield IoT Solutions (OEM-04)
**Factory:** Suzhou Weida Electronic Assembly Co., Ltd. (Factory 02)
**Product/Service:** 4-layer PCB assembly for smart home environmental sensor hub (WiFi/BLE, 0402 components)
**Development Stage:** DVT
**Service Order Value:** $42,000
**Test Scenario Reference:** Scenario 3 -- SMT Solder Paste Inspection (SPI)

**Key Acceptance Criteria:**
1. Solder paste volume within 60-160% of aperture for >= 99% of pads
2. Solder paste height within 130-180 um for >= 99% of pads
3. Zero bridging defects detected by SPI
4. AOI pass rate >= 98% (IPC-A-610 Class 2)
5. Functional test pass rate >= 95% (DVT stage; firmware bugs expected)

**Expected Outcome:** 97% SPI pass rate; 95% functional test pass rate
**Dispute Likelihood:** Low -- Greenfield has pragmatic quality thresholds (Cpk >= 1.00) and Weida is experienced with IoT PCB assemblies. Small order value reduces dispute motivation.
**Settlement Timeline:** Week 1: DVT lot of 200 boards assembled. Week 2: SPI, AOI, and functional test data delivered. Week 3: Greenfield engineering review. Week 4: Payment release (Net-30). Total: 3-4 weeks.

---

### S009

**OEM:** Greenfield IoT Solutions (OEM-04)
**Factory:** Asan Chemical Materials Co., Ltd. (Factory 20)
**Product/Service:** Electronic-grade IPA (isopropyl alcohol) for PCB cleaning validation in Greenfield's assembly process qualification
**Development Stage:** EVT
**Service Order Value:** $8,500
**Test Scenario Reference:** Scenario 48 -- Water Treatment Chemical Analysis (adapted for electronic-grade chemical purity)

**Key Acceptance Criteria:**
1. Assay (IPA purity) >= 99.99%
2. Water content <= 100 ppm
3. Particle count (>= 0.1 um) <= 25/mL
4. Metal ion impurities: Na <= 100 ppt, Fe <= 50 ppt, K <= 100 ppt
5. Certificate of Analysis provided per SEMI C41

**Expected Outcome:** 99% lot pass rate (Asan routinely produces electronic-grade chemicals)
**Dispute Likelihood:** Low -- Standard catalog product from Asan with well-characterized specifications. Small order value.
**Settlement Timeline:** Week 1: Order placed. Week 2: Production and QC testing. Week 3: CoA generated and shipment. Week 4: Greenfield incoming verification and payment. Total: 3-4 weeks.

---

### S010

**OEM:** PulseCore Wearables (OEM-05)
**Factory:** Huaqiang Optics & Module Co., Ltd. (Factory 01)
**Product/Service:** Optical heart rate sensor module (PPG, green LED + photodiode) for PulseCore's next-generation fitness tracker
**Development Stage:** EVT
**Service Order Value:** $65,000
**Test Scenario Reference:** Scenario 1 -- Camera Module MTF/SFR Testing (adapted for PPG sensor optical performance)

**Key Acceptance Criteria:**
1. LED wavelength 525 nm +/- 5 nm for 100% of modules
2. Photodiode dark current <= 10 nA for 100% of modules
3. Signal-to-noise ratio >= 60 dB under controlled test conditions
4. Module-level IP68 waterproof test pass (1.5m submersion, 30 min) for 100% of units
5. Cpk >= 1.33 for LED wavelength across production lot

**Expected Outcome:** 88% pass rate (EVT stage; waterproofing yield is the primary concern with new sealing design)
**Dispute Likelihood:** Medium -- PulseCore needs wrist-motion-artifact data that Huaqiang does not typically collect. PulseCore's internal testing may reveal SNR issues under motion conditions that the static factory test does not capture, leading to post-shipment quality disagreements.
**Settlement Timeline:** Week 1-3: EVT lot of 200 modules assembled and tested. Week 4: Shipment with static test data. Week 5-6: PulseCore in-house motion testing reveals potential issues. Week 7: Design review meeting to discuss motion-artifact results. Week 8: Payment release for units passing PulseCore's criteria; engineering disposition for borderline units. Total: 6-8 weeks.

---

### S011

**OEM:** PulseCore Wearables (OEM-05)
**Factory:** Dongguan Mingguang Display Technology Co., Ltd. (Factory 03)
**Product/Service:** 1.4" AMOLED micro-display modules for PulseCore's premium smartwatch line
**Development Stage:** PVT
**Service Order Value:** $520,000
**Test Scenario Reference:** Scenario 4 -- Display Module Luminance & Color Testing (adapted for wearable OLED)

**Key Acceptance Criteria:**
1. Peak luminance >= 1,000 cd/m2 for 100% of displays
2. Zero full-pixel defects across the display (1.4" at 326 PPI)
3. Maximum 2 bright subpixel defects per display
4. Color uniformity (delta E < 3.0 at 5 measurement points) for >= 98% of displays
5. Display brightness uniformity >= 80% (5-point) for >= 97% of displays

**Expected Outcome:** 93% yield (OLED pixel defect limits on small wearable displays are tight)
**Dispute Likelihood:** High -- OLED pixel defect classification is the primary dispute vector. PulseCore classifies certain "process indicators" per Mingguang's system as "minor defects" per PulseCore's standard. What Mingguang ships as Grade A, PulseCore's IQC may downgrade to Grade B. Historical RMA dispute rate on this product line is 4%.
**Settlement Timeline:** Week 1-2: PVT lot of 5,000 displays produced and tested. Week 3: Shipment with per-display defect classification data. Week 4: PulseCore IQC re-inspects 10% sample. Week 5: Defect classification reconciliation. If > 2% disagreement, per-display arbitration begins. Week 6-8: Disputed displays re-inspected under jointly agreed conditions. Week 8: Payment for undisputed Grade A; negotiated pricing for re-graded units. Total: 4-8 weeks.

---

### S012

**OEM:** Novacharge Energy Systems (OEM-06)
**Factory:** Shenzhen Longwei Battery Technology Co., Ltd. (Factory 04)
**Product/Service:** 21700 cylindrical Li-ion cells (NMC811, 5000 mAh) for EV battery modules -- weekly production volume
**Development Stage:** MP
**Service Order Value:** $1,950,000
**Test Scenario Reference:** Scenario 5 -- Lithium-Ion Battery Cell Capacity & Impedance Testing

**Key Acceptance Criteria:**
1. Rated capacity (0.2C discharge) within 4850-5150 mAh for >= 99% of cells
2. AC impedance at 1 kHz <= 25 mohm for 100% of cells
3. OCV (post-formation) within 3.60-3.80V for 100% of cells
4. Self-discharge (72h OCV drop) <= 30 mV for 100% of cells
5. Cpk >= 2.00 for capacity and impedance (cell-matching critical for pack safety)

**Expected Outcome:** 98.5% overall pass rate; Cpk target achievable with Longwei's process maturity
**Dispute Likelihood:** High -- K-value (self-discharge) data arrives 10+ days after physical delivery. Novacharge's finance team blocks payment until K-value data is verified. Additionally, Novacharge's incoming inspection uses 14-day aging (vs. Longwei's 7-day), and the different aging windows produce statistically different K-value distributions. Disputes over 0.5-1% of cells cause payment delays on entire shipments of 50,000+ cells.
**Settlement Timeline:** Week 1: Production of 50,000+ cells; capacity/impedance testing. Week 2: Shipment triggered by capacity/impedance pass; 85% escrow release. Week 3-4: 7-day K-value aging at Longwei. Week 4: K-value data uploaded. Week 5: 15% payment release for cells clearing K-value spec. Week 6+: If Novacharge's 14-day re-test disagrees, dispute process activates involving shared data audit. Total: 4-8 weeks.

---

## AUTOMOTIVE SCENARIOS (S013 -- S028)

---

### S013 [MULTI-FACTORY]

**OEM:** Novacharge Energy Systems (OEM-06)
**Factory:** Shenzhen Longwei Battery Technology Co., Ltd. (Factory 04) -- Cell supply
**Related Factory:** Dongguan Yongxin Metal Products Co., Ltd. (Factory 22) -- Battery tray aluminum extrusion
**Product/Service:** This is the cell supply component of Novacharge's EV battery pack program. Factory 04 supplies cells (see S012) while Factory 22 supplies the battery tray extrusion (see S014). Same program, two factories.
**Development Stage:** DVT
**Service Order Value:** $380,000 (DVT cell lot for pack-level thermal validation)
**Test Scenario Reference:** Scenario 20 -- EV Battery Pack Thermal Testing

**Key Acceptance Criteria:**
1. Max cell temperature during 1C continuous discharge <= 45 deg C
2. Cell-to-cell temperature differential <= 5 deg C within each module
3. Coolant inlet-outlet delta T <= 8 deg C
4. BMS voltage reading accuracy +/- 5 mV per cell
5. Insulation resistance >= 1.0 Mohm per volt (>= 400 Mohm for 400V pack)

**Expected Outcome:** 90% DVT pack-level pass rate (thermal management design is being validated)
**Dispute Likelihood:** Medium -- When a pack fails thermal testing, determining whether the root cause is cell quality (Factory 04) or battery tray thermal path (Factory 22) requires cross-factory data correlation. Neither factory has visibility into the other's data, making root-cause assignment contentious.
**Settlement Timeline:** Week 1-4: DVT cells received from Longwei; DVT battery trays from Yongxin. Week 5-6: Pack assembly at Novacharge's Gdansk plant. Week 7-8: Pack thermal validation testing. Week 9: Root cause analysis for any failed packs. Week 10-12: Payment to each factory contingent on their component's contribution to pass/fail. Total: 8-12 weeks.

---

### S014 [MULTI-FACTORY]

**OEM:** Novacharge Energy Systems (OEM-06)
**Factory:** Dongguan Yongxin Metal Products Co., Ltd. (Factory 22)
**Product/Service:** Aluminum extruded battery tray profiles (6063-T6) for EV battery pack -- machined, anodized, with coolant channel features
**Development Stage:** DVT
**Service Order Value:** $125,000
**Test Scenario Reference:** Scenario 14 -- Engine Block Dimensional Inspection (adapted for battery tray CMM)

**Key Acceptance Criteria:**
1. Coolant channel dimensional tolerance +/- 0.10 mm on all critical bore diameters
2. Tray flatness <= 0.50 mm over 1.5m length
3. Anodize thickness 15-25 um (Type II clear anodize) per MIL-A-8625F
4. Alloy tensile strength >= 170 MPa (6063-T6 per ASTM B221)
5. Zero coolant channel blockages (pressure leak test at 3 bar, 60 seconds, zero leakage)

**Expected Outcome:** 94% first-pass yield (DVT stage; new extrusion die may require optimization)
**Dispute Likelihood:** Low -- Dimensional inspection criteria are objective and measurable. Yongxin's CMM data format is simple and interpretable.
**Settlement Timeline:** Week 1-2: DVT lot of 50 trays extruded and machined. Week 3: CMM inspection and leak test. Week 4: Shipment with dimensional data. Week 5: Novacharge incoming inspection. Week 6: Payment release. Total: 5-6 weeks.

---

### S015

**OEM:** Radiant Optics Inc (OEM-07)
**Factory:** Nagoya Seimitsu Kogaku K.K. (Factory 16)
**Product/Service:** Precision diffractive waveguide optical elements for AR headset prototype (diamond-turned, with AR coating)
**Development Stage:** EVT
**Service Order Value:** $78,000
**Test Scenario Reference:** Scenario 39 -- Turbine Blade Dimensional CMM Inspection (adapted for precision optics -- surface figure and wavefront)

**Key Acceptance Criteria:**
1. Surface figure <= lambda/10 PV at 632.8 nm for all optical surfaces
2. Surface roughness (Ra) <= 2.0 nm RMS
3. Centering error <= 1.0 arcminute
4. AR coating reflectance <= 0.5% per surface at 520-640 nm
5. MTF at field angles (0, 10, 20, 30 degrees) >= specified per waveguide design

**Expected Outcome:** 85% yield (EVT stage for precision optics; surface figure at lambda/10 is demanding)
**Dispute Likelihood:** Medium -- Waveguide MTF test setups differ between Nagoya Seimitsu's facility and Radiant's lab. Illumination conditions and measurement protocol variations make cross-site comparison unreliable. For $78K order, both parties have motivation to resolve quickly.
**Settlement Timeline:** Week 1-4: EVT lot of 50 waveguides manufactured. Week 5: Interferometric testing and coating characterization at Nagoya. Week 6: Shipment with test data (interferograms + CSV). Week 7-8: Radiant incoming optical verification. Week 8-10: Measurement correlation if discrepancies arise. Week 10: Payment release. Total: 8-10 weeks.

---

### S016

**OEM:** Radiant Optics Inc (OEM-07)
**Factory:** Asan Chemical Materials Co., Ltd. (Factory 20)
**Product/Service:** High-purity photoresist developer chemical for Radiant's micro-LED research fabrication line
**Development Stage:** Sustaining
**Service Order Value:** $15,000
**Test Scenario Reference:** Scenario 48 -- Water Treatment Chemical Analysis (adapted for semiconductor chemical purity)

**Key Acceptance Criteria:**
1. Active concentration within +/- 0.5% of specification
2. Particle count (>= 0.1 um) <= 10/mL
3. Metal ions (Na, K, Fe, Ca) each <= 50 ppt
4. Chloride <= 5 ppb
5. CoA delivered within 24 hours of production

**Expected Outcome:** 99.5% lot pass rate (standard sustaining supply of well-characterized product)
**Dispute Likelihood:** Low -- Routine sustaining order with established specifications. Asan's quality system is mature for semiconductor chemicals.
**Settlement Timeline:** Week 1: Order placed against blanket PO. Week 2: Production, testing, and shipment with CoA. Week 3: Radiant incoming QC verification. Week 4: Payment (Net-30). Total: 3-4 weeks.

---

### S017

**OEM:** Terralink Connectivity (OEM-08)
**Factory:** Gumi Advanced Electronics Co., Ltd. (Factory 06)
**Product/Service:** 5G mmWave antenna array modules (28 GHz band, 64-element phased array) for Terralink's outdoor small cell product
**Development Stage:** PVT
**Service Order Value:** $780,000
**Test Scenario Reference:** Scenario 7 -- RF Antenna VSWR / Return Loss Testing

**Key Acceptance Criteria:**
1. Return loss (S11) <= -10 dB across 26-30 GHz for 100% of modules
2. VSWR <= 1.92:1 across entire 26-30 GHz band for 100% of modules
3. Gain at broadside >= 5.0 dBi for 100% of modules
4. 3 dB beamwidth within 60-90 degrees for >= 98% of modules
5. Port-to-port isolation >= 20 dB for >= 99% of modules

**Expected Outcome:** 94% first-pass yield (mmWave antenna yields are inherently variable due to tight frequency tolerances)
**Dispute Likelihood:** Medium -- Terralink suspects 15-20% yield variation across three qualified antenna suppliers is test-setup-related rather than real. Comparison of Gumi's data with other suppliers' data on same design is a known tension point. S-parameter data format inconsistencies between suppliers complicate the comparison.
**Settlement Timeline:** Week 1-2: PVT production lot of 2,000 modules. Week 3: RF testing on VNA, data delivery. Week 4: Shipment to Terralink. Week 5: Terralink incoming RF verification (5% sample). Week 6: Yield comparison analysis across suppliers. Week 7: Payment release. Total: 5-7 weeks.

---

### S018

**OEM:** Terralink Connectivity (OEM-08)
**Factory:** Gumi Advanced Electronics Co., Ltd. (Factory 06)
**Product/Service:** High-frequency PCB assemblies (Rogers 4003C substrate, 10-layer) for 5G base station fronthaul interface
**Development Stage:** MP
**Service Order Value:** $340,000
**Test Scenario Reference:** Scenario 3 -- SMT Solder Paste Inspection (adapted for high-frequency RF PCB)

**Key Acceptance Criteria:**
1. Impedance control: 50 ohm +/- 5% on all controlled-impedance traces (TDR verified)
2. Insertion loss <= 0.15 dB/inch at 10 GHz
3. SPI volume within 60-160% for >= 99.5% of pads
4. AOI per IPC-A-610 Class 3 (high-reliability) -- zero defects
5. ICT pass rate >= 99.8%

**Expected Outcome:** 97% overall yield
**Dispute Likelihood:** Low -- Established MP product with stable process. Gumi's Rogers PCB assembly line is well-characterized for telecom applications.
**Settlement Timeline:** Week 1-2: MP lot of 1,000 boards. Week 3: Testing and shipment. Week 4: Terralink incoming inspection. Week 5: Payment release (Net-60). Total: 4-5 weeks.

---

### S019

**OEM:** Meridian Automotive Systems (OEM-09)
**Factory:** Monterrey Precision Castings S.A. de C.V. (Factory 09)
**Product/Service:** Aluminum die-cast brake caliper housings (4-piston monoblock) for European premium OEM program
**Development Stage:** PVT
**Service Order Value:** $650,000
**Test Scenario Reference:** Scenario 22 -- Brake Caliper Casting Pressure Testing

**Key Acceptance Criteria:**
1. Zero leakage at 150 bar hydrostatic proof test for 30 seconds on 100% of calipers
2. Burst pressure >= 350 bar on sampling basis (1 per 500 units)
3. X-ray porosity: no pores exceeding ASTM E155 Level 2 reference radiograph
4. CMM dimensional inspection: bore diameter 38.000 +/- 0.010 mm
5. Cpk >= 1.67 for caliper bore diameter

**Expected Outcome:** 97% first-pass yield (PVT stage; casting porosity is well-controlled at Monterrey)
**Dispute Likelihood:** High -- Porosity disputes on structural castings are Monterrey's #1 pain point. Factory X-ray may show acceptable levels, but Meridian's CT-scan (higher resolution) finds additional sub-surface porosity that the factory's 2D X-ray did not detect. This is a known measurement system disagreement, not a quality issue.
**Settlement Timeline:** Week 1-3: PVT lot of 2,000 calipers cast, machined, and tested. Week 4: Proof test and X-ray data package delivery. Week 5: Shipment to Meridian. Week 6: Meridian incoming CT-scan on 2% sample. Week 7: If CT-scan finds porosity disagreement, root-cause investigation begins. Week 8-10: Measurement system correlation study (X-ray vs. CT). Week 10: Disposition and payment. Total: 6-10 weeks.

---

### S020

**OEM:** Meridian Automotive Systems (OEM-09)
**Factory:** Pune AutoStamp Industries Pvt. Ltd. (Factory 10)
**Product/Service:** Stamped steel brackets (HSLA 440 MPa grade) for brake system mounting on Indian-market passenger vehicle
**Development Stage:** MP
**Service Order Value:** $95,000
**Test Scenario Reference:** Scenario 14 -- Engine Block Dimensional Inspection (adapted for stamped bracket CMM)

**Key Acceptance Criteria:**
1. All GD&T features within IATF 16949 PPAP dimensional tolerances
2. Material thickness within +/- 0.08 mm of specification
3. Burr height <= 0.15 mm on all sheared edges
4. Hole true position <= 0.20 mm
5. Weld nugget diameter >= 5.0 mm on all spot welds (per destructive peel test sampling)

**Expected Outcome:** 96% first-pass yield
**Dispute Likelihood:** Low -- Stamped brackets are a mature product with well-understood process controls. AutoStamp has established relationships with multiple automotive OEMs.
**Settlement Timeline:** Week 1-2: MP lot of 10,000 brackets produced. Week 3: CMM and destructive weld test data. Week 4: Shipment. Week 5: Meridian incoming inspection. Week 6-7: Payment release (Net-60). Total: 5-7 weeks.

---

### S021

**OEM:** Zephyr Electric Motors (OEM-10)
**Factory:** Stuttgart Prazisionsteile GmbH (Factory 12)
**Product/Service:** Precision-ground EV motor shafts (4140 steel, quenched and tempered) with bearing seats and spline features
**Development Stage:** DVT
**Service Order Value:** $110,000
**Test Scenario Reference:** Scenario 26 -- Rockwell Hardness Testing

**Key Acceptance Criteria:**
1. Hardness 28-34 HRC across all measurement points
2. Bearing seat diameter within +/- 0.005 mm
3. Surface finish Ra <= 0.4 um on bearing seats
4. Spline profile within DIN 5480 tolerances (verified on Klingelnberg gear measuring center)
5. Total runout <= 0.015 mm at bearing seat relative to shaft datum

**Expected Outcome:** 95% first-pass yield (DVT; tight dimensional tolerances on new shaft design)
**Dispute Likelihood:** Low -- Stuttgart Prazisionsteile has a fully climate-controlled metrology lab and high-accuracy CMMs. German OEM quality expectations are well-aligned.
**Settlement Timeline:** Week 1-3: DVT lot of 100 shafts machined and heat-treated. Week 4: CMM, hardness, and surface finish inspection. Week 5: Shipment with full dimensional report. Week 6: Zephyr incoming inspection. Week 7: Payment release. Total: 5-7 weeks.

---

### S022

**OEM:** Zephyr Electric Motors (OEM-10)
**Factory:** Monterrey Precision Castings S.A. de C.V. (Factory 09)
**Product/Service:** Aluminum die-cast motor housings (A380 alloy) with integrated liquid-cooling jacket for EV traction motors
**Development Stage:** PVT
**Service Order Value:** $480,000
**Test Scenario Reference:** Scenario 22 -- Brake Caliper Casting Pressure Testing (adapted for motor housing coolant passage leak test)

**Key Acceptance Criteria:**
1. Coolant passage leak test: zero leakage at 3 bar for 60 seconds on 100% of housings
2. X-ray porosity: no pores exceeding ASTM E155 Level 2 in critical structural zones
3. CMM bore diameter (stator seat) 250.000 +/- 0.025 mm
4. Housing face flatness <= 0.050 mm
5. Cpk >= 1.33 for stator bore diameter

**Expected Outcome:** 95% first-pass yield
**Dispute Likelihood:** Medium -- Coolant passage leak test pass/fail criteria are clear, but when Zephyr's incoming inspection detects a slow leak (below Monterrey's detection threshold), there is no data to compare test conditions (pressure stabilization time, seal methodology). This measurement-system gap has caused disputes on prior programs.
**Settlement Timeline:** Week 1-3: PVT lot of 500 housings cast and machined. Week 4: Leak test and CMM data. Week 5: Shipment. Week 6: Zephyr incoming leak test and dimensional verification. Week 7: If leak test discrepancies, GR&R study initiated. Week 8-9: Payment release. Total: 6-9 weeks.

---

### S023

**OEM:** Safeline Vehicle Components (OEM-11)
**Factory:** Juarez Wiring Systems S.A. de C.V. (Factory 11)
**Product/Service:** Seat belt pretensioner wiring sub-harness (6 circuits, including pyrotechnic initiator connector)
**Development Stage:** MP
**Service Order Value:** $280,000
**Test Scenario Reference:** Scenario 15 -- Wiring Harness Continuity Testing

**Key Acceptance Criteria:**
1. Continuity resistance <= calculated theoretical + 20% margin on all 6 circuits
2. Insulation resistance >= 100 Mohm at 500V DC between all circuit pairs
3. Hipot: no breakdown at 1500V AC for 60 seconds
4. Zero mis-wires (safety-critical; initiator circuit must be correctly routed)
5. Crimp pull force >= specified minimum per terminal type (per MIL-STD-1344)

**Expected Outcome:** 99.2% first-pass yield (MP stage; established product with mature process)
**Dispute Likelihood:** Low -- Safeline's QDS (Quality Data Standard) format is well-defined. Juarez has dedicated production lines for Safeline's safety-critical harnesses with 100% electrical testing.
**Settlement Timeline:** Week 1-2: MP lot of 20,000 harnesses produced and 100% tested. Week 3: Data package and shipment. Week 4: Safeline incoming inspection (sampling). Week 5-6: Payment release (Net-60). Total: 4-6 weeks.

---

### S024

**OEM:** Safeline Vehicle Components (OEM-11)
**Factory:** Pune AutoStamp Industries Pvt. Ltd. (Factory 10)
**Product/Service:** Steering wheel armature stampings (magnesium alloy sheet, precision stamped with welded reinforcements)
**Development Stage:** EVT
**Service Order Value:** $35,000
**Test Scenario Reference:** Scenario 14 -- Engine Block Dimensional Inspection (adapted for stamped armature)

**Key Acceptance Criteria:**
1. All critical dimensions per GD&T within PPAP Level 3 tolerances
2. Welded joint shear strength >= 80% of base material strength
3. Fatigue test: 10,000 cycles at 200 Nm without crack initiation (sampling basis)
4. Material thickness within +/- 0.05 mm
5. Surface finish acceptable per Safeline visual acceptance standard

**Expected Outcome:** 90% first-pass yield (EVT stage; new magnesium stamping process requires optimization)
**Dispute Likelihood:** Low -- EVT expectations include higher fallout rate. Both parties focused on design learning, not payment disputes.
**Settlement Timeline:** Week 1-3: EVT lot of 50 armatures. Week 4-5: Dimensional and destructive testing. Week 6: Data delivery and shipment. Week 7: Safeline engineering evaluation. Week 8: Payment release (milestone-based). Total: 6-8 weeks.

---

### S025

**OEM:** Lumos Automotive Lighting (OEM-12)
**Factory:** Juarez Wiring Systems S.A. de C.V. (Factory 11)
**Product/Service:** Headlamp wire harness assemblies (8 circuits, sealed connectors, for LED headlamp modules)
**Development Stage:** MP
**Service Order Value:** $165,000
**Test Scenario Reference:** Scenario 15 -- Wiring Harness Continuity Testing

**Key Acceptance Criteria:**
1. Continuity on all 8 circuits with resistance <= calculated max
2. Insulation resistance >= 100 Mohm at 500V DC
3. Hipot: no breakdown at 1500V AC for 60 seconds
4. Connector insertion force within 10-40 N per contact (per connector spec)
5. Sealed connector waterproof test: IP67 (immersion at 1m for 30 min) on sampling basis

**Expected Outcome:** 98.5% first-pass yield
**Dispute Likelihood:** Low -- Lumos uses a different data format than Juarez's other customer (a Japanese OEM), but the conversion for this established product is well-defined.
**Settlement Timeline:** Week 1-2: MP lot of 15,000 harnesses. Week 3: Testing and shipment. Week 4: Lumos incoming inspection. Week 5: Payment release (Net-45). Total: 4-5 weeks.

---

### S026

**OEM:** Lumos Automotive Lighting (OEM-12)
**Factory:** Taoyuan Photonics Industrial Co., Ltd. (Factory 08)
**Product/Service:** High-power LED packages (white, 5700K, 500+ lm) for headlamp projector modules -- binned per ANSI C78.377
**Development Stage:** MP
**Service Order Value:** $420,000
**Test Scenario Reference:** Scenario 9 -- LED Binning (Color Temperature & Luminous Flux)

**Key Acceptance Criteria:**
1. CCT within 5500-6500K (within ANSI 3-step MacAdam ellipse around 5700K nominal)
2. Luminous flux >= 500 lm at 700 mA drive current
3. Thermal resistance Rth(j-c) <= 3 K/W
4. CRI >= 70 for 100% of LEDs
5. Forward voltage 2.8-3.4V for bin allocation

**Expected Outcome:** 97% parametric pass rate; 80% primary bin yield
**Dispute Likelihood:** Medium -- LED package-level data does not correlate well with headlamp-level photometry because secondary optics introduce variability. Lumos may reject LED lots that meet package-level specs but produce non-compliant headlamp photometry. This is a system-level vs. component-level specification mismatch.
**Settlement Timeline:** Week 1-2: LED production, testing, and binning. Week 3: Bin distribution report and shipment. Week 4: Lumos incoming inspection (integrating sphere verification). Week 5: Headlamp module assembly and photometry testing. Week 6: If headlamp photometry issues traced to LED bins, dispute begins. Week 7-8: Joint analysis of LED-to-headlamp correlation data. Week 8: Payment release. Total: 5-8 weeks.

---

### S027

**OEM:** Titanforge Chassis Group (OEM-13)
**Factory:** Chennai Precision Forgings Ltd. (Factory 13)
**Product/Service:** Forged aluminum suspension knuckles (A356-T6) for a pickup truck program
**Development Stage:** DVT
**Service Order Value:** $155,000
**Test Scenario Reference:** Scenario 29 -- Brinell Hardness Testing (adapted for aluminum forging hardness)

**Key Acceptance Criteria:**
1. Hardness HB 90-110 (T6 condition) for 100% of knuckles
2. CMM dimensional inspection within GD&T per ASME Y14.5 on critical bore diameters
3. X-ray porosity within ASTM E155 reference radiograph Level 2
4. Tensile strength >= 240 MPa (A356-T6)
5. Elongation >= 5%

**Expected Outcome:** 93% first-pass yield (DVT stage; new forging die and heat treatment recipe)
**Dispute Likelihood:** Medium -- X-ray inspection images for knuckle porosity are evaluated by human inspectors at Chennai using ASTM E155 reference radiographs. Different inspectors at different shifts have different severity interpretations, leading to inconsistent outgoing quality. Titanforge's incoming X-ray may disagree.
**Settlement Timeline:** Week 1-4: DVT lot of 200 knuckles forged, heat-treated, machined. Week 5: X-ray, hardness, CMM, and tensile testing. Week 6: Data package and shipment. Week 7: Titanforge incoming inspection. Week 8-9: If X-ray porosity disagreement, re-inspection under agreed protocol. Week 10: Payment release. Total: 7-10 weeks.

---

### S028

**OEM:** Titanforge Chassis Group (OEM-13)
**Factory:** Stuttgart Prazisionsteile GmbH (Factory 12)
**Product/Service:** Precision-machined steering rack housing (aluminum die-cast blank, 5-axis CNC machined seal surfaces)
**Development Stage:** EVT
**Service Order Value:** $48,000
**Test Scenario Reference:** Scenario 14 -- Engine Block Dimensional Inspection (adapted for steering rack housing)

**Key Acceptance Criteria:**
1. Seal bore diameter within +/- 0.008 mm
2. Surface finish Ra <= 0.8 um on seal surfaces
3. Housing bore coaxiality <= 0.020 mm over full length
4. Pressure test: zero leakage at 120 bar for 30 seconds
5. All GD&T features within PPAP Level 3 tolerances

**Expected Outcome:** 91% first-pass yield (EVT stage; first articles from new fixture and program)
**Dispute Likelihood:** Low -- Stuttgart's metrology lab provides high-confidence dimensional data. EVT-stage expectations accommodate learning.
**Settlement Timeline:** Week 1-4: EVT lot of 20 housings machined. Week 5: CMM inspection and pressure testing. Week 6: Data delivery with full ISIR. Week 7: Titanforge engineering review. Week 8: Payment release (milestone-based). Total: 6-8 weeks.

---

## AEROSPACE / DEFENSE SCENARIOS (S029 -- S036)

---

### S029

**OEM:** Vanguard Propulsion Technologies (OEM-14)
**Factory:** Munich Aerospace Components GmbH (Factory 14)
**Product/Service:** Single-crystal nickel superalloy HPT Stage 1 turbine blades (CMSX-4, investment cast)
**Development Stage:** PVT
**Service Order Value:** $1,400,000
**Test Scenario Reference:** Scenario 39 -- Turbine Blade Dimensional CMM Inspection

**Key Acceptance Criteria:**
1. Airfoil profile tolerance +/- 0.075 mm per 5-axis CMM scan
2. Root form (fir-tree) width +/- 0.025 mm
3. Cooling hole true position <= 0.15 mm
4. Wall thickness >= 0.75 mm (min) at all cross-sections
5. FPI (fluorescent penetrant inspection) per ASTM E1417: zero rejectable indications

**Expected Outcome:** 88% first-pass yield (single-crystal turbine blades have inherently lower yields due to casting complexity)
**Dispute Likelihood:** High -- AS9102 FAI reports are 50-200 pages per blade variant. The volume of dimensional data (500,000+ CMM scan points per blade) combined with borderline airfoil profile readings creates frequent interpretation disputes. Engineering disposition requests for out-of-tolerance features are common and require negotiation. At $1.4M per order and 88% yield, the 12% rejected blades represent $168K in contested value, making dispute resolution financially significant for both parties.
**Settlement Timeline:** Week 1-8: Casting production (long lead time for single-crystal). Week 9-10: Machining, CMM inspection, and NDT. Week 11: AS9102 FAI package delivery. Week 12-14: Vanguard quality engineering review (FAI review is labor-intensive). Week 15: Disposition of non-conforming blades. Week 16: Payment release for conforming blades; separate disposition pathway for borderline units. Total: 12-16 weeks.

---

### S030

**OEM:** Vanguard Propulsion Technologies (OEM-14)
**Factory:** Munich Aerospace Components GmbH (Factory 14)
**Product/Service:** Thermal barrier coating (YSZ/NiCrAlY TBC system) application on turbine nozzle guide vanes
**Development Stage:** Sustaining
**Service Order Value:** $380,000
**Test Scenario Reference:** Scenario 43 -- Thermal Barrier Coating Thickness Measurement

**Key Acceptance Criteria:**
1. YSZ topcoat thickness 300-500 um
2. NiCrAlY bond coat thickness 75-150 um
3. Topcoat porosity 12-18% (metallographic cross-section on witness coupon)
4. Adhesion strength >= 20 MPa per ASTM C633 (destructive test on coupon)
5. Surface roughness Ra 8-15 um on topcoat

**Expected Outcome:** 95% first-pass yield (sustaining product; process is mature and well-controlled)
**Dispute Likelihood:** Low -- Munich Aerospace has Nadcap accreditation for coatings and an established quality record with Vanguard. Sustaining volume with stable process.
**Settlement Timeline:** Week 1-3: Coating application on batch of 100 vanes. Week 4: Thickness measurement and coupon testing. Week 5: Data package delivery. Week 6: Vanguard quality acceptance. Week 7-8: Payment release (Net-90 per aerospace terms). Total: 6-8 weeks.

---

### S031 [MULTI-FACTORY]

**OEM:** Celestial Aerostructures (OEM-15)
**Factory:** Ho Chi Minh Precision Machining JSC (Factory 17)
**Product/Service:** Titanium machined fittings (Ti-6Al-4V, 5-axis CNC) for wing-to-fuselage joint -- this is part of a multi-factory program where Factory 17 machines fittings and a composite panel fabricator (separate) produces CFRP skins
**Development Stage:** DVT
**Service Order Value:** $92,000
**Test Scenario Reference:** Scenario 39 -- Turbine Blade Dimensional CMM Inspection (adapted for titanium fitting CMM per AS9102)

**Key Acceptance Criteria:**
1. All GD&T features within AS9102 FAI dimensional tolerances
2. Surface finish Ra <= 3.2 um on all machined surfaces
3. Dye penetrant inspection (DPI) per ASTM E1417: zero rejectable indications
4. Material verification: Ti-6Al-4V per ASTM F136 (chemistry and mechanical properties per MTC)
5. Coordinate system aligned per Celestial's master datum scheme (not machine coordinates)

**Expected Outcome:** 92% first-pass yield (DVT stage; new 5-axis program at Ho Chi Minh)
**Dispute Likelihood:** Medium -- Ho Chi Minh recently achieved AS9100D certification and is still developing robust quality processes. CMM data has historically been provided in machine coordinates rather than part coordinates, requiring Celestial to manually transform reports. The 2-3% transcription error rate from paper-based travelers adds risk.
**Settlement Timeline:** Week 1-4: DVT lot of 30 fittings machined. Week 5: CMM inspection and DPI. Week 6: AS9102 FAI package delivery. Week 7-8: Celestial quality review. Week 9: Coordinate system reconciliation if needed. Week 10: Payment release. Total: 8-10 weeks.

---

### S032

**OEM:** Celestial Aerostructures (OEM-15)
**Factory:** Ho Chi Minh Precision Machining JSC (Factory 17)
**Product/Service:** Aluminum 7075-T6 machined brackets (structural, for empennage assembly)
**Development Stage:** MP
**Service Order Value:** $58,000
**Test Scenario Reference:** Scenario 41 -- Aerospace Fastener Tensile & Shear Testing (adapted for bracket dimensional + material verification)

**Key Acceptance Criteria:**
1. All critical dimensions within AS9102 FAI tolerances
2. Material: 7075-T6 per AMS 4078, verified by MTC
3. Hardness: HRB 85-92 (equivalent to 7075-T6 condition)
4. Surface finish Ra <= 3.2 um
5. Anodize (Type III hard anodize) thickness 25-75 um per MIL-A-8625F

**Expected Outcome:** 96% first-pass yield (established MP product)
**Dispute Likelihood:** Low -- Simple machined brackets with well-defined acceptance criteria. Ho Chi Minh's process is stable for this product family.
**Settlement Timeline:** Week 1-2: MP lot of 200 brackets machined. Week 3: Inspection and anodize. Week 4: Shipment with CoC and CMM data. Week 5: Celestial incoming inspection. Week 6: Payment release. Total: 5-6 weeks.

---

### S033

**OEM:** Sentinel Defense Electronics (OEM-16)
**Factory:** Hua Tai Precision Connector Co., Ltd. (Factory 07)
**Product/Service:** MIL-DTL-38999 Series III circular connectors (size 11, 22D contacts, gold-plated) for avionics program
**Development Stage:** PVT
**Service Order Value:** $245,000
**Test Scenario Reference:** Scenario 8 -- Connector Contact Resistance Testing

**Key Acceptance Criteria:**
1. Contact resistance (size 22D) <= 14.6 mohm for 100% of contacts, 100% tested
2. Millivolt drop (size 22D, 3A test current) <= 85 mV for 100% of contacts
3. Shell-to-ground resistance <= 10 mohm
4. Insulation resistance >= 5000 Mohm at 500V DC
5. Cpk >= 2.00 for contact resistance (mission-critical reliability)

**Expected Outcome:** 98% connector-level pass rate (PVT; process is well-characterized on QPL-listed product)
**Dispute Likelihood:** Medium -- ITAR compliance adds complexity to data sharing; test data cannot be stored on servers outside the US. Sentinel requires 100% contact resistance data but Hua Tai's different defense prime customers want different formats (some want millivolt drop, others want milliohm resistance). The format conversion introduces opportunities for transcription errors.
**Settlement Timeline:** Week 1-3: PVT lot of 1,000 connectors manufactured and 100% tested. Week 4: Encrypted test data package delivery via ITAR-compliant channel. Week 5: Sentinel incoming inspection (10% sample). Week 6-7: Format reconciliation if data discrepancies found. Week 8: Payment release. Total: 6-8 weeks.

---

### S034

**OEM:** Sentinel Defense Electronics (OEM-16)
**Factory:** Suzhou Weida Electronic Assembly Co., Ltd. (Factory 02)
**Product/Service:** Conformal-coated PCB assemblies (IPC-A-610 Class 3, MIL-I-46058 coating) for military communication system
**Development Stage:** DVT
**Service Order Value:** $310,000
**Test Scenario Reference:** Scenario 12 -- PCB In-Circuit Test (ICT)

**Key Acceptance Criteria:**
1. All components within +/- 5% resistance and +/- 10% capacitance of nominal
2. Zero shorts, opens, or mis-oriented active devices
3. Conformal coating coverage verified by UV inspection per MIL-I-46058
4. ICT first-pass yield >= 99.0%
5. Functional test pass rate >= 97% (DVT stage; firmware maturation expected)

**Expected Outcome:** 97% ICT pass rate; 95% functional test pass rate
**Dispute Likelihood:** Low -- Weida has IPC-A-610 Class 3 trained workforce and established conformal coating processes. DVT-stage functional test failures are typically firmware issues, not assembly quality problems.
**Settlement Timeline:** Week 1-2: DVT lot of 100 boards assembled and coated. Week 3: ICT and functional test. Week 4: Data delivery (ITAR-controlled format). Week 5: Sentinel engineering review. Week 6: Payment release (Net-30 per US government flow-down). Total: 5-6 weeks.

---

### S035

**OEM:** Altus Space Systems (OEM-17)
**Factory:** Hua Tai Precision Connector Co., Ltd. (Factory 07)
**Product/Service:** Space-grade MIL-DTL-38999 connectors (hi-rel screening, radiation-tolerance verified) for satellite communication subsystem
**Development Stage:** EVT
**Service Order Value:** $55,000
**Test Scenario Reference:** Scenario 8 -- Connector Contact Resistance Testing (with additional space-environment screening)

**Key Acceptance Criteria:**
1. Contact resistance <= 14.6 mohm at 25 deg C and after thermal cycling (-65 to +150 deg C, 100 cycles)
2. He leak rate < 5 x 10^-8 atm*cc/s (hermetic seal verification)
3. Millivolt drop stability: post-conditioning mV drop <= 95 mV (< 12% increase over initial)
4. Vibration survival: 22 Grms random per GSFC-STD-7000
5. Outgassing: TML <= 1.0%, CQRL <= 0.10% per ASTM E595

**Expected Outcome:** 90% connector-level pass rate (EVT stage; space screening has inherently higher fallout)
**Dispute Likelihood:** Low -- Altus accepts EVT-stage attrition as part of space hardware qualification. Small lot size (50 units) and cost-plus contract structure reduce financial dispute motivation.
**Settlement Timeline:** Week 1-4: EVT lot of 50 connectors manufactured and initial tested. Week 5-8: Environmental screening (thermal cycling, vibration, outgassing -- 4 weeks). Week 9: Post-screening re-test data. Week 10-11: Altus engineering review. Week 12: Payment release (milestone-based). Total: 10-12 weeks.

---

### S036

**OEM:** Altus Space Systems (OEM-17)
**Factory:** Nagoya Seimitsu Kogaku K.K. (Factory 16)
**Product/Service:** Precision optical mirror substrate and AR coatings for satellite star-tracker telescope
**Development Stage:** EVT
**Service Order Value:** $125,000
**Test Scenario Reference:** Scenario 39 -- Turbine Blade Dimensional CMM Inspection (adapted for optical surface figure verification)

**Key Acceptance Criteria:**
1. Surface figure <= lambda/20 PV at 632.8 nm (tighter than standard optics)
2. Surface roughness <= 1.0 nm RMS (Angstrom-level finish)
3. AR coating reflectance <= 0.25% per surface at 550-850 nm
4. Centering error <= 0.5 arcminute
5. Wavefront error (transmitted) <= lambda/10 RMS at 632.8 nm

**Expected Outcome:** 85% yield (EVT stage; lambda/20 surface figure is extremely demanding)
**Dispute Likelihood:** Medium -- Interferometric measurements are sensitive to environmental conditions (vibration, air currents, temperature). Cross-site measurement correlation between Nagoya and Altus's optics lab in El Segundo may show discrepancies that require root-cause investigation (real defect vs. measurement artifact).
**Settlement Timeline:** Week 1-6: EVT lot of 10 mirrors manufactured (precision optics have long lead times). Week 7: Interferometric testing at Nagoya. Week 8: Shipment with interferogram data. Week 9-10: Altus incoming optical verification. Week 11: Measurement correlation if discrepancies. Week 12: Payment release. Total: 10-12 weeks.

---

## FOOD / PHARMA / MEDICAL SCENARIOS (S037 -- S042)

---

### S037

**OEM:** Pinnacle Pharmaceuticals (OEM-18)
**Factory:** Hai Phong PharmaChem Co., Ltd. (Factory 19)
**Product/Service:** Contract manufacturing of Metformin HCl 500 mg tablets (immediate-release, generic formulation)
**Development Stage:** PVT
**Service Order Value:** $290,000
**Test Scenario Reference:** Scenario 36 -- Drug Dissolution Testing (USP)

**Key Acceptance Criteria:**
1. Dissolution (USP <711>, paddle, 50 rpm): all 6 units >= 85% at 30 min (S1 pass)
2. Content uniformity per USP <905>: AV <= 15.0 (L1 acceptance)
3. Assay (HPLC): 95.0-105.0% of label claim
4. Related substances: individual impurity <= 0.10%, total <= 0.50%
5. Tablet weight uniformity: +/- 5% of target (551-609 mg for 580 mg tablet)

**Expected Outcome:** 96% batch pass rate at PVT stage
**Dispute Likelihood:** High -- Dissolution testing disputes are common in contract pharma manufacturing. Hai Phong's factory reports S1 pass; Pinnacle's QC lab re-tests and gets S2 results due to different paddle height calibration (the USP specifies 25 +/- 2 mm from vessel bottom, but a 2mm difference significantly affects dissolution of BCS Class III drugs like Metformin). This has caused batch release delays on previous programs.
**Settlement Timeline:** Week 1-3: PVT batch manufacturing (granulation, compression, coating). Week 4: In-process testing (weight, hardness, friability). Week 5: Dissolution, assay, and related substances testing at Hai Phong's lab. Week 6: CoA generated and batch release package prepared. Week 7: Pinnacle QC re-tests dissolution. Week 8: If S1 discrepancy, investigation into paddle height calibration and media preparation. Week 9-10: Joint laboratory investigation. Week 10: Batch disposition and payment. Total: 6-10 weeks.

---

### S038

**OEM:** Pinnacle Pharmaceuticals (OEM-18)
**Factory:** Hai Phong PharmaChem Co., Ltd. (Factory 19)
**Product/Service:** Stability testing services (ICH conditions: 25C/60%RH and 40C/75%RH) for Pinnacle's new tablet formulation
**Development Stage:** Sustaining
**Service Order Value:** $22,000
**Test Scenario Reference:** Scenario 37 -- Pharmaceutical Tablet Hardness Testing (as part of stability time-point testing)

**Key Acceptance Criteria:**
1. Assay remains within 95.0-105.0% through 24-month (25C/60%RH) stability
2. Related substances: total impurities <= 0.50% at each time point
3. Dissolution: S1 pass at each stability time point (3, 6, 12, 18, 24 months)
4. Physical attributes: hardness, friability, disintegration remain within specification
5. No OOS (out-of-specification) results at any time point without documented investigation

**Expected Outcome:** 99% time-point pass rate (stability of marketed formulation is expected to be robust)
**Dispute Likelihood:** Low -- Stability testing is a straightforward analytical service with well-defined USP methods. ICH conditions are standardized and chamber-qualified.
**Settlement Timeline:** Ongoing: Stability samples tested at 3-month intervals. Payment per time point upon data delivery. Each time point: test + report within 2 weeks of pull date. Total program: 24 months, with quarterly invoicing.

---

### S039

**OEM:** VitaSource Nutrition (OEM-19)
**Factory:** Hanoi Nutri-Foods Joint Stock Company (Factory 18)
**Product/Service:** Contract manufacturing of orange-flavored protein drink (whey protein, UHT processed, aseptic Tetra Pak filling)
**Development Stage:** PVT
**Service Order Value:** $175,000
**Test Scenario Reference:** Scenario 38 -- Beverage pH and Brix Testing

**Key Acceptance Criteria:**
1. Brix (total soluble solids) within 11.0-12.5 deg Brix
2. pH within 3.8-4.5 (protein drink target range)
3. Protein content >= 20g per 330 mL serving (verified by Kjeldahl method)
4. Microbiological: Total aerobic count <= 100 CFU/mL (commercial sterility for UHT)
5. No coliforms or E. coli detected per lot

**Expected Outcome:** 97% batch pass rate (PVT stage; UHT process is well-established at Hanoi)
**Dispute Likelihood:** Medium -- VitaSource's incoming QC lab frequently gets different protein assay results due to differences in Kjeldahl method execution (digestion time, catalyst) between Hanoi's lab and VitaSource's European testing lab. There is no agreed lab-to-lab correlation for this method.
**Settlement Timeline:** Week 1-2: PVT production run of 50,000 units. Week 3: Microbiological and chemical testing at Hanoi lab. Week 4: CoA generated and shipment. Week 5: VitaSource incoming QC (re-test protein content). Week 6: If protein assay discrepancy > 2%, investigation and third-party lab arbitration. Week 7: Payment release. Total: 5-7 weeks.

---

### S040

**OEM:** VitaSource Nutrition (OEM-19)
**Factory:** Hanoi Nutri-Foods Joint Stock Company (Factory 18)
**Product/Service:** Bottled spring water (500 mL PET, private label for VitaSource's hydration product line)
**Development Stage:** MP
**Service Order Value:** $45,000
**Test Scenario Reference:** Scenario 31 -- Bottled Water Microbiological Testing

**Key Acceptance Criteria:**
1. Heterotrophic Plate Count (HPC) <= 500 CFU/mL
2. Total Coliform <= 0 CFU/100 mL (zero detection)
3. E. coli absent in 100 mL
4. pH within 6.5-8.5
5. Turbidity <= 1.0 NTU

**Expected Outcome:** 99% batch pass rate (routine MP production)
**Dispute Likelihood:** Low -- Bottled water testing criteria are binary (coliforms: detected/not detected) with no ambiguity. FSSC 22000-certified facility.
**Settlement Timeline:** Week 1: Production run. Week 2: Microbiological testing (48-hour incubation period). Week 3: CoA and shipment. Week 4: Payment release (Net-30). Total: 3-4 weeks.

---

### S041

**OEM:** Meridius Medical Devices (OEM-20)
**Factory:** Hsinchu BioMed Precision Co., Ltd. (Factory 15)
**Product/Service:** Titanium femoral stem components (Ti-6Al-4V ELI per ASTM F136) for hip replacement implant -- precision 5-axis CNC machined
**Development Stage:** PVT
**Service Order Value:** $480,000
**Test Scenario Reference:** Scenario 49 -- Packaging Seal Integrity Testing (adapted for medical device DHR + dimensional inspection)

**Key Acceptance Criteria:**
1. All critical dimensions per GD&T within +/- 0.025 mm (bearing surfaces, taper geometry)
2. Surface finish Ra <= 0.4 um on articulating surfaces (mirror polish)
3. Material: Ti-6Al-4V ELI per ASTM F136 (Al 5.50-6.75%, V 3.50-4.50%, Fe <= 0.25%, O <= 0.13%)
4. Cpk >= 1.67 for implant critical dimensions
5. 100% visual inspection: zero scratches, tool marks, or burrs on patient-contacting surfaces

**Expected Outcome:** 94% first-pass yield (PVT stage; implant surface finish requirements are stringent)
**Dispute Likelihood:** Medium -- Titanium bar stock MTCs (mill test certificates) are often scanned PDFs that must be manually verified. Hsinchu BioMed provides per-component DHR packages, but the surface finish requirement (Ra <= 0.4 um) on taper surfaces is borderline for the current polishing process. Meridius's incoming inspection using a different profilometer may disagree on borderline Ra readings.
**Settlement Timeline:** Week 1-4: PVT lot of 500 femoral stems machined and polished. Week 5: CMM inspection, surface profilometry, and material verification. Week 6: DHR package delivery. Week 7-8: Meridius quality review and incoming inspection. Week 9: Surface finish correlation if discrepancies arise. Week 10: Payment release. Total: 8-10 weeks.

---

### S042

**OEM:** Meridius Medical Devices (OEM-20)
**Factory:** Hsinchu BioMed Precision Co., Ltd. (Factory 15)
**Product/Service:** CoCrMo (cobalt-chrome) femoral knee components -- investment cast blanks machined to final dimensions
**Development Stage:** Sustaining
**Service Order Value:** $620,000
**Test Scenario Reference:** Scenario 14 -- Engine Block Dimensional Inspection (adapted for implant CMM per FDA 21 CFR 820)

**Key Acceptance Criteria:**
1. Articulating surface profile within +/- 0.050 mm of CAD nominal
2. Surface finish Ra <= 0.02 um on bearing surfaces (high-polish per ASTM F799)
3. Material: CoCrMo per ASTM F75 with full compositional verification
4. Porosity: zero ASTM E192 Level 3+ indications in load-bearing zones
5. Biocompatibility lot release testing per ISO 10993-5 (cytotoxicity) on annual basis

**Expected Outcome:** 96% first-pass yield (sustaining product with optimized process)
**Dispute Likelihood:** Low -- Established sustaining production with mature process and long supplier relationship. DHR packages are well-defined.
**Settlement Timeline:** Week 1-3: Sustaining lot of 300 components machined and polished. Week 4: Inspection and DHR assembly. Week 5: Shipment. Week 6-7: Meridius incoming inspection. Week 8: Payment release (Net-60). Total: 6-8 weeks.

---

## STEEL / METALS / ENERGY SCENARIOS (S043 -- S048)

---

### S043 [MULTI-FACTORY]

**OEM:** Ironvale Steel & Alloys (OEM-21) -- also sourcing for Duraform Building Products (OEM-25) as end-user
**Factory:** Shanghai Hongda Steel Co., Ltd. (Factory 21)
**Product/Service:** ASTM A516 Grade 70 pressure vessel steel plate (25 mm thick, normalized) -- Ironvale sources plates from Hongda and distributes to pressure vessel fabricators including Duraform's precast concrete mold suppliers
**Development Stage:** MP
**Service Order Value:** $890,000
**Test Scenario Reference:** Scenario 23 -- Steel Plate Chemical Composition (Mill Test Certificate) + Scenario 30 -- Steel Plate Ultrasonic Examination

**Key Acceptance Criteria:**
1. Chemical composition within ASTM A516 Grade 70 limits (C <= 0.28%, Mn 0.85-1.20%, P <= 0.035%, S <= 0.035%)
2. Tensile: YS >= 260 MPa, UTS 485-620 MPa, Elongation >= 17% (200mm GL)
3. Charpy impact >= 27 J average at -30 deg C (3-specimen set), no individual below 20 J
4. UT per ASTM A435: no lamination indication > 80 mm diameter
5. MTC per EN 10204 Type 3.1 for every heat and plate

**Expected Outcome:** 98% plate pass rate (Hongda is a major steel mill with mature process control)
**Dispute Likelihood:** High -- MTC authenticity is a known industry problem. Forged MTCs have caused costly incidents in Ironvale's history. Additionally, Charpy impact test temperature mismatches (mill tests at -20C vs. Ironvale's project requirement of -30C) require supplementary testing that delays acceptance by 2-3 weeks. Hongda receives 2,000+ MTCs per month and has experienced a 2-3% error rate in manual MTC data entry.
**Settlement Timeline:** Week 1-3: Steel plate production, rolling, heat treatment. Week 4: Chemistry, tensile, Charpy, and UT testing at Hongda. Week 5: MTC generation and third-party verification (if classification society witness required). Week 6: Shipment. Week 7: Ironvale incoming PMI and supplementary Charpy testing at -30C if mill tested at different temperature. Week 8-10: If Charpy re-test required, 2-3 week delay. Week 10: Payment release. Total: 6-10 weeks.

---

### S044

**OEM:** Ironvale Steel & Alloys (OEM-21)
**Factory:** Shanghai Hongda Steel Co., Ltd. (Factory 21)
**Product/Service:** ASTM A572 Grade 50 HSLA structural steel plate (12 mm thick) for bridge construction project requiring cold-weather Charpy toughness
**Development Stage:** MP
**Service Order Value:** $540,000
**Test Scenario Reference:** Scenario 25 -- Charpy V-Notch Impact Testing

**Key Acceptance Criteria:**
1. Chemical composition within ASTM A572 Grade 50 limits
2. Yield strength >= 345 MPa (50 ksi)
3. Tensile strength >= 450 MPa (65 ksi)
4. Charpy V-notch impact >= 27 J average at -46 deg C (supplementary requirement for arctic bridge application)
5. UT per ASTM A435: clean plate (no laminations)

**Expected Outcome:** 95% pass rate (the -46C Charpy requirement is more stringent than standard; some heats may require re-rolling or heat treatment adjustment)
**Dispute Likelihood:** High -- The -46C Charpy temperature is unusual and requires Hongda to perform supplementary testing beyond their standard -20C program. Ironvale must independently verify 10% of incoming Charpy results by sending samples to third-party labs, adding time and cost. Past disputes have occurred when Ironvale's third-party lab gets lower Charpy values than Hongda's results. For arctic bridge applications, Charpy failure has structural safety implications, escalating disputes to engineering and legal review rather than simple commercial negotiation.
**Settlement Timeline:** Week 1-3: Production and testing. Week 4: MTC with -46C Charpy data. Week 5: Shipment. Week 6: Ironvale incoming verification (PMI + 10% Charpy re-test via third-party lab). Week 7-8: Third-party lab results. Week 9: Reconciliation if discrepancies. Week 10: Payment release. Total: 7-10 weeks.

---

### S045

**OEM:** PetroForge Pipeline Solutions (OEM-22)
**Factory:** Detroit Alloy Processing Inc. (Factory 23)
**Product/Service:** Heat treatment services (quench & temper) for ASTM A182 F22 (2.25Cr-1Mo) valve body forgings destined for sour gas service
**Development Stage:** MP
**Service Order Value:** $68,000
**Test Scenario Reference:** Scenario 26 -- Rockwell Hardness Testing + Scenario 29 -- Brinell Hardness Testing

**Key Acceptance Criteria:**
1. Hardness <= 22 HRC (per NACE MR0175 for sour service, equivalent to <= 235 HBW)
2. All readings <= 22 HRC (zero tolerance for hardness exceedance in sour service)
3. Furnace temperature within spec: austenitize at 900 +/- 15C, temper at 690 +/- 10C
4. Complete furnace chart (time-temperature recording) provided for every load
5. Charpy impact >= 54 J average at -29C after heat treatment

**Expected Outcome:** 97% pass rate (Detroit Alloy has Nadcap and CQI-9 certification for heat treatment)
**Dispute Likelihood:** Medium -- Hardness is the single most critical parameter for sour service. A single reading > 22 HRC causes immediate rejection. Detroit Alloy's furnace charts are often provided as low-resolution JPEGs of paper strip charts, making it difficult to verify exact temperature profiles. PetroForge has disputed hardness results when incoming Brinell readings were 1-2 HBW higher than Detroit's Rockwell-converted values (ASTM E140 conversion tables have inherent imprecision at this hardness range).
**Settlement Timeline:** Week 1: Forgings received at Detroit Alloy. Week 2-3: Heat treatment (quench & temper cycle). Week 4: Hardness testing and furnace chart delivery. Week 5: PetroForge incoming hardness verification. Week 6: If any hardness exceedance or conversion discrepancy, re-test and investigation. Week 7: Payment release. Total: 5-7 weeks.

---

### S046

**OEM:** PetroForge Pipeline Solutions (OEM-22)
**Factory:** Chennai Precision Forgings Ltd. (Factory 13)
**Product/Service:** SA-105 carbon steel flange forgings (ASME B16.5, Class 300) for pipeline project
**Development Stage:** MP
**Service Order Value:** $210,000
**Test Scenario Reference:** Scenario 29 -- Brinell Hardness Testing

**Key Acceptance Criteria:**
1. Hardness <= 187 HBW (normalized condition per ASTM A105)
2. Chemical composition within ASTM A105 limits (C <= 0.35%, Mn 0.60-1.05%)
3. Tensile: YS >= 250 MPa, UTS >= 485 MPa, Elongation >= 22%
4. Dimensional inspection per ASME B16.5 for Class 300 flanges
5. MTC per EN 10204 Type 3.1 for every heat

**Expected Outcome:** 97% pass rate
**Dispute Likelihood:** Low -- SA-105 flanges are a standard product for Chennai Precision Forgings with well-established process and specifications. MTC format is per EN 10204 Type 3.1 standard.
**Settlement Timeline:** Week 1-3: Forging production and heat treatment. Week 4: Testing and MTC generation. Week 5: Third-party inspection at Chennai (Bureau Veritas or DNV per PetroForge's contract). Week 6: Shipment after inspection release. Week 7: Payment release (minus 10% documentation retention). Week 8-10: Documentation package review. Week 10: 10% retention release upon documentation acceptance. Total: 7-10 weeks.

---

### S047 [MULTI-FACTORY]

**OEM:** SolarEdge Power Systems (OEM-23)
**Factory:** San Antonio Solar Components LLC (Factory 25) -- junction boxes
**Related Factory:** Detroit Alloy Processing Inc. (Factory 23) -- connector contact heat treatment (sub-tier to Factory 25)
**Product/Service:** IP68-rated junction boxes (3-diode configuration) with MC4 connectors for SolarEdge's 400W residential module -- this program involves Factory 25 for junction box assembly and Factory 23 for heat treatment of connector contact pins
**Development Stage:** PVT
**Service Order Value:** $195,000
**Test Scenario Reference:** Scenario 45 -- Solar Panel IV Curve Testing (adapted for junction box electrical + environmental testing)

**Key Acceptance Criteria:**
1. Hipot: no breakdown at 3000V DC for 60 seconds on 100% of junction boxes
2. Insulation resistance >= 500 Mohm at 1000V DC
3. Bypass diode forward voltage (Vf) <= 0.70V at rated current for all 3 diodes
4. Diode reverse leakage current <= 5 uA at rated reverse voltage
5. IP68 seal integrity: no ingress after 1.5m submersion for 30 minutes (sampling basis)

**Expected Outcome:** 98% pass rate (PVT stage; San Antonio's process is well-established)
**Dispute Likelihood:** Low -- Straightforward pass/fail electrical testing with UL 6703/IEC 62790 compliance. San Antonio's IRA domestic content documentation is an additional value-add for SolarEdge.
**Settlement Timeline:** Week 1-2: PVT lot of 5,000 junction boxes assembled and tested. Week 3: Test data and shipment. Week 4: SolarEdge incoming inspection. Week 5: Payment release (Net-45). Total: 4-5 weeks.

---

### S048

**OEM:** SolarEdge Power Systems (OEM-23)
**Factory:** Dongguan Yongxin Metal Products Co., Ltd. (Factory 22) -- with San Antonio Solar Components LLC (Factory 25) providing connectors
**Product/Service:** Anodized aluminum module frames (6063-T5, corner-key assembled) for SolarEdge's 400W residential panel
**Development Stage:** MP
**Service Order Value:** $260,000
**Test Scenario Reference:** Scenario 45 -- Solar Panel IV Curve Testing (adapted for module frame mechanical + corrosion testing)

**Key Acceptance Criteria:**
1. Profile cross-section within +/- 0.15 mm of die drawing
2. Frame corner-key pull-out force >= 1,500 N per corner
3. Anodize thickness 12-20 um per ISO 7599 (clear anodize for solar application)
4. Salt spray resistance >= 1,000 hours (ASTM B117) without white corrosion on anodized surface
5. Frame dimensional tolerance (length/width) within +/- 1.0 mm

**Expected Outcome:** 97% first-pass yield
**Dispute Likelihood:** Low -- Standard MP product. Aluminum frames are a commodity component with well-defined mechanical specifications.
**Settlement Timeline:** Week 1-2: MP lot of 10,000 frames extruded and assembled. Week 3: Dimensional inspection and sampling for corrosion test. Week 4: Shipment (corrosion test results follow later). Week 5: Payment (90% on shipment). Week 6-12: Salt spray test (1,000 hours). Week 12: 10% retention released upon salt spray pass. Total: 4-12 weeks (long tail for corrosion testing).

---

## CONSUMER GOODS / OTHER SCENARIOS (S049 -- S050)

---

### S049

**OEM:** Artisan Apparel Group (OEM-24)
**Factory:** Suzhou GreenTex Knitting Co., Ltd. (Factory 24)
**Product/Service:** Performance woven fabric (polyester/nylon blend, 240 g/m2, DWR-treated) for Artisan's Fall 2027 outerwear collection
**Development Stage:** DVT
**Service Order Value:** $135,000
**Test Scenario Reference:** Scenario 46 -- Textile Tensile Strength Testing (Grab Method)

**Key Acceptance Criteria:**
1. Breaking force (warp) >= 450 N per ASTM D5034
2. Breaking force (weft) >= 350 N per ASTM D5034
3. DWR spray rating >= 90 after 5 washes per ISO 4920
4. Colorfastness to washing >= Grade 4 per ISO 105-C06
5. Delta E (color difference from approved lab dip) <= 1.0 under D65 illuminant

**Expected Outcome:** 94% lot pass rate (DVT stage; DWR treatment consistency on new PFAS-free chemistry is being validated)
**Dispute Likelihood:** High -- Color consistency is Artisan's #1 quality complaint. GreenTex measures Delta E under D65 illuminant; Artisan's merchandising team evaluates under TL84 (retail store lighting). A fabric lot that passes at Delta E <= 1.0 under D65 may show Delta E = 1.8 under TL84, causing rejection. This illuminant mismatch has led to 8% fabric rejection on previous seasons. Additionally, the new C0 (PFAS-free) DWR chemistry has less durable water repellency, and spray rating after 5 washes is a DVT validation concern.
**Settlement Timeline:** Week 1-3: Fabric weaving, dyeing, and DWR treatment. Week 4: Tensile, DWR, and color testing at GreenTex lab. Week 5: Shipment with test report. Week 6: Artisan incoming QC (color evaluation under TL84). Week 7: If Delta E disagreement, submit to third-party lab (SGS/Intertek) for arbitration testing. Week 8-9: Third-party results and disposition. Week 9-10: Payment release. Total: 6-10 weeks.

---

### S050

**OEM:** Artisan Apparel Group (OEM-24)
**Factory:** Suzhou GreenTex Knitting Co., Ltd. (Factory 24)
**Product/Service:** Knit interlock base layer fabric (merino wool/polyester blend, 180 g/m2) for Artisan's spring performance line
**Development Stage:** MP
**Service Order Value:** $88,000
**Test Scenario Reference:** Scenario 46 -- Textile Tensile Strength Testing (adapted for knit fabric)

**Key Acceptance Criteria:**
1. Pilling resistance >= Grade 4 after 5,000 cycles per ISO 12945-2
2. Dimensional stability (shrinkage) <= 3% in both directions after 3 washes per ISO 6330
3. Colorfastness to perspiration >= Grade 4 per ISO 105-E04
4. Breaking force (warp) >= 300 N per ISO 13934-1
5. Delta E <= 1.0 under D65 illuminant (against approved standard)

**Expected Outcome:** 96% lot pass rate (MP product with established process)
**Dispute Likelihood:** Medium -- Merino wool content variability between yarn lots affects pilling performance. Some lots may marginally pass Grade 3-4 at GreenTex but Grade 3 at Artisan's re-test due to different Martindale tester calibration. Pilling grading has a subjective visual component.
**Settlement Timeline:** Week 1-2: Knitting, dyeing, finishing. Week 3: Testing. Week 4: Shipment. Week 5: Artisan incoming QC. Week 6: If pilling grade disagreement, re-test with calibrated reference samples. Week 7: Payment release. Total: 5-7 weeks.

---

## Cross-Reference Matrix

### Multi-Factory Program Summary

| Program | OEM | Factories | Scenarios | Description |
|---|---|---|---|---|
| Novacharge EV Battery Pack | OEM-06 | Factory 04 + Factory 22 | S013 + S014 | Cell supply + battery tray extrusion for same pack program |
| Celestial Wing Structure | OEM-15 | Factory 17 (titanium fittings) + composite panel fabricator (external) | S031 + S032 | Titanium fittings for wing-to-fuselage joint alongside CFRP skins |
| Ironvale/Duraform Steel Supply Chain | OEM-21 + OEM-25 | Factory 21 | S043 | Steel plate sourced by Ironvale for distribution to end-users including Duraform |
| SolarEdge Junction Box Program | OEM-23 | Factory 25 + Factory 23 | S047 | Junction box assembly with heat-treated connector contacts |
| SolarEdge Module Frame + Connector | OEM-23 | Factory 22 + Factory 25 | S048 | Aluminum frames from Yongxin with connectors from San Antonio |

### Development Stage Distribution

| Stage | Count | Scenarios |
|---|---|---|
| EVT | 10 | S006, S009, S010, S015, S024, S028, S035, S036, S037 (counted as PVT above -- corrected here), S049 (counted as DVT) |
| DVT | 10 | S002, S008, S013, S014, S021, S027, S031, S034, S049, S044 (counted as MP) |
| PVT | 10 | S001, S004, S011, S017, S019, S022, S029, S033, S041, S047 |
| MP | 15 | S003, S005, S007, S012, S018, S020, S023, S025, S026, S032, S040, S042, S043, S046, S048, S050 |
| Sustaining | 5 | S016, S030, S038, S039 (counted as PVT -- note), S045 |

**Corrected stage assignments per scenario (definitive):**

| Scenario | Stage |
|---|---|
| S001 | PVT |
| S002 | DVT |
| S003 | MP |
| S004 | MP |
| S005 | MP |
| S006 | EVT |
| S007 | MP |
| S008 | DVT |
| S009 | EVT |
| S010 | EVT |
| S011 | PVT |
| S012 | MP |
| S013 | DVT |
| S014 | DVT |
| S015 | EVT |
| S016 | Sustaining |
| S017 | PVT |
| S018 | MP |
| S019 | PVT |
| S020 | MP |
| S021 | DVT |
| S022 | PVT |
| S023 | MP |
| S024 | EVT |
| S025 | MP |
| S026 | MP |
| S027 | DVT |
| S028 | EVT |
| S029 | PVT |
| S030 | Sustaining |
| S031 | DVT |
| S032 | MP |
| S033 | PVT |
| S034 | DVT |
| S035 | EVT |
| S036 | EVT |
| S037 | PVT |
| S038 | Sustaining |
| S039 | PVT |
| S040 | MP |
| S041 | PVT |
| S042 | Sustaining |
| S043 | MP |
| S044 | MP |
| S045 | MP |
| S046 | MP |
| S047 | PVT |
| S048 | MP |
| S049 | DVT |
| S050 | MP |

**Final Stage Counts:** EVT: 8 | DVT: 10 | PVT: 12 | MP: 15 | Sustaining: 5

### Service Order Value Distribution

| Range | Count | Total Value |
|---|---|---|
| Small ($5K-$50K) | 10 | $434,500 |
| Medium ($50K-$500K) | 26 | $7,263,000 |
| Large ($500K-$2M) | 14 | $12,773,000 |
| **Grand Total** | **50** | **$20,470,500** |

### Dispute Likelihood Summary

| Level | Count | Scenarios |
|---|---|---|
| High | 10 | S003, S004, S011, S012, S019, S029, S037, S043, S044, S049 |
| Medium | 17 | S001, S005, S006, S010, S013, S015, S017, S022, S026, S027, S031, S033, S036, S039, S041, S045, S050 |
| Low | 23 | S002, S007, S008, S009, S014, S016, S018, S020, S021, S023, S024, S025, S028, S030, S032, S034, S035, S038, S040, S042, S046, S047, S048 |
