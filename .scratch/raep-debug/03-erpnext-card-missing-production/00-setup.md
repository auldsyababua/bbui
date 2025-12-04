# STEP 0: SETUP

**Issue Being Debugged**: ERPNext DocType Viewer card not appearing on 10nz.tools production homepage despite environment variables being configured in Cloudflare Pages

**Working Directory**: `.scratch/raep-debug/03-erpnext-card-missing-production/`

**Created**: 2025-12-04

**Context**:
- The ERPNext DocType Viewer feature was working yesterday
- All environment variables are configured in Cloudflare Pages (VITE_ERPNEXT_API_URL, VITE_ERPNEXT_API_KEY, VITE_ERPNEXT_API_SECRET)
- Recent commits deployed (e70a021, f03fdcc)
- User removed Supabase-related environment variables from Cloudflare (no longer using Supabase)
- Console shows Supabase URL still present in production bundle
- No logs about ERPNext environment variables being detected

**Expected Behavior**: Three cards should appear on homepage:
1. Operations Management (external link)
2. Off-Grid Inference Infra Calculator (external link)
3. ERPNext DocType Viewer (internal route)

**Actual Behavior**: ERPNext DocType Viewer card is missing from production

All investigation artifacts for this debugging session will be stored in this directory.

## Planned Directory Structure
- 00-setup.md (this file)
- 01-inventory.md
- 02-hypotheses.md
- 03-perplexity-leads.md
- 04-validation.md
- 05-quick-tests.md
- 06-research-full.md
- 07-decomposition.md
- 08-evaluation.md
- 10-handoff.md
- tests/ (throwaway test scripts)

## BetterST Setup Planning

**Thought 1**: Determined next sequence number (03) based on 2 existing raep-debug directories. Issue slug: "erpnext-card-missing-production" captures the core problem.

**Thought 2**: Planned complete directory structure per RAEP debug protocol, including all required markdown files and tests/ subdirectory.

**Thought 3**: Ready to execute setup and begin systematic investigation.
