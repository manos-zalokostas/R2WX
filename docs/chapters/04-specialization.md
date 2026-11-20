# 04 — When Automation Started Fighting the Application

extensible-architecture · extension-points · controlled-specialization · form-lifecycle

## THE BATTLE

Automation feels successful while the application keeps asking for things the automation already understands.

Then one requirement doesn't fit.

A form needs a different structure. A submission needs data prepared differently. An entity needs additional procedure around the ordinary path.

At that point, highly automated infrastructure can create an uncomfortable choice:

duplicate the machinery outside the abstraction, or keep modifying the abstraction until one exceptional requirement becomes everybody's concern.

This was not a theoretical risk for the direction R2WX was taking.

Section 3 showed the attraction clearly:

<pre class="r2wx-exhibit"><code>describe recurring knowledge
          ↓
reuse recurring procedure
          ↓
write less application code</code></pre>

But that direction has a dangerous endpoint:

<pre class="r2wx-exhibit"><code>more automation
      ↓
more assumptions
      ↓
more cases forced through those assumptions
      ↓
the infrastructure starts deciding
what the application is allowed to be</code></pre>

I had already encountered the result of pushing automation too far.

The infrastructure that was supposed to remove repetitive work could become a personal prison: efficient while the application remained inside its assumptions, increasingly resistant when it did not.

That produced a deliberate rule for R2WX:

**Never try to automate everything.**

The remaining space was not unfinished automation.

It was reserved intervention space.

## The 75/25 direction

R2WX therefore works toward an approximate division:

<pre class="r2wx-exhibit"><code>┌─────────────────────────────────────────────────────┐
│                                                     │
│      ~75% recurring application procedure           │
│             shared infrastructure                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│      ~25% application-specific procedure            │
│             intervention / extension                │
│                                                     │
└─────────────────────────────────────────────────────┘</code></pre>

The numbers are not measurements.

They are not a required ratio for every application.

They describe the engineering target:

Let infrastructure absorb the dominant recurring path while deliberately preserving room for application-specific procedure.

As an application deviates further from the recurring path, the shared proportion can decrease.

Nothing requires an application to manufacture itself into the 75%.

The important part of 75/25 is therefore not 75.

It is the refusal to eliminate the 25.

## The first escape is representational

The frontend makes this visible through Generic and Custom forms.

**Implementation evidence — generic representation and custom composition**

<pre class="r2wx-exhibit"><code>&lt;!-- R2wxFormGeneric.svelte --&gt;

&lt;form class=&quot;r2wx-form&quot;&gt;
    {#each Object.values($active.form) as attr}
        &lt;R2wxFieldsetInput id={attr.id}/&gt;
    {/each}
&lt;/form&gt;

&lt;!-- R2wxFormCustom.svelte --&gt;

&lt;form class=&quot;r2wx-form&quot;&gt;
    &lt;slot/&gt;
&lt;/form&gt;

&lt;R2wxFormCustom ctx={{ uri: ... }}&gt;
    &lt;R2wxFieldsetInput id=&quot;name&quot;/&gt;
    &lt;R2wxFieldsetInput id=&quot;number&quot;/&gt;
    ...
&lt;/R2wxFormCustom&gt;</code></pre>

When the ordinary representation is sufficient, generic machinery can construct the form from the application knowledge already available:

<pre class="r2wx-exhibit"><code>Scheme
   │
   ▼
Generic representation
   │
   ▼
shared form lifecycle</code></pre>

But representation itself can be application-specific.

R2WX therefore also allows:

<pre class="r2wx-exhibit"><code>Scheme
   │
   ▼
Custom representation
   │
   ▼
shared form lifecycle</code></pre>

The distinction is important.

Generic does not mean 75%.

Custom does not mean 25%.

They are one concrete place where the broader design becomes visible.

Both can participate in the same surrounding machinery.

<pre class="r2wx-exhibit"><code>                 shared form state
                        │
              shared field behavior
                        │
               shared submission
                        │
                 shared lifecycle
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
           Generic              Custom
       representation       representation</code></pre>

The application can therefore reject the generic representation without having to reject the entire infrastructure surrounding it.

That is the first important property of the escape hatch:

**Specializing one layer does not automatically require abandoning every shared layer around it.**

## Sometimes the form is fine and the procedure is not

Another requirement may fit the ordinary form perfectly but need different preparation before submission.

Without an intervention point, the choices become poor:

<pre class="r2wx-exhibit"><code>ordinary form works
        │
        ▼
default submit does not
        │
   ┌────┴────┐
   ▼         ▼
rewrite    modify generic
whole flow machinery for
           one exception</code></pre>

R2WX exposes $action.submit as an intervention point.

The default path can resolve form data, normalize it and choose the appropriate request preparation.

But application code can replace the automatic payload derivation when necessary and still continue through the surrounding submission lifecycle.

**Implementation evidence — replace payload derivation, retain the submission path**

<pre class="r2wx-exhibit"><code>if ($action.submit)
    data = $action.submit();

res = await formPost({ uri, data });

export const formPost = async (ctx) =&gt; {
    if (!canSubmit())
        return formReport();

    const data = ctx.data || _resolveFormData();

    return httpClient.post(ctx.uri, data);
};</code></pre>

Conceptually:

<pre class="r2wx-exhibit"><code>             shared form lifecycle
                      │
              validity checking
                      │
                      ▼
              $action.submit()
                      │
              ┌───────┴───────┐
              ▼               ▼
           default          custom
          resolution       preparation
              │               │
              └───────┬───────┘
                      ▼
              existing transport
                      │
                      ▼
                existing flow</code></pre>

The developer does not have to choose between:

accept all automation

and:

abandon all automation.

The intervention can happen at the depth where the application actually differs.

## That creates several depths of participation

Across materially different parts of R2WX, the same broad pattern appears.

Sometimes the shared procedure can simply be accepted.

Sometimes existing capabilities can be composed differently.

Sometimes part of the ordinary procedure can be replaced.

**Implementation evidence — override one backend procedure**

<pre class="r2wx-exhibit"><code>export class UserService extends BaseService {
    constructor(db: DbService, private svId: IdentifierService) {
        super(db, entity);
    }

    override async create(entry) {
        return this.model.create({
            data: {
                email: entry.email,
                password: await this.svId.argon2Hash(entry.pass)
            }
        });
    }

    // findFirst(...) ...
}

                APPLICATION NEED
                       │
                       ▼
               Does default fit?
                       │
             ┌─────────┴─────────┐
            YES                  NO
             │                    │
             ▼                    ▼
           ADOPT             Can existing
                            pieces compose?
                                  │
                         ┌────────┴────────┐
                        YES               NO
                         │                 │
                         ▼                 ▼
                      COMPOSE           REPLACE
                                          │
                                   procedural interior</code></pre>

These are not three formal R2WX APIs bearing those names.

They are a useful way of describing the different depths of intervention visible across the implementation.

That distinction matters.

The graduated freedom exists in the artifact.

The three-level model is a way of understanding it.

## But freedom stops at the receiving boundary

An escape hatch cannot mean:

custom code is exempt from the system.

If application-specific procedure ultimately sends data to a backend boundary, that boundary still decides what it accepts.

If persistence receives data, its own constraints still apply.

So the complete picture is not:

<pre class="r2wx-exhibit"><code>AUTOMATION
    ↓
ESCAPE
    ↓
anything goes</code></pre>

It is:

<pre class="r2wx-exhibit"><code>        shared procedure
               │
               ▼
        ┌──────────────┐
        │ intervention │
        │    space     │
        └──────┬───────┘
               │
        application-specific
            procedure
               │
               ▼
        receiving boundary
               │
               ▼
       acceptance still applies</code></pre>

This gives R2WX an important distinction:

**An exception to procedure is not an exception to correctness.**

**Implementation evidence — custom procedure still meets the receiving boundary**

<pre class="r2wx-exhibit"><code>@Post(&quot;authenticate&quot;)
async authenticate(@Body() data, @Req() req: RequestAuthz) {
    this._assureEndpointAccessible(
        HTTP.POST,
        PATH._,
        req.userAccess
    );

    this._assureDataValid(data, VALID.STRICT);

    return this.service.findFirst(data);
}</code></pre>

A custom interior may choose another route to the boundary.

It does not acquire the authority to redefine that boundary merely because it stopped using the default procedure.

## The developer keeps somewhere to stand

This changes the role of automation.

Without extension space:

<pre class="r2wx-exhibit"><code>Developer
    │
    ▼
Automation
    │
    ├── fits     → productive
    │
    └── doesn&#x27;t  → fight infrastructure</code></pre>

With controlled intervention:

<pre class="r2wx-exhibit"><code>Developer
    │
    ▼
Shared infrastructure
    │
    ├── adopt
    │
    ├── compose
    │
    └── replace where necessary
             │
             ▼
      rejoin appropriate
          boundary</code></pre>

The infrastructure can continue removing repetitive implementation without claiming ownership over every possible application procedure.

This is where extensible-architecture and extension-points become useful descriptions.

But again, the concepts follow the development problem.

The original question was simpler:

How can recurring work disappear without making exceptional work harder than it was before?

R2WX's answer was not to weaken the shared machinery.

It was to preserve controlled places where the developer can stop following it.

## The 25% is therefore not failure

This is perhaps the most important part of the 75/25 idea.

A conventional automation metric might interpret this:

75% automated

25% handwritten

and ask:

Why isn't the remaining 25% automated yet?

R2WX asks a different question:

Does automating that remaining procedure still remove repetition, or has automation started removing useful freedom?

That makes the non-automated space deliberate.

<pre class="r2wx-exhibit"><code>Recurring problem
      │
      ▼
worth absorbing?
      │
     YES
      │
      ▼
shared infrastructure


Application-specific difference
      │
      ▼
worth generalizing?
      │
   NOT ALWAYS
      │
      ▼
preserve intervention</code></pre>

The target is not maximum automation.

It is useful automation without captivity.

The amount of infrastructure R2WX can provide is not the amount the application is required to accept.

## And then another problem appeared

Preserving developer freedom solves the problem of over-automation.

But reusable infrastructure continues accumulating capability.

BaseController, for example, can know how to perform several operations.

Different entity controllers inherit that machinery.

Now a different question appears:

<pre class="r2wx-exhibit"><code>BaseController
GET · POST · PUT · DELETE
        │
        │ inheritance
        ▼
Entity Controller</code></pre>

The application may want the implementation.

That does not necessarily mean its API should expose everything that arrived with it.

So after fighting one danger:

shared procedure becoming compulsory procedure

R2WX encounters another:

shared capability becoming exposed capability.

And that moves us directly into the next battle:

When Inheritance Started Giving Too Much

where the distinction becomes:

Inheritance supplies capability. Configuration grants exposure.

---
[Continue →](05-capability-exposure.md)