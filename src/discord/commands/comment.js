const Discord = require("discord.js");

module.exports = {
  name: "comment",
  description: "Returns the data of a specified comment.",
  usage: "`;comment <id>`",
  async execute(m, client, ruqqus) {
    if (!m.args[1]) return m.channel.send("**Command Error** | No comment provided.");

    const comment = await ruqqus.comments.fetch(m.args[1]); let fields;
    if (!comment.id) return m.channel.send("**Command Error** | Invalid comment.");

    fields = [
      { 
        name: "Info", value: `
Comment ID: \`${comment.id} (${comment.full_id})\`
Created At: \`${new Date(comment.created_at * 1000).toLocaleString("en-US")}\`
Edited At: \`${comment.edited_at > 0 ? new Date(comment.edited_at * 1000).toLocaleString("en-US") : "Never"}\``
      },
      {
        name: "Author", value: `
Name: \`${comment.author.username}\`
User ID: \`${comment.author.id} (${comment.author.full_id})\`
Created At: \`${new Date(comment.author.created_at * 1000).toLocaleString("en-US")}\``
      },
      {
        name: "Stats", value: `
Score: \`${comment.votes.score}\`
Chain Level: \`${comment.chain_level}\`
Award Count: \`${comment.awards}\``
      },
      {
        name: "Flags", value: `
Is Archived: \`${comment.flags.archived}\`
Is Banned: \`${comment.flags.banned}\`
Is Deleted: \`${comment.flags.deleted}\`
Is NSFW: \`${comment.flags.nsfw}\`
Is NSFL: \`${comment.flags.nsfl}\`
Is Offensive: \`${comment.flags.offensive}\`
Is Bot: \`${comment.flags.bot}\``
      },
      {
        name: "Post", value: `
Title: \`${comment.post.content.title}\`
Author Name: \`${comment.post.author_name}\`
Post ID: \`${comment.post.id} (${comment.post.full_id})\`
Created At: \`${new Date(comment.post.created_at * 1000).toLocaleString("en-US")}\``
      },
      {
        name: "Guild", value: `
Name: \`${comment.guild.name}\`
Guild ID: \`${comment.guild.id} (${comment.guild.full_id})\`
Created At: \`${new Date(comment.guild.created_at * 1000).toLocaleString("en-US")}\``
      }
    ]

    let embed = new Discord.MessageEmbed()
      .setTitle(`Comment Info - ${comment.id}`)
      .setDescription(`${comment.content.text.slice(0, 100).trim()}${comment.content.text.length > 100 ? "..." : ""}`)
      .setURL(comment.full_link)
      .addFields(fields)
      .setColor(comment.guild.color || "#805AD5")
      .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
      .setTimestamp();

    if (comment.parent) embed.addField("Parent Comment", `Parent Body: \`${comment.parent.content.text.slice(0, 100).trim()}${comment.parent.content.text.length > 100 ? "..." : ""}\`
      Parent ID: \`${comment.parent.id} (${comment.parent.full_id})\`
      Created At: \`${new Date(comment.parent.created_at * 1000).toLocaleString("en-US")}\`
      Edited At: \`${comment.parent.edited_at > 0 ? new Date(comment.parent.edited_at * 1000).toLocaleString("en-US") : "Never"}\``);

    m.channel.send(embed);
  }
}