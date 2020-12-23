const Discord = require("discord.js");

module.exports = {
  name: "guild",
  description: "Returns the data of a specified guild.",
  usage: "guild <name>",
  async execute(m, client, ruqqus) {
    if (!m.args[1]) return m.channel.send("**Command Error** | No guild provided.");

    const guild = await ruqqus.guilds.fetch(m.args[1]); let fields;
    if (!guild.id) return m.channel.send("**Command Error** | Invalid guild.");

    if (guild.ban_reason) {
      fields = [
        {
          name: "Info", value: `
Guild ID: \`${guild.id} (t4_${guild.id})\`
Ban Reason: \`${guild.ban_reason}\``
        }
      ]
    } else {
      fields = [
        { 
          name: "Info", value: `
Name: \`${guild.name}\`
Guild ID: \`${guild.id} (${guild.full_id})\`
Created At: \`${new Date(guild.created_at * 1000).toUTCString()}\``
        },
        {
          name: "Stats", value: `
Subscribers: \`${guild.subscribers}\``
        },
        {
          name: "Flags", value: `
Is Banned: \`${guild.flags.banned}\`
Is Private: \`${guild.flags.private}\`
Is Restricted: \`${guild.flags.restricted}\`
Is Age Restricted: \`${guild.flags.age_restricted}\`
Is Siege Protected: \`${guild.flags.siege_protected}\``
        },
        {
          name: `Guildmasters (${guild.guildmasters.length})`, value: guild.guildmasters.length > 0 ? guild.guildmasters.map(g => g.username).join(", ") : "None"
        }
      ];
    }

    let embed = new Discord.MessageEmbed()
      .setTitle(`Guild Info - ${guild.name}`)
      .setURL(guild.full_link)
      .addFields(fields)
      .setColor(guild.color || "#805AD5")
      .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
      .setTimestamp();
    
    if (guild.flags && !guild.flags.age_restricted) {
      embed.setImage(guild.banner_url);
      embed.setThumbnail(guild.icon_url);
    }

    m.channel.send(embed);
  }
}