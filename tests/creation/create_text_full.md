# Test Case: create_text_full

## Command
`create_text_full`

## Description
Creates a text node with all typography, appearance, sizing, gradient, and visibility properties in a single composite command. Replaces the sequence of `create_text` + `set_opacity` + `set_line_height` + `set_letter_spacing` + `set_text_truncation` + `set_layout_sizing` + `set_gradient_fill` + `set_visibility`. Loads the font only once instead of up to 5 times.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | - | Text width (enables `textAutoResize: "HEIGHT"` for wrapping) |
| `text` | string | No | "Text" | Text content |
| `name` | string | No | (text value) | Node name |
| `fontSize` | number | No | 14 | Font size in pixels |
| `fontWeight` | number | No | 400 | Font weight (100-900) |
| `fontColor` | RGBA | No | `{r:0,g:0,b:0,a:1}` | Text color `{r, g, b, a}` (0-1 range) |
| `textAlignHorizontal` | string | No | "LEFT" | `"LEFT"`, `"CENTER"`, `"RIGHT"`, `"JUSTIFIED"` |
| `parentId` | string | No | - | Parent frame ID |
| `lineHeight` | number / `"AUTO"` | No | - | Line height value or `"AUTO"` |
| `lineHeightUnit` | string | No | "PIXELS" | `"PIXELS"`, `"PERCENT"` |
| `letterSpacing` | number | No | - | Letter spacing value |
| `letterSpacingUnit` | string | No | "PIXELS" | `"PIXELS"`, `"PERCENT"` |
| `maxLines` | number | No | - | Maximum visible lines (enables `ENDING` truncation) |
| `opacity` | number | No | 1 | Node opacity (0-1 range) |
| `layoutSizingHorizontal` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
| `layoutSizingVertical` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
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

### Test 1: Text with lineHeight + letterSpacing + Opacity

**Purpose:** Verify all typography and appearance params are applied in a single round-trip.

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    text: "Product Title",
    fontSize: 20,
    fontWeight: 600,
    fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
    lineHeight: 28,
    letterSpacing: 0.5,
    opacity: 0.9,
    name: "ProductTitle",
    x: 0,
    y: 0
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Font: Inter Semi Bold 20px
- Line height: 28px
- Letter spacing: 0.5px
- Opacity: 90%

**Verification Steps:**
1. Select text node — verify font is "Inter", style "Semi Bold", size 20
2. Verify line height shows 28 in properties
3. Verify letter spacing shows 0.5
4. Verify opacity shows 90%

---

### Test 2: Text with maxLines Truncation

**Purpose:** Verify truncation with ellipsis is applied when maxLines is set.

**Prerequisites:**
- Create a parent frame with `layoutMode: "VERTICAL"`, `width: 200`

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    text: "This is a very long product description that should be truncated after exactly two lines of text with an ellipsis indicator at the end.",
    fontSize: 14,
    fontWeight: 400,
    fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
    lineHeight: 20,
    maxLines: 2,
    width: 200,
    name: "TruncatedDescription",
    layoutSizingHorizontal: "FILL"
  }
}
```

**Expected Result:**
- Text truncated after 2 lines with ellipsis (...)
- Text fills parent width
- Line height is 20px

**Verification Steps:**
1. Verify text shows "..." at the end of second line
2. Verify "Max lines" shows 2 in text properties
3. Verify truncation mode is "Ending"

---

### Test 3: Text with FILL Sizing in Vertical Parent

**Purpose:** Verify text stretches to fill parent width when inside a vertical auto-layout parent.

**Prerequisites:**
- Create a parent frame with `layoutMode: "VERTICAL"`, `layoutSizingHorizontal: "FILL"`, `width: 393`

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    text: "Long description that should wrap to fill the parent container width automatically.",
    fontSize: 14,
    fontWeight: 400,
    fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
    lineHeight: 20,
    name: "WrappingText",
    layoutSizingHorizontal: "FILL"
  }
}
```

**Expected Result:**
- Text stretches to full parent width
- Text wraps to multiple lines
- No null ID (sizing applied after parent append)

**Verification Steps:**
1. Verify text width matches parent content width
2. Resize parent — text should reflow
3. Verify horizontal sizing shows "Fill" in properties

---

### Test 4: Text with Gradient Fill

**Purpose:** Verify gradient text is created in a single call (gradient replaces solid fontColor).

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    text: "No listings yet",
    fontSize: 20,
    fontWeight: 600,
    fontColor: { r: 0.12, g: 0.72, b: 0.80, a: 1 },
    textAlignHorizontal: "CENTER",
    lineHeight: 28,
    name: "GradientTitle",
    gradientType: "GRADIENT_LINEAR",
    gradientStops: [
      { color: { r: 0.12, g: 0.72, b: 0.80, a: 1 }, position: 0 },
      { color: { r: 1, g: 0.6, b: 0.2, a: 1 }, position: 1 }
    ],
    gradientAngle: 180,
    x: 0,
    y: 0
  }
}
```

**Expected Result:**
- Text displays with gradient from teal to orange
- Text alignment is centered
- Line height is 28px

**Verification Steps:**
1. Select text — verify Fill shows gradient (not solid)
2. Verify gradient goes from teal (top) to orange (bottom)
3. Verify text content reads "No listings yet"

---

### Test 5: Text with `visible: false`

**Purpose:** Verify hidden text node is created but not visible on canvas.

**Prerequisites:**
- Create a parent frame first

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    text: "Hidden Label",
    fontSize: 14,
    fontWeight: 400,
    fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
    name: "HiddenLabel",
    visible: false
  }
}
```

**Expected Result:**
- Response contains `{ id: "..." }`
- Node exists in layers panel but is hidden
- Not visible on canvas

**Verification Steps:**
1. Find node in layers — verify hidden icon
2. Toggle visibility — text "Hidden Label" should appear

---

### Test 6: Minimal Response

**Purpose:** Verify response contains only `{ id }` — no characters, fontSize, fontName, fills, etc.

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    text: "Minimal",
    fontSize: 16,
    fontWeight: 400,
    x: 0,
    y: 100
  }
}
```

**Expected Result:**
- Response is exactly `{ id: "N:N" }`
- No `characters`, `fontSize`, `fontWeight`, `fontColor`, `fontName`, `fills`, `parentId` fields

**Verification Steps:**
1. Log full response
2. Verify `Object.keys(result)` equals `["id"]`

---

### Test 7: Font Loads Once (Performance)

**Purpose:** Verify that the composite command does not redundantly load the font for lineHeight, letterSpacing, and truncation (was 5 loads, now 1).

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    text: "Performance Test",
    fontSize: 14,
    fontWeight: 600,
    fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
    lineHeight: 20,
    letterSpacing: 0.2,
    maxLines: 3,
    name: "PerfText",
    x: 0,
    y: 150
  }
}
```

**Expected Result:**
- Command completes successfully
- All properties (lineHeight, letterSpacing, maxLines) are applied
- Noticeably faster than calling create_text + set_line_height + set_letter_spacing + set_text_truncation separately

**Verification Steps:**
1. Verify line height is 20
2. Verify letter spacing is 0.2
3. Verify max lines is 3
4. Measure round-trip time — should be single WebSocket round-trip (~20-40ms)

---

### Test 8: Missing parentId (Root-Level Text)

**Purpose:** Verify text can be created at the page level without a parentId.

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    text: "Page-Level Text",
    fontSize: 24,
    fontWeight: 700,
    fontColor: { r: 0.2, g: 0.2, b: 0.8, a: 1 },
    x: 500,
    y: 0
  }
}
```

**Expected Result:**
- Text created directly on current page
- Not nested inside any frame
- Position at (500, 0)

**Verification Steps:**
1. Verify text appears at page root level in layers
2. Verify position is (500, 0)

---

### Test 9: Text with All Optional Params Omitted

**Purpose:** Verify default behavior when only minimal params are provided.

**Command:**
```javascript
{
  command: "create_text_full",
  params: {}
}
```

**Expected Result:**
- Text node created with content "Text"
- Font: Inter Regular 14px
- Color: black
- Position: (0, 0)
- Name defaults to "Text"

**Verification Steps:**
1. Verify text content is "Text"
2. Verify font is Inter Regular 14

---

### Test 10: Long Text with lineHeight + Truncation + FILL

**Purpose:** Verify all text features interact correctly: wrapping, line height, truncation, and FILL sizing.

**Prerequisites:**
- Create a parent frame with `layoutMode: "VERTICAL"`, `width: 300`

**Command:**
```javascript
{
  command: "create_text_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    fontSize: 14,
    fontWeight: 400,
    fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
    lineHeight: 20,
    letterSpacing: 0.1,
    maxLines: 3,
    name: "LongTruncated",
    layoutSizingHorizontal: "FILL"
  }
}
```

**Expected Result:**
- Text fills parent width (300px content area)
- Line height is 20px
- Letter spacing is 0.1px
- Truncated after 3 lines with ellipsis
- Total height approximately 60px (3 lines x 20px)

**Verification Steps:**
1. Verify text ends with "..." on line 3
2. Verify text width matches parent content area
3. Verify line height is 20
4. Verify letter spacing is 0.1
5. Verify max lines is 3

---

## Sample Test Script

```javascript
/**
 * Test: create_text_full composite command
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
          x: 0, y: 0, width: 300, height: 600,
          name: "TextTestParent",
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
    name: "TC-CTF-001: lineHeight + letterSpacing + opacity",
    params: {
      text: "Product Title",
      fontSize: 20, fontWeight: 600,
      fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
      lineHeight: 28, letterSpacing: 0.5, opacity: 0.9,
      name: "ProductTitle",
      x: 350, y: 0
    }
  },
  {
    name: "TC-CTF-002: maxLines truncation (child)",
    useParent: true,
    params: {
      text: "This is a very long product description that should be truncated after exactly two lines of text with an ellipsis at the end.",
      fontSize: 14, fontWeight: 400,
      fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
      lineHeight: 20, maxLines: 2,
      name: "TruncatedDesc",
      layoutSizingHorizontal: "FILL"
    }
  },
  {
    name: "TC-CTF-003: FILL sizing in parent (child)",
    useParent: true,
    params: {
      text: "Long description that wraps to fill the parent.",
      fontSize: 14, fontWeight: 400,
      fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
      lineHeight: 20,
      name: "FillText",
      layoutSizingHorizontal: "FILL"
    }
  },
  {
    name: "TC-CTF-004: Gradient text",
    params: {
      text: "No listings yet",
      fontSize: 20, fontWeight: 600,
      fontColor: { r: 0.12, g: 0.72, b: 0.80, a: 1 },
      textAlignHorizontal: "CENTER",
      lineHeight: 28,
      name: "GradientTitle",
      gradientType: "GRADIENT_LINEAR",
      gradientStops: [
        { color: { r: 0.12, g: 0.72, b: 0.80, a: 1 }, position: 0 },
        { color: { r: 1, g: 0.6, b: 0.2, a: 1 }, position: 1 }
      ],
      gradientAngle: 180,
      x: 350, y: 40
    }
  },
  {
    name: "TC-CTF-006: Minimal response",
    params: {
      text: "Minimal", fontSize: 16, fontWeight: 400,
      x: 350, y: 80
    }
  },
  {
    name: "TC-CTF-009: All defaults",
    params: {}
  },
  {
    name: "TC-CTF-010: Long + lineHeight + truncation + FILL (child)",
    useParent: true,
    params: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      fontSize: 14, fontWeight: 400,
      fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
      lineHeight: 20, letterSpacing: 0.1, maxLines: 3,
      name: "LongTruncated",
      layoutSizingHorizontal: "FILL"
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
      command: "create_text_full",
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

- [ ] Text with lineHeight applied in single call
- [ ] Text with letterSpacing applied in single call
- [ ] Text with opacity applied in single call
- [ ] Text with maxLines truncation (ellipsis visible)
- [ ] Text with FILL sizing wraps to parent width
- [ ] Text with HUG sizing (default)
- [ ] Gradient text (linear) renders correctly
- [ ] `visible: false` hides text node
- [ ] Minimal response payload (`{ id }` only)
- [ ] Single font load (performance improvement)
- [ ] Root-level text (no parentId)
- [ ] Default parameters work (empty params)
- [ ] Long text with all features combined
- [ ] Text alignment (LEFT, CENTER, RIGHT)
- [ ] Font weight mapping (400=Regular, 600=SemiBold, 700=Bold)
- [ ] Width param enables auto-height wrapping
- [ ] Response contains valid Figma node ID format
