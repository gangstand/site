# Graph Report - site  (2026-09-14)

## Corpus Check
- 186 files · ~136,833 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 7, .css 5)

## Summary
- 1113 nodes · 1388 edges · 104 communities (72 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a3c3b852`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Next.js
- Feature-Sliced Design (FSD) v2.1
- language/index.ts
- package.json
- canvas-viewport.tsx
- Layer Structure Reference
- TypeScript Configuration
- Issue tracker: GitHub
- Migration Guide
- Triage
- Open Graph Image
- Next.js Type Declarations
- teach/SKILL.md
- Process
- What You Must Do When Invoked
- Codebase Design
- During the session
- HTML Report Format
- template.sh
- Ask Matt
- Diagnosing Bugs
- Steps
- Test-Driven Development
- Process
- writing-for-agents/SKILL.md
- Cross-Import Resolution Patterns
- Authentication
- Steps
- wayfinder/SKILL.md
- openspec-explore/SKILL.md
- opsx-explore.md
- Migrate to Shoehorn
- Steps
- Scaffold Exercises
- to-spec/SKILL.md
- graphify reference: extra exports and benchmark
- nodes.ts
- Process
- <Questionnaire title>
- writing-shape/SKILL.md
- Process
- project.ts
- writing-beats/SKILL.md
- graphify reference: query, path, explain
- loop-me/SKILL.md
- Reference
- hitl-loop.template.sh
- GLOSSARY.md Format
- writing-fragments/SKILL.md
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- This is NOT the Next.js you know
- opencode.json
- graphify.js
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- block-dangerous-git.sh
- implement-spec/SKILL.md
- extraction-spec.md
- gangstand.tech
- State management: TanStack Query (React Query)
- api-routes/homelab-status/index.ts
- next
- connections.ts
- api/homelab-status/index.ts
- Decisions
- How to keep entities clean
- Decisions
- Asset Handling
- tech-logo/index.tsx
- homelab-canvas.tsx
- node-zone.tsx
- 2026-09-14-refactor/tasks.md
- migrate-frontend-to-fsd/tasks.md
- layout.ts
- Growth Walkthrough
- 2026-09-14-refactor/proposal.md
- migrate-frontend-to-fsd/proposal.md
- use-node-selection.ts
- connections-layer.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 24 edges
2. `react` - 22 edges
3. `compilerOptions` - 16 edges
4. `Lang` - 12 edges
5. `Layer Structure Reference` - 12 edges
6. `What You Must Do When Invoked` - 12 edges
7. `template.sh script` - 11 edges
8. `Feature-Sliced Design (FSD) v2.1` - 11 edges
9. `NodeId` - 10 edges
10. `Cross-Import Resolution Patterns` - 10 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getHomelabStatus()`  [EXTRACTED]
  app/api/homelab/status/route.ts → src/_app/api-routes/homelab-status/index.ts
- `getPreferences()` --calls--> `parseLang()`  [EXTRACTED]
  app/layout.tsx → src/shared/lib/language/locale.ts
- `ProjectDefinition` --references--> `Lang`  [EXTRACTED]
  src/_pages/home/model/project.ts → src/shared/lib/language/locale.ts
- `ConnectionsLayerProps` --references--> `NodeId`  [EXTRACTED]
  src/features/explore-homelab/ui/connections-layer.tsx → src/features/explore-homelab/model/nodes.ts
- `HomelabCanvas()` --calls--> `useNodeSelection()`  [EXTRACTED]
  src/features/explore-homelab/ui/homelab-canvas.tsx → src/features/explore-homelab/model/use-node-selection.ts

## Import Cycles
- None detected.

## Communities (104 total, 9 thin omitted)

### Community 0 - "Next.js"
Cohesion: 0.07
Nodes (29): App Router, Astro, Database access, Directory structure, Directory structure, Directory structure, Directory structure, Directory structure (+21 more)

### Community 1 - "Feature-Sliced Design (FSD) v2.1"
Cohesion: 0.07
Nodes (29): 10. Conditional references, 1. Core philosophy & layer overview, 2. Decision framework, 3. Quick placement table, 4-1. Import only from lower layers, 4-2. Public API: every slice exports through index.ts, 4-3. No cross-imports between slices on the same layer, 4-4. Domain-based file naming (no desegmentation) (+21 more)

### Community 2 - "language/index.ts"
Cohesion: 0.05
Nodes (57): generateMetadata(), getPreferences(), RootLayout(), react, AppProviders(), CopyEmail(), copyEmail(), CopyEmailProps (+49 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, geist, next, react, react-dom, simple-icons, devDependencies, steiger (+26 more)

### Community 5 - "canvas-viewport.tsx"
Cohesion: 0.17
Nodes (16): MOBILE_QUERY, CanvasControlLabels, canvasCopy, CanvasLabels, CanvasBounds, Transform, useCanvasTransform(), FullscreenDocument (+8 more)

### Community 6 - "Layer Structure Reference"
Cohesion: 0.09
Nodes (22): Anti-patterns, App layer, Domain-based file naming, Entities layer, Example: grouping payment-related entities, Features layer, Features: use with caution, Group by what it is *for*, not by what it *is* (+14 more)

### Community 7 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "Issue tracker: GitHub"
Cohesion: 0.06
Nodes (30): Before exploring, read these, Domain Docs, File structure, Flag ADR conflicts, Use the glossary's vocabulary, Conventions, Issue tracker: GitHub, Pull requests as a triage surface (+22 more)

### Community 9 - "Migration Guide"
Cohesion: 0.09
Nodes (21): Before you start, Common pitfalls during migration, Migrating from FSD v1 to v2, Migration Guide, Optional steps, Part 1: FSD v2.0 → v2.1 (non-breaking), Part 2: custom architecture → FSD, Phasing out a small widgets layer (optional) (+13 more)

### Community 10 - "Triage"
Cohesion: 0.06
Nodes (29): Bad agent brief, Behavioral, not procedural, Complete acceptance criteria, Durability over precision, Examples, Explicit scope boundaries, Good agent brief (bug), Good agent brief (enhancement) (+21 more)

### Community 11 - "Open Graph Image"
Cohesion: 0.33
Nodes (4): alt, contentType, dynamic, size

### Community 14 - "teach/SKILL.md"
Cohesion: 0.07
Nodes (25): Learning Record Format, Numbering, Optional sections, Supersession, Template, What does _not_ qualify, When to write a learning record, MISSION.md Format (+17 more)

### Community 15 - "Process"
Cohesion: 0.07
Nodes (25): 1. State the question, 2. Isolate the logic in a portable module, 3. Build the shareable HTML file, 4. Hand it over, 5. Capture the answer and the prototype, Anti-patterns, Logic Prototype, Process (+17 more)

### Community 16 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 17 - "Codebase Design"
Cohesion: 0.09
Nodes (21): 1. In-process, 2. Local-substitutable, 3. Remote but owned (Ports & Adapters), 4. True external (Mock), Deepening, Dependency categories, Seam discipline, Testing strategy: replace, don't layer (+13 more)

### Community 18 - "During the session"
Cohesion: 0.09
Nodes (19): ADR Format, Numbering, Optional sections, Template, What qualifies, When to offer an ADR, CONTEXT.md Format, Rules (+11 more)

### Community 19 - "HTML Report Format"
Cohesion: 0.10
Nodes (18): Call-graph collapse, Candidate card, Cross-section (good for layered shallowness), Diagram patterns, Hand-built boxes-and-arrows (when Mermaid's layout fights you), Header, HTML Report Format, Mass diagram (good for "interface as wide as implementation") (+10 more)

### Community 20 - "template.sh"
Cohesion: 0.23
Nodes (17): ask(), ask_secret(), banner(), _clear(), _existing(), finish(), note(), open_url() (+9 more)

### Community 21 - "Ask Matt"
Cohesion: 0.12
Nodes (14): Phase boundaries, Primary and secondary sources, The five options, The tree, These are judgement calls, Ask Matt, Codebase health, Context hygiene (+6 more)

### Community 22 - "Diagnosing Bugs"
Cohesion: 0.13
Nodes (14): Completion criterion: a tight loop that goes red, Diagnosing Bugs, Minimise, Non-deterministic bugs, Phase 1: Build a feedback loop, Phase 2: Reproduce + minimise, Phase 3: Hypothesise, Phase 4: Instrument (+6 more)

### Community 23 - "Steps"
Cohesion: 0.15
Nodes (12): 1. Detect package manager, 2. Install dependencies, 3. Initialize Husky, 4. Create `.husky/pre-commit`, 5. Create `.lintstagedrc`, 6. Create `.prettierrc` (if missing), 7. Verify, 8. Commit (+4 more)

### Community 24 - "Test-Driven Development"
Cohesion: 0.15
Nodes (10): Designing for Mockability, When to Mock, Anti-patterns, Rules of the loop, Seams: where tests go, Test-Driven Development, What a good test is, Bad Tests (+2 more)

### Community 25 - "Process"
Cohesion: 0.15
Nodes (12): 1. Gather context, 2. Explore the codebase (optional), 3. Draft vertical slices, 4. Quiz the user, 5. Publish the tickets to the configured tracker, Acceptance criteria, Blocked by, <NN>: <Ticket title> (+4 more)

### Community 26 - "writing-for-agents/SKILL.md"
Cohesion: 0.15
Nodes (11): Context pointers, Information hierarchy, Leading words, Invocation, Router skills, Skill mechanics, Splitting by invocation, Pruning (+3 more)

### Community 27 - "Cross-Import Resolution Patterns"
Cohesion: 0.10
Nodes (19): Anti-patterns, Basic composition (React), Cross-Import Resolution Patterns, Decision flow for AI agents, Entities layer: prefer boundary merge over @x, Features and widgets: four strategies, How @x works (when boundary merge is genuinely impossible), Render props (React) (+11 more)

### Community 28 - "Authentication"
Cohesion: 0.11
Nodes (18): API request handling, Auth data: `shared/auth/` or `shared/api/`, Auth UI: pages (single use) or features (multi-use), Authentication, Authentication, Types, and API Requests, Automatic logout, Basic pattern: API calls in the consuming slice, CRUD helpers in shared (+10 more)

### Community 29 - "Steps"
Cohesion: 0.17
Nodes (11): 1. Detect the environment, 2. Install dependency-cruiser, 3. Write the config, 4. Wire it into the checks, 5. Scaffold the example package, 6. Prove the rules bite, 7. Document the convention, Notes (+3 more)

### Community 30 - "wayfinder/SKILL.md"
Cohesion: 0.17
Nodes (11): Chart the map, Fog of war, Invocation, Out of scope, Plan, don't do, Refer by name, The Map, The map body (+3 more)

### Community 31 - "openspec-explore/SKILL.md"
Cohesion: 0.17
Nodes (11): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, Planning a Change, The Stance, What You Don't Have To Do (+3 more)

### Community 32 - "opsx-explore.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, Planning a Change, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 33 - "Migrate to Shoehorn"
Cohesion: 0.20
Nodes (9): `as Type` → `fromPartial()`, `as unknown as Type` → `fromAny()`, Install, Large objects with few needed properties, Migrate to Shoehorn, Migration patterns, When to use each, Why shoehorn? (+1 more)

### Community 34 - "Steps"
Cohesion: 0.22
Nodes (8): 1. Ask scope, 2. Copy the hook script, 3. Add hook to settings, 4. Ask about customization, 5. Verify, Setup Git Guardrails, Steps, What Gets Blocked

### Community 35 - "Scaffold Exercises"
Cohesion: 0.22
Nodes (8): Directory naming, Example: stubbing from a plan, Exercise variants, Lint rules summary, Moving/renaming exercises, Required files, Scaffold Exercises, Workflow

### Community 36 - "to-spec/SKILL.md"
Cohesion: 0.22
Nodes (8): Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Process, Solution, Testing Decisions, User Stories

### Community 37 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 38 - "nodes.ts"
Cohesion: 0.14
Nodes (14): scene, geometry, CardNode, ConnectionDeclaration, ConnectionKind, DisplayKind, EntityDeclaration, EntityIds (+6 more)

### Community 39 - "Process"
Cohesion: 0.25
Nodes (7): 1. Pin the fixed point, 2. Identify the spec source, 3. Identify the standards sources, 4. Spawn both sub-agents in parallel, 5. Aggregate, Process, Why two axes

### Community 40 - "<Questionnaire title>"
Cohesion: 0.25
Nodes (7): Anything else?, Context, Document structure, How to answer, <Questionnaire title>, <Theme heading>, What load is the system expected to handle at launch?

### Community 41 - "writing-shape/SKILL.md"
Cohesion: 0.25
Nodes (7): Conversational feel, Format arguments to actually have, Grounding, Out of scope, Pulling from the pile, The loop, Writing rhythm

### Community 42 - "Process"
Cohesion: 0.29
Nodes (6): 1. Scope the procedure, 2. Map each stage's journey, 3. Author the wizard, 4. Verify and hand off, Process, Wizard

### Community 43 - "project.ts"
Cohesion: 0.22
Nodes (10): esaul, homelab, projects, swapdog, swaprat, teamtasker, ProjectDefinition, ProjectDestination (+2 more)

### Community 44 - "writing-beats/SKILL.md"
Cohesion: 0.33
Nodes (5): Ending the journey, Grounding, Pulling from the pile, What is a beat, Writing rhythm

### Community 45 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 46 - "loop-me/SKILL.md"
Cohesion: 0.40
Nodes (4): Definition of done, The loop lens, The workspace, Vocabulary

### Community 47 - "Reference"
Cohesion: 0.40
Nodes (4): Files, Implementation vs Review, Reference, Steps

### Community 48 - "hitl-loop.template.sh"
Cohesion: 0.83
Nodes (3): capture(), hitl-loop.template.sh script, step()

### Community 49 - "GLOSSARY.md Format"
Cohesion: 0.50
Nodes (3): GLOSSARY.md Format, Rules, Structure

### Community 50 - "writing-fragments/SKILL.md"
Cohesion: 0.50
Nodes (3): File format, What is a fragment, Writing rhythm

### Community 51 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 52 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 53 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 83 - "gangstand.tech"
Cohesion: 0.50
Nodes (3): Architecture, Checks, gangstand.tech

### Community 84 - "State management: TanStack Query (React Query)"
Cohesion: 0.12
Nodes (16): Business-entity slice in entities, Code generation, Custom API client, Infinite scroll, Query factory pattern, QueryProvider in the app layer, Reading mutation state with useMutationState, Registering slices in app (+8 more)

### Community 85 - "api-routes/homelab-status/index.ts"
Cohesion: 0.24
Nodes (8): GET(), runtime, checkSite(), getHomelabStatus(), HOMELAB_PROBE_SITES, PROBE_CACHE_TTL_MS, HomelabStatusSnapshot, SiteStatus

### Community 86 - "next"
Cohesion: 0.14
Nodes (6): metadata, dynamic, dynamic, nextConfig, next, HomelabPage()

### Community 87 - "connections.ts"
Cohesion: 0.24
Nodes (14): centerBottom(), centerLeft(), centerRight(), projectScene(), route(), Box, Point, HomelabConnection (+6 more)

### Community 88 - "api/homelab-status/index.ts"
Cohesion: 0.23
Nodes (10): useSiteStatus(), SiteIndicator, siteStatusLabel(), SITE_STATUS_LABELS, SITE_URL_LABELS, HOMELAB_SITE_IDS, HomelabSiteId, parseHomelabStatus() (+2 more)

### Community 89 - "Decisions"
Cohesion: 0.14
Nodes (13): 1. Use `_app` and `_pages` for FSD layers, 2. Migrate route ownership before removing legacy layers, 3. Keep home-only composition in `_pages/home`, 4. Extract one focused `explore-homelab` feature, 5. Put the shared homelab transport contract in Shared API, 6. Enforce public APIs at established boundaries, 7. Preserve providers as Shared mechanisms composed by `_app`, 8. Add architecture checks after boundaries stabilize (+5 more)

### Community 90 - "How to keep entities clean"
Cohesion: 0.15
Nodes (12): 0. Consider having no entities layer, 1. Avoid preemptive slicing, 2. Avoid unnecessary entities, 3. Exclude CRUD operations from entities, 4. Store authentication data in shared, 5. Minimize cross-imports, Anti-patterns, Decision tree for AI agents (+4 more)

### Community 91 - "Decisions"
Cohesion: 0.15
Nodes (12): 1. Use a canonical, declarative Homelab topology, 2. Treat routed connections as a projection, not domain data, 3. Split status concerns while preserving the wire contract, 4. Keep project data serializable and compose renderers above the model, 5. Separate the locale contract from translation content, 6. Expose one composable infinite-canvas boundary, 7. Protect the refactor with invariants and characterization tests, Context (+4 more)

### Community 92 - "Asset Handling"
Cohesion: 0.18
Nodes (10): Anti-patterns, Asset Handling, Decision tree, Global assets, Non-UI assets, Public folder, See also, Shared assets (+2 more)

### Community 93 - "tech-logo/index.tsx"
Cohesion: 0.20
Nodes (8): hypervisor, vmCount, HypervisorSection, LogoDef, LOGOS, TechKey, TechLogo(), ZABBIX_LOGO

### Community 94 - "homelab-canvas.tsx"
Cohesion: 0.29
Nodes (8): layoutNodes, cardNodes, networkClientsCount, zoneNodes, View, VIEWS, Toolbar, ToolbarProps

### Community 95 - "node-zone.tsx"
Cohesion: 0.40
Nodes (8): LayoutNode, NodeId, ZoneNode, NodeCard, NodeCardProps, NodeZone, NodeZoneProps, HomelabStatus

### Community 96 - "2026-09-14-refactor/tasks.md"
Cohesion: 0.22
Nodes (8): 1. Refactoring Safety Net, 2. Locale And Copy Boundaries, 3. Project Module Boundary, 4. Canonical Homelab Topology, 5. Homelab Status Boundary, 6. Scene And Routing Boundary, 7. Infinite Canvas Boundary, 8. Integration And Cleanup

### Community 97 - "migrate-frontend-to-fsd/tasks.md"
Cohesion: 0.22
Nodes (8): 1. Establish Behavior Baseline, 2. Decouple Homelab Status Infrastructure, 3. Establish Route-Owned Pages, 4. Extract The Reusable Homelab Feature, 5. Consolidate Home-Only Responsibilities, 6. Normalize Public APIs, 7. Add Architecture Guardrails, 8. Final Regression Verification

### Community 98 - "layout.ts"
Cohesion: 0.28
Nodes (8): columns, dockerInnerColumns, entityIds, getLayoutNode(), getZoneLayoutNode(), layoutMetrics, layoutNodeById, HomelabCanvas()

### Community 99 - "Growth Walkthrough"
Cohesion: 0.29
Nodes (6): Growth Walkthrough, Snapshot 0: two pages, three layers, Snapshot 1: a third page reuses product data, no layer appears, Snapshot 2: a rule diverges, `entities/product` appears, Snapshot 3: an action is reused, `features/add-to-cart` appears, What the walkthrough shows

### Community 100 - "2026-09-14-refactor/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 101 - "migrate-frontend-to-fsd/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 102 - "use-node-selection.ts"
Cohesion: 0.38
Nodes (5): vitest, ConnectionId, HomelabSelection, nextSelection(), useNodeSelection()

### Community 103 - "connections-layer.tsx"
Cohesion: 0.38
Nodes (6): HomelabConnectionRoute, HomelabNode, ConnectionsLayer, ConnectionsLayerProps, DARK_COLORS, LIGHT_COLORS

## Knowledge Gaps
- **631 isolated node(s):** `block-dangerous-git.sh script`, `$schema`, `plugin`, `runtime`, `metadata` (+626 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 705 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `language/index.ts` to `package.json`, `canvas-viewport.tsx`, `use-node-selection.ts`, `connections-layer.tsx`, `api/homelab-status/index.ts`, `tech-logo/index.tsx`, `homelab-canvas.tsx`, `node-zone.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `language/index.ts`, `package.json`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `block-dangerous-git.sh script`, `$schema`, `plugin` to the rest of the system?**
  _631 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Next.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Feature-Sliced Design (FSD) v2.1` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `language/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05337078651685393 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._