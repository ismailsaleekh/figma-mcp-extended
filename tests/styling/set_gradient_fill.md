# Test Case: set_gradient_fill

## Command
`set_gradient_fill`

## Description
Sets a gradient fill on a node. Supports linear, radial, angular, and diamond gradients with configurable color stops.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify |
| `gradientType` | string | **Yes** | - | "GRADIENT_LINEAR", "GRADIENT_RADIAL", "GRADIENT_ANGULAR", or "GRADIENT_DIAMOND" |
| `stops` | array | **Yes** | - | Array of color stops (minimum 2) |
| `angle` | number | No | 0 | Gradient angle in degrees (for linear gradients) |

### Color Stop Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `position` | number | **Yes** | Stop position (0-1) |
| `color` | object | **Yes** | Color `{r, g, b, a}` (0-1 range) |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "fills": [
    {
      "type": "GRADIENT_LINEAR",
      "gradientStops": [
        { "position": 0, "color": { "r": 1, "g": 0, "b": 0, "a": 1 } },
        { "position": 1, "color": { "r": 0, "g": 0, "b": 1, "a": 1 } }
      ]
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Simple Linear Gradient (Red to Blue)

**Purpose:** Verify basic linear gradient.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_LINEAR",
    stops: [
      { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
      { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } }
    ]
  }
}
```

**Expected Result:**
- Linear gradient from red to blue

---

### Test 2: Linear Gradient with Angle

**Purpose:** Verify gradient angle.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_LINEAR",
    stops: [
      { position: 0, color: { r: 1, g: 1, b: 0, a: 1 } },
      { position: 1, color: { r: 0, g: 1, b: 1, a: 1 } }
    ],
    angle: 45
  }
}
```

**Expected Result:**
- Diagonal gradient at 45 degrees

---

### Test 3: Radial Gradient

**Purpose:** Verify radial gradient.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_RADIAL",
    stops: [
      { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
      { position: 1, color: { r: 0.2, g: 0.2, b: 0.2, a: 1 } }
    ]
  }
}
```

**Expected Result:**
- Radial gradient from center (white) to edge (dark gray)

---

### Test 4: Angular Gradient

**Purpose:** Verify angular/conic gradient.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_ANGULAR",
    stops: [
      { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
      { position: 0.33, color: { r: 0, g: 1, b: 0, a: 1 } },
      { position: 0.66, color: { r: 0, g: 0, b: 1, a: 1 } },
      { position: 1, color: { r: 1, g: 0, b: 0, a: 1 } }
    ]
  }
}
```

**Expected Result:**
- Angular/conic gradient with rainbow effect

---

### Test 5: Diamond Gradient

**Purpose:** Verify diamond gradient.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_DIAMOND",
    stops: [
      { position: 0, color: { r: 1, g: 0.8, b: 0, a: 1 } },
      { position: 1, color: { r: 1, g: 0.4, b: 0, a: 1 } }
    ]
  }
}
```

**Expected Result:**
- Diamond-shaped gradient

---

### Test 6: Multi-Stop Gradient

**Purpose:** Verify multiple color stops.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_LINEAR",
    stops: [
      { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
      { position: 0.25, color: { r: 1, g: 1, b: 0, a: 1 } },
      { position: 0.5, color: { r: 0, g: 1, b: 0, a: 1 } },
      { position: 0.75, color: { r: 0, g: 1, b: 1, a: 1 } },
      { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } }
    ]
  }
}
```

**Expected Result:**
- Rainbow gradient with 5 color stops

---

### Test 7: Gradient with Transparency

**Purpose:** Verify semi-transparent gradient stops.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_LINEAR",
    stops: [
      { position: 0, color: { r: 0, g: 0, b: 0, a: 1 } },
      { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } }
    ]
  }
}
```

**Expected Result:**
- Gradient fading to transparent

---

### Test 8: Vertical Gradient (90 degrees)

**Purpose:** Verify vertical gradient.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_LINEAR",
    stops: [
      { position: 0, color: { r: 0, g: 0.5, b: 1, a: 1 } },
      { position: 1, color: { r: 0, g: 0.2, b: 0.5, a: 1 } }
    ],
    angle: 90
  }
}
```

**Expected Result:**
- Vertical gradient (top to bottom)

---

### Test 9: Less Than 2 Stops (Error Case)

**Purpose:** Verify error for insufficient stops.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_LINEAR",
    stops: [
      { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } }
    ]
  }
}
```

**Expected Result:**
- Error: "stops must be an array with at least 2 color stops"

---

### Test 10: Missing stops Parameter (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_gradient_fill",
  params: {
    nodeId: "NODE_ID",
    gradientType: "GRADIENT_LINEAR"
  }
}
```

**Expected Result:**
- Error: "stops must be an array with at least 2 color stops"

---

## Sample Test Script

```javascript
/**
 * Test: set_gradient_fill command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const gradientTests = [
  {
    name: "Linear red to blue",
    params: {
      gradientType: "GRADIENT_LINEAR",
      stops: [
        { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } }
      ]
    }
  },
  {
    name: "Linear 45 degree",
    params: {
      gradientType: "GRADIENT_LINEAR",
      stops: [
        { position: 0, color: { r: 1, g: 1, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 1, b: 1, a: 1 } }
      ],
      angle: 45
    }
  },
  {
    name: "Radial gradient",
    params: {
      gradientType: "GRADIENT_RADIAL",
      stops: [
        { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } }
      ]
    }
  },
  {
    name: "Multi-stop rainbow",
    params: {
      gradientType: "GRADIENT_LINEAR",
      stops: [
        { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
        { position: 0.5, color: { r: 0, g: 1, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } }
      ]
    }
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
        params: { width: 200, height: 100, name: "Gradient Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runGradientTest() {
  if (currentTest >= gradientTests.length) {
    console.log('\n=== All gradient tests complete ===');
    ws.close();
    return;
  }

  const test = gradientTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_gradient_fill",
      params: { nodeId: createdNodeId, ...test.params },
      commandId: `gradient_${currentTest}`
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
      phase = 'gradient';
      setTimeout(() => runGradientTest(), 500);
    } else if (result && phase === 'gradient') {
      if (result.fills && result.fills[0]) {
        console.log('  Gradient type:', result.fills[0].type);
        console.log('  Stops count:', result.fills[0].gradientStops?.length || 0);
      }
      console.log('  ✓ Gradient applied successfully');

      currentTest++;
      setTimeout(() => runGradientTest(), 1500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Linear gradient applies correctly
- [ ] Gradient angle works (0, 45, 90, etc.)
- [ ] Radial gradient works
- [ ] Angular gradient works
- [ ] Diamond gradient works
- [ ] Multi-stop gradients (3+ colors) work
- [ ] Transparent gradient stops work
- [ ] Color positions respected (0-1 range)
- [ ] Error for fewer than 2 stops
- [ ] Error for missing stops parameter
- [ ] Response contains updated fills array
- [ ] Fill type shows correct gradient type
- [ ] Gradient visible and correct in Figma
