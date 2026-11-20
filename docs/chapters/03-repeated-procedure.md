# 03 — When Shared Knowledge Started Repeating the Same Work

reusable-infrastructure · schema-driven · schema-validation · form-lifecycle · crud-application · separation-of-concerns

## THE BATTLE

Removing duplicate definitions does not remove duplicate implementation.

The application may now know that a field is required, that another is boolean, that one accepts a bounded string and another represents a file.

But somebody still has to turn that knowledge into behavior.

Forms still need to be assembled. Values still need to be collected and normalized. Requests still need to be validated. CRUD operations still need to reach the appropriate service. Responses still need to come back.

If every entity performs those steps independently, shared knowledge has solved only half of the repetition.

This was the next kind of work R2WX chose to absorb.

The question was no longer only:

Where should this application fact be declared?

It became:

If the system already understands the fact, how much of the recurring work around that fact can the system perform too?

## Knowing that a field is required is not enough

Section 1 moved recurring application knowledge into shared schemes.

Section 2 kept the interpretation of that knowledge with the runtime that owns it.

That gives us:

<pre class="r2wx-exhibit"><code>                     Shared Scheme
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
           Frontend                 Backend
        interpretation           interpretation</code></pre>

But without reusable procedure, the next step can still look like this:

<pre class="r2wx-exhibit"><code>Entity A                         Entity B
   │                                │
build form                      build form
collect data                    collect data
normalize                       normalize
submit                          submit
   │                                │

Entity A                         Entity B
   │                                │
validate                        validate
authorize                       authorize
CRUD                            CRUD
reply                           reply</code></pre>

The declarations are no longer duplicated.

The procedures consuming them still are.

R2WX pushes the shared structure one step further:

<pre class="r2wx-exhibit"><code>                 Shared Knowledge
                        │
                        ▼
              Runtime Interpretation
                        │
                        ▼
                Shared Procedure
                        │
               ┌────────┴────────┐
               ▼                 ▼
          Entity A            Entity B</code></pre>

The entities still exist.

Their differences still exist.

What begins disappearing is the need for each one to independently implement behavior the infrastructure already knows how to perform.

## On the frontend, the form became machinery

CRUD forms tend to contain a lot of work that is important but unsurprising.

Inputs need to be rendered.

Their constraints need to be respected.

Current values need to be represented.

The form needs to know whether it is adding, reading, editing or deleting.

Submission needs to collect the appropriate values and send them through the appropriate operation.

R2WX concentrates that recurring work into shared form machinery rather than treating every entity operation as a new form implementation.

Its operational states are explicit:

<pre class="r2wx-exhibit"><code>ADD
READ
EDIT
DEL</code></pre>

But these do not require four unrelated implementations.

They are states exercised through common machinery:

**Implementation evidence — CRUD as states of shared form machinery**

<pre class="r2wx-exhibit"><code>export const FORM = {
    ADD:  1,
    READ: 2,
    EDIT: 3,
    DEL:  4
};

let disabled = $derived(
    [FORM.READ, FORM.DEL].includes($form.mode)
);

&lt;fieldset disabled={disabled}&gt;
    &lt;R2wxInput {id} /&gt;
    ...
&lt;/fieldset&gt;

{#if $form.mode === FORM.ADD}
    &lt;button onclick={() =&gt; formPost({ uri: ctx.uri.post })}&gt;
        &lt;strong&gt;submit&lt;/strong&gt;
    &lt;/button&gt;
{/if}

{#if $form.mode === FORM.EDIT}
    ...
{/if}

{#if $form.mode === FORM.DEL}
    ...
{/if}

                       Form
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
         ADD           READ          EDIT          DEL
          │             │             │             │
          └─────────────┴──────┬──────┴─────────────┘
                               │
                               ▼
                     shared form machinery</code></pre>

That changes the development task.

Instead of repeatedly implementing:

“How does an edit form work?”

the recurring behavior already exists.

The entity provides the knowledge and the particular representation needed for this exercise.

CREATE, READ, UPDATE and DELETE became operational states of common form machinery rather than four independent form implementations.

That is what form-lifecycle means here.

Not merely that a form has states.

The states participate in reusable procedure.

## The backend followed the same direction

The same pressure exists after the request crosses the boundary.

A conventional entity API repeatedly needs to answer familiar questions:

Is this endpoint exposed?

Is this caller authorized?

Which part of the request belongs to data and which to files?

Do the submitted values satisfy the active rules?

Which service operation should execute?

How should the result be returned?

Writing those answers again for every entity would recreate procedural repetition behind a now-shared application model.

R2WX instead places the recurring CRUD machinery in BaseController and the corresponding persistence operations in BaseService.

**Implementation evidence — shared backend procedure**

<pre class="r2wx-exhibit"><code>@Get(PATH.ID)
async getID(
    @Param(&#x27;id&#x27;, ParseIntPipe) id: number,
    @Req() req: RequestAuthz
) {
    this._assureEndpointAccessible(HTTP.GET, PATH.ID, req.userAccess);

    const data = await this.service.findUnique({
        where: { id }
    });

    return { data };
}

export class BaseService {
    constructor(protected db: DbService, protected entity: string) {
        this.model = db[entity];
    }

    async findUnique(clause: {}) {
        return this.model.findUnique(clause);
    }

    async update(...) { ... }
    async delete(...) { ... }
    ...
}</code></pre>

Conceptually:

<pre class="r2wx-exhibit"><code>                   Entity Controller
                         │
                         ▼
                   BaseController
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   authorization     validation       CRUD procedure
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                     BaseService
                         │
                         ▼
                    Persistence</code></pre>

An entity controller therefore does not need to rediscover the ordinary mechanics of CRUD simply because a new entity exists.

The shared infrastructure already carries them.

## Validation stopped being rewritten around every operation

Validation exposes the same problem particularly clearly.

A complete operation may need the complete relevant scheme.

A partial operation may need only some of it.

One response would be to build another validator for the partial case.

Then another representation.

Then another maintenance point.

R2WX takes a different route.

Its strict validation procedure remains reusable.

For a partial operation, the scope presented to that procedure changes.

<pre class="r2wx-exhibit"><code>                 Validation machinery
                         ▲
                         │
              ┌──────────┴──────────┐
              │                     │
       complete scope         projected scope
              │                     │
         strict case             loose case</code></pre>

The significant move is:

**Change the scope. Reuse the procedure.**

**Implementation evidence — project the scope, reuse the procedure**

<pre class="r2wx-exhibit"><code>// Validation.ts

strict(data: {}, scheme: {}, optionalExcludes = []) {
    // validate data against the supplied scheme
    ...
}

loose(data: {}, scheme: {}, optionalExcludes = []) {
    const schemeLoose = {};
    const keys = Object.keys(data).filter(key =&gt; key !== &#x27;id&#x27;);

    keys.forEach(key =&gt; {
        if (key in scheme)
            schemeLoose[key] = scheme[key];
        ...
    });

    return this.strict(data, schemeLoose, optionalExcludes);
}</code></pre>

Rather than creating a second validation engine for partial data, R2WX projects the applicable fields and delegates back into the existing strict machinery.

The same pattern appears elsewhere in the artifact:

adapt the input, configuration or context around reusable procedure rather than reproducing the procedure itself.

That is more than code reuse.

It changes where new application work is expected to happen.

## The developer stops implementing the ordinary path

At this point, a new entity no longer begins from an empty page.

R2WX already has expectations about:

- how common forms behave;

- how CRUD state moves through them;

- how values are prepared;

- how requests reach the backend;

- how recurring validation works;

- how controllers execute conventional entity operations;

- how services reach persistence.

So the development shape moves from:

<pre class="r2wx-exhibit"><code>NEW ENTITY
    │
    ▼
implement form behavior
implement submission
implement validation
implement controller procedure
implement CRUD
implement persistence interaction</code></pre>

toward:

<pre class="r2wx-exhibit"><code>NEW ENTITY
    │
    ▼
describe / attach entity
    │
    ▼
existing infrastructure
interprets the description
    │
    ▼
recurring procedure already available</code></pre>

There is an important boundary here.

R2WX does not generate an entire application from a scheme.

Entities still need to be instantiated and wired into the system.

Folders, routes, references and entity-specific configuration still exist.

The reduction is in implementation, not existence.

**R2WX reduces repeated implementation. It does not eliminate application instantiation.**

**Implementation evidence — implementation reduced, instantiation retained**

<pre class="r2wx-exhibit"><code>@Controller(path)
export class SamxController extends BaseController {
    constructor(service: SamxService) {
        super(service, type, api);
    }
}

@Injectable()
export class SamxService extends BaseService {
    constructor(db: DbService) {
        super(db, entity);
    }
}</code></pre>

That distinction matters because otherwise schema-driven infrastructure can easily be mistaken for application generation.

That is not what this artifact demonstrates.

## Different entities can now exercise the same machinery

Once recurring procedure moves downward into infrastructure, entity differences stop requiring entirely different execution paths.

Conceptually:

<pre class="r2wx-exhibit"><code>                     COMMON DNA
                         │
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
           SAM         SAM-X       another entity
             │           │           │
             └───────────┼───────────┘
                         ▼
                  shared machinery</code></pre>

The visible entity can change.

Its fields can change.

Its representation can change.

Yet substantial portions of form handling, validation, controller behavior and persistence procedure remain the same.

This is where R2WX's crud-application character is useful—but also where it can be misleading if treated as the purpose of the artifact.

CRUD provides a highly repetitive environment.

That makes it an effective place to ask:

Which parts of application work genuinely change between entities, and which parts are developers repeatedly implementing because the infrastructure has not absorbed them yet?

In R2WX, CRUD became the practical foundation on which that question could be exercised.

## But automation creates its own battle

By this point, the direction looks attractive:

<pre class="r2wx-exhibit"><code>Repeated knowledge
       ↓
Shared knowledge
       ↓
Repeated procedure
       ↓
Shared procedure
       ↓
less repeated implementation</code></pre>

Keep following that direction and an obvious temptation appears:

If automating this much helped...

why not automate the rest?

That is where the next problem begins.

Because applications eventually do something that does not fit the ordinary path.

A particular form needs a different representation.

A submit operation needs to prepare data differently.

An entity requires behavior that the generic procedure did not anticipate.

And suddenly the infrastructure that removed repetitive work can begin creating a different kind of work:

<pre class="r2wx-exhibit"><code>APPLICATION NEED
      │
      ▼
GENERIC PROCEDURE
      │
   doesn&#x27;t fit
      │
      ▼
fight the abstraction</code></pre>

That is a battle R2WX does not try to solve by making the abstraction increasingly absolute.

It deliberately leaves somewhere for the developer to intervene.

So the next question is no longer:

How much recurring work can infrastructure absorb?

It becomes:

How much should it absorb before the infrastructure itself starts getting in the developer's way?

---
[Continue →](04-specialization.md)