var twit = require("twit");
var config = require("./config");
var bot = new twit(config);

tweet(Date.now());

function tweet(text) {
  bot.post("statuses/update", {status: text}, function (error, data, response) {
    if (error)
      console.log("something went wrong D:");
    else
      console.log("tweet sent! :D")
  });
}
