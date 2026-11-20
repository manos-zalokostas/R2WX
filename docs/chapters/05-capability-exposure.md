# 05 — When Inheritance Started Giving Too Much

default-deny · least-privilege · access-control · api-design · separation-of-concerns

## THE BATTLE

Reusable base classes are useful precisely because they give extending classes capabilities they no longer have to implement themselves.

But inheritance is generous.

**Implementation evidence — capability exists in the base**

<pre class="r2wx-exhibit"><code>// BaseController.ts

export class BaseController {
    @Get()
    async get(@Req() req: RequestAuthz) {
        this._assureEndpointAccessible(
            HTTP.GET,
            PATH._,
            req.userAccess
        );

        const data = await this.service.findMany();
        return { data };
    }

    // @Get(PATH.ID) ...
    // @Post(PATH.MULTI) ...
    // @Put(PATH.ID) ...
    // @Delete(PATH.MULTI_ID) ...
}</code></pre>

As the base grows, every extending controller receives more machinery:

GET · POST · PUT · DELETE · ...

An entity may need only some of it.

Now the developer has another responsibility: remember which inherited capabilities should actually be available, and restrain the ones that should not.

This is a different problem from Section 4.

There, R2WX wanted the developer to remain free to leave the generic procedure when the application required something different.

Here, the concern runs in the opposite direction:

Reusable infrastructure can provide more capability than the application intends to expose.

The machinery is useful.

Automatic exposure of everything the machinery knows how to do is not.

## A base controller naturally accumulates capability

As recurring CRUD procedure moves into BaseController, its value increases because more controllers can inherit the same implementation.

Conceptually:

<pre class="r2wx-exhibit"><code>                  BaseController
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
       GET            POST        PUT / DELETE
        │              │              │
        └──────────────┼──────────────┘
                       │
                    inherited
                       │
                       ▼
                Entity Controller</code></pre>

That solves the implementation problem.

The entity controller does not have to recreate those operations.

But there are now two different questions hiding inside what initially looks like one decision:

Can this controller perform the operation?

and:

Should this entity API expose the operation?

Inheritance answers the first.

R2WX refuses to let inheritance automatically answer the second.

## Inherit the machinery. Expose nothing by inheritance alone.

The backend configuration introduced earlier now becomes more significant.

An entity can declare the API operations it intends to expose:

**Implementation evidence — exposure is explicitly admitted**

<pre class="r2wx-exhibit"><code>// stat_owner/config.ts

export const api = {
    GET: {
        [PATH._]: [ACCESS.GLOB]
    }

    // ...
};

// StatOwner.controller.ts

@Controller(path)
export class StatOwnerController extends BaseController {
    constructor(service: StatOwnerService) {
        super(service, type, api);
    }
}

api: {
    GET: {
        [PATH._]: [ACCESS.GLOB]
    }
}</code></pre>

There is no corresponding declaration here for POST, PUT or DELETE.

That absence matters.

It does not mean:

<pre class="r2wx-exhibit"><code>POST exists publicly
      │
developer remembered
to disable it
      │
      ▼
POST disabled</code></pre>

Instead:

<pre class="r2wx-exhibit"><code>BaseController can perform POST
             │
             ▼
Entity API never declares POST
             │
             ▼
          SEALED</code></pre>

Nothing needs to be written to switch that operation off.

It was never switched on.

## Capability and exposure became separate decisions

That gives R2WX a simple rule:

<pre class="r2wx-exhibit"><code>Inherited + declared      → EXPOSED

Inherited + not declared  → SEALED</code></pre>

Or structurally:

<pre class="r2wx-exhibit"><code>                BaseController
           GET · POST · PUT · DELETE
                       │
                       │ inheritance
                       ▼
                 Entity Controller
                       │
                 declares GET
                       │
              ┌────────┴─────────┐
              ▼                  ▼
             GET          POST · PUT · DELETE
          EXPOSED               SEALED</code></pre>

The reusable implementation can therefore remain broad while the concrete API surface remains narrow.

<pre class="r2wx-exhibit"><code>Capability ≠ Exposure</code></pre>

This is the point at which default-deny becomes a precise description of the mechanism.

Possessing an implementation does not grant exposure.

A positive declaration does.

## The rule is enforced, not merely documented

A configuration convention would be much weaker if every controller implementation still depended on the developer remembering to respect it.

R2WX places the check in shared controller procedure.

The request path goes through the assurance machinery:

**Implementation evidence — exposure first, authorization second**

<pre class="r2wx-exhibit"><code>// BaseController.ts

_assureEndpointAccessible(
    verb = HTTP.GET,
    path = PATH.ID,
    userAccess = ACCESS.GLOB
) {
    this._assureEndpointExposed(verb, path);
    this._assureUserAuthorized(verb, path, userAccess);
}

_assureEndpointExposed(verb = HTTP.GET, path = PATH.ID) {
    if (!(verb in this.api))
        throw ERR.VERB;

    const paths = Object.keys(this.api[verb]);

    if (!paths.includes(path))
        throw ERR.PATH;
}

_assureUserAuthorized(...) {
    ...
}

this._assureEndpointAccessible(verb, path, req.userAccess);</code></pre>

with endpoint exposure verified through:

<pre class="r2wx-exhibit"><code>this._assureEndpointExposed(verb, path);</code></pre>

Conceptually:

<pre class="r2wx-exhibit"><code>Incoming operation
       │
       ▼
Does this entity expose it?
       │
   ┌───┴───┐
   │       │
  NO      YES
   │       │
   ▼       ▼
 SEALED   continue
             │
             ▼
       may this caller
          use it?</code></pre>

This also separates another pair of questions that can easily become entangled:

Does this API provide the operation at all?

from:

Who is allowed to use it?

Exposure and authorization are related security concerns.

They are not the same decision.

## The developer now declares what is wanted, not what must be removed

Compare the maintenance burden.

A permissive inheritance model can leave the developer thinking:

<pre class="r2wx-exhibit"><code>inherit capability
       │
       ▼
inspect what arrived
       │
       ▼
identify what this API
should not provide
       │
       ▼
restrain it</code></pre>

R2WX reverses the direction:

<pre class="r2wx-exhibit"><code>inherit capability
       │
       ▼
declare what this API
actually wants
       │
       ▼
everything else
remains sealed</code></pre>

This is why least-privilege is relevant here, but only in a specific sense.

R2WX is not claiming that inheritance itself disappears or that unused implementation is physically removed from the controller hierarchy.

The underlying reusable machinery can still exist.

The restriction concerns the API surface:

**Reusable implementation can be inherited broadly while exposure is granted narrowly.**

That is the boundary of the claim.

## Implementation ownership and exposure ownership separate

This also returns us to the ownership problem from Section 2.

BaseController owns reusable procedure:

HOW does GET work?

HOW does POST work?

HOW does PUT work?

HOW does DELETE work?

The entity/application configuration owns a different question:

WHICH of these operations

belong to this API?

Those responsibilities do not have to live together.

<pre class="r2wx-exhibit"><code>             BaseController
                   │
                   │ owns
                   ▼
         operation implementation


             config.ts
                   │
                   │ owns
                   ▼
             API exposure</code></pre>

So another R2WX distinction emerges:

<pre class="r2wx-exhibit"><code>Implementation ownership ≠ Exposure ownership</code></pre>

This is another concrete case of separation-of-concerns.

Sharing the implementation does not require sharing—or surrendering—the decision to expose it.

## Growth no longer automatically expands every API

This becomes more important as shared infrastructure evolves.

Suppose BaseController gains another reusable capability.

Without an explicit admission boundary:

<pre class="r2wx-exhibit"><code>BaseController grows
        │
        ▼
controllers inherit more
        │
        ▼
application must determine
whether new capability escaped
into places that never asked for it</code></pre>

With R2WX's exposure rule:

<pre class="r2wx-exhibit"><code>BaseController grows
        │
        ▼
controllers inherit machinery
        │
        ▼
existing API declarations
do not change
        │
        ▼
new capability remains sealed
until explicitly admitted</code></pre>

That changes the direction of responsibility.

The developer does not have to continuously defend the API against everything reusable infrastructure learns how to do.

The API describes what it accepts into its surface.

## This is where configuration becomes authority

Earlier, config.ts appeared simply as backend-owned interpretation around shared application knowledge.

Now one part of it acquires a stronger meaning:

<pre class="r2wx-exhibit"><code>api: {
    ...
}</code></pre>

This is not merely convenient metadata about the controller.

It participates in deciding what inherited capability becomes externally available.

The progression we've followed now becomes visible:

<pre class="r2wx-exhibit"><code>Shared Scheme
     │
     ▼
backend interpretation
     │
     ▼
config.ts
     │
     ├── operational context
     │
     └── API declaration
              │
              ▼
       exposure decision</code></pre>

So configuration-driven in R2WX is not simply “behavior happens to live in configuration files.”

Configuration can own decisions that reusable procedure must obey.

## The developer gets the machinery without inheriting the exposure burden

We started with a familiar attraction:

Put recurring CRUD operations into a base controller so they do not have to be implemented repeatedly.

That gives:

<pre class="r2wx-exhibit"><code>Reusable implementation
          │
          ▼
Inherited capability</code></pre>

R2WX adds another boundary before that capability becomes part of an API:

<pre class="r2wx-exhibit"><code>Reusable implementation
          │
          ▼
Inherited capability
          │
          ▼
Explicit API declaration
          │
          ▼
Exposure check
          │
          ▼
Accessible API surface</code></pre>

And that produces the developer-facing consequence:

Get the reusable machinery. Carry only the responsibility of declaring what should be exposed.

The infrastructure can grow.

The entity can inherit.

Neither event alone expands the public API.

## But exposure is only one boundary

At this point R2WX has separated:

<pre class="r2wx-exhibit"><code>implementation
      │
      ≠
capability
      │
      ≠
exposure
      │
      ≠
authorization</code></pre>

The next battle goes deeper than deciding whether an endpoint exists or which role may call it.

A browser user is interacting with the frontend.

The frontend is crossing into another service.

The backend needs to know whether that caller is trusted.

It would be easy to treat all of those as one identity moving unchanged through the system.

R2WX does not.

The human user's authority terminates at one boundary.

A different identity crosses the next.

So the next question becomes:

When a request crosses from a human-facing application into a protected core API, whose identity should actually cross that boundary?

That takes us into the BFF and R2WX's separation of human authorization from service authorization.

---
[Continue →](06-identity-boundaries.md)