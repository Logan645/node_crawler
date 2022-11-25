const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function crawler(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const list = $('body > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr');
    let results = [];
    for(let i=2; i<list.length;i++){
        results.push({
            "診療機構名稱": $(list[i]).find('td:nth-child(1)').text().
        })
    }
    console.log(results);
}
// body > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(1)
let url = 'https://www.tpcvma.org.tw/area.php?id=3'
crawler(url)