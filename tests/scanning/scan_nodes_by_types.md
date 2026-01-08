# Test Case: scan_nodes_by_types

## Command
`scan_nodes_by_types`

## Description
Searches a node and all its children for nodes matching specified type(s). Returns a list of matching nodes with their basic information and bounding boxes.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of root node to search from (colon format) |
| `types` | string[] | **Yes** | - | Array of node types to find (e.g., "FRAME", "TEXT", "RECTANGLE") |

### Common Node Types
- `FRAME` - Frame nodes
- `TEXT` - Text nodes
- `RECTANGLE` - Rectangle shapes
- `ELLIPSE` - Ellipse shapes
- `GROUP` - Group nodes
- `INSTANCE` - Component instances
- `COMPONENT` - Component definitions
- `VECTOR` - Vector nodes
- `IMAGE` - Image nodes

## Expected Response

```json
{
  "success": true,
  "message": "Found 15 matching nodes.",
  "count": 15,
  "matchingNodes": [
    {
      "id": "123:456",
      "name": "Button Text",
      "type": "TEXT",
      "bbox": {
        "x": 100,
        "y": 200,
        "width": 80,
        "height": 20
      }
    }
  ],
  "searchedTypes": ["TEXT"]
}
```

---

## Test Scenarios

### Test 1: Scan for Single Type

**Purpose:** Verify finding nodes of one type.

**Prerequisites:**
- Frame with various child nodes including text

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "PARENT_FRAME_ID",
    types: ["TEXT"]
  }
}
```

**Expected Result:**
- All TEXT nodes found
- `count` matches actual count
- Each node has id, name, type, bbox

---

### Test 2: Scan for Multiple Types

**Purpose:** Verify finding multiple node types.

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "PARENT_FRAME_ID",
    types: ["TEXT", "RECTANGLE", "FRAME"]
  }
}
```

**Expected Result:**
- All matching types found
- `searchedTypes` reflects input array

---

### Test 3: Scan for FRAME Type

**Purpose:** Verify finding frame nodes.

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "ROOT_ID",
    types: ["FRAME"]
  }
}
```

**Expected Result:**
- All nested FRAME nodes found

---

### Test 4: Scan for INSTANCE Type

**Purpose:** Verify finding component instances.

**Prerequisites:**
- Frame with component instances

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "PARENT_ID",
    types: ["INSTANCE"]
  }
}
```

**Expected Result:**
- All INSTANCE nodes found

---

### Test 5: Scan for COMPONENT Type

**Purpose:** Verify finding component definitions.

**Prerequisites:**
- Frame containing component definitions

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "PAGE_ID",
    types: ["COMPONENT"]
  }
}
```

**Expected Result:**
- Component nodes found

---

### Test 6: No Matching Nodes

**Purpose:** Verify handling when no matches.

**Prerequisites:**
- Frame with no ELLIPSE nodes

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "FRAME_ID",
    types: ["ELLIPSE"]
  }
}
```

**Expected Result:**
- `success: true`
- `count: 0`
- `matchingNodes: []`

---

### Test 7: Empty Types Array (Error Case)

**Purpose:** Verify error for no types specified.

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "FRAME_ID",
    types: []
  }
}
```

**Expected Result:**
- Error: "No types specified to search for"

---

### Test 8: Missing Types Parameter (Error Case)

**Purpose:** Verify error for missing types.

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Error: "No types specified to search for"

---

### Test 9: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid nodeId.

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "999:999",
    types: ["TEXT"]
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 10: Deep Nested Search

**Purpose:** Verify recursive searching.

**Prerequisites:**
- Deeply nested structure (5+ levels)

**Command:**
```javascript
{
  command: "scan_nodes_by_types",
  params: {
    nodeId: "TOP_LEVEL_ID",
    types: ["TEXT"]
  }
}
```

**Expected Result:**
- All nested TEXT nodes found regardless of depth

---

### Test 11: Verify Bounding Box Data

**Purpose:** Confirm bbox information accuracy.

**Expected Result:**
- Each node has `bbox` with x, y, width, height
- Values match actual node positions

---

### Test 12: Large Node Tree Performance

**Purpose:** Verify handling of large trees.

**Prerequisites:**
- Frame with many children (100+)

**Expected Result:**
- Completes without timeout
- All matching nodes found

---

## Sample Test Script

```javascript
/**
 * Test: scan_nodes_by_types command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const NODE_ID = "REPLACE_WITH_NODE_ID";

const ws = new WebSocket(WS_URL);

let phase = 'test';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    runTests();
  }, 2000);
});

function runTests() {
  console.log('\n=== Testing scan_nodes_by_types ===');

  // Test 1: Error case - empty types
  console.log('\nTest 1: Empty types array');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "scan_nodes_by_types",
      params: { nodeId: NODE_ID, types: [] },
      commandId: "test_empty"
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'system') return;
  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (phase === 'test') {
      if (parsed.message.error) {
        console.log('Expected error:', parsed.message.error);
      }

      phase = 'test_text';

      // Test 2: Scan for TEXT nodes
      if (NODE_ID !== "REPLACE_WITH_NODE_ID") {
        setTimeout(() => {
          console.log('\nTest 2: Scan for TEXT nodes');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "scan_nodes_by_types",
              params: { nodeId: NODE_ID, types: ["TEXT"] },
              commandId: "test_text"
            }
          }));
        }, 500);
      } else {
        console.log('\n=== Skipping scan tests (replace node ID first) ===');
        ws.close();
      }

    } else if (phase === 'test_text') {
      console.log('\n=== TEXT Scan Results ===');
      console.log('Success:', result?.success);
      console.log('Count:', result?.count);
      console.log('Searched Types:', result?.searchedTypes);

      if (result?.matchingNodes?.length > 0) {
        console.log('\nFound nodes:');
        result.matchingNodes.slice(0, 10).forEach(node => {
          console.log(`  - ${node.name} (${node.type}) at ${node.bbox?.x},${node.bbox?.y}`);
        });
      }

      phase = 'test_multiple';

      // Test 3: Multiple types
      setTimeout(() => {
        console.log('\nTest 3: Scan for multiple types');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "scan_nodes_by_types",
            params: { nodeId: NODE_ID, types: ["TEXT", "FRAME", "RECTANGLE"] },
            commandId: "test_multiple"
          }
        }));
      }, 500);

    } else if (phase === 'test_multiple') {
      console.log('\n=== Multiple Types Scan Results ===');
      console.log('Count:', result?.count);
      console.log('Searched Types:', result?.searchedTypes?.join(', '));

      console.log('\n=== All tests complete ===');
      ws.close();
    }
  }
});

ws.on('close', () => console.log('Connection closed'));
ws.on('error', (err) => console.error('WebSocket error:', err));

setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Single type scan works
- [ ] Multiple types scan works
- [ ] TEXT nodes found
- [ ] FRAME nodes found
- [ ] RECTANGLE nodes found
- [ ] INSTANCE nodes found
- [ ] COMPONENT nodes found
- [ ] No matches returns empty array
- [ ] Empty types array returns error
- [ ] Missing types returns error
- [ ] Non-existent node returns error
- [ ] Deep nested search works
- [ ] Bounding box data accurate
- [ ] Large trees handled
- [ ] Response contains success, message, count, matchingNodes, searchedTypes
- [ ] Each node has id, name, type, bbox
