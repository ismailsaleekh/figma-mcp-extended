# Images & Export

Commands for working with images and exporting nodes.

> See also: [`create_image_rectangle`](02-shape-creation.md#create_image_rectangle) in Shape Creation

---

## `export_node_as_image`

Export a node as PNG image.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Node ID to export |
| `scale` | number | No | 1 | Export scale (1 = 1x, 2 = 2x, etc.) |

**Returns**:
```json
{
  "nodeId": "123:456",
  "format": "PNG",
  "scale": 2,
  "mimeType": "image/png",
  "imageData": "base64_encoded_string..."
}
```

---

## `set_image_fill`

Set an image as fill on an existing node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `imageUrl` | string | No* | URL of image to load |
| `imageBase64` | string | No* | Base64-encoded image data |
| `scaleMode` | string | No | "FILL", "FIT", "CROP", "TILE" |

*One of `imageUrl` or `imageBase64` is required

**Returns**: `{ id, name, imageHash, scaleMode }`
