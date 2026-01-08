# Test Case: get_node_info

## Command
`get_node_info`

## Description
Gets detailed information for a single node by ID, exported as filtered JSON.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to get info for (colon format, e.g., "123:456") |

## Expected Response

```json
{
  "id": "1:2",
  "name": "Button",
  "type": "FRAME",
  "x": 100,
  "y": 50,
  "width": 200,
  "height": 48,
  "fills": [...],
  "strokes": [...],
  "children": [
    {
      "id": "1:3",
      "name": "Label",
      "type": "TEXT",
      "characters": "Click me"
    }
  ]
}
```

The response is a filtered JSON export of the node with all its properties and children.

---

## Test Scenarios

### Test 1: Get Info for Rectangle

**Purpose:** Verify basic node info retrieval.

**Prerequisites:**
1. Create a rectangle
2. Note its ID from the creation response

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Response contains node properties
- `type` is "RECTANGLE"
- Position, size, fills included

**Verification Steps:**
1. Check `id` matches requested ID
2. Check `type` equals "RECTANGLE"
3. Verify `x`, `y`, `width`, `height` present

---

### Test 2: Get Info for Frame

**Purpose:** Verify frame info including properties.

**Prerequisites:**
- Create a frame

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Response shows frame properties
- Layout mode, padding if applicable
- `type` is "FRAME"

---

### Test 3: Get Info for Frame with Children

**Purpose:** Verify children are included in response.

**Prerequisites:**
1. Create a frame
2. Create rectangles inside the frame

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "PARENT_FRAME_ID"
  }
}
```

**Expected Result:**
- Response includes `children` array
- Each child has its own properties
- Nested structure preserved

**Verification Steps:**
1. Check `children` array exists
2. Verify children have `id`, `name`, `type`
3. Children should have their own properties

---

### Test 4: Get Info for Text Node

**Purpose:** Verify text node details.

**Prerequisites:**
- Create a text node with specific content

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "TEXT_ID"
  }
}
```

**Expected Result:**
- `type` is "TEXT"
- `characters` contains text content
- Font properties included

---

### Test 5: Get Info for Auto-Layout Frame

**Purpose:** Verify auto-layout properties are included.

**Prerequisites:**
- Create a frame with `layoutMode: "HORIZONTAL"`

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID"
  }
}
```

**Expected Result:**
- `layoutMode` is "HORIZONTAL" or "VERTICAL"
- Padding, spacing properties present

---

### Test 6: Get Info for Styled Node

**Purpose:** Verify fill and stroke info.

**Prerequisites:**
1. Create a rectangle
2. Set fill color and stroke

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "STYLED_RECTANGLE_ID"
  }
}
```

**Expected Result:**
- `fills` array contains fill information
- `strokes` array contains stroke information
- Color values present

---

### Test 7: Get Info for Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 8: Get Info with URL Format Node ID (Error Case)

**Purpose:** Verify proper ID format is required.

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "123-456"  // Wrong format (dash instead of colon)
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 123-456"
- Must use colon format: "123:456"

---

### Test 9: Get Info for Deeply Nested Node

**Purpose:** Verify deeply nested structures work.

**Prerequisites:**
1. Create frame > frame > frame > rectangle
2. Get the innermost rectangle's ID

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "DEEPLY_NESTED_RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Node info returned regardless of nesting depth
- Parent hierarchy not included (just the node itself)

---

### Test 10: Get Info for Component Instance

**Purpose:** Verify component instance details.

**Prerequisites:**
- Have a component instance on the page

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "INSTANCE_ID"
  }
}
```

**Expected Result:**
- `type` is "INSTANCE"
- Component reference information may be included

---

### Test 11: Verify Position and Size Accuracy

**Purpose:** Verify coordinates match created values.

**Prerequisites:**
1. Create rectangle at x:150, y:200, width:100, height:50

**Command:**
```javascript
{
  command: "get_node_info",
  params: {
    nodeId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- `x` equals 150
- `y` equals 200
- `width` equals 100
- `height` equals 50

---

### Test 12: Get Info After Node Modification

**Purpose:** Verify updated info is returned.

**Commands (execute sequentially):**
```javascript
// Create rectangle
{ command: "create_rectangle", params: { x: 0, y: 0, width: 100, height: 100 } }

// Get initial info
{ command: "get_node_info", params: { nodeId: "RECTANGLE_ID" } }

// Resize it
{ command: "resize_node", params: { nodeId: "RECTANGLE_ID", width: 200, height: 150 } }

// Get updated info
{ command: "get_node_info", params: { nodeId: "RECTANGLE_ID" } }
```

**Expected Result:**
- Second get_node_info shows updated dimensions

---

## Sample Test Script

```javascript
/**
 * Test: get_node_info command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let testNodeId = null;
let phase = 'create';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create test node
  setTimeout(() => {
    console.log('Creating test node...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { x: 100, y: 50, width: 200, height: 100, name: "Info Test" },
        commandId: "create_test"
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
      if (phase === 'create') {
        testNodeId = result.id;
        console.log('Created test node:', testNodeId);
        phase = 'get_info';

        // Get node info
        setTimeout(() => {
          console.log('\nGetting node info...');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "get_node_info",
              params: { nodeId: testNodeId },
              commandId: "get_info_test"
            }
          }));
        }, 500);

      } else if (phase === 'get_info') {
        console.log('\n=== Node Info ===');
        console.log('ID:', result.id);
        console.log('Name:', result.name);
        console.log('Type:', result.type);
        console.log('Position: (' + result.x + ', ' + result.y + ')');
        console.log('Size:', result.width + 'x' + result.height);

        if (result.fills) {
          console.log('Fills:', result.fills.length, 'fill(s)');
        }

        if (result.children) {
          console.log('Children:', result.children.length);
        }

        console.log('\n=== Full Response ===');
        console.log(JSON.stringify(result, null, 2));

        console.log('\n=== Validation ===');

        if (result.id === testNodeId) {
          console.log('✓ ID matches requested ID');
        } else {
          console.log('✗ ID mismatch');
        }

        if (result.type === 'RECTANGLE') {
          console.log('✓ Type is RECTANGLE');
        } else {
          console.log('✗ Expected RECTANGLE, got', result.type);
        }

        // Test error case
        phase = 'error_test';
        console.log('\nTesting error case (invalid ID)...');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "get_node_info",
            params: { nodeId: "999:999" },
            commandId: "error_test"
          }
        }));

        setTimeout(() => ws.close(), 3000);
      }
    }

    if (parsed.message.error) {
      console.log('Error received:', parsed.message.error);
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
}, 30000);
```

---

## Validation Checklist

- [ ] Response contains `id`, `name`, `type`
- [ ] `id` matches requested node ID
- [ ] Position (`x`, `y`) included
- [ ] Size (`width`, `height`) included
- [ ] `fills` array present for shapes
- [ ] `strokes` array present for shapes
- [ ] Text nodes include `characters`
- [ ] Frame children included in response
- [ ] Auto-layout properties included for AL frames
- [ ] Error returned for non-existent node ID
- [ ] Error returned for wrong ID format (dash vs colon)
- [ ] Deeply nested nodes accessible by ID
- [ ] Component instances show type "INSTANCE"
- [ ] Updated info returned after modification
- [ ] Position and size values are accurate
