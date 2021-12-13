const twit = require("twit");
const config = require("./config.js");
const bot = twit(config);

const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
var browser, page;
(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("https://soumya-talwar.github.io/death/index.html");
  page.on("console", message => {
    let text = message.text();
    if (!(/webgl/gi).test(text))
      console.log(text);
  });
})();

var interval = setInterval(activate, 1000 * 30);
var excited, detached;

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
var cycle = [new Date(2021, 11, 18), new Date(2021, 11, 19), new Date(2021, 11, 20), new Date(2021, 11, 21)];

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

function activate() {
  let hour = new Date().date.getHours();
  if (Math.floor(Math.random() * 24) > Math.min(Math.abs(hour - 0), Math.abs(hour - 24)))
    analyse();
}

async function analyse() {
  let day = new Date().setHours(0, 0, 0, 0);
  let valid = false;
  for (let date of cycle) {
    if (date.getTime() === day.getTime())
      valid == true;
  }
  if (valid && !menstrual) {
    console.log("entering menstruating cycle D:");
    moods.excitement.value--;
    moods.selfdoubt.value++;
    menstrual = true;
  } else if (!valid && menstrual) {
    console.log("exiting menstruating cycle :D");
    moods.excitement.value++;
    moods.selfdoubt.value--;
    for (let date of cycle) {
      date.setDate(date.getDate() + 28);
    }
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
  if (mood > 1.5 && !excited) {
    console.log("excited!");
    clearInterval(interval);
    interval = setInterval(activate, 1000 * 60 * 5);
    excited = true;
    detached = false;
  } else if (mood < 1.5 && !detached) {
    console.log("detached!");
    clearInterval(interval);
    interval = setInterval(activate, 1000 * 60 * 60 * 5);
    detached = true;
    excited = false;
  }
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