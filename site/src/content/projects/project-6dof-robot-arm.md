---
title: "6-DOF Industrial Robot Arm"
type: project
status: in-progress
date: 2025-02-01
tags: [robotics, kinematics, robot-arm, industrial-automation, control-systems, EtherCAT]
---

# 6-DOF Industrial Robot Arm

> Six-degree-of-freedom robotic manipulator for industrial use — sub-millimeter tolerance kinematic modeling and control integration.

![Status](https://img.shields.io/badge/status-in--progress-yellow)

---

## At a Glance

| | |
|---|---|
| **Type** | Industry R&D Project |
| **Status** | In Progress |
| **Collaborators** | Toyota & Dawlance |
| **Date** | Feb 2025 – Present |
| **Role** | Lead |

---

## Links

- [ ] GitHub — [owner/repo](url)
- [ ] Demo Video — [link](url)
- [ ] Technical Report — [link](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Takhleeq Office, Habib University | Lead |
| | Toyota | Industry Partner |
| | Dawlance | Industry Partner |

<!-- ![[logo-habib-university.png]] ![[logo-toyota.png]] ![[logo-dawlance.png]] -->

---

## Plain English Summary

A six-jointed industrial robot arm is being built from scratch for factory use. The focus is on modeling exactly how the arm moves in 3D space and designing the control system to position it accurately — down to 0.04 mm — so it can perform precise manipulation tasks on a production line.

---

## Problem

Industrial robot arms require precise kinematic models and low-level control integration to meet manufacturing tolerances. Off-the-shelf arms are expensive and inflexible; a custom-built solution allows full control over hardware, software, and integration with existing production infrastructure.

---

## Approach / Methodology

- **Kinematic modeling** — forward and inverse kinematics for all 6 DOF
- **System integration** — control-oriented design targeting 0.04 mm positioning tolerance
- **Communication** — EtherCAT/SOEM for real-time servo communication
- Trajectory planning and end-effector control for industrial pick-and-place or assembly tasks

---

## Key Results & Outcomes

- Target positioning tolerance: **0.04 mm**
- *Further results to be added as project progresses*

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | C++, Python |
| Frameworks | ROS2 |
| Communication | EtherCAT / SOEM |
| Control | PID, trajectory planning |
| Simulation | Gazebo |

---

## Media

<!-- ![[robot-arm-cad.png]] -->
<!-- ![[robot-arm-prototype.png]] -->
<!-- ![[kinematic-diagram.png]] -->

---

## Notes & Context

- One of three concurrent industry projects at Takhleeq Office
- Partners: Toyota and Dawlance
- Related: [[project-visual-fault-detection-dawlance]], [[project-visual-vehicle-repair-management]]

---
