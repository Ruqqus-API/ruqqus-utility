const data = require("../data.js");

module.exports = {
  name: "log",
  usage: "`;log (<guildName>)`",
  description: "Toggles the guild post logger in a channel.",
  async execute(m, client, ruqqus) {
    if (!m.args[1]) return m.channel.send("**Command Error** | No guild provided.");

    let guild = await ruqqus.guilds.fetch(m.args[1]);
    if (!guild.id) return m.channel.send("**Command Error** | Invalid guild.");

    if (data.logChannels.get(`${m.args[1].toLowerCase()}.${m.channel.id}`)) {
      let webhook = await client.fetchWebhook(data.logChannels.get(`${m.args[1].toLowerCase()}.${m.channel.id}`));
      return webhook.delete().then(resp => {
        data.logChannels.unset(`${m.args[1].toLowerCase()}.${m.channel.id}`);
        data.logChannels.save();
  
        return m.channel.send(`Successfully deleted and removed webhook from the database. This channel will no longer track **+${guild.name}**.`);
      })
    }

    let member = await m.guild.members.fetch(client.user.id);
    if (!member.hasPermission("MANAGE_WEBHOOKS")) return m.channel.send("**Client Error** | Missing `MANAGE_WEBHOOKS` permission.");

    try {
      m.channel.createWebhook(`UtilityLogger/${guild.name}/${m.channel.name}`, {
        avatar: "https://media.discordapp.net/attachments/789275560706572298/789325967713239060/utility.png?width=723&height=779"
      }).then(w => {
        data.logChannels.set(`${m.args[1].toLowerCase()}.${m.channel.id}`, w.id);
        data.logChannels.save();

        m.channel.send(`Successfully created and added webhook to the database. This channel will now track **+${guild.name}**.`);
      });
    } catch (e) {
      m.channel.send("**Client Error** | Missing `MANAGE_WEBHOOKS` permission.");
    }
  }
}