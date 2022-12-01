const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function crawlerPage(url){
    const data = []
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    if($('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(3)').text()){
        data.push({
        "公司名稱": $('#main-content > div.container > div.row > div > div.d-flex.bd-highlight.mb-3 > div.bd-highlight.page-title.pl-2.my-auto').text(),
        "公司網站":$('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(1) > a').text().trim(),
        "聯絡電話":$('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(2)').text().trim().split('：')[1].trim(),
        "傳真": $('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(3)').text().trim().split('：')[1].trim(),
        // "公司簡介": $('#main-content > div.container > div.row > div > div:nth-child(4) > p').text().replace('\n',''),
        // "服務簡介": $('#main-content > div.container > div.row > div > div:nth-child(6) > p').text().replace('\n','')
        })                
    }else{
        data.push({
            "公司名稱": $('#main-content > div.container > div.row > div > div.d-flex.bd-highlight.mb-3 > div.bd-highlight.page-title.pl-2.my-auto').text(),
            "公司網站":"",
            "聯絡電話":$('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(1)').text().trim().split('：')[1].trim(),
            "傳真": $('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(2)').text().trim().split('：')[1].trim(),
            // "公司簡介": $('#main-content > div.container > div.row > div > div:nth-child(4) > p').text().replace('\n',''),
            // "服務簡介": $('#main-content > div.container > div.row > div > div:nth-child(6) > p').text().replace('\n','')
            }) 
    }
    // console.log(JSON.stringify(data));
    return data
}
// crawlerPage('https://www.cisanet.org.tw/eBook/eBook_more/8972');

async function getPageUrlList(){
    const urlList = []
    //<112
    for (let page=1; page<112; page++){
        let url = 'https://www.cisanet.org.tw/eBook/_index';
        let config ={
            method:"POST",
            body:'text/html',
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            },
            payload:{
                p:page
            }
        }
        const response = await fetch(url,config);
        const body = await response.text();
        const $ = cheerio.load(body);
        const list = $('#Eservice > div > div.container > div.row.photo-cards > .col-md-4')
        for(const i of list){
            urlList.push('https://www.cisanet.org.tw'+$(i).find('div.card.shadow.mb-3 a').attr('href'))
        }
    }
    // console.log(urlList);
    return urlList
}
// urlList()

async function main(){
    let urlList = await getPageUrlList()
    let results = [];
    for(const url of urlList){
        results = results.concat(await crawlerPage(url))
    }
    // console.log(JSON.stringify(results));
    // results = JSON.stringify(results);
    // JSON.stringify之後會是字串形式就不是陣列了
    return results
}
// main()
const { Parser } = require('json2csv');
async function jsonToCsv(){
    let resultsJson = await main()
    // console.log('resultsJson:',resultsJson);
    const parserObj = new Parser();
    const resultCsv = parserObj.parse(resultsJson)
    console.log(resultCsv);
}
jsonToCsv()

// urlList('https://www.cisanet.org.tw/eBook/Index')




// async function crawlerPage(){
//     const results = [];
//     for(let i=485;i<8977;i++){
//         const response = await fetch(`https://www.cisanet.org.tw/eBook/eBook_more/${i}`);
//         if (response.status!='500'){
//             const body = await response.text();
//             const $ = cheerio.load(body);
//             if($('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(3)').text()){
//                 results.push({
//                 "公司名稱": $('#main-content > div.container > div.row > div > div.d-flex.bd-highlight.mb-3 > div.bd-highlight.page-title.pl-2.my-auto').text(),
//                 "公司網站":$('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(1) > a').text().trim(),
//                 "聯絡電話":$('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(2)').text().trim().split('：')[1].trim(),
//                 "傳真": $('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(3)').text().trim().split('：')[1].trim(),
//                 "公司簡介": $('#main-content > div.container > div.row > div > div:nth-child(4) > p').text().replace('\n',''),
//                 "服務簡介": $('#main-content > div.container > div.row > div > div:nth-child(6) > p').text().replace('\n','')
//                 })                
//             }else{
//                 results.push({
//                     "公司名稱": $('#main-content > div.container > div.row > div > div.d-flex.bd-highlight.mb-3 > div.bd-highlight.page-title.pl-2.my-auto').text(),
//                     "聯絡電話":$('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(1)').text().trim().split('：')[1].trim(),
//                     "傳真": $('#main-content > div.container > div.row > div > div.page-list-act.row.no-gutters > div > ul > li:nth-child(2)').text().trim().split('：')[1].trim(),
//                     "公司簡介": $('#main-content > div.container > div.row > div > div:nth-child(4) > p').text().replace('\n',''),
//                     "服務簡介": $('#main-content > div.container > div.row > div > div:nth-child(6) > p').text().replace('\n','')
//                     }) 
//             }
//         }
//     }
//     console.log(JSON.stringify(results));
// }

// crawlerPage()

//node cisanet_crawler.js > results/cisanet_results.json