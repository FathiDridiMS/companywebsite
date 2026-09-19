# Consultim-IT — Website

Static site: HTML5 + CSS3 + vanilla JavaScript. No build step, no dependencies.

## Run locally
    python -m http.server 8000
Open http://localhost:8000 — then hard-refresh (Ctrl+Shift+R) the first time.

Alternatives: `npx serve` · VS Code Live Server · `dotnet serve -p 8000`

## Pages (14)
    index.html               Homepage — isometric stack hero
    solutions.html           Solutions overview
    solution-ai.html         Enterprise AI, Agents, MCP & RAG
    solution-automation.html Business Process Automation
    solution-workplace.html  Microsoft 365 & Digital Workplace
    solution-ged.html        AI-Powered Document Management
    solution-security.html   Microsoft Security — 3 assessments + 7 workshops
    solution-apps.html       Custom Apps & Digital Commerce
    managed-services.html    Support Desk + Managed Services
    licensing.html           Microsoft Licensing
    engineering.html         AI-boosted engineering capacity
    case-studies.html        9 case studies, filterable + deep-linkable
    about.html               Company, values, FAQ
    contact.html             Discovery call form + RFP route

## Hero figure — how the no-overlap guarantee works
`.stackfig` is a CSS **grid with two separate columns**:

    grid-template-columns: minmax(0,1fr) minmax(150px,178px);
    ├─ column 1: .stackfig-art   → the SVG diagram, ZERO <text> nodes
    └─ column 2: .stackfig-keys  → the three labels, plain HTML <ul>

Because the labels occupy their own grid column and use no absolute
positioning, they physically cannot overlap the artwork at any viewport
width. Below 620px the grid collapses to one column and the labels move
underneath the diagram as a wrapping row — still a separate grid cell.

Label colour keys (3px bars) match the plate colours:
navy #2D3470 → AI · #6B72A8 → Apps · #C3C6DF → Foundation.

## Case study filtering
Solution pages deep-link to pre-filtered results:

    case-studies.html?domain=ai#legal-ai

main.js reads `?domain=`, filters, scrolls to #results and shows a banner.
Domains: ai (4) · ged (5) · workplace (3) · automation (6) · apps (3)

## Brand tokens (css/style.css :root)
    --navy       #2D3470   Logo top plate, headings, footer
    --primary    #42498C   Delft blue
    --primary-75 #6B72A8   Middle plate
    --primary-25 #C3C6DF   Bottom plate, borders
    --amber      #F2A03D   Accent — CTAs, highlights (~10% of page)

Footer uses a reversed white logo variant (navy plates were invisible there).

## No tables anywhere
The SLA priority grid and delivery-model grid are card layouts
(`.sla-grid`, `.model-card`) that stack cleanly on mobile.

## Before going live
1. Case studies are anonymised by sector/scale — swap in names where consent exists.
2. No headcount figure is published; reconcile 21 vs 40+ before adding one.
3. Wire both forms to Power Automate / Azure Function / form service
   (see `form[data-demo]` in js/main.js). Add spam control.
4. Favicon, OpenGraph images, analytics.
5. French translation — /fr/ path structure with hreflang.
