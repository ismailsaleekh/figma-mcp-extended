# Test Case: clone_node

## Command
`clone_node`

## Description
Creates a duplicate of an existing node with optional repositioning.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to clone (colon format, e.g., "123:456") |
| `x` | number | No | (same as original) | X position for clone |
| `y` | number | No | (same as original) | Y position for clone |

## Expected Response

```json
{
  "id": "789:012",
  "name": "Rectangle",
  "x": 200,
  "y": 100,
  "width": 100,
  "height": 100
}
```

The response contains information about the newly created clone.

---

## Test Scenarios

### Test 1: Clone a Rectangle at Same Position

**Purpose:** Verify basic node cloning without repositioning.

**Prerequisites:**
1. Create a rectangle using `create_rectangle`
2. Note the rectangle's ID from response

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- New node created with same properties as original
- Clone placed in same position (overlapping original)
- Clone has different ID than original
- Clone has same name as original

**Verification Steps:**
1. Check response `id` is different from original
2. Check response `name` matches original
3. Check `width` and `height` match original
4. Visually confirm two overlapping rectangles in Figma

---

### Test 2: Clone a Rectangle to New Position

**Purpose:** Verify cloning with repositioning.

**Prerequisites:**
- Create a rectangle at (0, 0)

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "RECTANGLE_ID",
    x: 200,
    y: 150
  }
}
```

**Expected Result:**
- Clone created at (200, 150)
- Original remains at (0, 0)
- Both nodes visible without overlap

**Verification Steps:**
1. Check response `x` equals 200
2. Check response `y` equals 150
3. Use `get_node_info` to verify original unchanged

---

### Test 3: Clone a Frame

**Purpose:** Verify frame cloning.

**Prerequisites:**
- Create a frame with `create_frame`

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "FRAME_ID",
    x: 300,
    y: 0
  }
}
```

**Expected Result:**
- Frame cloned with same properties
- Same size and styling preserved
- Clone at new position

---

### Test 4: Clone a Frame with Children

**Purpose:** Verify cloning includes all children.

**Prerequisites:**
1. Create a frame
2. Create rectangles inside the frame using `parentId`
3. Note the frame's ID (parent)

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "PARENT_FRAME_ID",
    x: 400,
    y: 0
  }
}
```

**Expected Result:**
- Frame and ALL children cloned
- Children maintain relative positions within frame
- Clone hierarchy matches original

**Verification Steps:**
1. Check clone appears at new position
2. Use `get_node_info` on clone to verify children exist
3. Check children have new IDs (not shared with original)

---

### Test 5: Clone a Text Node

**Purpose:** Verify text node cloning.

**Prerequisites:**
- Create a text node with `create_text`

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "TEXT_ID",
    x: 0,
    y: 100
  }
}
```

**Expected Result:**
- Text node cloned
- Text content preserved
- Font settings preserved
- Clone at specified position

---

### Test 6: Clone Multiple Times

**Purpose:** Verify multiple clones can be created from same original.

**Prerequisites:**
- Create a rectangle, note ID

**Commands (execute sequentially):**
```javascript
// Clone 1
{ command: "clone_node", params: { nodeId: "RECT_ID", x: 120, y: 0 } }

// Clone 2
{ command: "clone_node", params: { nodeId: "RECT_ID", x: 240, y: 0 } }

// Clone 3
{ command: "clone_node", params: { nodeId: "RECT_ID", x: 360, y: 0 } }
```

**Expected Result:**
- 4 total rectangles (original + 3 clones)
- Each clone has unique ID
- Clones positioned correctly in a row

---

### Test 7: Clone to Negative Coordinates

**Purpose:** Verify cloning to negative positions.

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "NODE_ID",
    x: -200,
    y: -100
  }
}
```

**Expected Result:**
- Clone created at negative coordinates
- Clone appears off the top-left of canvas origin

---

### Test 8: Clone Auto-Layout Frame

**Purpose:** Verify auto-layout properties are preserved.

**Prerequisites:**
- Create a frame with `layoutMode: "HORIZONTAL"` and spacing

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    x: 500,
    y: 0
  }
}
```

**Expected Result:**
- Clone has same layout mode
- Spacing and padding preserved
- Alignment settings preserved

---

### Test 9: Clone a Clone

**Purpose:** Verify cloning a previously cloned node.

**Commands (execute sequentially):**
```javascript
// Create original
{ command: "create_rectangle", params: { x: 0, y: 0, width: 100, height: 100, name: "Original" } }

// Clone original -> Clone A (use ID from previous response)
{ command: "clone_node", params: { nodeId: "ORIGINAL_ID", x: 120, y: 0 } }

// Clone Clone A -> Clone B (use Clone A's ID from previous response)
{ command: "clone_node", params: { nodeId: "CLONE_A_ID", x: 240, y: 0 } }
```

**Expected Result:**
- Clone B identical to Clone A
- 3 total nodes visible
- All IDs unique

---

### Test 10: Clone Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"
- No nodes created

---

### Test 11: Clone with Missing nodeId (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "clone_node",
  params: {}
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 12: Clone with URL Format Node ID (Error Case)

**Purpose:** Verify proper node ID format is required.

**Command:**
```javascript
{
  command: "clone_node",
  params: {
    nodeId: "123-456"  // Wrong format (dash instead of colon)
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 123-456"
- Must use colon format: "123:456"

---

## Sample Test Script

```javascript
/**
 * Test: clone_node command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let originalNodeId = null;
let cloneIds = [];
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create test node
  setTimeout(() => createTestNode(), 2000);
});

function createTestNode() {
  console.log('Creating test rectangle...');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_rectangle",
      params: { x: 0, y: 0, width: 100, height: 100, name: "Clone Test Original" },
      commandId: "create_original"
    }
  }));
}

const cloneTests = [
  { name: "Clone at same position", x: undefined, y: undefined },
  { name: "Clone to (150, 0)", x: 150, y: 0 },
  { name: "Clone to (300, 0)", x: 300, y: 0 },
  { name: "Clone to negative", x: -150, y: 0 },
  { name: "Clone to decimal", x: 450.5, y: 25.5 }
];

function runCloneTest() {
  if (currentTest >= cloneTests.length) {
    console.log('\n=== All clone tests complete ===');
    console.log('Original ID:', originalNodeId);
    console.log('Clone IDs:', cloneIds);

    // Test error case
    console.log('\nTesting error case: clone non-existent node...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "clone_node",
        params: { nodeId: "999:999" },
        commandId: "clone_error"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = cloneTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = { nodeId: originalNodeId };
  if (test.x !== undefined) params.x = test.x;
  if (test.y !== undefined) params.y = test.y;

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "clone_node",
      params,
      commandId: `clone_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  // Skip system messages
  if (parsed.type === 'system') {
    if (parsed.message && parsed.message.includes('Joined')) {
      console.log('Channel joined successfully');
    }
    return;
  }

  // Skip echo messages (sender: "You")
  if (parsed.sender === 'You') {
    return;
  }

  // Handle result messages (sender: "User")
  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      if (phase === 'create') {
        originalNodeId = result.id;
        console.log('Created original node:', originalNodeId);
        phase = 'clone';
        setTimeout(() => runCloneTest(), 500);
      } else if (phase === 'clone') {
        console.log('Clone result:');
        console.log('  Clone ID:', result.id);
        console.log('  Name:', result.name);
        console.log('  Position: (' + result.x + ', ' + result.y + ')');
        console.log('  Size:', result.width + 'x' + result.height);

        if (result.id !== originalNodeId) {
          console.log('  ✓ Clone has unique ID');
          cloneIds.push(result.id);
        } else {
          console.log('  ✗ Clone ID matches original (unexpected)');
        }

        currentTest++;
        setTimeout(() => runCloneTest(), 500);
      }
    }

    // Check for errors
    if (parsed.message.error) {
      console.log('Error received:', parsed.message.error);
    }
  }
});

ws.on('close', () => {
  console.log('\n=== Connection closed ===');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

// Timeout safety
setTimeout(() => {
  console.log('Timeout reached, closing connection');
  ws.close();
}, 60000);
```

---

## Validation Checklist

- [x] Clone created with unique ID
- [x] Clone has same name as original
- [x] Clone has same dimensions as original
- [x] Clone without position params overlaps original
- [x] Clone with x, y positioned correctly
- [ ] Frame with children - all children cloned *(not tested)*
- [ ] Text node cloned with content preserved *(not tested)*
- [x] Multiple clones can be created from same original
- [x] Clone to negative coordinates works
- [ ] Auto-layout properties preserved in clone *(not tested)*
- [ ] Clone of clone works correctly *(not tested)*
- [x] Error returned for non-existent node ID
- [ ] Error returned for missing nodeId parameter *(not tested)*
- [ ] Error returned for wrong node ID format (dash instead of colon) *(not tested)*
- [x] Response contains id, name, x, y, width, height
- [x] Clone visible in Figma layers panel

**Test Run:** 2025-12-25 | **Result:** 4/4 PASSED
