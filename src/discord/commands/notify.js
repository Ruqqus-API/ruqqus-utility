const data = require("../data.js");

module.exports = {
  name: "notify",
  description: "Toggles the guild post notifier for your user.",
  usage: "notify (<guild>)",
  async execute(m, client, ruqqus) {
    if (!m.args[1]) return m.channel.send("**Command Error** | No guild provided.");

    let guild = await ruqqus.guilds.fetch(m.args[1]);
    if (!guild.id) return m.channel.send("**Command Error** | Invalid guild.");

    if (data.notifyUsers.get(`${m.args[1].toLowerCase()}.${m.author.id}`)) {
      data.notifyUsers.unset(`${m.args[1].toLowerCase()}.${m.author.id}`);
      data.notifyUsers.save();

      return m.channel.send(`Successfully removed notifier from the database. You will no longer receive DMs of posts from **+${guild.name}**.`);
    }

    data.notifyUsers.set(`${m.args[1].toLowerCase()}.${m.author.id}`, true);
    data.notifyUsers.save();

    m.channel.send(`Successfully added notifier to the database. You will now receive DMs of posts from **+${guild.name}**.`);
  }
}