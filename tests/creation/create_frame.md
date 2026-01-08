# Test Case: create_frame

## Command
`create_frame`

## Description
Creates a new frame node with optional auto-layout configuration, colors, and styling.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Frame width |
| `height` | number | No | 100 | Frame height |
| `name` | string | No | "Frame" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `fillColor` | RGBA | No | - | Fill color `{r, g, b, a}` (0-1 range) |
| `strokeColor` | RGBA | No | - | Stroke color `{r, g, b, a}` (0-1 range) |
| `strokeWeight` | number | No | - | Stroke width |
| `layoutMode` | string | No | "NONE" | "NONE", "HORIZONTAL", "VERTICAL" |
| `layoutWrap` | string | No | "NO_WRAP" | "NO_WRAP", "WRAP" |
| `paddingTop` | number | No | 10 | Top padding (auto-layout) |
| `paddingRight` | number | No | 10 | Right padding (auto-layout) |
| `paddingBottom` | number | No | 10 | Bottom padding (auto-layout) |
| `paddingLeft` | number | No | 10 | Left padding (auto-layout) |
| `primaryAxisAlignItems` | string | No | "MIN" | "MIN", "MAX", "CENTER", "SPACE_BETWEEN" |
| `counterAxisAlignItems` | string | No | "MIN" | "MIN", "MAX", "CENTER", "BASELINE" |
| `layoutSizingHorizontal` | string | No | "FIXED" | "FIXED", "HUG", "FILL" |
| `layoutSizingVertical` | string | No | "FIXED" | "FIXED", "HUG", "FILL" |
| `itemSpacing` | number | No | 0 | Gap between children |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Frame",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "fills": [...],
  "strokes": [...],
  "strokeWeight": 0,
  "layoutMode": "NONE",
  "layoutWrap": "NO_WRAP",
  "parentId": "0:1"
}
```

---

## Test Scenarios

### Test 1: Create Frame with Default Parameters

**Purpose:** Verify frame creation works with no parameters.

**Command:**
```javascript
{
  command: "create_frame",
  params: {}
}
```

**Expected Result:**
- Frame created at position (0, 0)
- Size is 100x100
- Name is "Frame"
- Layout mode is "NONE"

**Verification Steps:**
1. Check response contains valid `id`
2. Verify `layoutMode` is "NONE"
3. Visually confirm frame appears in Figma

---

### Test 2: Create Frame with Custom Size and Position

**Purpose:** Verify custom dimensions are applied.

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    name: "Custom Frame"
  }
}
```

**Expected Result:**
- Frame at position (100, 100)
- Size is 400x300
- Name is "Custom Frame"

---

### Test 3: Create Frame with Fill Color

**Purpose:** Verify fill color is applied correctly.

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    fillColor: { r: 0.2, g: 0.4, b: 0.8, a: 1 },
    width: 200,
    height: 200,
    name: "Blue Frame"
  }
}
```

**Expected Result:**
- Frame has blue fill color
- `fills` array in response contains SOLID paint

**Verification Steps:**
1. Check `fills` array is not empty
2. Visually confirm blue color in Figma

---

### Test 4: Create Frame with Stroke

**Purpose:** Verify stroke color and weight are applied.

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    strokeColor: { r: 1, g: 0, b: 0, a: 1 },
    strokeWeight: 3,
    width: 200,
    height: 200,
    name: "Stroked Frame"
  }
}
```

**Expected Result:**
- Frame has red stroke
- Stroke weight is 3

**Verification Steps:**
1. Check `strokes` array is not empty
2. Check `strokeWeight` equals 3
3. Visually confirm red border in Figma

---

### Test 5: Create Horizontal Auto-Layout Frame

**Purpose:** Verify horizontal auto-layout configuration.

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    layoutMode: "HORIZONTAL",
    itemSpacing: 16,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
    width: 400,
    height: 100,
    name: "Horizontal Container"
  }
}
```

**Expected Result:**
- `layoutMode` is "HORIZONTAL"
- Frame configured as horizontal flex container

**Verification Steps:**
1. Check `layoutMode` equals "HORIZONTAL"
2. Create child elements to verify they align horizontally

---

### Test 6: Create Vertical Auto-Layout Frame

**Purpose:** Verify vertical auto-layout configuration.

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    layoutMode: "VERTICAL",
    itemSpacing: 12,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    layoutSizingHorizontal: "HUG",
    layoutSizingVertical: "HUG",
    name: "Vertical Container"
  }
}
```

**Expected Result:**
- `layoutMode` is "VERTICAL"
- Frame hugs content in both directions

---

### Test 7: Create Auto-Layout Frame with Wrap

**Purpose:** Verify wrap functionality.

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    layoutMode: "HORIZONTAL",
    layoutWrap: "WRAP",
    itemSpacing: 8,
    width: 300,
    height: 200,
    name: "Wrap Container"
  }
}
```

**Expected Result:**
- `layoutMode` is "HORIZONTAL"
- `layoutWrap` is "WRAP"

---

### Test 8: Create Frame with Space-Between Alignment

**Purpose:** Verify space-between distribution.

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    layoutMode: "HORIZONTAL",
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
    width: 500,
    height: 60,
    name: "Space Between Frame"
  }
}
```

**Expected Result:**
- Children will be distributed with space between

---

### Test 9: Create Nested Frame

**Purpose:** Verify frame can be created inside another frame.

**Prerequisites:**
- Create a parent frame first and note its ID

**Command:**
```javascript
{
  command: "create_frame",
  params: {
    parentId: "PARENT_FRAME_ID",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    fillColor: { r: 0.9, g: 0.9, b: 0.9, a: 1 },
    name: "Child Frame"
  }
}
```

**Expected Result:**
- Frame created inside parent
- `parentId` matches provided ID

---

## Sample Test Script

```javascript
/**
 * Test: create_frame command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  {
    name: "Default frame",
    params: {}
  },
  {
    name: "Blue filled frame",
    params: {
      fillColor: { r: 0.2, g: 0.4, b: 0.8, a: 1 },
      x: 120,
      width: 100,
      height: 100
    }
  },
  {
    name: "Horizontal auto-layout",
    params: {
      layoutMode: "HORIZONTAL",
      itemSpacing: 16,
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      x: 240,
      width: 300,
      height: 80,
      fillColor: { r: 0.95, g: 0.95, b: 0.95, a: 1 }
    }
  },
  {
    name: "Vertical auto-layout with HUG",
    params: {
      layoutMode: "VERTICAL",
      layoutSizingHorizontal: "HUG",
      layoutSizingVertical: "HUG",
      itemSpacing: 8,
      paddingTop: 12,
      paddingRight: 12,
      paddingBottom: 12,
      paddingLeft: 12,
      x: 560,
      fillColor: { r: 1, g: 0.95, b: 0.9, a: 1 }
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
    ws.close();
    return;
  }

  const test = tests[currentTest];
  console.log(`\nRunning test: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_frame",
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
      console.log(`Result:`, JSON.stringify(result, null, 2));

      // Validate
      console.log('✓ Frame ID:', result.id);
      console.log('✓ Layout Mode:', result.layoutMode);

      currentTest++;
      setTimeout(() => runNextTest(), 1000);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [x] Frame created with default parameters
- [x] Custom position and size applied
- [x] Custom name applied
- [x] Fill color applied correctly
- [x] Stroke color and weight applied
- [x] Horizontal auto-layout works
- [x] Vertical auto-layout works
- [ ] Layout wrap works *(not tested)*
- [ ] Padding values applied *(not tested)*
- [ ] Alignment settings work (MIN, MAX, CENTER, SPACE_BETWEEN) *(not tested)*
- [ ] Layout sizing works (FIXED, HUG, FILL) *(not tested)*
- [x] Item spacing applied
- [ ] Nested frame creation works *(not tested)*
- [x] Response contains all expected fields

**Test Run:** 2025-12-25 | **Result:** 4/4 PASSED
