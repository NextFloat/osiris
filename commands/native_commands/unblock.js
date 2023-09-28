/**
 * - author: g0dswisdom
 * - description: A command that blocks an user (uses Id)
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = osiris.utils.getArgs(Content);
    const Id = Args[1];

    osiris.unblock(XSessionToken, Id).then((resp) => {
        console.log('[REVOLT]: UNBLOCKED USER')
        osiris.embed(XSessionToken, Channel, "", {
            EmbedTitle: "osiris",
            EmbedDescription: "unblocked user!",
            EmbedColour: "#a81808",
        }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
}

module.exports = {
    name: "unblock",
    description: "Unblocks an user. Uses ID",
    native: true,
    category: "text",
    usage: "unblock",
    arguments: [
        {
            name: "id",
            type: "STRING",
        },
    ],
    execute,
}   