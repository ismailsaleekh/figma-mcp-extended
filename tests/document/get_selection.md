# Test Case: get_selection

## Command
`get_selection`

## Description
Gets information about the currently selected nodes in Figma.

## Parameters

None required.

## Expected Response

```json
{
  "selectionCount": 2,
  "selection": [
    {
      "id": "1:2",
      "name": "Rectangle 1",
      "type": "RECTANGLE",
      "visible": true
    },
    {
      "id": "1:3",
      "name": "Frame 1",
      "type": "FRAME",
      "visible": true
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Get Selection with No Selection

**Purpose:** Verify response when nothing is selected.

**Prerequisites:**
- Deselect all nodes in Figma (click on empty canvas)

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- `selectionCount` equals 0
- `selection` is empty array

**Verification Steps:**
1. Check `selectionCount` equals 0
2. Check `selection` is `[]`

---

### Test 2: Get Selection with Single Node Selected

**Purpose:** Verify single node selection.

**Prerequisites:**
1. Create a rectangle
2. Select it in Figma

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- `selectionCount` equals 1
- `selection` contains one node
- Node has correct `id`, `name`, `type`

**Verification Steps:**
1. Check `selectionCount` equals 1
2. Check `selection.length` equals 1
3. Verify node details match selected element

---

### Test 3: Get Selection with Multiple Nodes Selected

**Purpose:** Verify multiple node selection.

**Prerequisites:**
1. Create 3 rectangles
2. Select all 3 (Cmd/Ctrl + click or drag select)

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- `selectionCount` equals 3
- `selection` contains 3 nodes
- All selected nodes are listed

**Verification Steps:**
1. Check `selectionCount` equals 3
2. Check `selection.length` equals 3
3. Each node has `id`, `name`, `type`, `visible`

---

### Test 4: Verify Node Visibility Property

**Purpose:** Verify visible property is accurate.

**Prerequisites:**
1. Create a rectangle
2. Hide it (toggle visibility in Figma)
3. Select the hidden node

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- Selected node has `visible: false`

---

### Test 5: Get Selection with Different Node Types

**Purpose:** Verify different node types are correctly identified.

**Prerequisites:**
1. Create a rectangle, frame, and text node
2. Select all three

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- Types correctly show "RECTANGLE", "FRAME", "TEXT"

---

### Test 6: Get Selection After Changing Selection

**Purpose:** Verify selection updates correctly.

**Commands (manual selection between calls):**
```javascript
// First selection (select node A)
{ command: "get_selection", params: {} }

// User changes selection to node B in Figma

// Second selection
{ command: "get_selection", params: {} }
```

**Expected Result:**
- First response shows node A
- Second response shows node B

---

### Test 7: Get Selection with Nested Node Selected

**Purpose:** Verify nested nodes can be selected.

**Prerequisites:**
1. Create a frame
2. Create a rectangle inside the frame
3. Select the nested rectangle (not the frame)

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- Only the rectangle appears in selection
- Frame is not in selection

---

### Test 8: Get Selection with Frame and Its Children

**Purpose:** Verify frame selection doesn't include children.

**Prerequisites:**
1. Create a frame with child nodes
2. Select only the frame (not children)

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- Only frame appears in selection
- Children are not listed (they are implicitly selected via parent)

---

### Test 9: Verify Selection Count Matches Array Length

**Purpose:** Verify count and array are consistent.

**Prerequisites:**
- Select any number of nodes

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- `selectionCount` always equals `selection.length`

---

### Test 10: Get Selection with Component Instance

**Purpose:** Verify component instances are handled correctly.

**Prerequisites:**
1. Have a component instance on the page
2. Select it

**Command:**
```javascript
{
  command: "get_selection",
  params: {}
}
```

**Expected Result:**
- Node type is "INSTANCE"
- Node is correctly identified

---

## Sample Test Script

```javascript
/**
 * Test: get_selection command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then get selection
  setTimeout(() => {
    console.log('Getting current selection...');
    console.log('(Make sure you have selected nodes in Figma)');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_selection",
        params: {},
        commandId: "selection_" + Date.now()
      }
    }));
  }, 2000);
});

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
      console.log('\n=== Selection Info ===');
      console.log('Selection Count:', result.selectionCount);

      if (result.selectionCount === 0) {
        console.log('\nNo nodes selected.');
        console.log('Try selecting some nodes in Figma and run again.');
      } else {
        console.log('\n=== Selected Nodes ===');
        result.selection.forEach((node, index) => {
          const visibility = node.visible ? 'visible' : 'HIDDEN';
          console.log(`${index + 1}. ${node.name}`);
          console.log(`   ID: ${node.id}`);
          console.log(`   Type: ${node.type}`);
          console.log(`   Visibility: ${visibility}`);
        });
      }

      console.log('\n=== Validation ===');

      // Check count matches array
      if (result.selectionCount === result.selection.length) {
        console.log('✓ selectionCount matches selection array length');
      } else {
        console.log('✗ Count mismatch');
      }

      // Check all nodes have required fields
      const allValid = result.selection.every(node =>
        node.id && node.name && node.type && typeof node.visible === 'boolean'
      );
      if (allValid) {
        console.log('✓ All nodes have required fields');
      } else {
        console.log('✗ Some nodes missing required fields');
      }

      ws.close();
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
}, 15000);
```

---

## Validation Checklist

- [ ] Response contains `selectionCount` and `selection`
- [ ] Empty selection returns `selectionCount: 0` and empty array
- [ ] Single selection returns count 1 and one node
- [ ] Multiple selection returns correct count and nodes
- [ ] Each node has `id`, `name`, `type`, `visible`
- [ ] `selectionCount` equals `selection.length`
- [ ] Hidden nodes have `visible: false`
- [ ] Visible nodes have `visible: true`
- [ ] Different node types correctly identified
- [ ] Nested nodes can be individually selected
- [ ] Frame selection doesn't include children in selection array
- [ ] Component instances show type "INSTANCE"
- [ ] Selection updates when changed in Figma
