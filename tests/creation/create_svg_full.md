# Test Case: create_svg_full

## Command
`create_svg_full`

## Description
Creates a vector node from SVG data with opacity, layout sizing, and visibility in a single composite command. Replaces the sequence of `create_svg` + `set_opacity` + `set_layout_sizing` + `set_visibility`. Supports both full SVG markup and raw path data, with automatic style detection (fill vs stroke).

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `svg` | string | **Yes** | - | SVG path data or full `<svg>` markup |
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | (from viewBox or 24) | Target width in pixels |
| `height` | number | No | (from viewBox or 24) | Target height in pixels |
| `name` | string | No | "SVG" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `fillColor` | RGBA | No | - | Override fill color `{r, g, b, a}` (0-1 range) |
| `strokeColor` | RGBA | No | - | Override stroke color `{r, g, b, a}` (0-1 range) |
| `strokeWeight` | number | No | 1.5 | Stroke width (for stroke-style SVGs) |
| `windingRule` | string | No | "EVENODD" | `"EVENODD"`, `"NONZERO"` |
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

### Test 1: SVG with Opacity + FIXED Sizing + Visibility

**Purpose:** Verify a solid-filled icon is created with opacity, explicit sizing, and visibility applied in a single composite call.

**Prerequisites:**
- Create a parent frame with `layoutMode: "HORIZONTAL"`

**Command:**
```javascript
{
  command: "create_svg_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\"/></svg>",
    width: 24,
    height: 24,
    name: "StarIcon",
    fillColor: { r: 1, g: 0.8, b: 0, a: 1 },
    opacity: 0.8,
    visible: true
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Star icon rendered as vector
- Filled with gold color
- Opacity at 80%
- Size exactly 24x24

**Verification Steps:**
1. Select node — verify it is a vector (not frame)
2. Verify fill is gold `{ r: 1, g: 0.8, b: 0, a: 1 }`
3. Verify opacity is 80%
4. Verify dimensions are 24x24
5. Verify node name is "StarIcon"

---

### Test 2: Stroke-Style SVG with Non-FIXED Sizing

**Purpose:** Verify a stroke-style (outlined) icon is created with correct stroke properties and non-FIXED layout sizing applied after parent append.

**Prerequisites:**
- Create a parent frame with `layoutMode: "HORIZONTAL"`, `counterAxisAlignItems: "CENTER"`

**Command:**
```javascript
{
  command: "create_svg_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg>",
    width: 20,
    height: 20,
    name: "HeartOutline",
    strokeColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
    strokeWeight: 1.5,
    layoutSizingHorizontal: "FIXED",
    layoutSizingVertical: "FIXED"
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Heart outline rendered with stroke (no fill)
- Stroke color is gray
- Stroke weight is 1.5
- Stroke caps and joins are ROUND
- Size is 20x20

**Verification Steps:**
1. Select node — verify stroke is gray, no fill
2. Verify stroke weight is 1.5
3. Verify dimensions are 20x20
4. Verify stroke cap/join are round (smooth curves)

---

### Test 3: Minimal Response and Hidden SVG

**Purpose:** Verify minimal `{ id }` response and that `visible: false` hides the icon.

**Prerequisites:**
- Create a parent frame

**Command:**
```javascript
{
  command: "create_svg_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z\"/></svg>",
    width: 24,
    height: 24,
    name: "HiddenMenuIcon",
    fillColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
    visible: false
  }
}
```

**Expected Result:**
- Response is exactly `{ id: "N:N" }` with no extra fields
- Node exists in layers panel but is hidden
- Not visible on canvas

**Verification Steps:**
1. Verify `Object.keys(result)` equals `["id"]`
2. Find node in layers — verify hidden icon
3. Toggle visibility — hamburger menu icon should appear with black fill

---

## Sample Test Script

```javascript
/**
 * Test: create_svg_full composite command
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
          x: 0, y: 0, width: 300, height: 100,
          name: "IconRow",
          layoutMode: "HORIZONTAL",
          paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
          itemSpacing: 16,
          counterAxisAlignItems: "CENTER",
          fillColor: { r: 1, g: 1, b: 1, a: 1 }
        },
        commandId: "create_parent"
      }
    }));
  }, 2000);
});

const tests = [
  {
    name: "TC-CSF-001: Filled star with opacity",
    params: {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
      width: 24, height: 24,
      name: "StarIcon",
      fillColor: { r: 1, g: 0.8, b: 0, a: 1 },
      opacity: 0.8
    }
  },
  {
    name: "TC-CSF-002: Stroke heart outline",
    params: {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      width: 20, height: 20,
      name: "HeartOutline",
      strokeColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
      strokeWeight: 1.5
    }
  },
  {
    name: "TC-CSF-003: Hidden menu icon + minimal response",
    params: {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
      width: 24, height: 24,
      name: "HiddenMenuIcon",
      fillColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
      visible: false
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

  const params = { ...test.params, parentId: parentFrameId };

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_svg_full",
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

- [ ] Filled SVG (solid icon) renders with correct fill color
- [ ] Stroke SVG (outlined icon) renders with correct stroke color and weight
- [ ] Stroke caps/joins are ROUND
- [ ] Opacity applied in single call
- [ ] FIXED sizing works (explicit width/height)
- [ ] `visible: false` hides icon node
- [ ] Minimal response payload (`{ id }` only)
- [ ] Full SVG markup parsed correctly (viewBox, paths)
- [ ] Raw path data string parsed correctly
- [ ] Multi-path SVG merges into single vector network
- [ ] Icon dimensions match requested width/height
- [ ] Parent assignment via parentId works
- [ ] Response contains valid Figma node ID format
