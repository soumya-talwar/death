var pos = {};
var sequences = [];
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
    generate();
  });

function generate() {
  let text = [];
  let sequence = sequences[Math.floor(Math.random() * sequences.length)];
  for (tag of sequence) {
    if (!pos[tag])
      text.push(tag);
    else {
      let options = pos[tag];
      let word = options[Math.floor(Math.random() * options.length)];
      text.push(word);
    }
  }
  console.log(RiTa.untokenize(text));
}