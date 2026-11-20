# 08 — When Consolidation Stopped at Persistence

separation-of-concerns · schema-validation · prisma · data-boundaries · persistence

## THE BATTLE

By now, R2WX has spent much of the application path eliminating independently maintained versions of knowledge it already possesses.

A field constraint should not need to be separately rediscovered by the form, the frontend, the backend and the transport layer.

So eventually an obvious inconsistency appears.

The database model still has its own definition.

Prisma still describes what can be persisted.

That means changing an entity can once again require another deliberate change somewhere else.

After spending so much effort reducing exactly that kind of synchronization work, why stop here?

The tempting continuation is obvious:

<pre class="r2wx-exhibit"><code>Shared Scheme
     │
     ├── frontend
     ├── backend
     ├── validation
     ├── transport
     │
     ▼
generate persistence model
     │
     ▼
Database</code></pre>

One description.

One propagation path.

No final synchronization point.

R2WX does not take that step.

And that refusal exposes an important limit to everything we have explored so far.

Repeated knowledge was never the enemy by itself.

The question was whether independently maintaining it served a responsibility worth preserving.

At persistence, R2WX answers yes.

## The application knows a great deal about an entity

By the time data reaches persistence, the application has already exercised substantial knowledge about it.

The shared schemes can describe things such as:

<pre class="r2wx-exhibit"><code>type
requiredness
accepted values
bounds
file rules
relationships used by application behavior</code></pre>

That knowledge has already participated in multiple procedures:

<pre class="r2wx-exhibit"><code>                Shared Scheme
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      forms      validation    transport
        │            │            │
        └────────────┼────────────┘
                     ▼
               backend procedure</code></pre>

It would therefore be technically conceivable to keep pushing that authority downward.

But persistence represents a different question.

The application asks:

Is this acceptable application data for this operation?

Persistence ultimately asks:

Can this state actually exist here?

Those questions overlap.

They are not identical.

## Prisma keeps its own model

R2WX retains schema.prisma as an independently maintained persistence definition.

**Implementation evidence — the same entity remains independently represented**

Application scheme:

<pre class="r2wx-exhibit"><code>// schemes/samx/index.js

name: {
    ...T.TEXT,
    maxLength: 160
},

status: {
    ...T.SELE,
    required: true,
    &#x27;data-options&#x27;: [
        &#x27;DRAFT&#x27;,
        &#x27;READY&#x27;,
        &#x27;ACTIVE&#x27;,
        &#x27;PAUSED&#x27;,
        &#x27;CLOSED&#x27;
    ],
    value: &#x27;DRAFT&#x27;
},

...</code></pre>

Persistence model:

<pre class="r2wx-exhibit"><code>// schema.prisma

model TOOL_SAMX {
    id   Int    @id @default(autoincrement())
    name String @db.VarChar(160)

    status ENUM_STATUS @default(DRAFT)

    // ... additional fields ...

    category_id  Int
    StatCategory STAT_CATEGORY
        @relation(fields: [category_id], references: [id])

    owner_id Int?
    Owner OWNER?
        @relation(fields: [owner_id], references: [id])

    // ... timestamps ...
}</code></pre>

Conceptually:

<pre class="r2wx-exhibit"><code>        APPLICATION JURISDICTION

            Shared Schemes
                  │
          frontend / backend
                  │
             validation
                  │
                  ▼
               data
                  │
══════════ PERSISTENCE BOUNDARY ══════════
                  │
                  ▼
             Prisma Model
                  │
                  ▼
               MySQL</code></pre>

The Prisma model is not generated from the application schemes.

Nor are the application schemes merely views generated from Prisma.

They have to remain aligned where their responsibilities overlap.

That creates real maintenance cost.

R2WX accepts it.

## This is duplication with a purpose

That distinction changes the meaning of the synchronization point.

Earlier, repeated declarations looked like this:

<pre class="r2wx-exhibit"><code>same application fact
      │
      ├── copy A
      ├── copy B
      ├── copy C
      └── copy D</code></pre>

Each copy created another opportunity for accidental divergence without necessarily adding another meaningful authority.

At persistence, the topology is different:

<pre class="r2wx-exhibit"><code>application knowledge
        │
        ▼
application acceptance
        │
        ▼
persistence boundary
        │
        ▼
persistence model
        │
        ▼
database acceptance</code></pre>

The second representation exists because another subsystem retains authority over what enters it.

So R2WX does not apply the earlier lesson mechanically:

<pre class="r2wx-exhibit"><code>duplication is bad → therefore eliminate every duplicate representation.</code></pre>

Instead:

**Consolidate repeated knowledge where independent ownership serves no useful boundary. Preserve independent representation where independent authority is intentional.**

This is where the earlier theme of separation-of-concerns reaches its deepest boundary in the artifact.

## Application validation does not get the final word

The backend's shared validation machinery can reject invalid application input before persistence.

That is useful.

It can provide application-specific semantics and errors.

It can understand rules expressed through the R2WX scheme vocabulary.

But passing that layer does not make the data inherently persistable.

<pre class="r2wx-exhibit"><code>Request
   │
   ▼
R2WX validation
   │
   │ accepted
   ▼
Service
   │
   ▼
Prisma
   │
   │ must still satisfy
   │ persistence model
   ▼
Database</code></pre>

So:

<pre class="r2wx-exhibit"><code>Application acceptance ≠ persistence acceptance</code></pre>

This also explains why R2WX services do not need to reproduce the complete application validation process yet again immediately before every persistence operation.

The layers are not three identical validators stacked together.

They perform different jobs.

**Implementation evidence — application procedure hands off to Prisma**

<pre class="r2wx-exhibit"><code>// BaseService.ts

export class BaseService {
    constructor(protected db: DbService, protected entity: string) {
        this.model = db[entity];
    }

    async create(entry = {}) {
        return this.model.create({ data: entry });
    }

    async update(...) { ... }
    async delete(...) { ... }
}

Frontend
   │
   └── interaction / early conformance

Backend
   │
   └── authoritative application acceptance

Prisma / Database
   │
   └── persistence acceptance</code></pre>

Authority changes with jurisdiction.

## The final boundary can reject what the application thought was valid

This independence has a practical consequence.

If application knowledge and the persistence model drift apart, the discrepancy does not silently become database truth merely because the application accepted it.

The persistence layer can resist.

<pre class="r2wx-exhibit"><code>Application says
&quot;This is acceptable.&quot;
        │
        ▼
      Prisma
        │
   ┌────┴────┐
   │         │
 agrees    disagrees
   │         │
   ▼         ▼
persist    reject</code></pre>

That friction can be inconvenient during development.

But removing it would also remove an independent opportunity to catch disagreement before it becomes persisted state.

The maintenance point therefore performs two roles:

<pre class="r2wx-exhibit"><code>manual alignment
      │
      ├── COST
      │     another model must remain synchronized
      │
      └── BARRIER
            persistence does not automatically
            follow every application-model change</code></pre>

R2WX chooses to keep both.

## Not every synchronization cost should be automated away

This is where the first exploration topic returns in a different form.

Section 1 began with:

Why should a developer repeatedly declare the same application fact?

The answer led toward consolidation.

Now we encounter:

Why should a developer have to align the application model with Prisma?

And R2WX gives a different answer:

Because this alignment crosses into a responsibility that was deliberately kept independently authoritative.

The manual step introduces resistance.

A persistence change cannot happen merely because an application scheme changed.

Someone has to cross that boundary deliberately.

<pre class="r2wx-exhibit"><code>Application change
       │
       ▼
scheme changes
       │
       X
       │   no automatic authority
       ▼
Prisma changes
       │
       ▼
database changes</code></pre>

That X is not simply missing automation.

In R2WX it is part of the boundary.

Persistence resistance is deliberate.

## This also limits schema sovereignty

Throughout the earlier sections, the shared schemes have acquired considerable influence.

They participate in:

<pre class="r2wx-exhibit"><code>representation
validation
form behavior
runtime enrichment
file constraints
transport configuration</code></pre>

It would be easy by now to describe them as the single source of truth for the entire system.

That would be inaccurate.

Their authority has a jurisdiction.

<pre class="r2wx-exhibit"><code>             SHARED SCHEMES
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    frontend    backend    transport
        │          │          │
        └──────────┼──────────┘
                   ▼
          application domain
                   │
                   │ boundary
                   ▼
                 Prisma
                   │
                   ▼
                database</code></pre>

So the stronger and more precise finding is:

**The schemes are authoritative within the application responsibilities assigned to them. They are not sovereign over persistence.**

That qualification is not a weakness in the scheme model.

It is part of the design.

## The database is not merely the bottom of the pipeline

If we read the architecture only as data flow, persistence looks like the final technical destination:

<pre class="r2wx-exhibit"><code>Browser → BFF → API → Service → Prisma → MySQL</code></pre>

But after following the eight explorations, another reading becomes possible.

The arrows are crossing responsibilities.

<pre class="r2wx-exhibit"><code>interaction
     │
     ▼
application representation
     │
     ▼
application acceptance
     │
     ▼
procedure
     │
     ▼
persistence acceptance</code></pre>

The database edge is therefore not interesting merely because it happens last.

It is interesting because R2WX deliberately stops propagating application authority before reaching it.

The final persistence edge remains independently sovereign.

## And that resolves an apparent contradiction

At the beginning of this exploration, R2WX appeared to contain two opposing tendencies.

On one side:

remove duplication

centralize recurring knowledge

reuse procedure

automate repetitive work

On the other:

separate frontend/backend interpretation

preserve custom procedure

require explicit API exposure

separate human/service authority

retain independent persistence model

Those are not actually opposite strategies.

The dividing question is:

Does this repetition represent unnecessary repeated ownership, or does the separation preserve a responsibility that should remain independently owned?

When R2WX judges the former, it tends to consolidate.

When it judges the latter, it tends to preserve the boundary.

That gives the entire exploration a more precise shape:

<pre class="r2wx-exhibit"><code>          RECURRING KNOWLEDGE / WORK
                     │
                     ▼
          Does independent ownership
              still serve a purpose?
                     │
              ┌──────┴──────┐
             NO             YES
              │              │
              ▼              ▼
           ABSORB         ISOLATE
              │              │
              ▼              ▼
       shared knowledge   preserve
        or procedure      boundary</code></pre>

Not everything repeated belongs together.

Not everything separated should remain separate.

The decision depends on responsibility.

---
[Continue →](conclusion.md)