# Test Case: set_item_spacing

## Command
`set_item_spacing`

## Description
Sets the spacing between items in an auto-layout frame. Also supports counter-axis spacing for wrapped layouts.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of auto-layout frame (colon format) |
| `itemSpacing` | number | No | - | Gap between items in pixels |
| `counterAxisSpacing` | number | No | - | Gap between rows/columns when wrapped |

**Note:** At least one of `itemSpacing` or `counterAxisSpacing` must be provided.

## Expected Response

```json
{
  "id": "123:456",
  "name": "Frame",
  "itemSpacing": 16,
  "counterAxisSpacing": 12,
  "layoutMode": "HORIZONTAL",
  "layoutWrap": "WRAP"
}
```

---

## Test Scenarios

### Test 1: Set Item Spacing

**Purpose:** Verify basic item spacing.

**Prerequisites:**
1. Create a frame with auto-layout enabled
2. Add multiple child elements

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    itemSpacing: 16
  }
}
```

**Expected Result:**
- 16px gap between all items
- `itemSpacing` equals 16

**Verification Steps:**
1. Check `itemSpacing` equals 16
2. Visually confirm spacing between children

---

### Test 2: Set Zero Item Spacing

**Purpose:** Verify no gap between items.

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "FRAME_ID",
    itemSpacing: 0
  }
}
```

**Expected Result:**
- Items touch each other (no gap)
- `itemSpacing` equals 0

---

### Test 3: Set Small Item Spacing

**Purpose:** Verify small spacing values.

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "FRAME_ID",
    itemSpacing: 4
  }
}
```

**Expected Result:**
- 4px gap between items
- Tight but visible spacing

---

### Test 4: Set Large Item Spacing

**Purpose:** Verify large spacing values.

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "FRAME_ID",
    itemSpacing: 100
  }
}
```

**Expected Result:**
- 100px gap between items
- Large visible separation

---

### Test 5: Set Decimal Item Spacing

**Purpose:** Verify fractional spacing.

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "FRAME_ID",
    itemSpacing: 8.5
  }
}
```

**Expected Result:**
- 8.5px spacing applied
- Decimal precision preserved

---

### Test 6: Set Counter Axis Spacing (Wrap Required)

**Purpose:** Verify counter-axis spacing for wrapped layouts.

**Prerequisites:**
- Frame with `layoutWrap: "WRAP"`
- Multiple items that wrap to multiple rows

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "WRAPPED_FRAME_ID",
    counterAxisSpacing: 12
  }
}
```

**Expected Result:**
- 12px gap between wrapped rows/columns
- `counterAxisSpacing` equals 12

---

### Test 7: Set Both Spacing Values

**Purpose:** Verify setting both spacings at once.

**Prerequisites:**
- Wrapped auto-layout frame

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "WRAPPED_FRAME_ID",
    itemSpacing: 16,
    counterAxisSpacing: 24
  }
}
```

**Expected Result:**
- 16px between items in same row
- 24px between rows

---

### Test 8: Counter Axis Spacing on Non-Wrapped Frame (Error Case)

**Purpose:** Verify error when wrap not enabled.

**Prerequisites:**
- Frame with `layoutWrap: "NO_WRAP"`

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "NON_WRAPPED_FRAME_ID",
    counterAxisSpacing: 12
  }
}
```

**Expected Result:**
- Error: "Counter axis spacing can only be set on frames with layoutWrap set to WRAP"

---

### Test 9: Change Item Spacing Multiple Times

**Purpose:** Verify spacing can be updated.

**Commands (execute sequentially):**
```javascript
// Start with 8px
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 8 } }

// Change to 16px
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 16 } }

// Change to 24px
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 24 } }
```

**Expected Result:**
- Each spacing applies correctly
- Final spacing is 24px

---

### Test 10: Set Spacing on Non-Auto-Layout Frame (Error Case)

**Purpose:** Verify error for frames without auto-layout.

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "REGULAR_FRAME_ID",
    itemSpacing: 16
  }
}
```

**Expected Result:**
- Error: "Item spacing can only be set on auto-layout frames"

---

### Test 11: Set Spacing on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "999:999",
    itemSpacing: 16
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 12: Missing Both Spacing Values (Error Case)

**Purpose:** Verify error when no spacing provided.

**Command:**
```javascript
{
  command: "set_item_spacing",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Error: "At least one of itemSpacing or counterAxisSpacing must be provided"

---

### Test 13: Common Spacing Patterns

**Purpose:** Verify common UI spacing values.

**Commands:**
```javascript
// Tight spacing (4px)
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 4 } }

// Standard spacing (8px)
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 8 } }

// Comfortable spacing (16px)
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 16 } }

// Loose spacing (24px)
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 24 } }

// Section spacing (32px)
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 32 } }
```

---

### Test 14: Spacing on Horizontal vs Vertical Layout

**Purpose:** Verify spacing works in both directions.

**Commands:**
```javascript
// On horizontal layout (spacing is horizontal)
{ command: "set_layout_mode", params: { nodeId: "FRAME_ID", layoutMode: "HORIZONTAL" } }
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 16 } }

// On vertical layout (spacing is vertical)
{ command: "set_layout_mode", params: { nodeId: "FRAME_ID", layoutMode: "VERTICAL" } }
{ command: "set_item_spacing", params: { nodeId: "FRAME_ID", itemSpacing: 16 } }
```

**Expected Result:**
- Horizontal: 16px between items left-to-right
- Vertical: 16px between items top-to-bottom

---

## Sample Test Script

```javascript
/**
 * Test: set_item_spacing command
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
          name: "Item Spacing Test",
          layoutMode: "HORIZONTAL"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

const spacingTests = [
  { name: "16px spacing", itemSpacing: 16 },
  { name: "Zero spacing", itemSpacing: 0 },
  { name: "Small 4px", itemSpacing: 4 },
  { name: "Large 100px", itemSpacing: 100 },
  { name: "Decimal 8.5px", itemSpacing: 8.5 },
  { name: "Standard 8px", itemSpacing: 8 }
];

function runSpacingTest() {
  if (currentTest >= spacingTests.length) {
    console.log('\n=== All item spacing tests complete ===');

    // Test error case
    console.log('\nTesting error case (no spacing provided)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_item_spacing",
        params: { nodeId: createdFrameId },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = spacingTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_item_spacing",
      params: {
        nodeId: createdFrameId,
        itemSpacing: test.itemSpacing
      },
      commandId: `spacing_${currentTest}`
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
        phase = 'spacing';
        setTimeout(() => runSpacingTest(), 500);
      } else if (phase === 'spacing') {
        console.log('Item spacing result:');
        console.log('  Item Spacing:', result.itemSpacing);
        console.log('  Counter Axis Spacing:', result.counterAxisSpacing);
        console.log('  Layout Mode:', result.layoutMode);
        console.log('  Layout Wrap:', result.layoutWrap);

        const test = spacingTests[currentTest];
        if (result.itemSpacing === test.itemSpacing) {
          console.log('  ✓ Spacing correct');
        } else {
          console.log('  ✗ Spacing mismatch');
        }

        currentTest++;
        setTimeout(() => runSpacingTest(), 500);
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

- [ ] Item spacing applied correctly
- [ ] Zero spacing (items touching) works
- [ ] Small spacing (4px) works
- [ ] Large spacing (100px) works
- [ ] Decimal spacing values work
- [ ] Counter axis spacing works (with wrap)
- [ ] Both spacings can be set at once
- [ ] Counter axis spacing error without wrap
- [ ] Spacing can be changed multiple times
- [ ] Works on horizontal layout
- [ ] Works on vertical layout
- [ ] Error for non-auto-layout frame
- [ ] Error for non-existent node ID
- [ ] Error when no spacing values provided
- [ ] Response contains spacing values and layout info
