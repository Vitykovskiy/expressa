# Product Vision

This document captures intake-level product context. It is an input to `analysis`, not an implementation specification.

## Problem

Expressa addresses friction in the pickup-order flow for a cafeteria bar. Customers should be able to choose items, configure drinks, select a pickup slot, and place an order without queueing at the counter or waiting for a cashier-driven interaction.

The operational side has a related problem: baristas and administrators need a single predictable workflow for order handling, temporary availability changes, menu management, and user access control. Without a unified tool, order processing becomes inconsistent, status communication is delayed, and operational settings are hard to control.

## Value Proposition

State the business value created if the problem is solved.

- Primary business outcome: customers can place pickup orders quickly through a Telegram-native mobile flow with minimal friction.
- Secondary business outcome: baristas and administrators receive a controllable backoffice tool for orders, menu management, availability management, and role-based access.
- Why now: the product is being established as a maintainable monorepo with explicit architecture, transparent deployment, and canonical documentation before implementation accelerates.

## Target Users

- Primary users: cafeteria customers placing pickup orders through the customer Telegram bot web app.
- Secondary users: baristas processing orders in the backoffice Telegram bot web app.
- Internal stakeholders: administrators managing menu, pricing, operating hours, slot capacity, barista assignments, and user blocking.

## High-Level Use Cases

1. Customer opens the Telegram web app, browses the menu, configures a drink, adds items to the cart, selects a pickup slot, and creates an order.
2. Barista opens the backoffice web app, reviews incoming orders, confirms or rejects them, marks orders ready, closes them after pickup, and manages temporary availability.
3. Administrator uses the same backoffice to manage menu structure, prices, operating hours, slot capacity, barista assignments, and blocked users.

## Constraints

- Budget: not specified at intake.
- Timeline: MVP-oriented v1 scope with explicit out-of-scope limits.
- Compliance or regulatory constraints: no special regulatory constraints were defined at intake.
- Technical or operational constraints: Telegram is the mandatory access channel, backend must use NestJS, frontend must use Vue 3 and Vuetify, the system must live in a monorepo, and push-based VPS environments with smoke and e2e checks are required.

## Success Criteria

- Quantitative success signal: customer, barista, and administrator core flows work end-to-end; slot logic supports 10-minute intervals with default capacity 5; menu model supports sizes, addon groups, free addons, and mutually exclusive options.
- Qualitative success signal: architecture remains modular and maintainable, deployment is transparent, and repository documentation is sufficient to continue work without hidden session context.
- Review cadence: refine during analysis and track through issue-driven delivery and acceptance.
