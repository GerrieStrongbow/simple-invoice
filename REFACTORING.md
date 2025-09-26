# Refactoring Priorities (High → Low)

1. [DONE] Modularize `FlexibleInvoice` and move inline layout styling into Tailwind/CSS modules (`components/FlexibleInvoice.tsx`). This will cut cognitive load, improve render performance, and make shared styling consistent across the app.
2. [DONE] Replace imperative focus/hover style mutations with semantic class-based styling (`components/invoice-editor/ContactDetails.tsx`, similar patterns elsewhere). Relying on direct DOM manipulation is brittle and hard to test.
3. [DONE] Swap the timestamp-based `generateId` with a collision-resistant helper (e.g., `crypto.randomUUID`) (`lib/invoice-utils.ts`). Duplicate IDs currently risk overwriting user data when rows/fields are added quickly.
4. [DONE] Refine PDF export error handling to remove console noise and surface user-friendly feedback without blocking alerts (`lib/pdf-generator.ts`). This keeps the UI responsive and production-ready.
5. [DONE] Replace `contentEditable` spans with controlled inputs or more accessible rich-text components (`components/invoice-editor/ContactDetails.tsx`, `components/SimpleInvoice.tsx`). This solidifies validation, keyboard support, and screen-reader semantics.
6. [DONE] Align remaining UI with Tailwind utilities instead of bespoke inline styles (`app/page.tsx`, `components/**`). Consistent styling reduces bundle size and eases theming.

## Risks & Mitigation

- **Large component split (items 1 & 6):** High chance of layout regressions or missed props when extracting subcomponents. Mitigate with snapshot/manual UI diffing and covering critical flows (render, edit, print/export) before/after refactor.
- **Styling strategy shift (items 2 & 6):** CSS specificity conflicts or regressions could appear during the move. Use Storybook/manual visual checks and keep changes incremental per section.
- **ID strategy update (item 3):** Persisted invoices or localStorage data might still hold old IDs. Write a migration step that normalizes existing data before switching.
- **PDF pipeline changes (item 4):** Altering async flow or error handling could break export. Add integration tests (or a QA script) that generate PDFs in typical scenarios.
- **Editable field overhaul (item 5):** Replacing `contentEditable` risks losing formatting flexibility. Plan UX acceptance with stakeholders and add unit tests to ensure new inputs still support the required editing behavior.

## Worth the Effort?

Yes. These refactors target maintainability, accessibility, and data integrity—all essential for a production-ready invoicing product. Addressing them now reduces long-term technical debt, lowers regression risk when adding features, and improves the reliability customers expect from billing software.
