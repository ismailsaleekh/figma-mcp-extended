# Troubleshooting Guide

Common issues encountered when using the Figma MCP Extended API.

## Issues

| Issue | File | Summary |
|-------|------|---------|
| Rectangle fill color not applied | [01-rectangle-fill-color.md](01-rectangle-fill-color.md) | Use `set_fill_color` after `create_rectangle` |
| SVG icons not rendering | [02-svg-icons-not-rendering.md](02-svg-icons-not-rendering.md) | Use `create_svg` for complex SVG paths |
| Page switch not working | [03-page-switch-not-working.md](03-page-switch-not-working.md) | Use `setAsCurrent: true` in `create_page` |
| Icon not visible on images | [04-icon-visibility-on-images.md](04-icon-visibility-on-images.md) | Use filled white icons for image overlays |

## Quick Reference

```javascript
// Rectangle with fill color (two steps)
const rect = await sendCommand("create_rectangle", { x, y, width, height });
await sendCommand("set_fill_color", { nodeId: rect.result.id, color: { r: 1, g: 1, b: 1, a: 1 } });

// SVG icon from file
await sendCommand("create_svg", { svg: svgFileContent, x, y, width: 24, height: 24, fillColor: color });

// Create page and switch to it
await sendCommand("create_page", { name: "My Page", setAsCurrent: true });
```
