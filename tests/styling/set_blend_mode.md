# Test Case: set_blend_mode

## Command
`set_blend_mode`

## Description
Sets the blend mode of a node, controlling how it blends with content below it.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify |
| `blendMode` | string | **Yes** | - | Blend mode to apply |

### Supported Blend Modes

| Mode | Description |
|------|-------------|
| `PASS_THROUGH` | Default for groups/frames |
| `NORMAL` | No blending |
| `DARKEN` | Keeps darker pixels |
| `MULTIPLY` | Multiplies colors |
| `LINEAR_BURN` | Darker than multiply |
| `COLOR_BURN` | Darkens with contrast |
| `LIGHTEN` | Keeps lighter pixels |
| `SCREEN` | Lightens overall |
| `LINEAR_DODGE` | Lighter than screen |
| `COLOR_DODGE` | Brightens with contrast |
| `OVERLAY` | Combination of multiply/screen |
| `SOFT_LIGHT` | Gentle overlay |
| `HARD_LIGHT` | Strong overlay |
| `DIFFERENCE` | Subtracts colors |
| `EXCLUSION` | Lower contrast difference |
| `HUE` | Uses hue only |
| `SATURATION` | Uses saturation only |
| `COLOR` | Uses hue and saturation |
| `LUMINOSITY` | Uses luminance only |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "blendMode": "MULTIPLY"
}
```

---

## Test Scenarios

### Test 1: Set Normal Blend Mode

**Purpose:** Verify normal blend mode.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "NORMAL"
  }
}
```

**Expected Result:**
- Node uses normal blending
- `blendMode` equals "NORMAL"

---

### Test 2: Set Multiply Blend Mode

**Purpose:** Verify multiply blend mode.

**Prerequisites:**
- Create colored rectangle overlapping another element

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "MULTIPLY"
  }
}
```

**Expected Result:**
- Node multiplies with content below
- Creates darkening effect

---

### Test 3: Set Screen Blend Mode

**Purpose:** Verify screen blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "SCREEN"
  }
}
```

**Expected Result:**
- Node screens with content below
- Creates lightening effect

---

### Test 4: Set Overlay Blend Mode

**Purpose:** Verify overlay blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "OVERLAY"
  }
}
```

**Expected Result:**
- Combination of multiply and screen

---

### Test 5: Set Darken Blend Mode

**Purpose:** Verify darken blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "DARKEN"
  }
}
```

**Expected Result:**
- Only darker pixels shown

---

### Test 6: Set Lighten Blend Mode

**Purpose:** Verify lighten blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "LIGHTEN"
  }
}
```

**Expected Result:**
- Only lighter pixels shown

---

### Test 7: Set Difference Blend Mode

**Purpose:** Verify difference blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "DIFFERENCE"
  }
}
```

**Expected Result:**
- Colors inverted based on overlap

---

### Test 8: Set Soft Light Blend Mode

**Purpose:** Verify soft light blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "SOFT_LIGHT"
  }
}
```

**Expected Result:**
- Gentle contrast adjustment

---

### Test 9: Set Color Blend Mode

**Purpose:** Verify color blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "COLOR"
  }
}
```

**Expected Result:**
- Uses hue and saturation from node

---

### Test 10: Set Luminosity Blend Mode

**Purpose:** Verify luminosity blend mode.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID",
    blendMode: "LUMINOSITY"
  }
}
```

**Expected Result:**
- Uses luminance from node

---

### Test 11: Missing blendMode (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing blendMode parameter"

---

### Test 12: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_blend_mode",
  params: {
    nodeId: "999:999",
    blendMode: "MULTIPLY"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_blend_mode command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const blendModes = [
  "NORMAL",
  "MULTIPLY",
  "SCREEN",
  "OVERLAY",
  "DARKEN",
  "LIGHTEN",
  "DIFFERENCE",
  "SOFT_LIGHT",
  "HARD_LIGHT",
  "COLOR"
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
        params: { width: 100, height: 100, name: "Blend Mode Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runBlendTest() {
  if (currentTest >= blendModes.length) {
    console.log('\n=== All blend mode tests complete ===');
    ws.close();
    return;
  }

  const mode = blendModes[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${mode}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_blend_mode",
      params: { nodeId: createdNodeId, blendMode: mode },
      commandId: `blend_${currentTest}`
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
      phase = 'blend';
      setTimeout(() => runBlendTest(), 500);
    } else if (result && phase === 'blend') {
      console.log('  Blend mode:', result.blendMode);

      if (result.blendMode === blendModes[currentTest]) {
        console.log('  ✓ Blend mode set correctly');
      } else {
        console.log('  ✗ Blend mode mismatch');
      }

      currentTest++;
      setTimeout(() => runBlendTest(), 500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] NORMAL blend mode works
- [ ] MULTIPLY blend mode works
- [ ] SCREEN blend mode works
- [ ] OVERLAY blend mode works
- [ ] DARKEN blend mode works
- [ ] LIGHTEN blend mode works
- [ ] DIFFERENCE blend mode works
- [ ] SOFT_LIGHT blend mode works
- [ ] HARD_LIGHT blend mode works
- [ ] COLOR blend mode works
- [ ] LUMINOSITY blend mode works
- [ ] Error for missing blendMode
- [ ] Error for non-existent node
- [ ] Response contains `blendMode` field
- [ ] Blend mode visible in Figma layer properties
