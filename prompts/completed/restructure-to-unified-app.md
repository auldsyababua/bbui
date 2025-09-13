# Task: Restructure BBUI from Nested App to Unified Refine Application

## Objective
Migrate the nested `brain-bot-docs-app` structure to a unified Refine application at the root of the BBUI project, establishing a feature-based architecture that can accommodate multiple UI features while maintaining the document viewer functionality.

## Context
The BBUI project was initially conceived as a frontend generator system, but the implementation created a nested application structure that conflicts with the goal of having a single, unified UI codebase. We need to lift the Refine app to the root level and organize it using feature-based architecture.

### Current Structure (Problematic)
```
bbui/
├── brain-bot-docs-app/     # Full Refine app (should not be nested)
│   ├── src/
│   ├── package.json
│   └── ...
├── generate-frontend.sh    # Generator script (needs updating)
├── templates/              # Component templates
└── README.md
```

### Target Structure (Desired)
```
bbui/                       # The main Refine app
├── src/
│   ├── components/         # Shared components
│   ├── features/          # Feature modules
│   │   ├── documents/     # Document viewer feature
│   │   ├── admin/         # Admin dashboard
│   │   └── users/         # User management
│   ├── providers/         # Auth, data providers
│   ├── utils/             # Shared utilities
│   └── App.tsx           # Main app entry
├── package.json           # Single package.json
├── vite.config.ts        
└── tsconfig.json         
```

## Requirements

### Phase 1: Lift & Shift (Priority)
1. Move all files from `brain-bot-docs-app/` to the root `bbui/` directory
2. Merge configurations (package.json, tsconfig, vite.config)
3. Update all import paths to reflect new structure
4. Delete the empty `brain-bot-docs-app/` directory
5. Ensure the app runs correctly at the root level

### Phase 2: Feature-Based Reorganization
1. Create the feature-based directory structure under `src/`
2. Move document-related components to `src/features/documents/`
3. Move admin components to `src/features/admin/`
4. Move user management to `src/features/users/`
5. Extract shared components to `src/components/`
6. Organize providers and utilities appropriately

### Phase 3: Update Supporting Files
1. Update `generate-frontend.sh` to add features instead of creating new apps
2. Update README.md to reflect new architecture
3. Update .gitignore if needed
4. Create documentation for the new structure

## Technical Details

### Files to Migrate (Phase 1)
All files from `brain-bot-docs-app/` including:
- Configuration files: package.json, tsconfig.json, vite.config.ts, .env, .env.example
- Source files: All TypeScript/React files in src/
- Public assets: public/ directory contents
- Build/deployment files: wrangler.toml, .dev.vars

### Import Path Updates
After moving files, update all imports:
- Component imports: `@/components/...` or relative paths
- Feature imports: `@/features/documents/...`
- Utility imports: `@/utils/...`
- Provider imports: `@/providers/...`

### Refine Best Practices (from documentation)

#### Resource Organization
```typescript
// App.tsx - Resources should map to features
resources={[
  {
    name: "brain_bot_documents",
    list: "/documents",
    show: "/documents/:id",
    meta: {
      label: "Documents",
      // Feature-specific metadata
    },
  },
  // Additional features as resources
]}
```

#### Routing Structure
```typescript
// Use nested routes for feature organization
<Routes>
  <Route element={<Authenticated><ThemedLayoutV2><Outlet /></ThemedLayoutV2></Authenticated>}>
    <Route path="/documents/*" element={<DocumentsFeature />} />
    <Route path="/admin/*" element={<AdminFeature />} />
    <Route path="/users/*" element={<UsersFeature />} />
  </Route>
</Routes>
```

#### Data Provider Configuration
```typescript
// Maintain Supabase integration
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { supabaseClient } from "@/utils/supabaseClient";

// In App.tsx
<Refine
  dataProvider={dataProvider(supabaseClient)}
  liveProvider={liveProvider(supabaseClient)}
  // ...
/>
```

## Success Criteria
- [ ] All files successfully moved to root level
- [ ] Application runs without errors (`npm run dev`)
- [ ] All imports resolved correctly
- [ ] Tests pass (if any exist)
- [ ] Build succeeds (`npm run build`)
- [ ] Feature-based structure implemented
- [ ] Documentation updated
- [ ] No functionality lost from original app

## Implementation Steps

### Step 1: Backup Current State
```bash
# Create a backup branch
git checkout -b backup/pre-restructure
git add -A
git commit -m "Backup: Before restructuring to unified app"
git checkout main
```

### Step 2: Move Files (Phase 1)
```bash
# Move all contents from nested app to root
mv brain-bot-docs-app/* .
mv brain-bot-docs-app/.* . 2>/dev/null || true

# Remove empty directory
rmdir brain-bot-docs-app
```

### Step 3: Update Configuration
1. Check for any path references in:
   - vite.config.ts
   - tsconfig.json
   - package.json scripts

### Step 4: Test Application
```bash
npm install
npm run dev
# Verify app runs correctly
```

### Step 5: Implement Feature Structure (Phase 2)
Create directories and move files according to the feature-based architecture.

### Step 6: Update Imports
Systematically update all import statements to match new structure.

### Step 7: Final Testing
```bash
npm run build
npm run lint
npm run typecheck
```

## Common Pitfalls to Avoid

1. **Path Issues**: Double-check all relative imports after moving files
2. **Environment Variables**: Ensure .env files are properly moved and gitignored
3. **Public Assets**: Verify public/ directory contents are accessible
4. **Build Configurations**: Update any hardcoded paths in build tools
5. **Git History**: Consider using `git mv` to preserve file history

## Code Quality Standards

- Follow existing code style (check .prettierrc.local.json)
- Maintain TypeScript strict mode
- Keep components focused and single-purpose
- Use proper Refine hooks and patterns
- Document any non-obvious architectural decisions

## Reference: Current File List
```
brain-bot-docs-app/src/
├── App.tsx
├── components/
│   ├── FileTree.tsx
│   └── index.ts
├── pages/
│   ├── admin/
│   ├── documents/
│   ├── login/
│   ├── signup/
│   ├── tools/
│   └── users/
├── providers/
│   ├── accessControlProvider.ts
│   └── authProvider.ts
├── types/
│   └── supabase.ts
├── utils/
│   ├── supabaseAdminClient.ts
│   └── supabaseClient.ts
├── main.tsx
└── vite-env.d.ts
```

## Notes for AI Agent

- This is a structural refactoring - no new features should be added
- Preserve all existing functionality
- Test frequently during the migration
- Commit after each major phase
- If you encounter blockers, document them clearly
- Use the file tree to verify structure at each step
