var twit = require("twit");
var config = require("./config.js");
var bot = twit(config);
var RiTa = require("rita");

var fetch = require("node-fetch");
fetch("http://127.0.0.1:3000/tweet.json")
  .then(response => response.json())
  .then(dataset => {
    let sentences = [];
    for (let data of dataset) {
      let text = data.tweet.full_text;
      text = text.split(/[@#]\w+|https:\/\/t\.co\/\w+|\n+/g).join(" ").trim().toLowerCase();
      if (!(/^rt\b/).test(text) && text.length > 0)
        sentences.push(text);
    }
    let model = new RiTa.markov(3);
    sentences = sentences.splice(9000, 10000);
    model.addText(sentences);
    setInterval(() => tweet(model.generate()), 5000);
  });

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