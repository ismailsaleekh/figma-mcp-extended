# Annotations

Commands for managing annotations on nodes.

---

## `get_annotations`

Get annotations from nodes.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | No | - | Specific node ID or empty for all |
| `includeCategories` | boolean | No | true | Include category definitions |

**Returns**: Annotations with categories and properties

---

## `set_annotation`

Set an annotation on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `labelMarkdown` | string | Yes | Annotation text (supports markdown) |
| `categoryId` | string | No | Category ID |
| `properties` | array | No | Custom properties |

**Returns**: `{ success, nodeId, name, annotations }`

---

## `set_multiple_annotations`

Set annotations on multiple nodes.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Parent context |
| `annotations` | array | Yes | Array of annotation objects |

**Returns**: `{ success, annotationsApplied, annotationsFailed, results }`
