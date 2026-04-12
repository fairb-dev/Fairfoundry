# Scenario Pairings: 25 Niche & Emerging Manufacturing Scenarios (S076-S100)

> 25 scenario pairings covering underserved and emerging manufacturing sectors not addressed in the existing 75 scenarios.
> Each pairing uses REAL test standards and spec limits from published industry specifications.
> Same format as original scenario pairings.

---

## Distribution Summary

**Development Stages:** EVT: 4 | DVT: 5 | PVT: 5 | MP: 8 | Sustaining: 3
**Service Order Values:** Small ($5K-$50K): 7 | Medium ($50K-$500K): 13 | Large ($500K-$2M): 5
**Dispute Likelihood:** Low: 9 | Medium: 10 | High: 6

**Sector Coverage:**
- Additive Manufacturing / 3D Printing: S076, S077, S078 (3 scenarios)
- Semiconductor Fabrication: S079, S080, S081 (3 scenarios)
- Optics and Photonics: S082, S083 (2 scenarios)
- Packaging and Containers: S084, S085 (2 scenarios)
- Rubber and Plastics: S086, S087 (2 scenarios)
- Ceramics and Advanced Materials: S088, S089 (2 scenarios)
- Water and Environmental: S090, S091 (2 scenarios)
- Mining and Minerals: S092, S093 (2 scenarios)
- Personal Care and Cosmetics: S094, S095 (2 scenarios)
- Agriculture: S096, S097 (2 scenarios)
- Electronics Assembly Services: S098, S099, S100 (3 scenarios)

---

## ADDITIVE MANUFACTURING / 3D PRINTING (S076 -- S078)

---

### S076

**OEM:** Quantus Additive Technologies (OEM-36)
**Factory:** Detroit Additive Manufacturing LLC (Factory 37)
**Product/Service:** Ti-6Al-4V ELI laser powder bed fusion (LPBF) hip implant components -- CT scan density and porosity verification
**Development Stage:** DVT
**Service Order Value:** $320,000
**Test Scenario Reference:** Metal AM part density/porosity testing via micro-CT scan per ASTM F3301 and ASTM E1441

**Key Acceptance Criteria:**
1. Relative density >= 99.5% per ASTM F3301-18a (Standard for Additively Manufactured Titanium-6 Aluminum-4 Vanadium ELI for Surgical Implant Applications)
2. Maximum individual pore diameter <= 150 um per micro-CT scan (ASTM E1441 -- Standard Guide for Computed Tomography Imaging)
3. Total porosity volume fraction <= 0.50% (measured via CT scan volumetric analysis)
4. No interconnected porosity detected (no pore channels > 50 um connecting to surface)
5. Archimedes density >= 4.41 g/cm3 (99.5% of theoretical Ti-6Al-4V density of 4.43 g/cm3)

**Standard References:**
- ASTM F3301-18a: Standard for AM Ti-6Al-4V ELI for Surgical Implants
- ASTM E1441-19: Standard Guide for Computed Tomography (CT) Imaging
- ASTM F2924-14: Standard Specification for AM Ti-6Al-4V with Powder Bed Fusion
- ISO/ASTM 52904:2019: AM -- Process characteristics and performance -- Practice for metal powder bed fusion process to meet critical applications

**Expected Outcome:** 92% lot pass rate (DVT stage; process parameter optimization ongoing, some builds may show keyhole porosity at overhangs)
**Dispute Likelihood:** High -- CT scan interpretation is complex. Detroit AM's Nikon XT H 225 CT system and Quantus's YXLON FF35 CT system use different reconstruction algorithms and voxel sizes. A 140 um pore measured on one system may register as 160 um on the other, flipping the pass/fail at the 150 um threshold. No harmonized CT measurement protocol exists between the two parties.
**Settlement Timeline:** Week 1-2: LPBF build campaign (20 implant blanks per build plate, 3 build plates). Week 3: Stress relief and HIP treatment. Week 4: CT scanning at Detroit AM (2 days per build plate). Week 5: Data package delivery with DICOM files and porosity analysis report. Week 6-7: Quantus CT re-scan of statistical sample (5 parts). Week 8: Measurement correlation meeting if discrepancy found. Total: 6-8 weeks.

**Production Log CSV Columns:**
`part_id, build_plate_id, build_date, ct_scan_date, operator_id, relative_density_pct, max_pore_diameter_um, total_porosity_vol_pct, interconnected_porosity_detected, archimedes_density_g_cm3, ct_system_id, voxel_size_um, result, fail_code`

---

### S077

**OEM:** Meridius Medical Devices (OEM-20)
**Factory:** Polymer Precision Additive GmbH (Factory 39)
**Product/Service:** PA12 SLS 3D-printed surgical guide trays -- dimensional accuracy verification per ISO 2768
**Development Stage:** PVT
**Service Order Value:** $85,000
**Test Scenario Reference:** Polymer 3D printed part dimensional accuracy per ISO 2768 and ISO/ASTM 52902

**Key Acceptance Criteria:**
1. Linear dimensions (nominal 10-100 mm range): tolerance per ISO 2768-mK Class m (medium), i.e., +/- 0.2 mm for 30-100 mm features
2. Angular dimensions: +/- 0.5 degrees per ISO 2768-mK
3. Flatness of tray base surface: <= 0.3 mm over 120 mm span (per drawing callout)
4. Guide hole position tolerance: true position +/- 0.15 mm (critical for surgical alignment)
5. Surface roughness Ra <= 12.5 um on guide surfaces (post-bead-blasted finish per ISO/ASTM 52902 benchmark artifact results)
6. No warpage exceeding 0.5 mm bow across tray length (measured via CMM best-fit plane)

**Standard References:**
- ISO 2768-1:1989: General tolerances -- Part 1: Tolerances for linear and angular dimensions
- ISO/ASTM 52902:2019: AM -- Test artifacts -- Geometric capability assessment of AM systems
- ISO 13485:2016: Medical devices -- Quality management systems
- VDI 3405 Part 3: AM processes -- Design rules for part production using laser sintering

**Expected Outcome:** 95% pass rate (PA12 SLS is mature; warpage on thin-wall trays is the primary yield limiter)
**Dispute Likelihood:** Medium -- Polymer Precision measures parts cold (24 hours after build at 23 C), but Meridius's incoming inspection occurs after air freight to Warsaw, IN, where parts may have been exposed to temperature and humidity variations during transit. PA12 absorbs moisture and can dimensionally shift by 0.1-0.2 mm.
**Settlement Timeline:** Week 1: SLS build (100 trays per build, 5 builds). Week 2: Depowdering, bead blasting, CMM inspection. Week 3: Inspection reports and shipment. Week 4: Meridius incoming CMM measurement. Week 5: If dimensional discrepancy, root cause analysis (moisture uptake vs. measurement difference). Total: 4-5 weeks.

**Production Log CSV Columns:**
`part_id, build_id, build_date, inspection_date, operator_id, length_mm, width_mm, height_mm, flatness_mm, guide_hole_tp_mm, surface_ra_um, max_warpage_mm, angular_deviation_deg, result, fail_code`

---

### S078

**OEM:** Quantus Additive Technologies (OEM-36)
**Factory:** Osprey Metal Powders Ltd. (Factory 40)
**Product/Service:** Gas-atomized Inconel 718 metal powder for LPBF -- particle size distribution and flowability characterization
**Development Stage:** MP
**Service Order Value:** $175,000
**Test Scenario Reference:** Metal AM powder characterization per ASTM F3049, ASTM B213, ASTM B212

**Key Acceptance Criteria:**
1. Particle size distribution (PSD) per ASTM F3049 / ASTM B822 (laser diffraction):
   - D10: 15-25 um
   - D50: 30-40 um
   - D90: 50-63 um
   - No particles > 63 um (sieve cut per ASTM B214 using 230 mesh)
2. Apparent density >= 4.0 g/cm3 per ASTM B212 (Hall funnel)
3. Hall flow rate <= 25 s/50g per ASTM B213 (flowability)
4. Tap density >= 4.8 g/cm3 per ASTM B527
5. Oxygen content <= 300 ppm per ASTM E1409 (inert gas fusion)
6. Nitrogen content <= 100 ppm per ASTM E1409
7. Moisture content <= 0.1% by weight per ASTM B925
8. Chemistry per AMS 5662 / ASTM B637 (Ni 50-55%, Cr 17-21%, Fe balance, Nb+Ta 4.75-5.50%, Mo 2.80-3.30%, Ti 0.65-1.15%, Al 0.20-0.80%)

**Standard References:**
- ASTM F3049-14: Standard Guide for Characterizing Properties of Metal Powders Used for AM
- ASTM B822-20: Standard Test Method for Particle Size Distribution by Light Scattering
- ASTM B213-20: Standard Test Methods for Flow Rate of Metal Powders (Hall Flowmeter)
- ASTM B212-21: Standard Test Method for Apparent Density of Free-Flowing Metal Powders
- AMS 5662: Nickel Alloy, Corrosion and Heat-Resistant, Bars, Forgings, and Rings (Inconel 718 chemistry basis)

**Expected Outcome:** 97% lot pass rate (Osprey is established; occasional oversize particles or oxygen exceedance on humid days)
**Dispute Likelihood:** Low -- PSD and flow measurements are well-standardized. Quantus and Osprey both use Malvern Mastersizer 3000 for PSD, minimizing inter-lab variability.
**Settlement Timeline:** Week 1-2: Gas atomization campaign (500 kg Inconel 718 lot). Week 3: Powder sieving, blending, and characterization testing. Week 4: Certificate of Analysis (CoA) and shipment. Week 5: Quantus incoming PSD verification on 3 random samples per lot. Week 6: Payment release. Total: 4-6 weeks.

**Production Log CSV Columns:**
`lot_id, atomization_date, test_date, sample_id, d10_um, d50_um, d90_um, max_particle_um, apparent_density_g_cm3, hall_flow_s_50g, tap_density_g_cm3, oxygen_ppm, nitrogen_ppm, moisture_pct, ni_pct, cr_pct, fe_pct, nb_ta_pct, mo_pct, ti_pct, al_pct, result, fail_code`

---

## SEMICONDUCTOR FABRICATION (S079 -- S081)

---

### S079

**OEM:** NovaBridge Semiconductor Design (OEM-33)
**Factory:** Hsinchu Semiconductor Foundry Corp. (Factory 36)
**Product/Service:** 200 mm silicon wafer thickness and total thickness variation (TTV) inspection for MEMS sensor wafer production
**Development Stage:** MP
**Service Order Value:** $450,000
**Test Scenario Reference:** Wafer thickness and TTV measurement per SEMI M1 and SEMI MF1530

**Key Acceptance Criteria:**
1. Center thickness: 725.0 +/- 10.0 um per SEMI M1-0218 (Specifications for Polished Single Crystal Silicon Wafers)
2. Total thickness variation (TTV): <= 3.0 um per SEMI MF1530-0708 (measured on 200 mm wafer, 5-point cross pattern per SEMI MF533)
3. Bow: <= 40 um per SEMI MF1390-0218 (measured on free-standing wafer)
4. Warp: <= 40 um per SEMI MF1390-0218
5. Surface roughness: Ra <= 0.5 nm (polished side, per SEMI MF1811)
6. Edge exclusion: 3 mm (no TTV measurement within 3 mm of wafer edge)
7. Flatness (GBIR -- Global Backside Ideal Range): <= 2.0 um per SEMI M1

**Standard References:**
- SEMI M1-0218: Specifications for Polished Single Crystal Silicon Wafers
- SEMI MF1530-0708: Standard Test Method for Measuring Flatness, Thickness, and TTV on Silicon Wafers by Automated Non-Contact Scanning
- SEMI MF1390-0218: Standard Test Method for Measuring Warp and Bow on Silicon Wafers
- SEMI MF533-0217: Standard Test Method for Thickness and Thickness Variation of Silicon Wafers

**Expected Outcome:** 98% pass rate (200 mm wafers are mature technology; occasional TTV exceedance at wafer edge)
**Dispute Likelihood:** Medium -- NovaBridge designs MEMS sensors that are thickness-sensitive. Their downstream MEMS etch depth depends on starting wafer thickness uniformity. A wafer that passes SEMI M1 TTV spec (3 um) may still cause MEMS yield loss if the TTV is concentrated in one quadrant. NovaBridge may request site-by-site thickness maps beyond the 5-point SEMI standard.
**Settlement Timeline:** Week 1-2: Wafer production lot (500 wafers, 200 mm). Week 3: Thickness, TTV, bow, warp measurement on 100% of wafers. Week 4: Wafer sort, pack, and ship. Week 5: NovaBridge incoming measurement on 10% sample. Week 6: Payment release. Total: 4-6 weeks.

**Production Log CSV Columns:**
`wafer_id, lot_id, measurement_date, operator_id, center_thickness_um, ttv_um, bow_um, warp_um, surface_ra_nm, gbir_um, result, fail_code`

---

### S080

**OEM:** NovaBridge Semiconductor Design (OEM-33)
**Factory:** Bucheon SemiTek Co., Ltd. (Factory 05)
**Product/Service:** BGA die attach epoxy shear strength testing for automotive-grade microcontroller packaging
**Development Stage:** DVT
**Service Order Value:** $95,000
**Test Scenario Reference:** Die attach shear strength testing per MIL-STD-883 Method 2019.9 and JEDEC JESD22-B117B

**Key Acceptance Criteria:**
1. Die shear strength >= 6.0 kgf (58.8 N) per MIL-STD-883 Test Method 2019.9, Condition A (for die area 1-4 mm2)
2. For die area > 4 mm2: minimum shear force >= 2.5 kgf/mm2 (24.5 N/mm2) of die attach area
3. Failure mode: >= 90% of failures must be cohesive (within epoxy) or die/substrate fracture, NOT adhesive (at interface); adhesive failure at < 60% of minimum force is a reject per MIL-STD-883
4. Post-HTSL (High Temperature Storage Life, 1000 hrs at 150 C per JEDEC JESD22-A103): shear strength retention >= 80% of initial
5. Post-TCT (Temperature Cycling Test, -40 to +150 C, 500 cycles per JEDEC JESD22-A104): shear strength retention >= 75% of initial
6. Void percentage under die (by SAM -- Scanning Acoustic Microscopy): <= 25% per IPC-7095D

**Standard References:**
- MIL-STD-883: Test Method Standard for Microcircuits, Method 2019.9 (Die Shear Strength)
- JEDEC JESD22-B117B: Solder Ball Shear (adapted methodology for die attach)
- JEDEC JESD22-A103: High Temperature Storage Life
- JEDEC JESD22-A104: Temperature Cycling
- IPC-7095D: Design and Assembly Process Implementation for BGAs

**Expected Outcome:** 90% pass rate (DVT stage; die attach epoxy cure profile optimization in progress, some voids expected)
**Dispute Likelihood:** High -- Shear test failure mode classification (adhesive vs. cohesive vs. mixed) is subjective and requires microscope examination of fracture surfaces. Bucheon's failure mode classification may differ from NovaBridge's interpretation. MIL-STD-883 provides photographic examples but boundary cases remain ambiguous.
**Settlement Timeline:** Week 1: Die attach of 200 units with candidate epoxy and cure profile. Week 2: Initial shear testing (destructive, 50 units). Week 3: Reliability conditioning (HTSL and TCT start, 6+ weeks). Week 9: Post-reliability shear testing. Week 10: Data package and report. Week 11: Engineering review. Total: 9-11 weeks (driven by reliability test duration).

**Production Log CSV Columns:**
`unit_id, lot_id, test_date, operator_id, die_area_mm2, shear_force_kgf, shear_strength_kgf_mm2, failure_mode, void_pct, condition, shear_retention_pct, result, fail_code`

---

### S081

**OEM:** NovaBridge Semiconductor Design (OEM-33)
**Factory:** Bucheon SemiTek Co., Ltd. (Factory 05)
**Product/Service:** Gold wire bond pull and shear testing for QFN automotive IC package qualification per MIL-STD-883
**Development Stage:** DVT
**Service Order Value:** $72,000
**Test Scenario Reference:** Wire bond pull test per MIL-STD-883 Method 2011.9 and wire bond shear per MIL-STD-883 Method 2019.9

**Key Acceptance Criteria:**
1. Wire bond pull strength (destructive): >= 3.0 gf (29.4 mN) for 25 um (1.0 mil) gold wire per MIL-STD-883 Method 2011.9, Condition A
2. Wire bond pull strength (destructive): >= 5.0 gf (49.0 mN) for 33 um (1.3 mil) gold wire per MIL-STD-883 Method 2011.9
3. Wire bond shear strength: >= 2.5 gf per mil of wire diameter (i.e., >= 2.5 gf for 1.0 mil wire) per MIL-STD-883 Method 2019.9, Condition D (ball bond shear)
4. Failure mode: >= 95% of pull failures must be mid-span wire break (Mode 1 per MIL-STD-883); bond lift (Mode 2 or Mode 3) constitutes reject
5. Ball bond diameter: 2.5x to 5.0x wire diameter (for 25 um wire: 62.5-125 um ball diameter)
6. Post-TCT (-55 to +150 C, 500 cycles): pull strength retention >= 80% of initial

**Standard References:**
- MIL-STD-883J: Test Method Standard for Microcircuits
  - Method 2011.9: Bond Strength (Destructive Bond Pull Test)
  - Method 2019.9: Die Shear Strength (applied to Ball Bond Shear)
- JEDEC JESD22-A104: Temperature Cycling
- AEC-Q100: Failure Mechanism Based Stress Test Qualification for Integrated Circuits (automotive)

**Expected Outcome:** 94% pass rate (gold wire bonding is mature; heel crack and non-stick-on-pad are occasional DVT issues)
**Dispute Likelihood:** Medium -- Pull test failure mode classification requires operator judgment. A wire that breaks 0.1 mm above the bond neck: is it mid-span (pass) or heel break (investigate)? Bucheon and NovaBridge may disagree on boundary cases.
**Settlement Timeline:** Week 1: Wire bonding of 300 units with production bonder settings. Week 2: Initial pull/shear testing (destructive, 60 units). Week 3: Reliability conditioning start (TCT, HTSL). Week 9: Post-reliability pull/shear testing. Week 10: Data package. Total: 8-10 weeks.

**Production Log CSV Columns:**
`unit_id, lot_id, test_date, operator_id, wire_diameter_um, pull_force_gf, shear_force_gf, failure_mode, ball_diameter_um, condition, pull_retention_pct, result, fail_code`

---

## OPTICS AND PHOTONICS (S082 -- S083)

---

### S082

**OEM:** Radiant Optics Inc (OEM-07)
**Factory:** Nagoya Seimitsu Kogaku Co., Ltd. (Factory 16)
**Product/Service:** BK7 precision optical lenses -- surface quality inspection per MIL-PRF-13830B (scratch-dig)
**Development Stage:** PVT
**Service Order Value:** $210,000
**Test Scenario Reference:** Optical lens surface quality (scratch-dig) per MIL-PRF-13830B

**Key Acceptance Criteria:**
1. Surface quality: 40-20 scratch-dig per MIL-PRF-13830B (maximum scratch width 40 um, maximum dig diameter 0.20 mm)
2. Scratch evaluation: total length of scratches on any single surface <= 1/4 of clear aperture diameter; no scratch wider than 40 um
3. Dig evaluation: no single dig > 0.20 mm; sum of dig diameters on any surface <= 2.0 mm per 20 mm of clear aperture
4. Surface figure (transmitted wavefront error): <= lambda/4 PV at 632.8 nm per MIL-PRF-13830B
5. Surface irregularity (power + astigmatism): <= lambda/8 at 632.8 nm
6. Centration error: <= 3 arcmin (0.05 degrees)
7. Clear aperture: >= 90% of physical diameter

**Standard References:**
- MIL-PRF-13830B: Optical Components for Fire Control Instruments; General Specification Governing the Manufacture, Assembly, and Inspection of (adopted widely for commercial optics)
- ISO 10110-7: Optics and photonics -- Preparation of drawings for optical elements and systems -- Part 7: Surface imperfection tolerances
- ISO 14999-4: Optics and photonics -- Interferometric measurement of optical elements and optical systems -- Part 4

**Expected Outcome:** 88% pass rate (PVT stage; 40-20 scratch-dig is a demanding grade requiring skilled polishing technicians)
**Dispute Likelihood:** High -- Scratch-dig inspection per MIL-PRF-13830B is inherently subjective. Inspectors view surfaces under specified illumination conditions, comparing scratches and digs against calibrated reference standards (PPP -- Paddle, Plate, and Pin standards). Two skilled inspectors can disagree by one grade level (e.g., 40-20 vs. 60-40) on boundary cases. Nagoya Seimitsu's inspectors are trained to Japanese JIS B7098 (which maps imperfectly to MIL-PRF-13830B), while Radiant Optics uses the American MIL standard directly.
**Settlement Timeline:** Week 1-3: Lens grinding, polishing, and centering (batch of 500 lenses). Week 4: Scratch-dig inspection (100% visual), interferometric testing (100% on Zygo GPI XP/D). Week 5: Shipment to Portland, OR. Week 6: Radiant Optics incoming inspection (10% sampling, full inspection if any fail). Week 7: If scratch-dig grade dispute, joint review with calibrated reference standards and photographic evidence. Total: 5-7 weeks.

**Production Log CSV Columns:**
`lens_id, lot_id, inspection_date, inspector_id, scratch_grade, dig_grade, scratch_dig_spec, total_scratch_length_mm, max_dig_diameter_mm, wavefront_pv_waves, irregularity_waves, centration_arcmin, clear_aperture_pct, result, fail_code`

---

### S083

**OEM:** Terralink Connectivity (OEM-08)
**Factory:** Foshan Fiber-Connect Technology Co., Ltd. (Factory 41)
**Product/Service:** SC/APC single-mode fiber optic connector end-face geometry inspection per IEC 61300-3-16
**Development Stage:** MP
**Service Order Value:** $130,000
**Test Scenario Reference:** Fiber optic connector end-face geometry per IEC 61300-3-16 and Telcordia GR-326

**Key Acceptance Criteria:**
1. Radius of curvature (ROC): 7-25 mm for APC connectors per IEC 61300-3-16, Zone A
2. Apex offset: <= 50 um from fiber core center per IEC 61300-3-16
3. Fiber height (fiber protrusion/recess relative to ferrule endface): -50 nm to +50 nm per Telcordia GR-326 Grade A
4. Angle of polish: 8.0 +/- 0.3 degrees for APC per IEC 61755-3-1
5. End-face surface roughness (Ra): <= 10 nm in fiber core zone per IEC 61300-3-16
6. No chips, cracks, or contamination within 25 um of fiber core (Zone A per IPC 61300-3-35)
7. Insertion loss: <= 0.25 dB per IEC 61300-3-4
8. Return loss: >= 65 dB for APC per IEC 61300-3-6

**Standard References:**
- IEC 61300-3-16: Fibre optic interconnecting devices and passive components -- Basic test and measurement procedures -- Part 3-16: Examinations and measurements -- Endface radius of curvature
- Telcordia GR-326-CORE: Generic Requirements for Single-Mode Optical Connectors and Jumper Assemblies
- IEC 61755-3-1: Fibre optic interconnecting devices and passive components -- Connector optical interfaces -- Part 3-1: Connector parameters of dispersion unshifted single mode physically contacting fibres -- Angled
- IEC 61300-3-35: Visual inspection of fibre optic connectors and fibre-stub transceivers

**Expected Outcome:** 96% pass rate (automated polishing is mature; apex offset is the primary yield limiter on APC connectors)
**Dispute Likelihood:** Low -- Fiber optic end-face geometry measurement is highly automated using interferometric profilometers (e.g., Norland, Dimension). Both Foshan and Terralink use compatible equipment, and IEC 61300 defines measurement zones precisely.
**Settlement Timeline:** Week 1-2: Connector assembly and polishing (10,000 SC/APC connectors). Week 3: 100% end-face geometry inspection on Norland AC interferometer. Week 4: IL/RL testing on 100% of connectors. Week 5: Shipment. Week 6: Terralink incoming verification on 2% sample. Total: 4-6 weeks.

**Production Log CSV Columns:**
`connector_id, lot_id, polish_date, test_date, operator_id, roc_mm, apex_offset_um, fiber_height_nm, angle_deg, surface_ra_nm, zone_a_defects, insertion_loss_db, return_loss_db, result, fail_code`

---

## PACKAGING AND CONTAINERS (S084 -- S085)

---

### S084

**OEM:** VitaSource Nutrition (OEM-19)
**Factory:** Midwest Corrugated Packaging Inc. (Factory 42)
**Product/Service:** RSC (regular slotted container) corrugated shipping boxes -- burst and edge crush strength testing per TAPPI standards
**Development Stage:** MP
**Service Order Value:** $42,000
**Test Scenario Reference:** Corrugated box burst and crush strength per TAPPI T810, TAPPI T811, TAPPI T804

**Key Acceptance Criteria:**
1. Mullen burst strength: >= 200 psi (1379 kPa) for 275# test liner per TAPPI T810 (Item 222 equivalent per carrier rule)
2. Edge crush test (ECT): >= 44 lbf/in (7.7 kN/m) for C-flute 44 ECT per TAPPI T811
3. Flat crush resistance: >= 35 lbf/in2 (241 kPa) for C-flute per TAPPI T825
4. Box compression test (BCT): >= 1500 lbf (6672 N) for the specific box size (18x12x12 inch) per TAPPI T804
5. Moisture content of containerboard: 6-9% by weight per TAPPI T412
6. Caliper (board thickness): 0.160 +/- 0.010 inches for C-flute per TAPPI T411

**Standard References:**
- TAPPI T810: Bursting strength of corrugated and solid fiberboard (Mullen test)
- TAPPI T811: Edgewise compressive strength of corrugated fiberboard (short column test)
- TAPPI T804: Compression test of fiberboard shipping containers
- TAPPI T825: Flat crush of corrugated board
- ASTM D4169: Standard Practice for Performance Testing of Shipping Containers

**Expected Outcome:** 97% pass rate (RSC production is high-volume and well-controlled; ECT is the most common failure mode in humid conditions)
**Dispute Likelihood:** Low -- TAPPI tests are well-standardized and reproducible. Moisture content at time of testing is the main variable; VitaSource may reject if boxes are tested at different moisture conditions than Midwest's lab.
**Settlement Timeline:** Week 1: Box production run (50,000 RSC boxes). Week 2: Destructive testing per TAPPI (10 boxes per lot of 5,000). Week 3: Shipment and test certificates. Week 4: Payment release. Total: 3-4 weeks.

**Production Log CSV Columns:**
`lot_id, box_size, test_date, sample_id, burst_psi, ect_lbf_in, flat_crush_lbf_in2, bct_lbf, moisture_pct, caliper_in, flute_type, result, fail_code`

---

### S085

**OEM:** Atlas Heavy Equipment (OEM-37)
**Factory:** Vidriera Monterrey S.A. de C.V. (Factory 43)
**Product/Service:** Amber glass bottles (500 mL) for hydraulic fluid packaging -- dimensional and internal pressure testing per ASTM C147 and ASTM C149
**Development Stage:** MP
**Service Order Value:** $68,000
**Test Scenario Reference:** Glass bottle dimensional inspection and pressure testing per ASTM C147, ASTM C149

**Key Acceptance Criteria:**
1. Total height: 203.0 +/- 1.5 mm per drawing (measured on Emhart glass gauging system)
2. Body diameter: 73.0 +/- 0.8 mm per GPI (Glass Packaging Institute) finish spec
3. Bore diameter (inner opening): 28.0 +/- 0.3 mm per GPI 28-405 finish specification
4. Verticality (tilt): <= 1.5 mm deviation from vertical axis per ASTM C148
5. Internal pressure resistance: >= 150 psi (1034 kPa) without failure per ASTM C149 (hydrostatic test)
6. Thermal shock resistance: survive 42 C differential per ASTM C149 (no cracks after immersion from 63 C water to 21 C water)
7. Wall thickness (minimum): >= 2.0 mm at thinnest point per light-gauge inspection
8. Weight: 310 +/- 15 g per bottle

**Standard References:**
- ASTM C147: Standard Test Method for Internal Pressure Strength of Glass Containers
- ASTM C149: Standard Test Method for Thermal Shock Resistance of Glass Containers
- ASTM C148: Standard Test Method for Polariscopic Examination of Glass Containers
- GPI (Glass Packaging Institute) finish specifications
- ISO 7458: Glass containers -- Internal pressure resistance -- Test methods

**Expected Outcome:** 98% pass rate (high-volume glass forming is stable; wall thickness variation is the main failure mode)
**Dispute Likelihood:** Low -- Glass bottle testing is well-standardized and destructive tests are unambiguous.
**Settlement Timeline:** Week 1-2: Glass bottle production run (200,000 bottles). Week 3: AQL sampling and destructive testing (125 bottles per lot). Week 4: Shipment and CoA. Week 5: Payment release. Total: 3-5 weeks.

**Production Log CSV Columns:**
`bottle_id, lot_id, mold_cavity, test_date, operator_id, total_height_mm, body_diameter_mm, bore_diameter_mm, verticality_mm, pressure_psi, thermal_shock_pass, min_wall_thickness_mm, weight_g, result, fail_code`

---

## RUBBER AND PLASTICS (S086 -- S087)

---

### S086

**OEM:** PetroForge Pipeline Solutions (OEM-22)
**Factory:** Changzhou Sealtec Rubber Co., Ltd. (Factory 44)
**Product/Service:** FKM (Viton-type) O-rings for pipeline flange sealing -- hardness and compression set testing per ASTM D2240 and ASTM D395
**Development Stage:** PVT
**Service Order Value:** $55,000
**Test Scenario Reference:** O-ring hardness and compression set per ASTM D2240, ASTM D395, AS568

**Key Acceptance Criteria:**
1. Shore A hardness: 75 +/- 5 (70-80 range) per ASTM D2240, Type A durometer
2. Compression set: <= 25% after 70 hours at 200 C per ASTM D395 Method B (constant deflection, 25% initial compression)
3. Tensile strength: >= 10.3 MPa (1500 psi) per ASTM D412 Die C
4. Elongation at break: >= 150% per ASTM D412
5. Volume swell in ASTM IRM 903 oil: <= 10% after 70 hours at 200 C per ASTM D471
6. Cross-section diameter tolerance: per AS568B standard, for -325 size O-ring (ID 38.87 mm, CS 3.53 +/- 0.10 mm)
7. Inner diameter tolerance: 38.87 +/- 0.46 mm per AS568B
8. No flash, parting line bumps > 0.13 mm, or flow marks per ARP1246 visual inspection standard

**Standard References:**
- ASTM D2240-15: Standard Test Method for Rubber Property -- Durometer Hardness
- ASTM D395-18: Standard Test Methods for Rubber Property -- Compression Set
- ASTM D412-16: Standard Test Methods for Vulcanized Rubber -- Tension
- ASTM D471-16: Standard Test Method for Rubber Property -- Effect of Liquids
- AS568B: Aerospace Size Standard for O-Rings (SAE International)
- ARP1246: Visual Standard for Elastomeric O-Rings

**Expected Outcome:** 94% pass rate (PVT stage; compression set at 200 C is the critical parameter for FKM compound validation)
**Dispute Likelihood:** Medium -- Compression set results are sensitive to oven temperature uniformity and post-conditioning measurement timing. Changzhou measures within 30 minutes of removal from oven (per ASTM D395), but PetroForge's lab may use a different post-conditioning rest period, leading to 2-5% absolute difference in compression set values.
**Settlement Timeline:** Week 1: O-ring molding (10,000 pieces, 4-cavity mold). Week 2: Hardness and dimensional inspection (100% for dimensions, AQL 1.0 for hardness). Week 3: Compression set testing (70 hours at 200 C, 5 specimens per lot). Week 4: Report and shipment. Week 5: PetroForge incoming verification. Total: 4-5 weeks.

**Production Log CSV Columns:**
`lot_id, mold_cavity, test_date, sample_id, hardness_shore_a, compression_set_pct, tensile_mpa, elongation_pct, volume_swell_pct, cs_diameter_mm, id_mm, flash_pass, result, fail_code`

---

### S087

**OEM:** Greenfield IoT Solutions (OEM-04)
**Factory:** Sao Paulo Moldes Ltda. (Factory 35)
**Product/Service:** ABS injection molded IoT sensor enclosures -- shrinkage and warpage verification per ISO 294-4
**Development Stage:** PVT
**Service Order Value:** $110,000
**Test Scenario Reference:** Injection molding shrinkage and warpage per ISO 294-4, ISO 20457

**Key Acceptance Criteria:**
1. Linear mold shrinkage (flow direction): 0.4-0.7% per ISO 294-4 (ABS typical: 0.5% nominal)
2. Linear mold shrinkage (transverse direction): 0.4-0.7% per ISO 294-4
3. Differential shrinkage (flow vs. transverse): <= 0.15% per internal Greenfield specification
4. Warpage (flatness of mating surface): <= 0.20 mm over 80 mm length per drawing callout
5. Overall dimensions: per ISO 2768-mk (Class m for linear, Class K for geometric)
6. Wall thickness: 2.00 +/- 0.10 mm (critical for IP67 sealing)
7. Gate vestige height: <= 0.3 mm per ISO 20457 (cosmetic requirement)
8. No sink marks > 0.05 mm depth on visible surfaces per Greenfield cosmetic standard

**Standard References:**
- ISO 294-4:2018: Plastics -- Injection moulding of test specimens of thermoplastic materials -- Part 4: Determination of moulding shrinkage
- ISO 20457:2018: Plastics -- Determination of the maximum processing shrinkage
- ISO 2768-1:1989: General tolerances -- Part 1: Tolerances for linear and angular dimensions
- ISO 2768-2:1989: General tolerances -- Part 2: Geometrical tolerances for features without individual tolerance indications

**Expected Outcome:** 91% pass rate (PVT stage; new mold with ABS requires 3-5 iterations of process parameter tuning to achieve consistent shrinkage and warpage)
**Dispute Likelihood:** Medium -- Shrinkage measurement is highly sensitive to post-molding conditioning time and temperature. ISO 294-4 specifies measurement after 16 hours at 23 C, but Sao Paulo's factory floor is routinely 28-32 C. Parts measured at 30 C will show different dimensions than when measured at 23 C by Greenfield in Helsinki. Expected delta: 0.02-0.05 mm per 100 mm part length.
**Settlement Timeline:** Week 1-2: Mold trial and process optimization (1,000 first articles). Week 3: CMM dimensional inspection per ISO 2768-mk. Week 4: Shrinkage characterization per ISO 294-4 (3 specimens per process condition). Week 5: Warpage measurement and first article report. Week 6: Greenfield engineering review and PPAP decision. Total: 5-6 weeks.

**Production Log CSV Columns:**
`part_id, mold_cavity, shot_no, test_date, operator_id, shrinkage_flow_pct, shrinkage_transverse_pct, diff_shrinkage_pct, warpage_mm, length_mm, width_mm, height_mm, wall_thickness_mm, gate_vestige_mm, sink_depth_mm, result, fail_code`

---

## CERAMICS AND ADVANCED MATERIALS (S088 -- S089)

---

### S088

**OEM:** NovaBridge Semiconductor Design (OEM-33)
**Factory:** Kyocera Advanced Ceramics Pvt. Ltd. (Factory 45) *(fictional; inspired by Indian advanced ceramics industry)*
**Product/Service:** Alumina (Al2O3 96%) ceramic substrates for RF power amplifier packaging -- flatness and surface roughness testing
**Development Stage:** MP
**Service Order Value:** $185,000
**Test Scenario Reference:** Ceramic substrate flatness and surface roughness per ASTM C1161, MIL-STD-1376

**Key Acceptance Criteria:**
1. Flatness (camber/bow): <= 0.10 mm per 25 mm length per ATC Semitec specification (equivalent to 4 mils/inch camber per MIL-STD-1376 for hybrid microcircuit substrates)
2. Surface roughness (as-fired, top side): Ra <= 0.50 um (CLA) per ASTM C1161 / drawing callout (suitable for thick-film metallization)
3. Surface roughness (lapped side, if applicable): Ra <= 0.10 um
4. Thickness: 0.635 +/- 0.050 mm (25 mil substrate, standard HTCC dimension)
5. Length and width: 50.80 +/- 0.10 mm (2.000 +/- 0.004 inches) per drawing
6. Dielectric constant (at 1 MHz): 9.0 +/- 0.5 per ASTM D150
7. Flexural strength: >= 300 MPa per ASTM C1161 (4-point bend, B-bar specimen)
8. No edge chips, cracks, or inclusions visible at 10x magnification

**Standard References:**
- ASTM C1161-18: Standard Test Method for Flexural Strength of Advanced Ceramics at Ambient Temperature
- ASTM D150-18: Standard Test Methods for AC Loss Characteristics and Permittivity (Dielectric Constant) of Solid Electrical Insulation
- MIL-STD-1376B: Military Standard -- Hybrid Microcircuit Substrates, Design and Construction of (widely referenced for ceramic substrate specifications)
- IPC-4101D: Specification for Base Materials for Rigid and Multilayer Printed Boards (ceramic substrate section)

**Expected Outcome:** 96% pass rate (96% alumina substrates are mature; flatness is the main yield limiter after firing)
**Dispute Likelihood:** Medium -- Flatness measurement depends on fixturing. A thin ceramic substrate (0.635 mm thick) can deflect under its own weight during measurement. NovaBridge measures flatness on a granite surface flat with feeler gauges; Kyocera uses a Zygo NewView non-contact optical profiler. Results can differ by 0.02-0.05 mm depending on gravity sag correction.
**Settlement Timeline:** Week 1-2: Ceramic substrate production (tape cast, punch, fire). Week 3: Flatness, roughness, dimensional, and dielectric testing. Week 4: Flexural strength testing (destructive, 5 specimens per lot). Week 5: Shipment and CoA. Week 6: Payment release. Total: 4-6 weeks.

**Production Log CSV Columns:**
`substrate_id, lot_id, firing_date, test_date, operator_id, flatness_mm, surface_ra_top_um, surface_ra_lapped_um, thickness_mm, length_mm, width_mm, dielectric_constant, flexural_strength_mpa, visual_defects, result, fail_code`

---

### S089

**OEM:** Celestial Aerostructures (OEM-15)
**Factory:** Toray Advanced Composites de Mexico S.A. de C.V. (Factory 46)
**Product/Service:** Carbon fiber/epoxy unidirectional prepreg -- interlaminar shear strength (ILSS) testing per ASTM D2344
**Development Stage:** DVT
**Service Order Value:** $280,000
**Test Scenario Reference:** Carbon fiber composite ILSS (short beam shear) per ASTM D2344

**Key Acceptance Criteria:**
1. Interlaminar shear strength (ILSS): >= 80 MPa (11,600 psi) for T700/epoxy system at room temperature per ASTM D2344 (short beam shear method)
2. ILSS at elevated temperature (82 C / 180 F wet): >= 55 MPa (8,000 psi) per Celestial internal specification (ETW -- elevated temperature wet condition per FAA Advisory Circular AC 20-107B)
3. Coefficient of variation (CV) for ILSS: <= 8% across a minimum of 5 specimens per lot
4. Fiber volume fraction: 55-65% per ASTM D3171 (acid digestion method)
5. Void content: <= 2.0% per ASTM D2734 (calculated from density and fiber volume)
6. Glass transition temperature (Tg): >= 180 C (dry, by DMA onset) per ASTM D7028
7. Failure mode: interlaminar shear (horizontal crack at mid-plane); flexure or compressive failure invalidates the test per ASTM D2344 Section 11

**Standard References:**
- ASTM D2344/D2344M-16: Standard Test Method for Short-Beam Strength of Polymer Matrix Composite Materials and Their Laminates
- ASTM D3171-15: Standard Test Methods for Constituent Content of Composite Materials
- ASTM D2734-16: Standard Test Methods for Void Content of Reinforced Plastics
- ASTM D7028-07: Standard Test Method for Glass Transition Temperature (Tg) of Polymer Matrix Composites by Dynamic Mechanical Analysis (DMA)
- FAA AC 20-107B: Composite Aircraft Structure (environmental knockdown factors)

**Expected Outcome:** 93% pass rate (DVT stage; ETW ILSS is the primary concern as moisture conditioning takes 30+ days and results are sensitive to cure cycle optimization)
**Dispute Likelihood:** Medium -- ETW conditioning protocol is 14 days at 70 C / 85% RH per ASTM D5229. Exact moisture equilibrium varies by specimen thickness. If Toray's specimens don't reach full saturation, ETW ILSS may appear higher than actual. Celestial may request re-conditioning and re-testing.
**Settlement Timeline:** Week 1-2: Prepreg layup and autoclave cure (20 test panels). Week 3: Specimen machining per ASTM D2344 (span-to-thickness ratio 4:1). Week 4: RTD (room temperature dry) ILSS testing. Week 5-8: ETW moisture conditioning (14 days at 70 C / 85% RH per ASTM D5229). Week 9: ETW ILSS testing. Week 10: Full data package including fiber volume, void content, Tg. Total: 8-10 weeks.

**Production Log CSV Columns:**
`panel_id, specimen_id, lot_id, test_date, operator_id, condition, ilss_mpa, failure_mode, fiber_volume_pct, void_content_pct, tg_c, specimen_thickness_mm, span_mm, cv_pct, result, fail_code`

---

## WATER AND ENVIRONMENTAL (S090 -- S091)

---

### S090

**OEM:** Nextera Water Technologies (OEM-35)
**Factory:** Great Lakes Environmental Laboratory LLC (Factory 47)
**Product/Service:** Drinking water quality testing for municipal treatment plant compliance per EPA National Primary Drinking Water Regulations (NPDWR)
**Development Stage:** Sustaining
**Service Order Value:** $35,000
**Test Scenario Reference:** Drinking water quality testing per EPA 40 CFR 141 (Safe Drinking Water Act)

**Key Acceptance Criteria:**
1. Lead (Pb): <= 15 ug/L (action level per 40 CFR 141.80, Lead and Copper Rule)
2. Arsenic (As): <= 10 ug/L (MCL per 40 CFR 141.62)
3. Total coliforms: absent in >= 95% of monthly samples per 40 CFR 141.63 (Revised Total Coliform Rule)
4. E. coli: absent (0 per 100 mL) per 40 CFR 141.63 (any positive E. coli is a Tier 1 violation)
5. Total trihalomethanes (TTHMs): <= 80 ug/L (running annual average, MCL per 40 CFR 141.64)
6. Haloacetic acids (HAA5): <= 60 ug/L (running annual average, MCL per 40 CFR 141.64)
7. Turbidity: <= 1.0 NTU (never exceed), <= 0.3 NTU in >= 95% of monthly samples per 40 CFR 141.13
8. Free chlorine residual: 0.2-4.0 mg/L at entry point to distribution per 40 CFR 141.72
9. pH: 6.5-8.5 per EPA Secondary MCL (40 CFR 143.3)
10. Nitrate (as N): <= 10 mg/L per 40 CFR 141.62

**Standard References:**
- EPA 40 CFR Part 141: National Primary Drinking Water Regulations
- EPA Method 200.8: Determination of Trace Elements in Waters and Wastes by ICP-MS
- EPA Method 524.2: Measurement of Purgeable Organic Compounds in Water by Capillary Column GC/MS
- Standard Methods for the Examination of Water and Wastewater (APHA/AWWA/WEF, 24th Edition)
- EPA 40 CFR Part 143: National Secondary Drinking Water Regulations

**Expected Outcome:** 99% parameter compliance (municipal water treatment is well-controlled; seasonal TTHM spikes in summer are the main concern)
**Dispute Likelihood:** Low -- EPA drinking water methods are rigorously standardized with mandatory method detection limits, holding times, and quality control protocols. Great Lakes is NELAP-accredited. Disputes are rare but can arise over sampling location, sample preservation, and holding time compliance.
**Settlement Timeline:** Week 1: Sample collection from 40 monitoring points across distribution system. Week 2-3: Laboratory analysis (metals by ICP-MS, organics by GC/MS, microbiological by Colilert). Week 4: Report generation per state reporting format. Week 5: Nextera review and submission to state drinking water program. Week 6: Payment release. Total: 4-6 weeks.

**Production Log CSV Columns:**
`sample_id, location_id, sample_date, analysis_date, analyst_id, lead_ug_l, arsenic_ug_l, total_coliform_present, ecoli_present, tthm_ug_l, haa5_ug_l, turbidity_ntu, free_chlorine_mg_l, ph, nitrate_mg_l, result, violation_code`

---

### S091

**OEM:** Nextera Water Technologies (OEM-35)
**Factory:** Gulf Coast Analytical Services Inc. (Factory 48)
**Product/Service:** Industrial wastewater effluent discharge testing for NPDES permit compliance per Clean Water Act
**Development Stage:** Sustaining
**Service Order Value:** $28,000
**Test Scenario Reference:** Wastewater effluent discharge testing per EPA 40 CFR 122 (NPDES permit) and EPA 40 CFR 136

**Key Acceptance Criteria (based on typical NPDES permit limits for industrial discharge):**
1. BOD5 (5-day Biochemical Oxygen Demand): <= 30 mg/L monthly average, <= 45 mg/L daily maximum per typical NPDES secondary treatment limits (40 CFR 133.102)
2. TSS (Total Suspended Solids): <= 30 mg/L monthly average, <= 45 mg/L daily maximum per 40 CFR 133.102
3. pH: 6.0-9.0 at all times per typical NPDES permit
4. Oil and grease: <= 15 mg/L per typical NPDES industrial permit limit
5. Total nitrogen (TN): <= 10 mg/L per state nutrient criteria (varies by watershed)
6. Total phosphorus (TP): <= 1.0 mg/L per state nutrient criteria
7. Ammonia nitrogen (NH3-N): <= 5.0 mg/L per typical NPDES permit (varies by receiving water temperature)
8. Fecal coliform: <= 200 colonies/100 mL per typical NPDES permit

**Standard References:**
- EPA 40 CFR Part 122: NPDES Permit Regulations
- EPA 40 CFR Part 136: Guidelines Establishing Test Procedures for the Analysis of Pollutants (approved analytical methods)
- EPA Method 405.1: BOD5 determination
- EPA Method 160.2: Total Suspended Solids (gravimetric)
- Standard Methods for the Examination of Water and Wastewater (APHA/AWWA/WEF)

**Expected Outcome:** 97% compliance rate (well-managed industrial WWTP; ammonia exceedances occur during cold weather when nitrification slows)
**Dispute Likelihood:** Low -- EPA 40 CFR 136 approved methods are highly standardized. Gulf Coast is NELAP-accredited with robust QA/QC. Main dispute risk is sample integrity (holding times, preservation).
**Settlement Timeline:** Week 1: Monthly composite sampling at effluent outfall (5-day composite per NPDES permit). Week 2: Laboratory analysis per EPA methods. Week 3: Discharge Monitoring Report (DMR) generation. Week 4: Nextera review and submission to EPA via NetDMR. Week 5: Payment release. Total: 3-5 weeks.

**Production Log CSV Columns:**
`sample_id, outfall_id, sample_date, analysis_date, analyst_id, bod5_mg_l, tss_mg_l, ph, oil_grease_mg_l, total_n_mg_l, total_p_mg_l, ammonia_n_mg_l, fecal_coliform_col_100ml, result, violation_code`

---

## MINING AND MINERALS (S092 -- S093)

---

### S092

**OEM:** Titan Global Mining Corp (OEM-26)
**Factory:** Cairo Contract Analytical Laboratory S.A.E. (Factory 38)
**Product/Service:** Iron ore grade assay (Fe content, moisture, and impurity analysis) for spot cargo acceptance at Egyptian port facility
**Development Stage:** MP
**Service Order Value:** $45,000
**Test Scenario Reference:** Iron ore grade assay per ISO 2596 (total iron), ISO 3087 (chemical analysis), ISO 3082 (sampling)

**Key Acceptance Criteria:**
1. Total iron (Fe): >= 62.0% by dry weight per ISO 2596-1 (titrimetric after tin(II) reduction) -- contract specification for premium fines
2. Silica (SiO2): <= 4.5% per ISO 2598-1
3. Alumina (Al2O3): <= 2.5% per ISO 2598-2
4. Phosphorus (P): <= 0.08% per ISO 2598-1
5. Sulfur (S): <= 0.05% per ISO 4689
6. Moisture content: <= 8.0% per ISO 3087 (transverse falling stream method)
7. Loss on ignition (LOI): <= 4.0% per ISO 2596-2
8. Size distribution: >= 90% passing 6.3 mm sieve per ISO 4701 (iron ore sieve analysis)

**Standard References:**
- ISO 2596-1:2006: Iron ores -- Determination of total iron content -- Part 1: Titrimetric method after tin(II) chloride reduction
- ISO 3087:2020: Iron ores and direct reduced iron -- Determination of the moisture content of a lot
- ISO 3082:2017: Iron ores -- Sampling and sample preparation procedures
- ISO 4701:2019: Iron ores and direct reduced iron -- Determination of size distribution by sieving
- ISO 2598-1:2014: Iron ores -- Determination of silicon content

**Expected Outcome:** 95% lot acceptance rate (Brazilian premium fines typically meet Fe >= 62%, but seasonal rain can increase moisture above 8%)
**Dispute Likelihood:** High -- Iron ore assay results frequently differ between shipper's laboratory (Brazil), independent surveyor (loading port), and buyer's laboratory (discharge port). ISO 3082 defines sampling procedures, but sampling variability on a 170,000-tonne Capesize cargo is inherently large. A 0.5% difference in Fe assay on a $25M cargo changes the cargo price by $375,000. Titan and the iron ore miner may dispute which laboratory result governs payment.
**Settlement Timeline:** Week 1: Cargo arrives at Egyptian port; independent surveyor draws composite samples per ISO 3082 at discharge. Week 2: Cairo Lab performs Fe, SiO2, Al2O3, P, S, moisture, LOI, and size analysis (10 working days per ISO method). Week 3: Certificate of Analysis issued. Week 4: Price adjustment calculated based on Fe penalty/premium schedule. Week 5: If assay dispute (difference > 0.5% Fe between buyer and seller labs), umpire analysis at third laboratory. Total: 3-5 weeks (umpire adds 2-3 weeks).

**Production Log CSV Columns:**
`sample_id, cargo_id, vessel_name, sample_date, analysis_date, analyst_id, fe_pct, sio2_pct, al2o3_pct, p_pct, s_pct, moisture_pct, loi_pct, pct_passing_6_3mm, result, fail_code`

---

### S093

**OEM:** Duraform Building Products (OEM-25)
**Factory:** Texas Crushed Stone LLC (Factory 49)
**Product/Service:** Crushed limestone aggregate gradation testing (sieve analysis) for concrete mix qualification per ASTM C33 and ASTM C136
**Development Stage:** MP
**Service Order Value:** $32,000
**Test Scenario Reference:** Aggregate gradation testing per ASTM C136, ASTM C33

**Key Acceptance Criteria (ASTM C33 Table 1, Size No. 57 -- Nominal Size 25.0 to 4.75 mm):**
1. Passing 37.5 mm (1-1/2 in): 100% per ASTM C33
2. Passing 25.0 mm (1 in): 95-100% per ASTM C33
3. Passing 12.5 mm (1/2 in): 25-60% per ASTM C33
4. Passing 4.75 mm (No. 4): 0-10% per ASTM C33
5. Passing 2.36 mm (No. 8): 0-5% per ASTM C33
6. LA abrasion loss: <= 40% per ASTM C131 (for concrete aggregate)
7. Soundness loss (5 cycles magnesium sulfate): <= 18% per ASTM C88
8. Flat and elongated particles (5:1 ratio): <= 10% per ASTM D4791
9. Specific gravity (SSD): 2.50-2.85 per ASTM C127
10. Absorption: <= 3.0% per ASTM C127

**Standard References:**
- ASTM C136/C136M-19: Standard Test Method for Sieve Analysis of Fine and Coarse Aggregates
- ASTM C33/C33M-18: Standard Specification for Concrete Aggregates
- ASTM C131/C131M-20: Standard Test Method for Resistance to Degradation of Small-Size Coarse Aggregate by Abrasion and Impact in the Los Angeles Machine
- ASTM C88/C88M-18: Standard Test Method for Soundness of Aggregates by Use of Sodium Sulfate or Magnesium Sulfate
- ASTM C127-15: Standard Test Method for Relative Density (Specific Gravity) and Absorption of Coarse Aggregate
- ASTM D4791-19: Standard Test Method for Flat Particles, Elongated Particles, or Flat and Elongated Particles in Coarse Aggregate

**Expected Outcome:** 98% lot pass rate (Texas Crushed Stone has stable quarry geology; occasional gradation drift when crusher settings shift)
**Dispute Likelihood:** Low -- Sieve analysis per ASTM C136 is highly reproducible. Disputes arise only when stockpile segregation causes the loaded aggregate to differ from the tested sample.
**Settlement Timeline:** Week 1: Aggregate production and stockpiling (5,000 tons). Week 2: Quality sampling per ASTM D75 (one composite sample per 2,000 tons). Week 3: Laboratory testing (sieve analysis, LA abrasion, soundness, specific gravity). Week 4: Delivery to Duraform concrete plant with test certificates. Week 5: Payment release. Total: 3-5 weeks.

**Production Log CSV Columns:**
`lot_id, stockpile_id, sample_date, test_date, technician_id, pct_passing_37_5mm, pct_passing_25mm, pct_passing_12_5mm, pct_passing_4_75mm, pct_passing_2_36mm, la_abrasion_pct, soundness_loss_pct, flat_elongated_pct, specific_gravity, absorption_pct, result, fail_code`

---

## PERSONAL CARE AND COSMETICS (S094 -- S095)

---

### S094

**OEM:** Elysian Beauty Holdings (OEM-38)
**Factory:** SunLab Testing Services Pte. Ltd. (Factory 50)
**Product/Service:** Sunscreen SPF (Sun Protection Factor) in vivo testing per FDA 21 CFR 201.327 and ISO 24444
**Development Stage:** DVT
**Service Order Value:** $48,000
**Test Scenario Reference:** Sunscreen SPF testing per FDA 21 CFR 201.327 (Final Monograph), ISO 24444

**Key Acceptance Criteria:**
1. SPF value: labeled SPF 50 requires mean in vivo SPF >= 50.0 per FDA 21 CFR 201.327 (tested on 10 human subjects)
2. Individual subject SPF values: standard deviation of individual SPF values should yield 95% confidence interval lower bound >= labeled SPF
3. SPF value calculation: SPF = MED(protected skin) / MED(unprotected skin), where MED is minimal erythemal dose
4. Critical wavelength: >= 370 nm for "Broad Spectrum" labeling per FDA 21 CFR 201.327
5. UVA protection factor (UVA-PF): >= 1/3 of labeled SPF per EU Recommendation 2006/647/EC (if seeking EU market, tested per ISO 24443 in vitro)
6. Water resistance: if claimed, SPF must be >= labeled SPF after 40 or 80 minutes of water immersion per FDA protocol
7. Number of subjects: minimum 10 evaluable subjects per FDA; minimum 10 per ISO 24444:2019
8. Reference standard: P2 sunscreen standard (SPF 15.7 +/- 2.7) must fall within expected range to validate test run

**Standard References:**
- FDA 21 CFR 201.327: Labeling requirements for sunscreen drug products (SPF testing protocol)
- ISO 24444:2019: Cosmetics -- Sun protection test methods -- In vivo determination of the sun protection factor (SPF)
- ISO 24443:2012: Determination of sunscreen UVA photoprotection in vitro
- EU Commission Recommendation 2006/647/EC on the efficacy of sunscreen products

**Expected Outcome:** 85% formulation pass rate (DVT stage; achieving SPF 50 with good aesthetics requires formulation optimization, and some formulations may yield SPF 40-48 on first test)
**Dispute Likelihood:** High -- In vivo SPF testing has inherent biological variability (inter-subject variation in MED). A formulation that tests SPF 48 on one panel of 10 subjects may test SPF 52 on a different panel. Elysian may request re-testing with a new panel if the first test fails by a narrow margin. SunLab charges $4,800 per SPF test, so re-tests are expensive.
**Settlement Timeline:** Week 1: Formulation samples received by SunLab. Week 2: Subject recruitment, MED determination (unprotected skin). Week 3: SPF test (protected skin irradiation and 16-24 hour MED reading). Week 4: Data analysis, report generation. Week 5: Elysian review. If re-test needed, add 3 weeks. Total: 4-8 weeks.

**Production Log CSV Columns:**
`test_id, formulation_id, test_date, panel_id, subject_count, mean_spf, std_dev_spf, ci_lower_95, critical_wavelength_nm, uva_pf, water_resistance_min, p2_reference_spf, p2_in_range, result, fail_code`

---

### S095

**OEM:** Elysian Beauty Holdings (OEM-38)
**Factory:** Shanghai Cosmetic Testing Center Co., Ltd. (Factory 51)
**Product/Service:** Cosmetic preservative efficacy testing (antimicrobial effectiveness / challenge test) per USP <51> and ISO 11930
**Development Stage:** DVT
**Service Order Value:** $22,000
**Test Scenario Reference:** Preservative efficacy testing per USP <51> Antimicrobial Effectiveness Testing, ISO 11930

**Key Acceptance Criteria (USP <51> Category 2 -- Topical products made with aqueous bases):**
1. Bacteria (S. aureus, E. coli, P. aeruginosa): >= 2.0 log10 reduction at Day 14, no increase at Day 28 per USP <51> Category 2
2. Yeast (C. albicans): no increase at Day 14 and Day 28 per USP <51> Category 2
3. Mold (A. brasiliensis): no increase at Day 14 and Day 28 per USP <51> Category 2
4. Initial inoculum: 1 x 10^5 to 1 x 10^6 CFU/mL per USP <51>
5. ISO 11930 Criterion A (stricter, for EU market): bacteria >= 3.0 log10 reduction at Day 7, >= 3.0 at Day 14; yeast/mold >= 1.0 log10 reduction at Day 7, >= 1.0 at Day 14
6. ISO 11930 Criterion B (minimum): bacteria >= 3.0 log10 reduction at Day 14; yeast/mold >= 1.0 log10 reduction at Day 14

**Standard References:**
- USP <51>: Antimicrobial Effectiveness Testing (United States Pharmacopeia)
- ISO 11930:2019: Cosmetics -- Microbiology -- Evaluation of the antimicrobial protection of a cosmetic product
- PCPC (Personal Care Products Council) Technical Guidelines on Microbial Quality Management

**Expected Outcome:** 80% formulation pass rate (DVT stage; reformulation with reduced preservative levels or "clean beauty" ingredient trends often fails first challenge test, especially mold control)
**Dispute Likelihood:** Medium -- Challenge test results are binary (pass/fail per USP <51> criteria), but the 28-day test duration means that if a formulation fails at Day 28 for yeast, 4 weeks of development time are lost. Elysian may dispute whether Shanghai's inoculum preparation (viable count at time of inoculation) was exactly within the 10^5-10^6 CFU/mL range.
**Settlement Timeline:** Week 1: Formulation samples received by Shanghai Cosmetic Testing. Day 0: Inoculation with 5 challenge organisms. Day 7: First viable count (ISO 11930). Day 14: Second viable count (USP <51> and ISO 11930). Day 28: Final viable count (USP <51>). Week 5: Report generation. Week 6: Elysian review. Total: 5-6 weeks (driven by 28-day incubation).

**Production Log CSV Columns:**
`test_id, formulation_id, inoculation_date, organism, initial_cfu_ml, day7_cfu_ml, day7_log_reduction, day14_cfu_ml, day14_log_reduction, day28_cfu_ml, day28_log_reduction, usp51_result, iso11930_criterion_a, iso11930_criterion_b, result, fail_code`

---

## AGRICULTURE (S096 -- S097)

---

### S096

**OEM:** Prairie Grain Cooperative (OEM-39)
**Factory:** Great Plains Grain Inspection Service LLC (Factory 52)
**Product/Service:** Hard red winter (HRW) wheat grain moisture and protein content testing at country elevator for USDA grade classification
**Development Stage:** Sustaining
**Service Order Value:** $18,000
**Test Scenario Reference:** Grain moisture and protein testing per USDA GIPSA (now FGIS) standards, AACC International Methods

**Key Acceptance Criteria (USDA Grain Grading Standards for Wheat, 7 CFR 810):**
1. Moisture content: <= 13.5% for US No. 1 grade, <= 14.0% for US No. 2 grade per GIPSA Handbook, Chapter 13 (NIRT/Whole kernel near-infrared transmittance per AACC Method 39-25.01)
2. Protein content (12% moisture basis): >= 11.5% for premium pricing tier per contract specification (NIRT per AACC Method 39-10.01)
3. Test weight: >= 60.0 lb/bu (77.3 kg/hL) for US No. 1 grade per USDA Official Grain Grading Standards
4. Total defects: <= 2.0% for US No. 1, <= 4.0% for US No. 2 per 7 CFR 810.2202
5. Shrunken and broken kernels: <= 3.0% for US No. 1, <= 5.0% for US No. 2
6. Foreign material: <= 0.4% for US No. 1, <= 0.7% for US No. 2
7. Falling number: >= 300 seconds for breadmaking quality per AACC Method 56-81.04 (Hagberg-Perten method)
8. Dockage: measured and reported separately (not a grading factor) per GIPSA

**Standard References:**
- USDA 7 CFR 810, Subpart M: United States Standards for Wheat
- GIPSA (now FGIS) Grain Inspection Handbook, Book II, Chapter 13: Wheat
- AACC International Method 39-25.01: Near-Infrared Reflectance Method for Protein Determination in Wheat
- AACC International Method 56-81.04: Determination of Falling Number

**Expected Outcome:** 92% of loads grading US No. 1 or No. 2 (harvest quality varies by growing season; drought years reduce test weight and increase shrunken kernels)
**Dispute Likelihood:** Medium -- Protein content determines price premium ($0.10-$0.30/bushel per percentage point above 11.5%). NIRT calibration on whole-grain instruments (Perten Inframatic 9500) varies by 0.3-0.5% protein between instruments. Prairie Grain's elevator instrument and Great Plains' inspection service instrument may disagree by enough to move a load across a protein pricing tier. GIPSA allows 0.4% protein tolerance for official inspection.
**Settlement Timeline:** Day 1: Truck arrives at country elevator; probe sample drawn per GIPSA sampling procedures. Day 1: NIRT analysis for moisture and protein (2-minute test). Day 2: Test weight, dockage, and defect analysis (30 minutes). Day 3: Grade certificate issued. Day 5: If protein dispute, official FGIS sample submitted for laboratory Kjeldahl analysis. Total: 1-5 days (rapid turnaround industry).

**Production Log CSV Columns:**
`load_id, elevator_id, sample_date, test_date, inspector_id, moisture_pct, protein_pct_12mb, test_weight_lb_bu, total_defects_pct, shrunken_broken_pct, foreign_material_pct, falling_number_s, dockage_pct, grade, result, fail_code`

---

### S097

**OEM:** AgriNutrient Solutions Corp (OEM-40)
**Factory:** Midwest Agrochemical Testing LLC (Factory 53)
**Product/Service:** Granular NPK fertilizer nutrient analysis (nitrogen, phosphorus, potassium) for label guarantee compliance per AAPFCO and AOAC methods
**Development Stage:** MP
**Service Order Value:** $25,000
**Test Scenario Reference:** Fertilizer NPK analysis per AOAC Official Methods, AAPFCO Uniform State Fertilizer Bill

**Key Acceptance Criteria (for a 10-10-10 general purpose fertilizer):**
1. Total nitrogen (N): 10.0% guaranteed minimum, analytical tolerance: investigative allowance of -0.49% N (i.e., must be >= 9.51%) per AAPFCO Official Publication, Table 1
2. Available phosphoric acid (P2O5): 10.0% guaranteed minimum, investigative allowance: -0.67% (i.e., must be >= 9.33%) per AAPFCO
3. Soluble potash (K2O): 10.0% guaranteed minimum, investigative allowance: -0.41% (i.e., must be >= 9.59%) per AAPFCO
4. Moisture content: <= 1.5% by weight per manufacturing specification
5. Granule size uniformity (SGN -- Size Guide Number): 240 +/- 20 per TFI (The Fertilizer Institute) specifications
6. Uniformity Index (UI): >= 50% per TFI (ratio of D90/D10 on sieve analysis, closer to 100 = more uniform)
7. Heavy metals: Arsenic <= 13 ppm, Cadmium <= 10 ppm, Lead <= 61 ppm, Mercury <= 1 ppm per AAPFCO Statement of Uniform Interpretation and Policy (SUIP) #25

**Standard References:**
- AOAC Official Method 2001.01: Determination of Total Nitrogen in Fertilizers (combustion/Dumas method)
- AOAC Official Method 960.03: Determination of Available Phosphoric Acid
- AOAC Official Method 958.02: Determination of Potash (K2O) in Fertilizers
- AAPFCO Official Publication: Official Fertilizer Terms and Definitions, Investigative Allowances
- ASTM E11: Standard Specification for Woven Wire Test Sieve Cloth (for SGN determination)

**Expected Outcome:** 96% lot pass rate (NPK blending is well-controlled; occasional nitrogen loss from urea volatilization during storage)
**Dispute Likelihood:** Low -- AOAC methods are referee methods with tightly controlled inter-laboratory variability. AAPFCO investigative allowances account for normal analytical variation. Disputes are rare unless a nutrient falls below the investigative allowance, in which case the state regulatory agency may issue a stop-sale order.
**Settlement Timeline:** Week 1: Production lot sampling (20-ton lot, 10 probe samples composited per AAPFCO). Week 2: Laboratory analysis per AOAC methods (5 working days). Week 3: Certificate of analysis and report. Week 4: If nutrient deficiency found, AgriNutrient must decide on re-blending or label revision. Total: 2-4 weeks.

**Production Log CSV Columns:**
`lot_id, product_code, sample_date, analysis_date, analyst_id, total_n_pct, avail_p2o5_pct, soluble_k2o_pct, moisture_pct, sgn, uniformity_index, arsenic_ppm, cadmium_ppm, lead_ppm, mercury_ppm, result, fail_code`

---

## ELECTRONICS ASSEMBLY SERVICES (S098 -- S100)

---

### S098

**OEM:** Lumenar Technologies (OEM-01)
**Factory:** Suzhou Weida Electronic Assembly Co., Ltd. (Factory 02)
**Product/Service:** BGA X-ray inspection for solder joint void percentage on smartphone mainboard per IPC-7095D and IPC-A-610H
**Development Stage:** PVT
**Service Order Value:** $165,000
**Test Scenario Reference:** BGA void percentage X-ray inspection per IPC-7095D Section 8.3 and IPC-A-610H Section 8.2.12.3

**Key Acceptance Criteria:**
1. Maximum void percentage per BGA solder ball: <= 25% of ball cross-sectional area per IPC-7095D Section 8.3.12 (Process Indicator for Class 2)
2. Maximum void percentage per BGA solder ball: <= 9% for Class 3 (high reliability) per IPC-7095D
3. Maximum total void area across entire BGA package: <= 25% of total pad area per IPC-A-610H Class 2
4. No single void spanning > 50% of any individual solder ball diameter (bridging void reject criterion)
5. Head-in-pillow (HiP) defect: zero tolerance -- any HiP detected on X-ray is a reject per IPC-7095D Section 8.3.9
6. Solder ball diameter uniformity: ball diameter within +/- 20% of nominal per IPC-7095D
7. Minimum standoff height (gap between BGA and PCB): >= 50% of nominal ball height per IPC-A-610H

**Standard References:**
- IPC-7095D: Design and Assembly Process Implementation for BGAs
- IPC-A-610H: Acceptability of Electronic Assemblies (Section 8.2.12 -- BGA Solder Joints)
- IPC-7095D Section 8.3.12: Void Criteria for BGA Assemblies
- JEDEC J-STD-020E: Moisture/Reflow Sensitivity Classification for Nonhermetic Surface-Mount Devices

**Expected Outcome:** 95% pass rate (PVT stage; void percentage is well-controlled with profiled reflow, but occasional lot-to-lot solder paste variation can increase voiding)
**Dispute Likelihood:** Medium -- X-ray void measurement depends on image processing algorithm thresholds (grayscale to binary conversion). Weida uses a Nordson Dage XD7600NT with Genia software; Lumenar's incoming inspection uses a Nikon XT H 225 with Volume Graphics software. Different thresholding algorithms can report void percentage differences of 3-8% absolute on the same solder ball.
**Settlement Timeline:** Week 1-2: PVT mainboard assembly (5,000 boards). Week 3: X-ray inspection of all BGA joints (2 BGAs per board x 5,000 = 10,000 BGA packages scanned). Week 4: Shipment with X-ray image database. Week 5: Lumenar incoming X-ray verification on 5% sample. Week 6: If void measurement discrepancy, cross-section and SEM verification of disputed joints. Total: 4-6 weeks.

**Production Log CSV Columns:**
`board_serial, bga_ref_des, inspection_date, operator_id, xray_system_id, max_void_pct, avg_void_pct, total_void_area_pct, max_single_void_diameter_pct, hip_detected, ball_diameter_uniformity_pct, standoff_height_pct, result, fail_code`

---

### S099

**OEM:** Sentinel Defense Electronics (OEM-16)
**Factory:** Gumi Advanced Electronics Co., Ltd. (Factory 06)
**Product/Service:** Silicone conformal coating thickness measurement on military avionics PCB assemblies per IPC-A-610H and MIL-I-46058
**Development Stage:** PVT
**Service Order Value:** $95,000
**Test Scenario Reference:** Conformal coating thickness measurement per IPC-A-610H Section 10.6 and IPC-CC-830C

**Key Acceptance Criteria:**
1. Conformal coating thickness (dry film): 25-75 um (1-3 mils) for silicone (SR) type per IPC-A-610H Section 10.6.1, Table 10-1
2. No areas of insufficient coverage (bare spots > 0.5 mm2) on coated surfaces per IPC-A-610H Class 3
3. No bubbles with diameter > 1.0 mm per IPC-A-610H Class 3
4. No dewetting, orange peel, or fish-eyes per IPC-A-610H Class 3 (cosmetic and functional reject)
5. Coating must not bridge or fill component connector areas designated as "keep-out zones" per assembly drawing
6. Edge coverage: coating must wrap around PCB edges and cover pad/trace transitions per IPC-A-610H
7. Coating adhesion: pass cross-cut tape test per ASTM D3359 Method B (>= 4B rating, <= 5% area removed)
8. Insulation resistance after coating: >= 10^9 ohms at 500 VDC per IPC-CC-830C Section 3.8

**Standard References:**
- IPC-A-610H: Acceptability of Electronic Assemblies, Section 10.6 (Conformal Coating)
- IPC-CC-830C: Qualification and Performance of Electrical Insulating Compound for Printed Wiring Assemblies
- MIL-I-46058C: Insulating Compound, Electrical (for Coating Printed Circuit Assemblies) -- cancelled but still widely referenced
- ASTM D3359-17: Standard Test Methods for Rating Adhesion by Tape Test

**Expected Outcome:** 93% pass rate (PVT stage; selective coating robot programming is being optimized -- keep-out zone encroachment is the primary defect mode)
**Dispute Likelihood:** Medium -- Coating thickness measurement method matters. Gumi uses Elcometer 456 eddy-current probe on test coupons processed alongside production boards. Sentinel's incoming inspection uses Micro-Epsilon confocal sensor directly on populated boards. Conformal coating thickness varies by 10-20 um between flat test coupon and actual PCB topography. IPC-A-610H does not specify which method takes precedence.
**Settlement Timeline:** Week 1: Conformal coating application on 500 avionics boards (selective spray robot). Week 2: UV inspection (100%) and thickness measurement (AQL 1.0 sampling). Week 3: Adhesion testing and insulation resistance on 5 boards (destructive). Week 4: Shipment with coating inspection report. Week 5: Sentinel incoming inspection. Total: 4-5 weeks.

**Production Log CSV Columns:**
`board_serial, coating_date, inspection_date, operator_id, coating_type, thickness_um_min, thickness_um_max, thickness_um_avg, bare_spots_detected, max_bubble_diameter_mm, dewetting_detected, keepout_encroachment, adhesion_rating, insulation_resistance_ohms, result, fail_code`

---

### S100

**OEM:** Terralink Connectivity (OEM-08)
**Factory:** Juarez Wiring Systems S.A. de C.V. (Factory 11)
**Product/Service:** Custom cable assembly high-voltage hipot (dielectric withstand) testing per UL 2556 and IEC 60227
**Development Stage:** MP
**Service Order Value:** $78,000
**Test Scenario Reference:** Cable assembly hipot testing per UL 2556, IEC 60227, and UL 62

**Key Acceptance Criteria:**
1. Dielectric withstand (hipot): no breakdown at 1500 VAC for 60 seconds (for 300V rated cable) per UL 2556 Section 7.4 (test voltage = 2x rated voltage + 1000V)
2. Leakage current during hipot: <= 5.0 mA at test voltage per UL 2556
3. Insulation resistance: >= 100 Megohms at 500 VDC per IEC 60227-2 Section 3.2 (measured between each conductor and all others grounded)
4. Continuity resistance: <= 50 milliohms per connection point (verified at 100 mA test current)
5. No flashover, arcing, or corona during hipot test (audible or visual discharge is a reject)
6. Post-hipot insulation integrity: insulation resistance must remain >= 100 Megohms (re-measured within 5 minutes of hipot completion)
7. Voltage ramp rate: 100-500 V/second during hipot ramp-up per UL 2556 (prevents premature breakdown from voltage transients)

**Standard References:**
- UL 2556: Standard for Wire and Cable Test Methods (Section 7: Dielectric Tests)
- IEC 60227-2: Polyvinyl chloride insulated cables of rated voltages up to and including 450/750 V -- Part 2: Test methods
- UL 62: Standard for Flexible Cords and Cables
- IEC 60950-1: Information technology equipment -- Safety (hipot requirements for IT cable assemblies)
- IPC/WHMA-A-620D: Requirements and Acceptance for Cable and Wire Harness Assemblies

**Expected Outcome:** 99% pass rate (hipot testing on cable assemblies with proper insulation is very reliable; failures indicate manufacturing defects -- nick in insulation, contamination, improper crimp)
**Dispute Likelihood:** Low -- Hipot testing is binary (pass/fail) and highly reproducible. Both Juarez and Terralink use calibrated Hipot testers (Associated Research Hypot 3705) per NIST-traceable standards. The main dispute risk is if Terralink's incoming hipot test voltage or dwell time differs from Juarez's production test parameters (e.g., 1 minute vs. 2 minutes at voltage).
**Settlement Timeline:** Week 1-2: Cable assembly production (5,000 assemblies). Week 3: 100% hipot and continuity testing (automated tester, 30 seconds per cable). Week 4: Shipment with test data log. Week 5: Terralink incoming hipot verification on 2% sample. Week 6: Payment release. Total: 4-6 weeks.

**Production Log CSV Columns:**
`cable_serial, lot_id, test_date, operator_id, tester_id, rated_voltage_v, test_voltage_vac, dwell_time_s, leakage_current_ma, breakdown_detected, insulation_resistance_mohm, continuity_resistance_mohm, post_hipot_ir_mohm, ramp_rate_v_s, result, fail_code`
