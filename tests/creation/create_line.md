# Test Case: create_line

## Command
`create_line`

## Description
Creates a line from a start point to an end point. The line is automatically rotated to connect the two points.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startX` | number | No | 0 | Starting X position |
| `startY` | number | No | 0 | Starting Y position |
| `endX` | number | No | 100 | Ending X position |
| `endY` | number | No | 0 | Ending Y position |
| `name` | string | No | "Line" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `strokeColor` | object | No | `{r:0, g:0, b:0, a:1}` | Stroke color |
| `strokeWeight` | number | No | 1 | Stroke thickness |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Line",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 0,
  "rotation": 0,
  "parentId": "0:1"
}
```

---

## Test Scenarios

### Test 1: Create Horizontal Line (Default)

**Purpose:** Verify default horizontal line creation.

**Command:**
```javascript
{
  command: "create_line",
  params: {}
}
```

**Expected Result:**
- Horizontal line from (0,0) to (100,0)
- Width is 100, height is 0
- Rotation is 0

---

### Test 2: Create Vertical Line

**Purpose:** Verify vertical line creation.

**Command:**
```javascript
{
  command: "create_line",
  params: {
    startX: 50,
    startY: 0,
    endX: 50,
    endY: 100,
    name: "Vertical Line"
  }
}
```

**Expected Result:**
- Vertical line from (50,0) to (50,100)
- Rotation is 90 degrees

---

### Test 3: Create Diagonal Line

**Purpose:** Verify diagonal line with rotation.

**Command:**
```javascript
{
  command: "create_line",
  params: {
    startX: 0,
    startY: 0,
    endX: 100,
    endY: 100,
    name: "Diagonal Line"
  }
}
```

**Expected Result:**
- Diagonal line at 45-degree angle
- Length is approximately 141.4 (√2 × 100)

---

### Test 4: Create Line with Custom Stroke Color

**Purpose:** Verify stroke color is applied.

**Command:**
```javascript
{
  command: "create_line",
  params: {
    startX: 0,
    startY: 150,
    endX: 200,
    endY: 150,
    strokeColor: { r: 1, g: 0, b: 0, a: 1 },
    name: "Red Line"
  }
}
```

**Expected Result:**
- Line with red stroke color

---

### Test 5: Create Line with Custom Stroke Weight

**Purpose:** Verify stroke weight is applied.

**Command:**
```javascript
{
  command: "create_line",
  params: {
    startX: 0,
    startY: 200,
    endX: 200,
    endY: 200,
    strokeWeight: 5,
    name: "Thick Line"
  }
}
```

**Expected Result:**
- Line with 5px stroke weight
- Visible as thicker line

---

### Test 6: Create Short Line

**Purpose:** Verify short line creation.

**Command:**
```javascript
{
  command: "create_line",
  params: {
    startX: 0,
    startY: 0,
    endX: 10,
    endY: 0,
    name: "Short Line"
  }
}
```

**Expected Result:**
- Short 10px line

---

### Test 7: Create Line with Negative Coordinates

**Purpose:** Verify line with negative direction.

**Command:**
```javascript
{
  command: "create_line",
  params: {
    startX: 100,
    startY: 100,
    endX: 0,
    endY: 0,
    name: "Reverse Diagonal"
  }
}
```

**Expected Result:**
- Line from (100,100) to (0,0)
- Rotation calculated correctly

---

### Test 8: Create Line Inside Parent Frame

**Purpose:** Verify line can be created inside a frame.

**Prerequisites:**
- Create a frame first, note its ID

**Command:**
```javascript
{
  command: "create_line",
  params: {
    parentId: "FRAME_ID",
    startX: 10,
    startY: 50,
    endX: 90,
    endY: 50
  }
}
```

**Expected Result:**
- Line created inside parent frame
- `parentId` matches provided ID

---

## Sample Test Script

```javascript
/**
 * Test: create_line command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  { name: "Default horizontal", params: {} },
  { name: "Vertical line", params: { startX: 50, startY: 0, endX: 50, endY: 100 } },
  { name: "Diagonal line", params: { startX: 0, startY: 0, endX: 100, endY: 100 } },
  { name: "Red line", params: { startX: 0, startY: 150, endX: 200, endY: 150, strokeColor: { r: 1, g: 0, b: 0, a: 1 } } },
  { name: "Thick line", params: { startX: 0, startY: 200, endX: 200, endY: 200, strokeWeight: 5 } }
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
      command: "create_line",
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
      console.log('Result:');
      console.log('  ID:', result.id);
      console.log('  Position:', result.x, result.y);
      console.log('  Size:', result.width, 'x', result.height);
      console.log('  Rotation:', result.rotation);

      if (result.id) {
        console.log('  ✓ Line created successfully');
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

- [ ] Horizontal line created with default parameters
- [ ] Vertical line created correctly (90° rotation)
- [ ] Diagonal line created with correct rotation
- [ ] Custom stroke color applied
- [ ] Custom stroke weight applied
- [ ] Short lines created correctly
- [ ] Lines with negative direction work
- [ ] Line created inside parent frame
- [ ] `rotation` value is correct in response
- [ ] `width` represents the line length
- [ ] Line visible in Figma canvas
