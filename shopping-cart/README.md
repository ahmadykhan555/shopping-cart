# Cart App

Demo shopping cart built for the Neuffer frontend take-home task: fetch products, adjust quantities, view totals (subtotal, tax, shipping), and checkout confirmation. UI layout follows the [Figma mockup](https://www.figma.com/design/2mppTVDIBBU2h7JLmUhmNs/Test-Task-Cart?node-id=0-1) (structure and general appearance, not pixel-perfect).

- **Live demo:** [Vercel](https://shopping-cart-kappa-pink.vercel.app)
- **Repository:** [GitHub](https://github.com/ahmadykhan555/shopping-cart)

## Screenshots

### Desktop

![Cart page on desktop](./docs/screenshots/desktop.png)

### Tablet

![Cart page on tablet](./docs/screenshots/tablet.png)

### Mobile

![Cart page on mobile](./docs/screenshots/mobile.png)

## Features

### Core (task requirements)

| Requirement                | Implementation                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Load initial cart from API | `GET` [DummyJSON products](https://dummyjson.com/docs/products) (`limit` from `MAX_CART_ITEMS`) on cart page mount |
| Display line items         | Image, title, description, unit price, quantity, line total                                                        |
| Adjust quantity            | `QuantitySelector` with min/max clamping and direct numeric input                                                  |
| Remove item                | Remove control on each line                                                                                        |
| Clear cart                 | Clears items and shipping; success toast                                                                           |
| Add item                   | `POST` to DummyJSON `products/add`, then append to local cart                                                      |
| Subtotal & 20% tax         | Computed in `useCart` `summary`                                                                                    |
| Proceed to checkout        | Navigates to success page with order summary; cart cleared after successful navigation                             |
| Responsive layout          | Collapsible summary/shipping on smaller viewports; grid layout on desktop                                          |

### Bonus / extras

- **Shipping UI** — Form with validation (`useFormValidation`); mocked cost via random value in configured range
- **Totals** — Subtotal + shipping + tax in order summary
- **Toasts** — Success/error feedback (Notivue) for cart actions and API errors
- **Checkout success** — Dedicated page with confetti and persisted summary via router `history.state`
- **Tests** — Unit and component tests for cart logic, API helper, and key UI (see [Testing](#testing))
- **Loading & empty states** — Skeleton loader and empty-cart CTA

Pinia was not used; cart state lives in a shared composable (see [Decisions & tradeoffs](#decisions--tradeoffs)).

## How to run

Requires **Node.js ≥ 20** (see `.nvmrc`).

```bash
nvm use
pnpm install
pnpm run dev      # http://localhost:5173
pnpm run test     # watch mode
pnpm run test:coverage
pnpm run build
pnpm run preview  # serve production build locally
```

## Tech stack

- **Framework:** Vue 3 (Composition API) + TypeScript
- **Routing:** Vue Router
- **Styling:** Tailwind CSS
- **Bundler:** Vite
- **Testing:** Vitest, Testing Library, jsdom
- **Package manager:** pnpm

## Architecture

### Directory structure

```
src/
├── assets/           # Global styles, logo, SVG icon components
├── components/
│   ├── base/         # Shared layout/UI (header, button)
│   ├── cart/         # Cart-specific UI (items, summary, shipping, states)
│   └── __tests__/    # Component tests
├── composables/      # Shared logic (cart, API, forms, toasts)
│   └── __tests__/    # Composable unit tests
├── consts/           # App constants (API URLs, cart limits, routes)
├── pages/            # Route-level views (cart, checkout success)
│   └── __tests__/    # Page tests (when added)
├── test/             # Vitest setup and render helpers
├── types/            # TypeScript domain types
├── utils/            # Pure helpers (money formatting, cart math)
├── App.vue           # Root layout (header + router outlet)
├── main.ts           # App bootstrap
└── router.ts         # Vue Router config
```

### Components

**Base** (`src/components/base/`)

- **`AppHeader`** — Logo link and cart link with unit-count badge
- **`AppButton`** — Shared button variants (primary, secondary, danger, ghost)

**Cart** (`src/components/cart/`)

- **`CartLoadingState`** — Skeleton while items load
- **`CartEmptyState`** — Empty message and add-item CTA
- **`CartItemsColumnHeaders`** — Desktop column labels
- **`CartItem`** — Single line: image, details, price, quantity, line total, remove
- **`QuantitySelector`** — +/- and numeric input with clamping
- **`CartActions`** — Add item and clear cart (sticky footer on list view)
- **`CartSummary`** — Subtotal, shipping, tax, total; checkout; collapsible on small screens
- **`CartSummaryItem`** — Summary row (also used on checkout success)
- **`CartShippingCostCalculator`** — Shipping form, validation, save cost to cart state

**Pages** (`src/pages/`)

- **`CartPage`** — Main route (`/cart`; `/` redirects here): loads products into cart on mount, arranges summary/shipping aside and line-item list, and delegates actions to `useCart` and child components (orchestration only, not cart business logic)
- **`CheckoutSuccessPage`** — Post-checkout confirmation; reads order summary from router `history.state`, shows confetti, redirects to cart when state is missing or invalid

### Domain rules

- **Tax:** 20% on subtotal only (shipping excluded from tax base)
- **Item count:** Header badge, cart page subtitle, and checkout use total **units** (`summary.count` = sum of line quantities), not number of lines
- **Money:** Formatted as EUR via `Intl` (`de-DE`)
- **Quantity:** Clamped between `MIN_QUANTITY` and `MAX_QUANTITY` (see `src/consts/cart.ts`)

## Decisions & tradeoffs

### Rendering (CSR)

Single-page client-side rendering only. **Tradeoff:** No SSR/SEO; acceptable for a focused cart demo with no server HTML requirements.

### Products API (DummyJSON vs FakeStore)

FakeStoreAPI was unreliable (522 errors); after alignment with the hiring team, [DummyJSON](https://dummyjson.com) is used instead.

| Task spec          | This app                |
| ------------------ | ----------------------- |
| `GET` products     | `GET /products?limit=…` |
| `POST` add product | `POST /products/add`    |

**Tradeoffs:** DummyJSON is a product catalog, not a real cart—state is client-side only. POST responses reuse a fixed product id, so new lines get **client-generated ids** (`getNextItemId`). Refetching products replaces the cart with catalog data, not user edits.

### State management (`useCart`)

Module-level `ref`s inside `useCart` share cart state app-wide (singleton composable).

**Tradeoff:** Less boilerplate than Pinia for this scope; tests must call `resetCartState()`. Not ideal for many domains or SSR without careful isolation.

### API layer (`useApi`)

Central `apiCall` wraps `fetch`, maps errors to user-facing messages, shows error toasts, and supports `onSuccess` / `onError` callbacks.

**Tradeoff:** Consistent UX and one place for HTTP error handling; callers that need silent retries or custom UI must bypass or extend the helper.

### Checkout data (`history.state`)

Order summary is passed via Vue Router `state` to the success page.

**Tradeoff:** Simple with no backend; refresh or direct URL to success loses data (page redirects to cart). Cart is cleared only after `router.push` resolves (navigation failure keeps the cart).

## Testing

| Area        | Files                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Cart logic  | `src/composables/__tests__/useCart.test.ts` — totals, quantity clamp, shipping, fetch/add failure, id assignment |
| HTTP helper | `src/composables/__tests__/useApi.test.ts` — success path, errors, toasts                                        |
| UI          | `src/components/__tests__/` — `CartSummary`, `AppHeader`, `QuantitySelector`, `AppButton`                        |

Run `pnpm run test` or `pnpm run test:coverage`.

## Known limitations

- No cart persistence (refresh loses in-memory state unless re-fetched from products API)
- Shipping cost is mocked (form fields validate but do not affect the random cost algorithm)
- No real payment or order backend
- Unknown routes redirect to the cart (no dedicated 404 page)
- Checkout confirmation does not survive a full page reload on the success URL
