var tweets = [];
var sequences = [];
var pos = {};

fetch("http://127.0.0.1:3000/tweet.json")
  .then(response => response.json())
  .then(dataset => {
    for (data of dataset) {
      let text = data.tweet.full_text;
      let entities = {
        "&amp;": "&",
        "&gt;": ">",
        "&lt;": "<"
      };
      text = text.split(/[@#]\w+|https:\/\/t\.co\/\w+|\n/g).join(" ").trim().replace(/&.+;/g, match => entities[match]);
      if (!(/^RT\b/g).test(text) && text.length > 0) {
        let words = RiTa.tokenize(text);
        tweets.push(words);
        let tags = RiTa.pos(words);
        sequences.push(tags);
        for (let i = 0; i < tags.length; i++) {
          let tag = tags[i];
          if ((/^[A-Za-z]$/).test(tag) || !(/\w/).test(tag))
            break;
          if (!pos[tag])
            pos[tag] = [];
          pos[tag].push(words[i].toLowerCase());
        }
      }
    }
    for (let i = 0; i < 15; i++) {
      generate();
    }
  });

function generate() {
  let text = [];
  let index = Math.floor(Math.random() * sequences.length);
  let sequence = sequences[index];
  for (let i = 0; i < sequence.length; i++) {
    let tag = sequence[i];
    if (!pos[tag])
      text.push(tag);
    else if (!(/^nn$/g).test(tag))
      text.push(tweets[index][i]);
    else {
      let options = pos[tag];
      let word = options[Math.floor(Math.random() * options.length)];
      text.push(word);
    }
  }
  console.log(RiTa.untokenize(text));
}