const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const iconv = require('iconv-lite'); //解決big5問題

async function crawler(url){
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const decode = iconv.decode(Buffer.from(buffer), 'big5')
    const $ = cheerio.load(decode);
    const list =$('body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr');
    const pageResults = []
    for(let i=1; i<list.length/3; i++){
        // console.log(list[i]);
        pageResults.push({
            // body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2) > a > font > b
            // body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(10) > td:nth-child(2) > a > font > b
            "負責人姓名": $(list[(i-1)*3]).find('td:nth-child(2) > a > font > b').text(),
            // body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2) > b
            "診療機構名稱": $(list[(i-1)*3]).find('td:nth-child(2) > b').text(),
            // body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(3)
            "電話": $(list[(i-1)*3+1]).find('td:nth-child(3)').text().trim().split('地址：')[0].replace('電話：',''),
            "地址": $(list[(i-1)*3+1]).find('td:nth-child(3)').text().trim().split('地址：')[1]
        })
    }
    // console.log(results);
    return pageResults
}

// crawler(url)

// 取得page url list
async function getPageNumUrl(url){
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const decode = iconv.decode(Buffer.from(buffer), 'big5');
    const $ = cheerio.load(decode);
    const list =$('body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(61) > td > font > font:nth-child(3) > a');
    const PageNumUrl = [];
    for (let i of list) {
        PageNumUrl.push('https://www.kva.idv.tw/' + $(i).attr('href'))
    }
    // console.log(PageNumUrl);
    return PageNumUrl;
}
// getPageNumUrl(url)

//取得所有區域的網址

async function getPageUrl(url){
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const decode = iconv.decode(Buffer.from(buffer), 'big5');
    const $ = cheerio.load(decode);
    const list =$('#webleftarea > table > tbody > tr:nth-child(2) > td > table:nth-child(2) > tbody > tr');
    const pageUrl = [];
    for (let i = 0; i < list.length-1; i++) {
        pageUrl.push('https://www.kva.idv.tw/' + $(list[i]).find('td > a').attr('href'))
    }
    // console.log(pageUrl);
    return pageUrl;
}
// getPageUrl(url)

async function main(){
    const pageUrl = await getPageUrl('https://www.kva.idv.tw/?Tsoft=1707&p=zsoft');
    let results =[]
    for (let i of pageUrl){
        results = results.concat(await crawler(i));
        const pageNumUrl = await getPageNumUrl(i);
        for (let j of pageNumUrl){
            results = results.concat(await crawler(j));
        }
    }
    console.log(JSON.stringify(results));
}

main()