# STEP 3: RESEARCH LEADS

## Query 1: ERPNext/Frappe REST API Integration Best Practices (2024-2025)

**Query**: "What are the best practices for integrating ERPNext/Frappe REST API with React applications in 2024-2025? Focus on authentication, CORS handling, and common API integration pitfalls. Include version-specific considerations for Frappe Framework v14+."

### Leads Found

#### Lead 1: OAuth 2.0 vs Token Authentication
**Finding**: OAuth 2.0 is recommended over traditional token authentication for production applications. If token auth isn't working in REST API calls, switch to OAuth 2.0 with access tokens[2].

**Investigation Needed**:
- Validate if ops.10nz.tools supports OAuth 2.0 (check Frappe Cloud docs)
- Determine if API key/secret auth is sufficient for read-only viewer
- Research OAuth 2.0 client setup in Frappe if required

**Rationale**: We have API key/secret from bigsirflrts/.env. Need to verify if this is adequate or if OAuth is required.

---

#### Lead 2: Frappe React SDK Exists
**Finding**: Frappe provides an official React SDK with built-in authentication, data hooks (useFrappeGetDocList), and SocketIO real-time updates[1].

**Investigation Needed**:
- Evaluate Frappe React SDK vs custom Refine data provider
- Check if Frappe React SDK can integrate with Refine framework
- Assess if SDK adds unnecessary complexity for simple viewer

**Rationale**: This could be an alternative to Approach 2 (Simple REST + Adapter). Need to validate compatibility with existing Refine architecture.

---

#### Lead 3: Permission Errors Common After Authentication
**Finding**: PermissionError exceptions are common even after successful authentication. Authenticated user must have appropriate roles and permissions in Frappe for all DocTypes and operations[2].

**Investigation Needed**:
- Verify permissions for user associated with API key/secret in ops.10nz.tools
- Document which DocTypes are accessible with current credentials
- Plan for graceful handling of permission errors in UI

**Rationale**: Critical for MVP - need to know which DocTypes we can actually access before building viewer.

---

#### Lead 4: No Auto-Generated API Documentation
**Finding**: Frappe lacks automatically generated API documentation (no OpenAPI/Swagger). Manual exploration of available APIs is required[4].

**Investigation Needed**:
- Explore ops.10nz.tools API manually (GET /api/resource/DocType, etc.)
- Export API endpoints to Postman for reference
- Document available endpoints and response formats

**Rationale**: Can't rely on official API docs - must test endpoints directly in prototype phase.

---

#### Lead 5: Development Setup (Two Servers)
**Finding**: Typically run Frappe backend server and separate React dev server during development[3].

**Investigation Needed**:
- Confirm CORS configuration for ops.10nz.tools when called from localhost:5173 (Vite dev server)
- Test if Cloudflare Workers proxy is needed for CORS
- Validate API calls work from browser (not blocked by CORS)

**Rationale**: CORS could be a blocking issue. Need to validate in prototype before full implementation.

---

#### Lead 6: Real-time Updates with SocketIO
**Finding**: Frappe React SDK supports real-time updates via SocketIO for collaborative features[1].

**Investigation Needed**:
- Determine if real-time updates are required for DocType viewer (probably not for MVP)
- If needed, research SocketIO integration with Refine

**Rationale**: Likely out of scope for MVP (read-only viewer), but good to know for future enhancements.

---

## Query 2: Frappe Cloud API Token Authentication Pitfalls (2024-2025)

**Query**: "What are common pitfalls and gotchas when working with Frappe Cloud API (frappe.cloud) token authentication in 2024-2025? Include information about rate limiting, session management, and security best practices."

### Leads Found

#### Lead 7: JWT Validation Issues
**Finding**: Common pitfall is missing JWT validation (signature, issuer, audience, expiration, algorithm). Attackers can use forged/expired tokens if validation is absent[1].

**Investigation Needed**:
- Verify if Frappe Cloud API uses JWT tokens or simple API key/secret
- Understand token format returned by API
- Plan validation logic if tokens are used

**Rationale**: Security best practice - need to validate any tokens received from API.

---

#### Lead 8: Weak API Key Management
**Finding**: Poor practices include long-lived API keys, no rotation schedule, overbroad permissions. Prefer short-lived scoped tokens over raw API keys[1].

**Investigation Needed**:
- Check if current API key/secret from bigsirflrts/.env are long-lived or rotatable
- Document key rotation policy (if any)
- Consider requesting read-only scoped credentials if available

**Rationale**: Current credentials may have broader permissions than needed for read-only viewer.

---

#### Lead 9: Token Storage Security
**Finding**: Environment variables should use VITE_ prefix for client-side access, but this exposes credentials in browser. Consider backend proxy for sensitive credentials[7].

**Investigation Needed**:
- Evaluate if exposing API key/secret in client-side code is acceptable risk
- Research Cloudflare Workers proxy approach for credential protection
- Determine if Frappe Cloud IP allowlisting is available

**Rationale**: Storing API credentials in VITE_ env vars exposes them in bundled client code. May need Workers proxy (Approach 4 from Step 2).

---

#### Lead 10: Rate Limiting Considerations
**Finding**: Frappe Cloud may have rate limits. Need to implement retry logic and respect limits[1].

**Investigation Needed**:
- Test ops.10nz.tools for rate limit responses (HTTP 429)
- Document rate limit thresholds if discoverable
- Plan exponential backoff retry strategy

**Rationale**: Don't want viewer to trigger rate limits. Need graceful degradation.

---

## Query 3: Refine Custom Data Provider Best Practices (2024-2025)

**Query**: "What are best practices for creating custom data providers in Refine framework v4+ in 2024-2025? Include common pitfalls when integrating non-standard REST APIs and response transformation patterns."

### Leads Found

#### Lead 11: Custom Method for Non-Standard Endpoints
**Finding**: Refine's `custom` method handles non-standard endpoints with custom parameters, URL paths, HTTP methods, and configurations[1][3].

**Investigation Needed**:
- Identify which ERPNext endpoints are non-standard (e.g., DocType schema queries)
- Plan usage of `custom` method for these endpoints
- Design custom method API for DocType-specific operations

**Rationale**: ERPNext's DocType schema endpoint may not map to standard CRUD operations.

---

#### Lead 12: Pagination Parameter Mapping
**Finding**: Common mistake is mismatching Refine's pagination.pageSize/current with API's expected format (limit/offset or other conventions)[3].

**Investigation Needed**:
- Test ERPNext pagination parameters (likely limit_start, limit_page_length)
- Map Refine pagination to ERPNext format
- Document pagination transformation logic

**Rationale**: Critical for getList implementation - must map pagination correctly.

---

#### Lead 13: Filter and Sorting Syntax Conversion
**Finding**: Refine passes filters as structured CrudFilters objects. Non-standard APIs use different syntax (query strings, nested objects, custom operators)[3].

**Investigation Needed**:
- Research ERPNext filter syntax (likely uses Frappe query format)
- Design transformation from Refine CrudFilters to ERPNext filters
- Test various filter operators (equals, contains, greater than, etc.)

**Rationale**: Essential for usable viewer - users need filtering capability.

---

#### Lead 14: Total Count for Pagination
**Finding**: getList must return accurate total count for pagination. Some APIs don't provide this by default[3].

**Investigation Needed**:
- Verify ERPNext API returns total_count in list responses
- Plan fallback if total not available (client-side pagination only)

**Rationale**: Without total count, pagination UI won't work correctly.

---

#### Lead 15: Error Handling Consistency
**Finding**: Custom data providers often lack robust error handling. Wrap API calls in try-catch and return consistent error objects[3].

**Investigation Needed**:
- Document ERPNext error response formats
- Design standardized error transformation
- Plan user-friendly error messages for UI

**Rationale**: Good UX requires clear error messages, not raw API errors.

---

#### Lead 16: TypeScript Type Safety
**Finding**: Failing to maintain proper TypeScript types throughout data provider can lead to runtime errors. Ensure alignment with Refine's DataProvider interface[3].

**Investigation Needed**:
- Create TypeScript interfaces for ERPNext responses
- Type all data provider methods properly
- Generate types from ERPNext DocType schemas if possible

**Rationale**: Type safety prevents runtime errors and improves DX.

---

## Local Documentation Search

**Query**: "Frappe Framework REST API authentication DocType querying best practices"

**Results**: No Frappe-specific documentation found in local docs (returned Snowflake/Vault results).

**Conclusion**: Frappe documentation not indexed locally. Will rely on:
1. Official Frappe docs validation in Step 4
2. Direct API testing in Step 5 (prototype)
3. Perplexity leads for direction

---

## Summary of Research Leads by Category

### Authentication & Security (6 leads)
1. OAuth 2.0 vs token authentication decision
2. Permission configuration for API user
3. JWT validation requirements
4. API key rotation and management
5. Credential storage security (client vs proxy)
6. Rate limiting and retry strategies

### API Integration (5 leads)
7. Frappe React SDK as alternative approach
8. No auto-generated API documentation (manual exploration needed)
9. CORS configuration for development
10. Real-time updates capability (future enhancement)
11. Custom Refine method for non-standard endpoints

### Data Provider Implementation (5 leads)
12. Pagination parameter mapping
13. Filter and sorting syntax conversion
14. Total count handling for pagination
15. Error handling standardization
16. TypeScript type safety

---

## Next Steps for Validation (Step 4)

**High Priority Validation**:
1. Test API authentication with existing credentials (validate token auth works)
2. Query /api/resource/DocType endpoint (confirm API structure)
3. Check permissions (which DocTypes are accessible)
4. Test CORS from localhost:5173 (confirm no CORS blocking)
5. Verify pagination/filter syntax (ERPNext-specific format)

**Medium Priority Validation**:
6. Research Frappe React SDK vs custom provider trade-offs
7. Document error response formats
8. Check rate limiting behavior
9. Evaluate credential exposure risk

**Low Priority Validation** (can defer to later phases):
10. Real-time updates capability
11. OAuth 2.0 migration path
12. Advanced filtering operators

---

## BetterST Query Planning

**Thought 1**: Structured queries to focus on ERPNext/Frappe REST API integration with React, authentication methods, and version-specific considerations for Frappe v14+.

**Thought 2**: Identified 16 key research leads across authentication, API integration, and data provider implementation categories.

**Thought 3**: Perplexity provided valuable direction on OAuth vs token auth decision, permission errors, lack of auto-docs, and Frappe React SDK existence.

**Thought 4**: Local docs search unsuccessful (no Frappe docs indexed), so will validate leads using official Frappe documentation and direct API testing in Steps 4-5.

---

**Citations from Perplexity Responses**:

### ERPNext/Frappe Integration Query
[1] https://www.youtube.com/watch?v=uCVebuOjnDE
[2] https://discuss.frappe.io/t/token-authentication-not-works-in-rest-api-erpnext/137602
[3] https://www.youtube.com/watch?v=3xpfw4qrzM0
[4] https://github.com/frappe/frappe/issues/9805

### Frappe Cloud Authentication Query
[1] https://www.wiz.io/academy/broken-api-authentication
[2] https://securityonline.info/security-flaws-in-frappe-framework-expose-self-hosted-erpnext-users-to-takeovers-xss-and-sql-injection/
[7] https://approov.io/blog/how-poor-api-security-led-to-major-breaches-in-2024

### Refine Data Provider Query
[1] https://refine.dev/docs/data/data-provider/
[3] https://refine.dev/docs/3.xx.xx/tutorial/understanding-dataprovider/create-dataprovider/
