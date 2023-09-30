const { osiris } = require ("../../api/osiris.js");
function execute(XSessionToken, data, sharedObj) {
  const Channel = data.ChannelId;

  const Quotes = [
    "Rip and tear, until it is done.",
    "You are but one man - they are no longer your people to save!",
    "The only thing they fear... is you.",
    "Welcome home, great Slayer.",
  ];

  osiris.embed(XSessionToken, Channel, "", {
    EmbedTitle: "osiris | doom quote",
    EmbedDescription: `${Quotes[Math.floor(Math.random() * Quotes.length)]}`,
    EmbedColour: "#a81808"
  }).then((msg) => console.log("[REVOLT]: SENT")).catch((err) => console.log(err));
  
} 
/** 
  osiris.sendMessage(
    XSessionToken,
    Channel,
    `[REVOLT]: ${Quotes[Math.floor(Math.random() * Quotes.length)]}`,
  ).then((message) => {
    console.log("[REVOLT]: SENT!");
  });
}*/

module.exports = {
  name: "doomquote",
  description: "Get a random quote from the Doom Slayer! 😎",
  native: true,
  category: "text",
  usage: "doomquote",
  arguments: [],
  execute,
};
