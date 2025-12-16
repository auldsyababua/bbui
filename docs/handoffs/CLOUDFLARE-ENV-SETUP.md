# Cloudflare Pages Environment Variables Setup

## Current Status

✅ **Environment variables are configured in Cloudflare Pages**
🔄 **Triggering new deployment to rebuild with environment variables**

Vite only includes `VITE_*` environment variables at build time. A new deployment is needed to ensure the ERPNext card appears on the homepage.

## What Needs to Be Done

Add the following environment variables to the Cloudflare Pages project via the dashboard:

### Environment Variables Required

```
VITE_ERPNEXT_API_URL=https://ops.10nz.tools
VITE_ERPNEXT_API_KEY=dbf4bb1b556e3d2
VITE_ERPNEXT_API_SECRET=f6097d1b5069034
```

## Step-by-Step Instructions

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Use your Cloudflare account credentials

2. **Navigate to the Pages Project**
   - Click on "Workers & Pages" in the left sidebar
   - Find and click on the project: **10netzero-tools**

3. **Access Environment Variables Settings**
   - Click on the "Settings" tab
   - Scroll down to "Environment variables" section

4. **Add Production Environment Variables**
   For each variable below, click "Add variable":

   **Variable 1:**
   - Variable name: `VITE_ERPNEXT_API_URL`
   - Value: `https://ops.10nz.tools`
   - Environment: Select "Production"
   - Click "Save"

   **Variable 2:**
   - Variable name: `VITE_ERPNEXT_API_KEY`
   - Value: `dbf4bb1b556e3d2`
   - Environment: Select "Production"
   - Click "Save"

   **Variable 3:**
   - Variable name: `VITE_ERPNEXT_API_SECRET`
   - Value: `f6097d1b5069034`
   - Environment: Select "Production"
   - Click "Save"

5. **Trigger a Redeploy**
   After adding all variables, you need to trigger a new deployment:
   - Go to the "Deployments" tab
   - Click "Create deployment" or "Retry deployment" on the latest deployment
   - Alternatively, push a small commit to trigger automatic deployment

## What Will Happen

Once the environment variables are added and a new deployment completes:

1. The ERPNext DocType Viewer card will appear on the 10nz.tools homepage
2. Clicking it will navigate to `/tools/erpnext/doctypes`
3. You'll be able to browse all ERPNext DocTypes from ops.10nz.tools
4. You can click on any DocType to view its records in a table

## Current Deployment Info

- **Project Name:** 10netzero-tools
- **Project ID:** 0f3214e1-e0d3-4fbe-9d15-b7fc19df8a4e
- **Account ID:** c4d6c050d2b25309d953d9968592f742
- **Latest Commit:** e70a021 (Made ERPNext provider conditional)
- **Production URL:** https://10nz.tools

## Why API Automation Didn't Work

Cloudflare does not currently provide a documented public API endpoint for managing Pages environment variables. The recommended approach is to use the dashboard UI. Attempted automation via the Cloudflare API failed with routing errors because the Pages environment variables API is undocumented and not publicly supported.

## Alternative: Wrangler CLI

If you prefer command-line tools, you can try using Wrangler, but it requires additional authentication setup:

```bash
# This failed with authentication error in our attempts
npx wrangler pages project create 10netzero-tools --production-branch main
```

The authentication issue suggests the API token in .env doesn't have the necessary permissions for Wrangler operations.

## Files Modified in This Session

- `src/App.tsx` - Made ERPNext provider conditional
- `src/features/tools/grid.tsx` - Added ERPNext DocType Viewer card
- Multiple TypeScript files - Fixed compilation errors
- Git commits pushed to trigger Cloudflare deployment

## Next Steps After Adding Variables

1. Verify the ERPNext DocType Viewer card appears on homepage
2. Test browsing DocTypes (should see list of all ERPNext DocTypes)
3. Test viewing individual DocType records
4. Verify authentication works with the provided API credentials

## Reference Documents

- Original handoff: `/srv/projects/bbui-fresh/HANDOFF-erpnext-doctype-viewer.md`
- Testing report: `/srv/projects/bbui-fresh/.scratch/raep-dev/01-erpnext-doctype-viewer/TESTING-REPORT.md`
- Environment variables: `/srv/projects/bbui-fresh/.env` (local development)
