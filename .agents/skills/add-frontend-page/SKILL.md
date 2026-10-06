---
name: add-frontend-page
description: >-
  Step-by-step guide for adding a new page to the React frontend, including
  routing, layout integration, and RTK Query data fetching.
---

# Adding a New Frontend Page

Follow these steps to add a new page to the correct role dashboard.

## Step 1: Create the Page Component

Create your page file in the appropriate directory based on role:

- **Public**: `frontend/src/pages/public/NewPage.tsx`
- **Admin**: `frontend/src/pages/dashboard/admin/NewPage.tsx`
- **Counter**: `frontend/src/pages/dashboard/counterRole/NewPage.tsx`
- **Accounts**: `frontend/src/pages/dashboard/accountsRole/NewPage.tsx`
- **Supervisor**: `frontend/src/pages/dashboard/supervisor/NewPage.tsx`

```tsx
import { useTranslation } from "react-i18next";

const NewPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("pages.newPage.title")}</h1>
      {/* Page content */}
    </div>
  );
};

export default NewPage;
```

## Step 2: Add the Route

Add the route definition in the correct file under `frontend/src/routers/routes/`:

```typescript
import { lazy } from "react";
const NewPage = lazy(() => import("@/pages/dashboard/admin/NewPage"));

export const newPageRoutes = [
  {
    path: "new-page",
    element: <NewPage />,
  },
];
```

## Step 3: Register the Route

Add the route array to the appropriate layout in `frontend/src/routers/routers.tsx`:

```typescript
import { newPageRoutes } from "./routes/newPage";

// Inside the correct role's children array:
children: [
  ...existingRoutes,
  ...newPageRoutes,
],
```

## Step 4: Connect API Data (if needed)

Create or extend an RTK Query API slice:

```typescript
// src/store/api/{feature}/{feature}Api.ts
import { apiSlice } from "../../rootApi/apiSlice";

const featureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeatureData: builder.query({
      query: (params) => ({
        url: `/feature-endpoint`,
        params,
      }),
      providesTags: ["featureTag"],
    }),
  }),
});

export const { useGetFeatureDataQuery } = featureApi;
```

Use in your page:
```tsx
const { data, isLoading } = useGetFeatureDataQuery();
```

## Step 5: Add Navigation Link

Add the navigation item to the relevant sidebar component in `src/components/common/navigation/`.

## Checklist

- [ ] Page component created in correct role directory
- [ ] Route definition added
- [ ] Route registered in `routers.tsx`
- [ ] API slice created (if data-driven)
- [ ] Navigation link added to sidebar
- [ ] i18n translations added for page title
- [ ] Works in both light and dark mode
