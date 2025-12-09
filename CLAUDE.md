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
- Local Storage (fallback for non-authenticated users)
- PDF generation (jspdf + html2canvas)

**Phase 2 (Current - Implemented):**

- Supabase (Auth + Database) - Email/Password authentication
- Contact storage (Business Profiles + Clients)
- Cross-device sync for authenticated users

**Phase 3 (Future):**

- Add: Google OAuth
- Add: Zustand (state management)
- Add: React Native + Expo
- Add: Tamagui (shared components)
- Add: Turborepo (monorepo)

## Project Structure

```
/app                    # Next.js App Router
  layout.tsx            # Root layout with AuthProvider
  page.tsx              # Main invoice page
  globals.css           # Global styles
  /login                # Authentication page
    page.tsx
  /auth/callback        # OAuth callback handler
    route.ts
  /contacts             # Contact management
    page.tsx            # Contacts overview
    /business           # Business profiles
      page.tsx
    /clients            # Client management
      page.tsx

/components             # React components
  /auth                 # Authentication components
    AuthProvider.tsx    # Auth context provider
    LoginForm.tsx       # Login/signup form
    UserMenu.tsx        # User dropdown menu
  /contacts             # Contact management components
    BusinessProfileList.tsx
    ClientList.tsx
    ContactForm.tsx
    ContactSelectorModal.tsx
    SaveContactModal.tsx
  /invoice-editor       # Editor components
    ActionButtons.tsx   # Print/download actions
    ContactDetails.tsx  # From/To contact sections (with Load/Save)
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
  /supabase             # Supabase integration
    client.ts           # Browser Supabase client
    server.ts           # Server Supabase client (SSR)
    middleware.ts       # Session refresh helper
    types.ts            # Database types
    business-profiles.ts # Business profile CRUD
    clients.ts          # Client CRUD

/supabase               # Supabase configuration
  /migrations           # Database migrations
    *_create_contacts_tables.sql

/public                 # Static assets

proxy.ts                # Next.js 16 proxy (session handling)
```

## Supabase Integration

### Local Development

The project uses local Supabase via Docker for development:

```bash
supabase start      # Start local Supabase
supabase stop       # Stop local Supabase
supabase db reset   # Reset database (re-run migrations)
supabase status     # Show local URLs and keys
```

**Local URLs:**
- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323` (database UI)
- Mailpit: `http://127.0.0.1:54324` (local email testing)

### Database Schema

Two tables for contact storage:
- `business_profiles` - "From" section (your business info)
- `clients` - "To" section (client information)

Both use JSONB `fields` column for flexible field storage with Row Level Security (RLS).

### Authentication Flow

1. Users can use the app without authentication (localStorage)
2. Sign up/Sign in enables cross-device sync
3. Load/Save buttons appear in From/To sections when logged in
4. Confirmation emails sent via Mailpit (local) or configured provider (production)

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
   - Verify localStorage persistence (non-auth users)
   - Verify Supabase persistence (authenticated users)
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
- **Progressive Enhancement**: Works without auth, better with auth

## Common Tasks

- **Adding a new editable field**: Use the `EditableField` component
- **Modifying table behavior**: Update `EnhancedTable` or `ServicesTable` component
- **Changing calculations**: Modify `invoice-calculator.ts` or `useInvoiceCalculations` hook
- **Adjusting PDF output**: Update `pdf-generator.ts`
- **Managing invoice state**: Use or extend hooks in `/hooks`
- **Adding Supabase features**: Use existing patterns in `/lib/supabase/`
- **Auth-gated UI**: Check `user` from `useAuth()` hook

## Environment Setup

```bash
# Install dependencies
npm install

# Start local Supabase (requires Docker)
supabase start

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run linting
npm run lint

# Reset database (re-run migrations)
supabase db reset
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>
```

## Before You Code

1. Understand the requirement fully
2. Check if similar functionality exists to reuse
3. Plan the implementation approach
4. Consider edge cases
5. Think about mobile experience
6. Consider auth vs non-auth user experience

## Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] PDF generates correctly
- [ ] Data persists in localStorage (non-auth)
- [ ] Data persists in Supabase (authenticated)
- [ ] Editable fields work smoothly
- [ ] Calculations update correctly
- [ ] Auth state handled correctly

## If Unsure

Stop and ask for clarification rather than making assumptions. The goal is maximum flexibility with zero restrictions - when in doubt, make it editable!
