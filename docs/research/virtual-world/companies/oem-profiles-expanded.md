# OEM Company Profiles -- Expanded (OEM-26 through OEM-37)

> 12 additional OEM (buyer) company profiles filling identified gaps in industry, geography, company size, and service types.
> Same format as the original 25 OEM profiles.

---

## MEGA-OEMS / HEAVY INDUSTRY (2 OEMs)

---

### OEM-26: Titan Global Mining Corp

**Industry:** Mining & Minerals -- Extraction Equipment & Processing Systems

**Headquarters:** Perth, Australia (operations in Chile, South Africa, DRC, Canada)

**Annual Revenue:** $58B

**Number of Supplier Relationships:** 680

**Products They Source:**
- Haul truck frames and structural weldments (high-strength steel, 400+ ton capacity trucks)
- Hydraulic excavator boom and stick assemblies (quenched & tempered steel, Hardox-grade)
- Crusher wear parts (high-manganese steel castings, Mn 11-14%)
- Conveyor belt systems (steel-cord reinforced, 2000mm width, fire-resistant)
- Grinding mill liners (high-chrome white iron and rubber composite)
- Hydraulic cylinders (chromed bore, 200mm-400mm bore diameter, 3000 psi rated)
- Electrical drive systems (permanent magnet motors, 1 MW+, for autonomous haul trucks)

**Typical ERS Structure:**
- ERS documents 20--40 pages per component, referencing AS/NZS 3678 (structural steel), ASTM A128 (manganese steel castings), ISO 4309 (wire rope), ISO 4649 (rubber abrasion)
- Structural weldment ERS per AWS D1.1 / AS/NZS 1554: weld procedure qualification, NDT requirements (UT and MT), Charpy impact at -40 C for arctic mine sites
- Crusher wear part ERS: casting integrity per ASTM A781, hardness (HBW 190-230 as-cast), Mn chemistry verification, dimensional tolerances per drawing
- Hydraulic cylinder ERS: bore finish Ra <= 0.2 um, chrome plating thickness 25-50 um, proof test at 1.5x working pressure, seal compatibility testing
- Data format: Weld procedure records in PDF, dimensional data in CSV, material certs per EN 10204 Type 3.1

**Quality Requirements:**
- Cpk >= 1.33 for structural weld joint mechanical properties
- Cpk >= 1.00 for casting chemistry (mining equipment tolerates wider variability than automotive)
- AQL: 0.25% for structural defects, 1.0% for dimensional, 2.5% for cosmetic
- Certifications: ISO 9001, AS/NZS 3834 (welding quality management), ISO 14001, ISO 45001 (mine site safety)
- Supplier pre-qualification audit per Titan's proprietary mining equipment quality standard
- Annual supplier scorecard based on OTD (on-time delivery), quality PPM, and safety incident rate

**Payment Terms:** Net-45 for standard components; progress payments for large capital equipment; 5% retention on structural weldments until NDT report clearance

**Pain Points:**
- Titan operates mines across 4 continents with 680 suppliers in 25 countries. Quality data arrives in dozens of formats and languages. A single haul truck contains 50,000+ parts from 200+ suppliers; tracing a structural failure to a specific weld lot at a specific fabrication shop takes weeks of manual investigation.
- Mining equipment operates in extreme environments (dust, vibration, temperature extremes). Field failure analysis requires correlating operational data (duty cycles, loads) with manufacturing quality data (weld procedures, material certs), but these datasets are in completely separate systems.
- Crusher wear part suppliers provide hardness data on initial casting only; Titan needs wear rate data from field operation correlated back to the original casting chemistry, but no systematic feedback loop exists.
- At $58B revenue, Titan's procurement leverage is enormous, but their quality data infrastructure is fragmented across regional offices. Each mine site manages its own supplier quality independently, leading to duplicated audits and inconsistent quality standards.

**Why They'd Use Fairbuild:**
- Unified global supplier quality platform would replace fragmented regional systems, enabling consistent quality standards across all mine sites and 680 suppliers.
- Weld lot traceability from fabrication shop through installation to field failure would reduce structural failure investigation time from weeks to hours.
- Field wear data feedback loop to casting suppliers would enable data-driven alloy optimization and predictive replacement scheduling.
- SVT-based payment with quality incentives would align mining equipment supplier behavior with Titan's safety and durability objectives.

---

### OEM-27: Volante Automotive Group

**Industry:** Automotive -- Full-Vehicle OEM (Passenger Cars & Light Trucks)

**Headquarters:** Turin, Italy (plants in Poland, Brazil, Turkey, India)

**Annual Revenue:** $62B

**Number of Supplier Relationships:** 2,400

**Products They Source:**
- Body-in-white stamped panels (roof, doors, fenders, quarter panels -- zinc-coated steel)
- Powertrain components (crankshafts, cylinder heads, transmission cases -- aluminum and cast iron)
- Interior trim assemblies (instrument panels, door panels -- injection-molded PP/TPO with soft-touch surfaces)
- Seat assemblies (complete seats with frames, foam, covers, tracks, heaters)
- Exhaust systems (catalytic converters, mufflers, pipes -- stainless steel)
- Glass (windshields, side glass, rear glass -- laminated and tempered)
- Wheel assemblies (alloy wheels, tires, TPMS sensors -- complete corner assemblies)

**Typical ERS Structure:**
- ERS documents per VDA 6 standard structure, 20--60 pages per component family, referencing VW/Audi/Stellantis-equivalent group standards
- Body panel ERS: surface quality per VDA 2007 (waviness, orange peel, dent detection), GD&T per GPS (ISO 1101), E-coat adhesion, weld flanges per resistance spot weld standards
- Powertrain ERS: dimensional per CMM with AQDEF (*.dfq) data format, metallurgical requirements per material spec, leak testing, functional testing
- Interior trim ERS: grain texture depth and uniformity, color matching Delta E <= 0.5 (CIE Lab), odor testing per VDA 270, fogging per DIN 75201
- Seat ERS: H-point location, comfort contour per ergonomic specification, flammability per FMVSS 302, durability (100,000 cycles)
- Data format: AQDEF (*.dfq) for dimensional, CSV for functional tests, PDFs for material certs, CAD-linked inspection plans

**Quality Requirements:**
- Cpk >= 1.67 for safety-critical dimensions (body structure, powertrain)
- Cpk >= 1.33 for all other controlled dimensions
- AQL: Not used; acceptance per VDA sampling plans and process audit scores
- Certifications: IATF 16949 (mandatory for all production suppliers), ISO 14001, VDA 6.3 process audit score >= 90%
- Full PPAP (Level 3) per VDA 2; ISIR per VDA Volume 2 for every new part number
- Annual potential analysis per VDA 6.3 for new supplier candidates
- Supplier quality performance target: <= 25 PPM field complaints

**Payment Terms:** Net-60; quarterly volume rebates based on quality KPIs (PPM, warranty claims, audit scores)

**Pain Points:**
- 2,400 suppliers across 30+ countries generate a torrent of quality data. Volante's central quality data warehouse receives data in AQDEF, CSV, PDF, XML, and proprietary formats. Normalizing this data for cross-supplier comparison is a team of 15 analysts working full-time.
- Warranty claim trace-back from vehicle VIN to component supplier and specific production lot requires querying 5 different databases (vehicle assembly MES, body shop weld data, component supplier data, material cert database, and warranty claim system). Average trace-back time: 3-5 business days.
- New vehicle launch quality: during SOP (Start of Production), 200+ suppliers ramp simultaneously. Quality issues compound across the supply chain, and identifying which supplier's quality problem is causing the vehicle-level issue is a daily crisis management exercise.
- At $62B revenue with 2,400 suppliers, even small improvements in supplier quality data management translate to millions in warranty savings.

**Why They'd Use Fairbuild:**
- Standardized quality data ingestion from 2,400 suppliers in a single format would eliminate the 15-person data normalization team and enable real-time cross-supplier benchmarking.
- VIN-to-component-lot traceability on Fairbuild would reduce warranty trace-back from 3-5 days to minutes.
- SOP quality dashboard with real-time supplier data feeds would enable proactive quality management during new vehicle launches.
- SVT-based payment linked to quality KPIs would automate the quarterly rebate calculation and make supplier incentives transparent and undisputable.

---

## GEOGRAPHIC EXPANSION (4 OEMs)

---

### OEM-28: Springbok Industrial Technologies

**Industry:** Agricultural & Industrial Equipment -- Tractors, Harvesters, Implements

**Headquarters:** Johannesburg, South Africa (plants in Pretoria, Nairobi)

**Annual Revenue:** $1.8B

**Number of Supplier Relationships:** 120

**Products They Source:**
- Tractor chassis frames (structural steel weldments, hot-dip galvanized)
- Hydraulic pumps and motors (gear type, 20-80 cc/rev, 250 bar rated)
- PTO (power take-off) shafts and gearboxes (forged 4140 steel, hardened)
- Implement mounting brackets and 3-point hitch assemblies (cast and fabricated steel)
- Diesel engine components (cylinder liners, pistons, injectors -- sourced from OE engine licensors)
- Operator cab structures (ROPS/FOPS certified per ISO 3471 and ISO 3449)
- Electrical harnesses (tractor-grade, UV and moisture resistant, 20-80 circuits)

**Typical ERS Structure:**
- ERS documents 15--30 pages per component, referencing ISO 500 (tractor PTO), ISO 3471 (ROPS), ASABE standards for agricultural equipment
- Chassis ERS: structural steel per SANS 1431 (South African National Standard) equivalent to ASTM A36/A572, welding per AWS D1.1 or ISO 3834, NDT on critical welds, hot-dip galvanizing per ISO 1461
- Hydraulic ERS: proof pressure at 1.5x rated, burst at 4x rated, internal leakage rates, flow-pressure curves at 3 temperature points
- ROPS cab ERS per ISO 3471: destructive test on first article (lateral, vertical, longitudinal loading), weld quality per ISO 5817 Level B
- Data format: Paper test reports from most African suppliers; PDF from international suppliers; CSV from advanced suppliers only

**Quality Requirements:**
- Cpk >= 1.00 for most parameters (agricultural equipment has wider tolerances than automotive)
- Cpk >= 1.33 for safety-critical items (ROPS structure, hydraulic pressure containment)
- AQL: 1.0% for functional defects, 2.5% for dimensional, 4.0% for cosmetic
- Certifications: ISO 9001 preferred; many local African suppliers do not have formal QMS certification
- ROPS/FOPS destructive test certification per ISO 3471/3449 mandatory
- Supplier development program for emerging African manufacturers

**Payment Terms:** Net-30 for local (South African) suppliers; letter of credit for imports; 30% advance for tooling

**Pain Points:**
- Many African suppliers lack formal quality management systems and provide test data on paper or verbally. Springbok's quality engineers spend significant time at supplier facilities teaching basic SPC and data collection.
- Import lead times from European and Asian suppliers are 8-12 weeks. Local African suppliers can deliver in 2-3 weeks but at lower quality consistency, creating a constant quality-vs-lead-time trade-off.
- ROPS certification testing is expensive ($30K+ per destructive test). Test results from one tractor model cannot be directly transferred to another, requiring repeat testing for each model variant.
- African currency volatility (ZAR, KES) against USD and EUR makes international procurement budgeting difficult. Payment delays due to quality disputes exacerbate currency exposure.

**Why They'd Use Fairbuild:**
- Fairbuild's structured data templates would provide a quality framework for emerging African suppliers who lack formal QMS, enabling them to participate in Springbok's supply chain with verifiable quality data.
- Digital ROPS certification records on Fairbuild would enable traceable re-use of test results across model variants where applicable, reducing redundant destructive testing.
- SVT-based payment in stablecoin would reduce currency exposure for both Springbok and its suppliers, particularly for cross-border African trade.
- Supplier development progress tracked on Fairbuild would give Springbok visibility into quality capability improvement over time.

---

### OEM-29: Amazonia Packaging Solutions

**Industry:** Consumer Packaged Goods -- Flexible Packaging & Labels

**Headquarters:** Sao Paulo, Brazil (plants in Manaus, Buenos Aires)

**Annual Revenue:** $920M

**Number of Supplier Relationships:** 85

**Products They Source:**
- Biaxially oriented polypropylene (BOPP) films (12-50 um, clear, matte, metallized)
- Polyethylene films (LDPE, LLDPE, for flexible pouches and bag-in-box)
- Printed laminate structures (reverse-printed, solvent-free laminated, 2-4 ply)
- Adhesives for lamination (solvent-free polyurethane, 2-component)
- Inks (solvent-based and water-based flexographic, food-contact compliant)
- Resealable zipper profiles (press-to-close and slider types)
- Paper and board substrates (SBS, kraft, recycled -- for cartons and labels)

**Typical ERS Structure:**
- ERS documents 10--20 pages, referencing ASTM F2029 (seal strength), ASTM D3985 (OTR), ASTM F1249 (WVTR), FDA 21 CFR 174-179 (food contact), ANVISA RDC 326 (Brazilian food contact regulation)
- Film ERS: thickness tolerance +/- 5%, haze <= 2.0%, COF (coefficient of friction) 0.15-0.35, OTR (oxygen transmission rate) per application requirement
- Laminate ERS: bond strength >= 2.0 N/15mm (peel test per ASTM F904), no delamination after retort (for retort pouches), solvent retention <= 5 mg/m2
- Print quality ERS: Delta E <= 2.0 from color standard, registration tolerance <= 0.2 mm, ink adhesion per ASTM D3359 (tape test, Grade 4B minimum)
- Seal strength ERS per ASTM F88: >= 15 N/25mm for consumer packaging, >= 25 N/25mm for industrial packaging
- Data format: PDF test reports from internal and third-party labs; CSV from advanced film suppliers

**Quality Requirements:**
- Cpk >= 1.00 for film thickness and seal strength
- Cpk >= 1.33 for OTR and WVTR (barrier properties critical for food shelf life)
- AQL per ISO 2859-1: Level II, AQL 1.0% for print defects, 0.65% for barrier defects
- Certifications: ISO 9001, FSSC 22000 (food safety), BRC Packaging (British Retail Consortium), ANVISA compliance
- Migration testing per EU Regulation 10/2011 for food-contact materials exported to Europe
- Sustainability certifications: FSC for paper substrates, How2Recycle labeling compliance

**Payment Terms:** Net-30 for domestic (Brazilian) suppliers; Net-45 for imports; letter of credit for large resin orders

**Pain Points:**
- Flexible packaging is a high-volume, low-margin business. A 1% reduction in film waste or a 0.5% improvement in seal integrity directly impacts profitability, but correlating film property data with seal performance data requires manual analysis across disconnected systems.
- ANVISA (Brazilian FDA) food contact compliance and EU migration testing requirements are different. Amazonia must maintain dual compliance documentation for export products, which is managed in separate filing systems.
- Print color consistency across production runs and across multiple printing presses is the #1 customer complaint. Delta E values measured on different spectrodensitometers at different plants do not correlate well.
- Laminate bond strength testing is destructive and time-consuming. Results arrive 24-48 hours after lamination, but the laminated film has already been slit and shipped in many cases.

**Why They'd Use Fairbuild:**
- Structured film property data linked to downstream seal performance on Fairbuild would enable statistical correlation and predictive quality for packaging integrity.
- Dual ANVISA/EU compliance documentation managed as structured data on Fairbuild would eliminate duplicate filing and reduce regulatory audit preparation time.
- Standardized color measurement protocol on Fairbuild (instrument type, measurement geometry, illuminant) would make Delta E values comparable across plants and presses.
- Real-time laminate bond strength data upload during the 24-48 hour test window would give early warning before slit rolls ship.

---

### OEM-30: Gulf Precision Engineering

**Industry:** Oil & Gas / Desalination -- Process Equipment & Pressure Vessels

**Headquarters:** Abu Dhabi, UAE (fabrication yard in Jebel Ali Free Zone, Dubai)

**Annual Revenue:** $2.2B

**Number of Supplier Relationships:** 145

**Products They Source:**
- Pressure vessel forgings (SA-105, SA-182 F304/F316/F22, for heat exchangers and reactors)
- Corrosion-resistant alloy (CRA) clad pipe (Inconel 625 and 316L clad on carbon steel)
- Desalination membrane housings (duplex stainless steel 2205, for RO systems)
- High-alloy castings (CF8M, CN7M -- for pump and valve bodies)
- Welding consumables (matching CRA filler metals, ENiCrMo-3, ER309L)
- Gaskets (spiral wound, ring-type joint, metal-jacketed -- for high-pressure flanged connections)
- Instrumentation tubing (316L seamless, 1/4" to 1" OD, per ASTM A269)

**Typical ERS Structure:**
- ERS documents 20--50 pages per equipment type, referencing ASME BPVC Section VIII Div 1/2, NACE MR0175/ISO 15156, NORSOK M-650 (qualification of CRA clad pipe)
- Pressure vessel ERS: material per ASME SA-specifications, PWHT (post-weld heat treatment) per ASME VIII UCS-56, radiographic examination per ASME V Article 2, hydrostatic test per ASME VIII UG-99
- CRA clad pipe ERS per NORSOK M-650: shear strength >= 140 MPa, UT bond verification, intergranular corrosion test per ASTM A262 Practice E
- Duplex stainless ERS: ferrite content 40-60% (per ASTM E562), pitting resistance equivalent (PRE) >= 35, NACE SSC test per NACE TM0177
- Data format: Inspection and Test Plans (ITPs) with hold/witness/review points, test data in CSV and PDF, third-party inspection release notes

**Quality Requirements:**
- Cpk >= 1.33 for pressure-retaining dimensions (nozzle bores, shell diameters)
- Cpk >= 1.67 for CRA clad overlay thickness (corrosion protection is safety-critical)
- Zero-tolerance for hardness exceedance in sour service (> 22 HRC = immediate rejection per NACE MR0175)
- Certifications: ISO 9001, ASME U/U2/S stamps, PED 2014/68/EU, ISO 3834-2 (welding quality management), NACE certified inspectors
- Third-party inspection by Bureau Veritas, Lloyd's, TUV, or DNV at fabrication facility
- ADNOC (Abu Dhabi National Oil Company) approved vendor list registration for most major suppliers

**Payment Terms:** Net-45; 10% retention until final documentation package acceptance; letter of credit for orders > $1M; progress payments per fabrication milestones for large equipment

**Pain Points:**
- Gulf region clients (ADNOC, Saudi Aramco, Qatar Energy) each maintain their own approved vendor lists (AVLs) with different pre-qualification requirements. A supplier must independently qualify with each end client, duplicating testing and documentation costs.
- Third-party inspection coordination across time zones (Gulf, Europe, Asia) creates scheduling bottlenecks. A single missed witness point by a TPI inspector can delay project delivery by 2-3 weeks.
- CRA weld overlay qualification testing (NACE, NORSOK) takes 6-8 weeks. These tests are performed at specialized labs, often in Europe, adding shipping time and creating a qualification bottleneck.
- Desert environment creates unique challenges: ambient temperatures exceeding 50 C affect material handling, welding procedures, and test conditions. Standard test procedures assume 23 C ambient, requiring documented corrections.

**Why They'd Use Fairbuild:**
- Unified pre-qualification credential on Fairbuild accepted by multiple Gulf end clients would reduce redundant supplier qualification testing and AVL registration costs.
- Real-time TPI inspection scheduling and release note workflow on Fairbuild would eliminate email-based coordination bottlenecks.
- CRA qualification test data with verifiable timestamps on Fairbuild would enable reuse of qualification records across projects where applicable, reducing the 6-8 week qualification bottleneck.
- Temperature-corrected test data with environmental conditions recorded as metadata on Fairbuild would make test results from Gulf facilities directly comparable with results from temperate-climate labs.

---

### OEM-31: Krakow Advanced Electronics

**Industry:** Defense & Industrial Electronics -- Radar Systems & Electronic Warfare

**Headquarters:** Krakow, Poland (facilities in Gdansk and Wroclaw)

**Annual Revenue:** $780M

**Number of Supplier Relationships:** 95

**Products They Source:**
- GaN power amplifier modules (L-band and S-band, for ground-based and airborne radar)
- High-reliability PCB assemblies (IPC-A-610 Class 3, conformal coated, MIL-SPEC)
- Precision machined waveguide components (aluminum and copper, for radar antenna feed networks)
- Military-grade connectors (MIL-DTL-38999, D-sub mil-spec, fiber optic)
- Power supply modules (MIL-STD-704 compliant, 28V DC and 270V DC)
- EMI/RFI shielding enclosures (die-cast aluminum with conductive gaskets)
- Contract environmental testing services (vibration, shock, temperature, humidity per MIL-STD-810)

**Typical ERS Structure:**
- ERS documents 30--80 pages, referencing MIL-STD-810H (environmental testing), MIL-STD-461G (EMI/EMC), MIL-STD-704F (aircraft electric power), NO-06-A107 (Polish defense quality standard)
- GaN PA module ERS: P1dB, Psat, PAE, gain flatness, harmonics, all measured at -40, +25, and +85 C
- Waveguide ERS: VSWR <= 1.15:1, insertion loss per frequency band, power handling capacity, surface finish Ra <= 1.6 um on RF surfaces
- Environmental testing ERS per MIL-STD-810H: Method 514.8 (vibration), Method 516.8 (shock), Method 501.7 (high temperature), Method 502.7 (low temperature), Method 507.6 (humidity)
- Data format: CSV for parametric test data, PDF for environmental test reports, S-parameter Touchstone files for RF data

**Quality Requirements:**
- Cpk >= 1.67 for RF parameters (PA gain, waveguide VSWR)
- Cpk >= 2.00 for power supply output regulation (safety-critical for avionics)
- Zero-defect target for flight-critical hardware
- Certifications: AS9100D, AQAP 2110 (NATO quality assurance), NO-06-A107 (Polish MoD), ISO 9001
- EMC qualification per MIL-STD-461G mandatory for all electronic subsystems
- Environmental screening per MIL-STD-810H on 100% of deliverable units

**Payment Terms:** Net-45; progress payments per contract milestones; retention per Polish MoD procurement regulations

**Pain Points:**
- As an Eastern European defense company, Krakow AE has historically struggled to access the same caliber of test data infrastructure as Western European or US defense primes. Polish defense procurement regulations (NO-06-A107) add unique documentation requirements on top of NATO AQAP standards.
- Environmental testing per MIL-STD-810H is outsourced to testing labs in Germany and the UK. Test scheduling takes 4-8 weeks, and results arrive as PDF reports that must be manually transcribed into Krakow AE's qualification database.
- GaN PA module suppliers are limited globally (3-4 qualified sources). Each supplier uses different test setups, making cross-supplier RF performance comparison unreliable.
- Waveguide machining requires tight tolerances on RF-critical surfaces. Polish and Czech subcontractors can achieve the dimensional accuracy but struggle with surface finish consistency, leading to VSWR exceedances that are discovered only at system-level RF testing.

**Why They'd Use Fairbuild:**
- Structured environmental test data from outsourced labs on Fairbuild would eliminate manual transcription and provide real-time qualification status tracking.
- Standardized RF test data format on Fairbuild would enable valid cross-supplier comparison of GaN PA module performance.
- Waveguide surface finish data linked to system-level VSWR performance on Fairbuild would enable predictive screening of subcontractor parts before system integration.
- Dual compliance documentation (AQAP 2110 + NO-06-A107) managed as structured data on Fairbuild would reduce the documentation overhead of serving both NATO and Polish MoD requirements.

---

## SERVICE & NON-TRADITIONAL SECTORS (4 OEMs)

---

### OEM-32: CirrusAir Turbine Services

**Industry:** Aerospace MRO -- Gas Turbine Overhaul & Component Repair

**Headquarters:** Miami, FL, USA (MRO shops in Singapore, Dublin, Queretaro)

**Annual Revenue:** $3.5B

**Number of Supplier Relationships:** 190

**Products They Source:**
- Repaired/overhauled turbine blades (re-tipped, re-coated, heat-treated to restore service life)
- Replacement bearings (aircraft engine main shaft bearings, M50 steel, per SAE AMS 6491)
- PMA (Parts Manufacturer Approval) replacement parts (FAA-approved alternative to OEM parts)
- Calibration services (torque wrenches, dimensional gauges, engine test cell instrumentation)
- Non-destructive testing services (FPI, MT, UT, eddy current -- on engine components during overhaul)
- Thermal barrier coating re-application services (on turbine airfoils)
- Contract engine test cell services (post-overhaul engine performance verification)

**Typical ERS Structure:**
- ERS documents 20--60 pages per repair scheme, referencing FAA AC 43.13, EASA Part 145, engine OEM CMM (Component Maintenance Manual) procedures
- Blade repair ERS: weld repair procedures qualified per AWS D17.1, post-repair dimensional inspection per OEM CMM limits, FPI post-weld per AMS 2647, re-coating per OEM-approved TBC process
- Calibration service ERS per ISO/IEC 17025: measurement uncertainty reporting, calibration interval justification, NIST/NMI traceability, calibration certificate format requirements
- NDT service ERS per NAS 410 / EN 4179: inspector certification level requirements (Level II or III), procedure qualification per engine OEM, reporting format
- Data format: FAA 8130-3 Authorized Release Certificates, calibration certificates per ISO/IEC 17025, NDT reports per NAS 410

**Quality Requirements:**
- Zero-defect for repaired flight-critical components (engine blades, bearings, disks)
- Cpk >= 1.67 for restored dimensional characteristics on repaired components
- Certifications: FAA Part 145 Repair Station, EASA Part 145, CAAS (Singapore) approval, AS9100D (suppliers), ISO/IEC 17025 (calibration labs), NAS 410 (NDT personnel)
- Calibration lab must demonstrate ISO/IEC 17025 accreditation with scope covering specific measurement types
- All repairs must be documented in FAA-approved Repair Station Manual procedures

**Payment Terms:** Net-30 for calibration and NDT services; Net-45 for repair/overhaul subcontractors; milestone payments for engine overhauls

**Pain Points:**
- Calibration certificates from 15+ labs across 4 continents arrive as PDFs with no machine-readable data. Tracking calibration status for 8,000+ gauges and instruments across 4 MRO shops is managed in an Access database that requires manual certificate review and data entry.
- NDT inspection reports from subcontracted NAS 410 inspectors are paper-based. When an engine component is later found to have a defect that should have been caught by NDT, tracing back to the specific inspector, procedure, and inspection conditions requires pulling paper files.
- PMA parts suppliers provide FAA 8130-3 Authorized Release Certificates, but verifying the authenticity of these certificates against FAA records is a manual process prone to counterfeit documentation.
- Post-overhaul engine test cell data is proprietary to each test cell operator. Cross-site comparison of engine performance after overhaul at different MRO shops is impossible without manual data normalization.

**Why They'd Use Fairbuild:**
- Structured calibration certificate data on Fairbuild with automated calibration-due tracking would replace the Access database and manual PDF review for 8,000+ instruments.
- Digital NDT reports with inspector credential verification on Fairbuild would provide complete traceability from inspection to inspector to procedure, supporting regulatory audits.
- Verifiable FAA 8130-3 certificates on Fairbuild would provide instant authenticity verification, reducing counterfeit PMA part risk.
- Standardized engine test cell data format on Fairbuild would enable cross-site overhaul quality comparison and continuous improvement.

---

### OEM-33: NovaBridge Semiconductor Design

**Industry:** Semiconductor -- Fabless IC Design (Automotive & Industrial)

**Headquarters:** San Diego, CA, USA (design centers in Bangalore and Leuven)

**Annual Revenue:** $4.8B

**Number of Supplier Relationships:** 35

**Products They Source:**
- Wafer fabrication services (200mm and 300mm, CMOS 28nm-180nm nodes, from foundries)
- OSAT (Outsourced Semiconductor Assembly & Test) services (BGA, QFN, WLCSP packaging + final test)
- Photomask sets (chrome-on-quartz, for each process layer)
- Wafer-level test and probe services (parametric test, sort test)
- Reliability qualification testing services (HTOL, TC, THB, ESD per AEC-Q100/AEC-Q104)
- Failure analysis services (cross-section, EMMI, FIB, TEM -- for yield and reliability investigations)
- Die preparation services (backgrinding, dicing, die attach film application)

**Typical ERS Structure:**
- ERS documents are split into process specifications (foundry) and test specifications (OSAT):
  - Foundry process spec: target electrical parameters per design PDK, WAT (wafer acceptance test) limits, defect density targets (D0 <= 0.1/cm2)
  - OSAT test spec: parametric test limits per datasheet, sort yield targets (>= 95%), final test coverage requirements, test time targets
  - Reliability qualification spec per AEC-Q100: 1000h HTOL at 125 C, 500 cycles TC (-65/+150 C), 96h THB at 85/85, ESD (HBM >= 2 kV, CDM >= 500V)
- Data format: STDF (Standard Test Data Format) for wafer and package test, CSV for WAT parametric data, PDF for reliability qualification reports, SPC charts for ongoing reliability monitoring

**Quality Requirements:**
- Cpk >= 2.00 for automotive-grade parametric parameters (AEC-Q100 requirement)
- Cpk >= 1.67 for industrial-grade products
- AQL: 0 DPPM target for automotive (AEC-Q100); 10 DPPM for industrial
- Certifications: IATF 16949 (foundry and OSAT), AEC-Q100/Q104 qualification, ISO 9001
- PPAP per AIAG for each new product and process change at foundry and OSAT
- FMEA (design and process) per automotive standards for each product family

**Payment Terms:** Net-60 for foundry wafer starts; Net-45 for OSAT services; NRE (non-recurring engineering) paid in milestones

**Pain Points:**
- As a fabless company, NovaBridge depends entirely on external foundries and OSATs for manufacturing quality. Wafer-level yield data from the foundry and package-level test data from the OSAT are in separate systems. Correlating a package-level failure to a specific wafer lot, die location, and foundry process parameter requires manual cross-referencing across 3 organizations.
- AEC-Q100 reliability qualification takes 3-6 months. During this period, NovaBridge has committed engineering resources but receives no revenue. Any qualification failure at month 4 means restarting from zero, with no partial credit for the work completed.
- Foundry wafer acceptance test (WAT) data is in a proprietary format that requires the foundry's own analysis software to read. NovaBridge's yield engineers cannot independently analyze WAT data without requesting custom exports.
- Photomask costs ($500K-$2M per set at 28nm) represent a significant NRE investment. Mask defect data from the mask shop is proprietary and not shared with NovaBridge, making it impossible to correlate mask defects with die yield loss.

**Why They'd Use Fairbuild:**
- Unified wafer-to-package traceability on Fairbuild would link foundry WAT data, die-level sort data, and OSAT final test data into a single traceable record, enabling rapid yield loss root-cause analysis.
- Milestone-based escrow payments for AEC-Q100 qualification (payment at each reliability gate: burn-in start, TC complete, THB complete, final report) would give reliability testing labs earlier cash flow and align incentives with successful qualification.
- Structured WAT data on Fairbuild in open format would give NovaBridge's yield engineers independent analysis capability without depending on foundry-proprietary software.
- Mask defect data linked to die yield data on Fairbuild would enable systematic mask-to-yield correlation for the first time.

---

### OEM-34: WindStream Renewable Energy

**Industry:** Wind Energy -- Onshore & Offshore Wind Turbine Components

**Headquarters:** Aarhus, Denmark (factories in Aalborg, DK and Szczecin, Poland)

**Annual Revenue:** $7.5B

**Number of Supplier Relationships:** 220

**Products They Source:**
- Cast iron wind turbine hubs and main frames (ductile iron EN-GJS-400-18-LT, up to 30 tons)
- Wind turbine blade molds and tooling (CFRP and steel, 80m+ blade length)
- Main shaft forgings (42CrMo4 alloy steel, up to 10m length, 8 tons)
- Pitch and yaw bearing assemblies (slewing bearings, 2m-5m diameter)
- Tower flange forgings (S355J2+N structural steel, 4m+ diameter ring-rolled)
- Bolt assemblies (10.9 grade, M36-M72, hot-dip galvanized, for tower and blade root connections)
- Contract NDT services (UT, MT, RT on tower welds and cast components)

**Typical ERS Structure:**
- ERS documents 20--50 pages per component, referencing IEC 61400-1 (wind turbine design), EN 1563 (ductile iron castings), DNV-ST-0361 (machinery for wind turbines), GL Guidelines
- Hub/frame casting ERS per EN 1563: ductile iron EN-GJS-400-18-LT, Charpy impact >= 12 J at -20 C, UT per EN 12680-3, dimensional inspection per 3D scan
- Main shaft ERS: forging per EN 10083-3, UT per EN 10228-3, surface finish Ra <= 0.8 um on bearing seats, straightness <= 0.1mm/m
- Tower flange ERS: ring-rolled per EN 10222-2, UT per EN 10228-3, Charpy >= 27 J at -40 C (for arctic wind farms), hardness HBW 140-180
- Bolt ERS per EN 14399-4: proof load per ISO 898-1, tensile >= 1040 MPa, hardness HRC 32-39, HDG per ISO 10684
- Data format: 3D scan data (GOM/ATOS), CMM CSV, material certs per EN 10204 Type 3.1, NDT reports in PDF

**Quality Requirements:**
- Cpk >= 1.33 for bearing seat dimensions and bolt mechanical properties
- Cpk >= 1.00 for casting dimensions (investment tolerance wider for large ductile iron castings)
- AQL: 0.25% for structural defects in castings, 0.065% for bolt mechanical property failures
- Certifications: ISO 9001, DNV type certificate, GL certification (type approval), ISO 3834-2 (welding management)
- Third-party inspection by DNV, Bureau Veritas, or TUV on all structural components
- 20-year design life means quality data must support long-term reliability analysis

**Payment Terms:** Net-60 for standard components; progress payments for large castings and forgings (30/40/30 milestones)

**Pain Points:**
- Wind turbine component supply chains span 15+ countries. A single nacelle contains components from castings in China, forgings in Germany, bearings in Sweden, and bolts in Spain. Quality data from all suppliers must be collated into a single turbine-level documentation package for type certification.
- Casting defect rates for large ductile iron hubs (10-30 tons) are 5-15%. Each rejected hub represents $50K-$200K in material and manufacturing cost. WindStream needs predictive analytics linking melt chemistry, pouring parameters, and UT results to predict castability before committing to production.
- Arctic wind farm deployments require -40 C Charpy toughness on all structural components. Standard mill test certificates test at -20 C or 0 C, requiring supplementary testing that adds 2-3 weeks to material acceptance.
- Tower flange flatness and bolt hole position data from ring-rolling mills comes in different formats and coordinate systems, making cross-supplier comparison and incoming inspection correlation unreliable.

**Why They'd Use Fairbuild:**
- Turbine-level quality documentation package assembled from multi-supplier structured data on Fairbuild would streamline DNV type certification.
- Predictive casting quality model built from structured melt chemistry, pouring, and UT data on Fairbuild would reduce the 5-15% hub rejection rate.
- Automated Charpy test temperature matching on Fairbuild would flag mismatches between mill test temperature and project requirements immediately upon MTC upload.
- Standardized flange dimensional data format on Fairbuild would enable valid cross-supplier comparison.

---

### OEM-35: Nextera Water Technologies

**Industry:** Water & Environmental -- Water Treatment & Desalination Systems

**Headquarters:** Singapore (regional offices in Dubai, Madrid, Houston)

**Annual Revenue:** $1.4B

**Number of Supplier Relationships:** 110

**Products They Source:**
- Reverse osmosis (RO) membrane elements (spiral-wound, 8" x 40", polyamide thin-film composite)
- Pressure vessels (FRP and stainless steel, for RO membrane housings, rated 1200 psi)
- High-pressure pumps (centrifugal, multi-stage, Duplex SS 2205, for seawater RO -- 800-1200 psi)
- UV disinfection systems (medium-pressure UV, for secondary disinfection)
- Chemical dosing systems (antiscalant, chlorine, sodium bisulfite -- metering pumps and tanks)
- Instrumentation (pH, ORP, turbidity, conductivity -- online continuous monitoring)
- SCADA and PLC control systems (for plant automation)

**Typical ERS Structure:**
- ERS documents 15--35 pages per component, referencing AWWA standards, NSF/ANSI 61 (drinking water components), ASME BPVC (pressure vessels), API 610 (centrifugal pumps)
- RO membrane ERS: salt rejection >= 99.7%, permeate flow rate within +/- 10% of nominal, maximum feed pressure 1200 psi, chlorine tolerance < 0.1 ppm
- Pressure vessel ERS per ASME VIII: hydrostatic test at 1.5x MAWP, radiographic examination of circumferential welds, material per ASTM A312 (SS) or ASTM D2996 (FRP)
- Pump ERS per API 610: NPSH verification, performance curve (head vs. flow at rated speed), vibration per ISO 10816 (<= 2.8 mm/s RMS)
- Water quality parameters: permeate TDS <= 300 ppm (from 35,000 ppm seawater), SDI <= 3.0 (post-pretreatment), turbidity <= 0.1 NTU
- Data format: CSV for water quality trending, PDF for equipment test certificates, commissioning data in historian (OSIsoft PI) format

**Quality Requirements:**
- Cpk >= 1.33 for membrane rejection rate and pump efficiency (directly affects plant operating cost)
- Cpk >= 1.00 for pressure vessel dimensions
- AQL: Not used; acceptance per ASME hydrostatic test and API 610 performance test
- Certifications: ISO 9001, NSF/ANSI 61 (drinking water contact), ASME stamp (pressure vessels), API 610 (pumps)
- Commissioning performance test required for all major equipment (72-hour continuous run demonstrating rated capacity and quality)
- Membrane supplier must provide warranty on flux decline rate (< 10% per year under specified conditions)

**Payment Terms:** Net-30 for consumables (membranes, chemicals); Net-60 for capital equipment; 10% retention until commissioning acceptance

**Pain Points:**
- RO membrane performance degrades over time. Nextera needs to correlate incoming membrane quality data (salt rejection, permeate flow) with long-term operational performance (flux decline, fouling rate). Currently, incoming QC data and operational data live in separate systems.
- Pump performance curves from the manufacturer do not always match field performance due to installation effects (piping layout, elevation). Nextera needs a systematic way to compare factory test data with field commissioning data.
- Water quality data from 50+ treatment plants worldwide is logged in local SCADA/historian systems. Rolling up this data for portfolio-level analysis requires IT infrastructure that Nextera's small central engineering team struggles to maintain.
- Chemical dosing system calibration drift affects treatment performance. Calibration records for hundreds of online instruments across 50+ plants are tracked in facility-specific spreadsheets.

**Why They'd Use Fairbuild:**
- Membrane incoming quality data linked to operational performance data on Fairbuild would enable predictive membrane replacement scheduling and supplier performance benchmarking.
- Factory pump test data vs. field commissioning data on Fairbuild would quantify installation effects and improve specification accuracy.
- Centralized instrument calibration tracking on Fairbuild would replace facility-specific spreadsheets with a portfolio-level calibration management system.
- SVT-based payment for membranes: partial payment on incoming quality acceptance, remainder tied to 12-month performance guarantee, aligning membrane supplier incentives with operational performance.

---

### OEM-36: Quantus Additive Technologies

**Industry:** Advanced Manufacturing -- Metal Additive Manufacturing (3D Printing) Services Buyer

**Headquarters:** Gothenburg, Sweden (engineering center in Boston, MA)

**Annual Revenue:** $680M

**Number of Supplier Relationships:** 50

**Products They Source:**
- Metal 3D printed components (Ti-6Al-4V, Inconel 718, 316L SS, AlSi10Mg -- LPBF and EBM processes)
- Metal powder feedstock (gas-atomized, controlled PSD, low oxygen content)
- Post-processing services (HIP, heat treatment, CNC finish machining of AM parts)
- CT scanning services (for internal geometry verification and porosity assessment of AM parts)
- Mechanical testing services (tensile, fatigue, fracture toughness -- on AM-specific test coupons)
- Surface finishing services (chemical etching, electropolishing, micro-blasting of AM surfaces)

**Typical ERS Structure:**
- ERS documents 25--60 pages, referencing ASTM F3301 (AM Ti-6Al-4V), ASTM F3055 (AM Inconel 718), ISO/ASTM 52900 (AM terminology), AS9100D + SAE AMS7003 (AM for aerospace)
- AM part ERS: build orientation specification, minimum wall thickness, support structure requirements, post-HIP density >= 99.9%, surface roughness Ra <= 15 um (as-built), Ra <= 3.2 um (post-machined)
- Powder ERS per ASTM F3049: PSD (D10, D50, D90), flowability (Hall flow <= 25 s/50g), apparent density, morphology (sphericity >= 0.9), oxygen content <= 0.15% (Ti-6Al-4V)
- CT scan ERS: resolution <= 50 um voxel, porosity acceptance (no pores > 200 um, total porosity < 0.1%), dimensional accuracy comparison to CAD nominal
- Mechanical test ERS per ASTM F3301: UTS >= 895 MPa, YS >= 825 MPa, elongation >= 10% (Ti-6Al-4V post-HIP, XY orientation)
- Data format: CT scan volumes in DICOM/STL, CMM data in CSV, mechanical test data in CSV, build log files in proprietary machine format

**Quality Requirements:**
- Cpk >= 1.33 for mechanical properties (UTS, YS, elongation) across build orientations
- Cpk >= 1.67 for critical dimensions on AM parts (post-machined surfaces)
- No porosity defects > 200 um diameter in structural AM parts (CT scan verified)
- Certifications: AS9100D (aerospace AM suppliers), ISO 13485 (medical AM suppliers), ISO 9001, Nadcap for AM (emerging)
- Build-by-build quality monitoring: layer-by-layer in-situ monitoring data (melt pool imaging, thermal data) archived for each build
- Witness coupons required in every build: 2 tensile bars + 1 fatigue coupon per build orientation

**Payment Terms:** Net-45; NRE for build parameter development paid in milestones; production parts per delivery

**Pain Points:**
- AM part quality is highly dependent on build parameters (laser power, scan speed, layer thickness, gas flow) that are typically proprietary to the AM service bureau. Quantus cannot independently verify that specified build parameters were used without access to build log data.
- CT scan data files are enormous (1-10 GB per part). Sharing these files with OEM customers for review is cumbersome. Different CT scan analysis software packages (Volume Graphics, Avizo, CERA) produce different porosity statistics from the same raw data, creating interpretation disputes.
- Powder reuse tracking is critical for AM quality (powder degrades with reuse, absorbing oxygen). AM service bureaus track powder age internally, but this data is not systematically shared with customers.
- AM fatigue testing is time-consuming (10^7 cycles at relevant frequencies can take weeks). Results arriving after parts ship creates a quality gap similar to the battery K-value problem.

**Why They'd Use Fairbuild:**
- Build parameter verification on Fairbuild: build log data hashed at print completion, providing evidence that specified parameters were used without revealing proprietary process details.
- CT scan summary metrics (porosity size, count, spatial distribution) on Fairbuild with hash of raw data, enabling review without transferring multi-GB files.
- Powder reuse tracking (sieve cycles, oxygen content per reuse cycle) on Fairbuild would provide customers verifiable powder history for each build.
- Fatigue test data uploaded progressively during testing on Fairbuild would give early indication of pass/fail before full 10^7 cycle completion.

---

### OEM-37: Atlas Heavy Equipment

**Industry:** Construction & Mining Equipment -- Excavators, Loaders, Cranes

**Headquarters:** Hamamatsu, Japan (factories in Indonesia, Brazil, UK)

**Annual Revenue:** $22B

**Number of Supplier Relationships:** 450

**Products They Source:**
- Hydraulic excavator booms and arms (high-tensile steel weldments, 490-780 MPa grade)
- Slewing bearings (roller-type, 1.5m-4m OD, for excavator and crane upper-structure rotation)
- Hydraulic main control valves (multi-spool, proportional, 350 bar rated)
- Track chain assemblies (heat-treated alloy steel links, pins, and bushings)
- Operator cab assemblies (ROPS/FOPS certified per ISO 12117, with HVAC, display, joystick controls)
- Engine cooling systems (aluminum radiators, charge air coolers, oil coolers)
- Counterweight castings (ductile iron, up to 15 tons, for crane and excavator balance)

**Typical ERS Structure:**
- ERS documents 20--45 pages per component, referencing JIS (Japanese Industrial Standards), ISO 10567 (excavator test), ISO 12117 (ROPS/FOPS for excavators)
- Boom/arm weldment ERS: steel per JIS G 3106 SM490A/SM570, welding per JIS Z 3801 qualified procedures, UT per JIS Z 2344, fatigue life >= 20,000 hours at rated load cycle
- Slewing bearing ERS: raceway hardness HRC 58-62, rolling element Grade 10 per ISO 3290, axial/radial/moment load ratings verified per ISO 76
- Hydraulic valve ERS: internal leakage <= 0.5 cc/min at rated pressure, response time <= 50 ms, hysteresis <= 3%, endurance >= 2 million cycles
- Data format: JIS inspection reports in Japanese, CMM data in CSV, material certs per JIS G 0404 equivalent to EN 10204

**Quality Requirements:**
- Cpk >= 1.33 for structural weld joint mechanical properties and hydraulic valve response time
- Cpk >= 1.67 for slewing bearing raceway dimensions (precision affects machine stability and operator safety)
- AQL: 0.25% for structural defects, 0.10% for hydraulic leakage defects
- Certifications: JIS Q 9001, IATF 16949 (for suppliers also serving automotive), ISO 14001, ISO 45001
- Supplier quality performance target: <= 50 PPM for Tier-1 suppliers
- Field failure feedback loop required: suppliers must respond to field failure reports within 72 hours

**Payment Terms:** Net-60 for domestic (Japanese) suppliers; Net-75 for international; quarterly volume rebates per quality KPI

**Pain Points:**
- Atlas operates in 4 countries with suppliers in 20+ countries. Quality data arrives in Japanese, English, Portuguese, Indonesian, and German. There is no systematic translation or normalization; bilingual quality engineers manually bridge language barriers.
- Construction equipment faces extreme duty cycles (impact loads, abrasive environments). Field failure root-cause analysis requires correlating operational telemetry (machine hours, hydraulic pressures, GPS location) with manufacturing quality data (weld procedures, material certs). These datasets are in completely different systems.
- Slewing bearing supplier in Germany provides quality data in AQDEF format; bearing supplier in Japan provides data in JIS format; bearing supplier in China provides data in Excel. Cross-supplier bearing quality comparison requires manual format conversion.
- At $22B revenue with 450 suppliers, Atlas's quality organization is large (200+ people globally) but fragmented across regional offices with different QMS tools and processes.

**Why They'd Use Fairbuild:**
- Multilingual quality data normalization on Fairbuild would bridge the language barrier across Atlas's 20+ country supplier base, with standardized data fields regardless of source language.
- Linking manufacturing quality data to operational telemetry on Fairbuild would enable predictive field failure models and data-driven warranty analysis.
- Unified bearing quality data format on Fairbuild would enable valid cross-supplier benchmarking regardless of source format (AQDEF, JIS, or Excel).
- Global quality dashboard on Fairbuild would replace fragmented regional QMS tools, giving Atlas's central quality leadership real-time visibility across all regions.

---

## Summary Matrix (OEM-26 through OEM-37)

| ID | Company Name | Industry | HQ | Revenue | Suppliers | Gap Filled |
|---|---|---|---|---|---|---|
| OEM-26 | Titan Global Mining Corp | Mining & Heavy Industry | Perth, AU | $58B | 680 | Mega-OEM, mining, Australia |
| OEM-27 | Volante Automotive Group | Full-Vehicle Automotive OEM | Turin, IT | $62B | 2,400 | Mega-OEM (>$50B), full-vehicle OEM |
| OEM-28 | Springbok Industrial Tech | Agricultural/Industrial Equipment | Johannesburg, ZA | $1.8B | 120 | Africa, agriculture, emerging suppliers |
| OEM-29 | Amazonia Packaging Solutions | Flexible Packaging | Sao Paulo, BR | $920M | 85 | South America, packaging industry |
| OEM-30 | Gulf Precision Engineering | Oil & Gas / Desalination | Abu Dhabi, AE | $2.2B | 145 | Middle East, desalination, CRA |
| OEM-31 | Krakow Advanced Electronics | Defense Electronics / Radar | Krakow, PL | $780M | 95 | Eastern Europe, Polish defense |
| OEM-32 | CirrusAir Turbine Services | Aerospace MRO | Miami, US | $3.5B | 190 | MRO, calibration/testing services |
| OEM-33 | NovaBridge Semiconductor | Fabless IC Design | San Diego, US | $4.8B | 35 | Semiconductor foundry relationship |
| OEM-34 | WindStream Renewable Energy | Wind Turbine Components | Aarhus, DK | $7.5B | 220 | Wind energy, large castings/forgings |
| OEM-35 | Nextera Water Technologies | Water Treatment / Desalination | Singapore, SG | $1.4B | 110 | Water/environmental, membranes |
| OEM-36 | Quantus Additive Technologies | Metal Additive Manufacturing | Gothenburg, SE | $680M | 50 | Additive manufacturing / 3D printing |
| OEM-37 | Atlas Heavy Equipment | Construction/Mining Equipment | Hamamatsu, JP | $22B | 450 | Construction equipment, mega-OEM |
