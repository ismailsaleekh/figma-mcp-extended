# Test Case: get_document_info

## Command
`get_document_info`

## Description
Gets information about the current page/document including its children (top-level frames).

## Parameters

None required.

## Expected Response

```json
{
  "name": "Page 1",
  "id": "0:1",
  "type": "PAGE",
  "children": [
    {
      "id": "1:2",
      "name": "Frame 1",
      "type": "FRAME"
    },
    {
      "id": "1:3",
      "name": "Rectangle 1",
      "type": "RECTANGLE"
    }
  ],
  "currentPage": {
    "id": "0:1",
    "name": "Page 1",
    "childCount": 2
  },
  "pages": [
    {
      "id": "0:1",
      "name": "Page 1",
      "childCount": 2
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Get Document Info on Empty Page

**Purpose:** Verify response when page has no children.

**Prerequisites:**
- Start with an empty Figma page

**Command:**
```javascript
{
  command: "get_document_info",
  params: {}
}
```

**Expected Result:**
- Response contains page name, id, type
- `children` array is empty
- `childCount` is 0

**Verification Steps:**
1. Check `type` equals "PAGE"
2. Check `children` is empty array
3. Check `currentPage.childCount` equals 0

---

### Test 2: Get Document Info with Multiple Children

**Purpose:** Verify all top-level nodes are listed.

**Prerequisites:**
1. Create several rectangles and frames on the page
2. Note the number of elements created

**Command:**
```javascript
{
  command: "get_document_info",
  params: {}
}
```

**Expected Result:**
- All top-level nodes listed in `children`
- Each child has `id`, `name`, `type`
- `childCount` matches actual count

**Verification Steps:**
1. Count items in `children` array
2. Verify count matches `currentPage.childCount`
3. Each child should have valid id, name, type

---

### Test 3: Verify Child Node Details

**Purpose:** Verify child node information is accurate.

**Prerequisites:**
1. Create a frame named "Test Frame"
2. Create a rectangle named "Test Rectangle"

**Command:**
```javascript
{
  command: "get_document_info",
  params: {}
}
```

**Expected Result:**
- Children array contains both nodes
- Names match what was created
- Types are correct ("FRAME", "RECTANGLE")

---

### Test 4: Get Document Info After Adding Nodes

**Purpose:** Verify document info updates after changes.

**Commands (execute sequentially):**
```javascript
// Get initial info
{ command: "get_document_info", params: {} }

// Create a rectangle
{ command: "create_rectangle", params: { x: 0, y: 0, width: 100, height: 100 } }

// Get updated info
{ command: "get_document_info", params: {} }
```

**Expected Result:**
- Second call shows increased `childCount`
- New rectangle appears in `children` array

---

### Test 5: Get Document Info After Deleting Nodes

**Purpose:** Verify document info updates after deletion.

**Prerequisites:**
1. Create a rectangle, note its ID
2. Get initial document info
3. Delete the rectangle
4. Get document info again

**Expected Result:**
- Deleted node no longer in `children` array
- `childCount` decreased by 1

---

### Test 6: Verify Page Metadata

**Purpose:** Verify currentPage and pages arrays.

**Command:**
```javascript
{
  command: "get_document_info",
  params: {}
}
```

**Expected Result:**
- `currentPage.id` matches `id`
- `currentPage.name` matches `name`
- `pages` array contains at least current page

---

### Test 7: Get Document Info with Nested Frames

**Purpose:** Verify only top-level children are returned.

**Prerequisites:**
1. Create a frame
2. Create rectangles inside the frame (nested)

**Command:**
```javascript
{
  command: "get_document_info",
  params: {}
}
```

**Expected Result:**
- Only top-level frame appears in `children`
- Nested rectangles are NOT in top-level `children`
- Use `get_node_info` to see nested children

---

### Test 8: Verify Different Node Types in Children

**Purpose:** Verify various node types are correctly identified.

**Prerequisites:**
Create one of each:
- Rectangle
- Frame
- Text node
- Ellipse (if available)

**Command:**
```javascript
{
  command: "get_document_info",
  params: {}
}
```

**Expected Result:**
- Each node type correctly identified
- Types: "RECTANGLE", "FRAME", "TEXT", etc.

---

## Sample Test Script

```javascript
/**
 * Test: get_document_info command
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

  // Wait for join, then get document info
  setTimeout(() => {
    console.log('Getting document info...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_document_info",
        params: {},
        commandId: "doc_info_" + Date.now()
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
      console.log('\n=== Document Info ===');
      console.log('Page Name:', result.name);
      console.log('Page ID:', result.id);
      console.log('Page Type:', result.type);
      console.log('Child Count:', result.currentPage.childCount);

      console.log('\n=== Children ===');
      if (result.children && result.children.length > 0) {
        result.children.forEach((child, index) => {
          console.log(`${index + 1}. ${child.name} (${child.type}) - ID: ${child.id}`);
        });
      } else {
        console.log('No children on this page');
      }

      console.log('\n=== Validation ===');
      if (result.type === 'PAGE') {
        console.log('✓ Type is PAGE');
      } else {
        console.log('✗ Type should be PAGE');
      }

      if (result.children.length === result.currentPage.childCount) {
        console.log('✓ Child count matches');
      } else {
        console.log('✗ Child count mismatch');
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

- [ ] Response contains `name`, `id`, `type`
- [ ] `type` equals "PAGE"
- [ ] `children` is an array
- [ ] Each child has `id`, `name`, `type`
- [ ] `currentPage` object contains `id`, `name`, `childCount`
- [ ] `pages` array contains current page
- [ ] `childCount` matches `children.length`
- [ ] Only top-level nodes appear in `children`
- [ ] Nested nodes not in top-level `children`
- [ ] Document info updates after adding nodes
- [ ] Document info updates after deleting nodes
- [ ] Different node types correctly identified
