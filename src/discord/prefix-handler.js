const data = require("./data.js");
const config = require("./config.json");

module.exports = (m) => {
  if (m.channel.type == "text") {
    return data.prefixes.get(`users.${m.author.id}`) || data.prefixes.get(`servers.${m.guild.id}`) || config.prefix;
  } else {
    return data.prefixes.get(`users.${m.author.id}`) || config.prefix;
  }
}