# STEP 3: RESEARCH LEADS

## Local-Docs Query 1: Vite import.meta.env environment variables build time configuration

**Results**: No relevant Vite documentation found in local RAG database
- Found only Terraform-related documentation (not relevant)
- **Action Required**: Need to search official Vite documentation via ref.tools in Step 4

---

## Local-Docs Query 2: Cloudflare Pages environment variables Secret Plaintext build process

**Results**: No Cloudflare Pages documentation found in local RAG database
- Found only Render.com documentation about secrets (different platform)
- **Action Required**: Need to search official Cloudflare Pages documentation via ref.tools in Step 4

---

## Perplexity Query 1: How does Vite's import.meta.env work?

**Search Query**: "How does Vite's import.meta.env work? When are VITE_* environment variables injected - at build time or runtime? What happens if a VITE_* variable is undefined during the build process?"

**Leads Found**:

### Lead 1: Vite environment variables are BUILD-TIME only
- **Description**: Vite reads environment variables when dev server starts or during `vite build`, then STATICALLY INJECTS them into code
- **Source**: Perplexity citing Vite official docs
- **Relevance**: HIGH - Confirms that VITE_* variables must be available during build, not runtime

**Key Quote**:
> "In build (`vite build`), Vite reads `.env*` and process env at build time and *replaces* uses of `import.meta.env.*` with their literal values in the bundled output (e.g., strings, booleans). Because of this static replacement, the values are effectively 'baked into' the bundle at build time"

### Lead 2: Undefined VITE_* variables resolve to undefined
- **Description**: If VITE_* variable doesn't exist in loaded env, it resolves to `undefined` in both dev and production builds
- **Source**: Perplexity citing Vite docs
- **Relevance**: HIGH - Explains why card status would be 'coming-soon' if variable missing

**Key Quote**:
> "If you reference `import.meta.env.SOME_NAME` where `SOME_NAME` does **not** exist in the loaded env (no `.env` value and nothing from the process env): In a production build, Vite will still generate code that evaluates to `undefined` for that property, because there was no value to substitute."

### Lead 3: Vite doesn't validate required environment variables
- **Description**: Vite does not throw errors for missing VITE_* variables by default
- **Source**: Perplexity citing Vite docs
- **Relevance**: MEDIUM - Means build could succeed even without required variables
- **Implication**: Build would complete successfully but with undefined values baked in

**Citations**:
- [1] https://v3.vitejs.dev/guide/env-and-mode
- [2] https://vite.dev/guide/env-and-mode

---

## Perplexity Query 2: Cloudflare Pages Secret vs Plaintext environment variables

**Search Query**: "In Cloudflare Pages, what is the difference between 'Plaintext' and 'Secret' (encrypted) environment variables? Which type of environment variable is accessible to the build process (npm run build) for a static site like Vite or Next.js?"

**Leads Found**:

### Lead 1: Both Plaintext and Secret variables available during build
- **Description**: Cloudflare Pages injects BOTH Plaintext and Secret variables into build container environment via process.env
- **Source**: Perplexity citing Cloudflare docs
- **Relevance**: CRITICAL - **CONTRADICTS Hypothesis 1**
- **Status**: REQUIRES VALIDATION - This contradicts earlier assumption

**Key Quote**:
> "During `npm run build` for frameworks like Vite or Next.js on Cloudflare Pages, both Plaintext and Secret variables are injected into the build container's environment, so they can be read via `process.env.MY_VAR`"

### Lead 2: Framework conventions determine client-side exposure
- **Description**: For values to be in client bundle, must follow framework's public env convention (VITE_* for Vite, NEXT_PUBLIC_* for Next.js)
- **Source**: Perplexity citing Cloudflare docs
- **Relevance**: HIGH - Confirms VITE_* prefix is required for client-side access

### Lead 3: Secrets should never be exposed client-side
- **Description**: Any VITE_* variable gets baked into client bundle and is publicly visible, so secrets shouldn't use this pattern
- **Source**: Perplexity citing Cloudflare docs
- **Relevance**: HIGH - Architectural concern about exposing API keys

**Citations**:
- [1] https://developers.cloudflare.com/pages/functions/bindings/
- [3] https://developers.cloudflare.com/workers/configuration/secrets/
- [5] https://developers.cloudflare.com/workers/configuration/environment-variables/

---

## Key Findings from Perplexity

### Finding 1: Vite Build-Time Injection Confirmed ✓
Vite statically replaces `import.meta.env.VITE_*` with literal values at build time. If variable is undefined during build, it stays undefined in the bundle.

### Finding 2: Hypothesis 1 CHALLENGED ⚠️
**Perplexity claims both Plaintext AND Secret variables are accessible during Cloudflare Pages build.**

This CONTRADICTS my initial hypothesis that Secret variables are not accessible to the build process.

**Resolution Needed**:
- Must validate this claim with OFFICIAL Cloudflare Pages documentation (Step 4)
- If Perplexity is correct, then root cause is NOT Secret vs Plaintext distinction
- Alternative root cause possibilities:
  - Variables not configured for correct environment (Preview vs Production)
  - Build environment not receiving variables due to configuration issue
  - Cache issue (Hypothesis 2)

### Finding 3: Security Concern Identified
Even if we fix the visibility issue, exposing API keys via VITE_* prefix means they'll be in the client bundle and publicly accessible. This is a security anti-pattern.

---

## BetterST Query Planning

**Thought 1**: Structured queries to investigate Vite build-time behavior and Cloudflare Pages environment variable types.

**Thought 2**: Perplexity results provide valuable leads BUT also contradict Hypothesis 1. Need independent verification via official documentation in Step 4 before concluding.

**Thought 3**: Identified security concern with current architecture (client-side API keys) that should be addressed regardless of fixing visibility issue.
