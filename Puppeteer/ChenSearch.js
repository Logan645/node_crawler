const puppeteer = require('puppeteer');
(async()=>{
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage(); // 開啟新分頁
    const keywords = ['陳鳳龍學歷', '陳鳳龍背景', '陳鳳龍年紀', '陳鳳龍經歷', '陳鳳龍維基百科']
    await page.goto('https://www.google.com/search?q=%E9%99%B3%E9%B3%B3%E9%BE%8D%E5%AD%B8%E6%AD%B7&ei=EK7gY7aBIoOwoAT714_ICQ&ved=0ahUKEwi2yZDAsYD9AhUDGIgKHfvrA5kQ4dUDCA8&uact=5&oq=%E9%99%B3%E9%B3%B3%E9%BE%8D%E5%AD%B8%E6%AD%B7&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIFCAAQgAQ6CggAEEcQ1gQQsAM6CQghEKABEAoQKjoHCCEQoAEQCjoFCCEQoAE6BQgAEKIEOgQIABBDOg0IABCABBANELEDEIMBOgcIABCABBANSgQIQRgASgQIRhgAUOsEWO4hYJEkaAFwAXgBgAFsiAGkB5IBBDEyLjKYAQCgAQHIAQrAAQE&sclient=gws-wiz-serp')
    //搜尋關鍵字
    for(const i of keywords){
        const inputElement = await page.$('#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input');
        await inputElement.evaluate(input => {
            input.value = '';
        });
        await page.type('#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input', `${i}`);
        await(await page.$('#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input')).press('Enter');
        await page.waitForTimeout(3000); //要改成60秒
        await page.click('#rso > div:nth-child(3) > div > div > div.Z26q7c.UK95Uc.jGGQ5e > div > a > h3');
        await autoScroll(page);
        await page.waitForTimeout(3000); //要改成60秒
        await page.goBack();
    }
    await browser.close();
})()

//捲動頁面
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve,) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
