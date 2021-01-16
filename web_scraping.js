const puppeteer = require("puppeteer");
var fs = require('fs');
//Date format
const dateFormat = require("dateformat");

async function doWebScraping() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 19, height: 800 });
  await page.goto("https://www.amazon.com.mx/gp/goldbox?ref_=nav_cs_gb", {
    waitUntil: "networkidle2",
  });

  let divs = [];
  divs = await page.$$('div[id="widgetContent"] > div');
  //console.log("divs lenght = " + divs.length);

  const articles = [];
  for (const div of divs) {
    try {
      const name = await div.$eval(
        "a[id='dealTitle'",
        (element) => element.innerText
      );
      const img_url = await div.$eval("img", (element) =>
        element.getAttribute("src")
      );
      let price = await div.$eval(
        "span[class='gb-font-size-medium inlineBlock unitLineHeight dealPriceText']",
        (element) => element.innerText
      );
      let deal_url = await div.$eval("a[id='dealTitle'", (element) =>
        element.getAttribute("href")
      );

      const article = {
        name,
        img_url,
        price,
        deal_url,
      };
      articles.push(article);
      //break
    } catch (err) {
      console.log("error: ", err);
    }
  }

  await browser.close();
  return articles;
}

doWebScraping()
  .then((articles) => {
    //console.log("articles: ", articles[0]);
    dataaux = articles[0];
    /*Leer archivo Json y agregar nueva oferta*/
    fs.readFile('deals.json', function (err, content) {
      if (err) throw err;
      var parseJson = JSON.parse(content);
      //console.log(parseJson)
      //console.log("*****")
      let date = new Date();
      let formatDate = dateFormat(date, "dd/mm/yyyy");
      dataaux.date = formatDate
      parseJson.push(dataaux)
      //console.log(parseJson)
      fs.writeFile('deals.json',JSON.stringify(parseJson,null,2),function(err){
        if(err) throw err;
      })
    })
  })
  .catch((err) => console.log(err));

module.exports.doWebScraping = doWebScraping;