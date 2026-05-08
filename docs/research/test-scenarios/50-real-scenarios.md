# 50 Real Manufacturing Test Scenarios: OEM-Factory Collaboration

> Research compiled from industry standards, published specifications, and regulatory documents.
> Each scenario provides enough detail for a developer to create realistic sample CSVs and acceptance criteria.

---

## ELECTRONICS (12 Scenarios)

---

### Scenario 1: Camera Module MTF/SFR Testing

**Industry & Product:** Consumer Electronics -- Smartphone camera module (13 MP, 1/3.06" sensor)

**OEM Role:** Specifies minimum MTF (Modulation Transfer Function) values at Nyquist/2 and Nyquist/4 spatial frequencies per ISO 12233:2017 using slanted-edge (E-SFR) method with 4:1 contrast chart.

**Factory Role:** Assembles camera modules, aligns lenses, and runs automated SFR measurements on every unit using Imatest or equivalent.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| MTF at Nyquist/2 (center) | ratio (0-1) | >= 0.50 |
| MTF at Nyquist/4 (center) | ratio (0-1) | >= 0.70 |
| MTF at Nyquist/2 (corner, worst) | ratio (0-1) | >= 0.30 |
| MTF at Nyquist/4 (corner, worst) | ratio (0-1) | >= 0.50 |
| Relative illumination (corner/center) | % | >= 40% |
| Optical center offset | pixels | <= 15 |

**Acceptance Criteria:**
- PASS: All six parameters within specification
- FAIL: Any single parameter outside specification
- Ref: ISO 12233:2017, MTF10 ("limiting resolution") based on Rayleigh criterion at 10% SFR

**Production Log Format:**
```
serial_no (string), timestamp (ISO 8601), mtf_nyq2_center (float), mtf_nyq4_center (float), mtf_nyq2_corner_worst (float), mtf_nyq4_corner_worst (float), rel_illumination_pct (float), optical_center_offset_px (float), result (PASS/FAIL)
```
Sample: `CAM-2026-00142, 2026-04-10T08:31:22Z, 0.55, 0.74, 0.33, 0.52, 45.2, 11.3, PASS`

**Source:** [ISO 12233 -- Imatest](https://www.imatest.com/imaging/iso-12233/), [Image Engineering](https://www.image-engineering.de/library/image-quality/factors/1055-resolution)

---

### Scenario 2: PCB Automated Optical Inspection (AOI)

**Industry & Product:** Electronics Manufacturing -- 6-layer FR-4 PCB assembly (smartphone mainboard)

**OEM Role:** Specifies IPC-A-610 Class 2 (dedicated service electronics) acceptance criteria for solder joints and component placement.

**Factory Role:** Runs high-resolution AOI cameras on every board post-reflow to detect solder defects, missing components, and misalignment.

**Test Parameters & Real Numbers (per IPC-A-610 Class 2):**
| Parameter | Unit | Specification |
|---|---|---|
| Component presence | boolean | All BOM components present |
| Component offset (X/Y) | % of pad width | <= 50% overhang |
| Solder bridge detection | boolean | No bridges between pads |
| Insufficient solder (heel fillet) | % of lead height | >= 50% fillet height |
| Tombstone detection | boolean | Not acceptable |
| Polarity verification | boolean | Correct orientation |

**Acceptance Criteria:**
- PASS: Zero defects classified as "Defect" per IPC-A-610 Class 2
- FAIL: Any single "Defect" classification (process indicators are acceptable)
- Ref: IPC-A-610J (2024 revision)

**Production Log Format:**
```
board_id (string), timestamp (ISO 8601), total_components (int), missing_count (int), offset_defect_count (int), bridge_count (int), insuff_solder_count (int), tombstone_count (int), polarity_defect_count (int), total_defects (int), result (PASS/FAIL)
```
Sample: `PCB-MB-00389, 2026-04-10T09:12:44Z, 847, 0, 0, 0, 1, 0, 0, 1, FAIL`

**Source:** [IPC-A-610 Overview](https://aptpcb.com/en/blog/ipc-a-610-acceptance-criteria-overview), [IPC-A-610J ANSI Blog](https://blog.ansi.org/ansi/acceptability-electronic-assemblies-ipc-a-610j-2024/)

---

### Scenario 3: SMT Solder Paste Inspection (SPI)

**Industry & Product:** Electronics Manufacturing -- SPI of 0402/0201 component pads on consumer electronics PCB

**OEM Role:** Specifies solder paste volume, height, and positional offset tolerances per IPC-7527 for each pad geometry.

**Factory Role:** Runs 3D SPI machine (e.g., Koh Young) after stencil printing to measure volume, height, area, and offset of deposited paste on every pad.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Volume (relative to aperture) | % | 60% -- 160% |
| Height (average) | um | 130 -- 180 (for 5-mil stencil) |
| Area (relative to pad) | % | 70% -- 130% |
| X-offset | % of pad length | <= 35% (non-01005); <= 30% (01005) |
| Y-offset | % of pad width | <= 35% (non-01005); <= 30% (01005) |
| Bridging | boolean | Not detected |

**Acceptance Criteria:**
- PASS: All pads within volume 60-160%, height 130-180 um, area 70-130%, offset within limits, no bridging
- FAIL: Any pad with volume < 60% (insufficient) or > 160% (excess), height out of range, bridging detected
- Ref: IPC-7527 (Requirements for Solder Paste Printing)

**Production Log Format:**
```
board_id (string), pad_id (string), timestamp (ISO 8601), volume_pct (float), height_um (float), area_pct (float), x_offset_pct (float), y_offset_pct (float), bridge_flag (bool), result (PASS/FAIL)
```
Sample: `PCB-00421, U3-PAD14, 2026-04-10T07:45:11Z, 92.3, 148.5, 98.1, 5.2, 3.8, false, PASS`

**Source:** [SPI Guide - JT Electronics](https://www.jt-int.com/solder-paste-inspection-spi-complete-guide/), [ALLPCB SPI Guide](https://www.allpcb.com/blog/pcb-assembly/solder-paste-inspection-spi-ensuring-quality-in-pcb-manufacturing.html)

---

### Scenario 4: Display Module Luminance & Color Testing

**Industry & Product:** Consumer Electronics -- 15.6" IPS LCD panel for laptop (targeting VESA DisplayHDR 400)

**OEM Role:** Specifies VESA DisplayHDR 400 performance criteria for peak luminance, black level, color gamut, and bit depth.

**Factory Role:** Measures luminance, uniformity, color gamut, and black level for each display panel using spectroradiometer in darkroom.

**Test Parameters & Real Numbers (VESA DisplayHDR 400 v1.2):**
| Parameter | Unit | Specification |
|---|---|---|
| Peak luminance (8% center patch) | cd/m2 | >= 400 |
| Full-screen sustained luminance | cd/m2 | >= 250 |
| Black level (dual corner box) | cd/m2 | <= 0.40 |
| BT.709 color gamut coverage | % | >= 99% |
| DCI-P3 color gamut coverage | % | >= 90% |
| Bit depth | bits per channel | >= 8+2 dithering |
| Rise time (luminance) | frames | <= 8 |

**Acceptance Criteria:**
- PASS: All parameters meet DisplayHDR 400 tier minimums
- FAIL: Any parameter below threshold
- Ref: VESA DisplayHDR CTS v1.2 (December 2024)

**Production Log Format:**
```
panel_id (string), timestamp (ISO 8601), peak_lum_cdm2 (float), sustained_lum_cdm2 (float), black_level_cdm2 (float), bt709_coverage_pct (float), dcip3_coverage_pct (float), bit_depth (string), rise_time_frames (int), result (PASS/FAIL)
```
Sample: `LCD-156-08821, 2026-04-10T10:02:33Z, 435.2, 268.7, 0.32, 99.6, 92.1, 8b+2, 5, PASS`

**Source:** [VESA DisplayHDR Performance Criteria](https://displayhdr.org/performance-criteria/), [VESA DisplayHDR CTS v1.1 PDF](https://glenwing.github.io/docs/VESA-DisplayHDR-CTS-1.1.pdf)

---

### Scenario 5: Lithium-Ion Battery Cell Capacity & Impedance Testing

**Industry & Product:** EV / Consumer Electronics -- 21700 cylindrical Li-ion cell (NMC chemistry, nominal 5000 mAh)

**OEM Role:** Specifies capacity, internal resistance, voltage, and temperature-rise acceptance criteria per IEC 62660-1 for EV propulsion cells.

**Factory Role:** Performs formation cycling, then end-of-line capacity test (0.2C charge/discharge) and AC impedance measurement (1 kHz) on every cell.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Rated capacity (0.2C discharge, 4.2V-2.5V) | mAh | 4850 -- 5150 (nominal 5000, +/-3%) |
| AC impedance at 1 kHz | mohm | <= 25 |
| Open circuit voltage (post-formation) | V | 3.60 -- 3.80 |
| Self-discharge (72h OCV drop) | mV | <= 30 |
| Weight | g | 68.0 -- 72.0 |
| Cell-to-cell temp delta during 1C discharge | deg C | <= 5 |

**Acceptance Criteria:**
- PASS: Capacity within +/-3% of nominal, impedance <= 25 mohm, OCV 3.60-3.80V, self-discharge <= 30 mV/72h
- FAIL: Any parameter out of range; cells with impedance > 25 mohm are rejected for cell matching reasons
- Ref: IEC 62660-1 (Performance testing), IEC 62660-2 (Reliability)

**Production Log Format:**
```
cell_id (string), lot_id (string), timestamp (ISO 8601), capacity_mah (float), impedance_mohm (float), ocv_v (float), self_discharge_mv_72h (float), weight_g (float), temp_delta_c (float), result (PASS/FAIL)
```
Sample: `CELL-21700-085442, LOT-2026W15, 2026-04-10T14:22:07Z, 4982, 18.3, 3.72, 12.5, 69.8, 2.1, PASS`

**Source:** [IEC 62660-1 Testing](https://www.testinglab.com/iec-62660-1-lithium-ion-cells-for-ev-performance-testing/), [ESPEC Battery Test Methods](https://espec.com/na/chamber_faq/answer/battery_test_methods_and_specifications)

---

### Scenario 6: MEMS Accelerometer Calibration

**Industry & Product:** Semiconductor / Automotive -- 3-axis MEMS accelerometer (e.g., +/-16 g range, automotive-grade)

**OEM Role:** Specifies sensitivity, zero-g offset, cross-axis sensitivity, and nonlinearity tolerances. References IEEE-STD-1293 for calibration methodology.

**Factory Role:** Performs tumble-test calibration on each packaged device, measuring sensitivity and offset on all three axes at 25 deg C, then validates at -40 deg C and +125 deg C.

**Test Parameters & Real Numbers (typical automotive-grade):**
| Parameter | Unit | Specification |
|---|---|---|
| Sensitivity (each axis) | mg/LSB | 0.488 +/- 2% |
| Zero-g offset (each axis) | mg | +/-40 |
| Cross-axis sensitivity | % | <= 2% |
| Nonlinearity | % FS | <= 0.5% |
| Noise density | ug/sqrt(Hz) | <= 300 |
| Temperature coefficient of offset | mg/deg C | <= 0.5 |

**Acceptance Criteria:**
- PASS: All parameters within spec across -40 to +125 deg C operating range
- FAIL: Offset > +/-40 mg or sensitivity error > 2%, or nonlinearity > 0.5% FS
- Ref: IEEE-STD-1293-1998, AEC-Q100 (automotive qualification)

**Production Log Format:**
```
device_id (string), wafer_lot (string), timestamp (ISO 8601), sens_x (float), sens_y (float), sens_z (float), offset_x_mg (float), offset_y_mg (float), offset_z_mg (float), cross_axis_pct (float), nonlinearity_pct (float), noise_ug_rthz (float), result (PASS/FAIL)
```
Sample: `ACC-AQ-991204, WL-2026-088, 2026-04-10T11:05:18Z, 0.490, 0.487, 0.492, 12.3, -8.7, 15.1, 1.2, 0.3, 210, PASS`

**Source:** [MEMS Calibration -- PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228165/), [IEEE-STD-1293 referenced in calibration literature](https://www.science.gov/topicpages/r/resolution+mems+accelerometers)

---

### Scenario 7: RF Antenna VSWR / Return Loss Testing

**Industry & Product:** Telecommunications -- 5G mmWave patch antenna module (26-30 GHz band)

**OEM Role:** Specifies maximum VSWR and minimum return loss across the operating frequency band, radiation pattern envelope, and gain.

**Factory Role:** Tests each antenna module on a Vector Network Analyzer (VNA) for S11 (return loss) across the 26-30 GHz band.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Return loss (S11) across 26-30 GHz | dB | <= -10 (i.e., better than 10 dB) |
| VSWR across band | ratio | <= 1.92:1 (corresponds to -10 dB RL) |
| Center frequency return loss | dB | <= -15 (target) |
| Gain at broadside | dBi | >= 5.0 |
| 3 dB beamwidth | degrees | 60 -- 90 |
| Isolation (port-to-port if MIMO) | dB | >= 20 |

**Acceptance Criteria:**
- PASS: VSWR <= 1.92:1 across entire 26-30 GHz band, gain >= 5.0 dBi
- FAIL: VSWR > 2.0:1 at any frequency point in band, or gain < 5.0 dBi
- Ref: Industry standard VSWR < 2:1 for antenna acceptance

**Production Log Format:**
```
antenna_id (string), timestamp (ISO 8601), vswr_26ghz (float), vswr_27ghz (float), vswr_28ghz (float), vswr_29ghz (float), vswr_30ghz (float), return_loss_center_db (float), gain_dbi (float), beamwidth_deg (float), result (PASS/FAIL)
```
Sample: `ANT-5G-04821, 2026-04-10T13:45:20Z, 1.35, 1.22, 1.18, 1.28, 1.41, -18.2, 6.3, 72.5, PASS`

**Source:** [Antenna Return Loss Explained](https://antennatestlab.com/antenna-education-tutorials/return-loss-vswr-explained), [Rohde & Schwarz VSWR](https://www.rohde-schwarz.com/us/products/test-and-measurement/essentials-test-equipment/spectrum-analyzers/voltage-standing-wave-ratio-vswr-and-return-loss_258140.html)

---

### Scenario 8: Connector Contact Resistance Testing

**Industry & Product:** Aerospace/Military -- MIL-DTL-38999 Series III circular connector (size 22D contacts)

**OEM Role:** Specifies maximum contact resistance (millivolt drop) per MIL-DTL-38999 for each contact size, both initially and after environmental conditioning.

**Factory Role:** Measures contact resistance of mated connector pairs at rated current using 4-wire Kelvin method on 100% of production units.

**Test Parameters & Real Numbers (MIL-DTL-38999, Size 22D contacts):**
| Parameter | Unit | Specification |
|---|---|---|
| Contact resistance (size 22D, initial) | mohm | <= 14.6 |
| Millivolt drop (size 22D, initial, 3A) | mV | <= 85 |
| Millivolt drop (size 22D, post-conditioning) | mV | <= 95 |
| Contact resistance (size 12, initial) | mohm | <= 5.0 (typ) |
| Millivolt drop (size 12, initial, 13A) | mV | <= 85 |
| Shell-to-ground resistance | mohm | <= 10 |

**Acceptance Criteria:**
- PASS: All contacts measure below maximum millivolt drop per MIL-DTL-38999 table at rated current
- FAIL: Any contact exceeding maximum mV drop
- Ref: MIL-DTL-38999 Series III Contact Performance Spec

**Production Log Format:**
```
connector_id (string), timestamp (ISO 8601), contact_size (string), contact_position (int), resistance_mohm (float), mv_drop (float), test_current_a (float), shell_ground_mohm (float), result (PASS/FAIL)
```
Sample: `CON-38999-11284, 2026-04-10T15:30:00Z, 22D, 1, 11.2, 33.6, 3.0, 4.8, PASS`

**Source:** [Glenair MIL-DTL-38999 Contact Specs](https://cdn.glenair.com/mil-dtl-38999/pdf/a/contact-performance-spec.pdf), [Milnec D38999 Specs](https://www.milnec.com/mil-d38999-connectors/d38999-specs.pdf)

---

### Scenario 9: LED Binning (Color Temperature & Luminous Flux)

**Industry & Product:** Lighting / Electronics -- Mid-power white LED (3000K nominal CCT, 100 lm typical)

**OEM Role:** Specifies chromaticity bin (ANSI C78.377 quadrangle), luminous flux bin, and forward voltage bin. Requires LED manufacturer to ship matched bins.

**Factory Role:** Measures each LED on integrating sphere for luminous flux, chromaticity (CIE x,y), CCT, forward voltage at 65 mA, and bins accordingly.

**Test Parameters & Real Numbers (per ANSI C78.377-2024):**
| Parameter | Unit | Specification |
|---|---|---|
| CCT (correlated color temperature) | K | 2700 -- 3200 (3000K nominal, 3-step MacAdam) |
| CIE 1931 chromaticity x | -- | 0.430 -- 0.445 (3000K quadrangle) |
| CIE 1931 chromaticity y | -- | 0.388 -- 0.405 (3000K quadrangle) |
| Duv (distance from Planckian locus) | -- | -0.006 to +0.006 |
| Luminous flux | lm | 90 -- 110 (flux bin range) |
| Forward voltage (at 65 mA) | V | 2.8 -- 3.4 |
| CRI (Ra) | -- | >= 80 |

**Acceptance Criteria:**
- PASS: Chromaticity within specified ANSI quadrangle, flux within bin range, CRI >= 80
- FAIL: Outside any bin boundary; these are graded (lower bin) rather than scrapped unless CRI < 70
- Ref: ANSI C78.377-2024

**Production Log Format:**
```
led_id (string), reel_id (string), timestamp (ISO 8601), cct_k (int), cie_x (float), cie_y (float), duv (float), flux_lm (float), vf_v (float), cri_ra (int), flux_bin (string), color_bin (string), result (PASS/FAIL)
```
Sample: `LED-3K-482901, REEL-2026-0154, 2026-04-10T06:12:55Z, 3012, 0.436, 0.394, -0.002, 98.4, 3.05, 83, B3, C2, PASS`

**Source:** [ANSI C78.377-2024 ANSI Blog](https://blog.ansi.org/ansi/ansi-c78-377-2024-solid-state-lighting/), [NIH ANSI NEMA LED Binning Standard](https://orf.od.nih.gov/TechnicalResources/Documents/Technical%20Bulletins/19TB/ANSI%20NEMA%20LED%20Binning%20Standard%20November%202019-Technical%20Bulletin_508.pdf)

---

### Scenario 10: Touch Panel Linearity Testing

**Industry & Product:** Consumer Electronics -- 10.1" projected capacitive touch panel (PCAP) for tablet

**OEM Role:** Specifies maximum linearity error, accuracy, jitter, and response time for touch input across the active area.

**Factory Role:** Uses robotic plotter with 2 mm conductive stylus to touch predetermined grid points and measure reported vs. actual position on 100% of panels.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Linearity error (center area) | mm | <= 1.0 |
| Linearity error (edge, within 10mm of border) | mm | <= 1.5 |
| Accuracy (RMS, full panel) | mm | <= 1.0 |
| Jitter (stationary touch, 10 samples) | mm | <= 0.5 |
| Response time (first touch) | ms | <= 25 |
| Multi-touch (minimum simultaneous points) | count | >= 10 |

**Acceptance Criteria:**
- PASS: Linearity <= 1.0 mm center, <= 1.5 mm edge; accuracy <= 1.0 mm RMS
- FAIL: Linearity > 1.5 mm at any test point, or accuracy > 1.5 mm RMS
- Ref: Common industry specification; [Cirque Corp linearity test procedures](https://cirquecorp.squarespace.com/s/TP20120814_Linearity_Accuracy_Resolution_Test_Rev1-0-hkjf.pdf)

**Production Log Format:**
```
panel_id (string), timestamp (ISO 8601), lin_err_center_mm (float), lin_err_edge_mm (float), accuracy_rms_mm (float), jitter_mm (float), response_time_ms (float), multitouch_count (int), result (PASS/FAIL)
```
Sample: `TP-101-07734, 2026-04-10T08:55:10Z, 0.72, 1.18, 0.81, 0.32, 18.4, 10, PASS`

**Source:** [Fieldscale Linearity Testing](https://support.fieldscale.com/en/articles/3998486-how-to-perform-a-linearity-test-in-ito-touch-screens), [OptoFidelity Touch Evaluation](https://www.optofidelity.com/insights/blogs/how-to-evaluate-the-performance-and-functionality-of-touch-screens)

---

### Scenario 11: Battery Cell Formation & Grading

**Industry & Product:** Consumer Electronics -- Prismatic Li-polymer cell (3.85V nominal, 4500 mAh, for smartphones)

**OEM Role:** Specifies formation protocol, capacity grading bins, and impedance matching criteria for cell-to-cell consistency in multi-cell packs.

**Factory Role:** Performs multi-step formation cycling (CC-CV charge, CC discharge), measures discharged capacity, DC internal resistance (DCIR), and K-value (self-discharge rate) over 7-day aging.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Discharge capacity (0.5C, 4.40V-3.00V) | mAh | 4365 -- 4635 (nominal 4500, +/-3%) |
| DCIR (1s pulse at 50% SOC) | mohm | <= 35 |
| K-value (OCV slope over 7 days) | uV/h | <= 5.0 |
| Thickness (post-formation swelling) | mm | <= 4.50 (spec max) |
| Weight | g | 55.0 -- 60.0 |

**Acceptance Criteria:**
- Grade A: Capacity 4410-4590 mAh, DCIR <= 30 mohm, K-value <= 3.0 uV/h
- Grade B: Capacity 4365-4635 mAh, DCIR <= 35 mohm, K-value <= 5.0 uV/h
- REJECT: Outside Grade B ranges or thickness > 4.50 mm
- Ref: Industry practice for Li-polymer cell grading

**Production Log Format:**
```
cell_id (string), lot_id (string), timestamp (ISO 8601), capacity_mah (float), dcir_mohm (float), k_value_uv_h (float), thickness_mm (float), weight_g (float), grade (A/B/REJECT)
```
Sample: `LPO-4500-221034, LOT-2026-W15A, 2026-04-10T16:40:22Z, 4512, 27.4, 2.1, 4.38, 57.2, A`

**Source:** [IEC 62660-1 Performance Testing](https://www.testinglab.com/iec-62660-1-performance-testing-of-lithium-ion-batteries-for-evs/)

---

### Scenario 12: PCB In-Circuit Test (ICT)

**Industry & Product:** Electronics Manufacturing -- Automotive ECU (engine control unit) PCB assembly

**OEM Role:** Specifies all components must pass in-circuit test with resistance, capacitance, and semiconductor junction verification per IPC-9252A.

**Factory Role:** Uses bed-of-nails ICT fixture to test every populated board for correct component values, shorts, opens, and active device functionality.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Resistance measurement accuracy | % | +/- 5% of nominal |
| Capacitance measurement accuracy | % | +/- 10% of nominal |
| Diode forward voltage (Si) | V | 0.50 -- 0.80 |
| Transistor beta (hFE) | ratio | 50 -- 500 (type dependent) |
| Short circuit threshold | ohm | < 10 |
| Open circuit threshold | ohm | > 10 Mohm |

**Acceptance Criteria:**
- PASS: All component values within tolerance, no shorts, no opens, active devices functional
- FAIL: Any out-of-tolerance component, short, or open
- Ref: IPC-9252A (In-Circuit Test Requirements)

**Production Log Format:**
```
board_id (string), timestamp (ISO 8601), total_tests (int), pass_count (int), fail_count (int), first_fail_component (string), first_fail_measured (float), first_fail_expected (float), result (PASS/FAIL)
```
Sample: `ECU-2026-04521, 2026-04-10T09:28:33Z, 1247, 1247, 0, -, -, -, PASS`

**Source:** [IPC-9252A standard], general industry ICT practice

---

## AUTOMOTIVE (10 Scenarios)

---

### Scenario 13: Brake Pad Friction Coefficient Testing

**Industry & Product:** Automotive -- Semi-metallic disc brake pad for passenger vehicle

**OEM Role:** Specifies friction edge code per SAE J866, requiring minimum and maximum friction coefficient at both low and high temperatures, plus fade resistance per SAE J2521.

**Factory Role:** Performs dynamometer friction testing on sample pads from each production lot (batch testing), measuring mu at prescribed temperature steps.

**Test Parameters & Real Numbers (SAE J866 edge code "FF"):**
| Parameter | Unit | Specification |
|---|---|---|
| Normal friction coefficient (200-400 deg F avg) | mu | 0.35 -- 0.45 (code "F") |
| Hot friction coefficient (fade/recovery, 300-650 deg F) | mu | 0.35 -- 0.45 (code "F") |
| Minimum friction at any point | mu | >= 0.25 |
| Maximum friction at any point | mu | <= 0.55 |
| Thickness (new pad) | mm | 12.0 +/- 0.5 |
| Compressibility (at 100 bar) | um | <= 150 |

**Acceptance Criteria:**
- PASS: Normal mu 0.35-0.45 (edge code F), hot mu 0.35-0.45, min mu >= 0.25
- FAIL: Average mu outside 15% of declared value, or any single measurement below 0.25
- Ref: SAE J866 (Friction Coefficient Identification), SAE J2521 (Squeal Noise Matrix)

**Production Log Format:**
```
lot_id (string), pad_id (string), timestamp (ISO 8601), mu_normal_avg (float), mu_hot_avg (float), mu_min (float), mu_max (float), thickness_mm (float), compressibility_um (float), edge_code (string), result (PASS/FAIL)
```
Sample: `LOT-BK-2026-088, PAD-FR-00412, 2026-04-10T10:20:00Z, 0.39, 0.41, 0.31, 0.48, 12.1, 118, FF, PASS`

**Source:** [SAE J866](https://www.sae.org/standards/content/j866_201903/), [AMECA Police DoC Procedures](https://ameca.org/wp-content/uploads/2021/09/Link-Police-DoC-procedures-and-acceptance-criteria-20210920.pdf)

---

### Scenario 14: Engine Block Dimensional Inspection (CMM)

**Industry & Product:** Automotive -- Aluminum die-cast 4-cylinder engine block

**OEM Role:** Specifies GD&T tolerances per ISO 8062-3 (Casting Tolerance Grade CT5-CT7) and specific machined feature tolerances for cylinder bores, deck surface flatness, and bearing bore alignment.

**Factory Role:** CMM inspection of machined engine blocks on sampling basis (1 per 50 units, plus 100% for first article per AS9102-equivalent automotive PPAP).

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Cylinder bore diameter | mm | 82.000 +/- 0.010 |
| Cylinder bore roundness | mm | <= 0.005 |
| Cylinder bore cylindricity | mm | <= 0.008 |
| Deck surface flatness | mm | <= 0.030 |
| Main bearing bore diameter | mm | 55.000 +/- 0.012 |
| Main bearing bore alignment (coaxiality) | mm | <= 0.020 |
| Bolt hole true position | mm | <= 0.15 |

**Acceptance Criteria:**
- PASS: All dimensions within GD&T callouts on engineering drawing
- FAIL: Any feature out of tolerance; bore diameter deviations trigger immediate process adjustment
- Ref: ISO 8062-3 (DCT grades), IATF 16949 (PPAP)

**Production Log Format:**
```
block_id (string), timestamp (ISO 8601), cyl1_bore_mm (float), cyl1_roundness_mm (float), deck_flatness_mm (float), main_brg_bore_mm (float), main_brg_coax_mm (float), bolt_hole_tp_mm (float), result (PASS/FAIL)
```
Sample: `EB-AL4-20260410-0055, 2026-04-10T07:15:44Z, 82.004, 0.003, 0.018, 55.006, 0.012, 0.09, PASS`

**Source:** [ISO 8062 Casting Tolerances](https://casting-china.org/casting-tolerances/), [Die Casting Inspection - Keyence](https://www.keyence.com/products/3d-measure/cmm/applications/die-casting-inspection-ensuring-dimensional-accuracy.jsp)

---

### Scenario 15: Wiring Harness Continuity Testing

**Industry & Product:** Automotive -- Engine compartment wiring harness (42 circuits, 14-22 AWG)

**OEM Role:** Specifies continuity resistance limits per IPC/WHMA-A-620, insulation resistance, and hipot test voltage for each circuit. Provides wiring diagram and pinout.

**Factory Role:** Tests 100% of harnesses on automated tester for continuity, insulation resistance, and hipot before shipment.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Continuity resistance (each circuit) | ohm | <= calculated theoretical + 20% margin |
| Typical 22 AWG, 2m circuit | ohm | <= 0.120 (nominal 0.107 + margin) |
| Typical 14 AWG, 3m circuit | ohm | <= 0.050 (nominal 0.038 + margin) |
| Insulation resistance (500V DC, circuit-to-circuit) | Mohm | >= 100 |
| Hipot (dielectric withstand, 1500V AC/60s) | -- | No breakdown |
| Mis-wire detection | -- | All correct per pinout |

**Acceptance Criteria:**
- PASS: All circuits show continuity below calculated max, insulation >= 100 Mohm, hipot no breakdown, zero mis-wires
- FAIL: Any open circuit, any circuit above resistance limit, insulation < 100 Mohm, or hipot breakdown
- Ref: IPC/WHMA-A-620 (Acceptability of Cable and Wire Harness Assemblies)

**Production Log Format:**
```
harness_id (string), timestamp (ISO 8601), total_circuits (int), open_count (int), short_count (int), miswire_count (int), max_resistance_ohm (float), max_circuit_id (string), insulation_mohm (float), hipot_result (PASS/FAIL), result (PASS/FAIL)
```
Sample: `WH-ENG-2026-01234, 2026-04-10T11:42:18Z, 42, 0, 0, 0, 0.098, CKT-22, 850.0, PASS, PASS`

**Source:** [Cirris Resistance Specs](https://cirris.com/setting-practical-resistance-specs-for-continuity-testing/), [IPC/WHMA-A-620 referenced in Wiring Harness News](https://wiringharnessnews.com/continuity-and-hipot-testing-in-wire-harness-and-cable-assemblies/)

---

### Scenario 16: Airbag Inflator Leak Testing

**Industry & Product:** Automotive Safety -- Pyrotechnic airbag inflator (driver-side, stored gas/pyrotechnic hybrid)

**OEM Role:** Specifies maximum helium leak rate per ISO 12097-3 for sealed inflator assemblies filled to 400-700 bar. Requires < 5% pressure loss over 15-year lifetime.

**Factory Role:** Performs 100% helium mass-spectrometer leak test on every inflator after final assembly and filling.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Fill pressure | bar | 400 -- 700 (gas-hybrid type) |
| Internal volume (net) | cm3 | ~50 |
| Maximum helium leak rate | mbar*L/s | <= 1.0 x 10^-6 |
| Initiator resistance | ohm | 1.8 -- 2.8 (bridgewire) |
| Weight (filled) | g | ± 2.0 of nominal |
| Visual inspection (welds, seal) | -- | No visible defects |

**Acceptance Criteria:**
- PASS: He leak rate <= 1.0 x 10^-6 mbar*L/s, initiator resistance 1.8-2.8 ohm, weight within tolerance
- FAIL: He leak rate > 1.0 x 10^-6 mbar*L/s (scrapped immediately)
- Ref: ISO 12097-3 (Road vehicles -- Airbag components -- Testing of inflator assemblies)

**Production Log Format:**
```
inflator_id (string), lot_id (string), timestamp (ISO 8601), fill_pressure_bar (float), leak_rate_mbar_l_s (float), initiator_resistance_ohm (float), weight_g (float), visual_result (PASS/FAIL), result (PASS/FAIL)
```
Sample: `INF-DRV-26-08821, LOT-INF-W15, 2026-04-10T14:05:30Z, 520.3, 4.2e-8, 2.15, 312.4, PASS, PASS`

**Source:** [INFICON Leak Testing of Airbag Inflators](https://www.inficon.com/media/5432/download/Leak-Testing-of-Airbag-Inflators.pdf), [ISO 12097-3](https://www.iso.org/standard/36047.html)

---

### Scenario 17: Wheel Rim Runout Measurement

**Industry & Product:** Automotive -- 18" aluminum alloy wheel for passenger vehicle

**OEM Role:** Specifies maximum radial and lateral runout tolerances at the bead seat and mounting flange surfaces.

**Factory Role:** Measures 100% of finished wheels on automated runout gauging station using non-contact laser sensors or dial indicator probes.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Radial runout (bead seat, outboard) | mm | <= 0.50 |
| Radial runout (bead seat, inboard) | mm | <= 0.50 |
| Lateral runout (bead seat, outboard) | mm | <= 0.50 |
| Lateral runout (bead seat, inboard) | mm | <= 0.50 |
| Mounting flange runout (radial) | mm | <= 0.08 |
| Mounting flange runout (lateral) | mm | <= 0.10 |

**Acceptance Criteria:**
- PASS: All runout measurements within specification
- FAIL: Any runout > 0.50 mm (bead seat) or > 0.10 mm (mounting flange)
- Note: OEM aluminum wheel spec is typically 0.030" (0.76 mm) per GM standards; 0.50 mm is a premium specification
- Ref: SAE J267 (Wheels/Rims -- Performance Requirements)

**Production Log Format:**
```
wheel_id (string), timestamp (ISO 8601), radial_outboard_mm (float), radial_inboard_mm (float), lateral_outboard_mm (float), lateral_inboard_mm (float), flange_radial_mm (float), flange_lateral_mm (float), result (PASS/FAIL)
```
Sample: `WHL-18AL-04882, 2026-04-10T09:33:50Z, 0.28, 0.31, 0.22, 0.35, 0.05, 0.07, PASS`

**Source:** [OE Wheels - Wheel Runout](https://oewheelsllc.com/blogs/news/what-is-wheel-runout), [GM/Chevrolet Runout Specs](https://www.355nation.net/threads/laterial-and-radial-runout-for-rims.169809/)

---

### Scenario 18: Automotive Paint Thickness (DFT) Measurement

**Industry & Product:** Automotive -- OEM car body paint system (E-coat + primer + base + clear coat)

**OEM Role:** Specifies total DFT and individual layer thickness ranges for corrosion protection and appearance quality per ISO 2808.

**Factory Role:** Measures DFT at 6+ points per body panel using magnetic/eddy-current gauges on 100% of bodies, with individual layer thickness verified on cut samples (destructive, sampling basis).

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| E-coat (cathodic electrodeposition) | um | 18 -- 25 |
| Primer/surfacer | um | 30 -- 40 |
| Base coat | um | 12 -- 20 |
| Clear coat | um | 35 -- 50 |
| Total system DFT | um | 95 -- 135 |
| Uniformity (max-min on single panel) | um | <= 30 |

**Acceptance Criteria:**
- PASS: Total DFT 95-135 um at all measurement points, uniformity <= 30 um per panel
- FAIL: Any point < 80 um total (80-20 rule: no reading below 80% of minimum specified DFT)
- Ref: ISO 2808:2019, OEM paint spec (typical range 100-180 um per DeFelsko)

**Production Log Format:**
```
body_id (string), panel_name (string), timestamp (ISO 8601), dft_point1_um (float), dft_point2_um (float), dft_point3_um (float), dft_point4_um (float), dft_point5_um (float), dft_point6_um (float), dft_avg_um (float), dft_range_um (float), result (PASS/FAIL)
```
Sample: `BODY-2026-04-0122, hood_outer, 2026-04-10T12:18:05Z, 112, 118, 108, 115, 121, 110, 114.0, 13, PASS`

**Source:** [DeFelsko Automotive Paint Gauges](https://www.defelsko.com/resources/how-to-use-paint-thickness-gauges-for-better-automotive-detailing), [PPG OEM Film Builds](https://www.ppg.com/en-AU/refinish-anz/support/oem-paint-support/oem-film-builds)

---

### Scenario 19: Seat Belt Webbing Tensile Strength Testing

**Industry & Product:** Automotive Safety -- Type 2 (3-point) seat belt webbing

**OEM Role:** Specifies minimum tensile strength per FMVSS 209 / 49 CFR 571.209. Webbing must sustain specified force without failure.

**Factory Role:** Destructive tensile test on webbing samples from each production lot using calibrated tensile testing machine.

**Test Parameters & Real Numbers (FMVSS 209):**
| Parameter | Unit | Specification |
|---|---|---|
| Webbing tensile strength (single ply) | N | >= 11,120 (force tolerance +/- 111 N) |
| Assembly loop tensile strength | N | >= 22,241 (force tolerance +/- 222 N) |
| Webbing width | mm | 46.0 -- 54.0 (48 mm nominal) |
| Elongation at 11,120 N | % | <= 20% |
| Webbing thickness | mm | 1.0 -- 1.3 |
| Abrasion resistance (after 5000 cycles) | N | >= 75% of original strength |

**Acceptance Criteria:**
- PASS: Webbing sustains >= 11,120 N without breaking; elongation <= 20%
- FAIL: Webbing breaks below 11,120 N, or elongation > 20%
- Ref: FMVSS 209 (49 CFR 571.209), NHTSA TP-209-08

**Production Log Format:**
```
lot_id (string), sample_id (string), timestamp (ISO 8601), max_force_n (float), elongation_pct (float), width_mm (float), thickness_mm (float), break_type (string), result (PASS/FAIL)
```
Sample: `LOT-SB-2026-042, SB-SMPL-003, 2026-04-10T14:55:22Z, 14280, 14.2, 48.3, 1.15, no_break, PASS`

**Source:** [49 CFR 571.209](https://www.law.cornell.edu/cfr/text/49/571.209), [NHTSA Seat Belt Testing](https://rosap.ntl.bts.gov/view/dot/56176/dot_56176_DS1.pdf)

---

### Scenario 20: EV Battery Pack Thermal Testing

**Industry & Product:** Automotive -- EV lithium-ion battery pack (96S, 400V nominal)

**OEM Role:** Specifies maximum cell temperature, cell-to-cell temperature differential, and coolant system performance during sustained 1C discharge per IEC 62660-1 and OEM thermal design targets.

**Factory Role:** End-of-line thermal validation on 100% of packs: sustained 1C discharge while monitoring all cell temperature sensors, coolant flow, and BMS telemetry.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Max cell temperature (1C continuous discharge) | deg C | <= 45 |
| Cell-to-cell temperature differential | deg C | <= 5 |
| Coolant inlet-outlet delta T | deg C | <= 8 |
| Coolant flow rate | L/min | >= 8.0 |
| BMS voltage reading accuracy | mV | +/- 5 per cell |
| Insulation resistance (pack to chassis) | Mohm | >= 1.0 (per 1V) i.e. >= 400 Mohm for 400V pack |

**Acceptance Criteria:**
- PASS: Max cell temp <= 45 deg C, cell delta-T <= 5 deg C, coolant delta-T <= 8 deg C, insulation >= 1 Mohm/V
- FAIL: Any cell > 50 deg C (safety shutdown), cell delta-T > 8 deg C, insulation < 0.5 Mohm/V
- Ref: IEC 62660-1, UN 38.3 (Transport), ISO 26262 (Functional Safety)

**Production Log Format:**
```
pack_id (string), timestamp (ISO 8601), max_cell_temp_c (float), min_cell_temp_c (float), cell_delta_t_c (float), coolant_in_c (float), coolant_out_c (float), coolant_flow_lpm (float), insulation_mohm (float), bms_status (string), result (PASS/FAIL)
```
Sample: `PACK-EV96-00182, 2026-04-10T16:20:11Z, 38.4, 34.1, 4.3, 22.0, 28.8, 9.2, 520.0, OK, PASS`

**Source:** [EV Battery Thermal Testing](https://www.lneya.com/blog/ev-battery-thermal-testing.html), [LEAPENERGY EV Battery Certification Guide](https://leap.hiitio.com/ev-battery-pack-certification-guide-un38-3-iec-62660-iso-26262-explained/)

---

### Scenario 21: Automotive Headlamp Photometry Testing

**Industry & Product:** Automotive -- LED headlamp assembly (ECE R112 / SAE J1383 compliant)

**OEM Role:** Specifies photometric performance points, beam pattern cutoff sharpness, color temperature, and thermal derating per ECE R112.

**Factory Role:** Tests every headlamp assembly on automated goniometer for luminous intensity at key test points (HV, H1-H4, V1-V4 grid).

**Test Parameters & Real Numbers (ECE R112 dipped beam, selected points):**
| Parameter | Unit | Specification |
|---|---|---|
| Luminous intensity at point B50L (oncoming glare) | cd | <= 350 |
| Luminous intensity at point 75R (right illumination) | cd | >= 6,600 |
| Luminous intensity at point 75L (left illumination) | cd | >= 1,650 |
| Luminous intensity at point 50V (cutoff sharpness) | cd | >= 3,300 |
| Color temperature | K | 5500 -- 6500 (white LED) |
| Total luminous flux | lm | >= 1000 |

**Acceptance Criteria:**
- PASS: All photometric test points within ECE R112 limits
- FAIL: Glare point B50L > 350 cd, or illumination points below minimums
- Ref: ECE R112 (Headlamps emitting an asymmetrical passing beam)

**Production Log Format:**
```
headlamp_id (string), timestamp (ISO 8601), b50l_cd (float), 75r_cd (float), 75l_cd (float), 50v_cd (float), color_temp_k (int), flux_lm (float), result (PASS/FAIL)
```
Sample: `HL-LED-L-04521, 2026-04-10T10:45:33Z, 285, 8420, 2180, 4200, 5800, 1250, PASS`

**Source:** ECE R112 (UNECE Regulation), general automotive lighting industry practice

---

### Scenario 22: Brake Caliper Casting Pressure Testing

**Industry & Product:** Automotive -- Aluminum brake caliper casting (4-piston, monoblock)

**OEM Role:** Specifies hydrostatic proof pressure and burst pressure per OEM design spec and SAE J1153 recommendations.

**Factory Role:** Pressure-tests 100% of caliper castings at proof pressure (1.5x operating) for leak detection; burst test on sampling basis.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Normal operating pressure | bar | 100 |
| Proof test pressure (1.5x) | bar | 150 |
| Proof test hold time | seconds | 30 |
| Allowable leakage at proof | mL/min | 0 (zero leakage) |
| Burst test pressure (sampling) | bar | >= 350 (3.5x safety factor) |
| Wall thickness (min, at critical section) | mm | >= 4.0 |

**Acceptance Criteria:**
- PASS: Zero leakage at 150 bar for 30 seconds; burst pressure >= 350 bar (sample basis)
- FAIL: Any leakage detected at proof pressure
- Ref: SAE J1153 (Hydraulic Brake Caliper Bench Test), OEM engineering specification

**Production Log Format:**
```
caliper_id (string), casting_lot (string), timestamp (ISO 8601), proof_pressure_bar (float), hold_time_s (int), leak_detected (bool), pressure_drop_bar (float), result (PASS/FAIL)
```
Sample: `CAL-4P-26-01882, CL-2026-W15, 2026-04-10T08:20:44Z, 150.2, 30, false, 0.0, PASS`

**Source:** SAE J1153, general automotive brake caliper manufacturing practice

---

## STEEL / METALS (8 Scenarios)

---

### Scenario 23: Steel Plate Chemical Composition (Mill Test Certificate)

**Industry & Product:** Steel Manufacturing -- ASTM A36 structural steel plate (12mm thick)

**OEM Role:** Specifies chemical composition limits per ASTM A36/A36M for structural steel procurement. Mill test certificate (MTC / MTR) required per EN 10204 Type 3.1.

**Factory Role:** Performs optical emission spectrometry (OES) on each heat of steel to determine chemical composition. Issues mill test certificate.

**Test Parameters & Real Numbers (ASTM A36 chemical limits):**
| Element | Unit | Max / Range |
|---|---|---|
| Carbon (C) | % | <= 0.26 (plates <= 20mm) |
| Manganese (Mn) | % | <= 1.03 |
| Phosphorus (P) | % | <= 0.04 |
| Sulfur (S) | % | <= 0.05 |
| Silicon (Si) | % | <= 0.40 |
| Copper (Cu) | % | >= 0.20 (when specified) |

**Acceptance Criteria:**
- PASS: All elements within ASTM A36 limits
- FAIL: Any element exceeding maximum (e.g., C > 0.26% or S > 0.05%)
- Ref: ASTM A36/A36M (Standard Specification for Carbon Structural Steel)

**Production Log Format (Mill Test Certificate):**
```
heat_no (string), plate_id (string), test_date (date), thickness_mm (float), c_pct (float), mn_pct (float), p_pct (float), s_pct (float), si_pct (float), cu_pct (float), yield_mpa (float), tensile_mpa (float), elongation_pct (float), result (PASS/FAIL)
```
Sample: `HT-2026-0441, PL-A36-12-0089, 2026-04-10, 12.2, 0.18, 0.85, 0.012, 0.018, 0.22, 0.25, 285, 445, 24.5, PASS`

**Source:** [ASTM A36 Specification - Octal Steel](https://www.octalsteel.com/astm-a36-steel-plate-specification/), [A36 Steel - Wikipedia](https://en.wikipedia.org/wiki/A36_steel)

---

### Scenario 24: Steel Tensile Strength Testing per ASTM A370

**Industry & Product:** Steel Manufacturing -- ASTM A36 structural steel plate (mechanical property verification)

**OEM Role:** Specifies minimum yield strength, tensile strength range, and minimum elongation per ASTM A36. Testing methodology per ASTM A370.

**Factory Role:** Machines tensile test coupons per ASTM A370 (flat specimen, 200mm gauge length for plates) and performs uniaxial tension test on universal testing machine.

**Test Parameters & Real Numbers (ASTM A36 Mechanical Requirements):**
| Parameter | Unit | Specification |
|---|---|---|
| Yield strength (0.2% offset) | MPa | >= 250 (36 ksi) |
| Ultimate tensile strength | MPa | 400 -- 550 (58-80 ksi) |
| Elongation (200mm GL) | % | >= 20 |
| Elongation (50mm GL) | % | >= 23 |
| Modulus of elasticity | GPa | ~200 |
| Reduction of area | % | Report only (no minimum spec) |

**Acceptance Criteria:**
- PASS: YS >= 250 MPa, UTS 400-550 MPa, Elongation >= 23% (50mm GL)
- FAIL: YS < 250 MPa, or UTS outside 400-550 MPa range, or elongation < 23%
- Ref: ASTM A370 (test method), ASTM A36 (specification)

**Production Log Format:**
```
heat_no (string), specimen_id (string), test_date (date), specimen_type (string), yield_mpa (float), uts_mpa (float), elongation_pct (float), reduction_area_pct (float), gauge_length_mm (int), result (PASS/FAIL)
```
Sample: `HT-2026-0441, TS-A36-003, 2026-04-10, flat_50mm, 292, 458, 26.3, 52.1, 50, PASS`

**Source:** [ASTM A370 - Instron](https://www.instron.com/en/testing-solutions/astm-standards/astm-a370-standard-for-testing-metal-elasticity-strength-elongation-reduction/), [Metal Supermarkets A36](https://www.metalsupermarkets.com/grade-guide-a36-steel/)

---

### Scenario 25: Charpy V-Notch Impact Testing

**Industry & Product:** Steel Manufacturing -- ASTM A572 Grade 50 structural steel plate (for cold-weather bridge application)

**OEM Role:** Specifies minimum Charpy V-Notch (CVN) impact energy at specified test temperature per supplementary requirement. Testing method per ASTM E23.

**Factory Role:** Machines standard CVN specimens (10x10x55mm, 2mm V-notch at 45 deg) and tests 3-specimen sets on calibrated Charpy pendulum at specified temperature.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Specimen dimensions | mm | 10 x 10 x 55 |
| V-notch depth | mm | 2.0 |
| V-notch angle | degrees | 45 |
| Test temperature | deg C | -30 (for cold-weather application) |
| Minimum average absorbed energy (3 specimens) | J | >= 27 (20 ft-lb) |
| Minimum individual specimen energy | J | >= 20 (15 ft-lb) |
| Temperature tolerance | deg C | +/- 1 |

**Acceptance Criteria:**
- PASS: Average of 3 specimens >= 27 J at -30 deg C, no individual specimen < 20 J
- FAIL: Average < 27 J, or any individual specimen < 20 J
- Ref: ASTM E23 (Notched Bar Impact Testing), ASTM A572 supplementary requirement S5

**Production Log Format:**
```
heat_no (string), specimen_set_id (string), test_date (date), test_temp_c (int), energy_1_j (float), energy_2_j (float), energy_3_j (float), average_j (float), min_j (float), fracture_appearance_pct_shear (int), result (PASS/FAIL)
```
Sample: `HT-2026-0558, CVN-572-SET01, 2026-04-10, -30, 42, 38, 45, 41.7, 38, 65, PASS`

**Source:** [ASTM E23 - ZwickRoell](https://www.zwickroell.com/industries/metals/metals-standards/notched-bar-impact-test-astm-e23/), [Charpy Test - Metal Zenith](https://metalzenith.com/blogs/defects-inspection-testing-terms/charpy-test-key-impact-test-for-steel-toughness-quality-assessment)

---

### Scenario 26: Rockwell Hardness Testing

**Industry & Product:** Steel Manufacturing -- AISI 4140 alloy steel shaft (quenched and tempered)

**OEM Role:** Specifies hardness range after heat treatment (Q&T) per ASTM A29/A29M for mechanical shafting. Testing per ASTM E18.

**Factory Role:** Performs Rockwell C hardness test on machined surface of each shaft (multiple readings per part) using calibrated hardness tester.

**Test Parameters & Real Numbers (AISI 4140 Q&T for shafting):**
| Parameter | Unit | Specification |
|---|---|---|
| Hardness (Rockwell C scale) | HRC | 28 -- 34 |
| Test load | kgf | 150 (Rockwell C) |
| Indenter | -- | Diamond Brale cone, 120 deg |
| Preload | kgf | 10 |
| Minimum readings per part | count | 3 |
| Maximum reading-to-reading variation | HRC | <= 4 |
| Equivalent Brinell (conversion per ASTM E140) | HBW | 271 -- 321 |

**Acceptance Criteria:**
- PASS: All readings 28-34 HRC, variation between readings <= 4 HRC
- FAIL: Any reading < 28 HRC (under-tempered) or > 34 HRC (over-hardened)
- Ref: ASTM E18 (Rockwell Hardness), ASTM E140 (Hardness Conversion)

**Production Log Format:**
```
part_id (string), heat_treat_lot (string), test_date (date), hrc_reading1 (float), hrc_reading2 (float), hrc_reading3 (float), hrc_average (float), hrc_range (float), result (PASS/FAIL)
```
Sample: `SHAFT-4140-00284, HTL-2026-018, 2026-04-10, 31.2, 30.8, 31.5, 31.2, 0.7, PASS`

**Source:** [Rockwell Hardness - Wikipedia](https://en.wikipedia.org/wiki/Rockwell_hardness_test), [NIST SP 960-5](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication960-5.pdf)

---

### Scenario 27: Pipe Wall Thickness Ultrasonic Testing

**Industry & Product:** Oil & Gas -- API 5L Grade X52 (L360) ERW steel line pipe, 12" OD x 0.375" WT

**OEM Role:** Specifies wall thickness tolerance and NDT requirements per API 5L PSL2 for pipeline service.

**Factory Role:** 100% ultrasonic wall thickness measurement on finished pipe using rotating UT head or phased array, plus body and weld seam inspection.

**Test Parameters & Real Numbers (API 5L, 12" x 0.375" WT):**
| Parameter | Unit | Specification |
|---|---|---|
| Nominal wall thickness | mm | 9.525 (0.375") |
| Wall thickness tolerance (API 5L) | mm | -12.5% (min 8.334 mm) |
| Maximum wall thickness | mm | No max specified by API, typically +15% |
| Minimum remaining wall (in-service, per API 579) | % of nominal | >= 87.5% |
| UT indication threshold (body) | % of notch | <= 12.5% WT depth |
| Weld seam UT acceptance | -- | No indication > 5% WT depth (PSL2) |

**Acceptance Criteria:**
- PASS: Wall thickness >= 8.334 mm everywhere, no UT indications exceeding threshold
- FAIL: Any wall measurement below 8.334 mm, or UT indication > 12.5% WT depth
- Ref: API 5L 46th Edition (Line Pipe Specification)

**Production Log Format:**
```
pipe_id (string), heat_no (string), test_date (date), od_mm (float), wt_min_mm (float), wt_max_mm (float), wt_avg_mm (float), body_ut_max_pct (float), weld_ut_max_pct (float), result (PASS/FAIL)
```
Sample: `PIPE-X52-12-00441, HT-2026-0612, 2026-04-10, 323.8, 9.12, 9.88, 9.52, 4.2, 2.8, PASS`

**Source:** [API 5L Specification - Octal Steel](https://www.octalsteel.com/api-5l-pipe-specification/), [API 5L X52 Specification](https://www.api5lx.com/api5lx-grades/api-5l-x52.php)

---

### Scenario 28: Weld Quality Radiographic (X-ray) Inspection

**Industry & Product:** Steel Fabrication -- Structural steel butt weld (full penetration CJP) per AWS D1.1

**OEM Role:** Specifies radiographic testing acceptance criteria per AWS D1.1 Section 6.12 for statically loaded structures.

**Factory Role:** Performs radiographic examination of CJP welds using X-ray or gamma-ray source, interprets film/digital images per AWS D1.1 acceptance standards.

**Test Parameters & Real Numbers (AWS D1.1, statically loaded):**
| Defect Type | Unit | Acceptance Limit |
|---|---|---|
| Cracks | -- | Not acceptable (any length) |
| Incomplete fusion | mm | <= 25 mm in any 300 mm weld length |
| Slag inclusions (individual length) | mm | <= 25 mm |
| Slag inclusions (aggregate in 300mm) | mm | <= 25 mm total |
| Porosity (individual, max diameter) | mm | <= 2.5 mm (for t <= 12mm) |
| Crater/star cracks | mm | <= 4 mm |
| Undercut depth | mm | <= 0.8 mm (1/32") |

**Acceptance Criteria:**
- PASS: No cracks; all indications within AWS D1.1 table limits for weld thickness and loading type
- FAIL: Any crack, or incomplete fusion > 25mm/300mm, or porosity exceeding tabulated limits
- Ref: AWS D1.1/D1.1M:2020 (Structural Welding Code -- Steel), Section 6.12

**Production Log Format:**
```
weld_id (string), joint_type (string), test_date (date), film_id (string), weld_thickness_mm (float), indication_type (string), indication_size_mm (float), indication_location_mm (float), rt_technician (string), result (ACCEPT/REJECT)
```
Sample: `WLD-CJP-04-0018, butt_CJP, 2026-04-10, RT-2026-0441, 12.0, porosity, 1.8, 150, NDE-TECH-005, ACCEPT`

**Source:** [AWS D1.1 RT Acceptance Criteria](https://www.scribd.com/document/396445993/AWS-D1-1-Acceptance-Criteria-for-RT), [AWS Practical Reference Guide for RT](https://pubs.aws.org/download_pdfs/prg-95pv.pdf)

---

### Scenario 29: Brinell Hardness Testing (Large Forgings)

**Industry & Product:** Heavy Industry -- SA-105 carbon steel flange forging for pressure vessel

**OEM Role:** Specifies maximum Brinell hardness per ASME SA-105 (ASTM A105) for weldability and machinability assurance. Testing per ASTM E10.

**Factory Role:** Performs Brinell hardness test (10mm ball, 3000 kgf) on flat surface of each forging after normalizing heat treatment.

**Test Parameters & Real Numbers (ASTM A105 / SA-105):**
| Parameter | Unit | Specification |
|---|---|---|
| Maximum Brinell hardness | HBW | <= 187 (normalized condition) |
| Ball diameter | mm | 10 |
| Test force | kgf | 3000 |
| Dwell time | seconds | 10 -- 15 |
| Minimum impressions per part | count | 2 |
| Equivalent HRC (per ASTM E140) | HRC | ~8 (max) |

**Acceptance Criteria:**
- PASS: All readings <= 187 HBW
- FAIL: Any reading > 187 HBW (indicates insufficient heat treatment)
- Ref: ASTM A105/SA-105 (Forgings for Piping Components), ASTM E10 (Brinell Hardness)

**Production Log Format:**
```
forging_id (string), heat_treat_lot (string), test_date (date), hbw_reading1 (float), hbw_reading2 (float), hbw_average (float), impression_diameter_mm (float), result (PASS/FAIL)
```
Sample: `FLG-A105-06-0134, NHT-2026-042, 2026-04-10, 162, 158, 160.0, 4.31, PASS`

**Source:** ASTM A105 Standard, [Portland Bolt Hardness Conversion](https://www.portlandbolt.com/technical/steel-hardness-conversion-chart/)

---

### Scenario 30: Steel Plate Ultrasonic Examination (Lamination Check)

**Industry & Product:** Steel Manufacturing -- ASTM A516 Grade 70 pressure vessel plate (25mm thick)

**OEM Role:** Specifies straight-beam UT examination per ASTM A435 or SA-435 for lamination detection in plates destined for pressure vessel service.

**Factory Role:** 100% straight-beam ultrasonic scanning of plate using 2.25 MHz, 25mm diameter probe in grid pattern, with back-wall echo (BWE) monitoring.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Probe frequency | MHz | 2.25 |
| Probe diameter | mm | 25 |
| Scanning grid interval | mm | 150 x 150 (6" x 6") |
| Minimum back-wall echo (BWE) | % FSH | >= 50% (of initial BWE) |
| Acceptance: loss of BWE area | mm | No single area > 80mm diameter showing > 50% BWE loss |
| Couplant | -- | Water or gel |

**Acceptance Criteria:**
- PASS: No area with > 50% loss of BWE exceeding 80 mm diameter circle
- FAIL: Any lamination indication > 80 mm diameter
- Ref: ASTM A435 (Straight-Beam UT of Steel Plates), SA-435 (ASME equivalent)

**Production Log Format:**
```
plate_id (string), heat_no (string), test_date (date), thickness_mm (float), probe_freq_mhz (float), total_grid_points (int), indication_count (int), max_indication_dia_mm (float), min_bwe_pct (float), result (PASS/FAIL)
```
Sample: `PL-A516-25-00441, HT-2026-0712, 2026-04-10, 25.2, 2.25, 48, 0, 0, 92.0, PASS`

**Source:** ASTM A435 Standard, ASTM A516 Standard for Pressure Vessel Plates

---

## FOOD & PHARMA (8 Scenarios)

---

### Scenario 31: Bottled Water Microbiological Testing

**Industry & Product:** Food & Beverage -- Bottled spring water (500 mL PET bottles)

**OEM Role:** Specifies microbiological limits per FDA 21 CFR 165.110 and WHO Guidelines for Drinking-Water Quality. Requires testing on each production lot.

**Factory Role:** Collects samples from each production lot and performs membrane filtration and plate count assays in QC microbiology laboratory.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Heterotrophic Plate Count (HPC) | CFU/mL | <= 500 |
| Total Coliform (membrane filter) | CFU/100 mL | <= 0 (zero detected) |
| E. coli | CFU/100 mL | 0 (zero -- if present, product is adulterated) |
| Pseudomonas aeruginosa | CFU/250 mL | 0 (zero) |
| pH | -- | 6.5 -- 8.5 |
| Turbidity | NTU | <= 1.0 |
| Free chlorine residual | mg/L | <= 0.1 (for non-chlorinated spring water) |

**Acceptance Criteria:**
- PASS: HPC <= 500, zero total coliforms, zero E. coli, zero Pseudomonas, pH 6.5-8.5
- FAIL: Any coliform detected = lot hold; E. coli detected = product adulterated per FDA
- Ref: FDA 21 CFR 165.110, WHO Drinking Water Quality Guidelines, EPA NPDWR

**Production Log Format:**
```
lot_id (string), sample_id (string), test_date (date), hpc_cfu_ml (int), total_coliform_cfu_100ml (int), ecoli_cfu_100ml (int), pseudomonas_cfu_250ml (int), ph (float), turbidity_ntu (float), result (PASS/FAIL)
```
Sample: `LOT-SW-2026-0410A, SW-SMPL-001, 2026-04-10, 12, 0, 0, 0, 7.2, 0.3, PASS`

**Source:** [FDA Bottled Water Coliform](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/small-entity-compliance-guide-bottled-water-and-total-coliform-and-e-coli), [EPA NPDWR](https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations)

---

### Scenario 32: Pharmaceutical Tablet Weight Uniformity

**Industry & Product:** Pharmaceutical -- Ibuprofen 400 mg film-coated tablet

**OEM Role:** Specifies weight uniformity requirements per USP <905> (Uniformity of Dosage Units). For tablets > 250 mg, the deviation limit is +/- 5%.

**Factory Role:** Weighs individual tablets from each batch on analytical balance (0.1 mg resolution) per USP in-process testing protocol.

**Test Parameters & Real Numbers (USP <905>, tablet > 250 mg):**
| Parameter | Unit | Specification |
|---|---|---|
| Target tablet weight (including coating) | mg | 580 (target) |
| Acceptable weight variation | % | +/- 5% (551 -- 609 mg) |
| Maximum individual deviation (USP) | % | No more than 2 units outside +/- 5%; none outside +/- 10% |
| Content uniformity (L1 acceptance value) | % | <= 15.0 |
| Hardness (crushing strength) | N | 80 -- 150 |
| Friability | % | <= 1.0 |
| Disintegration time | min | <= 30 |

**Acceptance Criteria:**
- PASS: Average weight 580 +/- 5% (551-609 mg), no more than 2 of 20 tablets outside +/- 5%, none outside +/- 10%
- FAIL: More than 2 tablets outside 551-609 mg range, or any tablet outside 522-638 mg
- Ref: USP <905>, USP <1216> (Tablet Friability), USP <701> (Disintegration)

**Production Log Format:**
```
batch_id (string), tablet_id (int), test_date (date), weight_mg (float), deviation_pct (float), hardness_n (float), friability_pct (float), disintegration_min (float), result (PASS/FAIL)
```
Sample: `IBU400-2026-042, 1, 2026-04-10, 582.3, +0.40, 118.5, 0.42, 12.5, PASS`

**Source:** [USP <905>](https://www.usp.org/frequently-asked-questions/uniformity-dosage-units), [Pharmapproach Quality Control Tests for Tablets](https://www.pharmapproach.com/quality-control-tests-for-tablets/2/)

---

### Scenario 33: Food Allergen ELISA Testing

**Industry & Product:** Food Manufacturing -- Chocolate bar production line (peanut-free line, testing for cross-contamination)

**OEM Role:** Specifies maximum allowable allergen (peanut protein) residue per FDA labeling requirements and Codex Alimentarius standards. Testing by ELISA per AOAC methods.

**Factory Role:** Swabs production line surfaces and tests finished product samples by ELISA for peanut protein after line changeovers and cleaning validation.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Peanut protein (finished product) | ppm | < 2.5 (LOQ of validated ELISA kit) |
| Peanut protein (surface swab, after cleaning) | ug/100 cm2 | < 1.0 |
| Gluten (if also gluten-free claim) | ppm | < 20 (FDA gluten-free threshold) |
| ELISA kit LOD | ppm | 0.5 (typical kit) |
| ELISA kit LOQ | ppm | 2.5 (typical kit) |
| ELISA kit range of quantitation | ppm | 2.5 -- 25 |

**Acceptance Criteria:**
- PASS: Peanut protein < 2.5 ppm in product, surface swabs < 1.0 ug/100 cm2
- FAIL: Peanut protein detected >= 2.5 ppm in product (line re-clean required; product held/reworked)
- Ref: FDA FALCPA, Codex Alimentarius, AOAC 2012.01 (peanut ELISA)

**Production Log Format:**
```
lot_id (string), sample_type (string), sample_id (string), test_date (date), allergen (string), result_ppm (float), loq_ppm (float), surface_ug_100cm2 (float), result (PASS/FAIL)
```
Sample: `CHOC-2026-0410, finished_product, FP-001, 2026-04-10, peanut, <2.5, 2.5, -, PASS`

**Source:** [FDA Allergens](https://www.fda.gov/media/78205/download), [FARRP Commercial Test Methods](https://farrp.unl.edu/confidential-analysis/commercial-test-methods-specifications/)

---

### Scenario 34: Dairy Product Fat Content Testing (Gerber Method)

**Industry & Product:** Dairy -- Whole milk (pasteurized, standardized to 3.25% fat)

**OEM Role:** Specifies fat content target and tolerance per Code of Federal Regulations (21 CFR 131.110) and Codex Alimentarius CODEX STAN 243. Testing per ISO 19662 / IDF 238 (Gerber method).

**Factory Role:** Tests fat content of each batch using Gerber butyrometer method (acid-butyrometric) in QC laboratory.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Fat content (whole milk) | % (w/w) | 3.25 +/- 0.15 (3.10 -- 3.40) |
| Minimum legal fat (whole milk, FDA) | % | >= 3.25 |
| Gerber method precision (repeatability, Sr) | % | 0.026 |
| Gerber method precision (reproducibility, SR) | % | 0.047 |
| Measurement range | % | 0 -- 16 |
| Temperature of reading | deg C | 65 +/- 2 |

**Acceptance Criteria:**
- PASS: Fat content >= 3.25% and within +/- 0.15% of target batch formulation
- FAIL: Fat content < 3.10% (under-standardized) or > 3.40% (over-standardized), requiring re-blending
- Ref: ISO 19662:2018 / IDF 238 (Gerber method), 21 CFR 131.110

**Production Log Format:**
```
batch_id (string), sample_id (string), test_date (date), fat_pct (float), reading_temp_c (float), technician (string), result (PASS/FAIL)
```
Sample: `MILK-WH-2026-0410, MS-001, 2026-04-10, 3.28, 65.0, QC-LAB-07, PASS`

**Source:** [ISO 19662:2018](https://www.iso.org/standard/65935.html), [Gerber Method - Wikipedia](https://en.wikipedia.org/wiki/Gerber_method)

---

### Scenario 35: Cooking Oil Peroxide Value Testing

**Industry & Product:** Food Manufacturing -- Refined sunflower oil (bottled for retail)

**OEM Role:** Specifies maximum peroxide value per Codex Alimentarius Standard for Named Vegetable Oils (CODEX STAN 210). Testing per AOCS Cd 8b-90 or ISO 3960.

**Factory Role:** Titration-based peroxide value determination on samples from each production batch and incoming tanker loads.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Peroxide value (refined oil) | meq O2/kg | <= 10 |
| Peroxide value (cold pressed/virgin) | meq O2/kg | <= 15 |
| Free fatty acid (as oleic acid) | % | <= 0.1 (refined) |
| Iodine value (sunflower) | g I2/100g | 118 -- 141 |
| Moisture & volatiles | % | <= 0.10 |
| Color (Lovibond, 5.25" cell, Red) | R | <= 2.0 (refined sunflower) |

**Acceptance Criteria:**
- PASS: PV <= 10 meq O2/kg for refined oil, FFA <= 0.1%
- FAIL: PV > 10 meq O2/kg (indicates oxidative rancidity; oil rejected or reprocessed)
- Ref: Codex STAN 210 (Named Vegetable Oils), AOCS Cd 8b-90

**Production Log Format:**
```
lot_id (string), sample_id (string), test_date (date), peroxide_value_meq_kg (float), ffa_pct (float), iodine_value (float), moisture_pct (float), color_lovibond_r (float), result (PASS/FAIL)
```
Sample: `OIL-SF-2026-0410, OS-001, 2026-04-10, 3.8, 0.05, 132.4, 0.04, 1.2, PASS`

**Source:** [Codex Standard Named Vegetable Oils](https://www.fao.org/4/y2774e/y2774e04.htm), [Peroxide Value - ResearchGate](https://www.researchgate.net/publication/225411903_The_importance_of_peroxide_value_in_assessing_food_quality_and_food_safety)

---

### Scenario 36: Drug Dissolution Testing (USP)

**Industry & Product:** Pharmaceutical -- Metformin HCl 500 mg immediate-release tablet

**OEM Role:** Specifies dissolution test conditions and Q value per USP monograph. Requires Q = 80% dissolved within 30 minutes using USP Apparatus II (paddle).

**Factory Role:** Performs dissolution testing per USP <711> on 6-unit samples from each batch using automated dissolution apparatus and UV spectrophotometer.

**Test Parameters & Real Numbers (USP <711>, Metformin HCl 500 mg):**
| Parameter | Unit | Specification |
|---|---|---|
| Apparatus | -- | USP II (Paddle), 50 rpm |
| Medium | -- | pH 6.8 phosphate buffer, 900 mL, 37 +/- 0.5 deg C |
| Time point | min | 30 |
| Q value (amount dissolved) | % label claim | 80 |
| Stage S1 (n=6): each unit | % | >= Q + 5% = 85% |
| Stage S2 (n=12): average | % | >= Q = 80%; no unit < Q - 15% = 65% |
| Stage S3 (n=24): average | % | >= Q = 80%; max 2 units < 65%; none < Q - 25% = 55% |

**Acceptance Criteria:**
- S1 PASS: All 6 units >= 85%
- S1 FAIL -> proceed to S2: Average of 12 >= 80%, no individual < 65%
- S2 FAIL -> proceed to S3: Average of 24 >= 80%, max 2 < 65%, none < 55%
- Ref: USP <711> (Dissolution), USP Metformin HCl monograph

**Production Log Format:**
```
batch_id (string), stage (string), test_date (date), unit_1_pct (float), unit_2_pct (float), unit_3_pct (float), unit_4_pct (float), unit_5_pct (float), unit_6_pct (float), average_pct (float), min_pct (float), result (PASS/FAIL)
```
Sample: `MET500-2026-042, S1, 2026-04-10, 92.3, 89.7, 94.1, 88.5, 91.2, 90.8, 91.1, 88.5, PASS`

**Source:** [USP Q Value for Dissolution](https://community.agilent.com/technical/dissolution/b/blog/posts/what-is-usp-s-q-value-for-dissolution-testing), [FDA Dissolution Guidance](https://www.fda.gov/files/drugs/published/Dissolution-Testing-and-Acceptance-Criteria-for-Immediate-Release-Solid-Oral-Dosage-Form-Drug-Products-Containing-High-Solubility-Drug-Substances-Guidance-for-Industry.pdf)

---

### Scenario 37: Pharmaceutical Tablet Hardness Testing

**Industry & Product:** Pharmaceutical -- Paracetamol (Acetaminophen) 500 mg tablet

**OEM Role:** Specifies tablet hardness (breaking force) range to balance disintegration and friability requirements per pharmacopoeial standards.

**Factory Role:** In-process hardness testing of tablets using tablet hardness tester (e.g., Erweka TBH) on 10-tablet samples every 30 minutes during compression.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Hardness (breaking force) | N | 80 -- 150 |
| Hardness (alternative unit) | kp (kilopond) | 8.2 -- 15.3 |
| Tablet diameter | mm | 13.0 +/- 0.2 |
| Tablet thickness | mm | 5.5 +/- 0.3 |
| Friability (related test) | % weight loss | <= 1.0 |
| Disintegration (related test) | min | <= 15 |

**Acceptance Criteria:**
- PASS: Hardness 80-150 N, friability <= 1.0%, disintegration <= 15 min
- FAIL: Hardness < 80 N (too soft, friability risk) or > 150 N (too hard, disintegration risk)
- Ref: USP <1217> (Tablet Breaking Force), Ph.Eur. 2.9.8

**Production Log Format:**
```
batch_id (string), sample_time (ISO 8601), tablet_no (int), hardness_n (float), diameter_mm (float), thickness_mm (float), friability_pct (float), disintegration_min (float), result (PASS/FAIL)
```
Sample: `PARA500-2026-042, 2026-04-10T09:30:00Z, 1, 112.4, 13.02, 5.48, 0.35, 8.2, PASS`

**Source:** [Quality Control Tests for Tablets](https://www.pharmapproach.com/quality-control-tests-for-tablets/2/), [Pharmaeducation Tablet QC](https://pharmaeducation.net/quality-control-tests-of-tablets-or-evaluation-of-tablets/)

---

### Scenario 38: Beverage pH and Brix Testing

**Industry & Product:** Food & Beverage -- Orange juice (from concentrate, aseptic packaging)

**OEM Role:** Specifies pH, Brix (total soluble solids), titratable acidity, and vitamin C content per FDA 21 CFR 146.145 and Codex STAN 45.

**Factory Role:** Tests pH (digital pH meter), Brix (digital refractometer), and titratable acidity on every batch before filling.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Brix (total soluble solids) | deg Brix | 11.0 -- 12.5 |
| pH | -- | 3.3 -- 4.0 |
| Titratable acidity (as citric acid) | % (w/v) | 0.6 -- 1.2 |
| Brix/acid ratio | ratio | 12 -- 18 |
| Vitamin C (ascorbic acid) | mg/100 mL | >= 30 |
| Pulp content | % (v/v) | 5 -- 12 (for "with pulp" variant) |

**Acceptance Criteria:**
- PASS: Brix 11.0-12.5, pH 3.3-4.0, acidity 0.6-1.2%, Brix/acid ratio 12-18
- FAIL: Brix < 11.0 (under-concentrated) or pH > 4.0 (spoilage risk)
- Ref: 21 CFR 146.145, Codex STAN 45

**Production Log Format:**
```
batch_id (string), test_date (date), brix (float), ph (float), acidity_pct (float), brix_acid_ratio (float), vitamin_c_mg_100ml (float), pulp_pct (float), result (PASS/FAIL)
```
Sample: `OJ-2026-0410-B, 2026-04-10, 11.8, 3.65, 0.82, 14.4, 42.5, 8.2, PASS`

**Source:** FDA 21 CFR 146.145, Codex STAN 45 (Orange Juice)

---

## AEROSPACE / DEFENSE (6 Scenarios)

---

### Scenario 39: Turbine Blade Dimensional CMM Inspection

**Industry & Product:** Aerospace -- Single-crystal nickel superalloy turbine blade (investment casting, HPT stage 1)

**OEM Role:** Specifies airfoil profile tolerance, root form dimensions, and cooling hole positions per engineering drawing. First Article Inspection per AS9102.

**Factory Role:** CMM inspection of every blade for critical dimensions (100% root form) and sampling for airfoil profile using 5-axis CMM with scanning probe.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Airfoil profile tolerance (contour) | mm | +/- 0.075 (0.003") |
| Root form width (fir-tree) | mm | +/- 0.025 |
| Root form slot depth | mm | +/- 0.025 |
| Chord length (at mid-span) | mm | +/- 0.10 |
| Leading edge radius | mm | +/- 0.05 |
| Cooling hole diameter | mm | +/- 0.05 |
| Cooling hole position (true position) | mm | <= 0.15 |
| Wall thickness (min) | mm | >= 0.75 |

**Acceptance Criteria:**
- PASS: All features within GD&T callouts on AS9102 FAI report
- FAIL: Any critical feature (airfoil profile, root form, wall thickness) out of tolerance; engineering disposition required
- Ref: AS9102 (First Article Inspection), AS9103 (Variation Management)

**Production Log Format:**
```
blade_id (string), casting_lot (string), test_date (date), airfoil_profile_dev_mm (float), root_width_dev_mm (float), chord_dev_mm (float), le_radius_dev_mm (float), cooling_hole_tp_mm (float), wall_thickness_min_mm (float), result (PASS/FAIL)
```
Sample: `BLD-HPT1-26-00441, CL-SC-2026-018, 2026-04-10, 0.032, 0.012, -0.04, 0.02, 0.08, 0.82, PASS`

**Source:** [CMM Quarterly - Airfoil Inspection](https://cmm-quarterly.squarespace.com/articles/measuring-airfoil-blades-on-a-coordinate-measuring-machine), [ZEISS Turbine Blade Inspection](https://www.zeiss.com/metrology/us/industries/aerospace/aircraft-engine/turbine-blade-inspection.html)

---

### Scenario 40: Composite Panel Ultrasonic C-Scan Inspection

**Industry & Product:** Aerospace -- Carbon fiber reinforced polymer (CFRP) wing skin panel (autoclave-cured prepreg)

**OEM Role:** Specifies ultrasonic C-scan acceptance criteria for delamination, porosity, and foreign objects per NASA PRC-6501 or equivalent OEM spec.

**Factory Role:** Through-transmission or pulse-echo C-scan of every cured composite panel using automated UT scanning bridge with water-coupled probes.

**Test Parameters & Real Numbers (NASA PRC-6501):**
| Defect Type | Unit | Acceptance Limit |
|---|---|---|
| Single delamination (length) | inch | < 1.0 |
| Single delamination (area) | sq in | < 0.785 |
| Multiple delaminations (separated < 6") | -- | Reject if multiple < 1" each, separated < 6" |
| Porosity (length) | inch | < 0.5 |
| Porosity (area) | sq in | < 0.196 |
| Porosity (signal drop vs. reference) | dB | Below tabulated threshold |
| Foreign object inclusion | -- | Not acceptable |

**Acceptance Criteria:**
- PASS: No delamination >= 1.0" length or >= 0.785 sq in area; no porosity >= 0.5" length
- FAIL: Any single delamination >= 1.0" or area >= 0.785 sq in; any foreign object detected
- Ref: NASA PRC-6501 (UT Inspection of Composites), ASTM E2580

**Production Log Format:**
```
panel_id (string), part_number (string), test_date (date), scan_area_sqft (float), indication_count (int), max_indication_length_in (float), max_indication_area_sqin (float), indication_type (string), signal_drop_db (float), result (ACCEPT/REJECT)
```
Sample: `WS-CFRP-26-00182, PN-7742-001, 2026-04-10, 48.5, 2, 0.35, 0.12, porosity, 4.2, ACCEPT`

**Source:** [NASA PRC-6501](https://www.nasa.gov/wp-content/uploads/2023/03/prc-6501-current.pdf), [ASTM E2580](https://store.astm.org/e2580-17.html)

---

### Scenario 41: Aerospace Fastener Tensile & Shear Testing

**Industry & Product:** Aerospace -- NAS1100 series alloy steel bolt (160 ksi Ftu, 95 ksi Fsu)

**OEM Role:** Specifies minimum tensile and shear strength per NAS1100 and NASM1312 test methods. Requires lot acceptance testing with statistical sampling.

**Factory Role:** Destructive tensile and double-shear test of fastener samples per NASM1312 Method 8 (tensile) and NASM1312 Method 13 (double shear) from each manufacturing lot.

**Test Parameters & Real Numbers (NAS1100 series, alloy steel):**
| Parameter | Unit | Specification |
|---|---|---|
| Ultimate tensile strength (Ftu) | ksi | >= 160 (1103 MPa) |
| Single shear strength (Fsu) | ksi | >= 95 (655 MPa) |
| Elongation (4D gauge length) | % | >= 10 |
| Hardness | HRC | 39 -- 45 |
| Proof load (thread stripping) | lbf | Per NAS table for bolt size |
| Hydrogen embrittlement test (sustained load, 200h) | -- | No failure |

**Acceptance Criteria:**
- PASS: Ftu >= 160 ksi, Fsu >= 95 ksi, elongation >= 10%, hardness 39-45 HRC
- FAIL: Any property below minimum; entire lot placed on hold
- Ref: NAS1100 (Bolts), NASM1312 (Fastener Test Methods)

**Production Log Format:**
```
lot_id (string), specimen_id (string), test_date (date), bolt_size (string), ftu_ksi (float), fsu_ksi (float), elongation_pct (float), hrc (float), proof_load_lbf (float), h2_test_result (PASS/FAIL), result (PASS/FAIL)
```
Sample: `LOT-NAS1100-26-014, TS-001, 2026-04-10, 5/16-24, 172.4, 102.8, 12.5, 42.3, 8500, PASS, PASS`

**Source:** [NASA Fastener Design Manual](https://ntrs.nasa.gov/api/citations/19900009424/downloads/19900009424.pdf), [NAS 4008](https://img.antpedia.com/standard/pdf/J13/1703/AIA_NAS%20NAS%204008-2007.pdf)

---

### Scenario 42: Wire Bond Pull Testing

**Industry & Product:** Semiconductor / Aerospace -- Gold wire bond on ceramic substrate hybrid microcircuit (1.0 mil Au wire)

**OEM Role:** Specifies minimum bond pull strength per MIL-STD-883, Method 2011.9, Test Condition A (destructive pull test).

**Factory Role:** Destructive pull test on sample bonds from each lot using calibrated pull tester (e.g., Dage or XYZTEC). Non-destructive pull test on 100% of flight hardware at lower force.

**Test Parameters & Real Numbers (MIL-STD-883, Method 2011.9):**
| Wire Type & Diameter | Unit | Minimum Pull Strength |
|---|---|---|
| Gold, 1.0 mil (25 um) | gf | >= 3.0 |
| Gold, 1.2 mil (30 um) | gf | >= 4.0 |
| Gold, 1.3 mil (33 um) | gf | >= 4.5 |
| Aluminum, 1.0 mil (25 um) | gf | >= 3.0 |
| Aluminum, 1.25 mil (32 um) | gf | >= 4.0 |
| Pull test accuracy | gf or % | +/- 5% or +/- 0.3 gf (whichever greater) |

**Acceptance Criteria:**
- PASS: All sampled bonds meet minimum pull strength per Table I for wire diameter/material
- FAIL: Any bond below minimum = lot rejection or additional sampling per MIL-STD-883 sampling plan
- Failure modes: bond lift (1), bond shear (2), wire break at neck (3), midspan break (4), cratering (5)
- Ref: MIL-STD-883, Method 2011.9

**Production Log Format:**
```
hybrid_id (string), bond_location (string), test_date (date), wire_type (string), wire_dia_mil (float), pull_force_gf (float), min_required_gf (float), failure_mode (int), result (PASS/FAIL)
```
Sample: `HYB-CERT-26-0042, U3-PIN12, 2026-04-10, Au, 1.0, 5.8, 3.0, 4, PASS`

**Source:** [MIL-STD-883 Method 2011.9 - XYZTEC](https://www.xyztec.com/knowledgecenter/guidelines/mil-std-883-method-2011-9-bond-strength-destructive-bond-pull-test/), [Q-Tech MIL-STD-883 2011.7 PDF](https://q-tech.com/wp-content/uploads/STD-883-2011.pdf)

---

### Scenario 43: Thermal Barrier Coating Thickness Measurement

**Industry & Product:** Aerospace -- YSZ (8% Yttria-Stabilized Zirconia) thermal barrier coating on gas turbine nozzle guide vane

**OEM Role:** Specifies TBC topcoat and bond coat thickness ranges per AMS 2447 and OEM process spec. Thickness affects thermal insulation performance and durability.

**Factory Role:** Measures coating thickness on every coated part using eddy current, cross-section metallography (destructive sampling), or terahertz reflectometry.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| YSZ topcoat thickness | um | 300 -- 500 |
| NiCrAlY bond coat thickness | um | 75 -- 150 |
| Total TBC system thickness | um | 375 -- 650 |
| Topcoat porosity (metallographic) | % | 12 -- 18 |
| Surface roughness (Ra) of topcoat | um | 8 -- 15 |
| Adhesion strength (ASTM C633) | MPa | >= 20 |

**Acceptance Criteria:**
- PASS: Topcoat 300-500 um, bond coat 75-150 um, porosity 12-18%, adhesion >= 20 MPa
- FAIL: Topcoat < 300 um (insufficient thermal protection) or > 500 um (spallation risk)
- Ref: AMS 2447 (Ceramic TBC), ASTM C633 (Adhesion/Cohesion Strength), ISO 17834

**Production Log Format:**
```
part_id (string), coating_lot (string), test_date (date), topcoat_um (float), bondcoat_um (float), total_um (float), porosity_pct (float), roughness_ra_um (float), adhesion_mpa (float), result (PASS/FAIL)
```
Sample: `NGV-26-00091, CL-TBC-W15, 2026-04-10, 412, 108, 520, 14.8, 11.2, 28.5, PASS`

**Source:** [TBC Wikipedia](https://en.wikipedia.org/wiki/Thermal_barrier_coating), [ETN Practical Guide for TBCs](https://etn.global/wp-content/uploads/2018/03/A-practical-guide-for-TBCs-in-gas-turbines.pdf)

---

### Scenario 44: Aerospace Composite Cured Ply Thickness Verification

**Industry & Product:** Aerospace -- Carbon/epoxy prepreg layup (e.g., Hexcel IM7/8552, 24-ply quasi-isotropic)

**OEM Role:** Specifies nominal cured ply thickness (CPT) and total laminate thickness tolerance. Deviation indicates fiber volume fraction issues or incorrect ply count.

**Factory Role:** Measures cured laminate thickness at multiple points using micrometer or ultrasonic thickness gauge, compares to theoretical thickness.

**Test Parameters & Real Numbers (IM7/8552 prepreg):**
| Parameter | Unit | Specification |
|---|---|---|
| Nominal CPT (IM7/8552, 190 gsm) | mm | 0.131 (per Hexcel datasheet) |
| Total theoretical thickness (24 plies) | mm | 3.144 |
| Laminate thickness tolerance | mm | +/- 0.25 (i.e., 2.894 -- 3.394) |
| Fiber volume fraction (target) | % | 57 -- 63 |
| Void content (max) | % | <= 2.0 |
| Glass transition temp (Tg, DMA) | deg C | >= 185 |

**Acceptance Criteria:**
- PASS: Total thickness 2.894-3.394 mm, fiber volume 57-63%, void content <= 2.0%
- FAIL: Thickness outside tolerance (may indicate incorrect ply count, excess resin, or under-cure)
- Ref: Hexcel IM7/8552 datasheet, ASTM D3171 (fiber content), ASTM D2734 (void content)

**Production Log Format:**
```
panel_id (string), layup_code (string), test_date (date), thickness_pt1_mm (float), thickness_pt2_mm (float), thickness_pt3_mm (float), thickness_avg_mm (float), fiber_vol_pct (float), void_pct (float), tg_c (float), result (PASS/FAIL)
```
Sample: `COMP-QI24-26-0044, [0/45/90/-45]3s, 2026-04-10, 3.15, 3.18, 3.12, 3.15, 59.2, 1.1, 192, PASS`

**Source:** Hexcel IM7/8552 datasheet, ASTM D3171, NASA PRC-6501

---

## SERVICES / OTHER (6 Scenarios)

---

### Scenario 45: Solar Panel IV Curve Testing

**Industry & Product:** Renewable Energy -- 400W monocrystalline PERC solar module (72-cell, residential)

**OEM Role:** Specifies electrical performance parameters at Standard Test Conditions (STC: 1000 W/m2, AM 1.5G, 25 deg C) per IEC 61215 and datasheet values.

**Factory Role:** Flash-tests 100% of modules on solar simulator (Class AAA per IEC 60904-9) to measure complete IV curve and extract key parameters.

**Test Parameters & Real Numbers (400W class module):**
| Parameter | Unit | Specification |
|---|---|---|
| Maximum power (Pmax) | W | 400 +3%/-0% (400 -- 412) |
| Open circuit voltage (Voc) | V | 49.5 +/- 3% (48.0 -- 51.0) |
| Short circuit current (Isc) | A | 10.36 +/- 3% (10.05 -- 10.67) |
| Voltage at Pmax (Vmp) | V | 41.2 +/- 5% |
| Current at Pmax (Imp) | A | 9.71 +/- 5% |
| Fill factor (FF) | % | >= 76% |
| Module efficiency | % | >= 20.0% |

**Acceptance Criteria:**
- PASS: Pmax >= 400W (positive tolerance only; 0/-3% is OEM industry standard), Voc and Isc within +/- 3%
- FAIL: Pmax < 400W, or Voc/Isc outside +/- 5% (indicates cell damage or interconnect issue)
- Power grade: Module labeled by measured Pmax (e.g., 400W, 405W, 410W in 5W bins)
- Ref: IEC 61215 (Design qualification), IEC 60904 (IV measurement)

**Production Log Format:**
```
module_id (string), test_date (date), pmax_w (float), voc_v (float), isc_a (float), vmp_v (float), imp_a (float), ff_pct (float), efficiency_pct (float), power_bin_w (int), result (PASS/FAIL)
```
Sample: `MOD-PERC-400-26-00881, 2026-04-10, 408.2, 49.8, 10.42, 41.5, 9.84, 78.4, 20.4, 410, PASS`

**Source:** [Trina Solar Vertex Datasheet](https://static.trinasolar.com/sites/default/files/EN_Datasheet_Vertex_DE09.pdf), [PV Education IV Curve](https://www.pveducation.org/pvcdrom/solar-cell-operation/iv-curve)

---

### Scenario 46: Textile Tensile Strength Testing (Grab Method)

**Industry & Product:** Textile Manufacturing -- Polyester/cotton blend woven fabric (for workwear, 240 g/m2)

**OEM Role:** Specifies minimum breaking force and elongation per ASTM D5034 (grab test) for commercial acceptance of fabric rolls.

**Factory Role:** Destructive tensile testing of fabric samples (warp and weft directions) from each production lot using CRE tensile tester.

**Test Parameters & Real Numbers (ASTM D5034, Workwear Fabric):**
| Parameter | Unit | Specification |
|---|---|---|
| Breaking force (warp direction) | N | >= 450 |
| Breaking force (weft direction) | N | >= 350 |
| Elongation at break (warp) | % | 15 -- 35 |
| Elongation at break (weft) | % | 18 -- 40 |
| Specimen width | mm | 100 +/- 1 |
| Gauge length | mm | 75 (ASTM D5034) |
| Crosshead speed | mm/min | 300 +/- 10 |

**Acceptance Criteria:**
- PASS: Breaking force >= 450 N (warp), >= 350 N (weft), elongation within range
- FAIL: Breaking force below minimum in either direction; fabric roll rejected
- Ref: ASTM D5034-21 (Grab Test), ISO 13934-2

**Production Log Format:**
```
lot_id (string), roll_id (string), test_date (date), direction (string), breaking_force_n (float), elongation_pct (float), specimen_width_mm (float), result (PASS/FAIL)
```
Sample: `LOT-TXT-2026-088, ROLL-042, 2026-04-10, warp, 512.3, 22.8, 100.0, PASS`

**Source:** [ASTM D5034 - Instron](https://www.instron.com/en/testing-solutions/astm-standards/astm-d5034/), [ZwickRoell Grab Test](https://www.zwickroell.com/industries/textiles/grab-test-astm-d5034-iso-13934-2/)

---

### Scenario 47: Concrete Compression Testing

**Industry & Product:** Construction -- Ready-mix concrete (specified compressive strength f'c = 4000 psi / 28 MPa, 28-day)

**OEM Role:** Specifies minimum compressive strength per ACI 318 and project structural design requirements. Testing per ASTM C39.

**Factory Role:** Casts test cylinders per ASTM C31, cures for 7 and 28 days, then compression-tests on hydraulic testing machine per ASTM C39.

**Test Parameters & Real Numbers (f'c = 4000 psi / 28 MPa):**
| Parameter | Unit | Specification |
|---|---|---|
| Specified compressive strength (f'c) | psi | 4000 (28 MPa) |
| Average of 3 consecutive tests | psi | >= f'c = 4000 |
| No individual test result below | psi | f'c - 500 = 3500 |
| Loading rate | psi/s | 35 +/- 7 |
| Cylinder size | in (mm) | 6x12 or 4x8 |
| Curing temperature | deg F (deg C) | 73 +/- 3 (23 +/- 2) |
| 7-day target (typical) | psi | >= 2800 (70% of f'c) |
| 28-day design strength | psi | >= 4000 |

**Acceptance Criteria:**
- PASS: Average of any 3 consecutive tests >= 4000 psi; no individual test < 3500 psi (f'c - 500)
- FAIL: Average < 4000 psi, or any individual test < 3500 psi; triggers investigation per ACI 318
- Ref: ASTM C39 (Compressive Strength), ASTM C31 (Making/Curing Specimens), ACI 318

**Production Log Format:**
```
batch_id (string), cylinder_id (string), test_date (date), age_days (int), diameter_in (float), length_in (float), max_load_lbf (int), strength_psi (int), fracture_type (int), result (PASS/FAIL)
```
Sample: `RMX-2026-0312-A, CYL-28D-001, 2026-04-10, 28, 6.01, 12.02, 114200, 4025, 3, PASS`

**Source:** [ASTM C39 - Forney](https://forneyonline.com/simple-guide-astm-c39/), [NRMCA CIP 35](https://www.nrmca.org/wp-content/uploads/2021/01/35pr.pdf)

---

### Scenario 48: Water Treatment Chemical Analysis

**Industry & Product:** Municipal Utility -- Drinking water treatment plant effluent testing

**OEM Role:** Municipal water authority specifies compliance with EPA National Primary Drinking Water Regulations (NPDWR) for all regulated contaminants.

**Factory Role:** Water treatment plant laboratory performs daily chemical and microbiological analysis of treated water before distribution.

**Test Parameters & Real Numbers (EPA NPDWR MCLs, selected contaminants):**
| Parameter | Unit | MCL (Maximum Contaminant Level) |
|---|---|---|
| Total Trihalomethanes (TTHM) | mg/L | <= 0.080 |
| Haloacetic acids (HAA5) | mg/L | <= 0.060 |
| Lead | mg/L | <= 0.015 (action level) |
| Copper | mg/L | <= 1.3 (action level) |
| Arsenic | mg/L | <= 0.010 |
| Nitrate (as N) | mg/L | <= 10 |
| Fluoride | mg/L | <= 4.0 |
| Turbidity | NTU | <= 0.3 (95th percentile); never > 1.0 |
| Total coliform | -- | <= 5% of monthly samples positive |
| Free chlorine residual | mg/L | 0.2 -- 4.0 (min for disinfection, max for MCL) |

**Acceptance Criteria:**
- PASS: All parameters below respective MCLs, turbidity <= 0.3 NTU (95th percentile)
- FAIL: Any MCL exceedance triggers public notification and corrective action per SDWA
- Ref: EPA NPDWR (40 CFR Part 141), Safe Drinking Water Act (SDWA)

**Production Log Format:**
```
plant_id (string), sample_point (string), sample_date (date), tthm_mg_l (float), haa5_mg_l (float), lead_mg_l (float), copper_mg_l (float), arsenic_mg_l (float), nitrate_mg_l (float), turbidity_ntu (float), free_cl_mg_l (float), coliform_present (bool), result (PASS/FAIL)
```
Sample: `WTP-CENTRAL, CLEARWELL_EFF, 2026-04-10, 0.042, 0.031, 0.003, 0.22, 0.002, 2.8, 0.08, 1.2, false, PASS`

**Source:** [EPA NPDWR](https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations), [EPA Secondary Standards](https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals)

---

### Scenario 49: Packaging Seal Integrity Testing

**Industry & Product:** Medical Device Packaging -- Sterile medical device pouch (Tyvek/PET peel pouch)

**OEM Role:** Specifies seal strength and package integrity per ISO 11607-1/-2 (Packaging for Terminally Sterilized Medical Devices) and ASTM F88 (Seal Strength).

**Factory Role:** Seal strength testing (ASTM F88) on sample pouches from each seal run; burst testing (ASTM F2054) and dye penetration (ASTM F1929) for integrity verification.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Seal strength (ASTM F88, peel, 15mm width) | N/15mm | 1.5 -- 8.0 (min 1.5N per ISO 11607-1) |
| Seal strength (average) | N/15mm | >= 2.5 (typical OEM target) |
| Burst test pressure (restrained, ASTM F2054) | kPa | >= 17 (2.5 psi) |
| Seal width | mm | 6.0 +/- 1.0 |
| Dye penetration (ASTM F1929) | -- | No channel defects through seal |
| Visual seal inspection | -- | No wrinkles, misalignment, or contamination |

**Acceptance Criteria:**
- PASS: Seal strength 1.5-8.0 N/15mm (peelable seal), no dye penetration, burst >= 17 kPa
- FAIL: Seal strength < 1.5 N/15mm (inadequate barrier), or > 8.0 N/15mm (not peelable), or dye penetration detected
- Ref: ISO 11607-1/-2, ASTM F88, ASTM F2054, ASTM F1929

**Production Log Format:**
```
lot_id (string), pouch_id (string), test_date (date), seal_strength_avg_n_15mm (float), seal_strength_min_n_15mm (float), burst_pressure_kpa (float), seal_width_mm (float), dye_pen_result (PASS/FAIL), visual_result (PASS/FAIL), result (PASS/FAIL)
```
Sample: `PKG-MED-2026-042, POUCH-001, 2026-04-10, 4.2, 3.1, 24.5, 6.2, PASS, PASS, PASS`

**Source:** [ASTM F88 - Instron](https://www.instron.com/en/testing-solutions/astm-standards/astm-f88-seal-strength/), [ISO 11607 Peel Tests](https://www.andilog.com/content/peeling-test-on-terminally-sterilized-medical-packaging-ISO-11607-1-et-2.html)

---

### Scenario 50: Solar Cell Electroluminescence (EL) Imaging

**Industry & Product:** Renewable Energy -- Monocrystalline silicon solar cell (M10 format, 182x182 mm)

**OEM Role:** Specifies EL image quality criteria for cell defect classification: no cracks, inactive areas, or dark regions exceeding defined thresholds.

**Factory Role:** Forward-biases each cell at ~0.6-0.7V in dark chamber; captures near-infrared (NIR) image with cooled CCD camera; automated image analysis classifies defects.

**Test Parameters & Real Numbers:**
| Parameter | Unit | Specification |
|---|---|---|
| Forward bias voltage | V | 0.60 -- 0.70 |
| Minimum inactive area (dark region) | % of cell area | <= 2.0 (Grade A) |
| Crack length (maximum single crack) | mm | <= 10 (Grade A), <= 20 (Grade B) |
| Number of cracks | count | <= 1 (Grade A), <= 3 (Grade B) |
| Edge chipping | mm | <= 0.5 from edge |
| Shunt detection (hot spots) | -- | No hot spots > 5x surrounding luminance |
| Cell efficiency (from IV) | % | >= 22.0 (Grade A) |

**Acceptance Criteria:**
- Grade A: Inactive area <= 2%, max 1 crack <= 10 mm, no hot spots, efficiency >= 22%
- Grade B: Inactive area <= 5%, max 3 cracks <= 20 mm, efficiency >= 21%
- Grade C/Reject: Outside Grade B limits
- Ref: IEC TS 60904-13 (EL imaging), manufacturer quality classification system

**Production Log Format:**
```
cell_id (string), wafer_lot (string), test_date (date), inactive_area_pct (float), crack_count (int), max_crack_length_mm (float), hot_spot_detected (bool), efficiency_pct (float), grade (A/B/C/REJECT)
```
Sample: `CELL-M10-26-084421, WL-MONO-2026-042, 2026-04-10, 0.8, 0, 0, false, 23.1, A`

**Source:** [IEC TS 60904-13], [IEC 61215 qualification tests](https://winaico.com/blog/iec-61215/)

---

## Summary Table

| # | Sector | Scenario | Key Standard | Key Parameter |
|---|---|---|---|---|
| 1 | Electronics | Camera Module MTF/SFR | ISO 12233:2017 | MTF >= 0.50 at Nyq/2 |
| 2 | Electronics | PCB AOI | IPC-A-610J Class 2 | Zero defects |
| 3 | Electronics | SMT Solder Paste (SPI) | IPC-7527 | Volume 60-160% |
| 4 | Electronics | Display Luminance/Color | VESA DisplayHDR 400 | >= 400 cd/m2 peak |
| 5 | Electronics | Battery Cell Capacity | IEC 62660-1 | Capacity +/-3%, impedance <= 25 mohm |
| 6 | Electronics | MEMS Accelerometer | IEEE-STD-1293 | Offset +/-40 mg |
| 7 | Electronics | RF Antenna VSWR | Industry standard | VSWR <= 1.92:1 |
| 8 | Electronics | Connector Resistance | MIL-DTL-38999 | <= 14.6 mohm (size 22D) |
| 9 | Electronics | LED Binning | ANSI C78.377-2024 | 3-step MacAdam ellipse |
| 10 | Electronics | Touch Panel Linearity | Industry spec | <= 1.0 mm center |
| 11 | Electronics | Battery Formation/Grading | IEC 62660-1 | K-value <= 5.0 uV/h |
| 12 | Electronics | PCB In-Circuit Test | IPC-9252A | All components within tolerance |
| 13 | Automotive | Brake Pad Friction | SAE J866/J2521 | mu 0.35-0.45 (code FF) |
| 14 | Automotive | Engine Block CMM | ISO 8062-3 | Bore +/- 0.010 mm |
| 15 | Automotive | Wiring Harness Continuity | IPC/WHMA-A-620 | <= calc. max resistance |
| 16 | Automotive | Airbag Inflator Leak | ISO 12097-3 | He leak <= 1e-6 mbar*L/s |
| 17 | Automotive | Wheel Rim Runout | SAE J267 | <= 0.50 mm |
| 18 | Automotive | Paint Thickness (DFT) | ISO 2808 | Total 95-135 um |
| 19 | Automotive | Seat Belt Tensile | FMVSS 209 | >= 11,120 N |
| 20 | Automotive | EV Battery Thermal | IEC 62660/UN 38.3 | Max cell temp <= 45 deg C |
| 21 | Automotive | Headlamp Photometry | ECE R112 | B50L <= 350 cd |
| 22 | Automotive | Brake Caliper Pressure | SAE J1153 | Zero leak at 150 bar |
| 23 | Steel/Metals | Steel Chemistry (MTC) | ASTM A36 | C <= 0.26%, S <= 0.05% |
| 24 | Steel/Metals | Tensile Strength | ASTM A370/A36 | YS >= 250 MPa, UTS 400-550 |
| 25 | Steel/Metals | Charpy Impact | ASTM E23 | >= 27 J avg at -30 deg C |
| 26 | Steel/Metals | Rockwell Hardness | ASTM E18 | 28-34 HRC (4140 Q&T) |
| 27 | Steel/Metals | Pipe UT Wall Thickness | API 5L | >= 87.5% nominal WT |
| 28 | Steel/Metals | Weld Radiographic (RT) | AWS D1.1 | No cracks; porosity <= 2.5 mm |
| 29 | Steel/Metals | Brinell Hardness | ASTM E10/A105 | <= 187 HBW |
| 30 | Steel/Metals | Plate UT Lamination | ASTM A435 | No lamination > 80 mm dia |
| 31 | Food/Pharma | Bottled Water Micro | FDA 21 CFR 165 | Zero coliforms |
| 32 | Food/Pharma | Tablet Weight Uniformity | USP <905> | +/- 5% (> 250 mg tablets) |
| 33 | Food/Pharma | Food Allergen ELISA | FDA FALCPA | Peanut < 2.5 ppm |
| 34 | Food/Pharma | Dairy Fat Content | ISO 19662 | 3.25 +/- 0.15% |
| 35 | Food/Pharma | Cooking Oil Peroxide | Codex STAN 210 | <= 10 meq O2/kg |
| 36 | Food/Pharma | Drug Dissolution | USP <711> | Q = 80% in 30 min |
| 37 | Food/Pharma | Tablet Hardness | USP <1217> | 80-150 N |
| 38 | Food/Pharma | Beverage pH/Brix | 21 CFR 146 | Brix 11.0-12.5 |
| 39 | Aerospace | Turbine Blade CMM | AS9102 | Profile +/- 0.075 mm |
| 40 | Aerospace | Composite C-Scan | NASA PRC-6501 | Delam < 1.0" length |
| 41 | Aerospace | Fastener Tensile/Shear | NAS1100/NASM1312 | Ftu >= 160 ksi |
| 42 | Aerospace | Wire Bond Pull | MIL-STD-883 2011.9 | >= 3.0 gf (1.0 mil Au) |
| 43 | Aerospace | TBC Thickness | AMS 2447 | Topcoat 300-500 um |
| 44 | Aerospace | Composite Ply Thickness | ASTM D3171 | Total +/- 0.25 mm |
| 45 | Services | Solar Panel IV Curve | IEC 61215 | Pmax >= 400W |
| 46 | Services | Textile Tensile | ASTM D5034 | >= 450 N (warp) |
| 47 | Services | Concrete Compression | ASTM C39/ACI 318 | >= 4000 psi (28 day) |
| 48 | Services | Water Treatment Chem | EPA NPDWR | All params < MCL |
| 49 | Services | Packaging Seal Integrity | ASTM F88/ISO 11607 | 1.5-8.0 N/15mm |
| 50 | Services | Solar Cell EL Imaging | IEC TS 60904-13 | Inactive area <= 2% |

---

## Key Standards Referenced

| Standard | Title | Issuing Body |
|---|---|---|
| ISO 12233:2017 | Photography -- Resolution and SFR measurement | ISO |
| IPC-A-610J | Acceptability of Electronic Assemblies | IPC |
| IPC-7527 | Requirements for Solder Paste Printing | IPC |
| VESA DisplayHDR CTS v1.2 | Display HDR Compliance Test Specification | VESA |
| IEC 62660-1/-2/-3 | Secondary Li-ion cells for EV propulsion | IEC |
| IEEE-STD-1293 | IEEE Standard for Specification Format Guide | IEEE |
| MIL-DTL-38999 | Connectors, Electrical, Circular | US DoD |
| ANSI C78.377-2024 | Chromaticity of SSL Products | ANSI/NEMA |
| SAE J866 | Friction Coefficient Identification | SAE |
| SAE J2521 | Disc Brake Dynamometer Squeal Noise | SAE |
| ISO 8062-3 | Casting Tolerances | ISO |
| IPC/WHMA-A-620 | Acceptability of Cable/Wire Harness | IPC/WHMA |
| ISO 12097-3 | Road Vehicles -- Airbag Inflator Testing | ISO |
| SAE J267 | Wheels/Rims Performance Requirements | SAE |
| ISO 2808:2019 | Paints -- Determination of Film Thickness | ISO |
| FMVSS 209 (49 CFR 571.209) | Seat Belt Assemblies | NHTSA |
| ASTM A36/A36M | Carbon Structural Steel | ASTM |
| ASTM A370 | Mechanical Testing of Steel Products | ASTM |
| ASTM E23 | Notched Bar Impact Testing | ASTM |
| ASTM E18 | Rockwell Hardness Testing | ASTM |
| ASTM E10 | Brinell Hardness Testing | ASTM |
| API 5L | Line Pipe Specification | API |
| AWS D1.1 | Structural Welding Code -- Steel | AWS |
| ASTM A435 | Straight-Beam UT of Steel Plates | ASTM |
| FDA 21 CFR 165.110 | Bottled Water | FDA |
| USP <905> | Uniformity of Dosage Units | USP |
| USP <711> | Dissolution | USP |
| ISO 19662 / IDF 238 | Milk Fat -- Gerber Method | ISO/IDF |
| Codex STAN 210 | Named Vegetable Oils | Codex Alimentarius |
| AS9102 | Aerospace First Article Inspection | SAE/AS |
| NASA PRC-6501 | UT Inspection of Composites | NASA |
| NAS1100 / NASM1312 | Aerospace Fastener Standards | AIA |
| MIL-STD-883 Method 2011.9 | Bond Strength (Destructive Pull) | US DoD |
| AMS 2447 | Ceramic Thermal Barrier Coatings | SAE/AMS |
| IEC 61215 | PV Module Design Qualification | IEC |
| ASTM D5034 | Textile Tensile Strength (Grab Test) | ASTM |
| ASTM C39 | Compressive Strength of Concrete Cylinders | ASTM |
| EPA NPDWR (40 CFR 141) | National Primary Drinking Water Regulations | EPA |
| ASTM F88 / ISO 11607 | Seal Strength / Sterile Packaging | ASTM/ISO |
| IEC TS 60904-13 | EL Imaging of PV Devices | IEC |
