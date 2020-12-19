const Ruqqus = require("ruqqus-js");
Ruqqus.config.path(`${__dirname}/config.json`);

const client = new Ruqqus.Client();

module.exports = {
  client,
  run() {
    client.on("post", post => {
      require("./logger.js")(post);
      require("./notifier.js")(post);
    });
  }
}