# Test Case: create_frame_full

## Command
`create_frame_full`

## Description
Creates a frame with all layout, styling, positioning, gradient, and visibility properties in a single composite command. Replaces the sequence of `create_frame` + `set_layout_sizing` + `set_layout_positioning` + `set_gradient_fill` + `set_visibility`.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Frame width |
| `height` | number | No | 100 | Frame height |
| `name` | string | No | "Frame" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `fillColor` | RGBA / `"__none__"` | No | - | Fill color `{r, g, b, a}` (0-1 range) or `"__none__"` for transparent |
| `strokeColor` | RGBA | No | - | Stroke color `{r, g, b, a}` (0-1 range) |
| `strokeWeight` | number | No | - | Stroke width (requires `strokeColor`) |
| `clipsContent` | boolean | No | false | Clip children to frame bounds |
| `layoutMode` | string | No | "NONE" | `"NONE"`, `"HORIZONTAL"`, `"VERTICAL"` |
| `layoutWrap` | string | No | "NO_WRAP" | `"NO_WRAP"`, `"WRAP"` |
| `paddingTop` | number | No | 10 | Top padding (auto-layout) |
| `paddingRight` | number | No | 10 | Right padding (auto-layout) |
| `paddingBottom` | number | No | 10 | Bottom padding (auto-layout) |
| `paddingLeft` | number | No | 10 | Left padding (auto-layout) |
| `primaryAxisAlignItems` | string | No | "MIN" | `"MIN"`, `"MAX"`, `"CENTER"`, `"SPACE_BETWEEN"` |
| `counterAxisAlignItems` | string | No | "MIN" | `"MIN"`, `"MAX"`, `"CENTER"`, `"BASELINE"` |
| `itemSpacing` | number | No | 0 | Gap between children |
| `counterAxisSpacing` | number | No | - | Cross-axis gap (only when `layoutWrap` is `"WRAP"`) |
| `layoutSizingHorizontal` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
| `layoutSizingVertical` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
| `cornerRadius` | number | No | - | Uniform corner radius |
| `corners` | boolean[4] | No | all true | Which corners receive radius: `[topLeft, topRight, bottomRight, bottomLeft]` |
| `opacity` | number | No | 1 | Node opacity (0-1 range) |
| `effects` | Effect[] | No | - | Array of shadow/blur effects |
| `positioning` | string | No | "AUTO" | `"AUTO"`, `"ABSOLUTE"` — absolute positioning within parent |
| `top` | number | No | - | Top offset (absolute positioning) |
| `left` | number | No | - | Left offset (absolute positioning) |
| `right` | number | No | - | Right offset (absolute positioning) |
| `bottom` | number | No | - | Bottom offset (absolute positioning) |
| `gradientType` | string | No | - | `"GRADIENT_LINEAR"`, `"GRADIENT_RADIAL"`, `"GRADIENT_ANGULAR"`, `"GRADIENT_DIAMOND"` |
| `gradientStops` | GradientStop[] | No | - | Array of `{ color: RGBA, position: 0-1 }` |
| `gradientAngle` | number | No | 0 | Gradient angle in degrees |
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

### Test 1: Basic Frame with Layout + Padding + Gap

**Purpose:** Verify a vertical auto-layout frame is created with all layout properties in a single call.

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    x: 0,
    y: 0,
    width: 393,
    height: 852,
    name: "HomeScreen",
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
    itemSpacing: 24,
    fillColor: { r: 0.98, g: 0.98, b: 0.97, a: 1 },
    layoutSizingHorizontal: "FIXED",
    layoutSizingVertical: "FIXED"
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Frame created at (0, 0) with size 393x852
- Layout mode is VERTICAL
- Padding: top=0, right=16, bottom=0, left=16
- Item spacing is 24
- Fill color is light beige

**Verification Steps:**
1. Check response has `id` field and no other fields
2. Select node in Figma — verify auto-layout VERTICAL
3. Verify padding values in properties panel
4. Verify item spacing is 24

---

### Test 2: Frame with Gradient Fill

**Purpose:** Verify gradient fill is applied within the same composite call.

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    width: 393,
    height: 52,
    name: "GradientButton",
    layoutMode: "HORIZONTAL",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
    cornerRadius: 12,
    fillColor: { r: 1, g: 0.6, b: 0.2, a: 1 },
    gradientType: "GRADIENT_LINEAR",
    gradientStops: [
      { color: { r: 1, g: 0.6, b: 0.2, a: 1 }, position: 0 },
      { color: { r: 0.8, g: 0.48, b: 0.16, a: 1 }, position: 1 }
    ],
    gradientAngle: 180
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Frame has a linear gradient from orange to dark orange (top to bottom)
- Corner radius is 12
- Alignment is centered on both axes

**Verification Steps:**
1. Select node — verify Fill shows gradient (not solid)
2. Verify gradient direction is vertical (180 degrees)
3. Verify two color stops at positions 0 and 1

---

### Test 3: Frame with Absolute Positioning + Offsets

**Purpose:** Verify absolute positioning with constraints is applied after parent append.

**Prerequisites:**
- Create a parent frame first and note its ID

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    width: 56,
    height: 56,
    name: "FAB",
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
    fillColor: { r: 0.12, g: 0.72, b: 0.80, a: 1 },
    cornerRadius: 9999,
    positioning: "ABSOLUTE",
    right: 16,
    bottom: 83,
    effects: [{ type: "DROP_SHADOW", visible: true, radius: 12, color: { r: 0, g: 0, b: 0, a: 0.15 }, offset: { x: 0, y: 4 }, spread: 0 }]
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Frame is absolutely positioned within parent
- Positioned 16px from right edge, 83px from bottom edge
- Circular shape (cornerRadius 9999)
- Drop shadow applied

**Verification Steps:**
1. Select node — verify "Absolute position" is enabled in properties panel
2. Verify constraint indicators show right=16, bottom=83
3. Verify shadow in effects section

---

### Test 4: Frame with FILL/HUG Sizing

**Purpose:** Verify non-FIXED layout sizing is applied correctly after parent append (workaround for Figma API bug).

**Prerequisites:**
- Create a parent frame with `layoutMode: "VERTICAL"`, `width: 393`

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    name: "FillHugChild",
    layoutMode: "HORIZONTAL",
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    paddingLeft: 16,
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
    fillColor: { r: 1, g: 1, b: 1, a: 1 },
    layoutSizingHorizontal: "FILL",
    layoutSizingVertical: "HUG"
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Frame stretches to fill parent width (FILL)
- Frame hugs content vertically (HUG)
- No null ID returned (Figma API bug avoided)

**Verification Steps:**
1. Check response `id` is a valid non-null Figma ID (format "N:N")
2. Select node — verify horizontal sizing shows "Fill" in properties
3. Verify vertical sizing shows "Hug"
4. Resize parent — child should stretch horizontally

---

### Test 5: Frame with `visible: false`

**Purpose:** Verify visibility is set last and node is hidden in the layers panel.

**Prerequisites:**
- Create a parent frame first

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    name: "HiddenFrame",
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    fillColor: { r: 0.95, g: 0.95, b: 0.94, a: 1 },
    layoutSizingHorizontal: "FILL",
    layoutSizingVertical: "HUG",
    visible: false
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Node appears in layers panel with hidden icon
- Node is not visible on canvas

**Verification Steps:**
1. Check node exists in layers panel
2. Verify eye icon indicates hidden state
3. Toggle visibility manually — frame should appear with correct fill and sizing

---

### Test 6: Minimal Response Payload

**Purpose:** Verify the composite command returns only `{ id }` and no extra fields (unlike the original `create_frame` which returned 16 fields).

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    width: 200,
    height: 100,
    name: "MinimalResponse"
  }
}
```

**Expected Result:**
- Response is exactly `{ id: "N:N" }`
- No `name`, `x`, `y`, `width`, `height`, `fills`, `strokes`, `strokeWeight`, `layoutMode`, `layoutWrap`, `cornerRadius`, `opacity`, `effects`, `parentId` fields

**Verification Steps:**
1. Log full response object
2. Verify `Object.keys(result)` has exactly 1 entry: `["id"]`

---

### Test 7: Absolute + FILL Width (Stretch Behavior)

**Purpose:** Verify that absolute positioning with left=0 and right=0 produces stretch-to-parent behavior.

**Prerequisites:**
- Create a parent frame with `layoutMode: "VERTICAL"`, `width: 393`, `height: 852`

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    name: "StretchOverlay",
    height: 200,
    fillColor: { r: 0, g: 0, b: 0, a: 0.5 },
    positioning: "ABSOLUTE",
    left: 0,
    right: 0,
    bottom: 0
  }
}
```

**Expected Result:**
- Frame stretches full width of parent (left=0, right=0)
- Frame is 200px tall, pinned to bottom
- Semi-transparent black overlay

**Verification Steps:**
1. Verify node stretches from left to right edge of parent
2. Verify height is 200
3. Verify node is at the bottom of parent
4. Resize parent width — overlay should stretch with it

---

### Test 8: Invalid parentId

**Purpose:** Verify descriptive error when parent node does not exist.

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    parentId: "999:999",
    name: "Orphan",
    width: 100,
    height: 100
  }
}
```

**Expected Result:**
- Error response with message indicating parent not found
- No frame created on canvas

---

### Test 9: Nested Parent-Child via parentId

**Purpose:** Verify a child frame is correctly appended to a parent created in a prior call.

**Commands (sequential):**
```javascript
// Step 1: Create parent
{
  command: "create_frame_full",
  params: {
    width: 393,
    height: 852,
    name: "Root",
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    fillColor: { r: 0.98, g: 0.98, b: 0.97, a: 1 }
  }
}

// Step 2: Create child using parent ID from step 1
{
  command: "create_frame_full",
  params: {
    parentId: "ROOT_ID_FROM_STEP_1",
    name: "Header",
    layoutMode: "HORIZONTAL",
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
    fillColor: { r: 1, g: 1, b: 1, a: 1 },
    layoutSizingHorizontal: "FILL",
    layoutSizingVertical: "HUG"
  }
}
```

**Expected Result:**
- Both calls return `{ id: "..." }`
- Header is a child of Root in the layer tree
- Header fills Root width and hugs content height

**Verification Steps:**
1. Expand Root in layers panel — Header should be nested inside
2. Header stretches to Root width minus padding

---

### Test 10: Shadow + Stroke + Opacity + Radius Combined

**Purpose:** Verify all visual styling properties can be applied together in a single call.

**Command:**
```javascript
{
  command: "create_frame_full",
  params: {
    width: 343,
    height: 120,
    name: "StyledCard",
    layoutMode: "VERTICAL",
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    itemSpacing: 8,
    fillColor: { r: 1, g: 1, b: 1, a: 1 },
    cornerRadius: 12,
    opacity: 0.95,
    strokeColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
    strokeWeight: 1,
    effects: [{ type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.05 }, offset: { x: 0, y: 1 }, spread: 0 }],
    clipsContent: true
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Frame has 12px corner radius
- Opacity at 95%
- 1px light gray stroke
- Subtle drop shadow
- Content clipping enabled

**Verification Steps:**
1. Verify corner radius shows 12 in properties
2. Verify opacity shows 95%
3. Verify stroke section shows 1px gray border
4. Verify effects section shows drop shadow
5. Verify "Clip content" is checked

---

## Sample Test Script

```javascript
/**
 * Test: create_frame_full composite command
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

  // Create a parent frame for child tests
  setTimeout(() => {
    console.log('Creating parent frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame_full",
        params: {
          x: 0, y: 0, width: 393, height: 852,
          name: "TestParent",
          layoutMode: "VERTICAL",
          paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
          fillColor: { r: 0.98, g: 0.98, b: 0.97, a: 1 }
        },
        commandId: "create_parent"
      }
    }));
  }, 2000);
});

const tests = [
  {
    name: "TC-CFF-001: Basic layout + padding + gap",
    params: {
      width: 393, height: 200,
      name: "LayoutFrame",
      layoutMode: "VERTICAL",
      paddingTop: 0, paddingRight: 16, paddingBottom: 0, paddingLeft: 16,
      itemSpacing: 24,
      fillColor: { r: 0.95, g: 0.95, b: 0.94, a: 1 },
      x: 420
    }
  },
  {
    name: "TC-CFF-002: Gradient fill",
    params: {
      width: 343, height: 52,
      name: "GradientButton",
      layoutMode: "HORIZONTAL",
      paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      cornerRadius: 12,
      fillColor: { r: 1, g: 0.6, b: 0.2, a: 1 },
      gradientType: "GRADIENT_LINEAR",
      gradientStops: [
        { color: { r: 1, g: 0.6, b: 0.2, a: 1 }, position: 0 },
        { color: { r: 0.8, g: 0.48, b: 0.16, a: 1 }, position: 1 }
      ],
      gradientAngle: 180,
      x: 420, y: 220
    }
  },
  {
    name: "TC-CFF-004: FILL/HUG sizing (child)",
    useParent: true,
    params: {
      name: "FillHugChild",
      layoutMode: "HORIZONTAL",
      paddingTop: 8, paddingRight: 16, paddingBottom: 8, paddingLeft: 16,
      primaryAxisAlignItems: "SPACE_BETWEEN",
      counterAxisAlignItems: "CENTER",
      fillColor: { r: 1, g: 1, b: 1, a: 1 },
      layoutSizingHorizontal: "FILL",
      layoutSizingVertical: "HUG"
    }
  },
  {
    name: "TC-CFF-005: Hidden frame (child)",
    useParent: true,
    params: {
      name: "HiddenFrame",
      layoutMode: "VERTICAL",
      paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
      fillColor: { r: 0.95, g: 0.95, b: 0.94, a: 1 },
      layoutSizingHorizontal: "FILL",
      layoutSizingVertical: "HUG",
      visible: false
    }
  },
  {
    name: "TC-CFF-006: Minimal response check",
    params: {
      width: 100, height: 100,
      name: "MinimalResponse",
      x: 420, y: 300
    }
  },
  {
    name: "TC-CFF-010: Shadow + stroke + opacity + radius",
    params: {
      width: 343, height: 120,
      name: "StyledCard",
      layoutMode: "VERTICAL",
      paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
      itemSpacing: 8,
      fillColor: { r: 1, g: 1, b: 1, a: 1 },
      cornerRadius: 12,
      opacity: 0.95,
      strokeColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
      strokeWeight: 1,
      effects: [{ type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.05 }, offset: { x: 0, y: 1 }, spread: 0 }],
      clipsContent: true,
      x: 420, y: 420
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
      command: "create_frame_full",
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
      console.log('  Response keys:', keys.join(', '));
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

- [ ] Basic vertical auto-layout with padding and gap
- [ ] Horizontal auto-layout with center alignment
- [ ] Gradient fill (linear) applied in single call
- [ ] Gradient fill (radial) applied in single call
- [ ] Absolute positioning with top/left offsets
- [ ] Absolute positioning with right/bottom offsets
- [ ] FILL sizing applied after parent append (no null ID)
- [ ] HUG sizing applied after parent append (no null ID)
- [ ] `visible: false` hides node in layers
- [ ] Minimal response payload (`{ id }` only)
- [ ] Stretch behavior (absolute + left=0, right=0)
- [ ] Invalid parentId returns error
- [ ] Nested parent-child via parentId
- [ ] Shadow effect applied
- [ ] Stroke color and weight applied
- [ ] Opacity applied
- [ ] Corner radius applied
- [ ] Partial corner radius (`corners` array)
- [ ] Clips content enabled
- [ ] `fillColor: "__none__"` produces transparent frame
- [ ] Layout wrap with counterAxisSpacing
- [ ] Response contains valid Figma node ID format
