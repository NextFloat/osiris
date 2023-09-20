const { SendMessage } = require("../api/sendMessage.js");
function execute(XSessionToken, data, sharedObj) {
  const Channel = data.ChannelId;

  const Quotes = [
    "Rip and tear, until it is done.",
    "You are but one man - they are no longer your people to save!",
    "The only thing they fear... is you.",
    "Welcome home, great Slayer.",
  ];

  SendMessage(
    XSessionToken,
    Channel,
    `[REVOLT]: ${Quotes[Math.floor(Math.random() * Quotes.length)]}`,
  ).then((message) => {
    console.log("[REVOLT]: SENT!");
  });
}

module.exports = {
  name: "doomquote",
  description: "Get a random quote from the Doom Slayer! 😎",
  native: true,
  category: "text",
  usage: "doomquote",
  arguments: [],
  execute,
};
