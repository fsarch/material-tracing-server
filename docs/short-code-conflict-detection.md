# Short Code Conflict Detection Implementation

## Overview
This implementation adds conflict detection when connecting short codes to materials or parts, preventing a short code from being connected to multiple resources simultaneously.

## API Changes

### Error Response Format
When a conflict is detected, the API returns a `409 Conflict` status with the following response structure:

```json
{
  "messages": [{
    "code": "ALREADY_CONNECTED",
    "parameters": {
      "$type": "material" | "part",
      "id": "<id of already connected resource>"
    }
  }]
}
```

### Affected Endpoints

#### PUT /v1/materials/{materialId}/short-codes/{shortCode}
- **New Behavior**: Before connecting a short code to a material, checks if the short code is already connected to another resource
- **Conflict Response**: Returns 409 with error structure if short code is already connected to a different material or part

#### PUT /v1/parts/{partId}/short-codes/{shortCode}  
- **New Behavior**: Before connecting a short code to a part, checks if the short code is already connected to another resource
- **Conflict Response**: Returns 409 with error structure if short code is already connected to a different material or part

## Implementation Details

### Global Error Handling
- **`ApiError` class**: Reusable error response system located in `src/models/error.model.ts`
- **Extensible design**: Supports multiple error messages and different error codes
- **Type-safe**: Uses TypeScript interfaces for consistent error structure

### Enhanced Services
- **`ShortCodeService.CheckShortCodeConnection()`**: Cross-checks both material and part connections
- **Module updates**: Enhanced dependency injection to access cross-repository data
- **Minimal changes**: Existing functionality remains unchanged

### Controllers
Both `MaterialShortCodesController` and `PartShortCodesController` now:
1. Check for existing material/part mappings (existing behavior)
2. Validate short code exists (existing behavior)  
3. **NEW**: Check for cross-resource conflicts
4. Return structured error if conflict detected
5. Proceed with mapping if no conflicts (existing behavior)

## Testing

### Unit Tests
- Comprehensive test coverage for both controllers
- Tests verify proper error structure and HTTP status codes
- Tests cover all scenarios: success, not found, conflicts

### Manual Verification
Run the demo script to verify error format:
```bash
npm run build
node demo/test-conflict-detection.js
```

## Backward Compatibility
- All existing functionality remains unchanged
- No breaking changes to existing API endpoints
- Additional validation only adds new conflict detection, doesn't remove existing checks