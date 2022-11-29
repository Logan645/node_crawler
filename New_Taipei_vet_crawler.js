const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const iconv = require('iconv-lite'); //解決big5問題

async function crawler(url){
    const response = await fetch(url);
    const body = response.rawBody;
    console.log(body);
    const utf8body = iconv.decode(Buffer.from(body), "big5")
    console.log(utf8body);
    // console.log(response);
    // const body = await response.text();
    // console.log(body);
    
    // const $ = cheerio.load(body);
    // const list = $('body > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr');
    // let results = [];
    // for(let i=2; i<list.length;i++){
    //     results.push({
    //         "診療機構名稱": $(list[i]).find('td:nth-child(1)').text()
    //     })
    // }
    // console.log(results);
}

let url = 'https://www.tpcvma.org.tw/area.php?id=3'
crawler(url)