# Test Case: create_ellipse

## Command
`create_ellipse`

## Description
Creates an ellipse (circle/oval) node on the current Figma page or inside a specified parent frame.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Ellipse width |
| `height` | number | No | 100 | Ellipse height |
| `name` | string | No | "Ellipse" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `fillColor` | object | No | - | Fill color `{r, g, b, a}` (0-1 range) |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Ellipse",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "parentId": "0:1"
}
```

---

## Test Scenarios

### Test 1: Create Ellipse with Default Parameters

**Purpose:** Verify ellipse creation works with no parameters.

**Command:**
```javascript
{
  command: "create_ellipse",
  params: {}
}
```

**Expected Result:**
- Ellipse created at position (0, 0)
- Size is 100x100 (perfect circle)
- Name is "Ellipse"

**Verification Steps:**
1. Check response contains valid `id`
2. Verify `x`, `y`, `width`, `height` match defaults
3. Visually confirm circle appears in Figma

---

### Test 2: Create Circle (Equal Width/Height)

**Purpose:** Verify perfect circle creation.

**Command:**
```javascript
{
  command: "create_ellipse",
  params: {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    name: "Circle"
  }
}
```

**Expected Result:**
- Circle created at (100, 100)
- Size is 50x50
- Appears as perfect circle

---

### Test 3: Create Oval (Different Width/Height)

**Purpose:** Verify oval/ellipse creation.

**Command:**
```javascript
{
  command: "create_ellipse",
  params: {
    x: 200,
    y: 100,
    width: 150,
    height: 80,
    name: "Oval"
  }
}
```

**Expected Result:**
- Oval created with width 150, height 80
- Appears as horizontal ellipse

---

### Test 4: Create Ellipse with Fill Color

**Purpose:** Verify fill color is applied.

**Command:**
```javascript
{
  command: "create_ellipse",
  params: {
    x: 0,
    y: 200,
    width: 100,
    height: 100,
    name: "Blue Circle",
    fillColor: { r: 0.2, g: 0.4, b: 0.8, a: 1 }
  }
}
```

**Expected Result:**
- Ellipse created with blue fill
- Fill color applied correctly

---

### Test 5: Create Ellipse Inside Parent Frame

**Purpose:** Verify ellipse can be created as child of existing frame.

**Prerequisites:**
- Create a frame first, note its ID

**Command:**
```javascript
{
  command: "create_ellipse",
  params: {
    parentId: "FRAME_ID_HERE",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    name: "Nested Circle"
  }
}
```

**Expected Result:**
- Ellipse created inside parent frame
- `parentId` in response matches provided ID

---

### Test 6: Create Large Ellipse

**Purpose:** Verify large ellipse creation.

**Command:**
```javascript
{
  command: "create_ellipse",
  params: {
    width: 500,
    height: 300,
    name: "Large Oval"
  }
}
```

**Expected Result:**
- Large ellipse created successfully

---

### Test 7: Create Ellipse with Invalid Parent ID (Error Case)

**Purpose:** Verify error handling for non-existent parent.

**Command:**
```javascript
{
  command: "create_ellipse",
  params: {
    parentId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Parent node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: create_ellipse command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  { name: "Default circle", params: {} },
  { name: "Custom position", params: { x: 100, y: 100, width: 50, height: 50 } },
  { name: "Oval shape", params: { width: 150, height: 80, name: "Oval" } },
  { name: "With fill color", params: { fillColor: { r: 1, g: 0, b: 0, a: 1 }, name: "Red Circle" } }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
  setTimeout(() => runNextTest(), 2000);
});

function runNextTest() {
  if (currentTest >= tests.length) {
    console.log('All tests complete');
    ws.close();
    return;
  }

  const test = tests[currentTest];
  console.log(`\nRunning test: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_ellipse",
      params: test.params,
      commandId: `test_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      console.log('Result:', JSON.stringify(result, null, 2));

      if (result.id) {
        console.log('✓ Ellipse created with ID:', result.id);
      }

      currentTest++;
      setTimeout(() => runNextTest(), 1000);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Ellipse created with default parameters
- [ ] Custom x, y position applied correctly
- [ ] Custom width, height applied correctly
- [ ] Perfect circle when width equals height
- [ ] Oval shape when width differs from height
- [ ] Custom name applied correctly
- [ ] Fill color applied when provided
- [ ] Ellipse created inside parent frame
- [ ] Error returned for invalid parent ID
- [ ] Response contains valid node ID
- [ ] Ellipse visible in Figma canvas
