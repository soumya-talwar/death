var twit = require("twit");
var config = require("./config.js");
var bot = twit(config);

var wordsets = {};
var words = [];
// var ngrams = {};
// var n = 3;
var fetch = require("node-fetch");
fetch("http://127.0.0.1:3000/text.txt")
  .then(response => response.text())
  .then(text => {
    text = text.toLowerCase();
    words = text.split(/[\s.,;:?!"\-—\d()]+/g);
    for (let i = 0; i < words.length - 1; i++) {
      if (!wordsets[words[i]])
        wordsets[words[i]] = [];
      wordsets[words[i]].push(words[i + 1]);
    }
    // for (let i = 0; i < text.length - n - 1; i++) {
    //   let gram = text.substring(i, i + n);
    //   if (!ngrams[gram])
    //     ngrams[gram] = [];
    //   ngrams[gram].push(text.charAt(i + n));
    // }
    setInterval(() => tweet(generate()), 5000);
    // console.log(generate());
  });

function generate() {
  let result = [words[Math.floor(Math.random() * words.length)]];
  let length = result[0].length;
  let limit = Math.floor(Math.random() * (280 - 100) + 100);
  while (true) {
    let word = result[result.length - 1];
    let set = wordsets[word];
    let next = set[Math.floor(Math.random() * set.length)];
    length += next.length + 1;
    if (length - 1 > limit)
      break;
    result.push(next);
  }
  return (result.join(" "));
  // let text = "yoo";
  // for (let i = 0; i < Math.floor(Math.random() * (280 - 100) + 100); i++) {
  //   let pos = text.substring(text.length - n, text.length);
  //   if (!ngrams[pos])
  //     break;
  //   text += ngrams[pos][Math.floor(Math.random() * ngrams[pos].length)];
  // }
  // return text;
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