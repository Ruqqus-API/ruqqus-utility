const editJSONFile = require("edit-json-file");

module.exports = {
  logChannels: new editJSONFile(`${__dirname}/data/log-channels.json`),
  notifyUsers: new editJSONFile(`${__dirname}/data/notify-users.json`),
  prefixes: new editJSONFile(`${__dirname}/data/prefixes.json`)
}