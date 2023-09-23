/**
 * - author: catto
 * - description: A simple ping command :)
 */

const { osirisAPI } = require ("../../api/osirisAPI.js");

console.log(osirisAPI);

function execute(XSessionToken, data, sharedObj) {
  const Channel = data.ChannelId;
  const Message = data.Content;

  const Arguments = Message.split(" ");


  console.log(osirisAPI);
  osirisAPI.sendMessage(XSessionToken, Channel, `${Arguments[1]}`).then((message) => {
    console.log("[REVOLT]: SENT 'PONG'!");
  });
}

module.exports = {
  name: "echo",
  description: "Sends the same message back to the channel.",
  native: true,
  category: "text",
  usage: "echo",
  arguments: [
    {
      name: "message",
      type: "string",
    },
  ],
  execute,
};
