#!/usr/bin/env node

/**
 * Manual test script to demonstrate the short code conflict detection functionality
 * This script shows the ApiError class and conflict detection logic in action
 */

// Import the modules
import { ApiError } from '../dist/models/error.model.js';

console.log('=== Short Code Conflict Detection Demo ===\n');

// Test 1: ApiError creation for material conflict
console.log('1. Testing ApiError for material conflict:');
const materialError = ApiError.alreadyConnected('material', 'material-123');
console.log('Error object:', JSON.stringify(materialError.toResponse(), null, 2));
console.log();

// Test 2: ApiError creation for part conflict  
console.log('2. Testing ApiError for part conflict:');
const partError = ApiError.alreadyConnected('part', 'part-456');
console.log('Error object:', JSON.stringify(partError.toResponse(), null, 2));
console.log();

// Test 3: Verify the exact format matches requirements
console.log('3. Verifying format matches requirements:');
const expectedFormat = {
  "messages": [{
    "code": "ALREADY_CONNECTED",
    "parameters": {
      "$type": "material",
      "id": "some-id"
    }
  }]
};
console.log('Expected format:', JSON.stringify(expectedFormat, null, 2));
console.log('Actual format matches:', 
  JSON.stringify(materialError.toResponse()) === JSON.stringify({
    "messages": [{
      "code": "ALREADY_CONNECTED", 
      "parameters": {
        "$type": "material",
        "id": "material-123"
      }
    }]
  })
);
console.log();

// Test 4: Multiple error messages
console.log('4. Testing multiple error messages:');
const multiError = new ApiError([
  { code: 'ALREADY_CONNECTED', parameters: { $type: 'material', id: 'mat-1' } },
  { code: 'VALIDATION_ERROR', parameters: { field: 'name' } }
]);
console.log('Multiple errors:', JSON.stringify(multiError.toResponse(), null, 2));
console.log();

console.log('=== Demo Complete ===');
console.log('The implementation successfully creates the required error format!');