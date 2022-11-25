//台北市獸醫公會爬蟲
const cheerio = require('cheerio'); //類似python的bs4
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const results = [];
async function getUrlArr() {
    const response = await fetch('https://www.tpvma.org.tw/');
    const body = await response.text();
    const $ = cheerio.load(body)
    const a_arr = $('#regionList li a')
    // console.log(a_arr[0]['attribs']['href']); 有比較快的找法嗎？
    const regionUrl = []
    // for (const member of members) { //這行的寫法不會  解：同python的for i in array概念
    for(let i = 0; i<a_arr.length; i++){
        regionUrl.push('https://www.tpvma.org.tw/'+a_arr[i]['attribs']['href'])
    }
    //完成所有網址的url arr
    return regionUrl
    //如何把這個arr拿出函式使用 要在函式外命名接住
}
async function crawler(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body)
    //body > table:nth-child(3) > tbody > tr:nth-child(1) > th:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1)
    const lists = $('table:nth-child(3) tbody tr:nth-child(1) th:nth-child(2) table:nth-child(3) tr')
    // console.log(lists[0]);
    // const results = [];
    for(let i=1; i<lists.length; i++){
        results.push({
            //不太知道這個的意思 td:nth-child(1)
            "姓名": $(lists[i]).find('td:nth-child(1)').text(),
            "服務單位": $(lists[i]).find('td:nth-child(2)').text(),
            "通訊處": $(lists[i]).find('td:nth-child(3)').text(),
            "電話": $(lists[i]).find('td:nth-child(4)').text()
        })   
    }
    // console.log(results);
    return results
}

async function main() {
    let urls = await getUrlArr()
    for (const url of urls) {
       await crawler(url)
    }
    console.log(JSON.stringify(results));
}

main()

//  node Taipei_vet_crawler.js > Taipei_vet_results.json