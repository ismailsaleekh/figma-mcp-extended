# Rectangle Fill Color Not Applied

## Issue
Rectangles created with `create_rectangle` show default gray (#D9D9D9) instead of specified fill color.

## Cause
`create_rectangle` command does not have a `fillColor` parameter. Only `create_frame` and `create_ellipse` support inline `fillColor`.

## Solution
Use `set_fill_color` after creating the rectangle:

```javascript
// Wrong - fillColor is ignored
await sendCommand("create_rectangle", {
  x: 0, y: 0, width: 100, height: 50,
  fillColor: { r: 1, g: 1, b: 1, a: 1 }  // This doesn't work!
});

// Correct - two-step process
const rect = await sendCommand("create_rectangle", {
  x: 0, y: 0, width: 100, height: 50,
  name: "My Rectangle"
});

await sendCommand("set_fill_color", {
  nodeId: rect.result.id,
  color: { r: 1, g: 1, b: 1, a: 1 }
});
```

## Related Commands
- `set_fill_color` - Set solid fill color on any node
- `set_corner_radius` - Also needs separate call for rectangles
