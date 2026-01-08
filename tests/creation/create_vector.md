# Test Case: create_vector

## Command
`create_vector`

## Description
Creates a vector shape from SVG path data. Allows creation of custom shapes using vector paths.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `vectorPaths` | array | **Yes** | - | Array of path objects with `windingRule` and `data` |
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `name` | string | No | "Vector" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `fillColor` | object | No | - | Fill color `{r, g, b, a}` |
| `strokeColor` | object | No | - | Stroke color `{r, g, b, a}` |
| `strokeWeight` | number | No | - | Stroke thickness |

### Vector Path Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `windingRule` | string | **Yes** | "EVENODD" or "NONZERO" |
| `data` | string | **Yes** | SVG path data string |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Vector",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "parentId": "0:1"
}
```

---

## Test Scenarios

### Test 1: Create Simple Triangle Vector

**Purpose:** Verify basic vector creation with triangle path.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: [
      {
        windingRule: "EVENODD",
        data: "M 0 100 L 50 0 L 100 100 Z"
      }
    ],
    name: "Triangle Vector"
  }
}
```

**Expected Result:**
- Triangle vector created
- Shape matches the path data

---

### Test 2: Create Square Vector

**Purpose:** Verify square path creation.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: [
      {
        windingRule: "EVENODD",
        data: "M 0 0 L 100 0 L 100 100 L 0 100 Z"
      }
    ],
    name: "Square Vector"
  }
}
```

**Expected Result:**
- Square vector created

---

### Test 3: Create Star Vector

**Purpose:** Verify complex path creation.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: [
      {
        windingRule: "EVENODD",
        data: "M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z"
      }
    ],
    name: "Star Vector"
  }
}
```

**Expected Result:**
- 5-pointed star created

---

### Test 4: Create Vector with Fill Color

**Purpose:** Verify fill color is applied.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: [
      {
        windingRule: "EVENODD",
        data: "M 0 50 L 50 0 L 100 50 L 50 100 Z"
      }
    ],
    fillColor: { r: 0.8, g: 0.2, b: 0.2, a: 1 },
    name: "Red Diamond"
  }
}
```

**Expected Result:**
- Diamond shape with red fill

---

### Test 5: Create Vector with Stroke

**Purpose:** Verify stroke color and weight.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: [
      {
        windingRule: "EVENODD",
        data: "M 0 0 L 100 0 L 100 100 L 0 100 Z"
      }
    ],
    strokeColor: { r: 0, g: 0, b: 1, a: 1 },
    strokeWeight: 3,
    name: "Blue Outlined Square"
  }
}
```

**Expected Result:**
- Square with blue 3px stroke

---

### Test 6: Create Curved Vector (Bezier)

**Purpose:** Verify curved path support.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: [
      {
        windingRule: "EVENODD",
        data: "M 0 50 C 0 0 100 0 100 50 C 100 100 0 100 0 50 Z"
      }
    ],
    name: "Curved Shape"
  }
}
```

**Expected Result:**
- Curved/oval-like shape from bezier curves

---

### Test 7: Create Vector at Custom Position

**Purpose:** Verify position is applied.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: [
      {
        windingRule: "NONZERO",
        data: "M 0 0 L 50 0 L 50 50 L 0 50 Z"
      }
    ],
    x: 200,
    y: 200,
    name: "Positioned Vector"
  }
}
```

**Expected Result:**
- Vector at position (200, 200)

---

### Test 8: Missing vectorPaths (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    name: "Invalid Vector"
  }
}
```

**Expected Result:**
- Error: "vectorPaths must be a non-empty array"

---

### Test 9: Empty vectorPaths (Error Case)

**Purpose:** Verify error for empty array.

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    vectorPaths: []
  }
}
```

**Expected Result:**
- Error: "vectorPaths must be a non-empty array"

---

### Test 10: Create Vector Inside Parent Frame

**Purpose:** Verify vector in parent frame.

**Prerequisites:**
- Create a frame first, note its ID

**Command:**
```javascript
{
  command: "create_vector",
  params: {
    parentId: "FRAME_ID",
    vectorPaths: [
      {
        windingRule: "EVENODD",
        data: "M 0 0 L 80 0 L 80 80 L 0 80 Z"
      }
    ]
  }
}
```

**Expected Result:**
- Vector created inside frame

---

## Sample Test Script

```javascript
/**
 * Test: create_vector command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  {
    name: "Triangle",
    params: {
      vectorPaths: [{ windingRule: "EVENODD", data: "M 0 100 L 50 0 L 100 100 Z" }]
    }
  },
  {
    name: "Square",
    params: {
      x: 120,
      vectorPaths: [{ windingRule: "EVENODD", data: "M 0 0 L 100 0 L 100 100 L 0 100 Z" }]
    }
  },
  {
    name: "Star",
    params: {
      x: 240,
      vectorPaths: [{
        windingRule: "EVENODD",
        data: "M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z"
      }],
      fillColor: { r: 1, g: 0.8, b: 0, a: 1 }
    }
  }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
  setTimeout(() => runNextTest(), 2000);
});

function runNextTest() {
  if (currentTest >= tests.length) {
    console.log('\nAll tests complete');

    // Test error case
    console.log('\nTesting error case (missing vectorPaths)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_vector",
        params: { name: "Invalid" },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = tests[currentTest];
  console.log(`\nRunning test: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_vector",
      params: test.params,
      commandId: `test_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (result) {
      console.log('Result:');
      console.log('  ID:', result.id);
      console.log('  Name:', result.name);
      console.log('  Size:', result.width, 'x', result.height);
      console.log('  ✓ Vector created successfully');

      currentTest++;
      setTimeout(() => runNextTest(), 1000);
    }

    if (error) {
      console.log('Error:', error);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Simple vector (triangle) created
- [ ] Square vector created
- [ ] Complex vector (star) created
- [ ] Curved paths (bezier) work
- [ ] Fill color applied correctly
- [ ] Stroke color applied correctly
- [ ] Stroke weight applied correctly
- [ ] Custom position applied
- [ ] Vector created inside parent frame
- [ ] Error for missing vectorPaths
- [ ] Error for empty vectorPaths array
- [ ] Both EVENODD and NONZERO winding rules work
- [ ] Response contains `id`, `name`, `x`, `y`, `width`, `height`
- [ ] Vector visible in Figma canvas
