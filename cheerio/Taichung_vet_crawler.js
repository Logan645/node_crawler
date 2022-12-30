//台中獸醫公會
const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


async function crawler(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    let list = $('#areaList > table > tbody > tr')
    let region = $('body > div > div:nth-child(3) > div.col-sm-5.col-md-4 > h5').text().split(' ')[0]
    // console.log(region);
    const results = []
    for(const i of list){
        results.push({
            "leader": $(i).find('small:nth-child(5)').text().trim().split('：')[1],
            "hospital": $(i).find('.h5').text().trim(),
            "tel": $(i).find('small:nth-child(3)').text().trim(),
            "address": region + $(i).find('small:nth-child(1)').text().trim(),
            "zone": region
        })
    }
    // console.log(JSON.stringify(results));
    return results
}

async function getUrlList(url){
    const urlList = [];
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const list = $('.col-xs-1')
    for(const i of list){
        urlList.push(
            'http://www.ctcvma.org.tw/'+ $(i).find('h5 small a').attr('href').split('/')[2]
            )
    }
    // console.log(urlList);
    return urlList;
}

async function main(url){
    let Urls = await getUrlList(url);
    let results = []
    for(const i of Urls){
        results = results.concat(await crawler(i))
    }
    console.log(JSON.stringify(results)); 
}

// crawler(url)
// getUrlList(url)
let url = 'http://www.ctcvma.org.tw/Organizations?areaCode=6600500' //北屯區
main(url)
//node cheerio/Taichung_vet_crawler.js > results/Taichung_vet_results.json
