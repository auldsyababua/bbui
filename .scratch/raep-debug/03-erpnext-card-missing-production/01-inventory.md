# STEP 1: INVENTORY

## Files Involved

### Core Application Files
- **src/features/tools/grid.tsx**: EXISTS
  - Line 112: `status: import.meta.env.VITE_ERPNEXT_API_KEY ? 'active' : 'coming-soon'`
  - Line 138-140: Filters to only show `status === 'active'` tools
  - **Critical**: Card visibility depends on VITE_ERPNEXT_API_KEY being truthy at BUILD TIME

- **src/App.tsx**: EXISTS
  - Lines 58-61: Checks for ERPNext credentials at runtime
  - Lines 63-69: Creates ERPNext data provider if credentials available
  - Lines 76-82: Conditionally includes erpnext provider in Refine config

- **src/utils/supabaseClient.ts**: EXISTS
  - Lines 8-12: THROWS ERROR if VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing
  - **Critical**: App initialization will fail without Supabase variables

- **vite.config.ts**: EXISTS
  - Minimal configuration (only React plugin)
  - No custom environment variable handling

- **wrangler.toml**: EXISTS
  - Comments indicate production variables should be set in Cloudflare Pages dashboard
  - No environment variable bindings defined

- **package.json**: EXISTS
  - Build command: `tsc && vite build`
  - Vite version: ^5.0.0

## Dependencies

### Build Tools
- **Vite**: ^5.0.0 (confirmed in package.json)
  - Handles VITE_* environment variable injection at BUILD TIME
  - Uses import.meta.env.* for accessing variables

### Deployment Platform
- **Cloudflare Pages**: 10netzero-tools project
  - Executes `npm run build` during deployment
  - Environment variables configured in dashboard

### Runtime Libraries
- **React**: ^18.0.0
- **Refine**: ^4.0.0 (data provider framework)
- **Supabase Client**: ^2.0.0 (REQUIRED by supabaseClient.ts)

## Environment Variables

### Cloudflare Pages Configuration (User-Reported)
- **VITE_ERPNEXT_API_URL**: Plaintext = `https://ops.10nz.tools`
- **VITE_ERPNEXT_API_KEY**: **Secret (encrypted)** = `dbf4bb1b556e3d2`
- **VITE_ERPNEXT_API_SECRET**: **Secret (encrypted)** = `f6097d1b5069034`
- **VITE_SUPABASE_URL**: User claims removed, but console shows still present
- **VITE_SUPABASE_ANON_KEY**: Status unknown

### Local Environment (.dev.vars)
- VITE_SUPABASE_URL=https://thnwlykidzhrsagyjncc.supabase.co
- VITE_SUPABASE_ANON_KEY=[valid JWT token]
- VITE_ERPNEXT_API_URL=https://ops.10nz.tools
- VITE_ERPNEXT_API_KEY=dbf4bb1b556e3d2
- VITE_ERPNEXT_API_SECRET=f6097d1b5069034

### Critical Observations
1. **ERPNext variables are "Secret" in Cloudflare** - Encrypted variables are NOT accessible to Vite build process
2. **Vite requires build-time access** - import.meta.env.VITE_* is evaluated during `vite build`, not at runtime
3. **Supabase variables still in production** - Console shows supabaseUrl present despite user claiming removal

## Error Logs

### Browser Console (Production - 10nz.tools)
```
[INFO] App component rendering {environment: 'production', supabaseUrl: 'https://thnwlykidzhrsagyjncc.supabase.co'}
[DEBUG] Auth provider initialized {provider: 'supabase'}
GET https://thnwlykidzhrsagyjncc.supabase.co/rest/v1/personnel?select=*&auth_user_id=eq.eecf9096-00e8-4143-84b4-c0c254244c49 404 (Not Found)
```

**Key Observations**:
- Supabase URL IS present in production bundle (contradicts user statement)
- No logs about ERPNext environment variables
- 404 on Supabase personnel query (expected if Supabase removed)

### Build Logs
- Not yet examined (would show if VITE_* variables detected during build)

## Services

### ERPNext API
- **URL**: https://ops.10nz.tools
- **Status**: Unknown (not tested in this inventory)
- **Authentication**: Requires API key + secret

### Cloudflare Pages
- **Project**: 10netzero-tools
- **Live URL**: https://10nz.tools
- **Build Environment**: Node.js (executes npm run build)
- **Environment Variable Types**:
  - **Plaintext**: Visible in dashboard, accessible to build process
  - **Secret**: Encrypted in dashboard, ONLY accessible to Workers/Functions (NOT build)

## Git Status

### Recent Commits
```
f03fdcc - docs: Update deployment status - trigger rebuild with ERPNext env vars (HEAD)
e70a021 - fix: Make ERPNext credentials optional, prevent app crash
cb69e20 - feat: Add ERPNext DocType Viewer to homepage, replace file viewer
13e77e3 - feat: Add ERPNext DocType Viewer with RAEP-DEV protocol
0f98183 - Remove Supabase File Viewer and Equity Calculator from homepage
```

### Current Branch
- **main** (clean working directory except .dev.vars modified)

## BetterST Inventory Planning

**Thought 1**: Identified all files involved - grid.tsx has the visibility logic, App.tsx has provider initialization, supabaseClient.ts has hard requirement for Supabase vars.

**Thought 2**: Verified file accessibility - all core files exist and are readable.

**Thought 3**: Key dependency is Vite ^5.0.0 which handles VITE_* environment variable injection at BUILD TIME only.

**Thought 4**: Documented environment variable configuration - CRITICAL finding that ERPNext variables are configured as "Secret" (encrypted) in Cloudflare, which means Vite CANNOT access them during build process.

## Critical Findings

🚨 **ROOT CAUSE IDENTIFIED IN INVENTORY**:
- Cloudflare Pages "Secret" environment variables are NOT exposed to the Vite build process
- Only "Plaintext" variables are accessible during `npm run build`
- Line 112 in grid.tsx evaluates `import.meta.env.VITE_ERPNEXT_API_KEY` at BUILD TIME
- If the variable is undefined during build, the card status is set to 'coming-soon' and filtered out
- VITE_ERPNEXT_API_KEY and VITE_ERPNEXT_API_SECRET are configured as "Secret" (encrypted)
- Therefore, Vite cannot see these variables → card status = 'coming-soon' → card not shown
