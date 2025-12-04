# STEP 1: INVENTORY

## Functional Requirements

### Core Features
1. **DocType Browser** - List all available DocTypes from ERPNext
2. **Schema Viewer** - Display DocType schema (fields, types, options, mandatory status)
3. **Record Browser** - View records for selected DocType with pagination
4. **Filter & Search** - Filter records by field values, search across fields
5. **Export Functionality** - Export records to CSV/JSON formats
6. **Navigation** - Intuitive UI similar to removed Supabase file viewer

### User Workflows
1. User selects DocType from list → Views schema → Browses records
2. User applies filters → Views filtered results → Exports to CSV
3. User searches for records → Views results → Clicks to view details

## Non-Functional Requirements

### Performance
- **Load Time**: Initial DocType list load < 2 seconds
- **Pagination**: Support 25/50/100 records per page
- **Large Datasets**: Handle DocTypes with 10,000+ records efficiently
- **Response Time**: API calls < 3 seconds (network dependent)

### Security
- **API Credentials**: Store in environment variables, never expose in client code
- **CORS**: Handle Cloudflare Workers CORS for ERPNext API calls
- **Permissions**: Respect ERPNext user permissions (read-only via API)
- **Authentication**: Require user to be authenticated in bbui app

### Usability
- **Responsive Design**: Mobile-friendly Ant Design components
- **Error Handling**: Clear error messages for API failures
- **Loading States**: Skeleton screens during data fetching
- **Accessibility**: Keyboard navigation, screen reader support

### Reliability
- **Error Recovery**: Graceful degradation if ERPNext API unavailable
- **Cache Strategy**: Consider caching DocType schemas (static data)
- **Retry Logic**: Automatic retry for transient API failures

## Technology Stack

### Frontend
- **Framework**: React 18.0.0 (already in project)
- **UI Library**: Ant Design 5.0.0 (already in project)
- **Build Tool**: Vite 5.0.0 (already in project)
- **Language**: TypeScript 5.0.0 (already in project)
- **State Management**: Refine framework 4.0.0 (already in project)
- **Routing**: React Router v6 (already in project)

### Backend/API Integration
- **ERPNext REST API**: https://ops.10nz.tools/api/
- **API Authentication**: API Key + Secret (Token-based auth)
- **Deployment**: Cloudflare Pages/Workers (wrangler 4.25.1)

### Data Provider
- **Custom Refine Data Provider**: Need to create for ERPNext API
- **Alternative**: Refine Simple REST provider with ERPNext adapter

## Dependencies

### Existing (Already Installed)
- `@refinedev/core@^4.0.0` - Core Refine framework ✅
- `@refinedev/antd@^5.0.0` - Ant Design integration ✅
- `@refinedev/react-router-v6@^4.0.0` - Routing integration ✅
- `@refinedev/simple-rest@^5.0.0` - Simple REST data provider ✅
- `antd@^5.0.0` - UI components ✅
- `react@^18.0.0` - React library ✅
- `typescript@^5.0.0` - Type safety ✅

### New Dependencies (Need to Add)
- None required - will use existing Refine simple-rest provider or create custom adapter

## Environment Variables

### Required ERPNext Credentials (from /srv/projects/bigsirflrts/.env)
```bash
# ERPNext API Configuration
VITE_ERPNEXT_API_URL=https://ops.10nz.tools
VITE_ERPNEXT_API_KEY=01caf5585c642c42b7ab17679387dcc4776c38c3d5e08df44dc4c235
VITE_ERPNEXT_API_SECRET=270e43cbf5e64e3ba658c303a660d6763965b5ad8037daa893f55e77
```

### Existing Environment Variables
- `VITE_SUPABASE_URL` - Already configured ✅
- `VITE_SUPABASE_ANON_KEY` - Already configured ✅
- `VITE_APP_NAME` - Already configured ✅
- `CLOUDFLARE_*` - Deployment configuration ✅

## Project Architecture Context

### Current Structure
```
src/
├── features/
│   ├── documents/       # Existing Supabase document viewer
│   ├── users/           # User management
│   ├── admin/           # Admin dashboard
│   ├── auth/            # Login/signup
│   ├── homepage/        # Landing page
│   └── tools/           # Tools grid
├── providers/
│   ├── authProvider.ts  # Supabase auth
│   └── accessControlProvider.ts
├── utils/
│   ├── supabaseClient.ts
│   └── logger.ts
└── App.tsx              # Main app with Refine config
```

### New Structure (To Be Created)
```
src/
├── features/
│   └── erpnext-viewer/  # NEW - DocType viewer feature
│       ├── index.ts
│       ├── list.tsx     # DocType list component
│       ├── show.tsx     # DocType schema/records viewer
│       └── types.ts     # TypeScript interfaces
├── providers/
│   └── erpnextDataProvider.ts  # NEW - ERPNext data provider
└── utils/
    └── erpnextClient.ts  # NEW - ERPNext API client
```

## Constraints

### Technical Limitations
1. **ERPNext API Read-Only** - Using API credentials limits to read-only operations (GOOD for safety)
2. **No Direct SQL Access** - Cannot run arbitrary SQL queries (need $50/month plan for that)
3. **DocType Abstraction** - Can only access data through Frappe's DocType system
4. **API Rate Limits** - Frappe Cloud may have rate limits (need to test)
5. **CORS Restrictions** - May need Cloudflare Workers proxy for API calls

### Deployment Constraints
1. **Cloudflare Pages** - Static build, API calls must be client-side or via Workers
2. **Environment Variables** - VITE_ prefix required for client-side access
3. **Build Process** - TypeScript compilation + Vite build required

### Time/Resource Constraints
1. **Reuse Existing UI** - Leverage existing Supabase document viewer UI patterns
2. **Minimal External Dependencies** - Use existing packages where possible
3. **MVP Focus** - Core functionality first (list DocTypes, view records), advanced features later

## Known Risks

### API Integration Risks
1. **ERPNext API Changes** - Frappe API might change between versions
2. **Authentication Issues** - API key/secret might expire or need rotation
3. **Network Reliability** - External API dependency (ops.10nz.tools availability)
4. **CORS Issues** - Browser may block cross-origin requests

### Data Display Risks
1. **Large DocTypes** - Some DocTypes may have hundreds of fields (UI complexity)
2. **Complex Field Types** - Rich text, attachments, table fields may need special handling
3. **Performance** - Large record sets may slow down UI

### Mitigation Strategies
1. **Prototype First** - Test ERPNext API authentication and basic queries in Step 5
2. **Error Boundaries** - React error boundaries for graceful degradation
3. **Progressive Enhancement** - Start with simple DocTypes, add complex field support iteratively
4. **Caching** - Cache DocType schemas (static data) to reduce API calls

## Success Criteria for Step 1

- [x] Functional requirements documented (6 core features identified)
- [x] Non-functional requirements specified (performance, security, usability)
- [x] Technology stack inventoried (existing dependencies validated)
- [x] Environment variables identified (ERPNext credentials located)
- [x] Project architecture understood (Refine + Ant Design + Cloudflare)
- [x] Constraints documented (read-only API, no SQL access)
- [x] Risks identified with mitigation strategies

## BetterST Inventory Planning

**Thought 1**: Identified functional requirements - DocType browser, schema viewer, record browser, filter/search, export, and navigation similar to removed Supabase viewer.

**Thought 2**: Analyzed tech stack from package.json - Vite + React 18 + TypeScript 5 + Refine + Ant Design 5. No new dependencies needed.

**Thought 3**: Found ERPNext API credentials in /srv/projects/bigsirflrts/.env - API URL is https://ops.10nz.tools with API key/secret for authentication.

**Thought 4**: Understood project architecture - Refine framework with feature-based structure. Will create new src/features/erpnext-viewer/ following existing patterns.

**Thought 5**: Identified constraints (read-only API, no SQL access) and risks (CORS, API changes, large datasets) with mitigation strategies (prototype first, error boundaries, caching).
