# Component 7: Route Registration - PLAN Phase

## Component Purpose
Register ERPNext viewer routes in App.tsx and configure multi-provider setup.

## Implementation Tasks

### 1. Add Environment Variables
Check `.dev.vars` for ERPNext credentials:
```bash
VITE_ERPNEXT_API_URL=https://ops.10nz.tools
VITE_ERPNEXT_API_KEY=dbf4bb1b556e3d2
VITE_ERPNEXT_API_SECRET=f6097d1b5069034
```

### 2. Create ERPNext Data Provider
```typescript
import { createERPNextDataProvider } from './providers/erpnextDataProvider';

const erpnextProvider = createERPNextDataProvider({
  apiUrl: import.meta.env.VITE_ERPNEXT_API_URL,
  apiKey: import.meta.env.VITE_ERPNEXT_API_KEY,
  apiSecret: import.meta.env.VITE_ERPNEXT_API_SECRET,
});
```

### 3. Configure Multi-Provider
```typescript
<Refine
  dataProvider={{
    default: dataProvider(supabaseClient),  // Existing
    erpnext: erpnextProvider                 // New
  }}
  // ... other props
/>
```

### 4. Add Resource Definition
```typescript
resources={[
  // ... existing resources
  {
    name: "DocType",
    list: "/tools/erpnext/doctypes",
    show: "/tools/erpnext/doctypes/:doctype",
    meta: {
      dataProviderName: "erpnext",
      label: "ERPNext DocTypes",
      hide: true, // Hide from sidebar (access via tools grid)
    },
  },
]}
```

### 5. Add Routes
```typescript
<Route path="/tools/erpnext/doctypes">
  <Route index element={<DocTypeList />} />
  <Route path=":doctype" element={<DocTypeShow />} />
</Route>
```

### 6. Add to Homepage Tools Grid (Optional)
Update `src/features/tools/grid.tsx` to include ERPNext viewer card.

## Validation Steps

### Environment Variables
- [ ] Check .dev.vars exists
- [ ] Add VITE_ERPNEXT_* variables if missing
- [ ] Verify values match Step 5 prototype credentials

### App.tsx Changes
- [ ] Import createERPNextDataProvider
- [ ] Import DocTypeList, DocTypeShow
- [ ] Create erpnextProvider instance
- [ ] Configure multi-provider
- [ ] Add DocType resource
- [ ] Add routes under /tools/erpnext/doctypes

### Testing
- [ ] TypeScript compiles without errors
- [ ] App starts without errors
- [ ] Routes accessible: /tools/erpnext/doctypes
- [ ] Multi-provider works correctly
- [ ] ERPNext viewer loads data

## Edge Cases
- Missing env vars → show config error
- Invalid credentials → show authentication error
- CORS errors → show helpful message

## Implementation Plan
1. Check/update .dev.vars
2. Read current App.tsx
3. Add imports for ERPNext components and provider
4. Create erpnextProvider before <Refine>
5. Update dataProvider prop to multi-provider object
6. Add DocType resource to resources array
7. Add routes under authenticated routes
8. Verify TypeScript compiles
9. Test in browser (if possible)

## Validation Checklist
- [ ] Environment variables configured
- [ ] TypeScript compiles without errors
- [ ] App starts without errors
- [ ] Routes registered correctly
- [ ] Multi-provider configured
- [ ] Resource definition complete
