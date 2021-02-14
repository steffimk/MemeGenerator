var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();

// Get screenshot for url
// source: https://medium.com/@mishra.ankit/use-puppeteer-expressjs-to-create-your-own-screenshot-api-e5e7559cc32b
router.get('/', async (req, res, next) => {
  let url = req.query.url;

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);
    const image = await page.screenshot({fullPage : true});
    await browser.close();
    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    res.status(400);
    res.send();
  }
});



module.exports = router;
