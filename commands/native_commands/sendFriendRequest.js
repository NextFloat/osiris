/**
 * - author: g0dswisdom
 * - description: A command that sends a friend request to an user
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = osiris.utils.getArgs(Content);
    const Username = Args[1];

    osiris.sendFriendRequest(XSessionToken, Username).then((resp) => {
        console.log(`[REVOLT]: SENT FRIEND REQUEST TO ${Username}`);
    }).then((resp) => {
        osiris.embed(XSessionToken, Channel, "", {
            EmbedTitle: "osiris",
            EmbedDescription: "sent friend request!",
            EmbedColour: "#a81808",
        }).catch((err) => console.log(err))
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = {
    name: "friend",
    description: "Sends a friend request to an user. Username and discriminator combo separated by #",
    native: true,
    category: "text",
    usage: "friend",
    arguments: [
        {
            name: "username",
            type: "STRING",
        },
    ],
    execute,
}   