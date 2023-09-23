/**
 * - author: g0dswisdom
 * - description: A command that creates a server
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Args = osiris.utils.getArgs(Content);
    const ServerName = Args[1];
    const ServerDescription = Args[2];
    try {
        osiris.createServer(XSessionToken, ServerName, ServerDescription, false).catch((err) => console.log(err));
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    name: "createserver",
    description: "Creates a server",
    native: true,
    category: "text",
    usage: "createserver",
    arguments: [
        {
            name: "name",
            type: "STRING",
        },
        {
            name: "description",
            type: "STRING"
        }
    ],
    execute,
}