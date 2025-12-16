# Design Guidelines: Solar Proposal Generator

## Design Approach

**Selected Approach**: Design System - Productivity Focus  
**Primary Reference**: Linear + Notion hybrid approach  
**Rationale**: Form-heavy productivity tool requiring efficiency, clarity, and professional polish. Users need fast data entry and clear visual hierarchy across multiple input sections.

## Core Design Principles

1. **Efficiency First**: Streamlined forms with clear groupings and logical flow
2. **Professional Polish**: Clean, trustworthy aesthetic befitting B2B solar energy proposals
3. **Clear Hierarchy**: Visual distinction between form sections, data types, and actions
4. **Minimal Friction**: Reduce cognitive load during rapid data entry

## Typography

**Font Stack**: Inter (primary) via Google Fonts CDN  
**Hierarchy**:
- Page titles: text-3xl font-semibold (30px)
- Section headers: text-xl font-semibold (20px)
- Form labels: text-sm font-medium (14px) uppercase tracking-wide
- Input text: text-base (16px)
- Helper text: text-sm text-gray-600 (14px)
- List/table data: text-sm (14px)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16  
**Common Patterns**:
- Form sections: mb-12 between major groups
- Form fields: mb-6 between individual fields
- Card padding: p-8
- Page margins: px-6 md:px-12
- Container max-width: max-w-4xl for forms, max-w-6xl for lists

**Grid Strategy**:
- Single column for forms (max-w-2xl centered)
- Two-column for related fields (grid-cols-1 md:grid-cols-2 gap-6)
- Three-column for proposal list table on desktop

## Component Library

### Navigation
- Simple top bar with logo/title left, "Nova Proposta" + "Propostas" links right
- Fixed position with subtle border-b
- Height: h-16, padding px-6 md:px-12

### Form Components

**Input Groups**:
- Visual card containers (border rounded-lg p-6 mb-8) for each section
- Section title at top (text-lg font-semibold mb-6)
- Labels above inputs, required indicators with asterisk
- Input fields: full width, h-11, rounded-md border, focus:ring-2
- Multi-line textarea: min-h-24 for optional notes

**Field Groupings** (in order):
1. Dados do Cliente (Client Data)
2. Dados Técnicos (Technical Specs)  
3. Equipamentos (Equipment)
4. Garantias (Warranties)
5. Valor (Pricing)

**Field Layout**:
- Name, city: full width
- Date + validity: side-by-side (grid-cols-2 gap-4)
- Technical specs: full width for clarity
- Equipment model + quantity: side-by-side
- Warranties: 2-column grid on desktop, stack mobile

### Buttons
- Primary action: "Gerar Proposta PDF" - large h-12 w-full md:w-auto px-8 rounded-md font-medium
- Secondary: "Voltar" - outlined style
- Table actions: "Baixar PDF" - compact h-9 px-4

### Data Display

**Proposal List Table**:
- Clean table with hover states on rows
- Column headers: font-medium text-sm uppercase tracking-wide
- Cells: py-4 px-6 border-b
- Sticky header on scroll
- Mobile: Stack as cards with key info

**Empty States**:
- Centered icon + message for "Nenhuma proposta ainda"
- CTA button to create first proposal

### Status Indicators
- Date auto-filled: subtle badge or icon indicating "hoje"
- Required field validation: border-red-500 with error message below

## Page Layouts

### Nova Proposta (Form Page)
- Centered container max-w-2xl
- Page title at top with subtitle explaining purpose
- Form sections in cards with clear visual separation
- Sticky bottom bar with submit button on mobile
- Progress indicator optional (5 sections)

### Propostas (List Page)
- Full-width container max-w-6xl
- Header with title + "Nova Proposta" button right-aligned
- Search/filter bar below header (mb-6)
- Responsive table/card switch
- Pagination if needed (bottom)

## Images

**Logo Placement**: Top-left navigation bar, height h-8 to h-10  
**No Hero Image**: This is a utility application focused on form efficiency  
**PDF Preview Icon**: Small thumbnail icon in proposal list to indicate downloadable document

## Responsive Behavior

**Breakpoints**:
- Mobile-first approach
- md: 768px (2-column grids activate)
- lg: 1024px (full table view)

**Mobile Adaptations**:
- Single column forms throughout
- Stacked nav items or hamburger if needed
- Table converts to card list
- Sticky submit button bar at bottom

## Professional Touch

- Subtle shadows on cards (shadow-sm)
- Clean borders (border-gray-200)
- Adequate whitespace prevents cramped feeling
- Consistent border-radius (rounded-md = 6px, rounded-lg = 8px)
- Focus states with ring for accessibility