const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function crawler(url){
    const response = await fetch(url)
    const body = await response.text()
    const $ = cheerio.load(body)
    // body > div:nth-child(4) > main > div > div > article > div.memberlist > ul > li:nth-child(2) > div:nth-child(1)
    const list = $('body > div:nth-child(4) > main > div > div > article > div.memberlist > ul > li.member.get ')
    let results = [];
    for (const i of list){
        let website = ""
        if($(i).find('div > a')){
            website = $(i).find('div > a').attr('href')
        }
        results.push({
            "公司名稱": $(i).find('div:nth-child(2) > h3').text(),
            "網站": website,
            "電話": $(i).find('div:nth-child(3)').text(),
            "傳真": $(i).find('div:nth-child(4)').text(),
        })
    }
    return results
    console.log(results);
}
async function main(){
    let results = [];
    for(let page=1;page<17;page++){
        results = results.concat(await crawler(`https://weaving.org.tw/members/page/${page}/`))
    }
    // console.log(results);
    const { Parser } = require('json2csv');
    const parserObj = new Parser();
    const resultsCsv = parserObj.parse(results)
    console.log(resultsCsv);
}

main()

