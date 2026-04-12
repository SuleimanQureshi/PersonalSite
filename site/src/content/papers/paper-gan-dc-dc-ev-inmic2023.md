---
title: Effects of Parasitic Elements in High Frequency GaN-based DC-DC Converters for Electric Vehicle Applications
type: paper
status: published
date: "2023"
tags:
  - power-electronics
  - GaN
  - DC-DC-converter
  - electric-vehicles
  - parasitic-elements
---

# Effects of Parasitic Elements in High Frequency GaN-based DC-DC Converters for Electric Vehicle Applications

> Analysis of how parasitic inductances and capacitances affect the performance of high-frequency GaN transistor-based DC-DC converters in EV power systems.

![Status](https://img.shields.io/badge/status-published-brightgreen)

---

## At a Glance

| | |
|---|---|
| **Type** | Conference Paper |
| **Status** | Published |
| **Venue** | INMIC 2023 |
| **Date** | 2023 |
| **Role** | Author |
| **Publisher** | IEEE |
| **ISBN** | 978-8-3503-1770-1 |

---

## Links

- [ ] Paper PDF — [PDF](url)
- [ ] DOI — [10.XXXX/XXXXX](url)
- [ ] Conference Page — [INMIC 2023](url)

---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Habib University | Author |
| Ali Asghar Kerai | Habib University | Author |
| Syeda Ailiya Fatima | Habib University | Author |
| Syed Jahania Shah | Habib University | Author |
| Khuzaima Ali Khan | Habib University | Author |
| Lakshman Maheshwari | Habib University | Author |
| Ahsan Ali | Habib University | Supervisor / Author |
| Ishtiyaq Makda | Habib University | Supervisor / Author |
| Ahmad Usman | Habib University | Supervisor / Author |

<!-- ![[logo-habib-university.png]] -->

---

## Abstract

> *This paper analyzes half-bridge DC-DC buck converter topology operating in buck mode using Gallium Nitride (GaN) transistors for Electric Vehicles (EVs) application. The LTspice-based simulation model is developed for the buck converter with parasitic elements to evaluate performance efficiency for varying load. The impact of parasitic passives (resistance, inductance, and capacitance) such as ringing by parasitic inductance on GaN transistor operation are also explored. Effects on performance efficiency has been carried out with and without including the parasitic elements in the simulations to evaluate the importance of modeling with parasitics. Performance efficiency evaluation results are also bench-marked against the results of the EPC 9162 demonstration board working as a bi-directional buck converter.*

---

## Plain English Summary

GaN transistors can switch much faster than silicon, making them attractive for compact EV chargers and power converters. But at high switching frequencies, stray inductances and capacitances in the circuit board layout start to matter — they cause unwanted ringing, losses, and potential reliability issues. This paper characterizes how these parasitic effects manifest in a GaN-based DC-DC converter design relevant to EV applications, and benchmarks simulation results against a real industrial demo board (EPC9162).

---

## Problem

As switching frequencies increase in GaN-based power converters, parasitic circuit elements (PCB trace inductances, package capacitances) that are negligible at lower frequencies become significant performance and reliability limiters. Specifically: parasitic inductance causes voltage overshoot and ringing that can stress or destroy GaN transistors, and omitting parasitics from simulation produces unrealistically optimistic efficiency results (~99%) that do not reflect real hardware behaviour. Quantifying these effects is essential for robust EV power system design.

---

## Approach / Methodology

- Half-bridge DC-DC buck converter designed for a 48V to 12V EV auxiliary power application (e.g. power windows, power steering), switching at 500 kHz using EPC2052 GaN HEMTs
- LTspice simulation model developed including both visible parasitics (LCSI, LG, LD, LLoop) and hidden parasitics (skin/proximity effect modeled as parallel resistance; ESR on inductor and output capacitor)
- GaN transistor modeled using EPC's official SPICE model (EPC2052), capturing nonlinear CGS, CGD, CDS, and parasitic resistances RD, RS, RG
- Parasitic effects studied separately on the power loop and gate loop, and for common source inductance (CSI) which couples both loops
- Efficiency simulated with and without parasitics, then validated against the EPC9162 demonstration board datasheet efficiency curve

---

## Circuit Specifications

| Parameter | Symbol | Value |
|---|---|---|
| Input Voltage | Vi | 48 V |
| Output Voltage | Vo | 12 V |
| Switching Frequency | fsw | 500 kHz |
| Buck Inductor | Lbuck | 1.8 uH |
| Output Capacitor | Co | 128.2 uF |
| Switching Device | -- | EPC2052 (GaN HEMT) |

---

## Parasitic Elements Modeled

### Visible Parasitics

| Symbol | Element | Source |
|---|---|---|
| LCSI | Common Source Inductance | GaN transistor packaging |
| LG | Gate Inductance | Transistor packaging + gate loop PCB trace |
| LD | Drain Inductance | Transistor packaging |
| LLoop | Power Loop Inductance | PCB power loop trace |

### Hidden Parasitics

| Effect | Modeling Approach |
|---|---|
| Skin effect & Proximity effect | Parallel resistance across parasitic inductances |
| ESR (buck inductor & output capacitor) | Series resistance across components |

---

## Key Results & Outcomes

**Power Loop:** High LLoop inductance causes voltage overshoot of 150% on the high-side GaN transistor VDS, exceeding its 100V maximum rating (device nominally receives ~48V). Careful PCB layout reducing LLoop keeps the device within safe limits. Higher LLoop oppositely affects turn-on and turn-off switching losses, with negligible net change in overall loss.

**Gate Loop:** High LG inductance produces unwanted overshoot and ringing on the gate voltage, risking false turn-on or device breakdown. GaN transistors require gate overshoot to remain below 20%. Reducing parasitic inductance is preferred over increasing driver resistance, as the latter increases switching losses. The EPC9162 benchmark board uses the uP1966E driver with asymmetric resistances: 0.7 ohm pull-up (slower turn-on, less overshoot) and 0.4 ohm pull-down (faster turn-off, some negative ringing).

**Common Source Inductance (CSI):** CSI is the most critical parasitic because it simultaneously degrades both the power loop and gate loop. It generates a V = L * di/dt noise voltage that corrupts both the DC bus and gate drive signal, potentially causing false triggering or permanent device damage.

**Efficiency:** Simulation without parasitics yielded ~99% efficiency — physically unrealistic. Including parasitics produced a realistic efficiency curve that closely matched EPC9162 datasheet measurements across a 15 W to 60 W output power range, validating the parasitic model.

---

## Tech Stack

| Category | Tools / Hardware |
|---|---|
| Simulation | LTspice |
| Device Model | EPC2052 SPICE model (Efficient Power Conversion Corp.) |
| Benchmark Hardware | EPC9162 bidirectional buck converter demo board |
| Gate Driver (benchmark) | uP1966E |

---

## Media

<!-- ![[converter-schematic.png]] -->
<!-- ![[waveform-comparison.png]] -->

---

## Notes & Context

- Presented at INMIC 2023 (International Multi-Topic Conference), 2023 IEEE
- Funded by Habib University's Summer Tehqiq Research Program (STRP)
- Future work proposed: comparison across different wide-bandgap switching devices with parasitics; hardware implementation for experimental validation

---
