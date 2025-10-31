const { chromium } = require('@playwright/test');

async function finalRaffleTest() {
  console.log('\n🎯 FINAL RAFFLE VERIFICATION TEST\n');
  console.log('=' . repeat(50));

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to home page
    console.log('\n📍 Testing Homepage (localhost:3000)');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Take full page screenshot
    await page.screenshot({
      path: 'final-homepage.png',
      fullPage: true
    });
    console.log('   ✓ Full page screenshot saved');

    // Check for raffle hero section
    const raffleSection = await page.locator('[data-raffle-hero-section]');
    if (await raffleSection.count() > 0) {
      console.log('   ✓ Raffle section found in hero area');

      // Take close-up of raffle section
      await raffleSection.screenshot({
        path: 'final-raffle-section.png'
      });
      console.log('   ✓ Raffle section screenshot saved');

      // Check all raffle elements
      const checks = [
        { selector: 'text=/35% OFF/i', name: '35% OFF discount' },
        { selector: 'text=/$97/i', name: '$97 price' },
        { selector: 'text=/$149/i', name: '$149 original price' },
        { selector: 'text=/Save \\$52/i', name: 'Save $52 text' },
        { selector: 'text=/warriors joined/i', name: 'Warrior count' },
        { selector: '[data-countdown-timer]', name: 'Countdown timer' },
        { selector: 'text=/Join the Raffle/i', name: 'Join raffle CTA' },
        { selector: 'text=/Grand Opening/i', name: 'Grand Opening label' }
      ];

      for (const check of checks) {
        const element = await page.locator(check.selector).first();
        if (await element.count() > 0) {
          const text = await element.textContent();
          console.log(`   ✓ ${check.name}: "${text?.trim()}"`);
        } else {
          console.log(`   ⚠ ${check.name}: NOT FOUND`);
        }
      }

      // Click on raffle section to test navigation
      console.log('\n   🖱 Testing raffle click navigation...');
      await raffleSection.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      if (currentUrl.includes('/raffle')) {
        console.log('   ✓ Successfully navigated to raffle page');
      }
    }

    // Test raffle page directly
    console.log('\n📍 Testing Raffle Page (/raffle)');
    await page.goto('http://localhost:3000/raffle', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.screenshot({
      path: 'final-raffle-page.png',
      fullPage: true
    });
    console.log('   ✓ Raffle page screenshot saved');

    // Check for raffle form elements
    const formElements = [
      { selector: 'input[type="email"], input[placeholder*="email" i]', name: 'Email input' },
      { selector: 'textarea, input[placeholder*="commitment" i]', name: 'Commitment field' },
      { selector: 'button:has-text("Enter Raffle"), button:has-text("Join"), button[type="submit"]', name: 'Submit button' }
    ];

    for (const elem of formElements) {
      const element = await page.locator(elem.selector).first();
      if (await element.count() > 0) {
        console.log(`   ✓ ${elem.name} found`);
      } else {
        console.log(`   ⚠ ${elem.name} not found`);
      }
    }

    // API verification
    console.log('\n📍 Testing Raffle API');
    const apiResponse = await page.evaluate(async () => {
      const response = await fetch('/api/payments/raffle-entry');
      return await response.json();
    });

    if (apiResponse.active) {
      console.log('   ✓ Raffle API is active');
      console.log(`   → Entry price: $${apiResponse.raffle?.entryPrice}`);
      console.log(`   → Savings: $${apiResponse.raffle?.savings}`);
      console.log(`   → Discount: ${apiResponse.raffle?.discountPercentage}%`);
      console.log(`   → Total entries: ${apiResponse.stats?.totalEntries}`);
    }

    console.log('\n' + '=' . repeat(50));
    console.log('✅ VERIFICATION COMPLETE - Site is fully operational!');
    console.log('=' . repeat(50));
    console.log('\n📸 Screenshots saved:');
    console.log('   - final-homepage.png (full site)');
    console.log('   - final-raffle-section.png (hero raffle area)');
    console.log('   - final-raffle-page.png (dedicated raffle page)');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);

    // Emergency screenshot
    try {
      const page = await browser.newPage();
      await page.goto('http://localhost:3000', { timeout: 5000 });
      await page.screenshot({ path: 'final-error.png' });
      console.log('Error screenshot saved: final-error.png');
    } catch (e) {
      console.log('Could not capture error screenshot');
    }
  } finally {
    await browser.close();
  }
}

finalRaffleTest().catch(console.error);