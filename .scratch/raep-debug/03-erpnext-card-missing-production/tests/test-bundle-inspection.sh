#!/bin/bash
# Test 1: Inspect production bundle for VITE_ERPNEXT_API_KEY

echo "=== TEST 1: Production Bundle Inspection ==="
echo ""
echo "Fetching main bundle from https://10nz.tools..."
echo ""

# Fetch the main page to find JavaScript bundle URLs
curl -s https://10nz.tools | grep -o 'src="[^"]*\.js"' | head -5

echo ""
echo "---"
echo "Manual inspection required:"
echo "1. Open https://10nz.tools in browser"
echo "2. Open DevTools (F12) > Sources tab"
echo "3. Search for 'VITE_ERPNEXT_API_KEY' in all files (Ctrl+Shift+F)"
echo "4. Search for 'dbf4bb1b556e3d2' (the actual API key value)"
echo ""
echo "EXPECTED if Hypothesis 1 CORRECT (Secret vars not accessible):"
echo "  - No matches for 'VITE_ERPNEXT_API_KEY'"
echo "  - No matches for 'dbf4bb1b556e3d2'"
echo "  - Card status likely hardcoded as 'coming-soon'"
echo ""
echo "EXPECTED if Hypothesis 1 WRONG (Secret vars ARE accessible):"
echo "  - 'dbf4bb1b556e3d2' found in bundle"
echo "  - Card status hardcoded as 'active'"
echo ""
