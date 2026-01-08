# Test Case: get_complete_file_data

## Command
`get_complete_file_data`

## Description
Extracts the entire Figma file including all pages, nodes, styles, components, and variables. Provides a comprehensive snapshot of the document.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| - | - | - | - | No parameters required |

## Expected Response

```json
{
  "document": {
    "id": "root_id",
    "name": "Document Name",
    "type": "DOCUMENT",
    "children": [
      {
        "id": "page_id",
        "name": "Page 1",
        "type": "PAGE",
        "depth": 0,
        "children": [...]
      }
    ]
  },
  "styles": {
    "paint": [...],
    "text": [...],
    "effect": [...],
    "grid": [...]
  },
  "components": [...],
  "variables": {
    "variables": [...],
    "collections": [...]
  },
  "metadata": {
    "extractedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

---

## Test Scenarios

### Test 1: Extract Complete File

**Purpose:** Verify full document extraction.

**Command:**
```javascript
{
  command: "get_complete_file_data",
  params: {}
}
```

**Expected Result:**
- `document` object with all pages
- `styles` object with paint, text, effect, grid styles
- `components` array with local components
- `variables` with variables and collections
- `metadata` with extraction timestamp

---

### Test 2: Verify Page Structure

**Purpose:** Confirm all pages extracted.

**Command:**
```javascript
{
  command: "get_complete_file_data",
  params: {}
}
```

**Expected Result:**
- All pages in document.children
- Each page has id, name, type, children
- Page hierarchy preserved

---

### Test 3: Verify Node Properties

**Purpose:** Confirm node details extracted.

**Expected Result:**
- Nodes include: id, name, type, depth
- Optional properties: absoluteBoundingBox, layoutMode, fills, strokes
- Text nodes include: characters, fontSize, fontName

---

### Test 4: Verify Styles Extraction

**Purpose:** Confirm local styles captured.

**Expected Result:**
- Paint styles with id, name, paints
- Text styles with id, name, fontSize, fontName
- Effect styles with id, name, effects
- Grid styles with id, name, layoutGrids

---

### Test 5: Verify Components Extraction

**Purpose:** Confirm components captured.

**Expected Result:**
- Components array with id, name, description
- All local components included

---

### Test 6: Verify Variables Extraction

**Purpose:** Confirm variables and collections captured.

**Expected Result:**
- variables array with id, name, resolvedType
- collections array with id, name, modes

---

### Test 7: Empty Document

**Purpose:** Verify handling of minimal document.

**Prerequisites:**
- New empty Figma file

**Expected Result:**
- Returns valid structure
- Empty arrays where appropriate

---

### Test 8: Large Document Performance

**Purpose:** Verify handling of large files.

**Prerequisites:**
- Document with many pages and nodes

**Expected Result:**
- Completes without timeout
- Progress updates sent
- All data extracted

---

## Sample Test Script

```javascript
/**
 * Test: get_complete_file_data command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Extracting complete file data...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_complete_file_data",
        params: {},
        commandId: "extract_all"
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
      console.log('\n=== Complete File Data ===');
      console.log('Document:', result.document?.name);
      console.log('Pages:', result.document?.children?.length || 0);
      console.log('Paint Styles:', result.styles?.paint?.length || 0);
      console.log('Text Styles:', result.styles?.text?.length || 0);
      console.log('Components:', result.components?.length || 0);
      console.log('Variables:', result.variables?.variables?.length || 0);
      console.log('Extracted At:', result.metadata?.extractedAt);

      ws.close();
    }
  }
});

ws.on('close', () => console.log('Connection closed'));
ws.on('error', (err) => console.error('WebSocket error:', err));

setTimeout(() => ws.close(), 120000);
```

---

## Validation Checklist

- [ ] Document structure extracted correctly
- [ ] All pages included
- [ ] Node hierarchy preserved
- [ ] Node properties captured (id, name, type, depth)
- [ ] absoluteBoundingBox included for scene nodes
- [ ] Fills processed with hex colors
- [ ] Strokes processed with hex colors
- [ ] Text node properties captured
- [ ] Paint styles extracted
- [ ] Text styles extracted
- [ ] Effect styles extracted
- [ ] Grid styles extracted
- [ ] Components extracted
- [ ] Variables extracted
- [ ] Collections extracted
- [ ] Metadata timestamp present
- [ ] Large documents handled without timeout
