# Test Case: create_connections

## Command
`create_connections`

## Description
Creates FigJam connector lines between multiple pairs of nodes. Uses the default connector (set via `set_default_connector`) as a template and supports optional text labels. Handles nested node IDs by creating cursor placeholder nodes.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `connections` | array | **Yes** | - | Array of connection objects |

### Connection Object Format
```javascript
{
  startNodeId: "123:456",   // Required: source node ID (colon format)
  endNodeId: "789:012",     // Required: destination node ID (colon format)
  text: "Label text"        // Optional: connector label
}
```

### Nested Node IDs
- Node IDs containing ";" (e.g., "123:456;789:012") indicate nested elements
- These automatically create cursor placeholder nodes at the nested element's position

## Expected Response

```json
{
  "success": true,
  "count": 3,
  "connections": [
    {
      "id": "created_connector_id",
      "originalStartNodeId": "123:456",
      "originalEndNodeId": "789:012",
      "usedStartNodeId": "123:456",
      "usedEndNodeId": "789:012",
      "text": "Click here"
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Create Single Connection

**Purpose:** Verify basic connector creation.

**Prerequisites:**
1. Open a FigJam file
2. Run `set_default_connector` first
3. Create two frames/shapes to connect
4. Note their IDs

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      {
        startNodeId: "START_NODE_ID",
        endNodeId: "END_NODE_ID"
      }
    ]
  }
}
```

**Expected Result:**
- `success: true`
- `count: 1`
- Connector visible between nodes
- `connections` array has one entry

---

### Test 2: Create Multiple Connections

**Purpose:** Verify batch connector creation.

**Prerequisites:**
- Multiple pairs of nodes to connect
- Default connector set

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      { startNodeId: "NODE_A", endNodeId: "NODE_B" },
      { startNodeId: "NODE_B", endNodeId: "NODE_C" },
      { startNodeId: "NODE_C", endNodeId: "NODE_D" }
    ]
  }
}
```

**Expected Result:**
- `count: 3`
- All connectors created
- Chain of connections visible

---

### Test 3: Connection with Text Label

**Purpose:** Verify text label on connector.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      {
        startNodeId: "START_ID",
        endNodeId: "END_ID",
        text: "User clicks button"
      }
    ]
  }
}
```

**Expected Result:**
- Connector created with text label
- Text visible on connector line
- `text` field in response matches input

---

### Test 4: Multiple Connections with Different Labels

**Purpose:** Verify individual labels on batch.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      { startNodeId: "A", endNodeId: "B", text: "Step 1" },
      { startNodeId: "B", endNodeId: "C", text: "Step 2" },
      { startNodeId: "C", endNodeId: "D", text: "Step 3" }
    ]
  }
}
```

**Expected Result:**
- Each connector has its own label
- Labels match input text

---

### Test 5: Nested Node ID (With Semicolon)

**Purpose:** Verify cursor placeholder creation.

**Prerequisites:**
- Component instance with nested element
- Use nested ID format: "instanceId;nestedId"

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      {
        startNodeId: "INSTANCE_ID;NESTED_ELEMENT_ID",
        endNodeId: "REGULAR_NODE_ID"
      }
    ]
  }
}
```

**Expected Result:**
- Cursor placeholder created at nested element
- `usedStartNodeId` differs from `originalStartNodeId`
- Connection created successfully

---

### Test 6: Both Nodes Nested

**Purpose:** Verify both endpoints using nested IDs.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      {
        startNodeId: "INSTANCE_1;NESTED_1",
        endNodeId: "INSTANCE_2;NESTED_2"
      }
    ]
  }
}
```

**Expected Result:**
- Two cursor placeholders created
- Both `usedStartNodeId` and `usedEndNodeId` are placeholder IDs

---

### Test 7: No Default Connector Set (Error Case)

**Purpose:** Verify error when default not set.

**Prerequisites:**
- Clear client storage or fresh session
- Don't run `set_default_connector` first

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      { startNodeId: "A", endNodeId: "B" }
    ]
  }
}
```

**Expected Result:**
- Error: "No default connector set. Please run set_default_connector first."

---

### Test 8: Empty Connections Array (Error Case)

**Purpose:** Verify error for empty input.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: []
  }
}
```

**Expected Result:**
- Error: "Missing or invalid connections parameter"

---

### Test 9: Missing Connections Parameter (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "create_connections",
  params: {}
}
```

**Expected Result:**
- Error: "Missing or invalid connections parameter"

---

### Test 10: Invalid Node IDs in Connection

**Purpose:** Verify handling of invalid nodes.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      { startNodeId: "999:999", endNodeId: "998:998" }
    ]
  }
}
```

**Expected Result:**
- Connection entry with `error` field
- Operation continues for other connections

---

### Test 11: Partial Success

**Purpose:** Verify mixed success/failure handling.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      { startNodeId: "VALID_START", endNodeId: "VALID_END" },
      { startNodeId: "999:999", endNodeId: "998:998" },
      { startNodeId: "ANOTHER_VALID", endNodeId: "VALID_END" }
    ]
  }
}
```

**Expected Result:**
- `success: true` (some succeeded)
- `count` reflects successful connections
- Failed entries have `error` field

---

### Test 12: Long Text Labels

**Purpose:** Verify handling of long text.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      {
        startNodeId: "START",
        endNodeId: "END",
        text: "This is a very long label that describes the user interaction in detail for documentation purposes"
      }
    ]
  }
}
```

**Expected Result:**
- Text applied to connector
- No truncation or error

---

### Test 13: Special Characters in Text

**Purpose:** Verify special character handling.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      {
        startNodeId: "START",
        endNodeId: "END",
        text: "Click → Navigate & Load 🚀"
      }
    ]
  }
}
```

**Expected Result:**
- Special characters preserved
- Emoji rendered (if font supports)

---

### Test 14: Progress Updates

**Purpose:** Verify progress tracking for batch.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      // Multiple connections...
    ]
  }
}
```

**Expected Result:**
- Progress updates sent during creation
- Final completion message

---

### Test 15: Connector Naming Convention

**Purpose:** Verify connector naming.

**Command:**
```javascript
{
  command: "create_connections",
  params: {
    connections: [
      { startNodeId: "123:456", endNodeId: "789:012" }
    ]
  }
}
```

**Expected Result:**
- Connector named: "TTF_Connector/123:456/789:012"
- Easy to identify programmatically created connectors

---

## Sample Test Script

```javascript
/**
 * Test: create_connections command
 * Prerequisites: FigJam file open, default connector set
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

// Replace with actual node IDs from FigJam
const START_NODE_ID = "REPLACE_START";
const END_NODE_ID = "REPLACE_END";

const ws = new WebSocket(WS_URL);

let phase = 'setup';

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
  console.log('\n=== Testing create_connections ===');

  // First, ensure default connector is set
  console.log('\nSetup: Setting default connector');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_default_connector",
      params: {},
      commandId: "setup_connector"
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

    if (phase === 'setup') {
      if (result?.success) {
        console.log('Default connector set:', result.connectorId);
        phase = 'test_empty';

        // Test 1: Empty array error
        setTimeout(() => {
          console.log('\nTest 1: Empty connections array');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "create_connections",
              params: { connections: [] },
              commandId: "test_empty"
            }
          }));
        }, 500);
      } else {
        console.log('Failed to set connector:', parsed.message.error);
        ws.close();
      }

    } else if (phase === 'test_empty') {
      if (parsed.message.error) {
        console.log('Expected error:', parsed.message.error);
      }

      phase = 'test_create';

      // Test 2: Create connection (if valid IDs)
      if (START_NODE_ID !== "REPLACE_START") {
        setTimeout(() => {
          console.log('\nTest 2: Create single connection');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "create_connections",
              params: {
                connections: [
                  {
                    startNodeId: START_NODE_ID,
                    endNodeId: END_NODE_ID,
                    text: "Test Connection"
                  }
                ]
              },
              commandId: "test_create"
            }
          }));
        }, 500);
      } else {
        console.log('\n=== Skipping creation test (replace node IDs first) ===');
        ws.close();
      }

    } else if (phase === 'test_create') {
      console.log('\n=== Create Connection Result ===');
      console.log('Success:', result?.success);
      console.log('Count:', result?.count);

      if (result?.connections) {
        result.connections.forEach((conn, i) => {
          console.log(`\nConnection ${i + 1}:`);
          console.log('  ID:', conn.id);
          console.log('  Start:', conn.originalStartNodeId, '->', conn.usedStartNodeId);
          console.log('  End:', conn.originalEndNodeId, '->', conn.usedEndNodeId);
          console.log('  Text:', conn.text);
          if (conn.error) console.log('  Error:', conn.error);
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

- [ ] Single connection creation works
- [ ] Multiple connections in batch work
- [ ] Text labels applied correctly
- [ ] Different labels per connection work
- [ ] Nested node IDs create cursor placeholders
- [ ] Both endpoints nested works
- [ ] No default connector returns error
- [ ] Empty array returns error
- [ ] Missing parameter returns error
- [ ] Invalid node IDs handled with error field
- [ ] Partial success works
- [ ] Long text labels work
- [ ] Special characters in text work
- [ ] Progress updates sent
- [ ] Connector naming follows convention
- [ ] Response contains `success`, `count`, `connections`
- [ ] Connection entries have `id`, `originalStartNodeId`, `originalEndNodeId`, `usedStartNodeId`, `usedEndNodeId`, `text`
- [ ] Failed entries have `error` field
