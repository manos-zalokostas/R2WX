# Introduction

![R2WX](assets/r2wx-mark.svg)

[**Read the full PDF**](R2WX-2024-An-Engineering-Exploration.pdf) · [**Explore the eight chapters**](chapters/01-repeated-knowledge.md)

## About this examination

This document presents the results of a structured investigation conducted between the author of R2WX and two artificial analytical agents, ChatGPT and Gemini, operating under deliberately different roles.

The investigation did not begin with the eight findings presented below.

Its first level established a defensible factual basis through author interrogation against original implementation material. Claims, recollections and intended behavior were repeatedly compared with concrete artifacts. Findings were progressively challenged, qualified, rejected where necessary, and documented when sufficient agreement between implementation evidence and author knowledge had been established.

A second level reopened that basis through a broader reconstruction of R2WX as a whole system.

Gemini was assigned the repository-facing role: blind excavation of the implementation, independent evidence gathering, and development of candidate interpretations from what could actually be found. ChatGPT occupied a deliberately resistant analytical position, repeatedly withholding broader interpretations when the available evidence did not yet justify them. The author supplied the implementation history, engineering intent and accumulated reasoning that source code alone could not recover, while also challenging interpretations that either overstated the artifact or stopped before apparently unrelated implementation decisions could be reconciled.

These roles were deliberately different. Their purpose was not agreement between three participants, but continued interrogation from positions with different access to the object being examined.

The investigation repeatedly reached conclusions that appeared sufficient and then continued when additional evidence changed, restricted, strengthened or reorganized them. The structure that eventually emerged—eight connected pressure points across the full stack—was therefore a result of the investigation rather than its starting framework.

The complete analytical model, its successive levels, assigned roles, evidence distinctions and representative prompts are documented separately in [Investigation Design →].

## What R2WX is

R2WX is a runnable personal full-stack R&D artifact from 2024.

It uses the familiar CRUD/REST application model as an experimental ground for examining recurring engineering pressures across a full-stack system: where application knowledge belongs, when repeated knowledge becomes repeated procedure, how reusable machinery accommodates specialization, which capabilities become exposed, how authority changes across boundaries, which layers should interpret transported data, and where consolidation should stop.

Its implementation crosses the complete application path: browser-facing Svelte/SvelteKit components and forms, a SvelteKit BFF, a NestJS core API, shared application schemes and reusable backend machinery, Prisma persistence, MySQL and filesystem storage, composed as a runnable Docker environment.

CRUD is therefore not the research question of R2WX. It provides a deliberately familiar operational environment in which these questions can be exercised together.

## What the investigation found

The examination produced eight connected findings.

**1. Shared knowledge can reduce repeated implementation without requiring every consumer to surrender its own responsibility.**

R2WX allows common application definitions to be consumed across frontend and backend machinery while keeping decisions that belong specifically to those consumers local.

In practice: a field constraint does not need to be independently rediscovered and reimplemented everywhere it is required, while the frontend can still use that knowledge to construct interaction and the backend can independently use it to determine acceptance.

**2. Sharing knowledge and sharing ownership are different decisions.**

The same structural knowledge can serve several parts of the application without collapsing their distinct concerns into one universal configuration.

In practice: frontend representation information and backend routing/API information remain separately owned even where both operate around the same entity definition.

**3. Once recurring knowledge produces recurring work, the procedure itself can become shared infrastructure.**

R2WX does not stop at consolidating definitions. Repeated operations that can legitimately follow those definitions are moved into reusable machinery.

In practice: entities do not require independent implementations of the same validation and standard CRUD procedures every time another entity is introduced.

**4. Shared procedure does not require exceptional behavior to remain inside the generic path.**

R2WX provides common lifecycle machinery while retaining explicit points at which an application can compose with, depart from, or replace generic behavior.

In practice: a specialized submission or service operation can perform application-specific work without requiring the common form, request or persistence lifecycle to be rebuilt around it.

**5. Reusable capability and exposed capability are separate decisions.**

Infrastructure may know how to perform an operation without every consumer of that infrastructure automatically making the operation available.

In practice: inheriting a controller that contains standard CRUD capabilities does not by itself publish all of those endpoints. Exposure is explicitly admitted by the entity configuration and enforced at the receiving boundary.

**6. One request does not require one identity to remain authoritative across every boundary it crosses.**

R2WX separates the human authorization domain from the internal service authorization domain.

In practice: the BFF evaluates the human session and role, while the core API receives and authorizes a distinct service identity for the internal crossing. Human identity does not simply propagate through the entire request path as the core service credential.

**7. Transporting data across a boundary does not necessarily make that boundary responsible for interpreting it.**

Intermediate infrastructure can preserve a payload's passage without acquiring ownership of its application meaning.

In practice: multipart uploads can pass through the SvelteKit BFF as an unparsed request stream rather than being parsed into files and fields there and reconstructed before being sent to the NestJS API.

**8. Consolidation can stop deliberately where independent authority still matters.**

R2WX does not attempt to make its application schemes the sole authority over the entire stack. Persistence retains an independently maintained model and its own final constraints.

In practice: application schemes govern behavior within their runtime jurisdiction, but data that reaches persistence must still satisfy the Prisma/database model. Repetition at that boundary is accepted where eliminating it would also eliminate independently owned persistence authority.

## What those findings mean operationally

For an entity that remains within the shared path, the standard CRUD lifecycle can be brought into operation primarily through setup rather than repeated implementation.

That distinction matters.

R2WX does not generate an application or eliminate entity instantiation. Entities still require their appropriate schemes, configuration, routes, wiring and application-specific decisions. What changes is how much recurring behavior must be independently implemented after that setup exists.

The working design heuristic behind the artifact is approximately 75/25: for a conventional application whose requirements largely fit the shared lifecycle, roughly 75% of recurring behavior is expected to remain within shared infrastructure, leaving roughly 25% as application-specific implementation and extension.

The ratio is not a measured constant. Increasing specialization naturally changes it.

Nor is the 25% treated as code that must live permanently outside the shared system. Application-specific procedure can leave the generic path where necessary, perform the work that makes it exceptional, and—where the receiving contract permits—rejoin shared machinery before reaching the next enforced boundary.

The objective is therefore not complete automation.

It is to allow recurring knowledge and procedure to become infrastructure without making that infrastructure a prison for the behavior that does not recur.

## Eight pressure points

The examination follows the artifact through eight places where these decisions become visible.

**01 — Repeated knowledge**

A single application change begins requiring corresponding changes across multiple layers.

→ When One Change Started Requiring Too Many Changes

**02 — Shared knowledge, different responsibilities**

Consolidating common definitions begins to blur decisions that still belong to different consumers.

→ When Sharing Knowledge Started Blurring Ownership

**03 — Repeated procedure**

Once common knowledge has been established, the same operational work begins appearing around it.

→ When Shared Knowledge Started Repeating the Same Work

**04 — Specialization pressure**

Generic machinery works until an application legitimately needs behavior that does not fit its preferred path.

→ When Automation Started Fighting the Application

**05 — Capability exposure**

Reusable infrastructure accumulates operations that an individual consumer may not intend to expose.

→ When Inheritance Started Giving Too Much

**06 — Authority crossing**

A request originating from a human crosses an application boundary into another authorization domain.

→ When One User Request Became Two Different Identities

**07 — Boundary ownership**

An intermediate layer must transport increasingly varied data without necessarily becoming responsible for understanding it.

→ When the Boundary Started Doing Too Much Work

**08 — Persistence authority**

A system that has repeatedly consolidated knowledge and procedure reaches a boundary where another representation still claims independent authority.

→ When Consolidation Stopped at Persistence

The examination begins with the smallest-looking pressure of the eight:

one field changes—and several parts of the application suddenly need to know.
