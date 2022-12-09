//台北市獸醫公會爬蟲
const cheerio = require('cheerio'); //類似python的bs4
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const puppeteer = require('puppeteer');

async function getUrlArr() {
    const response = await fetch('https://www.tpvma.org.tw/');
    const body = await response.text();
    const $ = cheerio.load(body)
    const a_arr = $('#regionList li a')
    // console.log(a_arr[0]['attribs']['href']); 有比較快的找法嗎？
    const regionUrl = []
    for(let i = 0; i<a_arr.length; i++){
        regionUrl.push('https://www.tpvma.org.tw/'+a_arr[i]['attribs']['href'])
    }
    //完成所有網址的url arr
    return regionUrl
    //如何把這個arr拿出函式使用 要在函式外命名接住
}

async function getGoogleMapApi(address){
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage(); // 開啟新分頁
    try{
        await page.goto('https://www.google.com.tw/maps'); // 進入指定頁面
        await page.waitForSelector('#searchboxinput')
        await page.type('input#searchboxinput', `:${address}`); // Google地圖上搜尋地址
        await(await page.$('#searchboxinput')).press('Enter'); //對輸入匡點擊enter
        
        //點擊分享
        // await page.waitForTimeout(100)
        await page.waitForSelector('.m6QErb > .etWJQ:nth-child(5) > .g88MCb > .DVeyrd > .EgL07d')
        await page.click('.m6QErb > .etWJQ:nth-child(5) > .g88MCb > .DVeyrd > .EgL07d')
        
        //點擊插入地圖
        await page.waitForSelector('.kARmKf > .m6QErb > .m6QErb > .rgIZ6c > .YTfrze')
        await page.waitForTimeout(1000); //等幾秒確定物件有出現
        await page.click('.kARmKf > .m6QErb > .m6QErb > .rgIZ6c > .YTfrze')
    
        //取得API
        await page.waitForSelector('#modal-dialog > div > div.hoUMge > div > div.yFnP6d > div > div > div > div.eNBuZ > div.m5XrEc > input[value]')
        await page.waitForTimeout(1500); //等幾秒確定物件有出現
        const googleMapApi = await page.$eval('#modal-dialog > div > div.hoUMge > div > div.yFnP6d > div > div > div > div.eNBuZ > div.m5XrEc > input', el=>el.value)
        console.log(googleMapApi);
        await browser.close();
        return googleMapApi
    }
    catch{
        console.log('新增失敗');
        await browser.close();
        return null
    }
};

async function crawler(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body)
    //body > table:nth-child(3) > tbody > tr:nth-child(1) > th:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1)
    const lists = $('table:nth-child(3) tbody tr:nth-child(1) th:nth-child(2) table:nth-child(3) tr')
    // console.log(lists[0]);
    const results = [];
    for(let i=1; i< lists.length; i++){
        let address = $(lists[i]).find('td:nth-child(3)').text()
        mapApi = await getGoogleMapApi(address);
        results.push({
            "leader": $(lists[i]).find('td:nth-child(1)').text(),
            "hospital": $(lists[i]).find('td:nth-child(2)').text(),
            "address": address,
            "tel": $(lists[i]).find('td:nth-child(4)').text(),
            "googleMapApi": mapApi
        })
    }
    // console.log(results);
    return results
}

async function main() {
    let urls = await getUrlArr()
    let results = []
    for (const url of urls) {
       results =results.concat(await crawler(url))
    }
    console.log(JSON.stringify(results));
}

main()

//node cheerio/Taipei_vet_crawler.js > results/Taipei_vet_crawler.json
//node cheerio/Taipei_vet_crawler.js > results/test.json