// src/helpers/fonts.ts

import type { FontOptions } from "../types";

/**
 * Get unique items by predicate
 */
function uniqBy<T>(
  arr: T[],
  predicate: keyof T | ((item: T) => unknown)
): T[] {
  const cb = typeof predicate === "function"
    ? predicate
    : (o: T) => o[predicate];

  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item);
        map.has(key) || map.set(key, item);
        return map;
      }, new Map<unknown, T>())
      .values(),
  ];
}

/**
 * Map numeric font weight to Figma font style name
 */
export function getFontStyle(weight: number): string {
  switch (weight) {
    case 100: return "Thin";
    case 200: return "Extra Light";
    case 300: return "Light";
    case 400: return "Regular";
    case 500: return "Medium";
    case 600: return "Semi Bold";
    case 700: return "Bold";
    case 800: return "Extra Bold";
    case 900: return "Black";
    default: return "Regular";
  }
}

/**
 * Set characters on a text node with font handling
 */
export async function setCharacters(
  node: TextNode,
  characters: string,
  options?: FontOptions
): Promise<boolean> {
  const fallbackFont: FontName = options?.fallbackFont || {
    family: "Inter",
    style: "Regular",
  };

  try {
    if (node.fontName === figma.mixed) {
      if (options?.smartStrategy === "prevail") {
        const fontHashTree: Record<string, number> = {};
        for (let i = 1; i < node.characters.length; i++) {
          const charFont = node.getRangeFontName(i - 1, i) as FontName;
          const key = `${charFont.family}::${charFont.style}`;
          fontHashTree[key] = fontHashTree[key] ? fontHashTree[key] + 1 : 1;
        }
        const prevailedTreeItem = Object.entries(fontHashTree).sort(
          (a, b) => b[1] - a[1]
        )[0];
        const [family, style] = prevailedTreeItem[0].split("::");
        const prevailedFont: FontName = { family, style };
        await figma.loadFontAsync(prevailedFont);
        node.fontName = prevailedFont;
      } else if (options?.smartStrategy === "strict") {
        return setCharactersWithStrictMatchFont(node, characters, fallbackFont);
      } else if (options?.smartStrategy === "experimental") {
        return setCharactersWithSmartMatchFont(node, characters, fallbackFont);
      } else {
        const firstCharFont = node.getRangeFontName(0, 1) as FontName;
        await figma.loadFontAsync(firstCharFont);
        node.fontName = firstCharFont;
      }
    } else {
      await figma.loadFontAsync({
        family: node.fontName.family,
        style: node.fontName.style,
      });
    }
  } catch (err) {
    const fontName = node.fontName as FontName;
    console.warn(
      `Failed to load "${fontName.family} ${fontName.style}" font and replaced with fallback "${fallbackFont.family} ${fallbackFont.style}"`,
      err
    );
    await figma.loadFontAsync(fallbackFont);
    node.fontName = fallbackFont;
  }

  try {
    node.characters = characters;
    return true;
  } catch (err) {
    console.warn(`Failed to set characters. Skipped.`, err);
    return false;
  }
}

/**
 * Set characters with strict font matching
 */
async function setCharactersWithStrictMatchFont(
  node: TextNode,
  characters: string,
  fallbackFont: FontName
): Promise<boolean> {
  const fontHashTree: Record<string, string> = {};

  for (let i = 1; i < node.characters.length; i++) {
    const startIdx = i - 1;
    const startCharFont = node.getRangeFontName(startIdx, i) as FontName;
    const startCharFontVal = `${startCharFont.family}::${startCharFont.style}`;

    while (i < node.characters.length) {
      i++;
      const charFont = node.getRangeFontName(i - 1, i) as FontName;
      if (startCharFontVal !== `${charFont.family}::${charFont.style}`) {
        break;
      }
    }
    fontHashTree[`${startIdx}_${i}`] = startCharFontVal;
  }

  await figma.loadFontAsync(fallbackFont);
  node.fontName = fallbackFont;
  node.characters = characters;

  await Promise.all(
    Object.keys(fontHashTree).map(async (range) => {
      const [start, end] = range.split("_");
      const [family, style] = fontHashTree[range].split("::");
      const matchedFont: FontName = { family, style };
      await figma.loadFontAsync(matchedFont);
      return node.setRangeFontName(Number(start), Number(end), matchedFont);
    })
  );

  return true;
}

/**
 * Get delimiter positions in string
 */
function getDelimiterPos(
  str: string,
  delimiter: string,
  startIdx: number = 0,
  endIdx: number = str.length
): [number, number][] {
  const indices: [number, number][] = [];
  let temp = startIdx;

  for (let i = startIdx; i < endIdx; i++) {
    if (
      str[i] === delimiter &&
      i + startIdx !== endIdx &&
      temp !== i + startIdx
    ) {
      indices.push([temp, i + startIdx]);
      temp = i + startIdx + 1;
    }
  }

  if (temp !== endIdx) {
    indices.push([temp, endIdx]);
  }

  return indices.filter(Boolean);
}

interface FontTreeItem {
  start: number;
  delimiter: string;
  family: string;
  style: string;
}

/**
 * Build linear font order from node
 */
function buildLinearOrder(node: TextNode): Omit<FontTreeItem, "start">[] {
  const fontTree: FontTreeItem[] = [];
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
          ) as FontName;
          fontTree.push({
            start: spacesRangeStart,
            delimiter: " ",
            family: rangeFont.family,
            style: rangeFont.style,
          });
        } else {
          const font = spacesRangeFont as FontName;
          fontTree.push({
            start: spacesRangeStart,
            delimiter: " ",
            family: font.family,
            style: font.style,
          });
        }
      });
    } else {
      const font = newLinesRangeFont as FontName;
      fontTree.push({
        start: newLinesRangeStart,
        delimiter: "\n",
        family: font.family,
        style: font.style,
      });
    }
  });

  return fontTree
    .sort((a, b) => a.start - b.start)
    .map(({ family, style, delimiter }) => ({ family, style, delimiter }));
}

/**
 * Set characters with smart font matching
 */
async function setCharactersWithSmartMatchFont(
  node: TextNode,
  characters: string,
  fallbackFont: FontName
): Promise<boolean> {
  const rangeTree = buildLinearOrder(node);
  const fontsToLoad = uniqBy(
    rangeTree,
    ({ family, style }) => `${family}::${style}`
  ).map(({ family, style }): FontName => ({ family, style }));

  await Promise.all([...fontsToLoad, fallbackFont].map(figma.loadFontAsync));

  node.fontName = fallbackFont;
  node.characters = characters;

  let prevPos = 0;
  rangeTree.forEach(({ family, style, delimiter }) => {
    if (prevPos < node.characters.length) {
      const delimiterPos = node.characters.indexOf(delimiter, prevPos);
      const endPos =
        delimiterPos > prevPos ? delimiterPos : node.characters.length;
      const matchedFont: FontName = { family, style };
      node.setRangeFontName(prevPos, endPos, matchedFont);
      prevPos = endPos + 1;
    }
  });

  return true;
}
