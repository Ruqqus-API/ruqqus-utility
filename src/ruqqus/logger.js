const Discord = require("discord.js");
const data = require("../discord/data.js");
const client = require("../discord/bot").client;

module.exports = post => {
  if (data.logChannels.get(`${post.guild.name.toLowerCase()}`)) {
    let obj = data.logChannels.get(`${post.guild.name.toLowerCase()}`);

    let embed = new Discord.MessageEmbed()
      .setColor(post.guild.color)
      .setURL(post.full_link)
      .setTimestamp()
      .setImage(post.content.url)
      .setTitle(post.content.title)
      .setAuthor(`@${post.author.username}`, post.author.avatar_url, post.author.full_link)

    Object.values(obj).forEach(async (id, i) => {
      let webhook = await client.fetchWebhook(id);

      if (!webhook) {
        data.logChannels.unset(`${post.guild.name.toLowerCase()}.${Object.keys(obj)[i]}`);
        data.logChannels.save(); return;
      }

      webhook.send({
        username: `+${post.guild.name}`,
        avatarURL: post.guild.icon_url,
        embeds: [ embed ]
      })
    });
  }
}