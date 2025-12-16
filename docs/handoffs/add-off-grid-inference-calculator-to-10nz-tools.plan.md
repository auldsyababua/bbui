<!-- ffb87b96-2ff7-40a0-98fe-37875a742a96 99738505-4c23-4f09-b02f-3007882e10d2 -->
# Add Off-Grid Calculator Link to 10nz.tools

## Overview

Add the Streamlit "Off-Grid Inference Infra Calculator" as a tool card on the 10nz.tools homepage. The card will link directly to the Streamlit app hosted on a subdomain (e.g., `calculator.10nz.tools`), similar to how "Operations Management" links to `https://ops.10nz.tools`.

**No iframe needed** - just a direct external link from the tool card.

## Implementation Steps

### 1. Add Tool Card to Homepage Grid

**File:** `src/features/tools/grid.tsx`

- Add new tool entry to the `tools` array with:
- Title: "Off-Grid Inference Infra Calculator"
- Description: "Calculate generator risk, BESS sizing, and data logistics for off-grid AI inference deployments."
- Icon: `CalculatorOutlined` or `ThunderboltOutlined` from Ant Design
- Route: `https://calculator.10nz.tools` (or actual subdomain URL)
- Color: Choose from existing palette (e.g., `#13c2c2` cyan or `#fa8c16` orange)
- Status: `'active'`
- External: `true` (opens in new tab, like Operations Management)

**That's it!** No need for:

- React page component
- Route in App.tsx
- Iframe embedding

The existing `handleToolClick` function already handles external links correctly (line 116-117).

### 2. Streamlit Hosting Setup (Separate Task)

**Hosting:** Streamlit app will be hosted on `calculator.10nz.tools` subdomain

**Hosting Options:**

- **Streamlit Community Cloud** with custom domain (free tier available)
- **Railway** with custom domain (free $5/month credit)
- **Render** with custom domain (free tier available)
- **Snowflake** private app (if you prefer private hosting)

**DNS Configuration:**

- Add CNAME record: `calculator.10nz.tools` → hosting provider URL
- Or configure DNS in hosting provider to point to `calculator.10nz.tools`

**After Deployment:**

- Streamlit app accessible at `https://calculator.10nz.tools`
- Update the `route` in the tool card to match the actual URL

## Files to Modify

1. `src/features/tools/grid.tsx` - Add tool card (only file needed)

## Testing

1. Test locally: `npm run dev` → verify tool card appears on homepage
2. Click card → should open `https://calculator.10nz.tools` in new tab
3. Once Streamlit is deployed, verify the link works

## Deployment

After changes are committed and pushed to GitHub main branch, Cloudflare Pages will auto-deploy. The tool card will be live immediately, linking to the Streamlit app once it's deployed to the subdomain.

### To-dos

- [ ] Add Off-Grid Inference Infra Calculator card to tools grid in src/features/tools/grid.tsx with external link to subdomain
- [ ] Host Streamlit app on calculator.10nz.tools subdomain and update tool card route URL





