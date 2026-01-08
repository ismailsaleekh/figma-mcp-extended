# Test Case: create_polygon

## Command
`create_polygon`

## Description
Creates a polygon shape with a configurable number of points (sides). Can create triangles, pentagons, hexagons, stars, etc.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Polygon width |
| `height` | number | No | 100 | Polygon height |
| `pointCount` | number | No | 3 | Number of points/sides (3-100) |
| `name` | string | No | "Polygon" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `fillColor` | object | No | - | Fill color `{r, g, b, a}` |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Polygon",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "pointCount": 3,
  "parentId": "0:1"
}
```

---

## Test Scenarios

### Test 1: Create Triangle (Default)

**Purpose:** Verify default triangle creation.

**Command:**
```javascript
{
  command: "create_polygon",
  params: {}
}
```

**Expected Result:**
- Triangle created (3 points)
- Size is 100x100
- Position at (0, 0)

---

### Test 2: Create Pentagon (5 Sides)

**Purpose:** Verify pentagon creation.

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    x: 150,
    y: 0,
    pointCount: 5,
    name: "Pentagon"
  }
}
```

**Expected Result:**
- Pentagon with 5 points
- `pointCount` in response is 5

---

### Test 3: Create Hexagon (6 Sides)

**Purpose:** Verify hexagon creation.

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    x: 300,
    y: 0,
    pointCount: 6,
    name: "Hexagon"
  }
}
```

**Expected Result:**
- Hexagon with 6 points
- Classic honeycomb shape

---

### Test 4: Create Octagon (8 Sides)

**Purpose:** Verify octagon creation.

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    pointCount: 8,
    name: "Octagon"
  }
}
```

**Expected Result:**
- Octagon with 8 points
- Stop sign shape

---

### Test 5: Create Polygon with Many Sides (Appears Circular)

**Purpose:** Verify high point count.

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    pointCount: 32,
    name: "Many-sided"
  }
}
```

**Expected Result:**
- Polygon appears nearly circular
- `pointCount` capped at 100 max

---

### Test 6: Create Polygon with Fill Color

**Purpose:** Verify fill color is applied.

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    pointCount: 6,
    fillColor: { r: 0.9, g: 0.7, b: 0.1, a: 1 },
    name: "Yellow Hexagon"
  }
}
```

**Expected Result:**
- Yellow hexagon created

---

### Test 7: Create Polygon with Custom Size

**Purpose:** Verify custom dimensions.

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    width: 200,
    height: 150,
    pointCount: 5,
    name: "Wide Pentagon"
  }
}
```

**Expected Result:**
- Pentagon stretched to 200x150

---

### Test 8: Create Polygon with Minimum Points

**Purpose:** Verify minimum point count (triangle).

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    pointCount: 2  // Should be clamped to 3
  }
}
```

**Expected Result:**
- Triangle created (minimum 3 points)
- `pointCount` should be 3

---

### Test 9: Create Polygon Inside Parent Frame

**Purpose:** Verify polygon in parent frame.

**Prerequisites:**
- Create a frame first, note its ID

**Command:**
```javascript
{
  command: "create_polygon",
  params: {
    parentId: "FRAME_ID",
    pointCount: 4,
    name: "Diamond"
  }
}
```

**Expected Result:**
- 4-sided polygon inside frame
- `parentId` matches provided ID

---

## Sample Test Script

```javascript
/**
 * Test: create_polygon command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  { name: "Triangle (default)", params: {} },
  { name: "Pentagon", params: { x: 120, pointCount: 5 } },
  { name: "Hexagon", params: { x: 240, pointCount: 6 } },
  { name: "Octagon", params: { x: 360, pointCount: 8 } },
  { name: "Many-sided", params: { x: 480, pointCount: 24 } },
  { name: "Colored triangle", params: { y: 150, fillColor: { r: 0, g: 0.8, b: 0.5, a: 1 } } }
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
      command: "create_polygon",
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
      console.log('  Name:', result.name);
      console.log('  Point Count:', result.pointCount);
      console.log('  Size:', result.width, 'x', result.height);

      if (result.id && result.pointCount >= 3) {
        console.log('  ✓ Polygon created successfully');
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

- [ ] Triangle created with default parameters
- [ ] Pentagon (5 sides) created correctly
- [ ] Hexagon (6 sides) created correctly
- [ ] Octagon (8 sides) created correctly
- [ ] High point count creates near-circular shape
- [ ] Point count clamped to minimum 3
- [ ] Point count clamped to maximum 100
- [ ] Custom size applied correctly
- [ ] Fill color applied when provided
- [ ] Polygon created inside parent frame
- [ ] `pointCount` value correct in response
- [ ] Polygon visible in Figma canvas
