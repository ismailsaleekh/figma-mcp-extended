# Test Case: set_effects

## Command
`set_effects`

## Description
Sets visual effects (shadows and blurs) on a node. Supports drop shadows, inner shadows, layer blur, and background blur.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify |
| `effects` | array | **Yes** | - | Array of effect objects |

### Effect Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | **Yes** | "DROP_SHADOW", "INNER_SHADOW", "LAYER_BLUR", or "BACKGROUND_BLUR" |
| `visible` | boolean | No | Whether effect is visible (default: true) |
| `radius` | number | **Yes** | Blur radius |
| `color` | object | No* | Shadow color `{r, g, b, a}` (*required for shadows) |
| `offset` | object | No | Shadow offset `{x, y}` (default: {x:0, y:4}) |
| `spread` | number | No | Shadow spread (default: 0) |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "effects": [
    {
      "type": "DROP_SHADOW",
      "visible": true,
      "radius": 10,
      "color": { "r": 0, "g": 0, "b": 0, "a": 0.25 },
      "offset": { "x": 0, "y": 4 },
      "spread": 0,
      "blendMode": "NORMAL"
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Add Drop Shadow

**Purpose:** Verify basic drop shadow.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "DROP_SHADOW",
        radius: 10,
        color: { r: 0, g: 0, b: 0, a: 0.25 },
        offset: { x: 0, y: 4 }
      }
    ]
  }
}
```

**Expected Result:**
- Drop shadow visible below node
- Shadow has 10px blur radius

---

### Test 2: Add Inner Shadow

**Purpose:** Verify inner shadow effect.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "INNER_SHADOW",
        radius: 8,
        color: { r: 0, g: 0, b: 0, a: 0.5 },
        offset: { x: 2, y: 2 }
      }
    ]
  }
}
```

**Expected Result:**
- Inner shadow visible inside node

---

### Test 3: Add Layer Blur

**Purpose:** Verify layer blur effect.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "LAYER_BLUR",
        radius: 15
      }
    ]
  }
}
```

**Expected Result:**
- Node content is blurred

---

### Test 4: Add Background Blur

**Purpose:** Verify background blur effect.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "BACKGROUND_BLUR",
        radius: 20
      }
    ]
  }
}
```

**Expected Result:**
- Content behind node is blurred (glass effect)

---

### Test 5: Multiple Effects Combined

**Purpose:** Verify multiple effects can be applied.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "DROP_SHADOW",
        radius: 10,
        color: { r: 0, g: 0, b: 0, a: 0.25 },
        offset: { x: 0, y: 4 }
      },
      {
        type: "DROP_SHADOW",
        radius: 20,
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 10 }
      }
    ]
  }
}
```

**Expected Result:**
- Two drop shadows applied
- Creates depth effect

---

### Test 6: Shadow with Spread

**Purpose:** Verify shadow spread property.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "DROP_SHADOW",
        radius: 5,
        color: { r: 0, g: 0, b: 0, a: 0.3 },
        offset: { x: 0, y: 0 },
        spread: 10
      }
    ]
  }
}
```

**Expected Result:**
- Shadow spreads outward by 10px

---

### Test 7: Colored Shadow

**Purpose:** Verify colored shadow.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "DROP_SHADOW",
        radius: 15,
        color: { r: 0.5, g: 0, b: 1, a: 0.5 },
        offset: { x: 5, y: 5 }
      }
    ]
  }
}
```

**Expected Result:**
- Purple-colored drop shadow

---

### Test 8: Effect with Visibility Off

**Purpose:** Verify effect can be hidden.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: [
      {
        type: "DROP_SHADOW",
        visible: false,
        radius: 10,
        color: { r: 0, g: 0, b: 0, a: 0.25 }
      }
    ]
  }
}
```

**Expected Result:**
- Effect applied but not visible

---

### Test 9: Clear All Effects (Empty Array)

**Purpose:** Verify effects can be removed.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID",
    effects: []
  }
}
```

**Expected Result:**
- All effects removed
- `effects` array is empty

---

### Test 10: Missing effects Parameter (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_effects",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "effects must be an array"

---

## Sample Test Script

```javascript
/**
 * Test: set_effects command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const effectTests = [
  {
    name: "Drop shadow",
    effects: [{ type: "DROP_SHADOW", radius: 10, color: { r: 0, g: 0, b: 0, a: 0.25 }, offset: { x: 0, y: 4 } }]
  },
  {
    name: "Inner shadow",
    effects: [{ type: "INNER_SHADOW", radius: 8, color: { r: 0, g: 0, b: 0, a: 0.5 }, offset: { x: 2, y: 2 } }]
  },
  {
    name: "Layer blur",
    effects: [{ type: "LAYER_BLUR", radius: 10 }]
  },
  {
    name: "Multiple shadows",
    effects: [
      { type: "DROP_SHADOW", radius: 5, color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 2 } },
      { type: "DROP_SHADOW", radius: 15, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 8 } }
    ]
  },
  {
    name: "Clear effects",
    effects: []
  }
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
        params: { width: 100, height: 100, name: "Effects Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runEffectsTest() {
  if (currentTest >= effectTests.length) {
    console.log('\n=== All effects tests complete ===');
    ws.close();
    return;
  }

  const test = effectTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_effects",
      params: { nodeId: createdNodeId, effects: test.effects },
      commandId: `effects_${currentTest}`
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
      phase = 'effects';
      setTimeout(() => runEffectsTest(), 500);
    } else if (result && phase === 'effects') {
      console.log('  Effects count:', result.effects ? result.effects.length : 0);
      console.log('  ✓ Effects applied successfully');

      currentTest++;
      setTimeout(() => runEffectsTest(), 1000);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Drop shadow applied correctly
- [ ] Inner shadow applied correctly
- [ ] Layer blur applied correctly
- [ ] Background blur applied correctly
- [ ] Multiple effects can be combined
- [ ] Shadow offset works correctly
- [ ] Shadow spread works correctly
- [ ] Colored shadows work
- [ ] Effect visibility toggle works
- [ ] Effects can be cleared (empty array)
- [ ] Error for missing effects parameter
- [ ] Error for non-array effects
- [ ] Response contains updated effects array
- [ ] Effects visible in Figma
