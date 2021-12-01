const twit = require("twit");
const config = require("./config.js");
const bot = twit(config);
const puppeteer = require("puppeteer");

setInterval(generate, 10000);

async function generate() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:3000/");
  page.on("console", message => {
    let text = message.text();
    if ((/^tweet:/).test(text)) {
      text = text.substring(7);
      tweet(text);
      browser.close();
    }
  });
}

function tweet(text) {
  bot.post("statuses/update", {
    status: text
  }, (error, data, response) => {
    if (error)
      console.log("something went wrong D:");
    else
      console.log("tweet sent! :D");
  });
}