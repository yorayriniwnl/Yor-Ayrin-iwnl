---
title: "What Yor Zenith Proves About Decision-Support Interfaces"
date: "2026-04-12"
tags: ["project-notes", "ux", "solar", "decision-support"]
excerpt: "Yor Zenith is strongest when it stays focused on rooftop feasibility, generation forecasting, subsidy logic, and 3D visualization."
readTime: "5 min read"
category: "Project Notes"
tone: "personal"
featured: false
---

## What the Project Is

Yor Zenith is a solar planning tool. It takes a rooftop — defined by coordinates, area, and orientation — and produces a feasibility report: estimated generation, subsidy eligibility, and a rough ROI calculation.

The 3D visualization component lets a user walk through the rooftop geometry before committing to any numbers. That interactivity is not decorative. It makes the feasibility data more legible by anchoring it to a physical space.

## Where It Gets the Interface Right

Decision-support tools succeed when they constrain the problem to something the tool is actually qualified to solve. Yor Zenith does this well in four areas:

**Rooftop feasibility.** The input is structured — area, pitch, cardinal direction — and the output is a confidence-bounded estimate. It does not pretend to account for every variable.

**Generation forecasting.** The forecasting model uses regional solar irradiance data and a degradation curve. The interface shows the range, not just the point estimate. Uncertainty is part of the output.

**Subsidy logic.** This is the most brittle part of any solar tool because subsidy rules change. The current implementation treats the subsidy table as a configuration file, not hard-coded logic. That separation makes it maintainable.

**3D visualization.** Three.js-backed geometry renders the roof in a way that matches the user's mental model of their own building. This reduces the cognitive load required to interpret the 2D data tables.

## What It Does Not Try to Do

Yor Zenith does not do structural engineering. It does not model shading from neighbouring buildings in real time. It does not connect to a supplier database for live equipment pricing.

These are deliberate omissions. A tool that tries to do everything in this domain either becomes a full enterprise platform or collapses under the weight of edge cases it can't handle reliably. The constraint is a feature.

## What the Project Demonstrates

The technical evidence here is specific: geospatial data processing, Three.js scene management, a financial modelling layer with configurable parameters, and a frontend that surfaces complex calculations without overwhelming the user.

That is a bounded claim. The project is what it is, and what it is is useful.
