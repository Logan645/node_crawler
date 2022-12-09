const puppeteer = require('puppeteer');
require('dotenv').config();

(async() =>{
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://www.instagram.com/')
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await page.waitForSelector('._ab8w > ._ab32:nth-child(1) > .x6s0dn4 > ._aa48 > ._aa4b')
    await page.click('#loginForm > div > div:nth-child(5) > button')
    await navigationPromise
    const waitForTimeout = (t) =>new Promise((f)=>setTimeout(f,t))
    await waitForTimeout(1000)
    await page.waitForSelector('#email')
    await page.type('#email', 'zw831217@gmail.com') //這行每次輸入的不太一樣
    await page.waitForSelector('#pass')
    await page.type('#pass', `${process.env.password}`)
    await page.waitForSelector('#loginbutton')
    await page.click('#loginbutton')
    await navigationPromise
    // #mount_0_0_0T > div > div > div > div:nth-child(4) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div._a9-z > button._a9--._a9_1
    await page.waitForSelector('button._a9--._a9_1')
    await page.click('button._a9--._a9_1')
    // #mount_0_0_08 > div > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z > section > main > div:nth-child(1) > section > div._aam1._aam2._aam5 > div._aac4._aac5._aac6 > div > div > div > div > ul > li:nth-child(4) > div > button > div._aarf.x1e56ztr.x1gslohp > span > img
    await page.waitForSelector('button._a9--._a9_1')
    await page.click('button._a9--._a9_1')
})();