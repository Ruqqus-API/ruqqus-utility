const Discord = require("discord.js");

module.exports = {
  name: "loglist",
  description: "Returns a list of the current channel's loggers.",
  usage: "loglist",
  async execute(m, client) {
    let webhooks = await m.channel.fetchWebhooks(); 
    webhooks = webhooks.array().filter(w => w.name.startsWith("UtilityLogger/") && w.owner.id == client.user.id);

    if (webhooks.length < 1) return m.channel.send("**Command Error** | There are no loggers in this channel.");

    let embed = new Discord.MessageEmbed()
      .setTitle(`#${m.channel.name} Logger List`)
      .setColor("FFEE65")
      .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
      .setTimestamp()
      .addFields([
        { name: "Name", value: webhooks.map(w => `\`${w.name.match(/UtilityLogger\/(.*)\//)[1]}\``), inline: true },
        { name: "ID", value: webhooks.map(w => `\`${w.id}\``), inline: true }
      ]);
    
    m.channel.send(embed);
  }
}