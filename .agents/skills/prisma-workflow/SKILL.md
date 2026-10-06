---
name: prisma-workflow
description: >-
  Guide for working with Prisma in this project, including schema changes,
  migrations, the MariaDB adapter pattern, and common queries. Use when
  modifying the database schema or writing complex Prisma queries.
---

# Prisma Workflow Guide

## Important Project-Specific Details

1. **Env file location**: `backend/prisma/.env` (NOT backend root)
2. **Database**: MariaDB via `@prisma/adapter-mariadb` (not direct URL connection)
3. **Config file**: `backend/prisma.config.ts` (Prisma 7 config format)
4. **Schema**: `backend/prisma/schema.prisma`
5. **IDs**: Autoincrement integers (`@id @default(autoincrement())`)

## Adding a New Model

1. Edit `backend/prisma/schema.prisma`:
```prisma
model NewModel {
  id        Int      @id @default(autoincrement())
  name      String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. Create migration:
```bash
cd backend
npx prisma migrate dev --name add_new_model
```

3. The Prisma client auto-regenerates. Verify:
```bash
npx prisma generate
```

## Adding Relations

Follow existing patterns. Example — adding a relation to User:

```prisma
model NewModel {
  id     Int  @id @default(autoincrement())
  userId Int
  user   User @relation(fields: [userId], references: [id])
}

// Don't forget to add the back-relation in User:
model User {
  // ... existing fields
  NewModel NewModel[]
}
```

## Common Query Patterns

### Find with relations
```typescript
const result = await prisma.order.findFirst({
  where: { id },
  include: { 
    orderSeat: true,
    counter: true,
    coachConfig: { include: { coach: true } }
  }
});
```

### Paginated list
```typescript
const [data, total] = await Promise.all([
  prisma.model.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    where: search ? { name: { contains: search } } : undefined
  }),
  prisma.model.count({
    where: search ? { name: { contains: search } } : undefined
  })
]);
```

### Transaction
```typescript
const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  const seats = await tx.orderSeat.createMany({ data: seatData });
  return { order, seats };
});
```

## Troubleshooting

- **"Cannot resolve environment variable: DATABASE_URL"**: The `prisma.config.ts` must load env from `prisma/.env` explicitly.
- **Migration conflicts**: Run `npx prisma migrate reset` (⚠️ destroys data) then re-apply.
- **Type errors after schema change**: Run `npx prisma generate` to regenerate the client.
