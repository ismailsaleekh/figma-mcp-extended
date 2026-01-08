# Test Case: get_styles

## Command
`get_styles`

## Description
Retrieves all local styles defined in the document, organized by type: color styles, text styles, effect styles, and grid styles.

## Parameters

This command takes no parameters.

## Expected Response

```json
{
  "colors": [
    {
      "id": "S:abc123...",
      "name": "Primary/Blue",
      "key": "abc123...",
      "paint": {
        "type": "SOLID",
        "color": { "r": 0.2, "g": 0.4, "b": 0.8 },
        "opacity": 1
      }
    }
  ],
  "texts": [
    {
      "id": "S:def456...",
      "name": "Heading/H1",
      "key": "def456...",
      "fontSize": 32,
      "fontName": { "family": "Inter", "style": "Bold" }
    }
  ],
  "effects": [
    {
      "id": "S:ghi789...",
      "name": "Shadow/Medium",
      "key": "ghi789..."
    }
  ],
  "grids": [
    {
      "id": "S:jkl012...",
      "name": "Layout/12-Column",
      "key": "jkl012..."
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Get All Styles from Document with Styles

**Purpose:** Verify retrieval of all style types.

**Prerequisites:**
1. Document has at least one color style defined
2. Document has at least one text style defined
3. Document has at least one effect style defined
4. Document has at least one grid style defined

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- Response contains `colors`, `texts`, `effects`, `grids` arrays
- Each style has `id`, `name`, `key`
- Color styles include `paint` property
- Text styles include `fontSize` and `fontName`

**Verification Steps:**
1. Check `colors` array is not empty
2. Check `texts` array is not empty
3. Check `effects` array is not empty
4. Check `grids` array is not empty
5. Verify each color style has valid paint object

---

### Test 2: Get Styles from Empty Document

**Purpose:** Verify behavior when no styles are defined.

**Prerequisites:**
- New document with no local styles

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- Response contains empty arrays for all types
- `colors: []`
- `texts: []`
- `effects: []`
- `grids: []`

---

### Test 3: Get Only Color Styles

**Purpose:** Verify color styles are retrieved correctly.

**Prerequisites:**
- Document with multiple color styles (e.g., Primary/Blue, Primary/Red, Secondary/Gray)

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- `colors` array contains all defined color styles
- Each color style has:
  - `id`: Style ID starting with "S:"
  - `name`: Human-readable name (e.g., "Primary/Blue")
  - `key`: Unique key for the style
  - `paint`: First paint object with type, color, opacity

---

### Test 4: Verify Color Style Paint Structure

**Purpose:** Verify paint object structure for solid colors.

**Prerequisites:**
- Color style with solid fill

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- `paint.type` equals "SOLID"
- `paint.color` has `r`, `g`, `b` values (0-1 range)
- `paint.opacity` is number (0-1 range)

---

### Test 5: Verify Gradient Color Style

**Purpose:** Verify gradient paint structure.

**Prerequisites:**
- Color style with gradient fill

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- `paint.type` equals "GRADIENT_LINEAR", "GRADIENT_RADIAL", or "GRADIENT_ANGULAR"
- `paint.gradientStops` array present

---

### Test 6: Get Only Text Styles

**Purpose:** Verify text styles are retrieved correctly.

**Prerequisites:**
- Document with text styles (e.g., Heading/H1, Body/Regular)

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- `texts` array contains all defined text styles
- Each text style has:
  - `id`: Style ID
  - `name`: Human-readable name
  - `key`: Unique key
  - `fontSize`: Number (e.g., 32, 16, 14)
  - `fontName`: Object with `family` and `style`

---

### Test 7: Verify Text Style Font Properties

**Purpose:** Verify font details in text styles.

**Prerequisites:**
- Text styles with different fonts

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- `fontName.family` is string (e.g., "Inter", "Roboto")
- `fontName.style` is string (e.g., "Regular", "Bold", "Medium")
- `fontSize` is positive number

---

### Test 8: Get Effect Styles

**Purpose:** Verify effect styles are retrieved.

**Prerequisites:**
- Document with effect styles (shadows, blurs)

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- `effects` array contains effect styles
- Each has `id`, `name`, `key`

---

### Test 9: Get Grid Styles

**Purpose:** Verify grid styles are retrieved.

**Prerequisites:**
- Document with grid styles (column grids, row grids)

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- `grids` array contains grid styles
- Each has `id`, `name`, `key`

---

### Test 10: Style Names with Hierarchy

**Purpose:** Verify hierarchical style names.

**Prerequisites:**
- Styles with "/" in names (e.g., "Colors/Primary/Blue")

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- Style names preserve full hierarchy
- Name includes all segments (e.g., "Colors/Primary/Blue")

---

### Test 11: Multiple Styles of Same Type

**Purpose:** Verify multiple styles per type.

**Prerequisites:**
- 5+ color styles
- 3+ text styles

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- All styles returned in arrays
- Count matches defined styles in document

---

### Test 12: Style Keys Are Unique

**Purpose:** Verify each style has unique key.

**Command:**
```javascript
{
  command: "get_styles",
  params: {}
}
```

**Expected Result:**
- No duplicate keys across all styles
- Each key can be used for style application

---

## Sample Test Script

```javascript
/**
 * Test: get_styles command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then get styles
  setTimeout(() => {
    console.log('Getting all styles...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_styles",
        params: {},
        commandId: "get_styles_test"
      }
    }));
  }, 2000);
});

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
      console.log('\n=== Styles Retrieved ===');

      console.log('\nColor Styles:', result.colors.length);
      result.colors.forEach((style, i) => {
        console.log(`  ${i + 1}. ${style.name}`);
        if (style.paint) {
          console.log(`     Type: ${style.paint.type}`);
        }
      });

      console.log('\nText Styles:', result.texts.length);
      result.texts.forEach((style, i) => {
        console.log(`  ${i + 1}. ${style.name} (${style.fontSize}px, ${style.fontName?.family})`);
      });

      console.log('\nEffect Styles:', result.effects.length);
      result.effects.forEach((style, i) => {
        console.log(`  ${i + 1}. ${style.name}`);
      });

      console.log('\nGrid Styles:', result.grids.length);
      result.grids.forEach((style, i) => {
        console.log(`  ${i + 1}. ${style.name}`);
      });

      console.log('\n=== Test Complete ===');
      ws.close();
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
      ws.close();
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
}, 30000);
```

---

## Validation Checklist

- [ ] Command executes without parameters
- [ ] Response contains `colors` array
- [ ] Response contains `texts` array
- [ ] Response contains `effects` array
- [ ] Response contains `grids` array
- [ ] Color styles have id, name, key, paint
- [ ] Text styles have id, name, key, fontSize, fontName
- [ ] Effect styles have id, name, key
- [ ] Grid styles have id, name, key
- [ ] Empty document returns empty arrays
- [ ] Multiple styles per type returned correctly
- [ ] Hierarchical names preserved
- [ ] Style keys are unique
