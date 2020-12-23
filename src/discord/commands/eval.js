const Discord = require("discord.js");
const data = require("../data.js");

module.exports = {
  name: "eval",
  description: "Evaluates an input.",
  usage: "eval <input>",
  admin: true,
  execute(m, client, ruqqus) {
    if (m.author.id != "421783398374440961") return;

    let result;
    let color = 65280;

    try {
      result = eval(m.input);
    } catch (e) {
      result = e;
      color = 16711680;
    }

    let embed = new Discord.MessageEmbed()
      .setColor(color)
      .addFields(
        { name: "Input 📥", value: `\`\`\`js\n${m.input}\n\`\`\`` },
        { name: "Output 📤", value: `\`\`\`js\n${result}\n\`\`\`` }
      )
      .setTimestamp()
      .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL());

    m.channel.send(embed);
    m.channel.stopTyping();
  }
}