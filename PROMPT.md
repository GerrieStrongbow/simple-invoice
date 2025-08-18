I want to create a clone of the [invoicesimple](https://www.invoicesimple.com/) website. Please refer to the files in "/Users/gbekker/Projects/simple-invoice/invoicesimple" for context. I grabbed what I could from there site, but the most concise version might be in the "/Users/gbekker/Projects/simple-invoice/invoicesimple/SingleFile" directory, which I used the SingleFile extension for to extract everything from the Invoice Generator and Settings pages. Also look at "/Users/gbekker/Projects/simple-invoice/invoicesimple/screenshots" for some screenshots.

However, I would like my site to be extrememly user-friendly, simple and almost "idiot-proof". My target audience is people starting a small business that is really not tech savvy, but need the basics such as an invoice template or generator.

I thus want a basic invoice generator with very little restrictions. The basic elements should be the same as on this generator: "invoicesimple/screenshots/InvoiceGenerator.jpeg".

I like to work with the following tech stack, however, not all of it might be relevant for the simple site I would like to build:

```md
# Vibe coding stack

## Your base stacks
### Mobile
✅ React Native – Native UI with React syntax.
✅ TypeScript – Type safety and AI context clarity.
✅ Tamagui – Cross-platform styling + design system.
✅ Zustand – Simple, performant state management.
✅ Prisma – Local ORM layer for AI and type safety.
✅ Supabase – All-in-one backend (Auth, DB, Storage, Functions).
Notes:
* This stack is already modern and scalable.
* Make sure Prisma queries run through a backend (API or serverless) in mobile apps — don’t connect directly to the DB from RN.
* Tailwind (via NativeWind in React Native)
    * If mobile only, long term, Tailwind via NativeWind is totally fine.
    * If mobile now, maybe mobile+web later, Tamagui wins — you can literally share the same components.

### Web
✅ Next.js – SSR, SSG, routing, API routes, edge-ready.
✅ React – Core UI library.
✅ TypeScript – Type safety + AI assist clarity.
✅ Tailwind – Utility-first styling for speed.
✅ Zustand – Same store pattern as mobile.
✅ Prisma – ORM + AI schema awareness.
✅ Supabase – Backend and DB.
Notes:
* This stack can be full-stack in one repo (Prisma + API routes inside Next.js).
* Tailwind and Tamagui can co-exist, but you might standardize on one per platform unless you’re doing a unified design system.

### Mobile + Web (Cross-platform)
✅ Next.js – For the web app.
✅ React Native – For mobile app.
✅ React – Shared logic + components.
✅ TypeScript – Cross-project type safety.
✅ Tamagui – Single design system across mobile & web.
✅ Zustand – Shared global state.
✅ Prisma – Single ORM for all server-side code.
✅ Supabase – One backend for both platforms.
Notes:
* Use a monorepo (e.g., Turborepo or Nx) so mobile and web share code easily.
* Put shared code in packages/ for:
    * UI components (Tamagui)
    * State stores (Zustand)
    * API clients
    * Business logic

### Optional but valuable additions
If you want even more scalability, maintainability, and developer happiness, consider:
1. Turborepo (or Nx)
    * Makes monorepos fast and organized.
    * Especially good for Mobile + Web shared stacks.
2. tRPC
    * Type-safe API calls from frontend to backend without needing to maintain OpenAPI/GraphQL schemas.
    * Perfect with Prisma + Supabase.
3. Testing setup
    * Vitest (fast TS-friendly unit tests)
    * Playwright (end-to-end tests for web)
    * Detox (E2E tests for mobile)
4. Code quality tooling
    * ESLint + Prettier for linting/formatting.
    * Husky + lint-staged for pre-commit checks.
5. Deployment targets
    * Web: Vercel (first-class Next.js hosting)
    * Mobile: EAS (Expo Application Services) or Fastlane.
6. Env & secrets management
    * Dotenv + Next.js built-in config.
    * Optionally, Doppler or 1Password CLI for secure secret storage.

TL;DR
Your core list is already solid and modern.If you want it “enterprise-level scalable,” I’d just add:
* Turborepo for cross-platform projects.
* tRPC for type-safe API calls.
* Testing tools for long-term maintainability.
```

Please keep in mind that I might want to add the following in future:

- Creation of user profile
  - Database linked to profile that stores user and client information so that it does not have to be typed in everytime
  - Database that stores previous invoices
- Mobile app (don't worry about this too much for now. That might affect the tech stack decision, which I don't want to worry about)
