# Test Case: create_image_full

## Command
`create_image_full`

## Description
Creates an image rectangle with stroke, opacity, corner radius, layout sizing, and visibility in a single composite command. Replaces the sequence of `create_image_rectangle` + `set_stroke_color` + `set_opacity` + `set_layout_sizing` + `set_visibility`.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `imageUrl` | string | No* | - | URL to fetch image from |
| `imageBase64` | string | No* | - | Base64-encoded image data (with or without MIME prefix) |
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Rectangle width |
| `height` | number | No | 100 | Rectangle height |
| `name` | string | No | "Image" | Node name |
| `parentId` | string | No | - | Parent frame ID |
| `scaleMode` | string | No | "FILL" | `"FILL"`, `"FIT"`, `"CROP"`, `"TILE"` |
| `cornerRadius` | number | No | - | Corner radius (applied only if > 0) |
| `strokeColor` | RGBA | No | - | Stroke color `{r, g, b, a}` (0-1 range) |
| `strokeWeight` | number | No | - | Stroke width (requires `strokeColor`) |
| `opacity` | number | No | 1 | Node opacity (0-1 range) |
| `layoutSizingHorizontal` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
| `layoutSizingVertical` | string | No | "FIXED" | `"FIXED"`, `"HUG"`, `"FILL"` — applied after parent append |
| `visible` | boolean | No | true | Node visibility — set last |

**Note:** Either `imageUrl` OR `imageBase64` must be provided. Error if neither is present.

## Expected Response

```json
{
  "id": "123:456"
}
```

**Note:** Composite commands return a minimal payload with only the node ID (unlike `create_image_rectangle` which returned imageHash, position, size, etc.).

---

## Test Scenarios

### Test 1: Image with Stroke + Opacity + Sizing

**Purpose:** Verify all composite properties are applied in a single call — stroke border, opacity, and image fill on a product thumbnail.

**Prerequisites:**
- Create a parent frame with `layoutMode: "VERTICAL"`

**Command:**
```javascript
{
  command: "create_image_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    imageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADq2YfWIVAAAAAElFTkSuQmCC",
    width: 164,
    height: 164,
    name: "ProductImage",
    scaleMode: "FILL",
    cornerRadius: 12,
    strokeColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
    strokeWeight: 1,
    opacity: 0.95,
    layoutSizingHorizontal: "FILL"
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Image displayed with FILL scale mode
- 12px corner radius
- 1px light gray stroke border
- Opacity at 95%
- Stretches horizontally to fill parent width

**Verification Steps:**
1. Select node — verify image fill is present
2. Verify corner radius is 12
3. Verify stroke section shows 1px gray border
4. Verify opacity is 95%
5. Verify horizontal sizing is "Fill" in properties

---

### Test 2: Image with `visible: false`

**Purpose:** Verify hidden image is created but not visible on canvas.

**Prerequisites:**
- Create a parent frame

**Command:**
```javascript
{
  command: "create_image_full",
  params: {
    parentId: "PARENT_FRAME_ID",
    imageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADq2YfWIVAAAAAElFTkSuQmCC",
    width: 80,
    height: 80,
    name: "HiddenAvatar",
    scaleMode: "FILL",
    cornerRadius: 9999,
    visible: false
  }
}
```

**Expected Result:**
- Response contains only `{ id: "..." }`
- Node exists in layers panel but is hidden
- When toggled visible, appears as circular avatar image

**Verification Steps:**
1. Find node in layers — verify hidden icon
2. Toggle visibility — circular image should appear
3. Verify corner radius makes it circular (9999 on 80x80)

---

### Test 3: Minimal Response

**Purpose:** Verify response contains only `{ id }` — no imageHash, position, size, or other fields that `create_image_rectangle` would return.

**Command:**
```javascript
{
  command: "create_image_full",
  params: {
    imageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADq2YfWIVAAAAAElFTkSuQmCC",
    width: 200,
    height: 150,
    name: "MinimalImage",
    scaleMode: "FIT",
    x: 0,
    y: 0
  }
}
```

**Expected Result:**
- Response is exactly `{ id: "N:N" }`
- No `name`, `x`, `y`, `width`, `height`, `imageHash`, `parentId` fields
- Image displayed with FIT scale mode (may show letterboxing)

**Verification Steps:**
1. Log full response
2. Verify `Object.keys(result)` equals `["id"]`
3. Visually confirm image exists with FIT scaling

---

## Sample Test Script

```javascript
/**
 * Test: create_image_full composite command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

// Minimal 10x10 PNG (red square)
const TINY_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADq2YfWIVAAAAAElFTkSuQmCC";

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
          x: 0, y: 0, width: 393, height: 600,
          name: "ImageTestParent",
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
    name: "TC-CIF-001: Stroke + opacity + sizing + radius",
    useParent: true,
    params: {
      imageBase64: TINY_PNG,
      width: 164, height: 164,
      name: "ProductImage",
      scaleMode: "FILL",
      cornerRadius: 12,
      strokeColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
      strokeWeight: 1,
      opacity: 0.95,
      layoutSizingHorizontal: "FILL"
    }
  },
  {
    name: "TC-CIF-002: Hidden circular avatar",
    useParent: true,
    params: {
      imageBase64: TINY_PNG,
      width: 80, height: 80,
      name: "HiddenAvatar",
      scaleMode: "FILL",
      cornerRadius: 9999,
      visible: false
    }
  },
  {
    name: "TC-CIF-003: Minimal response with FIT scale",
    params: {
      imageBase64: TINY_PNG,
      width: 200, height: 150,
      name: "MinimalImage",
      scaleMode: "FIT",
      x: 420, y: 0
    }
  }
];

function runNextTest() {
  if (currentTest >= tests.length) {
    console.log('\n=== All tests complete ===');

    // Bonus: test error case (missing image source)
    console.log('\nTesting error case (no imageUrl or imageBase64)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_image_full",
        params: { width: 100, height: 100, name: "NoImage" },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 5000);
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
      command: "create_image_full",
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
setTimeout(() => ws.close(), 120000);
```

---

## Validation Checklist

- [ ] Image from base64 renders correctly
- [ ] Image from URL renders correctly
- [ ] FILL scale mode (default)
- [ ] FIT scale mode
- [ ] Corner radius applied
- [ ] Large corner radius produces circle (9999 on square)
- [ ] Stroke color and weight applied in single call
- [ ] Opacity applied in single call
- [ ] FILL layout sizing applied after parent append
- [ ] `visible: false` hides image node
- [ ] Minimal response payload (`{ id }` only, no imageHash)
- [ ] Base64 with MIME prefix stripped correctly (`data:image/png;base64,...`)
- [ ] Error when neither imageUrl nor imageBase64 provided
- [ ] Parent assignment via parentId works
- [ ] Response contains valid Figma node ID format
