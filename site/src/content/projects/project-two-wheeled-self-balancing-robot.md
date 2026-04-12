---
title: "Two-Wheeled Self-Balancing Robot"
type: project
status: completed
date: 2022-10-01
tags: [robotics, control-systems, PID, embedded-systems, inverted-pendulum]
---

# Two-Wheeled Self-Balancing Robot

> Real-time PID-controlled inverted pendulum on embedded hardware.

![Status](https://img.shields.io/badge/status-completed-green)

---

## At a Glance

| | |
|---|---|
| **Type** | Project |
| **Status** | Completed |
| **Course** | EE 361L-T2 — Principles of Feedback Control |
| **Supervisor** | Dr. Shafayat Abrar |
| **Collaborator** | — |
| **Date** | October 2022 |
| **Role** | Developer |

---

## Links

- [ ] GitHub — [owner/repo](url)
- [ ] Demo Video — [link](url)

---

## Collaborators

| Name                      | Affiliation      | Role      |
| ------------------------- | ---------------- | --------- |
| Muhammad Suleiman Qureshi | Habib University | Developer |
| Sumaira Khan              | Habib University | Developer |

<!-- ![[logo-habib-university.png]] -->

---

## Plain English Summary

A two-wheeled robot that balances on its own — like a miniature Segway. An MPU-6050 IMU (accelerometer + gyroscope) measures tilt angle, fused via a Kalman/complementary filter, and a PID controller adjusts DC gear motor speed fast enough to keep it upright, all running in real time on an Arduino Uno.

---

## Problem

The inverted pendulum is a classic unstable control problem: without active feedback, the robot immediately falls. Implementing a working real-time stabilization loop on constrained embedded hardware requires careful PID tuning and fast sensor-actuator integration.

---

## Approach / Methodology

- **MPU-6050** (3-axis accelerometer + gyroscope) for tilt estimation, mounted on the top tier for maximum precision
- Accelerometer and gyroscope data fused using a **Kalman / complementary filter** to produce a clean tilt angle
- **PID controller** for real-time balance stabilization
- Mathematical model derived as an inverted-pendulum-on-cart system; equations of motion linearised around θ = π and converted to transfer-function and state-space forms in MATLAB
- Control loop implemented on **Arduino Uno** (DMP interrupt-driven loop, 10 ms sample time)
- Three-tier chassis: sensor on top tier, Arduino + motor driver on middle tier, Li-Ion cells on bottom tier for low centre of mass
- Motors upgraded mid-project from plain 12 V DC to **12 V DC gear motors** after the originals lacked sufficient RPM

---

## Key Results & Outcomes

- Stable balancing demonstrated on hardware
- Robust to small external disturbances
- Theoretical PID gains from MATLAB transfer-function simulation did not match hardware gains — attributed to the system being higher-order than the linearised model captures; final gains found empirically
- Known limitation: weight distribution was not perfectly centred, leaving minor residual oscillation; further PID fine-tuning could improve steadiness

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | C/C++ (Arduino) |
| Embedded | Arduino Uno |
| Sensors | MPU-6050 (3-axis accelerometer + gyroscope) |
| Sensor Fusion | Kalman filter / complementary filter |
| Control | PID (`Arduino-PID-Library` by Brett Beauregard) |
| Simulation | MATLAB (transfer function + state-space) |
| Actuation | 12 V DC gear motors + motor driver |
| Power | 3 × 3.7 V rechargeable Li-Ion cells |

---

## Media

<!-- ![[balancing-robot-demo.mp4]] -->
<!-- ![[robot-hardware.png]] -->

---

## Notes & Context

- Foundational embedded control project, predating the larger [[project-autonomous-ev-tow-truck]] work

---
