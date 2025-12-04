# Component 3: ERPNext Adapter - PLAN Phase

## Component Purpose
Transform ERPNext API responses to Refine-compatible format and convert Refine parameters to ERPNext API format.

## Implementation Structure

### Class Design
```typescript
export class ERPNextAdapter {
  // Response transformations
  transformList<T>(response: ERPNextListResponse<T>): RefineListResponse<T>
  transformOne<T>(response: ERPNextOneResponse<T>): RefineOneResponse<T>

  // Parameter transformations
  transformFilters(filters?: RefineFilter[]): ERPNextFilters
  transformSorters(sorters?: RefineSorter[]): ERPNextSorting
  transformPagination(pagination?: RefinePagination): ERPNextPagination
}
```

### Transformation Logic

#### transformList
**Input** (from Step 5):
```json
{ "data": [...] }  // GET endpoint
// OR
{ "message": [...] }  // POST endpoint
```

**Output** (for Refine):
```json
{
  "data": [...],
  "total": <data.length>  // No total_count from API
}
```

#### transformPagination
**Input** (from Refine):
```typescript
{ current: 2, pageSize: 25 }
```

**Output** (for ERPNext):
```typescript
{
  limit_start: 25,  // (current - 1) * pageSize
  limit_page_length: 25
}
```

#### transformFilters
**Input** (from Refine):
```typescript
[{ field: "istable", operator: "eq", value: 0 }]
```

**Output** (for ERPNext):
```typescript
{ istable: 0 }  // Simple equality
```

**Note**: Only support 'eq' operator for MVP (as validated in Step 5)

#### transformSorters
**Input** (from Refine):
```typescript
[{ field: "creation", order: "desc" }]
```

**Output** (for ERPNext):
```typescript
"creation desc"
```

## Test Cases
1. ✅ transformList handles 'data' field
2. ✅ transformList handles 'message' field
3. ✅ transformList handles empty response
4. ✅ transformList defaults total to data.length
5. ✅ transformOne extracts data field
6. ✅ transformPagination converts 1-indexed to 0-indexed
7. ✅ transformFilters handles equality filters
8. ✅ transformFilters logs warning for unsupported operators
9. ✅ transformSorters joins multiple sorters with comma
10. ✅ transformSorters handles empty array

## Edge Cases
- Empty response → return { data: [], total: 0 }
- Missing data/message → default to empty array
- No pagination → return default { limit_start: 0, limit_page_length: 25 }
- No filters → return empty object {}
- No sorters → return empty string ""
- Unsupported filter operator → log warning, skip filter
- Multiple sorters → join with ", " (e.g., "created desc, modified asc")
- Invalid pagination (current < 1) → default to current=1

## Dependencies
- types.ts (all TypeScript interfaces)

## Implementation Plan
1. Create file: `src/providers/erpnextAdapter.ts`
2. Import types from ../features/erpnext-viewer/types
3. Implement ERPNextAdapter class
4. Implement transformList method
5. Implement transformOne method
6. Implement transformPagination method
7. Implement transformFilters method
8. Implement transformSorters method
9. Add factory function createERPNextAdapter
10. Export class and factory

## Validation Checklist
- [ ] TypeScript compiles without errors
- [ ] All transformations produce correct output types
- [ ] Edge cases handled with defaults
- [ ] Warning logs for unsupported features
- [ ] Matches validated API format from Step 5
