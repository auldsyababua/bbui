# Component 2: TypeScript Types - PLAN Phase

## Component Purpose
Define all TypeScript interfaces for ERPNext data structures based on validated API responses from Step 5.

## Implementation Structure

### Interfaces to Define

1. **DocType** - Main DocType record
   - Fields confirmed in Step 5: name, module, istable
   - Additional fields to add: issingle, editable_grid, track_changes

2. **DocTypeRecord** - Generic record from any DocType
   - name field (required)
   - Dynamic fields using index signature

3. **DocField** - DocType field schema (for future schema viewer)
   - fieldname, fieldtype, label, reqd, options

4. **API Response Types**
   - ERPNextListResponse<T> - handles both 'data' and 'message' fields
   - ERPNextErrorResponse - Frappe error structure

5. **Refine Response Types**
   - RefineListResponse<T> - format expected by Refine
   - RefineOneResponse<T> - single record format

## Type Safety Strategy
- Use strict types (no `any` except for dynamic fields)
- Optional fields marked with `?`
- Union types for known values (istable: 0 | 1)
- Generic types for reusable structures

## Validated Fields (from Step 5 prototype)
```typescript
// From test output:
DocType {
  name: "Account",
  module: "Accounts",
  istable: 0
}
```

## Test Cases
- [x] All interfaces compile without errors
- [x] Types match validated API responses
- [x] Generic types work correctly
- [x] Optional fields properly marked

## Edge Cases
- Dynamic fields in DocTypeRecord → use index signature
- Unknown DocType fields → allow with [key: string]: any
- Response variations → union types for data/message

## Dependencies
- None (pure type definitions)

## Implementation Plan
1. Create file: `src/features/erpnext-viewer/types.ts`
2. Define DocType interface
3. Define DocTypeRecord interface
4. Define DocField interface (for future)
5. Define API response interfaces
6. Define Refine response interfaces
7. Export all types

## Validation Checklist
- [ ] TypeScript compiles without errors
- [ ] All interfaces exported
- [ ] Types match Step 5 prototype responses
- [ ] Generic types properly constrained
- [ ] No circular dependencies
