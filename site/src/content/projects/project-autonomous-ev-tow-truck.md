---
title: "Autonomous EV Tow Truck Control System"
type: project
status: completed
date: 2024-12-01
tags: [robotics, autonomous-vehicles, ROS2, MPPI, PID, embedded-systems, power-electronics, control-systems, industrial-automation]
---

# Autonomous EV Tow Truck Control System

> Full-stack retrofit of an electric tow truck for autonomous navigation in industrial environments — custom hardware, system ID, and a hierarchical PID-MPPI control architecture.

![Status](https://img.shields.io/badge/status-completed-green)

---

## At a Glance

| | |
|---|---|
| **Type** | Final Year Project + Continued Research |
| **Status** | Completed |
| **Collaborator** | IMC Toyota |
| **Date** | Aug 2024 – Feb 2025 |
| **Role** | Lead Engineer |

---

## Links

- [ ] Paper — [[paper-pid-mppi-tow-truck-iciea2026]]
- [ ] GitHub — [owner/repo](url)
- [ ] Demo Video — [link](url)
- [ ] Slides — [link](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Habib University / Takhleeq Office | Lead |
| | IMC Toyota | Industry Partner |

<!-- ![[logo-habib-university.png]] ![[logo-imc-toyota.png]] -->

---

## Plain English Summary

An electric tow truck used in a factory was converted into a self-driving vehicle. New circuit boards, sensors, and actuator electronics were added, and a two-layer control system was built: a fast inner loop handles precise steering and speed, while a slower outer loop plans the route and steers around obstacles. The result was tested in a real factory and achieved near-degree steering accuracy.

---

## Problem

Industrial tow trucks perform repetitive material transport in structured environments — an ideal target for autonomy. However, retrofitting an existing vehicle for autonomous operation requires solving hardware integration, accurate dynamic modeling, and multi-scale control simultaneously.

---

## Approach / Methodology

1. **Hardware Retrofit** — Designed custom PCBs, power electronics, and embedded control hardware to add electronic sensing and actuation to the vehicle
2. **System Identification** — Collected input-output data and identified accurate vehicle dynamics models
3. **Inner Loop (PID)** — Tuned PID controllers for real-time steering angle and velocity regulation
4. **Outer Loop (MPPI)** — Implemented Model Predictive Path Integral control via **ROS2 NAV2** for trajectory planning and obstacle avoidance
5. **Hierarchical Architecture** — PID runs at actuator bandwidth; MPPI runs at planning rate and feeds setpoints to PID

---

## Key Results & Outcomes

- Steering accuracy: **±1°** under real-world operating conditions
- Velocity tracking error: **±0.3 m/s**
- Full autonomous navigation demonstrated in an industrial environment
- Abstract accepted as: [[paper-pid-mppi-tow-truck-iciea2026]]

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

<!-- ![[tow-truck-hardware-overview.png]] -->
<!-- ![[control-architecture.png]] -->
<!-- ![[navigation-test-run.mp4]] -->

---

## Notes & Context

- Started as FYP (Final Year Project) at Habib University, Dec 2024
- Continued as Researcher at Habib University (Jan–Feb 2025)
- Now managed under Takhleeq Office, with ongoing R&D

---
