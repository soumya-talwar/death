const fs = require("fs");
const fetch = require("node-fetch");
const RiTa = require("rita");

// var tweets = "";
//
// fetch("http://127.0.0.1:3000/tweet.json")
//   .then(response => response.json())
//   .then(dataset => {
//     for (data of dataset) {
//       let text = data.tweet.full_text;
//       let entities = {
//         "&amp;": "&",
//         "&gt;": ">",
//         "&lt;": "<"
//       };
//       text = text.split(/[@#]\w+|https:\/\/t\.co\/\w+|\n/g).join(" ").trim().toLowerCase().replace(/&.+;/g, match => entities[match]);
//       if (!(/^rt/g).test(text) && text.length > 0)
//         tweets += text + "\n";
//     }
//     fs.appendFile("./tweets.txt", tweets, error => {
//       if (error)
//         console.log(error);
//       else
//         console.log("file appended! :D");
//     });
//   });

var fics = "";

fetch("http://127.0.0.1:3000/fics.txt")
  .then(response => response.text())
  .then(text => {
    sentences = RiTa.sentences(text);
    for (sentence of sentences) {
      fics += sentence.toLowerCase() + "\n";
    }
    fs.appendFile("./text.txt", fics, error => {
      if (error)
        console.log(error);
      else
        console.log("file appended! :D");
    });
  });