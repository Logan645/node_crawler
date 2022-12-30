const puppeteer = require('puppeteer');

async function getGoogleMapApi(keyword){
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage(); // 開啟新分頁
    try{
        await page.goto('https://www.google.com.tw/maps'); // 進入指定頁面
        await page.waitForSelector('#searchboxinput')
        await page.type('input#searchboxinput', `${keyword}`); // Google地圖上搜尋地址
        await(await page.$('#searchboxinput')).press('Enter'); //對輸入匡點擊enter
        await page.waitForNavigation();
        
        //這塊常有等不到的問題
        //點擊分享
        await page.waitForTimeout(1000); //等幾秒確定物件有出現
        await page.waitForSelector('#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div:nth-child(4) > div:nth-child(5) > button > span > img')
        await page.click('#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div:nth-child(4) > div:nth-child(5) > button > span > img')
        
        //點擊插入地圖
        await page.waitForTimeout(1000); //等幾秒確定物件有出現
        await page.waitForSelector('.kARmKf > .m6QErb > .m6QErb > .rgIZ6c > .YTfrze')
        await page.click('.kARmKf > .m6QErb > .m6QErb > .rgIZ6c > .YTfrze')
    
        //取得API
        await page.waitForTimeout(1000); //等幾秒確定物件有出現
        await page.waitForSelector('#modal-dialog > div > div.hoUMge > div > div.yFnP6d > div > div > div > div.eNBuZ > div.m5XrEc > input[value]')
        const googleMapApi = await page.$eval('#modal-dialog > div > div.hoUMge > div > div.yFnP6d > div > div > div > div.eNBuZ > div.m5XrEc > input', el=>el.value)
        console.log(googleMapApi);
        await browser.close();
        return googleMapApi
    }
    catch(exception){
        console.log(`${exception.name}: ${exception.message}`);
        await browser.close();
        return null
    }
};

(async()=>{
    const data = require('../results/Taichung_vet_results.json')
    const results =[];
    for (const i of data){
        const googleMap =await getGoogleMapApi(i['hospital']+i['address']) ;
        i['googleMapApi'] = googleMap
        results.push(i);
    }
    for (const i of results){
        if(i['googleMapApi']===null){
            mapApi = await getGoogleMapApi(i['address'])
            i['googleMapApi'] = mapApi
        }
    }
    console.log(JSON.stringify(results)); 
})()

// const data = require('../results/Taichung_vet_results.json');
// console.log(JSON.stringify(results)); 

//node Puppeteer/TaichungVet.js > results/WordPress/TaichungVet.json    
