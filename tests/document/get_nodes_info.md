# Test Case: get_nodes_info

## Command
`get_nodes_info`

## Description
Gets detailed information for multiple nodes by their IDs in parallel.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeIds` | string[] | **Yes** | - | Array of node IDs (colon format) |

## Expected Response

```json
[
  {
    "nodeId": "1:2",
    "document": {
      "id": "1:2",
      "name": "Rectangle 1",
      "type": "RECTANGLE",
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 100
    }
  },
  {
    "nodeId": "1:3",
    "document": {
      "id": "1:3",
      "name": "Frame 1",
      "type": "FRAME",
      "x": 150,
      "y": 0,
      "width": 200,
      "height": 200
    }
  }
]
```

Returns an array of objects, each containing the nodeId and its document info.

---

## Test Scenarios

### Test 1: Get Info for Two Nodes

**Purpose:** Verify basic multiple node info retrieval.

**Prerequisites:**
1. Create two rectangles
2. Note both IDs

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["RECT_1_ID", "RECT_2_ID"]
  }
}
```

**Expected Result:**
- Response is array with 2 items
- Each item has `nodeId` and `document`
- Both nodes' info returned

**Verification Steps:**
1. Check response is array of length 2
2. Each item has `nodeId` matching input
3. Each `document` contains node properties

---

### Test 2: Get Info for Many Nodes

**Purpose:** Verify handling of larger node arrays.

**Prerequisites:**
1. Create 5+ rectangles
2. Note all IDs

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["ID_1", "ID_2", "ID_3", "ID_4", "ID_5"]
  }
}
```

**Expected Result:**
- Response contains 5 items
- All nodes' info returned in parallel

---

### Test 3: Get Info for Single Node (Array of One)

**Purpose:** Verify works with single-element array.

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["SINGLE_NODE_ID"]
  }
}
```

**Expected Result:**
- Response is array with 1 item
- Equivalent to `get_node_info` but in array format

---

### Test 4: Get Info for Different Node Types

**Purpose:** Verify different node types handled correctly.

**Prerequisites:**
1. Create a rectangle, frame, and text node
2. Note all three IDs

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["RECTANGLE_ID", "FRAME_ID", "TEXT_ID"]
  }
}
```

**Expected Result:**
- All three types returned correctly
- Each has appropriate type-specific properties

---

### Test 5: Get Info with One Invalid ID

**Purpose:** Verify handling when some IDs are invalid.

**Prerequisites:**
1. Create one valid node

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["VALID_ID", "999:999"]
  }
}
```

**Expected Result:**
- Valid node info returned
- Invalid node may be omitted or return null
- No complete failure

---

### Test 6: Get Info with All Invalid IDs

**Purpose:** Verify handling when all IDs are invalid.

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["999:999", "888:888"]
  }
}
```

**Expected Result:**
- Empty array or error message
- Graceful handling

---

### Test 7: Get Info with Empty Array

**Purpose:** Verify handling of empty input.

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: []
  }
}
```

**Expected Result:**
- Returns empty array
- No error thrown

---

### Test 8: Verify Node Order in Response

**Purpose:** Verify response order matches input order.

**Prerequisites:**
1. Create nodes A, B, C

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["C_ID", "A_ID", "B_ID"]  // Specific order
  }
}
```

**Expected Result:**
- Response maintains input order
- Or includes nodeId for matching

---

### Test 9: Get Info for Parent and Child

**Purpose:** Verify parent-child relationships don't cause issues.

**Prerequisites:**
1. Create a frame with a child rectangle
2. Note both IDs

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["PARENT_FRAME_ID", "CHILD_RECTANGLE_ID"]
  }
}
```

**Expected Result:**
- Both nodes returned independently
- Each has its own complete info

---

### Test 10: Get Info for Duplicate IDs

**Purpose:** Verify handling of duplicate IDs in input.

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["NODE_ID", "NODE_ID", "NODE_ID"]
  }
}
```

**Expected Result:**
- May return 3 identical items
- Or deduplicated to 1 item
- No error

---

### Test 11: Performance with 10+ Nodes

**Purpose:** Verify reasonable performance with larger sets.

**Prerequisites:**
1. Create 10 nodes
2. Note all IDs

**Command:**
```javascript
{
  command: "get_nodes_info",
  params: {
    nodeIds: ["ID_1", "ID_2", ..., "ID_10"]
  }
}
```

**Expected Result:**
- All nodes returned
- Response within reasonable time (< 5 seconds)

---

## Sample Test Script

```javascript
/**
 * Test: get_nodes_info command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeIds = [];
let phase = 'create';
let createCount = 0;
const NODES_TO_CREATE = 3;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create test nodes
  setTimeout(() => createNextNode(), 2000);
});

function createNextNode() {
  if (createCount >= NODES_TO_CREATE) {
    phase = 'get_info';
    getNodesInfo();
    return;
  }

  console.log(`Creating node ${createCount + 1}/${NODES_TO_CREATE}...`);
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_rectangle",
      params: {
        x: createCount * 120,
        y: 0,
        width: 100,
        height: 100,
        name: `Test Node ${createCount + 1}`
      },
      commandId: `create_${createCount}`
    }
  }));
}

function getNodesInfo() {
  console.log('\nGetting info for all nodes...');
  console.log('Node IDs:', createdNodeIds);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "get_nodes_info",
      params: { nodeIds: createdNodeIds },
      commandId: "get_nodes_info_test"
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

    if (result) {
      if (phase === 'create') {
        createdNodeIds.push(result.id);
        console.log('Created:', result.id, result.name);
        createCount++;
        setTimeout(() => createNextNode(), 300);

      } else if (phase === 'get_info') {
        console.log('\n=== Nodes Info ===');
        console.log('Returned', result.length, 'nodes');

        result.forEach((item, index) => {
          console.log(`\n--- Node ${index + 1} ---`);
          console.log('Node ID:', item.nodeId);
          if (item.document) {
            console.log('Name:', item.document.name);
            console.log('Type:', item.document.type);
            console.log('Position: (' + item.document.x + ', ' + item.document.y + ')');
          } else {
            console.log('Document: null');
          }
        });

        console.log('\n=== Validation ===');

        if (result.length === createdNodeIds.length) {
          console.log('✓ Returned count matches input count');
        } else {
          console.log('✗ Count mismatch: expected', createdNodeIds.length, 'got', result.length);
        }

        const allHaveNodeId = result.every(r => r.nodeId);
        if (allHaveNodeId) {
          console.log('✓ All items have nodeId');
        } else {
          console.log('✗ Some items missing nodeId');
        }

        const allHaveDocument = result.every(r => r.document);
        if (allHaveDocument) {
          console.log('✓ All items have document');
        } else {
          console.log('✗ Some items missing document');
        }

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
}, 30000);
```

---

## Validation Checklist

- [ ] Response is an array
- [ ] Array length matches input nodeIds length (for valid IDs)
- [ ] Each item has `nodeId` property
- [ ] Each item has `document` property
- [ ] `document` contains full node info
- [ ] Works with single-element array
- [ ] Works with many nodes (5+)
- [ ] Different node types handled correctly
- [ ] Invalid IDs handled gracefully (not complete failure)
- [ ] Empty array input returns empty array
- [ ] Duplicate IDs handled without error
- [ ] Performance acceptable for 10+ nodes
- [ ] Parent-child nodes both returned independently
- [ ] Response includes position and size for each node
