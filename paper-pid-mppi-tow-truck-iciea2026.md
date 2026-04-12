---
title: A Hierarchical PID-MPPI Control Architecture for an Autonomous Electric Tow Truck in Industrial Environments
type: paper
status: preprint
date: "2026"
tags:
  - robotics
  - control-systems
  - MPPI
  - PID
  - autonomous-vehicles
  - ROS2
---

# A Hierarchical PID-MPPI Control Architecture for an Autonomous Electric Tow Truck in Industrial Environments

> Hierarchical control system combining inner-loop PID and outer-loop MPPI for real-world autonomous navigation of an electric tow truck.

![Status](https://img.shields.io/badge/status-abstract%20accepted-blue)

---

## At a Glance

| | |
|---|---|
| **Type** | Conference Paper |
| **Status** | Abstract Accepted |
| **Venue** | ICIEA 2026 |
| **Date** | 2026 |
| **Role** | Lead Author |

---

## Links

- [ ] Paper PDF — [PDF](url)
- [ ] arXiv / Preprint — [arXiv:XXXX.XXXXX](url)
- [ ] DOI — [10.XXXX/XXXXX](url)
- [ ] Conference Page — [ICIEA 2026](url)
- [ ] GitHub — [owner/repo](url)

---

## Collaborators

| Name                      | Affiliation      | Role                      |
| ------------------------- | ---------------- | ------------------------- |
| Muhammad Suleiman Qureshi | Habib University | Lead Author               |
| Sadaf Sheikh              | Habib University | Author/Research Assistant |
| Syeda Ailiya Fatima Rizvi | Habib University | Author                    |
| Sadiqah Mushtaq           | Habib University | Author                    |
| Hijab Fatima              | Habib University | Author                    |
| Ehzem Farhan Sheikh       | Habib University | Author                    |
| Syed Shaheer Abbas Rizvi  | Habib University | Author                    |
| Zeeshan Nafees            | Habib University | Author/Research Assistant |
| Munzir Zafar              | Habib University | Author/Faculty            |
|                           | IMC Toyota       | Industry Collaborator     |

<!-- ![[logo-habib-university.png]] ![[logo-imc-toyota.png]] -->

---

## Abstract

This work presents the design and experimental validation of a compact autonomous electric tow truck, deployed on a physical vehicle platform and tested in a real industrial environment. Developed in collaboration with Toyota for automated logistics and material handling in semi-structured industrial settings, the system adopts a classical, control-centric methodology that prioritizes reliability and deployment readiness over learning-based approaches.
At the low level, the steering and propulsion subsystems are modelled through experimental system identification to capture actuator dynamics, delays, and disturbances encountered during real-world operation. Based on these models, PID controllers are designed and tuned to provide stable and responsive actuation under sensor noise and operating uncertainties for the control of both, the steering angle and linear velocity. Particular emphasis is placed on steering control robustness, including mitigation of steady-state oscillations and noise-induced fluctuations commonly observed in electrically actuated industrial vehicles. Custom PCBs and vehicle electronics are developed to ensure full electronic controllability and reliable integration of wheel encoders and Hall-effect accelerator sensors.
At the high level, Model Predictive Path Integral (MPPI) control is employed for trajectory generation and tracking, enabling optimization over dynamically feasible motion sequences while respecting vehicle constraints. MPPI is implemented as a high-level controller that generates reference trajectories for the underlying PID-controlled system, decoupling fast inner-loop control from optimization-based planning and enabling predictable execution of complex maneuvers. State estimation and localization rely on conventional odometry and LiDAR-based techniques and are used to support closed-loop control and navigation.
Experimental evaluations demonstrate smooth trajectory tracking and robust autonomous operation in representative industrial scenarios. The results indicate that a hierarchical PID-MPPI control architecture, combined with custom hardware integration, can deliver reliable autonomous performance for electric logistics vehicles, reinforcing the continued relevance of classical control pipelines in industrial autonomous systems. A complete autonomous stack was implemented, encompassing embedded electronics, low-level vehicle control, and high-level motion planning within a ROS 2 framework (integrating NAV2 with our Ackermann drive tow truck).

---

## Plain English Summary

An electric tow truck was converted into an autonomous vehicle for use inside a factory. A two-layer control system was built: a fast inner loop keeps the steering and speed accurate moment-to-moment, while a slower outer loop plans the path and avoids obstacles. Together they achieved near-degree-level steering accuracy and sub-0.3 m/s speed error in a real factory setting.

---

## Problem

Retrofitting an existing electric vehicle for autonomous operation in cluttered industrial environments requires bridging the gap between high-level path planning and low-level actuator control — standard approaches either sacrifice real-time responsiveness or trajectory quality.

---

## Approach / Methodology

- **System identification** to derive accurate vehicle dynamics models from the physical truck
- **Inner loop:** PID controllers for real-time steering angle and velocity regulation
- **Outer loop:** Model Predictive Path Integral (MPPI) via **ROS2 NAV2** for trajectory planning and obstacle avoidance
- Custom PCBs, power electronics, and embedded control hardware designed for the retrofit
- Hierarchical architecture decouples planning horizon from actuation bandwidth

---

## Key Results & Outcomes

- Steering accuracy of **±1°** under real-world constraints
- Velocity tracking error of **±0.3 m/s**
- Full autonomous navigation in an industrial environment validated in-situ

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | C++, Python |
| Frameworks | ROS2, NAV2 |
| Control | PID, MPPI |
| Hardware | Custom PCBs, power electronics, embedded controllers |
| Simulation | Gazebo |

---

## Media

<!-- ![[tow-truck-hardware.png]] -->
<!-- ![[control-architecture-diagram.png]] -->
<!-- ![[navigation-demo.mp4]] -->

---

## Notes & Context

- Originated as Final Year Project (FYP) at Habib University
- Continued under Habib University Researcher role (Jan–Feb 2025) and Takhleeq Office
- The abstract was not presented due to lack of funds
- Related project page: [[project-autonomous-ev-tow-truck]]

---
