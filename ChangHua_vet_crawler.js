//彰化獸醫公會爬蟲
const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const results = [];
let url = 'http://chvet.org.tw/editor_page.asp?sn=129';

async function main(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    let list = $('#view > font:nth-child(2) > span > span > table > tbody > tr')
    for(let i of list){
        results.push(
            {
                "負責人姓名":$(i).find('td:nth-child(1)').text(),
                "診療機構名稱":$(i).find('td:nth-child(2)').text(),
                "電話":$(i).find('td:nth-child(3)').text(),
                "地址":$(i).find('td:nth-child(4)').text(),
            }
        )
    }
    results.shift() //移除第一筆資料表頭
    console.log(JSON.stringify(results));
}

main(url)
//node ChangHua_vet_crawler.js > ChangHua_vet_results.json