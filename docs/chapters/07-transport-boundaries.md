# 07 — When the Boundary Started Doing Too Much Work

http-streaming · multipart · schema-driven · dynamic-configuration · extension-points

## THE BATTLE

Put a BFF between the browser and the backend and every request now has somewhere else to pass through.

For a small JSON payload, that hardly attracts attention.

Then the form contains files.

The browser sends multipart data. The BFF can parse it, materialize the files and fields, reconstruct another request, and send everything to the backend.

But if the BFF does not actually need to understand that payload, all of that work exists only because the request happened to cross the BFF.

This is a familiar danger when infrastructure gains responsibility.

A boundary introduced for one reason can quietly start accumulating work unrelated to that reason.

In R2WX, the BFF has important responsibilities around the browser-facing trust boundary.

That does not mean it should automatically become the owner of every payload passing through it.

So the transport path needed to adapt without dismantling the boundary itself.

## Keep the boundary. Stop unnecessarily materializing the payload.

For multipart forwarding, R2WX uses the incoming request body directly when proxying toward NestJS:

<pre class="r2wx-exhibit"><code>fetch(url, {
    method,
    body: request.body,
    duplex: &quot;half&quot;
});</code></pre>

The significant part is what does not happen first.

The BFF does not need to:

<pre class="r2wx-exhibit"><code>receive multipart
       │
       ▼
parse fields and files
       │
       ▼
materialize payload
       │
       ▼
construct new FormData
       │
       ▼
send reconstructed payload</code></pre>

The path can instead remain:

<pre class="r2wx-exhibit"><code>Browser
   │
   │ multipart body
   ▼
BFF
   │
   │ stream passthrough
   ▼
NestJS
   │
   ▼
multipart handling</code></pre>

The BFF remains in the request path.

Its security and routing responsibilities remain.

But it does not take ownership of multipart interpretation merely because the bytes cross its boundary.

**Implementation evidence — forward the body without parsing it**

<pre class="r2wx-exhibit"><code>return fetch(this.url(path, ENV_DATASERVER), {
    headers: ...,
    body: request.body,
    method,
    duplex: &#x27;half&#x27;
});</code></pre>

**Crossing a component does not require becoming that component's responsibility.**

This is the concrete R2WX basis for http-streaming here.

The claim should remain precise: the unparsed request body is forwarded as a stream, avoiding multipart parsing and FormData reconstruction in the frontend container.

It does not establish that no buffering can occur anywhere in the complete network/runtime stack.

## The form should not need to decide transport manually either

**Implementation evidence — default form machinery chooses representation**

<pre class="r2wx-exhibit"><code>const _resolveFormData = () =&gt; {
    return document.querySelector(&#x27;input[type=file]&#x27;)
        ? makeMultipartForm()
        : collectFormData();
};</code></pre>

The same problem appears one step earlier.

A conventional form may contain only scalar values:

<pre class="r2wx-exhibit"><code>name
email
active</code></pre>

Another may contain:

<pre class="r2wx-exhibit"><code>name
description
file</code></pre>

The presence of a file changes how the request must be represented.

Without shared handling, application code begins accumulating transport decisions:

<pre class="r2wx-exhibit"><code>Does this form contain files?
        │
   ┌────┴────┐
  NO        YES
   │          │
 JSON      FormData
   │          │
   └────┬─────┘
        ▼
     request</code></pre>

There is nothing intellectually difficult about writing this.

That is exactly why it is a good candidate for infrastructure.

It is recurring work whose answer can be derived from the form being submitted.

R2WX's default form resolution collects the values, normalizes them, identifies file inputs and prepares the appropriate payload.

Conceptually:

<pre class="r2wx-exhibit"><code>                 Form
                  │
                  ▼
          shared resolution
                  │
       collect / normalize
                  │
             files?
           ┌──────┴──────┐
           │             │
          NO            YES
           │             │
           ▼             ▼
          JSON        FormData
           │             │
           └──────┬──────┘
                  ▼
               request</code></pre>

The application doesn't need to repeatedly implement the ordinary transport decision.

This is automatic JSON/multipart selection.

It is not HTTP content negotiation.

The client-side machinery is selecting an appropriate request representation from the actual form payload.

## And the escape hatch from Section 4 still survives

Automation is useful until this particular submission does not fit the default derivation.

That is why the earlier $action.submit intervention point matters again.

<pre class="r2wx-exhibit"><code>                Form
                 │
          validity checking
                 │
                 ▼
          $action.submit
                 │
        ┌────────┴────────┐
        ▼                 ▼
 default derivation   custom preparation
        │                 │
        └────────┬────────┘
                 ▼
          transport path</code></pre>

We no longer need to explain the entire extension mechanism.

Section 4 already did that work.

Here it demonstrates progressive loading:

Transport automation is available without making automatic payload derivation compulsory.

The infrastructure can solve the ordinary transport problem while leaving the application somewhere to intervene when the payload has different requirements.

## File handling pushes application knowledge into transport infrastructure

Once the request reaches NestJS, multipart handling has another practical requirement.

File size limits have to be established before ordinary application validation can simply inspect an accepted payload.

One option would be another independent configuration:

Scheme says:

file max = X

Multer config says:

file max = Y

Now we have returned to the battle from Section 1.

The same application rule has acquired another independently maintained representation.

R2WX instead derives the applicable Multer fileSize limit at runtime from the active entity scheme's file-size rules.

**Implementation evidence — scheme rules reach multipart configuration**

<pre class="r2wx-exhibit"><code>const { ruleFile } = this._splitRules();

await this.svMulter.processHttp(
    req,
    res,
    ruleFile
);

const fields = Object.values(rules);

const maxSchemaSize =
    Math.max(...fields.map(field =&gt; field.size));

const upload = multer({
    dest: ...,
    limits: { fileSize: maxSchemaSize }
});

...

Active entity scheme
        │
        ▼
file-size rules
        │
        ▼
derive applicable maximum
        │
        ▼
Multer fileSize
        │
        ▼
multipart ingestion</code></pre>

The same knowledge describing what files the application accepts now participates in configuring the infrastructure that receives them.

Application knowledge reaches the transport boundary before the payload does.

That is the interesting part of the mechanism.

It is not dynamically resizing physical infrastructure.

It is not changing memory allocation.

It is schema-derived multipart configuration.

And once again the developer is relieved of another synchronization point:

<pre class="r2wx-exhibit"><code>acceptable file size
        │
        ├── application validation
        │
        └── multipart ingestion limit</code></pre>

Both can originate from the same application knowledge.

## Requiredness changes meaning when a file already exists

Files expose another battle that ordinary scalar fields can hide.

Suppose an entity requires a file.

During creation:

<pre class="r2wx-exhibit"><code>required file
     │
     ▼
no file supplied
     │
     ▼
invalid</code></pre>

Straightforward.

Now edit an existing entity.

The entity already has its required file.

Should opening the edit form force the developer or user to upload that file again merely because the field is structurally required?

No.

The entity requirement and the interaction requirement are no longer identical.

<pre class="r2wx-exhibit"><code>ENTITY REQUIREMENT

entity must have a file
          │
          ≠
          │
INTERACTION REQUIREMENT

every edit must supply
a replacement file</code></pre>

R2WX's file-input handling recognizes this distinction in its update behavior.

**Implementation evidence — runtime interaction modifies requiredness**

<pre class="r2wx-exhibit"><code>{@const { value, ...inputCurr } = input}

&lt;input
    {...inputCurr}
    required={input.value ? false : inputCurr.required}
    ...
/&gt;</code></pre>

That gives us another useful finding:

<pre class="r2wx-exhibit"><code>Entity requiredness ≠ interaction requiredness</code></pre>

The entity can require the resource to exist while an update interaction requires a new file only when replacement is actually intended.

Again, one word—required—does not automatically mean the same thing at every layer.

Context determines which responsibility is being exercised.

## Some schemes need information that does not exist until runtime

Not every valid form option can be known statically.

A select field may depend on records currently stored in the database.

Hardcoding those values into the scheme would make the declaration stale.

Requiring every form to independently fetch and assemble them would reintroduce recurring procedure.

R2WX allows backend configuration to specify runtime option loading through _option.

The backend can use the appropriate service to retrieve the current records and enrich the working scheme representation.

**Implementation evidence — runtime data enriches the working scheme**

<pre class="r2wx-exhibit"><code>async _loadSchemeOptions(dict) {
    const deps = await Promise.all(
        Object.values(dict).map(
            sv =&gt; sv.findMany({})
        )
    );

    const schemeNext = {
        ...this.scheme,
        ...Object.entries(dict).reduce((acc, [key, sv], i) =&gt; {
            acc[key] = {
                ...this.scheme[key],
                [&#x27;data-options&#x27;]: deps[i].map(({ id }) =&gt; id)
            };

            return acc;
        }, {})
    };

    return schemeNext;
}

           Scheme
             │
      declares field shape
             │
             ▼
        backend runtime
             │
          _option
             │
             ▼
       service.findMany()
             │
             ▼
       current DB values
             │
             ▼
      enriched working scheme
             │
             ▼
            form</code></pre>

This is where the independently materialized scheme graphs from Section 1 become important again.

The runtime can enrich the working representation without mutating the canonical scheme definition or another consumer's materialized representation.

<pre class="r2wx-exhibit"><code>Canonical Scheme
       │
       ▼
materialized working graph
       │
       ▼
runtime enrichment
       │
       ▼
DB-backed options</code></pre>

We introduced the clone mechanism earlier.

Now we see one reason that independence becomes useful.

## Static definition and runtime reality can cooperate

Dynamic options reveal a broader distinction.

Some application knowledge is stable enough to declare:

<pre class="r2wx-exhibit"><code>field type
requiredness
bounds
option source</code></pre>

But the actual values may belong to current runtime state:

<pre class="r2wx-exhibit"><code>customer records
projects
categories
other DB-backed values</code></pre>

Trying to force both into static configuration would confuse two different kinds of knowledge.

R2WX instead allows:

<pre class="r2wx-exhibit"><code>STATIC KNOWLEDGE
&quot;What kind of field is this?&quot;
&quot;What source does it need?&quot;
        │
        ▼
RUNTIME PROCEDURE
&quot;Load the current values.&quot;
        │
        ▼
WORKING REPRESENTATION</code></pre>

That makes dynamic-configuration useful here in a limited sense.

The canonical description can remain stable while a runtime-specific working representation acquires information that only the running application can know.

## Several earlier decisions now meet in one request

A multipart update can therefore cross much of what we've already established:

<pre class="r2wx-exhibit"><code>Shared application scheme
          │
          ▼
Frontend interpretation
          │
          ▼
Form machinery
          │
          ├── existing values
          ├── runtime-loaded options
          └── file interaction
          │
          ▼
Automatic payload preparation
          │
          ▼
       FormData
          │
          ▼
    SvelteKit BFF
          │
    stream passthrough
          │
          ▼
      NestJS API
          │
 schema-derived Multer limit
          │
          ▼
 file + scalar validation
          │
          ▼
    shared procedure</code></pre>

This is why transport deserves its own exploration topic.

It isn't an isolated file-upload feature.

It is where several earlier decisions are forced to cooperate under actual runtime conditions.

Shared knowledge.

Runtime-specific interpretation.

Reusable procedure.

Extension points.

Trust boundaries.

Transport.

They all meet when real data starts moving.

## The boundary remains strict while the interior adapts

The developer-facing pattern now looks familiar.

R2WX does not require every application operation to manually decide:

JSON or multipart?

How do I collect it?

How do I proxy it?

How large may the file be?

How do I populate dynamic options?

Does required mean replacement?

Recurring answers move into infrastructure.

But the application still has intervention points when the default procedure does not fit.

So the transport layer reinforces something Section 4 already exposed:

**The interior can adapt. The receiving boundary still decides what it accepts.**

The path can change.

The representation can change.

Runtime knowledge can enrich the working structure.

A custom submit can replace automatic preparation.

But when the request reaches the backend, backend acceptance still applies.

## And eventually consolidation reaches a boundary it deliberately does not absorb

Across the article so far, R2WX has repeatedly moved recurring knowledge or procedure into shared infrastructure:

<pre class="r2wx-exhibit"><code>field knowledge
      ↓
form behavior
      ↓
validation
      ↓
CRUD procedure
      ↓
API exposure
      ↓
transport configuration</code></pre>

At this point, it would be natural to ask:

If the application already knows so much about its entities, why not let that knowledge become the final authority all the way down?

Why maintain another model in Prisma?

Why tolerate another alignment point between application schemes and persistence?

Why not generate one directly from the other?

R2WX deliberately stops.

And that final refusal is important because it reveals that removing duplication was never an absolute rule.

The last exploration topic is therefore:

When Consolidation Stopped at Persistence

R2WX finally encounters a repeated representation it chooses to keep.

Because at that boundary, independence is no longer treated merely as duplication.

It becomes protection.

---
[Continue →](08-persistence-authority.md)