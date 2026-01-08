# Test Case: delete_multiple_nodes

## Command
`delete_multiple_nodes`

## Description
Batch deletes multiple nodes by their IDs. Processes nodes in chunks to avoid timeouts and provides progress updates. Reports success/failure for each node.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeIds` | string[] | **Yes** | - | Array of node IDs to delete (colon format) |

## Expected Response

```json
{
  "success": true,
  "nodesDeleted": 8,
  "nodesFailed": 2,
  "totalNodes": 10,
  "results": [
    {
      "success": true,
      "nodeId": "123:456",
      "nodeInfo": {
        "id": "123:456",
        "name": "Old Rectangle",
        "type": "RECTANGLE"
      }
    },
    {
      "success": false,
      "nodeId": "999:999",
      "error": "Node not found: 999:999"
    }
  ],
  "completedInChunks": 2,
  "commandId": "cmd_abc123"
}
```

---

## Test Scenarios

### Test 1: Delete Single Node

**Purpose:** Verify single node deletion.

**Prerequisites:**
1. Create a test node
2. Note its ID

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["TEST_NODE_ID"]
  }
}
```

**Expected Result:**
- `success: true`
- `nodesDeleted: 1`
- Node removed from canvas

---

### Test 2: Delete Multiple Nodes

**Purpose:** Verify batch deletion.

**Prerequisites:**
- Create multiple test nodes

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["NODE_1_ID", "NODE_2_ID", "NODE_3_ID"]
  }
}
```

**Expected Result:**
- All nodes deleted
- `nodesDeleted` equals array length
- `nodesFailed: 0`

---

### Test 3: Verify Node Info in Results

**Purpose:** Confirm deleted node information captured.

**Expected Result:**
- Each successful result has `nodeInfo`
- nodeInfo contains id, name, type
- Information reflects deleted node

---

### Test 4: Partial Success (Some Invalid)

**Purpose:** Verify mixed success/failure handling.

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["VALID_ID_1", "999:999", "VALID_ID_2"]
  }
}
```

**Expected Result:**
- `success: true` (at least one succeeded)
- `nodesDeleted: 2`
- `nodesFailed: 1`
- Failed entry has error message

---

### Test 5: All Nodes Invalid

**Purpose:** Verify all-failure handling.

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["999:991", "999:992", "999:993"]
  }
}
```

**Expected Result:**
- `success: false`
- `nodesDeleted: 0`
- `nodesFailed: 3`

---

### Test 6: Large Batch (Chunking)

**Purpose:** Verify chunked processing.

**Prerequisites:**
- Create 10+ test nodes

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: [/* 10+ node IDs */]
  }
}
```

**Expected Result:**
- All nodes deleted
- `completedInChunks` > 1
- Progress updates sent

---

### Test 7: Empty Array (Error Case)

**Purpose:** Verify error for empty input.

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: []
  }
}
```

**Expected Result:**
- Error: "Missing or invalid nodeIds parameter"

---

### Test 8: Missing Parameter (Error Case)

**Purpose:** Verify error for missing nodeIds.

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {}
}
```

**Expected Result:**
- Error: "Missing or invalid nodeIds parameter"

---

### Test 9: Delete Various Node Types

**Purpose:** Verify deletion works for all types.

**Prerequisites:**
- Create FRAME, RECTANGLE, TEXT nodes

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["FRAME_ID", "RECT_ID", "TEXT_ID"]
  }
}
```

**Expected Result:**
- All types deleted successfully

---

### Test 10: Delete Nested Nodes

**Purpose:** Verify deleting nodes inside frames.

**Prerequisites:**
- Child node inside a frame

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["CHILD_NODE_ID"]
  }
}
```

**Expected Result:**
- Child removed from parent
- Parent remains

---

### Test 11: Delete Parent with Children

**Purpose:** Verify parent deletion removes children.

**Prerequisites:**
- Frame with children

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["PARENT_FRAME_ID"]
  }
}
```

**Expected Result:**
- Parent deleted
- Children automatically removed

---

### Test 12: Progress Updates

**Purpose:** Verify progress tracking during large batches.

**Expected Result:**
- Progress updates sent with chunk progress
- Started, in_progress, completed statuses

---

### Test 13: Duplicate Node IDs

**Purpose:** Verify handling of same ID multiple times.

**Command:**
```javascript
{
  command: "delete_multiple_nodes",
  params: {
    nodeIds: ["NODE_ID", "NODE_ID", "NODE_ID"]
  }
}
```

**Expected Result:**
- First deletion succeeds
- Subsequent attempts fail (node already deleted)

---

## Sample Test Script

```javascript
/**
 * Test: delete_multiple_nodes command
 * WARNING: This test DELETES nodes! Use test nodes only.
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeIds = [];
let phase = 'create';
let createCount = 0;
const NODES_TO_CREATE = 5;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Create test nodes first
  setTimeout(() => {
    createTestNodes();
  }, 2000);
});

function createTestNodes() {
  if (createCount >= NODES_TO_CREATE) {
    console.log('\nCreated test nodes:', createdNodeIds);
    phase = 'test_empty';
    setTimeout(() => runTests(), 500);
    return;
  }

  console.log(`Creating test node ${createCount + 1}...`);
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_rectangle",
      params: {
        x: createCount * 120, y: 500, width: 100, height: 50,
        name: `Delete Test ${createCount + 1}`
      },
      commandId: `create_${createCount}`
    }
  }));
}

function runTests() {
  console.log('\n=== Testing delete_multiple_nodes ===');

  // Test 1: Error case - empty array
  console.log('\nTest 1: Empty nodeIds array');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "delete_multiple_nodes",
      params: { nodeIds: [] },
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

    if (phase === 'create') {
      if (result?.id) {
        createdNodeIds.push(result.id);
        createCount++;
        setTimeout(() => createTestNodes(), 300);
      }

    } else if (phase === 'test_empty') {
      if (parsed.message.error) {
        console.log('Expected error:', parsed.message.error);
      }

      phase = 'test_invalid';

      // Test 2: Invalid IDs
      setTimeout(() => {
        console.log('\nTest 2: Invalid node IDs');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "delete_multiple_nodes",
            params: { nodeIds: ["999:999", "998:998"] },
            commandId: "test_invalid"
          }
        }));
      }, 500);

    } else if (phase === 'test_invalid') {
      console.log('Invalid IDs result:');
      console.log('  Success:', result?.success);
      console.log('  Deleted:', result?.nodesDeleted);
      console.log('  Failed:', result?.nodesFailed);

      phase = 'test_delete';

      // Test 3: Actually delete created nodes
      if (createdNodeIds.length > 0) {
        setTimeout(() => {
          console.log('\nTest 3: Delete created test nodes');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "delete_multiple_nodes",
              params: { nodeIds: createdNodeIds },
              commandId: "test_delete"
            }
          }));
        }, 500);
      } else {
        console.log('\n=== No nodes to delete ===');
        ws.close();
      }

    } else if (phase === 'test_delete') {
      console.log('\n=== Deletion Results ===');
      console.log('Success:', result?.success);
      console.log('Nodes Deleted:', result?.nodesDeleted);
      console.log('Nodes Failed:', result?.nodesFailed);
      console.log('Total:', result?.totalNodes);
      console.log('Chunks:', result?.completedInChunks);

      if (result?.results) {
        console.log('\nIndividual results:');
        result.results.forEach((r, i) => {
          if (r.success) {
            console.log(`  ${i + 1}. ✓ ${r.nodeInfo?.name} (${r.nodeInfo?.type})`);
          } else {
            console.log(`  ${i + 1}. ✗ ${r.nodeId}: ${r.error}`);
          }
        });
      }

      console.log('\n=== All tests complete ===');
      ws.close();
    }
  }
});

ws.on('close', () => console.log('Connection closed'));
ws.on('error', (err) => console.error('WebSocket error:', err));

setTimeout(() => ws.close(), 120000);
```

---

## Validation Checklist

- [ ] Single node deletion works
- [ ] Multiple node deletion works
- [ ] Node info captured in results
- [ ] Partial success handled correctly
- [ ] All failures handled correctly
- [ ] Large batch uses chunking
- [ ] Empty array returns error
- [ ] Missing parameter returns error
- [ ] Various node types deleted
- [ ] Nested nodes deleted
- [ ] Parent deletion removes children
- [ ] Progress updates sent
- [ ] Duplicate IDs handled
- [ ] Response contains success, nodesDeleted, nodesFailed, totalNodes
- [ ] results array has success, nodeId, nodeInfo or error
- [ ] completedInChunks reflects processing
- [ ] commandId present
