# Phase 2: Supabase Client Setup

## Objective
Set up Supabase client libraries and middleware for browser and server-side usage.

## Prerequisites
- Phase 1 complete (database tables exist)
- Local Supabase running

## Dependencies to Install

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Files to Create

### 1. Environment Variables
**Path**: `/.env.local`

Get values from `supabase start` output:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx  # Use the "Publishable" key
```

**Key Mapping** (newer Supabase CLI uses different names):
- `Publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe for browser)
- `Secret` key → Only for server-side admin operations (not needed for this project)

**Important**:
- Add `.env.local` to `.gitignore` if not already there
- The Publishable key is safe to expose in browser code

---

### 2. Browser Client
**Path**: `/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

### 3. Server Client
**Path**: `/lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
```

---

### 4. Middleware Helper
**Path**: `/lib/supabase/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  // IMPORTANT: Do not remove this - it refreshes the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}
```

---

### 5. Root Middleware
**Path**: `/middleware.ts` (project root)

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

### 6. TypeScript Types (Optional but Recommended)
**Path**: `/lib/supabase/types.ts`

```typescript
import type { SectionField } from '@/lib/types'

// Database row types
export interface BusinessProfile {
  id: string
  user_id: string
  name: string
  fields: SectionField[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  fields: SectionField[]
  is_default: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

// Insert types (without id, timestamps)
export interface BusinessProfileInsert {
  name: string
  fields: SectionField[]
  is_default?: boolean
}

export interface ClientInsert {
  name: string
  fields: SectionField[]
  is_default?: boolean
  notes?: string
}

// Update types (all optional)
export interface BusinessProfileUpdate {
  name?: string
  fields?: SectionField[]
  is_default?: boolean
}

export interface ClientUpdate {
  name?: string
  fields?: SectionField[]
  is_default?: boolean
  notes?: string
}
```

---

## File Structure After This Phase

```
/lib/supabase/
  client.ts      # Browser client
  server.ts      # Server client
  middleware.ts  # Session refresh helper
  types.ts       # TypeScript types

/middleware.ts   # Root middleware

.env.local       # Environment variables
```

## Acceptance Criteria

- [ ] `npm install @supabase/supabase-js @supabase/ssr` completed
- [ ] `.env.local` created with correct local Supabase credentials
- [ ] All 5 files created in correct locations
- [ ] No TypeScript errors (`npm run type-check` or `npx tsc --noEmit`)
- [ ] Dev server starts without errors (`npm run dev`)

## Verification

1. Run the dev server: `npm run dev`
2. Check browser console - no Supabase connection errors
3. Verify middleware runs (add console.log temporarily if needed)

## Testing the Setup

Create a temporary test in any page:

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function TestPage() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('Session:', data)
      console.log('Error:', error)
    })
  }, [])

  return <div>Check console</div>
}
```

## Next Phase
→ [03-authentication.md](./03-authentication.md)
