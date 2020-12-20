module.exports = {
  name: "ping",
  usage: "ping",
  description: "Returns the client's websocket ping.",
  execute(m, client) {
    m.channel.send(`**Client Ping**: \`${client.ws.ping}\`ms`);
  }
}