# Test Case: set_fill_color

## Command
`set_fill_color`

## Description
Sets the fill color of an existing node using RGBA values (0-1 range).

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify (colon format) |
| `color` | object | **Yes** | - | Fill color `{r, g, b, a}` (0-1 range) |

### Color Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `r` | number | **Yes** | Red channel (0-1) |
| `g` | number | **Yes** | Green channel (0-1) |
| `b` | number | **Yes** | Blue channel (0-1) |
| `a` | number | No | Alpha/opacity (0-1), defaults to 1 |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "fills": [
    {
      "type": "SOLID",
      "color": { "r": 0.2, "g": 0.4, "b": 0.8 },
      "opacity": 1
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Set Fill to Blue

**Purpose:** Verify basic fill color application.

**Prerequisites:**
1. Create a rectangle
2. Note the rectangle's ID

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "RECTANGLE_ID",
    color: { r: 0.2, g: 0.4, b: 0.8, a: 1 }
  }
}
```

**Expected Result:**
- Rectangle fill changes to blue
- Response contains updated `fills` array

**Verification Steps:**
1. Check `fills` array has one element
2. Check `fills[0].type` equals "SOLID"
3. Visually confirm blue color in Figma

---

### Test 2: Set Fill to Pure Red

**Purpose:** Verify red color (max R, zero G/B).

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 1, g: 0, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Node fill is pure red
- `color.r` equals 1, others equal 0

---

### Test 3: Set Fill to Pure Green

**Purpose:** Verify green color.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 1, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Node fill is pure green

---

### Test 4: Set Fill to Pure Blue

**Purpose:** Verify blue color.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 0, b: 1, a: 1 }
  }
}
```

**Expected Result:**
- Node fill is pure blue

---

### Test 5: Set Fill to White

**Purpose:** Verify white color (all max values).

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 1, g: 1, b: 1, a: 1 }
  }
}
```

**Expected Result:**
- Node fill is white
- All color values equal 1

---

### Test 6: Set Fill to Black

**Purpose:** Verify black color (all zero values).

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 0, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Node fill is black
- All color values equal 0

---

### Test 7: Set Fill with Semi-Transparency

**Purpose:** Verify alpha/opacity handling.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 }
  }
}
```

**Expected Result:**
- Node fill is 50% transparent gray
- `opacity` equals 0.5 in response

**Verification Steps:**
1. Check response `fills[0].opacity` equals 0.5
2. Visually confirm transparency in Figma

---

### Test 8: Set Fill with Full Transparency

**Purpose:** Verify fully transparent fill.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 1, g: 0, b: 0, a: 0 }
  }
}
```

**Expected Result:**
- Node appears invisible (fully transparent)
- Color values preserved but not visible

---

### Test 9: Set Fill on Frame

**Purpose:** Verify fill works on frame nodes.

**Prerequisites:**
- Create a frame

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "FRAME_ID",
    color: { r: 0.95, g: 0.95, b: 0.95, a: 1 }
  }
}
```

**Expected Result:**
- Frame background becomes light gray
- Children unaffected

---

### Test 10: Change Fill Color Multiple Times

**Purpose:** Verify fill can be updated repeatedly.

**Commands (execute sequentially):**
```javascript
// First: Red
{ command: "set_fill_color", params: { nodeId: "NODE_ID", color: { r: 1, g: 0, b: 0, a: 1 } } }

// Second: Green
{ command: "set_fill_color", params: { nodeId: "NODE_ID", color: { r: 0, g: 1, b: 0, a: 1 } } }

// Third: Blue
{ command: "set_fill_color", params: { nodeId: "NODE_ID", color: { r: 0, g: 0, b: 1, a: 1 } } }
```

**Expected Result:**
- Each color applies successfully
- Final color is blue

---

### Test 11: Set Fill with Decimal Color Values

**Purpose:** Verify precise color values.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0.12345, g: 0.54321, b: 0.98765, a: 0.75 }
  }
}
```

**Expected Result:**
- Color applied with precision
- Values preserved (may have floating point precision limits)

---

### Test 12: Set Fill without Alpha (Default to 1)

**Purpose:** Verify alpha defaults to 1 when not provided.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0.5, g: 0.5, b: 0.5 }
  }
}
```

**Expected Result:**
- Fill applied with opacity 1 (fully opaque)
- Color is solid gray

---

### Test 13: Set Fill on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    nodeId: "999:999",
    color: { r: 1, g: 0, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 14: Set Fill with Missing nodeId (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_fill_color",
  params: {
    color: { r: 1, g: 0, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 15: Set Fill on Node Without Fill Support (Error Case)

**Purpose:** Verify error for unsupported node types.

**Prerequisites:**
- Find a node type that doesn't support fills (if any)

**Expected Result:**
- Error: "Node does not support fills"

---

## Sample Test Script

```javascript
/**
 * Test: set_fill_color command
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
        params: { x: 0, y: 0, width: 100, height: 100, name: "Fill Color Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

const colorTests = [
  { name: "Blue", color: { r: 0.2, g: 0.4, b: 0.8, a: 1 } },
  { name: "Red", color: { r: 1, g: 0, b: 0, a: 1 } },
  { name: "Green", color: { r: 0, g: 1, b: 0, a: 1 } },
  { name: "White", color: { r: 1, g: 1, b: 1, a: 1 } },
  { name: "Black", color: { r: 0, g: 0, b: 0, a: 1 } },
  { name: "50% Transparent Gray", color: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 } },
  { name: "No Alpha (default)", color: { r: 0.8, g: 0.2, b: 0.6 } }
];

function runFillTest() {
  if (currentTest >= colorTests.length) {
    console.log('\n=== All fill color tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid node ID)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_fill_color",
        params: { nodeId: "999:999", color: { r: 1, g: 0, b: 0, a: 1 } },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = colorTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_fill_color",
      params: {
        nodeId: createdNodeId,
        color: test.color
      },
      commandId: `fill_${currentTest}`
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
        phase = 'fill';
        setTimeout(() => runFillTest(), 500);
      } else if (phase === 'fill') {
        console.log('Fill result:');
        console.log('  ID:', result.id);

        if (result.fills && result.fills.length > 0) {
          const fill = result.fills[0];
          console.log('  Fill type:', fill.type);
          console.log('  Color:', JSON.stringify(fill.color));
          console.log('  Opacity:', fill.opacity);
          console.log('  ✓ Fill applied successfully');
        } else {
          console.log('  ✗ No fills in response');
        }

        currentTest++;
        setTimeout(() => runFillTest(), 500);
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

- [ ] Fill color applied to rectangle
- [ ] Fill color applied to frame
- [ ] Pure red (r:1, g:0, b:0) works
- [ ] Pure green (r:0, g:1, b:0) works
- [ ] Pure blue (r:0, g:0, b:1) works
- [ ] White color works
- [ ] Black color works
- [ ] Semi-transparent fill (alpha < 1) works
- [ ] Fully transparent fill (alpha = 0) works
- [ ] Fill can be changed multiple times
- [ ] Decimal color values preserved
- [ ] Default alpha of 1 when not provided
- [ ] Error returned for non-existent node ID
- [ ] Error returned for missing nodeId
- [ ] Response contains `id`, `name`, `fills`
- [ ] `fills[0].type` is "SOLID"
- [ ] Visual color matches response values
