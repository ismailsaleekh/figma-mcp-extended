# Test Case: set_corner_radius

## Command
`set_corner_radius`

## Description
Sets the corner radius of a node, with optional individual corner control.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify (colon format) |
| `radius` | number | **Yes** | - | Corner radius in pixels |
| `corners` | boolean[4] | No | - | Array of 4 booleans for individual corners |

### Corners Array Order

When using the `corners` parameter:
- `corners[0]` = Top Left
- `corners[1]` = Top Right
- `corners[2]` = Bottom Right
- `corners[3]` = Bottom Left

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "cornerRadius": 16,
  "topLeftRadius": 16,
  "topRightRadius": 16,
  "bottomRightRadius": 16,
  "bottomLeftRadius": 16
}
```

---

## Test Scenarios

### Test 1: Set Uniform Corner Radius

**Purpose:** Verify all corners get same radius.

**Prerequisites:**
1. Create a rectangle
2. Note the rectangle's ID

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "RECTANGLE_ID",
    radius: 16
  }
}
```

**Expected Result:**
- All four corners have 16px radius
- Rectangle appears with rounded corners

**Verification Steps:**
1. Check `cornerRadius` equals 16
2. Check all individual radius values equal 16
3. Visually confirm rounded corners in Figma

---

### Test 2: Set Small Corner Radius

**Purpose:** Verify small radius values.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 4
  }
}
```

**Expected Result:**
- Subtle rounded corners (4px)
- Slightly rounded appearance

---

### Test 3: Set Large Corner Radius (Full Circle)

**Purpose:** Verify large radius creates circular ends.

**Prerequisites:**
- Create a 100x100 rectangle

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "100x100_RECTANGLE_ID",
    radius: 50
  }
}
```

**Expected Result:**
- Rectangle becomes a circle
- Radius equals half of smallest dimension

---

### Test 4: Set Zero Corner Radius (Sharp Corners)

**Purpose:** Verify radius can be set to zero.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 0
  }
}
```

**Expected Result:**
- All corners are sharp (90 degrees)
- No rounding visible

---

### Test 5: Set Top Corners Only

**Purpose:** Verify individual corner control.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 20,
    corners: [true, true, false, false]
  }
}
```

**Expected Result:**
- Top-left and top-right corners rounded (20px)
- Bottom corners remain sharp (0px)

**Verification Steps:**
1. Check `topLeftRadius` = 20
2. Check `topRightRadius` = 20
3. Check `bottomRightRadius` = 0 or unchanged
4. Check `bottomLeftRadius` = 0 or unchanged

---

### Test 6: Set Bottom Corners Only

**Purpose:** Verify bottom corner rounding.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 20,
    corners: [false, false, true, true]
  }
}
```

**Expected Result:**
- Bottom-right and bottom-left corners rounded
- Top corners remain sharp

---

### Test 7: Set Left Corners Only

**Purpose:** Verify left side corner rounding.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 20,
    corners: [true, false, false, true]
  }
}
```

**Expected Result:**
- Top-left and bottom-left corners rounded
- Right corners remain sharp

---

### Test 8: Set Right Corners Only

**Purpose:** Verify right side corner rounding.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 20,
    corners: [false, true, true, false]
  }
}
```

**Expected Result:**
- Top-right and bottom-right corners rounded
- Left corners remain sharp

---

### Test 9: Set Single Corner (Top Left Only)

**Purpose:** Verify single corner can be rounded.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 30,
    corners: [true, false, false, false]
  }
}
```

**Expected Result:**
- Only top-left corner rounded (30px)
- Other three corners sharp

---

### Test 10: Set Diagonal Corners

**Purpose:** Verify opposite corners can be rounded.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 25,
    corners: [true, false, true, false]
  }
}
```

**Expected Result:**
- Top-left and bottom-right rounded (25px)
- Top-right and bottom-left sharp

---

### Test 11: Set Corner Radius on Frame

**Purpose:** Verify corner radius works on frames.

**Prerequisites:**
- Create a frame

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "FRAME_ID",
    radius: 12
  }
}
```

**Expected Result:**
- Frame has rounded corners
- Children may be clipped at corners (depending on clip content setting)

---

### Test 12: Set Decimal Corner Radius

**Purpose:** Verify fractional radius values.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID",
    radius: 8.5
  }
}
```

**Expected Result:**
- Corner radius of 8.5px applied
- Smooth rounding

---

### Test 13: Set Very Large Corner Radius

**Purpose:** Verify behavior when radius exceeds dimensions.

**Prerequisites:**
- Create a 50x50 rectangle

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "SMALL_RECTANGLE_ID",
    radius: 100
  }
}
```

**Expected Result:**
- Radius clamped to valid range or shape becomes fully circular
- No errors

---

### Test 14: Change Corner Radius Multiple Times

**Purpose:** Verify radius can be updated repeatedly.

**Commands (execute sequentially):**
```javascript
// Sharp corners
{ command: "set_corner_radius", params: { nodeId: "NODE_ID", radius: 0 } }

// Small radius
{ command: "set_corner_radius", params: { nodeId: "NODE_ID", radius: 8 } }

// Large radius
{ command: "set_corner_radius", params: { nodeId: "NODE_ID", radius: 32 } }
```

**Expected Result:**
- Each radius applies successfully
- Final radius is 32

---

### Test 15: Set Corner Radius on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "999:999",
    radius: 10
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 16: Set Corner Radius with Missing nodeId (Error Case)

**Purpose:** Verify error for missing nodeId.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    radius: 10
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 17: Set Corner Radius with Missing radius (Error Case)

**Purpose:** Verify error for missing radius.

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing radius parameter"

---

### Test 18: Set Corner Radius on Unsupported Node (Error Case)

**Purpose:** Verify error for nodes that don't support corner radius.

**Prerequisites:**
- Create a text node (if it doesn't support corner radius)

**Command:**
```javascript
{
  command: "set_corner_radius",
  params: {
    nodeId: "TEXT_NODE_ID",
    radius: 10
  }
}
```

**Expected Result:**
- Error: "Node does not support corner radius"

---

## Sample Test Script

```javascript
/**
 * Test: set_corner_radius command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create test node
  setTimeout(() => {
    console.log('Creating test rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { x: 0, y: 0, width: 100, height: 100, name: "Corner Radius Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

const radiusTests = [
  { name: "Uniform 16px", radius: 16, corners: null },
  { name: "Small 4px", radius: 4, corners: null },
  { name: "Large 50px (circle)", radius: 50, corners: null },
  { name: "Zero (sharp)", radius: 0, corners: null },
  { name: "Top corners only", radius: 20, corners: [true, true, false, false] },
  { name: "Bottom corners only", radius: 20, corners: [false, false, true, true] },
  { name: "Single corner (top-left)", radius: 30, corners: [true, false, false, false] },
  { name: "Diagonal corners", radius: 25, corners: [true, false, true, false] }
];

function runRadiusTest() {
  if (currentTest >= radiusTests.length) {
    console.log('\n=== All corner radius tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid node ID)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_corner_radius",
        params: { nodeId: "999:999", radius: 10 },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = radiusTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = { nodeId: createdNodeId, radius: test.radius };
  if (test.corners) params.corners = test.corners;

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_corner_radius",
      params,
      commandId: `radius_${currentTest}`
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
        createdNodeId = result.id;
        console.log('Created node:', createdNodeId);
        phase = 'radius';
        setTimeout(() => runRadiusTest(), 500);
      } else if (phase === 'radius') {
        console.log('Corner radius result:');
        console.log('  ID:', result.id);
        console.log('  Corner Radius:', result.cornerRadius);
        console.log('  Top Left:', result.topLeftRadius);
        console.log('  Top Right:', result.topRightRadius);
        console.log('  Bottom Right:', result.bottomRightRadius);
        console.log('  Bottom Left:', result.bottomLeftRadius);

        currentTest++;
        setTimeout(() => runRadiusTest(), 500);
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
}, 60000);
```

---

## Validation Checklist

- [ ] Uniform corner radius applied to all corners
- [ ] Small radius (4px) works
- [ ] Large radius (50px) works
- [ ] Zero radius (sharp corners) works
- [ ] Top corners only rounded
- [ ] Bottom corners only rounded
- [ ] Left corners only rounded
- [ ] Right corners only rounded
- [ ] Single corner rounded
- [ ] Diagonal corners rounded
- [ ] Corner radius on frame works
- [ ] Decimal radius values work
- [ ] Large radius on small shape handles correctly
- [ ] Radius can be changed multiple times
- [ ] Error returned for non-existent node ID
- [ ] Error returned for missing nodeId
- [ ] Error returned for missing radius
- [ ] Error returned for unsupported node type
- [ ] Response contains `cornerRadius` and individual corner values
- [ ] Visual corners match response values
