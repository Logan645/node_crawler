const puppeteer = require('puppeteer')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs')

const download =async function(url, filename){
    await fetch(url).pipe(fs.createWriteStream(filename)).on("close",function(err,res){
        if(err){
            console.log(err);
        }else{
            fn&&fn();
        }
    }
)}
        

download('https://attach.mobile01.com/attach/202212/mobile01-5a11bc8c4e5310e0029183779c925fdd.jpg', "/"+ Date.now() + '.jpg')