# Test Case: get_instance_overrides

## Command
`get_instance_overrides`

## Description
Gets override information from a component instance. Can target a specific instance by ID or use the currently selected instance if no ID provided.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `instanceNodeId` | string | No | - | ID of instance node (colon format). If omitted, uses first instance in selection |

## Expected Response

```json
{
  "success": true,
  "message": "Got component information from \"Button\"",
  "sourceInstanceId": "123:456",
  "mainComponentId": "789:012",
  "overridesCount": 3
}
```

### Error Response
```json
{
  "success": false,
  "message": "Provided node is not a component instance"
}
```

---

## Test Scenarios

### Test 1: Get Overrides from Specific Instance by ID

**Purpose:** Verify getting overrides from a specific instance.

**Prerequisites:**
1. Create a component
2. Create an instance of that component
3. Modify some properties on the instance (text, colors, etc.)
4. Note the instance ID

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {
    instanceNodeId: "INSTANCE_NODE_ID"
  }
}
```

**Expected Result:**
- `success: true`
- `sourceInstanceId` matches input
- `mainComponentId` points to source component
- `overridesCount` reflects number of overrides

**Verification Steps:**
1. Check `success` is `true`
2. Verify `sourceInstanceId` matches
3. Confirm `overridesCount` is accurate

---

### Test 2: Get Overrides from Selected Instance (No ID)

**Purpose:** Verify using current selection.

**Prerequisites:**
- Instance selected in Figma

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {}
}
```

**Expected Result:**
- Uses first instance in selection
- Returns instance and component info

---

### Test 3: Instance with No Overrides

**Purpose:** Verify handling of unmodified instance.

**Prerequisites:**
- Fresh instance with no modifications

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {
    instanceNodeId: "UNMODIFIED_INSTANCE_ID"
  }
}
```

**Expected Result:**
- `success: true`
- `overridesCount: 0`

---

### Test 4: Instance with Multiple Overrides

**Purpose:** Verify counting multiple overrides.

**Prerequisites:**
- Instance with text, color, and visibility changes

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {
    instanceNodeId: "MODIFIED_INSTANCE_ID"
  }
}
```

**Expected Result:**
- `overridesCount` reflects all override types
- All override categories counted

---

### Test 5: Non-Instance Node (Error Case)

**Purpose:** Verify error for non-instance nodes.

**Prerequisites:**
- A regular frame (not an instance)

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {
    instanceNodeId: "REGULAR_FRAME_ID"
  }
}
```

**Expected Result:**
- `success: false`
- `message: "Provided node is not a component instance"`

---

### Test 6: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {
    instanceNodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Instance node not found with ID: 999:999"

---

### Test 7: No Selection When ID Omitted (Error Case)

**Purpose:** Verify error when no selection and no ID.

**Prerequisites:**
- Clear selection in Figma

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {}
}
```

**Expected Result:**
- `success: false`
- `message: "No nodes selected"`

---

### Test 8: Selection Without Instances (Error Case)

**Purpose:** Verify error when selection has no instances.

**Prerequisites:**
- Select only non-instance nodes (frames, rectangles)

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {}
}
```

**Expected Result:**
- `success: false`
- `message: "No instances found in selection"`

---

### Test 9: Multiple Instances Selected

**Purpose:** Verify first instance is used when multiple selected.

**Prerequisites:**
- Select multiple instances

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {}
}
```

**Expected Result:**
- Uses first instance in selection
- Returns info for that instance only

---

### Test 10: Nested Instance

**Purpose:** Verify handling of nested instances.

**Prerequisites:**
- Instance inside another instance

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {
    instanceNodeId: "NESTED_INSTANCE_ID"
  }
}
```

**Expected Result:**
- Returns nested instance info
- `mainComponentId` points to nested component

---

### Test 11: Instance from Library Component

**Purpose:** Verify handling of library components.

**Prerequisites:**
- Instance of a component from team library

**Command:**
```javascript
{
  command: "get_instance_overrides",
  params: {
    instanceNodeId: "LIBRARY_INSTANCE_ID"
  }
}
```

**Expected Result:**
- `success: true`
- `mainComponentId` references library component

---

## Sample Test Script

```javascript
/**
 * Test: get_instance_overrides command
 * Prerequisites: Figma plugin connected, channel ID obtained,
 *                document contains component instances
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let componentId = null;
let instanceId = null;
let phase = 'create_component';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create test component
  setTimeout(() => {
    console.log('Creating component for testing...');
    // First create a frame that we'll convert to component
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: {
          x: 0, y: 0, width: 100, height: 50,
          name: "Test Button Component"
        },
        commandId: "create_component_base"
      }
    }));
  }, 2000);
});

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

    if (result) {
      if (phase === 'create_component') {
        componentId = result.id;
        console.log('Created base frame:', componentId);
        console.log('\nNote: To fully test get_instance_overrides:');
        console.log('1. Convert this frame to a component in Figma');
        console.log('2. Create an instance of the component');
        console.log('3. Modify some properties on the instance');
        console.log('4. Use the instance ID in the test below');

        phase = 'test_error';

        // Test error case: non-existent node
        setTimeout(() => {
          console.log('\n=== Testing error case (invalid ID) ===');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "get_instance_overrides",
              params: { instanceNodeId: "999:999" },
              commandId: "error_test"
            }
          }));
        }, 500);

      } else if (phase === 'test_error') {
        console.log('Error test result:', result);

        phase = 'test_no_selection';

        // Test: no ID provided (uses selection)
        setTimeout(() => {
          console.log('\n=== Testing no ID (uses selection) ===');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "get_instance_overrides",
              params: {},
              commandId: "selection_test"
            }
          }));
        }, 500);

      } else if (phase === 'test_no_selection') {
        console.log('Selection test result:');
        console.log('  Success:', result.success);
        console.log('  Message:', result.message);

        if (result.success) {
          console.log('  Source Instance ID:', result.sourceInstanceId);
          console.log('  Main Component ID:', result.mainComponentId);
          console.log('  Overrides Count:', result.overridesCount);
        }

        console.log('\n=== Test complete ===');
        console.log('For full testing, provide a valid instance ID');
        ws.close();
      }
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
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

- [ ] Get overrides from specific instance by ID works
- [ ] Get overrides from selected instance works
- [ ] Instance with no overrides returns count 0
- [ ] Instance with multiple overrides counted correctly
- [ ] Non-instance node returns error
- [ ] Non-existent node returns error
- [ ] No selection returns error when ID omitted
- [ ] Selection without instances returns error
- [ ] Multiple instances selected uses first one
- [ ] Nested instances handled correctly
- [ ] Library component instances handled correctly
- [ ] Response contains `success`, `message`, `sourceInstanceId`, `mainComponentId`, `overridesCount`
