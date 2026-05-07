---
title: "Visual Vehicle Repair Management System"
type: project
status: in-progress
date: 2025-02-01
tags: [computer-vision, vehicle-tracking, edge-computing, llm, automotive, industrial-automation]
---

# Visual Vehicle Repair Management System (VRMS)

> Real-time, low-cost vision-based system for automated vehicle tracking and bay occupancy monitoring in automotive repair facilities.

![Status](https://img.shields.io/badge/status-in--progress-yellow)

---

## At a Glance

| | |
|---|---|
| **Type** | Industry R&D Project |
| **Status** | In Progress |
| **Collaborator** | Indus Motor Company (IMC) |
| **Date** | Feb 2025 – Present |
| **Role** | Project Manager (Takhleeq Office) |

---

## Links

- [ ] GitHub — [owner/repo](url)
- [ ] Demo — [link](url)
- [ ] Technical Report — [link](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Takhleeq Office, Habib University | Project Manager |
| Shaaf Farooque | Habib University | Student Engineer |
| Sajal Fatima | Habib University | Student Engineer |
| Ms. Maria Samad | Habib University | Faculty Advisor |
| | Indus Motor Company (IMC) | Industry Partner |

<!-- ![[logo-habib-university.png]] ![[logo-imc.png]] -->

---

## Plain English Summary

The post-assembly repair floor at IMC runs 35 bays (assembly, paint, weld, waiting) with no automated tracking — supervisors physically walk the floor, draw graphs by hand, and scan barcodes. This creates a data lag of up to 24 hours between a car entering a bay and that event appearing in the SAP ERP system. VRMS replaces this with IP cameras and a local vision model that detects vehicle presence in real time, updates a dashboard within seconds, and automatically alerts management when a vehicle has exceeded its 3-day repair limit. A secondary commercial track generalizes the system to any repair facility using ANPR (license plate reading) and a local LLM for natural-language facility queries.

---

## Problem

IMC's repair operation tracks 35 active bays manually — physical inspections, hand-drawn statistics, and barcode scanning. This introduces a critical 24-hour data lag between physical bay events and the SAP ERP system, causing unreliable status visibility and poor bay utilization. A compounding technical challenge: vehicles on the repair floor have no license plates, so identical models and colors are clustered together with no unique identifiers, making floor-level tracking extremely error-prone.

---

## Approach / Methodology

The system follows a dual-track architecture:

**Track A — Industrial (IMC):**
- YOLOv8 object detection + custom CNN/template matching to detect reusable magnetic tags attached to vehicles
- 1080p RTSP streams from Hikvision DS-2CD1123G0E-I IP cameras at 15 FPS
- All inference runs on a local edge workstation (no cloud) to comply with IMC's data sovereignty policies
- PostgreSQL database with indexed timestamps; occupancy events written within 10 seconds of physical movement
- Node.js backend + React dashboard with WebSocket push for sub-500ms UI updates
- Twilio WhatsApp API for automated alerts when vehicles exceed 3-day dwell time
- API integration with Toyota SAP ERP system for body number mapping

**Track B — Commercial SaaS:**
- ANPR (YOLOv8 + EasyOCR) replaces magnetic tags — zero hardware on vehicles
- MariaDB backend; government API integration for vehicle make/model/year enrichment
- Local LLM (Ollama qwen3.5-2b) for natural-language facility queries with strict read-only guardrails
- Multi-tenant architecture targeting independent service stations and dealership hubs

---

## Key Results & Outcomes

- **PoC validated**: React dashboard successfully receives WebSocket signals with sub-500ms latency on database changes
- **Alert system validated**: Twilio WhatsApp integration successfully delivers notifications for vehicles exceeding 3-day dwell time; simulated via timestamp manipulation
- **Concurrency validated**: PostgreSQL handles simultaneous camera writes and dashboard reads without data locking or loss under stress tests
- **Target specs**: ≥98% vehicle detection accuracy, <10s event-to-dashboard latency, <30s LLM query response time

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | Python, JavaScript |
| Vision | YOLOv8, EasyOCR, custom CNN / template matching |
| LLM | Ollama (qwen3.5-2b), local inference |
| Backend | Node.js, ASGI/WebSockets |
| Frontend | React |
| Database | PostgreSQL (Track A), MariaDB (Track B) |
| Alerts | Twilio WhatsApp API |
| Hardware | Hikvision IP cameras, local edge workstation |
| Integration | Toyota SAP ERP API |
| Domain | Vehicle tracking, bay occupancy monitoring, ANPR |

---

## Media

<!-- ![[vrms-dashboard.png]] -->
<!-- ![[system-pipeline.png]] -->

---

## Notes & Context

- One of three concurrent industry projects at Takhleeq Office
- Industry partner: Indus Motor Company (IMC), Toyota's Pakistan affiliate
- Vehicles on the IMC repair floor have no license plates — magnetic tags used as proxy identifiers in Track A
- Track B pivots to ANPR for hardware-free commercial deployment
- Related: [[project-visual-fault-detection-dawlance]], [[project-6dof-robot-arm]]

---
