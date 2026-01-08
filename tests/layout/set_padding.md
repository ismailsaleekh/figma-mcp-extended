# Test Case: set_padding

## Command
`set_padding`

## Description
Sets the padding of an auto-layout frame. Requires the frame to have auto-layout enabled.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of auto-layout frame (colon format) |
| `paddingTop` | number | No | - | Top padding in pixels |
| `paddingRight` | number | No | - | Right padding in pixels |
| `paddingBottom` | number | No | - | Bottom padding in pixels |
| `paddingLeft` | number | No | - | Left padding in pixels |

**Note:** At least one padding value should be provided.

## Expected Response

```json
{
  "id": "123:456",
  "name": "Frame",
  "paddingTop": 20,
  "paddingRight": 20,
  "paddingBottom": 20,
  "paddingLeft": 20
}
```

---

## Test Scenarios

### Test 1: Set Uniform Padding

**Purpose:** Verify all four padding values set equally.

**Prerequisites:**
1. Create a frame with auto-layout enabled
2. Note the frame's ID

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20
  }
}
```

**Expected Result:**
- All padding values set to 20
- Content area reduced by padding

**Verification Steps:**
1. Check all four padding values equal 20
2. Visually confirm padding in Figma

---

### Test 2: Set Only Top Padding

**Purpose:** Verify individual padding control.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingTop: 40
  }
}
```

**Expected Result:**
- Top padding set to 40
- Other padding values unchanged

---

### Test 3: Set Only Bottom Padding

**Purpose:** Verify bottom padding.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingBottom: 30
  }
}
```

**Expected Result:**
- Bottom padding set to 30
- Other padding values unchanged

---

### Test 4: Set Vertical Padding (Top and Bottom)

**Purpose:** Verify vertical padding.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingTop: 24,
    paddingBottom: 24
  }
}
```

**Expected Result:**
- Top and bottom padding set to 24
- Left and right unchanged

---

### Test 5: Set Horizontal Padding (Left and Right)

**Purpose:** Verify horizontal padding.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingLeft: 16,
    paddingRight: 16
  }
}
```

**Expected Result:**
- Left and right padding set to 16
- Top and bottom unchanged

---

### Test 6: Set Asymmetric Padding

**Purpose:** Verify different values for each side.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 30,
    paddingLeft: 40
  }
}
```

**Expected Result:**
- Each padding value different
- Response reflects all values correctly

---

### Test 7: Set Zero Padding

**Purpose:** Verify zero padding works.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  }
}
```

**Expected Result:**
- All padding values set to 0
- Content touches frame edges

---

### Test 8: Set Large Padding

**Purpose:** Verify large padding values.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingTop: 100,
    paddingRight: 100,
    paddingBottom: 100,
    paddingLeft: 100
  }
}
```

**Expected Result:**
- Large 100px padding applied
- Content area significantly reduced

---

### Test 9: Set Decimal Padding

**Purpose:** Verify fractional padding values.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "FRAME_ID",
    paddingTop: 12.5,
    paddingRight: 12.5,
    paddingBottom: 12.5,
    paddingLeft: 12.5
  }
}
```

**Expected Result:**
- Decimal padding values applied
- Precision preserved

---

### Test 10: Update Padding Incrementally

**Purpose:** Verify padding can be updated multiple times.

**Commands (execute sequentially):**
```javascript
// Set all to 10
{ command: "set_padding", params: { nodeId: "FRAME_ID", paddingTop: 10, paddingRight: 10, paddingBottom: 10, paddingLeft: 10 } }

// Update just top to 50
{ command: "set_padding", params: { nodeId: "FRAME_ID", paddingTop: 50 } }

// Update just left to 30
{ command: "set_padding", params: { nodeId: "FRAME_ID", paddingLeft: 30 } }
```

**Expected Result:**
- Final state: top=50, right=10, bottom=10, left=30

---

### Test 11: Set Padding on Non-Auto-Layout Frame (Error Case)

**Purpose:** Verify error for frames without auto-layout.

**Prerequisites:**
- Create a frame with `layoutMode: "NONE"`

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "REGULAR_FRAME_ID",
    paddingTop: 20
  }
}
```

**Expected Result:**
- Error: "Padding can only be set on auto-layout frames"

---

### Test 12: Set Padding on Rectangle (Error Case)

**Purpose:** Verify error for non-frame nodes.

**Prerequisites:**
- Create a rectangle

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "RECTANGLE_ID",
    paddingTop: 20
  }
}
```

**Expected Result:**
- Error: "Node type RECTANGLE does not support padding"

---

### Test 13: Set Padding on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_padding",
  params: {
    nodeId: "999:999",
    paddingTop: 20
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 14: Common UI Padding Patterns

**Purpose:** Verify common design patterns.

**Commands (separate tests):**
```javascript
// Card padding (16px all around)
{ command: "set_padding", params: { nodeId: "FRAME_ID", paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 } }

// Button padding (vertical smaller than horizontal)
{ command: "set_padding", params: { nodeId: "FRAME_ID", paddingTop: 8, paddingRight: 16, paddingBottom: 8, paddingLeft: 16 } }

// List item padding
{ command: "set_padding", params: { nodeId: "FRAME_ID", paddingTop: 12, paddingRight: 16, paddingBottom: 12, paddingLeft: 16 } }
```

**Expected Result:**
- Each pattern applied correctly

---

## Sample Test Script

```javascript
/**
 * Test: set_padding command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdFrameId = null;
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create auto-layout frame
  setTimeout(() => {
    console.log('Creating auto-layout frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: {
          x: 0, y: 0, width: 300, height: 200,
          name: "Padding Test",
          layoutMode: "VERTICAL"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

const paddingTests = [
  { name: "Uniform 20px", top: 20, right: 20, bottom: 20, left: 20 },
  { name: "Zero padding", top: 0, right: 0, bottom: 0, left: 0 },
  { name: "Asymmetric", top: 10, right: 20, bottom: 30, left: 40 },
  { name: "Only top", top: 50 },
  { name: "Vertical only", top: 24, bottom: 24 },
  { name: "Horizontal only", right: 16, left: 16 },
  { name: "Large padding", top: 100, right: 100, bottom: 100, left: 100 },
  { name: "Decimal values", top: 12.5, right: 12.5, bottom: 12.5, left: 12.5 }
];

function runPaddingTest() {
  if (currentTest >= paddingTests.length) {
    console.log('\n=== All padding tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid node ID)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_padding",
        params: { nodeId: "999:999", paddingTop: 20 },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = paddingTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = { nodeId: createdFrameId };
  if (test.top !== undefined) params.paddingTop = test.top;
  if (test.right !== undefined) params.paddingRight = test.right;
  if (test.bottom !== undefined) params.paddingBottom = test.bottom;
  if (test.left !== undefined) params.paddingLeft = test.left;

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_padding",
      params,
      commandId: `padding_${currentTest}`
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
        createdFrameId = result.id;
        console.log('Created auto-layout frame:', createdFrameId);
        phase = 'padding';
        setTimeout(() => runPaddingTest(), 500);
      } else if (phase === 'padding') {
        console.log('Padding result:');
        console.log('  Top:', result.paddingTop);
        console.log('  Right:', result.paddingRight);
        console.log('  Bottom:', result.paddingBottom);
        console.log('  Left:', result.paddingLeft);

        currentTest++;
        setTimeout(() => runPaddingTest(), 500);
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

- [ ] Uniform padding (all sides equal) works
- [ ] Individual padding (top only, right only, etc.) works
- [ ] Vertical padding (top + bottom) works
- [ ] Horizontal padding (left + right) works
- [ ] Asymmetric padding works
- [ ] Zero padding works
- [ ] Large padding values work
- [ ] Decimal padding values work
- [ ] Padding can be updated incrementally
- [ ] Error for non-auto-layout frame
- [ ] Error for Rectangle nodes
- [ ] Error for non-existent node ID
- [ ] Response contains all four padding values
- [ ] Visual padding matches response values
