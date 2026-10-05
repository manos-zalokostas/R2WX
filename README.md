# R2WX

**Personal full-stack R&D infrastructure for schema-driven REST/CRUD
entity management**

R2WX is a Docker-composed full-stack infrastructure built around Svelte
5/SvelteKit, NestJS, Prisma and MySQL. It explores a specific
engineering problem: how much recurring work in a REST/CRUD application
can be absorbed by shared infrastructure when the application stops
re-declaring the same knowledge independently at every layer.

Its focus is deliberately narrow. R2WX is not presented as a prescribed
architecture, a framework others are expected to adopt, or a catalogue
of every engineering practice available to its author. It is published
to make a piece of engineering work transparent and inspectable.

R2WX uses established technologies in intentionally unorthodox ways.
Familiarity with SvelteKit, NestJS, Prisma or conventional CRUD
organization is useful context, but it is not a substitute for tracing
R2WX's own cross-end contracts and responsibility boundaries.

The repository concentrates on a complete cross-end flow: shared entity
semantics, runtime-specific configuration, form realization, CRUD
lifecycle, validation, JSON and multipart transport, file handling,
controller/service behavior and persistence.

Here, **schema-driven** refers to shared application schemes that carry
recurring entity semantics for multiple runtime consumers. It does not
imply code generation or a universal schema that governs every
subsystem; persistence retains its own authority through Prisma and
MySQL.

The central idea is simple:

> **Declare recurring application knowledge once within its proper
> jurisdiction, let each runtime interpret it for its own
> responsibilities, and keep explicit intervention points where the
> generic road stops fitting.**

------------------------------------------------------------------------

## The system in one view

``` text
                           [ @r2wx/modules ]
                         Shared Scheme Factories
                                  │
                 canonical application semantics
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
        [ front/.../ctx.js ]              [ back/.../config.ts ]
        Frontend Orchestrator              Backend Orchestrator
                 │                                 │
                 │                                 ├── API/path/access configuration
                 │                                 │
                 ▼                                 ▼
        [ packEntityForm ]                 [ BaseController ]
     scheme + literals + data          configured CRUD / endpoint machinery
       + runtime DB options                     │
                 │                              ├───────────────┐
                 ▼                              │               │
      [ R2wxFieldsetInput ]                     ▼               ▼
   native HTML input semantics        [ Multipart Ingestion ] [ Validation.ts ]
         <Tag {...entity}>             scheme-derived Multer    strict / loose
                 │                       fileSize limits         validation
                 ▼                              │               │
      [ FORM State Machine ]                    └───────┬───────┘
     ADD / READ / EDIT / DEL                            │
  field state / actions / modal                        ▼
       / HTTP verb dispatch                    [ BaseService ]
                 │                                     │
                 ▼                                     ▼
    [ Form Payload Resolution ]                   [ Prisma ]
      JSON or FormData                                  │
       │        │                                       ▼
       │        └── bounded override               [ MySQL ]
       │             via $action.submit()       Independent Persistence
       ▼                                              Authority
      [ SvelteKit BFF ]
 human auth/session boundary
 multipart stream passthrough
       │
       │ trusted service boundary
       └──────────────────────────────► [ NestJS Core API ]
```

The diagram is intentionally asymmetric. The frontend and backend share
application knowledge; they do not share the same responsibilities.

`ctx.js` and `config.ts` are the dominant runtime-specific configuration
structures. Concrete resident instances can be inspected in frontend
entity routes such as `front/src/routes/[[lang]]/entities/sam/ctx.js` and
backend routes such as `back/src/routes/sam/config.ts`. Each consumes the
shared scheme and adds information belonging to its own runtime. On the
frontend that knowledge participates in representation and interaction.
On the backend it participates in endpoint exposure, authorization,
validation, ingestion and persistence flow.

**Shared knowledge does not require identical runtimes.**

------------------------------------------------------------------------

## What R2WX consolidates

An entity scheme carries recurring application semantics such as field
identity and input-oriented type information, requiredness and scalar
constraints, defaults, file acceptance and size rules, and values needed
by form and validation machinery. Canonical resident scheme factories
live under `modules/src/schemes/`; for example,
`modules/src/schemes/sam/index.js` exposes `samScheme()`.

That information is consumed differently across the stack. On the
frontend, it helps materialize forms, native HTML constraints and
runtime representations. On the backend, it feeds validation and can
directly influence infrastructure behavior such as multipart ingestion
limits.

The scheme is therefore not merely a form definition and not merely a
backend validation object. It is shared application knowledge
interpreted by two different runtimes.

This is a **scoped single source of truth**. It does not attempt to own
every kind of knowledge in the system. Presentation, routing, access
policy, runtime wiring and persistence retain their own jurisdictions.

------------------------------------------------------------------------

## One fact, multiple consumers

R2WX uses an input-oriented vocabulary deliberately.

A field description can carry enough information for the frontend to
render native HTML directly:

``` svelte
<R2wxInput {...entity} />
```

The browser can then use native HTML constraints for immediate
interaction feedback.

The backend consumes the same class of application semantics through its
own validation machinery. Its validation vocabulary mirrors the
constraints expressed toward HTML, but the backend does not depend on
browser validation and does not delegate acceptance authority to the
frontend.

``` text
Browser / native HTML validation
        │
        └── interaction and UX feedback

NestJS route-level validation
        │
        └── application acceptance / fail fast

Prisma + MySQL
        │
        └── final persistence authority
```

Frontend validation improves interaction. It is not treated as a
security or acceptance boundary.

------------------------------------------------------------------------

## Runtime-specific orchestration

### Frontend: `ctx.js`

A concrete example is `front/src/routes/[[lang]]/entities/sam/ctx.js`.

The frontend context combines shared entity knowledge with information
required by the Svelte runtime. `packEntityForm()` can combine the
entity scheme, literals, existing entity data, runtime rules and
database-backed option materialization.

The result is not prebuilt HTML. It is a representation from which the
frontend realizes the required interaction.

### Backend: `config.ts`

A concrete example is `back/src/routes/sam/config.ts`.

The backend configuration carries information specific to the core API:
entity identity, paths, API exposure and access configuration.

That configuration feeds shared controller/service infrastructure rather
than forcing each resident to reproduce the same CRUD machinery.

The two configuration objects are siblings in purpose, not twins in
implementation.

------------------------------------------------------------------------

## One CRUD lifecycle, four operational states

R2WX does not model Create, Read, Update and Delete as four unrelated
frontend implementations.

The shared form machinery uses:

``` text
FORM.ADD
FORM.READ
FORM.EDIT
FORM.DEL
```

The active state participates in field interaction, available
transitions/actions, confirmation behavior, submission behavior and
selection of `POST`, `PUT` or `DELETE`.

In `READ` and `DEL`, the common fieldset machinery can disable the
represented inputs. Mode controls and submit controls react to the same
lifecycle state.

> **CRUD changes state; it does not require four independent form
> architectures.**

### Generic and Custom realization

Form realization is separate from CRUD state. A resident can use the
generic renderer when its representation fits the common layout, or a
custom form to control placement and composition while retaining useful
shared machinery.

Generic/Custom answers **how the representation is realized**.
`FORM.ADD / READ / EDIT / DEL` answers **under which operation it is
being exercised**.

------------------------------------------------------------------------

## Strict validation without another update model

Partial updates create a common problem: a complete entity may require
fields that a particular update does not contain.

R2WX does not solve this by introducing a parallel update DTO containing
another declaration of the same field knowledge.

`Validation.loose()` changes validation **scope**, not the validation
engine:

``` text
incoming update keys
        │
        ▼
project matching rules
from the resident scheme
        │
        ▼
temporary sub-schema
        │
        ▼
existing strict validator
```

Only fields participating in the update are projected into the working
validation scope. The projection then passes through the same strict
validation procedure used for complete payloads.

------------------------------------------------------------------------

## Multipart without materializing it at the BFF

The SvelteKit BFF does not need to parse an incoming multipart request
and reconstruct a new `FormData` payload before forwarding it.

The streaming proxy passes the incoming request body to Node `fetch`
using:

``` javascript
body: request.body,
duplex: 'half'
```

The multipart body remains unparsed at the BFF boundary and is forwarded
as a stream to the NestJS core API. This avoids the
payload-materialization path in which the BFF parses the multipart body,
extracts its files and constructs another multipart representation for
the next hop.

------------------------------------------------------------------------

## The scheme configures multipart ingestion

File semantics do more than validate an upload after it arrives.

`BaseController` partitions file rules from the active resident scheme
and supplies them to the Multer service. The service derives the active
Multer `fileSize` limit from those rules:

``` text
resident scheme
      │
      ▼
file rules
      │
      ▼
_splitRules()
      │
      ▼
MulterService.processHttp()
      │
      ▼
Math.max(...declared file sizes)
      │
      ▼
multer({ limits: { fileSize: maxSchemaSize } })
```

The same application knowledge that describes acceptable file sizes
therefore participates directly in configuring backend multipart
ingestion.

------------------------------------------------------------------------

## JSON or multipart: let the rendered form reveal the transport

The default frontend submission path collects the represented form state
and determines whether file inputs are involved.

Without files, the payload can travel as JSON. When file input requires
multipart transport, the common form machinery prepares `FormData`.

The resident does not need an entirely separate form architecture simply
because its transport representation changes.

------------------------------------------------------------------------

## Files participate in the entity lifecycle

File handling is integrated into the same entity-management flow rather
than treated as an unrelated upload subsystem.

The infrastructure supports multipart create and update paths, including
replacement behavior and file-rule validation.

One important distinction appears during update:

> **Entity requiredness is not always interaction requiredness.**

A file may be required for the persisted entity while an edit operation
does not require a replacement when a valid file already exists.

------------------------------------------------------------------------

## Runtime enrichment without canonical contamination

Some valid values cannot be completely known when a scheme is authored.
Lookup-backed selections are one example. The backend can resolve
current database-backed option identifiers and enrich the working scheme
before the shared validation/persistence path continues.

Public scheme materialization therefore returns independently owned
structured clones.

``` text
canonical definition
      │
      ├── materialize ──► working representation A ──► runtime enrichment
      │
      └── materialize ──► working representation B
```

`_T` and `MIME` vocabulary definitions are frozen, while scheme
factories return independently structured working graphs.

> **Definitions may be shared. Working representations are not.**

------------------------------------------------------------------------

## Where the shared procedure yields

R2WX reduces recurring procedure, but it does not require every
operation to remain generic.

### Custom presentation

A resident can leave generic form realization and compose its own layout
while retaining common field, state and submission infrastructure.

### Custom payload derivation

The default submission path can derive data from the represented form
automatically. When that is not appropriate, `$action.submit()` can
replace that bounded stage. Its returned payload then continues through
the surrounding shared submission lifecycle.

``` text
shared procedure
      │
      ▼
payload derivation
      │
      ├── default machinery
      │
      └── $action.submit() ──► custom derivation
                                  │
                                  ▼
                         rejoin shared procedure
```

### Specialized backend procedure

A controller can use the standard BaseController CRUD path, reuse
protected controller primitives in a specialized endpoint, or implement
application-specific procedure where required.

`UserController.authenticate` is one concrete example: authentication is
not ordinary CRUD, but it can still reuse useful infrastructure before
performing its specialized operation.

Shared CRUD operations are available through `BaseService`; a
specialized service can operate directly against its model when its
procedure differs.

> **An operation can leave the standard road without requiring the rest
> of the infrastructure to be discarded.**

------------------------------------------------------------------------

## Inherited capability, explicit exposure

Shared controller infrastructure can provide more capability than a
particular resident should expose. R2WX separates those two concerns.

`BaseController` owns reusable endpoint procedure. A resident inherits
that capability, but inheritance alone does not make every operation part
of the resident's API contract. The resident's backend `config.ts` must
explicitly admit the HTTP verb, path and access classification.
`BaseController._assureEndpointExposed()` enforces that admission at
runtime.

``` text
BaseController capability
        │
        │ inherited
        ▼
resident controller
        │
        │ config.ts admits verb / path / access
        ▼
_assureEndpointExposed()
        │
        ├── declared ──► operation may continue
        └── absent   ──► operation rejected
```

> **Reusable implementation is inherited broadly. Exposure is granted
> narrowly.**

This is separate from browser-facing human authorization. The SvelteKit
BFF remains the human authentication/authorization boundary and reaches
the hidden core API as a trusted service identity. Capability admission
then constrains which inherited operations belong to a resident even
inside that trusted service path.

------------------------------------------------------------------------

## 75/25: infrastructure coverage

R2WX was built around an approximate engineering heuristic: recurring
infrastructure should be capable of carrying a substantial portion of
ordinary entity-management work, while application-specific behavior
remains available where the common path no longer fits.

The shorthand for that objective is **75/25**.

It is not a measured source-code ratio. It is not a claim that every
resident receives exactly 75% automation. It is not a restriction saying
a developer has only 25% freedom.

It describes intended **coverage of recurring problem space**.

R2WX structures recurring CRUD, API, service/model handling, form
behavior, validation, transport and file-management capabilities in
shared infrastructure. A resident must still be explicitly instantiated
and wired into that structure.

> **R2WX reduces recurring implementation. It does not eliminate
> resident instantiation.**

> **Coverage is not a measure of developer freedom.**

------------------------------------------------------------------------

## Authentication and the BFF boundary

R2WX places a SvelteKit BFF between the browser and the NestJS core API.

``` text
Browser
   │
   │ credentials / HttpOnly cookie
   ▼
SvelteKit BFF
   │
   │ user-level authentication + authorization
   │ trusted service identity
   ▼
NestJS Core API
```

Credentials are verified against backend-held user data using Argon2id.
The browser session is represented by a custom stateless ticket carried
in an HttpOnly cookie.

The ticket is not a JWT and its Base64 representation is not treated as
encryption. It can carry non-sensitive profile/session information in an
inspectable representation. Integrity and authenticity come from
HMAC-SHA256 protection and request-context binding, not from hiding the
payload.

At the BFF-to-core boundary, the BFF acts as a trusted service identity
using configured authorization material. The core API is intended to
live behind that boundary rather than serve as the browser-facing API.

The repository exposes development ports because it is distributed as a
runnable development artifact. That exposure should not be confused with
the intended trust topology.

------------------------------------------------------------------------

## Prisma gets the final word

R2WX deliberately does **not** make its application scheme the universal
source of truth.

The shared schemes govern recurring application/runtime semantics.
Prisma and MySQL independently govern persistence.

``` text
application/runtime jurisdiction
        │
        │ accepted payload
        ▼
persistence jurisdiction
        │
        ▼
Prisma schema / database constraints
```

The Prisma model is not generated from the R2WX application scheme. That
separation is deliberate.

Application infrastructure can be changed, enriched or incorrectly
aligned by its developer. Persistence remains an independently declared
boundary capable of rejecting what does not satisfy its own model.

This introduces manual alignment between application schemes and Prisma.
R2WX accepts that friction rather than granting the application
representation unilateral authority over the database model.

> **Application knowledge can govern the journey. Persistence retains
> authority over what it accepts.**

The service layer therefore does not reproduce another complete R2WX
validation pass immediately before Prisma. Route-level validation
rejects invalid application input early; Prisma and the database remain
the final structural persistence boundary.

------------------------------------------------------------------------

## Representative residents

A **resident** is an application-specific entity or tool attached to and
served by the shared R2WX infrastructure. It is not synonymous with its
scheme: the scheme carries shared application semantics, while the
resident also has runtime-specific attachment points such as frontend
context/routes and backend configuration/controller/service structure.

R2WX includes residents with different requirements so that the shared
machinery is exercised through more than one shape of problem.

**SAM-X** (backend: `back/src/routes/samx/`; frontend entity routes under
`front/src/routes/[[lang]]/entities/samx/`) exercises generic form
realization, scalar CRUD behavior and lookup-backed runtime options.

**SAM** (backend: `back/src/routes/sam/`; frontend entity routes under
`front/src/routes/[[lang]]/entities/sam/`) exercises custom form
realization, multipart transport and file lifecycle behavior while
remaining connected to the same broader entity-management
infrastructure.

**USER** (backend: `back/src/routes/user/`) exercises a different kind of
specialization. Authentication is not ordinary entity CRUD, so its
controller/service path demonstrates reuse of infrastructure primitives
inside a handwritten procedure.

These residents are not presented as evidence that R2WX covers every
possible application. They make different parts of the infrastructure
inspectable.

------------------------------------------------------------------------

## What the R&D investigates

R2WX asks what happens when recurring full-stack entity knowledge is
organized around the application's own shared semantics rather than
repeatedly re-expressed according to every framework boundary it
crosses. Repeated code is visible; the deeper problem is repeated
ownership of the same application knowledge, because independently
maintained declarations can diverge as that knowledge changes.

The implementation arrived at a more specific answer than "make
everything declarative."

It consolidates knowledge where that knowledge genuinely recurs. It
consolidates procedure where procedure genuinely recurs. It allows
frontend and backend runtimes to interpret common knowledge without
forcing them into mechanical symmetry. It allows generic procedures to
yield when an operation needs something different. And it deliberately
stops consolidation where another subsystem should retain independent
authority.

That produces a recurring path through the artifact:

> **Shared knowledge → runtime-specific interpretation → reusable
> procedure → controlled intervention → authoritative boundaries.**

R2WX is published as an executable record of that investigation. It does
not claim that this is the only way to build a REST/CRUD application,
nor does publication ask anyone to adopt it.

The repository is the evidence. The implementation can be inspected
directly.

------------------------------------------------------------------------

## Scope

R2WX is deliberately scoped around the engineering concerns described
above.

It is not being developed as a comprehensive general-purpose framework,
a hosted product, or a prescribed application architecture. Its public
form exists so that its cross-end design and implementation can be
examined.

That scope also means the repository is not being polished toward an
abstract definition of completeness. Small implementation scars can
remain where they do not obscure the engineering being demonstrated.

The important question for this repository is not whether every
conceivable framework feature or development practice has been
incorporated.

It is whether the cross-end infrastructure described here is visible,
executable and inspectable.

------------------------------------------------------------------------

## Repository shape

``` text
R2WX
├── front/
│   ├── Svelte 5 / SvelteKit
│   ├── runtime contexts
│   ├── form infrastructure
│   ├── BFF routes
│   └── authentication/session boundary
│
├── back/
│   ├── NestJS core API
│   ├── runtime configuration
│   ├── BaseController
│   ├── BaseService
│   ├── Validation
│   ├── Multer/file infrastructure
│   └── Prisma integration
│
├── modules/
│   └── shared scheme vocabulary and resident schemes
│
├── database/
│   └── persistence-related material
│
└── Docker Compose
    └── runnable cross-end environment
```

The workspace is conceptually decomposed but runs as a composed
application. R2WX does not claim that these concerns are independently
distributable framework packages.

------------------------------------------------------------------------

## A useful inspection path

For a first pass through the repository:

1.  Start with a resident scheme under `modules/src/schemes/`, such as
    `modules/src/schemes/sam/index.js` and `samScheme()`.
2.  Follow that resident into frontend `ctx.js` and backend `config.ts`.
3.  Inspect how `packEntityForm()` turns the frontend side into a
    working representation.
4.  Follow the shared `FORM` state through fieldsets, mode controls,
    confirmation and submission.
5.  Trace default form collection into JSON/FormData selection.
6.  Follow multipart requests through the SvelteKit streaming proxy.
7.  Continue into `BaseController`, `_splitRules()` and schema-derived
    Multer configuration.
8.  Compare `Validation.strict()` with `Validation.loose()` and its
    projected validation scope.
9.  Compare inherited `BaseController` capability with the operations
    explicitly admitted by a resident `config.ts` and enforced through
    `_assureEndpointExposed()`.
10. Follow the operation through `BaseService` into Prisma/MySQL.
11. Inspect the places where residents leave the default road: custom
    form composition, `$action.submit()`, dynamic option enrichment and
    specialized controller/service behavior.

That path exposes the main question R2WX was built to investigate
without requiring the repository to be read linearly.

------------------------------------------------------------------------

## Status

R2WX is a personal full-stack R&D artifact published for transparency.

It represents a concrete implementation of an engineering direction
rather than a recommendation that others adopt that direction. Its
purpose here is to make the work inspectable: the shared knowledge, the
runtime interpretations, the reusable machinery, the deliberate exits
from that machinery, and the boundaries where another authority takes
over.
