# Test Case: set_text_content

## Command
`set_text_content`

## Description
Sets the text content of a text node. Automatically loads the required font before setting text.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of text node (colon format) |
| `text` | string | **Yes** | - | New text content to set |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Heading",
  "characters": "New Text Content",
  "fontName": {
    "family": "Inter",
    "style": "Regular"
  }
}
```

---

## Test Scenarios

### Test 1: Set Basic Text Content

**Purpose:** Verify basic text replacement.

**Prerequisites:**
1. Create a text node with initial content
2. Note the text node ID

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID",
    text: "Hello World"
  }
}
```

**Expected Result:**
- `characters` equals "Hello World"
- Text visible in Figma updates
- Original font preserved

---

### Test 2: Set Empty String

**Purpose:** Verify setting empty text.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID",
    text: ""
  }
}
```

**Expected Result:**
- `characters` is empty string
- Text node becomes blank

---

### Test 3: Set Long Text

**Purpose:** Verify long text content.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
}
```

**Expected Result:**
- Full text content set
- Text wraps if in auto-layout

---

### Test 4: Set Text with Line Breaks

**Purpose:** Verify multiline text.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID",
    text: "Line 1\nLine 2\nLine 3"
  }
}
```

**Expected Result:**
- Text has 3 lines
- Line breaks preserved

---

### Test 5: Set Text with Special Characters

**Purpose:** Verify special characters handled.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID",
    text: "Price: $99.99 (50% off!)"
  }
}
```

**Expected Result:**
- Special characters preserved
- Dollar sign, percent, parentheses work

---

### Test 6: Set Text with Unicode

**Purpose:** Verify unicode support.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID",
    text: "Hello 世界 Привет 🌍"
  }
}
```

**Expected Result:**
- Unicode characters displayed
- Emoji rendered (if font supports)

---

### Test 7: Replace Existing Text

**Purpose:** Verify overwriting existing content.

**Prerequisites:**
- Text node with content "Original Text"

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID",
    text: "Replacement Text"
  }
}
```

**Expected Result:**
- Old text completely replaced
- `characters` equals "Replacement Text"

---

### Test 8: Set Text Multiple Times

**Purpose:** Verify sequential updates work.

**Commands (execute sequentially):**
```javascript
{ command: "set_text_content", params: { nodeId: "TEXT_ID", text: "First" } }
{ command: "set_text_content", params: { nodeId: "TEXT_ID", text: "Second" } }
{ command: "set_text_content", params: { nodeId: "TEXT_ID", text: "Third" } }
```

**Expected Result:**
- Each update applies correctly
- Final text is "Third"

---

### Test 9: Font Preserved After Text Change

**Purpose:** Verify font settings remain unchanged.

**Prerequisites:**
- Text node with Inter Bold 24px

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "STYLED_TEXT_ID",
    text: "New Content"
  }
}
```

**Expected Result:**
- `fontName.family` equals "Inter"
- `fontName.style` equals "Bold"
- Font size remains 24px

---

### Test 10: Missing nodeId (Error Case)

**Purpose:** Verify error when nodeId missing.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    text: "Some text"
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 11: Missing text Parameter (Error Case)

**Purpose:** Verify error when text missing.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing text parameter"

---

### Test 12: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "999:999",
    text: "Test"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 13: Non-Text Node (Error Case)

**Purpose:** Verify error when node is not text.

**Prerequisites:**
- Create a rectangle and note its ID

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "RECTANGLE_ID",
    text: "Test"
  }
}
```

**Expected Result:**
- Error: "Node is not a text node: RECTANGLE_ID"

---

### Test 14: Set Text on Frame (Error Case)

**Purpose:** Verify error when targeting frame.

**Command:**
```javascript
{
  command: "set_text_content",
  params: {
    nodeId: "FRAME_ID",
    text: "Test"
  }
}
```

**Expected Result:**
- Error: "Node is not a text node: FRAME_ID"

---

## Sample Test Script

```javascript
/**
 * Test: set_text_content command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let textNodeId = null;
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Create text node
  setTimeout(() => {
    console.log('Creating text node...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_text",
        params: {
          text: "Original Text",
          x: 100, y: 100
        },
        commandId: "create_text"
      }
    }));
  }, 2000);
});

const textTests = [
  { name: "Basic text", text: "Hello World" },
  { name: "Empty string", text: "" },
  { name: "Long text", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Line breaks", text: "Line 1\nLine 2\nLine 3" },
  { name: "Special chars", text: "Price: $99.99 (50% off!)" },
  { name: "Unicode", text: "Hello 世界" }
];

function runTextTest() {
  if (currentTest >= textTests.length) {
    console.log('\n=== All text content tests complete ===');

    // Test error case
    console.log('\nTesting error case (non-existent node)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_text_content",
        params: { nodeId: "999:999", text: "Test" },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = textTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_text_content",
      params: {
        nodeId: textNodeId,
        text: test.text
      },
      commandId: `text_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'system') {
    if (parsed.message && parsed.message.includes('Joined')) {
      console.log('Channel joined successfully');
    }
    return;
  }

  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      if (phase === 'create') {
        textNodeId = result.id;
        console.log('Created text node:', textNodeId);
        phase = 'test';
        setTimeout(() => runTextTest(), 500);
      } else if (phase === 'test') {
        console.log('Set text result:');
        console.log('  Characters:', result.characters);
        console.log('  Font:', result.fontName?.family, result.fontName?.style);

        const test = textTests[currentTest];
        if (result.characters === test.text) {
          console.log('  ✓ Text matches expected');
        } else {
          console.log('  ✗ Text mismatch');
        }

        currentTest++;
        setTimeout(() => runTextTest(), 500);
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
}, 60000);
```

---

## Validation Checklist

- [ ] Basic text content set correctly
- [ ] Empty string works
- [ ] Long text handled
- [ ] Line breaks preserved (\n)
- [ ] Special characters preserved
- [ ] Unicode characters work
- [ ] Existing text fully replaced
- [ ] Multiple updates work sequentially
- [ ] Font preserved after text change
- [ ] Response contains id, name, characters, fontName
- [ ] Error for missing nodeId
- [ ] Error for missing text parameter
- [ ] Error for non-existent node
- [ ] Error for non-text node (rectangle)
- [ ] Error for frame node
