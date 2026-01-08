# Test Case: lock_node

## Command
`lock_node`

## Description
Locks or unlocks a node. Locked nodes cannot be selected or edited in Figma's UI.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to lock/unlock |
| `locked` | boolean | **Yes** | - | Whether the node should be locked |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "locked": true
}
```

---

## Test Scenarios

### Test 1: Lock a Node

**Purpose:** Verify locking a node.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "NODE_ID",
    locked: true
  }
}
```

**Expected Result:**
- Node is locked
- `locked` equals true
- Cannot select in Figma UI

---

### Test 2: Unlock a Node

**Purpose:** Verify unlocking a node.

**Prerequisites:**
- Lock a node first

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "LOCKED_NODE_ID",
    locked: false
  }
}
```

**Expected Result:**
- Node is unlocked
- `locked` equals false
- Can select in Figma UI

---

### Test 3: Lock a Frame

**Purpose:** Verify locking frames.

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "FRAME_ID",
    locked: true
  }
}
```

**Expected Result:**
- Frame locked
- Children may still be selectable

---

### Test 4: Lock a Group

**Purpose:** Verify locking groups.

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "GROUP_ID",
    locked: true
  }
}
```

**Expected Result:**
- Group locked

---

### Test 5: Lock a Text Node

**Purpose:** Verify locking text nodes.

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "TEXT_ID",
    locked: true
  }
}
```

**Expected Result:**
- Text node locked

---

### Test 6: Toggle Lock Multiple Times

**Purpose:** Verify repeated lock/unlock.

**Commands (execute sequentially):**
```javascript
{ command: "lock_node", params: { nodeId: "NODE_ID", locked: true } }
{ command: "lock_node", params: { nodeId: "NODE_ID", locked: false } }
{ command: "lock_node", params: { nodeId: "NODE_ID", locked: true } }
```

**Expected Result:**
- Each toggle works
- Final state is locked

---

### Test 7: Lock Already Locked Node

**Purpose:** Verify no error when already locked.

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "LOCKED_NODE_ID",
    locked: true
  }
}
```

**Expected Result:**
- Node stays locked
- No error

---

### Test 8: Missing locked Parameter (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing locked parameter"

---

### Test 9: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    nodeId: "999:999",
    locked: true
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 10: Missing nodeId (Error Case)

**Purpose:** Verify error for missing nodeId.

**Command:**
```javascript
{
  command: "lock_node",
  params: {
    locked: true
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

## Sample Test Script

```javascript
/**
 * Test: lock_node command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const lockTests = [
  { name: "Lock node", locked: true },
  { name: "Unlock node", locked: false },
  { name: "Lock again", locked: true },
  { name: "Unlock again", locked: false }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Creating test rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { width: 100, height: 100, name: "Lock Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runLockTest() {
  if (currentTest >= lockTests.length) {
    console.log('\n=== All lock tests complete ===');
    ws.close();
    return;
  }

  const test = lockTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "lock_node",
      params: { nodeId: createdNodeId, locked: test.locked },
      commandId: `lock_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created node:', createdNodeId);
      phase = 'lock';
      setTimeout(() => runLockTest(), 500);
    } else if (result && phase === 'lock') {
      console.log('  Locked:', result.locked);
      console.log('  ✓ Lock state set successfully');

      currentTest++;
      setTimeout(() => runLockTest(), 500);
    }

    if (error) {
      console.log('Error:', error);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Node can be locked
- [ ] Node can be unlocked
- [ ] Frame can be locked
- [ ] Group can be locked
- [ ] Text node can be locked
- [ ] Lock can be toggled repeatedly
- [ ] Locking already locked node works
- [ ] Unlocking already unlocked node works
- [ ] Error for missing locked parameter
- [ ] Error for non-existent node
- [ ] Error for missing nodeId
- [ ] Response contains `locked` value
- [ ] Locked state shown in Figma (lock icon in layers)
- [ ] Locked node cannot be selected in UI
