# Frontend Development Rules

## Component Patterns
- Use ShadCN/Radix UI components from `@/components/ui/` as the base — extend, don't replace
- Create reusable components in `@/components/shared/` for cross-feature use
- Feature-specific components go in `@/sections/` organized by feature

## State Management
- Use RTK Query for all API calls — do not use `fetch` or `axios` directly
- Create API slices in `src/store/api/{feature}/` using `apiSlice.injectEndpoints`
- Always define `providesTags` on queries and `invalidatesTags` on mutations
- Use Redux slices only for client-side state (filters, modals, user data)

## Styling
- Use Tailwind CSS utility classes — avoid inline styles
- Use CSS variable colors: `bg-primary`, `text-secondary`, `border-muted`, etc.
- Dark mode is class-based — `.dark` class. Both themes must be supported
- Custom fonts: `font-anek` (Bengali), `font-lora` (headings), `font-open_sans` (body)
- Use the `cn()` utility from `@/lib/utils` for conditional class merging

## Forms
- Use `react-hook-form` with `@hookform/resolvers` and `zod` schemas
- Validation schemas go in `src/schemas/`
- Use ShadCN form components for consistent styling

## Routing
- Public pages go in `src/pages/public/`
- Dashboard pages go in `src/pages/dashboard/{role}/`
- Route definitions go in `src/routers/routes/`
- Each role has its own route guard in `src/routers/routeWrapper/`

## i18n
- Use the `useTranslation` hook from `react-i18next`
- Support Bengali (bn) and English (en)
- Translation keys should be descriptive: `pages.home.title`, `auth.login.button`
