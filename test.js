var model;
var sentences = [];

fetch("./tweet.json")
  .then(response => response.json())
  .then(dataset => {
    for (let data of dataset) {
      let text = data.tweet.full_text;
      text = text.split(/[@#]\w+|https:\/\/t\.co\/\w+|\n+/g).join(" ").trim().toLowerCase();
      if (!(/^rt\b/).test(text) && text.length > 0)
        sentences.push(text);
    }
    model = new RiTa.markov(3);
    sentences = sentences.splice(9000, 10000);
    model.addText(sentences);
    for (let i = 0; i < 10; i++) {
      console.log(model.generate());
    }
  });