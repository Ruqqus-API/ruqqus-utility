const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config.json");

module.exports = {
  name: "help",
  description: "Returns the list of commands or a command's usage.",
  usage: "`;help (<command>)`",
  execute(m) {
    if (!m.args[1] || m.args[1] == " ") {
      let commands = fs.readdirSync(__dirname).filter(f => f.endsWith(".js")).map(c => { let file = require(`./${c}`); return { name: file.name, description: file.description }});
      
      let embed = new Discord.MessageEmbed()
        .setTitle("**Utility** - Commands")
        .setColor("FFEE65")
        .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
        .setTimestamp()
        .addFields([
          { name: "Name", value: commands.map(c => c.name).join("\n"), inline: true },
          { name: "Description", value: commands.map(c => c.description).join("\n"), inline: true }
        ]);

      m.channel.send(embed);
    } else {
      let command = require(`./${m.args[1].toLowerCase()}`);
      if (!command.name) return m.channel.send("**Command Error** | Invalid command.");

      let embed = new Discord.MessageEmbed()
        .setTitle(`**Utility** - ${command.name} Info`)
        .setColor("FFEE65")
        .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
        .setTimestamp()
        .addFields([
          { name: "Description", value: command.description },
          { name: "Usage", value: `${config.prefix}${command.usage}` },
          { name: "Admin-only", value: command.admin ? "True" : "False" }
        ]);

      m.channel.send(embed);
    }
  }
}