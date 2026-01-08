# Test Case: detach_instance

## Command
`detach_instance`

## Description
Detaches a component instance from its main component, converting it into a regular frame with all its content.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of instance to detach |

## Expected Response

```json
{
  "id": "123:457",
  "name": "Button Instance",
  "type": "FRAME"
}
```

---

## Test Scenarios

### Test 1: Detach Simple Instance

**Purpose:** Verify basic instance detachment.

**Prerequisites:**
1. Create a component (or use existing)
2. Create an instance of that component
3. Note the instance ID

**Command:**
```javascript
{
  command: "detach_instance",
  params: {
    nodeId: "INSTANCE_ID"
  }
}
```

**Expected Result:**
- Instance becomes a frame
- `type` equals "FRAME"
- No longer linked to component

---

### Test 2: Detach Instance with Overrides

**Purpose:** Verify overrides are preserved after detach.

**Prerequisites:**
- Create instance with modified properties

**Command:**
```javascript
{
  command: "detach_instance",
  params: {
    nodeId: "INSTANCE_WITH_OVERRIDES_ID"
  }
}
```

**Expected Result:**
- Instance detaches with overrides preserved
- Modified properties remain

---

### Test 3: Detach Nested Instance

**Purpose:** Verify nested instance can be detached.

**Prerequisites:**
- Create component containing another instance

**Command:**
```javascript
{
  command: "detach_instance",
  params: {
    nodeId: "NESTED_INSTANCE_ID"
  }
}
```

**Expected Result:**
- Nested instance detaches
- Parent structure unaffected

---

### Test 4: Detach Non-Instance Node (Error Case)

**Purpose:** Verify error when node is not an instance.

**Prerequisites:**
- Create a regular rectangle

**Command:**
```javascript
{
  command: "detach_instance",
  params: {
    nodeId: "RECTANGLE_ID"
  }
}
```

**Expected Result:**
- Error: "Node is not an instance"

---

### Test 5: Detach Component Node (Error Case)

**Purpose:** Verify error when node is a component (not instance).

**Prerequisites:**
- Create a component

**Command:**
```javascript
{
  command: "detach_instance",
  params: {
    nodeId: "COMPONENT_ID"
  }
}
```

**Expected Result:**
- Error: "Node is not an instance"

---

### Test 6: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "detach_instance",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 7: Missing nodeId (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "detach_instance",
  params: {}
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

## Sample Test Script

```javascript
/**
 * Test: detach_instance command
 * Prerequisites: Need a component to create instances from
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let componentKey = null;
let instanceId = null;
let phase = 'create_rect';

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    // First create a rectangle
    console.log('Creating rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { width: 100, height: 50, name: "Test Button" },
        commandId: "create_rect"
      }
    }));
  }, 2000);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (result && phase === 'create_rect') {
      console.log('Rectangle created:', result.id);
      phase = 'create_component';

      // Convert to component
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_component",
          params: { nodeId: result.id, name: "Test Component" },
          commandId: "create_component"
        }
      }));
    } else if (result && phase === 'create_component') {
      console.log('Component created with key:', result.key);
      componentKey = result.key;
      phase = 'create_instance';

      // Create instance
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_component_instance",
          params: { componentKey: componentKey, x: 200, y: 0 },
          commandId: "create_instance"
        }
      }));
    } else if (result && phase === 'create_instance') {
      console.log('Instance created:', result.id);
      instanceId = result.id;
      phase = 'detach';

      // Detach the instance
      console.log('\nDetaching instance...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "detach_instance",
          params: { nodeId: instanceId },
          commandId: "detach"
        }
      }));
    } else if (result && phase === 'detach') {
      console.log('\n=== Instance Detached ===');
      console.log('ID:', result.id);
      console.log('Name:', result.name);
      console.log('Type:', result.type);

      if (result.type === 'FRAME') {
        console.log('✓ Instance detached successfully');
      } else {
        console.log('✗ Detach failed');
      }

      // Test error case
      phase = 'error_test';
      console.log('\nTesting error case (detach same node again)...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "detach_instance",
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
      ws.close();
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Simple instance detaches to frame
- [ ] Instance with overrides preserves overrides
- [ ] Nested instance can be detached
- [ ] `type` becomes "FRAME" after detach
- [ ] Content preserved after detach
- [ ] Error for non-instance node (rectangle)
- [ ] Error for component node (not instance)
- [ ] Error for non-existent node
- [ ] Error for missing nodeId
- [ ] Detached frame no longer linked to component
- [ ] Changes to component don't affect detached frame
