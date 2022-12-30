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
                "leader":$(i).find('td:nth-child(1)').text(),
                "hospital":$(i).find('td:nth-child(2)').text(),
                "tel":$(i).find('td:nth-child(3)').text(),
                "address":$(i).find('td:nth-child(4)').text(),
                "region": $(i).find('td:nth-child(4)').text()[0]+ $(i).find('td:nth-child(4)').text()[1]+ $(i).find('td:nth-child(4)').text()[2]
            }
        )
    }
    results.shift() //移除第一筆資料表頭
    console.log(JSON.stringify(results));
}

main(url)
//node cheerio/ChangHua_vet_crawler.js > results/ChangHua_vet_results.json