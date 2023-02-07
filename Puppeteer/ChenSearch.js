const puppeteer = require('puppeteer');
(async()=>{
    const browser = await puppeteer.launch({ headless: false });
    //帶上proxy內容
    // const browser = await puppeteer.launch(
    //     { headless: false }, 
    //     {args: [`--proxy-server=${proxy}`],}
    // );
    const page = await browser.newPage(); // 開啟新分頁
    // await page.authenticate({ username, password });
     // 設定螢幕寬度viewport size desktop
    await page.setViewport({
        width: 1440,
        height: 800
    });
    //帶上user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');
    const keywords = ['陳鳳龍學歷', '陳鳳龍背景', '陳鳳龍年紀', '陳鳳龍經歷', '陳鳳龍維基百科']
    try{
        //一開始的到達頁應該要是首頁
        await page.goto('https://www.google.com.tw')
        //搜尋關鍵字
        await page.type('input', '陳鳳龍', {delay:500});
        await(await page.$('input')).press('Enter');
        await page.waitForNavigation();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.click('#rso h3');
        await randomScroll(page);
        await page.goBack();
        const inputElement = await page.$('#tsf input');
        await inputElement.evaluate(input => {
            input.value = '';
        });
        await page.type('#tsf input', '陳鳳龍學歷', {delay:500});
        await(await page.$('#tsf input')).press('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000)); //要改成60秒
        await page.click('#rso h3');
        await autoScroll(page);
        await new Promise(resolve => setTimeout(resolve, 3000)); //要改成60秒
        await page.goBack();
        await browser.close();
    }
    catch(e){
        console.log(e)
        await browser.close();
    }
})()

//隨機上下捲動
async function randomScroll(page){
    await page.evaluate(async () => {
        let startTime = Date.now();
        while (Date.now() - startTime <= 10000) {
            window.scrollBy(0, 1000 * (Math.random() - 0.5));
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    });
}
