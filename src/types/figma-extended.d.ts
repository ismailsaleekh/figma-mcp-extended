// src/types/figma-extended.d.ts
// Extended Figma API types that may not be in the standard typings

declare global {
  interface PluginAPI {
    getLocalComponentsAsync(): Promise<ComponentNode[]>;
    getLocalComponentSetNodesAsync(): Promise<ComponentSetNode[]>;
  }
}

export {};
