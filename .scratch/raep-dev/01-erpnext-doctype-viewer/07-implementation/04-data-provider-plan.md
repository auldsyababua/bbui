# Component 4: ERPNext Data Provider - PLAN Phase

## Component Purpose
Create Refine-compatible data provider that uses ERPNextClient and ERPNextAdapter to fetch data from ERPNext API.

## Implementation Structure

### Provider Implementation
```typescript
export const createERPNextDataProvider = (
  config: ERPNextDataProviderConfig
): DataProvider => {
  const client = createERPNextClient(config);
  const adapter = createERPNextAdapter();

  return {
    getList: async ({ resource, pagination, sorters, filters }) => {
      // Call ERPNext API
      // Transform parameters
      // Return Refine-compatible response
    },

    getOne: async ({ resource, id }) => {
      // Fetch single record
    },

    // Other methods (create, update, delete) - throw "not supported"
  };
};
```

### API Endpoint Strategy
**From Step 5 validation**:
- List DocTypes: `POST /api/method/frappe.client.get_list` with `doctype` param
- Single DocType: `GET /api/resource/DocType/{name}`
- DocType records: `POST /api/method/frappe.client.get_list` with dynamic doctype

### getList Implementation
1. Transform Refine pagination → ERPNext pagination
2. Transform Refine filters → ERPNext filters
3. Transform Refine sorters → ERPNext sorting string
4. Call `POST /api/method/frappe.client.get_list` with params:
   ```json
   {
     "doctype": resource,
     "fields": ["*"],
     "filters": { ... },
     "order_by": "...",
     "limit_start": 0,
     "limit_page_length": 25
   }
   ```
5. Transform response using adapter
6. Return `{ data: [], total: N }`

### getOne Implementation
1. Call `GET /api/resource/{resource}/{id}`
2. Extract data field
3. Return `{ data: {...} }`

### Error Handling
- Wrap all API calls in try-catch
- Transform ERPNext errors to Refine format
- Surface authentication errors clearly
- Handle network errors

## Test Cases
1. ✅ getList returns correct format
2. ✅ getList applies pagination correctly
3. ✅ getList applies filters correctly
4. ✅ getList applies sorting correctly
5. ✅ getOne fetches single record
6. ✅ Error handling for 401/403/404
7. ✅ unsupported methods throw clear errors

## Edge Cases
- Resource not found (404) → return empty data
- Permission denied (403) → throw clear error
- Invalid filters → log warning, use defaults
- Missing ID in getOne → throw error
- Unsupported methods (create, update, delete) → throw "not supported"

## Dependencies
- @refinedev/core (DataProvider interface)
- erpnextClient.ts (API calls)
- erpnextAdapter.ts (transformations)
- types.ts (TypeScript interfaces)

## Implementation Plan
1. Create file: `src/providers/erpnextDataProvider.ts`
2. Import dependencies
3. Define ERPNextDataProviderConfig interface
4. Implement createERPNextDataProvider factory
5. Implement getList method
6. Implement getOne method
7. Implement unsupported methods (throw errors)
8. Add error handling
9. Export factory function

## Validation Checklist
- [ ] TypeScript compiles without errors
- [ ] All DataProvider methods implemented
- [ ] getList works with pagination/filters/sorting
- [ ] getOne fetches single record
- [ ] Unsupported methods throw clear errors
- [ ] Error handling comprehensive
