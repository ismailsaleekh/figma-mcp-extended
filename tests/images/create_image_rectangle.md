# Test Case: create_image_rectangle

## Command
`create_image_rectangle`

## Description
Creates a new rectangle with an image fill. Combines rectangle creation and image fill in a single operation. Supports positioning, sizing, corner radius, and parent assignment.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `imageUrl` | string | No* | - | URL to fetch image from |
| `imageBase64` | string | No* | - | Base64-encoded image data |
| `x` | number | No | 0 | X position in pixels |
| `y` | number | No | 0 | Y position in pixels |
| `width` | number | No | 100 | Width in pixels |
| `height` | number | No | 100 | Height in pixels |
| `name` | string | No | "Image" | Node name |
| `parentId` | string | No | - | Parent frame ID (current page if omitted) |
| `scaleMode` | string | No | "FILL" | Image scaling: "FILL", "FIT", "CROP", "TILE" |
| `cornerRadius` | number | No | 0 | Corner radius in pixels |

**Note:** Either `imageUrl` OR `imageBase64` must be provided.

## Expected Response

```json
{
  "id": "123:456",
  "name": "Image",
  "x": 100,
  "y": 200,
  "width": 300,
  "height": 200,
  "imageHash": "a1b2c3d4e5f6...",
  "parentId": "789:012"
}
```

---

## Test Scenarios

### Test 1: Create Image Rectangle with URL

**Purpose:** Verify basic image rectangle creation from URL.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/200/200",
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    name: "My Image"
  }
}
```

**Expected Result:**
- Rectangle created at (100, 100)
- Size is 200x200
- Image fill applied
- `imageHash` is non-empty

**Verification Steps:**
1. Check response contains all position/size values
2. Verify `imageHash` is present
3. Visually confirm image appears

---

### Test 2: Create Image Rectangle with Base64

**Purpose:** Verify image rectangle from base64 data.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADq2YfWIVAAAAAElFTkSuQmCC",
    x: 50,
    y: 50,
    width: 100,
    height: 100
  }
}
```

**Expected Result:**
- Rectangle created with base64 image
- Image decoded and applied correctly

---

### Test 3: Create Image Rectangle with Default Values

**Purpose:** Verify default parameter values.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/100/100"
  }
}
```

**Expected Result:**
- Position: (0, 0)
- Size: 100x100
- Name: "Image"
- Corner radius: 0

---

### Test 4: Create Image Rectangle with Corner Radius

**Purpose:** Verify corner radius is applied.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/200/200",
    width: 200,
    height: 200,
    cornerRadius: 20
  }
}
```

**Expected Result:**
- Rectangle has rounded corners
- Corner radius visually 20px

---

### Test 5: Create Image Rectangle with Large Corner Radius

**Purpose:** Verify large corner radius (circular).

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/100/100",
    width: 100,
    height: 100,
    cornerRadius: 50
  }
}
```

**Expected Result:**
- Rectangle appears as circle
- Full rounding applied

---

### Test 6: Create Image Rectangle Inside Parent Frame

**Purpose:** Verify parent assignment.

**Prerequisites:**
1. Create a frame first
2. Note its ID

**Commands:**
```javascript
// First create parent frame
{ command: "create_frame", params: { x: 0, y: 0, width: 400, height: 400, name: "Parent" } }

// Then create image inside
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/150/150",
    parentId: "PARENT_FRAME_ID",
    x: 50,
    y: 50,
    width: 150,
    height: 150
  }
}
```

**Expected Result:**
- Image rectangle is child of parent frame
- `parentId` in response matches parent frame ID
- Position relative to parent

---

### Test 7: Create Image Rectangle with FIT Scale Mode

**Purpose:** Verify FIT scale mode.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/400/200",
    width: 200,
    height: 200,
    scaleMode: "FIT"
  }
}
```

**Expected Result:**
- Image fits within bounds
- May have letterboxing

---

### Test 8: Create Image Rectangle with TILE Scale Mode

**Purpose:** Verify TILE scale mode.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/50/50",
    width: 200,
    height: 200,
    scaleMode: "TILE"
  }
}
```

**Expected Result:**
- Image tiled/repeated
- Pattern fills rectangle

---

### Test 9: Create Multiple Image Rectangles

**Purpose:** Verify creating multiple image rectangles.

**Commands (execute sequentially):**
```javascript
{ command: "create_image_rectangle", params: { imageUrl: "https://picsum.photos/100/100?1", x: 0, y: 0 } }
{ command: "create_image_rectangle", params: { imageUrl: "https://picsum.photos/100/100?2", x: 110, y: 0 } }
{ command: "create_image_rectangle", params: { imageUrl: "https://picsum.photos/100/100?3", x: 220, y: 0 } }
```

**Expected Result:**
- Three image rectangles created
- Each has unique ID and imageHash

---

### Test 10: Create Large Image Rectangle

**Purpose:** Verify large dimensions work.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/800/600",
    width: 800,
    height: 600,
    name: "Large Image"
  }
}
```

**Expected Result:**
- Large rectangle created
- Image scaled appropriately

---

### Test 11: Missing Image Source (Error Case)

**Purpose:** Verify error when no image provided.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    x: 100,
    y: 100,
    width: 200,
    height: 200
  }
}
```

**Expected Result:**
- Error: "Either imageUrl or imageBase64 must be provided"

---

### Test 12: Invalid Parent ID (Error Case)

**Purpose:** Verify error for non-existent parent.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/100/100",
    parentId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Parent node not found with ID: 999:999"

---

### Test 13: Parent Without Children Support (Error Case)

**Purpose:** Verify error when parent can't have children.

**Prerequisites:**
- Create a rectangle (which can't have children)

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://picsum.photos/100/100",
    parentId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Error: "Parent node does not support children: RECTANGLE_ID"

---

### Test 14: Invalid Image URL (Error Case)

**Purpose:** Verify error for unreachable URL.

**Command:**
```javascript
{
  command: "create_image_rectangle",
  params: {
    imageUrl: "https://invalid-domain-xyz.com/image.png"
  }
}
```

**Expected Result:**
- Error related to image fetch failure

---

## Sample Test Script

```javascript
/**
 * Test: create_image_rectangle command
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
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create parent frame
  setTimeout(() => {
    console.log('Creating parent frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: {
          x: 0, y: 0, width: 500, height: 500,
          name: "Image Gallery"
        },
        commandId: "create_parent"
      }
    }));
  }, 2000);
});

const imageTests = [
  { name: "Basic image", params: { x: 10, y: 10, width: 100, height: 100 } },
  { name: "With corner radius", params: { x: 120, y: 10, width: 100, height: 100, cornerRadius: 20 } },
  { name: "Circular", params: { x: 230, y: 10, width: 100, height: 100, cornerRadius: 50 } },
  { name: "FIT mode", params: { x: 10, y: 120, width: 100, height: 100, scaleMode: "FIT" } },
  { name: "TILE mode", params: { x: 120, y: 120, width: 100, height: 100, scaleMode: "TILE" } },
  { name: "Large", params: { x: 10, y: 230, width: 200, height: 150, name: "Large Image" } }
];

function runImageRectTest() {
  if (currentTest >= imageTests.length) {
    console.log('\n=== All image rectangle tests complete ===');

    // Test error case
    console.log('\nTesting error case (missing image source)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_image_rectangle",
        params: { x: 0, y: 0, width: 100, height: 100 },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 5000);
    return;
  }

  const test = imageTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = {
    ...test.params,
    parentId: parentFrameId,
    imageUrl: `https://picsum.photos/200/200?random=${currentTest}`
  };

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_image_rectangle",
      params,
      commandId: `image_rect_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  // Skip system messages and echo
  if (parsed.type === 'system') {
    if (parsed.message && parsed.message.includes('Joined')) {
      console.log('Channel joined successfully');
    }
    return;
  }

  if (parsed.sender === 'You') return;

  // Handle result
  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      if (phase === 'create_parent') {
        parentFrameId = result.id;
        console.log('Created parent frame:', parentFrameId);
        phase = 'image_rect';
        setTimeout(() => runImageRectTest(), 500);
      } else if (phase === 'image_rect') {
        console.log('Image rectangle result:');
        console.log('  ID:', result.id);
        console.log('  Name:', result.name);
        console.log('  Position:', `(${result.x}, ${result.y})`);
        console.log('  Size:', `${result.width}x${result.height}`);
        console.log('  Image Hash:', result.imageHash ? result.imageHash.substring(0, 20) + '...' : 'N/A');
        console.log('  Parent ID:', result.parentId);

        if (result.imageHash) {
          console.log('  ✓ Image rectangle created');
        } else {
          console.log('  ✗ No image hash');
        }

        currentTest++;
        setTimeout(() => runImageRectTest(), 1000);
      }
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
    }
  }
});

ws.on('close', () => {
  console.log('\nConnection closed');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

// Timeout safety
setTimeout(() => {
  ws.close();
}, 120000);
```

---

## Validation Checklist

- [ ] Image rectangle from URL works
- [ ] Image rectangle from base64 works
- [ ] Default position (0, 0) works
- [ ] Default size (100x100) works
- [ ] Default name "Image" applied
- [ ] Custom position works
- [ ] Custom size works
- [ ] Custom name works
- [ ] Corner radius works
- [ ] Large corner radius (circular) works
- [ ] Parent assignment works
- [ ] Position relative to parent
- [ ] FILL scale mode works (default)
- [ ] FIT scale mode works
- [ ] CROP scale mode works
- [ ] TILE scale mode works
- [ ] Multiple image rectangles can be created
- [ ] Error for missing image source
- [ ] Error for invalid parent ID
- [ ] Error for parent without children support
- [ ] Response contains id, name, position, size
- [ ] Response contains imageHash
- [ ] Response contains parentId
