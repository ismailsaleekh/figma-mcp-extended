# Test Case: create_rectangle_full

## Command
`create_rectangle_full`

## Description
Creates a rectangle with corner radius, opacity, layout sizing, and visibility in a single composite command. Replaces the sequence of `create_rectangle` + `set_corner_radius` + `set_opacity` + `set_layout_sizing` + `set_visibility`.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Rectangle width |
| `height` | number | No | 100 | Rectangle height |
| `name` | string | No | "Rectangle" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `fillColor` | RGBA | No | - | Fill color `{r, g, b, a}` (0-1 range) |
| `cornerRadius` | number | No | - | Corner radius (applied only if > 0) |
| `opacity` | number | No | 1 | Node opacity (0-1 range) |
| `layoutSizingHorizontal` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
| `layoutSizingVertical` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
| `visible` | boolean | No | true | Node visibility — set last |

## Expected Response

```json
{
  "id": "123:456"
}
```

**Note:** Composite commands return a minimal payload with only the node ID.

---

## Test Scenarios

### Test 1: Rectangle with Radius + Opacity + Sizing

**Purpose:** Verify all composite properties are applied in a single call — corner radius, opacity, and fill color on a skeleton placeholder.

**Prerequisites:**
- Create a parent frame with `layoutMode: "VERTICAL"`

**Command:**
```javascript
{
  command: "create_rectangle_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    width: 80,
    height: 80,
    name: "SkeletonAvatar",
    fillColor: { r: 0.88, g: 0.88, b: 0.88, a: 1 },
    cornerRadius: 9999,
    opacity: 0.7
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Rectangle rendered as circle (cornerRadius 9999 on 80x80)
- Gray skeleton fill color
- Opacity at 70%

**Verification Steps:**
1. Select node — verify it appears as a circle
2. Verify fill is gray `{ r: 0.88, g: 0.88, b: 0.88 }`
3. Verify corner radius is 9999
4. Verify opacity is 70%
5. Verify dimensions are 80x80

---

### Test 2: Rectangle with `visible: false`

**Purpose:** Verify hidden rectangle is created but not visible on canvas.

**Prerequisites:**
- Create a parent frame

**Command:**
```javascript
{
  command: "create_rectangle_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    width: 343,
    height: 1,
    name: "HiddenDivider",
    fillColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
    layoutSizingHorizontal: "FILL",
    visible: false
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Node exists in layers panel but is hidden
- When toggled visible, appears as 1px-tall divider filling parent width

**Verification Steps:**
1. Find node in layers — verify hidden icon
2. Toggle visibility — divider should appear stretching parent width
3. Verify height is 1px
4. Verify fill is light gray

---

### Test 3: Minimal Response

**Purpose:** Verify response contains only `{ id }` — no extra fields like fills, strokes, cornerRadius, etc.

**Command:**
```javascript
{
  command: "create_rectangle_full",
  params: {
    width: 100,
    height: 50,
    name: "MinimalRect",
    fillColor: { r: 0.95, g: 0.95, b: 0.94, a: 1 },
    cornerRadius: 8,
    x: 0,
    y: 0
  }
}
```

**Expected Result:**
- Response is exactly `{ id: "N:N" }`
- No `name`, `x`, `y`, `width`, `height`, `fills`, `strokes`, `cornerRadius` fields

**Verification Steps:**
1. Log full response
2. Verify `Object.keys(result)` equals `["id"]`
3. Visually confirm rectangle exists with rounded corners and fill

---

## Sample Test Script

```javascript
/**
 * Test: create_rectangle_full composite command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let parentFrameId = null;
let phase = 'create_parent';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Creating parent frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame_full",
        params: {
          x: 0, y: 0, width: 393, height: 400,
          name: "RectTestParent",
          layoutMode: "VERTICAL",
          paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
          itemSpacing: 12,
          fillColor: { r: 1, g: 1, b: 1, a: 1 }
        },
        commandId: "create_parent"
      }
    }));
  }, 2000);
});

const tests = [
  {
    name: "TC-CRF-001: Circular skeleton with opacity",
    useParent: true,
    params: {
      width: 80, height: 80,
      name: "SkeletonAvatar",
      fillColor: { r: 0.88, g: 0.88, b: 0.88, a: 1 },
      cornerRadius: 9999,
      opacity: 0.7
    }
  },
  {
    name: "TC-CRF-002: Hidden divider with FILL sizing",
    useParent: true,
    params: {
      width: 343, height: 1,
      name: "HiddenDivider",
      fillColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
      layoutSizingHorizontal: "FILL",
      visible: false
    }
  },
  {
    name: "TC-CRF-003: Minimal response (standalone)",
    params: {
      width: 100, height: 50,
      name: "MinimalRect",
      fillColor: { r: 0.95, g: 0.95, b: 0.94, a: 1 },
      cornerRadius: 8,
      x: 420, y: 0
    }
  }
];

function runNextTest() {
  if (currentTest >= tests.length) {
    console.log('\n=== All tests complete ===');
    setTimeout(() => ws.close(), 2000);
    return;
  }

  const test = tests[currentTest];
  console.log(`\nRunning: ${test.name}`);

  const params = { ...test.params };
  if (test.useParent && parentFrameId) {
    params.parentId = parentFrameId;
  }

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_rectangle_full",
      params,
      commandId: `test_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);
  if (parsed.type === 'system') return;
  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (phase === 'create_parent') {
      if (result) {
        parentFrameId = result.id;
        console.log('Parent created:', parentFrameId);
        phase = 'tests';
        setTimeout(() => runNextTest(), 500);
      }
      return;
    }

    if (result) {
      const keys = Object.keys(result);
      console.log('  Result:', JSON.stringify(result));
      console.log('  Minimal payload:', keys.length === 1 && keys[0] === 'id' ? 'YES' : 'NO');
    }
    if (error) {
      console.log('  Error:', error);
    }

    currentTest++;
    setTimeout(() => runNextTest(), 1000);
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Fill color applied correctly
- [ ] Corner radius applied (uniform)
- [ ] Large corner radius produces circle (9999 on square)
- [ ] Opacity applied in single call
- [ ] FILL layout sizing applied after parent append
- [ ] FIXED sizing preserves explicit dimensions
- [ ] `visible: false` hides rectangle node
- [ ] Minimal response payload (`{ id }` only)
- [ ] Parent assignment via parentId works
- [ ] Rectangle at page level (no parentId)
- [ ] Response contains valid Figma node ID format
