# What's Next - ERPNext DocType Viewer RAEP-DEV Session

## Session Context
- **Date**: 2025-12-03
- **Project**: bbui-fresh (10nz.tools)
- **Working Directory**: `/srv/projects/bbui-fresh/.scratch/raep-dev/01-erpnext-doctype-viewer/`
- **Workflow**: RAEP Development Protocol (11-step systematic feature development)
- **Current Step**: Step 5 (Prototype) - IN PROGRESS

---

<original_task>
Implement a MariaDB/ERPNext DocType Viewer for the bbui-fresh (10nz.tools) project using the ERPNext REST API.

**Scope**:
- Build a read-only DocType viewer using ERPNext/Frappe Cloud REST API
- Use existing ERPNext API credentials (no additional database access required)
- Display DocTypes, schemas, and records with filtering, search, and export capabilities
- Integrate with existing Refine + React + Ant Design architecture
- Reuse patterns from the removed Supabase file viewer

**Motivation**: Avoid $50/month Frappe Cloud database access plan by using free-tier REST API for read-only viewing.

**User's Initial Context**:
The user provided research on two options:
- Option 1: Database User + SQL Proxy (requires $50/month plan)
- Option 2: ERPNext REST API Wrapper (works on any plan) ← **Selected approach**

The user requested building an ERPNext DocType Viewer similar to the removed Supabase file viewer, using the cheaper API-based approach.
</original_task>

---

<work_completed>

## RAEP-DEV Steps Completed (Steps 0-4 of 11)

### STEP 0: SETUP ✅
**Created**: `.scratch/raep-dev/01-erpnext-doctype-viewer/00-setup.md`

- Determined working directory: `.scratch/raep-dev/01-erpnext-doctype-viewer/`
- First RAEP session (numbered 01)
- Semantic folder name chosen: `erpnext-doctype-viewer`
- Documented planned directory structure for all 11 steps
- Used BetterST MCP for folder naming reasoning

### STEP 1: INVENTORY ✅
**Created**: `.scratch/raep-dev/01-erpnext-doctype-viewer/01-inventory.md`

**Documented**:

1. **Functional Requirements** (6 core features):
   - DocType Browser - List all available DocTypes from ERPNext
   - Schema Viewer - Display DocType schema (fields, types, options, mandatory status)
   - Record Browser - View records for selected DocType with pagination
   - Filter & Search - Filter records by field values, search across fields
   - Export Functionality - Export records to CSV/JSON formats
   - Navigation - Intuitive UI similar to removed Supabase file viewer

2. **Non-Functional Requirements**:
   - Performance: Initial load < 2 seconds, pagination support 25/50/100 records per page
   - Security: API credentials in env vars, CORS handling, respect ERPNext permissions
   - Usability: Responsive Ant Design, error handling, loading states
   - Reliability: Error recovery, cache strategy, retry logic

3. **Technology Stack** (existing dependencies):
   - React 18.0.0, Ant Design 5.0.0, Vite 5.0.0, TypeScript 5.0.0
   - Refine framework 4.0.0, React Router v6
   - Cloudflare Pages/Workers deployment (wrangler 4.25.1)

4. **Environment Variables Required**:
   ```bash
   VITE_ERPNEXT_API_URL=https://ops.10nz.tools
   VITE_ERPNEXT_API_KEY=01caf5585c642c42b7ab17679387dcc4776c38c3d5e08df44dc4c235
   VITE_ERPNEXT_API_SECRET=270e43cbf5e64e3ba658c303a660d6763965b5ad8037daa893f55e77
   ```
   Source: `/srv/projects/bigsirflrts/.env`

5. **Project Architecture** (existing structure analyzed):
   - Feature-based structure: `src/features/`
   - Existing Supabase data provider, auth provider, access control provider
   - Custom header component, logger utility

6. **Constraints Identified**:
   - ERPNext API read-only (good for safety)
   - No direct SQL access (need $50/month plan for that)
   - DocType abstraction only (cannot run arbitrary SQL)
   - Cloudflare Pages static build (API calls client-side or via Workers)

7. **Risks & Mitigations**:
   - CORS issues → Test in prototype, configure allowed origins
   - Large DocTypes → Progressive enhancement, start with simple DocTypes
   - Performance → Cache schemas, pagination for records

### STEP 2: THEORIZE (Design Approaches) ✅
**Created**: `.scratch/raep-dev/01-erpnext-doctype-viewer/02-design-approaches.md`

**Analyzed 5 Approaches**:

1. **Approach 1: Custom Refine Data Provider**
   - HIGH complexity, MEDIUM risk, 3-4 days dev time
   - Full Refine integration, automatic caching/optimistic updates
   - Must implement 10+ provider methods
   - Overkill for read-only viewer

2. **Approach 2: Simple REST Provider + ERPNext Adapter** ← **SELECTED**
   - MEDIUM complexity, LOW-MEDIUM risk, 1-2 days dev time
   - Leverages `@refinedev/simple-rest` with response transformation
   - Best balance of Refine benefits with manageable complexity
   - Clear upgrade path to Approach 1 if needed

3. **Approach 3: Standalone Direct API Calls**
   - LOW complexity, LOW risk, 1 day dev time
   - Loses Refine benefits (caching, loading states, error handling)
   - Creates inconsistent architecture

4. **Approach 4: Cloudflare Workers Proxy**
   - MEDIUM-HIGH complexity, MEDIUM risk, 2-3 days dev time
   - Solves CORS/security elegantly but adds infrastructure
   - Can be added later if needed

5. **Approach 5: Hybrid (Supabase + Direct ERPNext)**
   - LOW complexity, LOW risk, 1 day dev time
   - Creates technical debt with two different data access patterns

**Selection Rationale**:
- Approach 2 provides quick MVP (1-2 days) with most Refine benefits
- Lighter than custom provider, more integrated than standalone
- Clear upgrade path if limitations hit
- Consistent with app architecture

**Implementation Plan**:
- Phase 1: Simple-rest provider with minimal adapter (1 day)
- Phase 2: Add custom methods if limitations found (0.5-1 day)
- Phase 3: Migrate to custom provider if still insufficient (2-3 days)

### STEP 3: ASK PERPLEXITY (Best Practices Research) ✅
**Created**: `.scratch/raep-dev/01-erpnext-doctype-viewer/03-perplexity-leads.md`

**Research Queries**:
1. "ERPNext/Frappe REST API integration with React best practices 2024-2025"
2. "Frappe Cloud API token authentication pitfalls and gotchas 2024-2025"
3. "Refine framework v4+ custom data provider best practices 2024-2025"

**16 Research Leads Identified**:

**Authentication & Security (6 leads)**:
1. OAuth 2.0 vs token authentication decision
2. Permission configuration for API user
3. JWT validation requirements
4. API key rotation and management
5. Credential storage security (client vs proxy)
6. Rate limiting and retry strategies

**API Integration (5 leads)**:
7. Frappe React SDK as alternative approach
8. No auto-generated API documentation (manual exploration needed)
9. CORS configuration for development
10. Real-time updates capability (future enhancement)
11. Custom Refine method for non-standard endpoints

**Data Provider Implementation (5 leads)**:
12. Pagination parameter mapping
13. Filter and sorting syntax conversion
14. Total count handling for pagination
15. Error handling standardization
16. TypeScript type safety

**Key Findings from Perplexity**:
- OAuth 2.0 recommended but token auth viable for read-only
- Frappe React SDK exists (Vue-focused, shows API patterns)
- Permission errors common even after auth (role permissions needed)
- No OpenAPI/Swagger docs (manual exploration required)
- CORS restrictions for SPAs (need allowed origins configuration)

### STEP 4: VALIDATE PERPLEXITY (Independent Verification) ✅
**Created**: `.scratch/raep-dev/01-erpnext-doctype-viewer/04-validation.md`

**Validation Sources Used**:
- `mcp__ref__ref_search_documentation` (official Frappe docs)
- Frappe GitHub repository documentation
- Frappe UI library documentation

**Validation Results**:

**✅ CONFIRMED (11 leads)**:
1. OAuth 2.0 and token auth both supported (token auth sufficient for read-only)
   - Source: https://github.com/frappe/frappe/blob/develop/frappe/integrations/README.md
2. Frappe React SDK/UI exists (Vue-focused but shows API structure)
   - Source: https://github.com/frappe/frappe-ui (List Resource documentation)
3. CORS restrictions for SPAs (configuration required)
   - OAuth Settings doc: "Allowed Public Client Origins" field needed
4. No auto-generated API docs (use Frappe UI docs for structure)
5. Custom Refine method for non-standard endpoints
6. Pagination uses `start` and `pageLength` (or `limit_page_length`) parameters
7. Filters are simple key-value objects: `{ status: 'Open' }`
8. Sorting uses "field desc/asc" string format
9. Error handling pattern shown in Frappe UI docs (onError/onSuccess)
10. TypeScript type safety required for Refine DataProvider interface
11. Client-side credential exposure risk identified (VITE_ vars expose in bundle)

**⚠️ NEEDS PROTOTYPE TESTING (5 leads)**:
1. Permission errors (which DocTypes accessible with current credentials)
2. API key rotation policy
3. Rate limiting behavior
4. Total count field in API response
5. Exact error response format

**ℹ️ OUT OF SCOPE (1 lead)**:
1. Real-time SocketIO updates (deferred to future)

**Critical API Structure Validated** (from Frappe UI docs):
```javascript
// Default Frappe list endpoint
POST https://ops.10nz.tools/api/method/frappe.client.get_list

// Parameters
{
  doctype: 'Task',
  fields: ['name', 'subject', 'status'],
  filters: { status: 'Open' },
  start: 0,              // or limit_start
  pageLength: 20,        // or limit_page_length
  orderBy: 'creation desc'  // or order_by
}

// Expected Response
{
  data: [...],
  total_count: 150  // needs prototype testing
}
```

**Security Findings**:
- CORS restrictions apply to SPAs by default
- Need to add `http://localhost:5173` (Vite dev) to allowed origins
- API credentials exposed in client bundle (accept for MVP, use Workers proxy for production)

### STEP 5: PROTOTYPE (Proof-of-Concept) - IN PROGRESS ⚠️
**Created**: `.scratch/raep-dev/01-erpnext-doctype-viewer/05-prototype/test-api.js` (later renamed to .cjs)

**Prototype Test Script Created**:
- Node.js script to test 6 critical API assumptions
- Tests authentication, endpoint structure, pagination, filters, total count, permissions
- Uses credentials from `/srv/projects/bigsirflrts/.env`

**Tests Planned**:
1. Test 1: List Available DocTypes (GET /api/resource/DocType)
2. Test 2: Test frappe.client.get_list Method (POST)
3. Test 3: Test Pagination Parameters (start/limit_page_length)
4. Test 4: Test Filter Syntax ({ field: value })
5. Test 5: Check for Total Count in Response
6. Test 6: Test Permissions on Various DocTypes (Task, Project, User, ToDo, Comment)

**Execution Blocker**:
- Initial script used CommonJS `require()` syntax
- Project uses ES modules (package.json has `"type": "module"`)
- Renamed test-api.js → test-api.cjs to use CommonJS
- File system issue: Created files not persisting or wrong directory context

**Current Blocker Status**:
The prototype files were created but directory navigation failed. Need to investigate why `.scratch/raep-dev/01-erpnext-doctype-viewer/` directory appears to not exist despite successful file writes earlier in the session.

---

## Artifacts Created During Session

All files created in: `/srv/projects/bbui-fresh/.scratch/raep-dev/01-erpnext-doctype-viewer/`

1. `00-setup.md` - RAEP session setup and directory structure plan
2. `01-inventory.md` - Complete requirements, tech stack, environment inventory
3. `02-design-approaches.md` - 5 design approaches analyzed, Approach 2 selected
4. `03-perplexity-leads.md` - 16 research leads from Perplexity queries
5. `04-validation.md` - Validation of 16 leads using official Frappe docs
6. `05-prototype/test-api.js` - API prototype test script (CommonJS, 300+ lines)

**Note**: There may be a file system consistency issue. The Write tool reported success but subsequent Bash operations couldn't find the directory.

</work_completed>

---

<work_remaining>

## RAEP-DEV Steps Remaining (Steps 5-10 of 11)

### STEP 5: PROTOTYPE (Complete This Step) ⚠️

**Immediate Next Actions**:

1. **Debug File System Issue**:
   - Verify `.scratch/raep-dev/01-erpnext-doctype-viewer/` directory exists
   - Check if files from Steps 0-4 actually exist
   - Recreate directory structure if needed

2. **Fix and Run Prototype Test Script**:
   - Verify test-api.cjs exists (or recreate from test-api.js)
   - Run: `cd /srv/projects/bbui-fresh/.scratch/raep-dev/01-erpnext-doctype-viewer/05-prototype && source /srv/projects/bigsirflrts/.env && node test-api.cjs`
   - Capture all test output

3. **Document Prototype Results** (create `05-prototype/README.md`):
   - Authentication status (PASS/FAIL)
   - Endpoint structure confirmed
   - Pagination parameter names (start vs limit_start, pageLength vs limit_page_length)
   - Filter syntax validated
   - Total count field name (total_count, count, total, or missing)
   - Accessible DocTypes list
   - Permission errors encountered
   - Rate limiting behavior (if any)
   - CORS status from localhost

4. **Update 04-validation.md**:
   - Mark "NEEDS PROTOTYPE TESTING" items as CONFIRMED or REFUTED based on test results

### STEP 6: DESIGN (Component Specifications)

**Create**: `.scratch/raep-dev/01-erpnext-doctype-viewer/06-design-spec.md`

**Define Components** (based on selected Approach 2):

1. **Component: ERPNext HTTP Client**
   - Purpose: Axios instance with ERPNext authentication headers
   - Interface: `httpClient.get/post(url, config)`
   - Dependencies: axios, env vars (VITE_ERPNEXT_API_KEY/SECRET)
   - Location: `src/utils/erpnextClient.ts`

2. **Component: ERPNext Data Provider Adapter**
   - Purpose: Transform ERPNext API responses to Refine format
   - Interface: Implements Refine DataProvider interface methods
   - Dependencies: @refinedev/simple-rest, erpnextClient
   - Location: `src/providers/erpnextDataProvider.ts`
   - Methods: getList, getOne, custom (for schema queries)

3. **Component: DocType List Page**
   - Purpose: Display list of all DocTypes
   - Interface: React component using Refine useList hook
   - Dependencies: Refine, Ant Design Table
   - Location: `src/features/erpnext-viewer/DocTypeList.tsx`

4. **Component: DocType Schema Viewer**
   - Purpose: Display DocType field schema
   - Interface: React component using custom hook for schema query
   - Dependencies: Refine useCustom hook, Ant Design Descriptions
   - Location: `src/features/erpnext-viewer/DocTypeSchema.tsx`

5. **Component: DocType Records Browser**
   - Purpose: Display records with pagination/filtering
   - Interface: React component using Refine useTable hook
   - Dependencies: Refine, Ant Design Table, filters, pagination
   - Location: `src/features/erpnext-viewer/DocTypeRecords.tsx`

6. **Component: Export Functionality**
   - Purpose: Export records to CSV/JSON
   - Interface: React hook for data export
   - Dependencies: Papa Parse (CSV), JSON.stringify
   - Location: `src/features/erpnext-viewer/hooks/useExport.ts`

**Build Order**:
1. ERPNext HTTP Client (no dependencies)
2. ERPNext Data Provider Adapter (depends on client)
3. DocType List Page (depends on provider)
4. DocType Schema Viewer (depends on provider)
5. DocType Records Browser (depends on provider)
6. Export Functionality (depends on records browser)

### STEP 7: IMPLEMENT (Component-by-Component with Plan-Execute-Check)

**For EACH Component** (repeat this loop):

#### PLAN Phase (use BetterST):
- Design component structure, test cases, edge cases, error handling
- Document in `.scratch/raep-dev/01-erpnext-doctype-viewer/07-implementation/{component-name}-plan.md`

#### EXECUTE Phase:
- Implement component code
- Write unit tests (or TDD: tests first)
- Add documentation/comments

#### CHECK Phase (ALL must pass before next component):
- ✅ Unit tests → MUST ALL PASS
- ✅ Linter → MUST PASS (no errors): `npm run typecheck`
- ✅ Type check → MUST PASS: `tsc --noEmit`
- ✅ Manual verification → MUST WORK

**If ANY check fails** → FIX → RE-CHECK (do NOT proceed to next component)

**Document each component** in:
`.scratch/raep-dev/01-erpnext-doctype-viewer/07-implementation/{component-name}.md`

### STEP 8: INTEGRATE (Wire Components Together)

**Create**: `.scratch/raep-dev/01-erpnext-doctype-viewer/08-integration.md`

**Integration Tasks**:
1. Wire ERPNext data provider into App.tsx Refine configuration
2. Add ERPNext viewer routes to App.tsx
3. Test integration points:
   - DocType List → Schema Viewer navigation
   - Schema Viewer → Records Browser navigation
   - Records Browser → Export functionality
4. Run integration tests
5. Check for regressions in existing features (documents, users, admin)

**Integration Test Scenarios**:
- Navigate: Home → ERPNext Viewer → DocType List
- Select DocType → View Schema
- View Records → Apply Filter → Export CSV
- Back navigation works
- Authentication still required
- Existing features unaffected

### STEP 9: VALIDATE (User Acceptance and Edge Cases)

**Create**: `.scratch/raep-dev/01-erpnext-doctype-viewer/09-validation-report.md`

**User Acceptance Tests** (from Step 1 requirements):
1. ✅ Can list all available DocTypes
2. ✅ Can view DocType schema (fields, types, mandatory status)
3. ✅ Can browse records with pagination (25/50/100 per page)
4. ✅ Can filter records by field values
5. ✅ Can search across fields
6. ✅ Can export to CSV/JSON

**Edge Cases to Test**:
- DocType with 100+ fields (large schema)
- DocType with 10,000+ records (pagination stress test)
- DocType with complex field types (Table, Attach, Link, etc.)
- Empty DocType (no records)
- Permission denied DocType (graceful error)
- Network timeout (retry logic)
- Invalid filter values (error handling)

**Performance Benchmarks** (from Step 1):
- Initial DocType list load < 2 seconds ✅/❌
- Record browser load < 3 seconds ✅/❌
- Pagination response < 1 second ✅/❌
- Export 1000 records < 5 seconds ✅/❌

**Security Validation**:
- API credentials not visible in network tab (only in source)
- CORS working from localhost and production
- Respect ERPNext user permissions
- No SQL injection vectors (using API abstraction)

### STEP 10: HANDOFF (Deployment Summary)

**Create**: `.scratch/raep-dev/01-erpnext-doctype-viewer/10-handoff.md`

**Implementation Summary** (3-5 sentences):
[To be written after implementation complete]

**Deployment Checklist**:
1. [ ] Add ERPNext env vars to .dev.vars (localhost)
2. [ ] Add ERPNext env vars to Cloudflare Pages settings (production)
3. [ ] Configure CORS allowed origins in ops.10nz.tools OAuth Settings:
   - `http://localhost:5173` (dev)
   - `https://10nz.tools` (production)
4. [ ] Build and test locally: `npm run build && npm run preview`
5. [ ] Deploy to Cloudflare Pages: `npm run deploy`
6. [ ] Verify production deployment
7. [ ] Test ERPNext viewer in production

**Rollback Plan**:
- **Trigger**: ERPNext viewer not working or breaks existing features
- **Steps**:
  1. Revert last git commit
  2. Redeploy previous working version
  3. Investigate issue in local environment
  4. Fix and redeploy

**Known Limitations**:
- API credentials exposed in client bundle (read-only risk accepted)
- Limited to DocTypes accessible via API user permissions
- Cannot query across multiple DocTypes (no joins)
- Filter syntax limited to simple equality (advanced operators TBD)

**Tech Debt**:
- Consider Cloudflare Workers proxy for credential security (production)
- Consider upgrading to custom Refine data provider if limitations hit
- Consider adding real-time updates (SocketIO) for collaborative features

**Next Steps** (future enhancements):
- Add DocType creation/editing (if write permissions obtained)
- Add advanced filter operators (>, <, LIKE, IN, etc.)
- Add record detail view (full record display)
- Add attachment preview (for Attach fields)
- Add dashboard with DocType statistics

**Safe-to-Proceed Determination**:
[YES/NO - to be determined after validation in Step 9]

</work_remaining>

---

<attempted_approaches>

## Approaches Tried and Issues Encountered

### File System Consistency Issue (Step 5) - UNRESOLVED

**Symptom**:
- Write tool reports successful file creation
- Subsequent Bash operations cannot find files or directories
- Directory `.scratch/raep-dev/01-erpnext-doctype-viewer/` appears to not exist

**What Was Tried**:
1. Created files using Write tool → Reported success
2. Attempted to navigate with `cd .scratch/raep-dev/01-erpnext-doctype-viewer/05-prototype` → Failed (directory not found)
3. Attempted to `ls -la .scratch/raep-dev/01-erpnext-doctype-viewer/` → Failed (directory not found)
4. Used `pwd` which showed: `/srv/projects/bbui-fresh/.scratch/raep-dev/01-erpnext-doctype-viewer/05-prototype`

**Hypothesis**:
- Possible working directory inconsistency between tools
- Write tool may have created files in a different location than expected
- Bash tool may be executing in a different working directory context

**What Needs Investigation**:
1. Verify actual location of created files
2. Check if files exist anywhere on filesystem: `find /srv/projects/bbui-fresh -name "00-setup.md" -type f 2>/dev/null`
3. Verify current working directory matches expected location
4. Recreate files if needed in correct location

### ES Module vs CommonJS Issue (Step 5) - RESOLVED

**Problem**:
- Created test-api.js using CommonJS `require()` syntax
- Project has `"type": "module"` in package.json
- Node.js threw error: "require is not defined in ES module scope"

**Solution Attempted**:
- Renamed test-api.js → test-api.cjs to force CommonJS interpretation
- This should work but couldn't verify due to file system issue above

**Alternative Solution** (if .cjs doesn't work):
- Convert script to ES modules using `import` instead of `require`
- Use `https` module with ES import syntax
- Use `process.env` for environment variables (works in both)

### Directory Naming Decision (Step 0) - COMPLETED

**Decision**: Use numbered folder with semantic name: `01-erpnext-doctype-viewer`

**Rationale**:
- Sequential numbering (01, 02, 03...) ensures chronological order
- Prevents conflicts with parallel development sessions
- Semantic name (`erpnext-doctype-viewer`) clarifies purpose
- Preserves all development history

**Alternative Considered**:
- Could use date-based folders (2025-12-03-erpnext-viewer)
- Rejected: Sequential numbers are more concise and clear

</attempted_approaches>

---

<critical_context>

## Key Decisions and Rationale

### Architecture Decision: Simple REST + Adapter (Approach 2)
**Why**: Best balance of Refine integration, development speed, and upgrade path
- **Trade-off**: Less control than custom provider but faster to MVP
- **Upgrade Path**: Can migrate to custom provider (Approach 1) if limitations hit
- **Fallback**: Can add Workers proxy (Approach 4) for CORS/security if needed

### Authentication Decision: Token Auth (Not OAuth)
**Why**: Sufficient for read-only viewer, simpler than OAuth setup
- **Security Implication**: Credentials exposed in client bundle (accepted risk for MVP)
- **Production Path**: Use Cloudflare Workers proxy to hide credentials
- **Credentials Location**: `/srv/projects/bigsirflrts/.env`

### API Endpoint Hypothesis (Needs Validation)
```
POST https://ops.10nz.tools/api/method/frappe.client.get_list
Authorization: token {API_KEY}:{API_SECRET}
Content-Type: application/json

Body: {
  doctype: string,
  fields: string[],
  filters: { [key: string]: any },
  limit_start: number,  // or "start"
  limit_page_length: number,  // or "pageLength"
  order_by: string  // or "orderBy"
}
```

## Important Discoveries

### Frappe UI Documentation Goldmine
The Frappe UI library docs (Vue-focused) provide the exact API structure:
- Default endpoint: `frappe.client.get_list`
- Pagination: `start`, `pageLength` (or `limit_start`, `limit_page_length`)
- Filters: Simple object `{ field: value }`
- Sorting: String format `"field desc"` or `"field asc"`
- Fields: Array of field names `['name', 'subject', 'status']`

### CORS Configuration Required
From official Frappe OAuth docs:
> Public clients (SPAs) have restricted access by default via CORS.
> Add hostnames to "Allowed Public Client Origins" field in OAuth Settings.

**Action Required**: Add these origins to ops.10nz.tools OAuth Settings:
- `http://localhost:5173` (Vite dev server)
- `https://10nz.tools` (production domain)

### Pagination Parameter Ambiguity
Frappe UI docs show `start` and `pageLength`, but Frappe API convention uses `limit_start` and `limit_page_length`. Prototype testing needed to determine which parameters the actual API accepts.

### No Total Count Guarantee
Frappe UI docs don't explicitly show total count in response. Need prototype testing to confirm if API returns `total_count`, `count`, `total`, or nothing.

## Environment and Configuration

### Project Tech Stack
- **Frontend**: React 18, TypeScript 5, Vite 5, Ant Design 5
- **Framework**: Refine 4.0 (data provider, hooks, routing)
- **Deployment**: Cloudflare Pages/Workers (wrangler 4.25.1)
- **Module System**: ES Modules (`"type": "module"` in package.json)

### ERPNext API Credentials (from /srv/projects/bigsirflrts/.env)
```bash
ERPNEXT_API_URL=https://ops.10nz.tools
FRAPPE_CLOUD_API_KEY=01caf5585c642c42b7ab17679387dcc4776c38c3d5e08df44dc4c235
FRAPPE_CLOUD_API_SECRET=270e43cbf5e64e3ba658c303a660d6763965b5ad8037daa893f55e77
```

**For Client-Side Use** (add to .dev.vars and Cloudflare Pages env):
```bash
VITE_ERPNEXT_API_URL=https://ops.10nz.tools
VITE_ERPNEXT_API_KEY=01caf5585c642c42b7ab17679387dcc4776c38c3d5e08df44dc4c235
VITE_ERPNEXT_API_SECRET=270e43cbf5e64e3ba658c303a660d6763965b5ad8037daa893f55e77
```

### Existing Project Structure
```
src/
├── features/
│   ├── documents/       # Existing Supabase document viewer (pattern to copy)
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

## Constraints and Boundaries

### Technical Constraints
1. **Read-Only API**: Cannot create/update/delete via API (good for safety)
2. **No Direct SQL**: Need $50/month plan for database access
3. **DocType Abstraction Only**: Can only access data through Frappe's DocType system
4. **Client-Side API Calls**: Cloudflare Pages is static, can't hide credentials without Workers
5. **VITE_ Prefix Required**: Environment variables for client-side must use VITE_ prefix

### Business Constraints
1. **Cost**: Avoid $50/month database access plan (reason for API approach)
2. **Existing Architecture**: Must integrate with Refine + Ant Design + Cloudflare stack
3. **Similar UX**: Should feel similar to removed Supabase file viewer

### Security Constraints
1. **Credential Exposure**: VITE_ env vars expose in client bundle (accept for MVP)
2. **CORS**: Must configure allowed origins in ERPNext admin panel
3. **Permissions**: Respect ERPNext user permissions (read-only via API)

## Assumptions Requiring Validation (Step 5)

These assumptions MUST be validated in the prototype step:

1. ✅/❌ Token auth works with API key/secret from bigsirflrts/.env
2. ✅/❌ Endpoint is `POST /api/method/frappe.client.get_list`
3. ✅/❌ CORS allows localhost:5173 (or can be configured)
4. ✅/❌ Response includes total count field (for pagination)
5. ✅/❌ Current API user has permissions to read DocTypes
6. ✅/❌ Pagination parameters are `limit_start`/`limit_page_length` (not `start`/`pageLength`)
7. ✅/❌ Filter syntax is simple object `{ field: value }`
8. ✅/❌ Sorting parameter is `order_by` (not `orderBy`)
9. ✅/❌ No rate limiting blocks rapid API calls
10. ✅/❌ Error responses follow standard format

## References and Resources

### Official Documentation Consulted
1. Frappe OAuth Documentation: https://github.com/frappe/frappe/blob/develop/frappe/integrations/README.md
2. Frappe UI List Resource: https://github.com/frappe/frappe-ui/blob/main/docs/resources/List%20Resource.story.md
3. Refine Data Provider: https://refine.dev/docs/data/data-provider/
4. Refine Custom Data Provider: https://refine.dev/docs/3.xx.xx/tutorial/understanding-dataprovider/create-dataprovider/

### Perplexity Research Citations
- ERPNext/Frappe Integration: https://www.youtube.com/watch?v=uCVebuOjnDE
- Token Auth Issues: https://discuss.frappe.io/t/token-authentication-not-works-in-rest-api-erpnext/137602
- API Exploration: https://www.youtube.com/watch?v=3xpfw4qrzM0
- API Documentation Gap: https://github.com/frappe/frappe/issues/9805

### Tools and MCPs Used
- `mcp__BetterST__sequentialthinking` - Planning and decision-making at every step
- `mcp__perplexity-ask__perplexity_ask` - Best practices research
- `mcp__ref__ref_search_documentation` - Official doc validation
- `mcp__local-docs__search_documentation` - Local docs search (Frappe not indexed)

</critical_context>

---

<current_state>

## Deliverable Status

### RAEP-DEV Steps (0-10)

| Step | Status | Deliverable | Notes |
|------|--------|-------------|-------|
| 0: Setup | ✅ COMPLETE | `00-setup.md` | Working directory created |
| 1: Inventory | ✅ COMPLETE | `01-inventory.md` | Requirements documented |
| 2: Theorize | ✅ COMPLETE | `02-design-approaches.md` | Approach 2 selected |
| 3: Ask Perplexity | ✅ COMPLETE | `03-perplexity-leads.md` | 16 leads identified |
| 4: Validate | ✅ COMPLETE | `04-validation.md` | 11 confirmed, 5 need testing |
| 5: Prototype | ⚠️ IN PROGRESS | `05-prototype/` | Script created, not run |
| 6: Design | ⬜ NOT STARTED | `06-design-spec.md` | Pending Step 5 completion |
| 7: Implement | ⬜ NOT STARTED | `07-implementation/` | Pending Step 6 completion |
| 8: Integrate | ⬜ NOT STARTED | `08-integration.md` | Pending Step 7 completion |
| 9: Validate | ⬜ NOT STARTED | `09-validation-report.md` | Pending Step 8 completion |
| 10: Handoff | ⬜ NOT STARTED | `10-handoff.md` | Pending Step 9 completion |

### Code Implementation Status

**Nothing implemented yet** - Still in research/planning phase (Steps 0-5)

No code files created in `src/` yet. Implementation starts in Step 7.

### Temporary Changes and Workarounds

**None** - No code changes made to production files yet

### Current Position in Workflow

**Position**: Step 5 (Prototype) - Blocked by file system issue

**Blocker**: Cannot verify prototype test script runs successfully
- Script created: `05-prototype/test-api.cjs`
- Execution failed: Directory not found
- Need to debug file system consistency

**Next Immediate Action**: Debug file system issue, then run prototype tests

### Open Questions

1. **File System**: Why are created files not visible to Bash tool?
   - Write tool reports success
   - Bash operations can't find files/directories
   - Is there a working directory mismatch?

2. **API Parameter Names**: Which naming convention does ops.10nz.tools use?
   - Frappe UI docs show: `start`, `pageLength`, `orderBy`
   - Frappe convention suggests: `limit_start`, `limit_page_length`, `order_by`
   - Need prototype testing to confirm

3. **Total Count Field**: Does API response include total count?
   - Needed for pagination UI
   - Possible field names: `total_count`, `count`, `total`, `num_rows`
   - Need prototype testing to confirm

4. **CORS Configuration**: Can localhost:5173 access ops.10nz.tools API?
   - May need to request CORS configuration
   - May need Cloudflare Workers proxy as workaround

5. **Permissions**: Which DocTypes are accessible with current API credentials?
   - Need to test various DocTypes
   - Document which fail with permission errors

### Pending Decisions

1. **Workers Proxy**: Add Cloudflare Workers proxy now or later?
   - **Now**: More secure (credentials hidden)
   - **Later**: Simpler MVP (accept credential exposure risk)
   - **Recommendation**: Later (after MVP proven)

2. **Frappe React SDK**: Use Frappe UI library or custom integration?
   - **Frappe UI**: Pre-built, Vue-focused, may be overkill
   - **Custom**: More control, fits Refine architecture
   - **Recommendation**: Custom (Approach 2 already selected)

3. **Test Coverage**: How much test coverage for MVP?
   - **Full TDD**: Tests for every component
   - **Integration Only**: Tests for critical paths
   - **Manual Testing**: Quick validation
   - **Recommendation**: Integration tests + manual (balance speed and quality)

## How to Resume This Work

### Immediate Next Steps (Priority Order)

1. **Debug File System Issue** (5-10 minutes)
   ```bash
   # Find created files
   find /srv/projects/bbui-fresh -name "00-setup.md" -type f 2>/dev/null

   # Check working directory
   pwd

   # List .scratch contents
   ls -la /srv/projects/bbui-fresh/.scratch/

   # Recreate directory if needed
   mkdir -p /srv/projects/bbui-fresh/.scratch/raep-dev/01-erpnext-doctype-viewer/05-prototype
   ```

2. **Run Prototype Tests** (10-15 minutes)
   ```bash
   cd /srv/projects/bbui-fresh/.scratch/raep-dev/01-erpnext-doctype-viewer/05-prototype
   source /srv/projects/bigsirflrts/.env
   node test-api.cjs > test-results.txt 2>&1
   cat test-results.txt
   ```

3. **Document Prototype Results** (15-20 minutes)
   - Create `05-prototype/README.md` with test results
   - Update `04-validation.md` with confirmed/refuted leads
   - Mark Step 5 as COMPLETE in todo list

4. **Continue to Step 6** (Design Specifications)
   - Use BetterST to design each component
   - Document in `06-design-spec.md`
   - Define component interfaces, dependencies, build order

### Long-Term Continuation Path

**If resuming after session break**:
1. Read this whats-next.md file completely
2. Review all files in `.scratch/raep-dev/01-erpnext-doctype-viewer/`
3. Check current step status (likely Step 5 or 6)
4. Follow "Work Remaining" section for that step
5. Use RAEP-DEV protocol: Plan → Execute → Check for each component

**If blocked or confused**:
1. Re-read the step's instructions in `/srv/projects/instructorv2/skills/raep-dev/SKILL.md`
2. Review BetterST examples in skill references
3. Check completed steps (0-4) for patterns and examples
4. Ask user for clarification if scope is unclear

## Success Criteria for Next Session

**Step 5 Complete When**:
- [x] Prototype test script runs successfully
- [x] All 6 test scenarios execute (may fail, but must execute)
- [x] Test results documented in 05-prototype/README.md
- [x] Validation leads updated in 04-validation.md
- [x] Todo list marks Step 5 as completed, Step 6 as in_progress

**Step 6 Complete When**:
- [x] All 6 components designed with BetterST
- [x] Component interfaces defined
- [x] Dependencies mapped
- [x] Build order determined
- [x] Design spec documented in 06-design-spec.md

**Overall Project Success When**:
- [x] All 11 RAEP-DEV steps completed (Steps 0-10)
- [x] ERPNext DocType viewer fully implemented and tested
- [x] Deployed to Cloudflare Pages
- [x] User can browse DocTypes, view schemas, filter records, export data
- [x] No regressions in existing features

</current_state>
