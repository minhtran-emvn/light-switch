#!/usr/bin/env node
/**
 * Command-line tests for light-switch app
 * Run: node test-cli.js
 */

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let passCount = 0;
let failCount = 0;

function test(name, condition, detail) {
    if (condition) {
        console.log(`✓ ${name}`);
        if (detail) console.log(`  → ${detail}`);
        passCount++;
    } else {
        console.log(`✗ ${name}`);
        if (detail) console.log(`  → ${detail}`);
        failCount++;
    }
}

console.log('🧪 Testing light-switch/index.html\n');
console.log('=' .repeat(50));

// Read the file
let html;
try {
    html = fs.readFileSync(htmlPath, 'utf8');
    test('File exists', true, htmlPath);
} catch (e) {
    test('File exists', false, `Error: ${e.message}`);
    console.log('\n❌ Cannot continue without index.html');
    process.exit(1);
}

console.log('=' .repeat(50));
console.log('\n📦 Test 1: SVG Light Bulb\n');

// Test SVG exists
const hasSvg = html.includes('<svg') && html.includes('</svg>');
test('SVG element exists', hasSvg, hasSvg ? 'Found <svg> tag' : 'No SVG found');

// Test no emoji in bulb
const bulbMatch = html.match(/id="light-bulb"[^>]*>([\s\S]*?)<\/div>/);
const bulbContent = bulbMatch ? bulbMatch[1] : '';
const hasEmojiInBulb = /[💡🔦💿]/.test(bulbContent.split('<svg')[0]);
test('No emoji in bulb container', !hasEmojiInBulb, 
    hasEmojiInBulb ? 'Found emoji before SVG' : 'Bulb uses SVG only');

// Test SVG structure
const hasGlass = html.includes('M12 2C8.13');
const hasBase = html.includes('x="9" y="17"') && html.includes('x="9" y="20"');
const hasFilament = html.includes('M10 9') || html.includes('M12 7v3');
test('SVG has bulb glass', hasGlass, hasGlass ? 'Path with bulb shape found' : 'Missing bulb glass path');
test('SVG has bulb base', hasBase, hasBase ? 'Rect elements for base found' : 'Missing bulb base');
test('SVG has filament', hasFilament, hasFilament ? 'Filament paths found' : 'Missing filament');

// Test viewBox for proper scaling
const hasViewBox = html.includes('viewBox="0 0 24 24"');
test('SVG has viewBox for scaling', hasViewBox, 
    hasViewBox ? 'viewBox="0 0 24 24" - scales without jagged edges' : 'Missing viewBox');

console.log('\n🔆 Test 2: Brightness Slider\n');

// Test slider exists
const hasSlider = html.includes('id="brightness-slider"');
test('Brightness slider exists', hasSlider, hasSlider ? 'Found #brightness-slider' : 'No slider found');

// Test slider range
const sliderMatch = html.match(/id="brightness-slider"[^>]*min="(\d+)"[^>]*max="(\d+)"/);
if (sliderMatch) {
    const min = sliderMatch[1];
    const max = sliderMatch[2];
    test('Slider range is 10-100', min === '10' && max === '100', 
        `Range: ${min}-${max}`);
} else {
    // Try alternate attribute order
    const sliderMatch2 = html.match(/min="(\d+)"[^>]*max="(\d+)"[^>]*id="brightness-slider"/);
    if (sliderMatch2) {
        const min = sliderMatch2[1];
        const max = sliderMatch2[2];
        test('Slider range is 10-100', min === '10' && max === '100', 
            `Range: ${min}-${max}`);
    } else {
        test('Slider range is 10-100', false, 'Could not parse slider attributes');
    }
}

// Test applyBrightness function
const hasApplyBrightness = html.includes('function applyBrightness');
test('applyBrightness function exists', hasApplyBrightness, 
    hasApplyBrightness ? 'Function defined' : 'Function not found');

// Test bulb opacity control
const hasBulbOpacity = html.includes('bulbSvg.style.opacity');
test('Controls bulb opacity', hasBulbOpacity, 
    hasBulbOpacity ? 'Found: bulbSvg.style.opacity' : 'Bulb opacity not controlled');

// Test bulb glow control
const hasBulbFilter = html.includes('bulbSvg.style.filter');
test('Controls bulb glow', hasBulbFilter, 
    hasBulbFilter ? 'Found: bulbSvg.style.filter with drop-shadow' : 'Bulb glow not controlled');

// Test background brightness control
const hasBgFilter = html.includes('body.style.filter');
test('Controls background brightness', hasBgFilter, 
    hasBgFilter ? 'Found: body.style.filter = brightness(...)' : 'Background not controlled');

// Verify brightness affects both
const brightnessFactorUsed = html.includes('const factor = value / 100');
test('Uses brightness factor calculation', brightnessFactorUsed, 
    brightnessFactorUsed ? 'factor = value / 100' : 'No factor calculation found');

console.log('\n' + '=' .repeat(50));
console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed\n`);

if (failCount === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed');
    process.exit(1);
}
