# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working on the Simple Invoice Generator project.

## Project Overview

Building a flexible, non-restrictive invoice generator web application for non-tech-savvy small business owners. The app should be "idiot-proof" with zero learning curve - everything is editable, nothing is mandatory.

## Tech Stack

**Phase 1 (Current - MVP):**

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- React 18
- Local Storage (no backend initially)
- PDF generation (react-pdf/jsPDF)

**Phase 2 (Future):**

- Add: Supabase (Auth + Database)
- Add: Prisma (ORM)
- Add: Zustand (state management)

**Phase 3 (Future):**

- Add: React Native + Expo
- Add: Tamagui (shared components)
- Add: Turborepo (monorepo)

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

## Project Structure

```

/app              # Next.js app router
/components       # React components
  /invoice-editor # Editing components
  /invoice-preview # Preview/PDF components
  /ui             # Reusable UI components
/lib              # Utilities and helpers
/hooks            # Custom React hooks
/styles           # Global styles and print CSS
/public           # Static assets

```

## Development Guidelines

1. **Start Simple**: Build basic functionality first, then add enhancements
2. **User-Centric**: Every decision should make the app easier for non-technical users
3. **No Dependencies on External Services**: MVP should work completely offline
4. **Responsive Design**: Must work perfectly on mobile, tablet, and desktop
5. **Browser Compatibility**: Should work in all modern browsers

## Common Tasks

- **Adding a new editable field**: Use the `EditableField` component
- **Modifying table behavior**: Update `EditableTable` component
- **Changing calculations**: Modify `invoice-calculator.ts`
- **Adjusting PDF output**: Update `pdf-generator.ts`

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
