/**
 * - author: g0dswisdom
 * - description: A command that makes you leave a server
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = osiris.getArgs(Content);
    const ServerId = Args[1];
    try {
        osiris.leaveServer(XSessionToken, ServerId).catch((err) => console.log(err));
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    name: "leaveserver",
    description: "Leaves/deletes (if you're an owner) a server",
    native: true,
    category: "text",
    usage: "leaveserver",
    arguments: [
        {
            name: "id",
            type: "STRING",
        },
    ],
    execute,
}