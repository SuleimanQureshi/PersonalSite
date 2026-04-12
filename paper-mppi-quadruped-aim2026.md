---
title: MPPI Path Following with Foothold-Quality-Aware Cost for Quadruped Navigation in Unstructured Terrain
type: paper
status: preprint
date: "2026"
tags:
  - robotics
  - quadruped
  - MPPI
  - locomotion
  - terrain-navigation
  - legged-robots
---

# MPPI Path Following with Foothold-Quality-Aware Cost for Quadruped Navigation in Unstructured Terrain

> A hierarchical navigation framework that augments an MPPI local planner with a Foothold-Quality-Aware (FQA) critic and a Turn-in-Place critic, integrated with terrain-aware A* global planning and a convex centroidal MPC, enabling stable fall-free traversal of unstructured forest environments.

![Status](https://img.shields.io/badge/status-under%20review-yellow)

---

## At a Glance

| | |
|---|---|
| **Type** | Conference Paper |
| **Status** | Under Review |
| **Venue** | AIM 2026 (IEEE/ASME International Conference on Advanced Intelligent Mechatronics) |
| **Date** | 2026 |
| **Role** | Author |

---

## Links

- [ ] Paper PDF — [PDF](url)
- [ ] arXiv / Preprint — [arXiv:XXXX.XXXXX](url)
- [ ] DOI — [10.XXXX/XXXXX](url)
- [ ] Conference Page — [AIM 2026](url)
- [ ] GitHub — [owner/repo](url)

---

## Collaborators

| Name                      | Role   |
| ------------------------- | ------ |
| Muhammad Suleiman Qureshi | Author |
| Syeda Ailiya Fatima Rizvi | Author |

---

## Abstract

> Local planners used in mobile robot navigation evaluate trajectories based on center-of-mass collision checks, sufficient for wheeled platforms but inadequate for legged robots, whose stability depends on discrete foothold quality. We present a hierarchical framework that addresses this by augmenting a Model Predictive Path Integral (MPPI) local planner with a Foothold-Quality-Aware (FQA) critic, which penalizes trajectories over unsteppable terrain, and a Turn-in-Place critic, which suppresses destabilizing lateral motion. These are integrated with terrain-aware A* global planning and a convex centroidal MPC enhanced with slope-aligned friction cones, COM adaptation, and capture-point stepping. Ablation studies on a simulated Unitree Go2 in dense forest environments show that the full system achieves stable, fall-free traversal, while removing any component leads to significant degradation.

---

## Plain English Summary

Four-legged robots need to pick their steps carefully on rough ground — a poorly placed foot can cause a stumble or fall. This paper modifies a sampling-based motion planner (MPPI) to factor in where it is safe for each foot to land, not just whether the overall path is feasible. A second critic penalizes "crab-walking" (simultaneous forward and lateral motion) that destabilizes the robot when correcting heading errors. The result is smoother, safer navigation over uneven terrain, validated in simulated British Columbia forest environments.

---

## Problem

Standard MPPI planners (and wheeled-robot nav stacks like ROS 2 Nav2) evaluate trajectory cost using only the robot's Center of Mass (COM) footprint. For a wheeled robot this is sufficient, but for a quadruped it is fundamentally inadequate: the support polygon extends well beyond the body, and footholds on steep slopes, ridges, or gaps cause foot slippage, kinematic saturation, or catastrophic falls even when the COM path is collision-free. Placing the entire burden of terrain negotiation on the reactive leg controller is suboptimal — if the local planner steers into a region devoid of viable footholds, no reactive adaptation can recover stability.

---

## Approach / Methodology

The framework decomposes navigation into three layers operating at distinct spatial and temporal scales:

### 1. Global Planning — Terrain-Aware A* (~12 Hz)
- Weighted A* on an 8-connected 2D cost grid derived from a 2.5D elevation map
- Edge cost combines an exponential obstacle penalty and a terrain steppability term
- Path hysteresis (50% cost discount on the previous path) prevents oscillatory replanning around symmetric obstacles
- Raw path smoothed via constrained Laplacian smoothing

### 2. Local Trajectory Optimization — MPPI (~24 Hz)
- Samples 400 noisy velocity trajectories in SE(2): `(vx, vy, ωz)`
- Temporally correlated AR(1) noise (ρ = 0.5) produces feasible arc-like rollouts
- First-order velocity lag model (τ = 0.4 s) captures MPC response latency
- **Multi-critic cost function** with 8 terms (see table below)

**Key novel critics:**

**Foothold-Quality-Aware (FQA) Critic** — Rather than querying the costmap at the COM, the planner predicts world-frame foot contact locations for all four legs at each rollout step using the hip offsets rotated by heading. The terrain steppability score σ ∈ [0,1] (combining slope and roughness) is queried at each predicted foothold; the FQA cost averages the squared penalty over all legs and horizon steps. Weight: 3.0.

**Turn-in-Place Critic** — Penalizes forward velocity quadratically when heading error exceeds a 0.2 rad dead-band, forcing the robot to align heading before translating. Suppresses the "crab-walking" instability common when omnidirectional planners command quadrupeds. Weight: 500.

| Critic | Weight | Definition |
|---|---|---|
| Path-follow | 80 | Mean cross-track distance to A* path |
| Path-angle | 120 | Mean heading error to path direction |
| Turn-in-place | 500 | v²ₓ · max(0, \|Δψ\| − 0.2)² |
| Path-progress | 20 | Penalises lack of forward advance |
| Obstacle | 30–300 | Graduated: lethal / moderate / mild |
| Slope | 2.5 | Mean gradient magnitude along trajectory |
| FQA | 3.0 | Squared steppability at predicted footholds |
| Smoothness | 0.1 | Mean control rate penalty |

### 3. Whole-Body Control — Convex Centroidal MPC + Leg Controller (~48 Hz / 200 Hz)
- Single Rigid Body (SRB) dynamics, 16-step QP horizon (one full 0.33 s trot cycle)
- Terrain-adaptive friction cones: contact normal queried from height map, friction constraints rotated into local terrain tangent plane (µ = 0.8)
- COM height and orientation adapted to surface slope
- Capture-point stepping: lateral foot widening during roll disturbances
- 24-point heuristic terrain-aware foothold selection

### Perception
- Simulated 3D LiDAR (1350 rays, 6 m range) accumulated into a 12 m × 12 m elevation grid at 5 cm resolution
- Ground layer (20th-percentile height, EMA α = 0.25) and top layer (max height, α = 0.50) per cell
- Steppability score σ = 0.6 · (slope term) + 0.4 · (roughness term), thresholded at ~27° slope and 3 cm roughness
- Obstacle inflation with linear radial kernel, radius 0.50 m

---

## Key Results & Outcomes

### Cross-Terrain Generalization (5 British Columbia LiDAR-derived forests)

The full system traversed 5 m through dense forest obstacles (15 tree trunks, 3 rocks, 2 fallen logs) across all 5 environments with **zero body contacts**:

| Environment | Time (s) | Roll (deg) | Contacts |
|---|---|---|---|
| bc_094p006_2_2_3_xli1m_utm10 | 14.7 | 12.5 | 0 |
| bc_083e021_xli1m_utm11_2019 | 12.5 | 9.19 | 0 |
| bc_093f077_xli1m_utm10_2019 | 18.0 | 9.62 | 0 |
| bc_093f097_xli1m_utm10_2019 | 16.9 | 8.79 | 0 |
| bc_093g045_xli1m_utm10_2019 | 16.2 | 7.63 | 0 |

### Ablation Study (single hand-tuned scene, 18 s limit)

| Configuration | Goal Reached | Final Dist. (m) | Roll RMS (rad) | Pitch RMS (rad) | Body Contacts |
|---|---|---|---|---|---|
| **Full System (Baseline)** | **Yes (14.7 s)** | **0.23** | **0.27** | **0.07** | **0** |
| No Path Planning | No | 2.65 | 0.12 | 0.05 | 0 |
| No FQA Steppability Critic | No | 2.54 | 0.89 | 0.13 | 4 |
| No Terrain Friction Cones | Yes (15.8 s) | 0.42 | 0.36 | 0.18 | 6 |
| No Terrain COM Adaptation | Yes (17.9 s) | 0.72 | 0.73 | 0.16 | 8 |
| No Capture-Point Stepping | No | 2.46 | 0.87 | 0.28 | 12 |
| No Terrain Foothold Selection | No | 1.23 | 0.72 | 0.11 | 7 |
| Blind Locomotion | No | 1.76 | 1.83 | 0.17 | 9 |

The ablation reveals a clear functional hierarchy: reactive balance (capture-point stepping, foothold selection) is the primary defense against falls; perception-informed planning (MPPI + FQA) ensures dynamically viable routes; terrain-aware centroidal dynamics (friction cones, COM adaptation) optimize force distribution. The full system is the **only configuration achieving zero falls**.

---

## Contributions

1. **FQA cost function** for MPPI that evaluates anticipated ground contact locations against a continuously derived terrain steppability map
2. **Turn-in-Place critic** that suppresses unstable lateral quadruped kinematics by heavily penalizing large heading errors
3. **Complete real-time hierarchical framework** combining LiDAR perception, terrain-aware A*, MPPI, and convex centroidal MPC, demonstrated in dense unstructured simulated forest environments

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | Python |
| Control | MPPI, Convex Centroidal MPC (SRB QP) |
| Simulation | MuJoCo |
| Hardware (target) | Unitree Go2 quadruped |
| Perception | Simulated 3D LiDAR, 2.5D elevation mapping |
| Planning | Weighted A* with hysteresis, Laplacian path smoothing |

---

## Media

<!-- ![[quadruped-terrain-demo.png]] -->
<!-- ![[foothold-quality-map.png]] -->

---

## Future Work

- Testing on more extreme environments: stairs, sheer drop-offs, cliffs, dynamic obstacles
- Integration of RGB/semantic cameras for non-geometric hazard detection (water, ice, mud, friction estimation)
- Adaptive gait scheduling (e.g., auto-transition to crawl gait on high-cost terrain, trot on flat ground)
- Sim-to-real transfer on physical Unitree Go2, requiring onboard LiDAR-inertial odometry and actuator delay compensation

---

## Notes & Context

- Extends MPPI expertise developed in [[paper-pid-mppi-tow-truck-iciea2026]] to legged locomotion
- Terrain data sourced from Government of British Columbia LiDAR BC dataset (accessed Feb 2026)
- Part of broader robotics navigation research thread

---
