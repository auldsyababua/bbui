#!/bin/bash
#
# Setup Cloudflare DNS for calculator.10nz.tools
# This script creates a CNAME record pointing to the Streamlit app
#
# Usage:
#   ./scripts/setup-calculator-dns.sh <streamlit-url>
#
# Example:
#   ./scripts/setup-calculator-dns.sh https://my-calc.streamlit.app
#
# Prerequisites:
#   - Cloudflare API token in .dev.vars as CLOUDFLARE_API_TOKEN
#   - Zone ID in .dev.vars as CLOUDFLARE_ZONE_ID
#   - Wrangler installed (npm install)

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if URL provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Streamlit URL required${NC}"
    echo "Usage: $0 <streamlit-url>"
    echo "Example: $0 https://my-calc.streamlit.app"
    exit 1
fi

STREAMLIT_URL="$1"

# Extract domain from URL (remove https://)
TARGET_DOMAIN=$(echo "$STREAMLIT_URL" | sed 's|https\?://||' | sed 's|/.*||')

echo -e "${YELLOW}Setting up DNS for calculator.10nz.tools${NC}"
echo "Target: $TARGET_DOMAIN"

# Check if .dev.vars exists
if [ ! -f ".dev.vars" ]; then
    echo -e "${RED}Error: .dev.vars file not found${NC}"
    echo "Please create .dev.vars with:"
    echo "  CLOUDFLARE_API_TOKEN=your-token"
    echo "  CLOUDFLARE_ZONE_ID=your-zone-id"
    exit 1
fi

# Load environment variables
source .dev.vars 2>/dev/null || true

# Check if variables are set
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
    echo -e "${RED}Error: CLOUDFLARE_API_TOKEN not set in .dev.vars${NC}"
    exit 1
fi

if [ -z "${CLOUDFLARE_ZONE_ID:-}" ]; then
    echo -e "${RED}Error: CLOUDFLARE_ZONE_ID not set in .dev.vars${NC}"
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}Wrangler not found. Installing...${NC}"
    npm install
fi

# Create DNS record using Wrangler
echo -e "${YELLOW}Creating CNAME record...${NC}"

# Use Cloudflare API directly via curl (more reliable than wrangler dns)
RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\": \"CNAME\",
    \"name\": \"calculator\",
    \"content\": \"${TARGET_DOMAIN}\",
    \"ttl\": 3600,
    \"proxied\": true
  }")

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ DNS record created successfully!${NC}"
    echo "calculator.10nz.tools → $TARGET_DOMAIN"
    echo ""
    echo "Next steps:"
    echo "1. Wait a few minutes for DNS propagation"
    echo "2. Update tool card route in src/features/tools/grid.tsx to: https://calculator.10nz.tools"
else
    echo -e "${RED}✗ Failed to create DNS record${NC}"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

