# Figma MCP Extended API

WebSocket-based API for programmatic access to Figma designs. **75 commands** across 14 categories.

**[Connection Guide](connection.md)** | **[Color Format](reference/color-format.md)** | **[Node ID Format](reference/node-id-format.md)**

---

## Commands by Category

### Document & Pages (8)

| Command | Description |
|---------|-------------|
| [`get_document_info`](commands/01-document-pages.md#get_document_info) | Get current page and document info |
| [`get_all_pages`](commands/01-document-pages.md#get_all_pages) | List all pages in document |
| [`get_selection`](commands/01-document-pages.md#get_selection) | Get currently selected nodes |
| [`get_node_info`](commands/01-document-pages.md#get_node_info) | Get detailed info for a node |
| [`get_nodes_info`](commands/01-document-pages.md#get_nodes_info) | Get info for multiple nodes |
| [`read_my_design`](commands/01-document-pages.md#read_my_design) | Export selection as JSON structure |
| [`create_page`](commands/01-document-pages.md#create_page) | Create a new page |
| [`set_current_page`](commands/01-document-pages.md#set_current_page) | Switch to a different page |

### Shape Creation (12)

| Command | Description |
|---------|-------------|
| [`create_rectangle`](commands/02-shape-creation.md#create_rectangle) | Create a rectangle |
| [`create_frame`](commands/02-shape-creation.md#create_frame) | Create a frame with optional auto-layout |
| [`create_ellipse`](commands/02-shape-creation.md#create_ellipse) | Create an ellipse or circle |
| [`create_line`](commands/02-shape-creation.md#create_line) | Create a line between two points |
| [`create_polygon`](commands/02-shape-creation.md#create_polygon) | Create a polygon (triangle, hexagon, etc.) |
| [`create_vector`](commands/02-shape-creation.md#create_vector) | Create a vector from simple SVG path data |
| [`create_svg`](commands/02-shape-creation.md#create_svg) | Create a vector from complex SVG (curves, arcs) |
| [`create_text`](commands/02-shape-creation.md#create_text) | Create a text node |
| [`clone_node`](commands/02-shape-creation.md#clone_node) | Clone an existing node |
| [`group_nodes`](commands/02-shape-creation.md#group_nodes) | Group multiple nodes together |
| [`ungroup_nodes`](commands/02-shape-creation.md#ungroup_nodes) | Ungroup a group node |
| [`create_image_rectangle`](commands/02-shape-creation.md#create_image_rectangle) | Create a rectangle with image fill |

### Styling (8)

| Command | Description |
|---------|-------------|
| [`set_fill_color`](commands/03-styling.md#set_fill_color) | Set solid fill color |
| [`set_stroke_color`](commands/03-styling.md#set_stroke_color) | Set stroke color and weight |
| [`set_opacity`](commands/03-styling.md#set_opacity) | Set node opacity (0-1) |
| [`set_effects`](commands/03-styling.md#set_effects) | Add shadows or blur effects |
| [`set_gradient_fill`](commands/03-styling.md#set_gradient_fill) | Set gradient fill |
| [`set_blend_mode`](commands/03-styling.md#set_blend_mode) | Set blend mode (multiply, screen, etc.) |
| [`set_stroke_style`](commands/03-styling.md#set_stroke_style) | Set stroke style (dash, cap, join) |
| [`set_corner_radius`](commands/03-styling.md#set_corner_radius) | Set corner radius |

### Text (9)

| Command | Description |
|---------|-------------|
| [`scan_text_nodes`](commands/04-text.md#scan_text_nodes) | Find all text nodes in hierarchy |
| [`set_text_content`](commands/04-text.md#set_text_content) | Set text content |
| [`set_multiple_text_contents`](commands/04-text.md#set_multiple_text_contents) | Batch update multiple text nodes |
| [`set_font_family`](commands/04-text.md#set_font_family) | Change font family |
| [`set_font_size`](commands/04-text.md#set_font_size) | Change font size |
| [`set_font_weight`](commands/04-text.md#set_font_weight) | Change font weight (100-900) |
| [`set_text_alignment`](commands/04-text.md#set_text_alignment) | Set text alignment |
| [`set_line_height`](commands/04-text.md#set_line_height) | Set line height |
| [`set_letter_spacing`](commands/04-text.md#set_letter_spacing) | Set letter spacing |

### Node Operations (10)

| Command | Description |
|---------|-------------|
| [`move_node`](commands/05-node-operations.md#move_node) | Move node to new position |
| [`resize_node`](commands/05-node-operations.md#resize_node) | Resize node dimensions |
| [`delete_node`](commands/05-node-operations.md#delete_node) | Delete a node |
| [`delete_multiple_nodes`](commands/05-node-operations.md#delete_multiple_nodes) | Delete multiple nodes |
| [`set_rotation`](commands/05-node-operations.md#set_rotation) | Set rotation angle |
| [`set_z_index`](commands/05-node-operations.md#set_z_index) | Reorder in layer stack |
| [`rename_node`](commands/05-node-operations.md#rename_node) | Rename a node |
| [`set_visibility`](commands/05-node-operations.md#set_visibility) | Show or hide a node |
| [`set_constraints`](commands/05-node-operations.md#set_constraints) | Set resize constraints |
| [`lock_node`](commands/05-node-operations.md#lock_node) | Lock or unlock a node |

### Layout (5)

| Command | Description |
|---------|-------------|
| [`set_layout_mode`](commands/06-layout.md#set_layout_mode) | Set auto-layout mode |
| [`set_padding`](commands/06-layout.md#set_padding) | Set frame padding |
| [`set_axis_align`](commands/06-layout.md#set_axis_align) | Set alignment in auto-layout |
| [`set_layout_sizing`](commands/06-layout.md#set_layout_sizing) | Set sizing behavior (hug, fill, fixed) |
| [`set_item_spacing`](commands/06-layout.md#set_item_spacing) | Set spacing between children |

### Components (5)

| Command | Description |
|---------|-------------|
| [`get_styles`](commands/07-components.md#get_styles) | Get all local styles |
| [`get_local_components`](commands/07-components.md#get_local_components) | Get all local components |
| [`create_component`](commands/07-components.md#create_component) | Convert node to component |
| [`create_component_instance`](commands/07-components.md#create_component_instance) | Create instance of component |
| [`detach_instance`](commands/07-components.md#detach_instance) | Detach instance from component |

### Images & Export (2)

| Command | Description |
|---------|-------------|
| [`export_node_as_image`](commands/08-images-export.md#export_node_as_image) | Export node as PNG |
| [`set_image_fill`](commands/08-images-export.md#set_image_fill) | Set image as fill |

> Note: `create_image_rectangle` is documented in [Shape Creation](commands/02-shape-creation.md#create_image_rectangle)

### Annotations (3)

| Command | Description |
|---------|-------------|
| [`get_annotations`](commands/09-annotations.md#get_annotations) | Get annotations from nodes |
| [`set_annotation`](commands/09-annotations.md#set_annotation) | Set annotation on a node |
| [`set_multiple_annotations`](commands/09-annotations.md#set_multiple_annotations) | Set annotations on multiple nodes |

### Instances & Overrides (2)

| Command | Description |
|---------|-------------|
| [`get_instance_overrides`](commands/10-instances-overrides.md#get_instance_overrides) | Get instance override info |
| [`set_instance_overrides`](commands/10-instances-overrides.md#set_instance_overrides) | Apply overrides to instances |

### Connections (3)

| Command | Description |
|---------|-------------|
| [`get_reactions`](commands/11-connections.md#get_reactions) | Get interactive reactions |
| [`set_default_connector`](commands/11-connections.md#set_default_connector) | Set default connector |
| [`create_connections`](commands/11-connections.md#create_connections) | Create connector lines |

### Extraction & Analysis (6)

| Command | Description |
|---------|-------------|
| [`get_complete_file_data`](commands/12-extraction.md#get_complete_file_data) | Extract complete document |
| [`get_design_tokens`](commands/12-extraction.md#get_design_tokens) | Extract design tokens |
| [`get_layout_constraints`](commands/12-extraction.md#get_layout_constraints) | Analyze layout with CSS recommendations |
| [`get_component_hierarchy`](commands/12-extraction.md#get_component_hierarchy) | Analyze component relationships |
| [`get_responsive_layouts`](commands/12-extraction.md#get_responsive_layouts) | Analyze responsive patterns |
| [`get_style_inheritance`](commands/12-extraction.md#get_style_inheritance) | Analyze style inheritance |

### Scanning (1)

| Command | Description |
|---------|-------------|
| [`scan_nodes_by_types`](commands/13-scanning.md#scan_nodes_by_types) | Find nodes by type |

### Utility (1)

| Command | Description |
|---------|-------------|
| [`notify`](commands/14-utility.md#notify) | Display notification in Figma |

---

## Summary

| Category | Count |
|----------|-------|
| Document & Pages | 8 |
| Shape Creation | 12 |
| Styling | 8 |
| Text | 9 |
| Node Operations | 10 |
| Layout | 5 |
| Components | 5 |
| Images & Export | 2 |
| Annotations | 3 |
| Instances & Overrides | 2 |
| Connections | 3 |
| Extraction & Analysis | 6 |
| Scanning | 1 |
| Utility | 1 |
| **Total** | **75** |
