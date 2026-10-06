# Ticketing-OVH Project Rules

## Project Context
This is a full-stack **bus ticketing and fleet management platform** for Prantik Paribahan Ltd.
- **Backend**: Node.js + Express + TypeScript + Prisma 7 (MariaDB adapter)
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS 3 + ShadCN/Radix UI + Redux Toolkit (RTK Query)

## Code Style & Conventions

### Backend
- Follow the existing module pattern: `module/{name}/{name}.router.ts`, `{name}.controller.ts`, `{name}.validation.ts`, `{name}.index.ts`
- Use Prisma client from `../../utils/prisma` — never create new PrismaClient instances
- All controllers are async Express handlers: `async (req: Request, res: Response, next: NextFunction) => { try { ... } catch (err) { next(err) } }`
- Use `express-validation` with Joi schemas for request validation
- Use consistent response format: `{ success: boolean, statusCode: number, message: string, data?: any }`
- Chain middleware in router files: `router.post('/path', verifyJwt, verifyPermission('type', 'access'), validate, controller)`
- Environment variables are loaded from `backend/prisma/.env` (NOT the backend root)

### Frontend
- Use `@/` path alias for imports (mapped to `./src/`)
- Create RTK Query API slices in `src/store/api/` using `apiSlice.injectEndpoints`
- Always provide cache tags for invalidation in RTK Query mutations/queries
- Use ShadCN components from `@/components/ui/` — don't reinvent base UI
- Use Tailwind CSS variables (e.g., `bg-primary`, `text-foreground`) — don't hardcode hex colors
- Respect the 7 role-based layout structure when adding new pages
- Use `react-hook-form` + `zod` for form validation

### General
- TypeScript is mandatory — avoid `any` types where possible
- Keep comments minimal, simple, and clean (e.g. `// Cloudinary client setup`). Avoid decorative ASCII banner comments (e.g. `// =====...=====`)
- Preserve all existing comments and docstrings unless explicitly told to remove them
- When adding new API routes, register them in `backend/src/router/router.ts`
- Always handle errors with try-catch in controllers, passing errors to `next()`

## Architecture Rules
- Do NOT create direct database connections — always use the Prisma singleton from `utils/prisma.ts`
- Do NOT use `cors({ origin: "*" })` in production — use the `FRONTEND_URLS` env variable
- JWT tokens use separate secrets for access, refresh, and OTP tokens — do not mix them
- File uploads go to Cloudinary via the `fileUpload` module — do not store files locally
- The Prisma schema uses autoincrement integer IDs, not UUIDs

## Guide Documentation
- Project documentation lives in the `guide/` folder at the repo root
- `guide/` is git-ignored — it is local developer reference only
- When making significant architectural changes, update the relevant guide file
