const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function crawler(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const result = [];
    const data = $('#__next > div > div > div > div.jsx-2311262307.content > main > div.jsx-3204095536.main-content > div.jsx-3204095536.left-column > div.jsx-1969054371 > div.jsx-1969054371.restaurant-info > div > div.jsx-1969054371.info')
    result.push({
        "店家名稱": $(data).find('div.jsx-1969054371.info > div.jsx-1969054371.fb-wrapper.wrap > span.jsx-1969054371.detail > a').text(),
        "均消價位": $(data).find('div.jsx-1969054371.info > div:nth-child(3) > span.jsx-1969054371.detail').text().split(' ')[1],
        "地址": $(data).find('div:nth-child(2) > span.jsx-1969054371.detail').text(),
        // // "臉書頁面":,
        "電話": $('div.jsx-1969054371.phone-wrapper.wrap > span.jsx-1969054371.detail > a').text(),
    })
    // console.log(JSON.stringify(result));
    return result
}
// crawler('https://ifoodie.tw/restaurant/5e2c206e2261391fc7eeed2c-Bo.Bo.Cafe-%E8%B1%B9%E8%B1%B9%E5%92%96%E5%95%A1%C2%B7%E6%A3%AE%E6%9E%97%E9%A4%A8')

async function getUrlList(){
    const urlList = [];
    for(let page=1; page<50; page++){
        const response = await fetch(`https://ifoodie.tw/explore/list/%E5%AF%B5%E7%89%A9%E5%8F%8B%E5%96%84?page=${page}`);
        const body = await response.text();
        const $ = cheerio.load(body);
        const list = $('a.jsx-3292609844.click-tracker')
        for (const i of list){
            urlList.push( 'https://ifoodie.tw' + $(i).attr('href'))
        }
    }
    // console.log(urlList.length);
    return urlList
}
// getUrlList()

async function main(){
    let results = [];
    let urlList = await getUrlList();
    for(let i of urlList){
        results = results.concat(await crawler(i))
    }
    console.log(JSON.stringify(results));
}

main()
//node pet_friendly_restaurant.js > results/pet_friendly_restaurant.json 