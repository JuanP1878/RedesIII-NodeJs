const puppeteer = require("puppeteer");

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
  console.log("divs lenght = " + divs.length);

  const articles = [];
  for (const div of divs) {
    try {
      const title = await div.$eval(
        "a[id='dealTitle'",
        (element) => element.innerText
      );
      const imageUrl = await div.$eval("img", (element) =>
        element.getAttribute("src")
      );
      let price = await div.$eval(
        "span[class='gb-font-size-medium inlineBlock unitLineHeight dealPriceText']",
        (element) => element.innerText
      );
      let link = await div.$eval("a[id='dealTitle'", (element) =>
        element.getAttribute("href")
      );

      const article = {
        title,
        imageUrl,
        price,
        link,
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
      console.log("articles: ", articles);
      dataaux = articles[0];
    })
    .catch((err) => console.log(err));

module.exports.doWebScraping = doWebScraping;