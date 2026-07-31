# AI Tooling Chat History & Prompts

## Core Development Prompts



> Build a production-ready backend for a Car Dealership Inventory System using Node.js, TypeScript, Express.js, PostgreSQL, Mongodb, JWT Authentication, bcrypt, Jest, and Supertest.
>
> This project MUST strictly follow Test-Driven Development (TDD):
> - Write failing tests before implementation.
> - Follow the Red → Green → Refactor workflow.
> - Keep commits small and TDD-friendly.
> - Aim for high test coverage.
>
> Architecture Requirements:
> - Clean Architecture
> - SOLID Principles
> - Repository Pattern
> - Service Layer
> - Dependency Injection where appropriate
> - Centralized Error Handling
> - Validation Middleware
> - Environment Configuration
> - Logger
> - Modular Folder Structure
>
> Implement these APIs:
> - POST /api/auth/register
> - POST /api/auth/login
> - GET /api/vehicles
> - GET /api/vehicles/search
> - POST /api/vehicles
> - PUT /api/vehicles/:id
> - DELETE /api/vehicles/:id
> - POST /api/vehicles/:id/purchase
> - POST /api/vehicles/:id/restock
>
> Authentication:
> - JWT
> - bcrypt password hashing
> - Admin/User Roles
> - Protected Routes
> - Role-based Authorization
>
> Database:
> - PostgreSQL
> - Prisma
> - Proper Relationships
> - Constraints
> - Indexes
> - Migrations
> - Seed Data
>
> Every endpoint should include:
> - Validation
> - Meaningful Error Responses
> - Proper HTTP Status Codes
> - Unit Tests
> - Integration Tests
>
> Review every implementation like a senior engineer before moving to the next feature.


> Review against:
> 1. Correctness — logic bugs, edge cases, race conditions, null/undefined handling
> 2. Security — injection risks, auth/authorization gaps, secrets in code, unvalidated input
> 3. Performance — unnecessary re-renders/queries, N+1 problems, memory leaks, algorithmic complexity
> 4. Architecture — separation of concerns, coupling, naming, whether this follows the existing codebase's patterns
> 5. Error handling — are failures caught, logged, and surfaced correctly, or silently swallowed
> 6. Readability/maintainability — would a new engineer understand this in 6 months
> 7. Test coverage — what's untested, and what tests are missing
>
> For each issue found:
> - Severity: 🔴 Blocker / 🟡 Should-fix / 🟢 Nit
> - File + line reference
> - Why it matters (not just "this is bad")
> - The exact fix, as a code diff
>
> Then apply Red-Green-Refactor:
> - 🔴 RED: list what's currently broken or untested (failing/missing state)
> - 🟢 GREEN: show the minimal fix/tests needed to get it working correctly
> - 🔵 REFACTOR: once it's correct, show the clean-up pass for structure/readability — no new behavior
>
> Finally, write a conventional commit message (type(scope): summary, with a body explaining what changed and why) for the fixed version, as if this were about to be committed.

---

## Interactive Feature Development

This document contains the comprehensive chat history and prompts used to interact with the AI assistant during the development of the AutoDrive Car Dealership Inventory System. It illustrates the iterative development workflow, encompassing structural changes, UI/UX polish, bug fixes, and backend logic improvements.


1. Project Planning & Architecture
Act as a Senior Full Stack Software Architect.

Help me build a production-ready Car Dealership Inventory System that follows enterprise software engineering practices.

Project Requirements
- MERN Stack (MongoDB, Express.js, React, Node.js)
- TypeScript
- JWT Authentication
- Tailwind CSS
- Framer Motion
- Jest + Supertest
- React Testing Library
- RESTful API
- Test-Driven Development (TDD)
- SOLID Principles
- Clean Architecture
- Feature-based folder structure
- Git best practices
- Responsive design

First, design the complete project architecture.

Include:
- Folder structure
- Tech stack decisions
- Component architecture
- Backend architecture
- API flow
- Authentication flow
- Database flow
- State management
- Testing strategy

Do not write application code yet.
2. UI/UX Design System & Landing Page
Act as a Senior UI/UX Designer.

Design a premium SaaS landing page for a Car Dealership Inventory Management System.

Theme:
- Luxury Automotive
- Black (#0B0B0D)
- Charcoal (#16181D)
- Ferrari Red (#D62828)
- White
- Glassmorphism
- Soft gradients
- Large typography

Build:
- Sticky Navbar
- Hero Section
- Trusted Stats
- Features
- How It Works
- Product Preview (blurred dashboard only)
- Testimonials
- Pricing
- FAQ
- CTA
- Footer
- Login Modal
- Signup Modal

Requirements:
- React
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Fully Responsive
- Premium animations
- Do NOT build the actual dashboard.
3. Authentication System
Build a complete authentication system using Test-Driven Development.

Requirements:
- Register
- Login
- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-Based Access (Admin/User)
- Input Validation
- Error Handling

Backend:
POST /api/auth/register
POST /api/auth/login

Frontend:
- Login Page
- Signup Page
- Validation
- Loading states
- Success/Error Toasts

Write tests before implementation.
4. MongoDB Database Design
Design the MongoDB database for the Car Dealership Inventory System.

Collections:
- Users
- Vehicles
- Purchases

Vehicle fields:
- make
- model
- category
- year
- VIN
- color
- fuelType
- transmission
- mileage
- price
- quantity
- description
- images
- status
- createdAt
- updatedAt

Provide:
- ER Diagram
- Mongoose Schemas
- Relationships
- Validation Rules
- Indexes
- Best practices
5. Vehicle Management API
Build the complete Vehicle Management REST API using TDD.

Endpoints:
POST /api/vehicles
GET /api/vehicles
GET /api/vehicles/:id
PUT /api/vehicles/:id
DELETE /api/vehicles/:id

Requirements:
- Authentication
- Authorization
- Validation
- Pagination
- Sorting
- Error Handling
- Clean Architecture

Write unit and integration tests before implementation.
6. Inventory & Purchase Module
Implement inventory management.

Endpoints:
POST /api/vehicles/:id/purchase
POST /api/vehicles/:id/restock

Requirements:
- Reduce stock after purchase
- Prevent purchases when quantity is zero
- Admin-only restocking
- Transaction safety
- Purchase history
- Proper validation

Follow TDD and write tests first.
7. Dashboard (After Login)
Build a premium dashboard for authenticated users.

Customer Dashboard:
- Vehicle Grid
- Search
- Filters
- Vehicle Details
- Purchase Button
- Pagination

Admin Dashboard:
- Dashboard Analytics
- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Restock Vehicle
- Sales Summary
- Inventory Overview

Design:
- Luxury Black & Red Theme
- Glassmorphism
- Framer Motion
- Responsive Layout
8. Search & Filtering
Implement advanced search and filtering.

Support:
- Make
- Model
- Category
- Year
- Price Range
- Fuel Type
- Transmission
- Availability

Requirements:
- Backend API filters
- Debounced frontend search
- URL query parameters
- Pagination
- Sorting

Use React Query or Axios with caching where appropriate.
9. Testing Strategy (TDD)
Implement comprehensive testing.

Backend:
- Jest
- Supertest

Frontend:
- React Testing Library
- Vitest

Cover:
- Authentication
- Vehicle CRUD
- Purchase Flow
- Protected Routes
- Search
- Forms
- Components

Target at least 90% code coverage and demonstrate Red → Green → Refactor.
10. Performance & Security
Optimize the application.

Backend:
- Helmet
- CORS
- Rate Limiting
- Input Sanitization
- Secure JWT
- Environment Variables

Frontend:
- Lazy Loading
- Code Splitting
- Image Optimization
- Memoization
- Accessibility (WCAG)
- SEO

Target:
- Lighthouse Score >95
- Fast load times
- Secure production-ready configuration
11. Git Workflow & Documentation
Help me maintain a professional Git workflow.

Requirements:
- Small feature-based commits
- Conventional Commits
- AI Co-author format
- Pull Request template
- Branch naming strategy

Generate:
- README.md
- Installation Guide
- Environment Variables
- API Documentation
- Project Structure
- My AI Usage section
12. Final Review & Production Readiness
Act as a Senior Software Engineer performing a production code review.

Review the entire project for:
- SOLID Principles
- Clean Code
- TDD compliance
- API design
- React best practices
- UI consistency
- Accessibility
- Responsiveness
- Security
- Performance
- Error handling
- Documentation

---
