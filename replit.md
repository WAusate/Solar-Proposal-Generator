# SolarPro - Solar Proposal Generator

## Overview

SolarPro is a web-based system for generating commercial solar energy proposals in PDF format. Built for solar integrators in Brazil, it streamlines the creation of professional, standardized proposals without requiring complex calculations. Users manually input technical and financial data, and the system generates formatted PDF documents ready for client delivery.

The application follows a form-heavy productivity tool design pattern, prioritizing efficiency, clarity, and professional polish for B2B solar energy sales workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful JSON API under `/api/*` prefix
- **PDF Generation**: PDFKit for server-side PDF document creation
- **Build System**: Vite for frontend, esbuild for server bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Definition**: Shared schema in `shared/schema.ts` using Drizzle's pgTable definitions
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Storage Abstraction**: Interface-based storage pattern (`IStorage`) with in-memory implementation available

### Key Design Patterns
- **Monorepo Structure**: Client code in `client/`, server in `server/`, shared types in `shared/`
- **Path Aliases**: `@/*` for client source, `@shared/*` for shared modules
- **Type Safety**: End-to-end TypeScript with shared schema types between client and server

### Data Models
- **Proposals**: Core entity containing client info, system specs (power, modules, inverters), warranty details, and pricing

### Authentication
- **Session-based**: Uses express-session with memory store
- **Single admin user**: Credentials stored in environment variables
- **Protected routes**: All `/api/proposals/*` routes require authentication

## Authentication Setup

### Credentials Storage
Login and password are stored as environment variables (Secrets):
- `ADMIN_USER` - Username for login
- `ADMIN_PASSWORD` - Password for login  
- `SESSION_SECRET` - Secret key for session encryption

### How to Change Login/Password
1. Go to the **Secrets** tab in Replit (lock icon in the sidebar)
2. Find `ADMIN_USER` and `ADMIN_PASSWORD`
3. Click to edit and enter new values
4. Save and restart the application

### Current Credentials
- Username: `admin`
- Password: `solar2025`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations stored in `migrations/` directory

### UI Framework Dependencies
- **Radix UI**: Full suite of accessible, unstyled primitives
- **Lucide React**: Icon library
- **date-fns**: Date formatting with Portuguese (Brazil) locale support
- **class-variance-authority**: Component variant management

### PDF Generation
- **PDFKit**: Server-side PDF document generation with A4 page format

### Development Tools
- **Vite**: Development server with HMR
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment