# Test Case: create_component

## Command
`create_component`

## Description
Converts an existing node into a component. The node becomes a reusable component that can be instanced.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to convert to component |
| `name` | string | No | - | Optional name for the component |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Button Component",
  "key": "abc123def456",
  "type": "COMPONENT"
}
```

---

## Test Scenarios

### Test 1: Convert Rectangle to Component

**Purpose:** Verify basic component creation.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Rectangle becomes a component
- `type` equals "COMPONENT"
- `key` is generated

---

### Test 2: Convert Frame to Component

**Purpose:** Verify frame can become component.

**Prerequisites:**
- Create a frame with children

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Frame and children become component
- Children preserved inside component

---

### Test 3: Convert with Custom Name

**Purpose:** Verify custom naming.

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "NODE_ID",
    name: "My Button"
  }
}
```

**Expected Result:**
- Component has name "My Button"

---

### Test 4: Convert Group to Component

**Purpose:** Verify group can become component.

**Prerequisites:**
- Create a group of elements

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "GROUP_ID"
  }
}
```

**Expected Result:**
- Group becomes component

---

### Test 5: Convert Text to Component

**Purpose:** Verify text node can become component.

**Prerequisites:**
- Create a text node

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "TEXT_ID"
  }
}
```

**Expected Result:**
- Text becomes component

---

### Test 6: Convert Already-Component Node (Error Case)

**Purpose:** Verify error when node is already a component.

**Prerequisites:**
- Create a component first

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "COMPONENT_ID"
  }
}
```

**Expected Result:**
- Error: "Node is already a component"

---

### Test 7: Convert Page Node (Error Case)

**Purpose:** Verify error for unsupported node type.

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "PAGE_ID"
  }
}
```

**Expected Result:**
- Error: "Cannot convert this node type to a component"

---

### Test 8: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "create_component",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 9: Missing nodeId (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "create_component",
  params: {}
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

## Sample Test Script

```javascript
/**
 * Test: create_component command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Creating test rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { width: 100, height: 50, name: "Button Shape" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created node:', createdNodeId);
      phase = 'convert';

      // Convert to component
      console.log('\nConverting to component...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_component",
          params: { nodeId: createdNodeId, name: "Button Component" },
          commandId: "convert_to_component"
        }
      }));
    } else if (result && phase === 'convert') {
      console.log('\n=== Component Created ===');
      console.log('ID:', result.id);
      console.log('Name:', result.name);
      console.log('Key:', result.key);
      console.log('Type:', result.type);

      if (result.type === 'COMPONENT' && result.key) {
        console.log('✓ Component created successfully');
      } else {
        console.log('✗ Component creation failed');
      }

      // Test error case - try to convert again
      phase = 'error_test';
      console.log('\nTesting error case (already a component)...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_component",
          params: { nodeId: result.id },
          commandId: "error_test"
        }
      }));
    } else if (phase === 'error_test') {
      if (error) {
        console.log('✓ Error correctly returned:', error);
      }
      ws.close();
    }

    if (error && phase !== 'error_test') {
      console.log('Error:', error);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Rectangle converts to component
- [ ] Frame converts to component (children preserved)
- [ ] Group converts to component
- [ ] Text converts to component
- [ ] Custom name applied correctly
- [ ] Component key generated
- [ ] `type` equals "COMPONENT"
- [ ] Error for already-component node
- [ ] Error for page node
- [ ] Error for non-existent node
- [ ] Error for missing nodeId
- [ ] Component visible in Figma assets panel
- [ ] Component can be instanced
