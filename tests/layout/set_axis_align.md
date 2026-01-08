# Test Case: set_axis_align

## Command
`set_axis_align`

## Description
Sets the primary and counter axis alignment for an auto-layout frame.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of auto-layout frame (colon format) |
| `primaryAxisAlignItems` | string | No | - | "MIN", "MAX", "CENTER", "SPACE_BETWEEN" |
| `counterAxisAlignItems` | string | No | - | "MIN", "MAX", "CENTER", "BASELINE" |

### Alignment Values

**Primary Axis (direction of layout):**
- `MIN` - Align to start (left for horizontal, top for vertical)
- `MAX` - Align to end (right for horizontal, bottom for vertical)
- `CENTER` - Center along primary axis
- `SPACE_BETWEEN` - Distribute with space between items

**Counter Axis (perpendicular to layout):**
- `MIN` - Align to start
- `MAX` - Align to end
- `CENTER` - Center along counter axis
- `BASELINE` - Align text baselines (horizontal layout only)

## Expected Response

```json
{
  "id": "123:456",
  "name": "Frame",
  "primaryAxisAlignItems": "CENTER",
  "counterAxisAlignItems": "CENTER",
  "layoutMode": "HORIZONTAL"
}
```

---

## Test Scenarios

### Test 1: Set Both Axes to Center

**Purpose:** Verify center alignment on both axes.

**Prerequisites:**
1. Create a frame with auto-layout enabled
2. Add some child elements

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER"
  }
}
```

**Expected Result:**
- Children centered both horizontally and vertically
- Both alignment values set to "CENTER"

---

### Test 2: Set Primary Axis to MIN (Start)

**Purpose:** Verify start alignment on primary axis.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    primaryAxisAlignItems: "MIN"
  }
}
```

**Expected Result:**
- Children aligned to start of primary axis
- `primaryAxisAlignItems` equals "MIN"

---

### Test 3: Set Primary Axis to MAX (End)

**Purpose:** Verify end alignment on primary axis.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    primaryAxisAlignItems: "MAX"
  }
}
```

**Expected Result:**
- Children aligned to end of primary axis
- For horizontal: children at right
- For vertical: children at bottom

---

### Test 4: Set Primary Axis to SPACE_BETWEEN

**Purpose:** Verify space-between distribution.

**Prerequisites:**
- Frame with multiple children

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    primaryAxisAlignItems: "SPACE_BETWEEN"
  }
}
```

**Expected Result:**
- First child at start, last child at end
- Equal space between all children
- `primaryAxisAlignItems` equals "SPACE_BETWEEN"

---

### Test 5: Set Counter Axis to MIN

**Purpose:** Verify start alignment on counter axis.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    counterAxisAlignItems: "MIN"
  }
}
```

**Expected Result:**
- Children aligned to start of counter axis
- For horizontal layout: children at top
- For vertical layout: children at left

---

### Test 6: Set Counter Axis to MAX

**Purpose:** Verify end alignment on counter axis.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    counterAxisAlignItems: "MAX"
  }
}
```

**Expected Result:**
- Children aligned to end of counter axis
- For horizontal layout: children at bottom
- For vertical layout: children at right

---

### Test 7: Set Counter Axis to BASELINE (Horizontal Only)

**Purpose:** Verify baseline alignment for text.

**Prerequisites:**
- Horizontal auto-layout frame
- Multiple text nodes of different sizes

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "HORIZONTAL_FRAME_ID",
    counterAxisAlignItems: "BASELINE"
  }
}
```

**Expected Result:**
- Text baselines aligned
- `counterAxisAlignItems` equals "BASELINE"

---

### Test 8: BASELINE on Vertical Layout (Error Case)

**Purpose:** Verify BASELINE only works with horizontal.

**Prerequisites:**
- Vertical auto-layout frame

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "VERTICAL_FRAME_ID",
    counterAxisAlignItems: "BASELINE"
  }
}
```

**Expected Result:**
- Error: "BASELINE alignment is only valid for horizontal auto-layout frames"

---

### Test 9: Set Only Primary Axis

**Purpose:** Verify setting only one axis.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    primaryAxisAlignItems: "CENTER"
  }
}
```

**Expected Result:**
- Primary axis set to CENTER
- Counter axis unchanged

---

### Test 10: Set Only Counter Axis

**Purpose:** Verify setting only counter axis.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    counterAxisAlignItems: "CENTER"
  }
}
```

**Expected Result:**
- Counter axis set to CENTER
- Primary axis unchanged

---

### Test 11: Invalid Primary Axis Value (Error Case)

**Purpose:** Verify error for invalid alignment value.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    primaryAxisAlignItems: "INVALID"
  }
}
```

**Expected Result:**
- Error: "Invalid primaryAxisAlignItems value"

---

### Test 12: Invalid Counter Axis Value (Error Case)

**Purpose:** Verify error for invalid counter axis value.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "FRAME_ID",
    counterAxisAlignItems: "INVALID"
  }
}
```

**Expected Result:**
- Error: "Invalid counterAxisAlignItems value"

---

### Test 13: Set Alignment on Non-Auto-Layout Frame (Error Case)

**Purpose:** Verify error for frames without auto-layout.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "REGULAR_FRAME_ID",
    primaryAxisAlignItems: "CENTER"
  }
}
```

**Expected Result:**
- Error: "Axis alignment can only be set on auto-layout frames"

---

### Test 14: Set Alignment on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_axis_align",
  params: {
    nodeId: "999:999",
    primaryAxisAlignItems: "CENTER"
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 15: Common Alignment Combinations

**Purpose:** Verify common UI patterns.

**Commands:**
```javascript
// Top-left (MIN, MIN)
{ command: "set_axis_align", params: { nodeId: "FRAME_ID", primaryAxisAlignItems: "MIN", counterAxisAlignItems: "MIN" } }

// Top-right (MAX, MIN)
{ command: "set_axis_align", params: { nodeId: "FRAME_ID", primaryAxisAlignItems: "MAX", counterAxisAlignItems: "MIN" } }

// Bottom-center (CENTER, MAX)
{ command: "set_axis_align", params: { nodeId: "FRAME_ID", primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "MAX" } }

// Space between, centered (SPACE_BETWEEN, CENTER)
{ command: "set_axis_align", params: { nodeId: "FRAME_ID", primaryAxisAlignItems: "SPACE_BETWEEN", counterAxisAlignItems: "CENTER" } }
```

---

## Sample Test Script

```javascript
/**
 * Test: set_axis_align command
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
          x: 0, y: 0, width: 400, height: 200,
          name: "Axis Align Test",
          layoutMode: "HORIZONTAL"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

const alignTests = [
  { name: "Center both", primary: "CENTER", counter: "CENTER" },
  { name: "Start both", primary: "MIN", counter: "MIN" },
  { name: "End both", primary: "MAX", counter: "MAX" },
  { name: "Space between, center", primary: "SPACE_BETWEEN", counter: "CENTER" },
  { name: "Center primary only", primary: "CENTER", counter: undefined },
  { name: "Center counter only", primary: undefined, counter: "CENTER" }
];

function runAlignTest() {
  if (currentTest >= alignTests.length) {
    console.log('\n=== All axis align tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid value)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_axis_align",
        params: { nodeId: createdFrameId, primaryAxisAlignItems: "INVALID" },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = alignTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = { nodeId: createdFrameId };
  if (test.primary) params.primaryAxisAlignItems = test.primary;
  if (test.counter) params.counterAxisAlignItems = test.counter;

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_axis_align",
      params,
      commandId: `align_${currentTest}`
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
        phase = 'align';
        setTimeout(() => runAlignTest(), 500);
      } else if (phase === 'align') {
        console.log('Axis align result:');
        console.log('  Primary Axis:', result.primaryAxisAlignItems);
        console.log('  Counter Axis:', result.counterAxisAlignItems);
        console.log('  Layout Mode:', result.layoutMode);

        currentTest++;
        setTimeout(() => runAlignTest(), 500);
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

- [ ] Primary axis MIN (start) works
- [ ] Primary axis MAX (end) works
- [ ] Primary axis CENTER works
- [ ] Primary axis SPACE_BETWEEN works
- [ ] Counter axis MIN works
- [ ] Counter axis MAX works
- [ ] Counter axis CENTER works
- [ ] Counter axis BASELINE works (horizontal only)
- [ ] BASELINE on vertical layout throws error
- [ ] Can set only primary axis
- [ ] Can set only counter axis
- [ ] Can set both axes at once
- [ ] Invalid primary axis value throws error
- [ ] Invalid counter axis value throws error
- [ ] Error for non-auto-layout frame
- [ ] Error for non-existent node ID
- [ ] Response contains alignment values and layoutMode
