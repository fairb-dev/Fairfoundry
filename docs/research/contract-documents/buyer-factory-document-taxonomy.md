# Buyer-Factory Document Taxonomy

**Research Date:** April 2026
**Scope:** Public taxonomy of document types that flow between an OEM/customer and a factory/supplier across a manufacturing relationship.


## Document Families

| Phase | Document Family | Typical Owner | Fairbuild Role |
| --- | --- | --- | --- |
| Pre-contract | RFQ/RFP technical package | OEM | Import scope, product description, required certifications, delivery constraints, and source references. |
| Contract | Master quality agreement | OEM and factory | Extract obligations, review rights, change-control rules, and quality responsibilities. |
| Contract | Engineering specification / ERS | Engineering | Extract measurable parameters, units, limits, grades, and evidence requirements. |
| Contract | Statement of work | OEM and factory | Map deliverables, milestones, artifacts, acceptance criteria, and responsible parties. |
| Production | Bill of materials | Engineering / supply chain | Track material identity, revision, approved manufacturer, and traceability obligations. |
| Production | Routing / traveler | Factory | Capture process steps, station IDs, operators, timestamps, and rework status. |
| Quality | Inspection and test plan | Quality | Convert hold points, witness points, sample sizes, and pass/fail gates into structured controls. |
| Quality | Certificate of analysis / conformance | Factory or lab | Normalize reported measurements and supporting references. |
| Quality | Test report | QA / lab | Attach machine-readable results, report URI, artifact root, and testbench metadata. |
| Quality | Nonconformance / SCAR | OEM or factory | Record deviation, containment, root cause, corrective action, and acceptance decision. |
| Delivery | Packing list and shipment record | Factory / logistics | Preserve lot identity, serial range, packaging status, and handoff evidence. |
| Post-delivery | Incoming inspection report | OEM | Compare received evidence against the accepted contract model. |
| Ongoing | Change notice / deviation request | OEM or factory | Version the accepted model and preserve approval traceability. |
| Ongoing | Supplier review record | OEM quality | Summarize performance, review history, and qualification status. |

## Fairbuild Extraction Targets

Fairbuild should prioritize fields that remove ambiguity from manufacturing execution:

- Source file identity and revision
- Product, part, and lot identifiers
- Responsible parties
- ERS version
- Parameter name, unit, lower limit, upper limit, target, and sample rule
- Gate group and severity
- Quality grade
- Required artifact type
- Testbench or station identity
- Calibration and firmware references
- Serial coverage
- Review deadline
- Arbitration or reinspection path
- Final outcome

## Replacement Assessment

Fairbuild does not need to replace every document. It should convert the parts of each document that matter for execution and review into a structured control layer.

| Document Type | Replacement Mode | Reason |
| --- | --- | --- |
| ERS / specification | Full structured model | Core source of measurable pass/fail and grade logic. |
| Inspection and test plan | Full structured model | Defines gates, samples, required evidence, and review points. |
| Test report | Structured evidence record | Report files remain attached; measurements become machine-readable. |
| Certificate of conformance | Structured evidence record | Preserves attestation while making claims searchable and comparable. |
| Nonconformance report | Workflow record | Tracks review, disposition, and corrective action. |
| Change notice | Versioned model update | Updates the accepted control record with approval history. |
| RFQ/RFP | Import source | Useful for drafting; not the system of record after agreement. |
| Logistics documents | Reference attachment | Useful context, but not the core verification model. |

## Product Implication

The website and product should show Fairbuild as the layer that turns unstructured manufacturing documents into an accepted, reviewable execution record:

```text
source files -> extracted parameters -> approved gates -> factory evidence -> customer review -> final outcome
```

That story is clearer for enterprise buyers than a transaction-first narrative.
