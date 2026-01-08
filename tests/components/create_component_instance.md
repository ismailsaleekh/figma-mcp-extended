# Test Case: create_component_instance

## Command
`create_component_instance`

## Description
Creates an instance of a component. Supports two methods:
- **Local components**: Use `componentId` to reference a component in the same file
- **Library components**: Use `componentKey` to import a published library component

The instance is placed at the specified position on the current page.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `componentKey` | string | No* | - | Component key for published library components |
| `componentId` | string | No* | - | Component ID for local components in same file |
| `x` | number | No | 0 | X position for the instance |
| `y` | number | No | 0 | Y position for the instance |

*One of `componentKey` or `componentId` is required.

## Expected Response

```json
{
  "id": "789:012",
  "name": "Button/Primary",
  "x": 100,
  "y": 200,
  "width": 120,
  "height": 40,
  "componentId": "123:456",
  "componentKey": "abc123..."
}
```

---

## Test Scenarios

### Test 1: Create Instance Using componentId (Local Component)

**Purpose:** Verify instance creation from local component using ID.

**Prerequisites:**
1. Create a component using `create_component`
2. Note the returned component `id`

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "123:456"  // ID from create_component
  }
}
```

**Expected Result:**
- Instance created at position (0, 0)
- Response contains instance `id`
- Instance name matches component name
- `componentId` references source component

---

### Test 2: Create Instance Using componentKey (Library Component)

**Purpose:** Verify instance creation from published library component.

**Prerequisites:**
- Access to a team library with published components
- Valid component key

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentKey: "LIBRARY_COMPONENT_KEY"
  }
}
```

**Expected Result:**
- Component imported from library
- Instance created at position (0, 0)
- Instance linked to library component

---

### Test 3: Create Instance at Specific Position

**Purpose:** Verify custom positioning.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: 100,
    y: 200
  }
}
```

**Expected Result:**
- Instance placed at (100, 200)
- `x` and `y` in response match params

---

### Test 4: Create Instance at Negative Position

**Purpose:** Verify negative coordinates work.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: -50,
    y: -100
  }
}
```

**Expected Result:**
- Instance placed at (-50, -100)
- Instance visible on canvas at negative coordinates

---

### Test 5: Create Instance at Large Position

**Purpose:** Verify large coordinate values.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: 5000,
    y: 5000
  }
}
```

**Expected Result:**
- Instance placed at (5000, 5000)
- Instance accessible on canvas

---

### Test 6: Create Instance with Decimal Position

**Purpose:** Verify fractional positioning.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: 100.5,
    y: 200.75
  }
}
```

**Expected Result:**
- Instance placed at decimal coordinates
- Position precision preserved

---

### Test 7: Create Multiple Instances of Same Component

**Purpose:** Verify multiple instances can be created.

**Commands (execute sequentially):**
```javascript
// First instance
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: 0, y: 0
  }
}

// Second instance
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: 200, y: 0
  }
}

// Third instance
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: 400, y: 0
  }
}
```

**Expected Result:**
- Three separate instances created
- Each has unique `id`
- All reference same `componentId`

---

### Test 8: Instance Inherits Component Dimensions

**Purpose:** Verify instance size matches component.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID"
  }
}
```

**Expected Result:**
- `width` matches component width
- `height` matches component height
- Instance is not resized

---

### Test 9: Instance Name Matches Component

**Purpose:** Verify instance naming.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "BUTTON_COMPONENT_ID"
  }
}
```

**Expected Result:**
- Instance `name` matches component name
- Hierarchical name preserved (e.g., "Button/Primary")

---

### Test 10: Missing Both componentKey and componentId (Error Case)

**Purpose:** Verify error when neither key nor ID is provided.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {}
}
```

**Expected Result:**
- Error: "Missing componentKey or componentId parameter"

---

### Test 11: Invalid componentId (Error Case)

**Purpose:** Verify error for non-existent component ID.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "invalid:id"
  }
}
```

**Expected Result:**
- Error: "Component not found with ID: invalid:id"

---

### Test 12: componentId Points to Non-Component Node (Error Case)

**Purpose:** Verify error when ID references a non-component node.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "RECTANGLE_NODE_ID"  // ID of a rectangle, not a component
  }
}
```

**Expected Result:**
- Error: "Node is not a component: RECTANGLE_NODE_ID"

---

### Test 13: Invalid componentKey (Error Case)

**Purpose:** Verify error for non-existent or unpublished component key.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentKey: "invalid_key_that_does_not_exist"
  }
}
```

**Expected Result:**
- Error: "Failed to import component with key... Component must be published to a team library."

---

### Test 14: Response Contains componentKey Reference

**Purpose:** Verify response includes component key.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID"
  }
}
```

**Expected Result:**
- Response contains `componentKey` field
- Key can be used to identify source component

---

### Test 15: Create Instance Only X Specified

**Purpose:** Verify partial position params.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    x: 150
  }
}
```

**Expected Result:**
- Instance at (150, 0)
- Missing y defaults to 0

---

### Test 16: Create Instance Only Y Specified

**Purpose:** Verify partial position params.

**Command:**
```javascript
{
  command: "create_component_instance",
  params: {
    componentId: "COMPONENT_ID",
    y: 250
  }
}
```

**Expected Result:**
- Instance at (0, 250)
- Missing x defaults to 0

---

## Sample Test Script

```javascript
/**
 * Test: create_component_instance command
 * Demonstrates both componentId (local) and componentKey (library) usage
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let componentId = null;
let phase = 'create_component';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // First, create a rectangle to convert to component
  setTimeout(() => {
    console.log('Step 1: Creating a rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { x: 0, y: 0, width: 100, height: 50, name: "TestComponent" },
        commandId: "create_rect"
      }
    }));
  }, 2000);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'system') {
    if (parsed.message?.includes('Joined')) {
      console.log('Channel joined');
    }
    return;
  }

  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (error) {
      console.log('Error:', error);
      return;
    }

    if (phase === 'create_component' && result?.id) {
      console.log('Rectangle created:', result.id);

      // Convert to component
      phase = 'convert_to_component';
      console.log('Step 2: Converting to component...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_component",
          params: { nodeId: result.id },
          commandId: "make_component"
        }
      }));
    } else if (phase === 'convert_to_component' && result?.id) {
      componentId = result.id;
      console.log('Component created:', componentId);
      console.log('Component key:', result.key);

      // Now create instance using componentId
      phase = 'create_instance';
      console.log('\nStep 3: Creating instance using componentId...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_component_instance",
          params: {
            componentId: componentId,
            x: 200,
            y: 100
          },
          commandId: "create_instance"
        }
      }));
    } else if (phase === 'create_instance' && result?.id) {
      console.log('\n=== Instance Created Successfully ===');
      console.log('Instance ID:', result.id);
      console.log('Name:', result.name);
      console.log('Position:', `(${result.x}, ${result.y})`);
      console.log('Size:', `${result.width} x ${result.height}`);
      console.log('Source Component ID:', result.componentId);
      console.log('Source Component Key:', result.componentKey);

      // Create another instance at different position
      phase = 'create_second';
      console.log('\nStep 4: Creating second instance...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_component_instance",
          params: {
            componentId: componentId,
            x: 350,
            y: 100
          },
          commandId: "create_instance_2"
        }
      }));
    } else if (phase === 'create_second' && result?.id) {
      console.log('Second instance created:', result.id);
      console.log('\n=== All Tests Complete ===');
      ws.close();
    }
  }
});

ws.on('close', () => console.log('\nConnection closed'));
ws.on('error', (err) => console.error('Error:', err));

setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

### Local Components (componentId)
- [ ] Instance created with valid componentId
- [ ] Error for missing componentId AND componentKey
- [ ] Error for invalid componentId
- [ ] Error for componentId pointing to non-component

### Library Components (componentKey)
- [ ] Instance created with valid componentKey (requires library)
- [ ] Error for invalid componentKey
- [ ] Error message mentions "published to a team library"

### Positioning
- [ ] Default position (0, 0) when not specified
- [ ] Custom x position works
- [ ] Custom y position works
- [ ] Both x and y positions work
- [ ] Negative positions work
- [ ] Decimal positions work

### Instance Properties
- [ ] Multiple instances can be created
- [ ] Instance dimensions match component
- [ ] Instance name matches component
- [ ] Response contains instance id
- [ ] Response contains componentId reference
- [ ] Response contains componentKey reference
- [ ] Instance added to current page
