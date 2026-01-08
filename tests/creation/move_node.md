# Test Case: move_node

## Command
`move_node`

## Description
Moves an existing node to a new position (x, y coordinates).

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to move |
| `x` | number | **Yes** | - | New X position |
| `y` | number | **Yes** | - | New Y position |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "x": 200,
  "y": 150
}
```

---

## Test Scenarios

### Test 1: Move Node to Positive Coordinates

**Purpose:** Verify basic node movement.

**Prerequisites:**
1. Create a rectangle first
2. Note the rectangle's ID from the response

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "RECTANGLE_ID",
    x: 200,
    y: 150
  }
}
```

**Expected Result:**
- Node moved to position (200, 150)
- Response confirms new position

**Verification Steps:**
1. Check response `x` equals 200
2. Check response `y` equals 150
3. Visually confirm node position in Figma

---

### Test 2: Move Node to Origin (0, 0)

**Purpose:** Verify movement to origin.

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "NODE_ID",
    x: 0,
    y: 0
  }
}
```

**Expected Result:**
- Node moved to top-left origin
- Position is exactly (0, 0)

---

### Test 3: Move Node to Negative Coordinates

**Purpose:** Verify negative position values work.

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "NODE_ID",
    x: -100,
    y: -50
  }
}
```

**Expected Result:**
- Node moved to negative coordinates
- Node appears off the top-left of the canvas origin

---

### Test 4: Move Node to Large Coordinates

**Purpose:** Verify large position values.

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "NODE_ID",
    x: 5000,
    y: 3000
  }
}
```

**Expected Result:**
- Node moved to far position on canvas
- No errors with large values

---

### Test 5: Move Node to Decimal Coordinates

**Purpose:** Verify decimal/float positions.

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "NODE_ID",
    x: 123.5,
    y: 456.75
  }
}
```

**Expected Result:**
- Node moved to decimal position
- Position preserved with precision

---

### Test 6: Move Multiple Nodes Sequentially

**Purpose:** Verify multiple move operations.

**Prerequisites:**
- Create 3 nodes and note their IDs

**Commands (execute in order):**
```javascript
// Move node 1
{ command: "move_node", params: { nodeId: "NODE_1_ID", x: 0, y: 0 } }

// Move node 2
{ command: "move_node", params: { nodeId: "NODE_2_ID", x: 150, y: 0 } }

// Move node 3
{ command: "move_node", params: { nodeId: "NODE_3_ID", x: 300, y: 0 } }
```

**Expected Result:**
- All three nodes moved to specified positions
- Nodes aligned horizontally

---

### Test 7: Move Frame Node

**Purpose:** Verify frames can be moved.

**Prerequisites:**
- Create a frame and note its ID

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "FRAME_ID",
    x: 500,
    y: 200
  }
}
```

**Expected Result:**
- Frame moved with all children
- Children maintain relative positions

---

### Test 8: Move Text Node

**Purpose:** Verify text nodes can be moved.

**Prerequisites:**
- Create a text node and note its ID

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "TEXT_ID",
    x: 100,
    y: 100
  }
}
```

**Expected Result:**
- Text node moved to new position
- Text content unchanged

---

### Test 9: Move Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid node ID.

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "999:999",
    x: 100,
    y: 100
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"
- No changes to canvas

---

### Test 10: Move Node with Missing Parameters (Error Case)

**Purpose:** Verify error for missing required params.

**Command (missing y):**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "NODE_ID",
    x: 100
  }
}
```

**Expected Result:**
- Error: "Missing x or y parameters"

**Command (missing nodeId):**
```javascript
{
  command: "move_node",
  params: {
    x: 100,
    y: 100
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 11: Move Child Node Within Frame

**Purpose:** Verify moving child node within parent.

**Prerequisites:**
1. Create a frame
2. Create a rectangle inside the frame
3. Note the rectangle's ID

**Command:**
```javascript
{
  command: "move_node",
  params: {
    nodeId: "CHILD_RECTANGLE_ID",
    x: 20,
    y: 20
  }
}
```

**Expected Result:**
- Child moves within parent frame
- Position is relative to parent (if using absolute positioning)

---

## Sample Test Script

```javascript
/**
 * Test: move_node command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
  setTimeout(() => createTestNode(), 2000);
});

function createTestNode() {
  console.log('Creating test rectangle...');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_rectangle",
      params: { x: 0, y: 0, width: 100, height: 100, name: "Move Test" },
      commandId: "create_node"
    }
  }));
}

const moveTests = [
  { name: "Move to (200, 150)", x: 200, y: 150 },
  { name: "Move to origin", x: 0, y: 0 },
  { name: "Move to negative", x: -50, y: -50 },
  { name: "Move to large coords", x: 1000, y: 500 },
  { name: "Move to decimals", x: 123.5, y: 456.75 }
];

let currentMoveTest = 0;
let phase = 'create';

function runMoveTest() {
  if (currentMoveTest >= moveTests.length) {
    console.log('\nAll move tests complete');
    ws.close();
    return;
  }

  const test = moveTests[currentMoveTest];
  console.log(`\nTest: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "move_node",
      params: {
        nodeId: createdNodeId,
        x: test.x,
        y: test.y
      },
      commandId: `move_${currentMoveTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      if (phase === 'create') {
        createdNodeId = result.id;
        console.log('Created node:', createdNodeId);
        phase = 'move';
        setTimeout(() => runMoveTest(), 500);
      } else {
        console.log('Move result:');
        console.log('  ID:', result.id);
        console.log('  New X:', result.x);
        console.log('  New Y:', result.y);

        const test = moveTests[currentMoveTest];
        if (result.x === test.x && result.y === test.y) {
          console.log('  ✓ Position correct');
        } else {
          console.log('  ✗ Position mismatch');
        }

        currentMoveTest++;
        setTimeout(() => runMoveTest(), 500);
      }
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [x] Node moves to positive coordinates
- [x] Node moves to origin (0, 0)
- [x] Node moves to negative coordinates
- [ ] Node moves to large coordinates (5000+) *(not tested)*
- [x] Node moves to decimal coordinates
- [x] Multiple nodes can be moved sequentially
- [ ] Frame moves with all children *(not tested)*
- [ ] Text nodes can be moved *(not tested)*
- [x] Error returned for non-existent node ID
- [ ] Error returned for missing nodeId *(not tested)*
- [ ] Error returned for missing x or y *(not tested)*
- [ ] Child nodes can be moved within parent *(not tested)*
- [x] Response contains id, name, x, y
- [x] Visual position matches response values

**Test Run:** 2025-12-25 | **Result:** 5/5 PASSED
