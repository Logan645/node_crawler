//台南獸醫公會爬蟲
const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const results = [];
let url = 'http://www.tcvatainan.org.tw/?mode=hospital&area=&goto=1'

async function crawler(url){
    const response = await fetch(url);
    // const response = await fetch('http://www.tcvatainan.org.tw/?mode=hospital&area=&goto=1');
    const body = await response.text(); //網頁的一整份html
    // console.log(body);
    const $ = cheerio.load(body)
    // console.log($);
    //開發工具copy下來的selector可以直接使用，不用把>刪掉
    let target = $('#mainContent > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(1) > tbody > .text4')
    for(let i of target){
        let address = null;
        if($(i).find('td:nth-child(2) a').attr('href')){
            address = $(i).find('td:nth-child(2) a').attr('href')
            // console.log(address);
        }
        let region = $(i).find('td:nth-child(3)').text().split('區')[0].slice(3)+'區';
        if (region.length>3){
            region = '地址錯誤'
        }
        results.push({
            "hospital" : $(i).find('td:nth-child(1)').text(),
            "website": address,
            "address": $(i).find('td:nth-child(3)').text(),
            "tel": $(i).find('td:nth-child(4)').text(),
            "region": region
        })
    }
    // console.log(JSON.stringify(results));
    return results
}

async function main(){
    for(let i=1;i<11;i++){
        await crawler(`http://www.tcvatainan.org.tw/?mode=hospital&area=&goto=${i}`)
    }
    console.log(JSON.stringify(results));
}

main()

//node Tainan_vet_crawler.js > Tainan_vet_results.json
//node Tainan_vet_crawler.js > Test.txt