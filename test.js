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
        for (let s = 1; s <= 3; s++) {
          for (let i = 0; i < words.length - s; i++) {
            let sequence = "";
            for (let j = i; j < i + s; j++) {
              sequence += words[j] + " ";
            }
            sequence = sequence.trim();
            if (!markov.sets[s - 1][sequence])
              markov.sets[s - 1][sequence] = [];
            markov.sets[s - 1][sequence].push(words[i + s]);
            if (i == words.length - s - 1 && s == 3)
              markov.ends.push(sequence.substring(sequence.indexOf(" ") + 1) + " " + words[i + s]);
          }
        }
      }
    }
    for (let i = 0; i < 30; i++) {
      generate();
    }
  });

function generate() {
  let text = [];
  let start = markov.starts[Math.floor(Math.random() * markov.starts.length)];
  console.log(start);
  let options = [];
  for (sequence in markov.sets[2]) {
    if (sequence.indexOf(start) == 0)
      options.push(sequence);
  }
  console.log(options);
  let option = options[Math.floor(Math.random() * options.length)];
  console.log(option);
  text = text.concat(option.split(" "));
  // let end = text.join(" ");
  // do {
  //   let set = [];
  //   let sequence1 = text[text.length - 3] + " " + text[text.length - 2] + " " + text[text.length - 1];
  //   let set1 = markov.sets[2][sequence1];
  //   if (set1)
  //     set = set.concat(set1);
  //   let sequence2 = text[text.length - 2] + " " + text[text.length - 1];
  //   let set2 = markov.sets[1][sequence];
  //   if (set2)
  //     set = set.concat(set2);
  //   // let sequence3 = text[text.length - 1];
  //   // let set3 = markov.sets[0][sequence];
  //   // if (set3)
  //   //   set = set.concat(set3);
  //   let next = set[Math.floor(Math.random() * set.length)];
  //   text.push(next);
  //   end = text[text.length - 3] + " " + text[text.length - 2] + " " + text[text.length - 1];
  // } while (!markov.ends.includes(end))
  // console.log(text.join(" "));
}

// deal with punctuation & spaces
// deal with &amp;
// multiple lines & full-stops
// grammar with markov chains
// make rules with existing grammar in tweets (pos with rita.js)
// emotions affecting behaviour
// words sorted by sentiment
// tweets sorted by replies / threads / qrt
// friends ranked by interaction & extracting their tweets based on closeness
// reading new articles by api & calculating interest
// images / art
// direct messages / exploring trends