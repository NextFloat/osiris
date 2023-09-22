/**
 * - author: catto
 * - description: A simple ping command :)
 */

const { SendMessage } = require("../api/sendMessage.js");

console.log(SendMessage);
function execute(XSessionToken, data, sharedObj) {
  const Channel = data.ChannelId;
  SendMessage(XSessionToken, Channel, `pong!`).then((message) => {
    console.log("[REVOLT]: SENT 'PONG'!");
  });
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
