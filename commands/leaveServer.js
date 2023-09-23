/**
 * - author: g0dswisdom
 * - description: A command that makes you leave a server
 */

const { LeaveServer } = require("../api/leaveServer.js");
const { getArgs } = require("../api/extra/getArgs.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = getArgs(Content);
    const ServerId = Args[1];
    try {
        LeaveServer(XSessionToken, ServerId).catch((err) => console.log(err));
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