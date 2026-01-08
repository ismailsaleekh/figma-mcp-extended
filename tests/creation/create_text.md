# Test Case: create_text

## Command
`create_text`

## Description
Creates a new text node with customizable font properties and content.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `text` | string | No | "Text" | Text content |
| `fontSize` | number | No | 14 | Font size in pixels |
| `fontWeight` | number | No | 400 | Font weight (100-900) |
| `fontColor` | RGBA | No | `{r:0,g:0,b:0,a:1}` | Text color (0-1 range) |
| `name` | string | No | (uses text) | Node name |
| `parentId` | string | No | - | Parent frame ID |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Hello World",
  "x": 0,
  "y": 0,
  "width": 85,
  "height": 17,
  "characters": "Hello World",
  "fontSize": 14,
  "fontWeight": 400,
  "fontColor": { "r": 0, "g": 0, "b": 0, "a": 1 },
  "fontName": { "family": "Inter", "style": "Regular" },
  "fills": [...],
  "parentId": "0:1"
}
```

---

## Test Scenarios

### Test 1: Create Text with Default Parameters

**Purpose:** Verify text creation with minimal parameters.

**Command:**
```javascript
{
  command: "create_text",
  params: {}
}
```

**Expected Result:**
- Text node created with content "Text"
- Position at (0, 0)
- Font size 14px
- Black color

**Verification Steps:**
1. Check response contains `id`
2. Check `characters` equals "Text"
3. Check `fontSize` equals 14

---

### Test 2: Create Text with Custom Content

**Purpose:** Verify custom text content.

**Command:**
```javascript
{
  command: "create_text",
  params: {
    text: "Hello, Figma!",
    x: 100,
    y: 50
  }
}
```

**Expected Result:**
- Text content is "Hello, Figma!"
- Position at (100, 50)
- Node name defaults to "Hello, Figma!"

---

### Test 3: Create Text with Custom Name (Different from Content)

**Purpose:** Verify name can differ from text content.

**Command:**
```javascript
{
  command: "create_text",
  params: {
    text: "Click here to continue",
    name: "CTA Button Text",
    x: 100,
    y: 100
  }
}
```

**Expected Result:**
- `characters` is "Click here to continue"
- `name` is "CTA Button Text"

---

### Test 4: Create Large Heading Text

**Purpose:** Verify large font size.

**Command:**
```javascript
{
  command: "create_text",
  params: {
    text: "Welcome",
    fontSize: 48,
    fontWeight: 700,
    x: 50,
    y: 50
  }
}
```

**Expected Result:**
- Font size is 48px
- Font weight is 700 (Bold)
- Font style should be "Bold"

**Verification Steps:**
1. Check `fontSize` equals 48
2. Check `fontWeight` equals 700
3. Visually confirm bold text in Figma

---

### Test 5: Create Colored Text

**Purpose:** Verify text color customization.

**Command:**
```javascript
{
  command: "create_text",
  params: {
    text: "Error message",
    fontColor: { r: 0.9, g: 0.2, b: 0.2, a: 1 },
    fontSize: 14,
    x: 100,
    y: 200
  }
}
```

**Expected Result:**
- Text is red color
- `fills` array contains solid paint with red color

**Verification Steps:**
1. Check `fontColor` matches provided values
2. Visually confirm red text in Figma

---

### Test 6: Create Semi-Transparent Text

**Purpose:** Verify opacity in text color.

**Command:**
```javascript
{
  command: "create_text",
  params: {
    text: "Subtle hint",
    fontColor: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 },
    fontSize: 12,
    x: 100,
    y: 250
  }
}
```

**Expected Result:**
- Text has 50% opacity
- Gray color with transparency

---

### Test 7: Create Text with Different Font Weights

**Purpose:** Verify font weight mapping to styles.

**Commands (run sequentially):**
```javascript
// Light (300)
{ command: "create_text", params: { text: "Light", fontWeight: 300, x: 0, y: 0 } }

// Regular (400)
{ command: "create_text", params: { text: "Regular", fontWeight: 400, x: 0, y: 30 } }

// Medium (500)
{ command: "create_text", params: { text: "Medium", fontWeight: 500, x: 0, y: 60 } }

// Semi Bold (600)
{ command: "create_text", params: { text: "Semi Bold", fontWeight: 600, x: 0, y: 90 } }

// Bold (700)
{ command: "create_text", params: { text: "Bold", fontWeight: 700, x: 0, y: 120 } }

// Extra Bold (800)
{ command: "create_text", params: { text: "Extra Bold", fontWeight: 800, x: 0, y: 150 } }

// Black (900)
{ command: "create_text", params: { text: "Black", fontWeight: 900, x: 0, y: 180 } }
```

**Expected Result:**
- Each text has appropriate font style
- Font family remains "Inter"

---

### Test 8: Create Text Inside Frame

**Purpose:** Verify text can be nested in parent frame.

**Prerequisites:**
- Create a frame first and note its ID

**Command:**
```javascript
{
  command: "create_text",
  params: {
    parentId: "FRAME_ID_HERE",
    text: "Label inside frame",
    x: 10,
    y: 10,
    fontSize: 14
  }
}
```

**Expected Result:**
- Text created inside the frame
- `parentId` matches provided frame ID

---

### Test 9: Create Multi-line Text

**Purpose:** Verify text with line breaks.

**Command:**
```javascript
{
  command: "create_text",
  params: {
    text: "Line 1\nLine 2\nLine 3",
    x: 100,
    y: 300,
    fontSize: 16
  }
}
```

**Expected Result:**
- Text displays on multiple lines
- Line breaks preserved

---

### Test 10: Create Text with Special Characters

**Purpose:** Verify special characters are handled.

**Command:**
```javascript
{
  command: "create_text",
  params: {
    text: "Price: $99.99 (50% off!)",
    x: 100,
    y: 350,
    fontSize: 18
  }
}
```

**Expected Result:**
- All special characters rendered correctly
- Dollar sign, parentheses, percent sign preserved

---

## Sample Test Script

```javascript
/**
 * Test: create_text command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  {
    name: "Default text",
    params: {}
  },
  {
    name: "Custom content",
    params: { text: "Hello, Figma!", x: 0, y: 30 }
  },
  {
    name: "Large heading",
    params: {
      text: "Welcome",
      fontSize: 48,
      fontWeight: 700,
      x: 0,
      y: 60
    }
  },
  {
    name: "Red colored text",
    params: {
      text: "Error message",
      fontColor: { r: 0.9, g: 0.2, b: 0.2, a: 1 },
      x: 0,
      y: 130
    }
  },
  {
    name: "Semi-transparent text",
    params: {
      text: "Subtle hint",
      fontColor: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 },
      fontSize: 12,
      x: 0,
      y: 160
    }
  },
  {
    name: "Multi-line text",
    params: {
      text: "Line 1\nLine 2\nLine 3",
      x: 0,
      y: 190
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
      command: "create_text",
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
      console.log(`Result:`);
      console.log('  ID:', result.id);
      console.log('  Characters:', result.characters);
      console.log('  Font Size:', result.fontSize);
      console.log('  Font Name:', JSON.stringify(result.fontName));

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

- [x] Text created with default parameters
- [x] Custom text content applied
- [ ] Custom name (different from content) works *(not tested)*
- [x] Font size changes correctly (12, 14, 24, 48, etc.)
- [ ] Font weight mapping works:
  - [ ] 300 -> Light *(not tested)*
  - [x] 400 -> Regular
  - [ ] 500 -> Medium *(not tested)*
  - [ ] 600 -> Semi Bold *(not tested)*
  - [x] 700 -> Bold
  - [ ] 800 -> Extra Bold *(not tested)*
  - [ ] 900 -> Black *(not tested)*
- [x] Text color (fontColor) applied correctly
- [ ] Semi-transparent text works (alpha < 1) *(not tested)*
- [ ] Text nested in parent frame works *(not tested)*
- [ ] Multi-line text with \n works *(not tested)*
- [ ] Special characters render correctly *(not tested)*
- [x] Response contains all expected fields
- [x] Text visible and readable in Figma

**Test Run:** 2025-12-25 | **Result:** 4/4 PASSED
