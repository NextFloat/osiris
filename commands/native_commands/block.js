/**
 * - author: g0dswisdom
 * - description: A command that blocks an user (usesId)
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = osiris.utils.getArgs(Content);
    const Id = Args[1];

    osiris.block(XSessionToken, Id).then((resp) => {
        console.log('[REVOLT]: BLOCKED USER')
        osiris.embed(XSessionToken, Channel, "", {
            EmbedTitle: "osiris",
            EmbedDescription: "blocked user!",
            EmbedColour: "#a81808",
        }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
}

module.exports = {
    name: "block",
    description: "Blocks an user. Uses ID",
    native: true,
    category: "text",
    usage: "block",
    arguments: [
        {
            name: "id",
            type: "STRING",
        },
    ],
    execute,
}   