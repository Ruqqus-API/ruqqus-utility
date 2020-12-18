const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();

let commands = {}, files = fs.readdirSync(`${__dirname}/commands`).filter(f => f.endsWith(".js"));
for (const file of files) { let c = require(`./commands/${file}`); commands[c.name] = c; }

module.exports = {
  client,
  run() {
    const config = require("./config.json");
    const ruqqus = require("../ruqqus/bot.js").client;

    client.on("message", m => {
      if (m.author.bot) return;
      if (!m.content.startsWith(config.prefix)) return;

      m.args = m.content.slice(config.prefix.length).split(" "); // The real arguments (including the prefix)
      m.command = m.args[0].toLowerCase(); // The command (joined with prefix, but prefix not included)
      m.input = m.args.slice(1).join(" "); // The inputs after the command

      if (!commands[m.command]) return;

      try {
        commands[m.command].execute(m, client, ruqqus);
      } catch (e) {
        m.channel.send("There was an error trying to execute that command!"); console.error(e);
      }
    });

    client.login(config.token);
  }
}