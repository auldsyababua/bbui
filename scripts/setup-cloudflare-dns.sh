#!/bin/bash
#
# Setup Cloudflare DNS for calculator.10nz.tools
# Creates a CNAME record pointing to the Snowflake Streamlit app
#
# Usage:
#   ./scripts/setup-cloudflare-dns.sh <streamlit-url>
#
# Example:
#   ./scripts/setup-cloudflare-dns.sh https://ZWZLXDA-MEB82135.snowflakecomputing.com/streamlit/off_grid_calculator

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
    echo "Example: $0 https://ZWZLXDA-MEB82135.snowflakecomputing.com/streamlit/off_grid_calculator"
    exit 1
fi

STREAMLIT_URL="$1"

# Extract domain from URL (remove https://)
TARGET_DOMAIN=$(echo "$STREAMLIT_URL" | sed 's|https\?://||' | sed 's|/.*||')

echo -e "${YELLOW}Setting up DNS for calculator.10nz.tools${NC}"
echo "Target: $TARGET_DOMAIN"

# Load environment variables from .dev.vars
if [ ! -f ".dev.vars" ]; then
    echo -e "${RED}Error: .dev.vars file not found${NC}"
    exit 1
fi

# Source .dev.vars (simple approach - in production use proper env loading)
CLOUDFLARE_API_TOKEN=$(grep "^CLOUDFLARE_API_TOKEN=" .dev.vars | cut -d'=' -f2)
CLOUDFLARE_ZONE_ID=$(grep "^CLOUDFLARE_ZONE_ID=" .dev.vars | cut -d'=' -f2)

if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
    echo -e "${RED}Error: CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID not set in .dev.vars${NC}"
    exit 1
fi

# Check if record already exists
echo -e "${YELLOW}Checking for existing DNS record...${NC}"
EXISTING=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=CNAME&name=calculator" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$EXISTING" ]; then
    echo -e "${YELLOW}Updating existing DNS record...${NC}"
    RESPONSE=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${EXISTING}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "{
        \"type\": \"CNAME\",
        \"name\": \"calculator\",
        \"content\": \"${TARGET_DOMAIN}\",
        \"ttl\": 3600,
        \"proxied\": true
      }")
else
    echo -e "${YELLOW}Creating new DNS record...${NC}"
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
fi

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ DNS record created/updated successfully!${NC}"
    echo "calculator.10nz.tools → $TARGET_DOMAIN"
    echo ""
    echo "Next steps:"
    echo "1. Wait a few minutes for DNS propagation"
    echo "2. Update tool card route in src/features/tools/grid.tsx to: https://calculator.10nz.tools"
else
    echo -e "${RED}✗ Failed to create/update DNS record${NC}"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

