# 01 — When One Change Started Requiring Too Many Changes

schema-driven · schema-validation · schema-driven-forms · configuration-driven · separation-of-concerns

## THE BATTLE

A field changes.

Its maximum length becomes 160 instead of 80. A field becomes required. An accepted value changes. A new property is added to an entity.

The change itself is usually simple.

Then the same change has to be made everywhere else that carries its own version of that knowledge.

The form definition. Frontend constraints. Backend validation. DTOs or operation-specific representations. Sometimes persistence.

None of these is necessarily difficult work.

But across fields, entities and operations, repeatedly declaring and synchronizing the same application facts consumes considerable development time and attention. Every additional declaration is also another place that can remain unchanged when the others move forward.

I had encountered this kind of work enough times to stop treating all of it as necessary application work.

That was one of the battles R2WX chose to move into infrastructure.

Not by eliminating frontend and backend responsibilities.

Not by making one runtime subordinate to the other.

The target was narrower:

If several parts of the application need the same fact, why should the developer keep declaring that fact independently for each of them?

## The first target was the knowledge itself

Consider a simple constraint:

maximum length = 80

When independently represented, one application fact can become several maintenance points:

<pre class="r2wx-exhibit"><code>                    SAME APPLICATION FACT

                   maximum length = 80

          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    Form definition   Frontend       Backend
                      constraint     validation
                                         │
                                         ▼
                               operation-specific
                                 representation</code></pre>

Now change 80 to 160.

The problem isn't writing 160.

The problem is that the developer has become responsible for knowing every place where 80 independently means the same thing.

<pre class="r2wx-exhibit"><code>80 → 160

Where else does 80 live?
        │
        ├── form?
        ├── frontend validation?
        ├── backend validation?
        ├── DTO?
        └── another operation?</code></pre>

Miss one and the application can begin disagreeing with itself.

That made the recurring problem larger than duplicated code:

**Repeated knowledge creates repeated maintenance. Repeated maintenance creates opportunities for drift.**

R2WX therefore attacks the repetition one level earlier.

It shares the knowledge from which those behaviors can be produced.

## Shared application schemes

R2WX places recurring application facts into shared schemes.

A scheme describes the application knowledge associated with an entity and its fields: types, literals, constraints and other rules that multiple consumers may need.

**Implementation evidence — the shared application knowledge**

<pre class="r2wx-exhibit"><code>// modules/src/schemes/samx/index.js

export const samxScheme = () =&gt; ({
    id:   { ...T.NUMB, required: false },
    name: { ...T.TEXT, maxLength: 160, required: true },

    description: ...,
    status: ...,
    ...
});</code></pre>

Conceptually:

<pre class="r2wx-exhibit"><code>const scheme = () =&gt; ({
    field: {
        type: ...,
        required: ...,
        min: ...,
        max: ...,
        // ...
    }
});</code></pre>

Instead of:

<pre class="r2wx-exhibit"><code>Frontend fact ── maintained independently
Backend fact  ── maintained independently
Form fact     ── maintained independently</code></pre>

R2WX moves toward:

<pre class="r2wx-exhibit"><code>                    Shared Scheme
                         │
                 application knowledge
                         │
               ┌─────────┴─────────┐
               ▼                   ▼
           Frontend             Backend
               │                   │
        uses the knowledge    uses the knowledge
        for interaction       for acceptance</code></pre>

The change is small to describe but significant in daily development.

When a shared rule changes, the developer changes the knowledge rather than hunting through independent copies of that knowledge merely because different runtimes consume it.

The first thing R2WX tried to stop repeating was not code. It was application knowledge.

## That did not mean merging frontend and backend

This created another question immediately.

If the knowledge is shared, should everything surrounding it also become shared?

R2WX's answer was no.

The frontend and backend consume common application knowledge, but they do different work with it.

On the frontend, ctx.js provides frontend-specific context:

<pre class="r2wx-exhibit"><code>{
    entity: ...,
    typ: ...,
    lit: ...
}</code></pre>

On the backend, config.ts connects application knowledge to server-specific concerns:

<pre class="r2wx-exhibit"><code>export default () =&gt; ({
    path: &#x27;user&#x27;,
    entity: &#x27;APP_USER&#x27;,
    type: userAuthScheme(),
    api: {...}
})</code></pre>

At this point, api does not need to mean anything more than backend-owned configuration. Its exposure role becomes important later.

For now, the important shape is:

<pre class="r2wx-exhibit"><code>                       SHARED SCHEME
                    application knowledge
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
           ctx.js                   config.ts
              │                         │
              ▼                         ▼
          FRONTEND                   BACKEND
       interpretation             interpretation
              │                         │
              ▼                         ▼
       interaction / UI       validation / procedure</code></pre>

The scheme carries what can legitimately be shared.

Each runtime retains the decisions that belong to it.

That is where a familiar architectural term becomes useful:

separation-of-concerns

But the term came after the problem.

The development pressure was much simpler:

Stop declaring the same facts repeatedly without turning frontend and backend into the same responsibility.

## The shared knowledge started doing work

Once those declarations existed in a common form, they could become more than descriptions.

The frontend could interpret them through shared form machinery:

**Implementation evidence — the same knowledge reaches the frontend**

<pre class="r2wx-exhibit"><code>// R2wxInput.svelte

let input = $derived(
    filterInputAttrs($active.form[id] || { type: &#x27;text&#x27; })
);

&lt;input {...input} ... /&gt;

Scheme
  │
  ├── type
  ├── required
  ├── limits
  └── accepted values
        │
        ▼
   Form machinery
        │
        ▼
 Browser controls</code></pre>

The backend could interpret the same application knowledge through its validation machinery:

**Implementation evidence — the backend consumes the same rules**

<pre class="r2wx-exhibit"><code>// BaseController.ts

@Post()
async create(@Body() data, @Req() req: RequestAuthz) {
    this._assureEndpointAccessible(HTTP.POST, PATH._, req.userAccess);
    this._assureDataValid(data, VALID.STRICT);

    return { data: await this.service.create(data) };
}

// Validation.ts

const TMAP = {
    required:  CHECK.EXIS,
    maxLength: CHECK.MAXL,
    ...
};

Scheme
  │
  ├── type
  ├── required
  ├── limits
  └── accepted values
        │
        ▼
    Validation
        │
        ▼
 Server acceptance</code></pre>

Put together:

<pre class="r2wx-exhibit"><code>                         Scheme
                           │
                shared application facts
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Form machinery              Validation
              │                         │
              ▼                         ▼
      browser behavior          server acceptance</code></pre>

This is where labels such as schema-driven-forms and schema-validation become concrete descriptions of what R2WX is actually doing.

The frontend still owns interaction.

The backend still owns acceptance.

**The knowledge is shared. Its interpretation and authority remain local.**

## DTO repetition became part of the same question

Backend DTOs can be useful.

But inside the recurring CRUD path R2WX was exploring, they also raised a practical question.

If the application already knows that a field is:

<pre class="r2wx-exhibit"><code>string
required
maximum 160</code></pre>

and the backend validation machinery can consume that knowledge directly, reproducing the same constraints through another DTO adds another representation that must remain synchronized.

As entities and operations accumulate, those representations accumulate with them.

R2WX deliberately moved that DTO proliferation out of its CRUD path.

Instead, backend validation consumes the scheme and shared validation machinery directly.

For partial operations, R2WX does not introduce an entirely separate validation system either. It changes the scope being validated and reuses the existing procedure.

<pre class="r2wx-exhibit"><code>Complete scheme
      │
      ├─────────────── strict validation
      │
      ▼
 projected scope
      │
      └─────────────── same validation machinery</code></pre>

The decision wasn't:

DTOs are wrong.

It was much more specific:

R2WX would not require another declaration of application knowledge merely because its shared CRUD machinery had crossed into NestJS.

The framework remained a tool used by the application.

It did not get to decide that the application must reproduce knowledge simply to satisfy one conventional representation of the framework.

## Sharing definitions introduced a different danger

Removing repeated declarations did not mean every consumer should manipulate one global mutable object.

Frontend and backend processing may need to enrich or modify the representation they are currently working with.

If every consumer operated on the same object, sharing knowledge could create another form of coupling.

R2WX therefore exposes schemes through factories that materialize independent working graphs:

**Implementation evidence — independent working representations**

<pre class="r2wx-exhibit"><code>// modules/src/schemes/index.js

export const samxScheme = () =&gt;
    structuredClone(samxSchemeCore());</code></pre>

So:

<pre class="r2wx-exhibit"><code>                 Canonical definition
                        │
                  Scheme factory
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      Working graph A       Working graph B
             │                     │
       may evolve locally     may evolve locally
             │                     │
             └──── no shared ──────┘
                    mutation</code></pre>

That produced an important distinction:

**Definitions can be shared without sharing every working representation of them.**

R2WX could therefore consolidate application knowledge without requiring every consumer to share mutable runtime state.

## What actually changed for the developer?

Without the shared structure:

<pre class="r2wx-exhibit"><code>APPLICATION FACT CHANGES
          │
          ▼
Where did I declare this?
          │
     ┌────┼────┬────┐
     ▼    ▼    ▼    ▼
    UI   DTO  API  validation ...
     │    │    │    │
     └────┴────┴────┘
          │
          ▼
keep them synchronized</code></pre>

With the R2WX direction:

<pre class="r2wx-exhibit"><code>APPLICATION FACT CHANGES
          │
          ▼
    Shared Scheme
          │
     ┌────┴────┐
     ▼         ▼
 frontend    backend
 machinery   machinery
     │         │
     ▼         ▼
 interpret the changed knowledge
 according to their own responsibility</code></pre>

That is the development work R2WX was trying to absorb.

Not every difference between frontend and backend.

Not every application decision.

Not persistence authority.

The recurring work of independently redeclaring knowledge that the application already possessed.

And that gives us the first piece of R2WX's larger path:

<pre class="r2wx-exhibit"><code>Repeated application knowledge
              │
              ▼
      Shared application knowledge
              │
              ▼
    Runtime-specific interpretation</code></pre>

The next question follows naturally.

Once the same knowledge could be interpreted repeatedly by the system, how much of the procedure surrounding that knowledge could also stop being repeatedly implemented by the developer?

That is where shared knowledge starts becoming shared procedure.

---
[Continue →](02-knowledge-and-ownership.md)