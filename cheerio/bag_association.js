// [{
//     "負責人":,
//     "統一編號":,
//     "公司網站":
    
// }]

const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function crawlerPage(url){
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    let result = [];
    let name=""
    let email = ""
    let tel =""
    let fax = ""
    if($('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(3)')){
        name = $('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(3)').text()
    }
    if($('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(5)')){
        email = $('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(5)').text()
    }
    if($('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(7)')){
        tel = $('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(7)').text()
    }
    if($('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(9)')){
        fax = $('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-3 > div > span:nth-child(9)').text()
    }
    result.push({
        "公司名": $('body > copyright > welcome > main > article.top-alla > section > div > div > div.col-lg-9 > div.col-12.p-0.d-flex.align-items-center > div > div.company-right > p.ch').text(),
        "負責人":$('#tab1 > div:nth-child(1) > div.col-lg-4.mb-3 > p:nth-child(1) > span').text(),
        "統一編號":$('#tab1 > div:nth-child(1) > div.col-lg-8 > p:nth-child(1) > span').text(),
        "公司網站":$('#tab1 > div:nth-child(1) > div.col-lg-8 > p:nth-child(2) > span').text(),
        "地址":$('#tab1 > div:nth-child(1) > div.col-lg-8 > p:nth-child(3) > span').text(),
        "業務聯絡人":name,
        "聯絡人信箱":email,
        "電話":tel,
        "傳真":fax
    })
    // console.log(result);
    return result
}
// crawlerPage('https://www.bags.org.tw/company_detail?id=124')

async function getPageUrlList(){
    const url = 'https://www.bags.org.tw/company_search?city=&factory=&q=&cate%5B%5D=10&cate%5B%5D=11&cate%5B%5D=12&cate%5B%5D=13&cate%5B%5D=14&cate%5B%5D=15&cate%5B%5D=16&cate%5B%5D=17&cate%5B%5D=18&cate%5B%5D=19&cate%5B%5D=20&cate%5B%5D=21&cate%5B%5D=22&cate%5B%5D=23&cate%5B%5D=24&cate%5B%5D=25&cate%5B%5D=26&cate%5B%5D=27&cate%5B%5D=54&cate%5B%5D=28'
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const list = $('a.company-box')
    let urlList =[]
    for(const i of list){
        urlList.push('https://www.bags.org.tw/'+$(i).attr('href'))
    }
    // console.log(urlList);
    return urlList
}

// getPageUrlList()

async function main(){
    let urlList = await getPageUrlList();
    let results = []
    for(let url of urlList){
        results = results.concat(await crawlerPage(url))
    }
    // console.log(results);
    const { Parser } = require('json2csv');
    const parserObj = new Parser();
    const resultCsv = parserObj.parse(results)
    console.log(resultCsv);
}

main()