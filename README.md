# DP&C Governance Portal — Redesigned Static Website Prototype

This repository contains a **front-end-only redesigned prototype** for the Dragonpass DP&C Governance Portal. It is intended for user journey review, visual design refinement, and IT handoff before a production backend is implemented.

## What This Prototype Includes

The prototype redesign focuses on making the experience smoother, easier, and more logical. It separates the portal into two clear journeys: **Mode 1 — Initiate a Compliance Program** and **Mode 2 — Compliance Advice**. The dashboard gives users a simple starting point, while each workflow step has a timeline, responsible roles, required inputs, and approval areas.

| Area | Implemented in this static prototype |
|---|---|
| Requirement registration | Automatic date, generated reference ID, Interested Party assignment rules, initiator, collaborators, and source document upload controls |
| Assignment logic | Compliance Manager, Security Manager, Finance BP, and Budget Owner rules are simulated in JavaScript |
| Risk Assessment | Requirement summary, risk entry form, SLU scoring, risk list, and document metadata display |
| Risk Treatment Decision | Risk summary, treatment proposal, budget sections, and staged approval cards |
| Risk Treatment Plan | Final plan upload control, summary, next report date, and approval cards |
| Implementation Report | Report upload controls, updated plan controls, next report date, no-further-report option, and approval cards |
| Compliance Advice | Language-based Compliance Manager assignment and advice memorandum workflow |

## Important Static Prototype Limitations

This website is not a production system. It does **not** include a backend server, database, real authentication, real file storage, real email notification, or secure audit trail. Browser actions are simulated using JavaScript and local storage. Uploaded documents are not actually transmitted or stored; the interface only displays local file control behavior for design review.

## Preview Locally

Open `index.html` directly in a browser, or run a local static server from this folder:

```bash
python3 -m http.server 3100
```

Then open:

```text
http://localhost:3100
```

## Production IT Handoff Notes

For production, IT should implement persistent storage, authentication, role-based access control, file upload security, workflow audit logging, notification delivery, configurable assignment rules, and server-side enforcement of approval gates. The static files can be used as a UI reference or converted into the company's preferred frontend framework.
