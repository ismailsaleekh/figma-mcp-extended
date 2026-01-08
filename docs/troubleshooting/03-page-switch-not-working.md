# Page Switch Not Working

## Issue
After creating a new page and calling `set_current_page`, content is still created on the original page.

## Cause
Wrong parameter name used. The command expects `pageId`, not `nodeId`.

```javascript
// Wrong
await sendCommand("set_current_page", { nodeId: page.result.id });

// Correct
await sendCommand("set_current_page", { pageId: page.result.id });
```

## Better Solution
Use `setAsCurrent: true` in `create_page` - cleaner, one command:

```javascript
const page = await sendCommand("create_page", {
  name: "My New Page",
  setAsCurrent: true  // Switches to page automatically
});

// Now all subsequent commands create on this page
await sendCommand("create_frame", { ... });
```

## Parameters Reference

### `create_page`
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | "New Page" | Page name |
| `setAsCurrent` | boolean | false | Switch to page after creation |

### `set_current_page`
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageId` | string | Yes | ID of page to switch to |
