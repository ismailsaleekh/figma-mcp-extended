# Test Case: group_nodes

## Command
`group_nodes`

## Description
Groups multiple nodes together into a group node. All nodes must have the same parent.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeIds` | array | **Yes** | - | Array of node IDs to group (minimum 1) |
| `name` | string | No | "Group" | Name for the group |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Group",
  "type": "GROUP",
  "childCount": 3,
  "children": [
    { "id": "1:1", "name": "Rectangle" },
    { "id": "1:2", "name": "Ellipse" },
    { "id": "1:3", "name": "Text" }
  ]
}
```

---

## Test Scenarios

### Test 1: Group Two Rectangles

**Purpose:** Verify basic grouping.

**Prerequisites:**
- Create two rectangles, note their IDs

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: ["RECT1_ID", "RECT2_ID"]
  }
}
```

**Expected Result:**
- Group created containing both rectangles
- `type` equals "GROUP"
- `childCount` equals 2

---

### Test 2: Group with Custom Name

**Purpose:** Verify custom group naming.

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: ["NODE1_ID", "NODE2_ID"],
    name: "Button Group"
  }
}
```

**Expected Result:**
- Group has name "Button Group"

---

### Test 3: Group Multiple Node Types

**Purpose:** Verify different node types can be grouped.

**Prerequisites:**
- Create rectangle, ellipse, and text node

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: ["RECT_ID", "ELLIPSE_ID", "TEXT_ID"],
    name: "Mixed Group"
  }
}
```

**Expected Result:**
- All three nodes grouped together
- `childCount` equals 3

---

### Test 4: Group Single Node

**Purpose:** Verify single node can be grouped.

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: ["SINGLE_NODE_ID"]
  }
}
```

**Expected Result:**
- Group created with one child
- `childCount` equals 1

---

### Test 5: Group Many Nodes

**Purpose:** Verify grouping many nodes.

**Prerequisites:**
- Create 5+ nodes

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: ["ID1", "ID2", "ID3", "ID4", "ID5"],
    name: "Large Group"
  }
}
```

**Expected Result:**
- All nodes grouped
- `childCount` equals 5

---

### Test 6: Empty nodeIds Array (Error Case)

**Purpose:** Verify error for empty array.

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: []
  }
}
```

**Expected Result:**
- Error: "nodeIds must be an array with at least 1 node ID"

---

### Test 7: Nodes with Different Parents (Error Case)

**Purpose:** Verify error when nodes have different parents.

**Prerequisites:**
- Create nodes in different frames

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: ["NODE_IN_FRAME1", "NODE_IN_FRAME2"]
  }
}
```

**Expected Result:**
- Error: "All nodes must have the same parent to be grouped"

---

### Test 8: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "group_nodes",
  params: {
    nodeIds: ["999:999", "888:888"]
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: group_nodes command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let nodeIds = [];
let phase = 'create';
let createCount = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    // Create 3 rectangles
    for (let i = 0; i < 3; i++) {
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_rectangle",
          params: { x: i * 120, y: 0, width: 100, height: 100, name: `Rect ${i + 1}` },
          commandId: `create_${i}`
        }
      }));
    }
  }, 2000);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'create') {
      nodeIds.push(result.id);
      createCount++;
      console.log('Created node:', result.id);

      if (createCount === 3) {
        phase = 'group';
        console.log('\nGrouping nodes:', nodeIds);

        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "group_nodes",
            params: { nodeIds: nodeIds, name: "My Group" },
            commandId: "group"
          }
        }));
      }
    } else if (result && phase === 'group') {
      console.log('\n=== Group Created ===');
      console.log('ID:', result.id);
      console.log('Name:', result.name);
      console.log('Type:', result.type);
      console.log('Child count:', result.childCount);
      console.log('Children:', result.children.map(c => c.name).join(', '));

      if (result.type === 'GROUP' && result.childCount === 3) {
        console.log('✓ Group created successfully');
      }

      ws.close();
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Two nodes group successfully
- [ ] Custom group name applied
- [ ] Different node types can be grouped
- [ ] Single node can be grouped
- [ ] Many nodes (5+) can be grouped
- [ ] `type` equals "GROUP"
- [ ] `childCount` is accurate
- [ ] `children` array lists all grouped nodes
- [ ] Error for empty nodeIds array
- [ ] Error for nodes with different parents
- [ ] Error for non-existent node
- [ ] Group visible in Figma layers panel
