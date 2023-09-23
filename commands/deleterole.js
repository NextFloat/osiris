/**
 * - author: g0dswisdom
 * - description: A command that deletes a role
 */

const { SendMessage } = require("../api/sendMessage.js");
const { getArgs } = require("../api/extra/getArgs.js");
const { DeleteRole } = require("../api/deleteRole.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Server = data?.ServerId;
    const Args = getArgs(Content);
    const RoleId = Args[1];

    if (!RoleId) {
        return SendMessage(XSessionToken, Channel, "[REVOLT]: No id given!")
    }
    
    DeleteRole(XSessionToken, Server, RoleId, Channel).catch((err) => { // we're including channel so the sendmessage func works.. not actually needed
        return console.log(err); // we need to catch too
    })
}

module.exports = {
    name: "deleterole",
    description: "Deletes a role with the id of it",
    native: true,
    category: "admin",
    usage: "deleterole",
    arguments: [
        {
            name: "id",
            type: "STRING"
        }
    ],  
    execute,
}