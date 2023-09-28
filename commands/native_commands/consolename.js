/**
 * - author: g0dswisdom
 * - description: A command that changes the console's title
 */

const { osiris } = require ("../../api/osiris.js");
const nodeBashTitle = require("node-bash-title");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    var Args = osiris.utils.getArgs(Content);
    if (Args[1]) {
        nodeBashTitle(Args[1]);
        osiris.embed(XSessionToken, Channel, "", {
            EmbedTitle: "osiris",
            EmbedDescription: `changed console name to ${Args[1]}`,
            EmbedColour: "#a81808"
        }).then((msg) => console.log("[REVOLT]: SENT")).catch((err) => console.log(err));
    } else {
        osiris.embed(XSessionToken, Channel, "", {
            EmbedTitle: "osiris",
            EmbedDescription: `no first argument :(`,
            EmbedColour: "#a81808"
        }).then((msg) => console.log("[REVOLT]: SENT")).catch((err) => console.log(err));
    }
    //(XSessionToken, Channel, )
}

module.exports = {
    name: "consolename",
    description: "Changes the name of the console",
    native: true,
    category: "text",
    usage: "consolename",
    arguments: [
        {
            name: "name",
            type: "STRING"
        }
    ],  
    execute,
}