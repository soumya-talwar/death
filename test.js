var wordsets = [];
var words = [];
var friends = [];

fetch("archive/data/tweet.json")
  .then(response => response.json())
  .then(dataset => {
    for (data of dataset) {
      let text = data.tweet.full_text;
      if (!(/^RT\b/).test(text)) {
        text = text.split(/[@#]\w+\b|https:\/\/t\.co\/\w+|\n/g).join(" ").trim().toLowerCase();
        if (text.length > 0) {
          let text2 = text.split(/[\W\d_]+/g);
          for (word of text2) {
            if (word.length > 0)
              words.push(word);
          }
        }
      }
    }
    prepare();
    generate();
  });

function prepare() {
  for (let w = 1; w <= 3; w++) {
    let wordset = {};
    for (let i = 0; i < words.length - w; i++) {
      let sequence = "";
      for (let j = i; j < i + w; j++) {
        sequence += words[j] + " ";
      }
      sequence = sequence.trim();
      if (!wordset[sequence])
        wordset[sequence] = [];
      wordset[sequence].push(words[i + w]);
    }
    wordsets[w - 1] = wordset;
  }
  console.log(wordsets);
}

function generate() {
  let sequences = Object.keys(wordsets[2]);
  let phrase = sequences[Math.floor(Math.random() * sequences.length)];
  console.log("phrase: " + phrase);
  let limit = Math.floor(Math.random() * (280 - 100) + 100);
  console.log("limit: " + limit);
  while (phrase.length < limit) {
    let current = phrase.match(/\b\w+\s\w+\s\w+\b$/g);
    console.log("current: " + current);
    let set = wordsets[2][current];
    if (!set) {
      current = phrase.match(/\b\w+\s\w+\b$/g);
      set = wordsets[1][current];
      if (!set) {
        current = phrase.match(/\b\w+\b$/g);
        set = wordsets[0][current];
      }
    }
    console.log("set: " + set);
    let next = set[Math.floor(Math.random() * set.length)];
    console.log("next: " + next);
    if ((phrase + " " + next).length > limit)
      break;
    phrase += " " + next;
  }
  console.log(phrase);
}