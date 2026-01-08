# Test Case: resize_node

## Command
`resize_node`

## Description
Resizes an existing node to new width and height dimensions.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to resize |
| `width` | number | **Yes** | - | New width in pixels |
| `height` | number | **Yes** | - | New height in pixels |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "width": 200,
  "height": 150
}
```

---

## Test Scenarios

### Test 1: Resize Node to Larger Dimensions

**Purpose:** Verify node can be enlarged.

**Prerequisites:**
1. Create a 100x100 rectangle
2. Note the rectangle's ID

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "RECTANGLE_ID",
    width: 300,
    height: 200
  }
}
```

**Expected Result:**
- Node resized to 300x200
- Response confirms new dimensions

**Verification Steps:**
1. Check response `width` equals 300
2. Check response `height` equals 200
3. Visually confirm size in Figma

---

### Test 2: Resize Node to Smaller Dimensions

**Purpose:** Verify node can be reduced.

**Prerequisites:**
- Create a 200x200 rectangle

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "RECTANGLE_ID",
    width: 50,
    height: 50
  }
}
```

**Expected Result:**
- Node resized to 50x50
- Smaller than original

---

### Test 3: Resize to Minimum Size (1x1)

**Purpose:** Verify minimum dimensions.

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "NODE_ID",
    width: 1,
    height: 1
  }
}
```

**Expected Result:**
- Node resized to 1x1
- Node still visible (tiny dot)

---

### Test 4: Resize to Very Large Dimensions

**Purpose:** Verify large sizes work.

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "NODE_ID",
    width: 5000,
    height: 3000
  }
}
```

**Expected Result:**
- Node resized to 5000x3000
- No errors with large values

---

### Test 5: Resize with Decimal Dimensions

**Purpose:** Verify fractional dimensions.

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "NODE_ID",
    width: 150.5,
    height: 75.25
  }
}
```

**Expected Result:**
- Node resized with decimal precision
- Dimensions preserved accurately

---

### Test 6: Resize to Square

**Purpose:** Verify equal width and height.

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "NODE_ID",
    width: 200,
    height: 200
  }
}
```

**Expected Result:**
- Node is perfectly square
- width equals height

---

### Test 7: Resize Frame Node

**Purpose:** Verify frames can be resized.

**Prerequisites:**
- Create a frame with some children

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "FRAME_ID",
    width: 400,
    height: 300
  }
}
```

**Expected Result:**
- Frame resized to 400x300
- Children may be clipped or remain in original positions

---

### Test 8: Resize Auto-Layout Frame

**Purpose:** Verify auto-layout frame resize behavior.

**Prerequisites:**
- Create a frame with `layoutSizingHorizontal: "FIXED"`

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    width: 500,
    height: 100
  }
}
```

**Expected Result:**
- Frame resized if layout sizing is FIXED
- May affect child layout

---

### Test 9: Resize Text Node

**Purpose:** Verify text nodes can be resized.

**Prerequisites:**
- Create a text node

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "TEXT_ID",
    width: 200,
    height: 50
  }
}
```

**Expected Result:**
- Text node bounding box resized
- Text may wrap or clip

---

### Test 10: Resize Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "999:999",
    width: 100,
    height: 100
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 11: Resize with Missing Parameters (Error Case)

**Purpose:** Verify error for missing required params.

**Command (missing height):**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "NODE_ID",
    width: 100
  }
}
```

**Expected Result:**
- Error: "Missing width or height parameters"

**Command (missing nodeId):**
```javascript
{
  command: "resize_node",
  params: {
    width: 100,
    height: 100
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 12: Resize to Wide Rectangle

**Purpose:** Verify very wide aspect ratio.

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "NODE_ID",
    width: 1000,
    height: 50
  }
}
```

**Expected Result:**
- Node becomes very wide and thin
- 20:1 aspect ratio

---

### Test 13: Resize to Tall Rectangle

**Purpose:** Verify very tall aspect ratio.

**Command:**
```javascript
{
  command: "resize_node",
  params: {
    nodeId: "NODE_ID",
    width: 50,
    height: 1000
  }
}
```

**Expected Result:**
- Node becomes very tall and narrow
- 1:20 aspect ratio

---

## Sample Test Script

```javascript
/**
 * Test: resize_node command
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
      params: { x: 0, y: 0, width: 100, height: 100, name: "Resize Test" },
      commandId: "create_node"
    }
  }));
}

const resizeTests = [
  { name: "Enlarge to 300x200", width: 300, height: 200 },
  { name: "Shrink to 50x50", width: 50, height: 50 },
  { name: "Minimum 1x1", width: 1, height: 1 },
  { name: "Large 2000x1000", width: 2000, height: 1000 },
  { name: "Decimal 150.5x75.25", width: 150.5, height: 75.25 },
  { name: "Square 200x200", width: 200, height: 200 },
  { name: "Wide 500x20", width: 500, height: 20 },
  { name: "Tall 20x500", width: 20, height: 500 }
];

let currentTest = 0;
let phase = 'create';

function runResizeTest() {
  if (currentTest >= resizeTests.length) {
    console.log('\nAll resize tests complete');
    ws.close();
    return;
  }

  const test = resizeTests[currentTest];
  console.log(`\nTest: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "resize_node",
      params: {
        nodeId: createdNodeId,
        width: test.width,
        height: test.height
      },
      commandId: `resize_${currentTest}`
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
        phase = 'resize';
        setTimeout(() => runResizeTest(), 500);
      } else {
        console.log('Resize result:');
        console.log('  ID:', result.id);
        console.log('  New Width:', result.width);
        console.log('  New Height:', result.height);

        const test = resizeTests[currentTest];
        const widthMatch = Math.abs(result.width - test.width) < 0.01;
        const heightMatch = Math.abs(result.height - test.height) < 0.01;

        if (widthMatch && heightMatch) {
          console.log('  ✓ Dimensions correct');
        } else {
          console.log('  ✗ Dimension mismatch');
        }

        currentTest++;
        setTimeout(() => runResizeTest(), 500);
      }
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [x] Node resizes to larger dimensions
- [x] Node resizes to smaller dimensions
- [x] Node resizes to minimum (1x1)
- [ ] Node resizes to very large dimensions *(not tested)*
- [ ] Decimal dimensions work correctly *(not tested)*
- [ ] Square dimensions work (equal width/height) *(not tested)*
- [ ] Frame resizes correctly *(not tested)*
- [ ] Auto-layout frame resizes correctly *(not tested)*
- [ ] Text node resizes correctly *(not tested)*
- [x] Error returned for non-existent node ID
- [ ] Error returned for missing nodeId *(not tested)*
- [ ] Error returned for missing width or height *(not tested)*
- [x] Very wide aspect ratio works (400x30)
- [ ] Very tall aspect ratio works (50x1000) *(not tested)*
- [x] Response contains id, name, width, height
- [x] Visual size matches response values

**Test Run:** 2025-12-25 | **Result:** 6/6 PASSED
