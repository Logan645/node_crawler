(async () => {
    var i = 1, j=61;
    var gmap_urls=[];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage(); 
    await page.goto('https://www.google.com.tw/maps');
    for(const parks_name of parks_names){
      try{
      await page.waitForSelector('#searchboxinput');
      await page.waitForTimeout('2000');
      await page.type('#searchboxinput', parks_name);
      await page.click('#searchbox-searchbutton');
      //點分享
      await page.waitForSelector('#omnibox-singlebox > div.NaMBUd.omnibox-active > div.fKm1Mb > button > img');
      await page.waitForTimeout('2500');
      await page.click('#omnibox-singlebox > div.NaMBUd.omnibox-active > div.fKm1Mb > button > img');

      await page.waitForSelector('#settings > div > div.hdeJwf.dBl9De > ul > div:nth-child(5) > li:nth-child(1) > button > label');
      await page.waitForTimeout('2500');
      await page.click('#settings > div > div.hdeJwf.dBl9De > ul > div:nth-child(5) > li:nth-child(1) > button > label');
    
      //點擊插入地圖
      await page.waitForSelector('#modal-dialog > div > div.hoUMge > div > div.yFnP6d > div > div > div.m6QErb > div.rgIZ6c > button.zaxyGe.L6Bbsd.YTfrze');
      await page.waitForTimeout('2500');
      await page.click('#modal-dialog > div > div.hoUMge > div > div.yFnP6d > div > div > div.m6QErb > div.rgIZ6c > button.zaxyGe.L6Bbsd.YTfrze');
      await page.waitForTimeout('5000');
      const link = await page.$('div.m5XrEc');
      const href = await page.evaluate(element => element.querySelector("input").getAttribute('value'), link);
      console.log(`${href},`);  //find url
      i++;
      //console.log("here done");
      gmap_urls += href;
      gmap_urls += ",";
      await page.waitForTimeout('5000');
      await page.goto('https://www.google.com.tw/maps');
      if(parks_name === "香湖公園停車場"||parks_name === "福興鄉第一停車場"||parks_name === "衛生福利部彰化醫院停車場"||parks_name === "第二停車場"||parks_name === "廣停四停車場"||parks_name === "彰化監理站立體停車場"||parks_name === "城市車旅-天后宮站停車場"||parks_name === "高鐵站前停車場"||parks_name === "員林法院站停車場"||parks_name === "城市車旅-漢基2站停車場"||parks_name === "參山國家風景區管理處芬園休閒體健園區停車場"||parks_name === "田尾鄉公共造產停車場"||parks_name === "Times台中東海夜市停車場"||parks_name === "雅潭站停車場"||parks_name === "台灣聯通台中潭子停車場"||parks_name === "城市車旅-麗寶賽車立體停車場"||parks_name === "助安168台中高鐵停車場"||parks_name === "亞洲大學附屬醫院停車場"||parks_name === "中工管理顧問有限公司忠孝停車場"||parks_name === "清水區農會停車場"||parks_name === "安康B停車場"||parks_name === "臺鐵沙鹿火車站東站北側停車場"||parks_name === "巨鼎停車場"||parks_name === "城市車旅-旱溪站停車場"||parks_name === "仁愛泉生醫療大樓地下停車場"||parks_name === "豐原中山停車場"||parks_name === "台灣聯通台中崇德停車場"||parks_name === "宜盈資產管理有限公司龍五 停車場"||parks_name === "福華第二停車場"||parks_name === "城市車旅-雙十站停車場"||parks_name === "城市車旅-德祥站停車場"||parks_name === "Times台中忠明南路停車場"||parks_name === "和雲台中復興路四段二站停車場"||parks_name === "冠都汽機車停車場"||parks_name === "仁愛停車場"||parks_name === "新竹芎林鄉停1路外停車場"||parks_name === "新竹縣北埔鄉公有(鄧南光)停車場"||parks_name === "Times新竹橫山合興愛情車站停車場"||parks_name === "伍佰停車場"||parks_name === "小叮噹科學主題樂園停車場"||parks_name === "六福主題樂園停車場"||parks_name === "和平街停車場"||parks_name === "榮華停車場"||parks_name === " 北興停車場"||parks_name === "新竹港區第二停車場"||parks_name === "和一路(平面)停車場"){
        fs.writeFileSync(`C:\\Users\\Jerry\\Desktop\\gmap_crawker\\finish_gmap_urls\\${j}${tar_dist[j]}.html`, gmap_urls);
        console.log(`${j}${tar_dist[j]}gmap_urls.html pass pass pass`);
        gmap_urls = [];
        j++;
      }
    }catch (exception) {
      console.log(`${exception.name}: ${exception.message}`);
      console.log(parks_name);
      errors.push(parks_name);
    }
  }
    await browser.close();
    fs.writeFileSync(`errors.txt`, errors);
  }
  )();