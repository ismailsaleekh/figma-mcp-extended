# Test Case: set_visibility

## Command
`set_visibility`

## Description
Sets the visibility of a node. Hidden nodes are not visible on the canvas but still exist in the layer tree.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify |
| `visible` | boolean | **Yes** | - | Whether the node should be visible |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "visible": false
}
```

---

## Test Scenarios

### Test 1: Hide a Node

**Purpose:** Verify hiding a visible node.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "NODE_ID",
    visible: false
  }
}
```

**Expected Result:**
- Node is hidden
- `visible` equals false

---

### Test 2: Show a Hidden Node

**Purpose:** Verify showing a hidden node.

**Prerequisites:**
- Hide a node first

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "HIDDEN_NODE_ID",
    visible: true
  }
}
```

**Expected Result:**
- Node becomes visible
- `visible` equals true

---

### Test 3: Hide a Frame

**Purpose:** Verify hiding a frame (affects children).

**Prerequisites:**
- Create a frame with children

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "FRAME_ID",
    visible: false
  }
}
```

**Expected Result:**
- Frame and children hidden

---

### Test 4: Toggle Visibility Multiple Times

**Purpose:** Verify repeated visibility changes.

**Commands (execute sequentially):**
```javascript
{ command: "set_visibility", params: { nodeId: "NODE_ID", visible: false } }
{ command: "set_visibility", params: { nodeId: "NODE_ID", visible: true } }
{ command: "set_visibility", params: { nodeId: "NODE_ID", visible: false } }
```

**Expected Result:**
- Each toggle works
- Final state is hidden

---

### Test 5: Set Visible on Already Visible Node

**Purpose:** Verify no error when already visible.

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "VISIBLE_NODE_ID",
    visible: true
  }
}
```

**Expected Result:**
- Node stays visible
- No error

---

### Test 6: Hide Text Node

**Purpose:** Verify hiding text nodes.

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "TEXT_ID",
    visible: false
  }
}
```

**Expected Result:**
- Text node hidden

---

### Test 7: Hide Group

**Purpose:** Verify hiding groups.

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "GROUP_ID",
    visible: false
  }
}
```

**Expected Result:**
- Group and children hidden

---

### Test 8: Missing visible Parameter (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing visible parameter"

---

### Test 9: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_visibility",
  params: {
    nodeId: "999:999",
    visible: false
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
  command: "set_visibility",
  params: {
    visible: false
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

## Sample Test Script

```javascript
/**
 * Test: set_visibility command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const visibilityTests = [
  { name: "Hide node", visible: false },
  { name: "Show node", visible: true },
  { name: "Hide again", visible: false },
  { name: "Show again", visible: true }
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
        params: { width: 100, height: 100, name: "Visibility Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runVisibilityTest() {
  if (currentTest >= visibilityTests.length) {
    console.log('\n=== All visibility tests complete ===');
    ws.close();
    return;
  }

  const test = visibilityTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_visibility",
      params: { nodeId: createdNodeId, visible: test.visible },
      commandId: `visibility_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created node:', createdNodeId);
      phase = 'visibility';
      setTimeout(() => runVisibilityTest(), 500);
    } else if (result && phase === 'visibility') {
      console.log('  Visible:', result.visible);
      console.log('  ✓ Visibility set successfully');

      currentTest++;
      setTimeout(() => runVisibilityTest(), 500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Node can be hidden (visible: false)
- [ ] Node can be shown (visible: true)
- [ ] Frame visibility affects children
- [ ] Group visibility affects children
- [ ] Text node visibility works
- [ ] Visibility can be toggled repeatedly
- [ ] Setting visible=true on visible node works
- [ ] Setting visible=false on hidden node works
- [ ] Error for missing visible parameter
- [ ] Error for non-existent node
- [ ] Error for missing nodeId
- [ ] Response contains `visible` value
- [ ] Hidden state shown in Figma layers panel (eye icon)
