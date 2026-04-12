---
title: Symbolic Health Equations for Unsupervised Gearbox Fault Detection via Kolmogorov-Arnold Autoencoders
type: paper
status: preprint
date: "2026"
tags:
  - fault-detection
  - condition-monitoring
  - gearbox
  - KAN
  - autoencoder
  - unsupervised-learning
  - symbolic-regression
---

# Symbolic Health Equations for Unsupervised Gearbox Fault Detection via Kolmogorov-Arnold Autoencoders

> Interpretable symbolic health indicators for gearbox fault detection, derived unsupervised using Kolmogorov-Arnold Network autoencoders.

![Status](https://img.shields.io/badge/status-under%20review-yellow)

---

## At a Glance

| | |
|---|---|
| **Type** | Conference Paper |
| **Status** | Under Review |
| **Venue** | IEEE ICIEA 2026 |
| **Date** | 2026 |
| **Role** | Author |

---

## Links

- [ ] Paper PDF — [PDF](url)
- [ ] arXiv / Preprint — [arXiv:XXXX.XXXXX](url)
- [ ] DOI — [10.XXXX/XXXXX](url)
- [ ] Conference Page — [IEEE ICIEA 2026](url)
- [ ] GitHub — [owner/repo](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Habib University / Takhleeq Office | Author |

---

## Abstract

Most deep anomaly detectors for rotating machinery are black boxes: they flag a fault but cannot say which physical relationship broke down. We propose a framework that converts a Kolmogorov–Arnold Network (KAN) autoencoder—trained on healthy gearbox vibration data only—into a set of closed-form "health equations" that make fault detection interpretable by design. Each learned activation is approximated by a simple mathematical primitive, yielding 22 explicit equations that characterise normal operation. At test time, deviations from these equations serve as anomaly scores: a Mahalanobis distance on equation residuals achieves AUC 0.9891 ± 0.0069 (mean ± std, N=10 seeds) on the SpectraQuest broken-tooth benchmark, surpassing SHAP-weighted reconstruction (0.9535 ± 0.0129) and most deep baselines while remaining second only to LOF among all eighteen methods compared. A fully symbolic variant—which discards the neural network entirely at inference—runs in 0.018 ms per sample (200× faster than SHAP) and still attains AUC 0.9777 ± 0.0075. Critically, violated equations attribute faults to specific sensor-level statistics (e.g., S1 rms) rather than returning a global feature ranking as SHAP and LIME do.

**Index Terms** — Kolmogorov–Arnold networks, symbolic regression, interpretable anomaly detection, gearbox fault diagnosis, vibration analysis, unsupervised learning.

---

## Plain English Summary

Gearboxes wear out and fail, but catching faults early requires monitoring vibration signals — which is noisy, high-dimensional, and hard to interpret. This work uses a new type of neural network (Kolmogorov-Arnold Networks) to compress vibration data into compact, human-readable "health equations" without ever seeing a labelled fault example. When a gearbox develops a fault, it violates these equations — and crucially, the *specific* violated equation points directly to the sensor and statistic that changed, rather than just raising a generic alarm.

---

## Problem

Traditional gearbox fault detection methods either require labelled fault data (scarce in practice) or produce black-box health indicators that engineers cannot interpret or trust. Post-hoc explainers like SHAP and LIME partially address this but are slow, unstable, require a surrogate model at inference, and produce only global feature rankings — they cannot identify *which structural relationship* was violated. There is a need for unsupervised, ante-hoc interpretable methods that yield explainable outputs without any fault labels.

---

## Approach / Methodology

The pipeline has five stages:

1. **Statistical feature extraction** — For each of 4 accelerometer channels, 11 time-domain statistics (plus margin factor) are computed per window (W ∈ {300–1000} samples), yielding a 44-dimensional feature vector. Features are MinMax-scaled on healthy training data only.

2. **KAN autoencoder training on healthy data only** — Architecture: `[44, 22, B, 22, 44]` with grid size 5, spline order 3, and bottleneck B=8 (selected via ablation). Trained with Adam (lr=1e-3) for 150 epochs using a composite loss: MSE reconstruction + L1+entropy spline regulariser (λ=1e-4). Only healthy recordings are used.

3. **Edge pruning** — Edges in the first encoder layer (44→22) are scored by combined spline + linear weight magnitude. Edges below 5% of the maximum score are pruned; 839 of 968 edges survive (86.7%).

4. **Per-edge symbolic regression** — Each surviving edge's spline is swept over [0,1] at 200 points and fitted against 13 candidate symbolic forms (linear, quadratic, sigmoid, tanh, Gaussian, hinge, √·, log, constant, exponential, power, rational, sin) using SciPy `curve_fit` with a two-stage BIC selection rule. Result: 98.2% of edges fit a quadratic, mean R² = 0.9999, 100% of edges reach R² > 0.95.

5. **Health equation composition & dual anomaly scoring** — Symbolic edge functions are summed per neuron to yield 22 closed-form health equations (e.g., z₀ ≈ 0.045·S1²rms + 0.107·S1rms − 0.051·S1²margin − …). Multiple complementary anomaly scores are derived at test time (see Key Results).

---

## Key Results & Outcomes

### Symbolisation Quality
- 839/968 first-layer edges survive pruning (86.7%)
- Symbolic fitting: 824/839 edges → quadratic; remainder split among sin (11), hinge (2), sigmoid (1), tanh (1)
- Mean R² across all surviving edges: **0.9999** (std 0.0005, min 0.9919, median 1.0000)
- **100% symbolisation rate** (all edges meet R² > 0.95 threshold)

### Anomaly Detection (W=1000, N=10 seeds)

| Score | Description | Mean AUC | Std |
|---|---|---|---|
| A | Reconstruction error | 0.9642 | ±0.0157 |
| B | Calibrated symbolic violation | 0.9026 | ±0.0558 |
| C | 0.5·Ã + 0.5·B̃ | 0.9716 | ±0.0151 |
| D | R²-weighted tolerance band | 0.9403 | ±0.0422 |
| E | 0.5·Ã + 0.5·D̃ | 0.9716 | ±0.0146 |
| **M** | **Mahalanobis on symbolic residuals** | **0.9891** | **±0.0069** |
| F | 0.5·Ã + 0.5·M̃ | 0.9824 | ±0.0097 |
| SymRecon | Fully symbolic reconstruction | 0.9777 | ±0.0075 |

Score M achieves the **highest mean AUC and lowest variance** of all proposed scores, second only to LOF (0.9937) among all 18 methods compared.

### Fault Localisation
- The 22-dimensional residual vector allows per-equation fault attribution via fault ratio ρⱼ = E[r²broken] / E[r²healthy]
- Most violated equation: **z₆** (ρ = 16.2×), dominated by **S1 statistics** (S1_rms, S1_mean, S1_std, S1_var) — physically the accelerometer nearest the broken tooth
- Next: z₁₉ (ρ = 5.9×, S2_kurt), z₂₁ (ρ = 3.9×, S3_margin)
- SHAP/LIME cannot replicate this: their top-10 features overlap on only 2 of 10 features across seeds

### Computational Efficiency

| Method | Size | Inference (ms/sample) | AUC (%) |
|---|---|---|---|
| KAN-AE-Mahal (M) | 22,880 params | 0.0050 | 98.91±0.69 |
| KAN-AE-SymRecon | **10,889 sym. scalars** | **0.018** | 97.77±0.75 |
| SHAP-Weighted-Recon | 22,880 params | 3.67 | 95.35±1.29 |
| LIME-Weighted-Recon | 22,880 params | 4.99 | 98.21±0.76 |
| LOF | 183 KB | 0.0155 | 99.37±0.25 |
| OC-SVM | 28 KB | 0.0009 | 98.56±0.38 |

SymRecon stores 52% fewer parameters than the KAN-AE and runs **200× faster than SHAP**, **271× faster than LIME**.

### Ablations
- **Spline regulariser**: removing it (λ=0) drops symbolisation to 98.7% and increases surviving edges to 910; the regulariser drives both parsimony and symbolisability
- **Bottleneck width**: B=8 is optimal for Score A AUC (0.9642); B≤5 underfits, B≥10 overfits the healthy manifold

---

## Tech Stack

| Category   | Tools                                                        |
| ---------- | ------------------------------------------------------------ |
| Languages  | Python, C++                                                  |
| Frameworks | PyTorch, efficient-kan, SciPy, Eigen, libtorch               |
| Explainability | KernelSHAP, LIME, PySR-style BIC symbolic selection     |
| Domain     | Vibration-Based Condition Monitoring                         |
| Dataset    | SpectraQuest gearbox dataset (4-channel, 20 kHz, 10 load levels, healthy + broken-tooth) |
| Evaluation | ROC-AUC across 8 window sizes, N=10 seeds, C++ inference timing via `std::chrono::high_resolution_clock` |

---

## Media

<!-- ![[kan-autoencoder-diagram.png]] -->
<!-- ![[health-equation-examples.png]] -->
<!-- ![[per-equation-fault-ratio.png]] -->
<!-- ![[bottleneck-ablation-curve.png]] -->

---

## Notes & Context

- Done as a personal project
- Double-blind submission to IEEE ICIEA 2026.
- Evaluation uses a single fault mode (broken tooth); bearing-wear and misalignment validation is left as future work
- Interpretability analysis restricted to first encoder layer; extracting physical meaning from deeply composed formulas remains an open challenge
- The quadratic dominance of symbolic forms is a modelling artefact of [0,1] input scaling + spline regularisation, not a claim about intrinsic gearbox physics

---
