var twit = require("twit");
var config = require("./config.js");
var bot = twit(config);

var ngrams = {};
var n = 5;
var fetch = require("node-fetch");
fetch("http://127.0.0.1:3000/text.txt")
  .then(response => response.text())
  .then(text => {
    text = text.toLowerCase();
    for (let i = 0; i < text.length - n - 1; i++) {
      let gram = text.substring(i, i + n);
      if (!ngrams[gram])
        ngrams[gram] = [];
      ngrams[gram].push(text.charAt(i + n));
    }
    setInterval(() => tweet(generate()), 5000);
  });

function generate() {
  let text = "yoong";
  for (let i = 0; i < Math.floor(Math.random() * (280 - 100) + 100); i++) {
    let pos = text.substring(text.length - n, text.length);
    if (!ngrams[pos])
      break;
    text += ngrams[pos][Math.floor(Math.random() * ngrams[pos].length)];
  }
  return text;
}

function tweet(text) {
  bot.post("statuses/update", {
    status: text
  }, (error, data, response) => {
    if (error)
      console.log("something went wrong D:");
    else
      console.log("tweet sent! :D");
  })
}