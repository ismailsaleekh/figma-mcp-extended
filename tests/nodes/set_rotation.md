# Test Case: set_rotation

## Command
`set_rotation`

## Description
Sets the rotation angle on a node in degrees.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to rotate |
| `rotation` | number | **Yes** | - | Rotation angle in degrees |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "rotation": 45
}
```

---

## Test Scenarios

### Test 1: Rotate 45 Degrees

**Purpose:** Verify basic rotation.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: 45
  }
}
```

**Expected Result:**
- Node rotated 45 degrees
- `rotation` equals 45

---

### Test 2: Rotate 90 Degrees

**Purpose:** Verify quarter rotation.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: 90
  }
}
```

**Expected Result:**
- Node rotated 90 degrees (quarter turn)

---

### Test 3: Rotate 180 Degrees

**Purpose:** Verify half rotation.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: 180
  }
}
```

**Expected Result:**
- Node rotated 180 degrees (upside down)

---

### Test 4: Rotate Full Circle (360)

**Purpose:** Verify full rotation.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: 360
  }
}
```

**Expected Result:**
- Node appears unchanged (full rotation)

---

### Test 5: Rotate Negative Degrees

**Purpose:** Verify negative (counter-clockwise) rotation.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: -45
  }
}
```

**Expected Result:**
- Node rotated -45 degrees (counter-clockwise)

---

### Test 6: Rotate Zero Degrees

**Purpose:** Verify reset to no rotation.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: 0
  }
}
```

**Expected Result:**
- Node has no rotation

---

### Test 7: Rotate Small Angle

**Purpose:** Verify small rotation.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: 15
  }
}
```

**Expected Result:**
- Node rotated 15 degrees

---

### Test 8: Rotate Decimal Angle

**Purpose:** Verify decimal rotation value.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID",
    rotation: 22.5
  }
}
```

**Expected Result:**
- Node rotated 22.5 degrees

---

### Test 9: Rotate Frame with Children

**Purpose:** Verify frame rotation affects children.

**Prerequisites:**
- Create frame with children inside

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "FRAME_ID",
    rotation: 30
  }
}
```

**Expected Result:**
- Frame and children rotate together

---

### Test 10: Missing rotation (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing rotation parameter"

---

### Test 11: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_rotation",
  params: {
    nodeId: "999:999",
    rotation: 45
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_rotation command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const rotationTests = [
  { name: "45 degrees", rotation: 45 },
  { name: "90 degrees", rotation: 90 },
  { name: "180 degrees", rotation: 180 },
  { name: "-45 degrees", rotation: -45 },
  { name: "0 degrees (reset)", rotation: 0 },
  { name: "22.5 degrees", rotation: 22.5 }
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
        params: { width: 100, height: 50, name: "Rotation Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runRotationTest() {
  if (currentTest >= rotationTests.length) {
    console.log('\n=== All rotation tests complete ===');
    ws.close();
    return;
  }

  const test = rotationTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_rotation",
      params: { nodeId: createdNodeId, rotation: test.rotation },
      commandId: `rotation_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created node:', createdNodeId);
      phase = 'rotation';
      setTimeout(() => runRotationTest(), 500);
    } else if (result && phase === 'rotation') {
      console.log('  Rotation:', result.rotation);
      console.log('  ✓ Rotation set successfully');

      currentTest++;
      setTimeout(() => runRotationTest(), 1000);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] 45 degree rotation works
- [ ] 90 degree rotation works
- [ ] 180 degree rotation works
- [ ] 360 degree rotation works
- [ ] Negative rotation (counter-clockwise) works
- [ ] Zero rotation resets to default
- [ ] Decimal rotation values work
- [ ] Frame rotation affects children
- [ ] Error for missing rotation
- [ ] Error for non-existent node
- [ ] Response contains `rotation` value
- [ ] Rotation visible and correct in Figma
