# Supabase Integration Plan - Executive Summary

## Objective
Add user authentication and cloud storage for "From" (business profiles) and "To" (clients) contact information, enabling cross-device access.

## Current State
- Invoice app using localStorage only
- No authentication
- Contacts lost if browser data cleared

## Target State
- Users can sign up/login with email + password
- Business profiles and clients stored in Supabase
- Default contacts auto-load on new invoices
- Works offline (localStorage fallback)
- Syncs across devices when logged in

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Auth UI     │  │ Contact     │  │ Invoice Editor      │ │
│  │ (Login/     │  │ Management  │  │ (Load/Save buttons) │ │
│  │  Signup)    │  │ Pages       │  │                     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│         └────────────────┼─────────────────────┘            │
│                          │                                  │
│                    ┌─────▼─────┐                           │
│                    │ Supabase  │                           │
│                    │ Clients   │                           │
│                    └─────┬─────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Local Supabase (Docker)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ PostgreSQL  │  │ Auth        │  │ Inbucket (Email)    │ │
│  │ Database    │  │ Service     │  │ Testing             │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

| Phase | Document | Description | Dependencies |
|-------|----------|-------------|--------------|
| 1 | [01-database-schema.md](./01-database-schema.md) | Database tables & migrations | None |
| 2 | [02-supabase-setup.md](./02-supabase-setup.md) | Supabase clients & middleware | Phase 1 |
| 3 | [03-authentication.md](./03-authentication.md) | Auth UI (login/signup) | Phase 2 |
| 4 | [04-data-layer.md](./04-data-layer.md) | CRUD operations | Phase 2 |
| 5 | [05-contact-pages.md](./05-contact-pages.md) | Contact management pages | Phase 3, 4 |
| 6 | [06-invoice-integration.md](./06-invoice-integration.md) | Invoice editor integration | Phase 3, 4, 5 |

**Recommended Order**: Phases 1-2 sequential, then 3-4 can be parallel, then 5-6 sequential.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth method | Email + Password | Simple, familiar; Google OAuth later |
| Database | Two tables | Business profiles & clients have different usage patterns |
| Contact management | Separate /contacts page | Scalable for many clients |
| Migration | Auto-migrate localStorage | Seamless UX on first login |
| Development | Local Supabase (Docker) | Fast iteration, no cloud costs |

---

## Local Development Setup

**Prerequisites**: Docker running, Supabase CLI installed

```bash
# Already done by user:
supabase init
supabase start

# Useful commands:
supabase status     # Show URLs and keys
supabase db reset   # Reset database
supabase stop       # Stop local Supabase
```

**Local URLs**:
- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- Mailpit (email testing): `http://127.0.0.1:54324`

---

## File Structure (All New Files)

```
/supabase/migrations/
  <timestamp>_create_contacts_tables.sql

/lib/supabase/
  client.ts
  server.ts
  middleware.ts
  business-profiles.ts
  clients.ts

/components/auth/
  AuthProvider.tsx
  LoginForm.tsx
  UserMenu.tsx

/components/contacts/
  BusinessProfileList.tsx
  ClientList.tsx
  ContactForm.tsx
  ContactSelectorModal.tsx

/app/login/page.tsx
/app/auth/callback/route.ts
/app/contacts/page.tsx
/app/contacts/business/page.tsx
/app/contacts/clients/page.tsx

/middleware.ts
.env.local
```

---

## Estimated Scope

- **Total Files**: ~20 new/modified
- **Total Lines**: ~1400
- **Phases**: 6

---

## For Agents

Each phase document contains:
1. **Objective** - What this phase accomplishes
2. **Prerequisites** - What must be completed first
3. **Files to Create/Modify** - Exact file paths
4. **Implementation Details** - Code structure and examples
5. **Acceptance Criteria** - How to verify completion

Start with Phase 1 and proceed in order (or parallel where noted).
