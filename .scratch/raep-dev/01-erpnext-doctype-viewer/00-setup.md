# STEP 0: SETUP

**Feature Being Developed**: ERPNext DocType Viewer using REST API
**Working Directory**: `.scratch/raep-dev/01-erpnext-doctype-viewer/`
**Created**: 2025-12-03

All artifacts for this development session will be stored in this directory.

## Feature Overview

Build a MariaDB/ERPNext DocType viewer for the bbui-fresh (10nz.tools) project using the ERPNext REST API (Option 2 from initial research). This viewer will:
- Use existing ERPNext API credentials (no additional database access required)
- Display DocTypes, schemas, and records
- Provide filtering, search, and export capabilities
- Reuse architecture from the removed Supabase file viewer

## Planned Directory Structure
- `00-setup.md` (this file)
- `01-inventory.md`
- `02-design-approaches.md`
- `03-perplexity-leads.md`
- `04-validation.md`
- `05-prototype/`
- `06-design-spec.md`
- `07-implementation/`
- `08-integration.md`
- `09-validation-report.md`
- `10-handoff.md`

## BetterST Setup Planning

**Thought 1**: Analyzed feature requirements - user wants ERPNext DocType viewer using REST API to avoid $50/month database access costs.

**Thought 2**: Selected semantic folder name `01-erpnext-doctype-viewer` because:
- Clearly identifies technology (ERPNext)
- Specifies component (DocType viewer)
- Follows kebab-case convention
- First RAEP session (01)

**Thought 3**: Directory structure will follow standard RAEP-DEV protocol with all 11 step outputs documented.
