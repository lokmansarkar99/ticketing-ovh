---
name: add-backend-module
description: >-
  Step-by-step guide for creating a new backend module in the Express/Prisma
  architecture. Use when adding a new feature or CRUD endpoint to the backend.
---

# Adding a New Backend Module

Follow these steps to create a complete backend module.

## Step 1: Define the Prisma Model

Add the model to `backend/prisma/schema.prisma`:

```prisma
model NewFeature {
  id        Int      @id @default(autoincrement())
  name      String
  // ... fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Then generate the client:
```bash
cd backend && npx prisma migrate dev --name add_new_feature
```

## Step 2: Create Module Files

Create the directory `backend/src/module/{featureName}/` with these files:

### `{featureName}.validation.ts`
```typescript
import { Joi, validate } from "express-validation";

const createValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        // ... fields
    })
};

export const verifyCreate = validate(createValidation, {}, {});
```

### `{featureName}.controller.ts`
```typescript
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await prisma.newFeature.findMany();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Data fetched successfully",
            data
        });
    } catch (err) {
        next(err);
    }
};

// ... create, update, delete handlers
```

### `{featureName}.router.ts`
```typescript
import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { getAll, create } from "./{featureName}.controller";
import { verifyCreate } from "./{featureName}.validation";

const router = Router();

router.get('/', verifyJwt, getAll);
router.post('/', verifyJwt, verifyCreate, create);

export default router;
```

### `{featureName}.index.ts`
```typescript
import router from './{featureName}.router';
export default router;
```

## Step 3: Register in Central Router

Add to `backend/src/router/router.ts`:
```typescript
import newFeatureRouter from "../module/{featureName}/{featureName}.index";
// ...
router.use('/{feature-name}', newFeatureRouter);
```

## Step 4: Create Frontend API Slice

Add `frontend/src/store/api/{featureName}/{featureName}Api.ts`:
```typescript
import { apiSlice } from "../../rootApi/apiSlice";

const featureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => ({ url: "/{feature-name}" }),
      providesTags: ["{featureName}"],
    }),
    create: builder.mutation({
      query: (data) => ({
        url: "/{feature-name}",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["{featureName}"],
    }),
  }),
});

export const { useGetAllQuery, useCreateMutation } = featureApi;
```

Don't forget to add the tag type to `apiSlice.ts` tagTypes array.
