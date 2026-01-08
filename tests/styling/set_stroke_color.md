# Test Case: set_stroke_color

## Command
`set_stroke_color`

## Description
Sets the stroke (border) color and weight of an existing node.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to modify (colon format) |
| `color` | object | **Yes** | - | Stroke color `{r, g, b, a}` (0-1 range) |
| `weight` | number | No | 1 | Stroke width in pixels |

### Color Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `r` | number | No | Red channel (0-1), defaults to 0 |
| `g` | number | No | Green channel (0-1), defaults to 0 |
| `b` | number | No | Blue channel (0-1), defaults to 0 |
| `a` | number | No | Alpha/opacity (0-1), defaults to 1 |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "strokes": [
    {
      "type": "SOLID",
      "color": { "r": 1, "g": 0, "b": 0 },
      "opacity": 1
    }
  ],
  "strokeWeight": 2
}
```

---

## Test Scenarios

### Test 1: Set Red Stroke with Default Weight

**Purpose:** Verify basic stroke color application.

**Prerequisites:**
1. Create a rectangle
2. Note the rectangle's ID

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "RECTANGLE_ID",
    color: { r: 1, g: 0, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Rectangle has red border
- Stroke weight is 1 (default)

**Verification Steps:**
1. Check `strokes` array has one element
2. Check `strokeWeight` equals 1
3. Visually confirm red border in Figma

---

### Test 2: Set Blue Stroke with Custom Weight

**Purpose:** Verify stroke weight customization.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 0, b: 1, a: 1 },
    weight: 3
  }
}
```

**Expected Result:**
- Node has blue stroke
- Stroke weight is 3

---

### Test 3: Set Thick Black Stroke

**Purpose:** Verify thick stroke weight.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 0, b: 0, a: 1 },
    weight: 10
  }
}
```

**Expected Result:**
- Node has 10px black border
- Visible thick border around shape

---

### Test 4: Set Very Thin Stroke (Hairline)

**Purpose:** Verify minimum stroke weight.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 0, b: 0, a: 1 },
    weight: 0.5
  }
}
```

**Expected Result:**
- Node has 0.5px stroke (hairline)
- Very thin visible border

---

### Test 5: Set Semi-Transparent Stroke

**Purpose:** Verify stroke opacity.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 0, b: 0, a: 0.5 },
    weight: 2
  }
}
```

**Expected Result:**
- Stroke is 50% transparent
- `opacity` equals 0.5 in response

---

### Test 6: Set Stroke on Frame

**Purpose:** Verify stroke works on frame nodes.

**Prerequisites:**
- Create a frame

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "FRAME_ID",
    color: { r: 0.2, g: 0.2, b: 0.2, a: 1 },
    weight: 1
  }
}
```

**Expected Result:**
- Frame has dark gray border
- Children unaffected

---

### Test 7: Change Stroke Color Multiple Times

**Purpose:** Verify stroke can be updated repeatedly.

**Commands (execute sequentially):**
```javascript
// Red stroke, weight 2
{ command: "set_stroke_color", params: { nodeId: "NODE_ID", color: { r: 1, g: 0, b: 0, a: 1 }, weight: 2 } }

// Green stroke, weight 4
{ command: "set_stroke_color", params: { nodeId: "NODE_ID", color: { r: 0, g: 1, b: 0, a: 1 }, weight: 4 } }

// Blue stroke, weight 6
{ command: "set_stroke_color", params: { nodeId: "NODE_ID", color: { r: 0, g: 0, b: 1, a: 1 }, weight: 6 } }
```

**Expected Result:**
- Each stroke applies successfully
- Final stroke is 6px blue

---

### Test 8: Set White Stroke

**Purpose:** Verify white stroke visibility.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 1, g: 1, b: 1, a: 1 },
    weight: 3
  }
}
```

**Expected Result:**
- White border applied
- May need dark background to see clearly

---

### Test 9: Set Stroke with Large Weight

**Purpose:** Verify large stroke weight.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
    weight: 50
  }
}
```

**Expected Result:**
- Very thick 50px stroke
- May significantly change visual appearance

---

### Test 10: Set Stroke with Decimal Weight

**Purpose:** Verify fractional stroke weight.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0, g: 0, b: 0, a: 1 },
    weight: 1.5
  }
}
```

**Expected Result:**
- Stroke weight is 1.5px
- Decimal precision preserved

---

### Test 11: Set Stroke with Partial Color Object

**Purpose:** Verify defaults for missing color properties.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "NODE_ID",
    color: { r: 0.5 },
    weight: 2
  }
}
```

**Expected Result:**
- Missing g, b default to 0
- Missing a defaults to 1
- Result is dark red stroke

---

### Test 12: Set Stroke on Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    nodeId: "999:999",
    color: { r: 1, g: 0, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 13: Set Stroke with Missing nodeId (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_stroke_color",
  params: {
    color: { r: 1, g: 0, b: 0, a: 1 }
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 14: Update Only Stroke Weight

**Purpose:** Verify weight can be changed independently.

**Commands (execute sequentially):**
```javascript
// Set initial stroke
{ command: "set_stroke_color", params: { nodeId: "NODE_ID", color: { r: 1, g: 0, b: 0, a: 1 }, weight: 2 } }

// Change weight only
{ command: "set_stroke_color", params: { nodeId: "NODE_ID", color: { r: 1, g: 0, b: 0, a: 1 }, weight: 8 } }
```

**Expected Result:**
- Color remains red
- Weight changes from 2 to 8

---

## Sample Test Script

```javascript
/**
 * Test: set_stroke_color command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create test node
  setTimeout(() => {
    console.log('Creating test rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { x: 0, y: 0, width: 100, height: 100, name: "Stroke Color Test" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

const strokeTests = [
  { name: "Red, weight 1 (default)", color: { r: 1, g: 0, b: 0, a: 1 }, weight: 1 },
  { name: "Blue, weight 3", color: { r: 0, g: 0, b: 1, a: 1 }, weight: 3 },
  { name: "Black, weight 10", color: { r: 0, g: 0, b: 0, a: 1 }, weight: 10 },
  { name: "50% transparent, weight 2", color: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 }, weight: 2 },
  { name: "Hairline 0.5px", color: { r: 0, g: 0, b: 0, a: 1 }, weight: 0.5 },
  { name: "Green, weight 5", color: { r: 0, g: 0.8, b: 0.2, a: 1 }, weight: 5 }
];

function runStrokeTest() {
  if (currentTest >= strokeTests.length) {
    console.log('\n=== All stroke color tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid node ID)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_stroke_color",
        params: { nodeId: "999:999", color: { r: 1, g: 0, b: 0, a: 1 } },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = strokeTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_stroke_color",
      params: {
        nodeId: createdNodeId,
        color: test.color,
        weight: test.weight
      },
      commandId: `stroke_${currentTest}`
    }
  }));
}

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
      if (phase === 'create') {
        createdNodeId = result.id;
        console.log('Created node:', createdNodeId);
        phase = 'stroke';
        setTimeout(() => runStrokeTest(), 500);
      } else if (phase === 'stroke') {
        console.log('Stroke result:');
        console.log('  ID:', result.id);
        console.log('  Stroke Weight:', result.strokeWeight);

        if (result.strokes && result.strokes.length > 0) {
          const stroke = result.strokes[0];
          console.log('  Stroke type:', stroke.type);
          console.log('  Color:', JSON.stringify(stroke.color));
          console.log('  Opacity:', stroke.opacity);

          const test = strokeTests[currentTest];
          if (result.strokeWeight === test.weight) {
            console.log('  ✓ Stroke weight correct');
          } else {
            console.log('  ✗ Stroke weight mismatch');
          }
        } else {
          console.log('  ✗ No strokes in response');
        }

        currentTest++;
        setTimeout(() => runStrokeTest(), 500);
      }
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
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
}, 60000);
```

---

## Validation Checklist

- [ ] Stroke color applied to rectangle
- [ ] Stroke color applied to frame
- [ ] Default weight (1) applied when not specified
- [ ] Custom weight applied correctly
- [ ] Thin stroke (< 1px) works
- [ ] Thick stroke (> 10px) works
- [ ] Decimal stroke weight works
- [ ] Semi-transparent stroke works
- [ ] Red, green, blue strokes work
- [ ] White stroke works
- [ ] Black stroke works
- [ ] Stroke can be changed multiple times
- [ ] Weight can be updated independently
- [ ] Partial color object uses defaults
- [ ] Error returned for non-existent node ID
- [ ] Error returned for missing nodeId
- [ ] Response contains `id`, `name`, `strokes`, `strokeWeight`
- [ ] Visual stroke matches response values
