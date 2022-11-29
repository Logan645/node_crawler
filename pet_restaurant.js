// https://eatmary.net/4953
const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function crawler(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const list = $('#article-detail-content > .block-radius')
    // #article-detail-content > div:nth-child(35) > center > ul
    //#article-detail-content > div:nth-child(49) > center > ul
    // #article-detail-content > div:nth-child(64) > center > ul

    const results = []
    for(const i of list){
        results.push({
            //#article-detail-content > div:nth-child(19) > center > ul > li:nth-child(4) > a
            "店家名稱": $(i).find('li:nth-child(4)> a').text(),
            "地址": $(i).find('li:nth-child(1)').text().split('：')[1].replace('(map)','').trim(),
            "電話": $(i).find('li:nth-child(2)').text().split('：')[1].trim(),
            "營業時間": $(i).find('li:nth-child(3)').text().split('：')[1].trim(),
            "網站": $(i).find('li:nth-child(4) > a').attr('href'),
            // #article-detail-content > div:nth-child(19) > center > ul > li:nth-child(5)
            "Google評星": $(i).find('li:nth-child(5)').text().split('：')[1],
        })
    }
    return results
}

async function getUrlList(){
    const response = await fetch('https://eatmary.net/5019');
    const body = await response.text();
    const $ = cheerio.load(body);
    // #article-detail-content > a:nth-child(211)
    // #article-detail-content > a:nth-child(214)
    // #article-detail-content > a:nth-child(217)
    const urlList = [];
    for(let i=211; i<=226; i+=3){
        const list = $(`#article-detail-content > a:nth-child(${i})`)
        urlList.push(list.attr('href'))
    }
    // console.log(urlList);
    return urlList
}
// getUrlList()

async function main() {
    const urlList =await getUrlList()
    let results = []
    for(let i of urlList){
        results = results.concat(await crawler(i))
    }
    console.log(JSON.stringify(results));
}
main()