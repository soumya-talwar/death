var tweets = [];
var ngrams = {};
var n = 3;

fetch("archive/data/tweet.json")
  .then(response => response.json())
  .then(dataset => {
    for (data of dataset) {
      let text = data.tweet.full_text;
      if (!(/\bRT\b/).test(text)) {
        text = text.split(/@\w+\b|https:\/\/t\.co\/\w+|\n/g).join(" ").toLowerCase();
        text = text.split(/[\W\d_(\s\s+)]/g).join(" ").trim();
        if (text.length > 0)
          tweets.push(text);
      }
    }
    prepare();
    setInterval(generate, 5000);
  });

function prepare() {
  for (let tweet of tweets) {
    for (let i = 0; i < tweet.length - n - 1; i++) {
      let gram = tweet.substring(i, i + n);
      if (!ngrams[gram])
        ngrams[gram] = [];
      ngrams[gram].push(tweet.charAt(i + n));
    }
  }
}

function generate() {
  let text = "yoo";
  for (let i = 0; i < Math.floor(Math.random() * (280 - 100) + 100); i++) {
    let pos = text.substring(text.length - n, text.length);
    if (!ngrams[pos])
      break;
    text += ngrams[pos][Math.floor(Math.random() * ngrams[pos].length)];
  }
  console.log(text);
}