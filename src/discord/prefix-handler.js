const data = require("./data.js");
const config = require("./config.json");

module.exports = (m) => {
  return data.prefixes.get(`users.${m.author.id}`) || data.prefixes.get(`servers.${m.guild.id}`) || config.prefix;
}