# Test Case: set_default_connector

## Command
`set_default_connector`

## Description
Sets or retrieves the default FigJam connector that will be used as a template for creating new connections. This is specific to FigJam files.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `connectorId` | string | No | - | ID of connector node to set as default (colon format) |

### Behavior
- **With connectorId**: Sets the specified connector as default
- **Without connectorId**:
  1. Returns existing default if set
  2. Auto-selects first connector on page if no default
  3. Throws error if no connectors exist

## Expected Response

### Setting Default
```json
{
  "success": true,
  "message": "Default connector set to: 123:456",
  "connectorId": "123:456"
}
```

### Getting Existing Default
```json
{
  "success": true,
  "message": "Default connector is already set to: 123:456",
  "connectorId": "123:456",
  "exists": true
}
```

### Auto-Selected Default
```json
{
  "success": true,
  "message": "Automatically found and set default connector to: 123:456",
  "connectorId": "123:456",
  "autoSelected": true
}
```

---

## Test Scenarios

### Test 1: Set Default Connector

**Purpose:** Verify setting a specific connector as default.

**Prerequisites:**
1. Open a FigJam file
2. Create a connector line
3. Note the connector ID

**Command:**
```javascript
{
  command: "set_default_connector",
  params: {
    connectorId: "CONNECTOR_NODE_ID"
  }
}
```

**Expected Result:**
- `success: true`
- Connector stored as default
- `connectorId` matches input

**Verification Steps:**
1. Check `success` is `true`
2. Verify `connectorId` in response
3. Subsequent calls should return this connector

---

### Test 2: Get Existing Default Connector

**Purpose:** Verify retrieving already-set default.

**Prerequisites:**
- Default connector previously set

**Command:**
```javascript
{
  command: "set_default_connector",
  params: {}
}
```

**Expected Result:**
- `success: true`
- `exists: true`
- Returns previously set connector ID

---

### Test 3: Auto-Select Connector (No Default Set)

**Purpose:** Verify automatic connector discovery.

**Prerequisites:**
- Clear previous default (or fresh session)
- At least one connector on current page

**Command:**
```javascript
{
  command: "set_default_connector",
  params: {}
}
```

**Expected Result:**
- `success: true`
- `autoSelected: true`
- First found connector set as default

---

### Test 4: No Connectors on Page (Error Case)

**Purpose:** Verify error when no connectors exist.

**Prerequisites:**
- FigJam page with no connectors
- No default previously set

**Command:**
```javascript
{
  command: "set_default_connector",
  params: {}
}
```

**Expected Result:**
- Error: "No connector found in the current page. Please create a connector in FigJam first."

---

### Test 5: Non-Existent Connector ID (Error Case)

**Purpose:** Verify error for invalid connector ID.

**Command:**
```javascript
{
  command: "set_default_connector",
  params: {
    connectorId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Connector node not found with ID: 999:999"

---

### Test 6: Non-Connector Node (Error Case)

**Purpose:** Verify error when ID is not a connector.

**Prerequisites:**
- A frame or shape node ID (not connector)

**Command:**
```javascript
{
  command: "set_default_connector",
  params: {
    connectorId: "FRAME_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Node is not a connector: FRAME_NODE_ID"

---

### Test 7: Update Default Connector

**Purpose:** Verify changing the default connector.

**Prerequisites:**
- Two different connectors on page
- Default already set to first

**Commands (sequential):**
```javascript
// Set first connector
{ command: "set_default_connector", params: { connectorId: "CONNECTOR_1_ID" } }

// Change to second connector
{ command: "set_default_connector", params: { connectorId: "CONNECTOR_2_ID" } }
```

**Expected Result:**
- Second command succeeds
- Default updated to second connector

---

### Test 8: Persistence Across Calls

**Purpose:** Verify default persists in client storage.

**Commands (sequential):**
```javascript
// Set connector
{ command: "set_default_connector", params: { connectorId: "CONNECTOR_ID" } }

// Retrieve without ID
{ command: "set_default_connector", params: {} }
```

**Expected Result:**
- Second call returns same connector
- `exists: true` in response

---

### Test 9: Deleted Connector Recovery

**Purpose:** Verify handling when stored connector is deleted.

**Prerequisites:**
- Set a default connector
- Delete that connector in Figma
- Try to retrieve

**Command:**
```javascript
{
  command: "set_default_connector",
  params: {}
}
```

**Expected Result:**
- Falls back to auto-select
- Finds another connector or errors if none

---

### Test 10: FigJam vs Figma Design File

**Purpose:** Verify behavior in different file types.

**Note:** Connectors are FigJam-specific. In regular Figma design files, connectors don't exist.

**Expected Result:**
- In Figma Design: No connectors found error
- In FigJam: Works normally

---

## Sample Test Script

```javascript
/**
 * Test: set_default_connector command
 * Prerequisites: Figma plugin connected, FigJam file open with connectors
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

// Replace with actual connector ID from FigJam
const CONNECTOR_ID = "REPLACE_WITH_CONNECTOR_ID";

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
  console.log('\n=== Testing set_default_connector ===');

  // Test 1: Error case - invalid connector ID
  console.log('\nTest 1: Invalid connector ID');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_default_connector",
      params: { connectorId: "999:999" },
      commandId: "test_invalid"
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

      phase = 'test_auto';

      // Test 2: Auto-select (no ID)
      setTimeout(() => {
        console.log('\nTest 2: Auto-select connector');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "set_default_connector",
            params: {},
            commandId: "test_auto"
          }
        }));
      }, 500);

    } else if (phase === 'test_auto') {
      console.log('Auto-select result:');
      console.log('  Success:', result?.success);
      console.log('  Message:', result?.message);
      console.log('  Connector ID:', result?.connectorId);
      console.log('  Auto Selected:', result?.autoSelected);
      console.log('  Exists:', result?.exists);

      if (parsed.message.error) {
        console.log('  Error:', parsed.message.error);
      }

      phase = 'test_set';

      // Test 3: Set specific connector (if valid ID provided)
      if (CONNECTOR_ID !== "REPLACE_WITH_CONNECTOR_ID") {
        setTimeout(() => {
          console.log('\nTest 3: Set specific connector');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "set_default_connector",
              params: { connectorId: CONNECTOR_ID },
              commandId: "test_set"
            }
          }));
        }, 500);
      } else {
        console.log('\n=== Skipping set test (replace connector ID first) ===');

        phase = 'test_retrieve';

        // Test retrieval
        setTimeout(() => {
          console.log('\nTest 4: Retrieve current default');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "set_default_connector",
              params: {},
              commandId: "test_retrieve"
            }
          }));
        }, 500);
      }

    } else if (phase === 'test_set') {
      console.log('Set connector result:');
      console.log('  Success:', result?.success);
      console.log('  Message:', result?.message);
      console.log('  Connector ID:', result?.connectorId);

      phase = 'test_retrieve';

      // Test 4: Retrieve to confirm
      setTimeout(() => {
        console.log('\nTest 4: Retrieve to confirm');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "set_default_connector",
            params: {},
            commandId: "test_retrieve"
          }
        }));
      }, 500);

    } else if (phase === 'test_retrieve') {
      console.log('Retrieve result:');
      console.log('  Success:', result?.success);
      console.log('  Exists:', result?.exists);
      console.log('  Connector ID:', result?.connectorId);

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

- [ ] Set specific connector works
- [ ] Get existing default works
- [ ] Auto-select first connector works
- [ ] No connectors error handled
- [ ] Non-existent connector ID returns error
- [ ] Non-connector node returns error
- [ ] Update default connector works
- [ ] Default persists across calls
- [ ] Deleted connector handled gracefully
- [ ] Works in FigJam files
- [ ] Response contains `success`, `message`, `connectorId`
- [ ] `exists` flag present when returning existing
- [ ] `autoSelected` flag present when auto-selecting
