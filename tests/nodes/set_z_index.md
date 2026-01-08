# Test Case: set_z_index

## Command
`set_z_index`

## Description
Reorders a node in the layer stack. Can move to front, back, or by relative positions.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to reorder |
| `position` | string/number | **Yes** | - | "front", "back", "forward", "backward", or index number |

### Position Values

| Value | Description |
|-------|-------------|
| `"front"` | Move to top of layer stack (in front of all siblings) |
| `"back"` | Move to bottom of layer stack (behind all siblings) |
| `"forward"` | Move one position toward front |
| `"backward"` | Move one position toward back |
| `number` | Move to specific index position |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "index": 5
}
```

---

## Test Scenarios

### Test 1: Move to Front

**Purpose:** Verify moving to front of stack.

**Prerequisites:**
- Create 3+ nodes (bottom node will be tested)
- Note the bottom node's ID

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "BOTTOM_NODE_ID",
    position: "front"
  }
}
```

**Expected Result:**
- Node moves to top of stack
- `index` is highest value

---

### Test 2: Move to Back

**Purpose:** Verify moving to back of stack.

**Prerequisites:**
- Use a node that's not already at back

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "NODE_ID",
    position: "back"
  }
}
```

**Expected Result:**
- Node moves to bottom of stack
- `index` equals 0

---

### Test 3: Move Forward One Position

**Purpose:** Verify relative forward movement.

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "NODE_ID",
    position: "forward"
  }
}
```

**Expected Result:**
- Node moves one position forward
- `index` increases by 1

---

### Test 4: Move Backward One Position

**Purpose:** Verify relative backward movement.

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "NODE_ID",
    position: "backward"
  }
}
```

**Expected Result:**
- Node moves one position backward
- `index` decreases by 1

---

### Test 5: Move to Specific Index

**Purpose:** Verify moving to exact position.

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "NODE_ID",
    position: 2
  }
}
```

**Expected Result:**
- Node moves to index 2
- `index` equals 2

---

### Test 6: Move to Index 0

**Purpose:** Verify moving to first position.

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "NODE_ID",
    position: 0
  }
}
```

**Expected Result:**
- Node moves to back (index 0)

---

### Test 7: Move Forward When Already at Front

**Purpose:** Verify boundary handling.

**Prerequisites:**
- Node already at front

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "FRONT_NODE_ID",
    position: "forward"
  }
}
```

**Expected Result:**
- Node stays at front
- No error

---

### Test 8: Move Backward When Already at Back

**Purpose:** Verify boundary handling.

**Prerequisites:**
- Node already at back

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "BACK_NODE_ID",
    position: "backward"
  }
}
```

**Expected Result:**
- Node stays at back
- No error

---

### Test 9: Missing position (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing position parameter"

---

### Test 10: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_z_index",
  params: {
    nodeId: "999:999",
    position: "front"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_z_index command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let nodeIds = [];
let phase = 'create';
let createCount = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    // Create 4 rectangles
    for (let i = 0; i < 4; i++) {
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_rectangle",
          params: { x: i * 50, y: i * 50, width: 100, height: 100, name: `Rect ${i + 1}` },
          commandId: `create_${i}`
        }
      }));
    }
  }, 2000);
});

const zIndexTests = [
  { name: "Move to front", position: "front" },
  { name: "Move to back", position: "back" },
  { name: "Move forward", position: "forward" },
  { name: "Move backward", position: "backward" },
  { name: "Move to index 1", position: 1 }
];

let currentTest = 0;

function runZIndexTest() {
  if (currentTest >= zIndexTests.length) {
    console.log('\n=== All z-index tests complete ===');
    ws.close();
    return;
  }

  const test = zIndexTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_z_index",
      params: { nodeId: nodeIds[0], position: test.position },
      commandId: `zindex_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'create') {
      nodeIds.push(result.id);
      createCount++;

      if (createCount === 4) {
        phase = 'zindex';
        console.log('Created 4 nodes');
        setTimeout(() => runZIndexTest(), 500);
      }
    } else if (result && phase === 'zindex') {
      console.log('  New index:', result.index);
      console.log('  ✓ Z-index updated');

      currentTest++;
      setTimeout(() => runZIndexTest(), 500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] "front" moves node to top
- [ ] "back" moves node to bottom
- [ ] "forward" moves one position up
- [ ] "backward" moves one position down
- [ ] Numeric index moves to exact position
- [ ] Index 0 moves to back
- [ ] Forward at front stays at front
- [ ] Backward at back stays at back
- [ ] Error for missing position
- [ ] Error for non-existent node
- [ ] Response contains `index` value
- [ ] Layer order visible in Figma layers panel
