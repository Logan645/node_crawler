// {
//     "number": "",
//     "name": "",
//     "website": "",
//     "address": "",
//     "phone": ""
// }

// 載入套件
const cheerio = require('cheerio'); //類似python的bs4
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function main() {
    const response = await fetch('http://www.twcia-cos.org.tw/member-list.php');
    const body = await response.text();
    const $ = cheerio.load(body)

    const results = []

    const members = $('.memList tr')

    for (const member of members) { //這行的寫法不太懂
        results.push({
            number: $(member).find('td:nth-child(1)').text(),
            name: $(member).find('td:nth-child(2)').text(),
            website: $(member).find('td:nth-child(3)').text(),
            address: $(member).find('td:nth-child(4)').text(),
            phone: $(member).find('td:nth-child(5)').text(),
        })
    }


    results.splice(0, 1)

    console.log(JSON.stringify(results))

}

main()