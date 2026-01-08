"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/helpers/colors.ts
  function rgbaToHex(color) {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = color.a !== void 0 ? Math.round(color.a * 255) : 255;
    if (a === 255) {
      return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    return "#" + [r, g, b, a].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  function createSolidPaint(color) {
    return {
      type: "SOLID",
      color: {
        r: parseFloat(String(color.r)) || 0,
        g: parseFloat(String(color.g)) || 0,
        b: parseFloat(String(color.b)) || 0
      },
      opacity: parseFloat(String(color.a)) || 1
    };
  }
  var init_colors = __esm({
    "src/helpers/colors.ts"() {
      "use strict";
    }
  });

  // src/helpers/nodes.ts
  function filterFigmaNode(node) {
    if (node.type === "VECTOR") {
      return null;
    }
    const filtered = {
      id: node.id,
      name: node.name,
      type: node.type
    };
    if (node.visible !== void 0) {
      filtered.visible = node.visible;
    }
    if (node.fills && node.fills.length > 0) {
      filtered.fills = node.fills.map((fill) => {
        const processedFill = __spreadValues({}, fill);
        delete processedFill.boundVariables;
        delete processedFill.imageRef;
        if (processedFill.gradientStops) {
          processedFill.gradientStops = processedFill.gradientStops.map(
            (stop) => {
              const processedStop = __spreadValues({}, stop);
              if (processedStop.color) {
                processedStop.color = rgbaToHex(
                  processedStop.color
                );
              }
              delete processedStop.boundVariables;
              return processedStop;
            }
          );
        }
        if (processedFill.color) {
          processedFill.color = rgbaToHex(
            processedFill.color
          );
        }
        return processedFill;
      });
    }
    if (node.strokes && node.strokes.length > 0) {
      filtered.strokes = node.strokes.map((stroke) => {
        const processedStroke = __spreadValues({}, stroke);
        delete processedStroke.boundVariables;
        if (processedStroke.color) {
          processedStroke.color = rgbaToHex(
            processedStroke.color
          );
        }
        return processedStroke;
      });
    }
    if (node.cornerRadius !== void 0) {
      filtered.cornerRadius = node.cornerRadius;
    }
    if (node.absoluteBoundingBox) {
      filtered.absoluteBoundingBox = node.absoluteBoundingBox;
    }
    if (node.characters) {
      filtered.characters = node.characters;
    }
    if (node.style) {
      filtered.style = {
        fontFamily: node.style.fontFamily,
        fontStyle: node.style.fontStyle,
        fontWeight: node.style.fontWeight,
        fontSize: node.style.fontSize,
        textAlignHorizontal: node.style.textAlignHorizontal,
        letterSpacing: node.style.letterSpacing,
        lineHeightPx: node.style.lineHeightPx
      };
    }
    if (node.children) {
      filtered.children = node.children.map((child) => filterFigmaNode(child)).filter((child) => child !== null);
    }
    return filtered;
  }
  function customBase64Encode(bytes) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let base64 = "";
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;
    let a, b, c, d;
    let chunk;
    for (let i = 0; i < mainLength; i = i + 3) {
      chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
      a = (chunk & 16515072) >> 18;
      b = (chunk & 258048) >> 12;
      c = (chunk & 4032) >> 6;
      d = chunk & 63;
      base64 += chars[a] + chars[b] + chars[c] + chars[d];
    }
    if (byteRemainder === 1) {
      chunk = bytes[mainLength];
      a = (chunk & 252) >> 2;
      b = (chunk & 3) << 4;
      base64 += chars[a] + chars[b] + "==";
    } else if (byteRemainder === 2) {
      chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
      a = (chunk & 64512) >> 10;
      b = (chunk & 1008) >> 4;
      c = (chunk & 15) << 2;
      base64 += chars[a] + chars[b] + chars[c] + "=";
    }
    return base64;
  }
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function highlightNodeWithFill(node, durationMs = 500) {
    return __async(this, null, function* () {
      if (!("fills" in node))
        return;
      try {
        const originalFills = JSON.parse(JSON.stringify(node.fills));
        node.fills = [
          {
            type: "SOLID",
            color: { r: 1, g: 0.5, b: 0 },
            opacity: 0.3
          }
        ];
        yield delay(durationMs);
        try {
          node.fills = originalFills;
        } catch (err) {
          console.error("Error resetting fills:", err);
        }
      } catch (highlightErr) {
        console.error("Error highlighting node:", highlightErr);
      }
    });
  }
  function collectNodesToProcess(_0) {
    return __async(this, arguments, function* (node, parentPath = [], depth = 0, nodesToProcess = []) {
      if (node.visible === false)
        return;
      const nodePath = [...parentPath, node.name || `Unnamed ${node.type}`];
      nodesToProcess.push({
        node,
        parentPath: nodePath,
        depth
      });
      if ("children" in node) {
        for (const child of node.children) {
          yield collectNodesToProcess(child, nodePath, depth + 1, nodesToProcess);
        }
      }
    });
  }
  function findNodesByTypes(_0, _1) {
    return __async(this, arguments, function* (node, types, matchingNodes = []) {
      if ("visible" in node && node.visible === false)
        return;
      if (node.type !== "PAGE" && types.includes(node.type)) {
        const sceneNode = node;
        matchingNodes.push({
          id: sceneNode.id,
          name: sceneNode.name || `Unnamed ${sceneNode.type}`,
          type: sceneNode.type,
          bbox: {
            x: "x" in sceneNode ? sceneNode.x : 0,
            y: "y" in sceneNode ? sceneNode.y : 0,
            width: "width" in sceneNode ? sceneNode.width : 0,
            height: "height" in sceneNode ? sceneNode.height : 0
          }
        });
      }
      if ("children" in node) {
        for (const child of node.children) {
          yield findNodesByTypes(child, types, matchingNodes);
        }
      }
    });
  }
  var init_nodes = __esm({
    "src/helpers/nodes.ts"() {
      "use strict";
      init_colors();
    }
  });

  // src/commands/document.ts
  function getDocumentInfo() {
    return __async(this, null, function* () {
      yield figma.currentPage.loadAsync();
      const page = figma.currentPage;
      return {
        name: page.name,
        id: page.id,
        type: page.type,
        children: page.children.map((node) => ({
          id: node.id,
          name: node.name,
          type: node.type
        })),
        currentPage: {
          id: page.id,
          name: page.name,
          childCount: page.children.length
        },
        pages: [
          {
            id: page.id,
            name: page.name,
            childCount: page.children.length
          }
        ]
      };
    });
  }
  function getAllPagesInfo() {
    return __async(this, null, function* () {
      try {
        yield figma.loadAllPagesAsync();
        const root = figma.root;
        return {
          documentName: root.name || "Unknown Document",
          documentId: root.id,
          totalPages: root.children.length,
          currentPage: {
            id: figma.currentPage.id,
            name: figma.currentPage.name,
            childCount: figma.currentPage.children.length
          },
          pages: root.children.map((page) => ({
            id: page.id,
            name: page.name,
            type: page.type,
            childCount: page.children ? page.children.length : 0,
            isCurrentPage: page.id === figma.currentPage.id
          }))
        };
      } catch (error) {
        const err = error;
        console.error("Error in getAllPagesInfo:", err);
        return {
          error: err.message,
          documentName: "Error loading",
          documentId: "",
          totalPages: 0,
          currentPage: {
            id: "",
            name: "",
            childCount: 0
          },
          pages: []
        };
      }
    });
  }
  function getSelection() {
    return __async(this, null, function* () {
      return {
        selectionCount: figma.currentPage.selection.length,
        selection: figma.currentPage.selection.map((node) => ({
          id: node.id,
          name: node.name,
          type: node.type,
          visible: node.visible
        }))
      };
    });
  }
  function getNodeInfo(nodeId) {
    return __async(this, null, function* () {
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      const response = yield node.exportAsync({
        format: "JSON_REST_V1"
      });
      return filterFigmaNode(response.document);
    });
  }
  function getNodesInfo(nodeIds) {
    return __async(this, null, function* () {
      try {
        const nodes = yield Promise.all(
          nodeIds.map((id) => figma.getNodeByIdAsync(id))
        );
        const validNodes = nodes.filter((node) => node !== null);
        const responses = yield Promise.all(
          validNodes.map((node) => __async(this, null, function* () {
            const response = yield node.exportAsync({
              format: "JSON_REST_V1"
            });
            return {
              nodeId: node.id,
              document: filterFigmaNode(response.document)
            };
          }))
        );
        return responses;
      } catch (error) {
        const err = error;
        throw new Error(`Error getting nodes info: ${err.message}`);
      }
    });
  }
  function readMyDesign() {
    return __async(this, null, function* () {
      try {
        const nodes = yield Promise.all(
          figma.currentPage.selection.map((node) => figma.getNodeByIdAsync(node.id))
        );
        const validNodes = nodes.filter((node) => node !== null);
        const responses = yield Promise.all(
          validNodes.map((node) => __async(this, null, function* () {
            const response = yield node.exportAsync({
              format: "JSON_REST_V1"
            });
            return {
              nodeId: node.id,
              document: filterFigmaNode(response.document)
            };
          }))
        );
        return responses;
      } catch (error) {
        const err = error;
        throw new Error(`Error getting nodes info: ${err.message}`);
      }
    });
  }
  function createPage(params) {
    return __async(this, null, function* () {
      const { name = "New Page", setAsCurrent = false } = params || {};
      const page = figma.createPage();
      page.name = name;
      if (setAsCurrent) {
        yield figma.setCurrentPageAsync(page);
      }
      return {
        id: page.id,
        name: page.name,
        type: page.type,
        childCount: page.children.length,
        isCurrentPage: figma.currentPage.id === page.id
      };
    });
  }
  function setCurrentPage(params) {
    return __async(this, null, function* () {
      const { pageId } = params;
      if (!pageId) {
        throw new Error("Missing pageId parameter");
      }
      const previousPage = figma.currentPage;
      yield figma.loadAllPagesAsync();
      const targetPage = figma.root.children.find((p) => p.id === pageId);
      if (!targetPage) {
        throw new Error(`Page not found with ID: ${pageId}`);
      }
      yield figma.setCurrentPageAsync(targetPage);
      return {
        success: true,
        previousPageId: previousPage.id,
        previousPageName: previousPage.name,
        currentPageId: targetPage.id,
        currentPageName: targetPage.name
      };
    });
  }
  var init_document = __esm({
    "src/commands/document.ts"() {
      "use strict";
      init_nodes();
    }
  });

  // src/helpers/fonts.ts
  function uniqBy(arr, predicate) {
    const cb = typeof predicate === "function" ? predicate : (o) => o[predicate];
    return [
      ...arr.reduce((map, item) => {
        const key = item === null || item === void 0 ? item : cb(item);
        map.has(key) || map.set(key, item);
        return map;
      }, /* @__PURE__ */ new Map()).values()
    ];
  }
  function getFontStyle(weight) {
    switch (weight) {
      case 100:
        return "Thin";
      case 200:
        return "Extra Light";
      case 300:
        return "Light";
      case 400:
        return "Regular";
      case 500:
        return "Medium";
      case 600:
        return "Semi Bold";
      case 700:
        return "Bold";
      case 800:
        return "Extra Bold";
      case 900:
        return "Black";
      default:
        return "Regular";
    }
  }
  function setCharacters(node, characters, options) {
    return __async(this, null, function* () {
      const fallbackFont = (options == null ? void 0 : options.fallbackFont) || {
        family: "Inter",
        style: "Regular"
      };
      try {
        if (node.fontName === figma.mixed) {
          if ((options == null ? void 0 : options.smartStrategy) === "prevail") {
            const fontHashTree = {};
            for (let i = 1; i < node.characters.length; i++) {
              const charFont = node.getRangeFontName(i - 1, i);
              const key = `${charFont.family}::${charFont.style}`;
              fontHashTree[key] = fontHashTree[key] ? fontHashTree[key] + 1 : 1;
            }
            const prevailedTreeItem = Object.entries(fontHashTree).sort(
              (a, b) => b[1] - a[1]
            )[0];
            const [family, style] = prevailedTreeItem[0].split("::");
            const prevailedFont = { family, style };
            yield figma.loadFontAsync(prevailedFont);
            node.fontName = prevailedFont;
          } else if ((options == null ? void 0 : options.smartStrategy) === "strict") {
            return setCharactersWithStrictMatchFont(node, characters, fallbackFont);
          } else if ((options == null ? void 0 : options.smartStrategy) === "experimental") {
            return setCharactersWithSmartMatchFont(node, characters, fallbackFont);
          } else {
            const firstCharFont = node.getRangeFontName(0, 1);
            yield figma.loadFontAsync(firstCharFont);
            node.fontName = firstCharFont;
          }
        } else {
          yield figma.loadFontAsync({
            family: node.fontName.family,
            style: node.fontName.style
          });
        }
      } catch (err) {
        const fontName = node.fontName;
        console.warn(
          `Failed to load "${fontName.family} ${fontName.style}" font and replaced with fallback "${fallbackFont.family} ${fallbackFont.style}"`,
          err
        );
        yield figma.loadFontAsync(fallbackFont);
        node.fontName = fallbackFont;
      }
      try {
        node.characters = characters;
        return true;
      } catch (err) {
        console.warn(`Failed to set characters. Skipped.`, err);
        return false;
      }
    });
  }
  function setCharactersWithStrictMatchFont(node, characters, fallbackFont) {
    return __async(this, null, function* () {
      const fontHashTree = {};
      for (let i = 1; i < node.characters.length; i++) {
        const startIdx = i - 1;
        const startCharFont = node.getRangeFontName(startIdx, i);
        const startCharFontVal = `${startCharFont.family}::${startCharFont.style}`;
        while (i < node.characters.length) {
          i++;
          const charFont = node.getRangeFontName(i - 1, i);
          if (startCharFontVal !== `${charFont.family}::${charFont.style}`) {
            break;
          }
        }
        fontHashTree[`${startIdx}_${i}`] = startCharFontVal;
      }
      yield figma.loadFontAsync(fallbackFont);
      node.fontName = fallbackFont;
      node.characters = characters;
      yield Promise.all(
        Object.keys(fontHashTree).map((range) => __async(this, null, function* () {
          const [start, end] = range.split("_");
          const [family, style] = fontHashTree[range].split("::");
          const matchedFont = { family, style };
          yield figma.loadFontAsync(matchedFont);
          return node.setRangeFontName(Number(start), Number(end), matchedFont);
        }))
      );
      return true;
    });
  }
  function getDelimiterPos(str, delimiter, startIdx = 0, endIdx = str.length) {
    const indices = [];
    let temp = startIdx;
    for (let i = startIdx; i < endIdx; i++) {
      if (str[i] === delimiter && i + startIdx !== endIdx && temp !== i + startIdx) {
        indices.push([temp, i + startIdx]);
        temp = i + startIdx + 1;
      }
    }
    if (temp !== endIdx) {
      indices.push([temp, endIdx]);
    }
    return indices.filter(Boolean);
  }
  function buildLinearOrder(node) {
    const fontTree = [];
    const newLinesPos = getDelimiterPos(node.characters, "\n");
    newLinesPos.forEach(([newLinesRangeStart, newLinesRangeEnd]) => {
      const newLinesRangeFont = node.getRangeFontName(
        newLinesRangeStart,
        newLinesRangeEnd
      );
      if (newLinesRangeFont === figma.mixed) {
        const spacesPos = getDelimiterPos(
          node.characters,
          " ",
          newLinesRangeStart,
          newLinesRangeEnd
        );
        spacesPos.forEach(([spacesRangeStart, spacesRangeEnd]) => {
          const spacesRangeFont = node.getRangeFontName(
            spacesRangeStart,
            spacesRangeEnd
          );
          if (spacesRangeFont === figma.mixed) {
            const rangeFont = node.getRangeFontName(
              spacesRangeStart,
              spacesRangeStart + 1
            );
            fontTree.push({
              start: spacesRangeStart,
              delimiter: " ",
              family: rangeFont.family,
              style: rangeFont.style
            });
          } else {
            const font = spacesRangeFont;
            fontTree.push({
              start: spacesRangeStart,
              delimiter: " ",
              family: font.family,
              style: font.style
            });
          }
        });
      } else {
        const font = newLinesRangeFont;
        fontTree.push({
          start: newLinesRangeStart,
          delimiter: "\n",
          family: font.family,
          style: font.style
        });
      }
    });
    return fontTree.sort((a, b) => a.start - b.start).map(({ family, style, delimiter }) => ({ family, style, delimiter }));
  }
  function setCharactersWithSmartMatchFont(node, characters, fallbackFont) {
    return __async(this, null, function* () {
      const rangeTree = buildLinearOrder(node);
      const fontsToLoad = uniqBy(
        rangeTree,
        ({ family, style }) => `${family}::${style}`
      ).map(({ family, style }) => ({ family, style }));
      yield Promise.all([...fontsToLoad, fallbackFont].map(figma.loadFontAsync));
      node.fontName = fallbackFont;
      node.characters = characters;
      let prevPos = 0;
      rangeTree.forEach(({ family, style, delimiter }) => {
        if (prevPos < node.characters.length) {
          const delimiterPos = node.characters.indexOf(delimiter, prevPos);
          const endPos = delimiterPos > prevPos ? delimiterPos : node.characters.length;
          const matchedFont = { family, style };
          node.setRangeFontName(prevPos, endPos, matchedFont);
          prevPos = endPos + 1;
        }
      });
      return true;
    });
  }
  var init_fonts = __esm({
    "src/helpers/fonts.ts"() {
      "use strict";
    }
  });

  // node_modules/svg-path-parser/parser.js
  var require_parser = __commonJS({
    "node_modules/svg-path-parser/parser.js"(exports, module) {
      "use strict";
      function peg$subclass(child, parent) {
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
      }
      function peg$SyntaxError(message, expected, found, location) {
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, peg$SyntaxError);
        }
      }
      peg$subclass(peg$SyntaxError, Error);
      peg$SyntaxError.buildMessage = function(expected, found) {
        var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return '"' + literalEscape(expectation.text) + '"';
          },
          "class": function(expectation) {
            var escapedParts = "", i;
            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
            }
            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },
          any: function(expectation) {
            return "any character";
          },
          end: function(expectation) {
            return "end of input";
          },
          other: function(expectation) {
            return expectation.description;
          }
        };
        function hex(ch) {
          return ch.charCodeAt(0).toString(16).toUpperCase();
        }
        function literalEscape(s) {
          return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
            return "\\x0" + hex(ch);
          }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
            return "\\x" + hex(ch);
          });
        }
        function classEscape(s) {
          return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
            return "\\x0" + hex(ch);
          }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
            return "\\x" + hex(ch);
          });
        }
        function describeExpectation(expectation) {
          return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
        }
        function describeExpected(expected2) {
          var descriptions = new Array(expected2.length), i, j;
          for (i = 0; i < expected2.length; i++) {
            descriptions[i] = describeExpectation(expected2[i]);
          }
          descriptions.sort();
          if (descriptions.length > 0) {
            for (i = 1, j = 1; i < descriptions.length; i++) {
              if (descriptions[i - 1] !== descriptions[i]) {
                descriptions[j] = descriptions[i];
                j++;
              }
            }
            descriptions.length = j;
          }
          switch (descriptions.length) {
            case 1:
              return descriptions[0];
            case 2:
              return descriptions[0] + " or " + descriptions[1];
            default:
              return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
          }
        }
        function describeFound(found2) {
          return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
        }
        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
      };
      function peg$parse(input, options) {
        options = options !== void 0 ? options : {};
        var peg$FAILED = {}, peg$startRuleFunctions = { svg_path: peg$parsesvg_path }, peg$startRuleFunction = peg$parsesvg_path, peg$c0 = function(data) {
          if (!data)
            return [];
          for (var cmds2 = [], i = 0; i < data.length; i++)
            cmds2 = cmds2.concat.apply(cmds2, data[i]);
          var first = cmds2[0];
          if (first && first.code == "m") {
            delete first.relative;
            first.code = "M";
          }
          return cmds2;
        }, peg$c1 = function(first, more) {
          return merge(first, more);
        }, peg$c2 = /^[Mm]/, peg$c3 = peg$classExpectation(["M", "m"], false, false), peg$c4 = function(c, first, more) {
          var move = commands(c, [first]);
          if (more)
            move = move.concat(commands(c == "M" ? "L" : "l", more[1]));
          return move;
        }, peg$c5 = /^[Zz]/, peg$c6 = peg$classExpectation(["Z", "z"], false, false), peg$c7 = function() {
          return commands("Z");
        }, peg$c8 = /^[Ll]/, peg$c9 = peg$classExpectation(["L", "l"], false, false), peg$c10 = function(c, args) {
          return commands(c, args);
        }, peg$c11 = /^[Hh]/, peg$c12 = peg$classExpectation(["H", "h"], false, false), peg$c13 = function(c, args) {
          return commands(c, args.map(function(x) {
            return { x };
          }));
        }, peg$c14 = /^[Vv]/, peg$c15 = peg$classExpectation(["V", "v"], false, false), peg$c16 = function(c, args) {
          return commands(c, args.map(function(y) {
            return { y };
          }));
        }, peg$c17 = /^[Cc]/, peg$c18 = peg$classExpectation(["C", "c"], false, false), peg$c19 = function(a, b, c) {
          return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, x: c.x, y: c.y };
        }, peg$c20 = /^[Ss]/, peg$c21 = peg$classExpectation(["S", "s"], false, false), peg$c22 = function(b, c) {
          return { x2: b.x, y2: b.y, x: c.x, y: c.y };
        }, peg$c23 = /^[Qq]/, peg$c24 = peg$classExpectation(["Q", "q"], false, false), peg$c25 = function(a, b) {
          return { x1: a.x, y1: a.y, x: b.x, y: b.y };
        }, peg$c26 = /^[Tt]/, peg$c27 = peg$classExpectation(["T", "t"], false, false), peg$c28 = /^[Aa]/, peg$c29 = peg$classExpectation(["A", "a"], false, false), peg$c30 = function(rx, ry, xrot, large, sweep, xy) {
          return { rx, ry, xAxisRotation: xrot, largeArc: large, sweep, x: xy.x, y: xy.y };
        }, peg$c31 = function(x, y) {
          return { x, y };
        }, peg$c32 = function(n) {
          return n * 1;
        }, peg$c33 = function(parts) {
          return parts.join("") * 1;
        }, peg$c34 = /^[01]/, peg$c35 = peg$classExpectation(["0", "1"], false, false), peg$c36 = function(bit) {
          return bit == "1";
        }, peg$c37 = function() {
          return "";
        }, peg$c38 = ",", peg$c39 = peg$literalExpectation(",", false), peg$c40 = function(parts) {
          return parts.join("");
        }, peg$c41 = ".", peg$c42 = peg$literalExpectation(".", false), peg$c43 = /^[eE]/, peg$c44 = peg$classExpectation(["e", "E"], false, false), peg$c45 = /^[+\-]/, peg$c46 = peg$classExpectation(["+", "-"], false, false), peg$c47 = /^[0-9]/, peg$c48 = peg$classExpectation([["0", "9"]], false, false), peg$c49 = function(digits) {
          return digits.join("");
        }, peg$c50 = /^[ \t\n\r]/, peg$c51 = peg$classExpectation([" ", "	", "\n", "\r"], false, false), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
        if ("startRule" in options) {
          if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
          }
          peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }
        function text() {
          return input.substring(peg$savedPos, peg$currPos);
        }
        function location() {
          return peg$computeLocation(peg$savedPos, peg$currPos);
        }
        function expected(description, location2) {
          location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
          throw peg$buildStructuredError(
            [peg$otherExpectation(description)],
            input.substring(peg$savedPos, peg$currPos),
            location2
          );
        }
        function error(message, location2) {
          location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
          throw peg$buildSimpleError(message, location2);
        }
        function peg$literalExpectation(text2, ignoreCase) {
          return { type: "literal", text: text2, ignoreCase };
        }
        function peg$classExpectation(parts, inverted, ignoreCase) {
          return { type: "class", parts, inverted, ignoreCase };
        }
        function peg$anyExpectation() {
          return { type: "any" };
        }
        function peg$endExpectation() {
          return { type: "end" };
        }
        function peg$otherExpectation(description) {
          return { type: "other", description };
        }
        function peg$computePosDetails(pos) {
          var details = peg$posDetailsCache[pos], p;
          if (details) {
            return details;
          } else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
              p--;
            }
            details = peg$posDetailsCache[p];
            details = {
              line: details.line,
              column: details.column
            };
            while (p < pos) {
              if (input.charCodeAt(p) === 10) {
                details.line++;
                details.column = 1;
              } else {
                details.column++;
              }
              p++;
            }
            peg$posDetailsCache[pos] = details;
            return details;
          }
        }
        function peg$computeLocation(startPos, endPos) {
          var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
          return {
            start: {
              offset: startPos,
              line: startPosDetails.line,
              column: startPosDetails.column
            },
            end: {
              offset: endPos,
              line: endPosDetails.line,
              column: endPosDetails.column
            }
          };
        }
        function peg$fail(expected2) {
          if (peg$currPos < peg$maxFailPos) {
            return;
          }
          if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
          }
          peg$maxFailExpected.push(expected2);
        }
        function peg$buildSimpleError(message, location2) {
          return new peg$SyntaxError(message, null, null, location2);
        }
        function peg$buildStructuredError(expected2, found, location2) {
          return new peg$SyntaxError(
            peg$SyntaxError.buildMessage(expected2, found),
            expected2,
            found,
            location2
          );
        }
        function peg$parsesvg_path() {
          var s0, s1, s2, s3, s4;
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsewsp();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsewsp();
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsemoveTo_drawTo_commandGroups();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parsewsp();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parsewsp();
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c0(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsemoveTo_drawTo_commandGroups() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsemoveTo_drawTo_commandGroup();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$parsewsp();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsewsp();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsemoveTo_drawTo_commandGroup();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = [];
              s5 = peg$parsewsp();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parsewsp();
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsemoveTo_drawTo_commandGroup();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsemoveTo_drawTo_commandGroup() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsemoveto();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$parsewsp();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsewsp();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsedrawto_command();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = [];
              s5 = peg$parsewsp();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parsewsp();
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsedrawto_command();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsedrawto_command() {
          var s0;
          s0 = peg$parseclosepath();
          if (s0 === peg$FAILED) {
            s0 = peg$parselineto();
            if (s0 === peg$FAILED) {
              s0 = peg$parsehorizontal_lineto();
              if (s0 === peg$FAILED) {
                s0 = peg$parsevertical_lineto();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsecurveto();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parsesmooth_curveto();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parsequadratic_bezier_curveto();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parsesmooth_quadratic_bezier_curveto();
                        if (s0 === peg$FAILED) {
                          s0 = peg$parseelliptical_arc();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          return s0;
        }
        function peg$parsemoveto() {
          var s0, s1, s2, s3, s4, s5, s6;
          s0 = peg$currPos;
          if (peg$c2.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c3);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsecoordinate_pair();
              if (s3 !== peg$FAILED) {
                s4 = peg$currPos;
                s5 = peg$parsecomma_wsp();
                if (s5 === peg$FAILED) {
                  s5 = null;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parselineto_argument_sequence();
                  if (s6 !== peg$FAILED) {
                    s5 = [s5, s6];
                    s4 = s5;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c4(s1, s3, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parseclosepath() {
          var s0, s1;
          s0 = peg$currPos;
          if (peg$c5.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c6);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c7();
          }
          s0 = s1;
          return s0;
        }
        function peg$parselineto() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c8.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c9);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parselineto_argument_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parselineto_argument_sequence() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsecoordinate_pair();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsecomma_wsp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecoordinate_pair();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsecomma_wsp();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsecoordinate_pair();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsehorizontal_lineto() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c11.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c12);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsecoordinate_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c13(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsecoordinate_sequence() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsenumber();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsecomma_wsp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsenumber();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsecomma_wsp();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsenumber();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsevertical_lineto() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c14.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c15);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsecoordinate_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c16(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsecurveto() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c17.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c18);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsecurveto_argument_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsecurveto_argument_sequence() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsecurveto_argument();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsecomma_wsp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecurveto_argument();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsecomma_wsp();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsecurveto_argument();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsecurveto_argument() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsecoordinate_pair();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecomma_wsp();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsecoordinate_pair();
              if (s3 !== peg$FAILED) {
                s4 = peg$parsecomma_wsp();
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsecoordinate_pair();
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c19(s1, s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsesmooth_curveto() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c20.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c21);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsesmooth_curveto_argument_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsesmooth_curveto_argument_sequence() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsesmooth_curveto_argument();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsecomma_wsp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsesmooth_curveto_argument();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsecomma_wsp();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsesmooth_curveto_argument();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsesmooth_curveto_argument() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          s1 = peg$parsecoordinate_pair();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecomma_wsp();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsecoordinate_pair();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c22(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsequadratic_bezier_curveto() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c23.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c24);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsequadratic_bezier_curveto_argument_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsequadratic_bezier_curveto_argument_sequence() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsequadratic_bezier_curveto_argument();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsecomma_wsp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsequadratic_bezier_curveto_argument();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsecomma_wsp();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsequadratic_bezier_curveto_argument();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsequadratic_bezier_curveto_argument() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          s1 = peg$parsecoordinate_pair();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecomma_wsp();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsecoordinate_pair();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c25(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsesmooth_quadratic_bezier_curveto() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c26.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c27);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsesmooth_quadratic_bezier_curveto_argument_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsesmooth_quadratic_bezier_curveto_argument_sequence() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parsecoordinate_pair();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsecomma_wsp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecoordinate_pair();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsecomma_wsp();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsecoordinate_pair();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parseelliptical_arc() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          if (peg$c28.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c29);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsewsp();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsewsp();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseelliptical_arc_argument_sequence();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parseelliptical_arc_argument_sequence() {
          var s0, s1, s2, s3, s4, s5;
          s0 = peg$currPos;
          s1 = peg$parseelliptical_arc_argument();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsecomma_wsp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseelliptical_arc_argument();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsecomma_wsp();
              if (s4 === peg$FAILED) {
                s4 = null;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseelliptical_arc_argument();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parseelliptical_arc_argument() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
          s0 = peg$currPos;
          s1 = peg$parsenonnegative_number();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecomma_wsp();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsenonnegative_number();
              if (s3 !== peg$FAILED) {
                s4 = peg$parsecomma_wsp();
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsenumber();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parsecomma_wsp();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseflag();
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parsecomma_wsp();
                        if (s8 === peg$FAILED) {
                          s8 = null;
                        }
                        if (s8 !== peg$FAILED) {
                          s9 = peg$parseflag();
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parsecomma_wsp();
                            if (s10 === peg$FAILED) {
                              s10 = null;
                            }
                            if (s10 !== peg$FAILED) {
                              s11 = peg$parsecoordinate_pair();
                              if (s11 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c30(s1, s3, s5, s7, s9, s11);
                                s0 = s1;
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsecoordinate_pair() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          s1 = peg$parsenumber();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecomma_wsp();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsenumber();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c31(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          return s0;
        }
        function peg$parsenonnegative_number() {
          var s0, s1;
          s0 = peg$currPos;
          s1 = peg$parsefloating_point_constant();
          if (s1 === peg$FAILED) {
            s1 = peg$parsedigit_sequence();
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c32(s1);
          }
          s0 = s1;
          return s0;
        }
        function peg$parsenumber() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = peg$parsesign();
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsefloating_point_constant();
            if (s3 !== peg$FAILED) {
              s2 = [s2, s3];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 === peg$FAILED) {
            s1 = peg$currPos;
            s2 = peg$parsesign();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsedigit_sequence();
              if (s3 !== peg$FAILED) {
                s2 = [s2, s3];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c33(s1);
          }
          s0 = s1;
          return s0;
        }
        function peg$parseflag() {
          var s0, s1;
          s0 = peg$currPos;
          if (peg$c34.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c35);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c36(s1);
          }
          s0 = s1;
          return s0;
        }
        function peg$parsecomma_wsp() {
          var s0, s1, s2, s3, s4;
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsewsp();
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parsewsp();
            }
          } else {
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecomma();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parsewsp();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parsewsp();
              }
              if (s3 !== peg$FAILED) {
                s1 = [s1, s2, s3];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parsecomma();
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parsewsp();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parsewsp();
              }
              if (s3 !== peg$FAILED) {
                s2 = [s2, s3];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c37();
            }
            s0 = s1;
          }
          return s0;
        }
        function peg$parsecomma() {
          var s0;
          if (input.charCodeAt(peg$currPos) === 44) {
            s0 = peg$c38;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c39);
            }
          }
          return s0;
        }
        function peg$parsefloating_point_constant() {
          var s0, s1, s2, s3;
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = peg$parsefractional_constant();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseexponent();
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s2 = [s2, s3];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 === peg$FAILED) {
            s1 = peg$currPos;
            s2 = peg$parsedigit_sequence();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseexponent();
              if (s3 !== peg$FAILED) {
                s2 = [s2, s3];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c40(s1);
          }
          s0 = s1;
          return s0;
        }
        function peg$parsefractional_constant() {
          var s0, s1, s2, s3, s4;
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = peg$parsedigit_sequence();
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s3 = peg$c41;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c42);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsedigit_sequence();
              if (s4 !== peg$FAILED) {
                s2 = [s2, s3, s4];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 === peg$FAILED) {
            s1 = peg$currPos;
            s2 = peg$parsedigit_sequence();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 46) {
                s3 = peg$c41;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c42);
                }
              }
              if (s3 !== peg$FAILED) {
                s2 = [s2, s3];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c40(s1);
          }
          s0 = s1;
          return s0;
        }
        function peg$parseexponent() {
          var s0, s1, s2, s3, s4;
          s0 = peg$currPos;
          s1 = peg$currPos;
          if (peg$c43.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c44);
            }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsesign();
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parsedigit_sequence();
              if (s4 !== peg$FAILED) {
                s2 = [s2, s3, s4];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c40(s1);
          }
          s0 = s1;
          return s0;
        }
        function peg$parsesign() {
          var s0;
          if (peg$c45.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c46);
            }
          }
          return s0;
        }
        function peg$parsedigit_sequence() {
          var s0, s1, s2;
          s0 = peg$currPos;
          s1 = [];
          if (peg$c47.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c48);
            }
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              if (peg$c47.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c48);
                }
              }
            }
          } else {
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c49(s1);
          }
          s0 = s1;
          return s0;
        }
        function peg$parsewsp() {
          var s0, s1;
          s0 = peg$currPos;
          if (peg$c50.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c51);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c37();
          }
          s0 = s1;
          return s0;
        }
        function merge(first, more) {
          if (!more)
            return [first];
          for (var a = [first], i = 0, l = more.length; i < l; i++)
            a[i + 1] = more[i][1];
          return a;
        }
        var cmds = { m: "moveto", l: "lineto", h: "horizontal lineto", v: "vertical lineto", c: "curveto", s: "smooth curveto", q: "quadratic curveto", t: "smooth quadratic curveto", a: "elliptical arc", z: "closepath" };
        for (var code in cmds)
          cmds[code.toUpperCase()] = cmds[code];
        function commands(code2, args) {
          if (!args)
            args = [{}];
          for (var i = args.length; i--; ) {
            var cmd = { code: code2, command: cmds[code2] };
            if (code2 == code2.toLowerCase())
              cmd.relative = true;
            for (var k in args[i])
              cmd[k] = args[i][k];
            args[i] = cmd;
          }
          return args;
        }
        peg$result = peg$startRuleFunction();
        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
          return peg$result;
        } else {
          if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
          }
          throw peg$buildStructuredError(
            peg$maxFailExpected,
            peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
            peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
          );
        }
      }
      module.exports = {
        SyntaxError: peg$SyntaxError,
        parse: peg$parse
      };
    }
  });

  // node_modules/svg-path-parser/index.js
  var require_svg_path_parser = __commonJS({
    "node_modules/svg-path-parser/index.js"(exports, module) {
      var parserFunction = require_parser().parse;
      parserFunction.parseSVG = parserFunction;
      parserFunction.makeAbsolute = makeSVGPathCommandsAbsolute;
      module.exports = parserFunction;
      function makeSVGPathCommandsAbsolute(commands) {
        var subpathStart, prevCmd = { x: 0, y: 0 };
        var attr = { x: "x0", y: "y0", x1: "x0", y1: "y0", x2: "x0", y2: "y0" };
        commands.forEach(function(cmd) {
          if (cmd.command === "moveto")
            subpathStart = cmd;
          cmd.x0 = prevCmd.x;
          cmd.y0 = prevCmd.y;
          for (var a in attr)
            if (a in cmd)
              cmd[a] += cmd.relative ? cmd[attr[a]] : 0;
          if (!("x" in cmd))
            cmd.x = prevCmd.x;
          if (!("y" in cmd))
            cmd.y = prevCmd.y;
          cmd.relative = false;
          cmd.code = cmd.code.toUpperCase();
          if (cmd.command == "closepath") {
            cmd.x = subpathStart.x;
            cmd.y = subpathStart.y;
          }
          prevCmd = cmd;
        });
        return commands;
      }
    }
  });

  // src/helpers/svg.ts
  function svgPathToVectorNetwork(pathData, windingRule = "EVENODD") {
    const commands = (0, import_svg_path_parser.makeAbsolute)((0, import_svg_path_parser.parseSVG)(pathData));
    const vertices = [];
    const segments = [];
    const loops = [];
    let currentLoop = [];
    let currentX = 0;
    let currentY = 0;
    let startX = 0;
    let startY = 0;
    let startVertexIndex = 0;
    let lastControlX = 0;
    let lastControlY = 0;
    let lastCommand = "";
    function addVertex(x, y) {
      const existing = vertices.findIndex(
        (v) => Math.abs(v.x - x) < 1e-3 && Math.abs(v.y - y) < 1e-3
      );
      if (existing >= 0)
        return existing;
      vertices.push({ x, y });
      return vertices.length - 1;
    }
    function addSegment(startIdx, endIdx, tangentStart, tangentEnd) {
      const segmentIndex = segments.length;
      segments.push({
        start: startIdx,
        end: endIdx,
        tangentStart,
        tangentEnd
      });
      currentLoop.push(segmentIndex);
    }
    for (const cmd of commands) {
      switch (cmd.code) {
        case "M": {
          if (currentLoop.length > 0) {
            loops.push([...currentLoop]);
            currentLoop = [];
          }
          currentX = cmd.x;
          currentY = cmd.y;
          startX = currentX;
          startY = currentY;
          startVertexIndex = addVertex(currentX, currentY);
          lastCommand = "M";
          break;
        }
        case "L": {
          const fromIdx = addVertex(currentX, currentY);
          currentX = cmd.x;
          currentY = cmd.y;
          const toIdx = addVertex(currentX, currentY);
          addSegment(fromIdx, toIdx);
          lastCommand = "L";
          break;
        }
        case "H": {
          const fromIdx = addVertex(currentX, currentY);
          currentX = cmd.x;
          const toIdx = addVertex(currentX, currentY);
          addSegment(fromIdx, toIdx);
          lastCommand = "H";
          break;
        }
        case "V": {
          const fromIdx = addVertex(currentX, currentY);
          currentY = cmd.y;
          const toIdx = addVertex(currentX, currentY);
          addSegment(fromIdx, toIdx);
          lastCommand = "V";
          break;
        }
        case "C": {
          const fromIdx = addVertex(currentX, currentY);
          const toX = cmd.x;
          const toY = cmd.y;
          const toIdx = addVertex(toX, toY);
          const tangentStart = {
            x: cmd.x1 - currentX,
            y: cmd.y1 - currentY
          };
          const tangentEnd = {
            x: cmd.x2 - toX,
            y: cmd.y2 - toY
          };
          addSegment(fromIdx, toIdx, tangentStart, tangentEnd);
          lastControlX = cmd.x2;
          lastControlY = cmd.y2;
          currentX = toX;
          currentY = toY;
          lastCommand = "C";
          break;
        }
        case "S": {
          const fromIdx = addVertex(currentX, currentY);
          const toX = cmd.x;
          const toY = cmd.y;
          const toIdx = addVertex(toX, toY);
          let cp1x = currentX;
          let cp1y = currentY;
          if (lastCommand === "C" || lastCommand === "S") {
            cp1x = 2 * currentX - lastControlX;
            cp1y = 2 * currentY - lastControlY;
          }
          const tangentStart = {
            x: cp1x - currentX,
            y: cp1y - currentY
          };
          const tangentEnd = {
            x: cmd.x2 - toX,
            y: cmd.y2 - toY
          };
          addSegment(fromIdx, toIdx, tangentStart, tangentEnd);
          lastControlX = cmd.x2;
          lastControlY = cmd.y2;
          currentX = toX;
          currentY = toY;
          lastCommand = "S";
          break;
        }
        case "Q": {
          const fromIdx = addVertex(currentX, currentY);
          const toX = cmd.x;
          const toY = cmd.y;
          const toIdx = addVertex(toX, toY);
          const cp1x = currentX + 2 / 3 * (cmd.x1 - currentX);
          const cp1y = currentY + 2 / 3 * (cmd.y1 - currentY);
          const cp2x = toX + 2 / 3 * (cmd.x1 - toX);
          const cp2y = toY + 2 / 3 * (cmd.y1 - toY);
          const tangentStart = { x: cp1x - currentX, y: cp1y - currentY };
          const tangentEnd = { x: cp2x - toX, y: cp2y - toY };
          addSegment(fromIdx, toIdx, tangentStart, tangentEnd);
          lastControlX = cmd.x1;
          lastControlY = cmd.y1;
          currentX = toX;
          currentY = toY;
          lastCommand = "Q";
          break;
        }
        case "T": {
          const fromIdx = addVertex(currentX, currentY);
          const toX = cmd.x;
          const toY = cmd.y;
          const toIdx = addVertex(toX, toY);
          let cpx = currentX;
          let cpy = currentY;
          if (lastCommand === "Q" || lastCommand === "T") {
            cpx = 2 * currentX - lastControlX;
            cpy = 2 * currentY - lastControlY;
          }
          const cp1x = currentX + 2 / 3 * (cpx - currentX);
          const cp1y = currentY + 2 / 3 * (cpy - currentY);
          const cp2x = toX + 2 / 3 * (cpx - toX);
          const cp2y = toY + 2 / 3 * (cpy - toY);
          const tangentStart = { x: cp1x - currentX, y: cp1y - currentY };
          const tangentEnd = { x: cp2x - toX, y: cp2y - toY };
          addSegment(fromIdx, toIdx, tangentStart, tangentEnd);
          lastControlX = cpx;
          lastControlY = cpy;
          currentX = toX;
          currentY = toY;
          lastCommand = "T";
          break;
        }
        case "A": {
          const fromIdx = addVertex(currentX, currentY);
          const toX = cmd.x;
          const toY = cmd.y;
          const toIdx = addVertex(toX, toY);
          const rx = cmd.rx || 0;
          const ry = cmd.ry || 0;
          if (rx > 0 && ry > 0) {
            const dx = toX - currentX;
            const dy = toY - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const bulge = Math.min(rx, ry) * 0.5;
            const sign = cmd.sweep ? 1 : -1;
            const cp1x = currentX + dx * 0.25 + perpX * bulge * sign;
            const cp1y = currentY + dy * 0.25 + perpY * bulge * sign;
            const cp2x = currentX + dx * 0.75 + perpX * bulge * sign;
            const cp2y = currentY + dy * 0.75 + perpY * bulge * sign;
            const tangentStart = { x: cp1x - currentX, y: cp1y - currentY };
            const tangentEnd = { x: cp2x - toX, y: cp2y - toY };
            addSegment(fromIdx, toIdx, tangentStart, tangentEnd);
          } else {
            addSegment(fromIdx, toIdx);
          }
          currentX = toX;
          currentY = toY;
          lastCommand = "A";
          break;
        }
        case "Z":
        case "z": {
          if (Math.abs(currentX - startX) > 1e-3 || Math.abs(currentY - startY) > 1e-3) {
            const fromIdx = addVertex(currentX, currentY);
            addSegment(fromIdx, startVertexIndex);
          }
          if (currentLoop.length > 0) {
            loops.push([...currentLoop]);
            currentLoop = [];
          }
          currentX = startX;
          currentY = startY;
          lastCommand = "Z";
          break;
        }
      }
    }
    if (currentLoop.length > 0) {
      loops.push([...currentLoop]);
    }
    return {
      vertices,
      segments,
      regions: loops.length > 0 ? [{ windingRule, loops }] : []
    };
  }
  function parseSvgPaths(svgContent) {
    const paths = [];
    const pathRegex = /<path[^>]*\sd=["']([^"']+)["'][^>]*\/?>/gi;
    let match;
    while ((match = pathRegex.exec(svgContent)) !== null) {
      paths.push(match[1]);
    }
    return paths;
  }
  function parseSvgViewBox(svgContent) {
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
    if (viewBoxMatch) {
      const parts = viewBoxMatch[1].split(/[\s,]+/).map(Number);
      if (parts.length >= 4 && !isNaN(parts[2]) && !isNaN(parts[3])) {
        return { width: parts[2], height: parts[3] };
      }
    }
    const widthMatch = svgContent.match(/width=["'](\d+(?:\.\d+)?)["']/i);
    const heightMatch = svgContent.match(/height=["'](\d+(?:\.\d+)?)["']/i);
    if (widthMatch && heightMatch) {
      return { width: Number(widthMatch[1]), height: Number(heightMatch[1]) };
    }
    return null;
  }
  function detectSvgStyle(svgContent) {
    const hasStroke = /stroke=["'](?!none)[^"']*["']/i.test(svgContent);
    const hasFillNone = /fill=["']none["']/i.test(svgContent);
    const hasFill = /fill=["'](?!none)[^"']*["']/i.test(svgContent);
    if (hasStroke && (hasFill || !hasFillNone))
      return "both";
    if (hasStroke)
      return "stroke";
    return "fill";
  }
  function extractStrokeWidth(svgContent) {
    const match = svgContent.match(/stroke-width=["']([^"']+)["']/i);
    if (match) {
      const value = parseFloat(match[1]);
      if (!isNaN(value))
        return value;
    }
    return null;
  }
  var import_svg_path_parser;
  var init_svg = __esm({
    "src/helpers/svg.ts"() {
      "use strict";
      import_svg_path_parser = __toESM(require_svg_path_parser());
    }
  });

  // src/commands/creation.ts
  function createRectangle(params) {
    return __async(this, null, function* () {
      const {
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        name = "Rectangle",
        parentId
      } = params || {};
      const rect = figma.createRectangle();
      rect.x = x;
      rect.y = y;
      rect.resize(width, height);
      rect.name = name;
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(rect);
      } else {
        figma.currentPage.appendChild(rect);
      }
      return {
        id: rect.id,
        name: rect.name,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        parentId: rect.parent ? rect.parent.id : void 0
      };
    });
  }
  function createFrame(params) {
    return __async(this, null, function* () {
      const {
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        name = "Frame",
        parentId,
        fillColor,
        strokeColor,
        strokeWeight,
        layoutMode = "NONE",
        layoutWrap = "NO_WRAP",
        paddingTop = 10,
        paddingRight = 10,
        paddingBottom = 10,
        paddingLeft = 10,
        primaryAxisAlignItems = "MIN",
        counterAxisAlignItems = "MIN",
        layoutSizingHorizontal = "FIXED",
        layoutSizingVertical = "FIXED",
        itemSpacing = 0
      } = params || {};
      const frame = figma.createFrame();
      frame.x = x;
      frame.y = y;
      frame.resize(width, height);
      frame.name = name;
      if (layoutMode !== "NONE") {
        frame.layoutMode = layoutMode;
        frame.layoutWrap = layoutWrap;
        frame.paddingTop = paddingTop;
        frame.paddingRight = paddingRight;
        frame.paddingBottom = paddingBottom;
        frame.paddingLeft = paddingLeft;
        frame.primaryAxisAlignItems = primaryAxisAlignItems;
        frame.counterAxisAlignItems = counterAxisAlignItems;
        frame.layoutSizingHorizontal = layoutSizingHorizontal;
        frame.layoutSizingVertical = layoutSizingVertical;
        frame.itemSpacing = itemSpacing;
      }
      if (fillColor) {
        frame.fills = [createSolidPaint(fillColor)];
      }
      if (strokeColor) {
        frame.strokes = [createSolidPaint(strokeColor)];
      }
      if (strokeWeight !== void 0) {
        frame.strokeWeight = strokeWeight;
      }
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(frame);
      } else {
        figma.currentPage.appendChild(frame);
      }
      return {
        id: frame.id,
        name: frame.name,
        x: frame.x,
        y: frame.y,
        width: frame.width,
        height: frame.height,
        fills: frame.fills,
        strokes: frame.strokes,
        strokeWeight: typeof frame.strokeWeight === "number" ? frame.strokeWeight : 0,
        layoutMode: frame.layoutMode,
        layoutWrap: frame.layoutWrap,
        parentId: frame.parent ? frame.parent.id : void 0
      };
    });
  }
  function createText(params) {
    return __async(this, null, function* () {
      const {
        x = 0,
        y = 0,
        width,
        text = "Text",
        fontSize = 14,
        fontWeight = 400,
        fontColor = { r: 0, g: 0, b: 0, a: 1 },
        textAlignHorizontal = "LEFT",
        name = "",
        parentId
      } = params || {};
      const textNode = figma.createText();
      textNode.x = x;
      textNode.y = y;
      textNode.name = name || text;
      try {
        yield figma.loadFontAsync({
          family: "Inter",
          style: getFontStyle(fontWeight)
        });
        textNode.fontName = { family: "Inter", style: getFontStyle(fontWeight) };
        textNode.fontSize = fontSize;
      } catch (error) {
        console.error("Error setting font size", error);
      }
      yield setCharacters(textNode, text);
      textNode.fills = [createSolidPaint(fontColor)];
      if (width !== void 0) {
        textNode.textAutoResize = "HEIGHT";
        textNode.resize(width, textNode.height);
      }
      textNode.textAlignHorizontal = textAlignHorizontal;
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(textNode);
      } else {
        figma.currentPage.appendChild(textNode);
      }
      return {
        id: textNode.id,
        name: textNode.name,
        x: textNode.x,
        y: textNode.y,
        width: textNode.width,
        height: textNode.height,
        characters: textNode.characters,
        fontSize: textNode.fontSize,
        fontWeight,
        fontColor,
        fontName: textNode.fontName,
        fills: textNode.fills,
        parentId: textNode.parent ? textNode.parent.id : void 0
      };
    });
  }
  function moveNode(params) {
    return __async(this, null, function* () {
      const { nodeId, x, y } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (x === void 0 || y === void 0) {
        throw new Error("Missing x or y parameters");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("x" in node) || !("y" in node)) {
        throw new Error(`Node does not support position: ${nodeId}`);
      }
      const sceneNode = node;
      sceneNode.x = x;
      sceneNode.y = y;
      return {
        id: node.id,
        name: node.name,
        x: sceneNode.x,
        y: sceneNode.y
      };
    });
  }
  function resizeNode(params) {
    return __async(this, null, function* () {
      const { nodeId, width, height } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (width === void 0 || height === void 0) {
        throw new Error("Missing width or height parameters");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("resize" in node)) {
        throw new Error(`Node does not support resizing: ${nodeId}`);
      }
      const resizableNode = node;
      resizableNode.resize(width, height);
      return {
        id: node.id,
        name: node.name,
        width: resizableNode.width,
        height: resizableNode.height
      };
    });
  }
  function deleteNode(params) {
    return __async(this, null, function* () {
      const { nodeId } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      const nodeInfo = {
        id: node.id,
        name: node.name,
        type: node.type
      };
      node.remove();
      return nodeInfo;
    });
  }
  function cloneNode(params) {
    return __async(this, null, function* () {
      const { nodeId, x, y } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      const clone = node.clone();
      if (x !== void 0 && y !== void 0) {
        if (!("x" in clone) || !("y" in clone)) {
          throw new Error(`Cloned node does not support position: ${nodeId}`);
        }
        const positionedClone = clone;
        positionedClone.x = x;
        positionedClone.y = y;
      }
      if (node.parent && "appendChild" in node.parent) {
        node.parent.appendChild(clone);
      } else {
        figma.currentPage.appendChild(clone);
      }
      return {
        id: clone.id,
        name: clone.name,
        x: "x" in clone ? clone.x : void 0,
        y: "y" in clone ? clone.y : void 0,
        width: "width" in clone ? clone.width : void 0,
        height: "height" in clone ? clone.height : void 0
      };
    });
  }
  function createEllipse(params) {
    return __async(this, null, function* () {
      const {
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        name = "Ellipse",
        parentId,
        fillColor
      } = params || {};
      const ellipse = figma.createEllipse();
      ellipse.x = x;
      ellipse.y = y;
      ellipse.resize(width, height);
      ellipse.name = name;
      if (fillColor) {
        ellipse.fills = [createSolidPaint(fillColor)];
      }
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(ellipse);
      } else {
        figma.currentPage.appendChild(ellipse);
      }
      return {
        id: ellipse.id,
        name: ellipse.name,
        x: ellipse.x,
        y: ellipse.y,
        width: ellipse.width,
        height: ellipse.height,
        parentId: ellipse.parent ? ellipse.parent.id : void 0
      };
    });
  }
  function createLine(params) {
    return __async(this, null, function* () {
      const {
        startX = 0,
        startY = 0,
        endX = 100,
        endY = 0,
        name = "Line",
        parentId,
        strokeColor = { r: 0, g: 0, b: 0, a: 1 },
        strokeWeight = 1
      } = params || {};
      const line = figma.createLine();
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
      line.x = startX;
      line.y = startY;
      line.resize(length, 0);
      line.rotation = rotation;
      line.name = name;
      line.strokes = [createSolidPaint(strokeColor)];
      line.strokeWeight = strokeWeight;
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(line);
      } else {
        figma.currentPage.appendChild(line);
      }
      return {
        id: line.id,
        name: line.name,
        x: line.x,
        y: line.y,
        width: line.width,
        height: line.height,
        rotation: line.rotation,
        parentId: line.parent ? line.parent.id : void 0
      };
    });
  }
  function createPolygon(params) {
    return __async(this, null, function* () {
      const {
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        pointCount = 3,
        name = "Polygon",
        parentId,
        fillColor
      } = params || {};
      const polygon = figma.createPolygon();
      polygon.x = x;
      polygon.y = y;
      polygon.resize(width, height);
      polygon.pointCount = Math.max(3, Math.min(100, pointCount));
      polygon.name = name;
      if (fillColor) {
        polygon.fills = [createSolidPaint(fillColor)];
      }
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(polygon);
      } else {
        figma.currentPage.appendChild(polygon);
      }
      return {
        id: polygon.id,
        name: polygon.name,
        x: polygon.x,
        y: polygon.y,
        width: polygon.width,
        height: polygon.height,
        pointCount: polygon.pointCount,
        parentId: polygon.parent ? polygon.parent.id : void 0
      };
    });
  }
  function createVector(params) {
    return __async(this, null, function* () {
      const {
        vectorPaths,
        x = 0,
        y = 0,
        name = "Vector",
        parentId,
        fillColor,
        strokeColor,
        strokeWeight
      } = params;
      if (!vectorPaths || !Array.isArray(vectorPaths) || vectorPaths.length === 0) {
        throw new Error("vectorPaths must be a non-empty array");
      }
      const vector = figma.createVector();
      vector.x = x;
      vector.y = y;
      vector.name = name;
      vector.vectorPaths = vectorPaths.map((path) => ({
        windingRule: path.windingRule,
        data: path.data
      }));
      if (fillColor) {
        vector.fills = [createSolidPaint(fillColor)];
      }
      if (strokeColor) {
        vector.strokes = [createSolidPaint(strokeColor)];
      }
      if (strokeWeight !== void 0) {
        vector.strokeWeight = strokeWeight;
      }
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(vector);
      } else {
        figma.currentPage.appendChild(vector);
      }
      return {
        id: vector.id,
        name: vector.name,
        x: vector.x,
        y: vector.y,
        width: vector.width,
        height: vector.height,
        parentId: vector.parent ? vector.parent.id : void 0
      };
    });
  }
  function createSvg(params) {
    return __async(this, null, function* () {
      var _a;
      const {
        svg,
        x = 0,
        y = 0,
        width,
        height,
        name = "SVG",
        parentId,
        fillColor,
        strokeColor,
        strokeWeight,
        windingRule = "EVENODD"
      } = params;
      if (!svg || typeof svg !== "string") {
        throw new Error("svg parameter is required and must be a string");
      }
      const isSvgContent = svg.trim().startsWith("<");
      let pathsData;
      let originalSize = { width: 24, height: 24 };
      let detectedStyle = "stroke";
      let detectedStrokeWeight = null;
      if (isSvgContent) {
        pathsData = parseSvgPaths(svg);
        const viewBox = parseSvgViewBox(svg);
        if (viewBox) {
          originalSize = viewBox;
        }
        detectedStyle = detectSvgStyle(svg);
        detectedStrokeWeight = extractStrokeWidth(svg);
      } else {
        pathsData = [svg];
      }
      if (pathsData.length === 0) {
        throw new Error("No valid path data found in SVG");
      }
      const vector = figma.createVector();
      vector.name = name;
      const allVertices = [];
      const allSegments = [];
      const allLoops = [];
      for (const pathData of pathsData) {
        const network = svgPathToVectorNetwork(pathData, windingRule);
        const vertexOffset = allVertices.length;
        const segmentOffset = allSegments.length;
        allVertices.push(...network.vertices);
        for (const seg of network.segments) {
          allSegments.push({
            start: seg.start + vertexOffset,
            end: seg.end + vertexOffset,
            tangentStart: seg.tangentStart,
            tangentEnd: seg.tangentEnd
          });
        }
        for (const region of network.regions) {
          for (const loop of region.loops) {
            allLoops.push(loop.map((idx) => idx + segmentOffset));
          }
        }
      }
      yield vector.setVectorNetworkAsync({
        vertices: allVertices,
        segments: allSegments,
        regions: allLoops.length > 0 ? [{ windingRule, loops: allLoops }] : void 0
      });
      const finalStrokeWeight = (_a = strokeWeight != null ? strokeWeight : detectedStrokeWeight) != null ? _a : 1.5;
      if (detectedStyle === "fill" || detectedStyle === "both") {
        if (fillColor) {
          vector.fills = [createSolidPaint(fillColor)];
        } else if (!strokeColor && detectedStyle === "fill") {
          vector.fills = [createSolidPaint({ r: 0, g: 0, b: 0, a: 1 })];
        }
      }
      if (detectedStyle === "stroke" || detectedStyle === "both" || strokeColor) {
        if (strokeColor) {
          vector.strokes = [createSolidPaint(strokeColor)];
        } else if (detectedStyle === "stroke") {
          vector.strokes = [createSolidPaint({ r: 0, g: 0, b: 0, a: 1 })];
        }
        vector.strokeWeight = finalStrokeWeight;
        vector.strokeCap = "ROUND";
        vector.strokeJoin = "ROUND";
        if (detectedStyle === "stroke" && !fillColor) {
          vector.fills = [];
        }
      }
      const targetWidth = width != null ? width : originalSize.width;
      const targetHeight = height != null ? height : originalSize.height;
      if (vector.width > 0 && vector.height > 0) {
        vector.resize(targetWidth, targetHeight);
      }
      vector.x = x;
      vector.y = y;
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent does not support children: ${parentId}`);
        }
        parentNode.appendChild(vector);
      } else {
        figma.currentPage.appendChild(vector);
      }
      return {
        id: vector.id,
        name: vector.name,
        x: vector.x,
        y: vector.y,
        width: vector.width,
        height: vector.height,
        parentId: vector.parent ? vector.parent.id : void 0
      };
    });
  }
  var init_creation = __esm({
    "src/commands/creation.ts"() {
      "use strict";
      init_colors();
      init_fonts();
      init_svg();
    }
  });

  // src/commands/styling.ts
  function setFillColor(params) {
    return __async(this, null, function* () {
      const { nodeId, color: rgbColor } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("fills" in node)) {
        throw new Error(`Node does not support fills: ${nodeId}`);
      }
      const paintStyle = {
        type: "SOLID",
        color: {
          r: parseFloat(String(rgbColor.r)),
          g: parseFloat(String(rgbColor.g)),
          b: parseFloat(String(rgbColor.b))
        },
        opacity: rgbColor.a !== void 0 ? parseFloat(String(rgbColor.a)) : 1
      };
      node.fills = [paintStyle];
      return {
        id: node.id,
        name: node.name,
        fills: [paintStyle]
      };
    });
  }
  function setStrokeColor(params) {
    return __async(this, null, function* () {
      const { nodeId, color, weight = 1 } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("strokes" in node)) {
        throw new Error(`Node does not support strokes: ${nodeId}`);
      }
      const rgbColor = {
        r: color.r !== void 0 ? color.r : 0,
        g: color.g !== void 0 ? color.g : 0,
        b: color.b !== void 0 ? color.b : 0,
        a: color.a !== void 0 ? color.a : 1
      };
      const paintStyle = {
        type: "SOLID",
        color: {
          r: rgbColor.r,
          g: rgbColor.g,
          b: rgbColor.b
        },
        opacity: rgbColor.a
      };
      node.strokes = [paintStyle];
      if ("strokeWeight" in node) {
        node.strokeWeight = weight;
      }
      return {
        id: node.id,
        name: node.name,
        strokes: node.strokes,
        strokeWeight: "strokeWeight" in node ? node.strokeWeight : void 0
      };
    });
  }
  function setCornerRadius(params) {
    return __async(this, null, function* () {
      const { nodeId, radius, corners } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (radius === void 0) {
        throw new Error("Missing radius parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("cornerRadius" in node)) {
        throw new Error(`Node does not support corner radius: ${nodeId}`);
      }
      const rectNode = node;
      if (corners && Array.isArray(corners) && corners.length === 4) {
        if ("topLeftRadius" in node) {
          if (corners[0])
            rectNode.topLeftRadius = radius;
          if (corners[1])
            rectNode.topRightRadius = radius;
          if (corners[2])
            rectNode.bottomRightRadius = radius;
          if (corners[3])
            rectNode.bottomLeftRadius = radius;
        } else {
          rectNode.cornerRadius = radius;
        }
      } else {
        rectNode.cornerRadius = radius;
      }
      return {
        id: node.id,
        name: node.name,
        cornerRadius: rectNode.cornerRadius,
        topLeftRadius: "topLeftRadius" in rectNode ? rectNode.topLeftRadius : void 0,
        topRightRadius: "topRightRadius" in rectNode ? rectNode.topRightRadius : void 0,
        bottomRightRadius: "bottomRightRadius" in rectNode ? rectNode.bottomRightRadius : void 0,
        bottomLeftRadius: "bottomLeftRadius" in rectNode ? rectNode.bottomLeftRadius : void 0
      };
    });
  }
  function setOpacity(params) {
    return __async(this, null, function* () {
      const { nodeId, opacity } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (opacity === void 0 || opacity < 0 || opacity > 1) {
        throw new Error("opacity must be a number between 0 and 1");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("opacity" in node)) {
        throw new Error(`Node does not support opacity: ${nodeId}`);
      }
      const blendNode = node;
      blendNode.opacity = opacity;
      return {
        id: node.id,
        name: node.name,
        opacity: blendNode.opacity
      };
    });
  }
  function setEffects(params) {
    return __async(this, null, function* () {
      const { nodeId, effects } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (!effects || !Array.isArray(effects)) {
        throw new Error("effects must be an array");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("effects" in node)) {
        throw new Error(`Node does not support effects: ${nodeId}`);
      }
      const figmaEffects = effects.map((effect) => {
        var _a, _b, _c;
        if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
          const shadowEffect = {
            type: effect.type,
            visible: effect.visible !== false,
            radius: effect.radius,
            color: effect.color ? { r: effect.color.r, g: effect.color.g, b: effect.color.b, a: (_a = effect.color.a) != null ? _a : 1 } : { r: 0, g: 0, b: 0, a: 0.25 },
            offset: (_b = effect.offset) != null ? _b : { x: 0, y: 4 },
            spread: (_c = effect.spread) != null ? _c : 0,
            blendMode: "NORMAL"
          };
          return shadowEffect;
        } else {
          const blurEffect = {
            type: effect.type,
            visible: effect.visible !== false,
            radius: effect.radius
          };
          return blurEffect;
        }
      });
      const blendNode = node;
      blendNode.effects = figmaEffects;
      return {
        id: node.id,
        name: node.name,
        effects: blendNode.effects
      };
    });
  }
  function setGradientFill(params) {
    return __async(this, null, function* () {
      const { nodeId, gradientType, stops, angle = 0 } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (!stops || !Array.isArray(stops) || stops.length < 2) {
        throw new Error("stops must be an array with at least 2 color stops");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("fills" in node)) {
        throw new Error(`Node does not support fills: ${nodeId}`);
      }
      const radians = angle * Math.PI / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const gradientPaint = {
        type: gradientType,
        gradientTransform: [
          [cos, sin, 0.5 - 0.5 * cos - 0.5 * sin],
          [-sin, cos, 0.5 + 0.5 * sin - 0.5 * cos]
        ],
        gradientStops: stops.map((stop) => {
          var _a;
          return {
            position: stop.position,
            color: {
              r: stop.color.r,
              g: stop.color.g,
              b: stop.color.b,
              a: (_a = stop.color.a) != null ? _a : 1
            }
          };
        })
      };
      const geometryNode = node;
      geometryNode.fills = [gradientPaint];
      return {
        id: node.id,
        name: node.name,
        fills: geometryNode.fills
      };
    });
  }
  function setBlendMode(params) {
    return __async(this, null, function* () {
      const { nodeId, blendMode } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (!blendMode) {
        throw new Error("Missing blendMode parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("blendMode" in node)) {
        throw new Error(`Node does not support blend mode: ${nodeId}`);
      }
      const blendNode = node;
      blendNode.blendMode = blendMode;
      return {
        id: node.id,
        name: node.name,
        blendMode: blendNode.blendMode
      };
    });
  }
  function setStrokeStyle(params) {
    return __async(this, null, function* () {
      const { nodeId, strokeAlign, strokeCap, strokeJoin, dashPattern } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("strokes" in node)) {
        throw new Error(`Node does not support strokes: ${nodeId}`);
      }
      const geometryNode = node;
      if (strokeAlign !== void 0 && "strokeAlign" in geometryNode) {
        geometryNode.strokeAlign = strokeAlign;
      }
      if (strokeCap !== void 0 && "strokeCap" in geometryNode) {
        geometryNode.strokeCap = strokeCap;
      }
      if (strokeJoin !== void 0 && "strokeJoin" in geometryNode) {
        geometryNode.strokeJoin = strokeJoin;
      }
      if (dashPattern !== void 0 && "dashPattern" in geometryNode) {
        geometryNode.dashPattern = dashPattern;
      }
      return {
        id: node.id,
        name: node.name,
        strokeAlign: "strokeAlign" in geometryNode ? geometryNode.strokeAlign : void 0,
        strokeCap: "strokeCap" in geometryNode ? geometryNode.strokeCap : void 0,
        strokeJoin: "strokeJoin" in geometryNode ? geometryNode.strokeJoin : void 0,
        dashPattern: "dashPattern" in geometryNode ? geometryNode.dashPattern : void 0
      };
    });
  }
  var init_styling = __esm({
    "src/commands/styling.ts"() {
      "use strict";
    }
  });

  // src/commands/layout.ts
  function isAutoLayoutFrame(node) {
    return node.type === "FRAME" || node.type === "COMPONENT" || node.type === "COMPONENT_SET" || node.type === "INSTANCE";
  }
  function setLayoutMode(params) {
    return __async(this, null, function* () {
      const { nodeId, layoutMode = "NONE", layoutWrap = "NO_WRAP" } = params;
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }
      if (!isAutoLayoutFrame(node)) {
        throw new Error(`Node type ${node.type} does not support layoutMode`);
      }
      node.layoutMode = layoutMode;
      if (layoutMode !== "NONE") {
        node.layoutWrap = layoutWrap;
      }
      return {
        id: node.id,
        name: node.name,
        layoutMode: node.layoutMode,
        layoutWrap: node.layoutWrap
      };
    });
  }
  function setPadding(params) {
    return __async(this, null, function* () {
      const { nodeId, paddingTop, paddingRight, paddingBottom, paddingLeft } = params;
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }
      if (!isAutoLayoutFrame(node)) {
        throw new Error(`Node type ${node.type} does not support padding`);
      }
      if (node.layoutMode === "NONE") {
        throw new Error("Padding can only be set on auto-layout frames");
      }
      if (paddingTop !== void 0)
        node.paddingTop = paddingTop;
      if (paddingRight !== void 0)
        node.paddingRight = paddingRight;
      if (paddingBottom !== void 0)
        node.paddingBottom = paddingBottom;
      if (paddingLeft !== void 0)
        node.paddingLeft = paddingLeft;
      return {
        id: node.id,
        name: node.name,
        paddingTop: node.paddingTop,
        paddingRight: node.paddingRight,
        paddingBottom: node.paddingBottom,
        paddingLeft: node.paddingLeft
      };
    });
  }
  function setAxisAlign(params) {
    return __async(this, null, function* () {
      const { nodeId, primaryAxisAlignItems, counterAxisAlignItems } = params;
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }
      if (!isAutoLayoutFrame(node)) {
        throw new Error(`Node type ${node.type} does not support axis alignment`);
      }
      if (node.layoutMode === "NONE") {
        throw new Error("Axis alignment can only be set on auto-layout frames");
      }
      if (primaryAxisAlignItems !== void 0) {
        if (!["MIN", "MAX", "CENTER", "SPACE_BETWEEN"].includes(primaryAxisAlignItems)) {
          throw new Error("Invalid primaryAxisAlignItems value");
        }
        node.primaryAxisAlignItems = primaryAxisAlignItems;
      }
      if (counterAxisAlignItems !== void 0) {
        if (!["MIN", "MAX", "CENTER", "BASELINE"].includes(counterAxisAlignItems)) {
          throw new Error("Invalid counterAxisAlignItems value");
        }
        if (counterAxisAlignItems === "BASELINE" && node.layoutMode !== "HORIZONTAL") {
          throw new Error("BASELINE alignment is only valid for horizontal auto-layout frames");
        }
        node.counterAxisAlignItems = counterAxisAlignItems;
      }
      return {
        id: node.id,
        name: node.name,
        primaryAxisAlignItems: node.primaryAxisAlignItems,
        counterAxisAlignItems: node.counterAxisAlignItems,
        layoutMode: node.layoutMode
      };
    });
  }
  function setLayoutSizing(params) {
    return __async(this, null, function* () {
      const { nodeId, layoutSizingHorizontal, layoutSizingVertical } = params;
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }
      if (!isAutoLayoutFrame(node)) {
        throw new Error(`Node type ${node.type} does not support layout sizing`);
      }
      if (node.layoutMode === "NONE") {
        throw new Error("Layout sizing can only be set on auto-layout frames");
      }
      if (layoutSizingHorizontal !== void 0) {
        if (!["FIXED", "HUG", "FILL"].includes(layoutSizingHorizontal)) {
          throw new Error("Invalid layoutSizingHorizontal value");
        }
        node.layoutSizingHorizontal = layoutSizingHorizontal;
      }
      if (layoutSizingVertical !== void 0) {
        if (!["FIXED", "HUG", "FILL"].includes(layoutSizingVertical)) {
          throw new Error("Invalid layoutSizingVertical value");
        }
        node.layoutSizingVertical = layoutSizingVertical;
      }
      return {
        id: node.id,
        name: node.name,
        layoutSizingHorizontal: node.layoutSizingHorizontal,
        layoutSizingVertical: node.layoutSizingVertical,
        layoutMode: node.layoutMode
      };
    });
  }
  function setItemSpacing(params) {
    return __async(this, null, function* () {
      const { nodeId, itemSpacing, counterAxisSpacing } = params;
      if (itemSpacing === void 0 && counterAxisSpacing === void 0) {
        throw new Error("At least one of itemSpacing or counterAxisSpacing must be provided");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }
      if (!isAutoLayoutFrame(node)) {
        throw new Error(`Node type ${node.type} does not support item spacing`);
      }
      if (node.layoutMode === "NONE") {
        throw new Error("Item spacing can only be set on auto-layout frames");
      }
      if (itemSpacing !== void 0) {
        node.itemSpacing = itemSpacing;
      }
      if (counterAxisSpacing !== void 0) {
        if (node.layoutWrap !== "WRAP") {
          throw new Error("Counter axis spacing can only be set on frames with layoutWrap set to WRAP");
        }
        node.counterAxisSpacing = counterAxisSpacing;
      }
      return {
        id: node.id,
        name: node.name,
        itemSpacing: node.itemSpacing,
        counterAxisSpacing: node.counterAxisSpacing,
        layoutMode: node.layoutMode,
        layoutWrap: node.layoutWrap
      };
    });
  }
  var init_layout = __esm({
    "src/commands/layout.ts"() {
      "use strict";
    }
  });

  // src/helpers/progress.ts
  function generateCommandId() {
    return "cmd_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  function sendProgressUpdate(commandId, commandType, status, progress, totalItems, processedItems, message, payload = null) {
    const update = {
      type: "command_progress",
      commandId,
      commandType,
      status,
      progress,
      totalItems,
      processedItems,
      message,
      timestamp: Date.now()
    };
    if (payload) {
      if (payload.currentChunk !== void 0 && payload.totalChunks !== void 0) {
        update.currentChunk = payload.currentChunk;
        update.totalChunks = payload.totalChunks;
        update.chunkSize = payload.chunkSize;
      }
      update.payload = payload;
    }
    figma.ui.postMessage(update);
    console.log(`Progress update: ${status} - ${progress}% - ${message}`);
    return update;
  }
  function delay2(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  var init_progress = __esm({
    "src/helpers/progress.ts"() {
      "use strict";
    }
  });

  // src/commands/text.ts
  function processTextNode(node, parentPath, depth) {
    return __async(this, null, function* () {
      if (node.type !== "TEXT")
        return null;
      try {
        let fontFamily = "";
        let fontStyle = "";
        if (node.fontName && typeof node.fontName === "object") {
          if ("family" in node.fontName)
            fontFamily = node.fontName.family;
          if ("style" in node.fontName)
            fontStyle = node.fontName.style;
        }
        const safeTextNode = {
          id: node.id,
          name: node.name || "Text",
          type: node.type,
          characters: node.characters,
          fontSize: typeof node.fontSize === "number" ? node.fontSize : 0,
          fontFamily,
          fontStyle,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          path: parentPath.join(" > "),
          depth
        };
        yield highlightNodeWithFill(node, 100);
        return safeTextNode;
      } catch (nodeErr) {
        console.error("Error processing text node:", nodeErr);
        return null;
      }
    });
  }
  function findTextNodes(_0) {
    return __async(this, arguments, function* (node, parentPath = [], depth = 0, textNodes = []) {
      if (node.visible === false)
        return;
      const nodePath = [...parentPath, node.name || `Unnamed ${node.type}`];
      if (node.type === "TEXT") {
        const result = yield processTextNode(node, nodePath, depth);
        if (result)
          textNodes.push(result);
      }
      if ("children" in node) {
        for (const child of node.children) {
          yield findTextNodes(child, nodePath, depth + 1, textNodes);
        }
      }
    });
  }
  function scanTextNodes(params) {
    return __async(this, null, function* () {
      const {
        nodeId,
        useChunking = true,
        chunkSize = 10,
        commandId = generateCommandId()
      } = params;
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }
      if (!useChunking) {
        const textNodes = [];
        sendProgressUpdate(commandId, "scan_text_nodes", "started", 0, 1, 0, "Starting scan");
        yield findTextNodes(node, [], 0, textNodes);
        sendProgressUpdate(commandId, "scan_text_nodes", "completed", 100, textNodes.length, textNodes.length, "Scan complete");
        return { success: true, count: textNodes.length, textNodes, commandId };
      }
      const nodesToProcess = [];
      sendProgressUpdate(commandId, "scan_text_nodes", "started", 0, 0, 0, "Starting chunked scan");
      yield collectNodesToProcess(node, [], 0, nodesToProcess);
      const totalNodes = nodesToProcess.length;
      const totalChunks = Math.ceil(totalNodes / chunkSize);
      const allTextNodes = [];
      let processedNodes = 0;
      for (let i = 0; i < totalNodes; i += chunkSize) {
        const chunkEnd = Math.min(i + chunkSize, totalNodes);
        const chunkNodes = nodesToProcess.slice(i, chunkEnd);
        for (const nodeInfo of chunkNodes) {
          if (nodeInfo.node.type === "TEXT") {
            const result = yield processTextNode(nodeInfo.node, nodeInfo.parentPath, nodeInfo.depth);
            if (result)
              allTextNodes.push(result);
          }
          yield delay2(5);
        }
        processedNodes += chunkNodes.length;
        sendProgressUpdate(commandId, "scan_text_nodes", "in_progress", Math.round(processedNodes / totalNodes * 100), totalNodes, processedNodes, `Processed ${processedNodes}/${totalNodes}`);
      }
      sendProgressUpdate(commandId, "scan_text_nodes", "completed", 100, totalNodes, processedNodes, `Found ${allTextNodes.length} text nodes`);
      return {
        success: true,
        totalNodes: allTextNodes.length,
        processedNodes,
        chunks: totalChunks,
        textNodes: allTextNodes,
        commandId
      };
    });
  }
  function setTextContent(params) {
    return __async(this, null, function* () {
      const { nodeId, text } = params;
      if (!nodeId)
        throw new Error("Missing nodeId parameter");
      if (text === void 0)
        throw new Error("Missing text parameter");
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node)
        throw new Error(`Node not found with ID: ${nodeId}`);
      if (node.type !== "TEXT")
        throw new Error(`Node is not a text node: ${nodeId}`);
      const textNode = node;
      yield figma.loadFontAsync(textNode.fontName);
      yield setCharacters(textNode, text);
      return {
        id: textNode.id,
        name: textNode.name,
        characters: textNode.characters,
        fontName: textNode.fontName
      };
    });
  }
  function setMultipleTextContents(params) {
    return __async(this, null, function* () {
      const { nodeId, text, commandId = generateCommandId() } = params;
      if (!nodeId || !text || !Array.isArray(text)) {
        throw new Error("Missing required parameters");
      }
      sendProgressUpdate(commandId, "set_multiple_text_contents", "started", 0, text.length, 0, "Starting text replacement");
      const results = [];
      let successCount = 0;
      let failureCount = 0;
      const CHUNK_SIZE = 5;
      for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        const chunk = text.slice(i, i + CHUNK_SIZE);
        const chunkPromises = chunk.map((replacement) => __async(this, null, function* () {
          if (!replacement.nodeId || replacement.text === void 0) {
            return { success: false, nodeId: replacement.nodeId || "unknown", error: "Missing parameters" };
          }
          try {
            const textNode = yield figma.getNodeByIdAsync(replacement.nodeId);
            if (!textNode || textNode.type !== "TEXT") {
              return { success: false, nodeId: replacement.nodeId, error: "Node not found or not a text node" };
            }
            const originalText = textNode.characters;
            yield setTextContent({ nodeId: replacement.nodeId, text: replacement.text });
            return { success: true, nodeId: replacement.nodeId, originalText, translatedText: replacement.text };
          } catch (error) {
            return { success: false, nodeId: replacement.nodeId, error: error.message };
          }
        }));
        const chunkResults = yield Promise.all(chunkPromises);
        chunkResults.forEach((result) => {
          if (result.success)
            successCount++;
          else
            failureCount++;
          results.push(result);
        });
        sendProgressUpdate(commandId, "set_multiple_text_contents", "in_progress", Math.round((i + chunk.length) / text.length * 100), text.length, successCount + failureCount, `Processed ${successCount + failureCount}/${text.length}`);
        if (i + CHUNK_SIZE < text.length)
          yield delay2(1e3);
      }
      sendProgressUpdate(commandId, "set_multiple_text_contents", "completed", 100, text.length, successCount + failureCount, `Complete: ${successCount} successful, ${failureCount} failed`);
      return {
        success: successCount > 0,
        nodeId,
        replacementsApplied: successCount,
        replacementsFailed: failureCount,
        totalReplacements: text.length,
        results,
        commandId
      };
    });
  }
  function setFontFamily(params) {
    return __async(this, null, function* () {
      const { nodeId, fontFamily, fontStyle = "Regular" } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (!fontFamily) {
        throw new Error("Missing fontFamily parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "TEXT") {
        throw new Error(`Node is not a TEXT node: ${nodeId}`);
      }
      const textNode = node;
      try {
        yield figma.loadFontAsync({ family: fontFamily, style: fontStyle });
        textNode.fontName = { family: fontFamily, style: fontStyle };
      } catch (error) {
        const err = error;
        throw new Error(`Failed to load font "${fontFamily}" with style "${fontStyle}": ${err.message}`);
      }
      return {
        id: textNode.id,
        name: textNode.name,
        fontName: textNode.fontName,
        characters: textNode.characters
      };
    });
  }
  function setFontSize(params) {
    return __async(this, null, function* () {
      const { nodeId, fontSize } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (fontSize === void 0 || fontSize <= 0) {
        throw new Error("fontSize must be a positive number");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "TEXT") {
        throw new Error(`Node is not a TEXT node: ${nodeId}`);
      }
      const textNode = node;
      const currentFont = textNode.fontName;
      if (currentFont !== figma.mixed) {
        yield figma.loadFontAsync(currentFont);
      } else {
        throw new Error("Cannot set font size on text with mixed fonts");
      }
      textNode.fontSize = fontSize;
      return {
        id: textNode.id,
        name: textNode.name,
        fontSize: textNode.fontSize,
        characters: textNode.characters
      };
    });
  }
  function setFontWeight(params) {
    return __async(this, null, function* () {
      const { nodeId, fontWeight } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (fontWeight === void 0 || fontWeight < 100 || fontWeight > 900) {
        throw new Error("fontWeight must be between 100 and 900");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "TEXT") {
        throw new Error(`Node is not a TEXT node: ${nodeId}`);
      }
      const textNode = node;
      const currentFont = textNode.fontName;
      if (currentFont === figma.mixed) {
        throw new Error("Cannot set font weight on text with mixed fonts");
      }
      const newFontStyle = getFontStyle(fontWeight);
      try {
        yield figma.loadFontAsync({ family: currentFont.family, style: newFontStyle });
        textNode.fontName = { family: currentFont.family, style: newFontStyle };
      } catch (error) {
        const err = error;
        throw new Error(`Failed to load font "${currentFont.family}" with weight ${fontWeight}: ${err.message}`);
      }
      return {
        id: textNode.id,
        name: textNode.name,
        fontName: textNode.fontName,
        fontWeight,
        characters: textNode.characters
      };
    });
  }
  function setTextAlignment(params) {
    return __async(this, null, function* () {
      const { nodeId, horizontalAlign, verticalAlign } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "TEXT") {
        throw new Error(`Node is not a TEXT node: ${nodeId}`);
      }
      const textNode = node;
      const currentFont = textNode.fontName;
      if (currentFont !== figma.mixed) {
        yield figma.loadFontAsync(currentFont);
      }
      if (horizontalAlign) {
        textNode.textAlignHorizontal = horizontalAlign;
      }
      if (verticalAlign) {
        textNode.textAlignVertical = verticalAlign;
      }
      return {
        id: textNode.id,
        name: textNode.name,
        textAlignHorizontal: textNode.textAlignHorizontal,
        textAlignVertical: textNode.textAlignVertical
      };
    });
  }
  function setLineHeight(params) {
    return __async(this, null, function* () {
      const { nodeId, lineHeight, unit = "PIXELS" } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (lineHeight === void 0) {
        throw new Error("Missing lineHeight parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "TEXT") {
        throw new Error(`Node is not a TEXT node: ${nodeId}`);
      }
      const textNode = node;
      const currentFont = textNode.fontName;
      if (currentFont !== figma.mixed) {
        yield figma.loadFontAsync(currentFont);
      }
      if (lineHeight === "AUTO") {
        textNode.lineHeight = { unit: "AUTO" };
      } else {
        textNode.lineHeight = { value: lineHeight, unit };
      }
      return {
        id: textNode.id,
        name: textNode.name,
        lineHeight: textNode.lineHeight
      };
    });
  }
  function setLetterSpacing(params) {
    return __async(this, null, function* () {
      const { nodeId, letterSpacing, unit = "PIXELS" } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (letterSpacing === void 0) {
        throw new Error("Missing letterSpacing parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "TEXT") {
        throw new Error(`Node is not a TEXT node: ${nodeId}`);
      }
      const textNode = node;
      const currentFont = textNode.fontName;
      if (currentFont !== figma.mixed) {
        yield figma.loadFontAsync(currentFont);
      }
      textNode.letterSpacing = { value: letterSpacing, unit };
      return {
        id: textNode.id,
        name: textNode.name,
        letterSpacing: textNode.letterSpacing
      };
    });
  }
  var init_text = __esm({
    "src/commands/text.ts"() {
      "use strict";
      init_progress();
      init_fonts();
      init_nodes();
    }
  });

  // src/commands/images.ts
  function setImageFill(params) {
    return __async(this, null, function* () {
      const { nodeId, imageUrl, imageBase64, scaleMode = "FILL" } = params;
      if (!nodeId)
        throw new Error("Missing nodeId parameter");
      if (!imageUrl && !imageBase64)
        throw new Error("Either imageUrl or imageBase64 must be provided");
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node)
        throw new Error(`Node not found with ID: ${nodeId}`);
      if (!("fills" in node))
        throw new Error(`Node does not support fills: ${nodeId}`);
      let image;
      if (imageUrl) {
        image = yield figma.createImageAsync(imageUrl);
      } else if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = figma.base64Decode(base64Data);
        image = figma.createImage(imageBytes);
      } else {
        throw new Error("No image data provided");
      }
      const imageFill = {
        type: "IMAGE",
        scaleMode,
        imageHash: image.hash
      };
      node.fills = [imageFill];
      return {
        id: node.id,
        name: node.name,
        imageHash: image.hash,
        scaleMode
      };
    });
  }
  function createImageRectangle(params) {
    return __async(this, null, function* () {
      var _a;
      const {
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        name = "Image",
        parentId,
        imageUrl,
        imageBase64,
        scaleMode = "FILL",
        cornerRadius = 0
      } = params;
      if (!imageUrl && !imageBase64)
        throw new Error("Either imageUrl or imageBase64 must be provided");
      const rect = figma.createRectangle();
      rect.x = x;
      rect.y = y;
      rect.resize(width, height);
      rect.name = name;
      if (cornerRadius > 0)
        rect.cornerRadius = cornerRadius;
      let image;
      if (imageUrl) {
        image = yield figma.createImageAsync(imageUrl);
      } else if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = figma.base64Decode(base64Data);
        image = figma.createImage(imageBytes);
      } else {
        throw new Error("No image data provided");
      }
      rect.fills = [
        {
          type: "IMAGE",
          scaleMode,
          imageHash: image.hash
        }
      ];
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode)
          throw new Error(`Parent node not found with ID: ${parentId}`);
        if (!("appendChild" in parentNode))
          throw new Error(`Parent node does not support children: ${parentId}`);
        parentNode.appendChild(rect);
      } else {
        figma.currentPage.appendChild(rect);
      }
      return {
        id: rect.id,
        name: rect.name,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        imageHash: image.hash,
        parentId: (_a = rect.parent) == null ? void 0 : _a.id
      };
    });
  }
  function exportNodeAsImage(params) {
    return __async(this, null, function* () {
      const { nodeId, scale = 1 } = params;
      const format = "PNG";
      if (!nodeId)
        throw new Error("Missing nodeId parameter");
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node)
        throw new Error(`Node not found with ID: ${nodeId}`);
      if (!("exportAsync" in node))
        throw new Error(`Node does not support exporting: ${nodeId}`);
      const settings = {
        format,
        constraint: { type: "SCALE", value: scale }
      };
      const bytes = yield node.exportAsync(settings);
      const base64 = customBase64Encode(bytes);
      return {
        nodeId,
        format,
        scale,
        mimeType: "image/png",
        imageData: base64
      };
    });
  }
  var init_images = __esm({
    "src/commands/images.ts"() {
      "use strict";
      init_nodes();
    }
  });

  // src/commands/components.ts
  function getStyles() {
    return __async(this, null, function* () {
      const styles = {
        colors: yield figma.getLocalPaintStylesAsync(),
        texts: yield figma.getLocalTextStylesAsync(),
        effects: yield figma.getLocalEffectStylesAsync(),
        grids: yield figma.getLocalGridStylesAsync()
      };
      return {
        colors: styles.colors.map((style) => ({
          id: style.id,
          name: style.name,
          key: style.key,
          paint: style.paints[0]
        })),
        texts: styles.texts.map((style) => ({
          id: style.id,
          name: style.name,
          key: style.key,
          fontSize: style.fontSize,
          fontName: style.fontName
        })),
        effects: styles.effects.map((style) => ({
          id: style.id,
          name: style.name,
          key: style.key
        })),
        grids: styles.grids.map((style) => ({
          id: style.id,
          name: style.name,
          key: style.key
        }))
      };
    });
  }
  function getLocalComponents() {
    return __async(this, null, function* () {
      yield figma.loadAllPagesAsync();
      const components = figma.root.findAllWithCriteria({
        types: ["COMPONENT"]
      });
      return {
        count: components.length,
        components: components.map((component) => ({
          id: component.id,
          name: component.name,
          key: "key" in component ? component.key : null
        }))
      };
    });
  }
  function createComponentInstance(params) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      const { componentKey, componentId, x = 0, y = 0, parentId } = params;
      if (!componentKey && !componentId) {
        throw new Error("Missing componentKey or componentId parameter");
      }
      let component;
      if (componentId) {
        const node = yield figma.getNodeByIdAsync(componentId);
        if (!node) {
          throw new Error(`Component not found with ID: ${componentId}`);
        }
        if (node.type !== "COMPONENT") {
          throw new Error(`Node is not a component: ${componentId}`);
        }
        component = node;
      } else if (componentKey) {
        try {
          component = yield figma.importComponentByKeyAsync(componentKey);
        } catch (error) {
          throw new Error(`Failed to import component with key "${componentKey}". Component must be published to a team library.`);
        }
      } else {
        throw new Error("Missing componentKey or componentId parameter");
      }
      const instance = component.createInstance();
      instance.x = x;
      instance.y = y;
      if (parentId) {
        const parentNode = yield figma.getNodeByIdAsync(parentId);
        if (!parentNode) {
          throw new Error(`Parent node not found with ID: ${parentId}`);
        }
        if (!("appendChild" in parentNode)) {
          throw new Error(`Parent node does not support children: ${parentId}`);
        }
        parentNode.appendChild(instance);
      } else {
        figma.currentPage.appendChild(instance);
      }
      return {
        id: instance.id,
        name: instance.name,
        x: instance.x,
        y: instance.y,
        width: instance.width,
        height: instance.height,
        componentId: ((_a = instance.mainComponent) == null ? void 0 : _a.id) || null,
        componentKey: ((_b = instance.mainComponent) == null ? void 0 : _b.key) || null,
        parentId: (_c = instance.parent) == null ? void 0 : _c.id
      };
    });
  }
  function createComponent(params) {
    return __async(this, null, function* () {
      const { nodeId, name } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
        throw new Error("Node is already a component");
      }
      if (node.type === "DOCUMENT" || node.type === "PAGE") {
        throw new Error("Cannot convert this node type to a component");
      }
      const component = figma.createComponentFromNode(node);
      if (name) {
        component.name = name;
      }
      return {
        id: component.id,
        name: component.name,
        key: component.key,
        type: component.type
      };
    });
  }
  function detachInstance(params) {
    return __async(this, null, function* () {
      const { nodeId } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "INSTANCE") {
        throw new Error(`Node is not an instance: ${nodeId}`);
      }
      const instanceNode = node;
      const detached = instanceNode.detachInstance();
      return {
        id: detached.id,
        name: detached.name,
        type: detached.type
      };
    });
  }
  var init_components = __esm({
    "src/commands/components.ts"() {
      "use strict";
    }
  });

  // src/commands/annotations.ts
  function isAnnotatable(node) {
    return "annotations" in node;
  }
  function getAnnotations(params) {
    return __async(this, null, function* () {
      const { nodeId, includeCategories = true } = params;
      let categoriesMap = {};
      if (includeCategories) {
        const categories = yield figma.annotations.getAnnotationCategoriesAsync();
        categoriesMap = categories.reduce((map, category) => {
          map[category.id] = {
            id: category.id,
            label: category.label,
            color: category.color,
            isPreset: category.isPreset
          };
          return map;
        }, {});
      }
      if (nodeId) {
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node)
          throw new Error(`Node not found: ${nodeId}`);
        if (!isAnnotatable(node))
          throw new Error(`Node type ${node.type} does not support annotations`);
        const mergedAnnotations = [];
        const collect = (n) => __async(this, null, function* () {
          if (isAnnotatable(n) && n.annotations && n.annotations.length > 0) {
            for (const a of n.annotations) {
              mergedAnnotations.push({ nodeId: n.id, annotation: a });
            }
          }
          if ("children" in n) {
            for (const child of n.children) {
              yield collect(child);
            }
          }
        });
        yield collect(node);
        return {
          nodeId: node.id,
          name: node.name,
          annotations: mergedAnnotations,
          categories: includeCategories ? Object.values(categoriesMap) : void 0
        };
      }
      const annotations = [];
      const processNode = (n) => __async(this, null, function* () {
        if (isAnnotatable(n) && n.annotations && n.annotations.length > 0) {
          annotations.push({ nodeId: n.id, name: n.name, annotations: n.annotations });
        }
        if ("children" in n) {
          for (const child of n.children) {
            yield processNode(child);
          }
        }
      });
      for (const child of figma.currentPage.children) {
        yield processNode(child);
      }
      return {
        annotatedNodes: annotations,
        categories: includeCategories ? Object.values(categoriesMap) : void 0
      };
    });
  }
  function setAnnotation(params) {
    return __async(this, null, function* () {
      const { nodeId, labelMarkdown, categoryId, properties } = params;
      if (!nodeId)
        return { success: false, error: "Missing nodeId" };
      if (!labelMarkdown)
        return { success: false, error: "Missing labelMarkdown" };
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node)
        return { success: false, error: `Node not found: ${nodeId}` };
      if (!isAnnotatable(node))
        return { success: false, error: `Node type ${node.type} does not support annotations` };
      const annotationProperties = properties && properties.length > 0 ? properties.map((p) => {
        return {
          type: "library-link",
          // Using a valid property type
          data: { name: p.name, value: p.value }
        };
      }) : void 0;
      const annotationData = {
        label: labelMarkdown
      };
      if (categoryId) {
        annotationData.categoryId = categoryId;
      }
      if (annotationProperties) {
        annotationData.properties = annotationProperties;
      }
      const newAnnotation = annotationData;
      node.annotations = [newAnnotation];
      return {
        success: true,
        nodeId: node.id,
        name: node.name,
        annotations: node.annotations
      };
    });
  }
  function setMultipleAnnotations(params) {
    return __async(this, null, function* () {
      const { annotations } = params;
      if (!annotations || annotations.length === 0) {
        return { success: false, error: "No annotations provided" };
      }
      const results = [];
      let successCount = 0;
      let failureCount = 0;
      for (const annotation of annotations) {
        const result = yield setAnnotation({
          nodeId: annotation.nodeId,
          labelMarkdown: annotation.labelMarkdown,
          categoryId: annotation.categoryId,
          properties: annotation.properties
        });
        if (result.success) {
          successCount++;
          results.push({ success: true, nodeId: annotation.nodeId });
        } else {
          failureCount++;
          results.push({ success: false, nodeId: annotation.nodeId, error: result.error });
        }
      }
      return {
        success: successCount > 0,
        annotationsApplied: successCount,
        annotationsFailed: failureCount,
        totalAnnotations: annotations.length,
        results
      };
    });
  }
  var init_annotations = __esm({
    "src/commands/annotations.ts"() {
      "use strict";
    }
  });

  // src/commands/instances.ts
  function copyNodeProperty(source, target, field) {
    switch (field) {
      case "fills":
        if ("fills" in source && "fills" in target) {
          target.fills = source.fills;
        }
        break;
      case "strokes":
        if ("strokes" in source && "strokes" in target) {
          target.strokes = source.strokes;
        }
        break;
      case "opacity":
        if ("opacity" in source && "opacity" in target) {
          target.opacity = source.opacity;
        }
        break;
      case "visible":
        if ("visible" in source && "visible" in target) {
          target.visible = source.visible;
        }
        break;
      case "cornerRadius":
        if ("cornerRadius" in source && "cornerRadius" in target) {
          target.cornerRadius = source.cornerRadius;
        }
        break;
      case "strokeWeight":
        if ("strokeWeight" in source && "strokeWeight" in target) {
          target.strokeWeight = source.strokeWeight;
        }
        break;
      default:
        console.log(`Skipping unknown override field: ${field}`);
    }
  }
  function getInstanceOverrides(instanceNode = null) {
    return __async(this, null, function* () {
      let sourceInstance = null;
      if (instanceNode) {
        if (instanceNode.type !== "INSTANCE") {
          figma.notify("Provided node is not a component instance");
          return { success: false, message: "Provided node is not a component instance" };
        }
        sourceInstance = instanceNode;
      } else {
        const selection = figma.currentPage.selection;
        if (selection.length === 0) {
          figma.notify("Please select at least one instance");
          return { success: false, message: "No nodes selected" };
        }
        const instances = selection.filter((node) => node.type === "INSTANCE");
        if (instances.length === 0) {
          figma.notify("Please select at least one component instance");
          return { success: false, message: "No instances found in selection" };
        }
        sourceInstance = instances[0];
      }
      const overrides = sourceInstance.overrides || [];
      const mainComponent = yield sourceInstance.getMainComponentAsync();
      if (!mainComponent) {
        figma.notify("Failed to get main component");
        return { success: false, message: "Failed to get main component" };
      }
      return {
        success: true,
        message: `Got component information from "${sourceInstance.name}"`,
        sourceInstanceId: sourceInstance.id,
        mainComponentId: mainComponent.id,
        overridesCount: overrides.length
      };
    });
  }
  function getValidTargetInstances(targetNodeIds) {
    return __async(this, null, function* () {
      const targetInstances = [];
      if (!Array.isArray(targetNodeIds) || targetNodeIds.length === 0) {
        return { success: false, message: "No instances provided", targetInstances: [] };
      }
      for (const targetNodeId of targetNodeIds) {
        const targetNode = yield figma.getNodeByIdAsync(targetNodeId);
        if (targetNode && targetNode.type === "INSTANCE") {
          targetInstances.push(targetNode);
        }
      }
      if (targetInstances.length === 0) {
        return { success: false, message: "No valid instances provided", targetInstances: [] };
      }
      return { success: true, message: "Valid target instances provided", targetInstances };
    });
  }
  function getSourceInstanceData(sourceInstanceId) {
    return __async(this, null, function* () {
      if (!sourceInstanceId) {
        return { success: false, message: "Missing source instance ID" };
      }
      const sourceInstance = yield figma.getNodeByIdAsync(sourceInstanceId);
      if (!sourceInstance) {
        return { success: false, message: "Source instance not found" };
      }
      if (sourceInstance.type !== "INSTANCE") {
        return { success: false, message: "Source node is not a component instance" };
      }
      const mainComponent = yield sourceInstance.getMainComponentAsync();
      if (!mainComponent) {
        return { success: false, message: "Failed to get main component from source instance" };
      }
      return {
        success: true,
        sourceInstance,
        mainComponent,
        overrides: sourceInstance.overrides || []
      };
    });
  }
  function setInstanceOverrides(params) {
    return __async(this, null, function* () {
      const { sourceInstanceId, targetNodeIds } = params;
      const targetResult = yield getValidTargetInstances(targetNodeIds);
      if (!targetResult.success)
        return targetResult;
      const sourceResult = yield getSourceInstanceData(sourceInstanceId);
      if (!sourceResult.success)
        return sourceResult;
      const { sourceInstance, mainComponent, overrides } = sourceResult;
      const { targetInstances } = targetResult;
      if (!sourceInstance || !mainComponent) {
        return { success: false, message: "Source instance or main component not available" };
      }
      const results = [];
      let totalAppliedCount = 0;
      for (const targetInstance of targetInstances) {
        try {
          targetInstance.swapComponent(mainComponent);
          let appliedCount = 0;
          const overridesList = overrides != null ? overrides : [];
          for (const override of overridesList) {
            if (!override.id || !override.overriddenFields || override.overriddenFields.length === 0) {
              continue;
            }
            const overrideNodeId = override.id.replace(sourceInstance.id, targetInstance.id);
            const overrideNode = yield figma.getNodeByIdAsync(overrideNodeId);
            if (!overrideNode)
              continue;
            const sourceNode = yield figma.getNodeByIdAsync(override.id);
            if (!sourceNode)
              continue;
            for (const field of override.overriddenFields) {
              try {
                if (field === "characters" && overrideNode.type === "TEXT" && sourceNode.type === "TEXT") {
                  const textOverrideNode = overrideNode;
                  const textSourceNode = sourceNode;
                  const fontName = textOverrideNode.fontName;
                  if (fontName !== figma.mixed) {
                    yield figma.loadFontAsync(fontName);
                  }
                  textOverrideNode.characters = textSourceNode.characters;
                  appliedCount++;
                } else if (field in overrideNode && field in sourceNode) {
                  copyNodeProperty(sourceNode, overrideNode, field);
                  appliedCount++;
                }
              } catch (fieldError) {
                console.error(`Error applying field ${field}:`, fieldError);
              }
            }
          }
          if (appliedCount > 0) {
            totalAppliedCount += appliedCount;
            results.push({ success: true, instanceId: targetInstance.id, instanceName: targetInstance.name, appliedCount });
          } else {
            results.push({ success: false, instanceId: targetInstance.id, instanceName: targetInstance.name, message: "No overrides applied" });
          }
        } catch (instanceError) {
          results.push({ success: false, instanceId: targetInstance.id, instanceName: targetInstance.name, message: instanceError.message });
        }
      }
      if (totalAppliedCount > 0) {
        const message = `Applied ${totalAppliedCount} overrides to ${results.filter((r) => r.success).length} instances`;
        figma.notify(message);
        return { success: true, message, totalCount: totalAppliedCount, results };
      }
      return { success: false, message: "No overrides applied to any instance", results };
    });
  }
  var init_instances = __esm({
    "src/commands/instances.ts"() {
      "use strict";
    }
  });

  // src/commands/connections.ts
  function getNodePath(node) {
    const path = [];
    let current = node;
    while (current && current.parent) {
      path.unshift(current.name);
      current = current.parent;
    }
    return path.join(" > ");
  }
  function highlightNodeWithAnimation(node) {
    return __async(this, null, function* () {
      if (!("strokes" in node) || !("strokeWeight" in node))
        return;
      const geometryNode = node;
      const originalStrokeWeight = geometryNode.strokeWeight;
      const originalStrokes = geometryNode.strokes ? [...geometryNode.strokes] : [];
      try {
        geometryNode.strokeWeight = 4;
        geometryNode.strokes = [
          {
            type: "SOLID",
            color: { r: 1, g: 0.5, b: 0 },
            // Orange color
            opacity: 0.8
          }
        ];
        setTimeout(() => {
          try {
            geometryNode.strokeWeight = originalStrokeWeight;
            geometryNode.strokes = originalStrokes;
          } catch (restoreError) {
            console.error(`Error restoring node stroke: ${restoreError.message}`);
          }
        }, 1500);
      } catch (highlightError) {
        console.error(`Error highlighting node: ${highlightError.message}`);
      }
    });
  }
  function findNodesWithReactions(_0) {
    return __async(this, arguments, function* (node, processedNodes = /* @__PURE__ */ new Set(), depth = 0, results = []) {
      if (processedNodes.has(node.id)) {
        return results;
      }
      processedNodes.add(node.id);
      let filteredReactions = [];
      if ("reactions" in node && node.reactions && node.reactions.length > 0) {
        filteredReactions = node.reactions.filter((r) => {
          if (r.action && "navigation" in r.action && r.action.navigation === "CHANGE_TO")
            return false;
          if (r.actions && Array.isArray(r.actions)) {
            return !r.actions.some((a) => "navigation" in a && a.navigation === "CHANGE_TO");
          }
          return true;
        });
      }
      const hasFilteredReactions = filteredReactions.length > 0;
      if (hasFilteredReactions) {
        results.push({
          id: node.id,
          name: node.name,
          type: node.type,
          depth,
          hasReactions: true,
          reactions: filteredReactions,
          path: getNodePath(node)
        });
        yield highlightNodeWithAnimation(node);
      }
      if ("children" in node) {
        for (const child of node.children) {
          yield findNodesWithReactions(child, processedNodes, depth + 1, results);
        }
      }
      return results;
    });
  }
  function getReactions(params) {
    return __async(this, null, function* () {
      const { nodeIds } = params;
      if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
        throw new Error("Missing or invalid nodeIds parameter");
      }
      const commandId = generateCommandId();
      sendProgressUpdate(
        commandId,
        "get_reactions",
        "started",
        0,
        nodeIds.length,
        0,
        `Starting deep search for reactions in ${nodeIds.length} nodes and their children`
      );
      let allResults = [];
      let processedCount = 0;
      const totalCount = nodeIds.length;
      for (let i = 0; i < nodeIds.length; i++) {
        try {
          const nodeId = nodeIds[i];
          const node = yield figma.getNodeByIdAsync(nodeId);
          if (!node) {
            processedCount++;
            sendProgressUpdate(
              commandId,
              "get_reactions",
              "in_progress",
              processedCount / totalCount,
              totalCount,
              processedCount,
              `Node not found: ${nodeId}`
            );
            continue;
          }
          const processedNodes = /* @__PURE__ */ new Set();
          const nodeResults = yield findNodesWithReactions(node, processedNodes);
          allResults = allResults.concat(nodeResults);
          processedCount++;
          sendProgressUpdate(
            commandId,
            "get_reactions",
            "in_progress",
            processedCount / totalCount,
            totalCount,
            processedCount,
            `Processed node ${processedCount}/${totalCount}, found ${nodeResults.length} nodes with reactions`
          );
        } catch (error) {
          processedCount++;
          sendProgressUpdate(
            commandId,
            "get_reactions",
            "in_progress",
            processedCount / totalCount,
            totalCount,
            processedCount,
            `Error processing node: ${error.message}`
          );
        }
      }
      sendProgressUpdate(
        commandId,
        "get_reactions",
        "completed",
        1,
        totalCount,
        totalCount,
        `Completed deep search: found ${allResults.length} nodes with reactions.`
      );
      return {
        nodesCount: nodeIds.length,
        nodesWithReactions: allResults.length,
        nodes: allResults
      };
    });
  }
  function setDefaultConnector(params) {
    return __async(this, null, function* () {
      const { connectorId } = params;
      if (connectorId) {
        const node = yield figma.getNodeByIdAsync(connectorId);
        if (!node)
          throw new Error(`Connector node not found with ID: ${connectorId}`);
        if (node.type !== "CONNECTOR")
          throw new Error(`Node is not a connector: ${connectorId}`);
        yield figma.clientStorage.setAsync("defaultConnectorId", connectorId);
        return {
          success: true,
          message: `Default connector set to: ${connectorId}`,
          connectorId
        };
      }
      const existingConnectorId = yield figma.clientStorage.getAsync("defaultConnectorId");
      if (existingConnectorId) {
        const existingConnector = yield figma.getNodeByIdAsync(existingConnectorId);
        if (existingConnector && existingConnector.type === "CONNECTOR") {
          return {
            success: true,
            message: `Default connector is already set to: ${existingConnectorId}`,
            connectorId: existingConnectorId,
            exists: true
          };
        }
      }
      const currentPageConnectors = figma.currentPage.findAllWithCriteria({ types: ["CONNECTOR"] });
      if (currentPageConnectors && currentPageConnectors.length > 0) {
        const foundConnector = currentPageConnectors[0];
        yield figma.clientStorage.setAsync("defaultConnectorId", foundConnector.id);
        return {
          success: true,
          message: `Automatically found and set default connector to: ${foundConnector.id}`,
          connectorId: foundConnector.id,
          autoSelected: true
        };
      }
      throw new Error("No connector found in the current page. Please create a connector in FigJam first.");
    });
  }
  function createCursorNode(targetNodeId) {
    return __async(this, null, function* () {
      const svgString = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8V35.2419L22 28.4315L27 39.7823C27 39.7823 28.3526 40.2722 29 39.7823C29.6474 39.2924 30.2913 38.3057 30 37.5121C28.6247 33.7654 25 26.1613 25 26.1613H32L16 8Z" fill="#202125" />
  </svg>`;
      const targetNode = yield figma.getNodeByIdAsync(targetNodeId);
      if (!targetNode)
        throw new Error("Target node not found");
      let parentNodeId = targetNodeId.includes(";") ? targetNodeId.split(";")[0] : targetNodeId;
      let parentNode = yield figma.getNodeByIdAsync(parentNodeId);
      if (!parentNode)
        throw new Error("Parent node not found");
      if (parentNode.type === "INSTANCE" || parentNode.type === "COMPONENT" || parentNode.type === "COMPONENT_SET") {
        parentNode = parentNode.parent;
        if (!parentNode)
          throw new Error("Parent node not found");
      }
      const importedNode = yield figma.createNodeFromSvg(svgString);
      importedNode.name = "TTF_Connector / Mouse Cursor";
      importedNode.resize(48, 48);
      parentNode.appendChild(importedNode);
      if ("layoutMode" in parentNode && parentNode.layoutMode !== "NONE") {
        importedNode.layoutPositioning = "ABSOLUTE";
      }
      if (targetNode.absoluteBoundingBox && parentNode.absoluteBoundingBox) {
        const targetBounds = targetNode.absoluteBoundingBox;
        const parentBounds = parentNode.absoluteBoundingBox;
        importedNode.x = targetBounds.x - parentBounds.x + targetBounds.width / 2 - 24;
        importedNode.y = targetBounds.y - parentBounds.y + targetBounds.height / 2 - 24;
      }
      return { id: importedNode.id, node: importedNode };
    });
  }
  function createConnections(params) {
    return __async(this, null, function* () {
      if (!(params == null ? void 0 : params.connections) || !Array.isArray(params.connections)) {
        throw new Error("Missing or invalid connections parameter");
      }
      const { connections } = params;
      const commandId = generateCommandId();
      sendProgressUpdate(commandId, "create_connections", "started", 0, connections.length, 0, `Starting to create ${connections.length} connections`);
      const defaultConnectorId = yield figma.clientStorage.getAsync("defaultConnectorId");
      if (!defaultConnectorId) {
        throw new Error("No default connector set. Please run set_default_connector first.");
      }
      const defaultConnector = yield figma.getNodeByIdAsync(defaultConnectorId);
      if (!defaultConnector || defaultConnector.type !== "CONNECTOR") {
        throw new Error(`Default connector not found or invalid: ${defaultConnectorId}`);
      }
      const results = [];
      let processedCount = 0;
      for (const connection of connections) {
        try {
          const { startNodeId: originalStartId, endNodeId: originalEndId, text } = connection;
          let startId = originalStartId;
          let endId = originalEndId;
          if (startId.includes(";")) {
            const cursorResult = yield createCursorNode(startId);
            if (cursorResult == null ? void 0 : cursorResult.id)
              startId = cursorResult.id;
          }
          if (endId.includes(";")) {
            const cursorResult = yield createCursorNode(endId);
            if (cursorResult == null ? void 0 : cursorResult.id)
              endId = cursorResult.id;
          }
          const clonedConnector = defaultConnector.clone();
          clonedConnector.name = `TTF_Connector/${startId}/${endId}`;
          clonedConnector.connectorStart = { endpointNodeId: startId, magnet: "AUTO" };
          clonedConnector.connectorEnd = { endpointNodeId: endId, magnet: "AUTO" };
          if (text) {
            try {
              yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
              clonedConnector.text.characters = text;
            } catch (fontError) {
              console.error("Error setting text:", fontError);
            }
          }
          results.push({
            id: clonedConnector.id,
            originalStartNodeId: originalStartId,
            originalEndNodeId: originalEndId,
            usedStartNodeId: startId,
            usedEndNodeId: endId,
            text: text || ""
          });
          processedCount++;
          sendProgressUpdate(commandId, "create_connections", "in_progress", processedCount / connections.length, connections.length, processedCount, `Created connection ${processedCount}/${connections.length}`);
        } catch (error) {
          processedCount++;
          results.push({
            originalStartNodeId: connection.startNodeId,
            originalEndNodeId: connection.endNodeId,
            usedStartNodeId: connection.startNodeId,
            usedEndNodeId: connection.endNodeId,
            text: connection.text || "",
            error: error.message
          });
        }
      }
      sendProgressUpdate(commandId, "create_connections", "completed", 1, connections.length, connections.length, `Completed creating ${results.length} connections`);
      return { success: true, count: results.length, connections: results };
    });
  }
  var init_connections = __esm({
    "src/commands/connections.ts"() {
      "use strict";
      init_progress();
    }
  });

  // src/commands/extraction.ts
  function processEnhancedFills(fills) {
    return fills.map((fill) => {
      const processedFill = {
        type: fill.type,
        visible: fill.visible,
        opacity: fill.opacity,
        blendMode: fill.blendMode
      };
      if (fill.type === "SOLID" && fill.color) {
        processedFill.color = {
          r: fill.color.r,
          g: fill.color.g,
          b: fill.color.b,
          hex: rgbaToHex(fill.color)
        };
      }
      return processedFill;
    });
  }
  function processEnhancedStrokes(strokes) {
    return strokes.map((stroke) => {
      const processedStroke = {
        type: stroke.type,
        visible: stroke.visible,
        opacity: stroke.opacity,
        blendMode: stroke.blendMode
      };
      if (stroke.type === "SOLID" && stroke.color) {
        processedStroke.color = {
          r: stroke.color.r,
          g: stroke.color.g,
          b: stroke.color.b,
          hex: rgbaToHex(stroke.color)
        };
      }
      return processedStroke;
    });
  }
  function processNodeRecursively(node, depth = 0) {
    return __async(this, null, function* () {
      const nodeData = {
        id: node.id,
        name: node.name,
        type: node.type,
        depth
      };
      if ("absoluteBoundingBox" in node)
        nodeData.absoluteBoundingBox = node.absoluteBoundingBox;
      if ("layoutMode" in node)
        nodeData.layoutMode = node.layoutMode;
      if ("fills" in node && node.fills)
        nodeData.fills = processEnhancedFills(node.fills);
      if ("strokes" in node && node.strokes)
        nodeData.strokes = processEnhancedStrokes(node.strokes);
      if ("cornerRadius" in node)
        nodeData.cornerRadius = node.cornerRadius;
      if ("opacity" in node)
        nodeData.opacity = node.opacity;
      if (node.type === "TEXT") {
        const textNode = node;
        nodeData.characters = textNode.characters;
        nodeData.fontSize = textNode.fontSize;
        nodeData.fontName = textNode.fontName;
      }
      if ("children" in node && node.children) {
        nodeData.children = [];
        for (const child of node.children) {
          const childData = yield processNodeRecursively(child, depth + 1);
          nodeData.children.push(childData);
        }
      }
      return nodeData;
    });
  }
  function getDocumentStyles() {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const figmaApi = figma;
      const paintStyles = typeof figma.getLocalPaintStylesAsync === "function" ? yield figma.getLocalPaintStylesAsync() : (_b = (_a = figmaApi.getLocalPaintStyles) == null ? void 0 : _a.call(figmaApi)) != null ? _b : [];
      const textStyles = typeof figma.getLocalTextStylesAsync === "function" ? yield figma.getLocalTextStylesAsync() : (_d = (_c = figmaApi.getLocalTextStyles) == null ? void 0 : _c.call(figmaApi)) != null ? _d : [];
      const effectStyles = typeof figma.getLocalEffectStylesAsync === "function" ? yield figma.getLocalEffectStylesAsync() : (_f = (_e = figmaApi.getLocalEffectStyles) == null ? void 0 : _e.call(figmaApi)) != null ? _f : [];
      const gridStyles = typeof figma.getLocalGridStylesAsync === "function" ? yield figma.getLocalGridStylesAsync() : (_h = (_g = figmaApi.getLocalGridStyles) == null ? void 0 : _g.call(figmaApi)) != null ? _h : [];
      return {
        paint: paintStyles.map((s) => ({ id: s.id, name: s.name, paints: s.paints })),
        text: textStyles.map((s) => ({ id: s.id, name: s.name, fontSize: s.fontSize, fontName: s.fontName })),
        effect: effectStyles.map((s) => ({ id: s.id, name: s.name, effects: s.effects })),
        grid: gridStyles.map((s) => ({ id: s.id, name: s.name, layoutGrids: s.layoutGrids }))
      };
    });
  }
  function getDocumentComponents() {
    return __async(this, null, function* () {
      var _a, _b;
      const figmaApi = figma;
      const components = typeof figma.getLocalComponentsAsync === "function" ? yield figma.getLocalComponentsAsync() : (_b = (_a = figmaApi.getLocalComponents) == null ? void 0 : _a.call(figmaApi)) != null ? _b : [];
      return components.map((c) => ({ id: c.id, name: c.name, description: c.description }));
    });
  }
  function getDocumentVariables() {
    return __async(this, null, function* () {
      if (!figma.variables) {
        return { variables: [], collections: [] };
      }
      const variables = typeof figma.variables.getLocalVariablesAsync === "function" ? yield figma.variables.getLocalVariablesAsync() : [];
      const collections = typeof figma.variables.getLocalVariableCollectionsAsync === "function" ? yield figma.variables.getLocalVariableCollectionsAsync() : [];
      return {
        variables: variables.map((v) => ({ id: v.id, name: v.name, resolvedType: v.resolvedType })),
        collections: collections.map((c) => ({ id: c.id, name: c.name, modes: c.modes }))
      };
    });
  }
  function getCompleteFileData() {
    return __async(this, null, function* () {
      const commandId = generateCommandId();
      sendProgressUpdate(commandId, "get_complete_file_data", "started", 0, 1, 0, "Starting extraction");
      const pages = figma.root.children;
      const completeData = {
        document: { id: figma.root.id, name: figma.root.name, type: figma.root.type, children: [] },
        styles: {},
        components: {},
        variables: {},
        metadata: { extractedAt: (/* @__PURE__ */ new Date()).toISOString() }
      };
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (typeof page.loadAsync === "function") {
          yield page.loadAsync();
        }
        const pageData = yield processNodeRecursively(page, 0);
        completeData.document.children.push(pageData);
        sendProgressUpdate(commandId, "get_complete_file_data", "in_progress", Math.round((i + 1) / pages.length * 80), pages.length, i + 1, `Processed page: ${page.name}`);
      }
      completeData.styles = yield getDocumentStyles();
      completeData.components = yield getDocumentComponents();
      completeData.variables = yield getDocumentVariables();
      sendProgressUpdate(commandId, "get_complete_file_data", "completed", 100, 1, 1, "Extraction complete");
      return completeData;
    });
  }
  function getDesignTokens() {
    return __async(this, null, function* () {
      const commandId = generateCommandId();
      sendProgressUpdate(commandId, "get_design_tokens", "started", 0, 1, 0, "Starting token extraction");
      const tokens = {
        colors: {},
        typography: {},
        effects: {},
        variables: {}
      };
      const paintStyles = yield figma.getLocalPaintStylesAsync();
      tokens.colors = paintStyles.reduce((acc, style) => {
        acc[style.name] = {
          id: style.id,
          name: style.name,
          paints: style.paints.map((paint) => {
            if (paint.type === "SOLID" && paint.color) {
              return { type: paint.type, color: rgbaToHex(paint.color), opacity: paint.opacity || 1 };
            }
            return paint;
          })
        };
        return acc;
      }, {});
      const textStyles = yield figma.getLocalTextStylesAsync();
      tokens.typography = textStyles.reduce((acc, style) => {
        var _a, _b;
        acc[style.name] = {
          id: style.id,
          fontFamily: (_a = style.fontName) == null ? void 0 : _a.family,
          fontWeight: (_b = style.fontName) == null ? void 0 : _b.style,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing
        };
        return acc;
      }, {});
      sendProgressUpdate(commandId, "get_design_tokens", "completed", 100, 1, 1, "Token extraction complete");
      return tokens;
    });
  }
  function getLayoutConstraints(params) {
    return __async(this, null, function* () {
      const nodeId = params.nodeId || "";
      const node = nodeId ? yield figma.getNodeByIdAsync(nodeId) : figma.currentPage.selection[0];
      if (!node)
        throw new Error("No node selected or found");
      const sceneNode = node;
      return {
        id: node.id,
        name: node.name,
        type: node.type,
        layoutMode: "layoutMode" in sceneNode ? sceneNode.layoutMode : null,
        layoutSizingHorizontal: "layoutSizingHorizontal" in sceneNode ? sceneNode.layoutSizingHorizontal : null,
        layoutSizingVertical: "layoutSizingVertical" in sceneNode ? sceneNode.layoutSizingVertical : null,
        paddingLeft: "paddingLeft" in sceneNode ? sceneNode.paddingLeft : 0,
        paddingRight: "paddingRight" in sceneNode ? sceneNode.paddingRight : 0,
        paddingTop: "paddingTop" in sceneNode ? sceneNode.paddingTop : 0,
        paddingBottom: "paddingBottom" in sceneNode ? sceneNode.paddingBottom : 0,
        itemSpacing: "itemSpacing" in sceneNode ? sceneNode.itemSpacing : 0,
        constraints: "constraints" in sceneNode ? sceneNode.constraints : null,
        absoluteBoundingBox: sceneNode.absoluteBoundingBox
      };
    });
  }
  function findInstancesInCurrentSelection() {
    const instances = [];
    try {
      for (const node of figma.currentPage.selection) {
        if (node.type === "INSTANCE") {
          const instanceNode = node;
          instances.push({
            id: instanceNode.id,
            name: instanceNode.name,
            mainComponentId: instanceNode.mainComponent ? instanceNode.mainComponent.id : null,
            mainComponentName: instanceNode.mainComponent ? instanceNode.mainComponent.name : null
          });
        }
        if ("children" in node) {
          findInstancesInNodeLimited(node, instances, 3);
        }
      }
    } catch (error) {
      console.log("Error finding instances:", error.message);
    }
    return instances;
  }
  function findInstancesInNodeLimited(node, instances = [], maxDepth = 3) {
    if (maxDepth <= 0)
      return instances;
    try {
      if (node.type === "INSTANCE") {
        const instanceNode = node;
        instances.push({
          id: instanceNode.id,
          name: instanceNode.name,
          mainComponentId: instanceNode.mainComponent ? instanceNode.mainComponent.id : null,
          mainComponentName: instanceNode.mainComponent ? instanceNode.mainComponent.name : null
        });
      }
      if ("children" in node && node.children.length < 50) {
        for (const child of node.children) {
          findInstancesInNodeLimited(child, instances, maxDepth - 1);
        }
      }
    } catch (error) {
      console.log("Error in limited instance search:", error.message);
    }
    return instances;
  }
  function getComponentHierarchy() {
    return __async(this, null, function* () {
      try {
        console.log("Component hierarchy: Starting...");
        const hierarchy = {
          message: "Component hierarchy analysis completed",
          timestamp: Date.now(),
          components: [],
          componentSets: [],
          instances: [],
          relationships: {}
        };
        try {
          const components = yield figma.getLocalComponentsAsync();
          const componentSets = yield figma.getLocalComponentSetNodesAsync();
          console.log(`Found ${components.length} components and ${componentSets.length} component sets`);
          for (const component of components) {
            hierarchy.components.push({
              id: component.id,
              name: component.name,
              description: component.description || "",
              type: component.type
            });
          }
          for (const componentSet of componentSets) {
            hierarchy.componentSets.push({
              id: componentSet.id,
              name: componentSet.name,
              description: componentSet.description || "",
              childrenCount: componentSet.children ? componentSet.children.length : 0
            });
          }
          const currentPage = figma.currentPage;
          if (currentPage) {
            hierarchy.instances = findInstancesInCurrentSelection();
          }
        } catch (apiError) {
          console.log("API error, returning basic structure:", apiError.message);
        }
        console.log("Component hierarchy: Analysis completed");
        return hierarchy;
      } catch (error) {
        console.error("Component hierarchy error:", error);
        throw new Error(`Error analyzing component hierarchy: ${error.message}`);
      }
    });
  }
  function generateResponsiveRecommendations(node) {
    const recommendations = [];
    if (!("layoutMode" in node))
      return recommendations;
    const layoutNode = node;
    if (layoutNode.layoutMode === "HORIZONTAL") {
      recommendations.push({
        css: "display: flex; flex-direction: row;",
        description: "Horizontal auto-layout converted to flexbox row"
      });
      if (layoutNode.layoutWrap === "WRAP") {
        recommendations.push({
          css: "flex-wrap: wrap;",
          description: "Enable wrapping for responsive behavior"
        });
      }
    }
    if (layoutNode.layoutMode === "VERTICAL") {
      recommendations.push({
        css: "display: flex; flex-direction: column;",
        description: "Vertical auto-layout converted to flexbox column"
      });
    }
    if (layoutNode.layoutSizingHorizontal === "FILL") {
      recommendations.push({
        css: "width: 100%;",
        description: "Fill container horizontally"
      });
    }
    if (layoutNode.layoutSizingVertical === "FILL") {
      recommendations.push({
        css: "height: 100%;",
        description: "Fill container vertically"
      });
    }
    return recommendations;
  }
  function analyzeResponsiveElements(node, elements = []) {
    if ("layoutMode" in node) {
      const layoutNode = node;
      elements.push({
        id: node.id,
        name: node.name,
        type: node.type,
        layoutMode: layoutNode.layoutMode,
        layoutSizingHorizontal: layoutNode.layoutSizingHorizontal || null,
        layoutSizingVertical: layoutNode.layoutSizingVertical || null,
        constraints: "constraints" in node ? node.constraints : null,
        width: node.width,
        height: node.height,
        responsiveRecommendations: generateResponsiveRecommendations(node)
      });
    }
    if ("children" in node) {
      for (const child of node.children) {
        analyzeResponsiveElements(child, elements);
      }
    }
    return elements;
  }
  function generateBreakpointRecommendations(elements) {
    const breakpoints = [
      { name: "mobile", minWidth: 0, maxWidth: 767, description: "Mobile devices" },
      { name: "tablet", minWidth: 768, maxWidth: 1023, description: "Tablet devices" },
      { name: "desktop", minWidth: 1024, maxWidth: 1439, description: "Desktop screens" },
      { name: "large", minWidth: 1440, maxWidth: null, description: "Large screens" }
    ];
    const recommendations = breakpoints.map((bp) => {
      const relevantElements = elements.filter((el) => {
        if (bp.maxWidth) {
          return el.width >= bp.minWidth && el.width <= bp.maxWidth;
        } else {
          return el.width >= bp.minWidth;
        }
      });
      return {
        name: bp.name,
        minWidth: bp.minWidth,
        maxWidth: bp.maxWidth,
        elementCount: relevantElements.length,
        suggestions: relevantElements.length > 0 ? [`Consider responsive adjustments for ${relevantElements.length} elements`] : ["No specific adjustments needed"]
      };
    });
    return recommendations;
  }
  function getResponsiveLayouts(params) {
    return __async(this, null, function* () {
      try {
        console.log("Responsive layouts: Starting...");
        const nodeId = params.nodeId || "";
        const node = nodeId ? yield figma.getNodeByIdAsync(nodeId) : figma.currentPage.selection[0];
        const layouts = {
          message: "Responsive layouts analysis completed",
          timestamp: Date.now(),
          nodeId: params.nodeId || "current-page",
          nodeName: node ? node.name : "Unknown",
          breakpoints: [],
          gridSystem: null,
          responsiveElements: []
        };
        if (node && "children" in node) {
          const elements = analyzeResponsiveElements(node);
          layouts.responsiveElements = elements;
          layouts.breakpoints = generateBreakpointRecommendations(elements);
        }
        console.log("Responsive layouts: Returning result");
        return layouts;
      } catch (error) {
        console.error("Responsive layouts error:", error);
        throw new Error(`Error analyzing responsive layouts: ${error.message}`);
      }
    });
  }
  function extractComputedStyles(node) {
    const styles = {};
    if (node.type === "TEXT") {
      const textNode = node;
      styles.typography = {
        fontFamily: textNode.fontName !== figma.mixed ? textNode.fontName.family : null,
        fontWeight: textNode.fontName !== figma.mixed ? textNode.fontName.style : null,
        fontSize: textNode.fontSize,
        lineHeight: textNode.lineHeight,
        letterSpacing: textNode.letterSpacing,
        textAlign: textNode.textAlignHorizontal,
        textDecoration: textNode.textDecoration,
        textCase: textNode.textCase
      };
    }
    if ("fills" in node && node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
      styles.fills = node.fills.map((fill) => {
        if (fill.type === "SOLID" && fill.color) {
          return {
            type: fill.type,
            color: rgbaToHex(fill.color),
            opacity: fill.opacity || 1
          };
        }
        return { type: fill.type };
      });
    }
    if ("strokes" in node && node.strokes && node.strokes.length > 0) {
      styles.strokes = {
        strokes: node.strokes,
        strokeWeight: node.strokeWeight,
        strokeAlign: node.strokeAlign
      };
    }
    if ("cornerRadius" in node && node.cornerRadius !== void 0) {
      styles.cornerRadius = node.cornerRadius;
    }
    if ("effects" in node && node.effects && node.effects.length > 0) {
      styles.effects = node.effects;
    }
    if ("opacity" in node && node.opacity !== void 0 && node.opacity !== 1) {
      styles.opacity = node.opacity;
    }
    return styles;
  }
  function analyzeStyleInheritance(node, parent) {
    const inherited = {};
    if ("fills" in parent && !("fills" in node && node.fills)) {
      inherited.fills = parent.fills;
    }
    if ("opacity" in parent && !("opacity" in node && node.opacity)) {
      inherited.opacity = parent.opacity;
    }
    if (node.type === "TEXT" && parent.type === "TEXT") {
      const textNode = node;
      const parentTextNode = parent;
      const inheritableProps = ["fontName", "fontSize", "lineHeight", "letterSpacing"];
      inherited.typography = {};
      for (const prop of inheritableProps) {
        if (parentTextNode[prop] && !textNode[prop]) {
          inherited.typography[prop] = parentTextNode[prop];
        }
      }
    }
    return inherited;
  }
  function extractLocalStyles(node) {
    return extractComputedStyles(node);
  }
  function generateCSSRecommendations(inheritance) {
    const recommendations = [];
    if (inheritance.computedStyles.typography) {
      const typo = inheritance.computedStyles.typography;
      if (typo.fontFamily) {
        recommendations.push({
          property: "font-family",
          value: `'${typo.fontFamily}'`,
          description: "Set font family"
        });
      }
      if (typo.fontSize && typo.fontSize !== figma.mixed) {
        recommendations.push({
          property: "font-size",
          value: `${typo.fontSize}px`,
          description: "Set font size"
        });
      }
      if (typo.lineHeight && typo.lineHeight !== figma.mixed) {
        const lineHeight = typo.lineHeight;
        if (lineHeight.unit === "PIXELS") {
          recommendations.push({
            property: "line-height",
            value: `${lineHeight.value}px`,
            description: "Set line height"
          });
        } else if (lineHeight.unit === "PERCENT") {
          recommendations.push({
            property: "line-height",
            value: `${lineHeight.value}%`,
            description: "Set line height"
          });
        }
      }
    }
    if (inheritance.computedStyles.fills && inheritance.computedStyles.fills.length > 0) {
      const primaryFill = inheritance.computedStyles.fills[0];
      if (primaryFill.type === "SOLID" && primaryFill.color) {
        recommendations.push({
          property: "color",
          value: primaryFill.color,
          description: "Set text/fill color"
        });
      }
    }
    if (inheritance.computedStyles.strokes) {
      const strokeWeight = inheritance.computedStyles.strokes.strokeWeight;
      if (strokeWeight !== figma.mixed) {
        recommendations.push({
          property: "border",
          value: `${strokeWeight}px solid`,
          description: "Set border width and style"
        });
      }
    }
    return recommendations;
  }
  function getStyleInheritance(params) {
    return __async(this, null, function* () {
      try {
        const nodeId = params.nodeId || "";
        const node = nodeId ? yield figma.getNodeByIdAsync(nodeId) : figma.currentPage.selection[0];
        if (!node)
          throw new Error("No node selected or found");
        const sceneNode = node;
        const inheritance = {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          computedStyles: {},
          inheritedStyles: {},
          localStyles: {},
          recommendations: []
        };
        inheritance.computedStyles = extractComputedStyles(sceneNode);
        if (node.parent) {
          inheritance.inheritedStyles = analyzeStyleInheritance(sceneNode, node.parent);
        }
        inheritance.localStyles = extractLocalStyles(sceneNode);
        inheritance.recommendations = generateCSSRecommendations(inheritance);
        return inheritance;
      } catch (error) {
        throw new Error(`Error analyzing style inheritance: ${error.message}`);
      }
    });
  }
  var init_extraction = __esm({
    "src/commands/extraction.ts"() {
      "use strict";
      init_progress();
      init_colors();
    }
  });

  // src/commands/scanning.ts
  function scanNodesByTypes(params) {
    return __async(this, null, function* () {
      const { nodeId, types = [] } = params;
      if (!types || types.length === 0) {
        throw new Error("No types specified to search for");
      }
      let node;
      if (nodeId) {
        const foundNode = yield figma.getNodeByIdAsync(nodeId);
        if (!foundNode) {
          throw new Error(`Node with ID ${nodeId} not found`);
        }
        node = foundNode;
      } else {
        node = figma.currentPage;
      }
      const matchingNodes = [];
      const commandId = generateCommandId();
      sendProgressUpdate(commandId, "scan_nodes_by_types", "started", 0, 1, 0, `Starting scan for types: ${types.join(", ")}`);
      yield findNodesByTypes(node, types, matchingNodes);
      sendProgressUpdate(commandId, "scan_nodes_by_types", "completed", 100, matchingNodes.length, matchingNodes.length, `Found ${matchingNodes.length} matching nodes`);
      return {
        success: true,
        message: `Found ${matchingNodes.length} matching nodes.`,
        count: matchingNodes.length,
        matchingNodes,
        searchedTypes: types
      };
    });
  }
  function deleteMultipleNodes(params) {
    return __async(this, null, function* () {
      const { nodeIds } = params;
      const commandId = generateCommandId();
      if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
        throw new Error("Missing or invalid nodeIds parameter");
      }
      sendProgressUpdate(commandId, "delete_multiple_nodes", "started", 0, nodeIds.length, 0, `Starting deletion of ${nodeIds.length} nodes`);
      const results = [];
      let successCount = 0;
      let failureCount = 0;
      const CHUNK_SIZE = 5;
      const chunks = [];
      for (let i = 0; i < nodeIds.length; i += CHUNK_SIZE) {
        chunks.push(nodeIds.slice(i, i + CHUNK_SIZE));
      }
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];
        sendProgressUpdate(commandId, "delete_multiple_nodes", "in_progress", Math.round(chunkIndex / chunks.length * 90) + 5, nodeIds.length, successCount + failureCount, `Processing chunk ${chunkIndex + 1}/${chunks.length}`);
        const chunkPromises = chunk.map((nodeId) => __async(this, null, function* () {
          try {
            const node = yield figma.getNodeByIdAsync(nodeId);
            if (!node) {
              return { success: false, nodeId, error: `Node not found: ${nodeId}` };
            }
            const nodeInfo = { id: node.id, name: node.name, type: node.type };
            node.remove();
            return { success: true, nodeId, nodeInfo };
          } catch (error) {
            return { success: false, nodeId, error: error.message };
          }
        }));
        const chunkResults = yield Promise.all(chunkPromises);
        chunkResults.forEach((result) => {
          if (result.success)
            successCount++;
          else
            failureCount++;
          results.push(result);
        });
        if (chunkIndex < chunks.length - 1) {
          yield delay2(1e3);
        }
      }
      sendProgressUpdate(commandId, "delete_multiple_nodes", "completed", 100, nodeIds.length, successCount + failureCount, `Deletion complete: ${successCount} successful, ${failureCount} failed`);
      return {
        success: successCount > 0,
        nodesDeleted: successCount,
        nodesFailed: failureCount,
        totalNodes: nodeIds.length,
        results,
        completedInChunks: chunks.length,
        commandId
      };
    });
  }
  var init_scanning = __esm({
    "src/commands/scanning.ts"() {
      "use strict";
      init_progress();
      init_nodes();
    }
  });

  // src/commands/nodes.ts
  function groupNodes(params) {
    return __async(this, null, function* () {
      const { nodeIds, name = "Group" } = params;
      if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length < 1) {
        throw new Error("nodeIds must be an array with at least 1 node ID");
      }
      const nodes = [];
      for (const nodeId of nodeIds) {
        const node = yield figma.getNodeByIdAsync(nodeId);
        if (!node) {
          throw new Error(`Node not found with ID: ${nodeId}`);
        }
        if (!("parent" in node)) {
          throw new Error(`Node cannot be grouped: ${nodeId}`);
        }
        nodes.push(node);
      }
      const parent = nodes[0].parent;
      for (const node of nodes) {
        if (node.parent !== parent) {
          throw new Error("All nodes must have the same parent to be grouped");
        }
      }
      if (!parent || !("appendChild" in parent)) {
        throw new Error("Parent does not support children");
      }
      const group = figma.group(nodes, parent);
      group.name = name;
      return {
        id: group.id,
        name: group.name,
        type: group.type,
        childCount: group.children.length,
        children: group.children.map((c) => ({ id: c.id, name: c.name }))
      };
    });
  }
  function ungroupNodes(params) {
    return __async(this, null, function* () {
      const { nodeId } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (node.type !== "GROUP") {
        throw new Error(`Node is not a GROUP: ${nodeId}`);
      }
      const group = node;
      const parent = group.parent;
      const children = [...group.children];
      if (!parent || !("appendChild" in parent)) {
        throw new Error("Parent does not support children");
      }
      const ungroupedChildren = children.map((child) => {
        const info = { id: child.id, name: child.name, type: child.type };
        parent.appendChild(child);
        return info;
      });
      return {
        success: true,
        ungroupedChildren
      };
    });
  }
  function setRotation(params) {
    return __async(this, null, function* () {
      const { nodeId, rotation } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (rotation === void 0) {
        throw new Error("Missing rotation parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("rotation" in node)) {
        throw new Error(`Node does not support rotation: ${nodeId}`);
      }
      const rotatable = node;
      rotatable.rotation = rotation;
      return {
        id: node.id,
        name: node.name,
        rotation: rotatable.rotation
      };
    });
  }
  function setZIndex(params) {
    return __async(this, null, function* () {
      const { nodeId, position } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (position === void 0) {
        throw new Error("Missing position parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      const parent = node.parent;
      if (!parent || !("children" in parent)) {
        throw new Error("Node has no parent with children");
      }
      const parentWithChildren = parent;
      const sceneNode = node;
      const currentIndex = parentWithChildren.children.indexOf(sceneNode);
      const maxIndex = parentWithChildren.children.length - 1;
      let newIndex;
      if (position === "front") {
        parentWithChildren.insertChild(maxIndex, sceneNode);
        newIndex = maxIndex;
      } else if (position === "back") {
        parentWithChildren.insertChild(0, sceneNode);
        newIndex = 0;
      } else if (position === "forward") {
        newIndex = Math.min(currentIndex + 1, maxIndex);
        parentWithChildren.insertChild(newIndex, sceneNode);
      } else if (position === "backward") {
        newIndex = Math.max(currentIndex - 1, 0);
        parentWithChildren.insertChild(newIndex, sceneNode);
      } else if (typeof position === "number") {
        newIndex = Math.max(0, Math.min(position, maxIndex));
        parentWithChildren.insertChild(newIndex, sceneNode);
      } else {
        throw new Error("Invalid position parameter");
      }
      return {
        id: node.id,
        name: node.name,
        index: parentWithChildren.children.indexOf(sceneNode)
      };
    });
  }
  function renameNode(params) {
    return __async(this, null, function* () {
      const { nodeId, name } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (name === void 0) {
        throw new Error("Missing name parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      const oldName = node.name;
      node.name = name;
      return {
        id: node.id,
        oldName,
        newName: node.name
      };
    });
  }
  function setVisibility(params) {
    return __async(this, null, function* () {
      const { nodeId, visible } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (visible === void 0) {
        throw new Error("Missing visible parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("visible" in node)) {
        throw new Error(`Node does not support visibility: ${nodeId}`);
      }
      const sceneNode = node;
      sceneNode.visible = visible;
      return {
        id: node.id,
        name: node.name,
        visible: sceneNode.visible
      };
    });
  }
  function setConstraints(params) {
    return __async(this, null, function* () {
      const { nodeId, horizontal, vertical } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("constraints" in node)) {
        throw new Error(`Node does not support constraints: ${nodeId}`);
      }
      const constrainedNode = node;
      const newConstraints = {
        horizontal: horizontal != null ? horizontal : constrainedNode.constraints.horizontal,
        vertical: vertical != null ? vertical : constrainedNode.constraints.vertical
      };
      constrainedNode.constraints = newConstraints;
      return {
        id: node.id,
        name: node.name,
        constraints: constrainedNode.constraints
      };
    });
  }
  function lockNode(params) {
    return __async(this, null, function* () {
      const { nodeId, locked } = params;
      if (!nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      if (locked === void 0) {
        throw new Error("Missing locked parameter");
      }
      const node = yield figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      if (!("locked" in node)) {
        throw new Error(`Node does not support locking: ${nodeId}`);
      }
      const sceneNode = node;
      sceneNode.locked = locked;
      return {
        id: node.id,
        name: node.name,
        locked: sceneNode.locked
      };
    });
  }
  var init_nodes2 = __esm({
    "src/commands/nodes.ts"() {
      "use strict";
    }
  });

  // src/index.ts
  var require_src = __commonJS({
    "src/index.ts"(exports) {
      init_document();
      init_creation();
      init_styling();
      init_layout();
      init_text();
      init_images();
      init_components();
      init_annotations();
      init_instances();
      init_connections();
      init_extraction();
      init_scanning();
      init_nodes2();
      function isRecord(value) {
        return typeof value === "object" && value !== null && !Array.isArray(value);
      }
      function hasString(obj, key) {
        return typeof obj[key] === "string";
      }
      function hasNumber(obj, key) {
        return typeof obj[key] === "number";
      }
      function hasArray(obj, key) {
        return Array.isArray(obj[key]);
      }
      function isStringArray(value) {
        return Array.isArray(value) && value.every((v) => typeof v === "string");
      }
      function isMoveNodeParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "x") && hasNumber(params, "y");
      }
      function isResizeNodeParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "width") && hasNumber(params, "height");
      }
      function isDeleteNodeParams(params) {
        return hasString(params, "nodeId");
      }
      function isCloneNodeParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetFillColorParams(params) {
        return hasString(params, "nodeId") && isRecord(params.color);
      }
      function isSetStrokeColorParams(params) {
        return hasString(params, "nodeId") && isRecord(params.color);
      }
      function isSetCornerRadiusParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "radius");
      }
      function isSetLayoutModeParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetPaddingParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetAxisAlignParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetLayoutSizingParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetItemSpacingParams(params) {
        return hasString(params, "nodeId");
      }
      function isScanTextNodesParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetTextContentParams(params) {
        return hasString(params, "nodeId") && hasString(params, "text");
      }
      function isSetMultipleTextContentsParams(params) {
        return hasString(params, "nodeId") && hasArray(params, "text");
      }
      function isSetImageFillParams(params) {
        return hasString(params, "nodeId");
      }
      function isExportNodeAsImageParams(params) {
        return hasString(params, "nodeId");
      }
      function isCreateComponentInstanceParams(params) {
        return hasString(params, "componentKey") || hasString(params, "componentId");
      }
      function isSetAnnotationParams(params) {
        return hasString(params, "nodeId") && hasString(params, "labelMarkdown");
      }
      function isSetMultipleAnnotationsParams(params) {
        return hasString(params, "nodeId") && hasArray(params, "annotations");
      }
      function isGetReactionsParams(params) {
        return hasArray(params, "nodeIds") && isStringArray(params.nodeIds);
      }
      function isCreateConnectionsParams(params) {
        return hasArray(params, "connections");
      }
      function isScanNodesByTypesParams(params) {
        return hasArray(params, "types");
      }
      function isDeleteMultipleNodesParams(params) {
        return hasArray(params, "nodeIds") && isStringArray(params.nodeIds);
      }
      function isSetInstanceOverridesParams(params) {
        return hasString(params, "sourceInstanceId") && hasArray(params, "targetNodeIds") && isStringArray(params.targetNodeIds);
      }
      function isSetOpacityParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "opacity");
      }
      function isSetEffectsParams(params) {
        return hasString(params, "nodeId") && hasArray(params, "effects");
      }
      function isSetGradientFillParams(params) {
        return hasString(params, "nodeId") && hasArray(params, "stops");
      }
      function isSetBlendModeParams(params) {
        return hasString(params, "nodeId") && hasString(params, "blendMode");
      }
      function isSetStrokeStyleParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetFontFamilyParams(params) {
        return hasString(params, "nodeId") && hasString(params, "fontFamily");
      }
      function isSetFontSizeParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "fontSize");
      }
      function isSetFontWeightParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "fontWeight");
      }
      function isSetTextAlignmentParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetLineHeightParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetLetterSpacingParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "letterSpacing");
      }
      function isCreateVectorParams(params) {
        return hasArray(params, "vectorPaths");
      }
      function isCreateSvgParams(params) {
        return hasString(params, "svg");
      }
      function isSetCurrentPageParams(params) {
        return hasString(params, "pageId");
      }
      function isGroupNodesParams(params) {
        return hasArray(params, "nodeIds") && isStringArray(params.nodeIds);
      }
      function isUngroupNodesParams(params) {
        return hasString(params, "nodeId");
      }
      function isSetRotationParams(params) {
        return hasString(params, "nodeId") && hasNumber(params, "rotation");
      }
      function isSetZIndexParams(params) {
        return hasString(params, "nodeId") && (hasString(params, "position") || hasNumber(params, "position"));
      }
      function isRenameNodeParams(params) {
        return hasString(params, "nodeId") && hasString(params, "name");
      }
      function isSetVisibilityParams(params) {
        return hasString(params, "nodeId") && typeof params.visible === "boolean";
      }
      function isSetConstraintsParams(params) {
        return hasString(params, "nodeId");
      }
      function isLockNodeParams(params) {
        return hasString(params, "nodeId") && typeof params.locked === "boolean";
      }
      function isCreateComponentFromNodeParams(params) {
        return hasString(params, "nodeId");
      }
      function isDetachInstanceParams(params) {
        return hasString(params, "nodeId");
      }
      var state = {
        serverPort: 3055
      };
      figma.showUI(__html__, { width: 350, height: 450 });
      figma.ui.onmessage = (msg) => __async(exports, null, function* () {
        switch (msg.type) {
          case "update-settings":
            updateSettings(msg);
            break;
          case "notify":
            if (msg.message) {
              figma.notify(msg.message);
            }
            break;
          case "close-plugin":
            figma.closePlugin();
            break;
          case "execute-command":
            try {
              const result = yield handleCommand(msg.command, msg.params);
              figma.ui.postMessage({
                type: "command-result",
                id: msg.id,
                result
              });
            } catch (error) {
              const err = error;
              figma.ui.postMessage({
                type: "command-error",
                id: msg.id,
                error: err.message || "Error executing command"
              });
            }
            break;
        }
      });
      figma.on("run", () => {
        figma.ui.postMessage({ type: "auto-connect" });
      });
      function updateSettings(settings) {
        if (settings.serverPort) {
          state.serverPort = settings.serverPort;
        }
        figma.clientStorage.setAsync("settings", {
          serverPort: state.serverPort
        });
      }
      function handleCommand(command, params) {
        return __async(this, null, function* () {
          switch (command) {
            case "get_document_info":
              return yield getDocumentInfo();
            case "get_all_pages":
              return yield getAllPagesInfo();
            case "get_selection":
              return yield getSelection();
            case "get_node_info":
              if (!params || !hasString(params, "nodeId")) {
                throw new Error("Missing nodeId parameter");
              }
              return yield getNodeInfo(params.nodeId);
            case "get_nodes_info":
              if (!params || !hasArray(params, "nodeIds") || !isStringArray(params.nodeIds)) {
                throw new Error("Missing or invalid nodeIds parameter");
              }
              return yield getNodesInfo(params.nodeIds);
            case "read_my_design":
              return yield readMyDesign();
            case "create_page":
              return yield createPage(params);
            case "set_current_page":
              if (!params || !isSetCurrentPageParams(params)) {
                throw new Error("Missing required parameter: pageId");
              }
              return yield setCurrentPage(params);
            case "create_rectangle":
              return yield createRectangle(params);
            case "create_frame":
              return yield createFrame(params);
            case "create_text":
              return yield createText(params);
            case "move_node":
              if (!params || !isMoveNodeParams(params)) {
                throw new Error("Missing required parameters: nodeId, x, y");
              }
              return yield moveNode(params);
            case "resize_node":
              if (!params || !isResizeNodeParams(params)) {
                throw new Error("Missing required parameters: nodeId, width, height");
              }
              return yield resizeNode(params);
            case "delete_node":
              if (!params || !isDeleteNodeParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield deleteNode(params);
            case "clone_node":
              if (!params || !isCloneNodeParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield cloneNode(params);
            case "create_ellipse":
              return yield createEllipse(params);
            case "create_line":
              return yield createLine(params);
            case "create_polygon":
              return yield createPolygon(params);
            case "create_vector":
              if (!params || !isCreateVectorParams(params)) {
                throw new Error("Missing required parameter: vectorPaths");
              }
              return yield createVector(params);
            case "create_svg":
              if (!params || !isCreateSvgParams(params)) {
                throw new Error("Missing required parameter: svg");
              }
              return yield createSvg(params);
            case "set_fill_color":
              if (!params || !isSetFillColorParams(params)) {
                throw new Error("Missing required parameters: nodeId, color");
              }
              return yield setFillColor(params);
            case "set_stroke_color":
              if (!params || !isSetStrokeColorParams(params)) {
                throw new Error("Missing required parameters: nodeId, color");
              }
              return yield setStrokeColor(params);
            case "set_corner_radius":
              if (!params || !isSetCornerRadiusParams(params)) {
                throw new Error("Missing required parameters: nodeId, radius");
              }
              return yield setCornerRadius(params);
            case "set_opacity":
              if (!params || !isSetOpacityParams(params)) {
                throw new Error("Missing required parameters: nodeId, opacity");
              }
              return yield setOpacity(params);
            case "set_effects":
              if (!params || !isSetEffectsParams(params)) {
                throw new Error("Missing required parameters: nodeId, effects");
              }
              return yield setEffects(params);
            case "set_gradient_fill":
              if (!params || !isSetGradientFillParams(params)) {
                throw new Error("Missing required parameters: nodeId, stops");
              }
              return yield setGradientFill(params);
            case "set_blend_mode":
              if (!params || !isSetBlendModeParams(params)) {
                throw new Error("Missing required parameters: nodeId, blendMode");
              }
              return yield setBlendMode(params);
            case "set_stroke_style":
              if (!params || !isSetStrokeStyleParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setStrokeStyle(params);
            case "set_layout_mode":
              if (!params || !isSetLayoutModeParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setLayoutMode(params);
            case "set_padding":
              if (!params || !isSetPaddingParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setPadding(params);
            case "set_axis_align":
              if (!params || !isSetAxisAlignParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setAxisAlign(params);
            case "set_layout_sizing":
              if (!params || !isSetLayoutSizingParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setLayoutSizing(params);
            case "set_item_spacing":
              if (!params || !isSetItemSpacingParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setItemSpacing(params);
            case "scan_text_nodes":
              if (!params || !isScanTextNodesParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield scanTextNodes(params);
            case "set_text_content":
              if (!params || !isSetTextContentParams(params)) {
                throw new Error("Missing required parameters: nodeId, text");
              }
              return yield setTextContent(params);
            case "set_multiple_text_contents":
              if (!params || !isSetMultipleTextContentsParams(params)) {
                throw new Error("Missing required parameters: nodeId, text");
              }
              return yield setMultipleTextContents(params);
            case "set_font_family":
              if (!params || !isSetFontFamilyParams(params)) {
                throw new Error("Missing required parameters: nodeId, fontFamily");
              }
              return yield setFontFamily(params);
            case "set_font_size":
              if (!params || !isSetFontSizeParams(params)) {
                throw new Error("Missing required parameters: nodeId, fontSize");
              }
              return yield setFontSize(params);
            case "set_font_weight":
              if (!params || !isSetFontWeightParams(params)) {
                throw new Error("Missing required parameters: nodeId, fontWeight");
              }
              return yield setFontWeight(params);
            case "set_text_alignment":
              if (!params || !isSetTextAlignmentParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setTextAlignment(params);
            case "set_line_height":
              if (!params || !isSetLineHeightParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setLineHeight(params);
            case "set_letter_spacing":
              if (!params || !isSetLetterSpacingParams(params)) {
                throw new Error("Missing required parameters: nodeId, letterSpacing");
              }
              return yield setLetterSpacing(params);
            case "set_image_fill":
              if (!params || !isSetImageFillParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setImageFill(params);
            case "create_image_rectangle":
              return yield createImageRectangle(params != null ? params : {});
            case "export_node_as_image":
              if (!params || !isExportNodeAsImageParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield exportNodeAsImage(params);
            case "get_styles":
              return yield getStyles();
            case "get_local_components":
              return yield getLocalComponents();
            case "create_component_instance":
              if (!params || !isCreateComponentInstanceParams(params)) {
                throw new Error("Missing required parameter: componentKey or componentId");
              }
              return yield createComponentInstance(params);
            case "create_component":
              if (!params || !isCreateComponentFromNodeParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield createComponent(params);
            case "detach_instance":
              if (!params || !isDetachInstanceParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield detachInstance(params);
            case "get_annotations":
              return yield getAnnotations(params || {});
            case "set_annotation":
              if (!params || !isSetAnnotationParams(params)) {
                throw new Error("Missing required parameters: nodeId, labelMarkdown");
              }
              return yield setAnnotation(params);
            case "set_multiple_annotations":
              if (!params || !isSetMultipleAnnotationsParams(params)) {
                throw new Error("Missing required parameters: nodeId, annotations");
              }
              return yield setMultipleAnnotations(params);
            case "get_instance_overrides":
              if (params && hasString(params, "instanceNodeId")) {
                const instanceNode = yield figma.getNodeByIdAsync(params.instanceNodeId);
                if (!instanceNode) {
                  throw new Error(`Instance node not found with ID: ${params.instanceNodeId}`);
                }
                return yield getInstanceOverrides(instanceNode);
              }
              return yield getInstanceOverrides();
            case "set_instance_overrides":
              if (!params || !isSetInstanceOverridesParams(params)) {
                throw new Error("Missing required parameters: sourceInstanceId, targetNodeIds");
              }
              return yield setInstanceOverrides(params);
            case "get_reactions":
              if (!params || !isGetReactionsParams(params)) {
                throw new Error("Missing or invalid nodeIds parameter");
              }
              return yield getReactions(params);
            case "set_default_connector":
              return yield setDefaultConnector(params || {});
            case "create_connections":
              if (!params || !isCreateConnectionsParams(params)) {
                throw new Error("Missing required parameter: connections");
              }
              return yield createConnections(params);
            case "get_complete_file_data":
              return yield getCompleteFileData();
            case "get_design_tokens":
              return yield getDesignTokens();
            case "get_layout_constraints":
              return yield getLayoutConstraints(params || {});
            case "get_component_hierarchy":
              return yield getComponentHierarchy();
            case "get_responsive_layouts":
              return yield getResponsiveLayouts(params || {});
            case "get_style_inheritance":
              return yield getStyleInheritance(params || {});
            case "scan_nodes_by_types":
              if (!params || !isScanNodesByTypesParams(params)) {
                throw new Error("Missing required parameter: types");
              }
              return yield scanNodesByTypes(params);
            case "delete_multiple_nodes":
              if (!params || !isDeleteMultipleNodesParams(params)) {
                throw new Error("Missing required parameter: nodeIds");
              }
              return yield deleteMultipleNodes(params);
            case "group_nodes":
              if (!params || !isGroupNodesParams(params)) {
                throw new Error("Missing required parameter: nodeIds");
              }
              return yield groupNodes(params);
            case "ungroup_nodes":
              if (!params || !isUngroupNodesParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield ungroupNodes(params);
            case "set_rotation":
              if (!params || !isSetRotationParams(params)) {
                throw new Error("Missing required parameters: nodeId, rotation");
              }
              return yield setRotation(params);
            case "set_z_index":
              if (!params || !isSetZIndexParams(params)) {
                throw new Error("Missing required parameters: nodeId, position");
              }
              return yield setZIndex(params);
            case "rename_node":
              if (!params || !isRenameNodeParams(params)) {
                throw new Error("Missing required parameters: nodeId, name");
              }
              return yield renameNode(params);
            case "set_visibility":
              if (!params || !isSetVisibilityParams(params)) {
                throw new Error("Missing required parameters: nodeId, visible");
              }
              return yield setVisibility(params);
            case "set_constraints":
              if (!params || !isSetConstraintsParams(params)) {
                throw new Error("Missing required parameter: nodeId");
              }
              return yield setConstraints(params);
            case "lock_node":
              if (!params || !isLockNodeParams(params)) {
                throw new Error("Missing required parameters: nodeId, locked");
              }
              return yield lockNode(params);
            default:
              throw new Error(`Unknown command: ${command}`);
          }
        });
      }
      (function initializePlugin() {
        return __async(this, null, function* () {
          try {
            const savedSettings = yield figma.clientStorage.getAsync("settings");
            if (savedSettings) {
              if (savedSettings.serverPort) {
                state.serverPort = savedSettings.serverPort;
              }
            }
            const defaultConnectorId = yield figma.clientStorage.getAsync("defaultConnectorId");
            if (defaultConnectorId) {
              console.log("Loaded default connector ID:", defaultConnectorId);
            }
            figma.ui.postMessage({
              type: "init-settings",
              settings: {
                serverPort: state.serverPort,
                defaultConnectorId: defaultConnectorId || null
              }
            });
          } catch (error) {
            console.error("Error loading settings:", error);
          }
        });
      })();
    }
  });
  require_src();
})();
