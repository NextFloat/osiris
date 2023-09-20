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
  description: "Ping!",
  execute,
};
