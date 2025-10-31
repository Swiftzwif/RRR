const { chromium } = require('@playwright/test');

async function testSite() {
  console.log('Starting browser automation test...');
  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
    slowMo: 500 // Slow down actions to see what's happening
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Take screenshot of the initial page
    await page.screenshot({
      path: 'site-screenshot.png',
      fullPage: true
    });
    console.log('✓ Screenshot saved as site-screenshot.png');

    // Check if the page loaded successfully
    const title = await page.title();
    console.log('✓ Page title:', title);

    // Check for the raffle section in hero area
    const raffleSection = await page.locator('[data-raffle-hero-section]').first();
    const raffleExists = await raffleSection.count() > 0;

    if (raffleExists) {
      console.log('✓ Raffle section found in hero area');

      // Check for the 35% OFF message
      const discountText = await page.locator('text=/35% OFF/i').first();
      if (await discountText.count() > 0) {
        console.log('✓ 35% OFF discount message visible');
      }

      // Check for the $52 savings message
      const savingsText = await page.locator('text=/$52/i').first();
      if (await savingsText.count() > 0) {
        console.log('✓ $52 savings message visible');
      }

      // Check for warrior count
      const warriorCount = await page.locator('text=/warriors joined/i').first();
      if (await warriorCount.count() > 0) {
        const countText = await warriorCount.textContent();
        console.log('✓ Warrior count displayed:', countText);
      }

      // Check for countdown timer
      const timerElements = await page.locator('[data-countdown-timer]').count();
      if (timerElements > 0) {
        console.log('✓ Countdown timer present');
      }

      // Check for join button
      const joinButton = await page.locator('button:has-text("Join Now"), a:has-text("Join Now")').first();
      if (await joinButton.count() > 0) {
        console.log('✓ Join button found');
        await joinButton.screenshot({ path: 'join-button.png' });
        console.log('  → Join button screenshot saved');
      }
    } else {
      console.log('⚠ Raffle section not found - checking for errors...');
    }

    // Check for any error messages
    const errorMessages = await page.locator('text=/error/i').all();
    if (errorMessages.length > 0) {
      console.log('⚠ Found error messages on page:');
      for (const error of errorMessages) {
        const text = await error.textContent();
        console.log('  -', text);
      }
    } else {
      console.log('✓ No error messages found');
    }

    // Check console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('⚠ Console error:', msg.text());
      }
    });

    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(2000);

    console.log('\n✅ Site is accessible and loading properly!');

    // Test navigation to raffle page if it exists
    console.log('\nTesting raffle page navigation...');
    try {
      await page.goto('http://localhost:3000/raffle', {
        waitUntil: 'networkidle',
        timeout: 15000
      });
      await page.screenshot({ path: 'raffle-page.png' });
      console.log('✓ Raffle page screenshot saved');
    } catch (e) {
      console.log('ℹ Raffle page not accessible or doesn\'t exist');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    // Take error screenshot
    try {
      const page = await browser.newPage();
      await page.goto('http://localhost:3000', { timeout: 5000 });
      await page.screenshot({ path: 'error-screenshot.png' });
      console.log('Error screenshot saved as error-screenshot.png');
    } catch (e) {
      console.log('Could not capture error screenshot');
    }

    throw error;
  } finally {
    await browser.close();
    console.log('\nBrowser closed.');
  }
}

// Run the test
testSite().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});