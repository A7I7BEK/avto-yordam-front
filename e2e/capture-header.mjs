import { chromium } from '@playwright/test';

async function run() {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    
    // Seed fake token or navigate
    await page.goto('http://localhost:11000/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-jwt-token');
    });
    await page.goto('http://localhost:11000/business/dashboard/overview', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/azizbek_iskandarov/.gemini/antigravity-ide/brain/5fe965e9-99ce-4ce8-8b2b-3d94038a97ce/scratch/screenshot_dashboard_header.png', fullPage: false });
    
    // Open hamburger
    await page.click('.header__menu-btn');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/azizbek_iskandarov/.gemini/antigravity-ide/brain/5fe965e9-99ce-4ce8-8b2b-3d94038a97ce/scratch/screenshot_dashboard_drawer.png', fullPage: false });

    await browser.close();
    console.log('Done capturing dashboard screenshots!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
