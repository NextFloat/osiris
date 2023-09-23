/**
 * - author: g0dswisdom
 * - description: A command that changes the console's title
 */

const { SendMessage } = require("../../api/sendMessage.js");
const { getArgs } = require("../../api/extra/getArgs.js");
const nodeBashTitle = require("node-bash-title");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    var Args = getArgs(Content);
    if (Args[1]) {
        nodeBashTitle(Args[1]);
        SendMessage(XSessionToken, Channel, `Changed console name to ${Args[1]}`).then((message) => {
            console.log("[REVOLT]: SENT!");
        })
    } else {
        SendMessage(XSessionToken, Channel, "No argument for title").then((message) => {
            console.log("[REVOLT]: SENT!");
        })
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