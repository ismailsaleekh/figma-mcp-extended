# Test Case: read_my_design

## Command
`read_my_design`

## Description
Exports currently selected nodes as filtered JSON. This is similar to `get_nodes_info` but operates on the current Figma selection rather than explicit node IDs.

## Parameters

None required. Uses current Figma selection.

## Expected Response

```json
[
  {
    "nodeId": "1:2",
    "document": {
      "id": "1:2",
      "name": "Selected Frame",
      "type": "FRAME",
      "x": 0,
      "y": 0,
      "width": 400,
      "height": 300,
      "children": [...]
    }
  },
  {
    "nodeId": "1:5",
    "document": {
      "id": "1:5",
      "name": "Selected Rectangle",
      "type": "RECTANGLE",
      "x": 500,
      "y": 0,
      "width": 100,
      "height": 100
    }
  }
]
```

Returns an array of objects containing filtered JSON for each selected node.

---

## Test Scenarios

### Test 1: Read Design with Single Selection

**Purpose:** Verify basic operation with one selected node.

**Prerequisites:**
1. Create a rectangle
2. Select it in Figma UI

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- Response is array with 1 item
- Item contains `nodeId` and `document`
- `document` has full node properties

**Verification Steps:**
1. Check response is array of length 1
2. Verify `nodeId` matches selected node
3. Verify `document` contains node properties

---

### Test 2: Read Design with Multiple Selections

**Purpose:** Verify operation with multiple selected nodes.

**Prerequisites:**
1. Create 3 rectangles
2. Select all 3 in Figma (Cmd/Ctrl + click)

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- Response is array with 3 items
- All selected nodes' info included

---

### Test 3: Read Design with No Selection

**Purpose:** Verify response when nothing is selected.

**Prerequisites:**
- Deselect all nodes in Figma (click empty canvas)

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- Response is empty array `[]`
- No error thrown

---

### Test 4: Read Design with Frame and Children

**Purpose:** Verify frame children are included in export.

**Prerequisites:**
1. Create a frame with multiple child nodes
2. Select the parent frame only

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- Response includes frame
- Frame's `document.children` contains child node info
- Full hierarchy exported

---

### Test 5: Read Design with Different Node Types

**Purpose:** Verify different node types are exported correctly.

**Prerequisites:**
1. Create rectangle, frame, text node
2. Select all three

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- All three nodes in response
- Each has correct type-specific properties
- Text node includes `characters`

---

### Test 6: Read Design with Complex Frame

**Purpose:** Verify complex designs are fully exported.

**Prerequisites:**
1. Create a frame with:
   - Auto-layout
   - Fill color
   - Multiple nested children
2. Select the frame

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- Frame properties exported
- Auto-layout properties included
- All nested children included
- Fill information present

---

### Test 7: Read Design After Changing Selection

**Purpose:** Verify selection changes are reflected.

**Commands (manual selection between calls):**
```javascript
// Select node A, then:
{ command: "read_my_design", params: {} }

// User selects node B in Figma

// Read again
{ command: "read_my_design", params: {} }
```

**Expected Result:**
- First call returns node A info
- Second call returns node B info

---

### Test 8: Read Design with Component Instance

**Purpose:** Verify component instances are exported.

**Prerequisites:**
1. Have a component instance
2. Select it

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- Instance info exported
- Type shows as "INSTANCE"
- Instance properties included

---

### Test 9: Read Design with Text Content

**Purpose:** Verify text content is included.

**Prerequisites:**
1. Create text node with specific content
2. Select it

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- `document.characters` contains text content
- Font properties may be included

---

### Test 10: Read Design with Styled Nodes

**Purpose:** Verify styling information is exported.

**Prerequisites:**
1. Create rectangle with fill and stroke
2. Select it

**Command:**
```javascript
{
  command: "read_my_design",
  params: {}
}
```

**Expected Result:**
- `fills` array in document
- `strokes` array in document
- Color values present

---

### Test 11: Compare with get_nodes_info

**Purpose:** Verify output matches get_nodes_info for same nodes.

**Prerequisites:**
1. Create a rectangle, note its ID
2. Select it

**Commands:**
```javascript
// Using read_my_design
{ command: "read_my_design", params: {} }

// Using get_nodes_info with same ID
{ command: "get_nodes_info", params: { nodeIds: ["RECTANGLE_ID"] } }
```

**Expected Result:**
- Both commands return equivalent data
- Same structure and properties

---

## Sample Test Script

```javascript
/**
 * Test: read_my_design command
 * Prerequisites: Figma plugin connected, channel ID obtained
 *
 * IMPORTANT: Select nodes in Figma before running this test
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');
  console.log('\n⚠️  Make sure you have selected nodes in Figma!\n');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then read design
  setTimeout(() => {
    console.log('Reading selected design...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "read_my_design",
        params: {},
        commandId: "read_design_" + Date.now()
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
      console.log('\n=== Read My Design Result ===');
      console.log('Selected nodes:', result.length);

      if (result.length === 0) {
        console.log('\nNo nodes selected!');
        console.log('Select some nodes in Figma and try again.');
      } else {
        result.forEach((item, index) => {
          console.log(`\n--- Selected Node ${index + 1} ---`);
          console.log('Node ID:', item.nodeId);

          if (item.document) {
            console.log('Name:', item.document.name);
            console.log('Type:', item.document.type);
            console.log('Position: (' + item.document.x + ', ' + item.document.y + ')');
            console.log('Size:', item.document.width + 'x' + item.document.height);

            if (item.document.children) {
              console.log('Children:', item.document.children.length);
            }

            if (item.document.characters) {
              console.log('Text:', item.document.characters.substring(0, 50) + '...');
            }
          }
        });

        console.log('\n=== Full JSON (first node) ===');
        if (result[0] && result[0].document) {
          console.log(JSON.stringify(result[0].document, null, 2).substring(0, 1000) + '...');
        }
      }

      console.log('\n=== Validation ===');

      if (Array.isArray(result)) {
        console.log('✓ Response is an array');
      } else {
        console.log('✗ Response should be an array');
      }

      if (result.length > 0) {
        const allHaveNodeId = result.every(r => r.nodeId);
        const allHaveDocument = result.every(r => r.document);

        if (allHaveNodeId) {
          console.log('✓ All items have nodeId');
        } else {
          console.log('✗ Some items missing nodeId');
        }

        if (allHaveDocument) {
          console.log('✓ All items have document');
        } else {
          console.log('✗ Some items missing document');
        }
      }

      ws.close();
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
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
  console.log('Timeout - closing connection');
  ws.close();
}, 20000);
```

---

## Validation Checklist

- [ ] Response is an array
- [ ] Empty selection returns empty array
- [ ] Single selection returns array with 1 item
- [ ] Multiple selections return all nodes
- [ ] Each item has `nodeId` property
- [ ] Each item has `document` property
- [ ] `document` contains `id`, `name`, `type`
- [ ] `document` contains position and size
- [ ] Frame children included in `document.children`
- [ ] Different node types exported correctly
- [ ] Text nodes include `characters`
- [ ] Styled nodes include `fills` and `strokes`
- [ ] Component instances show type "INSTANCE"
- [ ] Selection changes reflected in subsequent calls
- [ ] Output equivalent to `get_nodes_info` for same nodes
- [ ] Complex nested structures fully exported
