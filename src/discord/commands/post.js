const Discord = require("discord.js");

module.exports = {
  name: "post",
  usage: ";post <id>",
  description: "Returns the data of a specified post.",
  async execute(m, client, ruqqus) {
    if (!m.args[1]) return m.channel.send("**Command Error** | No post provided.");

    const post = await ruqqus.posts.fetch(m.args[1]); let fields;
    if (!post.id) return m.channel.send("**Command Error** | Invalid post.");

    fields = [
      { 
        name: "Info", value: `
        Domain: \`${post.content.domain}\`
        URL: \`${post.content.url}\`
        Post ID: \`${post.id} (${post.full_id})\`
        Created At: \`${new Date(post.created_at * 1000).toLocaleString("en-US")}\`
        Edited At: \`${post.edited_at > 0 ? new Date(post.edited_at * 1000).toLocaleString("en-US") : "Never"}\`
        Original Guild: \`${post.original_guild ? post.original_guild.name : "None"}\``
      },
      {
        name: "Author", value: `
        Name: \`${post.author.username}\`
        User ID: \`${post.author.id} (${post.author.full_id})\`
        Created At: \`${new Date(post.author.created_at * 1000).toLocaleString("en-US")}\``
      },
      {
        name: "Stats", value: `
        Score: \`${post.votes.score}\`
        Comment Count: \`${post.comments}\`
        Award Count: \`${post.awards}\``
      },
      {
        name: "Flags", value: `
        Is Archived: \`${post.flags.archived}\`
        Is Banned: \`${post.flags.banned}\`
        Is Deleted: \`${post.flags.deleted}\`
        Is NSFW: \`${post.flags.nsfw}\`
        Is NSFL: \`${post.flags.nsfl}\`
        Is Offensive: \`${post.flags.offensive}\`
        Is Political: \`${post.flags.political}\`
        Is Yanked: \`${post.flags.yanked}\``
      },
      {
        name: "Guild", value: `
        Name: \`${post.guild.name}\`
        Guild ID: \`${post.guild.id} (${post.guild.full_id})\`
        Created At: \`${new Date(post.guild.created_at * 1000).toLocaleString("en-US")}\``
      }
    ]

    let embed = new Discord.MessageEmbed()
      .setTitle(`Post Info - ${post.id}`)
      .setDescription(post.content.title)
      .setURL(post.full_link)
      .addFields(fields)
      .setColor(post.guild.color || "#805AD5")
      .setImage(post.embed)
      .setThumbnail(post.thumbnail)
      .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
      .setTimestamp();

    m.channel.send(embed);
  }
}