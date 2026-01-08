# Test Case: set_stroke_style

## Command
`set_stroke_style`

## Description
Sets stroke style properties including alignment, cap style, join style, and dash pattern.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify |
| `strokeAlign` | string | No | - | "INSIDE", "OUTSIDE", or "CENTER" |
| `strokeCap` | string | No | - | "NONE", "ROUND", or "SQUARE" |
| `strokeJoin` | string | No | - | "MITER", "BEVEL", or "ROUND" |
| `dashPattern` | array | No | - | Array of numbers [dash, gap, dash, gap...] |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "strokeAlign": "CENTER",
  "strokeCap": "ROUND",
  "strokeJoin": "ROUND",
  "dashPattern": [10, 5]
}
```

---

## Test Scenarios

### Test 1: Set Stroke Alignment to Inside

**Purpose:** Verify inside stroke alignment.

**Prerequisites:**
- Create a rectangle with stroke color applied

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    strokeAlign: "INSIDE"
  }
}
```

**Expected Result:**
- Stroke appears inside the shape boundary

---

### Test 2: Set Stroke Alignment to Outside

**Purpose:** Verify outside stroke alignment.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    strokeAlign: "OUTSIDE"
  }
}
```

**Expected Result:**
- Stroke appears outside the shape boundary

---

### Test 3: Set Stroke Alignment to Center

**Purpose:** Verify center stroke alignment.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    strokeAlign: "CENTER"
  }
}
```

**Expected Result:**
- Stroke straddles the shape boundary

---

### Test 4: Set Round Stroke Cap

**Purpose:** Verify round stroke cap.

**Prerequisites:**
- Create a line with visible ends

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "LINE_NODE_ID",
    strokeCap: "ROUND"
  }
}
```

**Expected Result:**
- Line ends are rounded

---

### Test 5: Set Square Stroke Cap

**Purpose:** Verify square stroke cap.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "LINE_NODE_ID",
    strokeCap: "SQUARE"
  }
}
```

**Expected Result:**
- Line ends are squared off

---

### Test 6: Set None Stroke Cap

**Purpose:** Verify no stroke cap extension.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "LINE_NODE_ID",
    strokeCap: "NONE"
  }
}
```

**Expected Result:**
- Line ends at exact endpoints

---

### Test 7: Set Round Stroke Join

**Purpose:** Verify round stroke join.

**Prerequisites:**
- Create a shape with corners (polygon, star, etc.)

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    strokeJoin: "ROUND"
  }
}
```

**Expected Result:**
- Corners are rounded

---

### Test 8: Set Bevel Stroke Join

**Purpose:** Verify bevel stroke join.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    strokeJoin: "BEVEL"
  }
}
```

**Expected Result:**
- Corners are beveled (cut off)

---

### Test 9: Set Miter Stroke Join

**Purpose:** Verify miter stroke join.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    strokeJoin: "MITER"
  }
}
```

**Expected Result:**
- Corners are pointed

---

### Test 10: Set Simple Dash Pattern

**Purpose:** Verify basic dashed stroke.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    dashPattern: [10, 5]
  }
}
```

**Expected Result:**
- Dashed stroke: 10px dash, 5px gap

---

### Test 11: Set Complex Dash Pattern

**Purpose:** Verify complex dash pattern.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    dashPattern: [20, 5, 5, 5]
  }
}
```

**Expected Result:**
- Dash-dot pattern: 20px, 5px gap, 5px, 5px gap

---

### Test 12: Set Dotted Pattern

**Purpose:** Verify dotted stroke.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    dashPattern: [2, 4],
    strokeCap: "ROUND"
  }
}
```

**Expected Result:**
- Dotted stroke with round caps

---

### Test 13: Clear Dash Pattern (Solid)

**Purpose:** Verify removing dash pattern.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    dashPattern: []
  }
}
```

**Expected Result:**
- Solid stroke (no dashes)

---

### Test 14: Combine Multiple Properties

**Purpose:** Verify setting multiple properties at once.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "NODE_ID",
    strokeAlign: "OUTSIDE",
    strokeCap: "ROUND",
    strokeJoin: "ROUND",
    dashPattern: [15, 8]
  }
}
```

**Expected Result:**
- All properties applied together

---

### Test 15: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_stroke_style",
  params: {
    nodeId: "999:999",
    strokeAlign: "CENTER"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_stroke_style command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const styleTests = [
  { name: "Inside stroke", params: { strokeAlign: "INSIDE" } },
  { name: "Outside stroke", params: { strokeAlign: "OUTSIDE" } },
  { name: "Center stroke", params: { strokeAlign: "CENTER" } },
  { name: "Round join", params: { strokeJoin: "ROUND" } },
  { name: "Bevel join", params: { strokeJoin: "BEVEL" } },
  { name: "Simple dash", params: { dashPattern: [10, 5] } },
  { name: "Dotted", params: { dashPattern: [2, 4], strokeCap: "ROUND" } },
  { name: "Solid (clear dash)", params: { dashPattern: [] } },
  { name: "Combined", params: { strokeAlign: "OUTSIDE", strokeJoin: "ROUND", dashPattern: [15, 8] } }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    // Create rectangle with stroke
    console.log('Creating test rectangle with stroke...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { width: 100, height: 100, name: "Stroke Style Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runStyleTest() {
  if (currentTest >= styleTests.length) {
    console.log('\n=== All stroke style tests complete ===');
    ws.close();
    return;
  }

  const test = styleTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_stroke_style",
      params: { nodeId: createdNodeId, ...test.params },
      commandId: `style_${currentTest}`
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

      // Add stroke to rectangle first
      phase = 'add_stroke';
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "set_stroke_color",
          params: { nodeId: createdNodeId, color: { r: 0, g: 0, b: 0, a: 1 }, weight: 5 },
          commandId: "add_stroke"
        }
      }));
    } else if (result && phase === 'add_stroke') {
      console.log('Stroke added');
      phase = 'style';
      setTimeout(() => runStyleTest(), 500);
    } else if (result && phase === 'style') {
      console.log('  Stroke align:', result.strokeAlign);
      console.log('  Stroke cap:', result.strokeCap);
      console.log('  Stroke join:', result.strokeJoin);
      console.log('  Dash pattern:', result.dashPattern);
      console.log('  ✓ Stroke style applied');

      currentTest++;
      setTimeout(() => runStyleTest(), 1000);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] INSIDE stroke alignment works
- [ ] OUTSIDE stroke alignment works
- [ ] CENTER stroke alignment works
- [ ] ROUND stroke cap works
- [ ] SQUARE stroke cap works
- [ ] NONE stroke cap works
- [ ] ROUND stroke join works
- [ ] BEVEL stroke join works
- [ ] MITER stroke join works
- [ ] Simple dash pattern [10, 5] works
- [ ] Complex dash pattern works
- [ ] Dotted pattern works
- [ ] Empty dash pattern creates solid stroke
- [ ] Multiple properties can be set together
- [ ] Error for non-existent node
- [ ] Response contains updated stroke properties
- [ ] Visual styles match in Figma
