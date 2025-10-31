const { chromium } = require('@playwright/test');

async function checkLocalRaffle() {
  console.log('🔧 Checking LOCAL fixes: http://localhost:3000/raffle\n');
  console.log('=' . repeat(60));

  const browser = await chromium.launch({
    headless: false,
    slowMo: 200
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to LOCAL raffle page
    console.log('\n📍 Navigating to localhost:3000/raffle...');
    await page.goto('http://localhost:3000/raffle', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Take screenshot
    await page.screenshot({
      path: 'local-raffle-fixed.png',
      fullPage: true
    });
    console.log('✓ Screenshot saved as local-raffle-fixed.png\n');

    console.log('🔍 Checking if fixes work:\n');

    // Check main headline
    const h1 = await page.locator('h1').first();
    if (await h1.count() > 0) {
      const h1Text = await h1.textContent();
      console.log(`✅ Main headline: "${h1Text?.trim()}"`);
      if (h1Text?.includes('Kill The Boy')) {
        console.log('   ✓ Correct headline text!');
      }
    }

    // Check "Win The War" gradient text
    const gradientText = await page.locator('.text-transparent').first();
    if (await gradientText.count() > 0) {
      const text = await gradientText.textContent();
      const color = await gradientText.evaluate(el =>
        window.getComputedStyle(el).color
      );
      console.log(`\n✅ Gradient text: "${text?.trim()}"`);
      console.log(`   Color: ${color}`);
      if (color === 'rgba(0, 0, 0, 0)') {
        console.log('   ⚠️ Still transparent - checking background-image...');
        const bgImage = await gradientText.evaluate(el =>
          window.getComputedStyle(el).backgroundImage
        );
        console.log(`   Background: ${bgImage}`);
        if (bgImage.includes('gradient')) {
          console.log('   ✓ Gradient is applied!');
        }
      }
    }

    // Check CTA button
    const ctaButton = await page.locator('a:has-text("Begin Your Transformation")').first();
    if (await ctaButton.count() > 0) {
      const bg = await ctaButton.evaluate(el =>
        window.getComputedStyle(el).background
      );
      const color = await ctaButton.evaluate(el =>
        window.getComputedStyle(el).color
      );
      console.log(`\n✅ CTA Button:`);
      console.log(`   Background: ${bg?.substring(0, 100)}...`);
      console.log(`   Text color: ${color}`);
      if (bg.includes('rgb(249, 115, 22)') || bg.includes('orange')) {
        console.log('   ✓ Orange gradient applied!');
      }
    }

    // Check for orange-500 class usage
    const orangeElements = await page.locator('[class*="orange-500"]').count();
    console.log(`\n✅ Elements using orange-500: ${orangeElements}`);

    // Check commit button
    const commitBtn = await page.locator('button:has-text("Commit to Transform")').first();
    if (await commitBtn.count() > 0) {
      const btnBg = await commitBtn.evaluate(el =>
        window.getComputedStyle(el).background
      );
      console.log(`\n✅ Commit button background: ${btnBg?.substring(0, 100)}...`);
      if (btnBg.includes('rgb(249, 115, 22)') || btnBg.includes('orange')) {
        console.log('   ✓ Orange gradient applied!');
      }
    }

    console.log('\n' + '=' . repeat(60));
    console.log('✅ Local test complete! Check local-raffle-fixed.png');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkLocalRaffle().catch(console.error);