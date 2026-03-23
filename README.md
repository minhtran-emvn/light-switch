# 💡 Light Switch - Test Suite

## Overview
Modern glassmorphism light switch UI with brightness control (10-100%).

## Features Tested
1. ✅ Toggle on/off functionality (button and bulb click)
2. ✅ Brightness slider updates bulb opacity and glow intensity
3. ✅ localStorage persistence (state, brightness, toggle count)
4. ✅ Slider disabled when light is off

## Running Tests

### Option 1: Browser (Manual)
1. Open `test.html` in your browser
2. Click "▶️ Run All Tests"
3. View results on the page

### Option 2: Command Line (Automated)
```bash
# Install dependencies
npm install

# Run tests
npm test
```

## Test Coverage

### 1. Toggle Functionality (5 tests)
- Initial state is OFF
- Clicking switch turns light ON
- Clicking switch turns light OFF
- Clicking bulb toggles light
- Toggle count increments

### 2. Brightness Slider (4 tests)
- Slider value updates brightness display
- Bulb opacity changes with brightness
- Glow intensity changes with brightness
- Brightness range is 10-100

### 3. localStorage Persistence (6 tests)
- Initial state is not persisted
- Turning light on saves state
- Brightness is saved
- State persists after reload
- Brightness restored after reload
- Toggle count restored after reload

### 4. Slider Disabled State (4 tests)
- Slider container disabled when light off
- Slider container enabled when light on
- Slider cannot be changed when light off
- Brightness changes only apply when light on

**Total: 19 tests**

## Files
- `index.html` - Main application
- `test.html` - Test suite (browser-based)
- `test-runner.js` - Automated test runner (Puppeteer)
- `package.json` - Node.js dependencies
