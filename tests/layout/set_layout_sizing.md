# Test Case: set_layout_sizing

## Command
`set_layout_sizing`

## Description
Sets the layout sizing behavior for an auto-layout frame (fixed, hug contents, or fill container).

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of auto-layout frame (colon format) |
| `layoutSizingHorizontal` | string | No | - | "FIXED", "HUG", or "FILL" |
| `layoutSizingVertical` | string | No | - | "FIXED", "HUG", or "FILL" |

### Sizing Values

- `FIXED` - Frame maintains explicit width/height
- `HUG` - Frame shrinks to fit content
- `FILL` - Frame expands to fill parent container

## Expected Response

```json
{
  "id": "123:456",
  "name": "Frame",
  "layoutSizingHorizontal": "HUG",
  "layoutSizingVertical": "FIXED",
  "layoutMode": "HORIZONTAL"
}
```

---

## Test Scenarios

### Test 1: Set Both to HUG

**Purpose:** Verify hug contents on both axes.

**Prerequisites:**
1. Create a frame with auto-layout enabled
2. Add some child elements

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    layoutSizingHorizontal: "HUG",
    layoutSizingVertical: "HUG"
  }
}
```

**Expected Result:**
- Frame shrinks to fit content on both axes
- Both sizing values set to "HUG"

---

### Test 2: Set Both to FIXED

**Purpose:** Verify fixed sizing on both axes.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "FRAME_ID",
    layoutSizingHorizontal: "FIXED",
    layoutSizingVertical: "FIXED"
  }
}
```

**Expected Result:**
- Frame maintains explicit dimensions
- Content may overflow or have extra space

---

### Test 3: Set Horizontal to HUG, Vertical to FIXED

**Purpose:** Verify mixed sizing.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "FRAME_ID",
    layoutSizingHorizontal: "HUG",
    layoutSizingVertical: "FIXED"
  }
}
```

**Expected Result:**
- Width shrinks to fit content
- Height maintains fixed value

---

### Test 4: Set Horizontal to FIXED, Vertical to HUG

**Purpose:** Verify opposite mixed sizing.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "FRAME_ID",
    layoutSizingHorizontal: "FIXED",
    layoutSizingVertical: "HUG"
  }
}
```

**Expected Result:**
- Width maintains fixed value
- Height shrinks to fit content

---

### Test 5: Set Horizontal to FILL

**Purpose:** Verify fill container on horizontal.

**Prerequisites:**
- Frame nested inside another auto-layout frame

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "NESTED_FRAME_ID",
    layoutSizingHorizontal: "FILL"
  }
}
```

**Expected Result:**
- Frame expands to fill parent width
- `layoutSizingHorizontal` equals "FILL"

---

### Test 6: Set Vertical to FILL

**Purpose:** Verify fill container on vertical.

**Prerequisites:**
- Frame nested inside another auto-layout frame

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "NESTED_FRAME_ID",
    layoutSizingVertical: "FILL"
  }
}
```

**Expected Result:**
- Frame expands to fill parent height
- `layoutSizingVertical` equals "FILL"

---

### Test 7: Set Only Horizontal Sizing

**Purpose:** Verify setting only one axis.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "FRAME_ID",
    layoutSizingHorizontal: "HUG"
  }
}
```

**Expected Result:**
- Horizontal sizing set to HUG
- Vertical sizing unchanged

---

### Test 8: Set Only Vertical Sizing

**Purpose:** Verify setting only vertical.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "FRAME_ID",
    layoutSizingVertical: "HUG"
  }
}
```

**Expected Result:**
- Vertical sizing set to HUG
- Horizontal sizing unchanged

---

### Test 9: Toggle Between Sizing Modes

**Purpose:** Verify switching between modes.

**Commands (execute sequentially):**
```javascript
// Start with FIXED
{ command: "set_layout_sizing", params: { nodeId: "FRAME_ID", layoutSizingHorizontal: "FIXED", layoutSizingVertical: "FIXED" } }

// Switch to HUG
{ command: "set_layout_sizing", params: { nodeId: "FRAME_ID", layoutSizingHorizontal: "HUG", layoutSizingVertical: "HUG" } }

// Switch back to FIXED
{ command: "set_layout_sizing", params: { nodeId: "FRAME_ID", layoutSizingHorizontal: "FIXED", layoutSizingVertical: "FIXED" } }
```

**Expected Result:**
- Each mode applies correctly
- Frame dimensions change accordingly

---

### Test 10: Invalid Horizontal Sizing Value (Error Case)

**Purpose:** Verify error for invalid value.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "FRAME_ID",
    layoutSizingHorizontal: "INVALID"
  }
}
```

**Expected Result:**
- Error: "Invalid layoutSizingHorizontal value"

---

### Test 11: Invalid Vertical Sizing Value (Error Case)

**Purpose:** Verify error for invalid vertical value.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "FRAME_ID",
    layoutSizingVertical: "INVALID"
  }
}
```

**Expected Result:**
- Error: "Invalid layoutSizingVertical value"

---

### Test 12: Set Sizing on Non-Auto-Layout Frame (Error Case)

**Purpose:** Verify error for frames without auto-layout.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "REGULAR_FRAME_ID",
    layoutSizingHorizontal: "HUG"
  }
}
```

**Expected Result:**
- Error: "Layout sizing can only be set on auto-layout frames"

---

### Test 13: Set Sizing on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_layout_sizing",
  params: {
    nodeId: "999:999",
    layoutSizingHorizontal: "HUG"
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 14: Common Sizing Patterns

**Purpose:** Verify common UI patterns.

**Commands:**
```javascript
// Auto-width button (HUG horizontal)
{ command: "set_layout_sizing", params: { nodeId: "BUTTON_FRAME_ID", layoutSizingHorizontal: "HUG", layoutSizingVertical: "FIXED" } }

// Full-width card (FILL horizontal)
{ command: "set_layout_sizing", params: { nodeId: "CARD_FRAME_ID", layoutSizingHorizontal: "FILL", layoutSizingVertical: "HUG" } }

// Auto-sizing container (HUG both)
{ command: "set_layout_sizing", params: { nodeId: "CONTAINER_ID", layoutSizingHorizontal: "HUG", layoutSizingVertical: "HUG" } }
```

---

## Sample Test Script

```javascript
/**
 * Test: set_layout_sizing command
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
          name: "Layout Sizing Test",
          layoutMode: "HORIZONTAL"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

const sizingTests = [
  { name: "Both FIXED", horizontal: "FIXED", vertical: "FIXED" },
  { name: "Both HUG", horizontal: "HUG", vertical: "HUG" },
  { name: "Horizontal HUG, Vertical FIXED", horizontal: "HUG", vertical: "FIXED" },
  { name: "Horizontal FIXED, Vertical HUG", horizontal: "FIXED", vertical: "HUG" },
  { name: "Only horizontal HUG", horizontal: "HUG", vertical: undefined },
  { name: "Only vertical HUG", horizontal: undefined, vertical: "HUG" }
];

function runSizingTest() {
  if (currentTest >= sizingTests.length) {
    console.log('\n=== All layout sizing tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid value)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_layout_sizing",
        params: { nodeId: createdFrameId, layoutSizingHorizontal: "INVALID" },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = sizingTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = { nodeId: createdFrameId };
  if (test.horizontal) params.layoutSizingHorizontal = test.horizontal;
  if (test.vertical) params.layoutSizingVertical = test.vertical;

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_layout_sizing",
      params,
      commandId: `sizing_${currentTest}`
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
        phase = 'sizing';
        setTimeout(() => runSizingTest(), 500);
      } else if (phase === 'sizing') {
        console.log('Layout sizing result:');
        console.log('  Horizontal:', result.layoutSizingHorizontal);
        console.log('  Vertical:', result.layoutSizingVertical);
        console.log('  Layout Mode:', result.layoutMode);

        currentTest++;
        setTimeout(() => runSizingTest(), 500);
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

- [ ] FIXED sizing on both axes works
- [ ] HUG sizing on both axes works
- [ ] FILL sizing on horizontal works
- [ ] FILL sizing on vertical works
- [ ] Mixed sizing (HUG + FIXED) works
- [ ] Can set only horizontal sizing
- [ ] Can set only vertical sizing
- [ ] Can toggle between sizing modes
- [ ] Frame dimensions change with HUG
- [ ] Frame fills parent with FILL
- [ ] Invalid horizontal value throws error
- [ ] Invalid vertical value throws error
- [ ] Error for non-auto-layout frame
- [ ] Error for non-existent node ID
- [ ] Response contains sizing values and layoutMode
