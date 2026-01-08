# Test Case: get_design_tokens

## Command
`get_design_tokens`

## Description
Extracts design tokens from the document including colors and typography styles in a format suitable for design system export.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| - | - | - | - | No parameters required |

## Expected Response

```json
{
  "colors": {
    "Primary/Blue": {
      "id": "S:123...",
      "name": "Primary/Blue",
      "paints": [
        {
          "type": "SOLID",
          "color": "#0066FF",
          "opacity": 1
        }
      ]
    }
  },
  "typography": {
    "Heading/H1": {
      "id": "S:456...",
      "fontFamily": "Inter",
      "fontWeight": "Bold",
      "fontSize": 32,
      "lineHeight": { "unit": "PERCENT", "value": 120 },
      "letterSpacing": { "unit": "PERCENT", "value": 0 }
    }
  },
  "effects": {},
  "variables": {}
}
```

---

## Test Scenarios

### Test 1: Extract Color Tokens

**Purpose:** Verify color style extraction.

**Prerequisites:**
- Document with paint styles defined

**Command:**
```javascript
{
  command: "get_design_tokens",
  params: {}
}
```

**Expected Result:**
- `colors` object with style names as keys
- Each color has id, name, paints array
- SOLID paints converted to hex color

---

### Test 2: Extract Typography Tokens

**Purpose:** Verify text style extraction.

**Prerequisites:**
- Document with text styles defined

**Command:**
```javascript
{
  command: "get_design_tokens",
  params: {}
}
```

**Expected Result:**
- `typography` object with style names as keys
- Each has fontFamily, fontWeight, fontSize
- lineHeight and letterSpacing included

---

### Test 3: Document with No Styles

**Purpose:** Verify handling of unstyled document.

**Prerequisites:**
- Document with no defined styles

**Expected Result:**
- Empty `colors` object `{}`
- Empty `typography` object `{}`
- No errors

---

### Test 4: Multiple Color Styles

**Purpose:** Verify multiple color extraction.

**Prerequisites:**
- Document with multiple paint styles

**Expected Result:**
- All paint styles included
- Names used as keys (no conflicts)

---

### Test 5: Complex Typography Styles

**Purpose:** Verify various typography properties.

**Prerequisites:**
- Text styles with different fonts, sizes, weights

**Expected Result:**
- All properties captured correctly
- Mixed fonts handled

---

### Test 6: Gradient Colors

**Purpose:** Verify gradient paint handling.

**Prerequisites:**
- Paint style with gradient fill

**Expected Result:**
- Gradient type included (not converted to hex)
- Paint object contains gradient data

---

### Test 7: Color with Opacity

**Purpose:** Verify opacity handling.

**Prerequisites:**
- Paint style with non-1.0 opacity

**Expected Result:**
- `opacity` property included
- Color hex accurate

---

## Sample Test Script

```javascript
/**
 * Test: get_design_tokens command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Extracting design tokens...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_design_tokens",
        params: {},
        commandId: "tokens"
      }
    }));
  }, 2000);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'system') return;
  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      console.log('\n=== Design Tokens ===');

      const colorCount = Object.keys(result.colors || {}).length;
      const typoCount = Object.keys(result.typography || {}).length;

      console.log('Color Tokens:', colorCount);
      console.log('Typography Tokens:', typoCount);

      if (colorCount > 0) {
        console.log('\nColor Samples:');
        Object.entries(result.colors).slice(0, 3).forEach(([name, value]) => {
          console.log(`  ${name}:`, value.paints?.[0]?.color || 'N/A');
        });
      }

      if (typoCount > 0) {
        console.log('\nTypography Samples:');
        Object.entries(result.typography).slice(0, 3).forEach(([name, value]) => {
          console.log(`  ${name}:`, `${value.fontFamily} ${value.fontSize}px`);
        });
      }

      ws.close();
    }
  }
});

ws.on('close', () => console.log('Connection closed'));
ws.on('error', (err) => console.error('WebSocket error:', err));

setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Color tokens extracted correctly
- [ ] Typography tokens extracted correctly
- [ ] SOLID colors converted to hex
- [ ] Gradient colors preserved as objects
- [ ] Opacity values included
- [ ] Font family extracted
- [ ] Font weight/style extracted
- [ ] Font size extracted
- [ ] Line height extracted
- [ ] Letter spacing extracted
- [ ] Empty document handled
- [ ] Style names used as keys
- [ ] No duplicate key issues
