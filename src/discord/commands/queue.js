const Discord = require("discord.js");

module.exports = {
  name: "queue",
  description: "Queues a post for a specified time.",
  usage: "queue (clear|remove|list) <hours>:<minutes>:<seconds> <guild> <title>||(<body>)",
  async execute(m, client, ruqqus) {
    if (m.args[1] == "clear") {
      if (!global[m.author.id]) return m.channel.send("**Command Error** | There's nothing in your queue.");

      global[m.author.id].forEach(t => clearTimeout(t));
      delete global[m.author.id];

      return m.channel.send("Successfully cleared queue.");
    } else if (m.args[1] == "remove") {
      if (!global[m.author.id]) return m.channel.send("**Command Error** | There's nothing in your queue.");
      if (!m.args[2] || m.args[2] == " ") return m.channel.send("**Command Error** | No ID provided.");
      if (!global[m.author.id][+m.args[2]]) return m.channel.send("**Command Error** | Invalid ID.");

      clearTimeout(global[m.author.id][+m.args[2]]);
      global[m.author.id].splice(+m.args[2], 1);
      if (global[m.author.id].length == 0) delete global[m.author.id];

      m.channel.send(`Successfully removed ID \`${m.args[2]}\` from the queue.`);
    } else if (m.args[1] == "list") {
      if (!global[m.author.id]) return m.channel.send("**Command Error** | There's nothing in your queue.");

      let embed = new Discord.MessageEmbed()
        .setTitle(`${m.author.username}'s Post Queue`)
        .setColor("FFEE65")
        .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL())
        .setTimestamp()
        .addFields([
          { name: "ID", value: global[m.author.id].map((t, i) => `\`${i}\``), inline: true },
          { name: "Going live at...", value: global[m.author.id].map(t => `\`${new Date((Date.now() - t._idleStart) + t._idleTimeout).toLocaleString("en-US")}\``), inline: true }
        ]);

      m.channel.send(embed);
    } else {
      if (global[m.author.id] && global[m.author.id].length == 10) return m.channel.send("**Command Error** | You may only have 10 posts queued at a time.");

      let rd = await client.guilds.fetch("599258778520518676");
      let member = await rd.members.fetch(m.author.id).catch(e => {});

      if (!member) return m.channel.send("**User Error** | You must be a member of the Ruqqus Discord Server to perform this command.");
      if (!member.roles.cache.has("779872346219610123")) return m.channel.send("**User Error** | You must have your Ruqqus and Discord accounts linked to perform this command.");
      if (!m.args[1] || m.args[1] == " ") return m.channel.send("**Command Error** | No time data provided.");

      let timeData = m.args[1].match(/(\d{2}):(\d{2}):(\d{2})/g); 
      if (!timeData) return m.channel.send("**Command Error** | Invalid time data. Format: \`<hours>:<minutes>:<seconds>\` - make sure each part has two digits.");

      timeData = timeData[0].split(":").map(t => +t);
      let ms = timeData[0] * 3600000 + timeData[1] * 60000 + timeData[2] * 1000;
      if (ms > 86400000) return m.channel.send("**Command Error** | You can only queue a post for 24 hours or less.");

      if (global[m.author.id]) {
        let broken = false;
        global[m.author.id].forEach(t => {
          let newMs = t._idleStart + t._idleTimeout;
          if (Math.abs(ms - newMs) < 600000) broken = true;
        });
        if (broken) return m.channel.send("**Command Error** | Your queued posts must be at least 10 minutes apart each.");
      }
      
      if (!m.args[2] || m.args[2] == " ") return m.channel.send("**Command Error** | No guild provided.");
      let guild = await ruqqus.guilds.fetch(m.args[2]);
      if (!guild.id) return m.channel.send("**Command Error** | Invalid guild.");

      let username = member.nickname || member.user.username;
      if (!guild.guildmasters.map(x => x.username).includes(username)) return m.channel.send("**User Error** | You must be a guildmaster of that guild to queue a post.");

      let content = m.args.slice(3).join(" ").match(/(.*)\|\|(.*)/);
      if (!content) return m.channel.send("**Command Error** | Invalid content data. Format: \`<title>||<body>\` - can include spaces.");

      content = content.slice(1, 3);

      if (!content[0] || content[0] == " ") return m.channel.send("**Command Error** | No post title provided.");
      if (!content[1] || content[1] == " ") return m.channel.send("**Command Error** | No post body provided.");

      let queue = setTimeout(async () => {
        guild.post(`${content[0]} | ${username}`, { body: `${content[1]}\n\n<sub>I am a bot; this post was queued by ${m.author.tag} (@${username}) through Discord.</sub>` });
        m.author.send(`Your queued post to **+${guild.name}** just went live.`);
      }, ms);
      
      if (!global[m.author.id]) global[m.author.id] = [];
      global[m.author.id].push(queue);
      
      m.channel.send("Successfully added queue to the database. You will be notified when your post goes live.");
    }
  }
}