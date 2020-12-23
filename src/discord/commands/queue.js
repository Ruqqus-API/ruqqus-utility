const Discord = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const chrono = require("chrono-node");

module.exports = {
  name: "queue",
  description: "Queues a post for a specified time.",
  usage: "queue (clear|remove|list) <guild> | <title> | <body|url|\"None\"> | <time data> (<image upload>)",
  async execute(m, client, ruqqus) {
    if (m.args[1] == "clear") {
      if (!global[m.author.id]) return m.channel.send("**Command Error** | There's nothing in your queue.");

      global[m.author.id].forEach(t => clearTimeout(t.timer));
      delete global[m.author.id];

      return m.channel.send("Successfully cleared queue.");
    } else if (m.args[1] == "remove") {
      if (!global[m.author.id]) return m.channel.send("**Command Error** | There's nothing in your queue.");
      if (!m.args[2] || m.args[2] == " ") return m.channel.send("**Command Error** | No ID provided.");
      if (!global[m.author.id][+m.args[2] - 1]) return m.channel.send("**Command Error** | Invalid ID.");

      clearTimeout(global[m.author.id][+m.args[2] - 1].timer);
      global[m.author.id].splice(+m.args[2] - 1, 1);
      if (global[m.author.id].length == 0) delete global[m.author.id];

      m.channel.send(`Successfully removed ID \`${m.args[2]}\` from the queue.`);
    } else if (m.args[1] == "list") {
      if (!global[m.author.id]) return m.channel.send("**Command Error** | There's nothing in your queue.");

      let embed = new Discord.MessageEmbed()
        .setTitle(`${m.author.username}'s Post Queue`)
        .setColor("FFEE65")
        .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
        .setTimestamp()
        .setDescription(global[m.author.id].map((t, i) => `\`${i + 1}.\` ${t.content[0]} (+${t.guild}) **[${prettyMilliseconds(t.timer._idleTimeout - (Date.now() - t.now))}]**`));

      m.channel.send(embed);
    } else {
      if (global[m.author.id] && global[m.author.id].length == 10) return m.channel.send("**Command Error** | You may only have 10 posts queued at a time.");

      let rd = await client.guilds.fetch("599258778520518676");
      let member = await rd.members.fetch(m.author.id).catch(e => {});

      if (!member) return m.channel.send("**User Error** | You must be a member of the Ruqqus Discord Server to perform this command.");
      if (!member.roles.cache.has("779872346219610123")) return m.channel.send("**User Error** | You must have your Ruqqus and Discord accounts linked to perform this command.");
      
      m.args = m.input.split(" | ");
      
      if (!m.args[0] || m.args[0] == " ") return m.channel.send("**Command Error** | No guild provided.");
      let guild = await ruqqus.guilds.fetch(m.args[0]);
      if (!guild.id) return m.channel.send("**Command Error** | Invalid guild.");

      let username = member.nickname || member.user.username;
      if (!guild.guildmasters.map(x => x.username).includes(username)) return m.channel.send("**User Error** | You must be a guildmaster of that guild to queue a post.");
      
      let content = [ m.args[1], m.args[2] ];
      if (content[1] && content[1].toLowerCase() == "none") content[1] = null;
      
      let url = null; if (content[1] && content[1].startsWith("https://") && !m.attachments.first()) url = content[1];
      else if (m.attachments.first()) url = m.attachments.first().proxyURL;

      if (!content[0] || content[0] == " ") return m.channel.send("**Command Error** | No post title provided.");
      if ((!content[1] || content[1] == " ") && !url) return m.channel.send("**Command Error** | No post body or URL provided.");

      if (!m.args[3] || m.args[3] == " ") return m.channel.send("**Command Error** | No time data provided.");

      let timeData = chrono.parseDate(m.args[3], new Date());
      if (!timeData) return m.channel.send("**Command Error** | Invalid time data. Format using a human-readable time input; for example, \`in 5h 22m\` or \`3 minutes and 57 seconds from now\`.");

      let ms = timeData.getTime() - Date.now();
      if (ms > 604800000) return m.channel.send("**Command Error** | You can only queue a post for 7 days or less.");

      if (global[m.author.id]) {
        let broken = false;
        global[m.author.id].forEach(t => {
          let newMs = t.timer._idleStart + t.timer._idleTimeout;
          if (Math.abs(ms - newMs) < 600000) broken = true;
        });
        if (broken) return m.channel.send("**Command Error** | Your queued posts must be at least 10 minutes apart each.");
      }

      let queue = setTimeout(async () => {
        guild.post(`${content[0]} | ${username}`, { body: `${content[1] ? `${content[1]}\n\n` : " " }<sub>I am a bot; this post was queued by ${m.author.tag} (@${username}) through Discord.</sub>`, url });
        m.author.send(`Your queued post to **+${guild.name}** just went live.`);

        clearTimeout(queue);
        global[m.author.id].splice(global[m.author.id].indexOf({ timer: queue, content, url }), 1);
        if (global[m.author.id].length == 0) delete global[m.author.id];
      }, ms);
      
      if (!global[m.author.id]) global[m.author.id] = [];
      global[m.author.id].push({ timer: queue, content, guild: guild.name, url, now: Date.now() });
      
      m.channel.send(`Successfully added queue to the database. You will be notified when your post goes live.${ms > 86400000 ? "\n\n> It looks like you've queued a post for over a day. Unfortunately, all queue lists clear when the bot restarts or goes offline. While this shouldn't happen often, make sure to check your queue list from time to time just to be sure." : ""}`);
    }
  }
}