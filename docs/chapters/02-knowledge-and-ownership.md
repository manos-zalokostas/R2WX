# 02 — When Sharing Knowledge Started Blurring Ownership

separation-of-concerns · configuration-driven · decoupling · frontend-architecture · backend-architecture

## THE BATTLE

Frontend and backend often need to agree on the same application facts.

Keeping separate copies means keeping them synchronized.

But solving that problem by continuously moving more knowledge into one shared definition creates the opposite pressure:

if both sides use it, should both sides own it?

R2WX had already chosen to share application schemes rather than repeatedly maintain equivalent field knowledge.

That solved one synchronization problem.

It did not make frontend and backend the same system.

This distinction matters even though the public R2WX infrastructure runs together through Docker Compose. Its frontend and backend were developed as independently responsible sides of an application—as if they could live at a distance, maintained and operated across their own boundaries.

That earlier reality is important to the design.

Two sides can share knowledge.

They still need to know where their agreement ends.

## The tempting solution is to keep centralizing

Once a shared scheme works, centralization becomes attractive.

<pre class="r2wx-exhibit"><code>                SHARED SCHEME
                     │
           both runtimes need it
                     │
                     ▼
             Why stop here?
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
 presentation    API behavior   persistence?</code></pre>

That looks efficient.

But these are no longer necessarily different copies of the same truth.

They may be different truths belonging to different responsibilities.

A frontend needs to know how application knowledge participates in interaction.

A backend needs to know how that knowledge participates in an API and server procedure.

The fact that both sides begin with the same entity does not make everything they know about that entity shareable.

R2WX needed synchronization without turning synchronization into shared ownership.

## ctx.js and config.ts draw that line

They can look surprisingly similar from a distance.

Both sit near entity configuration.

Both connect shared application knowledge to runtime behavior.

Both help machinery understand what it is dealing with.

But they do not contain two copies of the same configuration.

They hold different truths.

**Implementation evidence — same scheme, different runtime truths**

<pre class="r2wx-exhibit"><code>// frontend: ctx.js

export default () =&gt; ({
    entity: &#x27;sam&#x27;,
    typ: samScheme(),
    lit: samLit
});

// backend: config.ts

export default () =&gt; ({
    path: &#x27;sam&#x27;,
    entity: &#x27;TOOL_SAM&#x27;,
    type: samScheme(),

    api: {
        GET: { [PATH._]: [ACCESS.GLOB], [PATH.ID]: [ACCESS.GLOB] },
        POST: ...,
        ...
    }
});</code></pre>

On the frontend:

<pre class="r2wx-exhibit"><code>{
    entity: ...,
    typ: ...,
    lit: ...
}</code></pre>

ctx.js provides the frontend with the context it needs to interpret the application representation.

On the backend:

<pre class="r2wx-exhibit"><code>export default () =&gt; ({
    path: &#x27;user&#x27;,
    entity: &#x27;APP_USER&#x27;,
    type: userAuthScheme(),
    api: {...}
})</code></pre>

config.ts connects that representation to backend concerns such as type interpretation, path and API configuration.

The important contrast is therefore not:

Frontend config     vs     Backend config

It is:

<pre class="r2wx-exhibit"><code>                    SHARED APPLICATION KNOWLEDGE
                              │
                   both sides agree here
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
              ctx.js                   config.ts
                 │                         │
        FRONTEND TRUTHS             BACKEND TRUTHS
                 │                         │
        interaction context        server operation
        representation             path / API behavior</code></pre>

Neither runtime needs to own the other's interpretation merely because both consume the same scheme.

That is separation-of-concerns in a very concrete R2WX form.

## This distinction came from treating the two sides as capable of living apart

Put everything in one Compose stack and some boundaries can begin to look unnecessarily strict.

Why maintain a clear frontend/backend separation when both repositories, services or containers are sitting beside each other?

Because physical proximity is not the same thing as responsibility.

The design treats this:

<pre class="r2wx-exhibit"><code>┌──────────────────────────────────────────────┐
│                Docker Compose                │
│                                              │
│    Frontend   ←──────────────→   Backend     │
│                                              │
└──────────────────────────────────────────────┘</code></pre>

as capable of behaving conceptually like this:

<pre class="r2wx-exhibit"><code>┌─────────────────────┐             ┌─────────────────────┐
│      FRONTEND       │             │       BACKEND       │
│                     │             │                     │
│ frontend knowledge  │             │ backend knowledge   │
│ frontend procedure  │             │ backend procedure   │
└──────────┬──────────┘             └──────────┬──────────┘
           │                                   │
           └──────── shared contract ──────────┘</code></pre>

That changes what “shared” means.

Shared cannot simply mean:

put everything both sides know into the same object.

It has to mean:

identify the knowledge over which the two sides genuinely need agreement, while allowing each side to remain independently responsible for what happens beyond that agreement.

This also explains why some R2WX boundaries can appear stricter than necessary when the artifact is inspected only as a locally composed application.

The distance is architectural rather than geographical.

## Even frontend knowledge has boundaries

**Implementation evidence — structure and literals remain separate**

<pre class="r2wx-exhibit"><code>// structural scheme

export const samScheme = () =&gt; ({
    name:   { ...T.TEXT },
    number: { ...T.NUMB, min: 1, max: 15 },
    ...
});

// lit.js

export const samLit = {
    name:   &#x27;TEXT&#x27;,
    number: &#x27;NUMBER&#x27;,
    ...
};</code></pre>

There is a smaller decision inside the frontend that helps expose the same principle.

ctx.js autonomously supports frontend interpretation, but not every piece of frontend-facing knowledge was simply absorbed into it.

Literals were kept separately in lit.js.

At first glance, putting them directly into frontend context could look simpler:

<pre class="r2wx-exhibit"><code>ctx.js
 ├── entity
 ├── types
 └── all display literals</code></pre>

But literals carry a characteristic that the structural context does not:

their representation can depend on language.

So R2WX keeps a distinction between structural frontend context and literal/display knowledge rather than making the context itself the permanent owner of both.

Conceptually:

<pre class="r2wx-exhibit"><code>               FRONTEND
                  │
          ┌───────┴────────┐
          ▼                ▼
       ctx.js            lit.js
          │                │
    structural /       literal /
    entity context     language-facing text</code></pre>

There is an important boundary to state here.

The current R2WX artifact should not be presented as demonstrating a complete multilingual delivery system unless the repository actually provides that mechanism.

Its current behavior may effectively serve a single language.

What the structure supports us saying is narrower:

Literal knowledge was kept separate from frontend structural context in a way that preserves language-dependent text as a distinct concern.

The separation is visible.

A complete multilingual mechanism should not be invented from that separation alone.

**Implementation evidence — the two runtime contexts feed different machinery**

<pre class="r2wx-exhibit"><code>// +page.server.js

const { entity, typ, lit } = ctx();

const form = packEntityForm(typ, lit, null, {
    active: { hidden: true },
    id: { hidden: true }
});

// Sam.controller.ts

const { path, type, api } = config();

@Controller(path)
export class SamController extends BaseController {
    constructor(service: SamService, svMulter: MulterService) {
        super(service, type, api, svMulter);
    }
}</code></pre>

And that is actually more interesting than pretending the capability is complete: the boundary exists even where the larger capability it could support is not fully exercised by this artifact.

## Sharing stopped when the truths stopped being the same

This gives R2WX a more precise answer to the question Section 1 left open.

Section 1 established:

<pre class="r2wx-exhibit"><code>Repeated application knowledge
             │
             ▼
     Shared application knowledge</code></pre>

But consolidation does not continue indefinitely:

<pre class="r2wx-exhibit"><code>                 Shared Scheme
                      │
             genuinely common facts
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       ctx.js                 config.ts
          │                       │
   frontend truth            backend truth
          │                       │
          ▼                       ▼
 frontend evolves           backend evolves
 independently              independently</code></pre>

The stopping criterion isn't simply:

“Can this information technically be put in the shared object?”

It is closer to:

Does this still represent the same application truth, or has responsibility now crossed into a runtime that owns a different decision?

That distinction lets R2WX reduce synchronization work without trying to erase the systems that have to synchronize.

## What changed for the developer?

Without the distinction, solving duplication can become another form of coupling:

<pre class="r2wx-exhibit"><code>WE KEEP REPEATING THINGS
          │
          ▼
SHARE EVERYTHING
          │
          ▼
now unrelated responsibilities
depend on the same representation</code></pre>

R2WX instead moves toward:

<pre class="r2wx-exhibit"><code>WE KEEP REPEATING THE SAME FACT
              │
              ▼
          SHARE IT
              │
              ▼
    responsibility diverges
              │
        ┌─────┴─────┐
        ▼           ▼
     frontend     backend
       owns         owns
      its truth    its truth</code></pre>

That is a different kind of relief for the developer.

The system no longer asks for independent copies merely because frontend and backend are separate.

But it also does not require one side to understand or carry the other's internal decisions merely because some knowledge is shared.

**Share agreement. Preserve ownership.**

And this gives us the next pressure naturally.

Once each runtime could interpret common knowledge while retaining its own responsibility, another kind of repetition became visible:

the same interpretations were repeatedly leading to the same procedures.

Forms still had to behave.

Requests still had to be validated.

CRUD operations still had to execute.

So the next question became:

If knowledge can stop being repeatedly declared, can the procedures that repeatedly consume that knowledge stop being repeatedly implemented too?

That is where R2WX moves from shared knowledge into shared procedure.

---
[Continue →](03-repeated-procedure.md)