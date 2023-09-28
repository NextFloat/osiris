/**
 * - author: catto
 * - description: A simple ping command :)
 */

const { osiris } = require ("../../api/osiris.js");


function execute(XSessionToken, data, sharedObj) {
  const Channel = data.ChannelId;
  osiris.embed(XSessionToken, Channel, "", {
    EmbedTitle: "osiris",
    EmbedDescription: `Pong! :ping_pong:`,
    EmbedColour: "#a81808"
}).then((msg) => console.log("[REVOLT]: SENT")).catch((err) => console.log(err));
}

module.exports = {
  name: "ping",
  description: "Simple ping command for testing purposes :)",
  native: true,
  category: "fun",
  usage: "ping",
  arguments: [],
  execute,
};
