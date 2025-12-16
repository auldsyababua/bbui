# Validation Checklist - Supabase Removal

## Pre-Cleanup Verification

- [ ] Current code is committed to git (for easy rollback if needed)
- [ ] Backup of .env and .dev.vars files made
- [ ] Current app runs successfully with `npm run dev`

## Run Cleanup

- [ ] Execute cleanup script: `chmod +x cleanup-supabase.sh && ./cleanup-supabase.sh`
- [ ] Install updated dependencies: `npm install`
- [ ] Verify package-lock.json updated (Supabase packages removed)

## Code Verification

### Files Modified Successfully
- [ ] `src/providers/authProvider.ts` - No-op auth provider
- [ ] `src/providers/accessControlProvider.ts` - No-op access control
- [ ] `src/App.tsx` - Simplified routes (Homepage + ERPNext only)
- [ ] `package.json` - Supabase dependencies removed
- [ ] `src/components/header/index.tsx` - Simplified header (no profile/logout)

### Files Deleted Successfully
- [ ] `src/utils/supabaseClient.ts` deleted
- [ ] `src/utils/supabaseAdminClient.ts` deleted
- [ ] `src/types/supabase.ts` deleted
- [ ] `src/features/auth/` directory deleted
- [ ] `src/features/documents/` directory deleted
- [ ] `src/features/users/` directory deleted
- [ ] `src/features/admin/` directory deleted
- [ ] `src/features/profile/` directory deleted
- [ ] `public/equity-calculator/` directory deleted
- [ ] `src/App 2.tsx` deleted (if existed)

## TypeScript Compilation

- [ ] Run `npm run typecheck` - no errors
- [ ] No import errors for deleted Supabase files
- [ ] No import errors for deleted feature directories
- [ ] No type errors in modified files

## Development Build

- [ ] Run `npm run dev` - starts without errors
- [ ] No console errors on app load
- [ ] No warnings about missing Supabase
- [ ] Homepage loads correctly
- [ ] Tools grid displays correctly

## Functional Testing

### Homepage
- [ ] Homepage accessible at `/`
- [ ] Tools grid renders
- [ ] ERPNext DocType Viewer card shows (active if credentials, coming-soon if not)
- [ ] Operations Management card shows (external link)
- [ ] Off-Grid Inference Calculator card shows (external link)
- [ ] No equity calculator card (removed)
- [ ] No documents/personnel cards (removed)

### ERPNext Viewer (if credentials configured)
- [ ] Navigate to `/tools/erpnext/doctypes` works
- [ ] DocType list loads (or shows error if no credentials)
- [ ] Can click on a DocType
- [ ] DocType detail page loads
- [ ] Can navigate back to list

### Header
- [ ] Header shows "Home" button
- [ ] Header shows "FLRTS Operations Hub" title
- [ ] No profile dropdown (removed)
- [ ] No logout button (removed)
- [ ] Home button navigates to `/`

### Navigation
- [ ] No login page at `/login` (route removed)
- [ ] No signup page at `/signup` (route removed)
- [ ] No documents at `/documents` (route removed)
- [ ] No personnel at `/personnel` (route removed)
- [ ] No admin at `/admin` (route removed)
- [ ] No profile at `/profile` (route removed)
- [ ] No equity calculator at `/equity-calculator` (route removed)

## Production Build

- [ ] Run `npm run build` - completes successfully
- [ ] No build errors
- [ ] No TypeScript errors during build
- [ ] Build output size reduced (no Supabase SDK)
- [ ] Check dist/ directory created

## Production Preview

- [ ] Run `npm run preview` - starts successfully
- [ ] Preview site loads correctly
- [ ] All functional tests pass in preview mode
- [ ] No console errors in preview

## Environment Variables

### Remove from .env and .dev.vars
- [ ] `VITE_SUPABASE_URL` removed
- [ ] `VITE_SUPABASE_ANON_KEY` removed

### Keep (Optional for ERPNext)
- [ ] `VITE_ERPNEXT_API_URL` (or defaults to https://ops.10nz.tools)
- [ ] `VITE_ERPNEXT_API_KEY` (optional)
- [ ] `VITE_ERPNEXT_API_SECRET` (optional)

## Code Quality

- [ ] No console.log statements left over (except logger)
- [ ] No commented-out Supabase code
- [ ] No TODO comments related to Supabase
- [ ] All imports resolved correctly
- [ ] No unused imports

## Git Status

- [ ] Review changes: `git diff`
- [ ] Review deleted files: `git status`
- [ ] Verify only expected files modified/deleted
- [ ] All changes intentional

## Deployment Ready

- [ ] Local build successful
- [ ] Local preview successful
- [ ] All tests pass
- [ ] Ready to commit changes
- [ ] Ready to deploy to Cloudflare Pages

## Post-Deployment Verification (After deploying)

- [ ] Production site loads
- [ ] Homepage displays correctly
- [ ] ERPNext viewer works (if credentials configured)
- [ ] No console errors in production
- [ ] No 404 errors for deleted routes
- [ ] External tool links work
- [ ] Page loads quickly (reduced bundle size)

## Rollback Plan (If Issues Found)

If critical issues are discovered:

```bash
# Restore all changes
git checkout src/App.tsx
git checkout src/providers/authProvider.ts
git checkout src/providers/accessControlProvider.ts
git checkout src/components/header/index.tsx
git checkout package.json

# Restore deleted files
git checkout src/utils/supabaseClient.ts
git checkout src/utils/supabaseAdminClient.ts
git checkout src/types/supabase.ts
git checkout src/features/auth
git checkout src/features/documents
git checkout src/features/users
git checkout src/features/admin
git checkout src/features/profile
git checkout public/equity-calculator

# Reinstall dependencies
npm install

# Test
npm run dev
```

## Success Criteria

All items above checked ✓ = Cleanup successful!

---

**Checklist completed by**: _____________
**Date**: _____________
**Issues found**: _____________
**Resolution**: _____________
