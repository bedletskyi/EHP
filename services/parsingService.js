const { BrowserWindow } = require('electron');
const { Cluster } = require('puppeteer-cluster');
const cheerio = require('cheerio');
const UserAgent = require("user-agents");
const os = require('os');
const { write } = require('./fsService');

const CONCURRENCY = os.cpus().length;
const HOTLINE_URL = 'https://hotline.ua';
const NOT_ALLOWED_PRICE = ['уцененный', 'знижений у ціні'];

const parsePageContent = (page, priceData) => {
  const $ = cheerio.load(page);
  const priceList = [];
  $('.price.content .list__item').each((i, item) => {
    const condition = $(item)
      .find('.info__state')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    if (NOT_ALLOWED_PRICE.includes(condition)) {
      return;
    }

    const store = $(item)
      .find('.shop__title')
      .text()
      .replace(/\s+/g, ' ')
      .trim();
    const storeLink = HOTLINE_URL + $(item).find('.shop__logo').attr('href');
    const hotlinePrice = parseInt(
      $(item).find('.price__value').first().text().replace(/\s/g, ''),
      10
    );

    const currentPriceItem = {
      ...priceData,
      store,
      storeLink,
      hotlinePrice,
      hotlinePosition: i + 1
    };

    const duplicateItem = priceList.find(item => (
      item.store === currentPriceItem.store &&
      item.hotlinePrice === currentPriceItem.hotlinePrice
    ));

    if (!duplicateItem) {
      priceList.push(currentPriceItem);
    } else if (duplicateItem.hotlinePosition > currentPriceItem.hotlinePosition) {
      const duplicateItemIndex = priceList.findIndex(item => (
        item.store === currentPriceItem.store &&
        item.hotlinePrice === currentPriceItem.hotlinePrice
      ));
      priceList[duplicateItemIndex] = currentPriceItem;
    }
  });
  return priceList;
};

const parseDataFromHotline = async (
  prices,
  cb
) => {
  const win = BrowserWindow.getAllWindows()[0];
  const pricesLength = prices.length;
  let numberParsedItems = 0;
  let parsedData = [];

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: CONCURRENCY,
    monitor: true,
    puppeteerOptions: {
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    }
  });

  await cluster.task(async ({ page, data }) => {
    try {
      numberParsedItems += 1;
      const userAgent = new UserAgent();
      await page.setUserAgent(userAgent.toString());
      await page.goto(data.link);
      await page.click('div.col-xs-2.flex.right-xs span.sort__item');
      const content = await page.content();
      const price = parsePageContent(content ?? '', data);
      win.setProgressBar(numberParsedItems / pricesLength);
      parsedData = [...parsedData, ...price];
    } catch (err) {
      const textError = `Link: ${data.link}\n ${err.toString()}\n\n`;
      write(textError);
    }

    cb(numberParsedItems / pricesLength);
  });

  prices.forEach((item) => {
    cluster.queue(item);
  });

  await cluster.idle();
  await cluster.close();
  win.setProgressBar(-1);

  return parsedData;
};

module.exports = {
  parseDataFromHotline,
}
