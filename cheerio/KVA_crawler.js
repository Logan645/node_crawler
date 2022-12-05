const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const iconv = require('iconv-lite'); //解決big5問題

async function crawler(url){
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const decode = iconv.decode(Buffer.from(buffer), 'big5')
    const $ = cheerio.load(decode);
    let list =$('body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr');
    const results = []
    for(const i of list){
        console.log($(i).find('td:nth-child(3)').text());
        results.push({
            // body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2) > a > font > b
            "負責人姓名": $(i).find('td:nth-child(2) > a > font > b').text(),
            // body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2) > b
            "診療機構名稱": $(i).find('td:nth-child(2) > b').text(),
            "電話": $(i).find('td:nth-child(3)').text(),
            "地址": null
        })
    }
}
url = 'https://www.kva.idv.tw/?Tsoft=1707&p=zsoft';
crawler(url)