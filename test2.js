var start = "today ";

function setup() {
  const rnn = ml5.charRNN("https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/charRNN/woolf/", modelLoaded);

  function modelLoaded() {
    console.log("Model Loaded!");
  }

  rnn.generate({
    seed: start,
    length: Math.floor(Math.random() * (280 - 100) + 100)
  }, (err, results) => {
    console.log("start: " + start);
    console.log("generated text: " + start + results.sample);
  });
}