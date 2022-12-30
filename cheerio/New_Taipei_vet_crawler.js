const cheerio = require('cheerio'); //類似python的bs4;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const iconv = require('iconv-lite'); //解決big5問題

async function crawler(url){
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const decoded = iconv.decode(Buffer.from(buffer), 'big5')
    const $ = cheerio.load(decoded)
    const results = [];
    const list = $('body > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr')
    // console.log(list.length);
    if(list.length > 3){
        for(let i of list){
            results.push({
                "hospital":$(i).find('td:nth-child(1)').text(),
                "address":$(i).find('td:nth-child(4)').text(),
                "tel":$(i).find('td:nth-child(5)').text()
            })
        } 
    }
    results.shift()
    results.shift()
    // console.log(results);
    return results
}

let url = 'https://www.tpcvma.org.tw/area.php?id=3'
crawler(url)


async function main(){
    let allResults = [];
    for(let i=1; i<30; i++){
        allResults = allResults.concat(await crawler(`https://www.tpcvma.org.tw/area.php?id=${i}`))
    }
    console.log(JSON.stringify(allResults));
}

main()

