const editJSONFile = require("edit-json-file");

module.exports = {
  logChannels: new editJSONFile(`${__dirname}/data/log-channels.json`)
}