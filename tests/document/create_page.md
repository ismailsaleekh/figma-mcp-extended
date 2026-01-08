# Test Case: create_page

## Command
`create_page`

## Description
Creates a new page in the Figma document with optional name and ability to switch to it.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | No | "New Page" | Name for the new page |
| `setAsCurrent` | boolean | No | false | Whether to switch to the new page after creation |

## Expected Response

```json
{
  "id": "1:2",
  "name": "New Page",
  "type": "PAGE",
  "childCount": 0,
  "isCurrentPage": false
}
```

---

## Test Scenarios

### Test 1: Create Page with Default Parameters

**Purpose:** Verify page creation works with no parameters.

**Command:**
```javascript
{
  command: "create_page",
  params: {}
}
```

**Expected Result:**
- Page created with name "New Page"
- `childCount` is 0
- `isCurrentPage` is false
- `type` is "PAGE"

**Verification Steps:**
1. Check response contains valid `id`
2. Verify `name` equals "New Page"
3. Verify `isCurrentPage` is false
4. Confirm new page appears in Figma pages panel

---

### Test 2: Create Page with Custom Name

**Purpose:** Verify custom naming works.

**Command:**
```javascript
{
  command: "create_page",
  params: {
    name: "My Custom Page"
  }
}
```

**Expected Result:**
- Page has name "My Custom Page"

**Verification Steps:**
1. Check response `name` equals "My Custom Page"
2. Verify in Figma pages panel

---

### Test 3: Create Page and Set as Current

**Purpose:** Verify page can be created and immediately switched to.

**Command:**
```javascript
{
  command: "create_page",
  params: {
    name: "Active Page",
    setAsCurrent: true
  }
}
```

**Expected Result:**
- Page created with name "Active Page"
- `isCurrentPage` is true
- Figma UI shows the new page as active

**Verification Steps:**
1. Check `isCurrentPage` is true
2. Verify Figma canvas shows the new (empty) page

---

### Test 4: Create Multiple Pages Sequentially

**Purpose:** Verify multiple pages can be created.

**Commands (execute in order):**
```javascript
{ command: "create_page", params: { name: "Page A" } }
{ command: "create_page", params: { name: "Page B" } }
{ command: "create_page", params: { name: "Page C" } }
```

**Expected Result:**
- Three pages created
- Each has unique ID
- All appear in pages panel

---

### Test 5: Create Page with Empty Name

**Purpose:** Verify empty name handling.

**Command:**
```javascript
{
  command: "create_page",
  params: {
    name: ""
  }
}
```

**Expected Result:**
- Page created with empty name (or default behavior)

---

## Sample Test Script

```javascript
/**
 * Test: create_page command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

const tests = [
  {
    name: "Default parameters",
    params: {}
  },
  {
    name: "Custom name",
    params: { name: "Test Page" }
  },
  {
    name: "Set as current",
    params: { name: "Current Page", setAsCurrent: true }
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
    console.log('All tests complete');
    ws.close();
    return;
  }

  const test = tests[currentTest];
  console.log(`\nRunning test: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_page",
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
      console.log('Result:', JSON.stringify(result, null, 2));
      console.log('  ID:', result.id);
      console.log('  Name:', result.name);
      console.log('  Type:', result.type);
      console.log('  Is Current:', result.isCurrentPage);

      if (result.id && result.type === 'PAGE') {
        console.log('  ✓ Page created successfully');
      }

      currentTest++;
      setTimeout(() => runNextTest(), 1000);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Page created with default parameters
- [ ] Custom name applied correctly
- [ ] `setAsCurrent: true` switches to new page
- [ ] `setAsCurrent: false` keeps current page active
- [ ] Multiple pages can be created
- [ ] Response contains `id`, `name`, `type`, `childCount`, `isCurrentPage`
- [ ] `type` equals "PAGE"
- [ ] `childCount` is 0 for new page
- [ ] Page visible in Figma pages panel
