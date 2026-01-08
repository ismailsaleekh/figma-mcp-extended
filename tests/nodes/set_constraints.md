# Test Case: set_constraints

## Command
`set_constraints`

## Description
Sets the resize constraints on a node, controlling how it behaves when its parent is resized.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify |
| `horizontal` | string | No | - | Horizontal constraint |
| `vertical` | string | No | - | Vertical constraint |

### Constraint Values

| Value | Description |
|-------|-------------|
| `MIN` | Pin to left/top edge |
| `MAX` | Pin to right/bottom edge |
| `CENTER` | Pin to center |
| `STRETCH` | Stretch to fill |
| `SCALE` | Scale proportionally |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "constraints": {
    "horizontal": "MIN",
    "vertical": "MIN"
  }
}
```

---

## Test Scenarios

### Test 1: Set Horizontal Constraint to MIN (Left)

**Purpose:** Verify left pinning.

**Prerequisites:**
- Create a rectangle inside a frame
- Note the rectangle's ID

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    horizontal: "MIN"
  }
}
```

**Expected Result:**
- Node pinned to left
- `constraints.horizontal` equals "MIN"

---

### Test 2: Set Horizontal Constraint to MAX (Right)

**Purpose:** Verify right pinning.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    horizontal: "MAX"
  }
}
```

**Expected Result:**
- Node pinned to right

---

### Test 3: Set Horizontal Constraint to CENTER

**Purpose:** Verify center horizontal constraint.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    horizontal: "CENTER"
  }
}
```

**Expected Result:**
- Node centered horizontally

---

### Test 4: Set Horizontal Constraint to STRETCH

**Purpose:** Verify horizontal stretch.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    horizontal: "STRETCH"
  }
}
```

**Expected Result:**
- Node stretches horizontally with parent

---

### Test 5: Set Vertical Constraint to MIN (Top)

**Purpose:** Verify top pinning.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    vertical: "MIN"
  }
}
```

**Expected Result:**
- Node pinned to top

---

### Test 6: Set Vertical Constraint to MAX (Bottom)

**Purpose:** Verify bottom pinning.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    vertical: "MAX"
  }
}
```

**Expected Result:**
- Node pinned to bottom

---

### Test 7: Set Vertical Constraint to CENTER

**Purpose:** Verify center vertical constraint.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    vertical: "CENTER"
  }
}
```

**Expected Result:**
- Node centered vertically

---

### Test 8: Set Both Constraints

**Purpose:** Verify setting both at once.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    horizontal: "STRETCH",
    vertical: "STRETCH"
  }
}
```

**Expected Result:**
- Node stretches both ways
- Both constraints updated

---

### Test 9: Set SCALE Constraint

**Purpose:** Verify scale constraint.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "NODE_ID",
    horizontal: "SCALE",
    vertical: "SCALE"
  }
}
```

**Expected Result:**
- Node scales proportionally

---

### Test 10: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    nodeId: "999:999",
    horizontal: "MIN"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 11: Missing nodeId (Error Case)

**Purpose:** Verify error for missing nodeId.

**Command:**
```javascript
{
  command: "set_constraints",
  params: {
    horizontal: "MIN"
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

## Sample Test Script

```javascript
/**
 * Test: set_constraints command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let frameId = null;
let rectId = null;
let phase = 'create_frame';

const constraintTests = [
  { name: "Left (MIN)", params: { horizontal: "MIN" } },
  { name: "Right (MAX)", params: { horizontal: "MAX" } },
  { name: "Center H", params: { horizontal: "CENTER" } },
  { name: "Stretch H", params: { horizontal: "STRETCH" } },
  { name: "Top (MIN)", params: { vertical: "MIN" } },
  { name: "Bottom (MAX)", params: { vertical: "MAX" } },
  { name: "Both STRETCH", params: { horizontal: "STRETCH", vertical: "STRETCH" } }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    // First create a frame
    console.log('Creating frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: { width: 400, height: 300, name: "Constraints Container" },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

function runConstraintTest() {
  if (currentTest >= constraintTests.length) {
    console.log('\n=== All constraint tests complete ===');
    ws.close();
    return;
  }

  const test = constraintTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_constraints",
      params: { nodeId: rectId, ...test.params },
      commandId: `constraint_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'create_frame') {
      frameId = result.id;
      console.log('Frame created:', frameId);
      phase = 'create_rect';

      // Create rectangle inside frame
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_rectangle",
          params: { parentId: frameId, x: 50, y: 50, width: 100, height: 100, name: "Constraint Test" },
          commandId: "create_rect"
        }
      }));
    } else if (result && phase === 'create_rect') {
      rectId = result.id;
      console.log('Rectangle created:', rectId);
      phase = 'constraints';
      setTimeout(() => runConstraintTest(), 500);
    } else if (result && phase === 'constraints') {
      console.log('  Constraints:', JSON.stringify(result.constraints));
      console.log('  ✓ Constraint set successfully');

      currentTest++;
      setTimeout(() => runConstraintTest(), 500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Horizontal MIN (left) works
- [ ] Horizontal MAX (right) works
- [ ] Horizontal CENTER works
- [ ] Horizontal STRETCH works
- [ ] Horizontal SCALE works
- [ ] Vertical MIN (top) works
- [ ] Vertical MAX (bottom) works
- [ ] Vertical CENTER works
- [ ] Vertical STRETCH works
- [ ] Vertical SCALE works
- [ ] Both constraints set together works
- [ ] Error for non-existent node
- [ ] Error for missing nodeId
- [ ] Response contains `constraints` object
- [ ] Constraints visible in Figma design panel
