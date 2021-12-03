const twit = require("twit");
const config = require("./config.js");
const bot = twit(config);

const puppeteer = require("puppeteer");
var browser, page;
(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://127.0.0.1:3000/");
  page.on("console", message => {
    let text = message.text();
    console.log(text);
  });
})();

setInterval(generate, 1000 * 60);

async function generate() {
  let result = await page.evaluate(() => {
    return Promise.resolve(generate());
  });
  console.log(result);
  // if (happy && Math.random() > 0.5)
  //   text += emojis.happy[Math.floor(Math.random() * emojis.happy.length)];
  // else if (!happy && Math.random() > 0.5)
  //   text += emojis.sad[Math.floor(Math.random() * emojis.sad.length)];
  // tweet(text);
}

// const fetch = require("node-fetch");
//
// var happy = true;
// var emojis = {
//   "happy": ["😂", "🙃", "💛", "🥺", "🌼", "💜"],
//   "sad": ["😭"]
// };
//
// setInterval(() => {
//   fetch("https://api.openweathermap.org/data/2.5/weather?lat=13.101556425270013&lon=77.57196329497141&units=metric&appid=3d410dbee551d99b36d71387bbe879ec")
//     .then(response => response.json())
//     .then(data => {
//       let weather = data.weather[0].description;
//       if ((/rain | thunderstorm/g).test(weather))
//         happy = false;
//       else
//         happy = true;
//     });
// }, 1000 * 60 * 10);

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