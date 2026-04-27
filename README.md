# Holy Grails React

<<<<<<< HEAD
** Holy Grail React **

- " https://holy-grail-react.vercel.app " -
      - Live Vercel Deploy URL - 

i wish my 2 clones and other ecommerce for fes would get looked at lol - i worked so hard and took so much time on 
-netflix clone almost perfect matching 1-1 even went above and beyond with auto play     videos and other features
-twitter clone but family friendly - "glitter" a full functioning fullstack social media with brok my grok equivalent ai
-and gocart my ecommerce where i made my own dark mode and style and finishes modals have stripe payments accounts vendors individual stores, and admin capabilities and so much more
    it would be a tragedy if im the only one that knows about them please look ....thanks for hearing my rant thats all i got.
    
=======
Holy Grails React is my rebuild of a sneaker and streetwear showroom I originally built as a static HTML, CSS, and JavaScript project. Instead of scrapping the whole thing and starting over, I chose to convert it in stages so I could keep the visual identity, preserve the parts that already worked, and turn it into a cleaner React-based storefront shell I can keep expanding.
>>>>>>> a0e4b1c (readme)

This project is less about copying a generic ecommerce template and more about building a curated digital showroom. I wanted it to feel expressive, collectible, and tactile. The motion, hover behavior, card feel, route flow, and modal presentation were shaped by hand. I did not lean on GSAP snippets, Framer templates, or drag-and-drop visual builders to fake polish. The goal was to make the experience feel premium while still being coded in a way I fully understand and can keep evolving.

<<<<<<< HEAD

# Holy Grails React #


Holy Grails React is my rebuild of a sneaker and streetwear showroom I originally built as a static HTML/CSS/JavaScript project. Instead of tossing the whole thing and starting over, I decided to convert it in stages so I could keep the visual identity, preserve the parts that already worked, and turn it into a cleaner React-based storefront shell I can keep expanding.

This project is less about copying a generic ecommerce template and more about building a curated digital showroom. I wanted it to feel expressive, collectible, and tactile. The motion, hover behavior, card feel, route flow, and modal presentation were shaped by hand. I did not lean on GSAP snippets, Framer templates, or drag-and-drop visual builders to fake polish. The goal was to make the experience feel premium while still being coded in a way I fully understand and can keep evolving.


## Overview ##


Holy Grails React is built around a staged conversion mindset.

The original static project already had strong visual direction, custom styling, search flow, recommendation cards, and modal behavior. Rather than rewriting everything at once and risking a full restyle spiral, I moved it into a React + Vite setup piece by piece. That let me keep the same class-based CSS language and overall structure while upgrading the app into something more scalable, route-aware, and state-driven.

Right now the project sits in a strong middle ground:
- the storefront has been converted into a React app shell
- the visual identity is still custom and intentional
- the core browsing flow is live
- cart state, modal state, route flow, and search flow are now handled in React
- the app is still open for deeper backend and commerce upgrades later


## Highlights ##


- React rebuild of a multi-page sneaker/streetwear storefront originally built in vanilla HTML, CSS, and JavaScript
- Custom showroom-style visual direction with bold graphics, layered surfaces, and hand-built motion
- React Router page flow for home, shop, search, and cart
- Dark mode toggle carried into the rebuilt app
- Search experience powered by live sneaker API data
- Product recommendation view powered by RapidAPI data
- Modal-based product browsing with image switching and per-item detail viewing
- Contact modal preserved from the original build and converted into React-friendly component behavior
- Cart system with quantity controls, subtotal, tax math, and persistent localStorage state
- Demo pricing layer added because the external product data is not reliable enough for real storefront math yet
- Shared component structure for fixed actions, footer, contact modal, and shoe modal
- Existing CSS approach preserved on purpose instead of being replaced with a full framework styling rewrite


## What I Built ##


### 1. A Real React Conversion, Not Just a Fresh Mockup

A big part of this project was taking an existing static storefront and turning it into a React app without losing the identity of the original build.

That includes:
- moving from static multi-page files into a React + Vite app
- preserving the original styling system and class names where possible
- breaking repeated UI into reusable components
- replacing old global click handlers with React state and props
- keeping the project understandable while making it more scalable

I wanted the conversion to feel intentional, not like I bulldozed the original just to say it was in React.


### 2. Showroom-Style Product Browsing ###

The shopping experience is meant to feel more like browsing a curated digital display than scanning a dry product grid.

That includes:
- recommendation cards
- modal-based product viewing
- multi-image product browsing
- scroll-aware layout sections
- a stronger visual focus on image presentation and browsing feel

The whole point was to make the product experience feel collectible and visual first, especially for sneakers and streetwear.


### 3. Search Flow with Real API Data ##

The search page is not just a fake front-end shell.

That includes:
- query-driven product search
- featured search preload so the page never feels dead on first open
- local pagination over fetched results
- loading skeletons and error handling
- modal viewing from the search results themselves

I specifically wanted the search experience to feel useful even before the app gets a full backend of its own.


### 4. Cart Flow and Demo Commerce Logic ###

Even though this is still a front-end-heavy build, I wanted the commerce flow to start behaving like a real app.

That includes:
- add-to-cart actions from shop and search
- quantity controls
- remove-item flow
- subtotal and tax calculations
- persistent cart storage in localStorage
- live cart counter in the UI

Because the current API data is inconsistent about pricing, I used demo pricing logic to keep the cart flow functional without pretending the app already has a trustworthy commerce backend.


### 5. Preserving the Original Style While Upgrading the Architecture ###

One of the most important choices in this project was what I did not do.

I did not flatten the site into generic component-library styling.
I did not throw away the old CSS just because React entered the chat.
I did not let the conversion become a redesign rabbit hole.

Instead I kept:
- the original visual direction
- the hand-built motion feel
- the slide-style contact modal behavior
- the custom showroom presentation
- the loud, graphic, culture-forward art direction

That mattered because the personality of the project is part of the work.

 
## Technical Notes ##

This rebuild is currently focused on front-end structure, route flow, and state cleanup more than full backend commerce.

Key technical areas include:
- React 19
- Vite
- React Router
- reusable page/component structure
- modal state and image-state handling
- localStorage cart persistence
- live RapidAPI sneaker data for search and recommendations
- EmailJS-style contact flow carried forward from the original project
- CSS-first styling strategy instead of a full design-system framework takeover

## Tech Stack ##

- React
- Vite
- React Router DOM
- CSS
- React Icons
- RapidAPI sneaker data
- localStorage for cart persistence


## Why This Project Stands Out ##


What makes this project stronger than a basic class storefront or tutorial conversion is the mix of front-end taste and practical rebuilding.

This was not just:
- “make a React app”
- “copy a sneaker site”
- “drop in a library and call it polished”

What actually happened here was:
- a real static-to-React conversion
- preserving an original visual language during that conversion
- rebuilding old JS behavior into React state
- keeping the project clean enough to scale further
- making design choices that feel curated instead of default

I think that matters because a lot of projects either have personality with weak structure, or structure with no personality. This one is me trying to keep both.


## Current Constraints ##

A few things are intentionally honest in this build:

- pricing is currently demo logic, not production-grade live commerce math
- product data depends on third-party API quality and can be inconsistent
- API keys and direct client-side calls are okay for a portfolio/class-stage build, but not the final production architecture
- there is not a full backend database layer behind this version yet



## Running Locally

```bash
npm install
npm run dev


- custom BEM-scoped Sass for high-fidelity UI details (glassmorphism and custom animations) that require pixel-perfect precision."
- "Engineered a Digital Showroom experience using interactive parallax and glassmorphism to mirror the exclusivity of the collection."
- "I chose to implement a custom BEM architecture to manage the complexity of the e-commerce routing."
- "Implemented custom-designed loading states to improve perceived performance and maintain brand aesthetic during data fetching."
- "Re-engineered a legacy HTML/CSS site into a high-performance Next.js application, optimizing the UI with a custom-built design system and refined Sass animations."
- Cursor-follow parallax on background images — turns off on mobile
- Card hover tilt (3D showroom feel)
- Glass shimmer effect on shoe modals
- 'Book' modal — panels slide in from each side, meet centered
- Tactile buttons — hover color shift, click glow, pointer
-  I created parallax, entrance animations, hover tilts effects manually but instead of GSAP which was my plan 
- loading.js reusable skeleton (replacing per-page versions)
- Clear All Filters button that also resets URL params
-  ScrollTrigger on footer logo
-  dummy check out to show the placement and ability right now the database had no prices available so these are averages but does real math adding subtotal and tax adding and removing selections etc. and a dynamic cart counter displaying current inventory selected.
=======
## Overview
>>>>>>> a0e4b1c (readme)

Holy Grails React is built around a staged conversion mindset.

The original static project already had strong visual direction, custom styling, search flow, recommendation cards, and modal behavior. Rather than rewriting everything at once and risking a full restyle spiral, I moved it into a React + Vite setup piece by piece. That let me keep the same class-based CSS language and overall structure while upgrading the app into something more scalable, route-aware, and state-driven.

Right now the project sits in a strong middle ground:

- the storefront has been converted into a React app shell
- the visual identity is still custom and intentional
- the core browsing flow is live
- cart state, modal state, route flow, and search flow are now handled in React
- the app is still open for deeper backend and commerce upgrades later

## Highlights

- React rebuild of a multi-page sneaker and streetwear storefront originally built in vanilla HTML, CSS, and JavaScript
- Custom showroom-style visual direction with bold graphics, layered surfaces, and hand-built motion
- React Router page flow for home, shop, search, and cart
- Dark mode toggle carried into the rebuilt app
- Search experience powered by live sneaker API data
- Product recommendation view powered by RapidAPI data
- Modal-based product browsing with image switching and per-item detail viewing
- Contact modal preserved from the original build and converted into React-friendly component behavior
- Cart system with quantity controls, subtotal, tax math, and persistent localStorage state
- Demo pricing layer added because the external product data is not reliable enough for real storefront math yet
- Shared component structure for fixed actions, footer, contact modal, and shoe modal
- Existing CSS approach preserved on purpose instead of being replaced with a full framework styling rewrite

## What I Built

### 1. A Real React Conversion, Not Just a Fresh Mockup

A big part of this project was taking an existing static storefront and turning it into a React app without losing the identity of the original build.

That includes:

- moving from static multi-page files into a React + Vite app
- preserving the original styling system and class names where possible
- breaking repeated UI into reusable components
- replacing old global click handlers with React state and props
- keeping the project understandable while making it more scalable

I wanted the conversion to feel intentional, not like I bulldozed the original just to say it was in React.

### 2. Showroom-Style Product Browsing

The shopping experience is meant to feel more like browsing a curated digital display than scanning a dry product grid.

That includes:

- recommendation cards
- modal-based product viewing
- multi-image product browsing
- scroll-aware layout sections
- a stronger visual focus on image presentation and browsing feel

The whole point was to make the product experience feel collectible and visual first, especially for sneakers and streetwear.

### 3. Search Flow with Real API Data

The search page is not just a fake front-end shell.

That includes:

- query-driven product search
- featured search preload so the page never feels dead on first open
- local pagination over fetched results
- loading skeletons and error handling
- modal viewing from the search results themselves

I specifically wanted the search experience to feel useful even before the app gets a full backend of its own.

### 4. Cart Flow and Demo Commerce Logic

Even though this is still a front-end-heavy build, I wanted the commerce flow to start behaving like a real app.

That includes:

- add-to-cart actions from shop and search
- quantity controls
- remove-item flow
- subtotal and tax calculations
- persistent cart storage in localStorage
- live cart counter in the UI

Because the current API data is inconsistent about pricing, I used demo pricing logic to keep the cart flow functional without pretending the app already has a trustworthy commerce backend.

### 5. Preserving the Original Style While Upgrading the Architecture

One of the most important choices in this project was what I did not do.

I did not flatten the site into generic component-library styling. I did not throw away the old CSS just because React entered the chat. I did not let the conversion become a redesign rabbit hole.

Instead I kept:

- the original visual direction
- the hand-built motion feel
- the slide-style contact modal behavior
- the custom showroom presentation
- the loud, graphic, culture-forward art direction

That mattered because the personality of the project is part of the work.

## Technical Notes

This rebuild is currently focused on front-end structure, route flow, and state cleanup more than full backend commerce.

Key technical areas include:

- React 19
- Vite
- React Router
- reusable page and component structure
- modal state and image-state handling
- localStorage cart persistence
- live RapidAPI sneaker data for search and recommendations
- EmailJS-style contact flow carried forward from the original project
- CSS-first styling strategy instead of a full design-system framework takeover

## Stack

- React
- Vite
- React Router DOM
- CSS
- React Icons
- RapidAPI sneaker data
- localStorage for cart persistence

## Why This Project Stands Out

What makes this project stronger than a basic class storefront or tutorial conversion is the mix of front-end taste and practical rebuilding.

This was not just:

- make a React app
- copy a sneaker site
- drop in a library and call it polished

What actually happened here was:

- a real static-to-React conversion
- preserving an original visual language during that conversion
- rebuilding old JavaScript behavior into React state
- keeping the project clean enough to scale further
- making design choices that feel curated instead of default

I think that matters because a lot of projects either have personality with weak structure, or structure with no personality. This one is me trying to keep both.

## Current Constraints

A few things are intentionally honest in this build:

- pricing is currently demo logic, not production-grade live commerce math
- product data depends on third-party API quality and can be inconsistent
- API keys and direct client-side calls are okay for a portfolio and class-stage build, but not the final production architecture
- there is not a full backend database layer behind this version yet

I would rather be clear about that than fake full production ecommerce claims where the stack is not there yet.

## Running Locally

```bash
npm install
npm run dev
```

Then open the local Vite server in the browser.

## Future Improvements

- move API access behind a safer backend layer instead of exposing raw client-side requests
- replace demo pricing with real product pricing and inventory logic
- add filtering and sorting depth beyond the current browsing flow
- strengthen product normalization so inconsistent API payloads map more cleanly into the UI
- expand cart flow into a fuller checkout path
- bring in a real database-backed commerce layer
- add seller and admin capabilities if this evolves into a larger marketplace concept
- continue the React conversion by refining page structure and reducing leftover static-era baggage
- potentially move the project into a larger Next.js architecture later if the storefront grows beyond the current Vite footprint

## Closing

Holy Grails React is one of those projects where the engineering and the art direction are both part of the point.

It let me practice a real migration, keep control over the visual identity, and build a cleaner front-end foundation without stripping away the personality that made the original interesting in the first place. It is still growing, but that is part of what I like about it. It already works as a React storefront shell, and it gives me a strong base to keep layering better data, stronger commerce logic, and more advanced product behavior on top.
