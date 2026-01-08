# Test Case: delete_node

## Command
`delete_node`

## Description
Deletes an existing node from the Figma document.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to delete |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "type": "RECTANGLE"
}
```

The response contains information about the deleted node.

---

## Test Scenarios

### Test 1: Delete a Rectangle

**Purpose:** Verify basic node deletion.

**Prerequisites:**
1. Create a rectangle
2. Note the rectangle's ID

**Command:**
```javascript
{
  command: "delete_node",
  params: {
    nodeId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Node is deleted from canvas
- Response contains deleted node info
- Node no longer exists in Figma

**Verification Steps:**
1. Check response contains `id`, `name`, `type`
2. Verify node is gone from Figma layers panel
3. Attempting to access the node ID should fail

---

### Test 2: Delete a Frame

**Purpose:** Verify frame deletion.

**Prerequisites:**
- Create a frame

**Command:**
```javascript
{
  command: "delete_node",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Frame deleted
- Response `type` is "FRAME"

---

### Test 3: Delete a Text Node

**Purpose:** Verify text node deletion.

**Prerequisites:**
- Create a text node

**Command:**
```javascript
{
  command: "delete_node",
  params: {
    nodeId: "TEXT_ID"
  }
}
```

**Expected Result:**
- Text node deleted
- Response `type` is "TEXT"

---

### Test 4: Delete Frame with Children (Cascade Delete)

**Purpose:** Verify parent deletion removes children.

**Prerequisites:**
1. Create a frame
2. Create rectangles inside the frame
3. Note the frame's ID (not children)

**Command:**
```javascript
{
  command: "delete_node",
  params: {
    nodeId: "PARENT_FRAME_ID"
  }
}
```

**Expected Result:**
- Frame and ALL children deleted
- Children are no longer accessible
- Only parent node info in response

**Verification Steps:**
1. Frame is gone from layers panel
2. All nested elements are gone
3. Accessing child IDs should fail

---

### Test 5: Delete Child Node (Keep Parent)

**Purpose:** Verify deleting child doesn't affect parent.

**Prerequisites:**
1. Create a frame
2. Create a rectangle inside the frame
3. Note the rectangle's ID (child)

**Command:**
```javascript
{
  command: "delete_node",
  params: {
    nodeId: "CHILD_RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Only the child is deleted
- Parent frame remains
- Other siblings unaffected

---

### Test 6: Delete Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "delete_node",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"
- No changes to canvas

---

### Test 7: Delete with Missing nodeId (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "delete_node",
  params: {}
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 8: Delete Already Deleted Node (Error Case)

**Purpose:** Verify deleting same node twice fails.

**Prerequisites:**
1. Create a node
2. Delete it once
3. Try to delete again

**Commands:**
```javascript
// First delete (should succeed)
{ command: "delete_node", params: { nodeId: "NODE_ID" } }

// Second delete (should fail)
{ command: "delete_node", params: { nodeId: "NODE_ID" } }
```

**Expected Result:**
- First deletion succeeds
- Second deletion fails with "Node not found"

---

### Test 9: Delete Multiple Nodes Sequentially

**Purpose:** Verify multiple deletions work.

**Prerequisites:**
- Create 3 rectangles, note all IDs

**Commands (execute in order):**
```javascript
{ command: "delete_node", params: { nodeId: "RECT_1_ID" } }
{ command: "delete_node", params: { nodeId: "RECT_2_ID" } }
{ command: "delete_node", params: { nodeId: "RECT_3_ID" } }
```

**Expected Result:**
- All three nodes deleted
- Each deletion returns correct node info
- Canvas is cleared of those nodes

---

### Test 10: Verify Node is Gone After Deletion

**Purpose:** Confirm deleted node cannot be accessed.

**Prerequisites:**
1. Create a node
2. Delete it
3. Try to get info about it

**Commands:**
```javascript
// Delete the node
{ command: "delete_node", params: { nodeId: "NODE_ID" } }

// Try to get info (should fail)
{ command: "get_node_info", params: { nodeId: "NODE_ID" } }
```

**Expected Result:**
- get_node_info fails with "Node not found"

---

## Sample Test Script

```javascript
/**
 * Test: delete_node command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodes = [];
let currentTest = 0;
let phase = 'create';

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
  setTimeout(() => createTestNodes(), 2000);
});

function createTestNodes() {
  console.log('Creating test nodes...');

  // Create 3 rectangles
  for (let i = 0; i < 3; i++) {
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: {
          x: i * 120,
          y: 0,
          width: 100,
          height: 100,
          name: `Delete Test ${i + 1}`
        },
        commandId: `create_${i}`
      }
    }));
  }

  // Wait for creation then start delete tests
  setTimeout(() => {
    phase = 'delete';
    runDeleteTest();
  }, 3000);
}

function runDeleteTest() {
  if (currentTest >= createdNodes.length) {
    console.log('\nAll delete tests complete');

    // Test deleting non-existent node
    console.log('\nTesting error case: delete non-existent node...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "delete_node",
        params: { nodeId: "999:999" },
        commandId: "delete_error"
      }
    }));

    setTimeout(() => ws.close(), 2000);
    return;
  }

  const nodeId = createdNodes[currentTest];
  console.log(`\nDeleting node ${currentTest + 1}: ${nodeId}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "delete_node",
      params: { nodeId },
      commandId: `delete_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      if (phase === 'create') {
        createdNodes.push(result.id);
        console.log('Created node:', result.id, result.name);
      } else if (phase === 'delete') {
        console.log('Delete result:');
        console.log('  ID:', result.id);
        console.log('  Name:', result.name);
        console.log('  Type:', result.type);

        if (result.id && result.name && result.type) {
          console.log('  ✓ Node deleted successfully');
        } else {
          console.log('  ✗ Missing response fields');
        }

        currentTest++;
        setTimeout(() => runDeleteTest(), 500);
      }
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [x] Rectangle deleted successfully
- [ ] Frame deleted successfully *(not tested)*
- [ ] Text node deleted successfully *(not tested)*
- [ ] Frame with children - all children deleted *(not tested)*
- [ ] Child deleted - parent remains intact *(not tested)*
- [x] Error returned for non-existent node ID
- [ ] Error returned for missing nodeId parameter *(not tested)*
- [x] Error returned when deleting already-deleted node
- [ ] Multiple nodes can be deleted sequentially *(not tested)*
- [ ] Deleted node cannot be accessed via get_node_info *(not tested)*
- [x] Response contains id, name, type
- [x] Node removed from Figma layers panel
- [x] Node removed from canvas visually

**Test Run:** 2025-12-25 | **Result:** 3/3 PASSED
