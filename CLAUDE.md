# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working on the Simple Invoice Generator project.

## Project Overview

Building a flexible, non-restrictive invoice generator web application for non-tech-savvy small business owners. The app should be "idiot-proof" with zero learning curve - everything is editable, nothing is mandatory.

## Tech Stack

**Phase 1 (Current - MVP):**

- Next.js 16+ with App Router
- TypeScript 5
- Tailwind CSS 4
- React 19
- Local Storage (no backend initially)
- PDF generation (jspdf + html2canvas)

**Phase 2 (Future):**

- Add: Supabase (Auth + Database)
- Add: Prisma (ORM)
- Add: Zustand (state management)

**Phase 3 (Future):**

- Add: React Native + Expo
- Add: Tamagui (shared components)
- Add: Turborepo (monorepo)

## Project Structure

```
/app                    # Next.js App Router
  layout.tsx            # Root layout
  page.tsx              # Main invoice page
  globals.css           # Global styles

/components             # React components
  /invoice-editor       # Editor components
    ActionButtons.tsx   # Print/download actions
    ContactDetails.tsx  # From/To contact sections
    CurrencySelector.tsx # Currency selection
    DatePicker.tsx      # Date input component
    EditableField.tsx   # Reusable editable text field
    EditableFieldSection.tsx # Section with multiple editable fields
    EnhancedTable.tsx   # Advanced table with calculations
    InvoiceEditor.tsx   # Main editor orchestrator
    InvoiceHeader.tsx   # Invoice title and metadata
    PaymentDetails.tsx  # Payment information section
    ServicesTable.tsx   # Line items table
    TotalsSection.tsx   # Subtotal, tax, total calculations
  FlexibleInvoice.tsx   # Flexible invoice layout
  SimpleInvoice.tsx     # Simple invoice layout

/hooks                  # Custom React hooks
  useFieldManagement.ts # Field state and editing logic
  useInvoiceCalculations.ts # Total/tax calculations
  useInvoiceState.ts    # Main invoice state management
  useTableManagement.ts # Table row/column operations

/lib                    # Utilities and helpers
  invoice-calculator.ts # Calculation logic
  invoice-types.ts      # Invoice-specific types
  invoice-utils.ts      # Invoice helper functions
  pdf-generator.ts      # PDF export functionality
  types.ts              # Shared type definitions

/public                 # Static assets
```

## Code Organization Guidelines

### File Size Limits
- **Components**: Prefer 100-200 lines. Files exceeding 400 lines should trigger a design review.
- **Custom Hooks**: Keep below ~100 lines.
- **Utility Functions**: Keep below 40 lines per function.

### Component Architecture
- Extract custom hooks when component logic exceeds ~20 lines of state/effects.
- Split by React's natural boundaries:
  - Presentational vs. container components
  - Data fetching (hooks/server components) vs. UI
  - Client vs. server components

## Development Workflow

1. **Planning First**: Break down tasks into small, manageable pieces. Document your approach before coding.

2. **Incremental Development**:
   - Make one small change at a time
   - Test after each significant change
   - Run dev server frequently to catch issues early
   - Commit working code before moving to next feature

3. **Code Quality**:
   - Write clean, modular, maintainable code
   - Keep components small and focused
   - Use TypeScript properly - no `any` types without good reason
   - Follow React best practices and hooks rules

4. **Testing Approach**:
   - Test the UI manually after each feature
   - Ensure PDF generation works correctly
   - Verify localStorage persistence
   - Check mobile responsiveness

5. **User Experience Priority**:
   - Every interaction should be intuitive
   - Click to edit anything
   - No forced formats or restrictions
   - Professional output regardless of customizations

## Key Principles

- **Flexibility First**: Users can modify ANYTHING - columns, headers, labels, everything
- **Smart but Not Restrictive**: Detect patterns (like calculations) but never force them
- **Zero Configuration**: Should work immediately without any setup
- **Professional Output**: Clean PDFs regardless of user customizations

## Common Tasks

- **Adding a new editable field**: Use the `EditableField` component
- **Modifying table behavior**: Update `EnhancedTable` or `ServicesTable` component
- **Changing calculations**: Modify `invoice-calculator.ts` or `useInvoiceCalculations` hook
- **Adjusting PDF output**: Update `pdf-generator.ts`
- **Managing invoice state**: Use or extend hooks in `/hooks`

## Environment Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run linting
npm run lint
```

## Before You Code

1. Understand the requirement fully
2. Check if similar functionality exists to reuse
3. Plan the implementation approach
4. Consider edge cases
5. Think about mobile experience

## Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] PDF generates correctly
- [ ] Data persists in localStorage
- [ ] Editable fields work smoothly
- [ ] Calculations update correctly

## If Unsure

Stop and ask for clarification rather than making assumptions. The goal is maximum flexibility with zero restrictions - when in doubt, make it editable!
