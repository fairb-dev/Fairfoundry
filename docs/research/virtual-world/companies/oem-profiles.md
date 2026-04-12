# OEM Company Profiles -- Fairbuild Contract Builder Studio Virtual World

> 25 fictional OEM (buyer) company profiles for testing ERS document creation, acceptance criteria, and supplier quality/payment workflows.
> Each profile provides enough detail to generate realistic sample ERS documents, CSV test data, and acceptance criteria.

---

## ELECTRONICS (8 OEMs)

---

### OEM-01: Lumenar Technologies

**Industry:** Consumer Electronics -- Smartphones & Wearables

**Headquarters:** Shenzhen, China (R&D centers in San Jose, CA and Taipei, Taiwan)

**Annual Revenue:** $8.2B

**Number of Supplier Relationships:** 340

**Products They Source:**
- Camera modules (13 MP and 48 MP, multi-lens arrays)
- OLED and LCD display panels (5.5"--6.7" for phones, 1.4" for smartwatches)
- Li-polymer battery cells (4500 mAh smartphone, 450 mAh wearable)
- PCB assemblies (8-layer HDI mainboards)
- MEMS accelerometers and gyroscopes (consumer-grade)
- Touch panel assemblies (PCAP, in-cell)
- RF antenna modules (Sub-6 GHz and mmWave 5G)

**Typical ERS Structure:**
- Engineering Requirement Specification documents are 15--40 pages, issued per component part number
- Each ERS contains a master test parameter table with columns: Parameter, Unit, Min, Nominal, Max, Test Method Reference
- Includes environmental qualification matrix (temperature cycling -20 to +60 C, humidity 85/85, drop test 1.5m)
- Test data format specified as CSV with mandatory fields: serial_no, timestamp (ISO 8601), all parameter values, PASS/FAIL result
- ERS revision-controlled with ECN (Engineering Change Notice) process; typical 3--5 revisions per product lifecycle
- References: ISO 12233 (camera), VESA DisplayHDR (display), IEC 62660-1 (battery), IPC-A-610 Class 2 (PCB)

**Quality Requirements:**
- Cpk >= 1.33 for critical parameters (camera MTF, battery capacity, display luminance)
- Cpk >= 1.00 for standard parameters (dimensional, weight)
- AQL: 0.065% for critical defects (safety), 0.25% for major defects (functional), 1.0% for minor defects (cosmetic)
- Certifications required: ISO 9001, ISO 14001, IECQ QC 080000 (hazardous substances)
- Incoming quality audit frequency: quarterly for Tier-1 suppliers, semi-annual for Tier-2

**Payment Terms:** Net-60 from invoice date; 2% early payment discount for Net-15

**Pain Points:**
- Camera module suppliers submit test data in proprietary formats (Excel macros, PDF reports) that require manual re-entry into Lumenar's QMS. A single new product introduction (NPI) generates 50+ different test report formats across suppliers.
- Battery cell K-value (self-discharge) data arrives 7 days after shipment due to aging test duration, creating a gap between goods receipt and quality confirmation that delays payment authorization.
- Display panel suppliers in South Korea use different SPC software than Chinese PCB suppliers, making cross-supplier Cpk comparison impossible without manual normalization.
- Payment disputes arise when factory-reported yield does not match Lumenar's incoming inspection results, and there is no shared source of truth for the raw test data.

**Why They'd Use Fairbuild:**
- Unified ERS format across 340 suppliers eliminates the "50 formats" problem. Lumenar could define their test parameter schema once and have every supplier upload data against it.
- Real-time Cpk dashboards would let quality engineers compare camera module Cpk across three competing suppliers (Shenzhen, Dongguan, Suzhou) on the same chart.
- Payment release tied to verified test data would close the battery K-value gap: payment auto-triggers once the 7-day aging data clears acceptance criteria.
- SVT-based escrow aligns supplier motivation: factories get faster payment for higher quality, reducing Lumenar's incoming rejection rate.

---

### OEM-02: Veridian Display Corp

**Industry:** Display Technology -- Panels for Laptops, Monitors, Automotive HUDs

**Headquarters:** Hsinchu, Taiwan

**Annual Revenue:** $3.4B

**Number of Supplier Relationships:** 85

**Products They Source:**
- LED backlight units (edge-lit and direct-lit, for 13"--32" panels)
- LED chips (mid-power white, 3000K--6500K, for backlight arrays)
- Polarizer films (TFT-grade, 400mm--700mm width rolls)
- Driver IC wafers (source/gate drivers, COF packaging)
- Optical films (brightness enhancement, diffuser, reflector)
- Flexible PCBs (COF-attached gate driver assemblies)
- Cover glass (chemically strengthened, 0.5mm--1.1mm)

**Typical ERS Structure:**
- ERS documents organized by subsystem (backlight ERS, optical stack ERS, driver IC ERS)
- Heavy emphasis on optical parameters: luminance (cd/m2), color gamut (% BT.709, % DCI-P3), uniformity (JNCD < 3.0 at 9 points)
- LED binning specifications reference ANSI C78.377 quadrangles with specific bin codes required per project
- Test data expected in CSV with spectroradiometer measurement coordinates mapped to a standard 13-point grid
- Documents typically 20--30 pages with extensive appendices showing measurement point diagrams and bin maps

**Quality Requirements:**
- Cpk >= 1.67 for luminance uniformity and color coordinates (visual quality is market differentiator)
- Cpk >= 1.33 for LED forward voltage and luminous flux
- AQL: 0.10% for Mura defects (visual banding), 0.40% for other functional defects
- Certifications: ISO 9001, ISO 14001, Sony Green Partner or equivalent RoHS compliance audit
- LED suppliers must provide lot-level chromaticity data with CIE 1931 x,y coordinates and CCT for every reel shipped

**Payment Terms:** Net-45; 30% advance payment for custom LED bin orders with minimum order quantities > 500K reels

**Pain Points:**
- LED chromaticity bins drift between production lots. Veridian needs to correlate LED bin data from the chip supplier with backlight unit luminance data from the BLU assembler, but data lives in separate systems.
- Color consistency across multiple panel sizes (13.3", 15.6", 27") using the same LED supplier requires complex bin-matching logic that is currently managed in spreadsheets.
- Polarizer film defect maps arrive as image files (TIFF) without machine-readable coordinates, making automated yield analysis impossible.
- Payment for optical film rolls is disputed when Veridian's incoming inspection finds haze or scratches not detected at the film supplier, and neither side trusts the other's measurement conditions.

**Why They'd Use Fairbuild:**
- Structured LED bin data on a shared platform would enable automated bin-matching across projects, replacing error-prone spreadsheets.
- Fairbuild's ERS framework could link LED chip-level data to BLU-level data to final panel-level data, creating a traceable quality chain.
- Supplier payment tied to verified optical performance data at Veridian's incoming inspection would eliminate the "whose measurement is right?" disputes.
- Cpk trending across LED lots would give Veridian early warning of chromaticity drift before thousands of non-matching LEDs arrive.

---

### OEM-03: Arcwave Semiconductor

**Industry:** Semiconductor -- MEMS Sensors & RF Components

**Headquarters:** Munich, Germany (fabs in Dresden and Singapore)

**Annual Revenue:** $2.1B

**Number of Supplier Relationships:** 120

**Products They Source:**
- Silicon wafers (200mm and 300mm, for MEMS and CMOS processes)
- MEMS packaging (ceramic and LGA packages for accelerometers, gyroscopes, pressure sensors)
- Gold and aluminum bonding wire (1.0 mil and 1.25 mil diameter)
- Ceramic substrates (LTCC, for RF hybrid modules)
- Leadframes (copper alloy, QFN/DFN format)
- Test sockets and probe cards (custom, for wafer-level and package-level test)
- Die attach adhesive (silver-filled epoxy, conductive)

**Typical ERS Structure:**
- ERS documents are extremely detailed, 40--80 pages, with statistical sampling plans per MIL-STD-1916
- Wafer-level test specifications include parametric test limits for every die on the wafer (wafer map format)
- MEMS calibration specs reference IEEE-STD-1293 with tumble-test methodology and temperature compensation coefficients
- Wire bond specs per MIL-STD-883 Method 2011.9 with specific pull-strength minimums by wire diameter
- Test data format: die-level data in STDF (Standard Test Data Format) for wafer test; CSV for package-level final test
- Traceability required from wafer lot to final packaged device (lot genealogy)

**Quality Requirements:**
- Cpk >= 2.00 for automotive-grade MEMS sensor parameters (sensitivity, offset, cross-axis)
- Cpk >= 1.67 for industrial-grade products
- AQL: 0 DPPM target for automotive (AEC-Q100 qualified); 10 DPPM for industrial
- Certifications: IATF 16949 (automotive suppliers), ISO 9001, AEC-Q100 (component qualification)
- Failure analysis turnaround: 5 business days for 8D report on any field return

**Payment Terms:** Net-90 for wafer suppliers; Net-60 for packaging and test subcontractors

**Pain Points:**
- Automotive MEMS sensors require 0 DPPM, but the current quality data exchange with packaging subcontractors is via emailed PDF test reports that cannot be automatically parsed for SPC analysis.
- Wafer-level test data is in STDF format, but package-level test data from OSATs (Outsourced Semiconductor Assembly & Test) is in proprietary CSV formats, making lot-level yield correlation across the supply chain difficult.
- Wire bond pull test data from the hybrid microcircuit line is logged in handwritten notebooks at one subcontractor, requiring Arcwave quality engineers to fly to the site for audits.
- Net-90 terms for wafer suppliers strain those suppliers' cash flow, leading to capacity allocation conflicts where Arcwave gets deprioritized during wafer shortages.

**Why They'd Use Fairbuild:**
- Standardized test data upload from OSAT subcontractors would enable die-to-package traceability and automated yield analysis without manual data munging.
- Real-time wire bond pull strength data visibility would eliminate surprise failures at incoming inspection and reduce on-site audit frequency.
- SVT escrow with shorter effective payment terms (triggered by quality data verification) would improve wafer supplier relationships and secure capacity allocation during shortages.
- Cpk >= 2.00 monitoring across three OSAT locations on a single dashboard would let Arcwave identify the best-performing site and shift volume accordingly.

---

### OEM-04: Greenfield IoT Solutions

**Industry:** IoT & Smart Home Devices

**Headquarters:** Austin, TX, USA

**Annual Revenue:** $420M

**Number of Supplier Relationships:** 55

**Products They Source:**
- Environmental sensor modules (temperature, humidity, air quality -- BME688 equivalents)
- Low-power WiFi/BLE SoC modules (ESP32 equivalents)
- Custom injection-molded plastic enclosures (ABS, PC/ABS blends)
- Small Li-polymer batteries (800 mAh, 3.7V)
- PCB assemblies (4-layer, 0402/0201 component mix, lead-free)
- Flexible flat cables (FFC, 0.5mm pitch, 10--20 pin)
- Adhesive gaskets and seals (IP54 rated)

**Typical ERS Structure:**
- Lean ERS format, 8--15 pages per component, written by a small engineering team (12 people)
- Emphasis on power consumption specs (uA sleep current, mA active current) and wireless RF performance (sensitivity, range)
- SPI (solder paste inspection) and AOI requirements reference IPC-7527 and IPC-A-610 Class 2
- Battery specs include capacity at 0.2C discharge, self-discharge over 30 days, and cycle life at 500 cycles
- Data format: simple CSV files, but column names and units vary between suppliers because Greenfield has no formal data schema
- Limited formal revision control; ERS changes communicated via email threads

**Quality Requirements:**
- Cpk >= 1.00 for most parameters (startup mentality, pragmatic thresholds)
- AQL: 0.65% for major defects, 2.5% for minor defects
- Certifications: ISO 9001 preferred but not mandatory; UL/FCC/CE marks required on finished devices
- No formal SPC program at most suppliers; Greenfield relies heavily on incoming inspection (5% sampling)

**Payment Terms:** Net-30 for domestic suppliers; Net-45 for overseas (China, Taiwan)

**Pain Points:**
- As a mid-size company, Greenfield lacks the leverage to demand standardized test data formats from suppliers. Each of their 55 suppliers sends data differently, and the quality team (3 people) spends 40% of their time reformatting data.
- Battery suppliers provide only summary pass/fail results, not raw cell-level data. When a field failure involves battery swelling, Greenfield cannot trace back to the specific cell lot.
- Injection mold suppliers deliver enclosures with dimensional reports in PDF format that must be manually compared against CAD tolerances.
- Small supplier base means losing even one supplier to a payment dispute is catastrophic; Greenfield needs to build trust-based relationships but has no formal quality data sharing infrastructure.

**Why They'd Use Fairbuild:**
- Fairbuild's standardized ERS templates would give Greenfield an "enterprise-grade" quality system without hiring a large quality team. Templates for common components (PCBs, batteries, sensors) would be ready to customize.
- Automated test data ingestion would free the 3-person quality team from manual data reformatting, letting them focus on actual quality improvement.
- Cell-level battery traceability via Fairbuild would enable root-cause analysis on field failures that currently take weeks.
- For a $420M company, demonstrating a professional quality data platform to prospective investors and OEM customers (who license Greenfield's technology) adds credibility.

---

### OEM-05: PulseCore Wearables

**Industry:** Consumer Electronics -- Fitness Trackers & Medical-Adjacent Wearables

**Headquarters:** Copenhagen, Denmark

**Annual Revenue:** $780M

**Number of Supplier Relationships:** 70

**Products They Source:**
- Optical heart rate sensor modules (PPG, green LED + photodiode)
- OLED micro-displays (1.2"--1.4" AMOLED, 326+ PPI)
- Haptic motor modules (linear resonant actuators, LRA)
- Waterproof connectors (IP68 rated, 4-pin magnetic pogo)
- Flexible PCBs (rigid-flex, 4-layer, medical-grade materials)
- Watch bands and clasps (silicone, titanium, stainless steel)
- NFC antenna modules (13.56 MHz, for contactless payment)

**Typical ERS Structure:**
- ERS documents are 12--25 pages, with a strong focus on biocompatibility and skin-contact safety (ISO 10993 references)
- PPG sensor specs define minimum signal-to-noise ratio, LED wavelength tolerance (525 nm +/- 5 nm), and photodiode dark current
- Display specs reference pixel-level defect acceptance (max 2 bright subpixel defects, zero full-pixel defects)
- IP68 waterproof testing: 1.5m submersion for 30 minutes, per IEC 60529
- Test data expected in CSV but with additional metadata fields: device_firmware_version, test_station_id, test_operator_id
- Documents include a wearability test appendix (sweat simulation, UV aging, 10,000 flex cycles for band/connector)

**Quality Requirements:**
- Cpk >= 1.33 for optical sensor SNR and LED wavelength (directly affects heart rate accuracy)
- Cpk >= 1.50 for display uniformity (premium brand perception)
- AQL: 0.10% for safety-critical defects (skin contact, battery), 0.40% for functional, 1.5% for cosmetic
- Certifications: ISO 13485 (medical device QMS) for sensor module suppliers, ISO 9001 for mechanical components
- Biocompatibility testing per ISO 10993-5 (cytotoxicity) and ISO 10993-10 (skin sensitization) for all skin-contact materials

**Payment Terms:** Net-45; milestone payments for NPI tooling (30% at tool kickoff, 40% at T1 samples, 30% at PPAP approval)

**Pain Points:**
- PPG sensor suppliers provide heart rate accuracy test data under lab conditions (controlled light, stationary subject), but PulseCore needs wrist-motion-artifact data that suppliers do not collect. There is no standardized way to specify and receive this additional test data.
- OLED display suppliers classify pixel defects differently from PulseCore's internal standard; what one supplier calls a "process indicator" PulseCore classifies as a "minor defect," leading to RMA disputes.
- ISO 13485 audits of sensor module suppliers generate paper-based CAPA reports that are tracked in a separate system from production quality data, making it hard to correlate audit findings with actual yield trends.
- Haptic motor resonant frequency data is provided as a single average value per lot, not per-unit data, preventing incoming inspection correlation.

**Why They'd Use Fairbuild:**
- Shared ERS with unambiguous defect classification (pixel defect taxonomy written into the ERS) would eliminate the "your defect vs. our defect" RMA disputes.
- Fairbuild could host both lab and field test data for PPG sensors, enabling PulseCore to define acceptance criteria that include motion-artifact rejection performance.
- Linking quality data to payment would incentivize OLED suppliers to align their defect classification with PulseCore's standard, since misclassification would delay payment.
- Per-unit haptic motor data on Fairbuild would enable true incoming inspection rather than lot-level sampling.

---

### OEM-06: Novacharge Energy Systems

**Industry:** EV Components -- Battery Packs & Power Electronics

**Headquarters:** Stockholm, Sweden (manufacturing in Gdansk, Poland)

**Annual Revenue:** $1.9B

**Number of Supplier Relationships:** 95

**Products They Source:**
- 21700 cylindrical Li-ion cells (NMC811, 5000 mAh, for EV battery modules)
- Battery Management System (BMS) PCBAs (12S/16S configurations)
- Busbar assemblies (copper/nickel-plated, laser-welded tab connections)
- Thermal interface materials (gap pads, phase-change compounds, k > 5 W/mK)
- Coolant plates (aluminum, brazed, for liquid cooling loops)
- High-voltage connectors (HV-IL, 600V rated, per LV 214)
- Cell-to-pack structural adhesive (polyurethane, flame-retardant)

**Typical ERS Structure:**
- ERS documents are 30--60 pages, heavily referencing IEC 62660-1 (performance), IEC 62660-2 (reliability), UN 38.3 (transport safety)
- Cell-level ERS specifies: capacity at 0.2C, AC impedance at 1 kHz, OCV after formation, K-value (self-discharge) over 7-day aging, weight tolerance
- BMS PCBA ERS includes functional test specifications for voltage measurement accuracy (+/- 5 mV), current sense accuracy (+/- 1%), cell balancing performance, and CAN bus communication protocol verification
- Pack-level thermal test ERS specifies: max cell temperature during 1C discharge, cell-to-cell delta-T, coolant delta-T, insulation resistance (>= 1 Mohm/V)
- All test data must include cell-level traceability (cell ID -> module position -> pack ID)
- Data format: structured CSV with hierarchical lot/cell/module/pack identifiers

**Quality Requirements:**
- Cpk >= 2.00 for cell capacity and impedance (cell-matching is critical for pack safety and longevity)
- Cpk >= 1.67 for BMS voltage measurement accuracy
- AQL: Zero-defect target for cells; 100% testing on all safety-critical parameters
- Certifications: IATF 16949 (all suppliers), ISO 14001, ISO 26262 ASIL-C or ASIL-D compliance for BMS
- Cell suppliers must provide full formation data (charge/discharge curves) for every cell shipped, not just pass/fail
- Annual PPAP renewal with updated control plans and PFMEA for each cell chemistry revision

**Payment Terms:** Net-75 for cell suppliers (reflects long qualification cycles); Net-45 for mechanical/thermal components

**Pain Points:**
- Cell suppliers ship 50,000+ cells per week. Each cell generates ~20 data points during formation and EOL test. Novacharge receives this data as compressed CSV archives via FTP, and importing it into their MES takes 2--3 days per shipment. By the time data is analyzed, the next shipment has already arrived.
- K-value (self-discharge) data requires a 7-day aging period after formation. This means quality confirmation lags physical delivery by 10+ days. Novacharge's finance team refuses to authorize payment until K-value data is verified, creating a 10-day payment float that strains cell supplier cash flow.
- When a cell fails in-pack thermal testing, tracing it back to the specific cell formation lot and correlating with the supplier's process data requires manual cross-referencing across 4 different databases.
- Coolant plate suppliers provide leak test results as pass/fail only. When Novacharge's incoming inspection detects a slow leak (below the supplier's detection threshold), there is no data to compare test conditions.

**Why They'd Use Fairbuild:**
- Real-time cell data ingestion via Fairbuild API would eliminate the 2--3 day CSV import lag, giving quality engineers access to formation data within hours of production.
- SVT escrow with K-value trigger: payment could be structured to release 85% upon shipment (capacity + impedance verified) and 15% upon K-value clearance, giving cell suppliers faster partial payment while protecting Novacharge.
- Cell-level traceability chain (cell ID -> formation lot -> module position -> pack test result) built natively into Fairbuild would turn the current 4-database manual trace into a single query.
- Quantitative leak test data (not just pass/fail) uploaded to a shared platform would provide objective evidence for incoming inspection disputes.

---

### OEM-07: Radiant Optics Inc

**Industry:** Display & Lighting Components -- AR/VR Micro-Displays & LED Modules

**Headquarters:** San Jose, CA, USA

**Annual Revenue:** $650M

**Number of Supplier Relationships:** 40

**Products They Source:**
- Micro-OLED panels (0.39"--0.71", 3500+ PPI, for AR/VR headsets)
- LED chip dies (blue InGaN, red AlGaInP, green -- for RGB micro-LED research)
- Wafer-level optics (diffractive waveguides, holographic optical elements)
- Driver ASICs (high-refresh-rate OLED/LED drivers, custom silicon)
- Glass substrates (ultra-thin, 0.1mm--0.3mm, for waveguide combiners)
- Optical coatings (anti-reflective, dichroic, dielectric mirror stacks)
- Precision micro-lens arrays (injection-molded or diamond-turned)

**Typical ERS Structure:**
- Extremely tight specifications; ERS documents 25--50 pages with photometric and colorimetric measurement procedures
- Micro-OLED specs: luminance >= 5,000 cd/m2 peak, contrast ratio >= 100,000:1, pixel defect limits (zero full-pixel defects in a 0.39" panel)
- LED binning ERS references ANSI C78.377 with 1-step or 2-step MacAdam ellipse chromaticity bins
- Waveguide ERS includes MTF at field angles (0, 10, 20, 30 degrees off-axis), eye-box uniformity, and diffractive efficiency
- Test data format: CSV for parametric data, plus TIFF/RAW image files for spatial uniformity maps
- First Article Inspection reports per AS9102 format (adopted from aerospace customers)

**Quality Requirements:**
- Cpk >= 1.67 for micro-OLED luminance and chromaticity (visual quality in near-eye display is paramount)
- Cpk >= 2.00 for LED chip wavelength (1 nm drift is visible in AR overlay)
- AQL: 0.025% for display pixel defects (essentially zero-defect for panels with < 500K pixels)
- Certifications: ISO 9001, plus customer-specific quality agreements with each AR/VR headset OEM
- Suppliers must provide measurement uncertainty budgets per GUM (Guide to Uncertainty in Measurement) for all optical measurements

**Payment Terms:** Net-60; 50% advance for custom waveguide tooling and NRE charges

**Pain Points:**
- Micro-OLED suppliers have yields of 60--75%, meaning 25--40% of panels fail. Radiant needs real-time yield data to manage production scheduling, but yield reports arrive weekly as PDF summaries.
- LED die wavelength binning is done at wafer-level by the epitaxy supplier, but Radiant needs die-level data after singulation and packaging. The data handoff between epi supplier and packaging house is lossy -- bin information is sometimes mismatched.
- Waveguide suppliers' MTF test setups differ in illumination conditions, making cross-supplier comparison unreliable. There is no shared measurement protocol.
- Small volume (thousands, not millions) means Radiant does not have the purchasing power to enforce data format standards on larger suppliers.

**Why They'd Use Fairbuild:**
- Fairbuild's platform-level data format enforcement would give Radiant the standardization they cannot enforce alone, because the platform itself requires structured data.
- Real-time yield visibility from micro-OLED suppliers would enable production planning adjustments within the same day rather than the following week.
- A shared measurement protocol for waveguide MTF, defined in the ERS and verified through Fairbuild's acceptance criteria engine, would make cross-supplier comparison valid.
- LED die-to-package traceability on a shared platform would close the bin-matching gap between epi supplier and packaging house.

---

### OEM-08: Terralink Connectivity

**Industry:** Telecommunications -- 5G Infrastructure Components

**Headquarters:** Espoo, Finland

**Annual Revenue:** $5.7B

**Number of Supplier Relationships:** 210

**Products They Source:**
- 5G mmWave antenna arrays (26--30 GHz phased array modules, 64-element)
- RF power amplifier modules (GaN-on-SiC, 3.5 GHz band, 50W)
- High-frequency PCBs (Rogers 4003C/4350B, 8--12 layer)
- Optical transceivers (SFP28, 25G, for fronthaul/backhaul)
- Weatherproof enclosures (die-cast aluminum, IP67, for outdoor small cells)
- Precision machined heatsinks (CNC aluminum, for active antenna units)
- MIL-DTL-38999 type connectors (adapted for telecom outdoor use)

**Typical ERS Structure:**
- ERS documents 20--40 pages, heavily referencing 3GPP TS 38.104 (base station RF requirements)
- Antenna array ERS: VSWR per port across 26--30 GHz, beam steering accuracy, cross-polarization isolation, EIRP
- RF PA module ERS: Psat, P1dB, PAE (power-added efficiency), gain flatness, EVM at modulated signal
- PCB ERS: impedance control (50 ohm +/- 5%), insertion loss per inch, Dk/Df tolerances for Rogers materials
- Connector ERS per MIL-DTL-38999: contact resistance, mV drop, insulation resistance, hipot
- Data format: S-parameter files (.s2p Touchstone format) for RF components, CSV for mechanical/dimensional

**Quality Requirements:**
- Cpk >= 1.33 for RF parameters (VSWR, return loss, gain)
- Cpk >= 1.67 for antenna beam-steering angular accuracy
- AQL: 0.10% for RF performance defects, 0.25% for mechanical, 1.0% for cosmetic
- Certifications: ISO 9001, TL 9000 (telecom-specific QMS), IATF 16949 for suppliers also serving automotive
- Environmental qualification: MIL-STD-810 methods for salt fog, temperature cycling, vibration (telecom outdoor deployment)
- Each RF module must ship with individual S-parameter test data (not lot-level)

**Payment Terms:** Net-60; quarterly volume rebates based on quality KPI performance (< 500 DPPM = 2% rebate)

**Pain Points:**
- RF test data arrives in mixed formats: some suppliers provide Touchstone .s2p files, others provide CSV extracts of S-parameter data, and some provide only screenshots of VNA displays. Terralink's RF engineering team spends significant time normalizing data for design correlation.
- 210 suppliers across 15 countries create a currency, language, and time zone matrix for quality communication. A single SCAR (Supplier Corrective Action Request) takes 3--5 weeks to close because of email-based back-and-forth.
- Antenna array yields vary 15--20% across three qualified suppliers. Terralink suspects the variation is test-setup-related rather than real, but cannot verify because test data is not comparable.
- Quality-linked rebate calculations are done manually in spreadsheets at the end of each quarter, and suppliers frequently dispute the DPPM numbers.

**Why They'd Use Fairbuild:**
- Structured S-parameter data ingestion would standardize RF test data from all 210 suppliers, enabling automated design correlation and test-measurement agreement analysis.
- Platform-based SCAR workflow would cut corrective action cycle time from 5 weeks to days, with traceable communication threads.
- Unified test data format across three antenna suppliers would enable apples-to-apples yield comparison, exposing whether variation is real or measurement-system-driven.
- Automated DPPM calculation from verified test data on Fairbuild would make quarterly rebate calculations transparent and indisputable.

---

## AUTOMOTIVE (5 OEMs)

---

### OEM-09: Meridian Automotive Systems

**Industry:** Automotive -- Tier-1 Brake Systems Supplier

**Headquarters:** Stuttgart, Germany (plants in Mexico, China, Czech Republic)

**Annual Revenue:** $4.8B

**Number of Supplier Relationships:** 180

**Products They Source:**
- Brake pad friction materials (semi-metallic, ceramic, NAO formulations)
- Aluminum die-cast brake caliper housings (monoblock and 2-piece)
- Steel brake rotors (vented disc, 280mm--400mm diameter)
- Brake hoses and fittings (rubber/Teflon lined, DOT 4 compatible)
- ABS sensor rings (magnetic encoder rings, press-fit type)
- Master cylinder pistons (chromed, precision ground, 22mm--25mm bore)
- Stainless steel brake lines (3/16" and 1/4" SAE J1047)

**Typical ERS Structure:**
- ERS documents 30--50 pages per component, structured per IATF 16949 / VDA 6.3 requirements
- Brake pad ERS references SAE J866 (friction edge code), SAE J2521 (noise matrix), and SAE J2522 (AK-Master dynamometer protocol)
- Caliper casting ERS includes GD&T per ISO 8062-3 with CMM inspection protocol, hydrostatic proof test at 150 bar, and burst test at 350 bar on sampling basis
- Rotor ERS specifies dimensional tolerances (DTV < 0.010 mm, lateral runout < 0.030 mm), hardness range (HB 180--230), and chemical composition per SAE J431 Grade G3000
- Control Plan and PFMEA required as part of ERS package
- Data format: AQDEF (*.dfq) files for dimensional data (common in German automotive), CSV for functional test data

**Quality Requirements:**
- Cpk >= 1.67 for safety-critical dimensions (caliper bore diameter, rotor DTV)
- Cpk >= 1.33 for all other controlled dimensions
- AQL: Not used; 100% inspection for safety-critical parameters; sampling per VDA 5 for others
- Certifications: IATF 16949 (mandatory), ISO 14001, IMDS (International Material Data System) submissions for all materials
- Full PPAP (Level 3) required for new parts and after any process change; ISIR per VDA 2
- Annual process audit per VDA 6.3 for all Tier-2 suppliers

**Payment Terms:** Net-60; 90-day terms for tooling amortization payments

**Pain Points:**
- AQDEF (*.dfq) data format is standard in Germany but incompatible with the MES systems used by Mexican and Chinese Tier-2 suppliers, who produce data in CSV or Excel. Meridian's quality team manually converts data, introducing transcription errors.
- Brake pad friction coefficient data from dynamometer testing takes 5--7 days per SAE J2522 protocol. During this time, pallets of brake pads sit in quarantine, consuming warehouse space and delaying delivery to the OEM customer.
- Caliper proof test data is binary (pass/fail) with no pressure curve recorded. When a caliper fails in-service, Meridian cannot analyze whether the proof test pressure profile was nominal.
- VDA 6.3 audit scores for Chinese suppliers are consistently lower than European suppliers, but Meridian cannot determine if this reflects real process quality or cultural differences in self-assessment.

**Why They'd Use Fairbuild:**
- Fairbuild could accept both AQDEF and CSV formats and normalize them into a single schema, eliminating cross-format conversion errors across Meridian's Mexico/China/Czech supplier base.
- Friction test data uploaded during the 5--7 day test period would give real-time visibility into test progress, enabling partial payment release as individual test stages complete.
- Continuous pressure curve data (not just pass/fail) uploaded to Fairbuild for caliper proof testing would provide the failure analysis data needed for in-service incidents.
- Objective, data-driven supplier quality scoring on Fairbuild would replace subjective VDA 6.3 self-assessments with comparable metrics across all supplier locations.

---

### OEM-10: Zephyr Electric Motors

**Industry:** Automotive -- EV Drivetrain Components

**Headquarters:** Detroit, MI, USA (engineering center in Shanghai)

**Annual Revenue:** $2.3B

**Number of Supplier Relationships:** 110

**Products They Source:**
- Rotor and stator lamination stacks (silicon steel, 0.25mm--0.35mm sheet, laser-cut or stamped)
- Permanent magnets (NdFeB, N48SH grade, for interior permanent magnet motors)
- Motor winding wire (rectangular copper, Class H insulation, 200 C rated)
- Inverter power modules (SiC MOSFET half-bridge, 800V/400A rated)
- Motor housings (aluminum die-cast, with integrated coolant jacket)
- Shaft assemblies (forged 4140 steel, precision ground, with bearing seats)
- Resolvers and encoders (16-bit absolute, for rotor position sensing)

**Typical ERS Structure:**
- ERS documents 25--45 pages, referencing SAE J2907 (motor characterization), IEC 60034 (rotating machines), and ISO 26262 (functional safety)
- Lamination ERS: core loss (W/kg at 1T/400Hz), stacking factor (>= 97%), flatness (< 0.02 mm per lamination), Epstein frame test data per IEC 60404-2
- Magnet ERS: remanence (Br >= 1.38 T), coercivity (Hcj >= 1592 kA/m at 150 C), dimensional tolerances (+/- 0.05 mm), coating adhesion
- Inverter module ERS: Rds(on) at 25 C and 150 C, switching energy (Eon, Eoff), thermal impedance (Zth junction-to-case)
- Motor housing ERS: GD&T with CMM protocol, leak test (internal coolant passages, 3 bar for 60 seconds, zero leakage)
- Data format: CSV for parametric test data; step files + CMM reports in QIF (Quality Information Framework) format for dimensional

**Quality Requirements:**
- Cpk >= 1.67 for lamination core loss (directly affects motor efficiency and EV range)
- Cpk >= 2.00 for magnet remanence and coercivity (motor torque and demagnetization resistance)
- Cpk >= 1.33 for housing dimensions and inverter Rds(on)
- AQL: Zero-defect target for inverter power modules; lot sampling for magnets and laminations
- Certifications: IATF 16949 (mandatory), ISO 26262 ASIL-D for inverter suppliers, ISO 14001
- Run-at-Rate verification per AIAG CQI-8 (Layered Process Audit)

**Payment Terms:** Net-60; quarterly price adjustment per raw material index (neodymium, copper, silicon steel)

**Pain Points:**
- Lamination core loss is the single most impactful parameter on motor efficiency, but Epstein frame test data from the steel mill does not correlate well with actual motor core loss due to manufacturing stress. Zephyr needs motor-level back-EMF data correlated with incoming lamination data, but these datasets live in different systems.
- Magnet suppliers provide room-temperature Br values, but Zephyr needs 150 C Br data for demagnetization analysis. The 150 C test is destructive (requires heating), so only sampling data exists, and its statistical significance is questionable.
- SiC MOSFET inverter modules from two qualified suppliers have different Rds(on) temperature curves. Zephyr's motor controller software must be calibrated per supplier, and there is no automated way to match the incoming inverter lot to the correct calibration file.
- Raw material price adjustments (neodymium, copper) are disputed because Zephyr and suppliers reference different price indices on different dates.

**Why They'd Use Fairbuild:**
- Fairbuild could link lamination Epstein data to motor assembly back-EMF test results, creating a predictive model for core loss that improves over time with more data.
- Structured magnet test data with temperature tags would accumulate enough 150 C Br data points for statistically valid demagnetization analysis.
- Inverter lot-level Rds(on) data on Fairbuild could automatically trigger the correct motor controller calibration file selection, reducing assembly errors.
- Transparent, timestamped raw material price index data on a shared platform would make quarterly price adjustments objective and undisputable.

---

### OEM-11: Safeline Vehicle Components

**Industry:** Automotive Safety -- Airbags, Seat Belts, Steering Wheels

**Headquarters:** Nagoya, Japan (plants in Thailand, India, Brazil)

**Annual Revenue:** $7.2B

**Number of Supplier Relationships:** 250

**Products They Source:**
- Pyrotechnic airbag inflators (stored gas/pyrotechnic hybrid, driver and passenger variants)
- Seat belt webbing (Type 2, 3-point, polyester, 48mm width)
- Seat belt retractor mechanisms (ELR with pretensioner)
- Steering wheel armatures (magnesium or aluminum die-cast frames)
- Airbag fabric (nylon 6,6, silicone-coated, per FMVSS 209)
- Clock spring assemblies (spiral cable, for steering column electrical connection)
- Crash sensors (accelerometers, satellite sensors, for ACU)

**Typical ERS Structure:**
- ERS documents 40--80 pages (safety-critical components require extensive documentation)
- Inflator ERS per ISO 12097-3: helium leak rate (< 1.0 x 10^-6 mbar*L/s), initiator resistance (1.8--2.8 ohm), fill pressure, weight tolerance, 100% testing on all units
- Seat belt webbing ERS per FMVSS 209 / 49 CFR 571.209: tensile strength >= 11,120 N, elongation <= 20%, width 46--54 mm, abrasion resistance after 5,000 cycles
- Retractor ERS: lock-up acceleration threshold (0.5--0.9 g), webbing extraction/retraction force, pretensioner deployment time (< 10 ms)
- Steering wheel armature: dimensional inspection per GD&T, 4-point bending fatigue test (10,000 cycles at 200 Nm)
- 100% test data required for all inflator parameters; lot-level destructive testing for webbing and retractors
- Data format: fixed-format CSV per Safeline's internal "QDS" (Quality Data Standard), which specifies exact column order, naming, and units

**Quality Requirements:**
- Cpk >= 2.00 for all safety-critical parameters (inflator leak rate, webbing tensile, retractor lock-up)
- Cpk >= 1.33 for dimensional and cosmetic parameters
- AQL: Not applicable; 100% testing for inflators, PPAP-level sampling for webbing and retractors
- Certifications: IATF 16949 (mandatory), ISO 45001 (occupational safety), FMVSS 209 compliance, ECE R16 (seat belts), ECE R12 (steering)
- Lot traceability from raw material (nylon yarn, propellant powder) to finished component to vehicle VIN
- Supplier PPM target: < 5 PPM for safety-critical components; contractual penalty above 10 PPM

**Payment Terms:** Net-60; 120-day terms for tooling and capital equipment; penalty holdback of 2% released annually based on PPM performance

**Pain Points:**
- Safeline's proprietary "QDS" data format is not used by any other OEM. Suppliers who also serve other airbag OEMs must maintain parallel data output formats, increasing their quality system complexity and cost -- which gets passed back to Safeline in component pricing.
- 100% inflator test data (50,000+ units/day across 4 plants) generates massive data volumes. Safeline's legacy QMS server infrastructure struggles with data ingestion speed, sometimes causing 24-hour delays between production and data availability.
- Lot traceability across 4 tiers (propellant powder -> initiator -> inflator -> airbag module) requires manual cross-referencing of lot numbers across 4 separate supplier data systems.
- The 2% penalty holdback creates adversarial supplier relationships. Suppliers inflate initial pricing to offset the expected holdback, and disputes over PPM calculations consume significant engineering and procurement time.

**Why They'd Use Fairbuild:**
- Replacing the proprietary "QDS" format with Fairbuild's industry-standard ERS schema would reduce supplier data compliance burden, potentially lowering component costs by reducing the overhead suppliers build into pricing.
- Fairbuild's cloud-native architecture would handle 50,000+ inflator records per day without the legacy server bottleneck, providing near-real-time data availability.
- Multi-tier lot traceability (powder -> initiator -> inflator -> module) built into Fairbuild's data model would replace manual lot cross-referencing with automated genealogy queries.
- SVT-based quality incentives (faster payment for better quality) would replace the punitive holdback model with a positive incentive structure, improving supplier relationships.

---

### OEM-12: Lumos Automotive Lighting

**Industry:** Automotive -- LED Headlamps, Taillamps, Interior Lighting

**Headquarters:** Lippstadt, Germany

**Annual Revenue:** $3.1B

**Number of Supplier Relationships:** 130

**Products They Source:**
- High-power LED packages (white, 5700K, 500+ lm, for headlamp projector modules)
- Polycarbonate headlamp lenses (injection-molded, hard-coated, UV-resistant)
- Aluminum reflector housings (vacuum-metallized, parabolic and freeform geometry)
- LED driver PCBAs (constant-current, thermal foldback, PWM dimming, AECQ-100)
- Silicone optical elements (secondary optics, collimating lenses)
- Wire harness assemblies (headlamp-specific, 6--12 circuits, with sealed connectors)
- Adhesives and sealants (silicone RTV, for lens-to-housing sealing, IP67)

**Typical ERS Structure:**
- ERS documents 20--35 pages, referencing ECE R112 (headlamp photometry), ECE R48 (light installation), ECE R87 (DRL)
- LED package ERS: luminous flux at 700 mA (>= 500 lm), CCT (5500--6500 K, within ANSI 3-step MacAdam), thermal resistance Rth j-c (<= 3 K/W), CRI >= 70
- Headlamp photometry ERS: luminous intensity at ECE R112 test points (B50L <= 350 cd, 75R >= 6600 cd), beam cutoff gradient, color temperature
- Lens ERS: light transmittance >= 88%, haze <= 2.0%, yellowness index after 1000h UV exposure <= 3.0
- Wire harness ERS per IPC/WHMA-A-620: continuity, insulation resistance, hipot
- Data format: photometric IES files for headlamp assemblies, CSV for component-level parametric data

**Quality Requirements:**
- Cpk >= 1.67 for photometric test points (regulatory compliance parameters)
- Cpk >= 1.33 for LED flux and CCT, lens transmittance
- AQL: 0.10% for photometric defects (regulatory risk), 0.40% for functional, 1.0% for cosmetic
- Certifications: IATF 16949, ISO 14001, E-mark (ECE type approval) for finished lamp assemblies
- LED suppliers must provide individual reel-level bin data (chromaticity, flux, Vf bins)

**Payment Terms:** Net-45; volume-based tiered pricing with annual renegotiation

**Pain Points:**
- ECE R112 requires specific photometric performance at exact angular positions. Lumos tests every headlamp assembly, but LED suppliers only test packages at 0-degree. The correlation between LED package data and headlamp-level photometry is poor because secondary optics introduce variability not captured in the LED data.
- Polycarbonate lens UV aging data (yellowness index) is a 1000-hour test. Lumos cannot wait for this data before accepting a lens batch, but late-arriving data has occasionally revealed UV coating failures after lenses were already assembled into headlamps.
- Harness suppliers produce data in a format designed for their other customer (a major Japanese OEM), and converting it to Lumos's format is error-prone.
- Multiple LED suppliers compete for Lumos's business, but comparing their bin data requires manual alignment of different bin coding schemes.

**Why They'd Use Fairbuild:**
- Linking LED package bin data to headlamp photometry results on Fairbuild would build a correlation model over time, predicting headlamp performance from incoming LED data.
- Conditional payment for UV aging data: 90% payment on dimensional/transmittance acceptance, 10% held until 1000-hour UV data confirms yellowness index compliance.
- Standardized harness test data format on Fairbuild would eliminate the cross-format conversion problem.
- Normalized LED bin comparison tool on Fairbuild would enable objective multi-supplier evaluation on a single dashboard.

---

### OEM-13: Titanforge Chassis Group

**Industry:** Automotive -- Chassis, Suspension, & Wheel Components

**Headquarters:** Puebla, Mexico (engineering center in Troy, MI)

**Annual Revenue:** $1.5B

**Number of Supplier Relationships:** 75

**Products They Source:**
- Forged aluminum suspension knuckles (6061-T6 and A356-T6)
- Aluminum alloy wheels (18"--22", low-pressure die-cast and flow-formed)
- Coil springs and stabilizer bars (SAE 5160H spring steel, shot-peened)
- Ball joints and tie rod ends (heat-treated 4140 steel housings, PTFE-lined)
- Rubber bushings (natural rubber and polyurethane, for suspension arms)
- Steering rack housings (die-cast aluminum, with machined seal surfaces)
- Stamped steel brackets (HSLA, 440--590 MPa grade, for subframe attachment)

**Typical ERS Structure:**
- ERS documents 15--30 pages, referencing SAE J267 (wheel performance), SAE J1153 (caliper bench test), SAE J2530 (suspension component testing)
- Wheel ERS: radial and lateral runout at bead seat (<= 0.50 mm), mounting flange runout (<= 0.10 mm), dynamic cornering fatigue test (SAE J267), impact test (SAE J175)
- Knuckle ERS: GD&T per ASME Y14.5, CMM dimensional inspection, X-ray for internal porosity (ASTM E155 reference radiographs), hardness (HB 90--110 for T6 condition)
- Spring ERS: free height tolerance (+/- 2 mm), load at test height (+/- 3%), set loss after 50,000 cycles (< 2 mm), shot peen coverage (>= 98% per Almen strip)
- Data format: CMM reports in QIF or PDF, functional test data in CSV

**Quality Requirements:**
- Cpk >= 1.33 for wheel runout parameters
- Cpk >= 1.67 for suspension knuckle critical bore diameters (bearing seat, ball joint taper)
- AQL: 0.25% for dimensional defects, 0.065% for structural defects (cracks, porosity)
- Certifications: IATF 16949, ISO 14001, CQI-9 (heat treatment process audit for forged/heat-treated parts)
- First Article Inspection per PPAP Level 3 with dimensional results, material certifications, and process capability studies

**Payment Terms:** Net-45; tooling payments per milestone (25/25/25/25 split across design, machining, trial, approval)

**Pain Points:**
- Wheel runout data is collected on automated gauging stations at the wheel supplier, but the raw measurement data is not shared -- only a pass/fail report. Titanforge's incoming inspection occasionally rejects wheels that the supplier passed, and without the raw data, root cause investigation stalls.
- X-ray inspection images for knuckle porosity are evaluated by human inspectors at the foundry using ASTM E155 reference radiographs. Different inspectors at different shifts have different severity interpretations, leading to inconsistent outgoing quality.
- Coil spring set-loss testing is a long-duration test (50,000 cycles at 1--2 Hz = ~7--14 hours). Results arrive days after the springs ship. If the springs fail set-loss testing, the parts are already in Titanforge's assembly line.
- CMM reports from Mexican, Chinese, and Turkish suppliers use different coordinate systems and datum references, making cross-supplier dimensional comparison impossible.

**Why They'd Use Fairbuild:**
- Raw wheel runout measurement data on Fairbuild (not just pass/fail) would enable incoming inspection correlation and GR&R (gauge repeatability and reproducibility) analysis between supplier and Titanforge measurement systems.
- AI-assisted X-ray image evaluation criteria defined in the ERS could standardize porosity classification across shifts and inspectors.
- Spring set-loss test data uploaded in real-time during the 7--14 hour test would give Titanforge early warning of failures before springs enter the assembly line.
- Standardized CMM datum references and coordinate systems defined in the ERS would make cross-supplier dimensional comparison meaningful.

---

## AEROSPACE / DEFENSE (4 OEMs)

---

### OEM-14: Vanguard Propulsion Technologies

**Industry:** Aerospace -- Gas Turbine Engine Components

**Headquarters:** East Hartford, CT, USA

**Annual Revenue:** $12.5B

**Number of Supplier Relationships:** 420

**Products They Source:**
- Investment-cast turbine blades (single-crystal nickel superalloy, CMSX-4 and Rene N5)
- Turbine disk forgings (powder metallurgy nickel superalloy, IN-100 and Rene 88DT)
- Thermal barrier coatings (YSZ/NiCrAlY TBC systems, APS and EB-PVD applied)
- Aerospace fasteners (NAS1100 alloy steel bolts, MP35N corrosion-resistant bolts)
- Combustor liner panels (Hastelloy X sheet, laser-drilled cooling holes)
- Compressor airfoils (Ti-6Al-4V forged blades, 5-axis CNC machined)
- Wire harness assemblies (MIL-DTL-27500 spec, for engine FADEC systems)

**Typical ERS Structure:**
- ERS documents 50--120 pages, referencing AS9100D, AS9102 (FAI), AS9103 (Variation Management of Key Characteristics)
- Turbine blade ERS: airfoil profile tolerance +/- 0.075 mm per 5-axis CMM scan, root form +/- 0.025 mm, cooling hole true position <= 0.15 mm, wall thickness >= 0.75 mm, grain structure per ASTM E92
- TBC ERS per AMS 2447: topcoat thickness 300--500 um, bond coat 75--150 um, porosity 12--18%, adhesion >= 20 MPa (ASTM C633)
- Fastener ERS per NAS1100 and NASM1312: Ftu >= 160 ksi, Fsu >= 95 ksi, elongation >= 10%, HRC 39--45, hydrogen embrittlement sustained-load test (200h)
- All documents include Key Characteristics (KC) flagging per AS9103 with mandatory SPC charting
- Data format: AS9102 FAI forms (Excel-based), SPC data in CSV, NDT images in DICONDE format
- Full material traceability from melt source to finished part (per AMS 2750 for heat treatment, AMS 2759 for processing)

**Quality Requirements:**
- Cpk >= 2.00 for Key Characteristics (airfoil profile, root form, cooling hole position)
- Cpk >= 1.67 for all other controlled dimensions
- AQL: Not used; acceptance per AS9102 FAI and ongoing SPC per AS9103
- Certifications: AS9100D (mandatory), Nadcap accreditation for special processes (heat treatment, NDT, coatings, welding)
- FAIR (First Article Inspection Report) per AS9102 for every new part number and after any process change
- 100% CMM inspection on rotating parts (blades, disks); sampling for static parts (brackets, fairings)
- Failure analysis turnaround: 48 hours for preliminary report, 10 days for full metallurgical report

**Payment Terms:** Net-90; progress payments for long-lead forgings and castings (monthly milestones against delivery schedule)

**Pain Points:**
- AS9102 FAI reports are 50--200 pages of Excel spreadsheets per part number. Vanguard receives 100+ FAI reports per month. Reviewing them is a full-time job for 4 quality engineers, and errors are discovered weeks after approval.
- Nadcap audit findings for suppliers' special processes (heat treatment, coating) are tracked in a separate Nadcap database, disconnected from Vanguard's supplier quality management system. An audit finding in coating process could affect 15 part numbers, but mapping the impact requires manual cross-referencing.
- Turbine blade CMM data volumes are enormous: 5-axis scanning generates 500,000+ points per blade. Current file transfer via encrypted email frequently fails for files > 50 MB.
- Net-90 payment terms combined with 6--12 month casting lead times mean small foundries that supply single-crystal blades carry 9+ months of WIP inventory before receiving any payment. Three critical foundries have gone bankrupt in the last decade, disrupting Vanguard's supply chain.

**Why They'd Use Fairbuild:**
- Structured AS9102 FAI ingestion on Fairbuild would enable automated review against ERS limits, flagging only out-of-spec characteristics for human review -- reducing the 4-person review team's workload by 70%.
- Linking Nadcap process audit findings to affected part numbers through a shared supplier quality platform would enable automated impact analysis.
- Cloud-native large-file handling for CMM scan data (500K+ points) would replace email-based file transfer with reliable, auditable data delivery.
- SVT-based progress payments triggered by quality milestones (FAI approved, SPC in control) would give small foundries cash flow earlier, reducing bankruptcy risk in the supply base.

---

### OEM-15: Celestial Aerostructures

**Industry:** Aerospace -- Composite Aerostructures & Assemblies

**Headquarters:** Wichita, KS, USA (facilities in Toulouse, France and Nagoya, Japan)

**Annual Revenue:** $6.8B

**Number of Supplier Relationships:** 200

**Products They Source:**
- Autoclave-cured CFRP (carbon fiber reinforced polymer) skin panels (wing, fuselage, empennage)
- Prepreg materials (Hexcel IM7/8552, Toray T800S/3900-2)
- Honeycomb core (Nomex and aluminum, for sandwich panel construction)
- Titanium machined fittings (Ti-6Al-4V, 5-axis CNC, for joint structures)
- Sealants and adhesives (polysulfide fuel tank sealant, epoxy structural adhesive per BMS 5-89)
- Lightning strike protection mesh (expanded copper foil, 100 g/m2)
- Composite repair kits (pre-cut prepreg patches, for MRO channel)

**Typical ERS Structure:**
- ERS documents 30--80 pages, referencing NASA PRC-6501 (composite UT inspection), ASTM D3171 (fiber content), ASTM D2734 (void content)
- CFRP panel ERS: cured ply thickness (CPT) per Hexcel datasheet (0.131 mm for IM7/8552), total laminate thickness tolerance +/- 0.25 mm, fiber volume 57--63%, void content <= 2.0%, Tg >= 185 C (DMA)
- Ultrasonic C-scan acceptance: no delamination >= 1.0" or area >= 0.785 sq in, no porosity >= 0.5", no foreign object inclusions
- Titanium fitting ERS: GD&T per ASME Y14.5 with 5-axis CMM, surface finish Ra <= 3.2 um, dye penetrant inspection (DPI) per ASTM E1417 with zero rejectable indications
- Prepreg incoming material ERS: resin content +/- 2% of nominal, tack level (qualitative), gel time, and fiber areal weight (FAW) per ASTM D3529
- Data format: CMM data in QIF, C-scan images in DICONDE, test coupons in CSV, material certs in PDF

**Quality Requirements:**
- Cpk >= 1.67 for laminate thickness and fiber volume fraction (structural load-carrying capability)
- Cpk >= 1.33 for titanium fitting dimensions
- Reject rate for C-scan indications: <= 3% of panels (higher rates trigger process audit)
- Certifications: AS9100D, Nadcap for composites (bonding, NDT), OASIS for process specs
- Material traceability: every prepreg roll traced from fiber lot through cure cycle to finished panel
- Witness testing: Celestial quality representative present for first-article cure cycles at new suppliers

**Payment Terms:** Net-75; milestone payments for large tooling (autoclave tools, bond jigs) per TINA cost-plus auditable basis

**Pain Points:**
- CFRP panels have a 3--5% rejection rate at C-scan. Each rejected panel costs $50K--$200K (material + labor). Celestial needs predictive analytics linking prepreg incoming data (resin content, tack, gel time) to C-scan outcomes, but this data resides in separate systems at the prepreg supplier and the panel fabricator.
- Titanium fitting suppliers provide CMM data in different coordinate systems (machine coordinates vs. part coordinates), and Celestial's dimensional analysis team must transform each report manually.
- Prepreg material shelf life management is critical (6 months at -18 C). Suppliers ship material with 4--5 months remaining life, but the data (manufacture date, ship date, storage conditions) arrives separately from the physical material, sometimes after the material is already in the freezer.
- Nadcap composite process audits generate findings that require corrective action, but the corrective action verification is a manual paper process that takes 3--6 months to close.

**Why They'd Use Fairbuild:**
- Linking prepreg incoming data (resin content, gel time) with panel-level C-scan outcomes on Fairbuild would enable predictive quality models that reduce the 3--5% rejection rate.
- Standardized CMM coordinate system requirements in the ERS, enforced by Fairbuild's data validation, would eliminate manual coordinate transformation.
- Prepreg shelf-life data attached to material lot records on Fairbuild would provide real-time out-time tracking from manufacture through delivery to cure.
- Digital Nadcap corrective action tracking on Fairbuild, linked to affected part numbers and production lots, would reduce closure time from months to weeks.

---

### OEM-16: Sentinel Defense Electronics

**Industry:** Aerospace & Defense -- Military Avionics & Communication Systems

**Headquarters:** Dallas, TX, USA

**Annual Revenue:** $9.3B

**Number of Supplier Relationships:** 350

**Products They Source:**
- Hybrid microcircuits (gold wire-bonded, ceramic substrate, MIL-PRF-38534 Class H)
- MIL-DTL-38999 Series III circular connectors (size 11--25, with EMI backshells)
- Conformal-coated PCB assemblies (IPC-A-610 Class 3, MIL-I-46058 coating)
- RF amplifier modules (GaN, 2--18 GHz wideband, for EW applications)
- Ruggedized display assemblies (sunlight-readable LCD, MIL-STD-810G qualified)
- Flex cables (MIL-PRF-31032 qualified, for avionics racks)
- Radiation-hardened FPGAs and ASICs (for space and high-altitude applications)

**Typical ERS Structure:**
- ERS documents 60--150 pages, heavily referencing MIL-STD-883 (test methods for microelectronics), MIL-STD-810G (environmental testing), MIL-PRF-38534 (hybrid microcircuit performance)
- Hybrid microcircuit ERS per MIL-STD-883: Method 2011.9 (wire bond pull test, 1.0 mil Au >= 3.0 gf), Method 2004 (lead integrity), Method 1010 (temperature cycling -65 to +150 C, 100 cycles), Method 1014 (seal test, He leak rate < 5 x 10^-8 atm*cc/s)
- Connector ERS per MIL-DTL-38999: contact resistance <= 14.6 mohm for size 22D, mV drop <= 85 mV at rated current, shell-to-ground <= 10 mohm, insulation resistance >= 5000 Mohm
- PCBA ERS: IPC-A-610 Class 3 (high-reliability), conformal coating coverage per MIL-I-46058 Type XY (UV inspection for coverage verification)
- First Article Test (FAT) and First Article Inspection (FAI) per MIL-STD-810G and AS9102
- Data format: MIL-STD-1553B data bus format for functional test data, CSV for parametric, DICONDE for NDT, DD-250 (Material Inspection and Receiving Report) for acceptance documentation

**Quality Requirements:**
- Cpk >= 2.00 for wire bond pull strength and connector contact resistance (mission-critical reliability)
- Cpk >= 1.67 for all other electrical parameters
- Zero-defect target for flight hardware; lot rejection for any wire bond failure below minimum
- Certifications: AS9100D with ITAR (International Traffic in Arms Regulations) compliance, Nadcap for electronics, CMMC Level 2 (cybersecurity)
- GIDEP (Government-Industry Data Exchange Program) participation for counterfeit part avoidance
- DLA QPL (Qualified Products List) listing required for standard military connectors and wire

**Payment Terms:** Net-30 (US government contract flow-down terms, DFARS 252.232-7010 applies); progress payments per contract milestones

**Pain Points:**
- ITAR compliance adds complexity to data sharing: test data cannot be stored on servers outside the US, emailed to non-US-persons, or accessed by non-cleared personnel. Current practice of emailing encrypted PDFs is cumbersome and non-auditable.
- MIL-STD-883 testing generates 20+ individual test results per hybrid microcircuit. These results must be compiled into a Test Data Package (TDP) that accompanies each lot. TDP assembly is a manual, error-prone process taking 2--4 hours per lot.
- Counterfeit part risk is high for connectors and passive components. Current mitigation relies on DLA QPL verification and visual inspection, but incoming test data that could detect subtle counterfeits (e.g., contact resistance out of family) is not systematically analyzed.
- US government Net-30 terms are favorable, but small defense electronics subcontractors still face cash flow challenges because Sentinel's internal invoice processing takes 15--20 days before the Net-30 clock starts.

**Why They'd Use Fairbuild:**
- Fairbuild with ITAR-compliant hosting (US-only servers, access controls per clearance level) would replace encrypted email with a secure, auditable data sharing platform.
- Automated TDP assembly from structured test data on Fairbuild would reduce lot documentation time from 2--4 hours to minutes.
- Statistical "out of family" detection on incoming connector test data could flag potential counterfeit parts before they enter production.
- SVT-based payment would start the Net-30 clock immediately upon data upload, eliminating the 15--20 day internal processing delay and giving subcontractors effective Net-30 instead of effective Net-50.

---

### OEM-17: Altus Space Systems

**Industry:** Aerospace -- Satellite Components & Space Hardware

**Headquarters:** El Segundo, CA, USA

**Annual Revenue:** $1.1B

**Number of Supplier Relationships:** 65

**Products They Source:**
- Radiation-hardened (rad-hard) electronic components (ADCs, DACs, memory, FPGAs)
- Solar panel substrates (aluminum honeycomb with CFRP facesheets, for solar array deployment)
- Thermal control hardware (multilayer insulation blankets, heat pipes, radiator panels)
- Reaction wheel assemblies (for satellite attitude control, 4 Nms momentum capacity)
- Optical payloads (mirror substrates, detector assemblies, baffle tubes)
- Spacecraft structural panels (aluminum sandwich panels, M55J/954-6 CFRP)
- Pyrotechnic separation devices (explosive bolts, separation nuts, for stage separation and deployables)

**Typical ERS Structure:**
- ERS documents 40--100 pages, referencing NASA-STD-5009 (nondestructive evaluation), NASA-STD-6016 (materials and processes), GSFC-STD-7000 (General Environmental Verification Standard, GEVS)
- Rad-hard component ERS: Total Ionizing Dose (TID) tolerance >= 100 krad(Si), Single Event Latchup (SEL) immunity at LET >= 75 MeV*cm2/mg, parameter drift limits after radiation exposure
- Solar panel substrate ERS: flatness <= 0.5 mm over 2m span, facesheet-to-core bond shear strength >= 2.5 MPa (ASTM C273), thermal cycling survival (-180 C to +120 C, 2000 cycles)
- Reaction wheel ERS: vibration (22 Grms random, per GEVS), jitter (micro-vibration PSD, < 0.001 N/sqrt(Hz) above 100 Hz), momentum storage accuracy +/- 0.1%
- Data format: test data packages per NASA DRD (Data Requirements Description) templates, CSV for parametric, PDF for analysis reports, HDF5 for large datasets

**Quality Requirements:**
- Cpk >= 1.67 for rad-hard component parametric limits (functionality in space is non-negotiable)
- Cpk >= 2.00 for reaction wheel balance and jitter characteristics
- Zero-defect for flight hardware; every unit undergoes full environmental qualification sequence (vibration, thermal vacuum, EMI/EMC)
- Certifications: AS9100D, NASA-STD-8739 series (workmanship standards for electronics), EEE-INST-002 (instructions for EEE parts selection and derating)
- Heritage parts preference: suppliers must demonstrate flight heritage or complete full qualification test program
- Independent verification and validation (IV&V) of critical test results by third-party lab

**Payment Terms:** Net-45; cost-plus contracts for custom hardware with monthly invoice against actuals; firm-fixed-price for catalog items

**Pain Points:**
- Radiation test data for components is generated by specialized labs (e.g., TRAD, Cobham RAD) and delivered as PDF reports 3--6 months after parts are ordered. By the time data arrives, Altus has already started board-level assembly, creating schedule risk if a component fails radiation testing.
- Reaction wheel micro-vibration data is complex (power spectral density across frequency range) and arrives in proprietary formats from different wheel suppliers. Comparing two wheel suppliers' jitter performance requires manual data processing by a dynamics engineer.
- Solar panel bond shear test is destructive (test coupons are cut from witness panels cured alongside flight panels). The lag between coupon test results and flight panel acceptance creates a quality gap.
- Small production volumes (10--50 satellites per year) mean each unit is essentially hand-built. Traditional SPC methods (Cpk) have limited statistical meaning with sample sizes of 10--50.

**Why They'd Use Fairbuild:**
- Structured radiation test data on Fairbuild would provide immediate visibility into component qualification status, enabling Altus to delay board assembly until radiation data is confirmed, or to accept risk with full traceability.
- Standardized PSD data format for reaction wheel jitter on Fairbuild would enable automated cross-supplier comparison.
- Witness panel coupon data linked to flight panel records on Fairbuild would close the destructive test traceability gap.
- For small-volume production, Fairbuild's data accumulation over multiple builds would eventually provide statistically meaningful process capability data, even if individual builds have small sample sizes.

---

## FOOD / PHARMA / MEDICAL (3 OEMs)

---

### OEM-18: Pinnacle Pharmaceuticals

**Industry:** Pharmaceutical -- Solid Oral Dosage Forms (Tablets & Capsules)

**Headquarters:** Basel, Switzerland (manufacturing in Ireland, Singapore, India)

**Annual Revenue:** $18.5B

**Number of Supplier Relationships:** 280

**Products They Source:**
- Active Pharmaceutical Ingredients (APIs) from contract chemical manufacturers
- Excipients (microcrystalline cellulose, magnesium stearate, croscarmellose sodium)
- Film coating materials (Opadry complete film coating systems)
- Blister packaging foils (PVC/Aluminum, child-resistant)
- HPLC columns and reference standards (for QC analytical testing)
- Tablet compression tooling (punches and dies, D-type and B-type)
- Contract testing laboratory services (stability testing, dissolution, bioequivalence)

**Typical ERS Structure:**
- ERS documents (called "Material Specifications" or "Purchasing Specifications" in pharma) are 15--40 pages, referencing USP/NF monographs, ICH Q6A (specifications for new drug substances and products), and pharmacopoeial test methods
- API specification: assay (98.0--102.0% by HPLC), related substances (individual impurity <= 0.10%, total <= 0.50%), residual solvents per ICH Q3C, particle size distribution (D90 <= 50 um, for dissolution performance)
- Finished product specification per USP monograph: content uniformity per USP <905> (L1 AV <= 15.0), dissolution per USP <711> (Q = 80% in 30 min), hardness (80--150 N), friability <= 1.0%
- Stability testing per ICH Q1A: 25 C/60% RH for 24 months, 40 C/75% RH for 6 months
- Data format: LIMS (Laboratory Information Management System) export in CSV, CoA (Certificate of Analysis) in PDF, chromatographic raw data in CDS format (Empower, Chromeleon)

**Quality Requirements:**
- Cpk >= 1.33 for tablet weight, hardness, and dissolution
- Cpk >= 1.67 for API assay and related substances (regulatory limits are tight)
- AQL: Not used in pharma; acceptance per USP tests and pharmacopoeial procedures
- Certifications: cGMP per FDA 21 CFR Parts 210/211, EU GMP Annex 1 (sterile) or Annex 13 (clinical), ICH Q7 (API GMP)
- Annual supplier audit per PIC/S guidelines; FDA pre-approval inspection support
- Data integrity per FDA guidance on electronic records (21 CFR Part 11), ALCOA+ principles

**Payment Terms:** Net-60 for API suppliers; Net-45 for excipients and packaging; Net-30 for contract labs

**Pain Points:**
- API Certificate of Analysis (CoA) data is received as PDF, which must be manually transcribed into Pinnacle's LIMS for batch release. A single transcription error in impurity data could lead to regulatory non-compliance.
- ICH Q6A requires that API and excipient specs be justified with data from multiple batches. Pinnacle must collect and statistically analyze supplier batch data, but this data comes from 12 different API suppliers in 8 countries, each with different LIMS formats.
- Stability data from contract testing labs arrives quarterly as PDF reports. Consolidating stability data across multiple products, multiple storage conditions, and multiple labs into a single trending database requires a full-time data analyst.
- FDA inspections increasingly focus on data integrity (21 CFR Part 11, ALCOA+ principles). Pinnacle's current paper-based supplier qualification records and emailed CoA PDFs do not meet modern data integrity expectations.

**Why They'd Use Fairbuild:**
- Structured CoA data ingestion (not PDF) would eliminate transcription errors in API impurity data, with cryptographic audit trail meeting 21 CFR Part 11 requirements.
- Standardized batch data across 12 API suppliers on Fairbuild would automate the statistical justification required by ICH Q6A.
- Stability data from contract labs uploaded directly to Fairbuild would provide automated trending and out-of-trend alert generation.
- Fairbuild's immutable data records and audit trail would satisfy FDA data integrity expectations during inspections, replacing paper-based supplier qualification records.

---

### OEM-19: VitaSource Nutrition

**Industry:** Food Manufacturing -- Nutritional Supplements & Functional Foods

**Headquarters:** Zurich, Switzerland (manufacturing in the Netherlands and New Jersey, USA)

**Annual Revenue:** $2.8B

**Number of Supplier Relationships:** 160

**Products They Source:**
- Vitamin and mineral premixes (custom blends, for tablets and powders)
- Botanical extracts (curcumin, omega-3, probiotics, standardized potency)
- Gelatin and HPMC capsule shells (sizes 00--4, clear and colored)
- Whey protein concentrate and isolate (WPC80, WPI90, for sports nutrition)
- Packaging materials (HDPE bottles, sachets, aluminum-laminated pouches)
- Contract analytical testing services (HPLC, ICP-MS for heavy metals, microbiological)
- Flavoring and sweetener systems (natural flavors, stevia, sucralose)

**Typical ERS Structure:**
- ERS documents (called "Raw Material Specifications") 10--25 pages, referencing USP Dietary Supplement monographs, AOAC analytical methods, and FDA 21 CFR 111 (cGMP for dietary supplements)
- API/active ingredient specs: identity (HPLC or FTIR confirmation), potency (assay 95--105% of label claim per AOAC method), heavy metals (Pb <= 0.5 ppm, As <= 1.0 ppm, Cd <= 0.3 ppm, Hg <= 0.1 ppm per USP <2232>)
- Microbiological limits: Total aerobic count <= 10,000 CFU/g, yeast & mold <= 100 CFU/g, E. coli absent in 10g, Salmonella absent in 25g
- Allergen testing: ELISA for major allergens (milk, soy, gluten, peanut) with limits per FALCPA
- Packaging spec: seal integrity (burst test >= 15 psi), moisture vapor transmission rate (MVTR) <= 0.5 g/m2/day
- Data format: PDF Certificates of Analysis, with some progressive suppliers providing CSV or XML

**Quality Requirements:**
- Cpk >= 1.00 for tablet weight and capsule fill weight (dietary supplement tolerances are wider than Rx pharma)
- Cpk >= 1.33 for active ingredient potency (label claim accuracy is a regulatory requirement)
- AQL: 1.0% for fill weight, 0.10% for foreign material
- Certifications: NSF/ANSI 455-2 (dietary supplement GMP), GMP per 21 CFR 111, ISO 22000 (food safety) for ingredient suppliers, organic and non-GMO certifications where applicable
- Third-party verification: USP Verified or NSF Certified for Sport for premium product lines
- Supplier ingredient identity testing on every incoming lot per 21 CFR 111.75

**Payment Terms:** Net-30 for domestic; Net-45 for international ingredient suppliers

**Pain Points:**
- Botanical extract suppliers (often in India and China) provide CoAs with assay values, but VitaSource's incoming QC lab frequently gets different results due to differences in extraction solvents, HPLC columns, and reference standards. There is no way to reconcile these differences without seeing the supplier's raw chromatographic data.
- Heavy metal testing (ICP-MS) at contract labs takes 7--10 business days. Incoming ingredient lots sit in quarantine during this period, tying up warehouse space and delaying production.
- Allergen cross-contamination risk requires suppliers to declare shared-line allergen exposure, but this information is provided informally via email and not systematically tracked. A single undeclared allergen exposure led to a $4M product recall.
- 21 CFR 111.75 requires identity testing on every incoming lot of every component. With 160 suppliers and 400+ raw materials, this creates an enormous testing burden that could be reduced if supplier data were more reliable and verifiable.

**Why They'd Use Fairbuild:**
- Shared chromatographic method parameters and reference standard traceability on Fairbuild would enable lab-to-lab assay reconciliation for botanical extracts.
- Heavy metal test data uploaded directly from the contract lab to Fairbuild would enable automated release as soon as results meet specifications, reducing quarantine time.
- Structured allergen declaration data on Fairbuild (not email) would create a systematic, auditable allergen risk database that could prevent future recalls.
- Verified supplier CoA data on Fairbuild could support a skip-lot testing program per 21 CFR 111.75(b), reducing incoming testing burden by 50%+ for high-reliability suppliers.

---

### OEM-20: Meridius Medical Devices

**Industry:** Medical Devices -- Orthopedic Implants & Surgical Instruments

**Headquarters:** Warsaw, IN, USA (the "Orthopedic Capital of the World")

**Annual Revenue:** $4.2B

**Number of Supplier Relationships:** 140

**Products They Source:**
- Titanium alloy forgings and bar stock (Ti-6Al-4V ELI per ASTM F136, for hip/knee implants)
- CoCrMo (cobalt-chrome) investment castings (per ASTM F75, for femoral components)
- Ultra-high molecular weight polyethylene (UHMWPE) bearing inserts (GUR 1020/1050, crosslinked)
- Surgical instrument forgings (17-4 PH stainless steel, for reamers, broaches, cutting tools)
- Sterile packaging (Tyvek/PET pouches, validated for EtO and gamma sterilization)
- Contract sterilization services (ethylene oxide, gamma irradiation, e-beam)
- Ceramic femoral heads (alumina or zirconia-toughened alumina, per ISO 6474)

**Typical ERS Structure:**
- ERS documents 30--60 pages, referencing FDA 21 CFR 820 (Quality System Regulation), ISO 13485, ASTM material standards (F136, F75, F648)
- Titanium forging ERS: chemical composition per ASTM F136 (Al 5.50--6.75%, V 3.50--4.50%, Fe <= 0.25%, O <= 0.13%), mechanical properties (UTS >= 860 MPa, YS >= 795 MPa, elongation >= 10%), microstructure evaluation per ASTM E112 (grain size #5 or finer)
- CoCrMo casting ERS: chemical composition per ASTM F75, porosity acceptance per ASTM E192 reference radiographs (Level 2 max), surface finish Ra <= 0.4 um on articulating surfaces (mirror polish)
- UHMWPE ERS: crystallinity 50--60% (DSC), oxidation index <= 0.1 (FTIR per ASTM F2102), crosslink density (swell ratio testing)
- Sterilization validation: SAL (sterility assurance level) 10^-6, dose mapping per ISO 11137
- Data format: Device History Record (DHR) format per FDA 21 CFR 820.184, CSV for dimensional and material test data, validation protocol results in PDF

**Quality Requirements:**
- Cpk >= 1.67 for implant critical dimensions (bearing surfaces, taper geometry)
- Cpk >= 2.00 for titanium chemical composition (biocompatibility depends on tight compositional control)
- AQL: Not used; 100% inspection for implant components, sampling per ASTM E1916 for instruments
- Certifications: ISO 13485 (mandatory), FDA 21 CFR 820 compliance, CE marking (MDR 2017/745 for EU market), MDSAP (Medical Device Single Audit Program)
- Material traceability: heat-to-implant traceability per UDI (Unique Device Identification) requirements
- Biocompatibility testing per ISO 10993 series for all patient-contacting materials

**Payment Terms:** Net-60; consignment inventory for fast-moving instrument sets; milestone payments for custom implant tooling

**Pain Points:**
- Titanium bar stock suppliers provide mill test certificates (MTCs) as scanned PDFs. Meridius must manually enter chemical composition and mechanical property data into their QMS for every heat number. With 500+ heats per year, this is a significant labor cost and error source.
- CoCrMo investment casting porosity classification (ASTM E192 reference radiograph comparison) is subjective. Different radiographers at the foundry interpret the same X-ray differently. Meridius has rejected castings that the foundry passed, and vice versa.
- UHMWPE oxidation index data (FTIR-based) is a leading indicator of long-term implant performance. Suppliers provide a single value per lot, but Meridius needs spatial oxidation mapping across the bearing surface to detect inconsistencies in crosslinking.
- FDA MDR (Medical Device Reporting) requires traceable data from raw material through manufacturing to the specific patient (via UDI). Current paper-based lot travelers and disconnected supplier data systems make this trace-back take days when an adverse event is reported.

**Why They'd Use Fairbuild:**
- Structured MTC data on Fairbuild (not scanned PDFs) would eliminate manual data entry for 500+ heats per year and enable automated composition verification against ASTM F136 limits.
- Quantitative porosity classification criteria defined in the ERS (e.g., maximum pore size, pore density per cm2) would replace subjective reference radiograph comparison with objective, measurable acceptance criteria.
- Spatial oxidation index data (multiple measurement points per bearing) on Fairbuild would enable oxidation uniformity analysis and early detection of crosslinking process drift.
- End-to-end material traceability (heat -> forging -> machined implant -> UDI) on Fairbuild would reduce adverse event trace-back from days to minutes, satisfying FDA expectations.

---

## STEEL / METALS / ENERGY (3 OEMs)

---

### OEM-21: Ironvale Steel & Alloys

**Industry:** Steel Manufacturing -- Structural & Pressure Vessel Steel

**Headquarters:** Dusseldorf, Germany (service centers in Houston, TX and Mumbai, India)

**Annual Revenue:** $6.5B

**Number of Supplier Relationships:** 90

**Products They Source:**
- Steel plate from mills (ASTM A36 structural, ASTM A516 Grade 70 pressure vessel, ASTM A572 Grade 50 HSLA)
- Steel pipe (API 5L X42--X70 line pipe, ERW and seamless)
- Steel forgings (SA-105 flanges, SA-182 F11/F22 valve bodies)
- Welding consumables (E7018 electrodes, ER70S-6 MIG wire, submerged arc flux)
- Heat treatment services (normalizing, quench & temper, stress relief)
- Non-destructive examination services (RT, UT, MT, PT per ASME V and AWS D1.1)
- Corrosion-resistant alloy (CRA) cladding (Inconel 625 weld overlay on carbon steel)

**Typical ERS Structure:**
- ERS documents (called "Material Purchase Specifications") 10--30 pages, referencing ASTM material standards, ASME BPVC (Boiler and Pressure Vessel Code), API standards
- Steel plate ERS: chemical composition per ASTM (e.g., A36: C <= 0.26%, Mn <= 1.03%, P <= 0.04%, S <= 0.05%), mechanical properties (YS, UTS, elongation per ASTM A370), Charpy V-notch impact energy (>= 27 J average at -30 C for cold-weather applications)
- Pipe ERS per API 5L: wall thickness tolerance (-12.5%), UT inspection (body and weld seam), hydrostatic test, chemical and mechanical per PSL2
- Forging ERS: hardness testing per ASTM E10 (Brinell, <= 187 HBW for SA-105 flanges), UT inspection per SA-388
- Mill test certificate (MTC) per EN 10204 Type 3.1 required for all steel products
- Data format: MTC in PDF (universal in steel industry), supplemental test data in CSV on request

**Quality Requirements:**
- Cpk >= 1.00 for chemical composition elements (steel mill processes have inherent variability)
- Cpk >= 1.33 for mechanical properties (YS, UTS)
- Impact testing: minimum average of 3 specimens >= 27 J, no individual below 20 J
- Certifications: ISO 9001 (steel mills), ASME stamp (for pressure vessel fabricators), API monogram (for pipe mills), PED/CE mark for EU pressure equipment
- MTC verification: Ironvale independently verifies 10% of incoming MTCs by sending samples to third-party labs
- Positive Material Identification (PMI) on 100% of alloy steel products

**Payment Terms:** Net-30 for commodity structural steel; Net-45 for alloy and pressure vessel grades; letter of credit for large international orders

**Pain Points:**
- MTCs arrive as PDFs, sometimes scanned from paper. Ironvale receives 2,000+ MTCs per month. Manual data entry into their ERP system costs $150K/year in labor and has a 2--3% error rate. An MTC error that mislabeled a Grade 50 plate as Grade 36 caused a $800K project rework.
- Steel mills provide Charpy impact test data as part of the MTC, but the data is for the mill's test temperature (typically 0 C or -20 C), not always the project-required temperature (e.g., -30 C or -46 C). Ironvale must order supplementary impact testing, adding 2--3 weeks to material acceptance.
- Heat treatment service providers give a furnace chart (time-temperature recording) as a paper strip chart or low-resolution JPEG. Verifying that the actual temperature profile met the specification (e.g., normalizing at 900 C +/- 15 C for 1 hour/inch) requires manual interpretation.
- Weld quality NDT reports from fabrication subcontractors reference AWS D1.1 or ASME Section V acceptance criteria, but the interpretation of radiographic film quality and indication severity is inconsistent across NDE technicians at different subcontractors.

**Why They'd Use Fairbuild:**
- OCR + structured data extraction from MTC PDFs into Fairbuild's standardized format would eliminate manual data entry and the 2--3% error rate, preventing costly material mis-identification events.
- Automated Charpy impact temperature matching: Fairbuild's ERS engine would flag when mill test temperature does not match project requirements, triggering supplementary test orders immediately rather than weeks after receipt.
- Digital furnace chart data (time-temperature CSV, not paper strip charts) on Fairbuild would enable automated compliance verification against heat treatment specifications.
- Standardized NDT report data with quantitative indication sizing on Fairbuild would reduce subjectivity in radiographic interpretation across subcontractors.

---

### OEM-22: PetroForge Pipeline Solutions

**Industry:** Oil & Gas -- Pipeline Components & Pressure Equipment

**Headquarters:** Houston, TX, USA (regional offices in Abu Dhabi, Singapore, Calgary)

**Annual Revenue:** $3.8B

**Number of Supplier Relationships:** 175

**Products They Source:**
- API 5L line pipe (X42--X70 grades, 4"--48" diameter, ERW, LSAW, seamless)
- Forged steel fittings (ASTM A234 WPB elbows, tees, reducers)
- Flange forgings (SA-105, SA-182 F304/F316, ASME B16.5 Class 150--2500)
- Valve bodies and internals (gate, globe, ball, check -- forged and cast)
- Corrosion inhibitor chemicals (for internal pipeline protection)
- Pipeline coatings (3LPE, 3LPP, FBE per ISO 21809 series)
- Bolting (ASTM A193 B7 studs, ASTM A194 2H nuts, PTFE-coated for subsea)

**Typical ERS Structure:**
- ERS documents (called "Project Material Specifications" or PMS) 20--50 pages, referencing API, ASME, NACE standards
- Pipe PMS per API 5L PSL2: chemical limits, mechanical properties, UT inspection (100% body and weld), hydrostatic test, HIC testing per NACE TM0284 for sour service
- Fitting PMS per ASTM A234: hardness <= 22 HRC (NACE MR0175 sour service), dimensional inspection per ASME B16.9, PMI verification
- Coating PMS per ISO 21809-1 (3LPE): adhesion peel strength >= 100 N/cm at 23 C, cathodic disbondment <= 10 mm radius at 23 C/28 days, holiday detection at 25 kV/mm
- HIC testing: crack sensitivity ratio (CSR) <= 2.0%, crack length ratio (CLR) <= 15%, crack thickness ratio (CTR) <= 5.0% per NACE TM0284
- Data format: ITPs (Inspection and Test Plans) with hold/witness points, test data in CSV or PDF, inspection release notes (IRNs)

**Quality Requirements:**
- Cpk >= 1.33 for pipe wall thickness and mechanical properties
- Cpk >= 1.67 for HIC test results (sour service integrity is critical)
- Zero-tolerance for hardness exceedances in sour service applications (> 22 HRC = immediate rejection)
- Certifications: ISO 9001, API monogram (5L, 6D, 6A), NACE MR0175/ISO 15156 compliance, PED 2014/68/EU
- Third-party inspection (TPI) by Bureau Veritas, Lloyd's, or DNV at manufacturer's plant
- Vendor document requirements (VDR): 15--25 documents per purchase order including MTCs, procedures, test reports

**Payment Terms:** Net-45; retention of 10% until final documentation package accepted; letter of credit for orders > $500K

**Pain Points:**
- Vendor Document Requirements (VDR) for a single PO can total 500+ pages across 15--25 document types. PetroForge's document control team reviews each page manually, a process that takes 2--4 weeks per PO and delays final payment.
- HIC testing per NACE TM0284 takes 96+ hours (4 days of immersion). Results arrive 2--3 weeks after pipe delivery. If HIC fails, the pipe is already installed in the field, requiring costly remediation.
- Third-party inspectors at supplier plants generate Inspection Release Notes (IRNs) that are emailed as PDFs. Tracking which IRNs are outstanding, which are approved, and which POs are blocked waiting for IRN approval is managed in spreadsheets.
- 10% documentation retention means suppliers do not receive final payment until the complete document package is accepted. Document package rejection for minor formatting issues (wrong revision number on a procedure) delays payment by weeks, straining supplier relationships.

**Why They'd Use Fairbuild:**
- Automated VDR compliance checking on Fairbuild would reduce document review time from 2--4 weeks to days, with automated format/content validation against the VDR requirements list.
- HIC test data uploaded in real-time during the 96-hour test would give PetroForge early visibility into pass/fail trends before testing completes.
- Digital IRN workflow on Fairbuild (not emailed PDFs) would provide real-time visibility into inspection status across all POs and supplier locations.
- SVT-based payment with separate tranches for material (90%) and documentation (10%) would release material payment immediately upon physical acceptance, with the documentation tranche released upon automated VDR compliance verification.

---

### OEM-23: SolarEdge Power Systems

**Industry:** Renewable Energy -- Solar Modules & Inverters

**Headquarters:** Herzliya, Israel (manufacturing in Zhongshan, China and Pecs, Hungary)

**Annual Revenue:** $1.6B

**Number of Supplier Relationships:** 105

**Products They Source:**
- Monocrystalline PERC solar cells (M10 format, 182mm, efficiency >= 23.5%)
- EVA and POE encapsulant films (for module lamination)
- Tempered solar glass (3.2mm, anti-reflective coated, transmittance >= 91.5%)
- Junction boxes (IP68, 3-diode configuration, with MC4 connectors)
- Aluminum module frames (anodized, corner-key assembled)
- Backsheet films (TPT, TPE, or glass-glass for bifacial modules)
- Power optimizer ICs (custom ASICs for DC-DC conversion, per module)

**Typical ERS Structure:**
- ERS documents 15--30 pages, referencing IEC 61215 (module design qualification), IEC 61730 (module safety), IEC 60904 (IV measurement)
- Solar cell ERS: IV curve parameters at STC (Pmax, Voc, Isc, FF), EL (electroluminescence) image for crack detection, color bin classification
- Module-level ERS: Pmax +3%/-0% of nameplate (positive tolerance only), Voc and Isc within +/- 3%, EL image (no cracks or inactive areas), visual inspection per IEC 61215
- Glass ERS: transmittance >= 91.5% (weighted average over AM1.5G spectrum), haze <= 1.0%, temper per EN 12150, impact test (25mm ice ball at 23 m/s per IEC 61215 MQT 17)
- Encapsulant ERS: gel content >= 75% (per ASTM D2765), peel strength >= 40 N/cm, UV transmittance cut-off at 360 nm
- Data format: IV curve data in CSV (per IEC 60904-1 format), EL images as 16-bit TIFF, visual inspection results in spreadsheet

**Quality Requirements:**
- Cpk >= 1.33 for module Pmax and cell efficiency
- Cpk >= 1.00 for glass transmittance and encapsulant gel content
- AQL: 0.25% for major defects (cracked cells per EL, hot spots), 1.0% for minor (cosmetic, frame scratches)
- Certifications: ISO 9001, ISO 14001, IEC 61215 and IEC 61730 (module type certification), IEC 62941 (PV module quality system)
- Flash test (IV curve measurement) on 100% of modules with Class AAA solar simulator per IEC 60904-9
- Long-term reliability qualification: damp heat (85/85 for 1000h), thermal cycling (200 cycles -40/+85 C), PID (potential-induced degradation) test

**Payment Terms:** Net-45 for cell suppliers; Net-30 for BOS (balance of system) components

**Pain Points:**
- Solar cell efficiency sorting: cells are binned by Pmax and Isc, but different cell suppliers use slightly different STC conditions (temperature correction, spectrum mismatch) that make cross-supplier bin comparison unreliable. SolarEdge occasionally mixes cells from different suppliers in the same module, causing power mismatch losses.
- EL images for cell crack detection are evaluated by human inspectors at the cell factory. Crack classification severity varies by inspector, and SolarEdge has found cracked cells in shipments that were classified as crack-free by the supplier.
- Module flash test data (IV curves) from the Chinese plant and the Hungarian plant are measured on different solar simulators with different calibration references. Corporate quality engineering cannot compare module Pmax distributions across plants.
- Glass supplier provides transmittance data at a single wavelength (550 nm) rather than the weighted average over the AM1.5G spectrum that SolarEdge actually needs.

**Why They'd Use Fairbuild:**
- Standardized IV measurement conditions (STC with explicit correction factors) defined in the ERS on Fairbuild would make cross-supplier cell bin data truly comparable.
- Machine-readable EL image data with quantitative crack metrics (crack length, crack count per zone) would replace subjective human classification.
- Module flash test data from both plants on Fairbuild with calibration reference traceability would enable valid cross-plant Pmax comparison.
- Glass transmittance ERS specifying the weighted spectral average (per AM1.5G) rather than single-wavelength measurement would ensure suppliers provide the data SolarEdge actually needs for energy yield modeling.

---

## CONSUMER GOODS / OTHER (2 OEMs)

---

### OEM-24: Artisan Apparel Group

**Industry:** Consumer Goods -- Performance Outerwear & Workwear

**Headquarters:** Portland, OR, USA (sourcing offices in Ho Chi Minh City and Dhaka)

**Annual Revenue:** $1.2B

**Number of Supplier Relationships:** 45

**Products They Source:**
- Woven performance fabrics (polyester/nylon blends, 150--300 g/m2, DWR-treated)
- Knit interlock fabrics (merino wool blends, for base layers)
- Waterproof breathable membranes (ePTFE or PU, MVTR >= 10,000 g/m2/24h)
- YKK zippers (water-resistant, size 3--10, various colors)
- Insulation materials (synthetic fill, 100--200 g/m2, Oeko-Tex certified)
- Reflective trim tape (3M Scotchlite or equivalent, retroreflective per EN ISO 20471)
- Buckles, hooks, and webbing (injection-molded nylon, for pack/backpack straps)

**Typical ERS Structure:**
- ERS documents (called "Material Quality Standards" or MQS) 8--20 pages per fabric/component
- Fabric MQS: tensile strength per ASTM D5034 (grab test, warp >= 450 N, weft >= 350 N), tear strength per ASTM D1424 (Elmendorf, >= 8 N), colorfastness to washing per ISO 105-C06 (Grade >= 4), pilling per ISO 12945-2 (Grade >= 4 after 5000 cycles)
- Waterproof membrane MQS: hydrostatic head per ISO 811 (>= 10,000 mm), MVTR per ASTM E96 (>= 10,000 g/m2/24h), seam tape peel strength >= 10 N/cm
- DWR (durable water repellent) MQS: spray rating per ISO 4920 (>= 90 after 5 washes), contact angle >= 120 degrees, PFAS-free chemistry required (C0 DWR)
- Reflective trim per EN ISO 20471: retroreflectivity >= 330 cd/lux/m2 (new), >= 100 cd/lux/m2 (after 25 washes)
- Data format: test reports in PDF from textile testing labs (SGS, Intertek, Bureau Veritas)

**Quality Requirements:**
- Cpk not typically used in textile industry; acceptance based on pass/fail against test standards
- AQL per ISO 2859-1: Level II, AQL 2.5% for major fabric defects (holes, weaving faults), AQL 4.0% for minor (shade variation within tolerance)
- Certifications: Oeko-Tex Standard 100 (harmful substances), bluesign (sustainable production), GOTS (for organic cotton), ISO 9001
- Social compliance audits: BSCI, WRAP, or SA8000 certification for garment factories
- PFAS-free declaration required for all DWR-treated fabrics (regulatory trend in EU and US)
- Color approval: lab dip approval with Delta E <= 1.0 (CIE Lab) against standard

**Payment Terms:** Net-30 for fabric mills; T/T 30% advance + 70% against shipping documents for garment CMT (cut-make-trim) factories

**Pain Points:**
- Textile testing data from SGS, Intertek, and Bureau Veritas arrives as multi-page PDF reports with no machine-readable data. Artisan's quality team re-types test results into Excel spreadsheets for trending, spending 15+ hours/week on data entry.
- Color consistency across fabric lots is the #1 quality complaint from retail buyers. Artisan receives Delta E (color difference) values from the dye house, but these are measured under different illuminants (D65 vs. TL84) at different labs, making lot-to-lot comparison unreliable.
- PFAS-free compliance is a rapidly evolving regulatory requirement. Artisan needs to track which fabric lots were treated with C0 (non-fluorinated) DWR vs. legacy C6 or C8 chemistries, but this information is buried in technical data sheets, not systematically tracked.
- CMT factories in Vietnam and Bangladesh are paid 70% against shipping documents. Quality defects discovered at Artisan's distribution center (2--4 weeks after shipment) have no payment leverage because the factory has already been paid.

**Why They'd Use Fairbuild:**
- Structured test data from textile testing labs (replacing PDFs) would eliminate 15+ hours/week of manual data entry and enable automated trending of fabric quality metrics across lots and suppliers.
- Standardized color measurement protocol (illuminant, observer, instrument geometry) defined in the ERS on Fairbuild would make Delta E values comparable across labs.
- PFAS chemistry tracking as a structured field in fabric lot data on Fairbuild would provide real-time compliance visibility across the entire material portfolio.
- SVT-based payment for CMT factories: 60% at shipment, 20% at warehouse receipt inspection, 20% at final QC -- would give Artisan quality leverage while still providing factories with faster initial payment than the current system.

---

### OEM-25: Duraform Building Products

**Industry:** Construction Materials -- Precast Concrete & Structural Components

**Headquarters:** Charlotte, NC, USA (plants in Atlanta, Chicago, Denver)

**Annual Revenue:** $850M

**Number of Supplier Relationships:** 60

**Products They Source:**
- Portland cement (Type I/II per ASTM C150, from regional cement plants)
- Aggregates (crushed stone, sand, gravel -- per ASTM C33)
- Admixtures (superplasticizers, air-entraining agents, set retarders per ASTM C494)
- Reinforcing steel (Grade 60 rebar per ASTM A615, welded wire reinforcement per ASTM A1064)
- Prestressing strand (7-wire, 270 ksi per ASTM A416, 0.5" and 0.6" diameter)
- Curing compounds and form release agents
- Ready-mix concrete (for cast-in-place applications, specified f'c 4000--8000 psi)

**Typical ERS Structure:**
- ERS documents (called "Material Specifications" or "Mix Design Submittals") 10--20 pages, referencing ACI 318 (structural concrete), ASTM standards for constituent materials
- Concrete mix design ERS: specified compressive strength (f'c), water-cement ratio (max 0.45 for durability), air content (4--7% for freeze-thaw), slump (4--8" for pumpable mix), chloride ion content limits
- Compressive strength per ASTM C39: average of 3 consecutive tests >= f'c, no individual test below f'c - 500 psi
- Cement ERS per ASTM C150: chemical limits (C3A, C3S, SO3), physical requirements (fineness, setting time, compressive strength at 3 and 7 days)
- Rebar ERS per ASTM A615: yield strength >= 60 ksi, UTS >= 90 ksi, elongation >= 9%, bend test compliance
- Prestressing strand ERS per ASTM A416: minimum breaking strength (41,300 lbs for 0.5" 270K), relaxation <= 2.5% at 1000 hours
- Data format: mix design submittals in PDF, cylinder break reports in PDF or simple spreadsheet, mill certs in PDF

**Quality Requirements:**
- Cpk >= 1.33 for concrete compressive strength (structural safety margin)
- Cpk >= 1.00 for cement fineness and air content (process control parameters)
- AQL: Not used; acceptance per ACI 318 statistical criteria (moving average of 3 tests)
- Certifications: ACI Plant Certification, PCI Plant Certification (for precast), ISO 9001 (progressive plants), AISC Certification (for structural steel components)
- Cylinder testing by ACI-certified testing laboratories (ASTM C1077 accredited)
- Documentation: mix design approval before production, daily batch tickets during production, 7-day and 28-day cylinder break results

**Payment Terms:** Net-30 for cement and aggregates (commodity); Net-45 for admixtures and specialty products; progress payments per structural milestone for precast contracts

**Pain Points:**
- Concrete cylinder break reports arrive as PDFs from 8 different testing laboratories. Duraform receives 200+ cylinder break reports per month. Compiling them into the statistical format required by ACI 318 (running average of 3 consecutive tests) is a manual process prone to errors.
- Cement mill certificates vary in format across 5 regional cement suppliers. Chemical composition data (C3A, SO3, etc.) must be tracked per cement lot because variations affect set time and strength gain, but this tracking is done in ad-hoc spreadsheets.
- Ready-mix concrete batch tickets contain critical data (water added, actual vs. design slump, concrete temperature) but arrive as paper delivery tickets that are filed but rarely analyzed. Retroactive analysis after a strength failure requires pulling paper tickets from filing cabinets.
- Rebar mill certificates are accepted on trust because independent testing of every heat is cost-prohibitive. A recent incident where rebar yield strength was marginally below specification was discovered only during a third-party audit, months after the rebar was cast into structural elements.

**Why They'd Use Fairbuild:**
- Automated cylinder break data aggregation from 8 testing labs into ACI 318 running-average format would replace manual compilation and provide real-time strength trending.
- Structured cement mill certificate data on Fairbuild would enable automated tracking of cement chemistry variations and correlation with concrete performance.
- Digital batch ticket data (not paper) uploaded to Fairbuild at time of pour would enable immediate analysis if a strength failure occurs, reducing investigation time from days to hours.
- Verified rebar mill certificate data on Fairbuild with automated limit checking against ASTM A615 would catch marginal mechanical property results before rebar is installed, preventing costly remediation.

---

## Summary Matrix

| ID | Company Name | Industry | HQ | Revenue | Suppliers | Key Standards |
|---|---|---|---|---|---|---|
| OEM-01 | Lumenar Technologies | Electronics - Smartphones | Shenzhen, CN | $8.2B | 340 | ISO 12233, IPC-A-610, IEC 62660-1 |
| OEM-02 | Veridian Display Corp | Display Technology | Hsinchu, TW | $3.4B | 85 | VESA DisplayHDR, ANSI C78.377 |
| OEM-03 | Arcwave Semiconductor | MEMS & RF Semiconductors | Munich, DE | $2.1B | 120 | MIL-STD-883, AEC-Q100, IEEE-STD-1293 |
| OEM-04 | Greenfield IoT Solutions | IoT & Smart Home | Austin, TX | $420M | 55 | IPC-A-610 Class 2, IPC-7527 |
| OEM-05 | PulseCore Wearables | Wearables - Medical-Adjacent | Copenhagen, DK | $780M | 70 | ISO 13485, ISO 10993, IEC 60529 |
| OEM-06 | Novacharge Energy Systems | EV Battery Packs | Stockholm, SE | $1.9B | 95 | IEC 62660-1/2, UN 38.3, ISO 26262 |
| OEM-07 | Radiant Optics Inc | AR/VR Displays & LED | San Jose, US | $650M | 40 | ANSI C78.377, AS9102 |
| OEM-08 | Terralink Connectivity | 5G Infrastructure | Espoo, FI | $5.7B | 210 | 3GPP TS 38.104, MIL-DTL-38999 |
| OEM-09 | Meridian Automotive Systems | Automotive - Brakes | Stuttgart, DE | $4.8B | 180 | SAE J866/J2521/J2522, IATF 16949 |
| OEM-10 | Zephyr Electric Motors | EV Drivetrain | Detroit, US | $2.3B | 110 | IEC 60034, IEC 60404, ISO 26262 |
| OEM-11 | Safeline Vehicle Components | Automotive Safety | Nagoya, JP | $7.2B | 250 | FMVSS 209, ISO 12097-3, ECE R16 |
| OEM-12 | Lumos Automotive Lighting | Automotive Lighting | Lippstadt, DE | $3.1B | 130 | ECE R112, ANSI C78.377 |
| OEM-13 | Titanforge Chassis Group | Automotive Chassis | Puebla, MX | $1.5B | 75 | SAE J267, ASME Y14.5, CQI-9 |
| OEM-14 | Vanguard Propulsion Technologies | Aerospace - Turbines | East Hartford, US | $12.5B | 420 | AS9100D, AS9102, AMS 2447 |
| OEM-15 | Celestial Aerostructures | Aerospace - Composites | Wichita, US | $6.8B | 200 | NASA PRC-6501, ASTM D3171 |
| OEM-16 | Sentinel Defense Electronics | Defense Electronics | Dallas, US | $9.3B | 350 | MIL-STD-883, MIL-DTL-38999, ITAR |
| OEM-17 | Altus Space Systems | Aerospace - Satellites | El Segundo, US | $1.1B | 65 | NASA-STD-5009, GSFC-STD-7000 |
| OEM-18 | Pinnacle Pharmaceuticals | Pharma - Tablets | Basel, CH | $18.5B | 280 | USP, ICH Q6A, 21 CFR Part 11 |
| OEM-19 | VitaSource Nutrition | Food - Supplements | Zurich, CH | $2.8B | 160 | 21 CFR 111, AOAC, USP <2232> |
| OEM-20 | Meridius Medical Devices | Medical - Orthopedics | Warsaw, IN, US | $4.2B | 140 | FDA 21 CFR 820, ISO 13485, ASTM F136 |
| OEM-21 | Ironvale Steel & Alloys | Steel Manufacturing | Dusseldorf, DE | $6.5B | 90 | ASTM A36/A516/A572, ASME BPVC |
| OEM-22 | PetroForge Pipeline Solutions | Oil & Gas | Houston, US | $3.8B | 175 | API 5L, NACE TM0284, ISO 21809 |
| OEM-23 | SolarEdge Power Systems | Solar Energy | Herzliya, IL | $1.6B | 105 | IEC 61215, IEC 60904 |
| OEM-24 | Artisan Apparel Group | Apparel - Performance Wear | Portland, US | $1.2B | 45 | ASTM D5034, ISO 105-C06, EN ISO 20471 |
| OEM-25 | Duraform Building Products | Construction - Precast | Charlotte, US | $850M | 60 | ACI 318, ASTM C39, ASTM C150 |
