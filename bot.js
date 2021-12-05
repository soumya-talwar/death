const twit = require("twit");
const config = require("./config.js");
const bot = twit(config);

const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
var browser, page;
(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://127.0.0.1:3000/");
  page.on("console", message => {
    let text = message.text();
    if (!(/webgl/gi).test(text))
      console.log(text);
  });
})();

var moods = {
  "excitement": {
    "weight": 2,
    "value": 5
  },
  "selfdoubt": {
    "weight": 1,
    "value": 2
  }
};
var emojis = {
  "happy": ["😂", "🙃", "💛", "🥺", "🌼", "💜"],
  "sad": ["😭"]
};

var rain = false;
var menstrual = false;

var bts = bot.stream("statuses/filter", {
  follow: "335141638"
});
bts.on("tweet", tweet => {
  if (tweet.user.id_str === "335141638") {
    console.log("bts tweeted!");
    console.log(tweet);
    moods.excitement.value++;
    moods.selfdoubt.value--;
  }
});

var mention = bot.stream("statuses/filter", {
  track: "@soumya_dead"
});
mention.on("tweet", tweet => {
  let name = tweet.user.screen_name;
  let id = tweet.id_str;
  let quote = false;
  if (tweet.quoted_status) {
    if (!(/@soumya_dead/i).test(tweet.text))
      quote = true;
  }
  if (!quote && !tweet.retweeted_status)
    generate({
      "name": name,
      "id": id
    });
});

setInterval(analyse, 1000 * 60 * 5);

async function analyse() {
  let date = new Date();
  let day = date.getDate();
  if (day > 20 && day < 28 && !menstrual) {
    console.log("entering menstrual cycle D:");
    moods.excitement.value--;
    moods.selfdoubt.value++;
    menstrual = true;
  } else if (day > 20 && day < 28 && menstrual) {
    console.log("exiting menstrual cycle :D");
    moods.excitement.value++;
    moods.selfdoubt.value--;
    menstrual = false;
  }
  await fetch("https://api.openweathermap.org/data/2.5/weather?lat=13.101556425270013&lon=77.57196329497141&units=metric&appid=3d410dbee551d99b36d71387bbe879ec")
    .then(response => response.json())
    .then(data => {
      let weather = data.weather[0].description;
      if ((/rain | thunderstorm/g).test(weather) && !rain) {
        console.log("it's raining! D:");
        moods.excitement.value--;
        rain = true;
      } else if (!(/rain | thunderstorm/g).test(weather) && rain) {
        console.log("the rain stopped! :D");
        moods.excitement.value++;
        rain = false;
      }
    });
  generate();
}

async function generate(user) {
  let wsum = 0;
  let weights = 0;
  let inverse = 1;
  for (let mood in moods) {
    if (mood === "selfdoubt")
      inverse *= -1;
    wsum += moods[mood].value * moods[mood].weight * inverse;
    weights += moods[mood].weight;
  }
  let mood = wsum / weights;
  let result = await page.evaluate((mood) => {
    return Promise.resolve(generate(mood));
  }, mood);
  if (result.sentiment > 0.5 && Math.random() > 0.5)
    result.text += " " + emojis.happy[Math.floor(Math.random() * emojis.happy.length)];
  else if (result.sentiment < 0.5 && Math.random() > 0.5)
    result.text += " " + emojis.sad[Math.floor(Math.random() * emojis.sad.length)];
  console.log(result);
  if (!user)
    tweet(result.text);
  else
    reply("@" + user.name + " " + result.text, user.id);
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

function reply(text, tweetid) {
  bot.post("statuses/update", {
    in_reply_to_status_id: tweetid,
    status: text
  }, (error, data, response) => {
    if (error)
      console.log("something went wrong D:");
    else
      console.log("tweet sent! :D")
  });
}