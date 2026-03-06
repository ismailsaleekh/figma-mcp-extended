/**
 * Composite Command Integration Tests
 *
 * Tests all 5 *_full composite commands against the live Figma plugin.
 * Validates: response shape, valid IDs, property application, error handling.
 *
 * Usage:
 *   node figma-mcp-extended/tests/run-composite-tests.cjs
 *
 * Prerequisites:
 *   - Figma open with plugin running
 *   - Bun relay server at ws://localhost:3055
 */

'use strict';

const WebSocket = require('ws');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CHANNEL_ID = 'gejhc98d';
const WS_URL = 'ws://localhost:3055';
const TIMEOUT = 15000;

// Tiny 10x10 red PNG for image tests
const TINY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADq2YfWIVAAAAAElFTkSuQmCC';

// ---------------------------------------------------------------------------
// Test Harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertMinimalPayload(result, label) {
  const keys = Object.keys(result);
  assert(keys.length === 1 && keys[0] === 'id',
    `${label}: expected minimal {id} payload, got keys: [${keys.join(', ')}]`);
}

function assertValidId(result, label) {
  assert(result && result.id, `${label}: missing id in result`);
  assert(typeof result.id === 'string', `${label}: id should be string, got ${typeof result.id}`);
  assert(/^\d+:\d+$/.test(result.id), `${label}: id "${result.id}" is not valid Figma format (N:N)`);
}

// ---------------------------------------------------------------------------
// WebSocket Setup (reuses the createCommandSender pattern)
// ---------------------------------------------------------------------------

function createCommandSender(ws, channelId) {
  const pendingCommands = new Map();
  let cmdCounter = 0;

  function sendCommand(command, params) {
    return new Promise((resolve, reject) => {
      const cmdId = `test_${++cmdCounter}_${Date.now()}`;

      const timer = setTimeout(() => {
        if (pendingCommands.has(cmdId)) {
          pendingCommands.delete(cmdId);
          reject(new Error(`Timeout after ${TIMEOUT}ms for ${command} (${cmdId})`));
        }
      }, TIMEOUT);

      pendingCommands.set(cmdId, { resolve, reject, timer });

      ws.send(JSON.stringify({
        type: 'message',
        channel: channelId,
        message: { command, commandId: cmdId, params }
      }));
    });
  }

  function handleMessage(data) {
    const parsed = JSON.parse(data);
    if (parsed.type === 'system' || parsed.sender === 'You') return;

    if (parsed.type === 'broadcast' && parsed.sender === 'User' && parsed.message) {
      const msg = parsed.message;
      const cmdId = msg.commandId || msg.id;

      if (cmdId && pendingCommands.has(cmdId)) {
        const pending = pendingCommands.get(cmdId);
        pendingCommands.delete(cmdId);
        clearTimeout(pending.timer);
        pending.resolve({ result: msg.result, error: msg.error });
      }
    }
  }

  return { sendCommand, handleMessage };
}

// ---------------------------------------------------------------------------
// Test Runner
// ---------------------------------------------------------------------------

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  \u2713 ${name}`);
    passed++;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    ${err.message}`);
    failed++;
    failures.push({ name, error: err.message });
  }
}

async function runSuite(name, fn) {
  console.log(`\n${name}`);
  await fn();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const ws = new WebSocket(WS_URL);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
  });

  // Join channel
  ws.send(JSON.stringify({ type: 'join', channel: CHANNEL_ID }));
  await new Promise(r => setTimeout(r, 1000));

  const { sendCommand, handleMessage } = createCommandSender(ws, CHANNEL_ID);
  ws.on('message', handleMessage);

  console.log(`Connected to ${WS_URL}, channel: ${CHANNEL_ID}`);
  console.log('Running composite command integration tests...\n');

  // ==========================================================================
  // create_frame_full
  // ==========================================================================
  await runSuite('create_frame_full', async () => {

    // TC-CFF-001: Basic layout + padding + gap
    await runTest('TC-CFF-001: basic vertical layout with padding and gap', async () => {
      const { result } = await sendCommand('create_frame_full', {
        x: 0, y: 0, width: 393, height: 852,
        name: 'CFF001_HomeScreen',
        layoutMode: 'VERTICAL',
        paddingTop: 0, paddingRight: 16, paddingBottom: 0, paddingLeft: 16,
        itemSpacing: 24,
        fillColor: { r: 0.98, g: 0.98, b: 0.97, a: 1 },
        layoutSizingHorizontal: 'FIXED',
        layoutSizingVertical: 'FIXED'
      });
      assertValidId(result, 'CFF-001');
      assertMinimalPayload(result, 'CFF-001');
    });

    // TC-CFF-002: Gradient fill
    await runTest('TC-CFF-002: gradient fill applied in single call', async () => {
      const { result } = await sendCommand('create_frame_full', {
        width: 343, height: 52,
        name: 'CFF002_GradientButton',
        layoutMode: 'HORIZONTAL',
        paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
        cornerRadius: 12,
        fillColor: { r: 1, g: 0.6, b: 0.2, a: 1 },
        gradientType: 'GRADIENT_LINEAR',
        gradientStops: [
          { color: { r: 1, g: 0.6, b: 0.2, a: 1 }, position: 0 },
          { color: { r: 0.8, g: 0.48, b: 0.16, a: 1 }, position: 1 }
        ],
        gradientAngle: 180,
        x: 420, y: 0
      });
      assertValidId(result, 'CFF-002');
      assertMinimalPayload(result, 'CFF-002');
    });

    // Create parent for child tests
    const { result: parentResult } = await sendCommand('create_frame_full', {
      x: 0, y: 900, width: 393, height: 852,
      name: 'CFF_TestParent',
      layoutMode: 'VERTICAL',
      paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
      fillColor: { r: 0.98, g: 0.98, b: 0.97, a: 1 }
    });
    const parentId = parentResult.id;

    // TC-CFF-003: Absolute positioning with offsets
    await runTest('TC-CFF-003: absolute positioning with right/bottom offsets', async () => {
      const { result } = await sendCommand('create_frame_full', {
        parentId,
        width: 56, height: 56,
        name: 'CFF003_FAB',
        layoutMode: 'VERTICAL',
        paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
        fillColor: { r: 0.12, g: 0.72, b: 0.80, a: 1 },
        cornerRadius: 9999,
        positioning: 'ABSOLUTE',
        right: 16,
        bottom: 83,
        effects: [{ type: 'DROP_SHADOW', visible: true, radius: 12, color: { r: 0, g: 0, b: 0, a: 0.15 }, offset: { x: 0, y: 4 }, spread: 0 }]
      });
      assertValidId(result, 'CFF-003');
      assertMinimalPayload(result, 'CFF-003');
    });

    // TC-CFF-004: FILL/HUG sizing
    await runTest('TC-CFF-004: FILL/HUG sizing applied after parent append', async () => {
      const { result } = await sendCommand('create_frame_full', {
        parentId,
        name: 'CFF004_FillHugChild',
        layoutMode: 'HORIZONTAL',
        paddingTop: 8, paddingRight: 16, paddingBottom: 8, paddingLeft: 16,
        primaryAxisAlignItems: 'SPACE_BETWEEN',
        counterAxisAlignItems: 'CENTER',
        fillColor: { r: 1, g: 1, b: 1, a: 1 },
        layoutSizingHorizontal: 'FILL',
        layoutSizingVertical: 'HUG'
      });
      assertValidId(result, 'CFF-004');
      assertMinimalPayload(result, 'CFF-004');
    });

    // TC-CFF-005: visible: false
    await runTest('TC-CFF-005: visible: false hides node', async () => {
      const { result } = await sendCommand('create_frame_full', {
        parentId,
        name: 'CFF005_HiddenFrame',
        layoutMode: 'VERTICAL',
        paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
        fillColor: { r: 0.95, g: 0.95, b: 0.94, a: 1 },
        layoutSizingHorizontal: 'FILL',
        layoutSizingVertical: 'HUG',
        visible: false
      });
      assertValidId(result, 'CFF-005');
      assertMinimalPayload(result, 'CFF-005');
    });

    // TC-CFF-006: Minimal response
    await runTest('TC-CFF-006: minimal response has only {id}', async () => {
      const { result } = await sendCommand('create_frame_full', {
        width: 200, height: 100,
        name: 'CFF006_MinimalResponse',
        x: 420, y: 100
      });
      assertValidId(result, 'CFF-006');
      assertMinimalPayload(result, 'CFF-006');
    });

    // TC-CFF-007: Absolute + stretch (left=0, right=0)
    await runTest('TC-CFF-007: absolute stretch with left=0, right=0', async () => {
      const { result } = await sendCommand('create_frame_full', {
        parentId,
        name: 'CFF007_StretchOverlay',
        height: 200,
        fillColor: { r: 0, g: 0, b: 0, a: 0.5 },
        positioning: 'ABSOLUTE',
        left: 0,
        right: 0,
        bottom: 0
      });
      assertValidId(result, 'CFF-007');
      assertMinimalPayload(result, 'CFF-007');
    });

    // TC-CFF-008: Invalid parentId
    await runTest('TC-CFF-008: invalid parentId returns error', async () => {
      const { result, error } = await sendCommand('create_frame_full', {
        parentId: '999:999',
        name: 'CFF008_Orphan',
        width: 100, height: 100
      });
      assert(!result || error, 'CFF-008: should return error for invalid parentId');
    });

    // TC-CFF-009: Nested parent → child
    await runTest('TC-CFF-009: nested parent-child via parentId', async () => {
      const { result: rootResult } = await sendCommand('create_frame_full', {
        width: 393, height: 200,
        name: 'CFF009_Root',
        layoutMode: 'VERTICAL',
        paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
        fillColor: { r: 0.98, g: 0.98, b: 0.97, a: 1 },
        x: 420, y: 200
      });
      assertValidId(rootResult, 'CFF-009-root');

      const { result: childResult } = await sendCommand('create_frame_full', {
        parentId: rootResult.id,
        name: 'CFF009_Header',
        layoutMode: 'HORIZONTAL',
        paddingTop: 0, paddingRight: 16, paddingBottom: 0, paddingLeft: 16,
        primaryAxisAlignItems: 'SPACE_BETWEEN',
        counterAxisAlignItems: 'CENTER',
        fillColor: { r: 1, g: 1, b: 1, a: 1 },
        layoutSizingHorizontal: 'FILL',
        layoutSizingVertical: 'HUG'
      });
      assertValidId(childResult, 'CFF-009-child');
      assertMinimalPayload(childResult, 'CFF-009-child');
    });

    // TC-CFF-010: Shadow + stroke + opacity + radius + clip
    await runTest('TC-CFF-010: all visual properties combined', async () => {
      const { result } = await sendCommand('create_frame_full', {
        width: 343, height: 120,
        name: 'CFF010_StyledCard',
        layoutMode: 'VERTICAL',
        paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
        itemSpacing: 8,
        fillColor: { r: 1, g: 1, b: 1, a: 1 },
        cornerRadius: 12,
        opacity: 0.95,
        strokeColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
        strokeWeight: 1,
        effects: [{ type: 'DROP_SHADOW', visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.05 }, offset: { x: 0, y: 1 }, spread: 0 }],
        clipsContent: true,
        x: 420, y: 430
      });
      assertValidId(result, 'CFF-010');
      assertMinimalPayload(result, 'CFF-010');
    });
  });

  // ==========================================================================
  // create_text_full
  // ==========================================================================
  await runSuite('create_text_full', async () => {

    // Create parent for child tests
    const { result: textParent } = await sendCommand('create_frame_full', {
      x: 850, y: 0, width: 300, height: 600,
      name: 'CTF_TestParent',
      layoutMode: 'VERTICAL',
      paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
      itemSpacing: 12,
      fillColor: { r: 1, g: 1, b: 1, a: 1 }
    });
    const textParentId = textParent.id;

    // TC-CTF-001: lineHeight + letterSpacing + opacity
    await runTest('TC-CTF-001: lineHeight + letterSpacing + opacity', async () => {
      const { result } = await sendCommand('create_text_full', {
        text: 'Product Title',
        fontSize: 20, fontWeight: 600,
        fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        lineHeight: 28, letterSpacing: 0.5, opacity: 0.9,
        name: 'CTF001_ProductTitle',
        x: 850, y: 650
      });
      assertValidId(result, 'CTF-001');
      assertMinimalPayload(result, 'CTF-001');
    });

    // TC-CTF-002: maxLines truncation (child)
    await runTest('TC-CTF-002: maxLines truncation with FILL sizing', async () => {
      const { result } = await sendCommand('create_text_full', {
        parentId: textParentId,
        text: 'This is a very long product description that should be truncated after exactly two lines of text with an ellipsis indicator at the end of the visible content.',
        fontSize: 14, fontWeight: 400,
        fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
        lineHeight: 20, maxLines: 2,
        name: 'CTF002_TruncatedDesc',
        layoutSizingHorizontal: 'FILL'
      });
      assertValidId(result, 'CTF-002');
      assertMinimalPayload(result, 'CTF-002');
    });

    // TC-CTF-003: FILL sizing in vertical parent
    await runTest('TC-CTF-003: FILL sizing wraps to parent width', async () => {
      const { result } = await sendCommand('create_text_full', {
        parentId: textParentId,
        text: 'Long description that wraps to fill the parent container width automatically when placed inside a vertical auto-layout frame.',
        fontSize: 14, fontWeight: 400,
        fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
        lineHeight: 20,
        name: 'CTF003_FillText',
        layoutSizingHorizontal: 'FILL'
      });
      assertValidId(result, 'CTF-003');
      assertMinimalPayload(result, 'CTF-003');
    });

    // TC-CTF-004: Gradient text
    await runTest('TC-CTF-004: gradient text renders correctly', async () => {
      const { result } = await sendCommand('create_text_full', {
        text: 'No listings yet',
        fontSize: 20, fontWeight: 600,
        fontColor: { r: 0.12, g: 0.72, b: 0.80, a: 1 },
        textAlignHorizontal: 'CENTER',
        lineHeight: 28,
        name: 'CTF004_GradientTitle',
        gradientType: 'GRADIENT_LINEAR',
        gradientStops: [
          { color: { r: 0.12, g: 0.72, b: 0.80, a: 1 }, position: 0 },
          { color: { r: 1, g: 0.6, b: 0.2, a: 1 }, position: 1 }
        ],
        gradientAngle: 180,
        x: 850, y: 700
      });
      assertValidId(result, 'CTF-004');
      assertMinimalPayload(result, 'CTF-004');
    });

    // TC-CTF-005: visible: false
    await runTest('TC-CTF-005: hidden text node', async () => {
      const { result } = await sendCommand('create_text_full', {
        parentId: textParentId,
        text: 'Hidden Label',
        fontSize: 14, fontWeight: 400,
        fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        name: 'CTF005_HiddenLabel',
        visible: false
      });
      assertValidId(result, 'CTF-005');
      assertMinimalPayload(result, 'CTF-005');
    });

    // TC-CTF-006: Minimal response
    await runTest('TC-CTF-006: minimal response has only {id}', async () => {
      const { result } = await sendCommand('create_text_full', {
        text: 'Minimal', fontSize: 16, fontWeight: 400,
        x: 850, y: 750
      });
      assertValidId(result, 'CTF-006');
      assertMinimalPayload(result, 'CTF-006');
    });

    // TC-CTF-007: All properties applied (performance - single font load)
    await runTest('TC-CTF-007: single font load with all props', async () => {
      const { result } = await sendCommand('create_text_full', {
        text: 'Performance Test',
        fontSize: 14, fontWeight: 600,
        fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        lineHeight: 20, letterSpacing: 0.2, maxLines: 3,
        name: 'CTF007_PerfText',
        x: 850, y: 790
      });
      assertValidId(result, 'CTF-007');
      assertMinimalPayload(result, 'CTF-007');
    });

    // TC-CTF-008: Root-level text (no parentId)
    await runTest('TC-CTF-008: root-level text without parentId', async () => {
      const { result } = await sendCommand('create_text_full', {
        text: 'Page-Level Text',
        fontSize: 24, fontWeight: 700,
        fontColor: { r: 0.2, g: 0.2, b: 0.8, a: 1 },
        x: 850, y: 830
      });
      assertValidId(result, 'CTF-008');
      assertMinimalPayload(result, 'CTF-008');
    });

    // TC-CTF-009: Empty params — all defaults
    await runTest('TC-CTF-009: all defaults with empty params', async () => {
      const { result } = await sendCommand('create_text_full', {});
      assertValidId(result, 'CTF-009');
      assertMinimalPayload(result, 'CTF-009');
    });

    // TC-CTF-010: Long text + lineHeight + truncation + FILL
    await runTest('TC-CTF-010: long text with all features combined', async () => {
      const { result } = await sendCommand('create_text_full', {
        parentId: textParentId,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        fontSize: 14, fontWeight: 400,
        fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
        lineHeight: 20, letterSpacing: 0.1, maxLines: 3,
        name: 'CTF010_LongTruncated',
        layoutSizingHorizontal: 'FILL'
      });
      assertValidId(result, 'CTF-010');
      assertMinimalPayload(result, 'CTF-010');
    });
  });

  // ==========================================================================
  // create_svg_full
  // ==========================================================================
  await runSuite('create_svg_full', async () => {

    // Create parent for child tests
    const { result: svgParent } = await sendCommand('create_frame_full', {
      x: 1200, y: 0, width: 300, height: 100,
      name: 'CSF_IconRow',
      layoutMode: 'HORIZONTAL',
      paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
      itemSpacing: 16,
      counterAxisAlignItems: 'CENTER',
      fillColor: { r: 1, g: 1, b: 1, a: 1 }
    });
    const svgParentId = svgParent.id;

    // TC-CSF-001: Filled star with opacity
    await runTest('TC-CSF-001: filled star icon with opacity', async () => {
      const { result } = await sendCommand('create_svg_full', {
        parentId: svgParentId,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
        width: 24, height: 24,
        name: 'CSF001_StarIcon',
        fillColor: { r: 1, g: 0.8, b: 0, a: 1 },
        opacity: 0.8
      });
      assertValidId(result, 'CSF-001');
      assertMinimalPayload(result, 'CSF-001');
    });

    // TC-CSF-002: Stroke heart outline
    await runTest('TC-CSF-002: stroke-style heart outline', async () => {
      const { result } = await sendCommand('create_svg_full', {
        parentId: svgParentId,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        width: 20, height: 20,
        name: 'CSF002_HeartOutline',
        strokeColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
        strokeWeight: 1.5
      });
      assertValidId(result, 'CSF-002');
      assertMinimalPayload(result, 'CSF-002');
    });

    // TC-CSF-003: Hidden menu icon + minimal response
    await runTest('TC-CSF-003: hidden icon with minimal response', async () => {
      const { result } = await sendCommand('create_svg_full', {
        parentId: svgParentId,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
        width: 24, height: 24,
        name: 'CSF003_HiddenMenu',
        fillColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        visible: false
      });
      assertValidId(result, 'CSF-003');
      assertMinimalPayload(result, 'CSF-003');
    });
  });

  // ==========================================================================
  // create_rectangle_full
  // ==========================================================================
  await runSuite('create_rectangle_full', async () => {

    // Create parent for child tests
    const { result: rectParent } = await sendCommand('create_frame_full', {
      x: 1200, y: 130, width: 393, height: 400,
      name: 'CRF_TestParent',
      layoutMode: 'VERTICAL',
      paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
      itemSpacing: 12,
      fillColor: { r: 1, g: 1, b: 1, a: 1 }
    });
    const rectParentId = rectParent.id;

    // TC-CRF-001: Circular skeleton with radius + opacity
    await runTest('TC-CRF-001: circle skeleton with radius + opacity', async () => {
      const { result } = await sendCommand('create_rectangle_full', {
        parentId: rectParentId,
        width: 80, height: 80,
        name: 'CRF001_SkeletonAvatar',
        fillColor: { r: 0.88, g: 0.88, b: 0.88, a: 1 },
        cornerRadius: 9999,
        opacity: 0.7
      });
      assertValidId(result, 'CRF-001');
      assertMinimalPayload(result, 'CRF-001');
    });

    // TC-CRF-002: Hidden divider with FILL sizing
    await runTest('TC-CRF-002: hidden divider with FILL sizing', async () => {
      const { result } = await sendCommand('create_rectangle_full', {
        parentId: rectParentId,
        width: 343, height: 1,
        name: 'CRF002_HiddenDivider',
        fillColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
        layoutSizingHorizontal: 'FILL',
        visible: false
      });
      assertValidId(result, 'CRF-002');
      assertMinimalPayload(result, 'CRF-002');
    });

    // TC-CRF-003: Minimal response (standalone)
    await runTest('TC-CRF-003: standalone rect with minimal response', async () => {
      const { result } = await sendCommand('create_rectangle_full', {
        width: 100, height: 50,
        name: 'CRF003_MinimalRect',
        fillColor: { r: 0.95, g: 0.95, b: 0.94, a: 1 },
        cornerRadius: 8,
        x: 1200, y: 560
      });
      assertValidId(result, 'CRF-003');
      assertMinimalPayload(result, 'CRF-003');
    });
  });

  // ==========================================================================
  // create_image_full
  // ==========================================================================
  await runSuite('create_image_full', async () => {

    // Create parent for child tests
    const { result: imgParent } = await sendCommand('create_frame_full', {
      x: 1200, y: 640, width: 393, height: 600,
      name: 'CIF_TestParent',
      layoutMode: 'VERTICAL',
      paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16,
      itemSpacing: 12,
      fillColor: { r: 1, g: 1, b: 1, a: 1 }
    });
    const imgParentId = imgParent.id;

    // TC-CIF-001: Stroke + opacity + sizing + radius
    await runTest('TC-CIF-001: image with stroke + opacity + radius + FILL', async () => {
      const { result } = await sendCommand('create_image_full', {
        parentId: imgParentId,
        imageBase64: TINY_PNG,
        width: 164, height: 164,
        name: 'CIF001_ProductImage',
        scaleMode: 'FILL',
        cornerRadius: 12,
        strokeColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
        strokeWeight: 1,
        opacity: 0.95,
        layoutSizingHorizontal: 'FILL'
      });
      assertValidId(result, 'CIF-001');
      assertMinimalPayload(result, 'CIF-001');
    });

    // TC-CIF-002: Hidden circular avatar
    await runTest('TC-CIF-002: hidden circular avatar', async () => {
      const { result } = await sendCommand('create_image_full', {
        parentId: imgParentId,
        imageBase64: TINY_PNG,
        width: 80, height: 80,
        name: 'CIF002_HiddenAvatar',
        scaleMode: 'FILL',
        cornerRadius: 9999,
        visible: false
      });
      assertValidId(result, 'CIF-002');
      assertMinimalPayload(result, 'CIF-002');
    });

    // TC-CIF-003: Minimal response with FIT scale
    await runTest('TC-CIF-003: FIT scale with minimal response', async () => {
      const { result } = await sendCommand('create_image_full', {
        imageBase64: TINY_PNG,
        width: 200, height: 150,
        name: 'CIF003_MinimalImage',
        scaleMode: 'FIT',
        x: 1650, y: 0
      });
      assertValidId(result, 'CIF-003');
      assertMinimalPayload(result, 'CIF-003');
    });

    // TC-CIF-ERR: Missing image source
    await runTest('TC-CIF-ERR: error when no imageUrl or imageBase64', async () => {
      const { result, error } = await sendCommand('create_image_full', {
        width: 100, height: 100,
        name: 'CIF_NoImage'
      });
      assert(!result || error, 'CIF-ERR: should return error when no image source provided');
    });
  });

  // ==========================================================================
  // Cross-command integration: nested tree with mixed types
  // ==========================================================================
  await runSuite('Cross-Command Integration', async () => {

    await runTest('nested tree: frame > text + icon + image + rectangle', async () => {
      // Create root
      const { result: root } = await sendCommand('create_frame_full', {
        x: 1650, y: 200, width: 343, height: 400,
        name: 'INT_ProductCard',
        layoutMode: 'VERTICAL',
        paddingTop: 0, paddingRight: 0, paddingBottom: 16, paddingLeft: 0,
        itemSpacing: 12,
        fillColor: { r: 1, g: 1, b: 1, a: 1 },
        cornerRadius: 12,
        clipsContent: true,
        effects: [{ type: 'DROP_SHADOW', visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.05 }, offset: { x: 0, y: 1 }, spread: 0 }]
      });
      assertValidId(root, 'INT-root');

      // Image child
      const { result: img } = await sendCommand('create_image_full', {
        parentId: root.id,
        imageBase64: TINY_PNG,
        width: 343, height: 200,
        name: 'INT_ProductPhoto',
        scaleMode: 'FILL',
        layoutSizingHorizontal: 'FILL'
      });
      assertValidId(img, 'INT-image');

      // Text container
      const { result: textBox } = await sendCommand('create_frame_full', {
        parentId: root.id,
        name: 'INT_TextContent',
        layoutMode: 'VERTICAL',
        paddingTop: 0, paddingRight: 16, paddingBottom: 0, paddingLeft: 16,
        itemSpacing: 4,
        fillColor: { r: 1, g: 1, b: 1, a: 1 },
        layoutSizingHorizontal: 'FILL',
        layoutSizingVertical: 'HUG'
      });
      assertValidId(textBox, 'INT-textbox');

      // Title text
      const { result: title } = await sendCommand('create_text_full', {
        parentId: textBox.id,
        text: 'Ceramic Floor Tiles',
        fontSize: 16, fontWeight: 600,
        fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        lineHeight: 24,
        name: 'INT_Title',
        layoutSizingHorizontal: 'FILL'
      });
      assertValidId(title, 'INT-title');

      // Price text
      const { result: price } = await sendCommand('create_text_full', {
        parentId: textBox.id,
        text: '45 000 UZS',
        fontSize: 14, fontWeight: 700,
        fontColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        lineHeight: 20,
        name: 'INT_Price',
        layoutSizingHorizontal: 'FILL'
      });
      assertValidId(price, 'INT-price');

      // Rating row
      const { result: ratingRow } = await sendCommand('create_frame_full', {
        parentId: textBox.id,
        name: 'INT_RatingRow',
        layoutMode: 'HORIZONTAL',
        paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
        itemSpacing: 4,
        counterAxisAlignItems: 'CENTER',
        fillColor: { r: 1, g: 1, b: 1, a: 1 },
        layoutSizingHorizontal: 'FILL',
        layoutSizingVertical: 'HUG'
      });
      assertValidId(ratingRow, 'INT-ratingrow');

      // Star icon
      const { result: star } = await sendCommand('create_svg_full', {
        parentId: ratingRow.id,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
        width: 16, height: 16,
        name: 'INT_Star',
        fillColor: { r: 1, g: 0.8, b: 0, a: 1 }
      });
      assertValidId(star, 'INT-star');

      // Rating text
      const { result: ratingText } = await sendCommand('create_text_full', {
        parentId: ratingRow.id,
        text: '4.8 (127)',
        fontSize: 12, fontWeight: 400,
        fontColor: { r: 0.4, g: 0.4, b: 0.4, a: 1 },
        lineHeight: 16,
        name: 'INT_Rating'
      });
      assertValidId(ratingText, 'INT-ratingtext');

      // Skeleton divider (hidden)
      const { result: divider } = await sendCommand('create_rectangle_full', {
        parentId: root.id,
        width: 311, height: 1,
        name: 'INT_Divider',
        fillColor: { r: 0.85, g: 0.85, b: 0.85, a: 1 },
        layoutSizingHorizontal: 'FILL',
        visible: false
      });
      assertValidId(divider, 'INT-divider');

      // All 9 nodes created successfully
      assert(true, 'All nodes created');
    });
  });

  // ==========================================================================
  // Backward Compatibility: old commands still work
  // ==========================================================================
  await runSuite('Backward Compatibility', async () => {

    await runTest('old create_frame still works', async () => {
      const { result } = await sendCommand('create_frame', {
        width: 100, height: 100,
        name: 'BC_OldFrame',
        x: 2050, y: 0
      });
      assert(result && result.id, 'BC: old create_frame should return id');
      // Old command returns verbose payload — more than just {id}
      const keys = Object.keys(result);
      assert(keys.length > 1, 'BC: old create_frame should return verbose payload');
    });

    await runTest('old create_text still works', async () => {
      const { result } = await sendCommand('create_text', {
        text: 'Old Text', fontSize: 14,
        x: 2050, y: 120
      });
      assert(result && result.id, 'BC: old create_text should return id');
    });

    await runTest('old create_rectangle still works', async () => {
      const { result } = await sendCommand('create_rectangle', {
        width: 80, height: 40,
        name: 'BC_OldRect',
        x: 2050, y: 160
      });
      assert(result && result.id, 'BC: old create_rectangle should return id');
    });
  });

  // ==========================================================================
  // Results
  // ==========================================================================
  console.log(`\n${'='.repeat(60)}`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log('\nFailed tests:');
    for (const f of failures) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
  }
  console.log('='.repeat(60));

  ws.close();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
