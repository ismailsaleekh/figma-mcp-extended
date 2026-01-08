# Test Case: set_layout_mode

## Command
`set_layout_mode`

## Description
Sets the auto-layout mode of a frame (horizontal, vertical, or none), with optional wrap control.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of frame to modify (colon format) |
| `layoutMode` | string | No | "NONE" | "NONE", "HORIZONTAL", or "VERTICAL" |
| `layoutWrap` | string | No | "NO_WRAP" | "NO_WRAP" or "WRAP" |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Frame",
  "layoutMode": "HORIZONTAL",
  "layoutWrap": "NO_WRAP"
}
```

---

## Test Scenarios

### Test 1: Set Horizontal Auto-Layout

**Purpose:** Verify horizontal layout mode.

**Prerequisites:**
1. Create a frame using `create_frame`
2. Note the frame's ID

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "FRAME_ID",
    layoutMode: "HORIZONTAL"
  }
}
```

**Expected Result:**
- Frame configured for horizontal auto-layout
- Children will arrange left-to-right
- `layoutMode` equals "HORIZONTAL"

**Verification Steps:**
1. Check `layoutMode` equals "HORIZONTAL"
2. Check `layoutWrap` equals "NO_WRAP" (default)
3. Add children to verify horizontal arrangement

---

### Test 2: Set Vertical Auto-Layout

**Purpose:** Verify vertical layout mode.

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "FRAME_ID",
    layoutMode: "VERTICAL"
  }
}
```

**Expected Result:**
- Frame configured for vertical auto-layout
- Children will arrange top-to-bottom
- `layoutMode` equals "VERTICAL"

---

### Test 3: Set Layout Mode to NONE (Disable Auto-Layout)

**Purpose:** Verify disabling auto-layout.

**Prerequisites:**
- Frame with auto-layout already enabled

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    layoutMode: "NONE"
  }
}
```

**Expected Result:**
- Auto-layout disabled
- Children retain positions but no longer auto-arrange
- `layoutMode` equals "NONE"

---

### Test 4: Set Horizontal with Wrap

**Purpose:** Verify wrapping behavior.

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "FRAME_ID",
    layoutMode: "HORIZONTAL",
    layoutWrap: "WRAP"
  }
}
```

**Expected Result:**
- Horizontal auto-layout enabled
- Wrapping enabled for overflow
- `layoutWrap` equals "WRAP"

**Verification Steps:**
1. Check `layoutMode` equals "HORIZONTAL"
2. Check `layoutWrap` equals "WRAP"
3. Add many children to verify wrapping

---

### Test 5: Set Vertical with Wrap

**Purpose:** Verify vertical layout with wrap.

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "FRAME_ID",
    layoutMode: "VERTICAL",
    layoutWrap: "WRAP"
  }
}
```

**Expected Result:**
- Vertical auto-layout with wrapping
- `layoutMode` equals "VERTICAL"
- `layoutWrap` equals "WRAP"

---

### Test 6: Change from Horizontal to Vertical

**Purpose:** Verify switching layout direction.

**Prerequisites:**
- Frame with horizontal auto-layout

**Commands (execute sequentially):**
```javascript
// Set horizontal first
{ command: "set_layout_mode", params: { nodeId: "FRAME_ID", layoutMode: "HORIZONTAL" } }

// Switch to vertical
{ command: "set_layout_mode", params: { nodeId: "FRAME_ID", layoutMode: "VERTICAL" } }
```

**Expected Result:**
- Layout changes to vertical
- Children rearrange top-to-bottom

---

### Test 7: Toggle Wrap On and Off

**Purpose:** Verify wrap can be toggled.

**Commands (execute sequentially):**
```javascript
// Enable wrap
{ command: "set_layout_mode", params: { nodeId: "FRAME_ID", layoutMode: "HORIZONTAL", layoutWrap: "WRAP" } }

// Disable wrap
{ command: "set_layout_mode", params: { nodeId: "FRAME_ID", layoutMode: "HORIZONTAL", layoutWrap: "NO_WRAP" } }
```

**Expected Result:**
- Wrap can be enabled and disabled
- Layout mode preserved during toggle

---

### Test 8: Set Layout Mode with Default Parameters

**Purpose:** Verify defaults when only nodeId provided.

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- `layoutMode` defaults to "NONE"
- `layoutWrap` defaults to "NO_WRAP"

---

### Test 9: Set Layout Mode on Rectangle (Error Case)

**Purpose:** Verify error for non-frame nodes.

**Prerequisites:**
- Create a rectangle

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "RECTANGLE_ID",
    layoutMode: "HORIZONTAL"
  }
}
```

**Expected Result:**
- Error: "Node type RECTANGLE does not support layoutMode"

---

### Test 10: Set Layout Mode on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "999:999",
    layoutMode: "HORIZONTAL"
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 11: Set Layout Mode on Text Node (Error Case)

**Purpose:** Verify error for text nodes.

**Prerequisites:**
- Create a text node

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "TEXT_ID",
    layoutMode: "HORIZONTAL"
  }
}
```

**Expected Result:**
- Error: "Node type TEXT does not support layoutMode"

---

### Test 12: Verify Children Arrangement After Mode Change

**Purpose:** Verify children actually rearrange.

**Prerequisites:**
1. Create a frame
2. Add 3 rectangles to the frame
3. Set to horizontal

**Command:**
```javascript
{
  command: "set_layout_mode",
  params: {
    nodeId: "FRAME_WITH_CHILDREN_ID",
    layoutMode: "HORIZONTAL"
  }
}
```

**Expected Result:**
- Children arranged horizontally
- Use `get_node_info` to verify child positions

---

## Sample Test Script

```javascript
/**
 * Test: set_layout_mode command
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

  // Wait for join, then create test frame
  setTimeout(() => {
    console.log('Creating test frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: { x: 0, y: 0, width: 400, height: 200, name: "Layout Mode Test" },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

const layoutTests = [
  { name: "Horizontal", layoutMode: "HORIZONTAL", layoutWrap: undefined },
  { name: "Vertical", layoutMode: "VERTICAL", layoutWrap: undefined },
  { name: "Horizontal with Wrap", layoutMode: "HORIZONTAL", layoutWrap: "WRAP" },
  { name: "Vertical with Wrap", layoutMode: "VERTICAL", layoutWrap: "WRAP" },
  { name: "None (disable)", layoutMode: "NONE", layoutWrap: undefined },
  { name: "Horizontal NO_WRAP", layoutMode: "HORIZONTAL", layoutWrap: "NO_WRAP" }
];

function runLayoutTest() {
  if (currentTest >= layoutTests.length) {
    console.log('\n=== All layout mode tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid node ID)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_layout_mode",
        params: { nodeId: "999:999", layoutMode: "HORIZONTAL" },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = layoutTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = { nodeId: createdFrameId, layoutMode: test.layoutMode };
  if (test.layoutWrap) params.layoutWrap = test.layoutWrap;

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_layout_mode",
      params,
      commandId: `layout_${currentTest}`
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
        console.log('Created frame:', createdFrameId);
        phase = 'layout';
        setTimeout(() => runLayoutTest(), 500);
      } else if (phase === 'layout') {
        console.log('Layout mode result:');
        console.log('  ID:', result.id);
        console.log('  Layout Mode:', result.layoutMode);
        console.log('  Layout Wrap:', result.layoutWrap);

        const test = layoutTests[currentTest];
        if (result.layoutMode === test.layoutMode) {
          console.log('  ✓ Layout mode correct');
        } else {
          console.log('  ✗ Layout mode mismatch');
        }

        currentTest++;
        setTimeout(() => runLayoutTest(), 500);
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

- [ ] Horizontal layout mode applied
- [ ] Vertical layout mode applied
- [ ] Layout mode NONE disables auto-layout
- [ ] Layout wrap WRAP works
- [ ] Layout wrap NO_WRAP works
- [ ] Can switch from horizontal to vertical
- [ ] Can switch from vertical to horizontal
- [ ] Can toggle wrap on/off
- [ ] Defaults work when only nodeId provided
- [ ] Error for Rectangle nodes
- [ ] Error for Text nodes
- [ ] Error for non-existent node ID
- [ ] Response contains `id`, `name`, `layoutMode`, `layoutWrap`
- [ ] Children arrange correctly after mode change
