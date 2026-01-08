# Test Case: set_opacity

## Command
`set_opacity`

## Description
Sets the opacity (transparency) of a node. Value ranges from 0 (fully transparent) to 1 (fully opaque).

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify |
| `opacity` | number | **Yes** | - | Opacity value (0-1) |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "opacity": 0.5
}
```

---

## Test Scenarios

### Test 1: Set 50% Opacity

**Purpose:** Verify basic opacity setting.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "NODE_ID",
    opacity: 0.5
  }
}
```

**Expected Result:**
- Node is 50% transparent
- Response shows `opacity: 0.5`

---

### Test 2: Set Full Opacity (1)

**Purpose:** Verify fully opaque setting.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "NODE_ID",
    opacity: 1
  }
}
```

**Expected Result:**
- Node is fully visible
- `opacity` equals 1

---

### Test 3: Set Zero Opacity (Invisible)

**Purpose:** Verify fully transparent setting.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "NODE_ID",
    opacity: 0
  }
}
```

**Expected Result:**
- Node is invisible (but still exists)
- `opacity` equals 0

---

### Test 4: Set 25% Opacity

**Purpose:** Verify low opacity value.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "NODE_ID",
    opacity: 0.25
  }
}
```

**Expected Result:**
- Node is 75% transparent

---

### Test 5: Set 75% Opacity

**Purpose:** Verify high opacity value.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "NODE_ID",
    opacity: 0.75
  }
}
```

**Expected Result:**
- Node is 25% transparent

---

### Test 6: Set Opacity on Frame

**Purpose:** Verify opacity works on frames.

**Prerequisites:**
- Create a frame with content inside

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "FRAME_ID",
    opacity: 0.5
  }
}
```

**Expected Result:**
- Frame and all children are 50% transparent

---

### Test 7: Set Opacity on Text

**Purpose:** Verify opacity works on text nodes.

**Prerequisites:**
- Create a text node

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "TEXT_NODE_ID",
    opacity: 0.5
  }
}
```

**Expected Result:**
- Text is 50% transparent

---

### Test 8: Invalid Opacity Value > 1 (Error Case)

**Purpose:** Verify error for out-of-range value.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "NODE_ID",
    opacity: 1.5
  }
}
```

**Expected Result:**
- Error: "opacity must be a number between 0 and 1"

---

### Test 9: Invalid Opacity Value < 0 (Error Case)

**Purpose:** Verify error for negative value.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "NODE_ID",
    opacity: -0.5
  }
}
```

**Expected Result:**
- Error: "opacity must be a number between 0 and 1"

---

### Test 10: Missing nodeId (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    opacity: 0.5
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 11: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_opacity",
  params: {
    nodeId: "999:999",
    opacity: 0.5
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_opacity command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const opacityTests = [
  { name: "50% opacity", opacity: 0.5 },
  { name: "Full opacity", opacity: 1 },
  { name: "Zero opacity", opacity: 0 },
  { name: "25% opacity", opacity: 0.25 },
  { name: "75% opacity", opacity: 0.75 }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Creating test rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { width: 100, height: 100, name: "Opacity Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runOpacityTest() {
  if (currentTest >= opacityTests.length) {
    console.log('\n=== All opacity tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid opacity)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_opacity",
        params: { nodeId: createdNodeId, opacity: 1.5 },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = opacityTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_opacity",
      params: { nodeId: createdNodeId, opacity: test.opacity },
      commandId: `opacity_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created node:', createdNodeId);
      phase = 'opacity';
      setTimeout(() => runOpacityTest(), 500);
    } else if (result && phase === 'opacity') {
      console.log('  Opacity:', result.opacity);
      console.log('  ✓ Opacity set successfully');

      currentTest++;
      setTimeout(() => runOpacityTest(), 500);
    }

    if (error) {
      console.log('Error:', error);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] 50% opacity applied correctly
- [ ] Full opacity (1) makes node fully visible
- [ ] Zero opacity (0) makes node invisible
- [ ] Various opacity values work (0.25, 0.75, etc.)
- [ ] Opacity works on rectangles
- [ ] Opacity works on frames
- [ ] Opacity works on text nodes
- [ ] Frame opacity affects all children
- [ ] Error for opacity > 1
- [ ] Error for opacity < 0
- [ ] Error for missing nodeId
- [ ] Error for non-existent node
- [ ] Response contains `id`, `name`, `opacity`
- [ ] Visual opacity matches value in Figma
