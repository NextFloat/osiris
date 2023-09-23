/**
 * - author: g0dswisdom
 * - description: A command that kicks the user
 */

const { SendMessage } = require("../../api/sendMessage.js");
const { getArgs } = require("../../api/extra/getArgs.js");
const { CreateRole } = require("../../api/createRole.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Server = data?.ServerId;
    const Args = getArgs(Content);
    const RoleName = Args[1];

    if (!RoleName) {
        return SendMessage(XSessionToken, Channel, "[REVOLT]: No name given!")
    }
    
    CreateRole(XSessionToken, Server, RoleName, Channel).catch((err) => { // we're including channel so the sendmessage func works.. not actually needed
        return console.log(err); // we need to catch too
    })
}

module.exports = {
    name: "createrole",
    description: "Creates a role with the given name",
    native: true,
    category: "admin",
    usage: "createrole",
    arguments: [
        {
            name: "name",
            type: "STRING"
        }
    ],  
    execute,
}