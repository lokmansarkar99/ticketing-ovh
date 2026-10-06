# Backend Module Rules

## Module Structure
When creating a new backend module, always create these files:
1. `{name}.router.ts` — Route definitions
2. `{name}.controller.ts` — Request handlers
3. `{name}.validation.ts` — Joi validation schemas
4. `{name}.index.ts` — Barrel re-export of the router

## Middleware Ordering
Apply middleware in this order on routes:
1. `verifyJwt` — Authentication
2. `verifyAdmin` or `verifyPermission(type, access)` — Authorization
3. `validate(schema)` — Request validation
4. Controller function — Business logic

## Error Handling
- Wrap all controller logic in `try { ... } catch (err) { next(err) }`
- Never send raw Prisma errors to the client
- Use consistent response format with `success`, `statusCode`, `message`

## Database Queries
- Import prisma from `../../utils/prisma`
- Use `findFirst` for single record lookups (not `findUnique` unless checking unique fields)
- Always include `select` or `include` to control response shape
- For related data, use Prisma `include` — avoid manual joins

## Environment Variables
- All env vars are in `backend/prisma/.env`
- Access via `process.env.VARIABLE_NAME` (loaded by dotenv in index.ts)
- For config values, add to `backend/src/config/index.ts`
