const puppeteer = require('puppeteer');
const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

(async() =>{
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://datasupplied.com/blog/')
    await page.setViewport({
        width: 1200,
        height: 800
    })

    await autoScroll(page);
    await page.click('#popmake-6142 > button');
    const waitForTimeout = (t) =>new Promise((f)=>setTimeout(f,t))
    await waitForTimeout(1000)
    // await page.screenshot({
    //     path: 'test.png',
    //     fullPage: false
    //     })
    const titleList = await page.$$('div.fl-post-feed-header > h2 > a')
    let urlList = []
    // let tilteList =[]
    for(const i of titleList){
        const url = await page.evaluate(element => element.getAttribute('href'), i)
        // const title = await page.evaluate(element => element.textContent, i)
        urlList.push(url)
        // tilteList.push(title)
        // console.log(url);
    }
    // console.log(urlList);
    // console.log(tilteList);
    await browser.close();
    let results = []
    for(let j of urlList){
        const response = await fetch(j)
        const body = await response.text()
        const $ = cheerio.load(body);
        const title = $('head > title').text();
        const description = $('head > meta[name = description]').attr('content') 
        // const description = $('head > meta:nth-child(14)').attr('content') 正確的
        // <meta name="description" content="GA4 是 Google Analytics 4 的縮寫。 GA4 結合了通用版 GA 和 GA4F 兩項產品， 新版 GA4 主打的就是能夠同時追蹤 APP + Web 數據，並將跨裝置的使用者行為串接起來。本篇文章將會提供 GA4 介紹 。">
        const content = $('#post-content').html();
        results.push({
            "title": title,
            "description": description,
            "content": content
        })
    }
    // console.log(results.length);
    console.log(JSON.stringify(results));
})();

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