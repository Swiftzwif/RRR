const { chromium } = require('@playwright/test');

async function checkLiveRaffle() {
  console.log('🌐 Checking LIVE website: https://www.trajectorygroup.org/raffle\n');
  console.log('=' . repeat(60));

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to the LIVE raffle page
    console.log('\n📍 Navigating to production raffle page...');
    await page.goto('https://www.trajectorygroup.org/raffle', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Take screenshot
    await page.screenshot({
      path: 'live-raffle-page.png',
      fullPage: true
    });
    console.log('✓ Screenshot saved as live-raffle-page.png\n');

    // Analyze text visibility issues
    console.log('🔍 Analyzing text visibility and contrast issues:\n');

    // Check button text colors
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} button(s)`);

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const bgColor = await button.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      const textColor = await button.evaluate(el =>
        window.getComputedStyle(el).color
      );
      const isVisible = await button.isVisible();

      console.log(`\nButton ${i + 1}:`);
      console.log(`  Text: "${text?.trim() || 'NO TEXT'}"`);
      console.log(`  Background: ${bgColor}`);
      console.log(`  Text Color: ${textColor}`);
      console.log(`  Visible: ${isVisible}`);

      // Check if text color is too similar to background
      if (textColor === bgColor || textColor === 'rgba(0, 0, 0, 0)') {
        console.log(`  ⚠️ WARNING: Text may be invisible!`);
      }
    }

    // Check main headline
    console.log('\n📝 Checking main headline:');
    const h1 = await page.locator('h1').first();
    if (await h1.count() > 0) {
      const h1Text = await h1.textContent();
      const h1Color = await h1.evaluate(el =>
        window.getComputedStyle(el).color
      );
      console.log(`  Text: "${h1Text?.trim()}"`);
      console.log(`  Color: ${h1Color}`);
    }

    // Check CTA links
    console.log('\n🔗 Checking CTA links:');
    const ctaLinks = await page.locator('a').all();
    for (const link of ctaLinks) {
      const href = await link.getAttribute('href');
      if (href && href.includes('#commitment')) {
        const text = await link.textContent();
        const color = await link.evaluate(el =>
          window.getComputedStyle(el).color
        );
        console.log(`  CTA Link: "${text?.trim()}"`);
        console.log(`  Color: ${color}`);
      }
    }

    // Check for specific problem areas
    console.log('\n⚠️ Checking for known problem areas:');

    // Check if text has transparent or no color
    const transparentText = await page.locator('*').evaluateAll(elements => {
      const problematic = [];
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (el.textContent && el.textContent.trim() &&
            (style.color === 'rgba(0, 0, 0, 0)' ||
             style.color === 'transparent')) {
          problematic.push({
            tag: el.tagName,
            text: el.textContent.substring(0, 50),
            color: style.color
          });
        }
      }
      return problematic;
    });

    if (transparentText.length > 0) {
      console.log('Found elements with transparent text:');
      transparentText.forEach(item => {
        console.log(`  - ${item.tag}: "${item.text}..." (color: ${item.color})`);
      });
    } else {
      console.log('  No transparent text found');
    }

    // Check Tailwind classes being used
    console.log('\n🎨 Checking Tailwind text color classes:');
    const elementsWithTextClasses = await page.locator('[class*="text-"]').all();
    const textColorClasses = new Set();

    for (const el of elementsWithTextClasses) {
      const classes = await el.getAttribute('class');
      const textClasses = classes?.match(/text-[\w-]+/g) || [];
      textClasses.forEach(cls => textColorClasses.add(cls));
    }

    console.log('Text color classes found:');
    Array.from(textColorClasses).sort().forEach(cls => {
      console.log(`  - ${cls}`);
    });

    // Check computed styles on the commitment section
    const commitmentSection = await page.locator('#commitment').first();
    if (await commitmentSection.count() > 0) {
      console.log('\n📋 Commitment section analysis:');
      const button = await commitmentSection.locator('button[type="submit"]').first();
      if (await button.count() > 0) {
        const btnText = await button.textContent();
        const btnBg = await button.evaluate(el =>
          window.getComputedStyle(el).background
        );
        const btnColor = await button.evaluate(el =>
          window.getComputedStyle(el).color
        );
        console.log(`  Submit button text: "${btnText?.trim()}"`);
        console.log(`  Background: ${btnBg?.substring(0, 100)}...`);
        console.log(`  Text color: ${btnColor}`);
      }
    }

    console.log('\n' + '=' . repeat(60));
    console.log('✅ Analysis complete! Check live-raffle-page.png');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkLiveRaffle().catch(console.error);