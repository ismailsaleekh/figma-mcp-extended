# Test Case: get_component_hierarchy

## Command
`get_component_hierarchy`

## Description
Analyzes the component structure in the document, including components, component sets, and instances. Provides a hierarchical view of the component system.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| - | - | - | - | No parameters required |

## Expected Response

```json
{
  "message": "Component hierarchy analysis completed",
  "timestamp": 1705329600000,
  "components": [
    {
      "id": "123:456",
      "name": "Button",
      "description": "Primary button component",
      "type": "COMPONENT"
    }
  ],
  "componentSets": [
    {
      "id": "789:012",
      "name": "Button",
      "description": "Button variants",
      "childrenCount": 4
    }
  ],
  "instances": [
    {
      "id": "345:678",
      "name": "Button Instance",
      "mainComponentId": "123:456",
      "mainComponentName": "Button"
    }
  ],
  "relationships": {}
}
```

---

## Test Scenarios

### Test 1: Get Component Hierarchy

**Purpose:** Verify component analysis.

**Prerequisites:**
- Document with components defined

**Command:**
```javascript
{
  command: "get_component_hierarchy",
  params: {}
}
```

**Expected Result:**
- `components` array populated
- Each component has id, name, description, type

---

### Test 2: Component Sets Extraction

**Purpose:** Verify variant component sets.

**Prerequisites:**
- Document with component sets (variants)

**Expected Result:**
- `componentSets` array populated
- Each set has childrenCount

---

### Test 3: Instances in Selection

**Purpose:** Verify instance detection from selection.

**Prerequisites:**
- Select instances in Figma before running

**Expected Result:**
- `instances` array populated
- Each instance has mainComponentId and mainComponentName

---

### Test 4: Empty Document

**Purpose:** Verify handling of no components.

**Prerequisites:**
- Document with no components

**Expected Result:**
- Empty `components` array
- Empty `componentSets` array
- Empty `instances` array
- No error

---

### Test 5: Many Components

**Purpose:** Verify handling of large component libraries.

**Prerequisites:**
- Document with many components

**Expected Result:**
- All components listed
- Performance acceptable

---

### Test 6: Nested Instances

**Purpose:** Verify instances within instances.

**Prerequisites:**
- Component with nested component instances

**Expected Result:**
- Nested instances captured (limited depth)

---

### Test 7: Library Components

**Purpose:** Verify handling of library components.

**Note:** Local components only; library components may not appear in getLocalComponentsAsync.

---

## Sample Test Script

```javascript
/**
 * Test: get_component_hierarchy command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Getting component hierarchy...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_component_hierarchy",
        params: {},
        commandId: "hierarchy"
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
      console.log('\n=== Component Hierarchy ===');
      console.log('Message:', result.message);
      console.log('Components:', result.components?.length || 0);
      console.log('Component Sets:', result.componentSets?.length || 0);
      console.log('Instances:', result.instances?.length || 0);

      if (result.components?.length > 0) {
        console.log('\nComponent Samples:');
        result.components.slice(0, 5).forEach(c => {
          console.log(`  - ${c.name} (${c.id})`);
        });
      }

      if (result.componentSets?.length > 0) {
        console.log('\nComponent Set Samples:');
        result.componentSets.slice(0, 5).forEach(cs => {
          console.log(`  - ${cs.name}: ${cs.childrenCount} variants`);
        });
      }

      ws.close();
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
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

- [ ] Components array extracted
- [ ] Component properties: id, name, description, type
- [ ] Component sets extracted
- [ ] Component set childrenCount accurate
- [ ] Instances from selection captured
- [ ] Instance mainComponentId present
- [ ] Instance mainComponentName present
- [ ] Empty document handled
- [ ] Large component libraries handled
- [ ] Nested instances handled (depth limited)
- [ ] Message and timestamp present
