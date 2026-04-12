---
title: "Renewable Energy and Maximum Power Point Tracking (MPPT)"
type: paper
status: completed
date: 2022-11-01
tags:
  - renewable-energy
  - solar-energy
  - MPPT
  - perturb-and-observe
  - photovoltaic
  - DC-DC-converter
  - simulink
---

# Renewable Energy and Maximum Power Point Tracking (MPPT)

> A two-part literature and simulation study reviewing solar and wind energy fundamentals, then modelling and characterising the Perturb & Observe MPPT algorithm on a PV-Boost converter system in MATLAB/Simulink.

![Status](https://img.shields.io/badge/status-completed-green)

---

## At a Glance

| | |
|---|---|
| **Type** | Course Research Study (2-part) |
| **Status** | Completed |
| **Venue** | EE 331 L1 — Electrical Machines, Habib University (Fall 2022) |
| **Date** | September – November 2022 |
| **Role** | Sole author |


---

## Collaborators

| Name | Affiliation | Role |
|---|---|---|
| Muhammad Suleiman Qureshi | Habib University (EE 2024) | Sole Author |

<!-- ![[logo-habib-university.png]] -->

---

## Abstract

> *Part 1 — This study reviews the motivation and context for renewable energy adoption, focusing on solar and wind energy as the most promising sources. It examines the variability of power output from photovoltaic (PV) arrays and wind turbines under changing environmental conditions, and motivates the need for Maximum Power Point Tracking (MPPT) algorithms to maximise energy extraction from these sources.*

> *Part 2 — This case study focuses on extracting maximum power from Photovoltaic (PV) cells using the Perturb & Observe (P&O) MPPT algorithm. A PV generator (SunPower SPR-305E-WHT-D), a DC-DC Boost converter, and a P&O controller are modelled and simulated in MATLAB Simulink. The effects of varying the perturbation step size (dD) on extraction efficiency and steady-state oscillations are characterised under both varying and constant irradiation/temperature conditions.*

---

## Plain English Summary

Solar panels don't always produce power at their theoretical maximum — temperature and sunlight intensity constantly shift the optimal operating point. MPPT algorithms continuously adjust the converter's duty cycle to chase this moving target and squeeze out as much energy as possible. This study first reviews why renewable energy sources are inherently variable, then builds and simulates one of the most common MPPT approaches — Perturb & Observe — in MATLAB to understand how its tuning parameter (step size) affects both efficiency and stability.

---

## Problem

Renewable energy sources such as solar PV and wind turbines do not deliver a steady output. For PV systems, both irradiance and temperature shift the I-V and P-V characteristic curves, meaning the voltage at which maximum power is delivered changes constantly. Without a mechanism to track this Maximum Power Point (MPP), significant harvestable energy is left on the table. The question examined in Part 2 is specifically: how does the perturbation step size (dD) in the P&O algorithm trade off between tracking speed/accuracy and steady-state oscillation magnitude — and what are the practical consequences of getting this wrong?

---

## Approach / Methodology

**Part 1 — Literature Review:**
- Surveyed global trends in renewable energy investment and production share, drawing on World Bank data and REN21 2022 Global Status Report.
- Reviewed operating principles, advantages, and limitations of solar PV and wind turbine systems.
- Introduced the concept of the shifting Maximum Power Point under varying irradiance and temperature, motivating the MPPT problem.

**Part 2 — Simulation Study:**
- Modelled a full PV-MPPT system in MATLAB Simulink comprising: a PV Generator (PVG) built from the single-cell equivalent circuit model (photocurrent source, diode, series and shunt resistances), a DC-DC Boost Converter (C = 12 mF, L = 5 mF, f_sw = 5 kHz), and a P&O MPPT controller adjusting duty cycle D by ±dD each iteration.
- PV module used: SunPower SPR-305E-WHT-D (P_max = 190 W, V_mpp = 54.7 V, I_mpp = 5.58 A, V_oc = 64.2 V, I_sc = 5.96 A), configured as 5 series modules × 66 parallel strings.
- P&O logic: at each step, compute dP = P_pv − P_pre and dV = V_pv − V_pre. If dP > 0 and dV > 0, increment D; if dP > 0 and dV < 0, decrement D; and so on across all four quadrants.
- Two input scenarios tested: (1) varying irradiation and temperature, (2) constant irradiation and temperature.
- dD swept across 0.001 and 0.1 to characterise the speed–stability trade-off.

---

## Key Results & Outcomes

- Under both input conditions, the P&O algorithm achieved very high extraction efficiency regardless of dD value: 99.57% efficiency under varying irradiation/temperature (avg. max. power 45.94 kW, extracted 45.75 kW), and 99.54% under constant conditions (avg. max. 88.45 kW, extracted 88.04 kW).
- Aggregate efficiency metrics were insensitive to dD at the two values tested; however, time-domain waveforms revealed a clear qualitative difference: dD = 0.1 produced significantly higher overshoot and larger steady-state oscillations compared to dD = 0.001.
- These oscillations are practically significant — sustained high-amplitude oscillations around the MPP can stress or damage downstream electrical components and loads.
- The conventional P&O algorithm has two known failure modes identified in the literature: (1) persistent steady-state oscillation even at the correct MPP under stable conditions, and (2) incorrect tracking direction under rapidly changing irradiance (the algorithm cannot distinguish a power change caused by perturbation from one caused by a weather transient).
- Proposed improvements from literature include: adaptive dD that scales with how far the operating point is from the MPP, incorporating manufacturer datasheet parameters into the algorithm, and comparing the current operating point against more than two historical states.

---

## Tech Stack

| Category | Tools / Hardware |
|---|---|
| Simulation | MATLAB / Simulink (Simscape Power Systems) |
| PV Module Model | SunPower SPR-305E-WHT-D equivalent circuit (single-diode model) |
| Converter Topology | DC-DC Boost Converter (C = 12 mF, L = 5 mF, f_sw = 5 kHz) |
| MPPT Algorithm | Perturb & Observe (P&O), duty-cycle perturbation |
| Programming | MATLAB scripting; Stateflow for P&O logic |

---

## Circuit / System Specifications

| Parameter | Value |
|---|---|
| PV Module | SunPower SPR-305E-WHT-D |
| Array Configuration | 5 series modules × 66 parallel strings |
| Maximum Power (module) | 190 W |
| Voltage at MPP | 54.7 V |
| Current at MPP | 5.58 A |
| Open Circuit Voltage | 64.2 V |
| Short Circuit Current | 5.96 A |
| Boost Converter Capacitance | 12 mF |
| Boost Converter Inductance | 5 mF |
| Switching Frequency | 5 kHz |
| Perturbation Step dD (tested) | 0.001, 0.1 |

---

## Media

<!-- ![[pv-system-diagram.png]] -->
<!-- *Caption: System block diagram — PVG → DC-DC Boost Converter → R load, with P&O MPPT controlling duty cycle K* -->

<!-- ![[pv-cell-circuit.png]] -->
<!-- *Caption: Single-diode equivalent circuit of a PV cell (I_ph, diode D, R_s, R_sh)* -->

<!-- ![[po-algorithm-flowchart.png]] -->
<!-- *Caption: Stateflow chart of the Perturb & Observe algorithm showing the four dP/dV quadrant decisions* -->

<!-- ![[simulink-model.png]] -->
<!-- *Caption: Full Simulink model showing PVG block, Boost converter, MPPT controller, and measurement blocks* -->

<!-- ![[oscillation-comparison.png]] -->
<!-- *Caption: Time-domain comparison of dD = 0.1 (high oscillation) vs dD = 0.001 (low oscillation) at steady state* -->

---

## Notes & Context

- Two-part study for EE 331 (Electrical Machines) at Habib University. Part 1 (September 2022) is the "What" — a literature review establishing the motivation for MPPT. Part 2 (November 2022) is the "How" — the simulation implementation and parameter study.
- The 99.5%+ simulation efficiencies are ideal-case results; real hardware would be lower due to converter component losses, switching dead-time, and sensor noise in the feedback path — a limitation not explicitly addressed in the study.
- The finding that aggregate efficiency is insensitive to dD (at these two values) but waveform quality is not is an important practical nuance: efficiency metrics alone are insufficient to evaluate MPPT controller tuning.
- Natural follow-on work would be implementing an adaptive dD variant (e.g. from Ahmed & Salam 2015 or 2018) and comparing its transient and steady-state performance against the fixed-step baseline in the same Simulink model.
- The connection between this work and the GaN DC-DC converter paper (INMIC 2023) is worth noting: MPPT controllers rely on fast, efficient DC-DC converters, and the parasitic effects characterised in that paper are directly relevant to achieving the near-ideal efficiencies assumed here.

---
