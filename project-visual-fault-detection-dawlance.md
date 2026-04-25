---
title: "Visual Fault Detection for Plastic Parts (Dawlance)"
type: project
status: in-progress
date: 2025-02-01
tags: [computer-vision, anomaly-detection, quality-control, manufacturing, deep-learning, PatchCore, industrial-automation]
---

# Visual Fault Detection for Plastic Parts

> Automated visual inspection system for injection-molded components — 100% recall with no defect training data.

![Status](https://img.shields.io/badge/status-in--progress-yellow)

---

## At a Glance

| | |
|---|---|
| **Type** | Industry R&D Project |
| **Status** | In Progress (paper accepted) |
| **Collaborator** | Dawlance |
| **Date** | Feb 2025 – Present |
| **Role** | Lead |

---

## Links

- [ ] Paper — [[paper-visual-inspection-cvc2026]]
- [ ] GitHub — [owner/repo](url)
- [ ] Demo — [link](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Takhleeq Office, Habib University | Lead |
| | Dawlance | Industry Partner |

<!-- ![[logo-habib-university.png]] ![[logo-dawlance.png]] -->

---

## Plain English Summary

Dawlance's production line makes plastic-molded parts and needs to catch defects before they reach customers. Getting images of defective parts is hard, so we trained the system entirely on normal parts and let it flag anything that looks different. It caught every single one of 250 defects in testing, and is projected to save PKR 7.2 million per year in quality-related losses.

---

## Problem

Manual visual inspection of injection-molded plastic components is slow, subjective, and misses subtle defects. Collecting labelled defect images at scale is impractical on a live production line, ruling out standard supervised classifiers.

---

## Approach / Methodology

- **PatchCore** anomaly detection pipeline
- Backbone: **WideResNet-101**, input resolution **1024×1024**
- Trained on **640 nominal images only** — no defect examples
- Patch-level memory bank stores embeddings of normal surface regions
- At inference, patches deviating from the memory bank are flagged as defects
- Threshold tuned to maximize recall on the industrial test set

---

## Key Results & Outcomes

- **100% Recall** — 0/250 defects missed
- **F1 = 0.96** on the full industrial test set
- Projected annual savings: **PKR 7.2 million** in quality-related losses
- Results published at CVC 2026: [[paper-visual-inspection-cvc2026]]

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | Python |
| Frameworks | PyTorch, PatchCore |
| Backbone | WideResNet-101 |
| Dataset | 640 nominal images (Dawlance production line) |
| Infrastructure | *To be specified* |

---

## Media

<!-- ![[sample-defects.png]] -->
<!-- ![[patchcore-pipeline.png]] -->
<!-- ![[precision-recall-curve.png]] -->

---

## Notes & Context

- Managed under Takhleeq Office alongside [[project-6dof-robot-arm]] and [[project-visual-vehicle-repair-management]]
- CVC 2026 paper accepted: [[paper-visual-inspection-cvc2026]]

---
