fetch("http://127.0.0.1:3000/tweet.json")
  .then(response => response.json())
  .then(dataset => {
    let sentences = [];
    for (data of dataset) {
      let text = data.tweet.full_text;
      if (!(/^RT\b/g).test(text)) {
        text = text.split(/[@#]\w+|https:\/\/t\.co\/\w+|\n/g).join(" ").trim().toLowerCase();
        if (text.length > 0)
          sentences.push(text);
      }
    }
    let model = RiTa.markov(3);
    sentences = sentences.splice(0, 1000);
    model.addText(sentences);
    console.log(model);
  });