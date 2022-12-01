const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function crawler(){
    const response = await fetch('https://www.nonwoven.org.tw/index.php?Act=0&PK=10635&MK=0&EK=1&SK=0')
    const body = await response.text()
    const $ = cheerio.load(body)
    const list = $('#main > section > div > div > div:nth-child(1) > div > table > tbody > tr')
    let results = []
    for (let i of list){
        let info = $(i).find('td:nth-child(3)').text().trim().split('\n')
        let tel = info[1]
        // tel = tel.trim()
        results.push({
            "公司名稱":$(i).find('td:nth-child(1) > a').text(),
            "聯絡人": info[0],
            "電話": tel,
            "地址": info[2]
        })
    }
    // console.log(results);
    const { Parser } = require('json2csv');
    const parserObj = new Parser();
    const resultCsv = parserObj.parse(results)
    console.log(resultCsv);
}

crawler()