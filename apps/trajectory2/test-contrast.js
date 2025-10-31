const { chromium } = require('@playwright/test');

async function testContrast() {
  console.log('Testing contrast improvements on raffle page...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to raffle page
    console.log('Navigating to raffle page...');
    await page.goto('http://localhost:3000/raffle', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Take screenshot
    await page.screenshot({
      path: 'raffle-contrast-fixed.png',
      fullPage: true
    });
    console.log('✓ Screenshot saved as raffle-contrast-fixed.png');

    // Check text visibility
    const elements = [
      { selector: 'h1', name: 'Main headline' },
      { selector: 'text=/35% OFF/i', name: '35% OFF text' },
      { selector: 'text=/Save \\$52/i', name: 'Save $52 text' },
      { selector: 'text=/Limited Time/i', name: 'Limited Time text' },
      { selector: 'text=/16 Prizes/i', name: '16 Prizes text' },
      { selector: 'text=/1,247\\+ Men Transformed/i', name: 'Trust indicator' }
    ];

    console.log('\nChecking text elements:');
    for (const elem of elements) {
      const element = await page.locator(elem.selector).first();
      if (await element.count() > 0) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          console.log(`✓ ${elem.name} - VISIBLE`);
        } else {
          console.log(`✗ ${elem.name} - NOT VISIBLE`);
        }
      } else {
        console.log(`? ${elem.name} - NOT FOUND`);
      }
    }

    console.log('\n✓ Contrast test complete!');

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testContrast().catch(console.error);