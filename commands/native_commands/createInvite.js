/**
 * - author: g0dswisdom
 * - description: A command that creates an invite for the channel/server you're in
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;

    osiris.createInvite(XSessionToken, Channel).then((msg) => {
        console.log("[REVOLT]: CREATED INVITE!")
    }).catch((err) => console.log(err));
}

module.exports = {
    name: "createinvite",
    description: "Creates an invite for the channel/server you're in",
    native: true,
    category: "text",
    usage: "createinvite",
    execute,
}