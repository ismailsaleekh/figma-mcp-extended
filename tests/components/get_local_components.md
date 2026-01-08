# Test Case: get_local_components

## Command
`get_local_components`

## Description
Retrieves all local components defined in the document across all pages. Loads all pages first to ensure complete discovery.

## Parameters

This command takes no parameters.

## Expected Response

```json
{
  "count": 5,
  "components": [
    {
      "id": "123:456",
      "name": "Button/Primary",
      "key": "abc123def456..."
    },
    {
      "id": "123:789",
      "name": "Input/Text",
      "key": "ghi789jkl012..."
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Get Components from Document with Components

**Purpose:** Verify retrieval of all local components.

**Prerequisites:**
1. Document has multiple component definitions
2. Components exist on different pages

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Response contains `count` with total number
- Response contains `components` array
- Each component has `id`, `name`, `key`

**Verification Steps:**
1. Check `count` matches `components.length`
2. Verify each component has valid ID
3. Check component names match Figma UI

---

### Test 2: Get Components from Empty Document

**Purpose:** Verify behavior when no components exist.

**Prerequisites:**
- Document with no component definitions

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- `count` equals 0
- `components` is empty array `[]`

---

### Test 3: Components on Single Page

**Purpose:** Verify components from current page.

**Prerequisites:**
- Single page with 3+ components

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- All components from the page returned
- `count` matches actual component count

---

### Test 4: Components Across Multiple Pages

**Purpose:** Verify components from all pages are discovered.

**Prerequisites:**
- Page 1: 2 components
- Page 2: 3 components
- Page 3: 1 component

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- `count` equals 6 (total across all pages)
- Components from all pages included
- All pages are loaded to find components

---

### Test 5: Verify Component ID Format

**Purpose:** Verify component IDs use colon format.

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Component `id` uses colon format (e.g., "123:456")
- ID can be used with other commands like `get_node_info`

---

### Test 6: Verify Component Key

**Purpose:** Verify component keys for instance creation.

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Each component has `key` property
- Key can be used with `create_component_instance`
- Keys are unique across components

---

### Test 7: Component Names with Hierarchy

**Purpose:** Verify hierarchical component names.

**Prerequisites:**
- Components with "/" in names (e.g., "Button/Primary/Large")

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Full component names preserved
- Hierarchy maintained (e.g., "Button/Primary/Large")

---

### Test 8: Component Variants

**Purpose:** Verify component variants are included.

**Prerequisites:**
- Component set with variants

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Each variant listed as separate component
- Names include variant properties

---

### Test 9: Nested Components

**Purpose:** Verify nested components are discovered.

**Prerequisites:**
- Component containing other components

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Both parent and nested components returned
- Each has unique ID and key

---

### Test 10: Large Number of Components

**Purpose:** Verify handling of many components.

**Prerequisites:**
- Document with 50+ components

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- All components returned
- `count` reflects actual total
- Response completes without timeout

---

### Test 11: Hidden Components

**Purpose:** Verify hidden components are included.

**Prerequisites:**
- Component with visibility set to false

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Hidden components included in results
- Count includes hidden components

---

### Test 12: Component Without Key (Edge Case)

**Purpose:** Verify handling of components without keys.

**Command:**
```javascript
{
  command: "get_local_components",
  params: {}
}
```

**Expected Result:**
- Component included with `key: null` if no key available
- ID and name still present

---

## Sample Test Script

```javascript
/**
 * Test: get_local_components command
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

  // Wait for join, then get components
  setTimeout(() => {
    console.log('Getting local components...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_local_components",
        params: {},
        commandId: "get_components_test"
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
      console.log('\n=== Local Components ===');
      console.log('Total count:', result.count);
      console.log('\nComponents:');

      result.components.forEach((comp, i) => {
        console.log(`  ${i + 1}. ${comp.name}`);
        console.log(`     ID: ${comp.id}`);
        console.log(`     Key: ${comp.key ? comp.key.substring(0, 20) + '...' : 'null'}`);
      });

      // Validation
      console.log('\n=== Validation ===');
      console.log(`Count matches array length: ${result.count === result.components.length ? '✓' : '✗'}`);

      const uniqueIds = new Set(result.components.map(c => c.id));
      console.log(`All IDs unique: ${uniqueIds.size === result.components.length ? '✓' : '✗'}`);

      const uniqueKeys = new Set(result.components.filter(c => c.key).map(c => c.key));
      console.log(`All keys unique: ${uniqueKeys.size === result.components.filter(c => c.key).length ? '✓' : '✗'}`);

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

// Timeout safety (longer for loading all pages)
setTimeout(() => {
  ws.close();
}, 60000);
```

---

## Validation Checklist

- [ ] Command executes without parameters
- [ ] Response contains `count` number
- [ ] Response contains `components` array
- [ ] Count matches components array length
- [ ] Each component has `id` (colon format)
- [ ] Each component has `name`
- [ ] Each component has `key` (or null)
- [ ] Empty document returns count: 0
- [ ] Components from all pages discovered
- [ ] Hierarchical names preserved
- [ ] Component variants included
- [ ] Nested components included
- [ ] Keys can be used with create_component_instance
