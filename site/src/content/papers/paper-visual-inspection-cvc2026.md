---
title: Deployment-Oriented Memory-Based Visual Inspection of Injection-Molded Parts
type: paper
status: published
date: "2026"
tags:
  - computer-vision
  - anomaly-detection
  - quality-control
  - manufacturing
  - deep-learning
---

# Deployment-Oriented Memory-Based Visual Inspection of Injection-Molded Parts

> Anomaly-detection system achieving 100% recall on industrial injection-molded part defects using only defect-free training data.

![Status](https://img.shields.io/badge/status-accepted-brightgreen)

---

## At a Glance

| | |
|---|---|
| **Type** | Conference Paper |
| **Status** | Accepted |
| **Venue** | CVC 2026 |
| **Date** | 2026 |
| **Role** | Author |

---

## Links

- [ ] Paper PDF — [PDF](url)
- [ ] arXiv / Preprint — [arXiv:XXXX.XXXXX](url)
- [ ] DOI — [10.XXXX/XXXXX](url)
- [ ] Conference Page — [CVC 2026](url)
- [ ] GitHub — [owner/repo](url)

---

## Collaborators

| Name                      | Affiliation               | Role                 |
| ------------------------- | ------------------------- | -------------------- |
| Muhammad Manqad Raza      | Habib University, Karachi | Author               |
| Bilawal Barkat Ali        | Habib University, Karachi | Author               |
| Muhammad Suleiman Qureshi | Habib University, Karachi | Corresponding Author |
| Omema Rizvi               | Habib University, Karachi | Author               |
| Mubashir Anees            | Habib University, Karachi | Author               |
| Abdullah Khalid           | Habib University, Karachi | Author               |
| Mian Abdul Wasay          | Habib University, Karachi | Author               |
| Dr. Waseem Hassan         | Habib University, Karachi | Author               |
| Dr. Unaiza Ahsan          | Habib University, Karachi | Author               |

<!-- ![[logo-habib-university.png]] ![[logo-dawlance.png]] -->

---

## Abstract
Maintaining high aesthetic quality in injection-molded consumer products is essential for customer satisfaction and manufacturing competitiveness. Despite advances in computer vision, manual visual
inspection remains prevalent in industry due to the scarcity of defective data and the practical challenges of deploying automated systems
at scale. This study presents a deployment-oriented visual inspection
system for detecting aesthetic surface defects in large injection-molded
parts under data-scarce conditions. The proposed solution combines a
cost-efficient split-axis mechanical scanning architecture with a high-resolution, unsupervised anomaly detection pipeline trained exclusively
on defect-free samples. Rather than introducing a new detection algorithm, this work focuses on the practical adaptation of the PatchCore anomaly detection framework for real-world industrial deployment,
including controlled illumination, repeatable image acquisition, view-specific modeling, and "takt-time" compliance. The system employs a
single imaging sensor to achieve full 360° exterior surface coverage while
minimizing hardware complexity. Experimental evaluation on a real industrial dataset demonstrates zero missed defects within the tested samples and a low false alarm rate suitable for manual reinspection workflows. The results highlight the feasibility of deploying high-resolution
anomaly detection–based inspection systems in manufacturing environments where defective data are limited and operational constraints are
critical.

---

## Plain English Summary

Factories that mold plastic parts need to catch defects before products ship — but collecting images of defective parts is expensive and slow. This system learns only from images of good parts, then flags anything that looks different. On an industrial test set it caught every single defect without missing one.

---

## Problem

Visual quality inspection of injection-molded plastic components is labor-intensive and inconsistent. Human inspectors are vulnerable to fatigue and produce inconsistent results across long shifts. Defect data is scarce and expensive to label — anomalies stem from unknown external influences and are difficult to pre-specify — making supervised approaches impractical for many industrial lines.

---

## Approach / Methodology

- **PatchCore** pipeline with **WideResNet-101** backbone (pre-trained on ImageNet)
- Input resolution: **1024×1024** — bypasses conventional 224×224 resizing to preserve high-frequency defect signatures
- Trained on **~640 nominal (defect-free) images only** (8 views × ~80 samples/view) — zero defect examples used during training
- Memory bank stores patch-level feature embeddings from Layer 2 and Layer 3 of the backbone, capped at **200,000 patch embeddings** per model via greedy coreset subsampling
- **View-specific models**: separate PatchCore instances for 0° and 45° elevations to mitigate perspective-induced domain shift
- **Split-axis mechanical rig**: turntable (θ-axis, NEMA 34 stepper + 10:1 planetary gearbox, 60 kg capacity) + robotic arm (ϕ-axis, NEMA 34 stepper + 100:1 worm gearbox), enabling full 360° exterior coverage with a single sensor
- **14-image deterministic acquisition sequence** ("Stop-and-Capture" state machine with 500 ms settling delay) completed in ~113 seconds, within the ≤3-minute takt-time window
- **Diffuse dome illumination** (two Aputure Light Dome-II units at ~30° + diffuse LED bars at 45°) inside a light-controlled chamber to suppress specular reflections on high-gloss surfaces
- **Empirical threshold optimization**: sweep over anomaly scores maximising a weighted F1 combining IoU-F1, Area-F1, and Group-F1; optimal threshold = **4.25**

### Hardware

| Component | Specification |
|---|---|
| Prototyping camera | Sony DSLR (6000×4000, 25 px/mm²) |
| Production camera | Basler ace acA5472-5gc (20 MP, ~9.24 px/mm²) |
| Part dimensions | Up to 100×70×50 cm |
| Frame material | Aluminum 6061-T6 T-slot profiles |
| Turntable capacity | 60 kg |

### Acquisition Sequence

| Phase | Orientation | Arm Angle | Table Positions | Captures | Duration |
|---|---|---|---|---|---|
| R1 | Side 1 (F1) | 0° (Flat) | B1–B4 | 4 | 25 s |
| R2 | Side 1 (F1) | 45° (Oblique) | B1–B4 | 4 | 25 s |
| R3 | Side 1 (F1) | 90° (Upright) | B1 | 1 | 1 s |
| F2 | Manual Flip | — | — | — | 30 s |
| R4 | Side 2 (F2) | 90° (Upright) | B1 | 1 | 6 s |
| R5 | Side 2 (F2) | 45° (Oblique) | B1–B4 | 4 | 25 s |
| **Total** | | | | **14** | **113 s** |

---

## Key Results & Outcomes

| Metric | Value |
|---|---|
| Recall | **1.0000 (100%)** |
| F1-Score | **0.9579** |
| Precision | 0.9191 |
| Accuracy | 93.23% |
| False Alarm Rate (FAR) | 29.33% |
| Matthews Correlation Coefficient (MCC) | 0.8059 |
| Missed Defects | **0 / 250** |
| False Alarms | 22 / 75 nominal |
| Optimal Threshold | 4.25 |

### Ablation: Backbone & Resolution

| Backbone | Resolution | Acc | F1 | Recall | Precision | FAR | MDR | MCC |
|---|---|---|---|---|---|---|---|---|
| ResNet50 | 256 | 0.7723 | 0.8295 | 0.7200 | 0.9783 | 0.0533 | 0.2800 | 0.5667 |
| ResNet50 | 1024 | 0.8492 | 0.9107 | 1.0000 | 0.8361 | 0.6533 | 0.0000 | 0.5384 |
| **WRN101-2** | **1024** | **0.9323** | **0.9579** | **1.0000** | **0.9191** | **0.2933** | **0.0000** | **0.8059** |

### Defect Types Detected
- Burn marks
- Flashes (excess plastic at mold boundaries)
- Short shots (incomplete edge / missing plastic)
- Surface delamination
- Scratches

---

## Dataset

| Split | Size | Notes |
|---|---|---|
| Training | ~640 images | Defect-free only; 8 views × ~80 samples; single "golden" reference part |
| Test (verified) | 325 annotated images | 250 defective (Bad1, Bad2, Bad3); 75 nominal; XML ground-truth annotations |

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | Python |
| Frameworks | PyTorch, PatchCore |
| Backbone | WideResNet-101 (ImageNet pre-trained) |
| Baselines compared | PaDiM, STFPM, SIFT/SURF |
| Dataset | ~640 nominal images (Dawlance production line) |
| Annotation format | XML |

---

## Media

<!-- ![[patchcore-architecture.png]] -->
<!-- ![[defect-examples.png]] -->

---

## Notes & Context

- Industrial collaboration with **Dawlance** and the **Takhleeq Office, Habib University**
- Scope limited to **A-surfaces** (exterior housing) — future work targets B-surfaces (interior)
- Key design insight: resolution is a stronger driver of recall than backbone depth alone for sub-millimeter aesthetic defects
- Related project page: [[project-visual-fault-detection-dawlance]]

---
