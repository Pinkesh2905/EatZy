# EatZyyy Scale-Up Plan

## Current status

This repo is an Angular client plus an Express/Mongo API with early-stage feature breadth but low production readiness. The main current risks are:

- cross-layer auth drift
- missing or broken route wiring
- limited workflow validation
- duplicated frontend artifacts and inconsistent UX
- no meaningful server test coverage
- no environment strategy beyond local defaults

## Phase 1: Platform stabilization

Goal: make the existing app boot reliably and keep core session flow consistent.

Completed in this pass:

- fixed backend auth route integrity
- fixed broken middleware imports in analytics and delivery routes
- added authenticated `GET /api/auth/profile`
- refreshed auth middleware to load the current user from Mongo
- restricted order status updates to staff roles
- centralized client API/socket base URLs
- standardized client session storage on `eatzy_user`
- added auth, guest, and role-based route guards
- fixed navbar profile refresh against the real backend endpoint
- fixed cart checkout login gating and mixed-restaurant validation
- fixed group-order member resolution to use the active auth session
- fixed broken order history tracking links

Exit gate:

- server route tree loads without missing imports
- Angular typecheck passes
- login, refresh, logout, guarded routes, cart checkout, and order tracking navigation work locally

## Phase 2: Workflow repair

Goal: make the major user journeys coherent from entry to completion.

Tasks:

- persist cart state across refreshes
- add proper delivery address capture and editing
- implement order details view instead of placeholder button
- add group-order persistence for member item changes, not only socket-local updates
- add optimistic and empty/error states across restaurant, order, chef, and delivery screens
- normalize route names and remove dead component duplicates
- replace `alert()` usage with inline status banners/toasts

Exit gate:

- customer can register, browse, add items, checkout, review order history, and track an order without dead ends
- chef and delivery dashboards have usable loading/error states

## Phase 3: Backend hardening

Goal: move from demo API patterns to production-safe service boundaries.

Tasks:

- add request validation with a schema layer for auth, orders, restaurants, subscriptions, and group orders
- add centralized Express error middleware and 404 handling
- split controllers from business services and repository access
- add pagination, filtering, and indexes for restaurant/order reads
- add rate limiting and security headers
- move secrets and origins to environment-based config
- add refresh-token or short-lived access-token strategy if long sessions are needed

Exit gate:

- invalid payloads fail predictably
- API error responses are consistent
- common list endpoints remain performant with larger datasets

## Phase 4: UX system cleanup

Goal: make the product feel intentional rather than a set of disconnected screens.

Tasks:

- define a layout shell with clear page spacing, content widths, and section hierarchy
- consolidate duplicated component files and dead starter assets
- create reusable page states: loading, empty, error, success
- improve auth pages with clearer role selection and delivery-address capture
- redesign navigation around role-aware actions and current order status
- audit accessibility: focus states, color contrast, button semantics, keyboard flow

Exit gate:

- shared design tokens and patterns are used consistently
- no page relies on placeholder copy or dead controls

## Phase 5: Quality and observability

Goal: make regression detection and production debugging possible.

Tasks:

- add server tests for auth, orders, restaurant reads, and protected routes
- add Angular component/service tests for auth guard, cart checkout, and order history navigation
- add linting and CI checks for typecheck plus tests
- log structured API errors with request context
- add health endpoint and readiness checks

Exit gate:

- pull requests fail on broken auth/workflow regressions
- production issues can be traced from logs and health checks

## Phase 6: Scale architecture

Goal: support higher traffic, more teams, and safer deployments.

Tasks:

- introduce environment-specific config files and deployment manifests
- use Mongo indexes and query profiling on hot collections
- add Redis for caching/session-like transient state if needed
- move sockets to a shared adapter if running multiple instances
- offload media/image handling to object storage/CDN
- add queue-based processing for notifications, analytics aggregation, and heavy async jobs
- separate admin analytics from transactional APIs where load patterns diverge

Exit gate:

- horizontal API scaling is possible
- real-time updates work across multiple instances
- background work is not blocking request latency

## Recommended implementation order from here

1. Finish workflow repair on order details, group-order persistence, and cart persistence.
2. Add request validation plus centralized API error handling.
3. Clean duplicated frontend artifacts and standardize page states.
4. Add server/client tests around auth and ordering.
5. Introduce deployment config, health checks, and observability.
