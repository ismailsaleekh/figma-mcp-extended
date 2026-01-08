# Test Case: set_instance_overrides

## Command
`set_instance_overrides`

## Description
Applies overrides from a source component instance to one or more target instances. Swaps the target instances to use the same main component and copies overridden properties (text, fills, strokes, opacity, visibility, corner radius, stroke weight).

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sourceInstanceId` | string | **Yes** | - | ID of source instance to copy overrides from (colon format) |
| `targetNodeIds` | string[] | **Yes** | - | Array of target instance IDs to apply overrides to |

### Supported Override Fields
- `characters` - Text content
- `fills` - Fill colors/gradients
- `strokes` - Stroke colors
- `opacity` - Opacity value
- `visible` - Visibility state
- `cornerRadius` - Corner radius
- `strokeWeight` - Stroke weight

## Expected Response

```json
{
  "success": true,
  "message": "Applied 5 overrides to 3 instances",
  "totalCount": 5,
  "results": [
    {
      "success": true,
      "instanceId": "123:456",
      "instanceName": "Button Copy",
      "appliedCount": 2
    },
    {
      "success": true,
      "instanceId": "123:457",
      "instanceName": "Button Copy 2",
      "appliedCount": 3
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "No instances provided"
}
```

---

## Test Scenarios

### Test 1: Apply Overrides to Single Target

**Purpose:** Verify basic override application.

**Prerequisites:**
1. Create a component with multiple elements
2. Create two instances (source and target)
3. Modify text/colors on source instance
4. Note both instance IDs

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "SOURCE_INSTANCE_ID",
    targetNodeIds: ["TARGET_INSTANCE_ID"]
  }
}
```

**Expected Result:**
- `success: true`
- Target instance now matches source overrides
- `results` array has one entry with success

**Verification Steps:**
1. Check `success` is `true`
2. Verify target instance visually matches source
3. Check `appliedCount` reflects changes

---

### Test 2: Apply Overrides to Multiple Targets

**Purpose:** Verify batch override application.

**Prerequisites:**
- One source instance with overrides
- Three target instances

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "SOURCE_ID",
    targetNodeIds: ["TARGET_1_ID", "TARGET_2_ID", "TARGET_3_ID"]
  }
}
```

**Expected Result:**
- All targets receive overrides
- `results` array has three entries
- `totalCount` sums all applied overrides

---

### Test 3: Apply Text Overrides

**Purpose:** Verify text content copying.

**Prerequisites:**
- Source instance with modified text content

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "TEXT_OVERRIDE_SOURCE_ID",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- Target instance text matches source
- `characters` field applied

---

### Test 4: Apply Fill Color Overrides

**Purpose:** Verify fill color copying.

**Prerequisites:**
- Source instance with modified fill colors

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "FILL_OVERRIDE_SOURCE_ID",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- Target fill colors match source
- `fills` field applied

---

### Test 5: Apply Stroke Overrides

**Purpose:** Verify stroke property copying.

**Prerequisites:**
- Source instance with modified strokes

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "STROKE_OVERRIDE_SOURCE_ID",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- Target strokes match source
- `strokes` and `strokeWeight` fields applied

---

### Test 6: Apply Visibility Overrides

**Purpose:** Verify visibility state copying.

**Prerequisites:**
- Source instance with hidden elements

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "VISIBILITY_OVERRIDE_SOURCE_ID",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- Target element visibility matches source
- `visible` field applied

---

### Test 7: Apply Multiple Override Types

**Purpose:** Verify combining all override types.

**Prerequisites:**
- Source instance with text, colors, and visibility changes

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "FULL_OVERRIDE_SOURCE_ID",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- All override types applied
- `appliedCount` reflects total changes

---

### Test 8: Source Instance with No Overrides

**Purpose:** Verify handling when source has no overrides.

**Prerequisites:**
- Unmodified source instance

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "UNMODIFIED_INSTANCE_ID",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- `success: false` or `success: true` with 0 changes
- `message: "No overrides applied to any instance"`

---

### Test 9: Partial Success (Some Targets Invalid)

**Purpose:** Verify partial success handling.

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "SOURCE_ID",
    targetNodeIds: ["VALID_TARGET_ID", "999:999", "ANOTHER_VALID_ID"]
  }
}
```

**Expected Result:**
- Valid targets receive overrides
- Invalid targets skipped (not in results or marked failed)
- Overall `success: true` if any succeeded

---

### Test 10: Missing sourceInstanceId (Error Case)

**Purpose:** Verify required parameter validation.

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- Error: "Missing required parameters: sourceInstanceId, targetNodeIds"

---

### Test 11: Missing targetNodeIds (Error Case)

**Purpose:** Verify required parameter validation.

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "SOURCE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing required parameters: sourceInstanceId, targetNodeIds"

---

### Test 12: Empty targetNodeIds Array (Error Case)

**Purpose:** Verify handling of empty array.

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "SOURCE_ID",
    targetNodeIds: []
  }
}
```

**Expected Result:**
- `success: false`
- `message: "No instances provided"`

---

### Test 13: Non-Existent Source Instance (Error Case)

**Purpose:** Verify error for invalid source ID.

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "999:999",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- `success: false`
- `message: "Source instance not found"`

---

### Test 14: Source Not an Instance (Error Case)

**Purpose:** Verify error when source is not an instance.

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "REGULAR_FRAME_ID",
    targetNodeIds: ["TARGET_ID"]
  }
}
```

**Expected Result:**
- `success: false`
- `message: "Source node is not a component instance"`

---

### Test 15: All Targets Not Instances (Error Case)

**Purpose:** Verify error when no valid target instances.

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "SOURCE_ID",
    targetNodeIds: ["FRAME_ID", "RECTANGLE_ID"]
  }
}
```

**Expected Result:**
- `success: false`
- `message: "No valid instances provided"`

---

### Test 16: Different Component Sources

**Purpose:** Verify behavior when swapping component types.

**Prerequisites:**
- Source instance from Component A
- Target instance from Component B

**Command:**
```javascript
{
  command: "set_instance_overrides",
  params: {
    sourceInstanceId: "COMPONENT_A_INSTANCE_ID",
    targetNodeIds: ["COMPONENT_B_INSTANCE_ID"]
  }
}
```

**Expected Result:**
- Target swaps to Component A
- Overrides applied after swap

---

## Sample Test Script

```javascript
/**
 * Test: set_instance_overrides command
 * Prerequisites: Figma plugin connected, channel ID obtained,
 *                document contains component instances with overrides
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

// Replace with actual instance IDs from your Figma document
const SOURCE_INSTANCE_ID = "REPLACE_WITH_SOURCE_INSTANCE_ID";
const TARGET_INSTANCE_IDS = ["REPLACE_WITH_TARGET_1", "REPLACE_WITH_TARGET_2"];

const ws = new WebSocket(WS_URL);

let phase = 'test';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then run tests
  setTimeout(() => {
    runTests();
  }, 2000);
});

function runTests() {
  console.log('\n=== Testing set_instance_overrides ===');

  // Test 1: Error case - missing parameters
  console.log('\nTest 1: Missing sourceInstanceId');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_instance_overrides",
      params: {
        targetNodeIds: TARGET_INSTANCE_IDS
      },
      commandId: "test_missing_source"
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  // Skip system messages and echo
  if (parsed.type === 'system') {
    if (parsed.message && parsed.message.includes('Joined')) {
      console.log('Channel joined successfully');
    }
    return;
  }

  if (parsed.sender === 'You') return;

  // Handle result
  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (phase === 'test') {
      if (parsed.message.error) {
        console.log('Expected error:', parsed.message.error);
      }

      phase = 'test_empty_array';

      // Test 2: Empty array
      setTimeout(() => {
        console.log('\nTest 2: Empty targetNodeIds array');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "set_instance_overrides",
            params: {
              sourceInstanceId: SOURCE_INSTANCE_ID,
              targetNodeIds: []
            },
            commandId: "test_empty_array"
          }
        }));
      }, 500);

    } else if (phase === 'test_empty_array') {
      console.log('Empty array result:');
      console.log('  Success:', result?.success);
      console.log('  Message:', result?.message);

      phase = 'test_invalid_source';

      // Test 3: Invalid source
      setTimeout(() => {
        console.log('\nTest 3: Invalid source instance ID');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "set_instance_overrides",
            params: {
              sourceInstanceId: "999:999",
              targetNodeIds: TARGET_INSTANCE_IDS
            },
            commandId: "test_invalid_source"
          }
        }));
      }, 500);

    } else if (phase === 'test_invalid_source') {
      console.log('Invalid source result:');
      console.log('  Success:', result?.success);
      console.log('  Message:', result?.message);

      phase = 'test_actual';

      // Test 4: Actual override application (if IDs are valid)
      if (SOURCE_INSTANCE_ID !== "REPLACE_WITH_SOURCE_INSTANCE_ID") {
        setTimeout(() => {
          console.log('\nTest 4: Apply overrides');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "set_instance_overrides",
              params: {
                sourceInstanceId: SOURCE_INSTANCE_ID,
                targetNodeIds: TARGET_INSTANCE_IDS
              },
              commandId: "test_actual"
            }
          }));
        }, 500);
      } else {
        console.log('\n=== Skipping actual test (replace IDs first) ===');
        ws.close();
      }

    } else if (phase === 'test_actual') {
      console.log('\n=== Override Application Results ===');
      console.log('Success:', result?.success);
      console.log('Message:', result?.message);
      console.log('Total Count:', result?.totalCount);

      if (result?.results) {
        console.log('\nIndividual results:');
        result.results.forEach((r, i) => {
          if (r.success) {
            console.log(`  ${i + 1}. ✓ ${r.instanceName} (${r.instanceId}): ${r.appliedCount} overrides`);
          } else {
            console.log(`  ${i + 1}. ✗ ${r.instanceName} (${r.instanceId}): ${r.message}`);
          }
        });
      }

      console.log('\n=== All tests complete ===');
      ws.close();
    }
  }
});

ws.on('close', () => {
  console.log('\nConnection closed');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

// Timeout safety
setTimeout(() => {
  ws.close();
}, 60000);
```

---

## Validation Checklist

- [ ] Apply overrides to single target works
- [ ] Apply overrides to multiple targets works
- [ ] Text content (`characters`) copied correctly
- [ ] Fill colors copied correctly
- [ ] Stroke properties copied correctly
- [ ] Visibility state copied correctly
- [ ] Corner radius copied correctly
- [ ] Opacity copied correctly
- [ ] Multiple override types combined works
- [ ] Source with no overrides handled correctly
- [ ] Partial success (some invalid targets) handled
- [ ] Missing sourceInstanceId returns error
- [ ] Missing targetNodeIds returns error
- [ ] Empty targetNodeIds array returns error
- [ ] Non-existent source returns error
- [ ] Source not an instance returns error
- [ ] All targets not instances returns error
- [ ] Component swap happens correctly
- [ ] Response contains `success`, `message`, `totalCount`, `results`
- [ ] Individual results have `instanceId`, `instanceName`, `appliedCount`
