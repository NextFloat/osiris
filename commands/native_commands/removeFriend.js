/**
 * - author: g0dswisdom
 * - description: A command that removes a friend using ID
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = osiris.utils.getArgs(Content);
    const Id = Args[1];

    osiris.removeFriend(XSessionToken, Id).then((resp) => {
        console.log('[REVOLT]: REMOVED FRIEND');
        osiris.embed(XSessionToken, Channel, "", {
            EmbedTitle: "osiris",
            EmbedDescription: "removed friend!",
            EmbedColour: "#a81808",
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err))
}

module.exports = {
    name: "removefriend",
    description: "Removes a friend. Uses ID",
    native: true,
    category: "text",
    usage: "removefriend",
    arguments: [
        {
            name: "id",
            type: "STRING",
        },
    ],
    execute,
}   