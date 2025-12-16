# Development Log

This log tracks development sessions, changes, and decisions for the project.

Entries are in reverse chronological order (newest first).

---

## [2025-12-05 14:08] - Chrome DevTools MCP Connection Issue Investigation

### Problem Statement

Claude Code unable to connect to Chrome DevTools MCP despite:
- MCP server configured and running (verified via tool access)
- Chromium browser running (PID 2329149, launched at 14:07)
- Multiple Claude Code restarts attempted

**Error Message:**
```
The browser is already running for /home/workhorse/.cache/chrome-devtools-mcp/chrome-profile.
Use --isolated to run multiple browser instances.
```

### Root Cause Analysis

#### Multiple MCP Server Instances
Found **6 separate chrome-devtools-mcp server instances** running simultaneously:
- PID 964021 (started 12:50, pts/9)
- PID 988018 (started 12:52, pts/10)
- PID 1415898 (started 13:16, pts/11)
- PID 2222572 (started 14:01, pts/6)
- PID 2296205 (started 14:05, pts/3) ← Current active instance

Each instance is trying to claim exclusive access to the same Chrome profile at:
`/home/workhorse/.cache/chrome-devtools-mcp/chrome-profile`

#### Profile Lock Mechanism
The chrome-devtools-mcp server implements a profile lock to prevent multiple instances from controlling the same browser. However:

1. **Orphaned Processes**: Previous Claude Code sessions left MCP servers running after exit
2. **Lock Contention**: Each server instance checks if browser is "already running" for the profile
3. **No Auto-Cleanup**: Stale MCP servers aren't automatically killed when Claude Code restarts
4. **First-Come First-Served**: The first MCP instance (PID 964021) likely holds the lock, blocking all subsequent instances

#### Chromium Process State
Chromium is running independently (launched at 14:07):
- Main process: PID 2329149
- GPU process: PID 2329316
- Network service: PID 2329320
- Multiple renderer processes

However, **no MCP server can connect** because they're all blocked by the profile lock held by the first orphaned instance.

### What Is Left To Do

1. **Immediate Fix**
   - Kill all orphaned chrome-devtools-mcp processes
   - Restart Claude Code to spawn fresh MCP connection
   - Verify connection works

2. **Long-term Solutions**
   - Add cleanup hook to kill MCP servers on Claude Code exit
   - Configure MCP with `--isolated` flag if multiple instances needed
   - Investigate if MCP config allows custom profile paths
   - Consider process monitoring to prevent orphaned servers

3. **Testing**
   - Validate list_pages works after fix
   - Test take_snapshot functionality
   - Verify navigate_page and other devtools commands
   - Document working usage patterns

### Technical Details

#### MCP Server Command
All instances launched via:
```bash
npm exec chrome-devtools-mcp@latest
# → node /home/workhorse/.npm/_npx/15c61037b1978c83/node_modules/.bin/chrome-devtools-mcp
```

#### Chrome Profile Location
```
/home/workhorse/.cache/chrome-devtools-mcp/
└── chrome-profile/
```

#### Process Tree Analysis
```
pts/9  → MCP instance 1 (12:50) - ORPHANED
pts/10 → MCP instance 2 (12:52) - ORPHANED
pts/11 → MCP instance 3 (13:16) - ORPHANED
pts/6  → MCP instance 4 (14:01) - ORPHANED
pts/3  → MCP instance 5 (14:05) - ACTIVE (current Claude Code session)
```

### Context & Decisions

**Why Multiple Restarts Didn't Help:**
- Claude Code restart spawns NEW MCP server (pts/3)
- Old MCP servers remain running on other terminals (pts/9, 10, 11, 6)
- Lock is held by oldest orphaned process
- New servers immediately fail the "already running" check

**Why This Wasn't Obvious:**
- Error message suggests browser conflict, not MCP server conflict
- `--isolated` flag hint is misleading (applies to browser, not MCP server)
- No clear indication that profile lock is held by stale process
- Normal restart procedure doesn't clean up background services

### Files Changed

None yet - investigation phase only.

### References

- Chrome DevTools Protocol: https://chromedevtools.github.io/devtools-protocol/
- MCP Chrome DevTools Server: https://github.com/modelcontextprotocol/servers/tree/main/src/chrome-devtools
- Claude Code MCP Documentation: https://docs.claude.com/en/docs/claude-code/mcp

### Notes

**For Future Developers:**
- Always check for orphaned MCP processes before troubleshooting connection issues
- Use `ps aux | grep chrome-devtools-mcp` to identify running instances
- Profile lock errors may indicate process cleanup issue, not configuration issue
- Consider adding MCP process monitoring to project setup

**Process Cleanup Command:**
```bash
# Kill all chrome-devtools-mcp servers
pkill -f chrome-devtools-mcp
```

**Prevention Strategy:**
- Add to `.bashrc` or Claude Code hooks:
  ```bash
  # Cleanup on session exit
  trap 'pkill -f chrome-devtools-mcp' EXIT
  ```

---

## [2025-12-05 ~13:00] - Remove All Supabase and Equity Calculator Code

### What Was Done

Agent performed major cleanup to simplify app to ERPNext-only functionality.

#### Files Deleted (17 total)
**Supabase Utilities & Types:**
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/supabaseAdmin.ts` - Admin client setup
- `src/types/supabase.ts` - Supabase type definitions

**Authentication Features:**
- `src/components/auth/LoginPage.tsx`
- `src/components/auth/SignupPage.tsx`

**Supabase-Dependent Features:**
- `src/components/DocumentsPage.tsx`
- `src/components/UsersPage.tsx`
- `src/components/AdminPage.tsx`
- `src/components/ProfilePage.tsx`

**Equity Calculator:**
- `src/components/EquityCalculator.tsx`
- `src/components/EquityCalculator.css`

**Backup Files:**
- `src/App.tsx.backup`
- `src/components/auth/LoginPage.backup.tsx`
- `src/components/auth/SignupPage.backup.tsx`
- `src/components/DocumentsPage.backup.tsx`
- `src/components/UsersPage.backup.tsx`
- `src/components/AdminPage.backup.tsx`

**Code Reduction:**
- **~1,022 lines of code removed** (estimated)

#### Files Modified (5 total)

**`src/App.tsx`:**
- Reduced from 229 lines to 95 lines (58% reduction)
- Removed: Authentication routing, protected routes, login/signup pages, Supabase-dependent pages
- Simplified to: Direct homepage render with tools grid

**`package.json`:**
- Removed Supabase dependencies (~11 packages):
  - `@supabase/supabase-js`
  - Related auth/storage packages

**`src/contexts/AuthContext.tsx`:**
- Replaced with no-op provider
- All auth checks return full access
- No actual authentication performed

**`src/contexts/AccessControlContext.tsx`:**
- Replaced with no-op provider
- All permission checks return `true`
- No access restrictions enforced

**`src/components/Header.tsx`:**
- Removed user menu
- Removed logout functionality
- Simplified header layout

#### Deployment Actions Taken

**Git Operations:**
- Changes committed with message documenting removal
- Pushed to GitHub main branch
- Triggered Cloudflare Pages auto-deployment

**Expected Cloudflare Pages Behavior:**
1. Detect GitHub push event
2. Run `npm install` (removes Supabase packages from node_modules)
3. Run `npm run build` (creates production bundle)
4. Deploy to https://10nz.tools
5. Estimated deployment time: ~2 minutes from push

### What Is Left To Do

**Testing Required (NOT YET VERIFIED):**
1. Visit https://10nz.tools after deployment completes
2. Verify site loads without crashing
3. Confirm homepage shows tools grid
4. Verify ERPNext DocType Viewer card is visible
5. Test clicking card to browse DocTypes
6. Check browser console for errors
7. Confirm no login/authentication prompts appear

**Environment Variable Cleanup:**
Remove from Cloudflare Pages settings (no longer needed):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Keep (optional for ERPNext features):
- `VITE_ERPNEXT_API_URL`
- `VITE_ERPNEXT_API_KEY`
- `VITE_ERPNEXT_API_SECRET`

**Code Validation:**
- Run local build to verify no build errors
- Test ERPNext features still work without auth
- Verify all removed imports don't break remaining code

### Context & Decisions

**Why Remove Supabase Completely:**
- App was crashing in production due to missing Supabase credentials
- Authentication added unnecessary complexity for internal tool
- ERPNext is the only external service actually being used
- Simplification makes app more maintainable

**Why Remove Equity Calculator:**
- Not related to ERPNext functionality
- Part of broader simplification effort
- Can be re-added later if needed as standalone tool

**Why No-Op Auth Providers:**
- Allows existing code to reference auth context without breaking
- Provides clean upgrade path if auth needed later
- Simpler than removing all auth-checking code throughout app

**Risk Assessment:**
- App should load successfully with or without ERPNext credentials configured
- No authentication means app is fully public (acceptable for internal tool)
- Removed features may be needed later (can restore from git history)

### Files Changed

#### Deleted (17 files)
- `src/lib/supabase.ts`
- `src/lib/supabaseAdmin.ts`
- `src/types/supabase.ts`
- `src/components/auth/LoginPage.tsx`
- `src/components/auth/SignupPage.tsx`
- `src/components/DocumentsPage.tsx`
- `src/components/UsersPage.tsx`
- `src/components/AdminPage.tsx`
- `src/components/ProfilePage.tsx`
- `src/components/EquityCalculator.tsx`
- `src/components/EquityCalculator.css`
- `src/App.tsx.backup`
- `src/components/auth/LoginPage.backup.tsx`
- `src/components/auth/SignupPage.backup.tsx`
- `src/components/DocumentsPage.backup.tsx`
- `src/components/UsersPage.backup.tsx`
- `src/components/AdminPage.backup.tsx`

#### Modified (5 files)
- `src/App.tsx` - Simplified routing, removed auth pages
- `package.json` - Removed Supabase dependencies
- `src/contexts/AuthContext.tsx` - Replaced with no-op implementation
- `src/contexts/AccessControlContext.tsx` - Replaced with no-op implementation
- `src/components/Header.tsx` - Removed user menu and logout

### Commits

Git commit created with summary of Supabase removal. Exact hash not recorded in provided context.

### References

- Production URL: https://10nz.tools
- Cloudflare Pages auto-deployment pipeline
- Supabase package removal affects `package.json` and `package-lock.json`

### Notes

**IMPORTANT - Testing Status:**
⚠️ **All changes are UNTESTED in production.** User must verify deployment success before considering this work complete. Agent reported expected behavior but did not confirm actual results.

**What User Must Validate:**
1. Site loads without errors
2. ERPNext features still functional
3. No broken imports or missing dependencies
4. Console is clean (no runtime errors)
5. Build completed successfully in Cloudflare

**Rollback Plan:**
If deployment fails:
```bash
git revert HEAD
git push origin main
```

**For Future Developers:**
- All Supabase code preserved in git history (commit prior to deletion)
- Auth contexts left as no-ops to minimize code changes
- Can restore authentication by reverting deletion commit and re-adding Supabase config
- Consider whether public access is acceptable before deploying to production

---
