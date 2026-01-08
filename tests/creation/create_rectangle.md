# Test Case: create_rectangle

## Command
`create_rectangle`

## Description
Creates a new rectangle node on the current Figma page or inside a specified parent frame.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Rectangle width |
| `height` | number | No | 100 | Rectangle height |
| `name` | string | No | "Rectangle" | Node name |
| `parentId` | string | No | - | Parent frame ID (uses current page if not provided) |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "parentId": "0:1"
}
```

---

## Test Scenarios

### Test 1: Create Rectangle with Default Parameters

**Purpose:** Verify rectangle creation works with no parameters.

**Command:**
```javascript
{
  command: "create_rectangle",
  params: {}
}
```

**Expected Result:**
- Rectangle created at position (0, 0)
- Size is 100x100
- Name is "Rectangle"
- Rectangle appears on current page

**Verification Steps:**
1. Check response contains valid `id`
2. Verify `x`, `y`, `width`, `height` match defaults
3. Visually confirm rectangle appears in Figma

---

### Test 2: Create Rectangle with Custom Position and Size

**Purpose:** Verify custom position and size are applied correctly.

**Command:**
```javascript
{
  command: "create_rectangle",
  params: {
    x: 200,
    y: 150,
    width: 300,
    height: 200
  }
}
```

**Expected Result:**
- Rectangle created at position (200, 150)
- Size is 300x200

**Verification Steps:**
1. Check response `x` equals 200
2. Check response `y` equals 150
3. Check response `width` equals 300
4. Check response `height` equals 200

---

### Test 3: Create Rectangle with Custom Name

**Purpose:** Verify custom naming works.

**Command:**
```javascript
{
  command: "create_rectangle",
  params: {
    name: "My Custom Rectangle",
    x: 50,
    y: 50,
    width: 150,
    height: 150
  }
}
```

**Expected Result:**
- Rectangle has name "My Custom Rectangle"

**Verification Steps:**
1. Check response `name` equals "My Custom Rectangle"
2. Verify in Figma layers panel

---

### Test 4: Create Rectangle Inside Parent Frame

**Purpose:** Verify rectangle can be created as child of existing frame.

**Prerequisites:**
- Create a frame first using `create_frame` command
- Note the frame's `id` from the response

**Command:**
```javascript
{
  command: "create_rectangle",
  params: {
    parentId: "FRAME_ID_HERE",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    name: "Nested Rectangle"
  }
}
```

**Expected Result:**
- Rectangle created inside the parent frame
- `parentId` in response matches provided frame ID

**Verification Steps:**
1. Check response `parentId` equals the frame ID
2. Visually confirm rectangle is nested inside frame in Figma

---

### Test 5: Create Rectangle with Invalid Parent ID

**Purpose:** Verify error handling for non-existent parent.

**Command:**
```javascript
{
  command: "create_rectangle",
  params: {
    parentId: "999:999",
    x: 0,
    y: 0
  }
}
```

**Expected Result:**
- Error message: "Parent node not found with ID: 999:999"

**Verification Steps:**
1. Check error is returned
2. No rectangle is created

---

### Test 6: Create Multiple Rectangles Sequentially

**Purpose:** Verify multiple rectangles can be created in sequence.

**Commands (execute in order):**
```javascript
// Rectangle 1
{ command: "create_rectangle", params: { x: 0, y: 0, name: "Rect 1" } }

// Rectangle 2
{ command: "create_rectangle", params: { x: 120, y: 0, name: "Rect 2" } }

// Rectangle 3
{ command: "create_rectangle", params: { x: 240, y: 0, name: "Rect 3" } }
```

**Expected Result:**
- Three rectangles created side by side
- Each has unique ID
- Names are "Rect 1", "Rect 2", "Rect 3"

---

## Sample Test Script

```javascript
/**
 * Test: create_rectangle command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  {
    name: "Default parameters",
    params: {}
  },
  {
    name: "Custom position and size",
    params: { x: 200, y: 150, width: 300, height: 200 }
  },
  {
    name: "Custom name",
    params: { name: "Test Rectangle", x: 50, y: 300 }
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
      command: "create_rectangle",
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
      console.log(`Test ${currentTest + 1} Result:`, JSON.stringify(result, null, 2));

      // Validate result
      if (result.id) {
        console.log('✓ Rectangle created with ID:', result.id);
      } else {
        console.log('✗ No ID in response');
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

- [x] Rectangle created with default parameters
- [x] Custom x, y position applied correctly
- [x] Custom width, height applied correctly
- [x] Custom name applied correctly
- [ ] Rectangle created inside parent frame *(not tested)*
- [ ] Error returned for invalid parent ID *(not tested)*
- [x] Multiple rectangles can be created sequentially
- [x] Response contains valid node ID
- [x] Rectangle visible in Figma canvas

**Test Run:** 2025-12-25 | **Result:** 4/4 PASSED
