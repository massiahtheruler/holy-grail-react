# Holy Grails React

Holy Grails React is a self-directed sneaker and streetwear storefront rebuild that started from a more static multi-page site and got reworked into a cleaner React app without losing the original identity. The point of this project was not to turn it into a generic ecommerce template. I wanted to keep the cultural direction, the louder showroom feel, and the custom styling language intact while adding stronger route flow, richer browsing behavior, API-fed product surfaces, modal depth, and real state around search, filtering, pagination, and cart interactions.

This sits in a different lane than a full marketplace build like GoCart, and that is exactly why it belongs. Holy Grails shows taste, restructuring discipline, and front-end product thinking. It proves I can take a project that already has a point of view and make it more dynamic without sanding off the personality that made it worth building in the first place.

## Live Demo

[holy-grail-react.vercel.app](https://holy-grail-react.vercel.app)

## Project Preview

### Motion Preview

![Holy Grails feature walkthrough](./public/readme/grail-features.gif)

The motion preview shows the part that matters most in this build: it is not just styled screens sitting next to each other. The storefront moves through route changes, modal browsing, theme changes, filters, and cart interactions like an actual app.

### Home / Landing

![Holy Grails home page](./public/readme/grail%20hero.png)

The landing page sets the tone immediately. I used it to establish the storefront's graphic identity, sneaker and streetwear references, and the search-first browsing direction before the user even hits the catalog.

### Recommendation Surface

![Holy Grails recommendation page](./public/readme/grail%20shop.png)

The recommendation page is where the storefront starts acting like a real browse experience. It pulls live product data, applies audience filters, paginates results locally, and keeps the styling language consistent instead of letting the API feed flatten the interface.

### Dark Theme

![Holy Grails dark theme](./public/readme/grail%20dark.png)

Dark mode is not treated like a token color swap. The theme toggle carries the same storefront hierarchy, card readability, glow treatment, and browsing clarity into a darker presentation without losing the original feel.

### Product Modal

![Holy Grails product modal](./public/readme/grail%20modal.png)

The modal is one of the strongest interaction layers in the project. It turns the product cards into a deeper browsing system with previous and next product controls, image switching, pricing context, and add-to-cart behavior without forcing every item into a separate detail route.

### Cart

![Holy Grails cart page](./public/readme/grail%20cart.png)

The cart view makes the current scope tangible. It keeps selected items persistent, supports quantity changes and removal, and gives the storefront real stateful behavior even though the commerce layer is still intentionally front-end led.

## Core Features

- Multi-route storefront flow across home, shop, search, and cart views
- React rebuild of an older static storefront while preserving its visual identity
- Shared app-shell state for routing, theme toggling, cart initialization, cart normalization, and quantity updates
- API-driven recommendation feed on the shop page
- URL-driven search state with featured fallback queries when no term is provided
- Product cards with modal-based detail viewing, previous and next product controls, and image switching
- Audience filtering for men, women, and kids on the recommendation page
- Audience-based demo pricing normalization so cart math stays coherent even when API pricing is unreliable
- Local pagination for both shop and search surfaces
- Add-to-cart flow with persistent localStorage state
- Cart quantity controls, subtotal math, estimated tax, and item removal
- Dark theme toggle carried across the app
- Shared floating action bar, footer, contact modal, and product modal components
- Loading skeleton states for API-fed product surfaces

## Architecture Snapshot

This build is structured as a route-based React storefront with shared UI primitives and page-specific state:

- `src/RootApp.jsx`
  Handles routing, global dark-mode state, and shared cart state.
- `src/pages/App.jsx`
  Home / landing page with brand-heavy entry point and search handoff.
- `src/pages/Shop.jsx`
  Recommendation page with API fetch, audience filters, pagination, modal viewing, and add-to-cart actions.
- `src/pages/Search.jsx`
  Query-driven search page with featured preloads, result pagination, product modal browsing, and add-to-cart actions.
- `src/pages/Cart.jsx`
  Cart page with quantity updates, line totals, subtotal, and estimated tax.
- `src/components/`
  Shared UI pieces including `FixedActions`, `Footer`, `ContactModal`, and `ShoeModal`.
- `src/lib/cartPricing.js`
  Demo pricing normalization and audience detection for products coming from inconsistent API payloads.

## What I Built

### 1. Static-to-React Restructuring Without a Full Identity Reset

The strongest technical angle here is the conversion itself. This project did not start as a blank React app. I moved a more static storefront into a reusable React structure and kept the original look, tone, and browsing feel instead of flattening it into a safer but more forgettable rebuild.

That included:

- moving shared behaviors into route-aware React pages and components
- replacing older click-handler patterns with React state and prop flow
- carrying the same styling language into a more maintainable structure
- keeping the storefront recognizable while making it more dynamic

At the top level, `RootApp.jsx` is doing the work that makes this feel like an app instead of converted pages sitting beside each other. It wires the routes, owns theme state, initializes and normalizes the cart from localStorage, keeps the shared cart count live, and exposes the add / increase / decrease / remove handlers used across the storefront.

### 2. Home, Shop, Search, and Cart as a Real Browsing Flow

This is not a single flashy landing page pretending to be a storefront.

The current app supports:

- a landing page that pushes users into browse or search paths
- a recommendation-led shop page
- a dedicated search page with query state in the URL
- a cart page with persistent selected items

That route flow matters because it turns the project from a visual concept into a usable front-end retail experience.

### 3. API-Fed Product Surfaces

The shop and search experiences both pull from live sneaker data rather than relying on fully hardcoded cards.

In practice, that means:

- recommendation data is fetched for the shop surface
- search data is fetched from a separate query-based endpoint
- results are normalized on the client because API payloads are not perfectly consistent
- image handling is defensive, with multiple possible image fields checked before rendering
- title and subtitle rendering falls back across several possible fields instead of assuming one clean product shape
- audience detection is inferred from product text when the feed does not give me a reliable structured label
- demo price assignment is used because the feed is not trustworthy enough to treat as production-safe commerce data

That normalization layer is a real part of the work here. I am not just rendering fetched products raw. I spent time making third-party sneaker data feel curated and usable instead of letting API inconsistency leak all over the UI.

### 4. Product Cards, Modal Viewing, and Add-to-Cart Behavior

I wanted product browsing to feel deeper than a flat grid.

That includes:

- card-based browsing in both shop and search views
- modal product viewing instead of bouncing users away immediately
- previous / next image controls inside the modal
- previous / next product controls inside the modal
- add-to-cart from both cards and modal state

This gives the storefront more depth and more of a showroom feel without needing a full product-detail route for every item.

### 5. Filtering, Search, and Pagination Logic

The browse logic does more than just dump products on the screen.

Current behavior includes:

- audience filtering on the shop page for men, women, and kids
- local pagination after result collection
- search driven by URL params
- featured default search results when no query is present
- loading skeletons while product data is being fetched
- basic empty and error states when product surfaces do not load cleanly

The result is a storefront that behaves more like a real browsing environment and less like a static mood board with clickable cards.

### 6. Cart State and Demo Commerce Layer

I added a real front-end cart flow, but I kept the current scope honest.

What exists now:

- persistent cart state through localStorage
- quantity increase and decrease controls
- remove-item flow
- subtotal and estimated tax calculation
- visible cart count in shared UI

I kept the current scope honest: there is still no production checkout, live stock enforcement, or trusted backend pricing behind this version. Because the external product payloads are inconsistent for pricing, I built a demo pricing layer based on audience categories so the cart and pricing surfaces could still behave coherently while the project stays front-end focused.

### 7. Contact and Theme Behavior as Shared UI Systems

The utility layer is part of what makes the build feel more complete.

That includes:

- floating quick-action controls
- dark theme toggle
- shared footer navigation
- route-wide cart count visibility
- a preserved contact modal pattern with scroll locking and animated open / close behavior

The original EmailJS submission flow is not fully wired in the React version yet, but the modal pattern, scroll locking, and staged presentation are already preserved.

## Tech Stack

- React 19
- Vite
- React Router DOM
- React Icons
- CSS
- RapidAPI sneaker data
- localStorage

## Project Structure

```text
holy-grails-react/
├─ public/
│  └─ assets/
├─ src/
│  ├─ components/
│  │  ├─ ContactModal.jsx
│  │  ├─ FixedActions.jsx
│  │  ├─ Footer.jsx
│  │  └─ ShoeModal.jsx
│  ├─ lib/
│  │  └─ cartPricing.js
│  ├─ pages/
│  │  ├─ App.jsx
│  │  ├─ Shop.jsx
│  │  ├─ Search.jsx
│  │  └─ Cart.jsx
│  ├─ RootApp.jsx
│  ├─ main.jsx
│  └─ style.css
├─ package.json
└─ vite.config.js
```

## Current Scope

Holy Grails React is a front-end heavy storefront concept with real browsing behavior, shared state, and a clear point of view.

That current scope includes:

- real route flow
- real client-side state
- real third-party product data
- real browsing controls
- real cart behavior
- real UI restructuring work

It does not try to pretend it is already a full production resale platform. There is no full backend commerce stack behind this version yet, and I do not think the project needs fake completeness to justify itself. What it already demonstrates is front-end taste, restructuring skill, API handling, and the ability to make a more culturally specific retail concept feel usable.

## Technical Challenges

### Preserving Identity While Rebuilding Structure

The first challenge was not technical in the usual "hard algorithm" sense. It was architectural and editorial: how do I make the project more dynamic without turning it into a safer but blander React storefront?

That meant preserving:

- the visual direction
- the sneaker / streetwear energy
- the more expressive surface styling
- the original home / shop / search personality

while still improving:

- routing
- component boundaries
- modal behavior
- cart state
- search flow

### Normalizing Inconsistent Product Data

The external sneaker data is useful, but it is not shaped perfectly for the UI.

I had to account for:

- different image field shapes
- inconsistent product naming fields
- sparse or uneven metadata
- missing pricing I could not treat as production-safe

That is why the app includes helper logic for:

- image extraction
- audience detection
- demo price assignment
- cart item normalization

### Making API-Driven Results Feel Curated

Pulling live data is one thing. Making it feel intentional is another.

The challenge here was making recommendation and search results feel like part of a real storefront instead of a raw API dump. That is where the card layout, modal browsing, filters, loading skeletons, featured search defaults, and pagination strategy all matter.

### Building Depth Without Overbuilding the Wrong Layer

I made a deliberate choice to stop short of pretending this is already a full checkout platform.

Instead of rushing into a half-finished backend, I focused on:

- browse quality
- route flow
- product interaction depth
- cart behavior
- shared UI polish

That boundary matters. It keeps the current scope honest while still making the project substantial.

## Future Improvements

- replace demo pricing with normalized live pricing once the product data layer is trustworthy
- add richer sorting controls beyond the current filter and search behavior
- strengthen inventory and product-state handling
- bring back a fully wired contact submission flow in the React version
- move product data access behind a safer backend layer
- add a dedicated product detail route if the catalog gets deeper
- expand the cart into a fuller checkout experience when the backend layer exists

## Closing

The value in Holy Grails React is not fake scale. It is the combination of taste, restructuring, and front-end product judgment. I took a project with a strong identity, preserved what made it specific, and rebuilt enough of the structure underneath it to make the browsing experience feel more like a real app.

That is why it earns its place next to broader portfolio work. It reflects taste, follow-through, and a willingness to build something culturally specific without letting the technical layer stay flat.
