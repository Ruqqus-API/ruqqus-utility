const config = require("../config.json");
const data = require("../data.js");

module.exports = {
  name: "prefix",
  description: "Sets the prefix of the server or user.",
  usage: "prefix (user|server) (<prefix>)",
  async execute(m) {
    function checkPrefix() {
      if (!m.args[2] || m.args[2] == " ") return m.channel.send("**Command Error** | No prefix provided.");
      if (m.args[2].length > 2 || m.args[2].includes(".")) return m.channel.send("**Command Error** | Prefix must be 2 characters or less in length and must not include `.`");
    }

    if (m.args[1] == "user") {
      checkPrefix(); if (data.prefixes.get(`users.${m.author.id}`) == m.args[2]) return m.channel.send(`**Command Error** | Your prefix is already set to \`${m.args[2]}\`.`);

      if (m.args[2] == config.prefix) {
        data.prefixes.unset(`users.${m.author.id}`);
        data.prefixes.save();

        m.channel.send("Successfully reverted your user prefix to the default.");
      } else {
        data.prefixes.set(`users.${m.author.id}`, m.args[2]);
        data.prefixes.save();

        m.channel.send(`Successfully updated your user prefix to \`${m.args[2]}\`.`);
      }
    } else if (m.args[1] == "server") {
      let authorMember = await m.guild.members.fetch(m.author.id);
      if (!authorMember.hasPermission("MANAGE_SERVER")) return m.channel.send("**User Error** | Missing `MANAGE_SERVER` permission."); checkPrefix();
      if (data.prefixes.get(`servers.${m.guild.id}`) == m.args[2]) return m.channel.send(`**Command Error** | The server's prefix is already set to \`${m.args[2]}\`.`);

      if (m.args[2] == config.prefix) {
        data.prefixes.unset(`servers.${m.guild.id}`);
        data.prefixes.save();

        m.channel.send("Successfully reverted the server's prefix to the default.");
      } else {
        data.prefixes.set(`servers.${m.guild.id}`, m.args[2]);
        data.prefixes.save();

        m.channel.send(`Successfully updated the server's prefix to \`${m.args[2]}\`.`);
      }
    } else {
      let server = data.prefixes.get(`servers.${m.guild.id}`), user = data.prefixes.get(`users.${m.author.id}`);
      m.channel.send(`**Server Prefix**: ${server ? `\`${server}\`` : `\`${config.prefix}\` (Default)`}\n**User Prefix**: ${user ? `\`${user}\`` : `\`${config.prefix}\` (Default)`}`);
    }
  }
}