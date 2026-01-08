# Test Case: set_font_family

## Command
`set_font_family`

## Description
Sets the font family on a text node. Loads the font if available and applies it to the entire text.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of text node to modify |
| `fontFamily` | string | **Yes** | - | Font family name (e.g., "Inter", "Roboto") |
| `fontStyle` | string | No | "Regular" | Font style (e.g., "Regular", "Bold", "Italic") |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Text",
  "fontName": {
    "family": "Roboto",
    "style": "Regular"
  },
  "characters": "Hello World"
}
```

---

## Test Scenarios

### Test 1: Set Font to Inter

**Purpose:** Verify basic font family change.

**Prerequisites:**
- Create a text node, note its ID

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontFamily: "Inter"
  }
}
```

**Expected Result:**
- Text uses Inter font
- `fontName.family` equals "Inter"

---

### Test 2: Set Font to Roboto

**Purpose:** Verify another common font.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontFamily: "Roboto"
  }
}
```

**Expected Result:**
- Text uses Roboto font

---

### Test 3: Set Font with Bold Style

**Purpose:** Verify font family with specific style.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontFamily: "Inter",
    fontStyle: "Bold"
  }
}
```

**Expected Result:**
- Text uses Inter Bold
- `fontName.style` equals "Bold"

---

### Test 4: Set Font with Italic Style

**Purpose:** Verify italic font style.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontFamily: "Inter",
    fontStyle: "Italic"
  }
}
```

**Expected Result:**
- Text uses Inter Italic

---

### Test 5: Set Font with Medium Style

**Purpose:** Verify medium weight style.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontFamily: "Inter",
    fontStyle: "Medium"
  }
}
```

**Expected Result:**
- Text uses Inter Medium

---

### Test 6: Missing fontFamily (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing fontFamily parameter"

---

### Test 7: Non-Text Node (Error Case)

**Purpose:** Verify error when applied to non-text node.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "RECTANGLE_ID",
    fontFamily: "Inter"
  }
}
```

**Expected Result:**
- Error: "Node is not a TEXT node"

---

### Test 8: Non-Existent Font (Error Case)

**Purpose:** Verify error for unavailable font.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontFamily: "NonExistentFont12345"
  }
}
```

**Expected Result:**
- Error indicating font failed to load

---

### Test 9: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_font_family",
  params: {
    nodeId: "999:999",
    fontFamily: "Inter"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_font_family command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const fontTests = [
  { name: "Inter Regular", params: { fontFamily: "Inter" } },
  { name: "Inter Bold", params: { fontFamily: "Inter", fontStyle: "Bold" } },
  { name: "Inter Medium", params: { fontFamily: "Inter", fontStyle: "Medium" } },
  { name: "Roboto Regular", params: { fontFamily: "Roboto" } }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Creating test text node...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_text",
        params: { text: "Font Family Test", x: 0, y: 0 },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runFontTest() {
  if (currentTest >= fontTests.length) {
    console.log('\n=== All font family tests complete ===');
    ws.close();
    return;
  }

  const test = fontTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_font_family",
      params: { nodeId: createdNodeId, ...test.params },
      commandId: `font_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created text node:', createdNodeId);
      phase = 'font';
      setTimeout(() => runFontTest(), 500);
    } else if (result && phase === 'font') {
      console.log('  Font:', result.fontName.family, result.fontName.style);
      console.log('  ✓ Font family set successfully');

      currentTest++;
      setTimeout(() => runFontTest(), 500);
    }

    if (error) {
      console.log('Error:', error);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Inter font family applied correctly
- [ ] Roboto font family applied correctly
- [ ] Bold font style works
- [ ] Italic font style works
- [ ] Medium font style works
- [ ] Default style is "Regular" when not specified
- [ ] Error for missing fontFamily
- [ ] Error for non-text node
- [ ] Error for non-existent font
- [ ] Error for non-existent node
- [ ] Response contains `fontName` object
- [ ] Text content preserved after font change
- [ ] Font visible and correct in Figma
