# 06 — When One User Request Became Two Different Identities

backend-for-frontend · security-boundaries · custom-authentication · stateless-authentication · access-control · separation-of-concerns

## THE BATTLE

Authentication often begins simply.

A user logs in. The application knows who that user is. The user makes a request. The request eventually reaches the backend.

Then the system acquires another boundary:

<pre class="r2wx-exhibit"><code>Browser → Frontend/BFF → Core API</code></pre>

Now a deceptively simple question appears:

Whose identity is actually crossing each boundary?

The human is authenticated to the application.

But the service calling the protected backend is the BFF.

Treat those as the same identity and two different trust relationships begin collapsing into one.

R2WX keeps them separate.

The browser-facing side establishes and carries the human relationship.

The core API receives a request from a trusted service.

That creates two authorization problems rather than one authorization mechanism stretched across the whole topology.

## The human authenticates to the application

The login begins with ordinary user credentials.

Those credentials ultimately reach backend authentication logic, where the stored user is retrieved and the password is verified using Argon2id.

**Implementation evidence — human credentials are verified**

<pre class="r2wx-exhibit"><code>override async findFirst(...) {
    const user = await this.model.findFirst(...);
    if (!user) throw &#x27;NOUSER&#x27;;

    const isAuthentic = await this.svId.argon2HashCompare(...);
    if (!isAuthentic) return null;

    delete user.password;
    return user;
}

Browser
   │
   │ credentials
   ▼
SvelteKit / BFF
   │
   ▼
NestJS authentication
   │
   ├── user lookup
   ├── Argon2id verification
   └── application access</code></pre>

Successful authentication gives the BFF what it needs to establish the browser-facing relationship.

R2WX then uses its own stateless signed ticket rather than introducing a server-side session store for the examined flow.

**Implementation evidence — ticket construction topology**

<pre class="r2wx-exhibit"><code>create(...) {
    const signature = this.makeDeviceSignature(...);

    return this.makeTicket(..., signature);
}

makeTicketContent(x) {
    const verificationHash = this.makeVerificationHash(...);

    return [x, ..., verificationHash];
}

makeTicket(...) {
    ...
}

makeDeviceSignature(...) {
    ...
}</code></pre>

The operational ingredients are intentionally abstracted here. The structure of the mechanism is the evidence required for this discussion.

Conceptually:

<pre class="r2wx-exhibit"><code>authenticated user
       │
       ▼
user/profile information
       │
       ▼
signed ticket
       │
       ├── expiry
       ├── request-context binding
       └── HMAC-SHA256 integrity
       │
       ▼
HttpOnly cookie</code></pre>

The ticket is not a JWT.

Its purpose here is narrower: carry the information required by the frontend-side authentication flow while protecting the ticket against undetected modification.

And because it is signed rather than encrypted:

**Integrity is provided. Confidentiality of the ticket contents is not.**

That distinction matters whenever custom authentication machinery is being inspected.

## The BFF becomes the browser's security boundary

Once authenticated, the browser does not need to carry backend service credentials.

Instead:

<pre class="r2wx-exhibit"><code>                HUMAN USER
                    │
                    ▼
                 Browser
                    │
             signed ticket
                    │
                    ▼
             SvelteKit / BFF
                    │
             human-level authz
                    │
                    ▼
               authorized?</code></pre>

The BFF can reason about the user-facing application profile and decide whether the human request is allowed to proceed.

**Implementation evidence — human authorization remains at the BFF**

<pre class="r2wx-exhibit"><code>accessRole(...) {
    this.access(...);
    if (!this.profile) throw &#x27;ACC|NOPROFILE&#x27;;

    const roleCurr = ...;
    const hasRoleAccess = ...;

    if (!hasRoleAccess) throw &#x27;ACC|NOROLEACC&#x27;;

    return this.profile;
}</code></pre>

That is one trust relationship:

<pre class="r2wx-exhibit"><code>Human identity → BFF authorization</code></pre>

But the request has not yet reached the core API.

Crossing that next boundary requires something different.

## The core API does not receive the human as its service identity

A tempting design would be to keep propagating the human identity downward:

<pre class="r2wx-exhibit"><code>Human
  │
  ▼
Browser
  │
  ▼
BFF
  │
  ▼
Core API
  │
&quot;same identity everywhere&quot;</code></pre>

R2WX instead changes identity at the service boundary.

The BFF calls the protected NestJS API using the credentials and authorization context assigned to the BFF/core relationship.

**Implementation evidence — service identity crosses the next boundary**

<pre class="r2wx-exhibit"><code>const headers = {
    &#x27;Authorization&#x27;: SERVICE_CREDENTIAL,
    &#x27;X-User-Role&#x27;: SERVICE_ROLE,
    ...
};

HUMAN
  │
  ▼
Browser
  │
  ▼
BFF
  │
  │ human authorization ends here
  │
  ├──────────────────────────────
  │      SERVICE BOUNDARY
  ├──────────────────────────────
  │
  │ trusted service identity
  ▼
NestJS Core API</code></pre>

So the second relationship is:

<pre class="r2wx-exhibit"><code>BFF service identity → Core API authorization</code></pre>

**Implementation evidence — the core establishes backend access from the service relationship**

<pre class="r2wx-exhibit"><code>canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // ... service credential verification ...

    const userRole = ...;
    if (!userRole) throw new ForbiddenException(&#x27;NOROLE&#x27;);

    const accessLevel = ...;
    if (!accessLevel) throw new ForbiddenException(&#x27;NOACC&#x27;);

    req.userAccess = accessLevel;

    return true;
}</code></pre>

The backend sees the trusted service relationship rather than treating the browser user's profile as the service credential crossing into the core.

## One request, two questions

This makes the complete path easier to understand:

<pre class="r2wx-exhibit"><code>                 Browser User
                      │
                      ▼
               signed user ticket
                      │
                      ▼
                 SvelteKit BFF
                      │
              ┌───────┴────────┐
              │                │
              ▼                │
       Is this HUMAN           │
       allowed to do this?     │
              │                │
             YES               │
              │                │
              └───────┬────────┘
                      │
               service identity
                      │
                      ▼
                 NestJS API
                      │
                      ▼
             Is this SERVICE
             allowed to enter?</code></pre>

These questions can occur during what the user experiences as one operation.

Architecturally, however, they belong to different boundaries.

That is where backend-for-frontend becomes more than a routing label in R2WX.

The BFF absorbs a trust transition.

## Why not simply forward the human role?

Because the core API and the BFF do not have the same relationship with the human.

The BFF is the human-facing application boundary.

The core API is protected behind it.

Propagating the browser user's application role as though it were the credential establishing trust with the core would collapse:

<pre class="r2wx-exhibit"><code>Who is the human?
       │
       ≠
May the human perform this UI/application operation?
       │
       ≠
Which service is calling the core?
       │
       ≠
May that service enter this backend boundary?</code></pre>

R2WX keeps those questions structurally distinct.

**Human authorization and service authorization are different responsibilities.**

That is another instance of a pattern we've already encountered.

Section 2 separated shared application knowledge from runtime-owned interpretation.

Section 5 separated inherited capability from API exposure.

Here:

User identity is separated from service identity.

Again, sharing a request path does not require collapsing the responsibilities encountered along that path.

## The custom ticket solves a specific problem

Because R2WX owns the browser-facing authentication flow, it also owns the ticket mechanics.

The ticket carries an expiry and is associated with request context.

The context signature incorporates information such as the request's User-Agent and Accept-Language, together with server-side secret material.

Conceptually:

<pre class="r2wx-exhibit"><code>ticket
  │
  ├── user/profile information
  ├── expiry
  ├── context association
  └── HMAC signature</code></pre>

On subsequent requests:

<pre class="r2wx-exhibit"><code>incoming ticket
      │
      ▼
signature valid?
      │
      ▼
expired?
      │
      ▼
expected context?
      │
      ▼
human-facing request accepted</code></pre>

The context association should not be mistaken for strong device identity.

User-Agent and language headers do not establish that.

What it does demonstrate is that R2WX's ticket acceptance considers more than possession of an unexpired value.

The ticket can also be renewed as requests continue through the flow.

This is the concrete basis for describing the examined mechanism as custom-authentication and stateless-authentication.

## Stateless does not mean trustless

Removing server-side session state doesn't remove authority from the system.

It relocates what must be trusted.

<pre class="r2wx-exhibit"><code>No examined server-side
session record
       │
       ▼
ticket must carry sufficient state
       │
       ▼
signature becomes critical
       │
       ▼
secret protection becomes critical</code></pre>

Likewise, separating service identity from human identity doesn't make the core independently aware of everything the BFF already decided.

It creates a trust relationship:

<pre class="r2wx-exhibit"><code>BFF authorizes human request
           │
           ▼
BFF enters core using
trusted service identity
           │
           ▼
Core trusts that boundary
according to its service contract</code></pre>

That has a consequence worth making explicit:

Compromise of the BFF would compromise the trust relationship through which it reaches the protected core.

The boundary provides separation.

It does not make the participating service magically harmless.

## The developer can now reason about one boundary at a time

Without this separation, authentication can become a single conceptual blob:

<pre class="r2wx-exhibit"><code>USER
 │
 └──────── &quot;authenticated&quot; ────────► everything</code></pre>

R2WX instead produces a topology:

<pre class="r2wx-exhibit"><code>        HUMAN DOMAIN
             │
          Browser
             │
             ▼
            BFF
     ┌───────┴────────┐
     │                │
 user identity     human authz
     │                │
     └───────┬────────┘
             │
════════ SERVICE BOUNDARY ════════
             │
      service identity
             │
             ▼
          Core API
             │
      service-level authz</code></pre>

Now the questions become local:

At the browser/BFF boundary: who is the human, and what may that human do?

At the BFF/core boundary: who is the calling service, and may that service enter?

That is what security-boundaries means in this part of R2WX.

The architecture follows the trust relationships rather than assuming one authentication result should remain authoritative everywhere.

**Authority follows the boundary in which that authority has meaning.**

## And then the payload becomes the problem

Once the BFF owns this boundary, another practical responsibility appears.

Requests have to pass through it.

For ordinary JSON, that may seem trivial.

Then a form contains files.

Payloads become multipart.

A file can become large.

Dynamic form data may need server-loaded options.

And suddenly a BFF that was introduced partly to protect and mediate the backend can itself become unnecessary work:

<pre class="r2wx-exhibit"><code>Browser
   │
large multipart request
   ▼
BFF
   │
parse it?
materialize it?
rebuild it?
   │
   ▼
Core API</code></pre>

The next battle therefore moves from who may cross the boundary to:

How can the boundary remain in place without forcing every payload to pay for the boundary unnecessarily?

That takes us into R2WX's runtime and transport adaptation: stream forwarding, automatic JSON/multipart selection, scheme-derived file limits and runtime-loaded options.

---
[Continue →](07-transport-boundaries.md)