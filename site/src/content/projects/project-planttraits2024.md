---
title: "PlantTraits2024: Understanding Patterns of Global Biodiversity"
type: paper
status: completed
date: 2024-03-24
tags: [deep-learning, computer-vision, plant-phenotyping, transfer-learning, multi-modal, CLIP, EfficientNet, MobileNet, ecology, kaggle]
---

# PlantTraits2024: Understanding Patterns of Global Biodiversity

> Predicting six key plant traits from crowdsourced photographs and geospatial ancillary data using multi-modal deep learning — toward automated understanding of global ecosystem health.

![Status](https://img.shields.io/badge/status-completed-green)

---

## At a Glance

| | |
|---|---|
| **Type** | Course Paper / Kaggle Competition |
| **Course** | Deep Learning / Computer Vision, 2024 |
| **Status** | Completed |
| **Venue** | PlantTraits2024 – FGVC11, Kaggle |
| **Date** | 2024 |
| **Role** | Co-author / Developer |

---

## Links

- [ ] Paper PDF — [PDF](url)
- [ ] Kaggle Competition — [PlantTraits2024 – FGVC11](https://www.kaggle.com/competitions/planttraits2024)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Habib University | Co-author |
| Nimra Sohail | Habib University | Co-author |
| Muhammad Farhan | Habib University | Supervisor / Advisor |

<!-- ![[logo-habib-university.png]] -->

---

## Abstract

> *PlantTraits2024, a challenge hosted on Kaggle, aims to predict six key plant traits (leaf area, growth height, specific leaf area, leaf nitrogen content, seed mass, stem specific density) from crowdsourced images and supplementary data. Understanding these traits is crucial for analyzing global patterns of plant biodiversity and ecosystem health. This research delves into the competition, exploring the dataset and the task of predicting the plant traits. We analyze approaches used by successful participants, focusing on the strengths of ensemble models that combine multiple learning techniques.*

---

## Plain English Summary

Plants carry measurable traits — like leaf size or stem density — that reveal how ecosystems are doing globally. We trained deep learning models to predict six such traits directly from crowd-sourced plant photographs, augmented with satellite, climate, and soil data. Our best model (CLIP-inspired MobileNet with a learning rate scheduler) achieved an R² of 0.8499, significantly outperforming published baselines.

---

## Problem

Traditional plant trait measurement is slow, laborious, and geographically limited. Citizen science image datasets now exist at scale, but bridging unstructured photographs to precise biochemical and morphological trait values is hard: plant traits don't always have obvious visual correlates, images vary wildly in quality and lighting, and label distributions are long-tailed. Prior work topped out at R² ≈ 0.57 with ensemble CNNs; this work explores whether richer architectures and multi-modal fusion can push further.

---

## Approach / Methodology

**Architecture Exploration**
Four backbone families were explored: EfficientNetV2 (Architecture 1), and a series of CLIP-inspired multi-modal models (Architectures 2.1–2.4) that fuse image features with a 163-dimensional ancillary feature vector (climate, soil, multitemporal satellite data).

**Data & Preprocessing**
- Images resized to 224×224, decoded via TensorFlow; augmentation includes random flips, rotations, zooms, and brightness adjustments
- Ancillary tabular features standardized with `StandardScaler`; missing values imputed or excluded

**Model Architectures**

| Architecture | Image Backbone | Notes |
|---|---|---|
| 1 | EfficientNetV2 | Dual-head (mean + std of traits); ImageNet pre-trained |
| 2.1 | Custom CNN | CLIP-inspired fusion, no transfer learning |
| 2.2 | MobileNet | Transfer learning; global avg pooling |
| 2.3 | EfficientNetB0 | Transfer learning; batch norm + dropout |
| 2.4 | MobileNet | Transfer learning + learning rate scheduler ✦ best |

**Training Setup**
- Loss: Mean Absolute Error (MAE)
- Optimizer: Adam (lr = 1e-4 for 2.4; 1e-5 for others)
- Regularization: Early stopping (patience = 10), dropout, batch normalization
- Metric: Coefficient of determination R² averaged over all 6 traits

---

## Key Results & Outcomes

- **Best R² of 0.8499** achieved by Architecture 2.4 (MobileNet + transfer learning + LR scheduler), surpassing all literature baselines
- CLIP-based fusion (Architecture 2.1, R² = 0.75) outperformed EfficientNetV2 baseline (R² = 0.045) by a wide margin, confirming the value of ancillary data integration
- Transfer learning consistently improved over training from scratch across all backbone comparisons
- Dynamic learning rate scheduling provided a meaningful boost over fixed-rate training (2.4 vs. 2.2: 0.8499 vs. 0.8483)
- Published ensemble baseline (Boonman et al.): R² = 0.5728 — our best model exceeds this by ~0.28
- Post-hoc visualization revealed that plants in high-temperature regions cluster around high leaf area and high SLA values, consistent with known heat-stress adaptations

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | Python |
| Frameworks | TensorFlow / Keras |
| Backbones | EfficientNetV2, MobileNet, EfficientNetB0 |
| Ancillary Data | Worldclim (bioclimatic), multitemporal optical + radar satellite, soil data |
| Data Source | PlantTraits2024 Kaggle competition dataset |
| Infrastructure | Kaggle Notebooks / GPU |

---

## Media

<!-- ![[architecture-efficientnetv2.png]] -->
<!-- *Caption: Architecture 1 — EfficientNetV2 dual-head model* -->

<!-- ![[architecture-clip-mobilenet.png]] -->
<!-- *Caption: Architecture 2.2/2.4 — CLIP-inspired fusion with MobileNet backbone* -->

<!-- ![[predicted-plant-traits.png]] -->
<!-- *Caption: Six trait predictions on held-out test images* -->

---

## Notes & Context

- Submitted for a Deep Learning / Computer Vision course at Habib University under Muhammad Farhan
- Comparison with literature is approximate: referenced R² values are per-trait maximums, whereas ours is a combined 6-trait score — a direct per-trait breakdown is a clear next step
- Known limitation: EfficientNetB0 (Architecture 2.3) underperformed MobileNet despite being a stronger classifier, likely due to training instability at low epochs
- Future directions: ensemble of CLIP-based models; semi-supervised / self-supervised learning; per-trait global biodiversity maps; multimodal fusion with hyperspectral or genetic data

---
