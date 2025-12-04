# STEP 6: DESIGN SPECIFICATION

## Executive Summary

This design specification defines the React components, TypeScript interfaces, and build order for the ERPNext DocType Viewer feature. Based on validated API responses from Step 5, we'll implement a read-only viewer using Refine's simple-rest provider with a custom ERPNext adapter.

**Architecture**: Simple REST Provider + ERPNext Adapter (Approach 2)
**Component Count**: 7 components
**Build Order**: Adapter → Data Provider → List → Show → API Client → Types → Routes
**Estimated Implementation**: 1-2 days

---

## Component 1: ERPNext API Client

**Purpose**: Handles authentication and HTTP requests to ERPNext API

**Interface**:
```typescript
// src/utils/erpnextClient.ts

export interface ERPNextClientConfig {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
}

export class ERPNextClient {
  constructor(config: ERPNextClientConfig);

  // Make authenticated GET request
  get<T>(path: string, params?: Record<string, any>): Promise<T>;

  // Make authenticated POST request
  post<T>(path: string, data?: Record<string, any>): Promise<T>;

  // Get authorization header value
  getAuthHeader(): string;
}

// Factory function for creating client
export const createERPNextClient = (
  config: ERPNextClientConfig
): ERPNextClient;
```

**Dependencies**: None (uses native fetch)

**Error Handling**:
- Catch network errors and throw formatted error
- Parse Frappe error responses (`exception`, `exc_type`, `exc`)
- Handle 401 authentication errors specifically
- Retry transient failures (optional for MVP)

**Edge Cases**:
- Missing environment variables → throw early error
- Invalid API credentials → surface authentication error
- Network timeout → timeout after 10 seconds
- CORS errors → provide helpful error message

**Build Order**: **1st** (no dependencies)

---

## Component 2: TypeScript Types

**Purpose**: Define TypeScript interfaces for ERPNext data structures

**Interface**:
```typescript
// src/features/erpnext-viewer/types.ts

// DocType record from API
export interface DocType {
  name: string;                    // DocType name (e.g., "Task")
  module: string;                  // Module name (e.g., "Projects")
  istable: 0 | 1;                 // 0=DocType, 1=Child Table
  issingle?: 0 | 1;               // Single DocType flag
  editable_grid?: 0 | 1;          // Grid editing flag
  track_changes?: 0 | 1;          // Audit log flag
  // Add more fields as discovered in API responses
}

// Generic record from any DocType
export interface DocTypeRecord {
  name: string;                    // Record ID
  [key: string]: any;             // Dynamic fields
}

// DocType field schema (for schema viewer - future)
export interface DocField {
  fieldname: string;
  fieldtype: string;
  label: string;
  reqd?: 0 | 1;
  options?: string;
  // Add more as needed
}

// API response structures (validated in Step 5)
export interface ERPNextListResponse<T> {
  data?: T[];                     // GET /api/resource/DocType
  message?: T[];                  // POST /api/method/frappe.client.get_list
}

export interface ERPNextErrorResponse {
  exception: string;
  exc_type: string;
  exc: string;                    // JSON string with traceback
}

// Refine data provider response types
export interface RefineListResponse<T> {
  data: T[];
  total: number;                  // Note: API doesn't provide, will use data.length
}

export interface RefineOneResponse<T> {
  data: T;
}
```

**Dependencies**: None

**Error Handling**: N/A (type definitions only)

**Edge Cases**: N/A (compile-time only)

**Build Order**: **2nd** (depends on nothing, but needed by all components)

---

## Component 3: ERPNext Adapter

**Purpose**: Transform ERPNext API responses to Refine-compatible format

**Interface**:
```typescript
// src/providers/erpnextAdapter.ts

import { ERPNextListResponse } from '../features/erpnext-viewer/types';

export interface ERPNextAdapterConfig {
  // Future: add config options like field mappings
}

export class ERPNextAdapter {
  // Transform list response (handles both 'data' and 'message' fields)
  transformList<T>(response: ERPNextListResponse<T>): { data: T[]; total: number };

  // Transform single record response
  transformOne<T>(response: { data: T }): { data: T };

  // Transform filters from Refine format to ERPNext format
  transformFilters(filters: any[]): Record<string, any>;

  // Transform sorting from Refine format to ERPNext format
  transformSorters(sorters?: any[]): string;

  // Transform pagination from Refine format to ERPNext format
  transformPagination(pagination?: { current: number; pageSize: number }): {
    limit_start: number;
    limit_page_length: number;
  };
}

export const createERPNextAdapter = (
  config?: ERPNextAdapterConfig
): ERPNextAdapter;
```

**Dependencies**:
- `types.ts` (TypeScript interfaces)

**Error Handling**:
- Handle missing 'data' or 'message' fields gracefully
- Default to empty array if no data
- Validate pagination parameters (pageSize > 0, current >= 1)

**Edge Cases**:
- Empty response (no data) → return `{ data: [], total: 0 }`
- No total_count field (confirmed in Step 5) → use `data.length`
- Complex Refine filters → convert only supported operators, warn on unsupported
- Multiple sorters → join with comma (e.g., "created desc, modified asc")

**Build Order**: **3rd** (depends on types)

---

## Component 4: ERPNext Data Provider

**Purpose**: Refine data provider using simple-rest with ERPNext adapter

**Interface**:
```typescript
// src/providers/erpnextDataProvider.ts

import { DataProvider } from "@refinedev/core";
import { ERPNextClient } from '../utils/erpnextClient';
import { ERPNextAdapter } from './erpnextAdapter';

export interface ERPNextDataProviderConfig {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
}

export const createERPNextDataProvider = (
  config: ERPNextDataProviderConfig
): DataProvider;

// Implementation will use simple-rest as base and override getList/getOne
```

**Dependencies**:
- `@refinedev/core` (DataProvider interface)
- `erpnextClient.ts` (API calls)
- `erpnextAdapter.ts` (response transformation)
- `types.ts` (TypeScript interfaces)

**Error Handling**:
- Wrap all API calls in try-catch
- Transform ERPNext errors to Refine error format
- Surface authentication errors clearly
- Handle network errors with user-friendly messages

**Edge Cases**:
- Resource not found (404) → return empty data
- Permission denied (403) → surface clear permission error
- Rate limiting (429) → display rate limit message (if encountered)
- Invalid filters → log warning, use defaults

**Build Order**: **4th** (depends on client, adapter, types)

---

## Component 5: DocType List Component

**Purpose**: Display paginated list of available DocTypes

**Interface**:
```typescript
// src/features/erpnext-viewer/list.tsx

import { useList } from "@refinedev/core";
import { List, Table, Space, Button, Tag } from "@refinedev/antd";
import { DocType } from './types';

export const DocTypeList: React.FC = () => {
  const { tableProps } = useList<DocType>({
    resource: "DocType",
    pagination: { pageSize: 25 },
    filters: { permanent: [{ field: "istable", operator: "eq", value: 0 }] }
  });

  return (
    <List>
      <Table {...tableProps}>
        <Table.Column dataIndex="name" title="DocType" />
        <Table.Column dataIndex="module" title="Module" />
        <Table.Column
          dataIndex="istable"
          title="Type"
          render={(value) => value === 0 ? <Tag>DocType</Tag> : <Tag>Table</Tag>}
        />
        <Table.Column
          title="Actions"
          render={(_, record: DocType) => (
            <Space>
              <Button size="small" onClick={() => navigate(`/show/${record.name}`)}>
                View Records
              </Button>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
```

**Dependencies**:
- `@refinedev/core` (useList hook)
- `@refinedev/antd` (List, Table components)
- `react-router-dom` (useNavigate)
- `types.ts` (DocType interface)

**Error Handling**:
- Display error alert if API call fails
- Show empty state if no DocTypes found
- Loading skeleton during data fetch

**Edge Cases**:
- No DocTypes accessible → show empty state with message
- Permission errors → display permission denied message
- Slow API → show loading state with skeleton

**Build Order**: **5th** (depends on data provider, types)

---

## Component 6: DocType Show Component

**Purpose**: Display records for selected DocType

**Interface**:
```typescript
// src/features/erpnext-viewer/show.tsx

import { useList, useMany } from "@refinedev/core";
import { Show, Table, Space, Button, Input } from "@refinedev/antd";
import { useParams } from "react-router-dom";
import { DocTypeRecord } from './types';

export const DocTypeShow: React.FC = () => {
  const { doctype } = useParams<{ doctype: string }>();

  const { tableProps, searchFormProps } = useList<DocTypeRecord>({
    resource: doctype || "",
    pagination: { pageSize: 25 }
  });

  return (
    <Show title={`${doctype} Records`}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.Search
          placeholder="Search records..."
          onSearch={(value) => {
            // Apply search filter
          }}
        />

        <Table {...tableProps}>
          <Table.Column dataIndex="name" title="ID" />
          {/* Dynamically generate columns based on first record's keys */}
        </Table>
      </Space>
    </Show>
  );
};
```

**Dependencies**:
- `@refinedev/core` (useList, useMany hooks)
- `@refinedev/antd` (Show, Table components)
- `react-router-dom` (useParams)
- `types.ts` (DocTypeRecord interface)

**Error Handling**:
- Handle invalid DocType name → redirect to list or show error
- Handle empty records → show empty state
- Handle permission errors → show permission message

**Edge Cases**:
- DocType with no records → show empty state
- DocType with many fields → limit columns displayed initially
- Dynamic columns → detect field types and format appropriately
- Large text fields → truncate with "..." and tooltip

**Build Order**: **6th** (depends on data provider, types)

---

## Component 7: Route Registration

**Purpose**: Register ERPNext viewer routes in App.tsx

**Interface**:
```typescript
// src/App.tsx modifications

import { createERPNextDataProvider } from './providers/erpnextDataProvider';
import { DocTypeList } from './features/erpnext-viewer/list';
import { DocTypeShow } from './features/erpnext-viewer/show';

// In App.tsx:
const erpnextProvider = createERPNextDataProvider({
  apiUrl: import.meta.env.VITE_ERPNEXT_API_URL,
  apiKey: import.meta.env.VITE_ERPNEXT_API_KEY,
  apiSecret: import.meta.env.VITE_ERPNEXT_API_SECRET
});

<Refine
  dataProvider={{
    default: dataProvider(supabaseClient), // Existing
    erpnext: erpnextProvider                // New
  }}
  // ... other props
  resources={[
    // Existing resources...
    {
      name: "DocType",
      list: "/erpnext/doctypes",
      show: "/erpnext/doctypes/:doctype",
      meta: { dataProviderName: "erpnext" }
    }
  ]}
/>

// Routes
<Route path="/erpnext/doctypes" element={<DocTypeList />} />
<Route path="/erpnext/doctypes/:doctype" element={<DocTypeShow />} />
```

**Dependencies**:
- All above components
- `@refinedev/core` (Refine component)

**Error Handling**:
- Validate environment variables on app start
- Show startup error if ERPNext credentials missing

**Edge Cases**:
- Missing env vars → show config error page
- Multiple data providers → ensure correct provider used via meta

**Build Order**: **7th (LAST)** - Depends on all components

---

## Component Integration

### Data Flow
```
User → DocTypeList
     → useList hook
     → Refine core
     → ERPNext Data Provider
     → ERPNext Client (with auth)
     → ERPNext API
     → Response
     → ERPNext Adapter (transform)
     → Refine core (cache)
     → useList hook
     → DocTypeList (render)
```

### Interface Contracts

**Data Provider → Adapter**:
- Input: Raw ERPNext API response
- Output: Refine-formatted response `{ data: [], total: N }`

**Data Provider → Client**:
- Input: Resource name, params (filters, pagination, sorting)
- Output: Promise with typed response

**List Component → Data Provider**:
- Input: Resource name ("DocType"), useList params
- Output: tableProps with Ant Design table data

**Show Component → Data Provider**:
- Input: Dynamic resource name (from URL), useList params
- Output: tableProps with DocType-specific records

---

## Build Sequence

### Phase 1: Foundation (Day 1, Morning)
1. ✅ **ERPNext API Client** (`erpnextClient.ts`)
   - Implement authentication
   - Test with prototype script
   - Verify error handling

2. ✅ **TypeScript Types** (`types.ts`)
   - Define all interfaces
   - Export from feature directory

3. ✅ **ERPNext Adapter** (`erpnextAdapter.ts`)
   - Implement transformList
   - Implement transformOne
   - Implement transform helpers (filters, sorting, pagination)
   - Test transformation logic

### Phase 2: Integration (Day 1, Afternoon)
4. ✅ **ERPNext Data Provider** (`erpnextDataProvider.ts`)
   - Create provider factory
   - Wire client + adapter
   - Test with Refine mock

### Phase 3: UI Components (Day 2, Morning)
5. ✅ **DocType List Component** (`list.tsx`)
   - Implement list view
   - Add pagination
   - Test with data provider

6. ✅ **DocType Show Component** (`show.tsx`)
   - Implement record view
   - Dynamic columns
   - Test with various DocTypes

### Phase 4: Integration (Day 2, Afternoon)
7. ✅ **Route Registration** (`App.tsx`)
   - Register routes
   - Configure multi-provider
   - Add to homepage tools grid
   - End-to-end testing

---

## Testing Strategy

### Per Component Tests (Step 7 Checks)

**ERPNext Client**:
- [ ] Unit test: getAuthHeader returns correct format
- [ ] Unit test: get() makes authenticated request
- [ ] Unit test: post() sends correct payload
- [ ] Unit test: Error handling for 401, 403, 404, 500
- [ ] Manual: Test against live API with curl

**ERPNext Adapter**:
- [ ] Unit test: transformList handles 'data' field
- [ ] Unit test: transformList handles 'message' field
- [ ] Unit test: transformList handles empty response
- [ ] Unit test: transformPagination converts Refine to ERPNext format
- [ ] Unit test: transformFilters converts simple equality
- [ ] Unit test: transformSorters converts to "field desc" format

**ERPNext Data Provider**:
- [ ] Integration test: getList returns correct format
- [ ] Integration test: getOne returns single record
- [ ] Integration test: Pagination params passed correctly
- [ ] Integration test: Filters applied correctly
- [ ] Manual: Test with Refine app

**DocType List**:
- [ ] E2E test: Component renders table
- [ ] E2E test: Pagination works
- [ ] E2E test: Filter for istable=0 applied
- [ ] E2E test: "View Records" button navigates
- [ ] Manual: Test in browser

**DocType Show**:
- [ ] E2E test: Component renders table
- [ ] E2E test: Dynamic columns generated
- [ ] E2E test: Pagination works
- [ ] E2E test: Empty state shown for no records
- [ ] Manual: Test with Task, User, ToDo DocTypes

**Route Registration**:
- [ ] E2E test: Routes accessible
- [ ] E2E test: Multi-provider works
- [ ] E2E test: Navigation from homepage works
- [ ] Manual: Full user journey test

---

## Performance Considerations

### Caching Strategy
- **DocType List**: Cache for 5 minutes (rarely changes)
- **DocType Records**: No cache (dynamic data)
- **Leverage Refine Cache**: Use built-in query cache

### Pagination
- **Default Page Size**: 25 records
- **Max Page Size**: 100 records
- **Offset-Based**: Use `limit_start` + `limit_page_length`
- **No Total Count**: API doesn't provide, use `data.length` and detect end

### Lazy Loading
- **Component Splitting**: Lazy load DocTypeShow (not needed on list page)
- **Dynamic Imports**: Use React.lazy for show component

---

## Security Considerations

### API Credentials
- ✅ Stored in environment variables (VITE_ prefix)
- ⚠️ Exposed in client bundle (read-only, acceptable for MVP)
- 🔮 Future: Cloudflare Workers proxy to hide credentials

### CORS
- ⚠️ Must add allowed origins in ERPNext OAuth Settings:
  - `http://localhost:5173` (development)
  - `https://10nz.tools` (production)

### Input Validation
- Validate DocType names (alphanumeric + spaces only)
- Sanitize search inputs (prevent injection)
- Limit page size to prevent abuse

---

## Accessibility Checklist

- [ ] Semantic HTML (Table, List components)
- [ ] Keyboard navigation (all buttons/links focusable)
- [ ] ARIA labels for icon buttons
- [ ] Screen reader announcements for loading states
- [ ] Focus management (return focus after navigation)
- [ ] Color contrast (use Ant Design defaults, WCAG AA compliant)

---

## Known Limitations

### API Limitations (from Step 5)
1. **No Total Count**: API doesn't return total count field
   - **Workaround**: Use empty result detection for "no more pages"
2. **Simple Filters Only**: Only tested equality filters
   - **Workaround**: Limit filter UI to supported operators
3. **Read-Only**: No write operations
   - **Acceptance**: Feature is read-only viewer by design

### Component Limitations
1. **Dynamic Columns**: All fields rendered as text
   - **Future**: Add field type detection and custom renderers
2. **No Schema Viewer**: Schema display deferred to future
   - **Future**: Add DocField query and display
3. **No Export**: CSV/JSON export deferred to future
   - **Future**: Add export buttons with client-side generation

---

## BetterST Design Planning

**Thought 1**: Identified 7 components needed - API client, types, adapter, data provider, list view, show view, and route registration.

**Thought 2**: Designed API client with authentication and error handling, using native fetch for zero dependencies.

**Thought 3**: Defined TypeScript interfaces matching validated API responses from Step 5 (data/message fields, no total_count).

**Thought 4**: Designed adapter to transform ERPNext responses to Refine format, handling both GET (data) and POST (message) response structures.

**Thought 5**: Planned data provider using simple-rest as base, overriding getList/getOne to use custom client + adapter.

**Thought 6**: Designed list component with Ant Design table, pagination, and filter for istable=0 (non-table DocTypes).

**Thought 7**: Designed show component with dynamic column generation based on first record's keys.

**Thought 8**: Established build order - foundation (client, types, adapter) → integration (provider) → UI (list, show) → routes (App.tsx).

**Thought 9**: Documented testing strategy with per-component checks matching RAEP-DEV Step 7 enforcement.

**Thought 10**: Identified known limitations (no total count, simple filters, read-only) with clear workarounds documented.

---

**Design Specification Complete**: Ready for Step 7 (Implementation) with Plan-Execute-Check enforcement
