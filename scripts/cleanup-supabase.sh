#!/bin/bash
# Cleanup script to remove Supabase and Equity Calculator from bbui-fresh
# This script removes all Supabase-dependent code and simplifies the app

set -e

echo "Starting cleanup of Supabase and Equity Calculator..."

# Delete Supabase utility files
echo "Removing Supabase utility files..."
rm -f src/utils/supabaseClient.ts
rm -f src/utils/supabaseAdminClient.ts
rm -f src/types/supabase.ts

# Delete Supabase-dependent features
echo "Removing Supabase-dependent features..."
rm -rf src/features/auth
rm -rf src/features/documents
rm -rf src/features/users
rm -rf src/features/admin
rm -rf src/features/profile

# Delete equity calculator
echo "Removing equity calculator..."
rm -rf public/equity-calculator

# Delete backup App.tsx if exists
echo "Cleaning up backup files..."
rm -f "src/App 2.tsx"

echo "Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Verify the app works with only ERPNext functionality"
