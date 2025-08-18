# Simple Invoice Generator - Flexible Web Application

## Project Overview

Create an extremely flexible, non-restrictive invoice generator web application inspired by InvoiceSimple.com but with maximum customization freedom. Users should be able to modify ANYTHING on the invoice - no locked fields, no forced formats. Think of it as a smart document editor specifically designed for invoices.

## Core Philosophy

- **Nothing is mandatory** - every field is optional
- **Everything is editable** - including column headers, labels, and structure
- **Smart defaults** - but users can override everything
- **Zero restrictions** - users can type anything anywhere

## Tech Stack (Phase 1 - MVP)

- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS
- React 19
- Local Storage for data persistence
- PDF generation library (react-pdf/jsPDF)
- Deployment: Vercel

## Core Features (MVP)

### Main Invoice Editor

Single-page application with these flexible sections:

1. **Header Section**
   - Logo upload (optional, drag & drop or click to upload)
   - Title field (default: "INVOICE" but fully editable - could be "QUOTE", "RECEIPT", etc.)
   - Document number field (editable placeholder)
   - Date fields (editable, with optional date picker)
   - All positions are flexible

2. **Business/Client Sections**
   - Two text areas with smart formatting
   - Default labels: "From:" and "To:" but fully editable
   - Users can type anything - addresses, names, emails, etc.
   - Auto-formats addresses if it detects address patterns
   - Can be used for any purpose (not locked to business/client)

3. **Dynamic Table Section**
   - **Flexible columns**:
     - Default: Description | Quantity | Rate | Amount
     - Users can rename ANY column header (click to edit)
     - Add/remove columns with + / - buttons
     - Reorder columns by dragging
   - **Smart calculations**:
     - Auto-detects number columns
     - If columns named "Quantity" and "Rate" exist, auto-calculate "Amount"
     - But users can override calculations by typing
   - **Dynamic rows**:
     - Easy add/remove rows
     - Tab key adds new row at end
     - Delete key removes empty rows
   - **Flexible totals section**:
     - Default: Subtotal, Tax (optional %), Total
     - Users can rename these (e.g., "Subtotal" → "Before VAT")
     - Add custom total rows (e.g., "Discount", "Shipping")
     - Smart calculation if percentages detected

4. **Footer Section**
   - Flexible text areas for:
     - Payment terms (editable dropdown or free text)
     - Notes/Additional info
     - Bank details
     - Signature area
   - All sections optional and removable

5. **Actions Bar**
   - Preview (shows clean print view)
   - Download PDF
   - Print
   - Save Template (to localStorage)
   - Load Template
   - Reset/Clear
   - Undo/Redo

## Design Requirements

### Layout

- Clean, minimal design with professional defaults
- Inspired by invoice_template.html but more flexible
- Mobile-responsive
- All sections have subtle hover states showing they're editable
- Inline editing everywhere (no separate forms)

### Editing Features

- Click any text to edit
- Tab navigation between fields
- Auto-save to localStorage every change
- Visual indicators for editable areas (subtle border on hover)
- Right-click context menu for advanced options (delete section, duplicate, etc.)

### Currency Handling

- Currency field is just free text
- User can type "$", "R", "€", "USD", or anything
- Smart detection for common formats but no enforcement
- Numbers auto-format with commas if appropriate

### Customization

- Simple color picker for accent color
- Font size adjustment (small/medium/large)
- Toggle between modern and classic templates
- All customization is preview-first

## User Experience Priorities

1. **Zero Learning Curve**
   - Works like a word processor
   - Click to edit anything
   - Drag to reorder
   - Plus/minus to add/remove

2. **Smart but Not Restrictive**
   - Detects patterns (addresses, calculations) but never forces them
   - Suggests but doesn't require
   - Format assistance without format enforcement

3. **Professional Output**
   - Clean PDF generation
   - Print-optimized CSS
   - Hides all edit UI elements in output
   - Professional spacing and typography

## Technical Implementation

### File Structure

```
/app
  /page.tsx (main invoice generator)
  /api
    /generate-pdf/route.ts
  /components
    /invoice-editor/
      /EditableField.tsx (base component for all editable text)
      /EditableTable.tsx (dynamic table with flexible columns)
      /LogoUpload.tsx
      /ColorPicker.tsx
    /invoice-preview/
      /PreviewModal.tsx
    /ui/
      /Button.tsx
      /Icons.tsx
  /lib
    /invoice-calculator.ts (smart calculation logic)
    /pdf-generator.ts
    /storage.ts (localStorage wrapper)
    /types.ts
  /hooks
    /use-auto-save.ts
    /use-undo-redo.ts
    /use-local-storage.ts
  /styles
    /print.css (print-specific styles)

### Key Components

1. **EditableField Component**
```typescript
// Universal editable text component
// Props: defaultValue, placeholder, className, onChange, format
// Handles inline editing, auto-resize, formatting
```

2. **EditableTable Component**

```typescript
// Fully flexible table
// Dynamic columns (add, remove, rename, reorder)
// Dynamic rows
// Smart calculations (optional)
// Drag & drop support
```

3. **SmartCalculator**

```typescript
// Detects calculation patterns
// Works with any column names
// Handles percentages, totals, tax
// Never forces calculations (user can override)
```

## Implementation Priorities

1. Start with basic editable text fields
2. Implement flexible table with dynamic columns
3. Add smart calculations (that can be overridden)
4. Implement clean PDF generation
5. Add localStorage auto-save
6. Polish the editing experience
7. Add templates system

## Reference Implementation Notes

From invoice_template.html:

- Use similar professional layout as default
- Keep the clean spacing and typography
- Use the color scheme as default (but customizable)
- Maintain print-friendly design

From InvoiceSimple screenshots:

- Similar layout structure as starting point
- But make EVERYTHING editable
- Remove all restrictions and locked fields
- Add flexibility that InvoiceSimple doesn't have

## Future Phases (Keep in Mind, Don't Implement)

### Phase 2

- User accounts (Supabase auth)
- Save invoices to cloud
- Invoice history
- Client database
- Templates library

### Phase 3

- Mobile app (React Native)
- Shared component library (Tamagui)
- Monorepo structure
- Offline support

## Success Criteria

1. A user can create any type of invoice/quote/receipt without restrictions
2. Every single text on the page is editable
3. The table structure is completely flexible
4. Professional PDF output regardless of customizations
5. Works perfectly without any signup or setup
6. Grandma-friendly but powerful enough for power users

Build this with extreme focus on flexibility and user freedom. The app should feel like a magical document editor that just happens to be perfect for invoices.
