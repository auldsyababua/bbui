# STEP 2: ROOT CAUSE HYPOTHESES

## Hypothesis 1: Cloudflare "Secret" Environment Variables Not Accessible to Vite Build

**Likelihood**: HIGH

**Impact**: CRITICAL

**Description**:
Cloudflare Pages distinguishes between "Plaintext" and "Secret" (encrypted) environment variables. Secret variables are designed for Workers and Functions (server-side), not for static site builds. Vite needs access to VITE_* variables during the `npm run build` step to inject them via `import.meta.env.*`. Since VITE_ERPNEXT_API_KEY and VITE_ERPNEXT_API_SECRET are configured as "Secret", Vite cannot access them during build, resulting in `import.meta.env.VITE_ERPNEXT_API_KEY` evaluating to `undefined`. This causes line 112 in grid.tsx to set status to 'coming-soon', which gets filtered out by line 139.

**Supporting Evidence**:
- User confirmed ERPNext variables are configured as "Secret" (encrypted) in Cloudflare dashboard
- VITE_ERPNEXT_API_URL is "Plaintext" and likely accessible
- Cloudflare Pages architecture separates build-time from runtime environment access
- No console logs showing ERPNext variables detected (suggests undefined during build)
- Card visibility logic uses build-time evaluation: `import.meta.env.VITE_ERPNEXT_API_KEY ? 'active' : 'coming-soon'`

**Contradicting Evidence**:
- None identified

**Test Strategy**:
1. Check Vite official documentation on import.meta.env behavior
2. Check Cloudflare Pages documentation on Secret vs Plaintext variable accessibility
3. Inspect production bundle source code to verify if VITE_ERPNEXT_API_KEY is present
4. Quick test: Create minimal Vite project with Secret variable in Cloudflare, verify build output

---

## Hypothesis 2: Build Cache Serving Stale Bundle

**Likelihood**: MEDIUM

**Impact**: HIGH

**Description**:
Cloudflare Pages might be serving a cached version of the site from before ERPNext environment variables were added. Even if variables are now accessible, the deployed bundle could be from an earlier build (e.g., commit e70a021 or cb69e20) that didn't have the variables configured.

**Supporting Evidence**:
- Multiple recent commits (e70a021, cb69e20, f03fdcc) attempting to fix the issue
- f03fdcc commit message explicitly says "trigger rebuild with ERPNext env vars"
- User said "this was working yesterday" but isn't now

**Contradicting Evidence**:
- Console logs show production environment with current Supabase configuration
- If it was working yesterday, the bundle should have been built with variables present
- Cloudflare typically invalidates cache on new deployments

**Test Strategy**:
1. Check Cloudflare deployment timestamp vs git commit timestamp
2. Use browser DevTools to inspect production bundle source code
3. Search bundle for string "VITE_ERPNEXT_API_KEY" or "dbf4bb1b556e3d2"
4. Clear browser cache and hard reload

---

## Hypothesis 3: ERPNext Provider Initialization Causing App Crash

**Likelihood**: LOW

**Impact**: CRITICAL

**Description**:
The ERPNext data provider initialization in App.tsx (lines 63-69) could be failing, causing a React error that prevents the entire app from rendering properly. This would prevent the tools grid from ever displaying.

**Supporting Evidence**:
- App.tsx has conditional provider logic that could fail
- Supabase is showing 404 errors in console (indicates potential data provider issues)

**Contradicting Evidence**:
- Console logs show "[INFO] App component rendering" - app IS initializing
- Console shows auth provider initialized successfully
- The app is rendering (we can see the Supabase URL log)
- No React error messages or stack traces in provided console output
- The issue is specific to ONE card being missing, not entire app crash

**Test Strategy**:
1. Check browser console for React error boundaries triggered
2. Check for uncaught exceptions in production console
3. Test if other cards on the tools grid are displaying

---

## Hypothesis 4: TypeScript/Vite Build Failure Producing Partial Bundle

**Likelihood**: LOW

**Impact**: HIGH

**Description**:
The TypeScript compilation or Vite build process could be failing silently, producing a bundle that doesn't include the latest grid.tsx code with the ERPNext card definition.

**Supporting Evidence**:
- Build command includes `tsc &&` before `vite build` - TypeScript errors could halt build

**Contradicting Evidence**:
- Site is successfully deployed and rendering
- f03fdcc is the latest commit on main branch
- Cloudflare wouldn't deploy a failed build (would show build error)
- Console logs show current code is running (Supabase URL present)

**Test Strategy**:
1. Check Cloudflare Pages build logs for TypeScript errors
2. Check for Vite warnings about missing imports or build issues
3. Verify grid.tsx syntax is valid

---

## Hypothesis Priority Ranking

1. **PRIORITY 1**: Hypothesis 1 (Secret vs Plaintext) - Strongest evidence, most likely root cause
2. **PRIORITY 2**: Hypothesis 2 (Build cache) - Possible but contradicted by logs
3. **PRIORITY 3**: Hypothesis 3 (Provider crash) - Low likelihood, contradicted by successful app init
4. **PRIORITY 4**: Hypothesis 4 (Build failure) - Very low likelihood, site is deployed successfully

---

## BetterST Hypothesis Generation

**Thought 1**: Generated 4 hypotheses covering the most likely root causes. Primary hypothesis (Secret variables) has strongest supporting evidence based on Cloudflare Pages architecture.

**Thought 2**: Ranked hypotheses by testing priority. Hypothesis 1 should be validated first via official documentation, followed by bundle inspection for Hypothesis 2.

**Thought 3**: Identified clear test strategies for each hypothesis. Quick tests in Step 5 will focus on validating Hypothesis 1 (Vite/Cloudflare documentation) and Hypothesis 2 (bundle inspection).
