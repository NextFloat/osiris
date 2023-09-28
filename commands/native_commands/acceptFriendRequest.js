/**
 * - author: g0dswisdom
 * - description: A command that accepts a friend request (uses Id)
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = osiris.utils.getArgs(Content);
    const Id = Args[1];

    osiris.acceptFriendRequest(XSessionToken, Id).then((resp) => {
        console.log('[REVOLT]: ACCEPTED FRIEND REQUEST')
        osiris.embed(XSessionToken, Channel, "", {
            EmbedTitle: "osiris",
            EmbedDescription: "accepted friend request!",
            EmbedColour: "#a81808",
        }).catch((err) => console.log(err))
    }).catch((err) => console.log(err));
}

module.exports = {
    name: "acceptfriend",
    description: "Accepts a friend request. Uses ID",
    native: true,
    category: "text",
    usage: "acceptfriend",
    arguments: [
        {
            name: "id",
            type: "STRING",
        },
    ],
    execute,
}   