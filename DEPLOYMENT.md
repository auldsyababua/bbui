# Deployment Guide for Brain Bot Docs

## Cloudflare Pages Deployment to 10nz-tools

### Prerequisites

1. Cloudflare account with access to 10nz-tools project
2. Wrangler CLI installed (locally via npm)
3. Authenticated with Cloudflare (`npx wrangler login`)

### Initial Setup

1. **Using existing 10nz-tools Pages project**
   - No need to create new project
   - Project name in wrangler.toml is set to `10nz-tools`

2. **Configure environment variables in Cloudflare dashboard:**
   - Go to Cloudflare Pages > 10nz-tools > Settings > Environment variables
   - Add the following variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
     - `VITE_APP_NAME`: brain-bot-docs

### Deployment Commands

1. **Build and deploy to production:**
   ```bash
   npm run deploy
   ```
   This will build the project and deploy to Cloudflare Pages.

2. **Deploy without building (if already built):**
   ```bash
   wrangler pages deploy ./dist
   ```

3. **Test locally with Wrangler:**
   ```bash
   npm run build
   npm run pages:dev
   ```

### Custom Domain Setup (10nz.tools)

1. Domain already configured:
   - The domain `10nz.tools` is already set up with your Pages project
   - No additional DNS configuration needed

2. Configure authentication:
   - Since we're using Supabase Auth with Google OAuth
   - No need for Cloudflare Access (avoiding dual authentication)
   - Google OAuth will handle @10netzero.com domain restriction

### Environment-Specific Configurations

- **Production**: Set via Cloudflare dashboard
- **Preview**: Set via dashboard or use branch-specific variables
- **Local**: Use `.dev.vars` file (gitignored)

### Continuous Deployment

1. **GitHub Integration (Recommended):**
   - Connect your GitHub repo in Cloudflare Pages
   - Set build command: `npm run build`
   - Set build output directory: `dist`
   - Automatic deploys on push to main branch

2. **Manual Deployment:**
   ```bash
   npm run deploy
   ```

### Troubleshooting

- **404 errors on routes**: Ensure `_redirects` file exists in public folder
- **Environment variables not working**: Check they're prefixed with `VITE_`
- **Build failures**: Check Node version compatibility

### Security Notes

- Never commit `.env` or `.dev.vars` files
- Use Cloudflare dashboard for production secrets
- Headers are configured in `public/_headers`
