---
title: Bluetooth-Controlled Combat ROV
type: project
status: completed
date: 2022-12-01
tags:
  - embedded-systems
  - robotics
  - microcontroller
  - bluetooth
  - motor-control
  - obstacle-avoidance
  - TivaC
---

# Bluetooth-Controlled Combat ROV

> A four-wheeled combat robot with Bluetooth teleoperation, autonomous obstacle avoidance, and servo-driven attack/defense mechanisms, built for a head-to-head arena battle competition.

![Status](https://img.shields.io/badge/status-completed-green)

---

## At a Glance

| | |
|---|---|
| **Type** | Course Project |
| **Status** | Completed |
| **Venue** | EE 375L — Microcontroller Lab, Habib University (Fall 2022) |
| **Date** | September – December 2022 |
| **Role** | Team Member (Integration & Testing) |

---

## Links

- [ ] GitHub — [owner/repo](url)
- [ ] Demo / Live Site — [link](url)

---

## Collaborators

| Name                      | Affiliation                | Role                         |
| ------------------------- | -------------------------- | ---------------------------- |
| Muhammad Suleiman Qureshi | Habib University (EE 2024) | Integration & Testing        |
| Syed Mustafa              | Habib University (CE 2024) | Structure & Hardware         |
| Hamna Mansoor Rafi        | Habib University (EE 2024) | Documentation, Control Logic |

<!-- ![[logo-habib-university.png]] -->

---

## Abstract

> *A Bluetooth-controlled combat ROV (Remotely Operated Vehicle) designed for arena-based robot combat. The robot is built around the TM4C123GH6PM (TivaC) microcontroller and uses an HC-05 Bluetooth module for wireless teleoperation via an Android app. Two L298N motor driver modules power four independently driven wheels for omnidirectional movement. An MG-995 servo motor drives a hammer-based attack mechanism, while two HC-SR04 ultrasonic sensors provide autonomous obstacle detection and attack initiation. Two IR sensors detect boundary tape on the arena floor to prevent the robot from leaving the arena. The system supports both manual Bluetooth control and autonomous operation, with hardware-level counters tracking attack and defense events reported to the operator over serial.*

---

## Plain English Summary

This is a combat robot built for a head-to-head arena competition. It can be driven wirelessly from an Android phone over Bluetooth, and can autonomously detect and attack enemy robots using ultrasonic sensors and a servo-powered hammer. IR sensors on the underside detect the arena boundary tape so the robot never drives off the edge. The robot was designed with sustainability in mind — motors, wheels, and structural panels are all detachable and reusable.

---

## Problem

The project required designing and building a fully functional combat robot from scratch under cost and component constraints, capable of competing autonomously and manually in an enclosed arena. Key engineering challenges included: coordinating two independent motor driver circuits across four wheels, distinguishing between arena boundary walls and enemy robots using only IR and ultrasonic sensors, preventing false triggering of the attack mechanism, and managing power sharing between the drive motors and the high-current servo without degrading speed performance.

---

## Approach / Methodology

**Locomotion:** Four independently motorized wheels controlled via two L298N H-bridge driver modules. Rotational motion is achieved by driving the rear wheels in opposite directions; the front wheels assist in linear motion. Six software functions handle forward, backward, forward-left, forward-right, backward-left, and backward-right movement.

**Wireless Control:** HC-05 Bluetooth module connected to a UART port on the TivaC. An Android app sends single-character commands (Forward / Reverse / Left / Right / Attack / Defense) over SPP at 9600 baud. The module's TX/RX are wired directly to the TivaC UART; no level shifting needed on the receive side.

**Boundary Detection (IR Sensors):** Two IR sensors (front and back) detect the black tape lines placed 10 cm inside arena boundaries. Black tape does not reflect the IR beam back to the sensor, triggering a reversal command. When boundary tape is detected, the ultrasonic sensor is disabled to prevent boundary walls from being misidentified as enemy robots.

**Obstacle Avoidance & Attack (Ultrasonic Sensors):** Two HC-SR04 sensors (front and back) measure distance by timing the echo of a 40 kHz sound pulse. The front sensor triggers the attack protocol (servo swings hammer) when the enemy is within range. The rear sensor triggers a 180° rotation to reorient the front sensor toward an enemy approaching from behind.

**Attack Mechanism:** MG-995 servo motor mounted on top of the chassis using L-shaped metal brackets, driving a hammer. The servo is controlled via PWM from the TivaC. A metal counterweight balances the hammer arm.

**Defense Mechanism:** Repurposed metal/acrylic side shields protect the robot's flanks. The 180° spin response to rear detection acts as an active defense by redirecting the attack capability toward the threat.

---

## Key Results & Outcomes

- Successfully delivered a fully operational combat robot by December 2022, demonstrating Bluetooth teleoperation, autonomous obstacle avoidance, and servo-driven attack in the final arena demonstration.
- Attack and defense event counters were tracked in firmware and reported live to the operator's phone via serial over Bluetooth.
- Identified and documented three key constraints with proposed solutions: (1) servo power draw reducing drive speed — fix: dedicated servo battery; (2) attack/defense latency in the main loop — fix: implement as hardware interrupts; (3) defense spin undershooting 180° — fix: empirically tune the delay constant.
- Robot chassis was designed for full disassembly, enabling component reuse across future projects (sustainability goal met).

---

## Tech Stack

| Category | Tools / Hardware |
|---|---|
| Microcontroller | TM4C123GH6PM (TivaC) |
| Wireless | HC-05 Bluetooth SPP Module (UART, 9600 baud, 2.45 GHz) |
| Motor Drivers | 2× L298N H-Bridge (up to 36V, 600 mA/channel) |
| Drive Motors | 4× DC motors (12V, independent wheel drive) |
| Attack Actuator | MG-995 Servo Motor (8.5–10 kgf·cm stall torque, PWM) |
| Distance Sensing | 2× HC-SR04 Ultrasonic Sensor (2–400 cm range, 40 kHz) |
| Boundary Detection | 2× IR Sensors (HW-201 module, 3–5V, adjustable range) |
| Power | Rechargeable Li-ion batteries (series configuration, 12V bus) |
| Programming Language | C (TivaC firmware) |
| Control App | Android Bluetooth Serial app |

---

## Media

<!-- ![[robot-front.jpg]] -->
<!-- *Caption: Front view of final robot showing attack hammer, front shield, and ultrasonic sensors* -->

<!-- ![[robot-side.jpg]] -->
<!-- *Caption: Side view showing four-wheel drive chassis, servo mount, and battery pack* -->

<!-- ![[robot-top.jpg]] -->
<!-- *Caption: Birds-eye view showing TivaC, motor drivers, and wiring harness* -->

<!-- ![[flow-diagram.png]] -->
<!-- *Caption: Top-level firmware flow — CheckBluetooth() → IR_Reading() → boundary check → Update_UltraSonic()* -->

---

## Notes & Context

- Course: EE 375L-T1/T2 (Microcontroller Lab), Fall 2022, Habib University.
- Development proceeded across five milestones from initial concept (Sep 2022) through final implementation (Dec 2022). Key design pivot at Milestone 2: removed the front axle after discovering the limited rotation arc caused wheel-to-frame collisions; switched to independent four-wheel differential drive.
- Servo power draw was the most impactful unresolved hardware issue at competition time — a dedicated servo power rail is the clear next step.
- Attack/defense latency would be significantly improved by converting those routines to interrupt service routines (ISRs) rather than polling inside the main Bluetooth loop.
- The IR + ultrasonic sensor fusion strategy (disabling ultrasonic when IR detects boundary tape) was an elegant solution to a tricky disambiguation problem in a mixed-signal environment.


---
