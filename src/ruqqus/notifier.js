const Discord = require("discord.js");
const data = require("../discord/data.js");
const client = require("../discord/bot").client;

module.exports = post => {
  if (data.notifyUsers.get(`${post.guild.name.toLowerCase()}`)) {
    let obj = data.notifyUsers.get(`${post.guild.name.toLowerCase()}`);

    let embed = new Discord.MessageEmbed()
      .setColor(post.guild.color)
      .setURL(post.full_link)
      .setTimestamp()
      .setImage(post.content.url)
      .setTitle(`New post in **+${post.guild.name}**!`)
      .setDescription(`"${post.content.title}"`)
      .setAuthor(`@${post.author.username}`, post.author.avatar_url, post.author.full_link)

    Object.keys(obj).forEach(id => {
      client.users.fetch(id).then(u => {
        u.send(embed);
      });
    });
  }
}