/**
 * - author: catto
 * - description: A simple ping command :)
 */

const { osiris } = require ("../../api/osiris.js");

console.log(osiris);

function execute(XSessionToken, data, sharedObj) {
  const Channel = data.ChannelId;
  const Message = data.Content;

  const Arguments = osiris.utils.getArgs(Message);

  


  console.log(osiris);
  osiris.sendMessage(XSessionToken, Channel, `${Arguments[1]}`).then((message) => {
    console.log("[REVOLT]: SENT 'PONG'!");
  }).catch((err) => console.log(err))
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
