# Test Case: set_letter_spacing

## Command
`set_letter_spacing`

## Description
Sets the letter spacing (tracking) on a text node. Supports pixel and percentage values.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of text node to modify |
| `letterSpacing` | number | **Yes** | - | Letter spacing value |
| `unit` | string | No | "PIXELS" | "PIXELS" or "PERCENT" |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Text",
  "letterSpacing": {
    "unit": "PIXELS",
    "value": 2
  }
}
```

---

## Test Scenarios

### Test 1: Set Letter Spacing in Pixels

**Purpose:** Verify positive pixel spacing.

**Prerequisites:**
- Create a text node, note its ID

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: 2
  }
}
```

**Expected Result:**
- Letters have 2px extra spacing
- `letterSpacing.unit` equals "PIXELS"

---

### Test 2: Set Letter Spacing in Percent

**Purpose:** Verify percentage spacing.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: 10,
    unit: "PERCENT"
  }
}
```

**Expected Result:**
- Letters have 10% extra spacing
- `letterSpacing.unit` equals "PERCENT"

---

### Test 3: Set Tight Letter Spacing (Negative)

**Purpose:** Verify negative spacing (tighter text).

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: -1
  }
}
```

**Expected Result:**
- Letters are closer together

---

### Test 4: Set Zero Letter Spacing

**Purpose:** Verify default spacing.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: 0
  }
}
```

**Expected Result:**
- Normal letter spacing

---

### Test 5: Set Large Letter Spacing

**Purpose:** Verify wide spacing.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: 10
  }
}
```

**Expected Result:**
- Letters are widely spaced

---

### Test 6: Set Very Large Spacing (20px)

**Purpose:** Verify extreme spacing.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: 20
  }
}
```

**Expected Result:**
- Very wide letter spacing

---

### Test 7: Set Negative Percent Spacing

**Purpose:** Verify negative percentage.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: -5,
    unit: "PERCENT"
  }
}
```

**Expected Result:**
- Tighter spacing relative to font size

---

### Test 8: Set Decimal Letter Spacing

**Purpose:** Verify decimal pixel value.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID",
    letterSpacing: 1.5
  }
}
```

**Expected Result:**
- Letter spacing is 1.5 pixels

---

### Test 9: Missing letterSpacing (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing letterSpacing parameter"

---

### Test 10: Non-Text Node (Error Case)

**Purpose:** Verify error when applied to non-text node.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "RECTANGLE_ID",
    letterSpacing: 2
  }
}
```

**Expected Result:**
- Error: "Node is not a TEXT node"

---

### Test 11: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_letter_spacing",
  params: {
    nodeId: "999:999",
    letterSpacing: 2
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_letter_spacing command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const spacingTests = [
  { name: "0 (normal)", params: { letterSpacing: 0 } },
  { name: "2px", params: { letterSpacing: 2 } },
  { name: "5px (wide)", params: { letterSpacing: 5 } },
  { name: "-1px (tight)", params: { letterSpacing: -1 } },
  { name: "10%", params: { letterSpacing: 10, unit: "PERCENT" } },
  { name: "-5%", params: { letterSpacing: -5, unit: "PERCENT" } }
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
        params: { text: "LETTER SPACING TEST", x: 0, y: 0, fontSize: 24 },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runSpacingTest() {
  if (currentTest >= spacingTests.length) {
    console.log('\n=== All letter spacing tests complete ===');
    ws.close();
    return;
  }

  const test = spacingTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_letter_spacing",
      params: { nodeId: createdNodeId, ...test.params },
      commandId: `spacing_${currentTest}`
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
      phase = 'spacing';
      setTimeout(() => runSpacingTest(), 500);
    } else if (result && phase === 'spacing') {
      console.log('  Letter spacing:', JSON.stringify(result.letterSpacing));
      console.log('  ✓ Letter spacing set successfully');

      currentTest++;
      setTimeout(() => runSpacingTest(), 500);
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

- [ ] Positive pixel spacing works
- [ ] Negative pixel spacing (tighter) works
- [ ] Zero spacing (normal) works
- [ ] Percentage spacing works
- [ ] Negative percentage works
- [ ] Large spacing values work
- [ ] Decimal values work
- [ ] Error for missing letterSpacing
- [ ] Error for non-text node
- [ ] Error for non-existent node
- [ ] Response contains `letterSpacing` object
- [ ] Letter spacing visible and correct in Figma
