# Component 1: ERPNext API Client - PLAN Phase

## Component Purpose
Create a TypeScript class that handles authenticated HTTP requests to the ERPNext API with proper error handling and transformation.

## Implementation Structure

### Class Design
```typescript
export class ERPNextClient {
  private apiUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(config: ERPNextClientConfig)

  // Core methods
  getAuthHeader(): string
  get<T>(path: string, params?: Record<string, any>): Promise<T>
  post<T>(path: string, data?: Record<string, any>): Promise<T>

  // Private helpers
  private buildUrl(path: string, params?: Record<string, any>): string
  private handleResponse<T>(response: Response): Promise<T>
  private handleError(error: any): never
}
```

### Authentication Format
Based on Step 5 prototype validation:
- Authorization header: `token {API_KEY}:{API_SECRET}`
- Format confirmed working with curl tests

### Error Handling Strategy
1. Network errors → Throw with message "Network error"
2. HTTP errors (4xx, 5xx) → Parse Frappe error response
3. Frappe error format (from Step 5):
   ```json
   {
     "exception": "frappe.exceptions.AuthenticationError",
     "exc_type": "AuthenticationError",
     "exc": "..."
   }
   ```
4. Transform to user-friendly error messages

### Test Cases
1. ✅ getAuthHeader() returns correct format
2. ✅ get() makes authenticated GET request
3. ✅ post() makes authenticated POST request
4. ✅ Error handling for 401 Unauthorized
5. ✅ Error handling for 403 Forbidden
6. ✅ Error handling for 404 Not Found
7. ✅ Error handling for 500 Server Error
8. ✅ Network timeout handling

### Edge Cases
- Missing environment variables → throw on construction
- Invalid credentials → surface 401 error clearly
- CORS errors → provide helpful message about OAuth settings
- Network timeout → timeout after 10 seconds

### Dependencies
- None (uses native fetch API)
- TypeScript interfaces from types.ts (will create next)

## Implementation Plan
1. Create file: `src/utils/erpnextClient.ts`
2. Define ERPNextClientConfig interface
3. Implement constructor with validation
4. Implement getAuthHeader()
5. Implement buildUrl() helper
6. Implement get() method
7. Implement post() method
8. Implement handleResponse() helper
9. Implement handleError() helper
10. Export factory function createERPNextClient()

## Validation Checklist
- [ ] TypeScript compiles without errors
- [ ] All methods have proper type signatures
- [ ] Error handling covers all cases
- [ ] Authentication header format matches Step 5
- [ ] Code follows project conventions
