#!/usr/bin/env node

/**
 * Simple test validator for light-switch application
 * This script validates the HTML structure and JavaScript logic
 * For full browser tests, open test.html in a browser
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`${GREEN}✅${RESET} ${name}`);
        passed++;
    } catch (error) {
        console.log(`${RED}❌${RESET} ${name}`);
        console.log(`   ${RED}Error:${RESET} ${error.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function assertIncludes(str, substr, message) {
    if (!str.includes(substr)) {
        throw new Error(message || `Expected string to include "${substr}"`);
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

console.log(`${BLUE}════════════════════════════════════════${RESET}`);
console.log(`${BLUE}  💡 Light Switch - Test Validation${RESET}`);
console.log(`${BLUE}════════════════════════════════════════${RESET}\n`);

// Read the HTML file
const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log(`${YELLOW}📄 Validating: index.html${RESET}\n`);

// Test Suite 1: HTML Structure
console.log(`${YELLOW}1️⃣  HTML Structure Tests${RESET}`);

test('Has DOCTYPE declaration', () => {
    assert(html.includes('<!DOCTYPE html>'), 'Missing DOCTYPE');
});

test('Has light-bulb element', () => {
    assert(html.includes('id="light-bulb"'), 'Missing light-bulb element');
});

test('Has switch button', () => {
    assert(html.includes('id="switch-btn"'), 'Missing switch button');
});

test('Has brightness slider', () => {
    assert(html.includes('id="brightness-slider"'), 'Missing brightness slider');
    assert(html.includes('type="range"'), 'Slider should be type="range"');
});

test('Has brightness container', () => {
    assert(html.includes('id="brightness-container"'), 'Missing brightness container');
});

test('Has status display', () => {
    assert(html.includes('id="status"'), 'Missing status element');
});

test('Has toggle count display', () => {
    assert(html.includes('id="count"'), 'Missing count element');
});

test('Has brightness value display', () => {
    assert(html.includes('id="brightness-value"'), 'Missing brightness value display');
});

// Test Suite 2: JavaScript Functions
console.log(`\n${YELLOW}2️⃣  JavaScript Function Tests${RESET}`);

test('Has toggleLight function', () => {
    assert(html.includes('function toggleLight()'), 'Missing toggleLight function');
});

test('Has updateBrightness function', () => {
    assert(html.includes('function updateBrightness(value)'), 'Missing updateBrightness function');
});

test('Has applyBrightness function', () => {
    assert(html.includes('function applyBrightness(value)'), 'Missing applyBrightness function');
});

test('Has saveState function', () => {
    assert(html.includes('function saveState()'), 'Missing saveState function');
});

test('Has localStorage loading on DOMContentLoaded', () => {
    assert(html.includes('DOMContentLoaded'), 'Missing DOMContentLoaded listener');
    assert(html.includes('localStorage.getItem'), 'Missing localStorage loading');
});

// Test Suite 3: Brightness Slider Configuration
console.log(`\n${YELLOW}3️⃣  Brightness Slider Configuration${RESET}`);

test('Slider min is 10', () => {
    const match = html.match(/min="(\d+)"/);
    assert(match && match[1] === '10', `Expected min="10", got min="${match ? match[1] : 'none'}"`);
});

test('Slider max is 100', () => {
    const match = html.match(/max="(\d+)"/);
    assert(match && match[1] === '100', `Expected max="100", got max="${match ? match[1] : 'none'}"`);
});

test('Slider default value is 100', () => {
    const match = html.match(/value="(\d+)"/);
    assert(match && match[1] === '100', `Expected value="100", got value="${match ? match[1] : 'none'}"`);
});

// Test Suite 4: localStorage Keys
console.log(`\n${YELLOW}4️⃣  localStorage Persistence${RESET}`);

test('Saves lightState to localStorage', () => {
    assertIncludes(html, "localStorage.setItem('lightState'", 'Missing lightState save');
});

test('Saves toggleCount to localStorage', () => {
    assertIncludes(html, "localStorage.setItem('toggleCount'", 'Missing toggleCount save');
});

test('Saves brightness to localStorage', () => {
    assertIncludes(html, "localStorage.setItem('brightness'", 'Missing brightness save');
});

test('Loads lightState from localStorage', () => {
    assertIncludes(html, "localStorage.getItem('lightState')", 'Missing lightState load');
});

test('Loads brightness from localStorage', () => {
    assertIncludes(html, "localStorage.getItem('brightness')", 'Missing brightness load');
});

test('Loads toggleCount from localStorage', () => {
    assertIncludes(html, "localStorage.getItem('toggleCount')", 'Missing toggleCount load');
});

// Test Suite 5: CSS Classes and States
console.log(`\n${YELLOW}5️⃣  CSS State Management${RESET}`);

test('Has light-on class', () => {
    assert(html.includes('light-on'), 'Missing light-on class');
});

test('Has light-off class', () => {
    assert(html.includes('light-off'), 'Missing light-off class');
});

test('Has brightness-container disabled styles', () => {
    assertIncludes(html, 'pointer-events: none', 'Missing pointer-events: none for disabled state');
    assertIncludes(html, 'opacity: 0.5', 'Missing opacity: 0.5 for disabled state');
});

test('Has brightness-container enabled styles', () => {
    assertIncludes(html, 'pointer-events: all', 'Missing pointer-events: all for enabled state');
});

// Test Suite 6: Brightness Logic
console.log(`\n${YELLOW}6️⃣  Brightness Implementation${RESET}`);

test('Applies opacity to bulb', () => {
    assertIncludes(html, 'lightBulb.style.opacity', 'Missing opacity application');
});

test('Applies glow effect', () => {
    assertIncludes(html, 'drop-shadow', 'Missing drop-shadow for glow effect');
});

test('Opacity calculation uses brightness value', () => {
    // Check for opacity calculation formula
    assertIncludes(html, '0.3 + (value / 100) * 0.7', 'Missing opacity calculation formula');
});

// Test Suite 7: Event Handlers
console.log(`\n${YELLOW}7️⃣  Event Handlers${RESET}`);

test('Bulb has onclick handler', () => {
    assert(html.includes('onclick="toggleLight()"'), 'Missing bulb onclick handler');
});

test('Button has onclick handler', () => {
    assert(html.includes('onclick="toggleLight()"'), 'Missing button onclick handler');
});

test('Slider has onchange handler', () => {
    assert(html.includes('onchange="updateBrightness(this.value)"'), 'Missing slider onchange handler');
});

// Summary
console.log(`\n${BLUE}════════════════════════════════════════${RESET}`);
console.log(`${BLUE}  Test Summary${RESET}`);
console.log(`${BLUE}════════════════════════════════════════${RESET}`);
console.log(`${GREEN}✅ Passed: ${passed}${RESET}`);
console.log(`${RED}❌ Failed: ${failed}${RESET}`);
console.log(`Total:  ${passed + failed}`);
console.log('');

if (failed === 0) {
    console.log(`${GREEN}🎉 All validation tests passed!${RESET}`);
    console.log(`\n${YELLOW}📝 Next steps:${RESET}`);
    console.log('   1. Open test.html in a browser to run interactive tests');
    console.log('   2. Click "▶️ Run All Tests" button');
    console.log('   3. Verify all 19 tests pass\n');
    process.exit(0);
} else {
    console.log(`${RED}⚠️  Some tests failed. Please review the errors above.${RESET}\n`);
    process.exit(1);
}
