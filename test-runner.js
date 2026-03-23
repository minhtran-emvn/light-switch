const puppeteer = require('puppeteer');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 8765;
const TEST_FILE = path.join(__dirname, 'test.html');

// Simple HTTP server to serve test files
function startServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const filePath = req.url === '/' ? '/test.html' : req.url;
            const fullPath = path.join(__dirname, filePath.substring(1));
            
            const extname = path.extname(fullPath);
            let contentType = 'text/html';
            
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
            };
            
            contentType = mimeTypes[extname] || 'application/octet-stream';
            
            fs.readFile(fullPath, (err, content) => {
                if (err) {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                }
            });
        });
        
        server.listen(PORT, () => {
            console.log(`🌐 Test server running at http://localhost:${PORT}`);
            resolve(server);
        });
    });
}

async function runTests() {
    let server;
    let browser;
    
    try {
        // Start server
        server = await startServer();
        
        // Launch browser
        console.log('🚀 Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Capture console logs
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('=== TEST SUMMARY ===') || 
                text.includes('Total:') || 
                text.includes('Passed:') || 
                text.includes('Failed:')) {
                console.log('📊', text);
            }
            if (text.includes('Failed tests:')) {
                console.log('\n❌ Failed tests:');
            }
            if (text.startsWith('  -')) {
                console.log(text);
            }
        });
        
        // Navigate to test page
        console.log('🧪 Running tests...\n');
        await page.goto(`http://localhost:${PORT}/test.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for tests to complete (look for summary)
        await page.waitForFunction(() => {
            const summary = document.getElementById('summary');
            return summary && summary.style.display !== 'none';
        }, { timeout: 30000 });
        
        // Get test results
        const results = await page.evaluate(() => {
            const summary = document.getElementById('summary');
            const tests = document.querySelectorAll('.test');
            
            let passed = 0;
            let failed = 0;
            const failedTests = [];
            
            tests.forEach(test => {
                if (test.classList.contains('pass')) {
                    passed++;
                } else if (test.classList.contains('fail')) {
                    failed++;
                    const name = test.querySelector('.test-name').textContent;
                    const result = test.querySelector('.test-result').textContent;
                    failedTests.push({ name, result });
                }
            });
            
            return { passed, failed, failedTests };
        });
        
        console.log('\n' + '='.repeat(50));
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log('='.repeat(50));
        
        if (results.failed > 0) {
            console.log('\n📋 Failed Test Details:');
            results.failedTests.forEach(test => {
                console.log(`  • ${test.name}`);
                console.log(`    ${test.result}`);
            });
            process.exit(1);
        } else {
            console.log('\n🎉 All tests passed!');
            process.exit(0);
        }
        
    } catch (error) {
        console.error('💥 Test execution failed:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
        if (server) {
            server.close();
        }
    }
}

// Run tests
runTests();
