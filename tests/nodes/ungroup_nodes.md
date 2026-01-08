# Test Case: ungroup_nodes

## Command
`ungroup_nodes`

## Description
Ungroups a group node, moving its children to the group's parent and removing the empty group.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of the group to ungroup |

## Expected Response

```json
{
  "success": true,
  "ungroupedChildren": [
    { "id": "1:1", "name": "Rectangle", "type": "RECTANGLE" },
    { "id": "1:2", "name": "Ellipse", "type": "ELLIPSE" }
  ]
}
```

---

## Test Scenarios

### Test 1: Ungroup Simple Group

**Purpose:** Verify basic ungrouping.

**Prerequisites:**
- Create a group with 2+ nodes
- Note the group ID

**Command:**
```javascript
{
  command: "ungroup_nodes",
  params: {
    nodeId: "GROUP_ID"
  }
}
```

**Expected Result:**
- Group is removed
- Children moved to parent
- `success` is true
- `ungroupedChildren` lists all former children

---

### Test 2: Ungroup Large Group

**Purpose:** Verify ungrouping many children.

**Prerequisites:**
- Create group with 5+ nodes

**Command:**
```javascript
{
  command: "ungroup_nodes",
  params: {
    nodeId: "LARGE_GROUP_ID"
  }
}
```

**Expected Result:**
- All children moved to parent
- `ungroupedChildren` has 5+ items

---

### Test 3: Ungroup Nested Group

**Purpose:** Verify nested group can be ungrouped.

**Prerequisites:**
- Create a group inside another group

**Command:**
```javascript
{
  command: "ungroup_nodes",
  params: {
    nodeId: "NESTED_GROUP_ID"
  }
}
```

**Expected Result:**
- Nested group removed
- Children move to outer group/parent

---

### Test 4: Ungroup Non-Group Node (Error Case)

**Purpose:** Verify error when node is not a group.

**Command:**
```javascript
{
  command: "ungroup_nodes",
  params: {
    nodeId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Error: "Node is not a GROUP"

---

### Test 5: Ungroup Frame (Error Case)

**Purpose:** Verify frames cannot be ungrouped.

**Command:**
```javascript
{
  command: "ungroup_nodes",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Error: "Node is not a GROUP"

---

### Test 6: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "ungroup_nodes",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 7: Missing nodeId (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "ungroup_nodes",
  params: {}
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

## Sample Test Script

```javascript
/**
 * Test: ungroup_nodes command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let nodeIds = [];
let groupId = null;
let phase = 'create';
let createCount = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    // Create 2 rectangles
    for (let i = 0; i < 2; i++) {
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
    const error = parsed.message.error;

    if (result && phase === 'create') {
      nodeIds.push(result.id);
      createCount++;

      if (createCount === 2) {
        phase = 'group';
        console.log('Grouping nodes...');

        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "group_nodes",
            params: { nodeIds: nodeIds, name: "Test Group" },
            commandId: "group"
          }
        }));
      }
    } else if (result && phase === 'group') {
      groupId = result.id;
      console.log('Group created:', groupId);
      phase = 'ungroup';

      // Ungroup it
      console.log('\nUngrouping...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "ungroup_nodes",
          params: { nodeId: groupId },
          commandId: "ungroup"
        }
      }));
    } else if (result && phase === 'ungroup') {
      console.log('\n=== Ungroup Result ===');
      console.log('Success:', result.success);
      console.log('Ungrouped children:');
      result.ungroupedChildren.forEach(child => {
        console.log(`  - ${child.name} (${child.type})`);
      });

      if (result.success && result.ungroupedChildren.length === 2) {
        console.log('✓ Ungroup successful');
      }

      ws.close();
    }

    if (error) {
      console.log('Error:', error);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Simple group ungroups successfully
- [ ] `success` is true
- [ ] `ungroupedChildren` lists all children
- [ ] Children moved to parent
- [ ] Group node is removed
- [ ] Large group (5+ children) ungroups
- [ ] Nested group can be ungrouped
- [ ] Error for non-group node (rectangle)
- [ ] Error for frame node
- [ ] Error for non-existent node
- [ ] Error for missing nodeId
- [ ] Children maintain their properties after ungroup
