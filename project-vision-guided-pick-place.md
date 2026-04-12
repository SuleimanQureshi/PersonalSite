---
title: "Vision-Guided Pick & Place Robotic Pipeline"
type: project
status: completed
date: 2023-01-01
tags: [robotics, computer-vision, pick-and-place, object-detection, color-detection, inverse-kinematics, FSM]
---

# Vision-Guided Pick & Place Robotic Pipeline

> Camera-based color object detection and localization integrated with robotic manipulation for automated pick-and-place tasks.

![Status](https://img.shields.io/badge/status-completed-green)

---

## At a Glance

| | |
|---|---|
| **Type** | Lab Project |
| **Course** | EE/CE-366L: Introduction to Robotics Lab, 2023 |
| **Status** | Completed |
| **Collaborator** | Laiba Ahmed |
| **Date** | 2023 |
| **Role** | Developer |
| **Effort** | 16 lab hours |

---

## Links

- [ ] GitHub — [owner/repo](url)
- [ ] Demo Video — [link](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Habib University | Developer |
| Laiba Ahmed | Habib University | Developer |

<!-- ![[logo-habib-university.png]] -->

---

## Plain English Summary

A robotic arm was given eyes: an overhead Intel RealSense camera detects and locates colored blocks in the workspace, then the Phantom X Pincher arm moves to pick them up and sort them into color-designated bins. The pipeline covers perception (color thresholding), coordinate transformation (pixel → real-world via intrinsic matrix), geometric inverse kinematics, and motion execution — all tied together with a Finite State Machine.

---

## Problem

Pick-and-place automation requires bridging the gap between 2D perception (where is the object, and what color is it?) and physical manipulation (how to reach and grasp it?). Integrating camera-based localization with hardware control in a closed loop — while handling lighting variability, IK degeneracies, and calibration drift — is a non-trivial systems problem.

---

## Approach / Methodology

**Computer Vision**
- Color object detection using an Intel RealSense DS400 camera in overhead configuration
- HSV/RGB thresholding + morphological operations to isolate four target colors: red, blue, green, yellow
- Connected components analysis to extract object centroids per color channel

**Pixel → Real-World Coordinate Transformation**
- Used the camera's intrinsic matrix (fx = fy = 1407.1, cx = 960, cy = 540 for 1920×1080 resolution)
- Applied a homogeneous transformation (180° rotation about x-axis + translation along z by camera height) to convert pixel coordinates to robot workspace coordinates
- Depth camera not used — cube height assumed constant and known

**Inverse Kinematics (RRRR Arm)**
- Geometric IK solution for the 4-DOF Phantom X Pincher arm
- Produces a 4×4 solution matrix covering all valid joint-angle configurations
- Error-based optimization selects the configuration minimizing deviation from a target; joint offsets of −π/2 (joint 1) and +π/2 (joint 2) applied to compensate for DH parameter vs. real-arm discrepancies
- Manual offset correction introduced for the negative-x/negative-y quadrant where systematic error was observed

**Finite State Machine**
- States: Idle → Verify Coordinates → Approach → Grasp → Place → Release → Place Complete
- Iterates over all detected object centroids; routes each block to its color-designated bin

---

## Key Results & Outcomes

- **80% success rate** — 8/10 blocks correctly picked and placed across 10 trials
- Smooth arm motion validated on hardware with real colored blocks
- Known failure modes: closely adjacent same-color blocks detected as a single object; arm collision with neighboring cubes; IK solver failure at workspace boundary; lighting sensitivity from fixed threshold values

---

## Tech Stack

| Category   | Tools                                                                                |
| ---------- | ------------------------------------------------------------------------------------ |
| Software   | MATLAB                                                                               |
| Hardware   | Phantom X Pincher robotic arm, Intel RealSense DS400 camera                          |
| Domain     | Computer Vision, Robot Kinematics, Finite State Machines                             |
| Techniques | Color thresholding, Morphological operations, Geometric IK, Error-based optimization |

---

## Limitations

- Light-dependent: threshold values were calibrated under specific lighting; results degrade under different conditions
- Slow: IK is recomputed per detected object location, increasing time complexity
- No depth sensing: assumes all cubes share a known, fixed height
- No grasp feedback: no force/contact sensing to confirm successful grasps

---

## Media

<!-- ![[pick-place-demo.png]] -->
<!-- ![[system-setup.png]] -->

---

## Notes & Context

- Completed as part of EE/CE-366L: Introduction to Robotics Lab at Habib University under Dr. Basit Memon
- Precursor hands-on work informing the larger [[project-6dof-robot-arm]] effort
- Future directions noted: force-based grasp confirmation, dynamic object catching/throwing, agricultural sorting applications

---
