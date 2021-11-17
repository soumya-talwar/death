var markov = {};
markov.n = 3;
markov.sets = [];
markov.sets[0] = {};
markov.sets[1] = {};
markov.sets[2] = {};
markov.starts = [];
markov.ends = [];

fetch("http://127.0.0.1:3000/tweet.json")
  .then(response => response.json())
  .then(dataset => {
    for (data of dataset) {
      let text = data.tweet.full_text;
      text = text.split(/[@#]\w+|https:\/\/t\.co\/\w+|\n/g).join(" ").trim().toLowerCase();
      if (!(/^rt\b/g).test(text) && text.length > 0) {
        let words = RiTa.tokenize(text);
        markov.starts.push(words[0]);
        markov.ends.push(words[words.length - 1]);
        for (let s = 1; s <= 3; s++) {
          for (let i = 0; i < words.length - s; i++) {
            let set = "";
            for (let j = i; j < i + s; j++) {
              set += words[j] + " ";
            }
            set = set.trim();
            if (!markov.sets[s - 1][set])
              markov.sets[s - 1][set] = [];
            markov.sets[s - 1][set].push(words[i + s]);
          }
        }
      }
    }
    generate();
  });

function generate() {
  let text = [];
  let start = markov.starts[Math.floor(Math.random() * markov.starts.length)];
  let options = [];
  for (sequence in markov.sets[2]) {
    if (sequence.indexOf(start) == 0)
      options.push(sequence);
  }
  text = text.concat(options[Math.floor(Math.random() * options.length)].split(" "));
  let end = text[text.length - 1];
  while (!markov.ends.includes(end)) {
    let sequence = text[text.length - 3] + " " + text[text.length - 2] + " " + text[text.length - 1];
    let set = markov.sets[2][sequence];
    if (!set) {
      let sequence = text[text.length - 2] + " " + text[text.length - 1];
      let set = markov.sets[1][sequence];
      if (!set) {
        let sequence = text[text.length - 1];
        let set = markov.sets[0][sequence];
      }
    }
    end = set[Math.floor(Math.random() * set.length)];
    text.push(end);
  }
  console.log(text.join(" "));
}