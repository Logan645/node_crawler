const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to a website
  await page.goto('https://blog.apify.com/4-ways-to-authenticate-a-proxy-in-puppeteer-with-headless-chrome-in-2022/');

  // Scroll the page for 1 minute
  await page.evaluate(async () => {
    let startTime = Date.now();
    while (Date.now() - startTime <= 10000) {
      window.scrollBy(0, 1000 * (Math.random() - 0.5));
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  });

  // Close the browser
  await browser.close();
})();