---
title: Development of a DC-DC Converter Based Nanogrid Platform
type: paper
status: published
date: "2023"
tags:
  - power-electronics
  - DC-DC-converter
  - nanogrid
  - energy-systems
  - embedded-systems
---

# Development of a DC-DC Converter Based Nanogrid Platform

> Design and implementation of a DC-DC converter platform for nanogrid energy management applications targeting rural electrification in Pakistan.

![Status](https://img.shields.io/badge/status-published-brightgreen)

---

## At a Glance

| | |
|---|---|
| **Type** | Conference / Symposium Paper |
| **Status** | Presented |
| **Venue** | DURS 2023 (Dhanani Undergraduate Research Symposium) |
| **Date** | 2023 |
| **Role** | Author |

---

## Links

- [ ] Paper PDF — [PDF](url)
- [ ] Slides — [link](url)
- [ ] Symposium Page — [DURS 2023](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Habib University (EE) | Author |
| Lakshman Maheshwari | Habib University (EE) | Author |
| Dr. Ahmad Usman | Habib University (ECE) | Advisor |

---

## Abstract

Rural areas in Pakistan lack access to clean energy and are disconnected from the national electricity grid. This paper presents a DC-DC converter based nanogrid platform designed to make electrical energy accessible for rural households using solar photovoltaic sources. The system architecture includes a solar panel, DC-DC converter, bi-directional DC-DC converter for energy storage, and a DC/AC converter for local AC loads. The study determines optimal solar panel tilt angles for each season using irradiation and geographic data, and validates the design by mapping energy supply against household energy demand.

---

## Plain English Summary

A nanogrid is a small, local power network — like a mini electrical grid for a building or lab — that can operate independently or connect to the main grid. This project built a DC-DC converter platform to manage power flow within such a system, specifically targeting rural communities in Pakistan that have no access to the electricity grid. The team calculated the best angle to tilt solar panels in each season to harvest maximum energy, then verified the system could meet a typical household's energy needs.

---

## Problem

Rural areas in Pakistan do not have access to clean energy to fulfil their needs and are not connected to the electricity grid. Existing literature shows experiments of solutions but does not provide a clear and complete blueprint to fix this issue. Key drivers include:

- Expanding the grid is expensive and unlikely in the near term
- Kerosene lamps (the current alternative) are polluting and dangerous
- Pakistan has an energy deficit and imported ~$12.9 billion in energy in 2020–2021
- Pakistan's solar potential is estimated at ~50,000 MW from solar energy alone

---

## Approach / Methodology

**System Architecture**
- Solar panel → diode → DC-DC converter → DC bus
- Bi-directional DC-DC converter for energy storage integration
- DC/AC converter stage for local AC loads

**Solar Angle & Panel Sizing**
- Collected data spanning over one year at hourly intervals: horizontal irradiation, normal irradiation, temperature, latitude, and longitude
- Determined maximum power density on the surface of the solar panels
- Determined the optimal tilt angle for every season
- Matched the solar panel size to the energy demand of a rural household

---

## Key Results & Outcomes

**Optimal Solar Panel Tilt Angles by Season**

| Season | Months | Optimal Angle |
|---|---|---|
| Winter | December – February | 60° |
| Spring | March – May | 45° |
| Summer | June – August | 35° |
| Autumn | September – November | 50° |

- Determined the best optimal tilt angle for every season to maximise energy harvest
- Utilised those angles to achieve the maximum supply of energy
- Mapped the energy supplied against the expected energy drawn by the load
- Peak PV array output on an average summer day reaches ~700 W

---

## Limitations

- Short summer research engagement; ongoing research is needed to ascertain the correct final size of the solar panel
- Further validation required across additional geographic locations and load profiles

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | C/C++, MATLAB |
| Simulation | Simulink |
| Hardware | Custom DC-DC converter PCB, embedded microcontroller |
| Embedded | Arduino / TivaC |
| Data | Irradiation & temperature datasets (hourly, 1-year span) |

---

## Media

<!-- ![[DC-DC_Converter_1_.png]] -->
<!-- ![[converter-pcb.png]] -->

---

## Notes & Context

- Part of Summer Tehqiq research program, power electronics track
- Presented at Habib University's Dhanani Undergraduate Research Symposium (DURS 2023)

---
