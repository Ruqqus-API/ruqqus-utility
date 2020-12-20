const Discord = require("discord.js");

module.exports = {
  name: "user",
  usage: "user <username>",
  description: "Returns the data of a specified user.",
  async execute(m, client, ruqqus) {
    if (!m.args[1]) return m.channel.send("**Command Error** | No user provided.");

    const user = await ruqqus.users.fetch(m.args[1]); let fields;
    if (!user.id) return m.channel.send("**Command Error** | Invalid user.");

    if (user.ban_reason !== undefined) {
      fields = [
        {
          name: "Info", value: `
User ID: \`${user.id} (t1_${user.id})\`
Ban Reason: \`${user.ban_reason}\``
        }
      ]
    } else if (user.deleted) {
      fields = [
        {
          name: "Info", value: `
User ID: \`${user.id} (t1_${user.id})\`
Deleted: \`${user.deleted}\``
        }
      ]
    } else {
      fields = [
        { 
          name: "Info", value: `
Name: \`${user.username}\`
Title: \`${user.title ? user.title.name.replace(",", " ").trim() + ` (${user.title.color.toUpperCase()})` : "None"}\`
User ID: \`${user.id} (${user.full_id})\`
Created At: \`${new Date(user.created_at * 1000).toLocaleString("en-US")}\``
      },
      {
        name: "Stats", value: `
Post Count: \`${user.stats.posts}\`
Post Rep: \`${user.stats.post_rep}\`
Comment Count: \`${user.stats.comments}\`
Comment Rep: \`${user.stats.comment_rep}\``
        },
        {
          name: "Flags", value: `
Is Banned: \`${user.flags.banned}\`
Is Private: \`${user.flags.private}\`
Is Premium: \`${user.flags.premium}\``
        },
        {
          name: `Badges (${user.badges.length})`, value: user.badges.length > 0 ? user.badges.map(b => b.name).join(", ") : "None"
        }
      ]
    }

    let embed = new Discord.MessageEmbed()
      .setTitle(`User Info - ${user.username}`)
      .setURL(user.full_link)
      .addFields(fields)
      .setColor(user.title ? user.title.color : "#805AD5")
      .setImage(user.banner_url)
      .setThumbnail(user.avatar_url)
      .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
      .setTimestamp();

    m.channel.send(embed);
  }
}