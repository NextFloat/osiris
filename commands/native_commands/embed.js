/**
 * - author: g0dswisdom
 * - description: A command that tests the Embed API
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    osiris.embed(XSessionToken, Channel, "", {
        "EmbedTitle": "osiris",
        "EmbedDescription": "thank you for using osiris :D",
        "EmbedColour": "#a81808",
        "Url": "https://github.com/DisECtRy/osiris",
    }).then((msg) => {
        console.log(`[REVOLT]: SENT!`)
    }).catch((err) => console.log(err));

    //osiris.embed(XSessionToken, Channel, "", "osiris", "thank you for using osiris :D", "#a81808").then((msg) => {
      //  console.log("[REVOLT]: SENT EMBED!")
   // })
}

module.exports = {
    name: "embed",
    description: "Sends an embed",
    native: true,
    category: "text",
    usage: "embed",
    arguments: [],
    execute,
}