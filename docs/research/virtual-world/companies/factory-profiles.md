# Virtual World: 25 Factory Profiles for Fairbuild Contract Builder Studio

> Each profile is detailed enough to generate realistic sample production log CSVs.
> All company names are fictional. No real company names are used.

---

## ELECTRONICS FACTORIES (8)

---

### Factory 01: Huaqiang Optics & Module Co., Ltd.

**Industry:** Consumer Electronics -- Camera Module Assembly

**Location:** Shenzhen, Guangdong, China

**Employee Count:** 4,200

**Annual Revenue:** $380M

**Capabilities:**
- Camera module assembly for smartphones (8 MP to 200 MP), automotive, and IoT
- Lens alignment and active alignment (AA) stations with 6-DOF piezo stages
- Automated SFR/MTF testing per ISO 12233 on every unit
- OIS (optical image stabilization) calibration and PDAF (phase-detection autofocus) map generation
- Dust-free Class 1000 / Class 100 cleanrooms for sensor die bonding
- COB (chip-on-board) wire bonding and flip-chip assembly

**Certifications:** ISO 9001:2015, ISO 14001:2015, IATF 16949 (automotive camera line), Sony Green Partner

**Test Equipment:**
- 48x Imatest Master stations with custom LED light boxes and slanted-edge charts
- 12x Trioptics ImageMaster PRO for MTF measurement
- Keysight 34980A data acquisition for temperature monitoring
- Custom AA stations with Cognex In-Sight 9000 vision systems
- Keyence IM-8000 instant measurement for mechanical dimensions

**Data Systems:**
- MES: Aegis FactoryLogix (tracks serial number through all stations)
- ERP: SAP S/4HANA
- Test data export: CSV files per shift, uploaded to MES via FTP. Columns mapped to SAP quality notifications.
- Data retention: 5 years on local NAS, archived to Alibaba Cloud OSS

**Current Test Log Format:**
```
File: cam_module_sfr_{date}_{line}.csv
Columns: serial_no (string), timestamp (ISO 8601), station_id (string), operator_id (string), mtf_nyq2_center (float), mtf_nyq4_center (float), mtf_nyq2_corner_worst (float), mtf_nyq4_corner_worst (float), rel_illumination_pct (float), optical_center_offset_px (float), aa_tilt_x_arcmin (float), aa_tilt_y_arcmin (float), result (PASS/FAIL), fail_code (string)
```
Sample row: `CAM-2026-04-142881, 2026-04-10T08:31:22+08:00, AA-LINE3-STA07, OP-1142, 0.55, 0.74, 0.33, 0.52, 45.2, 11.3, 0.8, -0.4, PASS, -`

**Typical Clients:**
- Tier-1 smartphone OEMs (top-5 Chinese brands, one Korean brand)
- European automotive Tier-1 suppliers (ADAS camera modules)
- Japanese industrial camera integrators

**Pain Points:**
- OEM payment terms are Net-90 to Net-120; cash flow gap is critical during ramp seasons (Aug-Oct)
- Quality disputes take 3-6 weeks to resolve because OEM IQC re-tests with different equipment and methodology; no shared immutable record
- Each OEM requires a different CSV column layout; factory maintains 7 export templates
- Yield data is shared via email with screenshots of SPC charts; no real-time OEM visibility

**Why They'd Use Fairbuild:**
- Escrow-based payment tied to verified quality data would reduce DSO from 95 days to ~30 days
- Immutable on-chain test records eliminate "he-said-she-said" quality disputes
- Standardized schema means one export format for all OEMs
- Real-time yield dashboards visible to OEMs would reduce audit frequency

---

### Factory 02: Suzhou Weida Electronic Assembly Co., Ltd.

**Industry:** Electronics Manufacturing -- PCB Assembly (SMT/THT)

**Location:** Suzhou Industrial Park, Jiangsu, China

**Employee Count:** 2,800

**Annual Revenue:** $210M

**Capabilities:**
- High-mix, medium-volume SMT assembly (8 SMT lines, capacity 15M placements/day)
- 01005 to large BGA placement; PoP (package-on-package) capability
- Selective wave soldering and manual through-hole for mixed assemblies
- Conformal coating and potting for automotive/industrial boards
- Box-build and system integration (cable assembly, final test, packaging)

**Certifications:** ISO 9001:2015, IATF 16949:2016, IPC-A-610 Class 3 trained workforce, ISO 13485 (medical device line), UL recognized

**Test Equipment:**
- 8x Koh Young Zenith 3D SPI systems (one per SMT line)
- 8x Koh Young Meister 3D AOI (post-reflow)
- 2x Nordson DAGE XD7800 X-ray (BGA/QFN inspection)
- 4x Keysight i3070 ICT systems (bed-of-nails)
- 2x Keysight Medalist i5000 flying probe testers
- 6x custom functional test stations (NI PXI-based)

**Data Systems:**
- MES: iTAC MES Suite (full traceability from paste print to shipment)
- ERP: Oracle NetSuite
- SPI/AOI data: Koh Young KSMART analytics platform exports per-board JSON; aggregated to CSV daily
- ICT data: Keysight TestExec SL exports XML per board; converted to CSV for customer reports

**Current Test Log Format:**
```
File: spi_inspection_{date}_{line}.csv
Columns: board_id (string), timestamp (ISO 8601), line_id (string), pad_count_inspected (int), volume_fail_count (int), height_fail_count (int), offset_fail_count (int), bridge_count (int), cpk_volume (float), result (PASS/FAIL)

File: aoi_inspection_{date}_{line}.csv
Columns: board_id (string), timestamp (ISO 8601), line_id (string), total_components (int), missing_count (int), offset_defect_count (int), bridge_count (int), insuff_solder_count (int), tombstone_count (int), polarity_defect_count (int), total_defects (int), result (PASS/FAIL)

File: ict_results_{date}.csv
Columns: board_id (string), timestamp (ISO 8601), fixture_id (string), total_tests (int), pass_count (int), fail_count (int), first_fail_component (string), first_fail_measured (string), first_fail_expected (string), test_time_s (float), result (PASS/FAIL)
```

**Typical Clients:**
- Automotive Tier-1 ECU manufacturers (European, Japanese)
- Industrial IoT gateway companies (US, European)
- Medical device OEMs requiring ISO 13485 traceability
- Consumer electronics brands (smart home devices)

**Pain Points:**
- Automotive OEMs require full traceability but each has a different portal for uploading quality data (Bosch SupplyOn, Continental EDI, etc.)
- Payment milestones tied to PPAP approval; delays in PPAP sign-off cause 60-90 day payment gaps
- SPI/AOI/ICT data sits in 3 separate systems; no unified view for OEM quality reviews
- Annual audit costs $50K-80K per OEM; 4-5 OEMs audit per year

**Why They'd Use Fairbuild:**
- Unified quality credential visible to all OEMs reduces redundant audits
- Milestone-based escrow payment on PPAP acceptance eliminates sign-off delays
- Single data schema across SPI, AOI, and ICT gives OEMs holistic view
- On-chain records satisfy automotive traceability requirements (IATF 16949 Section 8.5.2)

---

### Factory 03: Dongguan Mingguang Display Technology Co., Ltd.

**Industry:** Consumer Electronics -- LCD and OLED Display Module Assembly

**Location:** Dongguan, Guangdong, China

**Employee Count:** 6,500

**Annual Revenue:** $720M

**Capabilities:**
- LCD module assembly (TFT-IPS, VA panels from 5" to 32")
- OLED module assembly (rigid and flexible AMOLED, 5.5" to 6.8")
- Driver IC COG/COF bonding with ACF (anisotropic conductive film)
- Backlight unit (BLU) assembly with LED bar and light guide plate
- Optical bonding (OCA/OCR) for sunlight-readable and automotive displays
- Spectroradiometric testing per VESA DisplayHDR CTS

**Certifications:** ISO 9001:2015, ISO 14001:2015, QC 080000 (HSPM), IATF 16949 (automotive display line)

**Test Equipment:**
- 24x Konica Minolta CA-410 display color analyzers
- 6x Instrument Systems CAS 140CT spectroradiometers with DTS-series telescopes
- 12x custom luminance uniformity stations (9-point and 13-point measurement)
- 4x Admesy Hyperion imaging colorimeters for full-screen uniformity mapping
- 2x Weiss Technik temperature chambers (-40 to +85 C) for thermal testing

**Data Systems:**
- MES: Siemens Opcenter Execution (formerly Camstar)
- ERP: SAP ECC 6.0
- Test data: Each station writes a row to MS SQL Server via ODBC; nightly batch export to CSV for customer reports
- Custom dashboard: .NET web app showing real-time yield by product/line; OEM-facing portal with 24-hour delay

**Current Test Log Format:**
```
File: display_test_{product}_{date}.csv
Columns: panel_id (string), timestamp (ISO 8601), line_id (string), peak_lum_cdm2 (float), sustained_lum_cdm2 (float), black_level_cdm2 (float), contrast_ratio (int), bt709_coverage_pct (float), dcip3_coverage_pct (float), uniformity_9pt_pct (float), delta_e_avg (float), mura_defect_count (int), result (PASS/FAIL), grade (A/B/C)
```
Sample row: `LCD-156-08821, 2026-04-10T10:02:33+08:00, MOD-LINE-2, 435.2, 268.7, 0.32, 1360, 99.6, 92.1, 88.4, 1.8, 0, PASS, A`

**Typical Clients:**
- Laptop OEMs (top-3 global brands)
- Automotive instrument cluster Tier-1 suppliers
- Medical monitor OEMs requiring IEC 62563-1 compliance
- Industrial HMI display integrators

**Pain Points:**
- Display grading disputes: OEM re-tests panels with different color analyzer calibration; grade A at factory becomes grade B at IQC
- Payment withheld on entire shipment when a single-digit percentage fails IQC re-grading
- Each OEM has different luminance/color specifications for same panel size; version control of specs is manual
- Mura (luminance non-uniformity) is subjective; no agreed automated pass/fail algorithm

**Why They'd Use Fairbuild:**
- Shared calibration reference and standardized test methodology eliminates grading disputes
- Granular per-panel payment release (pay for grade A panels immediately, dispute only borderline units)
- Spec version control on-chain ensures factory and OEM always reference the same document
- Automated mura detection algorithm agreed in smart contract eliminates subjectivity

---

### Factory 04: Shenzhen Longwei Battery Technology Co., Ltd.

**Industry:** Energy Storage -- Lithium-Ion Battery Cell Manufacturing

**Location:** Shenzhen (R&D) + Dongguan (production), Guangdong, China

**Employee Count:** 3,800

**Annual Revenue:** $550M

**Capabilities:**
- 21700 and prismatic Li-ion cell manufacturing (NMC 811, LFP chemistries)
- Electrode coating, calendering, slitting, winding/stacking
- Electrolyte filling in dry room (dew point < -40 C)
- Formation cycling (multi-step CC-CV protocols, 512-channel formation cabinets)
- End-of-line testing: capacity, AC impedance, OCV, self-discharge (K-value over 7-14 day aging)
- Cell matching and sorting for pack-level consistency

**Certifications:** ISO 9001:2015, IATF 16949:2016, UL 1642, UL 2580 (EV), IEC 62619, UN 38.3 (transport), CB Scheme

**Test Equipment:**
- 40x Neware BTS-4000 battery test systems (512 channels each)
- 8x Hioki BT3562 battery impedance analyzers (1 kHz AC)
- 4x Maccor Series 4000 high-precision cyclers (for R&D and qualification)
- 2x ESPEC thermal chambers (for temperature-controlled testing)
- 1x Agilent 4294A precision impedance analyzer (EIS measurements, R&D)
- High-speed sorting machines for capacity/impedance binning

**Data Systems:**
- MES: Custom-built (Python/PostgreSQL), developed in-house
- ERP: Kingdee K/3
- Formation and test data: Neware BTSDA software exports .nda (proprietary binary) and CSV
- K-value aging data: Logged to PostgreSQL with Python scripts; exported as CSV weekly
- Customer-facing: PDF test reports per lot with summary statistics; raw CSV on request

**Current Test Log Format:**
```
File: cell_eol_test_{lot}_{date}.csv
Columns: cell_id (string), lot_id (string), timestamp (ISO 8601), chemistry (string), capacity_mah (float), impedance_mohm (float), ocv_v (float), self_discharge_mv_72h (float), weight_g (float), temp_delta_1c_c (float), capacity_bin (string), impedance_bin (string), result (PASS/FAIL)
```
Sample row: `CELL-21700-085442, LOT-2026W15, 2026-04-10T14:22:07+08:00, NMC811, 4982, 18.3, 3.72, 12.5, 69.8, 2.1, A1, Z1, PASS`

**Typical Clients:**
- EV battery pack integrators (Chinese, European)
- Power tool OEMs (US, European)
- Energy storage system (ESS) integrators (utility-scale and residential)
- E-bike and e-scooter manufacturers

**Pain Points:**
- EV OEMs require 100% cell-level traceability but formation data is 500+ MB per lot in proprietary format
- Cell grading disputes: factory grades cells as "A" based on 72-hour K-value; OEM incoming inspection uses 14-day K-value with different threshold
- Payment terms Net-90 but raw material (cathode material, electrolyte) must be purchased Net-30; chronic cash flow gap
- Each OEM requires different cell matching tolerances (capacity spread, impedance spread) for their pack design

**Why They'd Use Fairbuild:**
- Escrow payment released at cell-level verification (per-lot or per-shipment) reduces DSO by 60 days
- Agreed grading criteria locked in smart contract eliminates subjective re-grading
- Standardized test data format replaces proprietary .nda files
- Immutable aging/K-value data with timestamps proves cells met spec at time of shipment

---

### Factory 05: Bucheon SemiTek Co., Ltd.

**Industry:** Semiconductor / Sensors -- MEMS Sensor Packaging and Test

**Location:** Bucheon, Gyeonggi-do, South Korea

**Employee Count:** 850

**Annual Revenue:** $120M

**Capabilities:**
- MEMS sensor packaging: accelerometers, gyroscopes, pressure sensors, microphones
- Wire bonding, flip-chip, and wafer-level chip-scale packaging (WLCSP)
- Tumble-test calibration for accelerometers (6-position static calibration)
- Temperature cycling test (-40 to +125 C for automotive qualification per AEC-Q100)
- Automated test handlers (gravity-feed and pick-and-place) for high-volume production
- ESD-protected Class 10 cleanroom for die attach and bonding

**Certifications:** ISO 9001:2015, IATF 16949:2016, AEC-Q100 qualified process, ISO/TS 16949, OHSAS 18001

**Test Equipment:**
- 8x Advantest T2000 ATE systems with custom MEMS interface boards
- 4x Acutronic AC3060 rate tables (for gyroscope calibration)
- 2x custom tumble-test stations with Kistler reference accelerometers
- 6x Cohu Neon handler systems (thermoelectric temperature forcing -40 to +150 C)
- 1x Keysight E4990A impedance analyzer
- 2x Thermotron SE-600 environmental chambers

**Data Systems:**
- MES: Camstar (Siemens Opcenter)
- ERP: SAP S/4HANA
- ATE data: Advantest T2000 outputs STDF (Standard Test Data Format) binary files; converted to CSV via in-house Python parser
- Calibration data: Custom LabVIEW application logs to SQLite; batch-exported to CSV
- Customer-facing: STDF files delivered via SFTP; summary PDF reports via email

**Current Test Log Format:**
```
File: mems_test_{device_type}_{wafer_lot}_{date}.csv
Columns: device_id (string), wafer_lot (string), timestamp (ISO 8601), handler_id (string), sens_x (float), sens_y (float), sens_z (float), offset_x_mg (float), offset_y_mg (float), offset_z_mg (float), cross_axis_pct (float), nonlinearity_pct (float), noise_ug_rthz (float), temp_test_c (int), result (PASS/FAIL), bin (int)
```
Sample row: `ACC-AQ-991204, WL-2026-088, 2026-04-10T11:05:18+09:00, HDL-04, 0.490, 0.487, 0.492, 12.3, -8.7, 15.1, 1.2, 0.3, 210, 25, PASS, 1`

**Typical Clients:**
- Korean automotive Tier-1 electronics suppliers
- Global smartphone OEMs (Korean and Chinese brands)
- European automotive safety system manufacturers (ADAS, ESC)
- US industrial IoT sensor companies

**Pain Points:**
- ATE data in STDF format is opaque to most OEM quality teams; they demand CSV but column mappings vary per OEM
- Automotive qualification lots (AEC-Q100) take 8-12 weeks; payment is held until qualification passes, creating large WIP financing needs
- Yield fallout at -40 C and +125 C corners is disputed because OEM re-tests at slightly different temperatures
- Multiple customers share same production line; lot segregation and data confidentiality must be maintained

**Why They'd Use Fairbuild:**
- Milestone-based escrow (payment at each qualification gate) releases cash during the 12-week qualification cycle
- Standardized test data schema replaces STDF-to-CSV conversion mess
- Temperature and test conditions locked in smart contract eliminate corner-test disputes
- Per-customer data isolation with cryptographic access control

---

### Factory 06: Gumi Advanced Electronics Co., Ltd.

**Industry:** Telecommunications / Electronics -- RF Module and Antenna Assembly

**Location:** Gumi, Gyeongsangbuk-do, South Korea

**Employee Count:** 1,600

**Annual Revenue:** $280M

**Capabilities:**
- 5G mmWave and sub-6 GHz antenna module assembly (AiP -- Antenna-in-Package)
- RF front-end module (FEM) assembly with integrated PA, LNA, filter
- Phased array antenna beamforming calibration
- High-frequency PCB assembly (Rogers/Isola laminates, up to 77 GHz for automotive radar)
- RF shielding and EMI gasket assembly
- MIMO antenna isolation testing

**Certifications:** ISO 9001:2015, IATF 16949:2016, NADCAP (electronics), IPC-A-610 Class 3, TL 9000 (telecom)

**Test Equipment:**
- 4x Keysight PNA-X N5247B vector network analyzers (up to 67 GHz)
- 2x Rohde & Schwarz ZVA67 VNAs (67 GHz, 4-port)
- 6x custom RF test stations with Keysight M9484C signal analyzers
- 2x NSI-MI spherical near-field antenna measurement chambers
- 3x Rohde & Schwarz CMX500 5G NR protocol testers
- 1x ETS-Lindgren anechoic chamber (3m, 600 MHz - 40 GHz)

**Data Systems:**
- MES: Valor IoT Manufacturing (Siemens)
- ERP: SAP S/4HANA
- VNA data: Keysight PathWave exports Touchstone (.s2p) files and CSV
- Antenna measurement: NSI-MI software exports pattern data as .csv and .nsm proprietary format
- Customer-facing: Touchstone files + summary CSV + PDF test reports delivered via customer-specific SFTP

**Current Test Log Format:**
```
File: rf_module_test_{product}_{date}.csv
Columns: module_id (string), timestamp (ISO 8601), station_id (string), vswr_low_freq (float), vswr_mid_freq (float), vswr_high_freq (float), return_loss_center_db (float), gain_dbi (float), beamwidth_h_deg (float), beamwidth_v_deg (float), isolation_db (float), insertion_loss_db (float), result (PASS/FAIL)
```
Sample row: `ANT-5G-04821, 2026-04-10T13:45:20+09:00, RF-STA-02, 1.35, 1.18, 1.41, -18.2, 6.3, 72.5, 68.0, 24.5, 0.82, PASS`

**Typical Clients:**
- Korean telecom equipment OEMs (5G base station and handset)
- US and European 5G infrastructure companies
- Automotive radar Tier-1 suppliers (77 GHz modules)
- Satellite communication OEMs

**Pain Points:**
- RF test data is massive (full S-parameter sweeps are 10K+ frequency points per module); OEMs only review summary metrics but demand full raw data for disputes
- Each telecom OEM has different VSWR/return loss pass/fail thresholds for the same frequency band
- Payment tied to "first article qualification" which can take 4-6 months for telecom infrastructure
- Antenna chamber measurements are expensive ($800/hour); factory bears cost of re-test when OEM disputes results

**Why They'd Use Fairbuild:**
- Smart contract locks pass/fail thresholds per OEM; eliminates ambiguity on acceptance criteria
- Raw S-parameter data hash stored on-chain; full data in secure off-chain storage; proves data integrity without re-test
- Progressive milestone payments during 6-month qualification cycle improve cash flow
- Shared cost allocation for disputed re-tests encoded in contract terms

---

### Factory 07: Hua Tai Precision Connector Co., Ltd.

**Industry:** Electronics / Aerospace -- High-Reliability Connector Manufacturing

**Location:** Suzhou, Jiangsu, China

**Employee Count:** 1,200

**Annual Revenue:** $95M

**Capabilities:**
- MIL-DTL-38999, MIL-DTL-26482, and custom circular/rectangular connectors
- Precision machining of connector shells (CNC turning, milling) in brass, aluminum, stainless steel
- Contact manufacturing (stamping, forming, gold/silver/nickel plating)
- 4-wire Kelvin contact resistance measurement on 100% of mated pairs
- Environmental conditioning: salt spray (MIL-STD-810H), thermal shock, vibration
- Crimped termination pull-force testing per MIL-STD-1344

**Certifications:** ISO 9001:2015, AS9100D, NADCAP (surface treatment), QPL listed for MIL-DTL-38999 Series III, ITAR registered

**Test Equipment:**
- 16x custom 4-wire Kelvin resistance test stations (Keithley 2182A nanovoltmeter + Keithley 6221 current source)
- 4x Instron 5969 universal testing machines (pull-force, insertion/extraction force)
- 2x Keyence VHX-7000 digital microscopes (plating thickness, contact inspection)
- 1x Fischer XDV-SDD XRF spectrometer (plating composition and thickness)
- 2x Weiss WK3-340 thermal shock chambers
- 1x Q-Lab Q-FOG SSP salt spray chamber

**Data Systems:**
- MES: Paperless Parts (cloud-based, for quoting) + custom MES (FileMaker Pro-based, for production tracking)
- ERP: Infor SyteLine
- Test data: Keithley instruments log via LabVIEW to local CSV files per lot
- Environmental test data: Manual data entry into Excel spreadsheets from chamber controllers
- Customer-facing: PDF test reports with pass/fail summary; raw CSV on formal request only

**Current Test Log Format:**
```
File: contact_resistance_{lot}_{date}.csv
Columns: connector_id (string), timestamp (ISO 8601), contact_size (string), contact_position (int), resistance_mohm (float), mv_drop (float), test_current_a (float), shell_ground_mohm (float), plating_type (string), result (PASS/FAIL)
```
Sample row: `CON-38999-11284, 2026-04-10T15:30:00+08:00, 22D, 1, 11.2, 33.6, 3.0, 4.8, Au_50u, PASS`

**Typical Clients:**
- US defense prime contractors (avionics, military vehicles)
- European aerospace OEMs (satellite, launch vehicle)
- Industrial automation companies (harsh-environment connectors)
- Medical device OEMs (MIL-spec connectors in surgical robots)

**Pain Points:**
- ITAR compliance requires strict data handling; current email-based data sharing is a compliance risk
- QPL re-qualification testing costs $150K+ every 3 years; results are not portable between customers
- Defense primes require 100% contact resistance data but each has different acceptable formats (some want millivolt drop, others want milliohm resistance)
- Long payment cycles (Net-90 to Net-120) for defense contracts; small factory cannot finance large orders

**Why They'd Use Fairbuild:**
- ITAR-compliant data sharing with cryptographic access control replaces insecure email
- QPL test results stored as verifiable credentials reduce redundant qualification costs
- Standardized resistance data format satisfies all customers simultaneously
- Escrow-based milestone payments (material procurement, machining, plating, test) improve cash flow

---

### Factory 08: Taoyuan Photonics Industrial Co., Ltd.

**Industry:** Consumer Electronics / Industrial -- LED and Optoelectronics Manufacturing

**Location:** Taoyuan, Taiwan

**Employee Count:** 1,400

**Annual Revenue:** $185M

**Capabilities:**
- Mid-power and high-power LED packaging (0.2W to 10W)
- LED chip die bonding, wire bonding, phosphor dispensing, lens encapsulation
- Integrating sphere measurement for luminous flux, chromaticity, CCT, CRI
- LED binning (flux bins, color bins, Vf bins) per ANSI C78.377
- LED module and light engine assembly (COB arrays, linear modules)
- Accelerated life testing (IESNA LM-80 / TM-21 lumen maintenance)

**Certifications:** ISO 9001:2015, ISO 14001:2015, IECQ QC 080000, Energy Star partner, UL recognized (E-file)

**Test Equipment:**
- 12x Instrument Systems CAS 140D spectroradiometers with ISP 500 integrating spheres
- 8x Keithley 2600B series sourcemeters (I-V characterization)
- 4x Gooch & Housego OL 770 spectroradiometers (high-precision reference measurements)
- 2x Vektrex SpikeSafe current sources (pulsed photometric testing)
- Custom high-speed sorting machines (6000 LEDs/hour per machine, 16 machines total)
- 4x Thermotron S-8200 environmental chambers for LM-80 testing (6000-hour minimum)

**Data Systems:**
- MES: Custom LabVIEW-based production management system
- ERP: Oracle JD Edwards
- Binning data: Sorting machine PLC logs to PostgreSQL; exported as CSV per reel/tape
- LM-80 data: Long-term test data logged to CSV files over 6000+ hour test duration
- Customer-facing: Bin distribution report (Excel) per shipment; LM-80 summary PDF

**Current Test Log Format:**
```
File: led_binning_{product}_{date}.csv
Columns: led_id (string), reel_id (string), timestamp (ISO 8601), cct_k (int), cie_x (float), cie_y (float), duv (float), flux_lm (float), vf_v (float), cri_ra (int), r9 (int), flux_bin (string), color_bin (string), vf_bin (string), result (PASS/FAIL)
```
Sample row: `LED-3K-482901, REEL-2026-0154, 2026-04-10T06:12:55+08:00, 3012, 0.436, 0.394, -0.002, 98.4, 3.05, 83, 12, B3, C2, V2, PASS`

**Typical Clients:**
- Global lighting OEMs (architectural, commercial, residential)
- Automotive LED module Tier-1 suppliers
- Display backlight integrators
- Horticultural lighting companies

**Pain Points:**
- Bin distribution matching: OEM orders 10K reels of specific bin combination; actual production bin distribution may not match, requiring negotiation on substitute bins
- LM-80 test data takes 6000 hours (250 days) to generate; customers want payment held until LM-80 report is available
- Color binning disputes: factory calibrates integrating sphere quarterly; OEM incoming inspection uses different sphere with different calibration, causing 1-2 SDCM difference
- High SKU count (hundreds of bin combinations) makes inventory management and payment reconciliation complex

**Why They'd Use Fairbuild:**
- Bin distribution commitments locked in smart contract with agreed substitution rules and pricing adjustments
- Progressive payment: partial release at production, remainder at LM-80 milestone
- Shared calibration standard reference eliminates sphere-to-sphere measurement disputes
- Automated bin-level payment reconciliation reduces accounting burden

---

## AUTOMOTIVE PARTS FACTORIES (5)

---

### Factory 09: Monterrey Precision Castings S.A. de C.V.

**Industry:** Automotive -- Aluminum Die Casting and Machining

**Location:** Monterrey, Nuevo Leon, Mexico

**Employee Count:** 2,200

**Annual Revenue:** $310M

**Capabilities:**
- High-pressure die casting (HPDC): 800T to 4400T Buhler and Idra machines
- Aluminum alloys: A380, A383, A360, AlSi10Mg (for structural castings)
- CNC machining centers (40+ Mazak and DMG Mori 4/5-axis machines)
- CMM dimensional inspection per IATF 16949 PPAP
- X-ray inspection (porosity detection) on structural castings
- Heat treatment (T5, T6, T7) and surface treatment (shot peening, e-coat)

**Certifications:** IATF 16949:2016, ISO 14001:2015, OHSAS 18001, CQI-9 (Heat Treat), CQI-11 (Plating), Ford Q1, GM BIQS Level 5

**Test Equipment:**
- 3x Zeiss CONTURA G2 CMMs (shop floor, climate-controlled measurement room)
- 1x Zeiss PRISMO Ultra (high-accuracy reference CMM)
- 2x YXLON FF35 CT X-ray systems (porosity volumetric analysis)
- 4x Spectro MAXx OES spectrometers (melt chemistry verification)
- 2x Instron 5985 universal testing machines (tensile testing of cast specimens)
- 1x Struers metallographic preparation and Leica DM4M microscope system

**Data Systems:**
- MES: Plex Manufacturing Cloud (UKG/Plex)
- ERP: SAP S/4HANA
- CMM data: Zeiss CALYPSO software exports .dmo files and CSV; uploaded to Plex quality module
- X-ray data: YXLON iQ software exports porosity analysis as PDF + CSV summary
- Customer-facing: PPAP package (PDF) with CMM reports, material certs, process flow; raw data via customer portal

**Current Test Log Format:**
```
File: cmm_inspection_{part}_{date}.csv
Columns: part_id (string), timestamp (ISO 8601), cmm_id (string), operator_id (string), feature_name (string), nominal_mm (float), tolerance_plus (float), tolerance_minus (float), measured_mm (float), deviation_mm (float), result (PASS/FAIL)

File: xray_porosity_{part}_{date}.csv
Columns: casting_id (string), timestamp (ISO 8601), section_id (string), porosity_area_pct (float), max_pore_dia_mm (float), pore_count (int), shrinkage_detected (bool), result (PASS/FAIL)
```

**Typical Clients:**
- US and European automotive OEMs (engine blocks, transmission housings, structural castings)
- Tier-1 powertrain suppliers (turbo housings, oil pans, valve bodies)
- EV companies (battery tray castings, motor housings)
- Heavy truck and off-highway equipment manufacturers

**Pain Points:**
- PPAP approval requires dozens of documents in different formats; each OEM has a different PPAP portal
- Porosity disputes on structural castings: factory X-ray shows acceptable levels, OEM CT-scan finds additional sub-surface porosity
- Scrap rate negotiation: contract specifies maximum scrap rate but OEM changes tooling/design mid-production without adjusting rates
- Mexican peso volatility affects margins; payment in USD but costs in MXN, with 60-90 day payment lag

**Why They'd Use Fairbuild:**
- Standardized PPAP data package in verifiable format accepted by all OEMs
- X-ray/CT porosity data with agreed analysis methodology locked in contract
- Scrap rate baselines and adjustment triggers encoded in smart contract
- Faster payment (escrow release on shipment verification) reduces currency exposure

---

### Factory 10: Pune AutoStamp Industries Pvt. Ltd.

**Industry:** Automotive -- Metal Stampings and Welded Assemblies

**Location:** Pune, Maharashtra, India

**Employee Count:** 3,500

**Annual Revenue:** $180M

**Capabilities:**
- Progressive die stamping (200T to 2000T servo presses, Komatsu and Aida)
- Transfer die stamping for large body panels (hoods, doors, fenders)
- Resistance spot welding (robotic, 200+ Fanuc and ABB robots)
- MIG/MAG welding for structural assemblies (sub-frames, cross-members)
- Metal finishing: e-coat, powder coat, zinc plating
- In-die sensing and process monitoring (tonnage, stroke, feed)

**Certifications:** IATF 16949:2016, ISO 14001:2015, ISO 45001:2018, Tata Supplier Excellence Award, Maruti Suzuki quality award

**Test Equipment:**
- 2x Hexagon Global S CMMs (with PC-DMIS software)
- 4x Creaform HandySCAN 3D portable scanners (for large stampings)
- 6x Olympus Magna-Mike 8600 ultrasonic thickness gauges
- 2x Instron 5985 UTMs (for tensile testing of stamped coupons)
- 1x Spectro analytical OES (for material verification)
- 12x TECNA resistance weld monitors (real-time nugget monitoring)

**Data Systems:**
- MES: eFACTORY (in-house developed, Java/MySQL)
- ERP: Tally ERP 9 (migrating to SAP Business One)
- CMM data: PC-DMIS exports .dmo and CSV; manually uploaded to shared drive
- Weld monitoring: TECNA data logged to proprietary .wld files; summarized in daily Excel reports
- Customer-facing: Inspection reports in Excel/PDF; shared via email or customer portals (varies by OEM)

**Current Test Log Format:**
```
File: stamping_inspection_{part}_{date}.csv
Columns: part_id (string), timestamp (ISO 8601), die_id (string), press_id (string), thickness_mm (float), burr_height_mm (float), flatness_mm (float), hole_dia_mm (float), hole_tp_mm (float), trim_edge_condition (string), result (PASS/FAIL)

File: weld_monitoring_{assembly}_{date}.csv
Columns: assembly_id (string), timestamp (ISO 8601), weld_id (int), robot_id (string), current_ka (float), voltage_v (float), force_kn (float), weld_time_ms (int), nugget_dia_mm (float), expulsion_detected (bool), result (PASS/FAIL)
```

**Typical Clients:**
- Indian automotive OEMs (passenger cars, commercial vehicles)
- Japanese and Korean auto OEMs with Indian manufacturing plants
- Two-wheeler manufacturers (frames, structural parts)
- Agricultural equipment manufacturers

**Pain Points:**
- Weld quality data is in proprietary format; OEM auditors want CSV exports that don't exist natively
- Die life tracking and maintenance is manual; quality escapes traced to worn dies discovered too late
- Cash flow is constrained by 90-120 day payment terms from OEMs; supplier financing rates are 12-15% in India
- Multiple OEMs audit the same facility 4-6 times per year; factory bears all audit logistics costs

**Why They'd Use Fairbuild:**
- Real-time weld monitoring data exported in standard format provides OEMs continuous visibility, reducing audit frequency
- Die life and maintenance events linked to quality data creates predictive quality system
- Escrow-based payment at shipment (with quality verification) reduces DSO from 105 days to ~25 days
- Shared quality credential reduces redundant audit burden

---

### Factory 11: Juarez Wiring Systems S.A. de C.V.

**Industry:** Automotive -- Wiring Harness Assembly

**Location:** Ciudad Juarez, Chihuahua, Mexico

**Employee Count:** 8,500

**Annual Revenue:** $420M

**Capabilities:**
- Automotive wiring harness assembly (engine, body, chassis, instrument panel)
- Wire cutting, stripping, crimping (Komax Alpha 530 and Schleuniger machines)
- Ultrasonic wire splicing and resistance welding
- Manual assembly on rotating carousel boards (200+ assembly stations)
- 100% electrical testing: continuity, insulation resistance, hipot
- Connector insertion force verification and seal integrity testing

**Certifications:** IATF 16949:2016, ISO 14001:2015, VDA 6.3 (process audit), Ford Q1, Stellantis SQ rating

**Test Equipment:**
- 24x Cirris CH2 automated harness testers (continuity + hipot)
- 6x Schleuniger CrimpCenter 64 (with CFM-20 crimp force monitors)
- 4x Micro-Epsilon scanCONTROL 2950 laser scanners (crimp cross-section analysis)
- 12x Daniels DMC crimp tool gauges (go/no-go verification)
- 2x Chatillon DFE2 digital force gauges (connector insertion/extraction force)
- 4x Megger MIT485 insulation resistance testers

**Data Systems:**
- MES: DELMIA Apriso (Dassault Systemes)
- ERP: SAP ECC 6.0
- Harness test data: Cirris CH2 exports .cir files (proprietary) and CSV; CSV uploaded to Apriso
- Crimp monitoring: Schleuniger CFA software logs crimp force curves to proprietary binary format; daily summary CSV
- Customer-facing: Test certificates (PDF) per harness lot; crimp force monitor summaries in Excel

**Current Test Log Format:**
```
File: harness_test_{product}_{date}.csv
Columns: harness_id (string), timestamp (ISO 8601), tester_id (string), total_circuits (int), open_count (int), short_count (int), miswire_count (int), max_resistance_ohm (float), max_circuit_id (string), insulation_mohm (float), hipot_voltage_v (int), hipot_result (PASS/FAIL), result (PASS/FAIL)

File: crimp_force_{terminal}_{date}.csv
Columns: harness_id (string), wire_id (string), timestamp (ISO 8601), terminal_type (string), wire_gauge_awg (int), crimp_height_mm (float), pull_force_n (float), crimp_force_peak_kn (float), crimp_width_mm (float), result (PASS/FAIL)
```

**Typical Clients:**
- US Big Three automotive OEMs (full vehicle harness programs)
- Japanese auto OEMs with Mexican assembly plants
- Heavy truck OEMs (North America)
- Agricultural and construction equipment manufacturers

**Pain Points:**
- Crimp force monitoring data is massive (one crimp per wire, 200-800 wires per harness, 5000+ harnesses/day); data storage and transfer to OEMs is a bottleneck
- OEM engineering changes (wire routing, connector changes) happen mid-production; no formal change management linked to test specifications
- Harness testing is pass/fail binary; any single circuit failure scraps the entire harness; no partial credit
- Labor-intensive assembly means workforce fluctuations directly impact quality; no link between operator training data and quality outcomes

**Why They'd Use Fairbuild:**
- Efficient data hashing: crimp force summary statistics on-chain, raw curves in off-chain verified storage
- Engineering change orders linked to test specification versions in smart contract
- Per-circuit quality data enables root cause analysis shared between OEM and factory
- Operator qualification credentials linked to quality outcomes

---

### Factory 12: Stuttgart Prazisionsteile GmbH

**Industry:** Automotive / Industrial -- CNC Precision Machining

**Location:** Stuttgart, Baden-Wurttemberg, Germany

**Employee Count:** 450

**Annual Revenue:** $85M

**Capabilities:**
- CNC turning (Nakamura-Tome, DMG Mori) and milling (Hermle, Heller 5-axis)
- Swiss-type CNC turning for small diameter precision parts (Citizen Cincom, Star)
- Gear grinding and spline cutting (Klingelnberg, Reishauer)
- Hard turning and precision grinding (Studer, Junker)
- Surface treatment: nitriding, chrome plating, PVD coating
- Fully climate-controlled metrology lab (20 +/- 0.5 C)

**Certifications:** ISO 9001:2015, IATF 16949:2016, ISO 14001:2015, VDA 6.3 audit score 92%, DIN EN 15085-2 (welding)

**Test Equipment:**
- 1x Zeiss PRISMO Fortis CMM (VAST XT gold scanning probe, MPEE = 0.9 + L/350 um)
- 1x Wenzel LH 87 CMM (bridge type, for larger parts)
- 2x Mahr MarForm MFK 600 form testers (roundness, cylindricity)
- 2x Mahr MarSurf XR 20 surface roughness testers
- 1x Klingelnberg P65 gear measurement center
- 3x Mitutoyo Crysta-Plus M544 shop-floor CMMs
- Gauge R&R studies performed quarterly on all critical measurement systems

**Data Systems:**
- MES: MPDV Hydra X (German MES, widely used in Mittelstand)
- ERP: proAlpha
- CMM data: Zeiss CALYPSO exports inspection reports as PDF and CSV; Wenzel exports via OpenDMIS
- Gear measurement: Klingelnberg software exports gear inspection data as .kgr (proprietary) and PDF
- Customer-facing: ISIR (Initial Sample Inspection Report per VDA) with full CMM data in PDF + Excel

**Current Test Log Format:**
```
File: cmm_report_{part_no}_{date}.csv
Columns: part_id (string), timestamp (ISO 8601), cmm_id (string), feature_id (string), feature_type (string), nominal_mm (float), upper_tol_mm (float), lower_tol_mm (float), measured_mm (float), deviation_mm (float), within_tol (bool)

File: surface_roughness_{part_no}_{date}.csv
Columns: part_id (string), timestamp (ISO 8601), feature_id (string), ra_um (float), rz_um (float), rmax_um (float), measurement_length_mm (float), result (PASS/FAIL)
```

**Typical Clients:**
- German premium automotive OEMs (transmission, steering, powertrain components)
- European commercial vehicle manufacturers
- Industrial hydraulics companies
- Motorsport teams (Formula 1, DTM) for prototype and low-volume parts

**Pain Points:**
- German OEMs require VDA-format ISIR with specific PDF layouts; each OEM has slightly different templates
- Surface roughness specifications use different parameters (Ra vs Rz vs Rmax) per OEM; no standardization
- Gear measurement data in proprietary Klingelnberg format cannot be easily shared; customers must install Klingelnberg viewer
- Small company with limited IT staff; maintaining separate data portals for each OEM is expensive relative to revenue

**Why They'd Use Fairbuild:**
- Unified quality data format accepted by all OEMs eliminates OEM-specific ISIR templates
- Surface roughness data standardized across all parameters in single schema
- Gear measurement data converted to open format with verifiable hash
- Low-overhead cloud platform requires no dedicated IT staff; cost-effective for Mittelstand companies

---

### Factory 13: Chennai Precision Forgings Ltd.

**Industry:** Automotive / Industrial -- Hot and Warm Forgings

**Location:** Chennai, Tamil Nadu, India

**Employee Count:** 1,800

**Annual Revenue:** $145M

**Capabilities:**
- Closed-die hot forging (1000T to 10,000T mechanical and hydraulic presses)
- Warm forging for net-shape/near-net-shape components
- Ring rolling for bearing races and flanges (up to 1500mm OD)
- Heat treatment: normalizing, quenching & tempering, induction hardening
- CNC machining of forged blanks (turning, drilling, milling)
- Metallurgical laboratory: chemistry, microstructure, inclusion rating

**Certifications:** ISO 9001:2015, IATF 16949:2016, ISO 14001:2015, AS9100D (aerospace line), PED 2014/68/EU, API monogram (for oil & gas forgings)

**Test Equipment:**
- 2x Zeiss CONTURA G2 CMMs
- 1x Spectro MAXx 08 OES spectrometer (spark emission)
- 2x Instron 5985 universal testing machines (1000 kN capacity)
- 1x Zwick/Roell Charpy pendulum impact tester (450 J capacity)
- 2x Emco DuraScan 70 Rockwell/Brinell/Vickers hardness testers
- 1x LECO CS844 carbon/sulfur analyzer
- 2x Olympus BX53M metallurgical microscopes with image analysis
- 1x GE Inspection Technologies USM 36 ultrasonic flaw detector

**Data Systems:**
- MES: AVEVA Wonderware (mainly for furnace monitoring and press monitoring)
- ERP: SAP Business One
- Chemistry data: Spectro iSort exports to Excel via COM interface; manually entered into SAP QM
- Mechanical test data: Instron Bluehill software exports CSV; manually collated into MTR (Mill Test Report)
- Customer-facing: MTR (Mill Test Report) in PDF per EN 10204 Type 3.1; raw data on special request

**Current Test Log Format:**
```
File: mtc_chemistry_{heat_no}_{date}.csv
Columns: heat_no (string), sample_id (string), test_date (date), c_pct (float), mn_pct (float), si_pct (float), p_pct (float), s_pct (float), cr_pct (float), mo_pct (float), ni_pct (float), v_pct (float), result (PASS/FAIL)

File: mechanical_test_{heat_no}_{date}.csv
Columns: heat_no (string), specimen_id (string), test_date (date), test_type (string), yield_mpa (float), uts_mpa (float), elongation_pct (float), reduction_area_pct (float), hardness_hrc (float), impact_energy_j (float), result (PASS/FAIL)
```

**Typical Clients:**
- Indian and European automotive OEMs (crankshafts, connecting rods, steering knuckles)
- Oil & gas valve and fitting manufacturers (ASTM A105, A182 grade forgings)
- Bearing manufacturers (bearing race forgings)
- Agricultural equipment OEMs

**Pain Points:**
- MTR (Mill Test Report) generation is manual; each customer requires different format and different test parameters
- Heat treatment data (furnace temperature profiles) is monitored but not linked to individual parts in the ERP
- Multiple international certifications (IATF, AS9100, API) require separate audit processes for the same facility
- International customers require EN 10204 Type 3.1 certificates but Indian domestic customers accept Type 2.2; maintaining two systems is inefficient

**Why They'd Use Fairbuild:**
- Automated MTR generation from test data in standardized format serves all customers
- Heat treatment furnace profiles linked to part-level traceability via IoT integration
- Single verifiable quality credential satisfies multiple certification body requirements
- EN 10204 Type 3.1 certificates generated automatically with verifiable digital signatures

---

## PRECISION MANUFACTURING (4)

---

### Factory 14: Munich Aerospace Components GmbH

**Industry:** Aerospace -- Precision Investment Casting and Machining

**Location:** Munich, Bavaria, Germany

**Employee Count:** 680

**Annual Revenue:** $165M

**Capabilities:**
- Investment casting (lost wax): nickel superalloys (Inconel 718, Waspaloy, CMSX-4 single-crystal)
- Vacuum induction melting (VIM) and vacuum arc remelting (VAR)
- 5-axis CNC machining of cast turbine blades and vanes
- Fluorescent penetrant inspection (FPI) per ASTM E1417
- CMM inspection per AS9102 First Article Inspection
- NDT: radiographic (X-ray), ultrasonic, eddy current

**Certifications:** AS9100D, NADCAP (heat treat, NDT, chemical processing, welding), EN 9100, EASA Part 21G Production Organisation Approval, Rolls-Royce approved supplier, Safran approved supplier

**Test Equipment:**
- 2x Zeiss PRISMO Ultra CMMs (scanning probe, MPEE = 0.7 + L/400 um)
- 1x GOM ATOS Q 3D optical scanner (for complex airfoil profile scanning)
- 1x YXLON Y.MU2000 X-ray / CT system (for internal defect detection in castings)
- 2x Magnaflux ZA-44 FPI inspection lines (per ASTM E1417 / AMS 2647)
- 1x Struers Tegramin metallographic polishing system + Leica DM6M microscope
- 1x Spectro SPECTROLAB OES (for superalloy chemistry verification)
- 1x Olympus OmniScan MX2 phased array UT system

**Data Systems:**
- MES: SAP Manufacturing Execution (ME)
- ERP: SAP S/4HANA
- CMM/NDT data: Zeiss CALYPSO and PiWeb for data management and statistical analysis
- AS9102 FAI: Net-Inspect (cloud-based FAI management)
- Customer-facing: AS9102 FAI packages (PDF), NDT reports (PDF), material certificates (EN 10204 Type 3.1 PDF)
- Data retention: 30+ years for aerospace traceability (regulatory requirement)

**Current Test Log Format:**
```
File: fai_cmm_{part_no}_{serial}.csv
Columns: blade_id (string), casting_lot (string), test_date (date), feature_id (int), feature_name (string), characteristic (string), nominal (float), upper_tol (float), lower_tol (float), measured (float), deviation (float), result (PASS/FAIL)

File: ndt_fpi_{serial}_{date}.csv
Columns: part_id (string), test_date (date), fpi_method (string), penetrant_dwell_min (int), developer_dwell_min (int), indication_count (int), max_indication_mm (float), indication_type (string), operator_cert_level (string), result (ACCEPT/REJECT)
```

**Typical Clients:**
- European aero engine OEMs (HPT blades, LPT vanes, combustor liners)
- US defense engine programs (military turbine components)
- Industrial gas turbine OEMs (power generation)
- Space propulsion companies (rocket engine turbopump components)

**Pain Points:**
- AS9102 FAI documentation is extremely time-consuming (40-80 hours per new part number); digitizing ballooned drawings is manual
- NADCAP audit preparation consumes 200+ person-hours annually; audit findings must be tracked across 5 special process accreditations
- 30-year data retention requirement for aerospace creates massive archival burden; current system is mix of paper, PDF, and database
- OEM-specific material and process specifications (RR MSRR, Safran DMC) vary slightly from published standards; tracking versions is error-prone

**Why They'd Use Fairbuild:**
- Digital FAI with verifiable timestamps satisfies AS9102 and 30-year retention requirement on immutable storage
- NADCAP audit findings and corrective actions tracked as verifiable credentials
- OEM-specific spec versions linked to part-level test data in smart contract
- Reduced FAI generation time from 40 hours to 4 hours with standardized digital format

---

### Factory 15: Hsinchu BioMed Precision Co., Ltd.

**Industry:** Medical Devices -- Precision CNC Machining and Assembly

**Location:** Hsinchu, Taiwan

**Employee Count:** 320

**Annual Revenue:** $62M

**Capabilities:**
- Precision CNC machining of implantable medical device components (Ti-6Al-4V, CoCrMo, 316L SS)
- Swiss-type CNC turning for orthopedic screws (bone screws, pedicle screws)
- 5-axis milling for joint replacement components (femoral stems, acetabular cups)
- Passivation per ASTM A967 and electropolishing
- Class 8 cleanroom assembly and packaging
- Biocompatibility testing coordination (ISO 10993 per contract labs)

**Certifications:** ISO 13485:2016, ISO 9001:2015, FDA 21 CFR 820, CE marking (EU MDR 2017/745), MDSAP (multi-site)

**Test Equipment:**
- 1x Zeiss MICURA CMM (small-part high-accuracy, MPEE = 0.7 + L/400 um)
- 1x Keyence XM-1200 handheld CMM (for in-process checks)
- 2x Mitutoyo Surftest SJ-410 surface roughness testers
- 1x Bruker ContourGT-X optical profilometer (for implant surface texture analysis)
- 1x Olympus IPLEX GX videoscope (for internal bore inspection)
- 1x Fischer XAN 250 XRF coating thickness gauge
- 1x Instron 5944 (1 kN capacity, for small component testing)

**Data Systems:**
- MES: MasterControl Manufacturing Excellence
- ERP: Microsoft Dynamics 365
- CMM data: Zeiss CALYPSO exports to PiWeb server; also exported as CSV for DHR (Device History Record)
- Surface measurement: Bruker Vision64 exports .opd files and CSV
- Customer-facing: DHR package (PDF) with all inspection data, material certs, process records per FDA 21 CFR 820
- Validation: IQ/OQ/PQ protocols for every new product per FDA requirements

**Current Test Log Format:**
```
File: cmm_implant_{part_no}_{lot}.csv
Columns: part_id (string), lot_id (string), test_date (date), feature_id (string), feature_name (string), nominal_mm (float), upper_tol_mm (float), lower_tol_mm (float), measured_mm (float), deviation_mm (float), surface_finish_ra_um (float), result (PASS/FAIL)

File: surface_profile_{part_no}_{lot}.csv
Columns: part_id (string), lot_id (string), test_date (date), location (string), ra_um (float), rz_um (float), sa_um (float), sz_um (float), result (PASS/FAIL)
```

**Typical Clients:**
- US and European orthopedic device OEMs (joint replacements, spinal implants)
- Dental implant companies
- Surgical instrument manufacturers
- Cardiovascular device companies (stents, guidewires)

**Pain Points:**
- FDA 21 CFR 820 DHR requirements mean every piece of paper must be traceable; current system mixes paper and digital records
- Each OEM requires IQ/OQ/PQ validation that is essentially identical; no portability of validation records
- Surface finish requirements for implants (Ra, Sa, Rz) vary by OEM and by implant surface zone; managing 50+ surface finish specifications is complex
- Lot-based traceability for implants extends to raw material heat numbers, tool life, machine parameters; linking all this data is manual

**Why They'd Use Fairbuild:**
- Digital DHR with cryptographic integrity satisfies FDA 21 CFR 820 and EU MDR traceability requirements
- Validation records as verifiable credentials reduce redundant IQ/OQ/PQ across OEMs
- Part-level digital twin linking raw material, machining parameters, and inspection data
- Immutable records support post-market surveillance and recall traceability

---

### Factory 16: Nagoya Seimitsu Kogaku K.K.

**Industry:** Precision Optics -- Optical Component Manufacturing

**Location:** Nagoya, Aichi, Japan

**Employee Count:** 280

**Annual Revenue:** $48M

**Capabilities:**
- Precision optical glass grinding and polishing (spherical and aspherical lenses)
- Optical coating: AR (anti-reflection), HR (high-reflection), bandpass filters, dichroic coatings
- Prism manufacturing (penta prisms, beam splitters, right-angle prisms)
- Diamond turning of IR optics (germanium, zinc selenide, chalcogenide)
- Optical assembly: cemented doublets, multi-element lens assemblies
- Interferometric testing (surface figure, transmitted wavefront)

**Certifications:** ISO 9001:2015, JIS Q 9100 (Japanese AS9100 equivalent), ITAR registered (for US defense optics programs), ISO 10110 compliant

**Test Equipment:**
- 2x Zygo Verifire HDX Fizeau interferometers (surface figure, 4" and 6" aperture)
- 1x Zygo NewView 9000 white-light interferometer (surface roughness, sub-nm)
- 2x Trioptics OptiCentric 100 (lens centering error measurement)
- 1x Trioptics MTF-LAB (modulation transfer function measurement)
- 1x PerkinElmer Lambda 1050+ UV-Vis-NIR spectrophotometer (coating characterization)
- 1x Olympus STM7 measuring microscope
- Custom optical bench setups for wavefront testing per MIL-PRF-13830B

**Data Systems:**
- MES: Custom FileMaker Pro system (tracking work orders, serialized parts)
- ERP: Obic7 (Japanese ERP)
- Interferometer data: Zygo MetroPro/Mx exports .dat (binary) and .csv; surface maps as .bmp images
- Spectrophotometer data: PerkinElmer UV WinLab exports .sp files and .csv
- Customer-facing: Inspection certificates (PDF) with interferogram images and coating performance curves; delivered on CD/USB or via secure file share

**Current Test Log Format:**
```
File: optics_inspection_{part_no}_{serial}.csv
Columns: part_id (string), lot_id (string), test_date (date), surface_id (string), radius_of_curvature_mm (float), surface_figure_pv_waves (float), surface_figure_rms_waves (float), irregularity_fringes (float), surface_roughness_rms_nm (float), centering_error_arcmin (float), result (PASS/FAIL)

File: coating_performance_{part_no}_{lot}.csv
Columns: part_id (string), test_date (date), coating_type (string), wavelength_nm (float), reflectance_pct (float), transmittance_pct (float), absorption_pct (float), spec_min (float), spec_max (float), result (PASS/FAIL)
```

**Typical Clients:**
- Japanese camera and imaging OEMs (interchangeable lens systems)
- US defense optics integrators (targeting systems, periscopes)
- European scientific instrument companies (spectroscopy, metrology)
- Semiconductor lithography equipment manufacturers

**Pain Points:**
- Optical specifications use lambda/fraction notation (e.g., lambda/10 PV at 632.8 nm) which doesn't map cleanly to standard quality management formats
- Interferogram images are the primary evidence of quality but are large binary files difficult to manage in ERP
- ITAR-controlled data must be segregated from commercial data; current system relies on folder-level access control
- Small company with master craftsmen approaching retirement; no systematic capture of process knowledge

**Why They'd Use Fairbuild:**
- Optical-specific data schema handles lambda/fraction specifications natively
- Interferogram image hashes stored on-chain; full images in ITAR-compliant secure storage
- Access-controlled data sharing satisfies ITAR requirements with audit trail
- Process knowledge captured as structured data linked to quality outcomes

---

### Factory 17: Ho Chi Minh Precision Machining JSC

**Industry:** Aerospace / Industrial -- CNC Machining Job Shop

**Location:** Ho Chi Minh City, Vietnam

**Employee Count:** 550

**Annual Revenue:** $35M

**Capabilities:**
- 3, 4, and 5-axis CNC milling (Haas, Doosan, Mazak)
- CNC turning and multi-axis turn-mill (Doosan Puma, Mazak Integrex)
- Wire EDM and sinker EDM (Sodick, Mitsubishi)
- Surface grinding and cylindrical grinding (Okamoto, Toyoda)
- Anodizing (Type II, Type III hard anodize) and chem-film (Alodine)
- First article inspection per AS9102 for aerospace customers

**Certifications:** ISO 9001:2015, AS9100D (achieved 2024), ISO 14001:2015, NADCAP pending (chemical processing)

**Test Equipment:**
- 1x Mitutoyo Crysta-Apex V CMM (CNC, with TP-S2 touch probe)
- 2x Mitutoyo Quick Vision Active CNC vision systems
- 3x Mitutoyo SJ-210 surface roughness testers
- 1x Olympus Magna-Mike 8600 UT thickness gauge
- Assorted Mitutoyo micrometers, calipers, height gauges, bore gauges (calibrated quarterly)
- 1x Positive Material Identification (PMI) handheld XRF (Olympus Vanta)

**Data Systems:**
- MES: ProShop ERP/MES (cloud-based, designed for job shops)
- ERP: Same (ProShop integrates ERP and MES)
- CMM data: Mitutoyo MCOSMOS exports CSV inspection reports; uploaded to ProShop quality module
- Shop floor: Operators log dimensions on paper travelers; transferred to ProShop by QC inspectors
- Customer-facing: CoC (Certificate of Conformance) in PDF; CMM data in CSV on request

**Current Test Log Format:**
```
File: cmm_inspection_{wo_no}_{date}.csv
Columns: part_id (string), work_order (string), test_date (date), feature_no (int), feature_description (string), nominal_mm (float), plus_tol (float), minus_tol (float), actual_mm (float), deviation_mm (float), in_tolerance (bool)
```
Sample row: `BRKT-AE-00142, WO-2026-0841, 2026-04-10, 1, Bore Diameter, 25.400, 0.013, -0.013, 25.408, +0.008, true`

**Typical Clients:**
- US and European aerospace Tier-2 suppliers (brackets, housings, fittings)
- Japanese industrial equipment manufacturers
- Oil & gas equipment companies (valve bodies, manifolds)
- Semiconductor equipment OEMs (chamber components)

**Pain Points:**
- AS9100D certification is new; factory still developing robust quality management processes
- Paper-based travelers are error-prone; data entry into ProShop has 2-3% transcription error rate
- Aerospace customers require full dimensional inspection on 100% of parts; current CMM throughput is the bottleneck
- International payments in USD take 7-10 business days via wire transfer; Vietnamese dong fluctuations affect margins during the delay

**Why They'd Use Fairbuild:**
- Digital travelers eliminate paper and transcription errors
- Real-time CMM data upload provides OEMs visibility into inspection progress
- Instant payment settlement via escrow reduces currency exposure from 10 days to near-zero
- AS9102 digital FAI package built automatically from inspection data

---

## FOOD / PHARMA / CHEMICAL PROCESSING (3)

---

### Factory 18: Hanoi Nutri-Foods Joint Stock Company

**Industry:** Food & Beverage -- Beverage and Dairy Processing

**Location:** Hanoi, Vietnam

**Employee Count:** 1,200

**Annual Revenue:** $95M

**Capabilities:**
- UHT (ultra-high-temperature) processing of dairy beverages (milk, flavored milk, yogurt drinks)
- Fruit juice processing (from concentrate and NFC -- not from concentrate)
- Aseptic filling (Tetra Pak A3/Speed, SIG Combibloc)
- Blending, pasteurization, homogenization
- In-house QC laboratory: microbiology, chemistry, sensory evaluation
- Clean-in-place (CIP) systems with automated cycle verification

**Certifications:** ISO 9001:2015, FSSC 22000 (Food Safety System Certification), HACCP, ISO 22000:2018, Halal certified, FDA facility registration

**Test Equipment:**
- 2x Mettler Toledo SevenExcellence pH meters
- 1x ATAGO RX-5000CX digital refractometer (Brix measurement)
- 2x Thermo Fisher Multiskan FC microplate readers (for ELISA allergen testing)
- 1x PerkinElmer AA800 atomic absorption spectrometer (heavy metals)
- 2x 3M Petrifilm plate readers (microbiological screening)
- 1x Hach TL2360 turbidimeter
- 1x Metrohm 905 Titrando (titratable acidity)
- 2x analytical balances (Mettler Toledo XPR)

**Data Systems:**
- MES: Wonderware InTouch (SCADA for process monitoring; batch records)
- ERP: SAP Business One
- QC lab data: Manual entry into LIMS (LabWare) from instrument readings; LIMS exports CSV reports
- Batch records: Wonderware Historian logs temperature, pressure, flow rate; exported as CSV for quality review
- Customer-facing: CoA (Certificate of Analysis) in PDF per lot; sent via email

**Current Test Log Format:**
```
File: qc_batch_test_{product}_{date}.csv
Columns: batch_id (string), sample_id (string), test_date (date), product_type (string), brix (float), ph (float), acidity_pct (float), brix_acid_ratio (float), hpc_cfu_ml (int), coliform_cfu_100ml (int), ecoli_detected (bool), turbidity_ntu (float), result (PASS/FAIL)

File: process_batch_record_{batch_id}.csv
Columns: batch_id (string), timestamp (ISO 8601), process_step (string), temperature_c (float), pressure_bar (float), flow_rate_lph (float), duration_min (float), cip_conductivity_ms (float), operator_id (string)
```

**Typical Clients:**
- Vietnamese retail brands (private label dairy and juice)
- Export customers in Southeast Asia, Middle East, Africa
- Institutional buyers (school milk programs, government contracts)
- International beverage brands seeking co-manufacturing

**Pain Points:**
- Export customers require CoA with every shipment but no verification of lab results; fraudulent CoAs from competitors erode trust
- FSSC 22000 surveillance audits are expensive ($15K-20K each); audit results not portable to new customers
- Batch release process is manual: lab technician prints CoA, QA manager signs, scanned and emailed
- CIP validation records are on paper; tracing a food safety incident to CIP cycle data requires pulling paper files

**Why They'd Use Fairbuild:**
- Verifiable CoA with lab data integrity (hash of raw instrument readings) differentiates from competitors with unverifiable claims
- FSSC 22000 audit results as verifiable credentials reduce customer audit burden
- Digital batch release workflow with cryptographic signature replaces paper/scan/email
- CIP validation linked to batch-level traceability for rapid root cause analysis

---

### Factory 19: Hai Phong PharmaChem Co., Ltd.

**Industry:** Pharmaceutical -- Solid Dosage Form Manufacturing

**Location:** Hai Phong, Vietnam

**Employee Count:** 900

**Annual Revenue:** $55M

**Capabilities:**
- Tablet manufacturing: granulation (wet and dry), compression, film coating
- Capsule filling (hard gelatin and HPMC vegetarian capsules)
- Blister packaging and bottle packaging
- In-process testing: weight uniformity, hardness, friability, disintegration, dissolution
- QC laboratory: HPLC, UV-Vis, Karl Fischer titration, particle size analysis
- Stability chambers (ICH conditions: 25C/60%RH, 30C/65%RH, 40C/75%RH)

**Certifications:** WHO GMP, PIC/S GMP (target), ISO 9001:2015, Vietnam GMP (Decision 35/QD-BYT), FDA facility registration, ANVISA (Brazil) approved

**Test Equipment:**
- 2x Agilent 1260 Infinity II HPLC systems (for assay and related substances)
- 1x Agilent Cary 60 UV-Vis spectrophotometer
- 2x Erweka TBH 425TD tablet hardness testers
- 2x Erweka TAR 120 tablet friability testers
- 2x Hanson Vision G2 Elite 8 dissolution apparatus (USP II paddle)
- 1x Mettler Toledo V20S Karl Fischer titrator
- 2x Mettler Toledo XPR analytical balances (0.01 mg readability)
- 4x Weiss Technik WKL stability chambers

**Data Systems:**
- MES: Werum PAS-X Savvy (cloud-based, pharma MES)
- ERP: SAP Business One
- HPLC data: Agilent OpenLAB CDS exports chromatograms as .ch files and CSV; data reviewed in OpenLAB
- Dissolution/hardness data: Manually entered into PAS-X from printed instrument reports
- Customer-facing: CoA (Certificate of Analysis) per batch, validated per GMP documentation requirements; PDF via email
- Data integrity: 21 CFR Part 11 compliance for electronic records (audit trail on all data)

**Current Test Log Format:**
```
File: tablet_ipqc_{batch}_{date}.csv
Columns: batch_id (string), sample_time (ISO 8601), tablet_no (int), weight_mg (float), deviation_pct (float), hardness_n (float), thickness_mm (float), diameter_mm (float), friability_pct (float), disintegration_min (float), result (PASS/FAIL)

File: dissolution_test_{batch}_{date}.csv
Columns: batch_id (string), stage (string), test_date (date), vessel_1_pct (float), vessel_2_pct (float), vessel_3_pct (float), vessel_4_pct (float), vessel_5_pct (float), vessel_6_pct (float), average_pct (float), min_pct (float), q_value (int), result (PASS/FAIL)
```

**Typical Clients:**
- Vietnamese pharmaceutical companies (contract manufacturing)
- Southeast Asian generic drug distributors
- African health ministries (WHO prequalification products)
- US/European generic pharma companies seeking low-cost manufacturing

**Pain Points:**
- GMP data integrity requirements (ALCOA+) demand full audit trails; current system has gaps in electronic record controls
- WHO prequalification inspections are rigorous and expensive; results from one regulatory authority not accepted by others
- Dissolution testing disputes: factory reports S1 pass; contract giver re-tests and gets S2 results with different paddle height calibration
- Batch release takes 7-10 days for documentation review; product sits in quarantine tying up working capital

**Why They'd Use Fairbuild:**
- Immutable audit trail on test data satisfies ALCOA+ data integrity principles
- WHO GMP inspection results as verifiable credentials accepted across regulatory jurisdictions
- Dissolution test conditions (paddle height, temperature, media prep) locked in smart contract specs
- Automated batch release workflow reduces quarantine time from 10 days to 2 days

---

### Factory 20: Asan Chemical Materials Co., Ltd.

**Industry:** Chemical Processing -- Specialty Chemical Manufacturing

**Location:** Asan, Chungcheongnam-do, South Korea

**Employee Count:** 650

**Annual Revenue:** $180M

**Capabilities:**
- High-purity solvent manufacturing (electronic-grade IPA, acetone, NMP)
- Photoresist ancillary chemicals (developers, strippers, edge bead removers)
- Semiconductor-grade wet chemicals (buffered HF, SC-1, SC-2 cleaning solutions)
- Distillation, filtration (0.1 um), and ultra-pure water blending
- Particle count analysis (per SEMI C-series standards)
- Metal ion analysis at ppt (parts per trillion) levels

**Certifications:** ISO 9001:2015, ISO 14001:2015, SEMI S2/S8 (equipment and chemical safety), OHSAS 18001, K-REACH registered, TSCA compliant

**Test Equipment:**
- 1x Agilent 7900 ICP-MS (metal impurities at ppt level)
- 1x Thermo Fisher iCAP PRO ICP-OES (for process monitoring, ppb level)
- 2x Rion KS-42B liquid particle counters (0.1 um sensitivity)
- 1x Metrohm 940 Professional IC Vario (ion chromatography for anion/cation analysis)
- 2x Mettler Toledo T50 titrators (acid/base titration for concentration verification)
- 1x Anton Paar DMA 5000M density meter
- 1x Shimadzu UV-1900i UV-Vis spectrophotometer

**Data Systems:**
- MES: Yokogawa CENTUM VP (DCS for process control) + batch management
- ERP: SAP S/4HANA
- ICP-MS/OES data: Agilent MassHunter / Thermo Qtegra export .csv and .pdf reports
- Particle count data: Rion software exports .csv per measurement run
- Customer-facing: CoA with full analytical results per SEMI specifications; PDF via email; some customers require EDI (electronic data interchange) integration
- Lot traceability: from raw material receipt through blending, filtration, filling, to customer delivery

**Current Test Log Format:**
```
File: chemical_coa_{product}_{lot}.csv
Columns: lot_id (string), product_code (string), test_date (date), assay_pct (float), water_ppm (float), particle_count_0_1um_per_ml (int), particle_count_0_5um_per_ml (int), na_ppt (float), k_ppt (float), fe_ppt (float), ca_ppt (float), cl_ppb (float), so4_ppb (float), color_apha (int), result (PASS/FAIL)
```
Sample row: `IPA-EG-2026-0412, IPA-EG-99.99, 2026-04-10, 99.995, 48, 12, 0, 85, 42, 18, 35, 2.1, 0.8, 5, PASS`

**Typical Clients:**
- Korean semiconductor fabs (memory and logic)
- Display panel manufacturers (LCD and OLED)
- Semiconductor equipment OEMs (for cleaning validation chemicals)
- International semiconductor companies with Korean operations

**Pain Points:**
- Semiconductor customers require real-time access to CoA data before accepting delivery; current PDF-via-email has 4-8 hour turnaround
- Metal impurity specifications at ppt level are near instrument detection limits; disputes arise over measurement uncertainty
- Customer audits focus on contamination control and traceability; same data requested by multiple customers in different formats
- Price negotiations tied to purity grades but purity verification relies on trust in supplier's lab results

**Why They'd Use Fairbuild:**
- Real-time CoA data availability on platform eliminates PDF email delays
- Measurement uncertainty budgets agreed in smart contract specifications resolve ppt-level disputes
- Single data format satisfies all semiconductor customer requirements
- Third-party lab verification results linked to supplier CoA for independent confirmation of purity claims

---

## STEEL / METALS PRODUCERS (3)

---

### Factory 21: Shanghai Hongda Steel Co., Ltd.

**Industry:** Steel Manufacturing -- Structural Steel Plate Production

**Location:** Baoshan District, Shanghai, China

**Employee Count:** 12,000

**Annual Revenue:** $1.8B

**Capabilities:**
- Continuous casting (slab caster, 250mm x 1600mm slabs)
- Hot rolling mill (4-high reversing mill, plates 6mm to 150mm thick, up to 3500mm wide)
- Heat treatment: normalizing, quenching & tempering, stress relieving
- Plate cutting, beveling, and surface preparation
- Full metallurgical laboratory: OES chemistry, tensile, Charpy impact, hardness, metallography
- Ultrasonic testing per ASTM A435 / EN 10160

**Certifications:** ISO 9001:2015, ISO 14001:2015, EN 10204 Type 3.1 certified, ABS/DNV/LR/BV marine classification approved, ASME SA-516 / SA-537 qualified, API 5L/5CT certified, PED 2014/68/EU

**Test Equipment:**
- 4x Spectro SPECTROLAB M12 OES spectrometers (one per melt shop furnace)
- 4x Instron 5985 UTMs (300 kN capacity, for tensile testing)
- 2x Zwick/Roell RKP 450 Charpy pendulum impact testers
- 4x Emco DuraVision 30 hardness testers (Brinell, Rockwell, Vickers)
- 2x GE USM Go+ ultrasonic flaw detectors (for manual UT)
- 2x Automated UT gantry systems (Nordinkraft, for 100% plate scanning)
- 2x Olympus BX53M metallurgical microscopes
- 1x LECO CS844 carbon/sulfur analyzer, 1x LECO ONH836 oxygen/nitrogen/hydrogen analyzer

**Data Systems:**
- MES: Siemens SIMATIC IT (Level 3 MES integrated with Level 2 process automation)
- ERP: SAP S/4HANA
- Lab data: LIMS (Thermo Fisher SampleManager) manages all test data; generates MTCs automatically
- UT data: Nordinkraft system exports scan images and defect logs as CSV + bitmap
- Customer-facing: Mill Test Certificate (EN 10204 Type 3.1) as PDF; raw data available through customer portal (web-based)
- Regulatory: All heats traced from raw material through finished plate; 10-year data retention

**Current Test Log Format:**
```
File: mtc_{heat_no}_{plate_id}.csv
Columns: heat_no (string), plate_id (string), test_date (date), grade (string), thickness_mm (float), c_pct (float), mn_pct (float), p_pct (float), s_pct (float), si_pct (float), cr_pct (float), mo_pct (float), ni_pct (float), nb_pct (float), v_pct (float), yield_mpa (float), uts_mpa (float), elongation_pct (float), charpy_temp_c (int), charpy_avg_j (float), charpy_min_j (float), hardness_hbw (float), ut_result (string), result (PASS/FAIL)
```
Sample row: `HT-2026-0441, PL-A516-70-0089, 2026-04-10, A516Gr70, 25.2, 0.22, 1.12, 0.010, 0.005, 0.28, 0.05, 0.02, 0.08, 0.02, 0.03, 310, 485, 24.5, -30, 68.0, 52.0, 143, PASS, PASS`

**Typical Clients:**
- Pressure vessel fabricators (China, Southeast Asia, Middle East)
- Shipbuilding yards (China, Korea, Japan)
- Pipeline construction companies (oil & gas)
- Structural steel fabricators for infrastructure projects (bridges, buildings)

**Pain Points:**
- Each classification society (ABS, DNV, LR, BV) requires separate witness testing and documentation; same test witnessed by 2-3 different surveyors
- MTCs are widely forged in the steel industry; customers have no way to verify authenticity of PDFs received
- Large order volumes (1000+ plates per order) mean MTC generation and distribution is a massive administrative task
- Payment terms tied to inspection release by classification society surveyor; delays in surveyor scheduling hold payment

**Why They'd Use Fairbuild:**
- Blockchain-verified MTCs eliminate forgery and provide instant authenticity verification
- Single immutable MTC accepted by all classification societies reduces redundant witness testing
- Automated MTC generation and distribution for high-volume orders
- Escrow payment released upon verified MTC issuance, decoupled from surveyor scheduling delays

---

### Factory 22: Dongguan Yongxin Metal Products Co., Ltd.

**Industry:** Metals Processing -- Aluminum Extrusion and Fabrication

**Location:** Dongguan, Guangdong, China

**Employee Count:** 1,100

**Annual Revenue:** $75M

**Capabilities:**
- Aluminum extrusion (6xxx and 7xxx series alloys, press capacity 800T to 5500T)
- Custom die design and manufacturing (in-house tool shop)
- CNC machining of extruded profiles (sawing, drilling, milling, tapping)
- Surface treatment: anodizing (clear, black, color), powder coating, PVDF painting
- Thermal break assembly for architectural profiles
- Bending and forming of complex extrusion cross-sections

**Certifications:** ISO 9001:2015, ISO 14001:2015, Qualicoat (coating quality), Qualanod (anodizing quality), ASTM B221 compliant, CE marking (EN 15088 for structural aluminum)

**Test Equipment:**
- 1x Spectro SPECTROMAXx OES (alloy verification)
- 1x Instron 5969 UTM (tensile testing of extruded sections)
- 2x Fischer Dualscope MPOR coating thickness gauges (for anodizing and paint)
- 1x Webster hardness tester (quick hardness check on extrusions)
- 1x Mitutoyo Crysta-Plus M443 CMM
- 2x Keyence IM-8000 instant measurement systems (cross-section profile verification)
- 1x Erichsen cupping tester (for coating adhesion, per ISO 2409)

**Data Systems:**
- MES: Custom Access database (developed in-house, basic production tracking)
- ERP: Kingdee K/3
- Quality data: Inspection results entered manually into Excel templates; one template per product family
- Tensile and chemistry data: Instrument printouts scanned to PDF; summary entered into Kingdee QM module
- Customer-facing: MTR (Mill Test Report) as PDF scan of handwritten/printed lab report

**Current Test Log Format:**
```
File: extrusion_inspection_{alloy}_{date}.xlsx (Excel, not CSV)
Columns: lot_no (string), die_no (string), billet_no (string), test_date (date), alloy (string), tensile_mpa (float), yield_mpa (float), elongation_pct (float), hardness_webster (int), wall_thickness_mm (float), profile_tolerance_mm (float), surface_grade (string), anodize_thickness_um (float), result (PASS/FAIL)
```

**Typical Clients:**
- Architectural curtain wall companies (China, Southeast Asia, Middle East)
- Consumer electronics OEMs (laptop/tablet enclosures from extruded stock)
- Solar panel frame manufacturers
- Industrial equipment manufacturers (heat sinks, structural frames)

**Pain Points:**
- Excel-based quality system is error-prone; formulas break, files get corrupted, version control is nonexistent
- OEM customers for electronics require full alloy traceability from billet to finished part; current system cannot provide this
- Anodizing thickness and color consistency are frequent dispute points; no standardized measurement protocol agreed with customers
- Small and medium orders from many different customers mean quality paperwork is disproportionately burdensome

**Why They'd Use Fairbuild:**
- Replace Excel-based quality system with structured data platform; no more formula errors or file corruption
- Billet-to-part traceability built into platform workflow
- Agreed anodizing measurement protocol and pass/fail criteria in smart contract
- Automated MTR generation reduces paperwork burden for high-mix order book

---

### Factory 23: Detroit Alloy Processing Inc.

**Industry:** Metals Processing -- Heat Treatment and Surface Engineering

**Location:** Warren, Michigan, USA

**Employee Count:** 180

**Annual Revenue:** $32M

**Capabilities:**
- Atmosphere-controlled heat treatment: carburizing, carbonitriding, nitriding, neutral hardening
- Induction hardening (CNC-controlled scanners for shafts, gears, bearing races)
- Vacuum heat treatment (oil quench, gas quench, sinter-hardening)
- Shot peening per AMS 2430 / AMS 2432 (Almen intensity verification)
- Rockwell, Brinell, Vickers, and Knoop hardness testing
- Metallographic analysis: case depth, microstructure, grain size per ASTM E112

**Certifications:** ISO 9001:2015, IATF 16949:2016, CQI-9 Special Process: Heat Treat System Assessment (4th Edition), NADCAP (heat treat), AS9100D (aerospace line), AMS 2750F pyrometry compliant

**Test Equipment:**
- 4x Wilson RB2000 Rockwell hardness testers
- 2x Newage/Instron Versitron Vickers/Knoop microhardness testers
- 2x Buehler metallographic preparation systems (grinding, polishing, etching)
- 2x Leica DM6 M metallurgical microscopes with image analysis software
- 2x DataPaq Furnace Tracker temperature profiling systems (for TUS/SAT verification)
- 4x Beamex MC6-Ex calibrators (for thermocouple and pyrometry calibration)
- 1x Spectro analytical OES (material verification for incoming parts)

**Data Systems:**
- MES: Bluestreak (purpose-built for heat treatment and surface finishing)
- ERP: Epicor Kinetic
- Furnace data: SCADA (Wonderware) logs temperature, atmosphere, time for every load; exported as CSV
- Hardness/metallography data: Manually entered into Bluestreak from instrument readings and microscope images
- Customer-facing: Heat treatment certification per AMS 2759; PDF with hardness data and furnace chart
- CQI-9 compliance: Load records, pyrometry records, quench monitoring all maintained in Bluestreak

**Current Test Log Format:**
```
File: heat_treat_cert_{job}_{date}.csv
Columns: part_id (string), job_no (string), test_date (date), process (string), furnace_id (string), load_temp_c (float), soak_time_min (int), quench_media (string), temper_temp_c (float), temper_time_min (int), hrc_1 (float), hrc_2 (float), hrc_3 (float), hrc_avg (float), case_depth_mm (float), core_hardness_hrc (float), microstructure (string), result (PASS/FAIL)
```
Sample row: `GEAR-4320-00884, JOB-2026-1204, 2026-04-10, carburize_QT, F-03, 925, 480, oil, 175, 120, 59.2, 59.8, 59.5, 59.5, 0.85, 35.2, tempered_martensite, PASS`

**Typical Clients:**
- Automotive OEMs and Tier-1 suppliers (gears, shafts, bearings, CV joints)
- Aerospace companies (landing gear, actuator components)
- Heavy equipment manufacturers (pins, bushings, track components)
- Firearms manufacturers (receivers, barrels, bolts)

**Pain Points:**
- CQI-9 audit by each automotive customer is redundant; same furnace systems audited 4-6 times per year by different OEMs
- Pyrometry records (TUS, SAT) are voluminous; AMS 2750F requires 12-month archive but customers sometimes request 5+ years
- Furnace chart data is the "proof" of correct process but is a large time-series dataset difficult to share electronically
- Small company with thin margins; payment terms of Net-60 from automotive customers strain cash flow

**Why They'd Use Fairbuild:**
- CQI-9 audit results as verifiable credentials reduce redundant audits from 6 to 1-2 per year
- Furnace chart data hashed and stored; full time-series available on demand with verified integrity
- AMS 2750F pyrometry records with digital attestation satisfy long-term retention requirements
- Faster escrow-based payment improves cash flow for capital-intensive heat treatment equipment

---

## OTHER (2)

---

### Factory 24: Suzhou GreenTex Knitting Co., Ltd.

**Industry:** Textiles -- Performance Fabric and Knit Manufacturing

**Location:** Suzhou, Jiangsu, China

**Employee Count:** 2,400

**Annual Revenue:** $125M

**Capabilities:**
- Circular knitting (single jersey, double jersey, interlock, jacquard) on Mayer & Cie and Terrot machines
- Warp knitting (Karl Mayer machines) for mesh and spacer fabrics
- Dyeing and finishing (jet dyeing, pad dyeing, calendering, water-repellent treatment)
- Quality testing: pilling, color fastness, dimensional stability, tensile/tear strength
- Performance fabric development: moisture-wicking, UV protection, antimicrobial treatments
- Bluesign-certified dyeing process

**Certifications:** ISO 9001:2015, ISO 14001:2015, OEKO-TEX Standard 100, bluesign approved, GRS (Global Recycled Standard), GOTS (organic textiles, selected lines), BSCI social compliance

**Test Equipment:**
- 2x James Heal Martindale pilling testers (2000-cycle and 5000-cycle per ISO 12945-2)
- 2x James Heal Perspirometer (color fastness to perspiration, ISO 105-E04)
- 1x SDL Atlas Launder-Ometer (color fastness to washing, ISO 105-C06)
- 2x Instron 5944 UTMs (tensile and tear strength per ISO 13934-1 and ISO 13937-2)
- 1x Datacolor 850 spectrophotometer (color matching, delta E measurement)
- 1x AATCC spray tester (water repellency rating)
- 1x SDL Atlas HydroView Plus (hydrostatic head testing per ISO 811)

**Data Systems:**
- MES: Custom production tracking (PHP/MySQL web application)
- ERP: SAP Business One
- Lab data: Test results entered into Excel templates per test type; collated into fabric test report (Word/PDF)
- Color data: Datacolor TOOLS software exports .cxf color files and color difference reports
- Customer-facing: Fabric test report (PDF) per lot with test results vs. buyer specifications; delivered via email

**Current Test Log Format:**
```
File: fabric_test_report_{style}_{lot}.csv
Columns: lot_id (string), style_no (string), test_date (date), test_type (string), test_method (string), result_value (float), result_unit (string), spec_min (float), spec_max (float), spec_unit (string), result (PASS/FAIL)

File: color_matching_{style}_{lot}.csv
Columns: lot_id (string), style_no (string), test_date (date), illuminant (string), delta_l (float), delta_a (float), delta_b (float), delta_e_cmc (float), metamerism_index (float), result (PASS/FAIL)
```

**Typical Clients:**
- Global sportswear and athleisure brands (contract manufacturing)
- European outdoor and workwear brands
- Fast-fashion brands (knit tops, dresses)
- Private label retailers (US and European department stores)

**Pain Points:**
- Color matching is subjective despite spectrophotometer data; brands use different illuminants and delta E thresholds for approval
- Fabric test results not trusted by brands; many require third-party testing at SGS/Intertek/BV, adding $500-2000 per style and 7-10 days delay
- Sustainability certifications (GRS, GOTS, bluesign) must be verified per order; no digital chain-of-custody from certified raw material to finished fabric
- Payment terms Net-60 to Net-90 for brand orders; raw material (yarn) must be purchased Net-30

**Why They'd Use Fairbuild:**
- Spectrophotometric color data with agreed illuminant and delta E threshold in smart contract eliminates subjective approval
- Factory test results verified on platform reduce need for third-party re-testing
- Digital chain-of-custody for sustainability certifications from yarn to finished fabric
- Escrow payment at fabric approval milestone reduces DSO by 30-40 days

---

### Factory 25: San Antonio Solar Components LLC

**Industry:** Renewable Energy -- Solar Panel Component Manufacturing

**Location:** San Antonio, Texas, USA

**Employee Count:** 400

**Annual Revenue:** $110M

**Capabilities:**
- Solar junction box assembly and testing (IP67/IP68 rated)
- MC4 and proprietary connector manufacturing and testing
- Solar cable harness assembly (PV wire, USE-2/RHW-2 rated)
- Diode testing and thermal characterization for bypass diodes
- Hipot testing (up to 5000V DC) per UL 6703 and IEC 62790
- Potting and encapsulation (silicone and polyurethane)

**Certifications:** ISO 9001:2015, UL recognized (UL 6703 junction boxes, UL 6141 connectors), IEC 62790 (junction boxes), IEC 62852 (connectors), TUV Rheinland certified, NEC Article 690 compliant, IRA/CHIPS Act domestic content qualified

**Test Equipment:**
- 4x Associated Research Hypot testers (Qualitest 7620, 5 kVDC/AC hipot + insulation resistance)
- 6x Keithley 2450 SourceMeters (for diode I-V characterization)
- 2x Arbin BT-ML battery/component test systems (for thermal cycling with electrical load)
- 1x ESPEC ARS-0680 thermal cycling chamber (-40 to +85 C)
- 2x Fluke 1550C insulation resistance testers (10 kV)
- 1x Keyence VR-6000 3D optical profilometer (for connector pin wear analysis)
- 4x custom continuity/functional test stations (NI cDAQ-based)

**Data Systems:**
- MES: Fishbowl Manufacturing (integrated with QuickBooks)
- ERP: QuickBooks Enterprise (migrating to NetSuite)
- Test data: NI LabVIEW test stations log to local SQLite databases; daily CSV export to shared drive
- Hipot data: Qualitest instruments log via RS-232 to LabVIEW; CSV per lot
- Customer-facing: Test report (PDF) per lot with hipot, continuity, and diode test summaries; raw CSV available on request
- UL compliance: All test data maintained for 5 years per UL follow-up service requirements

**Current Test Log Format:**
```
File: jbox_test_{product}_{lot}_{date}.csv
Columns: unit_id (string), lot_id (string), timestamp (ISO 8601), station_id (string), hipot_voltage_vdc (int), hipot_leakage_ua (float), hipot_result (PASS/FAIL), insulation_mohm (float), continuity_all_circuits (bool), diode_vf_1_v (float), diode_vf_2_v (float), diode_vf_3_v (float), diode_ir_ua (float), thermal_rise_c (float), result (PASS/FAIL)
```
Sample row: `JB-72C-084521, LOT-2026-0412, 2026-04-10T14:22:07-05:00, STA-03, 3000, 2.4, PASS, 850.0, true, 0.62, 0.61, 0.63, 0.8, 12.5, PASS`

**Typical Clients:**
- US solar panel manufacturers (First Solar-tier, but domestic module assembly)
- Utility-scale solar project developers (requiring UL-listed components)
- Solar tracker manufacturers
- Energy storage system integrators (for DC junction boxes)

**Pain Points:**
- IRA domestic content requirements create documentation burden; must prove manufacturing location and domestic material percentage for tax credits
- UL follow-up service inspections happen quarterly; preparation consumes 40+ person-hours per inspection
- Each solar panel OEM has slightly different junction box test specifications despite using the same UL 6703 standard
- Rapid growth strains the QuickBooks/Fishbowl system; data migration to NetSuite risks losing historical quality records

**Why They'd Use Fairbuild:**
- IRA domestic content documentation with verifiable supply chain data satisfies tax credit requirements
- UL compliance data continuously available; reduces quarterly inspection preparation time
- Standardized test specifications per UL 6703 / IEC 62790 resolve OEM-to-OEM variations
- Platform provides durable data storage independent of ERP migration; historical records preserved

---

## Summary: Factory Profile Distribution

| # | Factory Name | Industry | Location | Employees | Revenue |
|---|---|---|---|---|---|
| 01 | Huaqiang Optics & Module Co. | Camera Modules | Shenzhen, China | 4,200 | $380M |
| 02 | Suzhou Weida Electronic Assembly | PCB Assembly | Suzhou, China | 2,800 | $210M |
| 03 | Dongguan Mingguang Display | Display Modules | Dongguan, China | 6,500 | $720M |
| 04 | Shenzhen Longwei Battery | Li-Ion Battery Cells | Shenzhen/Dongguan, China | 3,800 | $550M |
| 05 | Bucheon SemiTek Co. | MEMS Sensors | Bucheon, Korea | 850 | $120M |
| 06 | Gumi Advanced Electronics | RF/Antenna Modules | Gumi, Korea | 1,600 | $280M |
| 07 | Hua Tai Precision Connector | MIL-Spec Connectors | Suzhou, China | 1,200 | $95M |
| 08 | Taoyuan Photonics Industrial | LED/Optoelectronics | Taoyuan, Taiwan | 1,400 | $185M |
| 09 | Monterrey Precision Castings | Aluminum Die Casting | Monterrey, Mexico | 2,200 | $310M |
| 10 | Pune AutoStamp Industries | Metal Stampings | Pune, India | 3,500 | $180M |
| 11 | Juarez Wiring Systems | Wiring Harnesses | Juarez, Mexico | 8,500 | $420M |
| 12 | Stuttgart Prazisionsteile GmbH | CNC Precision Machining | Stuttgart, Germany | 450 | $85M |
| 13 | Chennai Precision Forgings | Hot/Warm Forgings | Chennai, India | 1,800 | $145M |
| 14 | Munich Aerospace Components | Investment Casting | Munich, Germany | 680 | $165M |
| 15 | Hsinchu BioMed Precision | Medical Device Machining | Hsinchu, Taiwan | 320 | $62M |
| 16 | Nagoya Seimitsu Kogaku | Precision Optics | Nagoya, Japan | 280 | $48M |
| 17 | Ho Chi Minh Precision Machining | Aerospace CNC Machining | Ho Chi Minh City, Vietnam | 550 | $35M |
| 18 | Hanoi Nutri-Foods JSC | Beverage/Dairy Processing | Hanoi, Vietnam | 1,200 | $95M |
| 19 | Hai Phong PharmaChem Co. | Pharmaceutical Tablets | Hai Phong, Vietnam | 900 | $55M |
| 20 | Asan Chemical Materials | Specialty Chemicals | Asan, Korea | 650 | $180M |
| 21 | Shanghai Hongda Steel | Steel Plate Production | Shanghai, China | 12,000 | $1.8B |
| 22 | Dongguan Yongxin Metal Products | Aluminum Extrusion | Dongguan, China | 1,100 | $75M |
| 23 | Detroit Alloy Processing | Heat Treatment | Warren, Michigan, USA | 180 | $32M |
| 24 | Suzhou GreenTex Knitting | Performance Textiles | Suzhou, China | 2,400 | $125M |
| 25 | San Antonio Solar Components | Solar Panel Components | San Antonio, Texas, USA | 400 | $110M |

### Distribution Verification

**By Segment:**
- Electronics: 8 (Factories 01-08)
- Automotive: 5 (Factories 09-13)
- Precision Manufacturing: 4 (Factories 14-17)
- Food/Pharma/Chemical: 3 (Factories 18-20)
- Steel/Metals: 3 (Factories 21-23)
- Other (Textiles, Solar): 2 (Factories 24-25)

**By Geography:**
- China: 8 (Shenzhen x2, Dongguan x2, Suzhou x2, Shanghai x1, Shenzhen/Dongguan x1)
- Korea: 3 (Bucheon, Gumi, Asan)
- Vietnam: 3 (Ho Chi Minh City, Hanoi, Hai Phong)
- Taiwan: 2 (Taoyuan, Hsinchu)
- India: 2 (Pune, Chennai)
- Germany: 2 (Stuttgart, Munich)
- Mexico: 2 (Monterrey, Juarez)
- USA: 2 (Warren MI, San Antonio TX)
- Japan: 1 (Nagoya)
